// api_files_Contratos.js

const router = require('express').Router();

const sizeOf = require('image-size');
const { sizeof } = require("file-sizeof");
const fileUrl = require('file-url');
// Multer
const multer  = require('multer')
// var uploadCarpeta = multer({ dest: 'adjuntos/perfil/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'adjuntos/contratos/')
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
    cb(null, 'CONTRATO_SSAYS_'+Date.now()+'_'+_uuid + '.'+arExt[1] )
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
    cb(null, RUTA_APP+'/adjuntos/contratos/' )
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

const { User , archiGoogleModel, envioContratosCabModel , envioContratosDetModel } = require('../../db');


////////////////////////////////////////////////////////////////////////
//                BOLETA DE TRABAJADOR DE FORMA MASIVA                //
////////////////////////////////////////////////////////////////////////
router.post('/carga', uploadCarpeta.single('formData'), async (req, res) => {

    var $response = {},$ArchiOrigin = req.file.originalname, $ArchivoFinal = req.file.filename;
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
    
    var $RutaFile = RUTA_APP+'adjuntos/contratos/';
    console.log('>>>>>>>>>'+$RutaFile);
    
    var si = sizeof.SI($RutaFile+$ArchivoFinal);
  
    $dataInsert.formulario      = 'CONTRATO_MASIVO';
    $dataInsert.nombre_archivo  = $ArchiOrigin;
    $dataInsert.nombre_fisico   = $ArchivoFinal;
    $dataInsert.ruta_fisica     = `${$RutaFile}${$ArchivoFinal}`;
    $dataInsert.extension       = $extension;
    $dataInsert.tipo_documento  = 'Imagen';
    $dataInsert.size            = si.MB;
    
    await archiGoogleModel.create( $dataInsert );
    var ItemAgregado = await archiGoogleModel.findOne({
      where : {
        uu_id : $dataInsert.uu_id
      }
    });
    // Ahora insertamos el usuario
    var _ArchivoPDF = ItemAgregado.nombre_archivo;
    var _arFile = _ArchivoPDF.split('.'), _DNI = _arFile[0];
    console.log(`DNI => ${_DNI}`);
    // -- //
    var dataUsuario = await User.findOne({
      where : {
        dni : _DNI
      }
    });
    // -- //
    var _insertDetalle = {};
    _insertDetalle.DNI = _DNI;
    if( dataUsuario ){
      _insertDetalle.Nombre  = dataUsuario.name;
      _insertDetalle.Email   = dataUsuario.emailalternativo;
      _insertDetalle.Celular = dataUsuario.celular;
    }else{
      _insertDetalle.Nombre = 'Usuario no existe';
      _insertDetalle.Estado = 'NO-EXISTE';
    }
    _insertDetalle.CodigoEnvio = req.body.codigo;
    _insertDetalle.uu_id       = renovarToken();
    _insertDetalle.Token       = req.body.token;
    _insertDetalle.IdArchivo   = ItemAgregado.id;
    _insertDetalle.Archivo     = ItemAgregado.nombre_archivo;
    await envioContratosDetModel.create( _insertDetalle );
    

    
    
    //$response.data = await archiGoogleModel.create( $dataInsert );
    
    $response.uu_id     = $dataInsert.uu_id;
    $response.uu_id128  = $uuid128;
    $response.estado = 'OK';
    res.json( $response );
});
// ====================================================================

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/pdf/:uuIdFile',async(req,res)=>{
  var $response = {};
  $response.estado = 'ERROR';

  var _Det = await envioContratosDetModel.findOne({
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

  var _detBoleta = await envioContratosDetModel.findOne({
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

module.exports = router;

