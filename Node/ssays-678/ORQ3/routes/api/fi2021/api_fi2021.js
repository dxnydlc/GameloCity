
// api_fi2021.js

var _NombreDoc = 'Ficha_inspeccion_2021';
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
const { errorLogModel } = require('../../../dbA');
const { fichaInspecCabMode, User, seriesDocModel, provinciaModel, distrito2Model } = require('../../../db');



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await fichaInspecCabMode.findAll({
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
        $response.data = await fichaInspecCabMode.findAll({
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
        $response.data = await fichaInspecCabMode.findAll({
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

	$response.data = await fichaInspecCabMode.findAll({
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
    check('FormaContacto' ,'Indicar como nos conctactó el cliente.').not().isEmpty(),
    check('MotivoSolicitud' ,'Ingrese motivo solicitud.').not().isEmpty(),
    check('IdClienteProv' ,'Seleccione Cliente').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.IdUsuarioMod = $userData.dni;
    req.body.UsuarioMod   = $userData.name;
    //
    req.body.Estado = 'Digitado';
    // Serie y correlativo
    var _serieDoc = await seriesDocModel.findOne({
        attributes: ['IdSerieDoc','Serie', 'UltCorrelativo'],
        where : {
            IdTipoDoc : 29
        }
    })
    .catch(function (err) {
        console.log(`Leven 01`);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    //
    var _IdFicha = 0;
    if( _serieDoc ){
        _IdFicha = _serieDoc.UltCorrelativo + 1;
    }
    req.body.IdFicha = _IdFicha;
    if( req.body.TipoDocCliente == 'RUC' ){
        delete req.body.NroDNI;
    }else{
        delete req.body.NroRUC;
    }
    //
    await fichaInspecCabMode.create(req.body)
    .catch(function (err) {
        console.log(_NombreDoc);
        captueError( err.original , req.body );
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await fichaInspecCabMode.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        // Update la serie.
        await seriesDocModel.update( { UltCorrelativo : _IdFicha } , {
            where : {
                IdSerieDoc : _serieDoc.IdSerieDoc
            }
        });
        var _Codigo = await pad_with_zeroes( _IdFicha , 5 );
        _Codigo = 'FI'+_Codigo;
        await fichaInspecCabMode.update({
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

    $response.item = await fichaInspecCabMode.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO (UUID)             //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await fichaInspecCabMode.findOne({
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
//                  CARGAR DOCUMENTO (Codigo)             //
//////////////////////////////////////////////////////////
router.post('/by_codigo', async (req,res)=>{
    // codigo
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.prov = [];
    $response.dist = [];

    var _Entidad = await fichaInspecCabMode.findOne({
        where : {
            Codigo : req.body.codigo
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });

    $response.data = _Entidad;

    if( _Entidad )
    {
        // Departamento
        // Provincia
        if( _Entidad.IdDepartamento )
        {
            var _provs = await provinciaModel.findAll({
                where : {
                    department_id : _Entidad.IdDepartamento
                }
            });
            $response.prov = _provs;
        }
        // Distrito
        if( _Entidad.IdProvincia )
        {
            var _distri = await distrito2Model.findAll({
                where : {
                    province_id : _Entidad.IdProvincia
                }
            });
            $response.dist = _distri;
        }
    }

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('FormaContacto' ,'Indicar como nos conctactó el cliente.').not().isEmpty(),
    check('MotivoSolicitud' ,'Ingrese motivo solicitud.').not().isEmpty(),
    check('IdClienteProv' ,'Seleccione Cliente').not().isEmpty(),
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

    if( req.body.TipoDocCliente == 'RUC' ){
        delete req.body.NroDNI;
    }else{
        delete req.body.NroRUC;
    }

	await fichaInspecCabMode.update(req.body,{
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
    
    $response.item = await fichaInspecCabMode.findOne({
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

	await fichaInspecCabMode.update({
        Estado      : 'Anulado',
        DNIAnulado  : $userData.dni,
        AnuladoPor  : $userData.name,
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
    
    $response.item = await fichaInspecCabMode.findOne({
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
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular','Iniciales'],
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

module.exports = router;
