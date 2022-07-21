
const router = require('express').Router();

const dotenv = require('dotenv');
dotenv.config();
// SPARKPOST
const SparkPost = require('sparkpost')
const client    = new SparkPost(process.env.SPARKPOST_SECRET)
// MOMENT
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// NEXMO
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const { Film,trabajoOTModel,User,puestoIsoModel,otModel,sequelize,personalOTModel,archiGoogleModel,productosModel,trabajoOTProdModel,sucursalModel } = require('../../db');

trabajoOTModel.belongsTo(
    otModel,
    {
        targetKey: 'IdOT',
        foreignKey: 'IdOT',
        as : 'DetalleOT1'
    }
);
otModel.belongsTo(
    trabajoOTModel,
    {
        targetKey: 'IdOT',
        foreignKey: 'IdOT',
        as : 'DetalleOT2'
    }
);



// ---------------------------------------------------
// Cargar home app
router.post('/get_home', async (req,res)=>{
    // dni , inicio, fin
    var $response = {};
	$response.estado = 'OK';
	$response.data = [];
    var $where = {},$where2 = {};
    $response.count_todos   = 0;
    $response.count_fin     = 0;
    $response.count_proceso = 0;
    $response.count_cancelado = 0;
    //
    $where.dni = req.body.dni;
    $where2.FechaMySQL = { [Op.gte ]: req.body.inicio,[Op.lte ]: req.body.fin };

    $response.data = await trabajoOTModel.findAll({
        where : $where,
        include: [{
            model: otModel,
            as: 'DetalleOT',
            where : $where2,
        }],
        order :
        [
            [ 'DetalleOT', 'FechaMySQL' , 'DESC' ]
        ],
    });

    // Contador asignados (todos)
    await trabajoOTModel.count({
        where : $where
    }).then( c =>{
        $response.count_todos = c;
    });
    $where.estado = 'Realizado';
    // Contador Finalizado
    await trabajoOTModel.count({
        where : $where
    }).then( c =>{
        $response.count_fin = c;
    });
    // Contador En-proceso
    $where.estado = 'En-Proceso';
    await trabajoOTModel.count({
        where : $where
    }).then( c =>{
        $response.count_proceso = c;
    });
    // Contador Cancelador
    await trabajoOTModel.count({
        where : {
            estado : { [Op.in ] : ['Postergado','Cancelado','Documentacion','Error De Digitacion','Otros'] },
            dni : req.body.dni
        }
    }).then( c =>{
        $response.count_cancelado = c;
    });

	res.json($response);
});

// ---------------------------------------------------
// Cargar home mapa tecnico
router.post('/get_en_proceso', async (req,res)=>{
    // 
    var $response = {};
	$response.estado = 'OK';
	$response.data = [];
    var $where = {};

    $response.data = await trabajoOTModel.findAll({
        where : {
            estado : 'En-Proceso'
        },
        include: [{
            model: otModel,
            as: 'DetalleOT',
        }],
        order :
        [
            [ 'DetalleOT', 'FechaMySQL' , 'DESC' ]
        ],
    });

	res.json($response);
});

// ---------------------------------------------------

