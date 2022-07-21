// api_EnvioBoletas.js

var _NombreDoc = 'dddddddddddd';
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
const { activosModel,User } = require('../../db');



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    
	$response.data = await activosModel.findAll({
        order : [
            ['IdActivos' , 'DESC']
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
    // codigo, nroPlaca, custodio, cliente
   console.log("js");
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};

    if( req.body.codigo != '' ){
        // Buscamos por codigo
        $where.Codigo = req.body.codigo;
        
        //
        $response.data = await activosModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        //console.log('hola: '+req.body.custodio);
        if(req.body.nroPlaca){
            $where.Placa = { [Op.like] : '%'+req.body.nroPlaca+'%' }
        }
            
        if(req.body.custodio){
            $where.CodEmp = req.body.custodio
        }
            
        if(req.body.cliente){
            $where.IdClienteProv = req.body.cliente;
        }
            
        //$where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        $response.data = await activosModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
        console.log($where);
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

	$response.data = await activosModel.findAll({
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
    check('Placa' ,'Seleccione placa').not().isEmpty(),
    check('EstadoConserv' ,'Ingrese estado conservación').not().isEmpty(),
    check('IdClienteProv' ,'Seleccione Cliente').not().isEmpty(),
    check('IdSucursal' ,'Seleccione Local').not().isEmpty(),
    //check('IdProveedor' ,'Seleccione Cliente').not().isEmpty(),
/*
    check('IdClaseBien' ,'Seleccione Clase').not().isEmpty(),
    check('IdCentro' ,'Seleccione Centro').not().isEmpty(),
    check('IdProvincia' ,'Seleccione provincia').not().isEmpty(),
    check('IdRegion' ,'Seleccione Departamento').not().isEmpty(),
    check('CodEmp' ,'Seleccione Custodio').not().isEmpty(),
    */
    //check('IdProveedor' ,'Seleccione Proveedor').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.DNICreado = $userData.dni;
    req.body.CreadoPor = $userData.name;
    //

    if(!req.body.FechaBaja){
        delete req.body.FechaBaja;
    }

    if(!req.body.FechaAltaBien){
        delete req.body.FechaAltaBien;
    }
    console.log(req.body);
    await activosModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    var _dataGuardado = await activosModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    //console.log(_dataGuardado.id);
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.IdActivos , 8 );
        _Codigo = 'ACT'+_Codigo;
        await activosModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
    }

    $response.item = await activosModel.findOne({
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

    $response.data = await activosModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('Placa' ,'Seleccione placa').not().isEmpty(),
    check('EstadoConserv' ,'Ingrese estado conservación').not().isEmpty(),
    check('IdClienteProv' ,'Seleccione Cliente').not().isEmpty(),
    check('IdSucursal' ,'Seleccione Local').not().isEmpty(),
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
    req.body.DNIModificado = $userData.dni;
    req.body.ModificadoPor  = $userData.name;
    
    if(!req.body.FechaBaja){
        delete req.body.FechaBaja;
    }

    if(!req.body.FechaAltaBien){
        delete req.body.FechaAltaBien;
    }
    console.log("actualiza");
    console.log(req.body);
	await activosModel.update(req.body,{
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
    
    $response.item = await activosModel.findOne({
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
    req.body.DNIAnulado = $userData.dni;
    req.body.AnuladoPor = $userData.name;

    $anuladoPor = $userData.name;

	await activosModel.update({
        Estado      : 'Anulado',
        
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await activosModel.findOne({
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
async function renovarToken()
{
    var length = 25;
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


module.exports = router;