// api_trabajoOT

const router = require('express').Router();
const dotenv = require('dotenv');
dotenv.config();

// SPARKPOST
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET)

var moment = require('moment-timezone');
moment().tz("America/Lima").format();
const Nexmo = require('nexmo');
const BitlyClient = require('bitly').BitlyClient;
const bitly = new BitlyClient(process.env.BITLY_API);

const {check,validationResult} = require('express-validator');

const { Film, trabajoOTModel, User, puestoIsoModel, otModel,sequelize,personalOTModel,productosModel,trabajoOTProdModel,archiGoogleModel } = require('../../db');


trabajoOTModel.belongsTo(
    otModel,
    {
        targetKey: 'IdOT',
        foreignKey: 'IdOT',
        as : 'DetalleOT'
    }
);
otModel.belongsTo(
    trabajoOTModel,
    {
        targetKey: 'IdOT',
        foreignKey: 'IdOT',
        as : 'DetalleOT'
    }
);

const { Op } = require("sequelize");

// ====================================================
// ====================================================
// ====================================================
// ====================================================
// ====================================================
// ====================================================
// ====================================================

//////////////////////////////////////////
//      TRABAJOS GENERADOS EN LA OT     //
//////////////////////////////////////////
router.post('/ot', async (req,res)=>{
    // IdOT
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await trabajoOTModel.findAll({
        where : {
            IdOT : req.body.IdOT
        }
    });
    
    res.json( $response );
});
// ----------------------------------------------------

//////////////////////////////////////////
//      	REPORTE TRABAJO OT		    //
//////////////////////////////////////////
router.post('/reporte', async (req,res)=>{
    // inicio, fin, NroOT, NroDNI, Cliente, Local, TFecha
    var $response = {};
	$response.estado = 'OK';
	$response.data = [];
    var $where = {}, $where2 = {};
	const { Op } = require("sequelize");
	
	var TFecha 	= req.body.TFecha;
	var inicio 	= req.body.inicio;
	var fin 	= req.body.fin;
	var NroOT 	= req.body.NroOT;
	var NroDNI 	= req.body.NroDNI;
	var Cliente = req.body.Cliente;
	var Local 	= req.body.Local;
	var Estado  = req.body.Estado;

	if( Estado != '' ){
		$where.estado = Estado;
	}
	if( TFecha == 'Trabajo' ){
		// buscamos por fecha de trabajo
		$where.inicio_trabajo 	= { [Op.gte ]: inicio };
		$where.fin_trabajo 		= { [Op.lte ]: fin+' 23:59:59' };
	}
	if( TFecha == 'Asignado' ){
		// buscamos por fecha de asignacion
		$where.fecha_asignado = { [Op.gte ]: inicio,[Op.lte ]: fin };
	}
	if( TFecha == 'Servicio' ){
		// buscamos por fecha de la OT
		$where2.FechaMySQL = { [Op.gte ]: inicio,[Op.lte ]: fin };
	}
	// OT's
	if( NroOT != '' ){
		var $arNroOT = NroOT.split(',');
		$where2.IdOT = { [Op.in] : $arNroOT };
	}
	// DNI's
	if( NroDNI != '' ){
		var $arNroDNI = NroDNI.split(',');
		$where.dni = { [Op.in] : $arNroDNI };
	}
	// Cliente
	if( Cliente != '' ){
		$where2.IdClienteProv = Cliente;
	}
	// Local
	if( Local != '' ){
		$where2.IdLocal = Local;
	}

	//
	console.log($where);
	$response.w =$where;
	$response.w2 =$where2;
	//

	$response.data = await trabajoOTModel.findAll({
		where : $where,
		order :
		[
			[ 'IdOT' , 'DESC' ]
		],
		include: [{
			model: otModel,
			as: 'DetalleOT',
			where : $where2,
		}]
	});



	res.json($response);
});

