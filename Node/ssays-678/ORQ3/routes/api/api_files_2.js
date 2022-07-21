// api_files_2

const router = require('express').Router();
const sizeOf = require('image-size');
const { sizeof } = require("file-sizeof");
const fileUrl = require('file-url');
// Multer
const multer  = require('multer')
// var uploadCarpeta = multer({ dest: 'adjuntos/perfil/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'adjuntos/archivos/')
  },
  filename: function (req, file, cb) {
    var $ext = file.mimetype;
    var _fileC = file.originalname;
    var ext = _fileC.substr(_fileC.lastIndexOf('.') + 1);
    
    var arExt = $ext.split('/');
    cb(null, 'AVATAR_ORIGIN_'+Date.now() + '.'+ext ) // arExt[1] Appending .jpg
  }
});
var uploadCarpeta = multer({ storage: storage })

var path = require('path');
const express = require('express');
const app = express();

const fs = require('fs');
const resizeImg = require('resize-img');

const RUTA_APP = process.env.RUTA_PROYECTO;
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, RUTA_APP+'/adjuntos/archivos/' )
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var busboy = require('connect-busboy');

//const upload = multer({ dest: RUTA_APP+'/adjuntos/perfil/' });
var upload = multer({ storage: storage });

const { Film,archiGoogleModel } = require('../../db');

////////////////////////////////////////////////////////////////////////
//                      FOTO DE PERFIL DE USUARIO                     //
////////////////////////////////////////////////////////////////////////

router.post('/photos/upload', uploadCarpeta.single('formData'), async (req, res) => {

  var $response = {},$ArchiOrigin = req.file.originalname,$ArchivoFinal = req.file.filename;
  var $arFile = $ArchiOrigin.split('.');
  var $extension = $arFile[ $arFile.length - 1 ];
  $extension = $extension.toLowerCase();
  $response.extension = $extension;
  //
  
  $response.estado = 'ERROR';
  $response.data = [];
  var $dataInsert = {};
  $dataInsert.uu_id = renovarToken();
  $dataInsert.token = req.body.Token;
  $dataInsert.correlativo = req.body.Id;
  var $uuid128 = renovarToken();
  
  var $extenValidas = ['jpg','jpeg','png','gif'];

  // correcto...
  var $RutaFile = RUTA_APP+'/adjuntos/archivos/';
  var dimensions = sizeOf($RutaFile+$ArchivoFinal);
  var si = sizeof.SI($RutaFile+$ArchivoFinal);

  $dataInsert.formulario      = 'REG_ACCIDENTE_TRABAJO';
  $dataInsert.nombre_archivo  = $ArchiOrigin;
  $dataInsert.nombre_fisico   = $ArchivoFinal;
  $dataInsert.ruta_fisica     = `${$RutaFile}${$ArchivoFinal}`;
  $dataInsert.extension       = $extension;
  $dataInsert.tipo_documento  = 'Imagen';
  $dataInsert.size            = si.MB;
  //$dataInsert.alto          = dimensions.height;
  //$dataInsert.ancho         = dimensions.width;
  
  
  // imagen 128 x 128
  (async () => {
    const image = await resizeImg(fs.readFileSync($RutaFile+$ArchivoFinal), {
        width   : 128,
        height  : 128
    });
    var $file128 = 'ARCHIVO_128x128_'+$uuid128+'_.'+$extension;
    $dataInsert.url_400 = $file128;
    //$dataInsert.uu_id = $uuid128;
    fs.writeFileSync($RutaFile+$file128, image);
    dimensions = sizeOf($RutaFile+$file128);
    si = sizeof.SI($RutaFile+$file128);
    //$dataInsert.size          = si.MB;
    //$dataInsert.alto          = dimensions.height;
    //$dataInsert.ancho         = dimensions.width;
    await archiGoogleModel.create($dataInsert);
    
    //
  })();
  //$response.data = await archiGoogleModel.create( $dataInsert );
  $response.data = await archiGoogleModel.findOne({
    where : {
      token : req.body.Token
    }
  });
  $response.uu_id     = $dataInsert.uu_id;
  $response.uu_id128  = $uuid128;
  $response.estado = 'OK';
  res.json( $response );
});

