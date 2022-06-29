// api_archivos.js ********* CARRITO ***************

const router     = require('express').Router();
const sizeOf     = require('image-size');
const { sizeof } = require("file-sizeof");
const fileUrl    = require('file-url');
// Multer
const multer  = require('multer')
// var uploadCarpeta = multer({ dest: 'adjuntos/perfil/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'adjuntos/archivos/')
  },
  filename: function (req, file, cb) {
    var $ext = file.mimetype;
    var arExt = $ext.split('/');
    cb(null, 'CARRITO_'+Date.now() + '.'+arExt[1] ) //Appending .jpg
  }
});
var uploadCarpeta = multer({ storage: storage })

var path = require('path');
const express = require('express');
const app = express();

const fs = require('fs');
const resizeImg = require('resize-img');

const RUTA_APP = process.env.RUTA_APP;
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, RUTA_APP+'/adjuntos/carrito/' )
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var busboy = require('connect-busboy');

//const upload = multer({ dest: RUTA_APP+'/adjuntos/perfil/' });
var upload = multer({ storage: storage });

const { Film,ArchivosModel,User } = require('../../db');

const jwt = require('jwt-simple');
const moment = require('moment');

// ******************************************************************

////////////////////////////////////////////////////
//              IMAGEN DE CARRITO                 //
////////////////////////////////////////////////////
router.post('/carrito', uploadCarpeta.single('formData'), async (req, res) => {
    // VALIDAR TOKEN DE USUARIO.....
    // ******************************************************
    console.log(req.body);
    if(! req.body.user_token ){
		return res.json({'estado' : 'ERROR',error:'Api token no encontrado'});
	}
	const userToken = req.body.user_token;
	let payload = {};
	try{
		payload = jwt.decode(userToken,'semilla');
	}catch(err){
		return res.json({'estado' : 'ERROR',error:'el token es incorrecto'});
	}
	if( payload.expiredAt < moment().unix() ){
		return res.json({'estado' : 'ERROR',error:'El token ha expirado'});
    }
    // ******************************************************
    // ******************************************************
    var $response       = {},$ArchiOrigin = req.file.originalname,$ArchivoFinal = req.file.filename;
    var $arFile         = $ArchiOrigin.split('.');
    var $extension      = $arFile[ $arFile.length - 1 ];
    $extension          = $extension.toLowerCase();
    $response.extension = $extension;
    var $userData = await getUserData( req.body.api_token );
    //
    $response.estado = 'ERROR';
    $response.data = {};
    var $dataInsert = {};
    $dataInsert.uu_id = renovarToken();
    var $uuid128 = renovarToken();
    var $extenValidas = ['jpg','jpeg','png','gif'];
    // correcto...
    var $RutaFile = RUTA_APP+'/adjuntos/carrito/';
    var dimensions = sizeOf($RutaFile+$ArchivoFinal);
    var si = sizeof.SI($RutaFile+$ArchivoFinal);

    $dataInsert.correlativo = req.body.Correlativo;
    $dataInsert.id_empresa  = $userData.id_empresa;
    $dataInsert.empresa     = $userData.empresa;
    $dataInsert.formulario      = 'IMAGEN_CARRITO';
    $dataInsert.nombre_original = $ArchiOrigin;
    $dataInsert.nombre_fisico   = $ArchivoFinal;
    $dataInsert.ruta_fisica     = `${$RutaFile}${$ArchivoFinal}`;
    $dataInsert.extension       = $extension;
    $dataInsert.tipo_archivo    = 'Imagen';
    $dataInsert.peso            = si.MB;
    $dataInsert.alto            = dimensions.height;
    $dataInsert.ancho           = dimensions.width;
    await ArchivosModel.create($dataInsert);
    console.log('Creando archivo original...');
    // imagen 128 x 128
    (async () => {
        var $dataInsert = {};
        $dataInsert.correlativo = req.body.Correlativo;
        $dataInsert.id_empresa  = $userData.id_empresa;
        $dataInsert.empresa     = $userData.empresa;
        $dataInsert.formulario      = 'IMAGEN_CARRITO_128';
        $dataInsert.nombre_original = $ArchiOrigin;
        const image = await resizeImg(fs.readFileSync($RutaFile+$ArchivoFinal), {
            width   : 128,
            height  : 128
        });
        var $file128 = 'CARRITO_128x128_'+$uuid128+'_.'+$extension;
        $dataInsert.nombre_fisico = $file128;
        $dataInsert.ruta_fisica     = `${$RutaFile}${$file128}`;
        $dataInsert.uu_id = $uuid128;
        fs.writeFileSync($RutaFile+$file128, image);
        dimensions = sizeOf($RutaFile+$file128);
        si = sizeof.SI($RutaFile+$file128);
        $dataInsert.peso          = si.MB;
        $dataInsert.alto          = dimensions.height;
        $dataInsert.ancho         = dimensions.width;
        $response.data = await ArchivosModel.create($dataInsert);
        console.log('Creando archivo 128...');
        console.log('>>>>>>>>>>>>>'+$file128);
        //
    })();
    // - //
    $response.original  = $ArchiOrigin;
    $response.uu_id     = $dataInsert.uu_id;
    $response.uu_id128  = $uuid128;
    $response.estado = 'OK';
    res.json( $response );
})

// ========================================================
// ========================================================
// ========================================================


/**/
////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/show/:uuIdFile',async(req,res)=>{
	var $response = {};
  $response.estado = 'ERROR';
  const $data = await ArchivosModel.findOne({
    where : {
      uu_id : req.params.uuIdFile
    }
  });

  if( $data ){
    $response.url = fileUrl('.'+$data.ruta_fisica+$data.nombre_fisico);
  }

  express.static(__dirname + '/public');

  //res.json( {success : __dirname } );
  
  res.sendFile( $data.ruta_fisica );
});
// // ------------------------------------------------------



// // ------------------------------------------------------
// Borrar !!!!
router.post('/carrito/borrar', async (req,res)=>{
	await Film.destroy({
		where : { uu_id : req.body.uuid }
	});
	res.json({success:'se ha borrado la pelicula'});
});

// // ------------------------------------------------------
function renovarToken() {
	var length = 20;
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   result += '-';
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   result += '-';
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
// ------------------------------------------------------
async function getUserData( $token )
{
    var $data;
    $data = await User.findOne({
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular','id_local','nombre_local'],
        where : {
            api_token : $token
        }
    });
    return $data;
}
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------

module.exports = router;