// ----------------------------------------------------
async function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}
// ----------------------------------------------------
router.post('/agregar_lista', [
    check('idUser' ,'Seleccione un personal').not().isEmpty(),
    check('celular' ,'Ingrese un número de celular').not().isEmpty()
],async (req,res)=>{
    // uuid, idUser, celular

    // Agregar items de personal a la lista pero aún sin el Nro de OT

    var $response = {};
	$response.estado = 'OK';
	$response.data = [];
    var $where = {}, FechaHoraOT = ``;
    const { Op } = require("sequelize");

    // Validar
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        $response.estado  = 'ERROR';
        $response.errores = errors.array();
        return res.status(422).json( $response );
    }

	var dataOT = await otModel.findOne({
		where : {
			IdOT : req.body.IdOT
		}
	})
	.catch(function (err) {
		// handle error;
		$response.estado = 'ERROR';
		$response.error  = err.original.sqlMessage;
		res.json( $response );
	});
	if( dataOT ){
		var sHora = dataOT.Hora;
		var tHora = await pad( sHora , 4 );
		console.log( tHora );
		var lHora = tHora.substring(0,2), lMinuto = tHora.substring(4,2);
		console.log('Minuto =>'+lMinuto);
		var fechaHora = dataOT.FechaMySQL+' '+lHora+':'+lMinuto;
		console.log(`Fecha hora /OT ${fechaHora}`);
		FechaHoraOT = fechaHora;
	}

    var $UserData = await User.findOne({
        where : {
            dni : req.body.idUser
        }
    });
    // Intentando agregar al usuario
    if( $UserData )
    {
        // Ya existe en la tabla? con el uu_id¿?.
        $existeUser = await trabajoOTModel.findOne({
            where : {
                id_usuario : $UserData.dni,
                IdOT : req.body.IdOT
            }
        });
        if( $existeUser )
        {
            $response.error = 'El personal ya existe en la lista.';
            $response.estado  = 'ERROR';
        }else{
            // Agregando usuario...
            var $FechaMod =  moment().format('YYYY-MM-DD HH:mm:ss');
            $dataPuesto = [];

            if( $UserData.idPuestoIso != '' )
            {
                $dataPuesto = await puestoIsoModel.findOne({
                    where :
                    {
                        idPuestoIso : $UserData.idPuestoIso
                    }
                });
            }
        
            var $insert = {
                uu_id       : await renovarToken(),
                IdOT        : req.body.IdOT,
                id_usuario  : $UserData.id,
                usuario     : $UserData.name,
                dni         : $UserData.dni,
                celular         : req.body.celular,
                correo_tecnico  : req.body.correo,
                usuario         : $UserData.name,
                fecha_asignado  : $FechaMod,
				fecha_ot 		: FechaHoraOT
            };
            if( $dataPuesto )
            {
                $insert.puesto = $dataPuesto.Descripcion;
            }
            $response.data = await trabajoOTModel.create($insert);
        }

    }else{
        $response.error = 'Usuario no existe';
        $response.estado  = 'ERROR';
    }

    // devolvemos los usuarios con este uuid
    $response.data = await trabajoOTModel.findAll({
        where : {
            IdOT : req.body.IdOT,
            deleted_at : { [Op.is ] : null }
        }
    });
    $response.data.forEach( function(valor, indice, array) {
        console.log("En el indice " + indice + " hay este valor: " + valor.celular);
    });

	res.json($response);
});

// ----------------------------------------------------
// Quitar tecnico de la lista
router.delete('/quitar_lista/:IdTec', async (req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.data = [];
    var $where = {};
    const { Op } = require("sequelize");

    $dataEntidad = await trabajoOTModel.findOne({
        where : {
            id : req.params.IdTec
        }
    });

    //

    if( $dataEntidad )
    {
        //
        var $FechaMod =  moment().format('YYYY-MM-DD HH:mm:ss');
        $response.data = await trabajoOTModel.update({
            deleted_at : $FechaMod
        },{
            where : { id : req.params.IdTec }
        });
        //
        // devolvemos los usuarios con este uuid
        $response.data = await trabajoOTModel.findAll({
            where : {
                IdOT 		: $dataEntidad.IdOT,
                deleted_at 	: { [Op.is ] : null }
            }
        });
    }

    //

	res.json($response);
});

// ----------------------------------------------------

