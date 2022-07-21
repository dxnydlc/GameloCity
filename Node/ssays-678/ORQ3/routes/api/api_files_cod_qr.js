// api_files_cod_qr.js

const router = require('express').Router();

const sizeOf = require('image-size');
const { sizeof } = require("file-sizeof");
const fileUrl = require('file-url');
// Multer
const multer  = require('multer')
// var uploadCarpeta = multer({ dest: 'adjuntos/perfil/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'adjuntos/archivo_cod_qr/')
  },
  filename: function (req, file, cb) {
    var $ext = file.mimetype;
    var _fileC = file.originalname;
    var ext = _fileC.substr(_fileC.lastIndexOf('.') + 1);
   
    var arExt = $ext.split('/');
   // cb(null, 'ARCHIVO_COD_QR_'+Date.now() + '.'+arExt[1] ) //Appending .jpg
    cb(null, 'ARCHIVO_COD_QR_'+Date.now() + '.'+ext ) // arExt[1] Appending .jpg
  }
});
var uploadCarpeta = multer({ storage: storage })

var path = require('path');
const express = require('express');
const app = express();

const fs = require('fs');
const resizeImg = require('resize-img');

//const URL_NODE = process.env.URL_NODE;
const RUTA_APP = process.env.RUTA_PROYECTO;
const URL_NODE = process.env.URL_NODE;
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, RUTA_APP+'/adjuntos/archivo_cod_qr/' )
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var busboy = require('connect-busboy');

//const upload = multer({ dest: RUTA_APP+'/adjuntos/perfil/' });
var upload = multer({ storage: storage });

// >>>>>>>>>>>>> ------    MOMENT      ------ >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');

const { User , archiGoogleModel, envioBoletaDetModel } = require('../../db');


////////////////////////////////////////////////////////////////////////
//                archivo para formulario cod Qr                //
////////////////////////////////////////////////////////////////////////
router.post('/archivo', uploadCarpeta.single('formData'), async (req, res) => {
    
    var $response = {},$ArchiOrigin = req.file.originalname,$ArchivoFinal = req.file.filename;
    var $userData = await getUserData( req.body['api_token'] );
    
    var $arFile = $ArchiOrigin.split('.');
    var $extension = $arFile[ $arFile.length - 1 ];
    $extension = $extension.toLowerCase();
    $response.extension = $extension;
    
    $response.estado = 'ERROR';
    $response.data = [];
    $response.adjuntos = [];
    $response.ItemAgregado = [];
    var $dataInsert         = {};
    $dataInsert.uu_id       = renovarToken();
    $dataInsert.token       = req.body.token;
    $dataInsert.correlativo = req.body.id;
    var $uuid128 = renovarToken();
  
    var $RutaFile = RUTA_APP+'adjuntos/archivo_cod_qr/';
    var $Url = URL_NODE+'/adjuntos/archivo_cod_qr/';
    //console.log('>>>>>>>>>'+$RutaFile);
    
  //var dimensions = sizeOf($RutaFile+$ArchivoFinal);
    var si = sizeof.SI($RutaFile+$ArchivoFinal);
    
    $dataInsert.id_usuario = $userData.id;
    $dataInsert.usuario = $userData.name;
    $dataInsert.formulario      = 'CODIGO_QR';
    $dataInsert.nombre_archivo  = $ArchiOrigin;
    $dataInsert.nombre_fisico   = $ArchivoFinal;
    $dataInsert.ruta_fisica     = `${$RutaFile}${$ArchivoFinal}`;
    $dataInsert.extension       = $extension;
    $dataInsert.url             = $Url+$ArchivoFinal;

    if($extension == 'xlsx' || $extension == 'xls'){
      $dataInsert.tipo_documento  = 'Excel';
    }

    if($extension == 'jpg' || $extension == 'png' || $extension == 'jpeg'){
      $dataInsert.tipo_documento  = 'Imagen';
    }

    if($extension == 'doc' || $extension == 'docx'){
      $dataInsert.tipo_documento  = 'Word';
    }

    if($extension == 'pdf'){
      $dataInsert.tipo_documento  = 'Pdf';
    }

    $dataInsert.size = si.MB;

    var $file128 = 'ARCHIVO_'+$uuid128+'_.'+$extension;
    $dataInsert.url_400 = $file128;
    //$dataInsert.url_400 = `${$RutaFile}${$file128}`;

    await archiGoogleModel.create( $dataInsert );
     
    $response.adjuntos = await archiGoogleModel.findOne({
      where : {
        id_usuario : $dataInsert.id_usuario,
        nombre_fisico : $dataInsert.nombre_fisico
        
      }
  });
  
    res.json( $response );
});