// Obtener datos el trabajo
router.post('/get_data_trabajo', async (req,res)=>{
    // IdOT, IdUser
    var $response = {};
	$response.estado    = 'OK';
    $response.data      = [];
    $response.archivos  = [];
    $response.prodis    = [];
    $response.local     = [];
    // - //
    var $where = {};
    $where.IdOT = req.body.IdOT;
    $where.id_usuario = req.body.IdUser;
    // - //
    $response.data = await trabajoOTModel.findOne({
        where : $where,
        order :
        [
            [ 'IdOT' , 'DESC' ]
        ],
        include: [{
            model: otModel,
            as: 'DetalleOT',
        }]
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    if( $response.data )
    {
        /**/
        // Locales
        $response.local = await sucursalModel.findOne({
            where : {
                IdSucursal : $response.data.DetalleOT.IdLocal
            }
        })
        .catch(function (err) {
            console.log(err);
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        /**/
        // Archivos
        $response.archivos = await archiGoogleModel.findAll({
            where : {
                formulario : 'OT_SERVICIO',
                correlativo : $response.data.id,
                deleted_at : { [Op.is ] : null }
            }
        })
        .catch(function (err) {
            // handle error;
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        // Obtener los productos
        $response.prodis = await trabajoOTProdModel.findAll({
            where : {
                id_trabajo : $response.data.id,
                estado : 'Activo'
            }
        })
        .catch(function (err) {
            // handle error;
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
    }
    

	res.json($response);
});

// ---------------------------------------------------
// Iniciar trabajo Tecnico
router.post('/inicio_trabajo', async (req,res)=>{
    // IdOT, IdUser, img
    var $response = {};
	$response.estado = 'OK';
    $response.data = [];
    $response.archivos = [];
    var $where          = {};
    $where.IdOT         = req.body.IdOT;
    $where.id_usuario   = req.body.IdUser;

    // Marcamos el trabajo OT
    var $FechaMod           =  moment().format('YYYY-MM-DD HH:mm:ss');
    var $update             = {};
    $update.inicio_trabajo  = $FechaMod;
    $update.img_inicio      = req.body.img;
    $update.estado          = 'En-Proceso';
    $update.lat_inicio         = req.body.lat;
    $update.lng_inicio         = req.body.lng;
    await trabajoOTModel.update( $update ,{
        where : $where
    });
    // Marcamos al usuario...
    await User.update({ trabajo_ot : req.body.IdOT,trabajo_iniciado : $FechaMod },{
        where : {
            id : req.body.IdUser
        }
    });

    

	res.json($response);
});

// ---------------------------------------------------
// Finalizar trabajo Tecnico
router.post('/fin_trabajo', async (req,res)=>{
    // IdOT, IdUser, img, firma, lat, lng, id, obServ,obCli,puntaje
    var $response      = {};
	$response.estado   = 'OK';
    $response.data     = [];
    $response.archivos = [];
    var $where         = {};
    $where.IdOT        = req.body.IdOT;
    $where.id_usuario  = req.body.IdUser;
    $where.id          = req.body.id;

    var $OTW = await trabajoOTModel.findOne({
        where : {
            id : req.body.id
        }
    });

    if( $OTW )
    {
        // Archivos
        var archivos = await archiGoogleModel.findAll({
			where : {
				modulo 		: 'APP',
				formulario 	: 'OT_SERVICIO',
				correlativo : $OTW.id,
				deleted_at  : { [Op.is ] : null }
            },
            limit : 4
		});

        // Marcamos el trabajo OT
        OT = await otModel.update({
            SubEstado : $OTW.estado
        },{
            where : {
                IdOT : $OTW.IdOT
            }
        });
        
        var $FechaMod           = moment().format('YYYY-MM-DD HH:mm:ss');
        var now     = $FechaMod;
        var then    = $OTW.inicio_trabajo;
        var $diff   = moment.utc(moment(now,"YYYY-MM-DD HH:mm:ss").diff(moment(then,"YYYY-MM-DD HH:mm:ss"))).format("HH:mm:ss");
        var $update             = {};
        $update.fin_trabajo     = $FechaMod;
        $update.img_fin         = req.body.img ;
        $update.firma_cliente   = req.body.firma;
        $update.estado          = 'Realizado';
        $update.lat_fin         = req.body.lat;
        $update.lng_fin         = req.body.lng;
        $update.obs_servicio    = req.body.obServ;
        $update.obs_cliente     = req.body.obCli;
        $update.puntaje         = req.body.puntaje;
        $update.duracion        = $diff;
        //
        await trabajoOTModel.update( $update ,{
            where : $where
        });
        // Marcamos al usuario...
        await User.update({ trabajo_ot : null ,trabajo_iniciado : null },{
            where : {
                id : req.body.IdUser
            }
        });

        $OTW = await trabajoOTModel.findOne({
            where : {
                id : req.body.id
            }
        });

        var OT = await otModel.findOne({
            where : {
                IdOT : $OTW.IdOT
            }
        });
    
        // Enviar correo...
        var bodyHTML = await getBody_mail_realizado( $OTW , OT , archivos );
        client.transmissions.send({
            content: {
                from      : 'robot@ssays-orquesta.com',
                subject   : `OT # ${$OTW.IdOT} realizado`,
                html      : bodyHTML
            },
            recipients: [
                {address: 'ddelacruz@ssays-orquesta.com'}
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
    

	res.json($response);
});

// ---------------------------------------------------
// Cancelar trabajo Tecnico
router.post('/cancelar_trabajo', async (req,res)=>{
    // IdOT, IdUser, img, firma, lat, lng, id, motivo,estado,obServ
    var $response = {};
	$response.estado = 'OK';
    $response.data = [];
    $response.archivos = [];
    var $where = {};
    $where.IdOT         = req.body.IdOT;
    $where.id_usuario   = req.body.IdUser;
    $where.id           = req.body.id;

    var $OTW = await trabajoOTModel.findOne({
        where : {
            id : req.body.id
        }
    });

    if( $OTW )
    {

        // Marcamos el trabajo OT
        
        var $FechaMod           = moment().format('YYYY-MM-DD HH:mm:ss');
        var now     = $FechaMod;
        var then    = $OTW.inicio_trabajo;
        var $diff = moment.utc(moment(now,"YYYY-MM-DD HH:mm:ss").diff(moment(then,"YYYY-MM-DD HH:mm:ss"))).format("HH:mm:ss")
        var $update             = {};
        $update.fin_trabajo     = $FechaMod;
        $update.img_fin         = req.body.img;
        $update.estado          = req.body.estado;
        $update.lat_fin         = req.body.lat;
        $update.lng_fin         = req.body.lng;
        $update.motivo          = req.body.motivo;
        $update.duracion        = $diff;
        $update.obs_servicio    = req.body.obServ;
        //
        await trabajoOTModel.update( $update ,{
            where : $where
        });
        // Marcamos al usuario...
        await User.update({ trabajo_ot : null ,trabajo_iniciado : null },{
            where : {
                id : req.body.IdUser
            }
        });

        $OTW = await trabajoOTModel.findOne({
            where : {
                id : req.body.id
            }
        });
    
        // Enviar correo...
        client.transmissions.send({
            content: {
                from      : 'robot@ssays-orquesta.com',
                subject   : `OT # ${$OTW.IdOT} fu cancelada [${$OTW.estado}]`,
                html      : `<h3>Buen día,</h3><p><br/><br/><span style="color:red" >Fue cancelada la OT#${$OTW.IdOT}</span><br/><br/>
                            <strong>Observaciónes:</strong><br/> ${$OTW.obs_servicio}<br/><br/>
                            <strong>Motivo:</strong><br/> ${$OTW.motivo}<br/><br/>
                            <strong>Tiempo trabajo:</strong><br/> ${$OTW.duracion}</p>`
            },
            recipients: [
                {address: 'ddelacruz@ssays-orquesta.com'}
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
    

	res.json($response);
});

// ----------------------------------------------------
// Actualizar trabajo (textos)
router.put('/:IdWork', async (req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';
	$response.data = [];
    var $where = {};
    //
	await trabajoOTModel.update(req.body,{
		where : {id:req.params.IdWork}
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
    //
	res.json($response);
});
// ---------------------------------------------------
//////////////////////////////////////////////////////
//          Agregar lista productos trabajo         //
//////////////////////////////////////////////////////
router.post('/add_productos', [
    check('IdProducto' ,'Selecciona un producto de la lista').not().isEmpty(),
] , async (req,res)=>{
    // id_trabajo, NroOT, IdProducto, ingrediente, dosis, tiempo
    // IdUser, User
    var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';
	$response.data = [];
    var $where = {};
    const errors = validationResult(req);

    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    // Producto
    var $dataProducto = await productosModel.findOne({
        where : { IdProducto : req.body.IdProducto }
    });
    $response.prodi = $dataProducto;
    // Usuario
    req.body.IdCreadoPor = req.body.IdUser;
    req.body.CreadoPor   = req.body.User;
    //


    if( $dataProducto ){
        req.body.Producto = $dataProducto.Descripcion;
    }
    req.body.uu_id = renovarToken();
    $response.dataInsert = await trabajoOTProdModel.create(req.body);

    // Obtener los productos
    $response.data = await trabajoOTProdModel.findAll({
        where : {
            id_trabajo : req.body.id_trabajo,
            estado : 'Activo'
        }
    });

    res.json($response);
});
// ---------------------------------------------------
// ---------------------------------------------------
//////////////////////////////////////////////////////
//           Quitar lista productos trabajo         //
//////////////////////////////////////////////////////
router.post('/del_producto', async (req,res)=>{
    // id, IdUser, User, id_trabajo
    var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';
	$response.data = [];
    var $where = {};
    //
    var $FechaMod =  moment().format('YYYY-MM-DD HH:mm:ss');
    await trabajoOTProdModel.update({
        estado : 'Anulado',
        FechaAnulado : $FechaMod,
        IdAnuladoPor : req.body.IdUser,
        AnuladoPor   : req.body.User,
    },{
        where : {
            id : req.body.id
        }
    });
    // Obtener los productos
    $response.data = await trabajoOTProdModel.findAll({
        where : {
            id_trabajo : req.body.id_trabajo,
            estado : 'Activo'
        }
    });
    //
	res.json($response);
});
// ---------------------------------------------------
function getBody_mail_realizado( trabajoOT , OT , archivos )
{
    // creamos lista de fotos... limit 4.
    var ArchivosData = ``;
    if( archivos.length > 0 ){
        archivos.forEach( function(valor, indice, array) {
            console.log("En el indice " + indice + " hay este valor: " + valor.celular);
            ArchivosData += `
            <table align="left" width="273" border="0" cellpadding="0" cellspacing="0" class="mcnImageGroupContentContainer">
            <tbody><tr>
                <td class="mcnImageGroupContent" valign="top" style="padding-left: 9px; padding-top: 0; padding-bottom: 0;">
                    <img alt="" src="${valor.url}" width="264" style="max-width:921px; padding-bottom: 0;" class="mcnImage">                    
                </td>
            </tr></tbody></table>
            `;
        });
    }

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
            <title>OT ${trabajoOT.IdOT}</title>
            
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
            <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">Se marcó la OT# ${OT.IdOT} con estado ${OT.estado}</span><!--<![endif]-->
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
                            
                                <h3>Hola ${OT.nombre_supervisor},</h3>
    &nbsp;
    
    <p>
    La OT ${OT.IdOT} se finalizó en el estado <strong>${trabajoOT.IdOT}</strong>.
    <br/><br/>
    Técnico: <br/>
    <strong>${trabajoOT.usuario}</strong>
    <br/><br/>
    Observaciónes:<br/>
    ${trabajoOT.obs_servicio}
    <br/><br/>
    Diagnostico:<br/>
    <strong>${trabajoOT.diagnostico}</strong>
    <br/><br/>
    Condición:<br/>
    <strong>${trabajoOT.condicion}</strong>
    <br/><br/>
    Acción correctiva:<br/>
    <strong>${trabajoOT.accion_correctiva}</strong>
    <br/><br/>
    Comentarios cliente:<br/>
    <strong>${trabajoOT.obs_cliente}</strong>
    <br/><br/>
    Puntaje:<br/>
    <strong>0${trabajoOT.puntaje} de 5</strong>
    <br/><br/>
    Tiempo trabajo:<br/>
    <strong>${trabajoOT.duracion}</strong>
    </p>
    
    <p>Para revisar los detalles de la misma por favor ingrese al módulo técnico.</p>
    
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
                        ${ArchivosData}
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
    return $body;
    //
}
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
//  ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
function renovarToken() {
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

module.exports = router;