// Guardar trabajo OT
router.post('/guardar_trabajo', async (req,res)=>{

    // uuid, NroOT

    var $response 		= {};
    $response.estado 	= 'OK';
    $response.url_bitly = '';
	$response.data = [];
    var $where 	 = {};
    const { Op } = require("sequelize");
    var $NroOT 	 = req.body.NroOT;

    // Ya fue generada con atenrioridad¿?
    var $dataEntidad = await otModel.findOne({
        where : {
            IdOT : $NroOT,
            deleted_at : { [Op.is ] : null }
        }
    });

    await trabajoOTModel.update({
        IdOT : $NroOT
    },{
        where : {
            uu_id : req.body.uuid
        }
    });
    // Link en bitly
    var $texto_mms = 'Se asigno la OT #'+$NroOT+' revisar ', linkApp = '';
    var $url = process.env.MODULO_TRABAJO+'ver_ot/'+$NroOT;

    try{
        //$response.url_bitly = await bitly.shorten($url);
        //console.log( $response.url_bitly );
        await bitly
        .shorten($url)
        .then(function(result) {
            //console.log(result);
            linkApp += ''+result.link;
        })
        .catch(function(error) {
            console.error(error);
        });
    }catch( error ){
        console.log(error);
    }
    
    // notificar por mensaje de texto a los tecnicos!
    var $detalle = await trabajoOTModel.findAll({
        where : {
            IdOT : $NroOT ,
			deleted_at : { [Op.is ] : null },
			notificado : ''
        }
    });
    const nexmo = new Nexmo({
        apiKey      : '97ffa645',
        apiSecret   : 'QgrqkAkvpWQZIcJ5',
    });
    var direccionesMail = [];
    //
    $detalle.forEach( function(valor, indice, array) {
		// Marcado como notificado al técnico
		trabajoOTModel.update({ notificado : 'SI' },{ where : { id : valor.id } })
		.then(function(item){
			console.log(`Notificado => ${valor.usuario}`);
		})
		.catch(function (err) {
			$response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
		});
		// fin marcado notificado...

        var $celular = valor.celular;
        if( valor.correo_tecnico != '' ){
            direccionesMail.push( { address : valor.correo_tecnico , name : valor.usuario } );
        }
        if( $celular.length == 9 )
        {
            const from 		= 'SSAYS SAC';
            const _Phono1   = '51'+$celular;
            const text 		= $texto_mms;
            if(! isNaN($celular) )
            {
                // Enviar mensaje!
				var _Asunto = `Hola *${valor.usuario}*, se asignó la OT Nro. *${$NroOT}* para ver los dato por favor ingresa a: ${linkApp},
_Para poder ver los links/imagenes por favor agrega a este número a tus contactos, gracias._`;
				//await apiChatApi( 'sendMessage', { phone : _Phono1 , body: _Asunto });
				//await apiChatApi('sendFile',{ phone : _Phono1 , body: `https://api2.ssays-orquesta.com/logo-ssays-2019-2.png` , filename : 'Logo SSAYS SAC' });
                // nexmo.message.sendSms(from, to, text);
                console.log('Enviando mensaje a=>'+$celular+'=>'+text);
                // console.log('Mensaje:'+text);
            }
            //console.log("En el indice " + indice + " hay este valor: " + valor.celular);
        }else{
            console.log( $celular.length );
        }
    });
    // Enviamos correo...
    console.log(direccionesMail);
    /**/
    if( direccionesMail.length > 0 )
    {
        var $body = getBody_mail( $dataEntidad , $url );
        clientMail.transmissions.send({
            content: {
                from    : {
                    name  : 'Robot de Orquesta',
                    email : 'robot@ssays-orquesta.com'
                },
                subject : `OT asignada #${$NroOT} - ${$dataEntidad.nombre_cliente}`,
                html    : $body
            },
            recipients: direccionesMail
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
    /**/

	$response.data = await trabajoOTModel.findAll({
        where : {
            IdOT : $NroOT ,
			deleted_at : { [Op.is ] : null },
        }
    });
    

    

	res.json($response);
});

// ----------------------------------------------------

// Obtener todos
router.get('/',async(req,res)=>{

    var $response = {};
    $response.estado = 'OK';
	$response.data = [];
    var $where = {};
    const { Op } = require("sequelize");

	$response.data = await trabajoOTModel.findAll({
        where:{
            deleted_at : { [Op.is ] : null }
        },
        order :
        [
            [ 'IdOT' , 'DESC' ]
        ],
        limit : 100,
        include: [{
            model: otModel,
            as: 'DetalleOT',
        }]
    });
    /* on : {
        col1: sequelize.where(sequelize.col("ModelA.IdOT"), "=", sequelize.col("ModelB.IdOT")),
    } */

    res.json($response);
});

// ----------------------------------------------------
// Buscar OT trabajo
router.post('/buscar', async (req,res)=>{
    // inicio, fin, Tecnico, ids
    var $response = {};
	$response.estado = 'OK';
	$response.data = [];
    var $where = {}, $where2 = {};
    const { Op } = require("sequelize");
    
    $where.deleted_at = { [Op.is ] : null };
    $where2.FechaMySQL = { [Op.gte ]: req.body.inicio,[Op.lte ]: req.body.fin };

    if( req.body.ids != '' )
	{
		var $ids = req.body.ids;
        var $arIds = $ids.split(',');
        //
        $response.data = await trabajoOTModel.findAll({
            where : $where,
            order :
            [
                [ 'IdOT' , 'DESC' ]
            ],
            include: [{
                model: otModel,
                as: 'DetalleOT',
                where: {
                    IdOT : { [Op.in] : $arIds }
                },
            }]
        });
    }
    else
    {
        if( req.body.tecnico != '' )
        {
            $where.dni = req.body.tecnico;
        }
        $response.data = await trabajoOTModel.findAll({
            where : $where,
            order :
            [
                [ 'IdOT' , 'DESC' ]
            ],
            include: [{
                model: otModel,
                as: 'DetalleOT',
                where : $where2,
            }]
        });
    }

	res.json($response);
});

// ----------------------------------------------------
// Traer los datos de una OT en trbabajo by IdOT
router.post('/get_data', async (req,res)=>{

    var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';
    $response.data = [];
    $response.tecnicos = [];
    $response.personal = [];
    $response.detalle = [];
    var $where = {};
    
    $response.data = await otModel.findOne({
        where : {
            IdOT : req.body.id
        }
    });
    

    if( $response.data )
    {
        $response.personal = await personalOTModel.findAll({
            where : {
                IdOT : req.body.id
            }
        })
        //
        $response.encontrado = 'SI';
        $response.tecnicos = await trabajoOTModel.findAll({
            where : {
                IdOT : req.body.id
            }
        });
    }

	res.json($response);
});

// ----------------------------------------------------
// Traer los datos de una OT en trbabajo by UUID
router.post('/get_data_uuid', async (req,res)=>{

    var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';
    $response.data = [];
    $response.files = [];
    $response.ot = [];
    $response.detalle = [];
	var $where = {};
	
	await trabajoOTModel.findOne({
		where : {
			uu_id : req.body.uuid
		}
	})
	.then(function(item){
		$response.data = item;
	})
	.catch(function (err) {
		// handle error;
		$response.estado = 'ERROR';
		$response.error  = err.original.sqlMessage;
		res.json( $response );
	});
	
	if( $response.data ){
		$response.encontrado = 'SI';
		$response.files = await archiGoogleModel.findAll({
			where : {
				modulo 		: 'APP',
				formulario 	: 'OT_SERVICIO',
				correlativo : $response.data.id,
				deleted_at  : { [Op.is ] : null }
			}
		});
		$response.ot = await otModel.findOne({
			where : {
				IdOT : $response.data.IdOT
			}
		});
	}

	res.json($response);
});

// ----------------------------------------------------

// Consultar y traer data de una OT
router.post('/get_data_trabajo', async (req,res)=>{

    var $response        = {};
    $response.estado     = 'OK';
    $response.encontrado = 'NO';
    $response.data       = [];
    $response.tecnicos   = [];
    var $where = {};
    const { Op } = require("sequelize");

    // Ya fue generada con atenrioridad¿?
    var $dataEntidad = await trabajoOTModel.findOne({
        where : {
            IdOT : req.body.IdReq,
            deleted_at : { [Op.is ] : null }
        }
    });
    if( $dataEntidad )
    {
        $response.estado  = 'ERROR';
        $response.error   = 'La OT ya fue asignada anteriormente';
        $response.encontrado = 'SI';
        return res.json($response);
    }

    // Estado : 'Aprobado'
    $response.data = await otModel.findOne({
        where : {
            IdOT : req.body.IdReq
        },
        include: [{
            model: personalOTModel,
            as: 'Detalle'
        }]
    });
    if( $response.data )
    {
        $response.encontrado = 'SI';
    }
    $response.tecnicos = await trabajoOTModel.findAll({
        where : {
            IdOT : req.body.IdReq
        }
    });

	res.json($response);
});

// ----------------------------------------------------






// ----------------------------------------------------
// Borrar !!!!
router.delete('/:filmID', async (req,res)=>{
	await Film.destroy({
		where : {id:req.params.filmID}
	});
	res.json({success:'se ha borrado la pelicula'});
});


// ----------------------------------------------------
// ----------------------------------------------------
// ----------------------------------------------------
//////////////////////////////////////////////////////////
//     EVNAR CORREO REP COMERCIAL ASIGNADO A FICHA      //
//////////////////////////////////////////////////////////
function getBody_mail( DataOT , url )
{
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
		<title>OT asignada #${DataOT.IdOT}</title>
        
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
		<!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">Buen día se asignó la OT #${DataOT.IdOT}. por favor ingresar al sistema.</span><!--<![endif]-->
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
                        
                            <h3>Buen día,</h3>
							<br>
                            <p>Se asignó la OT #${DataOT.IdOT} para usted con los siguientes datos:
                            <br><br>
                            Cliente:<br><strong>${DataOT.nombre_cliente}</strong>
                            <br><br>
                            Local:<br><strong>${DataOT.local}</strong>
                            <br><br>
                            Dirección : <br><strong>${DataOT.Direccion}</strong>
                            <br><br>
                            Servicio : <br><strong>${DataOT.nombre_sistema}</strong>
                            <br><br>
                            Instrucciónes : <br><strong>${DataOT.Glosa}</strong>
                            <br><br>
                            Supervisor : <br><strong>${DataOT.nombre_supervisor}</strong>
                            <br><br>
                            Por favor ingrese al sistema para confirmar.
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
                                <a class="mcnButton " title="Update Settings" href="${url}" target="_self" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Ingresar</a>
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
                        
                            <em>Copyright © 2020 SSAYS SAC, todos los derechos reservador.</em>
    <br>
    <br>
    <strong>Email:</strong>
    <br>
    soporte@ssays-orquesta.com | 981271112
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
    return $body
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
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;
