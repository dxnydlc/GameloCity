
//api_certificados.js

const router = require('express').Router();
const fs = require('fs')

const { Film,cargoCertificadoModel,CertificadoModel } = require('../../db');


// zipiar archivos
const zip=require('adm-zip');

// PDF to imagen
const pdf2img = require('pdf2img');

// Html to pdf
var pdfTOhtml = require('html-pdf');

// Imagen to pdf
const imgToPDF = require('image-to-pdf');

// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');





const { Op } = require("sequelize");

// Imports the Google Cloud client libraries
const vision = require('@google-cloud/vision').v1;
const {Storage} = require('@google-cloud/storage');

//Required package
var pdf = require("pdf-creator-node");

const {check,validationResult} = require('express-validator');

const dotenv = require('dotenv');
dotenv.config();

const URL_CERTIFICADOS = process.env.URL_CERTIFICADOS;


var $APP_PATH = process.env.APP_PATH;
var RUTA_ORQ3 = process.env.RUTA_ORQ3;
var _RUTA_PROYECTO = process.env.RUTA_PROYECTO;


// VALIDACION
var _Requeridos = [
    check('Fecha' ,'Ingrese fecha').not().isEmpty(),
    check('IdLocal' ,'Seleccione Local').not().isEmpty(),
    check('IdCliente' ,'Seleccione Cliente').not().isEmpty()
];




// ***************************************************************
cargoCertificadoModel.belongsTo( CertificadoModel ,{
	as : 'Detalle', foreignKey 	: 'id_certificado',targetKey: 'IdCertificadoNum',
});
// ***************************************************************


var _css = `
/* 
Document   : formato_certificado
Created on : 05-mar-2013, 16:35:20
Author     : ssayspc082
Description:
	Purpose of the stylesheet follows.
*/

/* 
TODO customize this sample style
Syntax recommendation http://www.w3.org/TR/REC-CSS2/
*/

root { 
display: block;
}

body{
border: 0px;
margin: 0px;
padding: 0px;
font-size: 13pt;
font-family: serif; 
}
#divContenedor{
position: relative;
border: 0px solid;
width: 297mm;
height: 210mm;
/*margin-top:-5px;*/
/* background-image: url(/sisorquesta/img/formatos/Frontal.jpg);*/
background-size:297mm 210mm;
background-position:1mm -4.3mm;
background-repeat:no-repeat;
border:0px solid #000;
}
#divDetalle{
border: 0px solid;
position: absolute;
top  : 158mm;
left : 54mm;
font-size: 15pt;
width: 113mm;
/*background-color:#ccc;    */
}
#divNomCliente{
border: 0px solid; 
position: absolute;
top: 213mm;
left: 23mm;
width: 255mm;
}
#divDireccion{
border: 0px solid;
position: absolute;
top: 225mm;
left: 50mm;
font-size:12pt;
width: 222mm;
}
#divDireccionPeque{
border: 0px solid;
position: absolute;
font-size:10pt;
top: 225mm;
left: 50mm;
width: 222mm;
}
#divDireccionPequem{
border: 0px solid;
position: absolute;
font-size:8pt;
top: 225mm;
left: 50mm;
width: 222mm;
}
#divDireccionPequem1{
border: 0px solid;
position: absolute;
font-size:7.5pt;
top: 225mm;
left: 50mm;
width: 222mm;
}

/*GIRO*/

#divGiro{
border: 0px solid; 
position: absolute;
top: 236mm;
/*font-size:10px;*/
left: 31mm;
width: 125mm;
/*background-color:#CCC;*/
}
#divGiroPeque{
border: 0px solid; 
position: absolute;
top: 236mm;
font-size:12px;
left: 31mm;
width: 113mm;
/*  background-color:#CCC;*/
}

/*FIN DE GIRO*/
	
#divArea{
border: 0px solid;
position: absolute;
top: 236mm;
left:221mm;
width: 80mm;
font-size: 14px;
/*background-color:#CC3;*/
}

#divAreaPeque{
border: 0px solid;
position: absolute;
top: 236mm;
left:221mm;
width: 80mm;
font-size: 13px;
/*background-color:#CC3;*/
}

#divFechaServicio{
border: 0px solid;
position: absolute;
top:247mm;
font-size: 15pt;
left:78mm;
}
#divVencimiento{
border: 0px solid;
position: absolute;
top:146mm;
left:62mm;
width: 30mm;
}
#divFactura{
border: 0px solid;
position: absolute;
top:143mm;
left:130mm;
width: 50mm;
height: 18px;
}
#divOS{
border: 0px solid; 
position: absolute;
font-size:10px;
top:149mm;
left:225mm;
width: 48mm;
}

#divDiaSist{
border: 0px solid; 
position: absolute;
top:268mm;
left:100mm;
font-size: 15pt;
width: 10mm;
}
#divMesSist{
border: 0px solid; 
position: absolute;
top:268mm;
left:140mm;
font-size: 15pt;
width: 30mm;
}
#divAnioSist{
border: 0px solid; 
position: absolute;
top:268mm;
font-size: 15pt;
left:215mm;
width: 20mm;
}


/*Posterior*/

#divContenedorP{
position: relative;
border: 0px solid;
width: 297mm;
height: 210mm;
font-size:13pt;
/*margin-top:-5px;*/
/* background-image: url(/sisorquesta/img/formatos/Posterior.jpg);*/
background-size:297mm 210mm;
background-position:1mm -4.3mm;
background-repeat:no-repeat;
/*border:1px solid #000;*/
}

.postP{position:relative; left:155mm;}
#divOSP{top: 46mm; left:140mm; font-size:16pt;}
#divAreaP {
top: 63mm;
left: 140mm;
font-size: 12pt;
max-width: 450px;
position: absolute;
}
#divCorresP{top:72mm; height:20px; left:140mm; font-size:16pt;}
#divFecVenP{top: 87mm; height:20px; left:140mm;font-size:16pt;}
#divFactP{top: 98mm; left:140mm; font-size:16pt;}
#numcert{ position:absolute; top: 132mm; left:140mm; font-size:16pt;}
#nomcert{position:absolute; top:197mm; left:36mm; font-size:27pt;}
#divInfP{position:absolute; top:150mm; left:38mm;}
`;

