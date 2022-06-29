
// api_repositorio.js


var _NombreDoc = 'api_repositorio';
const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();
// >>>>>>>>>>>>>    SPARKPOST   >>>>>>>>>>>>>
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET)
// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');
// >>>>>>>>>>>>>    NEXMO       >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

// Modelos
const { errorLogModel } = require('../../dbA');
const { repoModel,User } = require('../../db');



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await repoModel.findAll({
        where : {
            EsDriver : 1
        },
        order : [
            ['Codigo' , 'DESC']
        ],
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};

    if( req.body.id != '' ){
        // Buscamos por ID
        $where.Codigo = req.body.id;
        //
        $response.data = await repoModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        $where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        $response.data = await repoModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
    }

    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			    OBTENER LISTA     			    //
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await repoModel.findAll({
        where : {
            Estado : 'Activo'
        },
        order : [
            ['Codigo' , 'DESC']
        ],
        limit : 100
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR DOCUMENTO       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('Label' ,'Ingrese un nombre').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.IdUsuario = $userData.dni;
    req.body.Usuario   = $userData.name;
    //
    await repoModel.create(req.body)
    .catch(function (err) {
        console.log(_NombreDoc);
        captueError( err.original , req.body );
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await repoModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 8 );
        _Codigo = 'UND'+_Codigo;
        await repoModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        })
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
    }

    $response.item = await repoModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await repoModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CONTENIDO DE UN NODO                //
//////////////////////////////////////////////////////////
router.post('/nodo', async (req,res)=>{
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
  var _DataContenido = await repoModel.findAll({
      where : {
          Disco  : req.body.Disco,
          Parent : req.body.Parent,
          EsDriver : 0
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
      Disco  : req.body.Disco
    }
  });
  if( _DiscoData ){
    _nodoData.id    = _DiscoData.id;
    _nodoData.text  = _DiscoData.Label;
    _nodoData.state = { 'opened' : true };
  }
  
  if( _DataContenido ){
    _nodoData.children = [];
    for( var i=0; i < _DataContenido.length; i++ ){
      var value = _DataContenido[ i ];
      var _O = {};
      _O.id     = value.id;
      _O.text   = value.Label;
      _O.icon   = value.Icono;
      _O.a_attr = value.uu_id;
      _O.Folder = value.EsFolder;
      _O.Parent = value.Parent;
      if( value.EsFolder == 1 ){
        delete _O.icon;
        _O.children = [];
        var _subItes = await BuscarInFolder( value.id );
        _O.children = _subItes;
      }
      _nodoData.children.push( _O );
    }
  }

  var _respuesta = {};
  _respuesta.data = _nodoData;
  _respuesta.parent = _DiscoData;
  _respuesta.estado = 'OK';

  res.json( _respuesta );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('Label' ,'Ingrese un nombre').not().isEmpty(),
], async (req,res)=>{
    // uuid
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Auditoria

	await repoModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
	    console.log(_NombreDoc);
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    $response.item = await repoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELIMINAR DOCUMENTO                  //
//////////////////////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria

	await repoModel.update({
        Estado : 'Anulado',
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    
    $response.item = await repoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR UN ITEM                  //
//////////////////////////////////////////////////////////
router.post('/update_item/:uuid?', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await repoModel.update( req.body ,{
        where : {
            uu_id : req.params.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              CARGAR CONTENIDO DE CARPETAS            //
//////////////////////////////////////////////////////////
async function BuscarInFolder( id )
{
  var _nodoData = [];
  var _dataSub = await repoModel.findAll({
    where : {
        Parent : id
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
      _O.text   = value.Label;
      _O.icon   = value.Icono;
      _O.a_attr = value.uu_id;
      _O.Folder = value.EsFolder;
      _O.Parent = value.Parent;
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
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
async function renovarToken()
{
    var length = 40;
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
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular'],
        where : {
            api_token : $token
        }
    });
    return $data;
}
// -------------------------------------------------------
function pad_with_zeroes( number , length )
{
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}
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
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;