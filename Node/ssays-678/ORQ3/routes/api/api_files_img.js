
// api_files_img.js


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
    var arExt = $ext.split('/');
    // 99999999999999999999999999999999999999999999
    var _uuid = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 30; i++ ) {
        _uuid += characters.charAt(Math.floor(Math.random() * 30));
    }
    // 99999999999999999999999999999999999999999999
    cb(null, 'IMG_'+Date.now()+'_'+_uuid + '.'+arExt[1] )
  }
});
var uploadCarpeta = multer({ storage: storage });


// image-thumbnail
const imageThumbnail = require('image-thumbnail');

// media-thumbnail
const mt = require('media-thumbnail');


var path = require('path');
const express = require('express');
const app = express();

const fs = require('fs');
const resizeImg = require('resize-img');

const RUTA_APP = process.env.RUTA_PROYECTO;
const URL_NODE = process.env.URL_NODE;

var _RUTAIMG_ORIGIN   = `${RUTA_APP}adjuntos/archivos/`;
var _RUTAIMG_COMPRESS = `${RUTA_APP}adjuntos/img_compress/`;

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

// >>>>>>>>>>>>> ------    MOMENT      ------ >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');


const compress_images = require("compress-images");




const { User , archiGoogleModel} = require('../../db');


////////////////////////////////////////////////////////////////////////
//                CARGAR IMAGEN               //
////////////////////////////////////////////////////////////////////////
router.post('/carga', uploadCarpeta.single('formData'), async (req, res) => {
    // Token, Id, Cod01, Cod02, Cod03, Flag
    var $response = {}, $ArchiOrigin = req.file.originalname, $ArchivoFinal = req.file.filename;
    var $arFile = $ArchiOrigin.split('.');
    var $extension = $arFile[ $arFile.length - 1 ];
    $extension = $extension.toLowerCase();
    $response.extension = $extension;
    //
    //console.log(req.body.Token);
    $response.estado   = 'ERROR';
    $response.data     = [];
    var $dataInsert    = {};
    $dataInsert.uu_id  = renovarToken();
    $dataInsert.token  = req.body.Token;
    $dataInsert.Cod001 = req.body.Cod01;
    $dataInsert.Cod002 = req.body.Cod02;
    $dataInsert.Cod003 = req.body.Cod03;
    //
    var $uuid128 = renovarToken();
    var $RutaFile = RUTA_APP+'/adjuntos/archivos/';
    
    var _ruta_fisica = $RutaFile+$ArchivoFinal;
    var _ruta_thumb  = `${$RutaFile}Thumb_${$ArchivoFinal}`;
    var si = sizeof.SI( _ruta_fisica );
  
    $dataInsert.token = req.body.Token;
    $dataInsert.formulario      = req.body.Flag;
    $dataInsert.nombre_archivo  = $ArchiOrigin;
    $dataInsert.nombre_fisico   = $ArchivoFinal;
    // /mnt/disks/html/repos/nodejs/ORQ3/adjuntos/archivos/IMG_GEN_1655747484550_FJcYbUJSEWMUTFDRLPAFVBIEWaFJVC.octet-stream
    $dataInsert.RutaOriginal    = _ruta_fisica;
    $dataInsert.ruta_fisica     = _ruta_fisica;
    $dataInsert.RutaThumbnail   = _ruta_thumb;
    $dataInsert.extension       = $extension;
    $dataInsert.tipo_documento  = 'Imagen';
    $dataInsert.size            = si.MB;
    $dataInsert.url = `${URL_NODE}api/imgs/show/${$dataInsert.uu_id}/${$ArchiOrigin}`;
    $dataInsert.url_original = `${URL_NODE}api/imgs/origin/${$dataInsert.uu_id}/${$ArchiOrigin}`;
    $dataInsert.url_thumb    = `${URL_NODE}api/imgs/thumb/${$dataInsert.uu_id}/${$ArchiOrigin}`;
    $dataInsert.url_compress = `${URL_NODE}api/imgs/compress/${$dataInsert.uu_id}/${$ArchiOrigin}`;

    $response.estado = 'OK';

    try {
      if ( fs.existsSync(_ruta_fisica) )
      {
        await mt.forImage(
          _ruta_fisica , _ruta_thumb , { width  : 400, height : 400, preserveAspectRatio: true } 
        )
        .then( () => console.log('Imagen ThumbNail creada') , err => console.error(err) );
      }
    } catch(err) {
      console.error(err)
    }

  
    var OUTPUT_path = `${_RUTAIMG_COMPRESS}${$ArchivoFinal}`;
    var _Insertado = {};

    if( $extension == 'jpg' )
    {
      await compress_images( _ruta_fisica , OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        async function (error, completed, statistic) {
          console.log(statistic.path_out_new);
          if(! completed.err )
          {
            $dataInsert.ruta_fisica = statistic.path_out_new;
            _Insertado = await archiGoogleModel.create( $dataInsert );
          }
        }
      );
    }else{
      //
      _Insertado = await archiGoogleModel.create( $dataInsert );
      //
    }

    /**
    try {
      const thumbnail = await imageThumbnail( _ruta_fisica );
      console.log(thumbnail);
    } catch (err) {
        console.error(err);
    }
    /**/
    

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

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/show/:uuIdFile/:nombre',async(req,res)=>{
	var $response = {};
  $response.estado = 'ERROR';
  var _dataFile = [];

  var _detBoleta = await archiGoogleModel.findOne({
    where : {
      uu_id : req.params.uuIdFile
    }
  });

  if( _detBoleta ){
    _dataFile = _detBoleta.ruta_fisica;
    $response.url = fileUrl('.'+_detBoleta.ruta_fisica+_detBoleta.nombre_fisico);
  }

  express.static(__dirname + '/public');

  res.sendFile( _dataFile );
});
// ------------------------------------------------------

