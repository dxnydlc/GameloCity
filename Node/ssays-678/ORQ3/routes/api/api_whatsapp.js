// api_whatsapp.js

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

// WHATSAPP
const config = require("./whatsapp.js");
const tokenWS = config.token, apiUrlWS = config.apiUrl;
const fetch = require('node-fetch');
var _LogoSSAYS = 'https://api2.ssays-orquesta.com/logo-ssays-2019-2.png';



// Modelos
const { envioBoletaCabModel,User } = require('../../db');


const { otModel, OSModel, sequelize } = require('../../db31');


//////////////////////////////////////////////////////////
//      			    ENVIAR TEXTO     			    //
//////////////////////////////////////////////////////////
router.post('/send_msj01',async(req,res)=>{
    // celular, texto
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    var $userData = await getUserData( req.headers['api-token'] );
    $response.user = $userData;

    var _Celular = req.body.celular, _texto = req.body.texto+'  _Importante_ *agrega este número a tu lista de contactos para poder ver los links/imágenes*';

    if( _Celular )
    {
        var $celular = _Celular;
        if( $celular.length == 9 )
        {
            const from = 'SSAYS SAC';
            var to   = '51'+$celular;
            //var req = await apiChatApi( 'sendMessage', { phone : to , body: req.body.texto });
            var _sendFile = await apiChatApi('sendMessage',{ phone : to , body: req.body.texto , filename : 'Logo SSAYS SAC' });
            console.log(_sendFile);
            console.log(`Enviando mensaje WhatsApp`);
            console.log(req);
        }
    }

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			 ENVIAR BOLETA     			        //
//////////////////////////////////////////////////////////
router.post('/send_boleta',async(req,res)=>{
    // dni , celular
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    var $userData = await getUserData( req.headers['api-token'] );
    $response.user = $userData;

    var _Usuario = await User.findOne({
        where : {
            dni : req.body.dni
        }
    });
    var _Celular = req.body.celular;

    if( _Usuario ){
        //
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
        // ###############################################
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
        // Ahora enviamos el mensaje de texto
        if( _Celular )
        {
            var $celular = _Celular;
            if( $celular.length == 9 )
            {
                const from = 'SSAYS SAC';
                var to   = '51'+$celular;
                // Enviar WhatsApp
                console.log(`WhatsApp a: ${_Usuario.Nombre}-${_Usuario.DNI}_`);
                var texto1 = `
Departamento de RRHH SSAYS SAC,
Hola *${_Usuario.name}*, es grato saludarte para informar que hemos cargado tu boleta del periodo *_-_* para ingresar debes
colocar tu número de dni en la plataforma, recuerda que si tienes dudas y/o observaciones por favor hacerlas llegar al correo: consultas.rrhh@ssays-orquesta.com, muchas gracias por tu atención..
                `;
                // Enviando texto
                await apiChatApi( 'message', { phone : to , body: texto1 });
                // Enviando Link
                await apiChatApi( 'sendMessage', { phone : to , body: _urlBirly });
                // Enviando logo ssays
                await apiChatApi( 'sendFile', { phone : to , body: _LogoSSAYS , filename : 'logo SSAYS' });
                
                var _Resultado = 'Enviado Celular '+$celular;
                // --------------------------------
                // --------------------------------
                console.log(`Enviando a WhatsApp ${to}`);
            }
        }
        // ###############################################
    }else{
        $response.estado = 'ERROR';
        $response.error  = 'El DNI no existe en la base de datos.';
    }

	var _mensaje1 = 'HTTP or HTTPS link, for example https://wikimedia.org';
    await apiChatApi( 'sendMessage', { phone : to , body: _mensaje1 });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			    ENVIAR TEXTO     			    //
//////////////////////////////////////////////////////////
router.post('/get/mensajes',async(req,res)=>{
    // celular, texto
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    var $userData = await getUserData( req.headers['api-token'] );
    $response.user = $userData;

    var _Mensajes = await apiChatApiGET( 'messages', '' );
    $response.data = _Mensajes;

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/clear/instance', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var req = await apiChatApi( 'clearMessagesQueue', { phone : 981271112 , body: 'go' });
    $response.data = req;

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  LIMPIAR INSTANCIA                   //
//////////////////////////////////////////////////////////
router.post('/clear/celular', async (req,res)=>{
    // celular
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var req = await apiChatApi( 'clearMessagesQueue', { phone : req.body.celular , body: 'go' });
    $response.data = req;

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
    if( params != '' ){
        options['body'] = JSON.stringify(params);
    }
    options['headers'] = { 'Content-Type': 'application/json' };
    
    const url = `${apiUrlWS}${method}?token=${tokenWS}`; 
    
    const apiResponse = await fetch(url, options);
    const jsonResponse = await apiResponse.json();
    return jsonResponse;
}
// -------------------------------------------------------
async function apiChatApiGET( method , params ){
    const options = {};
    options['method'] = "GET";
    if( params != '' ){
        options['body'] = JSON.stringify(params);
    }
    options['headers'] = { 'Content-Type': 'application/json' };
    
    const url = `${apiUrlWS}${method}?token=${tokenWS}`; 
    
    const apiResponse = await fetch(url, options);
    console.log(apiResponse);
    const jsonResponse = await apiResponse.json();
    return jsonResponse;
}
// -------------------------------------------------------

module.exports = router;