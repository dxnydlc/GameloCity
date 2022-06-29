
// api_telegram.js


var _NombreDoc = 'api_telegram';
const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();
// >>>>>>>>>>>>>    SPARKPOST   >>>>>>>>>>>>>
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET);

// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');

// >>>>>>>>>>>>>    NEXMO       >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

// TELEGRAM
const { Telegraf, Scenes , Stage, session } = require('telegraf');


const {  telegramModel, telegramChatModel, User, sequelize, archiGoogleModel, sucursalModel } = require('../../db');

const _telegramToken = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf( _telegramToken );

const apiId = '10899933', apiHash = '6dda7ef4311940cdff1485a4097136dd';






// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/iniciar', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    var _previoLand = `https://lnd.ssays-orquesta.com/boletas/login/`; _linkFichaCovid = `https://lnd.ssays-orquesta.com/`;

    var _textoAyuda = `
Robot SSAYS SAC.
Tenemos los siguientes links para ayuda:
/boletas podrás ver tus boletas.
/fichacovid para generar tu ficha COVID`;

/*var _botonesMenu = {
    reply_markup: {
        inline_keyboard: [
            // Inline buttons. 2 side-by-side
            [ { text: "Mis Boletas", url: _previoLand+_dataUser.uu_id } ],
            [ { text: "Ficha COVID", url: _linkFichaCovid } ],
        ]
    } 
};*/

    try {
        //
        var _IdChat = 0;
        bot.use((ctx, next) => {
            //ctx.reply('usaste el bot');
            // next();
            ctx.state.users = 75;
            next(ctx); //next is passed because we can modify data
        })
        // ???????????????????????????  INICIO  ???????????????????????????
        bot.start( async (ctx) => {
            var _from = ctx.from;
            _IdChat = ctx.message.chat.id;
            var _textoInicio = ``;
            
            

            var _previo = await telegramModel.findOne({
                where : { IdChat : _IdChat }
            });
            if( _previo ){
                // Menú de ayuda
                ctx.reply(_textoAyuda);
                ctx.reply('https://ssays-orquesta.com/bot-telegram.jpg');
                //
                _textoInicio = `Hola ${_previo.Nombre} en que te puedo ayudar hoy.`;
                var _dataUser = await User.findOne({
                    where : { dni : _previo.DNI }
                });
                if( _dataUser ){
                    //
                    ctx.reply( _textoInicio , {
                        reply_markup: {
                            inline_keyboard: [
                                // Inline buttons. 2 side-by-side
                                [ { text: "Mis Boletas", url: _previoLand+_dataUser.uu_id } ],
                                [ { text: "Ficha COVID", url: _linkFichaCovid } ],
                            ]
                        } 
                    } );
                }
                //
            }else{
                //
                await chatBot( _IdChat , `/dni` , _from.first_name , _from.last_name );
                var _insert = {};
                _insert.uu_id       = await renovarToken();
                _insert.IdChat      = ctx.message.chat.id;
                _insert.FirstName   = _from.first_name;
                _insert.LastName    = _from.last_name;
                await telegramModel.create( _insert );
                //
                _textoInicio = `Hola: ${_from.first_name} ${_from.last_name}, por favor ingresa tu DNI para poder atender tus consultas.`;
                ctx.reply( _textoInicio );
            }
            varDump( ctx.chat );
            //
        });
        // ???????????????????????????  AYUDA  ???????????????????????????
        bot.on('sticker', (ctx) => ctx.reply('👍'));
        // ???????????????????????????  AYUDA  ???????????????????????????
        bot.hears('hola', async(ctx) =>{
            ctx.reply('¡Hola!');
        });
        // ???????????????????????????  AYUDA  ???????????????????????????
        bot.command('/ayuda', async(ctx) =>{
            var _from = ctx.from;
            var _texto = _textoAyuda;
            _IdChat = ctx.message.chat.id;
            await chatBot( _IdChat , _texto , _from.first_name , _from.last_name );
            ctx.reply(_texto);
        });
        bot.help( async (ctx) => {
            var _from = ctx.from;
            var _texto = _textoAyuda;
            _IdChat = ctx.message.chat.id;
            await chatBot( _IdChat , _texto , _from.first_name , _from.last_name );
            ctx.reply(_texto);
        });
        // ???????????????????????????  SALIR DEL BOT  ???????????????????????????
        bot.command('quit', (ctx) => {
            // Explicit usage
            ctx.telegram.leaveChat(ctx.message.chat.id);
          
            // Using context shortcut
            ctx.leaveChat()
        });
        // ???????????????????????????  LINK DE BOLETAS  ???????????????????????????
        bot.command('boletas', async(ctx) =>{
            var _from = ctx.from;
            var _texto = ``;
            _IdChat = ctx.message.chat.id;
            var _previoChat = await telegramModel.findOne({
                where : { IdChat : _IdChat }
            });
            if( _previoChat )
            {
                var _dataUser = await User.findOne({
                    where : { dni : _previoChat.DNI }
                });
                if( _dataUser )
                {
                    _texto = `${_previoChat.Nombre}, aquí podrás ver tus boletas, la contaseña es tu número de DNI`;
                    ctx.reply( _texto ,{
                        reply_markup: {
                            inline_keyboard: [
                                // Inline buttons. 2 side-by-side
                                [ { text: "Mis Boletas", url: _previoLand+_dataUser.uu_id } ],
                            ]
                        }
                    });
                }else{
                    _texto = 'Lo siento no logro encontrar tu DNI en nuestro sistema.';
                    ctx.reply( _texto );
                }
            }
            
            await chatBot( _IdChat , _texto , _from.first_name , _from.last_name );
        });
        // ???????????????????????????  FICHA COVID  ???????????????????????????
        bot.command('fichacovid', async(ctx) =>{
            var _from = ctx.from;
            var _texto = ``;
            _IdChat = ctx.message.chat.id;
            var _previoChat = await telegramModel.findOne({
                where : { IdChat : _IdChat }
            });
            if( _previoChat )
            {
                var _dataUser = await User.findOne({
                    where : { dni : _previoChat.DNI }
                });
                if( _dataUser )
                {
                    _texto = `${_previoChat.Nombre}, este es el link para la ficha COVID`;
                    ctx.reply( _texto ,{
                        reply_markup: {
                            inline_keyboard: [
                                // Inline buttons. 2 side-by-side
                                [ { text: "Ficha COVID", url : _linkFichaCovid } ],
                            ]
                        }
                    });
                }else{
                    _texto = 'Lo siento no logro encontrar tu DNI en nuestro sistema.';
                    ctx.reply( _texto );
                }
            }
            
            await chatBot( _IdChat , _texto , _from.first_name , _from.last_name );
        });
        // ???????????????????????????  TEXTO  ???????????????????????????
        bot.on('text', async (ctx) => {
            var _from = ctx.from , _UserValido = false;
            _IdChat = ctx.message.chat.id;
            var _Comando = await getUltimoComando( _IdChat );
            var _previoChat = await telegramModel.findOne({
                where : { IdChat : _IdChat }
            });
            if( _previoChat ){
                var _dataUser = await User.findOne({
                    where : { dni : _previoChat.DNI }
                });
                if( _previoChat.Nombre ){
                    _UserValido = true;
                    if( _Comando == '/dni' ) { _Comando = ``; }
                }
            }
            //varDump( ctx.message );
            switch ( _Comando ) {
                case '/dni':
                    var _dni = ctx.message.text;
                    await chatUser( _IdChat , ctx.message.text , _from.first_name , _from.last_name )
                    if(! isNaN(_dni) )
                    {
                        var _dataUser = await User.findOne({
                            where : { dni : _dni }
                        });
                        if( _dataUser )
                        {
                            if( _previoChat ){
                                // Actualizar Chat
                                var _update = {};
                                _update.DNI = _dni;
                                if( _dataUser.nombre ){
                                    _update.Nombre = _dataUser.nombre;
                                    _update.Paterno = _dataUser.apellidop;
                                    _update.Materno = _dataUser.apellidom;
                                }
                                await telegramModel.update(_update,{
                                    where : { IdChat : _IdChat }
                                });
                            }else{
                                //
                                var _insert = {}, _urlBole = ``;
                                _insert.uu_id       = await renovarToken();
                                _insert.IdChat      = ctx.message.chat.id;
                                _insert.FirstName   = _from.first_name;
                                _insert.LastName    = _from.last_name;
                                if( _dataUser.nombre ){
                                    _insert.Nombre = _dataUser.nombre;
                                    _insert.Paterno = _dataUser.apellidop;
                                    _insert.Materno = _dataUser.apellidom;
                                }
                                await telegramModel.create( _insert );
                                //
                            }
                            _urlBole = _previoLand+_dataUser.uu_id;
                            ctx.telegram.sendMessage( ctx.message.chat.id , `Hola : ${_dataUser.name}`,{
                                reply_markup: {
                                    inline_keyboard: [
                                        // Inline buttons. 2 side-by-side
                                        [ { text: "Mis Boletas", url: _urlBole } ],
                                        [ { text: "Ficha COVID", url: _linkFichaCovid } ],
                                    ]
                                }
                            });
                        }else{
                            ctx.reply( 'Lo siento no logro encontrar tu DNI en nuestro sistema.' );
                        }
                    }else{
                        ctx.reply( 'Por favor ingresa un DNI válido' );
                    }
                break;
                // ?????????????????????????????????????????????????????????
                default:
                    var _texto = 'No logro entender tu mensaje. =(';
                    ctx.reply( _texto );
                    await chatBot( _IdChat , _texto , _from.first_name , _from.last_name );
                    _texto = 'Tal vez esto te pueda ayudar';
                    if( _dataUser ){
                        //
                        ctx.reply( _texto , {
                            reply_markup: {
                                inline_keyboard: [
                                    [ { text: "Mis Boletas", url: _previoLand+_dataUser.uu_id } ],
                                    [ { text: "Ficha COVID", url: _linkFichaCovid } ],
                                ]
                            } 
                        } );
                        await chatBot( _IdChat , _texto , _from.first_name , _from.last_name );
                        //
                    }
                break;
            }
            
                    
        });
        
        // 88888888888888888888888888888888888888888888888888888888888888888888888888888888
        bot.launch();
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `SSAYSBot iniciado` };
        //
    } catch (error) {
        varDump(error );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/msg01', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {

        //
        var _IdChat = 0;

        bot.start( (ctx) => {
            varDump( ctx.chat );
            var _from = ctx.from;
            _IdChat = ctx.message.chat.id;
            ctx.reply( `Hola: ${_from.first_name} ${_from.last_name}, por favor ingresa tu DNI.`);
        });

        /*bot.start( (ctx) => {
            varDump( ctx.chat );
            var _from = ctx.from;
            _IdChat = ctx.message.chat.id;
            ctx.reply( `Hola: ${_from.first_name} ${_from.last_name}, en qué te puedo ayudar hoy.`, {
                reply_markup: {
                    inline_keyboard: [
                        // Inline buttons. 2 side-by-side
                        [ { text: "Ver Boletas", callback_data: "boletas" }, { text: "Button 2", callback_data: "btn-2" } ],
        
                        // One button
                        [ { text: "Next", callback_data: "next" } ],
                        
                        // Also, we can have URL buttons.
                        [ { text: "Open in browser", url: "telegraf.js.org" } ]
                    ]
                }
            });
        });*/
        bot.action( 'boletas', (ctx) => ctx.reply('Enviaremos sus boletas!'));
        bot.help((ctx) => ctx.reply('Send me a sticker'));
        bot.on('sticker', (ctx) => ctx.reply('👍'))
        bot.hears('hi', (ctx) => ctx.reply('Hey there') );


        // SALIR DEL BOT
        bot.command('quit', (ctx) => {
            // Explicit usage
            ctx.telegram.leaveChat(ctx.message.chat.id);
          
            // Using context shortcut
            ctx.leaveChat()
        });

        
        bot.on('callback_query', async (ctx) => {
            ctx.reply(`Your answer was: ${ctx.update.callback_query.data}`);
        });

        bot.on('text', async (ctx) => {
            varDump( ctx.message );
            // Explicit usage
            var _dni = ctx.message.text;
            if(! isNaN(_dni) )
            {
                var _dataUser = await User.findOne({
                    where : {
                        dni : _dni
                    }
                });
                if( _dataUser )
                {
                    ctx.telegram.sendMessage( ctx.message.chat.id , `El DNI ingresado es ${_dni} y corresponde a: ${_dataUser.name}`);
                }
            }
        });

        // ENVIAR MENSAJE
        // bot.telegram.sendMessage( 5496432755 , `ENVIO BOLETA` );

        

        // 8888888888888888
        bot.launch();
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Mensaje enviado mmhuevo.` };
        //
    } catch (error) {
        varDump( error );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ENVIO MESNAJE DE PRUEBA             //
//////////////////////////////////////////////////////////
router.post('/send01', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        // ENVIAR MENSAJE
        bot.telegram.sendMessage( 1590904112 , `ENVIO BOLETA img` );
        bot.telegram.sendPhoto( 1590904112 , 'http://ssays-orquesta.com/telegram.jpg' , 'Ficha' );
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Enviado` };
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

// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
async function chatUser( _IdChat , texto , firstName , lastName )
{
    //
    // Creamos el primer registro del chat
    var _insert = {};
    _insert.uu_id = await renovarToken();
    _insert.IdChat      = _IdChat;
    _insert.FirstName   = firstName;
    _insert.LastName    = lastName;
    _insert.UserText    = texto;
    await telegramChatModel.create( _insert );
}
// -------------------------------------------------------------
async function chatBot( _IdChat , texto , firstName , lastName )
{
    // Creamos el primer registro del chat
    var _insert = {};
    _insert.uu_id = await renovarToken();
    _insert.IdChat      = _IdChat;
    _insert.BotText     = texto;
    await telegramChatModel.create( _insert );
}
// -------------------------------------------------------------
async function getUltimoComando( _IdChat )
{
    //
    var _comando = ``;
    var _previo = await telegramChatModel.findOne({
        where : { 
            IdChat : _IdChat 
        }
    });
    if( _previo )
    {
        _comando = _previo.BotText;
    }
    return _comando;
}
// -------------------------------------------------------------
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
// -------------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
module.exports = router;
// -------------------------------------------------------------