var _css2022 = `<style>
.container {
	width: 95%;
	position: relative;
	padding-top: 20px;
	padding-bottom: 20px;
}
a,h1,h2,h3,h4,h5,p,li,div,th,td{
	font-family: 'Ubuntu', sans-serif;
}
.table td,th{
	font-size:12px;
}
#contenedor{
	width: 800px;
	height: 1180px;
	margin: 0 auto;
	position: relative;
}
#imgCert
{
	width : 100%;
}
#SerieCert{
	position: absolute;
    font-size: 40px;
    color: red;
    top: 170px;
    right: 85px;
    font-weight: 700;
}
.zonaX{
	font-family: 'Ubuntu', sans-serif;
	font-size: 24px;
	font-weight: 500;
}
#x1Desin
{
	position: absolute;
	top: 411px;
	left: 152px;
}
#x2DesRa
{
	position: absolute;
	top: 455px;
	left: 152px;
}
#x3DesInfec
{
	position: absolute;
	top: 500px;
	left: 152px;
}
#x4Reser
{
	position: absolute;
	top: 411px;
	left: 343px;
}
#x5Tanque
{
	position: absolute;
	top: 455px;
	left: 343px;
}
.zonaTextos{
	font-family: 'Ubuntu', sans-serif;
	font-size: 16px;
	font-weight: 400;
}
.zonaTextos #Dir
{
	font-size: 10px;
	line-height:12px;
}
.zonaTextos #Giro
{
	font-size: 10px;
	line-height:12px;
}
.zonaTextos #Giro
{
	font-size: 10px;
	line-height:12px;
}
.zonaTextos #Area
{
	font-size: 10px;
	line-height:12px;
}
#Cliente{
	position: absolute;
	top: 549px;
	left: 70px;
}
#Dir{
	position: absolute;
	top: 581px;
	left: 137px;
}
#Giro{
	position: absolute;
	top: 609px;
	left: 85px;
	width: 360px;
}
#Area{
	position: absolute;
	top: 608px;
	right: 21px;
	width: 231px;
}
#FechaServ{
	position: absolute;
	top: 635px;
	left: 266px;
	width: 360px;
}
#Dia{
	position: absolute;
	bottom: 474px;
	left: 282px;
}
#Mes{
	position: absolute;
	bottom: 474px;
	left: 363px;
}
#Anio{
	position: absolute;
	bottom: 474px;
	right: 216px;
}
#posterior
{
	width: 800px;
	height: 1100px;
	margin: 0 auto;
	position: relative;
	padding: 10px;
	border: 1px solid #159947;
}
#posterior > div{
	position: absolute;
}
#OS1
{
	left : 20px;
	top : 50px;
}
#OS2
{
	right : 20px;
	top : 50px;
}
#division1{
	border-top: 1px #49B265 solid;
	top: 75px;
	left: 20px;
	right: 20px;
}
#Area1
{
	left : 20px;
	top : 96px;
}
#Area2
{
	right : 20px;
	top : 96px;
}
#division2{
	border-top: 1px #49B265 solid;
	top: 140px;
	left: 20px;
	right: 20px;
}
#Corr1
{
	left : 20px;
	top : 160px;
}
#Corr2
{
	right : 20px;
	top : 160px;
}
#division3{
	border-top: 1px #49B265 solid;
	top: 200px;
	left: 20px;
	right: 20px;
}
#Glosa{
	left : 20px;
	top : 450px;
}
#Vcto1{
	left : 20px;
	top : 218px;
}
#Vcto2
{
	right : 20px;
	top : 218px;
}
#division4{
	border-top: 1px #49B265 solid;
	top: 255px;
	left: 20px;
	right: 20px;
}
#Fact1{
	left : 20px;
	top : 272px;
}
#Fact2
{
	right : 20px;
	top : 272px;
}
#division5{
	border-top: 1px #49B265 solid;
	top: 312px;
	left: 20px;
	right: 20px;
}
#Cert1{
	left : 20px;
	top : 330px;
}
#Cert2
{
	right : 20px;
	top : 330px;
}
#division6{
	border-top: 1px #49B265 solid;
	top: 370px;
	left: 20px;
	right: 20px;
}
</style>`;

// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
async function execQuery( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `nombre_cliente`;
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('IdCertificadoNum') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('IdCertificadoNum') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

    var _atributos = [
        _editItem,
        _DelItem,
        'IdCertificadoNum',
        ['nombre_cliente','Cliente'],
        ['sucursal','Local'],
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('FechaServicio') , _fechaONlyLatFormat ) , 'F.Serv.'], 
		'Frecuencia',
		[ sequelize.fn('DATE_FORMAT' ,sequelize.col('FechaVencimiento') , _fechaONlyLatFormat ) , 'F.Vcto'], 
		'NroOS',
		'NroFactura',
        'Estado',
		['MotivoAnulacion','Mot.An.'],
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('createdAt') , _fechaLatFormat ) , 'Creado'], 
		[ sequelize.fn('DATE_FORMAT' ,sequelize.col('updatedAt') , _fechaLatFormat ) , 'Mod.'], 
    ];
    //
    _dataResp = await CertificadoModel.findAll({
        attributes : _atributos ,
        order : [
            ['Codigo' , 'DESC']
        ],
        where : _where,
        limit : _limit
    })
    return _dataResp;
    //
}
// -------------------------------------------------------------
//////////////////////////////////////////////////////////
//      			AGREGAR DOCUMENTO       			//
//////////////////////////////////////////////////////////
router.post('/', _Requeridos ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        // Maximo Valor
		var _IdCertificadoNum = parseInt( CertificadoModel.max( 'IdCertificadoNum ') ) + 1;
		req.body.IdCertificadoNum = _IdCertificadoNum;
        //
        await CertificadoModel.create(req.body)
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await CertificadoModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        if( _dataGuardado )
        {
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'INC'+_Codigo;
            await xlsLAPIncidenciasCabModel.update({
                Codigo : _Codigo
            },{
                where  : {
                    uu_id : req.body.uu_id
                }
            })
            .catch(function (err) {
                helpersController.captueError( err.original , req.body );
                _response.codigo = 500;
                _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
            });
            // Unir con detalle.
            await xlsLAPIncidenciasDetModel.update({
                CodigoHead : _Codigo
            },{
                where : {
                    Token : req.body.uu_id
                }
            });
            // Unir con detalle.
            await archiGoogleModel.update({
                Cod001 : _Codigo ,
                correlativo : _dataGuardado.id
            },{
                where : {
                    token : req.body.uu_id
                }
            });
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se guardó el documento ${_Codigo} correctamente.` };
        }

        _response.item = await xlsLAPIncidenciasCabModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
    } catch (error) {
        helpersController.captueError( '' , `>>>${error}` );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }
    //
    return res.status(_response.codigo).json( _response );

    

    //
    
    
    

	res.json( $response );
});
// -------------------------------------------------------------
//////////////////////////////////////////
//          BUSCAR CERTIFICADO            //
//////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // Certs, Inicio,Fin, TFecha, Cli, Local
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};

    if( req.body.Certs != '' ){
        // Buscamos por ID
        var $arOSs = [];
		var $IdOSs = req.body.Certs;
		$arOSs = $IdOSs.split(',');
        //
        $response.data = await CertificadoModel.findAll({
            order : [
                ['IdCertificadoNum' , 'DESC']
            ],
            where : {
				IdCertificadoNum : $arOSs
			}
        });
        //
    }else{
		if( req.body.TFecha == 1 ){
			// Emision
			$where.FechaEmision = { [Op.gte ]: req.body.Inicio,[Op.lte ]: req.body.Fin };
		}else{
			// Vencimiento
			$where.FechaVencimiento = { [Op.gte ]: req.body.Inicio,[Op.lte ]: req.body.Fin };
		}
		if( req.body.Cli != '' ){
			$where.IdClienteProv = req.body.Cli;
		}
		if( req.body.Local != '' ){
			$where.IdSucursal = req.body.Local;
		}
        //
        $response.data = await CertificadoModel.findAll({
            order : [
                ['IdCertificadoNum' , 'DESC']
            ],
            where : $where
        });
    }
	console.log( $where);
	$response.where = $where;
    
    res.json( $response );
});
// -------------------------------------------------------------
// -------------------------------------------------------------
router.post('/leer_pdf_ok', async (req,res)=>{
	//
	var $response = {};
	$response.estado = 'OK';

	const projectId 	= '105795016187212586134';
	const keyFilename 	= './ssl/Prospero-erp-887233d2c759.json';

	const storage = new Storage({projectId, keyFilename});

	// Makes an authenticated API request.
	async function listBuckets() {
	try {
		const [buckets] = await storage.getBuckets();

		console.log('Buckets:');
		buckets.forEach((bucket) => {
		console.log(bucket.name);
		});
	} catch (err) {
		console.error('ERROR:', err);
	}
	}
	listBuckets();
	//
	res.json($response);
});
// -------------------------------------------------------------
router.post('/leer_pdf', async (req,res)=>{
	// ids, inicio, fin, cliente(ruc)

	var $response = {};
	$response.estado = 'OK';

	// Creates a client
	const projectId 	= '105795016187212586134';
	const keyFilename 	= './ssl/Prospero-erp-887233d2c759.json';
	//const vision = new vision({projectId, keyFilename});
	const client = new vision.ImageAnnotatorClient();

	/**
	 * TODO(developer): Uncomment the following lines before running the sample.
	 */
	// Bucket where the file resides
	// const bucketName = 'my-bucket';
	// Path to PDF file within bucket
	// const fileName = 'path/to/document.pdf';
	// The folder to store the results
	// const outputPrefix = 'results'

	const fileName 		= '1.pdf';
	const bucketName 	='ccdd';
	//
	const gcsSourceUri 	= `gs://${bucketName}/${fileName}`;
	const gcsDestinationUri = `gs://${bucketName}/1.txt`;

	const inputConfig = {
	// Supported mime_types are: 'application/pdf' and 'image/tiff'
	mimeType: 'application/pdf',
	gcsSource: {
		uri: gcsSourceUri,
	},
	};
	const outputConfig = {
	gcsDestination: {
		uri: gcsDestinationUri,
	},
	};
	const features = [{type: 'DOCUMENT_TEXT_DETECTION'}];
	const request = {
	requests: [
		{
		inputConfig: inputConfig,
		features: features,
		outputConfig: outputConfig,
		},
	],
	};

	const [operation] = await client.asyncBatchAnnotateFiles(request);
	const [filesResponse] = await operation.promise();
	const destinationUri =
	filesResponse.responses[0].outputConfig.gcsDestination.uri;
	console.log('Json saved to: ' + destinationUri);

	res.json($response);
});
// -------------------------------------------------

// listar certificados (cargo certificado)
router.post('/buscar/cargo_certificado', async (req,res)=>{
	// ids, inicio, fin, cliente(ruc), NroOS

	var $response = {};
	$response.estado = 'OK';
	var $where = {}, $dataGet = [];
	const { Op } = require("sequelize");

	if( req.body.ids != '' ){
		var $ids = req.body.ids;
		var $arIds = $ids.split(',');
		//
		$dataGet = await cargoCertificadoModel.findAll({
			order: [
				['id_certificado', 'DESC']
			],
			where: {
				id_certificado : { [Op.in] : $arIds }
			},
			include: [{
				model: CertificadoModel,
				as: 'Detalle'
			}]
		});
	}
	else
	{
		//
		$where.FechaEmision = { [Op.gte ]: req.body.inicio,[Op.lte ]: req.body.fin };
		if( req.body.cliente != '' )
		{
			$where.IdClienteProv = req.body.cliente;
		}
		if( req.body.NroOS ){
			var $ids = req.body.NroOS;
			var $arIds = $ids.split(',');
			$where.NroOS = { [Op.in] : $arIds };
		}

		$dataGet = await cargoCertificadoModel.findAll({
			order: [
				[['Detalle','IdCertificadoNum', 'DESC']]
			],
			
			include: [{
				model: CertificadoModel,
				as: 'Detalle',
				where : $where,
			}]
		});
	}

	$response.data = $dataGet;

	// if( $dataGet.length > 0 )
	// {
	// 	// popular...
	// 	$response.data = $dataGet;
	// }else{
	// 	$response.data = $dataGet;
	// }

	res.json($response);
});

// -------------------------------------------------
// Actualizar
router.put('/update/cargo_certificado/:IdCert', async (req,res)=>{

	var $response = {};
	$response.estado = 'OK';

	if( req.body.fecha_entrega == '' ){
		delete req.body.fecha_entrega;
	}
	if( req.body.fecha_retorno == '' ){
		delete req.body.fecha_retorno;
	}
	if( req.body.entregado_a == '' ){
		delete req.body.entregado_a;
	}
	if( req.body.recibido_por == '' ){
		delete req.body.recibido_por;
	}

	if(! req.body.id ){
		delete req.body.id;
	}
	var $ids = req.params.IdCert;
	var $arIds = $ids.split(',');
	console.log($arIds);
	var lastIdCert = $arIds[ $arIds.length - 1 ];
	delete req.body.id_certificado;

	await cargoCertificadoModel.update(req.body,{
		where : { id_certificado : { [Op.in] : $arIds } }
	}).catch(error => {
	// Will not execute
		console.log('caught', error.message);
		$response.error = error.message;
	});
	var $dataGet = await cargoCertificadoModel.findAll({
		where: {
			id_certificado : lastIdCert
		},
		include: [{
			model: CertificadoModel,
			as: 'Detalle'
		}]
	});
	$response.data = populateCC( $dataGet );
	res.json($response);

});
// -------------------------------------------------
router.post('/get/cargo_certificado', async (req,res)=>{
	var $response = {};
	$response.estado = 'OK';
	$response.encontrado = 'NO';
	$response.data = await cargoCertificadoModel.findOne({
		where:{
			id_certificado : req.body.id
		}}
	);
	if( $response.data )
	{
		$response.encontrado = 'SI';
	}
	res.json($response);
});
// -------------------------------------------------

