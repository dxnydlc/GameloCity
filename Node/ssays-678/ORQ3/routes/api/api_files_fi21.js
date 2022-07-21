// api_files_fi21.js

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
    cb(null, 'FILE_'+Date.now() + '.'+arExt[1] ) //Appending .jpg
  }
});
var uploadCarpeta = multer({ storage: storage })

var path = require('path');
const express = require('express');
const app = express();

const fs = require('fs');
const resizeImg = require('resize-img');

const RUTA_APP = process.env.RUTA_PROYECTO;
var _RUTA_PROYECTO = process.env.RUTA_PROYECTO;
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

const { User , archiGoogleModel, envioBoletaCabModel , envioBoletaDetModel } = require('../../db');


////////////////////////////////////////////////////////////////////////
//                          CARGAMOS UN ARCHIVO                       //
////////////////////////////////////////////////////////////////////////
router.post('/cargar', uploadCarpeta.single('formData'), async (req, res) => {
    // token, id, filtro
    var $response = {},$ArchiOrigin = req.file.originalname,$ArchivoFinal = req.file.filename;
    var $arFile = $ArchiOrigin.split('.');
    var $extension = $arFile[ $arFile.length - 1 ];
    $extension = $extension.toLowerCase();
    $response.extension = $extension;
    //
    console.log(req.body.Token);
    $response.estado = 'ERROR';
    $response.data = [];
    var $dataInsert         = {};
    $dataInsert.uu_id       = renovarToken();
    $dataInsert.token       = req.body.token;
    $dataInsert.correlativo = req.body.id;
    var $uuid128 = renovarToken();
    
    var $RutaFile = RUTA_APP+'adjuntos/archivos/';
    console.log('>>>>>>>>>'+$RutaFile);
    
    var si = sizeof.SI($RutaFile+$ArchivoFinal);
  
    $dataInsert.formulario      = req.body.filtro;
    $dataInsert.nombre_archivo  = $ArchiOrigin;
    $dataInsert.nombre_fisico   = $ArchivoFinal;
    $dataInsert.ruta_fisica     = `${$RutaFile}${$ArchivoFinal}`;
    $dataInsert.extension       = $extension;
    $dataInsert.tipo_documento  = 'Imagen';
    $dataInsert.size            = si.MB;

    await archiGoogleModel.create( $dataInsert );
    //
    var ItemAgregado = await archiGoogleModel.findAll({
      where : {
        token : req.body.token
      }
    });
    //
    $response.data = ItemAgregado;
    $response.estado = 'OK';
    res.json( $response );
});
// ====================================================================

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/show/:uuIdFile/:nombre',async(req,res)=>{
	var $response = {};
  $response.estado = 'ERROR';
  var _dataFile = [];



    const _data = await archiGoogleModel.findOne({
      where : {
        uu_id : req.params.uuIdFile
      }
    });

    console.log(`>>>>>>>>>>${req.params.uuIdFile}`);
    console.log(`>>>>>>>>>>${_data}`);

    if( _data ){
      _dataFile = _data.ruta_fisica;
      $response.url = fileUrl('.'+_data.ruta_fisica+_data.nombre_fisico);
    }


  express.static(__dirname + '/public');

  res.sendFile( _dataFile );
});
// // ------------------------------------------------------



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
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------


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
// ------------------------------------------------------

////////////////////////////////////////////////////
//           MOSTRAR UN ARCHIVO CERTIFICADO       //
////////////////////////////////////////////////////
router.get('/ver/certificado/:IdCert/:Flag',async(req,res)=>{
  var $response = {};
    $response.estado = 'ERROR';
    var _dataFile = [];

    var _salida = ``;
    var IdCert = req.params.IdCert;

    switch ( req.params.Flag )
    {
      case 'U':
        // Usuario
        _salida = `${_RUTA_PROYECTO}adjuntos/certificados/C-${IdCert}.pdf`;
      break;
      case 'F':
        // Frontal 
        _salida = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${IdCert}.pdf`;
      break;
      //
      case 'P':
        // Frontal 
        _salida = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${IdCert}-P.pdf`;
      break;
        //
      case 'A':
        // HTML Frontal.
        _salida = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${IdCert}.html`;
      break;
      //
      case 'B':
        // HTML posterior.
        _salida = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${IdCert}-P.html`;
      break;
        //
      default:
      break;
    }

    try {
      varDump(`>>>>>>>>>>>>  ${_salida}.`);
      express.static(__dirname + '/public');

      res.sendFile( _salida );
    } catch (error) {
      res.json({ msg : 'Por favor espera unos segundos y vuelve a actualizar esta página.' });
    }

    
});
// ------------------------------------------------------

