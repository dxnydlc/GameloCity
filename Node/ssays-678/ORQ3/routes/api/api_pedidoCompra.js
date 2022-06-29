// api_pedidoCompra.js

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
const { pedidoCompraCabModal, User, pedidoCompraDetModal , centroCostosModel } = require('../../db');

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
pedidoCompraCabModal.belongsTo( pedidoCompraDetModal ,{
	as : 'DetallePC1', foreignKey 	: 'IdPedCompraCab',targetKey: 'IdPedCompraCab',
});

pedidoCompraCabModal.belongsTo( centroCostosModel ,{
	as : 'DetCCPC', foreignKey 	: 'IdCentro',targetKey: 'IdCentro',
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await pedidoCompraCabModal.findAll({
        order : [
            ['IdPedCompraCab' , 'DESC']
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
        $where.IdPedCompraCab = req.body.id;
        //
        $response.data = await pedidoCompraCabModal.findAll({
            order : [
                ['IdPedCompraCab' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        $where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        $response.data = await pedidoCompraCabModal.findAll({
            order : [
                ['IdPedCompraCab' , 'DESC']
            ],
            where : $where
        });
    }

    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/rpt01', async (req,res)=>{
    // Ids , Inicio , Fin , Soli , Auto , Prod, OC, Ref
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {}, $where2 = {};

    if( req.body.Ids != '' ){
        // Buscamos por ID
        $where.IdPedCompraCab = req.body.id;
        //
        $response.data = await pedidoCompraCabModal.findAll({
            order : [
                ['IdPedCompraCab' , 'DESC']
            ],
            where : $where ,
            include: [{
		        model : pedidoCompraDetModal,
		        as    : 'DetallePC1'
		    }]
        });
        //
    }else{
        // Fechas
        $where.Fecha = { [Op.gte ]: req.body.Inicio,[Op.lte ]: req.body.Fin };
        // Soli
        if( req.body.Soli ){
            $where.Solicitante = req.body.Soli;
        }
        // Ref
        if( req.body.Ref ){
            $where.Referencia = { [Op.like] : '%'+req.body.Ref+'%' }
        }
        // Auto
        if( req.body.Auto ){
            $where.AutorizadoPor = req.body.Auto;
        }
        // Prods
        if( req.body.Prod ){
            $where2.IdProducto = req.body.Prod;
        }
        // OC
        if( req.body.OC ){
            $where2.OC = req.body.OC;
        }
        //
        $response.data = await pedidoCompraCabModal.findAll({
            order : [
                ['IdPedCompraCab' , 'DESC']
            ],
            where : $where,
            include: [{
		        model : pedidoCompraDetModal,
		        as    : 'DetallePC1',
                where : $where2,
		    }]
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

	$response.data = await pedidoCompraCabModal.findAll({
        where : {
            Estado : 'Activo'
        },
        order : [
            ['IdPedCompraCab' , 'DESC']
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
    await pedidoCompraCabModal.create(req.body)
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
        var _IdPedCompraCab = await pad_with_zeroes( _dataGuardado.id , 7 );
        await pedidoCompraCabModal.update({
            IdPedCompraCab : _IdPedCompraCab
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
    }

    $response.item = await pedidoCompraCabModal.findOne({
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

    $response.data = await pedidoCompraCabModal.findOne({
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
    check('Mes' ,'Seleccione mes').not().isEmpty(),
    check('Anio' ,'Ingrese año').not().isEmpty(),
    check('IdCliente' ,'Seleccione Cliente').not().isEmpty(),
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

	await pedidoCompraCabModal.update(req.body,{
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
    
    $response.item = await pedidoCompraCabModal.findOne({
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

	await pedidoCompraCabModal.update({
        Estado      : 'Anulado',
        DNIAnulado  : $userData.dni,
        AnuladoPor  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await pedidoCompraCabModal.findOne({
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