// -------------------------------------------------------
////////////////////////////////////////////////////
//     VER UN ARCHIVO        //
////////////////////////////////////////////////////
router.get('/ver/:uuIdFile/:nombre',async(req,res)=>{
	var $response = {};
  $response.estado = 'ERROR';
  const $data = await archiGoogleModel.findOne({
    where : {
      uu_id : req.params.uuIdFile
    }
  });
  
  if( $data ){
    $response.url = fileUrl('.'+$data.ruta_fisica);
  }

  express.static(__dirname + '/public');

  //res.json( {success : __dirname } );
  
  res.sendFile( $data.ruta_fisica );
});

// ====================================================================

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/pdf/:uuIdFile',async(req,res)=>{
  var $response = {};
  $response.estado = 'ERROR';

  var _Det = await envioBoletaDetModel.findOne({
      where : {
          uu_id : req.params.uuIdFile
      }
  });
  
  // 74634302
  if( _Det ){
      // IdArchivo
      const $data = await archiGoogleModel.findOne({
          where : {
            id : _Det.IdArchivo
          }
      });
      if( $data ){
          $response.url = fileUrl('.'+$data.ruta_fisica+$data.nombre_fisico);
      }else{
        res.json( ['Archivo no existe '+_Det.IdArchivo ] );
      }

      express.static(__dirname + '/public');
      
      res.sendFile( $data.ruta_fisica );
  }
});
// // ------------------------------------------------------


// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/show/:uuIdFile',async(req,res)=>{
	var $response = {};
  $response.estado = 'ERROR';
  var _dataFile = [];

  var _detBoleta = await envioBoletaDetModel.findOne({
    where : {
      uu_id : req.params.uuIdFile
    }
  });

  if( _detBoleta ){
    const _data = await archiGoogleModel.findOne({
      where : {
        id : _detBoleta.IdArchivo
      }
    });

    console.log(`>>>>>>>>>>${req.params.uuIdFile}`);
    console.log(`>>>>>>>>>>${_data}`);

    if( _data ){
      _dataFile = _data.ruta_fisica;
      $response.url = fileUrl('.'+_data.ruta_fisica+_data.nombre_fisico);
    }
  }

  express.static(__dirname + '/public');

  res.sendFile( _dataFile );
});
// // ------------------------------------------------------
 function populate_adj_codigos_qr( $rs )
  {
    
    $resturnData = [];
    
              $html = '<div class=" col-lg-1 col-sm-2 col-md-3 col-xs-6 " id="WrapperAdjunto_' + $rs.id + '" >';
              
              if($rs.extension == 'jpg' || $rs.extension == 'jpeg' || $rs.extension == 'png'){
                  $html += '<a href="' + $rs.url +'"  data-fancybox="gallery" target="_blank" ><img class="img-responsive" src="'+$rs.url_400+'"></a>';
              }
              if($rs.extension == 'doc' || $rs.extension == 'docx'){
                  $html += '<a href="' + $rs.url +'"  data-fancybox="gallery" target="_blank" ><img class="img-responsive" src="http://localhost:1809/assets/img/doc.jpg"></a>';
              }

              if($rs.extension == 'xls' || $rs.extension == 'xlsx'){
                  $html += '<a href="' + $rs.url +'"  data-fancybox="gallery" target="_blank" ><img class="img-responsive" src="http://localhost:1809/assets/img/excel.jpg"></a>';
              }

              if($rs.extension == 'pdf'){
                  $html += '<a href="' + $rs.url +'"  data-fancybox="gallery" target="_blank" ><img class="img-responsive" src="http://localhost:1809/assets/img/pdf.jpg"></a>';
              }
              $html += '<a href="#" class=" delImg btn btn-danger btn-block " data-id="' + $rs.id + '" data-uuid="'+$rs.token+'" ><i class="icofont-close-squared-alt"></i></a>';
              
              $resturnData = $html;
          
          
    
 
      return $resturnData;
  }


// ------------------------------------------------------
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
// -------------------------------------------------------
async function getUserData( $token )
{
    var $data;
    $data = await User.findOne({
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular', 'modulo_login'],
        where : {
            api_token : $token
        }
    });
    return $data;
}
// ------------------------------------------------------
// -------------------------------------------------------
async function captueError( error , post )
{
    var _envio       = JSON.stringify(post);
    var _descripcion = JSON.stringify(error);
    var _uuid = await renovarToken();
    await errorLogModel.create({
        uu_id : _uuid,
        modulo : 'api_reqPersonal',
        descripcion : _descripcion,
        envio : _envio
    })
    .catch(function (err) {
        console.log(_NombreDoc);
        console.log(err);
    });
}
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------

module.exports = router;

