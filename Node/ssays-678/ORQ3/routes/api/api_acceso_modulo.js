// api_acceso_modulo.js

const router = require('express').Router();

const { accesoModuloModel,User } = require('../../db');

const {check,validationResult} = require('express-validator');

// MOMENT
var moment = require('moment-timezone');
moment().tz("America/Lima").format();


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await accesoModuloModel.findAll({
        order : [
            ['id' , 'DESC']
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
    // dni, nombre, correo, modulo
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    // DNI
    if( req.body.dni ){
        $where.id_usuario = req.body.dni;
    }
    // Modulo
    if( req.body.modulo ){
        $where.modulo = req.body.modulo;
    }
    
    $response.data = await accesoModuloModel.findAll({
        order : [
            ['Codigo' , 'DESC']
        ],
        where : $where
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

	$response.data = await accesoModuloModel.findAll({
        order : [
            ['id' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      		    	AGREGAR ACCESO       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('id_usuario' ,'Seleccione usuario').not().isEmpty(),
    check('email' ,'El nombre es obligatorio').not().isEmpty(),
    check('modulo' ,'Seleccione módulo').not().isEmpty()
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.ud = $userData;

    req.body.estado = 1;
    req.body.UsuarioCreado = $userData.name;
    
    await accesoModuloModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    var _dataGuardado = await accesoModuloModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 5 );
        _Codigo = 'ACM'+_Codigo;
        await accesoModuloModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
    }

    $response.item = await accesoModuloModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });


	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//             CARGAR ACCESO            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await accesoModuloModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR HABITACION            //
//////////////////////////////////////////
router.put('/:id', [
    check('id_usuario' ,'Seleccione usuario').not().isEmpty(),
    check('email' ,'El nombre es obligatorio').not().isEmpty(),
    check('modulo' ,'Seleccione módulo').not().isEmpty(),
], async (req,res)=>{
    // id
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Auditoria
    req.body.UsuarioModificado = $userData.name;

	await accesoModuloModel.update(req.body,{
		where : { 
            uu_id : req.params.uu_id 
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    $response.item = await accesoModuloModel.findOne({
        where : {
            uu_id : req.params.uu_id 
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR ACCESSO            //
//////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    $response.item = await accesoModuloModel.findOne({
        where : {
            uu_id : req.params.uuid 
        }
    });

	await accesoModuloModel.destroy({
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    res.json( $response );
});

// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
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

module.exports = router;