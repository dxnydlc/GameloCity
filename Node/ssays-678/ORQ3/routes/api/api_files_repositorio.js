
// api_files_repositorio.js
var _NombreDoc = 'api_files_repositorio';

const router = require('express').Router();

const sizeOf = require('image-size');
const { sizeof } = require("file-sizeof");
const fileUrl = require('file-url');
// Multer
const multer  = require('multer')
// var uploadCarpeta = multer({ dest: 'adjuntos/perfil/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'adjuntos/repo/')
  },
  filename: function (req, file, cb) {
    var $ext = file.mimetype, $ArchiOrigin = file.originalname;
    var arExt = $ext.split('/');
    console.log('arExt');
    console.log(arExt);
    console.log(file);
    var $arFile = $ArchiOrigin.split('.');
    var _extension = $arFile[ $arFile.length - 1 ];
    cb(null, 'FILE_REPO_SSAYS_'+Date.now() + '.'+_extension ) //Appending .jpg
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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, RUTA_APP+'/adjuntos/repo/' )
  },
  filename: function (req, file, cb) {
    var $ext = file.mimetype;
    var arExt = $ext.split('/');
    console.log('arExt');
    console.log(arExt);
    // 9999999999999999999999
    var _uuid = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 30; i++ ) {
        _uuid += characters.charAt(Math.floor(Math.random() * 30));
    }
    // 9999999999999999999999
    cb(null, 'REPO_SSAYS_'+Date.now()+'_'+_uuid + '.'+arExt[1] )
  }
});
var busboy = require('connect-busboy');

//const upload = multer({ dest: RUTA_APP+'/adjuntos/perfil/' });
var upload = multer({ storage: storage });

// >>>>>>>>>>>>> ------    MOMENT      ------ >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');

// Modelos
const { User , archiGoogleModel, repoModel , envioBoletaDetModel } = require('../../db');
const { errorLogModel } = require('../../dbA');



////////////////////////////////////////////////////////////////////////
//            AGREGAR ARCHIVOS AL REPOSITORIO DE FORMA MASIVA         //
////////////////////////////////////////////////////////////////////////
router.post('/carga', uploadCarpeta.single('formData'), async (req, res) => {

  /*
  token  
  iduser 
  user   
  parent 
  disco 
  */

    var $response = {},$ArchiOrigin = req.file.originalname,$ArchivoFinal = req.file.filename;
    var $arFile = $ArchiOrigin.split('.');
    var $extension = $arFile[ $arFile.length - 1 ];
    $extension = $extension.toLowerCase();
    $response.extension = $extension;
    //
    console.log(req.body.token);
    $response.estado = 'ERROR';
    $response.data = [];
    var $dataInsert         = {};
    $dataInsert.uu_id       = await renovarToken();
    $dataInsert.token       = req.body.token;
    var $uuid128 = renovarToken();
    
    var $RutaFile = RUTA_APP+'adjuntos/repo/';
    console.log('>>>>>>>>>'+$RutaFile);
    console.log('>>>>>>>>>'+$ArchivoFinal);
    
    var si = sizeof.SI($RutaFile+$ArchivoFinal);
  
    $dataInsert.formulario      = 'REPOSITORIO';
    $dataInsert.nombre_archivo  = $ArchiOrigin;
    $dataInsert.nombre_fisico   = $ArchivoFinal;
    $dataInsert.ruta_fisica     = `${$RutaFile}${$ArchivoFinal}`;
    $dataInsert.extension       = $extension;
    $dataInsert.url             = `${URL_NODE}api/files_repositorio/descargar/${$dataInsert.uu_id}/${$ArchivoFinal}`;
    $dataInsert.tipo_documento  = 'Imagen';
    $dataInsert.size            = si.MB;
    
    await archiGoogleModel.create( $dataInsert );
    var ItemAgregado = await archiGoogleModel.findOne({
      where : {
        uu_id : $dataInsert.uu_id
      }
    });
    var _icono = 'far fa-file';
    switch ( $extension ){
      case 'jpg':
      case 'png':
      case 'jpeg':
      case 'gif':
        _icono = 'fas fa-file-image';
      break;
      case 'pdf':
        _icono = 'far fa-file-pdf';
      break;
      case 'doc':
      case 'docx':
        _icono = 'far fa-file-word';
      break;
      case 'xls':
      case 'xlsx':
        _icono = 'far fa-file-excel';
      break;
      case 'ppt':
      case 'pptx':
        _icono = 'far fa-file-powerpoint';
      break;
    }
    // Ahora insertamos el repositorio
    var _insertRepo = {
      uu_id   : ItemAgregado.uu_id ,
      Ruta    : req.body.token ,
      Parent  : req.body.parent ,
      Disco   : req.body.disco ,
      Label   : $ArchiOrigin ,
      Icono   : _icono,
      Extension   : $extension ,
      EsDriver    : 0 ,
      EsFolder    : 0 ,
      EsSubFolder : 0 ,
      IdUsuario   : req.body.iduser ,
      Usuario     : req.body.user ,
      SubItems    : `[ 'Ext' : '${$extension}', 'Tamaño': '${si.MB}' ]`,
      url : `${URL_NODE}api/files_repositorio/descargar/${$dataInsert.uu_id}/${$ArchivoFinal}`
    };
    await repoModel.create(_insertRepo)
    .catch(function (err) {
      captueError( err.original , _insertRepo );
      console.log(_NombreDoc);
      $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });


    //$response.data = await archiGoogleModel.create( $dataInsert );

    $response.uu_id     = $dataInsert.uu_id;
    $response.uu_id128  = $uuid128;
    $response.estado = 'OK';
    res.json( $response );
});
// ====================================================================