// Obtener data de un certificado numerado
router.post('/get/data/certificado', async (req,res)=>{
	// ids
	var $response = {};
	$response.estado = 'OK';
	$response.encontrado = 'NO';
	// Buscar por ID's
	var $arOSs = [];
	var $IdOSs = req.body.ids;
	$arOSs = $IdOSs.split(',');

	$response.data = await CertificadoModel.findAll({
		where:{
			IdCertificadoNum : $arOSs
		}
	});
	if( $response.data )
	{
		$response.encontrado = 'SI';
	}
	res.json($response);
});
// -------------------------------------------------

// Obtener data de un certificado numerado
router.post('/cambio_estado', async (req,res)=>{
	// IdCert, estado
	var $response = {};
	$response.estado = 'OK';
	$response.encontrado = 'NO';

	await CertificadoModel.update({
		Estado : req.body.estado
	},{
		where:{
			IdCertificadoNum : req.body.IdCert
		}
	});

	$response.data = await CertificadoModel.findOne({
		where:{
			IdCertificadoNum : req.body.IdCert
		}
	});
	if( $response.data )
	{
		$response.encontrado = 'SI';
	}
	res.json($response);
});
// -------------------------------------------------

//////////////////////////////////////////////
//		COMPRIMIR VARIOS CERTIFICADOS		//
//////////////////////////////////////////////
router.post('/zip_files', async (req,res)=>{
	// series 
	var $response = {};
	$response.estado = 'OK';
	$response.zip = '';
	//
	var $Series = req.body.series;
	$arCerts = $Series.split(',');
	varDump( RUTA_ORQ3 );
	try {
		// -
		var zipper 	= new zip();
		var uuid 	= await uuidMini();
		var ZipNombre = `Zip_Certificados_${uuid}.zip`;
		//
		for (let index = 0; index < $arCerts.length; index++)
		{
			const NroCert = $arCerts[index];
			var jpg = `${RUTA_ORQ3}/api2/public/certificados/Certificado_${NroCert}.jpg`;
			var pdf = `${RUTA_ORQ3}/api2/public/certificados/Certificado_${NroCert}.pdf`;

			try {
				if ( fs.existsSync(jpg) && fs.existsSync(pdf) ) {
					//file exists
					zipper.addLocalFile( jpg );
					zipper.addLocalFile( pdf );
				}
			} catch(err) {
				console.error(err)
			}
			//
		}
		//
		zipper.writeZip( './assets/zip_certificados/'+ZipNombre );
		$response.zip = ZipNombre;
		// -
	} catch (error) {
		console.error(error);
		// expected output: ReferenceError: nonExistentFunction is not defined
		// Note - error messages will vary depending on browser
	}
	//
	$response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se generó el archivo, espere...` };
	//
	res.json($response);
});
// -------------------------------------------------

//////////////////////////////////////////////////////////
//             GENERAR POSTERIOR CERTIDICADO            //
//////////////////////////////////////////////////////////
router.post('/posterior_certificado', async (req,res)=>{
    // IdCert
    var _response = {};
    _response.codigo = 200;

    try {
        //
		const NroCert = req.body.IdCert;
		
		var jpg = `${RUTA_ORQ3}/api2/public/certificados/Certificado_${NroCert}.jpg`;
		var pdf = `${RUTA_ORQ3}/api2/public/certificados/Certificado_${NroCert}.pdf`;
		var posterior = ``;

		// CONVERTIR EL POSTERIOR EN IMAGEN
		pdf2img.setOptions({
			type 	: 'png', 				// png or jpg, default jpg
			size 	: 2524, 				// default 1024
			density : 600, 					// default 600
			outputdir	: './assets/zip_certificados/', // output folder, default null (if null given, then it will create folder name same as file name)
			outputname	: 'Cposterior'+NroCert, 		// output file name, dafault null (if null given, then it will create image name same as input name)
			page 		: null 							// convert selected page, default null (if null given, then it will convert all pages)
		});
		//
		varDump(`Convertir ${NroCert}`);
		setTimeout( async function () {
			await pdf2img.convert( pdf , function(err, info) {
				if (err) console.log(err)
				else console.log(info);
				// info
			});
		}, 1000);
		//
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se generó el certificado: ${NroCert}.` };
        //
    } catch (error) {
        varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});

//////////////////////////////////////////////////////////
//             GENERAR PDF AMBOS CERTIDICADO            //
//////////////////////////////////////////////////////////
router.post('/unir_certificado', async (req,res)=>{
    // IdCert
    var _response = {};
    _response.codigo = 200;

    try {
        //
		const NroCert = req.body.IdCert;
		
		var jpg = `${RUTA_ORQ3}/api2/public/certificados/Certificado_${NroCert}.jpg`;
		var pdf = `${RUTA_ORQ3}/api2/public/certificados/Certificado_${NroCert}.pdf`;
		var posterior = `${_RUTA_PROYECTO}assets/zip_certificados/Cposterior${NroCert}_1.png`;
		var _pdfFinal = `${_RUTA_PROYECTO}assets/zip_certificados/Certificado-${NroCert}.pdf`;


		// UNIR AMBAS IMAGENES
		const pages = [
			jpg,
			posterior
		];
		setTimeout( async function () {
			await imgToPDF(pages, 'A4')
			.pipe( fs.createWriteStream( _pdfFinal ) );
		}, 1000);
		//
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se generó el certificado: ${NroCert}.` };
        //
    } catch (error) {
        varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});

//////////////////////////////////////////////
//		PDF UN CERTIFICADOS		//
//////////////////////////////////////////////
router.post('/pdf_certificado', async (req,res)=>{
	// series 
	var _response = {};
    _response.codigo = 200;
    _response.zip = '';
	//
	var $Series = req.body.series;
	$arCerts = $Series.split(',');
	varDump( RUTA_ORQ3 );
	try {
		// -
		var zipper 	= new zip();
		var uuid 	= await uuidMini();
		var ZipNombre = `Zip_Certificados_${uuid}.zip`;
		//
		setTimeout( async function () {
			varDump(`Generar PDF y comprimir-...`);
			/**/
			for (let index = 0; index < $arCerts.length; index++)
			{
				//
				const NroCert = $arCerts[index];
				var jpg = `${RUTA_ORQ3}/api2/public/certificados/Certificado_${NroCert}.jpg`;
				var pdf = `${RUTA_ORQ3}/api2/public/certificados/Certificado_${NroCert}.pdf`;
				var posterior = `${_RUTA_PROYECTO}assets/zip_certificados/Cposterior${NroCert}_1.png`;
				var _pdfFinal = `${_RUTA_PROYECTO}assets/zip_certificados/Certificado-${NroCert}.pdf`;
				//
				try {
					if ( fs.existsSync( _pdfFinal ) ) {
						//file exists
						zipper.addLocalFile( _pdfFinal );
					}
				} catch(err) {
					console.error(err)
				}
				//
			}// for
			zipper.writeZip( './assets/zip_certificados/'+ZipNombre );
			
			/**/
		}, 2000);
		//
		_response.zip = ZipNombre;
		// -
	  } catch (error) {
		console.error(error);
		// expected output: ReferenceError: nonExistentFunction is not defined
		// Note - error messages will vary depending on browser
	  }
	//
	_response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se generó el archivo, espere...` };
	//
	return res.status(_response.codigo).json( _response );
});
// -------------------------------------------------

