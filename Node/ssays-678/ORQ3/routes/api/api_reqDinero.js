// api_reqDinero.js

var _NombreDoc = 'api_reqDinero';
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
const { dineroModel,User, areaModel, archiGoogleModel, aprobacionesModel } = require('../../db');


//////////////////////////////////////////////////////////
//   	OBTENER ULTIMOS 100 POR USUARIO(solicitane)     //
//////////////////////////////////////////////////////////
router.get('/buscarSolicitante',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $userData = await getUserData( req.headers['api-token'] );
    console.log("ENTRA");
    console.log($userData.dni);
    
	$response.data = await dineroModel.findAll({
        where : {
            Estado : 'Digitado',
            Solicitante : $userData.dni,
            Atendido : 1,
        },
        order : [
            ['IdReqDinero' , 'DESC']
        ],
        limit : 100
    });
    res.json( $response );
});

//////////////////////////////////////////////////////////
//      	OBTENER ULTIMOS 100 Archivos Adjunto        //
//////////////////////////////////////////////////////////
router.get('/:token',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    //console.log(req.params.token);
	$response.data = await archiGoogleModel.findAll({
        where : {
            //Estado : 'Activo',
            Token : req.params.token
        },
        order : [
            ['id' , 'DESC']
        ],
        limit : 100
    });
    res.json( $response );
});

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $userData = await getUserData( req.headers['api-token'] );
    
	$response.data = await dineroModel.findAll({
        where : {
            Solicitante : $userData.dni
        },
        order : [
            ['IdReqDinero' , 'DESC']
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
    // Motivo
    var $userData    = await getUserData( req.headers['api-token'] );
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    
    if( req.body.Motivo != '' ){
        // Buscamos por codigo
        $where.Motivo = { [Op.like] : '%'+req.body.Motivo+'%' }
        $where.Solicitante = $userData.dni
        //
        $response.data = await dineroModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
    }
        $response.data = await dineroModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
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

	$response.data = await dineroModel.findAll({
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
    check('Jefe' ,'Seleccione Jefe').not().isEmpty(),
    check('Area' ,'Ingrese Area').not().isEmpty(),
    check('CentroCosto' ,'Seleccione Centro de Costo').not().isEmpty(),
    check('TipoDisposicion' ,'Seleccione Tipo de Disposicion').not().isEmpty(),
   
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response    = {};
    $response.estado = 'OK';
    $response.data   = {};
    var $userData    = await getUserData( req.headers['api-token'] );

   
    var fecha = moment().format('YYYY-MM-DD');
    req.body.Fecha = fecha;
    

    req.body.Solicitante     = $userData.dni;
    req.body.usuario_comercial = $userData.name;
    req.body.Estado = "Digitado";

    
    await dineroModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    

    var _dataGuardado = await dineroModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    console.log(_dataGuardado.IdReqDinero);
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.IdReqDinero , 8 );
        _Codigo = 'RD'+_Codigo;
        await dineroModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
        console.log(_Codigo);
    }

    

    // Marcando archivos 
    if( $response.item ){
        // Marcando archivos...
        await archiGoogleModel.update({
            correlativo : $response.item.IdReqDinero
        },{
            where  : {
                token   : $response.item.uu_id,
                modulo  : 'INTRANET',
                formulario : 'ARCHIVO_REQ_DINERO'
            }
        })
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
    }

    $response.item = await dineroModel.findOne({
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

    $response.data = await dineroModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO - Motivo       //
//////////////////////////////////////////////////////////
router.put('/motivo/:uuid', [
   // check('Jefe' ,'Seleccione Jefe').not().isEmpty(),
], async (req,res)=>{
    // uuid
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    //console.log("update motivo");
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    
        delete req.body.IdReqDinero;
       // console.log(req.body);
    console.log("motivo");
    req.body.Estado = 'Anulado';
	await dineroModel.update(req.body,{
        
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
    
    $response.item = await dineroModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('Jefe' ,'Seleccione Jefe').not().isEmpty(),
    check('Area' ,'Ingrese Area').not().isEmpty(),
    check('CentroCosto' ,'Seleccione Centro de Costo').not().isEmpty(),
    check('TipoDisposicion' ,'Seleccione Tipo de Disposicion').not().isEmpty(),
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

    
        delete req.body.IdReqDinero;
        console.log(req.body);

	await dineroModel.update(req.body,{
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
    
    $response.item = await dineroModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                  CAMBIAR ESTADO DOCUMENTO                  //
//////////////////////////////////////////////////////////
router.delete('/atendido/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
   // req.body.DNIAnulado = $userData.dni;
   // req.body.AnuladoPor = $userData.name;

    //$anuladoPor = $userData.name;
    console.log('Aprobado');
    console.log(req.params);

    var Permiso = await aprobacionesModel.findOne({
        where : {
            IdTipoDoc : 25,
            IdUser    : $userData.dni,
            aprobar    : 'SI'
        }
    });

    if(! Permiso ){
        $response.estado = 'ERROR';
        $response.error  = 'Su usuario no cuenta con los permisos para realizar esta acción';
        return res.json( $response );
    }
	await dineroModel.update({
        Estado      : 'Aprobado'
        
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await dineroModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});

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
   // req.body.DNIAnulado = $userData.dni;
   // req.body.AnuladoPor = $userData.name;
    console.log('Eliminado');
    console.log(req.params);
    $anuladoPor = $userData.name;

	await dineroModel.update({
        Estado      : 'Anulado',
        
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await dineroModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                   BORRAR ADJUNTO                     //
//////////////////////////////////////////////////////////
router.post('/del_file', async (req,res)=>{
    // uuid

    console.log(req.body);
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _Editad = await archiGoogleModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
   
    if( _Editad ){
        await archiGoogleModel.destroy({
            where : {
                uu_id : req.body.uuid
            }
        });
    }
    // Listar los demas archivos
    $response.data = await archiGoogleModel.findAll({
        where : {
            token   : _Editad.token,
            modulo  : 'INTRANET',
            formulario : 'ARCHIVO_REQ_DINERO'
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------
async function captueError( error , post )
{
    var _envio       = JSON.stringify(post);
    var _descripcion = JSON.stringify(error);
    var _uuid = await renovarToken();
    await errorLogModel.create({
        uu_id : _uuid,
        modulo : 'api_reqDinero',
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