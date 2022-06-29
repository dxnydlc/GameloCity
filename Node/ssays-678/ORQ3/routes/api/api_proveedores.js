// api_proveedores.js

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
const { proveedorModel,User, adnSolServCabModel, adnSolServDetModel, sequelize } = require('../../db');



// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			    OBTENER LISTA     			    //
//////////////////////////////////////////////////////////
router.get('/listas',async(req,res)=>{
   
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
   
	$response.data = await proveedorModel.findAll({
        where : {
            Estado : '1'
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
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await proveedorModel.findAll({
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
    // ruc, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    
    if( req.body.Codigo){
        // Buscamos por ID
        $where.Codigo = req.body.Codigo;
        //
        $response.data = await proveedorModel.findAll({
            order : [
                ['id' , 'DESC']
            ],
            where : $where
        });
        //
    }else{

        // RUC
        if( req.body.RUC)
        {
            // Buscamos por nombre
        $where.RUC = { [Op.like] : '%'+req.body.RUC+'%' }
        }
        // RazonProv
        if( req.body.RazonProv)
        {
      
        $where.Razon = { [Op.like] : '%'+req.body.RazonProv+'%' }
        }
        
        //
        $response.data = await proveedorModel.findAll({
            order : [
                ['Razon' , 'DESC']
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
    
	$response.data = await proveedorModel.findAll({
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
    check('Razon' ,'Ingrese Razón Social').not().isEmpty(),
    check('IdCentro' ,'Ingrese Centro de Costo').not().isEmpty(),
    check('Direccion' ,'Ingrese Dirección').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    //req.body.DNICreado = $userData.dni;
    //req.body.CreadoPor = $userData.name;
    //
    /*
    if(!req.body.RUC){
        req.body.RUC = 0;
    }
    */
    if(req.body.Estado == 'Activado'){
        req.body.Estado = 1;
    }else{
        req.body.Estado = 0;
    }

    if(req.body.IdMoneda == '1'){
        req.body.moneda = 'Nuevos Soles';
    }else{
        req.body.moneda = 'Dolares Americanos';
    }
    
    /*if(req.body.RUC){
        req.body.IdClienteProv = req.body.RUC;
    }
    if(req.body.DNI){
        req.body.IdClienteProv = req.body.DNI;
    }*/
  
    await proveedorModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await proveedorModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
   
    if( _dataGuardado ){
      
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 5 );
        _Codigo = 'prov'+_Codigo;
        await proveedorModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
    }
   
    $response.item = await proveedorModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});

/*
router.post('/', [
    check('Mes' ,'Seleccione mes').not().isEmpty(),
    check('Anio' ,'Ingrese año').not().isEmpty(),
    check('IdCliente' ,'Seleccione Cliente').not().isEmpty(),
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
    await proveedorModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await capacitacionModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 5 );
        _Codigo = 'HOR'+_Codigo;
        await proveedorModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
    }

    $response.item = await proveedorModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});

*/



// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // id
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    
    $response.data = await proveedorModel.findOne({
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
    check('Razon' ,'Ingrese Razón Social').not().isEmpty(),
    check('IdCentro' ,'Ingrese Centro de Costo').not().isEmpty(),
    check('Direccion' ,'Ingrese Dirección').not().isEmpty(),
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

    var _id = req.params.uuid;
    delete req.params.uuid;

    if(req.body.Estado == 'Activado'){
        req.body.Estado = 1;
    }else{
        req.body.Estado = 0;
    }

    if(req.body.IdMoneda == '1'){
        req.body.moneda = 'Nuevos Soles';
    }else{
        req.body.moneda = 'Dolares Americanos';
    }
    /*if(req.body.RUC){
        req.body.IdClienteProv = req.body.RUC;
    }
    if(req.body.DNI){
        req.body.IdClienteProv = req.body.DNI;
    }*/
  
	await proveedorModel.update(req.body,{
		where : { 
            uu_id : _id
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    $response.item = await proveedorModel.findOne({
        where : {
            uu_id : _id
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

	await proveedorModel.update({
        Estado      : 'Anulado',
        DNIAnulado  : $userData.dni,
        AnuladoPor  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await proveedorModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//               DISPONIBILIDAD PROVEEDOR               //
//////////////////////////////////////////////////////////
router.post('/diff_emos', async (req,res)=>{
    // ruc, fecha, [examen]
    // Vamos a ver la disponibilidad del provedor para los EMOS en la fecha tal
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _diffEMO = 0, _EMOCount = 0, _MaxEMO = 0;

    // Numero de consultas en esa fecha
    // TExamen     : 'Antigeno',
   
    const _EMOs = await adnSolServCabModel.findAll({
        where : 
        {
            FechaCita   : { [Op.gte] : req.body.fecha+' 00:00:01' },
            FechaCita   : { [Op.lte] : req.body.fecha+' 23:59:59' },
            Estado      : 'Aprobado',
        }
    });
  
    if( _EMOs )
    {
        for ( var i = 0; i < _EMOs.length; i++ ) {
            var _rs = _EMOs[i];
            _EMOCount = _EMOCount + parseInt(_rs.NroPersonal);
            
        }
        
    }

    var _dataProov = await proveedorModel.findOne({
        where : {
            RUC : req.body.ruc
        }
    });
    if( _dataProov )
    {
        _MaxEMO = parseInt( _dataProov.MaxEMO );
    }

    _diffEMO = _MaxEMO - _EMOCount;
    
    $response.diff = _diffEMO;
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//               DISPONIBILIDAD PROVEEDOR 2              //
//////////////////////////////////////////////////////////
router.post('/diff_emos_', async (req,res)=>{
    // ruc, fecha, [examen]
    // Vamos a ver la disponibilidad del provedor para los EMOS en la fecha tal
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    
    var _diffEMO = 0, _EMOCount = 0;

    // Numero de consultas en esa fecha
    // TExamen     : 'Antigeno',
    
    const _EMOs = await adnSolServCabModel.findAll({
        where:
        {
            FechaCita : sequelize.where(sequelize.fn('DATE', sequelize.col('FechaCita')), req.body.fecha),
            Estado: 'Aprobado'
        } 
    });
    
    if( _EMOs )
    {
        for ( var i = 0; i < _EMOs.length; i++ ) {
            var _rs = _EMOs[i];
            //console.log(_rs);
            _EMOCount = _EMOCount + parseInt(_rs.NroPersonal);          
        }
    }
    if(req.body.ruc){
        var _dataProov = await proveedorModel.findOne({
            where : {
                RUC : req.body.ruc
            }
        });
        _diffEMO = parseInt(_dataProov.Aforo -_EMOCount);
    }
    //console.log('_diffEMO: '+_diffEMO);
    $response.diff = _diffEMO;
    
    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                  NRO PACIENTES POR FECHA             //
//////////////////////////////////////////////////////////
router.post('/pacinetes_por_fecha', async (req,res)=>{
    // IdProv, Fecha
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _NroPacientes = await adnSolServDetModel.count({
        where: {
            Estado : 'Asignado' ,
            FechaRepro : req.body.Fecha ,
            IdProveedor : req.body.IdProv
        }
    });
    
    $response.count = _NroPacientes;

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