// ====================================================================

////////////////////////////////////////////////////////////////////////
//                REPORTAR MAQUINA DAÑADA SUPERVISOR OLI              //
////////////////////////////////////////////////////////////////////////
router.post('/maquina_oli', uploadCarpeta.single('formData'), async (req, res) => {

  var $response = {},$ArchiOrigin = req.file.originalname,$ArchivoFinal = req.file.filename;
  var $arFile = $ArchiOrigin.split('.');
  var $extension = $arFile[ $arFile.length - 1 ];
  $extension = $extension.toLowerCase();
  $response.extension = $extension;
  //
  
  $response.estado = 'ERROR';
  $response.data = [];
  var $dataInsert = {};
  $dataInsert.uu_id = renovarToken();
  $dataInsert.token = req.body.Token;
  $dataInsert.correlativo = req.body.Id;
  var $uuid128 = renovarToken();
  
  var $extenValidas = ['jpg','jpeg','png','gif'];

  // correcto...
  var $RutaFile = RUTA_APP+'/adjuntos/archivos/';
  var dimensions = sizeOf($RutaFile+$ArchivoFinal);
  var si = sizeof.SI($RutaFile+$ArchivoFinal);

  $dataInsert.formulario      = req.body.form;
  $dataInsert.nombre_archivo  = $ArchiOrigin;
  $dataInsert.nombre_fisico   = $ArchivoFinal;
  $dataInsert.ruta_fisica     = `${$RutaFile}${$ArchivoFinal}`;
  $dataInsert.extension       = $extension;
  $dataInsert.tipo_documento  = 'Imagen';
  $dataInsert.size            = si.MB;
  //$dataInsert.alto          = dimensions.height;
  //$dataInsert.ancho         = dimensions.width;
  
  
  // imagen 128 x 128
  (async () => {
    const image = await resizeImg(fs.readFileSync($RutaFile+$ArchivoFinal), {
        width   : 128,
        height  : 128
    });
    var $file128 = 'ARCHIVO_128x128_'+$uuid128+'_.'+$extension;
    $dataInsert.url_400 = $file128;
    //$dataInsert.uu_id = $uuid128;
    fs.writeFileSync($RutaFile+$file128, image);
    dimensions = sizeOf($RutaFile+$file128);
    si = sizeof.SI($RutaFile+$file128);
    //$dataInsert.size          = si.MB;
    //$dataInsert.alto          = dimensions.height;
    //$dataInsert.ancho         = dimensions.width;
    await archiGoogleModel.create($dataInsert);
    
    //
  })();
  //$response.data = await archiGoogleModel.create( $dataInsert );
  $response.data = await archiGoogleModel.findOne({
    where : {
      token : req.body.Token
    }
  });
  $response.uu_id     = $dataInsert.uu_id;
  $response.uu_id128  = $uuid128;
  $response.estado = 'OK';
  res.json( $response );
});

