
// api_sucursales.js

var _NombreDoc = 'api_sucursales';
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
const { errorLogModel } = require('../../dbA');
const { sucursalModel, User, clienteModel } = require('../../db');



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await sucursalModel.findAll({
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
        $response.data = await sucursalModel.findAll({
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
        $response.data = await sucursalModel.findAll({
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

	$response.data = await sucursalModel.findAll({
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
    check('Descripcion' ,'Ingrese nombre de local').not().isEmpty(),
    check('Direccion' ,'Ingrese dirección').not().isEmpty(),
    check('Contacto' ,'Ingrese contacto').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    if( ! req.body.MontoMax ){
        req.body.MontoMax = 0;
    }
    if( ! req.body.MontoImplementos ){
        req.body.MontoImplementos = 0;
    }
    if( ! req.body.MontoIndumentarias ){
        req.body.MontoIndumentarias = 0;
    }
    if( ! req.body.MontoLineaInstitucional ){
        req.body.MontoLineaInstitucional = 0;
    }



	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    // Maximo ID de las sucursales 
    var _idLocalMax = await sucursalModel.max('IdSucursal');
    var _IdSucursal = parseInt( _idLocalMax ) + 1;
    req.body.IdSucursal = _IdSucursal;

    //req.body.UsuarioMod = $userData.dni;
    //req.body.UsuarioModOLI = $userData.name;
    // Id Concar
    var _IdConcar = await sucursalModel.count({
        where : {
            IdClienteProv : req.body.IdClienteProv
        }
    });
    _IdConcar = parseInt( _IdConcar )+1;
    req.body.IdConcar = await pad_with_zeroes( _IdConcar , 4 );
    //
    await sucursalModel.create(req.body)
    .catch(function (err) {
        console.log(_NombreDoc);
        captueError( err.original , req.body );
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await sucursalModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.IdSucursal , 8 );
        _Codigo = 'SUC'+_Codigo;
        await sucursalModel.update({
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

    $response.item = await sucursalModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    $response.data = $response.item;

    $response.IdSucursal = _IdSucursal;

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

    $response.data = await sucursalModel.findOne({
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
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('Descripcion' ,'Ingrese nombre de local').not().isEmpty(),
    check('Direccion' ,'Ingrese dirección').not().isEmpty(),
    check('Contacto' ,'Ingrese contacto').not().isEmpty(),
], async (req,res)=>{
    // uuid
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }


    if( ! req.body.MontoMax ){
        req.body.MontoMax = 0;
    }
    if( ! req.body.MontoImplementos ){
        req.body.MontoImplementos = 0;
    }
    if( ! req.body.MontoIndumentarias ){
        req.body.MontoIndumentarias = 0;
    }
    if( ! req.body.MontoLineaInstitucional ){
        req.body.MontoLineaInstitucional = 0;
    }

    var _Entidad = await sucursalModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    await varDump('#####################################################');
    console.log('actualizar local' + req.params.uuid);
    if( _Entidad )
    {
        varDump('Local si existe para actualizar');
    }else{
        varDump('Local NO existe para actualizar');
    }
    await varDump('#####################################################');
    //console.log();
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Auditoria

    // Id Concar
    if(! req.body.IdConcar )
    {
        //
        var _IdConcar = await sucursalModel.count({
            where : {
                IdClienteProv : req.body.IdClienteProv
            }
        });
        _IdConcar = parseInt( _IdConcar )+1
        req.body.IdConcar = await pad_with_zeroes( _IdConcar , 4 );
        //
    }

    delete req.body.IdSucursal;
	await sucursalModel.update(req.body,{
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
    
    $response.data = await sucursalModel.findOne({
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

	await sucursalModel.update({
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
    
    $response.item = await sucursalModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  DUPLICAR LOCALES                    //
//////////////////////////////////////////////////////////
router.post('/clone_locales', async (req,res)=>{
    // IdCli, Locales => 11,22,33... *, IdCliDestino
    await varDump( req.body );
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _whereData = {};

    var _dataCli = await clienteModel.findOne({
        where : {
            IdClienteProv : req.body.IdCliDestino
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });

    _whereData.IdClienteProv = req.body.IdCli;

    if( req.body.Locales != '*' ){
        var $ids    = req.body.Locales;
		var _arIds  = $ids.split(',');
        _whereData.IdSucursal = { [Op.in] : _arIds };
    }

    var _Sucursales = await sucursalModel.findAll({
        where : _whereData
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    // ********
    $response.where = _whereData;
    $response.data = _Sucursales;
    // ********
    if( _Sucursales )
    {
        // Codigo
        for (let index = 0; index < _Sucursales.length; index++) {
            const rs = _Sucursales[index];
            // Max Id
            var _IdSucursal = await sucursalModel.max('IdSucursal') + 1;
            // Id Concar
            var _IdConcar = await sucursalModel.count({
                where : {
                    IdClienteProv : req.body.IdCliDestino
                }
            });
            _IdConcar = parseInt( _IdConcar )+1;
            _IdConcar = await pad_with_zeroes( _IdConcar , 4 );
            //
            var _uu_id = await renovarToken(); 
            var _insertData = {
                uu_id : _uu_id ,
                IdSucursal     : _IdSucursal ,
                IdClienteProv  : _dataCli.IdClienteProv ,
                nombre_cliente : _dataCli.Razon,
                Descripcion    : rs.Descripcion ,
                Direccion      : rs.Direccion ,
                Referencia : rs.Referencia ,
                Telefono   : rs.Telefono ,
                Contacto   : rs.Contacto ,
                persona_recepcion : rs.persona_recepcion ,
                MailContacto      : rs.MailContacto ,
                Estado      : rs.Estado ,
                Supervisor  : rs.Supervisor ,
                DiaAtencion : rs.DiaAtencion ,
                NroPersonalAsig : rs.NroPersonalAsig ,
                MontoMax    : rs.MontoMax ,
                IdUbigeo    : rs.IdUbigeo ,
                ubigeo      : rs.ubigeo ,
                Pais        : rs.Pais ,
                Departamento    : rs.Departamento ,
                Provincia       : rs.Provincia ,
                Distrito        : rs.Distrito ,
                TipoDir         : rs.TipoDir ,
                NombreCalle     : rs.NombreCalle ,
                NroCalle        : rs.NroCalle ,
                OtrosCalle      : rs.OtrosCalle ,
                Urbanizacion    : rs.Urbanizacion ,
                MontoImplementos        : rs.MontoImplementos ,
                MontoIndumentarias      : rs.MontoIndumentarias ,
                MontoLineaInstitucional : rs.MontoLineaInstitucional ,
                lat : rs.lat ,
                lng : rs.lng ,
                IdConcar : _IdConcar
            };
            await sucursalModel.create(_insertData);
        }
    }
    
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