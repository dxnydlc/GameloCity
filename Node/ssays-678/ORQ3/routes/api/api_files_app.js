
// api_files_app.js

const router = require('express').Router();

const sizeOf = require('image-size');
const { sizeof } = require("file-sizeof");
const fileUrl = require('file-url');

// Comprimir imágenes de la APP
const compress_images = require("compress-images");

// media-thumbnail
const mt = require('media-thumbnail');


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
    // 9999999999999999999999
    var _uuid = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 30; i++ ) {
        _uuid += characters.charAt(Math.floor(Math.random() * 30));
    }
    // 9999999999999999999999
    cb(null, 'IMG_GEN_'+Date.now()+'_'+_uuid + '.'+arExt[1] )
  }
});
var uploadCarpeta = multer({ storage: storage })

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

const { User , archiGoogleModel } = require('../../db');

// COntrolador
const helpersController  = require('../../controllers/helpersController');



////////////////////////////////////////////////////////////////////////
//                CARGAR IMAGEN               //
////////////////////////////////////////////////////////////////////////
router.post('/carga', uploadCarpeta.single('formData'), async (req, res) => {
  // Token, IdDoc, Flag
  _respuesta = {};
  _respuesta.codigo = 200;

  _respuesta.url = ``;
  _respuesta.thumb = ``;

  try {
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    var $ArchiOrigin = req.file.originalname, $ArchivoFinal = req.file.filename;
    var $arFile = $ArchiOrigin.split('.');
    var $extension = $arFile[ $arFile.length - 1 ];
    $extension = $extension.toLowerCase();
    
    _respuesta.extension = $extension;
    _respuesta.Origin = $ArchiOrigin;

    var _arFInal = $ArchivoFinal.split('.');
    var $extensionFinal = _arFInal[ _arFInal.length - 1 ];
    $extensionFinal = $extensionFinal.toLowerCase();
    

    var $RutaFile = RUTA_APP+'adjuntos/archivos/';
    var dimensions = sizeOf($RutaFile+$ArchivoFinal);
    var _ruta_fisica = $RutaFile+$ArchivoFinal;
    
    var si = sizeof.SI( _ruta_fisica );

    var $uuid128 = await renovarToken();

    varDump(`########################## SUBIENDO IMAGEN DESDE LA APP #####################`);
    varDump(req.body);
    varDump(`>>>>>>>> ${$extension} / ${$extensionFinal}`);
    varDump(`ArchiOrigin: ${$ArchiOrigin}`);

    // Hacemos una copia a jpg
    var _fileJPG = RUTA_APP+'/adjuntos/archivos/'+$ArchiOrigin;
    var _ruta_thumb  = `${$RutaFile}Thumb_${$ArchiOrigin}`;
    fs.copyFileSync( _ruta_fisica , _fileJPG );
    varDump(`################ ${_ruta_fisica} >>>>>>>> ${_fileJPG}`);

    var $dataInsert = {};
    $dataInsert.uu_id = await renovarToken();
    // TOKEN DEL CLIENTE
    $dataInsert.token = req.body.Token;
    // CODIGO DEL CLIENTE
    $dataInsert.Cod001 = req.body.IdDoc;
    // FLAG DEL CLIENTE
    $dataInsert.formulario      = req.body.Flag;//'CRONOGRAMA_TRABAJO_OLI';


    
    $dataInsert.nombre_archivo  = $ArchiOrigin;
    $dataInsert.RutaOriginal    = _fileJPG;
    $dataInsert.nombre_fisico   = _fileJPG;// $ArchivoFinal;
    $dataInsert.ruta_fisica     = _fileJPG;//`${$RutaFile}${$ArchivoFinal}`;
    $dataInsert.RutaThumbnail   = _ruta_thumb;
    $dataInsert.extension       = $extension;
    $dataInsert.tipo_documento  = 'Imagen';
    $dataInsert.size            = si.MB;

    

    // URL
    $dataInsert.url = `${URL_NODE}api/files_img_generico/ver_img/${$dataInsert.uu_id}/${$ArchiOrigin}`;
    $dataInsert.url_original = `${URL_NODE}api/imgs/origin/${$dataInsert.uu_id}/${$ArchiOrigin}`;
    $dataInsert.url_thumb    = `${URL_NODE}api/imgs/thumb/${$dataInsert.uu_id}/${$ArchiOrigin}`;
    $dataInsert.url_compress = `${URL_NODE}api/imgs/compress/${$dataInsert.uu_id}/${$ArchiOrigin}`;
    _respuesta.url = $dataInsert.url;

    var OUTPUT_path = `${_RUTAIMG_COMPRESS}`;//${$ArchivoFinal}
    varDump(`_ruta_fisica: ${_fileJPG}`);
    varDump(`OUTPUT_path: ${OUTPUT_path}`);
    // Usamos $extensionFinal porque si el archivo es enviado desde la App vendra como octstream Y asy se graba en el disco duro.
    // $extension | $extensionFinal //
    switch ( $extension ) {
      // _ruta_fisica
      case 'jpg':
      case 'jpeg':
        await compress_images( _fileJPG , OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
          { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
          { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
          { svg: { engine: "svgo", command: "--multipass" } },
          { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
          async function (error, completed, statistic) {
            varDump(error);
            console.log(statistic.path_out_new);
            if(! completed.err )
            {
              $dataInsert.ruta_fisica = statistic.path_out_new;
              await archiGoogleModel.create( $dataInsert );
              try {
                if ( fs.existsSync(_fileJPG) )
                {
                  await mt.forImage(
                    _fileJPG , _ruta_thumb , { width  : 400, height : 400, preserveAspectRatio: true } 
                  )
                  .then( () => console.log('Imagen ThumbNail creada') , err => console.error(err) );
                }
              } catch(err) {
                console.error(err)
              }
            }
          }
        );
      break;
      // ******************************
      default:
        await archiGoogleModel.create( $dataInsert );
      break;
    }

    // imagen 128 x 128
    /*(async () => {
        const image = await resizeImg(fs.readFileSync( $RutaFile+$ArchivoFinal ), {
            width   : 128,
            height  : 128
        });
        var $file128    = 'IMG_128x128_'+$uuid128+'_.'+$extension;
        $dataInsert.url_40 = `${$RutaFile}${$file128}`;
        // URL 400X400
        $dataInsert.url_400 = `${URL_NODE}api/files_img_generico/ver_thumb/${$dataInsert.uu_id}/${$ArchiOrigin}`;
        _respuesta.thumb = $dataInsert.url_400;

        fs.writeFileSync($RutaFile+$file128, image);
        dimensions      = sizeOf($RutaFile+$file128);
        si              = sizeof.SI($RutaFile+$file128);
        //
        await archiGoogleModel.create( $dataInsert )
        .catch(function (err) {
            helpersController.varDump( err );
            _respuesta.codigo = 500;
            _respuesta.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        //
    })();*/

    _respuesta.resp = { 'titulo' : `Correcto` , 'clase' : 'success' , 'texto' : 'Archivo cargado.' } ;
    //
} catch (error) {
    varDump(`$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ERROR AL SUBIR IMAGEN A LA APP $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$`);
    varDump( error );
    _respuesta.codigo = 500;
    _respuesta.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
}
//
res.status( _respuesta.codigo ).send( _respuesta );
});
// ====================================================================

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/ver_img/:uuid/:name?',async(req,res)=>{

  _respuesta = {};
  _respuesta.codigo = 200;
  try {
    var $data = await archiGoogleModel.findOne({
        attributes: [ 'ruta_fisica'],
        where : {
            uu_id : req.params.uuid
        }
    });

    varDump( $data.ruta_fisica );
    
    if( $data ){

        res.sendFile( $data.ruta_fisica );

    }else{
        res.status(200).send( {'Error':'Archivo no existe'} );
    }
    //
  } catch (error) {
    _respuesta.codigo = 500;
    _respuesta.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    return res.status(_respuesta.codigo).json( _respuesta );
  }
  //
});
// ====================================================================

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO 400               //
////////////////////////////////////////////////////
router.get('/ver_thumb/:uuid/:name?',async(req,res)=>{

  _respuesta = {};
  _respuesta.codigo = 200;
  try {
    var $data = await archiGoogleModel.findOne({
        attributes: [ 'url_40'],
        where : {
            uu_id : req.params.uuid
        }
    });
    
    if( $data ){
        res.sendFile( $data.url_40 );
    }else{
        res.status(200).send( {'Error':'Archivo no existe'} );
    }
    //
  } catch (error) {
    _respuesta.codigo = 500;
    _respuesta.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    return res.status(_respuesta.codigo).json( _respuesta );
  }
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



// ------------------------------------------------------
function renovarToken() {
	var length = 15;
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
function varDump( _t )
{
    console.log( _t );
}
// ------------------------------------------------------

module.exports = router;

