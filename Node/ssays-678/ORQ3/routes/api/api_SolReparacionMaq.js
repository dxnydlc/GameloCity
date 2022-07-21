// api_SolReparacionMaq.js

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
var _URL_NODE = process.env.URL_NODE;

// Plantillas Mail
const { mail_reparar_maquina, mail_atencion_maq } = require( './mail_plantillas' );




const { soliReparacionMaqModel, User, envioBoletaDetModel, archiGoogleModel, sucursalModel, lideresModel } = require('../../db');



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await soliReparacionMaqModel.findAll({
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
        $response.data = await soliReparacionMaqModel.findAll({
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
        $response.data = await soliReparacionMaqModel.findAll({
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

	$response.data = await soliReparacionMaqModel.findAll({
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
    check('IdCliente' ,'Seleccione cliente').not().isEmpty(),
    check('IdLocal' ,'Seleccione local').not().isEmpty(),
    check('Descripcion' ,'Ingrese una descripción').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.IdCreadoPor = $userData.dni;
    req.body.CreadoPor  = $userData.name;
    req.body.Estado     = 'Enviado';
    //
    await soliReparacionMaqModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await soliReparacionMaqModel.findOne({
        where  : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = 'SR'+await pad_with_zeroes( _dataGuardado.id , 6 );
        await soliReparacionMaqModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
        _dataGuardado = await soliReparacionMaqModel.findOne({
            where  : {
                uu_id : req.body.uu_id
            }
        });
        // Unir detalle de archivos...
        await archiGoogleModel.update({
            correlativo : _dataGuardado.id
        },{
            where  : {
                token : req.body.uu_id,
                formulario : 'MAQUINA_SUP'
            }
        });
        // Archivos 
        var _Archivos = await archiGoogleModel.findAll({
            where : {
                formulario : 'MAQUINA_SUP',
                correlativo : _dataGuardado.id
            }
        });
        // Enviar EMILIO SOSA
        var _lideresMNTO = await lideresModel.findAll({
            where : {
                area    : 'MANTENIMIENTO',
                Estado  : 'Activo'
            }
        });
        var _Asunto = 'Ticket atención maquina '+_Codigo;
        var _TextoPre = `Solicitud de atención de maquina ${_dataGuardado.IdActivo}`;
        if( _lideresMNTO ){
            for (let index = 0; index < _lideresMNTO.length; index++) {
                const rs = _lideresMNTO[index];
                var _Usuario = await User.findOne({
                    attributes: [ 'id', 'name' , 'dni' , 'email' , 'celular' , 'emailalternativo' ],
                    where : {
                        dni : rs.id_usuario
                    }
                });
                console.log(`Correo ${_Usuario.email} celular: ${_Usuario.celular}`);
                if( _Usuario ){
                    // 000000000000000000000000000000000000000000000000
                    var _htmlBody = mail_reparar_maquina(
                        _TextoPre ,
                        _dataGuardado ,
                        _Archivos ,
                        _Usuario ,
                        _URL_NODE
                    );
                    // 000000000000000000000000000000000000000000000000
                    await clientMail.transmissions.send({
                        options: {
                            //sandbox: true
                        },
                        content: {
                            from    : {
                                name  : 'Robot de Orquesta',
                                email : 'robot@ssays-orquesta.com'
                            },
                            subject : _Asunto,
                            html    : _htmlBody,
                        },
                        recipients : 
                            [
                            { address: _Usuario.email }
                            ]
                    })
                    .then(data => {
                        console.log('Woohoo! You just sent your first mailing!');
                        console.log(data);
                    })
                    .catch(err => {
                        console.log('Whoops! Something went wrong');
                        console.log(err);
                    });// CORREO
                    // Ahora enviamos el mensaje de texto
                    if( _Usuario.celular )
                    {
                        var $celular = _Usuario.celular;
                        if( $celular.length == 9 )
                        {
                            var to   = '51'+$celular;
                            // Enviar WhatsApp
                            var texto1 = `
Solicitud de atención de equipo *${_dataGuardado.Codigo}*,
El usuario ${_dataGuardado.CreadoPor} esta solicitando reparar el activo siguiente:
Cliente: ${_dataGuardado.Cliente} / Local: ${_dataGuardado.Local}
Dirección: ${_dataGuardado.Direccion}
Nro. activo: *${_dataGuardado.IdActivo}*
Tipo activo: ${_dataGuardado.TActivo}
Marca activo: ${_dataGuardado.Marca}
El horario para poder realizar el trabajo es: *${_dataGuardado.AteInicio} - ${_dataGuardado.AteFin}*.
========== FIN DEL MENSAJE ==========
                            `;
                            // Enviando texto
                            await apiChatApi( 'sendMessage', { phone : to , body: texto1 });
                            // Enviando Link
                            //await apiChatApi( 'sendMessage', { phone : to , body: _urlBirly });
                            // Enviando logo ssays
                            //await apiChatApi( 'sendFile', { phone : to , body: _LogoSSAYS , filename : 'logo SSAYS' });
                            console.log(`Enviando a WhatsApp ${to}`);
                        }
                    }// WHATSAPP
                }//_Usuario
            }
        }// _lideresMNTO
    }

    $response.item = await soliReparacionMaqModel.findOne({
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
    $response.archivos = [];
    $response.locales = [];

    var _Entidad = await soliReparacionMaqModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = _Entidad;
    if( _Entidad ){
        // Archivos 
        var _Archivos = await archiGoogleModel.findAll({
            where : {
                formulario : 'MAQUINA_SUP',
                correlativo : _Entidad.id
            }
        });
        $response.archivos = _Archivos;
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
    check('IdCliente' ,'Seleccione cliente').not().isEmpty(),
    check('IdLocal' ,'Seleccione local').not().isEmpty(),
    check('Descripcion' ,'Ingrese una descripción').not().isEmpty(),
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
    req.body.IdCreadoPor = $userData.dni;
    req.body.CreadoPor   = $userData.name;

	await soliReparacionMaqModel.update(req.body,{
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
    
    $response.item = await soliReparacionMaqModel.findOne({
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
router.post('/actualiza', [
    check('FechaAtencion' ,'Ingrese fecha de atención').not().isEmpty(),
    check('Tecnico' ,'Seleccione técnico').not().isEmpty(),
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

    var _Entidad = await soliReparacionMaqModel.findOne({
        where : { 
            uu_id : req.body.uu_id
        }
    });

    if( _Entidad ){
        if( req.body.Estado == 'Enviado' ){
            req.body.Estado = 'Asignado';
        }
        // <<<<<<<<<<<<<< SOLICITANTE >>>>>>>>>>>>>>
        var _Usuario = await User.findOne({
            attributes: [ 'id', 'name' , 'dni' , 'email' , 'celular' , 'emailalternativo' ],
            where : {
                dni : _Entidad.IdCreadoPor
            }
        });
        delete req.body.id;
        await soliReparacionMaqModel.update(req.body,{
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
        var _dataGuardado = await soliReparacionMaqModel.findOne({
            where : { 
                uu_id : req.body.uu_id
            }
        })

        var _Asunto = `Solicitud atención Nro.${_dataGuardado.Codigo} - Técnico asignado`;
        var _TextoPre = `Se asignó un ténico para atender su solicitud de atención Nro.${_dataGuardado.Codigo}`;
        var _FechaAtencion = moment( _dataGuardado.FechaAtencion ).format('DD/MM/YYYY');
        console.log(`Correo ${_Usuario.email} celular: ${_Usuario.celular}`);
        if( _Usuario ){
            // 000000000000000000000000000000000000000000000000
            var _htmlBody = mail_atencion_maq(
                `Atención`,
                _TextoPre ,
                _dataGuardado ,
                _FechaAtencion
            );
            // 000000000000000000000000000000000000000000000000
            await clientMail.transmissions.send({
                options: {
                    //sandbox: true
                },
                content: {
                    from    : {
                        name  : 'Robot de Orquesta',
                        email : 'robot@ssays-orquesta.com'
                    },
                    subject : _Asunto,
                    html    : _htmlBody,
                },
                recipients : 
                    [
                    { address: _Usuario.email }
                    ]
            })
            .then(data => {
                console.log('Woohoo! You just sent your first mailing!');
                console.log(data);
            })
            .catch(err => {
                console.log('Whoops! Something went wrong');
                console.log(err);
            });// CORREO
            // Ahora enviamos el mensaje de texto
            if( _Usuario.celular )
            {
                var $celular = _Usuario.celular;
                if( $celular.length == 9 )
                {
                    var to   = '51'+$celular;
                    // Enviar WhatsApp
                    var texto1 = `
Area de mantenimiento: solicitud de atención de equipo *${_dataGuardado.Codigo}*,
Se asignó un técnico para su atención: *${_dataGuardado.Tecnico}*
El cual se aproximará en fecha *${_FechaAtencion}* en el horario *${_dataGuardado.AteInicio}-${_dataGuardado.AteFin}*
=> _${_dataGuardado.Observaciones}_
========== FIN DEL MENSAJE ==========
                    `;
                    // Enviando texto
                    await apiChatApi( 'sendMessage', { phone : to , body: texto1 });
                    // Enviando Link
                    //await apiChatApi( 'sendMessage', { phone : to , body: _urlBirly });
                    // Enviando logo ssays
                    //await apiChatApi( 'sendFile', { phone : to , body: _LogoSSAYS , filename : 'logo SSAYS' });
                    console.log(`Enviando a WhatsApp ${to}`);
                }
            }// WHATSAPP
        }//_Usuario

            
        
        
    }
    // Auditoria

    $response.item = await soliReparacionMaqModel.findOne({
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
    req.body.DNIAnulado = $userData.dni;
    req.body.AnuladoPor = $userData.name;

    $anuladoPor = $userData.name;

	await soliReparacionMaqModel.update({
        Estado      : 'Anulado',
        DNIAnulado  : $userData.dni,
        AnuladoPor  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await soliReparacionMaqModel.findOne({
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
            token : req.body.token
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
            uu_id : req.body.uu_id 
        }
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.data = await envioBoletaDetModel.findAll({
        where : {
            token : req.body.token
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

    $response.data = await envioBoletaDetModel.findAll({
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

    $response.data = await soliReparacionMaqModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/dashboard', async (req,res)=>{
    // uuid
    var $response       = {};
    $response.estado    = 'OK';
    $response.activos   = 0;
    $response.atendidos = 0;
    $response.asignados = 0;
    
    // Activos
    const NroActivos = await soliReparacionMaqModel.count({
        where: {
          Estado : 'Enviado'
        }
    });
    $response.activos = NroActivos;
    // Atendidos
    const NroAtendidos = await soliReparacionMaqModel.count({
        where: {
          Estado : 'Atendido'
        }
    });
    $response.atendidos = NroAtendidos;
    // Asignados
    const NroAsignados = await soliReparacionMaqModel.count({
        where: {
          Estado : 'Programado'
        }
    });
    $response.asignados = NroAsignados;

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
function makeCorreoMantenimiento( rsDoc , rsFiles , dataUser )
{
    var _prevista = `Activo : ${rsDoc.IdActivo}, ${rsDoc.TActivo} , ${rsDoc.Marca} ha sido reportado por ${rsDoc.CreadoPor}`;
    var $body = `
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <!-- NAME: GDPR SUBSCRIBER ALERT -->
            <!--[if gte mso 15]>
            <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>*|MC:SUBJECT|*</title>
            
        <style type="text/css">
            p{
                margin:10px 0;
                padding:0;
            }
            table{
                border-collapse:collapse;
            }
            h1,h2,h3,h4,h5,h6{
                display:block;
                margin:0;
                padding:0;
            }
            img,a img{
                border:0;
                height:auto;
                outline:none;
                text-decoration:none;
            }
            body,#bodyTable,#bodyCell{
                height:100%;
                margin:0;
                padding:0;
                width:100%;
            }
            .mcnPreviewText{
                display:none !important;
            }
            #outlook a{
                padding:0;
            }
            img{
                -ms-interpolation-mode:bicubic;
            }
            table{
                mso-table-lspace:0pt;
                mso-table-rspace:0pt;
            }
            .ReadMsgBody{
                width:100%;
            }
            .ExternalClass{
                width:100%;
            }
            p,a,li,td,blockquote{
                mso-line-height-rule:exactly;
            }
            a[href^=tel],a[href^=sms]{
                color:inherit;
                cursor:default;
                text-decoration:none;
            }
            p,a,li,td,body,table,blockquote{
                -ms-text-size-adjust:100%;
                -webkit-text-size-adjust:100%;
            }
            .ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{
                line-height:100%;
            }
            a[x-apple-data-detectors]{
                color:inherit !important;
                text-decoration:none !important;
                font-size:inherit !important;
                font-family:inherit !important;
                font-weight:inherit !important;
                line-height:inherit !important;
            }
            .templateContainer{
                max-width:600px !important;
            }
            a.mcnButton{
                display:block;
            }
            .mcnImage,.mcnRetinaImage{
                vertical-align:bottom;
            }
            .mcnTextContent{
                word-break:break-word;
            }
            .mcnTextContent img{
                height:auto !important;
            }
            .mcnDividerBlock{
                table-layout:fixed !important;
            }
        /*
        @tab Page
        @section Heading 1
        @style heading 1
        */
            h1{
                /*@editable*/color:#222222;
                /*@editable*/font-family:Helvetica;
                /*@editable*/font-size:40px;
                /*@editable*/font-style:normal;
                /*@editable*/font-weight:bold;
                /*@editable*/line-height:150%;
                /*@editable*/letter-spacing:normal;
                /*@editable*/text-align:center;
            }
        /*
        @tab Page
        @section Heading 2
        @style heading 2
        */
            h2{
                /*@editable*/color:#222222;
                /*@editable*/font-family:Helvetica;
                /*@editable*/font-size:34px;
                /*@editable*/font-style:normal;
                /*@editable*/font-weight:bold;
                /*@editable*/line-height:150%;
                /*@editable*/letter-spacing:normal;
                /*@editable*/text-align:left;
            }
        /*
        @tab Page
        @section Heading 3
        @style heading 3
        */
            h3{
                /*@editable*/color:#444444;
                /*@editable*/font-family:Helvetica;
                /*@editable*/font-size:22px;
                /*@editable*/font-style:normal;
                /*@editable*/font-weight:bold;
                /*@editable*/line-height:150%;
                /*@editable*/letter-spacing:normal;
                /*@editable*/text-align:left;
            }
        /*
        @tab Page
        @section Heading 4
        @style heading 4
        */
            h4{
                /*@editable*/color:#999999;
                /*@editable*/font-family:Georgia;
                /*@editable*/font-size:20px;
                /*@editable*/font-style:italic;
                /*@editable*/font-weight:normal;
                /*@editable*/line-height:125%;
                /*@editable*/letter-spacing:normal;
                /*@editable*/text-align:left;
            }
        /*
        @tab Header
        @section Header Container Style
        */
            #templateHeader{
                /*@editable*/background-color:#F2F2F2;
                /*@editable*/background-image:none;
                /*@editable*/background-repeat:no-repeat;
                /*@editable*/background-position:center;
                /*@editable*/background-size:cover;
                /*@editable*/border-top:0;
                /*@editable*/border-bottom:0;
                /*@editable*/padding-top:36px;
                /*@editable*/padding-bottom:0;
            }
        /*
        @tab Header
        @section Header Interior Style
        */
            .headerContainer{
                /*@editable*/background-color:#FFFFFF;
                /*@editable*/background-image:none;
                /*@editable*/background-repeat:no-repeat;
                /*@editable*/background-position:center;
                /*@editable*/background-size:cover;
                /*@editable*/border-top:0;
                /*@editable*/border-bottom:0;
                /*@editable*/padding-top:45px;
                /*@editable*/padding-bottom:45px;
            }
        /*
        @tab Header
        @section Header Text
        */
            .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
                /*@editable*/color:#808080;
                /*@editable*/font-family:Helvetica;
                /*@editable*/font-size:16px;
                /*@editable*/line-height:150%;
                /*@editable*/text-align:left;
            }
        /*
        @tab Header
        @section Header Link
        */
            .headerContainer .mcnTextContent a,.headerContainer .mcnTextContent p a{
                /*@editable*/color:#007E9E;
                /*@editable*/font-weight:normal;
                /*@editable*/text-decoration:underline;
            }
        /*
        @tab Body
        @section Body Container Style
        */
            #templateBody{
                /*@editable*/background-color:#F2F2F2;
                /*@editable*/background-image:none;
                /*@editable*/background-repeat:no-repeat;
                /*@editable*/background-position:center;
                /*@editable*/background-size:cover;
                /*@editable*/border-top:0;
                /*@editable*/border-bottom:0;
                /*@editable*/padding-top:0;
                /*@editable*/padding-bottom:0;
            }
        /*
        @tab Body
        @section Body Interior Style
        */
            .bodyContainer{
                /*@editable*/background-color:#FFFFFF;
                /*@editable*/background-image:none;
                /*@editable*/background-repeat:no-repeat;
                /*@editable*/background-position:center;
                /*@editable*/background-size:cover;
                /*@editable*/border-top:0;
                /*@editable*/border-bottom:0;
                /*@editable*/padding-top:0;
                /*@editable*/padding-bottom:45px;
            }
        /*
        @tab Body
        @section Body Text
        */
            .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
                /*@editable*/color:#808080;
                /*@editable*/font-family:Helvetica;
                /*@editable*/font-size:16px;
                /*@editable*/line-height:150%;
                /*@editable*/text-align:left;
            }
        /*
        @tab Body
        @section Body Link
        */
            .bodyContainer .mcnTextContent a,.bodyContainer .mcnTextContent p a{
                /*@editable*/color:#007E9E;
                /*@editable*/font-weight:normal;
                /*@editable*/text-decoration:underline;
            }
        /*
        @tab Footer
        @section Footer Style
        */
            #templateFooter{
                /*@editable*/background-color:#F2F2F2;
                /*@editable*/background-image:none;
                /*@editable*/background-repeat:no-repeat;
                /*@editable*/background-position:center;
                /*@editable*/background-size:cover;
                /*@editable*/border-top:0;
                /*@editable*/border-bottom:0;
                /*@editable*/padding-top:0;
                /*@editable*/padding-bottom:36px;
            }
        /*
        @tab Footer
        @section Footer Interior Style
        */
            .footerContainer{
                /*@editable*/background-color:#333333;
                /*@editable*/background-image:none;
                /*@editable*/background-repeat:no-repeat;
                /*@editable*/background-position:center;
                /*@editable*/background-size:cover;
                /*@editable*/border-top:0;
                /*@editable*/border-bottom:0;
                /*@editable*/padding-top:45px;
                /*@editable*/padding-bottom:45px;
            }
        /*
        @tab Footer
        @section Footer Text
        */
            .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
                /*@editable*/color:#FFFFFF;
                /*@editable*/font-family:Helvetica;
                /*@editable*/font-size:12px;
                /*@editable*/line-height:150%;
                /*@editable*/text-align:center;
            }
        /*
        @tab Footer
        @section Footer Link
        */
            .footerContainer .mcnTextContent a,.footerContainer .mcnTextContent p a{
                /*@editable*/color:#FFFFFF;
                /*@editable*/font-weight:normal;
                /*@editable*/text-decoration:underline;
            }
        @media only screen and (min-width:768px){
            .templateContainer{
                width:600px !important;
            }

    }	@media only screen and (max-width: 480px){
            body,table,td,p,a,li,blockquote{
                -webkit-text-size-adjust:none !important;
            }

    }	@media only screen and (max-width: 480px){
            body{
                width:100% !important;
                min-width:100% !important;
            }

    }	@media only screen and (max-width: 480px){
            .mcnRetinaImage{
                max-width:100% !important;
            }

    }	@media only screen and (max-width: 480px){
            .mcnImage{
                width:100% !important;
            }

    }	@media only screen and (max-width: 480px){
            .mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{
                max-width:100% !important;
                width:100% !important;
            }

    }	@media only screen and (max-width: 480px){
            .mcnBoxedTextContentContainer{
                min-width:100% !important;
            }

    }	@media only screen and (max-width: 480px){
            .mcnImageGroupContent{
                padding:9px !important;
            }

    }	@media only screen and (max-width: 480px){
            .mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{
                padding-top:9px !important;
            }

    }	@media only screen and (max-width: 480px){
            .mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{
                padding-top:18px !important;
            }

    }	@media only screen and (max-width: 480px){
            .mcnImageCardBottomImageContent{
                padding-bottom:9px !important;
            }

    }	@media only screen and (max-width: 480px){
            .mcnImageGroupBlockInner{
                padding-top:0 !important;
                padding-bottom:0 !important;
            }

    }	@media only screen and (max-width: 480px){
            .mcnImageGroupBlockOuter{
                padding-top:9px !important;
                padding-bottom:9px !important;
            }

    }	@media only screen and (max-width: 480px){
            .mcnTextContent,.mcnBoxedTextContentColumn{
                padding-right:18px !important;
                padding-left:18px !important;
            }

    }	@media only screen and (max-width: 480px){
            .mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{
                padding-right:18px !important;
                padding-bottom:0 !important;
                padding-left:18px !important;
            }

    }	@media only screen and (max-width: 480px){
            .mcpreview-image-uploader{
                display:none !important;
                width:100% !important;
            }

    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Heading 1
        @tip Make the first-level headings larger in size for better readability on small screens.
        */
            h1{
                /*@editable*/font-size:30px !important;
                /*@editable*/line-height:125% !important;
            }

    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Heading 2
        @tip Make the second-level headings larger in size for better readability on small screens.
        */
            h2{
                /*@editable*/font-size:26px !important;
                /*@editable*/line-height:125% !important;
            }

    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Heading 3
        @tip Make the third-level headings larger in size for better readability on small screens.
        */
            h3{
                /*@editable*/font-size:20px !important;
                /*@editable*/line-height:150% !important;
            }

    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Heading 4
        @tip Make the fourth-level headings larger in size for better readability on small screens.
        */
            h4{
                /*@editable*/font-size:18px !important;
                /*@editable*/line-height:150% !important;
            }

    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Boxed Text
        @tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
        */
            .mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{
                /*@editable*/font-size:14px !important;
                /*@editable*/line-height:150% !important;
            }

    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Header Text
        @tip Make the header text larger in size for better readability on small screens.
        */
            .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
                /*@editable*/font-size:16px !important;
                /*@editable*/line-height:150% !important;
            }

    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Body Text
        @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
        */
            .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
                /*@editable*/font-size:16px !important;
                /*@editable*/line-height:150% !important;
            }

    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Footer Text
        @tip Make the footer content text larger in size for better readability on small screens.
        */
            .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
                /*@editable*/font-size:14px !important;
                /*@editable*/line-height:150% !important;
            }

    }</style></head>
        <body>
            <!--*|IF:MC_PREVIEW_TEXT|*-->
            <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span><!--<![endif]-->
            <!--*|END:IF|*-->
            <center>
                <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                    <tr>
                        <td align="center" valign="top" id="bodyCell">
                            <!-- BEGIN TEMPLATE // -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" valign="top" id="templateHeader">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;">
        <tbody class="mcnImageBlockOuter">
                <tr>
                    <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                        <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;">
                            <tbody><tr>
                                <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">
                                    
                                        
                                            <img align="center" alt="" src="*|BRAND:LOGO|*" width="196" style="max-width:196px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage">
                                        
                                    
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateBody">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                    <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody><tr>
                            
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                            
                                <h3>Hello *|FNAME|*,</h3>
    &nbsp;

    <p>You may have heard about the new General Data Protection Regulation ("GDPR"), that comes into effect May 25, 2018. To help comply with GDPR consent requirements, we need to confirm that you would like to receive content from us.</p>

    <p>We hope that our content is useful to you. If you'd like to continue hearing from us, please update your subscription settings.</p>

                            </td>
                        </tr>
                    </tbody></table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
        <tbody class="mcnDividerBlockOuter">
            <tr>
                <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                    <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 2px solid #EAEAEA;">
                        <tbody><tr>
                            <td>
                                <span></span>
                            </td>
                        </tr>
                    </tbody></table>
    <!--            
                    <td class="mcnDividerBlockInner" style="padding: 18px;">
                    <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
    -->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageGroupBlock">
        <tbody class="mcnImageGroupBlockOuter">
            
                <tr>
                    <td valign="top" style="padding:9px" class="mcnImageGroupBlockInner">
                        
                        <table align="left" width="273" border="0" cellpadding="0" cellspacing="0" class="mcnImageGroupContentContainer">
                                <tbody><tr>
                                    <td class="mcnImageGroupContent" valign="top" style="padding-left: 9px; padding-top: 0; padding-bottom: 0;">
                                    
                                        
                                            <img alt="" src="https://mcusercontent.com/e3364b2dc0b3bbb7085333af2/images/45df8a14-3f5e-4d58-9046-535834e9a037.jpg" width="264" style="max-width:921px; padding-bottom: 0;" class="mcnImage">
                                        
                                    
                                    </td>
                                </tr>
                            </tbody></table>
                        
                        <table align="right" width="273" border="0" cellpadding="0" cellspacing="0" class="mcnImageGroupContentContainer">
                                <tbody><tr>
                                    <td class="mcnImageGroupContent" valign="top" style="padding-right: 9px; padding-top: 0; padding-bottom: 0;">
                                    
                                        
                                            <img alt="" src="https://mcusercontent.com/e3364b2dc0b3bbb7085333af2/images/e1b0f30b-0ab1-421b-a9ad-f945b7feff36.jpg" width="264" style="max-width:700px; padding-bottom: 0;" class="mcnImage">
                                        
                                    
                                    </td>
                                </tr>
                            </tbody></table>
                        
                    </td>
                </tr>
            
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
        <tbody class="mcnDividerBlockOuter">
            <tr>
                <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                    <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 2px solid #EAEAEA;">
                        <tbody><tr>
                            <td>
                                <span></span>
                            </td>
                        </tr>
                    </tbody></table>
    <!--            
                    <td class="mcnDividerBlockInner" style="padding: 18px;">
                    <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
    -->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
        <tbody class="mcnDividerBlockOuter">
            <tr>
                <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px 0px;">
                    <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                        <tbody><tr>
                            <td>
                                <span></span>
                            </td>
                        </tr>
                    </tbody></table>
    <!--            
                    <td class="mcnDividerBlockInner" style="padding: 18px;">
                    <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
    -->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
        <tbody class="mcnButtonBlockOuter">
            <tr>
                <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                    <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 3px;background-color: #00ADD8;">
                        <tbody>
                            <tr>
                                <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Helvetica; font-size: 18px; padding: 18px;">
                                    <a class="mcnButton " title="Update Settings" href="*|UPDATE_PROFILE|*" target="_self" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Update Settings</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateFooter">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="footerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                    <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody><tr>
                            
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                            
                                <em>Copyright © *|CURRENT_YEAR|* *|LIST:COMPANY|*, All rights reserved.</em>
    <br>
    *|IFNOT:ARCHIVE_PAGE|*
        *|LIST:DESCRIPTION|*
        <br>
        <br>
        <strong>Our mailing address is:</strong>
        <br>
        *|HTML:LIST_ADDRESS_HTML|* *|END:IF|*
        <br>
        <br>
        Want to change how you receive these emails?<br>
        You can <a href="*|UPDATE_PROFILE|*">update your preferences</a> or <a href="*|UNSUB|*">unsubscribe from this list</a>.
        <br>
        <br>
        *|IF:REWARDS|* *|HTML:REWARDS|*
    *|END:IF|*

                            </td>
                        </tr>
                    </tbody></table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                            </table>
                            <!-- // END TEMPLATE -->
                        </td>
                    </tr>
                </table>
            </center>
        </body>
    </html>

    `;
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

module.exports = router;