////////////////////////////////////////////////////
//              MOSTRAR ARCHIVO ORIGINAL          //
////////////////////////////////////////////////////
router.get('/origin/:uuIdFile/:nombre',async(req,res)=>{

  try {
    var $response = {};
    $response.estado = 'ERROR';
    var _dataFile = '';

    var _detBoleta = await archiGoogleModel.findOne({
      where : {
        uu_id : req.params.uuIdFile
      }
    });

    if( _detBoleta ){
      _dataFile = _detBoleta.RutaOriginal;
      $response.url = fileUrl('.'+_detBoleta.ruta_fisica+_detBoleta.nombre_fisico);
    }

    express.static(__dirname + '/public');

    if ( fs.existsSync( _dataFile ) ) {
      res.sendFile( _dataFile );
    }else{
      res.json( $response );
    }

  } catch (error) {
    varDump( error );
    $response.msg = error;
    res.json( $response );
  }
    
});
// ------------------------------------------------------

////////////////////////////////////////////////////
//            MOSTRAR ARCHIVO COMPRIMIDO          //
////////////////////////////////////////////////////
router.get('/compress/:uuIdFile/:nombre',async(req,res)=>{

  try {
    var $response = {};
    $response.estado = 'ERROR';
    var _dataFile = '';

    var _detBoleta = await archiGoogleModel.findOne({
      where : {
        uu_id : req.params.uuIdFile
      }
    });

    if( _detBoleta ){
      _dataFile = _detBoleta.ruta_fisica;
      $response.url = fileUrl('.'+_detBoleta.ruta_fisica+_detBoleta.nombre_fisico);
    }

    express.static(__dirname + '/public');

    if ( fs.existsSync( _dataFile ) ) {
      res.sendFile( _dataFile );
    }else{
      res.json( $response );
    }

  } catch (error) {
    varDump( error );
    $response.msg = error;
    res.json( $response );
  }
    
});
// ------------------------------------------------------

////////////////////////////////////////////////////
//            MOSTRAR ARCHIVO COMPRIMIDO          //
////////////////////////////////////////////////////
router.get('/thumb/:uuIdFile/:nombre',async(req,res)=>{

  try {
    var $response = {};
    $response.estado = 'ERROR';
    var _dataFile = '';

    var _detBoleta = await archiGoogleModel.findOne({
      where : {
        uu_id : req.params.uuIdFile
      }
    });

    if( _detBoleta ){
      _dataFile = _detBoleta.RutaThumbnail;
      $response.url = fileUrl('.'+_detBoleta.RutaThumbnail+_detBoleta.nombre_fisico);
    }

    express.static(__dirname + '/public');

    if ( fs.existsSync( _dataFile ) ) {
      res.sendFile( _dataFile );
    }else{
      res.json( $response );
    }

  } catch (error) {
    varDump( error );
    $response.msg = error;
    res.json( $response );
  }
    
});
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
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
// ------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------

module.exports = router;


