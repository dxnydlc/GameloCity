// api_utilidades.js

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
const { utilidadesModel31,User } = require('../../db31');
// const { utilidadesModel,User } = require('../../db');



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    
	$response.data = await utilidadesModel31.findAll({
        order : [
            ['IdMovilidad' , 'DESC']
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
    // DNI, Fecha Inicio, Fecha Fin
   
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    
    if( req.body.DNI != '' ){
        $where.IdEmpleado = req.body.DNI;
        
    }else{
        if(req.body.FechaI && req.body.FechaF){
            $where.Fecha = { [Op.gte ]: req.body.FechaI,[Op.lte ]: req.body.FechaF };
        }else{
            if(req.body.FechaI){
                req.body.FechaF =  moment().format('YYYY-MM-DD');
                $where.Fecha = { [Op.gte ]: req.body.FechaI,[Op.lte ]: req.body.FechaF };
            }
    
            if(req.body.FechaF){                
                $where.Fecha = {[Op.lte ]: req.body.FechaF };
           
            }
        }
 
      
    }

    $response.data = await utilidadesModel31.findAll({
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

	$response.data = await utilidadesModel31.findAll({
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
    check('IdEmpleado' ,'Seleccione Usuario').not().isEmpty(),
    check('IdCliente' ,'Seleccione Cliente').not().isEmpty(),
    check('Direccion' ,'Seleccione Direccion').not().isEmpty(),
    check('Fecha' ,'Ingrese estado Fecha').not().isEmpty(),
    check('Hora' ,'Ingrese estado Hora').not().isEmpty(),
    check('Npersonas' ,'Seleccione Número de personas').not().isEmpty(),
    
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
   
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    var $FechaMod       =  moment().format('YYYY-MM-DD HH:mm:ss');
    
    req.body.IdUsuarioMod = $userData.dni;
    req.body.UsuarioMod = $userData.name;    
    req.body.FechaMod   = $FechaMod;
    req.body.Estado = 'Digitado';

    if(req.body.Sdejar == 'SI'){
        req.body.dejyrec = 'NO';
        req.body.Recojo = 'NO';
        req.body.Espera = 'NO';
    }
    if(req.body.dejyrec == 'SI'){
        req.body.Sdejar = 'NO';
        req.body.Recojo = 'NO';
        req.body.Espera = 'NO';
    }
    if(req.body.Recojo == 'SI'){
        req.body.dejyrec = 'NO';
        req.body.dejyrec = 'NO';
        req.body.Espera = 'NO';
    }
    if(req.body.Espera == 'SI'){
        req.body.Sdejar = 'NO';
        req.body.dejyrec = 'NO';
        req.body.Recojo = 'NO';
    }
    
    var IdMovilidad = await utilidadesModel31.max('IdMovilidad') + 1;
    req.body.IdMovilidad = IdMovilidad;
    await utilidadesModel31.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    var _dataGuardado = await utilidadesModel31.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    if( _dataGuardado ){
   
        var _Codigo = await pad_with_zeroes( _dataGuardado.IdMovilidad , 8 );
        _Codigo = 'MOV'+_Codigo;
    
        await utilidadesModel31.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
    }

    $response.item = await utilidadesModel31.findOne({
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

    $response.data = await utilidadesModel31.findOne({
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
    check('IdEmpleado' ,'Seleccione Usuario').not().isEmpty(),
    check('IdCliente' ,'Seleccione Cliente').not().isEmpty(),
    check('Direccion' ,'Seleccione Direccion').not().isEmpty(),
    check('Fecha' ,'Ingrese estado Fecha').not().isEmpty(),
    check('Hora' ,'Ingrese estado Hora').not().isEmpty(),
    check('Npersonas' ,'Seleccione Número de personas').not().isEmpty(),
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
    var $FechaMod           =  moment().format('YYYY-MM-DD HH:mm:ss');
    req.body.IdUsuarioMod = $userData.dni;
    req.body.UsuarioMod = $userData.name;   
    req.body.FechaMod   = $FechaMod;

    if(!req.body.Fecha){
        delete req.body.Fecha;
    }

	await utilidadesModel31.update(req.body,{
		where : { 
            uu_id : req.body.uu_id 
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    $response.item = await utilidadesModel31.findOne({
        where : {
            uu_id : req.body.uu_id
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
    //req.body.DNIAnulado = $userData.dni;
   // req.body.AnuladoPor = $userData.name;

    $anuladoPor = $userData.name;
    
	await utilidadesModel31.update({
        Estado      : 'Anulado',
        
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await utilidadesModel31.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
//////////////////////////////////////////////////////////
//                  APROBAR DOCUMENTO                   //
//////////////////////////////////////////////////////////
router.post('/aprobar', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var $userData = await getUserData( req.headers['api-token'] );
    var $FechaMod           =  moment().format('YYYY-MM-DD HH:mm:ss');
   
    await utilidadesModel31.update({
        IdUsuarioMod: $userData.dni,
        UsuarioMod  : $userData.name,
        FechaMod    : $FechaMod,
        Estado      : 'Aprobado',

    },{
        where : {
            uu_id : req.body.uuid
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
    //req.body.DNIAnulado = $userData.dni;
   // req.body.AnuladoPor = $userData.name;

    $anuladoPor = $userData.name;
    
	await utilidadesModel31.update({
        Estado      : 'Anulado',
        
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await utilidadesModel31.findOne({
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