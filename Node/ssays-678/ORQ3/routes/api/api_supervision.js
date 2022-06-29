// api_supervision.js

const router = require('express').Router();

const { supervisionModel, User, authSuperModel, sucursalModel } = require('../../db');

const {check,validationResult} = require('express-validator');

const { Op } = require("sequelize");

var moment = require('moment-timezone');
const users = require('../../models/users');
moment().tz("America/Lima").format();


//////////////////////////////////////////////////////////
//           OBTENER EL ÚLTIMO REGISTRO     			//
//////////////////////////////////////////////////////////
router.get('/validar',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    
	$response.data = await supervisionModel.findOne({
        where : {
            Estado : 'Inicio',
            Supervisor: $response.ut.dni
        },
        order : [
            ['id' , 'DESC']
        ],
        limit : 1
    });

    if(!$response.data){
       // if($response.data.length == 0){    
            $response.estado = 'NO';
       // }
    }
  
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    $response.ut = await getUserData( req.headers['api-token'] );
  
    $where.idCliente = $response.ut.cliente;
	$response.data = await supervisionModel.findAll({
        order : [
            ['id' , 'DESC']
        ],
        where : $where,
        limit :200
    });
    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////
//          BUSCAR CLASE            //
//////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    
    if( req.body.Estado ){
        // Buscamos por ID
        $where.Estado = req.body.Estado;
        //
        $response.data = await supervisionModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
        //
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

	$response.data = await supervisionModel.findAll({
        where : {
            Estado : 1
        },
        order : [
            ['Descripcion' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//          CARGAR CLASE            //
//////////////////////////////////////////////////////////
router.post('/get_supervision/', async (req,res)=>{
    // id
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.locales = [];
  
    $response.data = await supervisionModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
        
        res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//      			INICIAR SUPERVISION       			//
//////////////////////////////////////////////////////////
router.post('/incio', [
    check('IdCliente' ,'Seleccione un cliente').not().isEmpty(),
    check('IdLocal' ,'Seleccione un local').not().isEmpty(),
] ,async (req,res)=>{
  
	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    $response.usuario = $userData;

    req.body.Supervisor       = $userData.dni;
    req.body.NombreSupervisor = $userData.name;
    req.body.uu_id  = await renovarToken();
    req.body.Inicio = moment().format('YYYY-MM-DD HH:mm:ss');
    req.body.Estado = 'Inicio';
    $response.inicio = req.body.Inicio;
   
    var dataInsert = await supervisionModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    var _dataGuardado = await supervisionModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    if( _dataGuardado ){
        var Codigo = 'SUP'+await pad_with_zeroes( _dataGuardado.id , 8 );
        await supervisionModel.update({
            Codigo : Codigo
        },{
            where : {
                uu_id : req.body.uu_id
            }
        });
        // Colocamos el inicio de supervicion en el usuario
        await User.update({
            sup_iniciada : moment().format('YYYY-MM-DD HH:mm:ss'),
            IdSupIniciada : _dataGuardado.id
        },{
            where : {
                dni : $userData.dni
            }
        });
    }
    $response.item = await supervisionModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//      		FINALIZAR SUPERVISION       			//
//////////////////////////////////////////////////////////
router.post('/finalizar', async (req,res)=>{
    // uuid, lat_fin, lng_fin
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];
    
    var _Entidad = await supervisionModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _Entidad ){
        var _Fin = moment().format('YYYY-MM-DD HH:mm:ss');
        // Diferencia tiempo inicio y fin..
        var now  = moment().format();
        var then = _Entidad.Inicio;
        var _TiempO = moment.utc(moment(now,"YYYY-MM-DD HH:mm:ss").diff(moment(then,"YYYY-MM-DD HH:mm:ss"))).format("HH:mm:ss");
        var arrTiempo = _TiempO.split(':');
        //
        $response.fin    = now;
        $response.inicio = then;
        $response.tiempo = _TiempO;
        //
        req.body.Fin     = _Fin;
        req.body.Tiempo  = _TiempO;
        req.body.Horas   = arrTiempo[0];
        req.body.Minutos = arrTiempo[1];
        req.body.Estado = 'Finalizado';
        //
        
        await supervisionModel.update(req.body,{
                where : {
                    uu_id : req.body.uu_id
                }
            }
        );
        // Quitar la supervisión en el usuario
        await User.update({
            sup_iniciada  : null,
            IdSupIniciada : null
        },{
            where : {
                dni : $userData.dni
            }
        });
    }

    res.json( $response );
});

//////////////////////////////////////////////////////////
//          CARGAR CLASE            //
//////////////////////////////////////////////////////////
router.post('/get_by_id', async (req,res)=>{
    // id
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.locales = [];

    var _Entidad = await supervisionModel.findOne({
        where : {
            id : req.body.id
        }
    });
    if( _Entidad ){
        $response.data = _Entidad;
        // Locales 
        var _Sucursales = await sucursalModel.findAll({
            where : {
                IdClienteProv : _Entidad.IdCliente
            }
        });
        $response.locales = _Sucursales;
    }
    
    res.json( $response );
});
// ---------------------------------------
//////////////////////////////////////////////////////////
//      			OBTENER get_data supervision     //
//////////////////////////////////////////////////////////
router.post('/get_data',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    
    if(req.body.IdSupIniciada){
        $response.data = await supervisionModel.findOne({
            where : {
                id : req.body.IdSupIniciada
            }
        });
        $response.encontrado = 'SI';
    }else{
        
        $response.encontrado = 'NO';
    }
    res.json( $response );
});
// -------------------------------------------------------
/*
    router.post('/get_data',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    console.log('get_data');
    console.log(req.body.IdSupIniciada);
    if(req.body.IdSupIniciada){
        $response.data = await supervisionModel.findOne({
            where : {
                id : req.body.IdSupIniciada
            }
        });
    }else{
        
        $response.encontrado = 'NO';
    }
    res.json( $response );
});
*/

// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
async function renovarToken()
{
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
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular', 'trabajo_iniciado', 'cliente'],
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

module.exports = router;