////////////////////////////////////////////////////////////////////////
//            AGREGAR ARCHIVOS AL REPOSITORIO DE FORMA MASIVA         //
////////////////////////////////////////////////////////////////////////
router.post('/cargabycli', uploadCarpeta.single('formData'), async (req, res) => {

  /*
  token  
  iduser 
  user   
  parent 
  disco
  idcli
  idlocal
  */

    var $response = {},$ArchiOrigin = req.file.originalname,$ArchivoFinal = req.file.filename;
    var $arFile = $ArchiOrigin.split('.');
    var $extension = $arFile[ $arFile.length - 1 ];
    $extension = $extension.toLowerCase();
    $response.extension = $extension;
    //
    console.log(req.body.token);
    $response.estado = 'ERROR';
    $response.data = [];
    var $dataInsert         = {};
    $dataInsert.uu_id       = await renovarToken();
    $dataInsert.token       = req.body.token;
    var $uuid128 = renovarToken();
    
    var $RutaFile = RUTA_APP+'adjuntos/repo/';
    console.log('>>>>>>>>>'+$RutaFile);
    console.log('>>>>>>>>>'+$ArchivoFinal);
    
    var si = sizeof.SI($RutaFile+$ArchivoFinal);
  
    $dataInsert.formulario      = 'REPOSITORIO';
    $dataInsert.nombre_archivo  = $ArchiOrigin;
    $dataInsert.nombre_fisico   = $ArchivoFinal;
    $dataInsert.ruta_fisica     = `${$RutaFile}${$ArchivoFinal}`;
    $dataInsert.url             = `${URL_NODE}api/files_repositorio/descargar/${$dataInsert.uu_id}/${$ArchivoFinal}`;
    $dataInsert.extension       = $extension;
    $dataInsert.tipo_documento  = 'Imagen';
    $dataInsert.size            = si.MB;
    
    await archiGoogleModel.create( $dataInsert );
    var ItemAgregado = await archiGoogleModel.findOne({
      where : {
        uu_id : $dataInsert.uu_id
      }
    });
    var _icono = 'far fa-file';
    switch ( $extension ){
      case 'jpg':
      case 'png':
      case 'jpeg':
      case 'gif':
        _icono = 'fas fa-file-image';
      break;
      case 'pdf':
        _icono = 'far fa-file-pdf';
      break;
      case 'doc':
      case 'docx':
        _icono = 'far fa-file-word';
      break;
      case 'xls':
      case 'xlsx':
        _icono = 'far fa-file-excel';
      break;
      case 'ppt':
      case 'pptx':
        _icono = 'far fa-file-powerpoint';
      break;
    }
    // Ahora insertamos el repositorio
    var _insertRepo = {
      uu_id   : ItemAgregado.uu_id ,
      Ruta    : req.body.token ,
      Parent  : req.body.parent ,
      Disco   : req.body.disco ,
      Label   : $ArchiOrigin ,
      Icono   : _icono,
      Extension   : $extension ,
      EsDriver    : 0 ,
      EsFolder    : 0 ,
      EsSubFolder : 0 ,
      IdUsuario   : req.body.iduser ,
      Usuario     : req.body.user ,
      IdCliente     : req.body.idcli ,
      IdLocal     : req.body.idlocal ,
      SubItems    : `[ 'Ext' : '${$extension}', 'Tamaño': '${si.MB}' ]`,
      url : `${URL_NODE}api/files_repositorio/descargar/${$dataInsert.uu_id}/${$ArchivoFinal}`
    };
    await repoModel.create(_insertRepo)
    .catch(function (err) {
      captueError( err.original , _insertRepo );
      console.log(_NombreDoc);
      $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });


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
router.get('/descargar/:uuIdFile/:label?',async(req,res)=>{
  var $response = {};
  $response.estado = 'ERROR';

  var _Det = await archiGoogleModel.findOne({
      where : {
          uu_id : req.params.uuIdFile
      }
  });
  
  // 74634302
  if( _Det ){
    $response.url = fileUrl('.'+_Det.ruta_fisica+_Det.nombre_fisico);

    express.static(__dirname + '/public');
    res.sendFile( _Det.ruta_fisica );
    console.log(`Descargando archivo => ${_Det.ruta_fisica}`);
    //
  }else{
    //
    res.json( ['Archivo no existe '+_Det.IdArchivo ] );
  }
});
// // ------------------------------------------------------


//////////////////////////////////////////////////////////
//                  CONTENIDO DE UN NODO                //
//////////////////////////////////////////////////////////
router.get('/nodo/', async (req,res)=>{
  // Parent, Disco
  var $response = [];
  $response.estado = 'OK';
  var _nodoData = {} ;

  var _Atributos = [ 
      'id',
      [ 'Label' , 'text' ] ,
      [ 'Icono' , 'icon' ],
      [ 'uu_id' , 'a_attr' ],
      [ 'EsFolder' , 'Folder' ],
      [ 'Parent' , 'Parent' ],
  ];

  //console.log(req.query);
  //console.log(req.params);
  //console.log(req.body);
  // attributes: _Atributos,
  $response = await repoModel.findAll({
      where : {
          Disco  : req.query.Disco,
          Parent : req.query.Parent,
          EsDriver : 0 ,
          Estado : 'Activo'
      }
  })
  .catch(function (err) {
      captueError( err , req.body );
      console.log(err);
      $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
  });

  // Colocamos la unidad de Disco
  var _DiscoData = await repoModel.findOne({
    where : {
      EsDriver : 1,
      Disco  : req.query.Disco
    }
  });
  if( _DiscoData ){
    _nodoData.text = _DiscoData.Label;
    _nodoData.state= { 'opened' : true };
  }
  
  if( $response ){
    _nodoData.children = [];
    for( var i=0; i < $response.length; i++ ){
      var value = $response[ i ];
      var _O = {};
      _O.id     = value.id;
      var _fechaF = moment( value.updatedAt ).format('DD/MM/YYYY HH:mm');
      _O.text   = `${value.Label} | <small>${_fechaF}</small>`;
      _O.icon   = value.Icono;
      _O.a_attr = value.uu_id;
      _O.Folder = value.EsFolder;
      _O.Parent = value.Parent;
      _O.url = value.url;
      if( value.EsFolder == 1 ){
        delete _O.icon;
        _O.children = [];
        var _subItes = await BuscarInFolder( value.id );
        _O.children = _subItes;
      }
      _nodoData.children.push( _O );
    }
  }

  // Ahora todas las carpetas o archivos sueltos
  // console.log( _nodoData );
  
  res.json( _nodoData );
});
//////////////////////////////////////////////////////////
//                  CONTENIDO DE UN NODO                //
//////////////////////////////////////////////////////////
router.get('/nodobycli/', async (req,res)=>{
  // Parent, Disco
  var $response = [];
  $response.estado = 'OK';
  var _nodoData = {} ;

  var _Atributos = [ 
      'id',
      [ 'Label' , 'text' ] ,
      [ 'Icono' , 'icon' ],
      [ 'uu_id' , 'a_attr' ],
      [ 'EsFolder' , 'Folder' ],
      [ 'Parent' , 'Parent' ],
  ];

  //console.log(req.query);
  //console.log(req.params);
  //console.log(req.body);
  // attributes: _Atributos,
  $response = await repoModel.findAll({
      where : {
          Disco  : req.query.Disco,
          Parent : req.query.Parent,
          EsDriver : 0 ,
          Estado : 'Activo',
          IdCliente : req.query.Cli,
          IdLocal : req.query.Local
      }
  })
  .catch(function (err) {
      captueError( err , req.body );
      console.log(err);
      $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
  });

  // Colocamos la unidad de Disco
  var _DiscoData = await repoModel.findOne({
    where : {
      EsDriver : 1,
      Disco  : req.query.Disco
    }
  });
  if( _DiscoData ){
    _nodoData.text = _DiscoData.Label;
    _nodoData.state= { 'opened' : true };
  }
  
  if( $response ){
    _nodoData.children = [];
    for( var i=0; i < $response.length; i++ ){
      var value = $response[ i ];
      var _O = {};
      _O.id     = value.id;
      var _fechaF = moment( value.updatedAt ).format('DD/MM/YYYY HH:mm');
      _O.text   = `${value.Label} | <small>${_fechaF}</small>`;
      _O.icon   = value.Icono;
      _O.a_attr = value.uu_id;
      _O.Folder = value.EsFolder;
      _O.Parent = value.Parent;
      _O.url = value.url;
      if( value.EsFolder == 1 ){
        delete _O.icon;
        _O.children = [];
        var _subItes = await BuscarInFolder( value.id );
        _O.children = _subItes;
      }
      _nodoData.children.push( _O );
    }
  }

  // Ahora todas las carpetas o archivos sueltos
  // console.log( _nodoData );
  
  res.json( _nodoData );
});
// -------------------------------------------------------
async function BuscarInFolder( id )
{
  var _nodoData = [];
  var _dataSub = await repoModel.findAll({
    where : {
        Parent : id ,
        Estado : 'Activo'
    }
  })
  .catch(function (err) {
      captueError( err , req.body ); console.log(err);
  });
  
  if( _dataSub ){
    for( var i=0; i < _dataSub.length; i++ ){
      var value = _dataSub[ i ];
      var _O = {};
      _O.id     = value.id;
      var _fechaF = moment( value.updatedAt ).format('DD/MM/YYYY HH:mm');
      _O.text   = `${value.Label} | <small>${_fechaF}</small>`;
      _O.icon   = value.Icono;
      _O.a_attr = value.uu_id;
      _O.Folder = value.EsFolder;
      _O.Parent = value.Parent;
      _O.url = value.url;
      if( value.EsFolder == 1 ){
        delete _O.icon;
        _O.children = [];
        var _subItes = await BuscarInFolder( value.id );
        _O.children = _subItes;
      }
      _nodoData.push( _O );
    }
  }
  //console.log( _nodoData );
  return _nodoData;
}
// -------------------------------------------------------


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
async function captueError( error , post )
{
    var _envio       = JSON.stringify(post);
    var _descripcion = JSON.stringify(error);
    var _uuid = await renovarToken();
    await errorLogModel.create({
        uu_id   : _uuid,
        modulo  : _NombreDoc,
        envio   : _envio,
        descripcion : _descripcion,
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
// ------------------------------------------------------

module.exports = router;