////////////////////////////////////////////////////
//              MOSTRAR UN REPORTE DE LAP         //
////////////////////////////////////////////////////
router.get('/ver/lap/reporte/:Nro',async(req,res)=>{
  var $response = {};
    $response.estado = 'ERROR';
    var _dataFile = [];

    var _salida = ``;
    var Nro = req.params.Nro;

    _salida = `${_RUTA_PROYECTO}adjuntos/reporte_lap/LAP-Reporte-${Nro}.html`;

    varDump(`>>>>>>>>>>>>  ${_salida}.`);
    express.static(__dirname + '/public');

    res.sendFile( _salida );
});
// ------------------------------------------------------

////////////////////////////////////////////////////
//              MOSTRAR PDF REPORTE DE LAP         //
////////////////////////////////////////////////////
router.get('/lap/reporte/pdf/:Nro',async(req,res)=>{
  var $response = {};
    $response.estado = 'ERROR';
    var _dataFile = [];

    var _salida = ``;
    var Nro = req.params.Nro;

    _salida = `${_RUTA_PROYECTO}adjuntos/reporte_lap/LAP-Reporte-${Nro}.pdf`;

    varDump(`>>>>>>>>>>>>  ${_salida}.`);
    express.static(__dirname + '/public');

    res.sendFile( _salida );
});
// ------------------------------------------------------

////////////////////////////////////////////////////
//                    ASSETS LAP                  //
////////////////////////////////////////////////////
router.get('/lap/asset/:img',async(req,res)=>{
  var $response = {};
    $response.estado = 'ERROR';
    var _dataFile = [];

    var _salida = ``;
    var img = req.params.img;

    _salida = `${_RUTA_PROYECTO}adjuntos/lap_imgs/${img}.png`;

    varDump(`>>>>>>>>>>>>  ${_salida}.`);
    express.static(__dirname + '/public');

    res.sendFile( _salida );
});
// ------------------------------------------------------

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/file/asset/:uuIdFile',async(req,res)=>{
	var $response = {};
  $response.estado = 'ERROR';
  var _dataFile = '';

  const _data = await archiGoogleModel.findOne({
    where : {
      uu_id : req.params.uuIdFile
    }
  });

  console.log(`>>>>>>>>>>${req.params.uuIdFile}`);

  if( _data ){
    _dataFile = _data.ruta_fisica;
    console.log(`>>>>>>>>>>${_data.ruta_fisica}`);
    //
  }


  express.static(__dirname + '/public');
  if(fs.existsSync( _dataFile ))
  {
    res.sendFile( _dataFile );
  }else{
    return res.status(200).json( { 'msg' : 'No existe: '+_dataFile } );
  }
  
});
// ------------------------------------------------------

////////////////////////////////////////////////////
//                    ASSETS PDF LAP                  //
////////////////////////////////////////////////////
router.get('/lap/pdf/:img',async(req,res)=>{
  var $response = {};
    $response.estado = 'ERROR';
    var _dataFile = [];

    var _salida = ``;
    var img = req.params.img;

    _salida = `${_RUTA_PROYECTO}adjuntos/reporte_lap/${img}.png`;

    varDump(`>>>>>>>>>>>>  ${_salida}.`);
    express.static(__dirname + '/public');

    res.sendFile( _salida );
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
// -------------------------------------------------------------
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

