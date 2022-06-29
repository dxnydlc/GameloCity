// api_EnvioContrato.js

const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();
// >>>>>>>>>>>>> ------    SPARKPOST   ------ >>>>>>>>>>>>>
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET)
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







// Modelos
const { envioContratosCabModel, User, envioContratosDetModel , sucursalModel } = require('../../db');
// Plantillas Mail
const { mail_contrato } = require( './mail_plantillas' );







// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
envioContratosCabModel.belongsTo( envioContratosDetModel ,{
	as : 'BoletaItems', foreignKey 	: 'Codigo',targetKey: 'CodigoEnvio',
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

	$response.data = await envioContratosCabModel.findAll({
        order : [
            ['Codigo' , 'ASC']
        ]
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
        $response.data = await envioContratosCabModel.findAll({
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
        $response.data = await envioContratosCabModel.findAll({
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

	$response.data = await envioContratosCabModel.findAll({
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


    req.body.DNICreado = $userData.dni;
    req.body.CreadoPor = $userData.name;
    //
    await envioContratosCabModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await envioContratosCabModel.findOne({
        where  : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado )
    {
        // Nro de items
        const NroItems = await envioContratosDetModel.count({
            where: {
                Token : req.body.uu_id
            }
        });
        var _Codigo = 'EC'+await pad_with_zeroes( _dataGuardado.id , 6 );
        await envioContratosCabModel.update({
            Codigo : _Codigo,
            NroBoletas : NroItems
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
        // Unir detalle...
        await envioContratosDetModel.update({
            CodigoEnvio : _Codigo
        },{
            where  : {
                Token : req.body.uu_id
            }
        });
    }

    $response.item = await envioContratosCabModel.findOne({
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

    var _Entidad = await envioContratosCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = _Entidad;
    if( _Entidad ){
        // Detalle
        var _detalle = await envioContratosDetModel.findAll({
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

	await envioContratosCabModel.update(req.body,{
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
    
    $response.item = await envioContratosCabModel.findOne({
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

	await envioContratosCabModel.update({
        Estado      : 'Anulado',
        DNIAnulado  : $userData.dni,
        AnuladoPor  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await envioContratosCabModel.findOne({
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

    await envioContratosDetModel.create( req.body )
    .catch(function (err){
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await envioContratosDetModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    $response.data = await envioContratosDetModel.findAll({
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

    await envioContratosDetModel.update(req.body,{
		where : { 
            uu_id : req.body.uu_id 
        }
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await envioContratosDetModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    $response.data = await envioContratosDetModel.findAll({
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

    await envioContratosDetModel.destroy({
		where : { 
            uu_id : req.body.uuid 
        }
    })
    .catch(function (err) {
        console.log(err);
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.data = await envioContratosDetModel.findAll({
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

    $response.data = await envioContratosDetModel.findOne({
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
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await envioContratosDetModel.findAll({
        where : {
            token : req.body.token
        }
    });
    
    res.json( $response );
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

    $response.data = await envioContratosCabModel.findOne({
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

    var _Entidad = await envioContratosCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    if( _Entidad )
    {
        var _Detalles = await envioContratosDetModel.findAll({
            where : {
                Estado : 'Cargado',
                CodigoEnvio : _Entidad.Codigo
            }
        });

        for (let index = 0; index < _Detalles.length; index++) {
            var rs = _Detalles[index], _Resultado = 'Error';
            console.log( '>>>>>>>>>>>> DNI a enviar: '+rs.DNI );
            var _Usuario = await User.findOne({
                where : {
                    dni : rs.DNI
                }
            });
            // CREAR UUID
            var _uuIDUsuario = await renovarToken();
            if(! _Usuario.uu_id ){
                console.log(`Usuario no tienen uuid, creando...`);
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
                });
            }catch( error ){
                console.log(error);
            }
            // >>>>>>>>>>>>>> BITLY
            if( rs.Email ){
                var _Asunto = 'Envío de boleta '+_Entidad.Mes+'-'+_Entidad.Anio;
                // 000000000000000000000000000000000000000000000000
                var _htmlBody = mail_contrato( 
                    _Asunto , 
                    'Enviamos su boleta del periodo '+_Entidad.Mes+'-'+_Entidad.Anio ,
                    _Entidad ,
                    _Usuario ,
                    _urlBirly
                );
                // 000000000000000000000000000000000000000000000000
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
                        [{address: rs.Email }]
                })
                .then( async data => {
                    console.log('Woohoo! You just sent your first mailing!');
                    var _Aceptados = parseInt(data.results.total_accepted_recipients);
                    if( _Aceptados > 0 ){
                        var _Resultado = 'Enviado Mail '+data.results.id;
                        // --------------------------------
                        await envioContratosDetModel.update({
                            Resultado : _Resultado , Estado : 'Enviado'
                        },{ where : { uu_id : rs.uu_id } });
                        // --------------------------------
                    }
                    console.log(data);
                })
                .catch(err => {
                    console.log('Whoops! Something went wrong');
                    console.log(err);
                });
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
                    console.log(`WhatsApp a: ${rs.Nombre}-${rs.DNI}_`);
                    var texto1 = `
Departamento de RRHH SSAYS SAC,
Hola *${rs.Nombre}*, es grato saludarte para informar que hemos cargado tu boleta del periodo *${_Entidad.Mes}-${_Entidad.Anio}* para ingresar debes
colocar tu número de dni en la plataforma ${_urlBirly}, recuerda que si tienes dudas y/o observaciones por favor hacerlas llegar al correo: consultas.rrhh@ssays-orquesta.com
_Importante_ *agrega este número a tu lista de contactos para poder ver los links/imágenes*, muchas gracias por tu atención.
                    `;
                    // Enviando texto
                    await apiChatApi( 'sendMessage', { phone : to , body: texto1 });
                    // Enviando Link
                    //await apiChatApi( 'sendMessage', { phone : to , body: _urlBirly });
                    // Enviando logo ssays
                    await apiChatApi( 'sendFile', { phone : to , body: _LogoSSAYS , filename : 'logo SSAYS' });
                    
                    var _Resultado = 'Enviado Celular '+$celular;
                    // --------------------------------
                    await envioContratosDetModel.update({
                        ResultadoCelular : _Resultado , Estado : 'Enviado'
                    },{ where : { uu_id : rs.uu_id } });
                    // --------------------------------
                    console.log(`Enviando a WhatsApp ${to}`);
                }
            }
        }
        // Actualizar Nro de enviados
        var _NroEnvios = await envioContratosDetModel.count({
            where: {
                CodigoEnvio : _Entidad.Codigo ,
                Resultado : { [Op.not]: null }
            }
        });
        console.log( 'Se enviaron => '+_NroEnvios );
        await envioContratosCabModel.update({
            NroEnvios : _NroEnvios
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

    var _Entidad = await envioContratosDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = _Entidad;
    if( _Entidad ){
        await envioContratosDetModel.update({
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

    $response.data = await envioContratosCabModel.findOne({
        where : {
            Mes  : req.body.mes ,
            Anio : req.body.anio
        },
        include: [{
            model : envioContratosDetModel,
            as    : 'BoletaItems',
            where : {
                DNI : $userData.dni
            }
        }],
        order : [
            [ 'id' , 'DESC' ]
        ]
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
// -------------------------------------------------------

module.exports = router;