//////////////////////////////////////////////
//		   GENERAR PDF CERTIFICADO		    //
//////////////////////////////////////////////
router.post('/make/pdf', async (req,res)=>{
	// IdCert
	var $response = {};
	$response.estado = 'OK';
	$response.encontrado = 'NO';

	var html = fs.readFileSync( URL_CERTIFICADOS+"/certi.html", "utf8");

	var options = {
        format: "A4",
        orientation: "portrait",
        header: {},
        footer: {
            contents: {}
        }
    };
	// DNI
	var users = [
		{
		  name: "Shyam",
		  age: "26",
		},
		{
		  name: "Navjot",
		  age: "26",
		},
		{
		  name: "Vitthal",
		  age: "26",
		},
	];
	var document = {
		html: html,
		data: {
		  users: users,
		},
		path: URL_CERTIFICADOS+"./output.pdf",
		type: "",
	};
	//
	pdf
	.create(document, options)
	.then((res) => {
		console.log(res);
	})
	.catch((error) => {
		console.error(error);
	});
	//
	res.json($response);
});
// -------------------------------------------------

//////////////////////////////////////////////
//		   GENERAR HTLM CERTIFICADO		    //
//////////////////////////////////////////////
router.post('/make/html', async (req,res)=>{
	// IdCert(,)

	var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
		// Convertimos a arreglo
		var _IdCerts = req.body.IdCert;
		var _ArCerts = _IdCerts.split(',');

		const _InfoCert = await CertificadoModel.findAll({
			where:{
				IdCertificadoNum : _ArCerts
			},
			order : [
				[ 'IdCertificadoNum' , 'ASC' ]
			]
		});

		// Dibujando frontal
		
		var _NombreFileOut = ``;
		if( _ArCerts.length > 1 )
		{
			_NombreFileOut = await uuidMini();
		}else{
			_NombreFileOut = req.body.IdCert;
		}
		_response.fileOut = _NombreFileOut;

		var _htmlSalida = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml">
		
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<title>Certificado SSAYS</title>
		
				<!-- <link href="formato.css" rel="stylesheet" type="text/css"></link>-->
				<style type="text/css">
					#divContenedor{
					margin: auto;
					}
					${_css}
				</style>
		
			</head>
		<body>`;

		for (let index = 0; index < _InfoCert.length; index++)
		{
			const _dataCert = _InfoCert[index];
			// + // + // + // + // + // + // + // + // + //
			if( _dataCert )
			{
				// IdCert Extra_NomComercial
				var IdCert = _dataCert.IdCertificadoNum;

				var _nomCliente = _dataCert.nombre_cliente;
				if( _dataCert.Extra_NomComercial )
				{
					// Check posterior
					if( _dataCert.NomComercial != '' ){
						_nomCliente = _dataCert.NomComercial;
					}
				}
					
				varDump( _dataCert.Direccion);
				// Direccion
				var longdir = _dataCert.Direccion, _Direccion = ``;
				if( longdir.length > 139 )
				{
					_Direccion = `<div id="divDireccionPeque" >${_dataCert.Direccion}</div>`;
				}else{
					_Direccion = `<div id="divDireccion" >${_dataCert.Direccion}</div>`;
				}
				// Giro
				var longdir = _dataCert.nombre_giro, _Giro = ``;
				if( longdir.length > 52 )
				{
					_Giro = `<div id="divGiroPeque" >${_dataCert.nombre_giro}</div>`;
				}else{
					_Giro = `<div id="divGiro" >${_dataCert.nombre_giro}</div>`;
				}
				// Area
				var longdir = _dataCert.AreaTratada, _AreaTratada = ``;
				if( longdir.length > 52 )
				{
					_AreaTratada = `<div id="divAreaPeque" >${_dataCert.AreaTratada}</div>`;
				}else{
					_AreaTratada = `<div id="divArea" >${_dataCert.AreaTratada}</div>`;
				}

				// FEchas
				var _FechaServicio = _dataCert.FechaServicio;
				var _arrFecha = _FechaServicio.split("-");
				var _Dia = _arrFecha[2], _Mes = _arrFecha[1], _Anio = _arrFecha[0];
				var _FechaFinal = ``;
				if( _dataCert.ExtraFecha_Servicio )
				{
					_FechaFinal = _dataCert.ExtraFecha_Servicio;
				}else{
					// Fecha de servicio
					_FechaServicio = _dataCert.FechaServicio;
					var _arrFecha = _FechaServicio.split("-");
					var _Dia = _arrFecha[2], _Mes = _arrFecha[1], _Anio = _arrFecha[0];
					_FechaFinal = `${_Dia}/${_Mes}/${_Anio}`;
				}
				var _divFechaServicio = `<div id="divFechaServicio">${_FechaFinal}</div>`;


				// Agreglo meses
				var _Meses = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
				var _FechaServicio = _dataCert.FechaServicio;
				var _arrFecha = _FechaServicio.split("-");
				var _Dia_ = _arrFecha[2], _Mes_ = parseInt( _arrFecha[1] ), _Anio_ = _arrFecha[0];
				var _NombreMes = _Meses[_Mes_];

				// las X
				var _Desinsectacion = ``, _LimpCisternaAgua = ``, _Desratizacion = ``, _LimpTanqueSeptico = ``, _Desinfeccion = ``;
				if( _dataCert.Desinsectacion )
				{
					_Desinsectacion = _dataCert.Desinsectacion;
				}
				if( _dataCert.LimpCisternaAgua )
				{
					_LimpCisternaAgua = _dataCert.LimpCisternaAgua;
				}
				if( _dataCert.Desratizacion )
				{
					_Desratizacion = _dataCert.Desratizacion;
				}
				if( _dataCert.LimpTanqueSeptico )
				{
					_LimpTanqueSeptico = _dataCert.LimpTanqueSeptico;
				}
				if( _dataCert.Desinfeccion )
				{
					_Desinfeccion = _dataCert.Desinfeccion;
				}

				_htmlSalida += `
				<div id="divContenedor" >
					<span style="position:absolute;top: 40px;left: 68px;font-size: 14px;color: #1e871c;" >${_dataCert.IdCertificadoNum}</span>
					<!-- DETALLE -->
					<div id="divDetalle" >
						<table  align="left" border="0" cellspacing="0" cellpadding="0" >
							<tr height="38" valign="middle" >
								<td class="centro" width="17" >${_Desinsectacion}</td>
								<td class="izquierda" width="281" ></td>
								<td class="centro" width="101" >${_LimpCisternaAgua}</td>
								<td class="izquierda" width="10"></td>
							</tr>
							<tr height="30" valign="middle">
								<td colspan="4"></td>
							</tr>
							<tr height="40" valign="middle">
								<td class="centro" >${_Desratizacion}</td>
								<td class="izquierda" ></td>
								<td class="centro" >${_LimpTanqueSeptico}</td>
								<td class="izquierda"></td>
							</tr>
							<tr height="30" valign="middle">
								<td colspan="4"></td>
							</tr>
							<tr height="20" valign="middle" >
								<td class="centro" >${_Desinfeccion}</td>
								<td class="izquierda" ></td>
								<td class="centro" ></td>
								<td class="izquierda"></td>
							</tr>
						</table>
					</div>
					<div id="divNomCliente" >${_nomCliente}</div>

					${_Direccion}

					${_Giro}

					${_AreaTratada}

					${_divFechaServicio}
					<div id="divVencimiento"></div>

					<!--<div id="divFactura" >${_dataCert.NroFactura}</div>-->
					<!--<div id="divOS" >${_dataCert.NroFactura}</div>-->

					<div id="divDiaSist" >${_Dia_}</div>  
					<div id="divMesSist" align="center">${_NombreMes}</div>  
					<div id="divAnioSist" >${_Anio_}</div>

				</div>
				<!-- ESTO CREA UNA NUEVA PAGINA -->
				<div style="page-break-after:always;"></div>`;
			}// IF
		}// FOR
		_htmlSalida += `</body></html>`;

		var _Archivo = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${_NombreFileOut}.html`;
		varDump( _Archivo );
		fs.writeFileSync( _Archivo , _htmlSalida );


		// **** Ahora creamos el PDF posterior ****

		var _htmlPosterior = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml">
		
			<head>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<title>Certificado SSAYS</title>
		
				<!-- <link href="formato.css" rel="stylesheet" type="text/css"></link>-->
				<style type="text/css">
						#divContenedor{
						margin: auto;
						}
						${_css}
				</style>
				<style type="text/css">
				#divInfP p{
					font-size:20px;
				}
				#divInfP{
					font-size:20px;
				}
				</style>
			</head>
		
		<body >`;
		for (let index = 0; index < _InfoCert.length; index++)
		{
			const _dataCert = _InfoCert[index];
			// + // + // + // + // + // + // + // + // + //
			if( _dataCert )
			{
				// IdCert
				var IdCert = _dataCert.IdCertificadoNum;

				var _NroOS = ``, _AreaTratada = ``;
				if( _dataCert.NroOS ){
					_NroOS = _dataCert.NroOS;
				}
				if( _dataCert.AreaTratada ){
					_AreaTratada = _dataCert.AreaTratada;
				}
				var _Correspondido = ``;
				if( _dataCert.Correspondido ){
					_Correspondido = _dataCert.Correspondido;
				}
				var _Extra_Vencimiento = ``;
				if( _dataCert.Extra_Vencimiento ){
					_Extra_Vencimiento = _dataCert.Extra_Vencimiento;
				}else{
					//
				}
				var _FechaVencimiento = ``;
				// Incluye fecha de vencimiento
				if( _dataCert.FechaVencimiento ){
					_FechaVencimiento = moment( _dataCert.FechaVencimiento ).format('DD/MM/YYYY');
				}
				varDump(`Extra_Vencimiento >>>>>>>>>>>>>>>>> ${_dataCert.Extra_Vencimiento}`);
				if(! _dataCert.Extra_Vencimiento )
				{
					_FechaVencimiento = ``;
				}
				varDump(`_FechaVencimiento >>>>>>>>>>>>>>>>> ${_FechaVencimiento} ||||| ${_dataCert.Extra_Vencimiento}`);

				var _Extra_InfAdicional = ``;
				if( _dataCert.Extra_InfAdicional ){
					_Extra_InfAdicional = _dataCert.Extra_InfAdicional;
				}
			
			

			_htmlPosterior += `
			<style type="text/css" media="print">
			@page { size: landscape; }
			</style>
			
			<div id="divContenedorP" style="margin-top: -18px;" >
				<span style="position:absolute;top:47px;left:91px;font-size:14px;color:#1e871c;" >${_dataCert.IdCertificadoNum}</span>
				<!-- DETALLE -->
				<!-- style=" margin-top:-40px;" -->
				<div class="postP" id="divOSP" >${_NroOS}</div>   
				
				<div class="postP" id="divAreaP" style="margin-top:-5px;">${_AreaTratada}</div>
				
				<div class="postP" id="divCorresP" style="margin-top:-5px;">${_Correspondido}</div> 
				
				<div class="postP" id="divFecVenP" style="margin-top:-5px;">${_FechaVencimiento}</div> 
				
				<div class="postP" id="divFactP">${_dataCert.NroFactura}</div>
				
				<div style="width:900px; height:20px; color:#395832; font-weight:500; position:relative; font-family:Verdana, Geneva, sans-serif; font-size:19px; left:240px; top:455px;">
				<!--6. N° Certificado:    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  _______________________________-->
				</div>
				
				
				<div class="postP" id="divInfP" style="">${_Extra_InfAdicional}</div>
				
				<div class="postP" id="nomcert">
				<!--6. N&uacute;mero de Certificado-->
				</div>
				
				<div class="postP" id="numcert">${_dataCert.IdCertificadoNum}</div>
			
			</div>
			
			<!-- ESTO CREA UNA NUEVA PAGINA -->
			<div style="page-break-after:always;" ></div>`;
			}// IF
			// + // + // + // + // + // + // + // + // + //	
		}// for
		_htmlPosterior += `</body></html>`;

		var _Archivo = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${_NombreFileOut}-P.html`;
		/*BORRAMOS*
		if (fs.existsSync( _Archivo )) {
			// path exists
			console.log("Existe HTML :", _Archivo);
			fs.unlink( _Archivo , (err) => {
				if (err) throw err;
				console.log('successfully deleted '+_Archivo);
			});
		}
		/**/
		varDump( _Archivo );
		fs.writeFileSync( _Archivo , _htmlPosterior );
		
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `PDF generado.` };
        //
    } catch (error) {
        varDump(error);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});
