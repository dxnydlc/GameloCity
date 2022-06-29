

const router = require('express').Router();


// Modelos
const { errorLogModel } = require('../../dbA');
const { permisoHorasModel, User, tipoDocumentoModel, sequelize } = require('../../db');


const {check,validationResult} = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();
// SPARKPOST
const SparkPost = require('sparkpost')
const clientMail= new SparkPost(process.env.SPARKPOST_SECRET)
const client= new SparkPost(process.env.SPARKPOST_SECRET)

// MOMENT
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
const { Op } = require("sequelize");


// WHATSAPP
const config = require("./whatsapp.js");
const tokenWS = config.token, apiUrlWS = config.apiUrl;
const fetch = require('node-fetch');
var _LogoSSAYS = 'https://api2.ssays-orquesta.com/logo-ssays-2019-2.png';









//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await permisoHorasModel.findAll({
        order : [
            ['idPermiso' , 'DESC']
        ],
        limit : 500
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER LISTA     			//
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await permisoHorasModel.findAll({
        where : {
            estado : 1
        },
        order : [
            ['idPermiso' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR PERMISO H       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('TipoDoc' ,'El tipo documento es obligatorio').not().isEmpty(),
    check('Usuario' ,'El tipo usuario es obligatorio').not().isEmpty(),
    check('idClienteProv' ,'El cliente es obligatorio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.FechaMod       = moment().format('YYYY-MM-DD HH:mm:ss');
    req.body.UsuarioMod     = $userData.name;
    req.body.UsuarioCreado  = $userData.name;

    var $MiSoli = await User.findOne({
        where : {
            dni : req.body.Usuario
        }
    });

    if( $MiSoli )
    {
        // crear la apertura
        var Ar_TipoDoc = req.body.Ar_TipoDoc;
        delete req.body.Ar_TipoDoc;
        var NDocs = Ar_TipoDoc.split(",");
        // 
        for (let index = 0; index < NDocs.length; index++) {
            var $IdApertura = await permisoHorasModel.max('idPermiso')+1;
            req.body.idPermiso = $IdApertura;
            const $IdTipoDoc = NDocs[index];
            var $TDoc = await tipoDocumentoModel.findOne({
                where : {
                    IdTipoDoc : $IdTipoDoc
                }
            });
            req.body.nombre_documento = $TDoc.Descripcion;
            req.body.TipoDoc = $IdTipoDoc;
            req.body.uu_id = await renovarToken();
            await permisoHorasModel.create(req.body);
        }
        
        

        // Enviar correo...
        client.transmissions.send({
            content: {
                from      : 'robot@ssays-orquesta.com',
                subject   : `#${$IdApertura} Apertura ${req.body.cliente}`,
                html      : `<h3>Hola <u>${$MiSoli.name}</u>,</h3><p><br/><br/>Se aperturó el cliente <b>${req.body.cliente}</b> para su usuario<br/><br/>
                            <strong>Motivo:</strong><br/> ${req.body.Motivo}<br/><br/>
                            <strong>Fecha:</strong><br/> ${req.body.Fecha}<br/><br/>
                            <strong>Inico:</strong><br/> ${req.body.hora_inicio}<br/><br/>
                            <strong>Fin:</strong><br/> ${req.body.hora_fin}<br/><br/>
                            <br/><br/>
                            <strong>Atención:</strong><br/> <i>${$userData.name} | ${req.body.FechaMod}</i></p>`
            },
            recipients: [
                {address: $MiSoli.email }
            ]
        })
        .then(data => {
            console.log('Woohoo! You just sent your first mailing!')
            console.log(data)
        })
        .catch(err => {
            console.log('Whoops! Something went wrong')
            console.log(err)
        });
    }

    
    $response.data = await permisoHorasModel.findAll({
        order : [
            ['idPermiso' , 'DESC']
        ],
        limit : 500
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR PERMISO            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';
    $response.data = [];

    $response.data = await permisoHorasModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });

    if( $response.data )
    {
        $response.encontrado = 'SI';
    }
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR PERMISO            //
//////////////////////////////////////////
router.put('/:uuid', [
    check('TipoDoc' ,'El tipo documento es obligatorio').not().isEmpty(),
    check('Usuario' ,'El tipo usuario es obligatorio').not().isEmpty(),
    check('idClienteProv' ,'El cliente es obligatorio').not().isEmpty(),
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
    delete req.body.UsuarioCreado;
    delete req.body.UsuarioAnulado;
    req.body.UsuarioModificado = $userData.name;

    var $TDoc = await tipoDocumentoModel.findOne({
        where : {
            IdTipoDoc : req.body.TipoDoc
        }
    });
    if( $TDoc )
    {
        req.body.nombre_documento = $TDoc.Descripcion;

        await permisoHorasModel.update(req.body,{
            where : { 
                uu_id : req.params.uuid 
            }
        });
    }
    
    $response.data = await permisoHorasModel.findAll({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR PERMISO            //
//////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // IdAlmacen
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    // delete req.body.UsuarioMod;
    // delete req.body.editado_por;
    req.body.UsuarioAnulado = $userData.name;

    $anuladoPor = $userData.name;

	await permisoHorasModel.update({
        Estado         : 0,
        UsuarioAnulado : $anuladoPor,
        deleted_at     : moment().format('YYYY-MM-DD HH:mm:ss')
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });

    $response.data = await permisoHorasModel.findAll({
        where : {
            uu_id : req.params.uuid
        }
    });
    
    res.json( $response );
});

// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      	AGREGAR APERTURA HORA MANUAL       			//
//////////////////////////////////////////////////////////
router.post('/generar_nuevo', [
    check('AutorizadoPor' ,'Indicar quien autoriza').not().isEmpty(),
    check('TipoDoc' ,'Seleccione documentos').not().isEmpty(),
    check('idClienteProv' ,'Seleccione un cliente').not().isEmpty(),
    check('Fecha' ,'Ingrese una fecha').not().isEmpty(),
    check('Motivo' ,'Ingrese un motivo de apertura').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }

    var $response = {};
    $response.estado = 'OK';
    $response.previo = 'NO';
    //
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.FechaMod = moment().format('YYYY-MM-DD HH:mm:ss');
	var $horaHoy = moment().format('HH:mm:ss');

	// Cuando no es la fecha de hoy deberá pasar normal
	var $FechhOY = moment().format('YYYY-MM-DD');
	var a = moment($FechhOY);
	var b = moment(req.body.Fecha);
	var $numsDiff = parseInt( b.diff(a, 'days') );
	console.log('dias diff >>>'+$numsDiff);
	// Cuando no es la fecha de hoy deberá pasar normal
	if( $numsDiff == 0 )
	{
		/**/
		var $dataPrev = await permisoHorasModel.findOne({
			where : {
				Usuario         : req.body.Usuario,
				idClienteProv   : req.body.idClienteProv,
				Fecha           : req.body.Fecha,
				Estado          : 1
			}
		});
		//console.log( `${$dataPrev.Fecha} ${$dataPrev.hora_fin}` );
		if( $dataPrev )
		{
			// Aun esta activo el permiso anterior¿?
			var now   = moment().format('YYYY-MM-DD HH:mm');
			var then  = `${$dataPrev.Fecha} ${$dataPrev.hora_fin}`;
			var $diff = moment.utc(moment(now,"YYYY-MM-DD HH:mm").diff(moment(then,"YYYY-MM-DD HH:mm"))).format("HH:mm:ss")
			console.log( $diff );
			if( now  <= then )
			{
				$response.previo = 'SI';
			}else{
				$response.previo = 'NO';
			}
		}

		$response.prev = $dataPrev;
	}
	

	/**/
    if( $response.previo == 'NO' )
    {
        // Usuario => DNI
        var $MiSoli = await User.findOne({
            where : {
                dni : req.body.Usuario
            }
        });

        if( $MiSoli )
        {
            // crear la apertura
            var Ar_TipoDoc = req.body.Ar_TipoDoc;
            delete req.body.Ar_TipoDoc;
            var NDocs = Ar_TipoDoc.split(",");
            // 
            for (let index = 0; index < NDocs.length; index++) {
                var $IdApertura = await permisoHorasModel.max('idPermiso')+1;
                req.body.idPermiso = $IdApertura;
                const $IdTipoDoc = NDocs[index];
                var $TDoc = await tipoDocumentoModel.findOne({
                    where : {
                        IdTipoDoc : $IdTipoDoc
                    }
                });
                req.body.nombre_documento = $TDoc.Descripcion;
                req.body.TipoDoc = $IdTipoDoc;
                req.body.uu_id = await renovarToken();
                req.body.UsuarioMod     = $userData.name;
                req.body.UsuarioCreado  = $userData.name;
                req.body.Estado = 2; // Pendiente
                await permisoHorasModel.create(req.body);
            }
            // Enviar por correo
            var $dataPH = await permisoHorasModel.findAll({
                where : {
                    token : req.body.token
                }
            });
            // Usuario destino
            var $usuarioDestino = await User.findOne({
                where : {
                    dni : req.body.AutorizadoPor
                }
            });
            var $body = await bodyApertura( $dataPH );
            clientMail.transmissions.send({
                content: {
                  from    : {
					  name : 'Robot de Orquesta',
					  email : 'robot@ssays-orquesta.com'
				  },
                  subject : `Apertura de sistema ${$dataPH[0].cliente} - ${$dataPH[0].idPermiso}.`,
                  html    : $body
                },
                recipients: [
                    { address: $usuarioDestino.email }
                ]
            })
            .then(data => {
                console.log(`>>>>> SE ENVIO PERMISO POR HORAS: ${$usuarioDestino.email}`);
                console.log(data)
            })
            .catch(err => {
                console.log('>>>>>>>>>>>>>>>>> ERROR ENVIAR CORREO PERMISO POR HORAS')
                console.log(err)
            });
			// celular
			// Ahora enviamos el mensaje de texto
			var rs = $usuarioDestino;
            if( $usuarioDestino.celular )
            {
                var $celular = $usuarioDestino.celular;
                if( $celular.length == 9 )
                {
                    const from = 'SSAYS SAC';
                    var to   = '51'+$celular;

                    // Enviar WhatsApp
					var $rs = $dataPH[0];
					var $urlDestino = `${process.env.URL_TECNICO}/activar/apertura/${$rs.AutorizadoPor}/${$rs.token}`;
                    console.log(`WhatsApp a: ${rs.name}-${rs.dni}_`);
                    var texto1 = `
*Robot de Orquesta: * solicitud de apertura de ${$dataPH[0].cliente}, usuario ${$dataPH[0].nombre_usuario}, para aprobar click aquí: ${$urlDestino}.`;
                    // Enviando texto
                    var _Resultado = await apiChatApi( 'sendMessage', { phone : to , body: texto1 });
                    // --------------------------------
					console.log('>>>>>>>>>>> RESULTADO ENVIO WS PERMISO POR HORAS');
                    //console.log( _Resultado );
                    // --------------------------------
                    console.log(`Enviando a WhatsApp ${to}`);
                }
            }
        }
        //
    }
	/**/
    $response.data = await permisoHorasModel.findAll({
        order : [
            ['idPermiso' , 'DESC']
        ],
        limit : 500
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      	ACTIVAR APERTURA POR HORA MANUAL   			//
//////////////////////////////////////////////////////////
router.post('/activar', [
    check('token' ,'El token es obligatorio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';
    var $userData = await getUserData( req.headers['api-token'] );

    var $usuarioMod = $userData.name;

    var $dataAperturaH = await permisoHorasModel.findAll({
        where : {
            token : req.body.token
        }
    });

    if( $dataAperturaH )
    {
        $response.encontrado = 'SI';
        //
        var $horaInicio = moment().format('HH:mm:ss');
        var $fechaHoy   = moment().format('YYYY-MM-DD HH:mm:ss');
        var $horaFin    = moment( $fechaHoy ).add(1, 'hours').format('HH:mm:ss');

        for (let index = 0; index < $dataAperturaH.length; index++) {
            const element   = $dataAperturaH[index];
            
            // - //
            var $dataUpdate = {};
            $dataUpdate.UsuarioModificado = $usuarioMod;
            $dataUpdate.TopeHora    = 1;
            $dataUpdate.Estado      = 1;
            $dataUpdate.hora_inicio = $horaInicio;
            $dataUpdate.hora_fin    = $horaFin;
            $dataUpdate.updated_at  = moment().format('YYYY-MM-DD HH:mm:ss');
            // - //
            await permisoHorasModel.update( $dataUpdate ,{
                where : { 
                    token : req.body.token
                }
            });
            // - //
        }
        // Ahora avisamos al usuario solicitante
    }else{
        //
    }
    

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//      CARGAR APERTURA BY TOKEN        //
//////////////////////////////////////////
router.post('/bytoken', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';
    $response.data = [];

    $response.data = await permisoHorasModel.findAll({
        where : {
            token : req.body.token
        }
    });

    if( $response.data )
    {
        $response.encontrado = 'SI';
    }
    
    res.json( $response );
});

// -------------------------------------------------------

//////////////////////////////////////////
//      ELIMINAR PERMISO POR TOKEN      //
//////////////////////////////////////////
router.delete('/bytoken/:token', async (req,res)=>{
    // IdAlmacen
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    // delete req.body.UsuarioMod;
    // delete req.body.editado_por;
    req.body.UsuarioAnulado = $userData.name;

    $anuladoPor = $userData.name;

	await permisoHorasModel.update({
        Estado         : 0,
        UsuarioAnulado : $anuladoPor,
        deleted_at     : moment().format('YYYY-MM-DD HH:mm:ss')
    },{
		where : { 
            token : req.params.token 
        }
    });

    $response.data = await permisoHorasModel.findAll({
        where : {
            token : req.params.token 
        }
    });
    
    res.json( $response );
});

// -------------------------------------------------------

// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
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
async function bodyApertura( $data )
{
    var $rs = $data[0];
    var $urlDestino = `${process.env.URL_TECNICO}/activar/apertura/${$rs.AutorizadoPor}/${$rs.token}`;
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
		<title>Apertura sistema</title>
        
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
		<!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">Apertura de sistema para cliente ${$rs.cliente} de parte del usuario ${$rs.nombre_usuario}</span><!--<![endif]-->
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
                                
                                    
                                        <img align="center" alt="" src="https://api2.ssays-orquesta.com/logo-ssays-2019-2.png" width="196" style="max-width:196px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage">
                                    
                                
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
                        
                            <h3>Hola ${$rs.NombreAutorizadoPor},</h3><br><br>
                            <p>
                            El usuario <strong>${$rs.nombre_usuario}</strong>,<br><br>
                            Solicita la apertura del sistema para el cliente <u>${$rs.cliente}</u> bajo el siguiente motivo: <br/><br/>
                            ${$rs.Motivo}
                            <br/><br/>
                            Si usted desea aprobar esta solicitud por favor dar click en el boton.
                            </p>
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
                                <a class="mcnButton " title="Update Settings" href="${$urlDestino}" target="_self" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Revisar</a>
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
                        
                            <em>Copyright © 2020 SSAYS S.A.C., todos los derechos reservados.</em>
<br>


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
    return  $body;
}
// -------------------------------------------------------
async function apiChatApi( method , params ){
	try {
		const options = {};
		options['method'] = "POST";
		options['body'] = JSON.stringify(params);
		options['headers'] = { 'Content-Type': 'application/json' };
		
		const url = `${apiUrlWS}/${method}?token=${tokenWS}`; 
		
		const apiResponse = await fetch(url, options);
		const jsonResponse = await apiResponse.json();
		return jsonResponse;
	} catch (error) {
		
	}
		
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
// -------------------------------------------------------
// -------------------------------------------------------


module.exports = router;