////////////////////////////////////////////////////////////////////////
//                BOLETA DE TRABAJADOR DE FORMA MASIVA                //
////////////////////////////////////////////////////////////////////////
router.post('/boleta', uploadCarpeta.single('formData'), async (req, res) => {

  var $response = {},$ArchiOrigin = req.file.originalname,$ArchivoFinal = req.file.filename;
  var $arFile = $ArchiOrigin.split('.');
  var $extension = $arFile[ $arFile.length - 1 ];
  $extension = $extension.toLowerCase();
  $response.extension = $extension;
  //
  
  $response.estado = 'ERROR';
  $response.data = [];
  var $dataInsert = {};
  $dataInsert.uu_id = renovarToken();
  $dataInsert.token = req.body.Token;
  $dataInsert.correlativo = req.body.Id;
  var $uuid128 = renovarToken();
  
  var $extenValidas = ['jpg','jpeg','png','gif'];

  // correcto...
  
  var $RutaFile = RUTA_APP+'adjuntos/boletas/';
  
  var dimensions = sizeOf($RutaFile+$ArchivoFinal);
  var si = sizeof.SI($RutaFile+$ArchivoFinal);

  $dataInsert.formulario      = req.body.form;
  $dataInsert.nombre_archivo  = $ArchiOrigin;
  $dataInsert.nombre_fisico   = $ArchivoFinal;
  $dataInsert.ruta_fisica     = `${$RutaFile}${$ArchivoFinal}`;
  $dataInsert.extension       = $extension;
  $dataInsert.tipo_documento  = 'Imagen';
  $dataInsert.size            = si.MB;
  
  
  // imagen 128 x 128
  
  //$response.data = await archiGoogleModel.create( $dataInsert );
  $response.data = await archiGoogleModel.findOne({
    where : {
      token : req.body.Token
    }
  });
  $response.uu_id     = $dataInsert.uu_id;
  $response.uu_id128  = $uuid128;
  $response.estado = 'OK';
  res.json( $response );
});
// ====================================================================

////////////////////////////////////////////////////////////////////////
//                     CARGA DE OPERARIOS DESDE XLS                   //
////////////////////////////////////////////////////////////////////////
router.post('/xls_opeario', uploadCarpeta.single('formData'), async (req, res) => {

  var $response = {},$ArchiOrigin = req.file.originalname,$ArchivoFinal = req.file.filename;
  var $arFile = $ArchiOrigin.split('.');
  var $extension = $arFile[ $arFile.length - 1 ];
  $extension = $extension.toLowerCase();
  $response.extension = $extension;
  //
  
  $response.estado = 'ERROR';
  $response.data = [];
  var $dataInsert = {};
  $dataInsert.uu_id = renovarToken();
  $dataInsert.token = req.body.Token;
  $dataInsert.correlativo = req.body.Id;
  var $uuid128 = renovarToken();
  

  // correcto...
  
  var $RutaFile = RUTA_APP+'adjuntos/archivos/';
  
  var si = sizeof.SI($RutaFile+$ArchivoFinal);

  $dataInsert.formulario      = req.body.form;
  $dataInsert.nombre_archivo  = $ArchiOrigin;
  $dataInsert.nombre_fisico   = $ArchivoFinal;
  $dataInsert.ruta_fisica     = `${$RutaFile}${$ArchivoFinal}`;
  $dataInsert.extension       = $extension;
  $dataInsert.tipo_documento  = 'Xls';
  $dataInsert.size            = si.MB;
  
  $response.data = await archiGoogleModel.create( $dataInsert );
  $response.data = await archiGoogleModel.findOne({
    where : {
      token : req.body.Token
    },
    order : [
      [ 'id' , 'DESC' ]
    ]
  });
  $response.uu_id     = $dataInsert.uu_id;
  $response.uu_id128  = $uuid128;
  $response.estado = 'OK';
  res.json( $response );
});
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================

/**/
////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/show/:uuIdFile',async(req,res)=>{
	var $response = {};
  $response.estado = 'ERROR';
  const $data = await archiGoogleModel.findOne({
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



// Agregar pelicula
router.post('/', async (req,res)=>{
	const film = await Film.create(req.body);
	res.json(film);
});
// // ------------------------------------------------------
// Actualizar
router.put('/:filmID', async (req,res)=>{
	await Film.update(req.body,{
		where : {id:req.params.filmID}
	});
	res.json({success:'se ha modificado'});
});
// // ------------------------------------------------------
// Borrar !!!!
router.delete('/:filmID', async (req,res)=>{
	await Film.destroy({
		where : {id:req.params.filmID}
	});
	res.json({success:'se ha borrado la pelicula'});
});

// // ------------------------------------------------------
function renovarToken() {
	var length = 30;
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
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------

module.exports = router;