// api_clienteExcluido.js

const router = require('express').Router();

const { clienteExcluidoModel,User } = require('../../db');

const {check,validationResult} = require('express-validator');

const { Op } = require("sequelize");

var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await clienteExcluidoModel.findAll({
        order : [
            ['id' , 'DESC']
        ],
        limit : 100
    });

    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////
//          BUSCAR CLASE            //
//////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};

    if( req.body.id != '' ){
        // Buscamos por ID
        $where.id = req.body.id;
        //
        $response.data = await clienteExcluidoModel.findAll({
            order : [
                ['id' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        $where.cliente = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        $response.data = await clienteExcluidoModel.findAll({
            order : [
                ['id' , 'DESC']
            ],
            where : $where
        });
    }

    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER LISTA     			//
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await clienteExcluidoModel.findAll({
        where : {
            Estado : 'Activo'
        },
        order : [
            ['cliente' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//              AGREGAR CLASE           //
//////////////////////////////////////////
router.post('/', [
    //check('id_cliente' ,'Seleccione un cliente').not().isEmpty(),
    //check('vencimiento' ,'Seleccione un cliente').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    
    //nombre, dni del usuario y fecha de vencimiento
    req.body.IdSolicitante = $userData.dni;
    req.body.Solicitante   = $userData.name;
    req.body.vencimiento   =  moment().format('YYYY-MM-DD HH:mm:ss');
    
    await clienteExcluidoModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await clienteExcluidoModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 5 );
        _Codigo = 'CE'+_Codigo;
        
        await clienteExcluidoModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
    }

    $response.item = await clienteExcluidoModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR CLASE            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await clienteExcluidoModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR CLASE          //
//////////////////////////////////////////
router.put('/:uuid', [
    check('id_cliente' ,'Seleccione un cliente').not().isEmpty(),
    check('Motivo' ,'Ingrese motivo').not().isEmpty(),
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

    delete req.body.id
	await clienteExcluidoModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    $response.item = await clienteExcluidoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR CLASE            //
//////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

  
	await clienteExcluidoModel.update({
        estado      : 'Anulado',
        
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await clienteExcluidoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                  ENVIAR DOCUMENTO                  //
//////////////////////////////////////////////////////////
router.post('/enviar', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );
    
    await clienteExcluidoModel.update({
        estado      : 'Enviado',
        
    },{
		where : { 
            uu_id : req.body.uuid 
        }
    });

    console.log(req.body);
    $response.data = await clienteExcluidoModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
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

module.exports = router;