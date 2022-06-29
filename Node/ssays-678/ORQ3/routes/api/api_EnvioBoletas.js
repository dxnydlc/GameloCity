// api_EnvioBoletas.js
var _NombreDoc = 'api_EnvioBoletas';

const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();
// >>>>>>>>>>>>> ------    SPARKPOST   ------ >>>>>>>>>>>>>
const SparkPost = require('sparkpost');
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET);

var validatorCorreo = require("email-validator");

// >>>>>>>>>>>>> ------    MOMENT      ------ >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');
// >>>>>>>>>>>>> ------    NEXMO       ------ >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);
// >>>>>>>>>>>>> ------    NEXMO       ------ >>>>>>>>>>>>>

// WHATSAPP
const config = require("./whatsapp.js");
const tokenWS = config.token, apiUrlWS = config.apiUrl;
const fetch = require('node-fetch');
var _LogoSSAYS = 'https://api2.ssays-orquesta.com/logo-ssays-2019-2.png';

// LEER EXCEL
const reader = require('xlsx');


// TELEGRAM
const { Telegraf, Scenes , Stage, session } = require('telegraf');
const _telegramToken = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf( _telegramToken );







// Modelos
const { errorLogModel } = require('../../dbA');
const { telegramModel, telegramChatModel, envioBoletaCabModel, User, envioBoletaDetModel , sucursalModel, sequelize } = require('../../db');

// Plantillas Mail
const { mail_boleta } = require( './mail_plantillas' );

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
envioBoletaCabModel.belongsTo( envioBoletaDetModel ,{
	as : 'BoletaItems', foreignKey : 'Codigo',targetKey: 'CodigoEnvio',
});
envioBoletaDetModel.belongsTo( envioBoletaCabModel ,{
	as : 'BoletaItems2', foreignKey : 'CodigoEnvio',targetKey: 'Codigo',
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// -------------------------------------------------------
async function tablaDetalle( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `Nombre`;

    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" getItem btn btn-block btn-primary btn-xs">E</button>') , 'Editar' ];
    var _pdfItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" verPDF btn btn-block btn-primary btn-xs">Ver</button>') , 'PDF' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" delEnvio btn btn-block btn-danger btn-xs">X</button>') , 'Anular' ];

    var _atributos = [
        _editItem,
        _pdfItem,
        _DelItem,
        'Archivo',
        'DNI',
        'Nombre',
        'Email', 
        'Celular' ,
        [ 'Resultado','Env.Correo' ],
        [ 'ResultadoCelular' , 'Env.Celular' ],
        'Estado',
        [ 'Visto', 'Visualizado'],
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('FechaVisto') , _fechaLatFormat ) , 'Fec.Visto'], 
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'], 
    ];
    //
    _dataResp = await envioBoletaDetModel.findAll({
        attributes : _atributos ,
        order : [
            ['id' , 'DESC']
        ],
        where : _where,
        limit : _limit
    });
    return _dataResp;
    //
}
// -------------------------------------------------------



//////////////////////////////////////////////////////////
//              DASHBOARD INTRANET OPERARIO             //
//////////////////////////////////////////////////////////
router.post('/dashboard', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    var $userData = await getUserData( req.headers['api-token'] );

    var _dataUser = await User.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });

    if( _dataUser )
    {
        //
        $response.DNI = _dataUser.dni;

        // Buscamos por DNI
       /* var NroBoletas = await envioBoletaDetModel.count({
            where : {
                CodigoEnvio : { [Op.ne] : '0' },
                DNI : _dataUser.dni,
                Categoria : 'Boleta'
            }
        });
        */
        var NroBoletas = await envioBoletaCabModel.count({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : {
                Categoria : 'Boleta'
            },
            include: [{
                model: envioBoletaDetModel,
                as: 'BoletaItems',
                where : {
                    DNI : _dataUser.dni,
                }
            }]
        });

        $response.NroBoletas = NroBoletas;
        
        var NroVistos = await envioBoletaDetModel.count({
            where : {
                CodigoEnvio : { [Op.ne] : '0' },
                DNI : _dataUser.dni,
                Visto : 'SI'
            }
        });
        $response.NroVistos = NroVistos;
        $response.NroVistos = NroVistos;
    
        //
    }

        
    res.json( $response );
});

// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/periodos', async (req,res)=>{
    // dni
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
   // var $where = {};
    //console.log(req.body);
    /*var NroBoletas = await envioBoletaDetModel.findAll({
        where : {
            CodigoEnvio : { [Op.ne] : '0' }, // diferente de 0
            DNI : req.body.dni
        },
        group: 'CodigoEnvio'
    });
    console.log(NroBoletas);
    console.log('NroBoletas.length-1: ');
    console.log(NroBoletas.length);
    for(var i = 0; i < NroBoletas.length-1; i++){
        var rs = NroBoletas[i];

        console.log(rs.CodigoEnvio);
        
    }
    */
    $response.data = await envioBoletaCabModel.findAll({
        order : [
            ['Mes' , 'DESC']
        ],
       /* where : {
            Categoria : 'Boleta'
        },*/
        include: [{
            model: envioBoletaDetModel,
            as: 'BoletaItems',
            where : {
                DNI : req.body.dni
            }
        }]
    });
    // Buscamos por DNI
   
   /* $response.data = await envioBoletaCabModel.findAll({
        order: [
            ['Mes', 'ASC']
        ],
        where: {
            Estado : 'Activo'
        },
        group: 'Mes',
        include: [{
            model: envioBoletaDetModel,
            as: 'BoletaItems',
            where : {
                DNI : req.body.dni
            }
        }]
    });

    */
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
    
	$response.data = await envioBoletaCabModel.findAll({
        order : [
            ['Codigo' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // dni, nombre, area, cliente, local, mes, anio
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {}, $where2 = {};

    if( req.body.dni ){
        // Buscamos por ID
        $where2.DNI = req.body.dni;
        //
    }
    if( req.body.nombre ){
        // Buscamos por nombre
        $where2.Nombre = { [Op.like] : '%'+req.body.nombre+'%' }
        //
    }
    // Cliente
    if( req.body.cliente ){
        $where.IdCliente = req.body.cliente;
    }
    // Local
    if( req.body.local ){
        $where.IdLocal = req.body.local;
    }
    // Area
    if( req.body.area ){
        
        $where.IdArea = req.body.area;
    }
    // Mes
    if( req.body.mes ){
        
        $where.Mes = req.body.mes;
    }
    // Anio
    if( req.body.anio ){
        $where.Anio = req.body.anio;
    }
    // Anio
    if( req.body.categoria ){
        $where.Categoria = req.body.categoria;
    }
 
    $response.data = await envioBoletaCabModel.findAll({
        order : [
            ['Codigo' , 'DESC']
        ],
        where : $where,
        include: [{
            model: envioBoletaDetModel,
            as: 'BoletaItems',
            where : $where2,
        }]
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

	$response.data = await envioBoletaCabModel.findAll({
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


    if(req.body.IdLocal == '' ){
        delete req.body.IdLocal;
    }
    if(req.body.IdArea == '' ){
        delete req.body.IdArea;
    }

    req.body.DNICreado = $userData.dni;
    req.body.CreadoPor = $userData.name;
    //
    await envioBoletaCabModel.create(req.body)
    .catch(function (err) {
        captueError( err.original , req.body );
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await envioBoletaCabModel.findOne({
        where  : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado )
    {
        // Nro de items
        const NroItems = await envioBoletaDetModel.count({
            where: {
                Token : req.body.uu_id
            }
        });
        var _Codigo = 'EB'+await pad_with_zeroes( _dataGuardado.id , 6 );
        await envioBoletaCabModel.update({
            Codigo : _Codigo,
            NroBoletas : NroItems
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
        // Unir detalle...
        await envioBoletaDetModel.update({
            CodigoEnvio : _Codigo
        },{
            where  : {
                Token : req.body.uu_id
            }
        });
    }

    $response.item = await envioBoletaCabModel.findOne({
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
    $response.detalle = [];
    $response.locales = [];

    var _Entidad = await envioBoletaCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = _Entidad;
    if( _Entidad ){
        // Detalle
        var _detalle = await envioBoletaDetModel.findAll({
            where : {
                CodigoEnvio : _Entidad.Codigo
            }
        });
        $response.detalle = _detalle;
        // Locales
        var _Locales = await sucursalModel.findAll({
            where : {
                IdClienteProv : _Entidad.IdCliente
            }
        });
        $response.locales = _Locales;
    }
    
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

    if(req.body.IdLocal == '' ){
        delete req.body.IdLocal;
    }
    if(req.body.IdArea == '' ){
        delete req.body.IdArea;
    }

    const NroItems = await envioBoletaDetModel.count({
        where: {
            Token : req.params.uuid 
        }
    });
    varDump(`Hay ${NroItems} boletas en este documento.`);
    req.body.NroBoletas = NroItems;
	await envioBoletaCabModel.update(req.body,{
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
    
    $response.item = await envioBoletaCabModel.findOne({
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

	await envioBoletaCabModel.update({
        Estado      : 'Anulado',
        DNIAnulado  : $userData.dni,
        AnuladoPor  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await envioBoletaCabModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                      AGREGAR ITEM                    //
//////////////////////////////////////////////////////////
router.post('/item/add', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    await envioBoletaDetModel.create( req.body )
    .catch(function (err){
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await envioBoletaDetModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    $response.data = await envioBoletaDetModel.findAll({
        where : {
            uu_id : req.body.uu_id
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                      ACTUALIZAR ITEM                 //
//////////////////////////////////////////////////////////
router.post('/item/update', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    await envioBoletaDetModel.update(req.body,{
		where : { 
            uu_id : req.body.uu_id 
        }
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await envioBoletaDetModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    $response.data = await envioBoletaDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                      ELIMINAR ITEM                   //
//////////////////////////////////////////////////////////
router.post('/item/del', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    await envioBoletaDetModel.destroy({
		where : { 
            uu_id : req.body.uuid 
        }
    })
    .catch(function (err) {
       // console.log(err);
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.data = await envioBoletaDetModel.findAll({
        where : {
            Token : req.body.token
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR ITEM                    //
//////////////////////////////////////////////////////////
router.post('/item/get', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await envioBoletaDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                      TRAER ITEMS                     //
//////////////////////////////////////////////////////////
router.post('/item/all', async (req,res)=>{
    // token
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        _response.estado = 'OK';
        _response.data = [];

        _response.data = await tablaDetalle( { Token : req.body.token } , 1000  );

    } catch (error) {
        varDump(error);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }
    return res.status(_response.codigo).json( _response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                      TRAER ITEMS JSON                     //
//////////////////////////////////////////////////////////
router.post('/item/json', async (req,res)=>{
    // token
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        _response.estado = 'OK';
        _response.data = [];

        _response.data = await envioBoletaDetModel.findAll({
            order : [
                ['id' , 'DESC']
            ],
            where : { Token : req.body.token },
        });

    } catch (error) {
        varDump(error);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }
    return res.status(_response.codigo).json( _response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                      CARGAR UN ITEM                  //
//////////////////////////////////////////////////////////
router.post('/item/get', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await envioBoletaCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ENVIAR BOLETAS                      //
//////////////////////////////////////////////////////////
router.post('/enviar', async (req,res)=>{
    // uuid (del documento)
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _Entidad = await envioBoletaCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    if( _Entidad )
    {
        var _Detalles = await envioBoletaDetModel.findAll({
            where : {
                Estado : 'Cargado',
                CodigoEnvio : _Entidad.Codigo
            }
        });
       
        for (let index = 0; index < _Detalles.length; index++) {
            var rs = _Detalles[index], _Resultado = 'Error';
            //console.log( '>>>>>>>>>>>> DNI a enviar: '+rs.DNI );
            var _Usuario = await User.findOne({
                where : {
                    dni : rs.DNI
                }
            });
            // CREAR UUID
            var _uuIDUsuario = await renovarToken();
            if(! _Usuario.uu_id ){
               // console.log(`Usuario no tienen uuid, creando...`);
                await User.update({
                    uu_id : _uuIDUsuario
                },{
                    where : {
                        id : _Usuario.id
                    }
                });
            }else{
                _uuIDUsuario = _Usuario.uu_id;
            }
            // API-TOKEN
            var _ApiTokenUsuario = await renovarToken();
            if(! _Usuario.api_token ){
                console.log(`Usuario no tienen api-token, creando...`);
                await User.update({
                    api_token : _ApiTokenUsuario
                },{
                    where : {
                        id : _Usuario.id
                    }
                });
            }
            // Link en bitly
            var $url = process.env.MODULO_LND+'boletas/login/'+_uuIDUsuario, _urlBirly = '';
            // >>>>>>>>>>>>>> BITLY
            try{
                await bitly
                .shorten($url)
                .then(function(result) {
                    _urlBirly = result.link;
                })
                .catch(function(error) {
                    console.error(error);
                    _urlBirly = $url;
                });
            }catch( error ){
                console.log(error);
                _urlBirly = $url;
            }
            // >>>>>>>>>>>>>> BITLY
            if( rs.Email ){
                var _Asunto = 'Envío de boleta '+_Entidad.Mes+'-'+_Entidad.Anio;
                // 000000000000000000000000000000000000000000000000
                var _htmlBody = mail_boleta( 
                    _Asunto , 
                    `Enviamos su ${_Entidad.Categoria} del periodo ${_Entidad.Mes}-${_Entidad.Anio}.` ,
                    _Entidad ,
                    _Usuario ,
                    _urlBirly
                );
                // 000000000000000000000000000000000000000000000000
                // :TODO validar email
                var _emailCorrecto = validatorCorreo.validate(rs.Email); // true
                if( _emailCorrecto )
                {
                    //
                    await clientMail.transmissions.send({
                        options: {
                            //sandbox: true
                        },
                        content: {
                            from : {
                                name  : 'Robot de Orquesta',
                                email : 'robot@ssays-orquesta.com'
                            },
                            subject : _Asunto,
                            html    : _htmlBody
                        },
                        recipients : 
                            [
                                { address : rs.Email }
                            ]
                    })
                    .then( async data => {
                        console.log('Envio de boletas, envio correcto: '+rs.Email);
                        var _Aceptados = parseInt(data.results.total_accepted_recipients);
                        
                        if( _Aceptados > 0 ){
                            console.log('Entra: ');
                            var _Resultado = 'Enviado Mail '+data.results.id;
                            console.log('_Resultado: ');
                            console.log(_Resultado);
                            // --------------------------------
                            await envioBoletaDetModel.update({
                                Resultado : _Resultado , Estado : 'Enviado'
                            },{ where : { uu_id : rs.uu_id } });
                            // --------------------------------
                        }
                    
                    })
                    .catch(err => {
                        console.log('Envio de boletas, fallo al enviar correo: '+rs.Email);
                        console.log(err);
                    });
                    //
                }
            }
            // Ahora enviamos el mensaje de texto
            if( rs.Celular )
            {
                var $celular = rs.Celular;
                if( $celular.length == 9 )
                {
                    const from = 'SSAYS SAC';
                    var to   = '51'+$celular;
                    var _Asunto = `SSAYS SAC, se envía su boleta correspondiente al periodo: *${_Entidad.Mes}-${_Entidad.Anio}* para poder revisarlo ingrese al link ${_urlBirly}, si presenta algún inconveniente por favor envie un correo con captura de pantalla al correo soporte@ssays-orquesta.com.`

                    // Enviar WhatsApp
                   // console.log(`WhatsApp a: ${rs.Nombre}-${rs.DNI}_`);
                    var categoria;
                    switch (_Entidad.Categoria){
                        case 'Boleta':
                            categoria = 'Tu Boleta';
                        break;
                        case 'CTS':
                            categoria = 'Tu Boleta CTS';
                        break;
                        case 'Gratificación':
                            categoria = 'Tu Boleta de Gratificación';
                        break;
                        case 'Liquidación':
                            categoria = 'Tu Liquidación';
                        break;
                    }
                    var texto1 = `
Departamento de RRHH SSAYS SAC,
Hola *${rs.Nombre}*, es grato saludarte para informar que hemos cargado ${categoria} del periodo *${_Entidad.Mes}-${_Entidad.Anio}* para ingresar debes
colocar tu número de dni en la plataforma ${_urlBirly}, recuerda que si tienes dudas y/o observaciones por favor hacerlas llegar al correo: consultas.rrhh@ssays-orquesta.com
Si no puede visualizar los links correctamente, por favor agrega este número a tus contactos,
Si consideras que esto es un error o ya no deseas que te enviemos mensajes por favor escribe la palabra *salir*. gracias por su atención.
                    `;
                    // Enviando texto
                    var _envioCel = await apiChatApi( 'sendMessage', { phone : to , body: texto1 });
                    console.log(_envioCel);
                    try {
                        if( _envioCel.sent )
                        {
                            // --------------------------------
                            var _Resultado = _envioCel.id ;//'Enviado Celular '+$celular;
                            // --------------------------------
                            await envioBoletaDetModel.update({
                                ResultadoCelular : _Resultado , Estado : 'Enviado'
                            },{ where : { uu_id : rs.uu_id } });
                            // --------------------------------
                            console.log(`Envio de boletas: enviando al celular: ${$celular}.`);
                        }
                    } catch (error) {
                    }
                }
            }
        } // FOR
        // Actualizar Nro de enviados
        var _NroEnvios = await envioBoletaDetModel.count({
            where: {
                CodigoEnvio : _Entidad.Codigo ,
                Resultado : { [Op.not]: null }
            }
        });
        //console.log( 'Se enviaron => '+_NroEnvios );
      
        await envioBoletaCabModel.update({
            NroEnvios : _NroEnvios,
            Estado: 'Enviado'
        },{
            where : { uu_id : _Entidad.uu_id }
        });
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/marcado', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _Entidad = await envioBoletaDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = _Entidad;
    if( _Entidad ){
        await envioBoletaDetModel.update({
            Estado      : 'Visualizado',
            Visto       : 'SI' , 
            FechaVisto  : moment().format('YYYY-MM-DD HH:mm:ss')
        },{ where : { uu_id : _Entidad.uu_id } });
        $response.data = [ 'marcado' , 'SI' ];
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//         MOSTRAR BOLETA DE UN PERIODO/AÑO/DNI         //
//////////////////////////////////////////////////////////
router.post('/mostrar/boleta', async (req,res)=>{
    // mes, anio
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var $userData = await getUserData( req.headers['api-token'] );
    $response.user = $userData;
  
    /*$response.data = await envioBoletaCabModel.findOne({
        where : {
            Mes  : req.body.mes ,
            Anio : req.body.anio
        },
        include: [{
            model : envioBoletaDetModel,
            as    : 'BoletaItems',
            where : {
                DNI : $userData.dni,
                uu_id : req.body.uuid
            }
        }],
        order : [
            [ 'id' , 'DESC' ]
        ]
    });


*/



    $response.data = await envioBoletaCabModel.findOne({
       
        where : {
            Mes  : req.body.mes ,
            Anio : req.body.anio
        },
        include: [{
            model: envioBoletaDetModel,
            as: 'BoletaItems',
            where : {
                uu_id : req.body.uuid
            }
        }]
    });

    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              IMPORTAR DATOS DE PERSONAL              //
//////////////////////////////////////////////////////////
router.post('/importar_personal', async (req,res)=>{
    // uuid, token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.detalle = [];
    $response.locales = [];

    var _Archivo = await archiGoogleModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.file = _Archivo;

    if( _Archivo ){
        // Reading our test file
        const file = reader.readFile( _Archivo.ruta_fisica );
        let data = [];
        const sheets = file.SheetNames
        
        for(let i = 0; i < sheets.length; i++)
        {
            const temp = reader.utils.sheet_to_json(
                    file.Sheets[file.SheetNames[i]])
            temp.forEach( async (res) => {
                var _usuario = await User.findOne({
                    where : {
                        dni : res.DNI
                    }
                });
                var _datUseUpdt = {};
                if( _usuario )
                {
                    // Actualizamos data de usuario
                    _datUseUpdt.nombre      = res.Nombre;
                    _datUseUpdt.apellidop   = res.Paterno;
                    _datUseUpdt.apellidom   = res.Materno;
                    _datUseUpdt.celular     = res.Celular;
                    _datUseUpdt.emailalternativo = res.Correo;
                    _datUseUpdt.uu_id       = await renovarToken();
                    await User.update(_datUseUpdt , {
                        where : {
                            dni : res.DNI
                        }
                    })
                    .catch(function (err) {
                        console.log(_NombreDoc);
                        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
                    });
                }else{
                    // Agregamos el usuario
                    _datUseUpdt.nombre      = res.Nombre;
                    _datUseUpdt.apellidop   = res.Paterno;
                    _datUseUpdt.apellidom   = res.Materno;
                    _datUseUpdt.celular     = res.Celular;
                    _datUseUpdt.emailalternativo = res.Correo;
                    _datUseUpdt.email    = await renovarToken()+'@ssays.com.pe';
                    _datUseUpdt.uu_id    = await renovarToken();
                    _datUseUpdt.password = 'CHOMBO';
                    _datUseUpdt.dni      = res.DNI;
                    await User.create( _datUseUpdt )
                    .catch(function (err) {
                        console.log(_NombreDoc);
                        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
                    });
                }
                var _Insertar = {};
                _Insertar.DNI       = res.DNI;
                _Insertar.Nombre    = res.Nombre+' '+res.Paterno+' '+res.Materno;
                _Insertar.Email     = res.Correo;
                _Insertar.Celular   = res.Celular;
                _Insertar.Token     = _Archivo.token;
                data.push(res);
                await capacitacionDetModel.update( _Insertar , {
                    where : {
                        DNI : res.DNI ,
                        Token : req.body.token
                    }
                })
                .catch(function (err) {
                    console.log(_NombreDoc);
                    $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
                });
            })
        }
        // Printing data
        // console.log(data);
        $response.token = _Archivo.token;

        $response.data = await capacitacionDetModel.findAll({
            where : {
                Token : _Archivo.token
            }
        });
    }
    
    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//       ACTUALIZAR DATOS DE LOS USUARIOS EN LISTA      //
//////////////////////////////////////////////////////////
router.post('/update_usuarios_data', async (req,res)=>{
    // Token, IdFile
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
  
    var _dataOperarios = await envioBoletaDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
   
    for (let index = 0; index < _dataOperarios.length; index++)
    {
        const _rs = _dataOperarios[index];
        // -- //
        var dataUsuario = await User.findOne({
            where : {
                dni : _rs.DNI
            }
        });
        // -- //
   
        if( dataUsuario ){
            //console.log('entra 2: ');
            var _insertDetalle = {};
            _insertDetalle.Nombre  = dataUsuario.name;
            _insertDetalle.Email   = dataUsuario.emailalternativo;
            _insertDetalle.Celular = dataUsuario.celular;
            await envioBoletaDetModel.update( _insertDetalle , {
                where : {
                    id : _rs.id
                }
            });
        }
        // . //
    }
    
    $response.data = await envioBoletaDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    });
  
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//               ENVIAR ITEM BOLETA BY UUID             //
//////////////////////////////////////////////////////////
router.post('/send_item_boleta', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        var _Entidad = await envioBoletaDetModel.findOne({
            where : {
                Estado : 'Cargado',
                uu_id  : req.body.uuid
            }
        });
        //
        if( _Entidad )
        {
            // Data encabezado
            var _DataCab = await envioBoletaCabModel.findOne({
                where : {
                    Codigo : _Entidad.CodigoEnvio
                }
            });
            var rs = _Entidad , _Resultado = 'Error';
            // console.log( '>>>>>>>>>>>> DNI a enviar: '+rs.DNI ); //
            var _Usuario = await User.findOne({
                where : {
                    dni : rs.DNI
                }
            });
            // CREAR UUID
            var _uuIDUsuario = await renovarToken();
            if(! _Usuario.uu_id ){
               // console.log(`Usuario no tienen uuid, creando...`);
                await User.update({
                    uu_id : _uuIDUsuario
                },{
                    where : {
                        id : _Usuario.id
                    }
                });
            }else{
                _uuIDUsuario = _Usuario.uu_id;
            }
            // API-TOKEN
            var _ApiTokenUsuario = await renovarToken();
            if(! _Usuario.api_token ){
                console.log(`Usuario no tienen api-token, creando...`);
                await User.update({
                    api_token : _ApiTokenUsuario
                },{
                    where : {
                        id : _Usuario.id
                    }
                });
            }
            // Link en bitly
            var $url = process.env.MODULO_LND+'boletas/login/'+_uuIDUsuario, _urlBirly = '';
            // >>>>>>>>>>>>>> BITLY
            if( rs.Email ){
                var _Asunto = 'Envío de boleta '+_DataCab.Mes+'-'+_DataCab.Anio;
                // 000000000000000000000000000000000000000000000000
                var _htmlBody = mail_boleta( 
                    _Asunto , 
                    `Enviamos su ${_DataCab.Categoria} del periodo ${_DataCab.Mes}-${_DataCab.Anio}.` ,
                    _DataCab ,
                    _Usuario ,
                    $url
                );
                // 000000000000000000000000000000000000000000000000
                // :TODO validar email
                var _emailCorrecto = validatorCorreo.validate(rs.Email); // true
                if( _emailCorrecto )
                {
                    //
                    await clientMail.transmissions.send({
                        options: {
                            //sandbox: true
                        },
                        content: {
                            from : {
                                name  : 'Robot de Orquesta',
                                email : 'robot@ssays-orquesta.com'
                            },
                            subject : _Asunto,
                            html    : _htmlBody
                        },
                        recipients : 
                            [
                                { address : rs.Email }
                            ]
                    })
                    .then( async data => {
                        console.log('Envio de boletas, envio correcto: '+rs.Email);
                        var _Aceptados = parseInt(data.results.total_accepted_recipients);
                        
                        if( _Aceptados > 0 ){
                            console.log('Entra: ');
                            var _Resultado = 'Enviado Mail '+data.results.id;
                            console.log('_Resultado: ');
                            console.log(_Resultado);
                            // --------------------------------
                            await envioBoletaDetModel.update({
                                Resultado : _Resultado , Estado : 'Enviado'
                            },{ where : { uu_id : rs.uu_id } });
                            // --------------------------------
                        }
                    
                    })
                    .catch(err => {
                        console.log('Envio de boletas, fallo al enviar correo: '+rs.Email);
                        console.log(err);
                    });
                    //
                }
            }
            // Enviams por telegram
            varDump(`Buscando chat de: ${_Entidad.DNI}`)
            var _dataChat = await telegramModel.findOne({
                where : {
                    DNI : _Entidad.DNI
                }
            });
            var texto1 = `Hola ${rs.Nombre} , ya cargamos tu ${_DataCab.Categoria} del periodo ${_DataCab.Mes}-${_DataCab.Anio} , para poder ver por favor escribe /boletas , Atte. RRHH.`;
            if( _dataChat ){
                if( _dataChat.IdChat ){
                    varDump(`>>>[BOLETAS] Id chat Telegram : ${_dataChat.IdChat}.`);
                    var _IdChat = parseInt( _dataChat.IdChat );
                    bot.telegram.sendMessage( _IdChat , texto1 );
                    await envioBoletaDetModel.update({
                        ResultadoCelular : moment().format('YYYY-MM-DD HH:mm:ss') , Estado : 'Enviado'
                    },{ where : { uu_id : rs.uu_id } });
                }
            }
            //
        }
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Archivo enviado.` };
        //
    } catch (error) {
        varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});
// -------------------------------------------------------------

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
    var length = 24;
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
async function apiChatApi( method , params ){
    const options = {};
    options['method'] = "POST";
    options['body'] = JSON.stringify(params);
    options['headers'] = { 'Content-Type': 'application/json' };
    
    const url = `${apiUrlWS}/${method}?token=${tokenWS}`; 
    
    const apiResponse = await fetch(url, options);
    const jsonResponse = await apiResponse.json();
    return jsonResponse;
}
// -------------------------------------------------------
async function captueError( error , post )
{
    var _envio       = JSON.stringify(post);
    var _descripcion = JSON.stringify(error);
    var _uuid = await renovarToken();
    await errorLogModel.create({
        uu_id  : _uuid,
        modulo : _NombreDoc,
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

module.exports = router;