// -------------------------------------------------

//////////////////////////////////////////////////////////
//        GENERAMOS HTML DE CERTIFICADO PARA USUARIO    //
//////////////////////////////////////////////////////////
router.post('/make/html/user', async (req,res)=>{
    // Serie (,)
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
		var _Series = req.body.Serie;
		var _ArCerts = _Series.split(",");
		const _InfoCert = await CertificadoModel.findAll({
			where:{
				IdCertificadoNum : _ArCerts
			},
			order : [
				[ 'IdCertificadoNum' , 'ASC' ]
			]
		});
		// Dibujando frontal
		
		var _NombreFileOut = ``;
		if( _ArCerts.length > 1 )
		{
			_NombreFileOut = await uuidMini();
		}else{
			_NombreFileOut = req.body.IdCert;
		}
		_response.file = _NombreFileOut;
		// _css2022
			
		//
		for (let index = 0; index < _InfoCert.length; index++)
		{
			//
			var _htmlSalida = `<!doctype html>
			<html lang="en">
			<head>
				<meta charset="UTF-8"><title>CERTIFICADO SSAYS</title>
				<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
				<link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.css" />
				${_css2022}
				</head>
			<body>`;
			// Extra_NomComercial
			var _dataCert = _InfoCert[ index ];
			var _nomCliente = _dataCert.nombre_cliente;
			if( _dataCert.Extra_NomComercial )
			{
				if( _dataCert.NomComercial != '' ){
					_nomCliente = _dataCert.NomComercial;
				}
			}

			// Direccion
			var longdir = _dataCert.Direccion, _Direccion = ``;
			if( longdir.length > 139 )
			{
				_Direccion = `<div id="divDireccionPeque" >${_dataCert.Direccion}</div>`;
			}else{
				_Direccion = `<div id="divDireccion" >${_dataCert.Direccion}</div>`;
			}
			// Giro
			var longdir = _dataCert.nombre_giro, _Giro = ``;
			if( longdir.length > 52 )
			{
				_Giro = `<div id="divGiroPeque" >${_dataCert.nombre_giro}</div>`;
			}else{
				_Giro = `<div id="divGiro" >${_dataCert.nombre_giro}</div>`;
			}
			// Area
			var longdir = _dataCert.AreaTratada, _AreaTratada = ``;
			if( longdir.length > 52 )
			{
				_AreaTratada = `<div id="divAreaPeque" >${_dataCert.AreaTratada}</div>`;
			}else{
				_AreaTratada = `<div id="divArea" >${_dataCert.AreaTratada}</div>`;
			}
			// FEchas
			var _FechaServicio = _dataCert.FechaServicio;
			var _arrFecha = _FechaServicio.split("-");
			var _Dia = _arrFecha[2], _Mes = _arrFecha[1], _Anio = _arrFecha[0];
			var _FechaFinal = ``;
			if( _dataCert.ExtraFecha_Servicio )
			{
				_FechaFinal = _dataCert.ExtraFecha_Servicio;
			}else{
				// Fecha de servicio
				_FechaServicio = _dataCert.FechaServicio;
				var _arrFecha = _FechaServicio.split("-");
				var _Dia = _arrFecha[2], _Mes = _arrFecha[1], _Anio = _arrFecha[0];
				_FechaFinal = `${_Dia}/${_Mes}/${_Anio}`;
			}
			var _divFechaServicio = `<div id="divFechaServicio">${_FechaFinal}</div>`;


				// Agreglo meses
				var _Meses = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
				var _FechaServicio = _dataCert.FechaServicio;
				var _arrFecha = _FechaServicio.split("-");
				var _Dia_ = _arrFecha[2], _Mes_ = parseInt( _arrFecha[1] ), _Anio_ = _arrFecha[0];
				var _NombreMes = _Meses[_Mes_];

				// las X
				var _Desinsectacion = ``, _LimpCisternaAgua = ``, _Desratizacion = ``, _LimpTanqueSeptico = ``, _Desinfeccion = ``;
				if( _dataCert.Desinsectacion )
				{
					_Desinsectacion = _dataCert.Desinsectacion;
				}
				if( _dataCert.LimpCisternaAgua )
				{
					_LimpCisternaAgua = _dataCert.LimpCisternaAgua;
				}
				if( _dataCert.Desratizacion )
				{
					_Desratizacion = _dataCert.Desratizacion;
				}
				if( _dataCert.LimpTanqueSeptico )
				{
					_LimpTanqueSeptico = _dataCert.LimpTanqueSeptico;
				}
				if( _dataCert.Desinfeccion )
				{
					_Desinfeccion = _dataCert.Desinfeccion;
				}
				
				_htmlSalida += ``;
				//  style="page-break-after:always;" 
				_htmlSalida += `
				<div id="contenedor">
					<div id="SerieCert" >${_dataCert.IdCertificadoNum}</div>
					<div class="zonaX">
						<div id="x1Desin">${_Desinsectacion}</div>
						<div id="x2DesRa">${_Desratizacion}</div>
						<div id="x3DesInfec">${_Desinfeccion}</div>
						<div id="x4Reser">${_LimpCisternaAgua}</div>
						<div id="x5Tanque">${_LimpTanqueSeptico}</div>
					</div>
					<div class="zonaTextos">
						<div id="Cliente">${_nomCliente}</div>
						<div id="Dir">${_Direccion}</div>
						<div id="Giro">${_Giro}</div>
						<div id="Area">${_AreaTratada}</div>
						<div id="FechaServ">${_FechaFinal}</div>
						<div id="Dia">${_Dia_}</div>
						<div id="Mes">${_NombreMes}</div>
						<div id="Anio">${_Anio_}</div>
					</div>
					<img id="imgCert" src="https://api.ssays-orquesta.com/formatoCert-2022-03.png" alt="">
				</div>
				<!-- ESTO CREA UNA NUEVA PAGINA 
				<div style="page-break-after:always;" ></div>-->`;
				
				var _NroOS = ``, _AreaTratada = ``;
				if( _dataCert.NroOS ){
					_NroOS = _dataCert.NroOS;
				}
				if( _dataCert.AreaTratada ){
					_AreaTratada = _dataCert.AreaTratada;
				}
				var _Correspondido = ``;
				if( _dataCert.Correspondido ){
					_Correspondido = _dataCert.Correspondido;
				}
				var _Extra_Vencimiento = ``;
				if( _dataCert.Extra_Vencimiento ){
					_Extra_Vencimiento = _dataCert.Extra_Vencimiento;
				}else{
					//
				}
				var _FechaVencimiento = ``;
				// Incluye fecha de vencimiento
				if( _dataCert.FechaVencimiento ){
					_FechaVencimiento = moment( _dataCert.FechaVencimiento ).format('DD/MM/YYYY');
				}
				varDump(`Extra_Vencimiento >>>>>>>>>>>>>>>>> ${_dataCert.Extra_Vencimiento}`);
				if(! _dataCert.Extra_Vencimiento )
				{
					_FechaVencimiento = ``;
				}
				varDump(`_FechaVencimiento >>>>>>>>>>>>>>>>> ${_FechaVencimiento} ||||| ${_dataCert.Extra_Vencimiento}`);

				var _Extra_InfAdicional = ``;
				if( _dataCert.Extra_InfAdicional ){
					_Extra_InfAdicional = _dataCert.Extra_InfAdicional;
				}
				//  style="page-break-after:always;" 
				_htmlSalida += `<div id="posterior">
					<div id="OS1">N° Orden de servicio</div>
					<div id="OS2">${_NroOS}</div>
					<div id="division1"></div>
					<div id="Area1">Área y/o volumen tratado</div>
					<div id="Area2">${_AreaTratada}</div>
					<div id="division2"></div>
					<div id="Corr1">Correspondiente a</div>
					<div id="Corr2">${_Correspondido}</div>
					<div id="division3"></div>
					<div id="Vcto1">Fecha vencimiento</div>
					<div id="Vcto2">${_FechaVencimiento}</div>
					<div id="division4"></div>
					<div id="Fact1">N° Factura</div>
					<div id="Fact2">${_dataCert.NroFactura}</div>
					<div id="division5"></div>
					<div id="Cert1">N° Certificado</div>
					<div id="Cert2">${_dataCert.IdCertificadoNum}</div>
					<div id="division6"></div>
					<div id="Glosa">${_Extra_InfAdicional}</div>
				</div>
				`;
				// Escribimos cada certificado de forma individual
				_htmlSalida += `</body></html>`;
				var _Archivo = `${_RUTA_PROYECTO}adjuntos/certificados/C-${_dataCert.IdCertificadoNum}.html`;
				fs.writeFileSync( _Archivo , _htmlSalida );
				//
		} // FOR
		
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Archivo generado.` };
        //
    } catch (error) {
        varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});
// -------------------------------------------------

//////////////////////////////////////////////////////////
//      COMPRIMIR LOS CERTIDICADOS PARA EL USUARIO      //
//////////////////////////////////////////////////////////
router.post('/zip/user', async (req,res)=>{
    // IdCert (,)
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];

    try {
        //
		var $Series = req.body.IdCert;
		$arCerts = $Series.split(',');
		try {
			// -
			var zipper 	= new zip();
			var uuid 	= await uuidMini();
			var ZipNombre = `Zip_Certificados_${uuid}.zip`;
			//
			for (let index = 0; index < $arCerts.length; index++)
			{
				const NroCert = $arCerts[index];
				var pdf = `${_RUTA_PROYECTO}adjuntos/certificados/C-${NroCert}.pdf`;
				try {
					if ( fs.existsSync(pdf) ) {
						//file exists
						zipper.addLocalFile( pdf );
					}
				} catch(err) {
					console.error(err)
				}
			} // for
			zipper.writeZip( './assets/zip_certificados/'+ZipNombre );
			_response.zip = ZipNombre;
			// -
		} catch (error) {
			console.error(error);
			// expected output: ReferenceError: nonExistentFunction is not defined
			// Note - error messages will vary depending on browser
		}
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Zip generado, descargando...` };
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






// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
async function uuidMini()
{
    var length = 5;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
// -------------------------------------------------
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
// -------------------------------------------------


/*
######################################################################
######################################################################
######################################################################
######################################################################
						POPULAR PAGINADO
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################

######################################################################
 */
function populateCC( json )
{
	// POPULAR PAGINA BUSCAR CARGO CERTIFICADOS
	var $data = [];

	json.forEach(function callback(value, index, array) {
		// tu iterador
		var $o = [];
		var $color = '';
		if( value.Estado  == 'Anulado' ){
			var $color = 'red';
		}
		$o.push(`<input value="${value.id_certificado}" type="checkbox" id="${value.id_certificado}" />`);
		switch(value.Detalle.Estado)
		{
			case 'Digitado':
				$o.push(`<span class="badge bg-light-blue" >${value.id_certificado}</span>`);
			break;
			case 'Anulado':
				$o.push(`<span class="badge bg-red" >${value.id_certificado}</span>`);
			break;
			case 'Aprobado':
				$o.push(`<span class="badge bg-green" >${value.id_certificado}</span>`);
			break;
		}
		$o.push(value.Detalle.NroOS);
		$o.push(value.Detalle.nombre_cliente);
		$o.push(value.Detalle.FechaEmision);
		$o.push(value.entregado_a);
		
		$o.push(value.fecha_entrega);
		$o.push(value.recibido_por);

		$o.push(value.fecha_retorno);
		$o.push(value.Detalle.Estado);
		$o.push(`<a href="#" data-id="${value.id}" data-certificado="${value.id_certificado}" class=" btnEditarModal btn btn-block btn-primary btn-xs">Editar</a>`);
		//
		$data.push( $o );
	});

	/**
	if( json != undefined ){
		$.each( json , function( key, value ) {
			var $o = [];

			var $color = '';
			if( value.Estado  == 'Anulado' ){
				var $color = 'red';
			}
			switch(value.Detalle.Estado)
			{
				case 'Digitado':
					$o.push(`<span class="badge bg-light-blue" >${value.id_certificado}</span>`);
				break;
				case 'Anulado':
					$o.push(`<span class="badge bg-red" >${value.id_certificado}</span>`);
				break;
				case 'Aprobado':
					$o.push(`<span class="badge bg-green" >${value.id_certificado}</span>`);
				break;
			}
			
			$o.push(value.Detalle.nombre_cliente);
			$o.push(value.Detalle.FechaEmision);
			$o.push(value.entregado_a);
			
			$o.push(value.fecha_entrega);
			$o.push(value.recibido_por);

			$o.push(value.fecha_retorno);
			$o.push(value.Detalle.Estado);
			$o.push(`<a href="#" data-id="${value.id}" data-certificado="${value.id_certificado}" class=" btnEditarModal btn btn-block btn-primary btn-xs">Editar</a>`);
			//
			$data.push( $o );
		});
	}
	/**/
	return $data;
}


function varDump( _t )
{
    console.log( _t );
}


module.exports = router;
