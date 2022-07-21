// api_archivosGoogle.js

const router = require('express').Router();

const { archiGoogleModel,User } = require('../../db');

const {check,validationResult} = require('express-validator');

const dotenv = require('dotenv');
dotenv.config();

const _RUTA_ORQ3 = process.env.RUTA_ORQ3;


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await archiGoogleModel.findAll({
        order : [
            [ 'id' , 'DESC  ' ]
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

///////////////////////////////////////////////////////////
//          CARGAR ARCHIVOS ADJUNTOS DE UN FORMULARIO    //
///////////////////////////////////////////////////////////
router.post('/getfiles',async(req,res)=>{
    /// corr, form
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await archiGoogleModel.findAll({
        where : {
            correlativo : req.body.corr ,
            formulario  : req.body.form
        },
        order: [
			['id', 'DESC']
		]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER LISTA     			//
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await archiGoogleModel.findAll({
        where : {
            estado : 1
        },
        order : [
            ['Descripcion' , 'ASC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR ALMACEN       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('nombre' ,'El nombre es obligatorio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioMod = $userData.name;
    $response.data = await archiGoogleModel.create(req.body);
    $response.data = await archiGoogleModel.findOne({
        where : {
            IdAlmacen : req.body.IdAlmacen
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR ARCHIVO            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await archiGoogleModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR ARCHIVO            //
//////////////////////////////////////////
router.put('/:uuid', [
    check('nombre_archivo' ,'El nombre es obligatorio').not().isEmpty(),
], async (req,res)=>{
    // IdAlmacen
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }

    var _response = {};
    _response.codigo = 200;

    try {
        //
        var $userData = await getUserData( req.headers['api-token'] );
        await archiGoogleModel.update(req.body,{
            where : { 
                uu_id : req.params.uuid
            }
        })
        .catch(function (err) {
            varDump( err );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        _response.data = await archiGoogleModel.findOne({
            where : {
                uu_id : req.params.uuid
            }
        });
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Guardado.` };
        //
    } catch (error) {
        varDump( error );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }
    return res.status(_response.codigo).json( _response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR HABITACION            //
//////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    try {
        //
        await archiGoogleModel.destroy({
            where : { 
                uu_id : req.params.uuid 
            }
        });
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `success` , 'texto' : `Eliminado.` };
        //
    } catch (error) {
        varDump( error );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }
    return res.status(_response.codigo).json( _response );
});


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
// -------------------------------------------------------

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO 2              //
////////////////////////////////////////////////////
router.get('/show2/:uuIdFile/:nombre?',async(req,res)=>{
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
    if( $data.ruta_fisica ){
        res.sendFile( $data.ruta_fisica );
    }else{
        // _RUTA_ORQ3
        res.sendFile( _RUTA_ORQ3+'intranet/public/assets/adjunto/'+$data.nombre_fisico );
    }
});
// -------------------------------------------------------

// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
async function renovarToken()
{
    var length = 12;
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
function varDump( _t )
{
    console.log( _t );
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
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;