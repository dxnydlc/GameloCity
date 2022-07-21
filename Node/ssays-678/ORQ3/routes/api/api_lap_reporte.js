
// api_lap_reporte.js





var _NombreDoc = 'api_lap_reporte';
const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();
// >>>>>>>>>>>>>    SPARKPOST   >>>>>>>>>>>>>
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET);

// Archivos
const fs = require('fs');
const path    = require('path');
const client = require('https');

// zipiar archivos
const zip=require('adm-zip');

// PDF
const pdf = require("html-pdf");
var html_to_pdf = require('html-pdf-node');
var phantom = require('phantom');   


// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');

// >>>>>>>>>>>>>    NEXMO       >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);




// RUTAS
const _RUTA_PROYECTO = process.env.RUTA_PROYECTO;
const _URL_NODE = process.env.URL_NODE;
const _RUTA_ORQ3 = process.env.RUTA_ORQ3;

// PDF TO IMAGEN - NO SIRVE
const { Poppler } = require('pdf-images');

// PDF to imagen
const pdf2img = require('pdf2img');

const PDFMerger = require('pdf-merger-js');

const nodeHtmlToImage = require('node-html-to-image');

// DOCX
const docx = require("docx");
const { Document, Packer, Paragraph, TextRun } = docx;

// EXAMINAR PDF
const pdfC = require('pdf-page-counter');

// LEER EXCEL
const reader = require('xlsx');

// Modelos
const { errorLogModel } = require('../../dbA');
const { reporteLapModel, xlsLAPIncidenciasDetModel, User, sequelize, archiGoogleModel, sucursalModel, bitacoraSuperModel, apoyoDataModel, 
    bitacoraBloqueModel, bitacoraAreaModel, bitacoraTrabajoModel, xlsLAPTrabajadoresCabModel, cargaExcelModelCab, cargaExcelModelDet, 
    xlsLAPMaquinariaCabModel, xlsLAPhallazgoCabModel, xlsLAPIncidenciasCabModel, xlsLAPCharlaMesModel, xlsLAPAsistenciaModel, 
    xlsLAPRotaPersonalModel, xlsLAPAccidentesInciModel, xlsLAPDerrameCombustibleModel , LAPKitAntiderrameCabModel, xlsLAPMantMaqCabModel, 
    xlsLAPReqMatCabModel, LAPCarritoBarredorCabModel , xlsLAPMantBarredoraModel , xlsLAPDesempenioPersonalModel , xlsLAPApoyoCabModel, 
    xlsLAPApoyoDeModel, bitacoraDetalleModel, LapPesoFodModel , LapPersonalSancionadoModel , LapPersonalAIDModel , LapTrabajoNoRealizadoModel, 
    LapTrabajoNoRealizadoDetModel, lapTablaModel, lapBloque1Model } = require('../../db');


var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";


// COntrolador
const helpersController   = require('../../controllers/helpersController');
const estadoDocController = require('../../controllers/estadoDocController');


var _arrayMeses = ["" ,"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];


// VALIDACION
var _Requeridos = [
    check('FecInicio' ,'Ingrese fecha de inicio').not().isEmpty(),
    check('FecFin' ,'Ingrese fecha fin').not().isEmpty()
];

var _css1 = `
<style>
a:link { text-decoration: none; }
a:visited { text-decoration: none; }
a:hover { text-decoration: none; }
a:active { text-decoration: none; }
h4 a{
    color: #293241;
}
h4{
    margin-top: 3px;
    margin-bottom: 3px;
}
.container {
    width: 95%;
    position: relative;
    padding-top: 20px;
    padding-bottom: 20px;
}
a,h1,h2,h3,h4,h5,p,li,div,th,td{
    font-family: 'Ubuntu', sans-serif;
}
.table{
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    border-bottom: 1px #053F5C solid;
}
.table td,th{
    font-size:12px;
}
.table>thead>tr>th {
    vertical-align: bottom;
    border-bottom: 1px solid #8CD4F4;
    padding-bottom: 6px;
    padding-top: 6px;
}
.table thead th {
    background-color: #046C95;
    color: #FFF;
    border-right: 1px #B3E0EE dotted;
}
.table>tbody>tr>td{
    border-top: 1px dotted #053F5C;
    padding-top: 5px;
    padding-bottom: 5px;
}
.text-center{
    text-align: center;
}
#textoHeader{
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: 300px;
    top: 448px;
    color: #FFF;
    text-shadow: #666 1px 0 4px;
}
#wrapperBloqueTitle{
    position: absolute;
    top: 60px;
    left: 166px;
    width: 526px;
    height: 56px;
    color: #FFF !important;
    font-weight: 600;
    font-size: 14px;
}
#wrapperAreaTitle{
    position: absolute;
    top: 195px;
    left: 21px;
    width: 510px;
    height: 56px;
    color: #FFF;
    font-weight: 600;
    font-size: 14px;
}
#wrapperTrabajoTitle{
    position: absolute;
    top: 295px;
    left: 39px;
    width: 570px;
    height: 40px;
    color: #FFF;
    font-weight: 600;
    font-size: 14px;
}
.subTexto{
    display: block;
}
.subTexto h3{
    font-weight: 600;
    font-size: 14px;
}
.text-primary {
    color: #337ab7;
}
.row{
    clear: both;
}
.itemTrabajo {
    border: 3px #F27F0C solid;
    border-radius: 5px;
    padding-top: 4px;
    display: flex;
}
.col-lg-4 {
    width: 33.33333333%;
    display: block;
    float: left;
}
.ThumbImg {
    max-height: 280px;
    max-width: 400px;
    display: block;
    margin :  0 auto;
}
.aImg{
    max-width: 400px;
    display: block;
    margin :  0 auto;
}
.tblFotos > tbody > tr > td
{
    width: 33.33333333%;
}
.tblFotos{
    width: 100%;
}
.img-responsive{
    width: 100%;
}
.img-fluid{
    width: 100%;
}
.titulo1{
    /*background : url('${_URL_NODE}api/file_fi21/lap/asset/area-01');
    width: 665px;
    max-width: 665px;
    height: 138px;
    padding-top: 49px;
    padding-left: 156px;
    max-height: 84px;
    */
    font-size: 17px;
    color: #F27F0C;
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 20px;
}
.titulo2{
    /*background : url('${_URL_NODE}api/file_fi21/lap/asset/bloque-01');
    width: 763px;
    max-width: 763px;
    height: 91px;
    padding-top: 49px;
    font-size: 14px;
    padding-left: 28px;
    font-weight: 600;
    max-height: 91px;
    color: #FFF;*/
    font-size: 16px;
    color: #F7AD19;
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 20px;
}
.titulo3{
    /*background : url('${_URL_NODE}api/file_fi21/lap/asset/trabajo-01');
    width: 763px;
    max-width: 763px;
    height: 91px;
    padding-top: 49px;
    font-size: 14px;
    padding-left: 28px;
    font-weight: 600;
    max-height: 91px;
    color: #FFF;*/
    font-size: 16px;
    color: #053F5C;
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 20px;
}
@page {
    margin: 10px 0; 
}
</style>
`;

var _htmlHead = `
<!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>SSAYS - INFORMDE DE GESTIÓN</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.css" />
        ${_css1}
    </head>
<body>
`;

// -------------------------------------------------------------
// -------------------------------------------------------------
async function execQuery( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `Nombre`;
    var _VerItem = [ sequelize.fn('CONCAT' , '<button data-codigo="', sequelize.col('Codigo') , '" data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" verRepo btn btn-block btn-primary btn-xs"><i class="fa fa-eye" ></i></button>') , 'Ver' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-codigo="', sequelize.col('Codigo') , '" data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" delRepo btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];
    var _EditarItem =  [ sequelize.fn('CONCAT' , '<button data-codigo="', sequelize.col('Codigo') , '" data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _pdf =  [ sequelize.fn('CONCAT' , '<button data-codigo="', sequelize.col('Codigo') , '" data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" pdfRepo btn btn-block btn-primary btn-xs"><i class="fa fa-cloud-download" ></i></button>') , 'PDF' ];
    var _Word =  [ sequelize.fn('CONCAT' , '<button data-codigo="', sequelize.col('Codigo') , '" data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" data-zip="', sequelize.col('Documento_Zip') ,'" type="button" class=" wordRepo btn btn-block btn-primary btn-xs"><i class="fa fa-cloud-download" ></i></button>') , 'Zip' ];
    var _compilar =  [ sequelize.fn('CONCAT' , '<button data-codigo="', sequelize.col('Codigo') , '" data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" wordCompilar btn btn-block btn-primary btn-xs"><i class="fa fa-bullseye" ></i></button>') , 'Comp.' ];
    
    var _atributos = [
        _VerItem,
        _EditarItem,
        _DelItem,
        _compilar,
        _Word,
        'Codigo',
        'Nombre',
        ['Text01','Cliente'],
        ['Text02','Local'],
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('FecInicio') , _fechaONlyLatFormat ) , 'Inicio'], 
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('FecFin') , _fechaONlyLatFormat ) , 'FIn'], 
        'Estado',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'], 
    ];
    //
    _dataResp = await reporteLapModel.findAll({
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

// -------------------------------------------------------------
async function execQuery2( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `Nombre`;
    var _VerItem = [ sequelize.fn('CONCAT' , '<button data-codigo="', sequelize.col('Codigo') , '" data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" verRepo btn btn-block btn-primary btn-xs"><i class="fa fa-eye" ></i></button>') , 'Ver' ];
    var _pdf =  [ sequelize.fn('CONCAT' , '<button data-codigo="', sequelize.col('Codigo') , '" data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" pdfRepo btn btn-block btn-primary btn-xs"><i class="fa fa-cloud-download" ></i></button>') , 'PDF' ];
    var _feedBack =  [ sequelize.fn('CONCAT' , '<button data-codigo="', sequelize.col('Codigo') , '" data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" feedBackRepo btn btn-block btn-primary btn-xs"><i class="fa fa-comment" ></i></button>') , 'FeedBack' ];
    var _Word =  [ sequelize.fn('CONCAT' , '<button data-codigo="', sequelize.col('Codigo') , '" data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" data-zip="', sequelize.col('Documento_Zip') ,'" type="button" class=" wordRepo btn btn-block btn-primary btn-xs"><i class="fa fa-cloud-download" ></i></button>') , 'Zip' ];

    var _atributos = [
        _VerItem,
        _Word,
        _feedBack,
        'Codigo',
        'Nombre',
        ['Text02','Local'],
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('FecInicio') , _fechaONlyLatFormat ) , 'Inicio'], 
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('FecFin') , _fechaONlyLatFormat ) , 'FIn'], 
        'Estado',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'], 
    ];
    //
    _dataResp = await reporteLapModel.findAll({
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
//      			OBTENER ULTIMOS 200     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var _response = {};
    _response.codigo = 200;

    try {
        _response.data = [];
        _response.ut   = await helpersController.getUserData( req.headers['api-token'] );
        //
        _response.data = await execQuery( { 'Estado' : 'Activo' } , 200  );
        //
    } catch (error) {
        helpersController.captueError( '' , `>>>${error}` );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }
    //
    return res.status(_response.codigo).json( _response );
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//      	  CREAR UN NUEVO REPORTE DE LAP             //
//////////////////////////////////////////////////////////
router.post('/cliente', async (req,res)=>{
    // IdCli
	var _response = {};
    _response.codigo = 200;

    try {
        _response.data = [];
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        //varDump( $userData );
        //
        _response.data = await execQuery2( { Campo01 : $userData.cliente , Estado : 'Activo' } , 200  );
        //
    } catch (error) {
        varDump( `${error}` );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }
    //
    return res.status(_response.codigo).json( _response );
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];


    try {
        //
        var _Entidad = await reporteLapModel.findOne({
            where : {
                uu_id : req.body.uuid
            }
        })
        .catch(function (err) {
            varDump( err );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        //
        _response.data = _Entidad;
        if( _Entidad )
        {
            //
            // Locales
            var _Locales = await sucursalModel.findAll({
                where : {
                    IdClienteProv : _Entidad.Campo01
                }
            });
            _response.locales = _Locales;
            //
        }
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Datos cargados.` };
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

//////////////////////////////////////////////////////////
//      	  CREAR UN NUEVO REPORTE DE LAP             //
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
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        var _fec = req.body.FecInicio;
        var _arFecha = _fec.split('-');
        var _MesName = _arrayMeses[ parseInt(_arFecha[1]) ];
        req.body.Nombre = `Informe gestión ${_MesName}-${_arFecha[0]}`;
        //
        await reporteLapModel.create(req.body)
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await reporteLapModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        if( _dataGuardado )
        {
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'RL'+_Codigo;
            await reporteLapModel.update({
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
            //
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Reporte generado.` };
        }

        _response.item = await reporteLapModel.findOne({
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
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', _Requeridos , async (req,res)=>{
    // uuid
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var _response = {};
    _response.codigo = 200;

    try {
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        _response.data = [];
        //
        var _fec = req.body.FecInicio;
        var _arFecha = _fec.split('-');
        var _MesName = _arrayMeses[ parseInt(_arFecha[1]) ];
        req.body.Nombre = `Informe gestión ${_MesName}-${_arFecha[0]}`;
        //
        await reporteLapModel.update(req.body,{
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await reporteLapModel.findOne({
            where : {
                uu_id : req.params.uuid
            }
        });
        // 342206 343129
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se actualizó el documento ${req.body.Codigo} correctamente.` };
        //
    } catch (error) {
        helpersController.captueError( '' , `>>>${error}` );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELIMINAR DOCUMENTO                  //
//////////////////////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid, Codigo
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        await reporteLapModel.update({
            Estado : 'Anulado'
        },{
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await reporteLapModel.findOne({
            where : {
                uu_id : req.params.uuid
            }
        });
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Anulado correcto.` };
        //
    } catch (error) {
        varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
});

// -------------------------------------------------------------



//////////////////////////////////////////////////////////
//             GENERAR HTML PARA MIGRAR A PDF           //
//////////////////////////////////////////////////////////
router.post('/generar', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];
    _response.details = ``;
    var _arrDetails   = [];
    _response.Codigo  = 0;

    try {
        //
        var _NroReporte = ``;
        var _html = ``, _htmlFInal = ``;

        var $where = {};
        $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
        var _dataConsulta = await reporteLapModel.findOne({
            where : {
                uu_id : req.body.uuid
            }
        });
        if( _dataConsulta )
        {
            _response.Codigo = _dataConsulta.Codigo;
            _NroReporte = `${_dataConsulta.Codigo}`;
            varDump(`Generado repore: ${_NroReporte}.`)

            // Buscamos por fecha.
            $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
            // Id Cliente
            if( _dataConsulta.Campo01 )
            {
                $where.IdCliente = _dataConsulta.Campo01;
            }
            // Id Local
            if( _dataConsulta.Campo02 )
            {
                $where.IdLocal = _dataConsulta.Campo02;
            }
            // Id Supervisor
            if( _dataConsulta.Campo03 )
            {
                $where.IdSupervisor = _dataConsulta.Campo03;
            }
            // IdBloque
            if( _dataConsulta.Campo04 )
            {
                $where.IdBloque = _dataConsulta.Campo04;
            }
            // IdArea
            if( _dataConsulta.Campo05 )
            {
                $where.IdAreaBloque = _dataConsulta.Campo05;
            }
            // IdTrabajo
            if( _dataConsulta.Campo06 )
            {
                $where.IdTrabajo = _dataConsulta.Campo06;
            }
            // Bloques de esta consulta >>>>>>>>>>>>>>>>>
            _DataBloques = await bitacoraSuperModel.findAll({
                attributes : ['IdBloque', 'Bloque','Codigo','id'],
                order : [
                    ['Codigo' , 'ASC']
                ],
                where : $where ,
                // group : 'IdBloque'
            });
            
            var _arrBloques = [];
            if( _DataBloques )
            {
                var _Trabajo = [], _Area = [];
                var _arrCodigos = [], _arrIdsb = [];
                // devolvemo el Nro de Bloques encontrados aqui.
                for (let iBita = 0; iBita < _DataBloques.length; iBita++) {
                    const _rsBita = _DataBloques[iBita];
                    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    _arrCodigos.push( _rsBita.Codigo );
                    _arrIdsb.push( _rsBita.id );
                    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                }
                // Guardamos los codigos recolectados
                var _idsTxt = _arrIdsb.join(',');
                await reporteLapModel.update({
                    NroCodigos : _idsTxt
                },{
                    where : {
                        id : _dataConsulta.id
                    }
                });
                var _arrIdAreas = [], _arrIdTrabajos = [];
                //varDump( _arrCodigos );
                // Ahora obtenemos los bloques
                var _dataBloques_J = await bitacoraBloqueModel.findAll({
                    where : {
                        IdBitacora : { [Op.in]: _arrCodigos }
                    },
                    group : 'IdBloque'
                });
                // Limpiamos la tabla de trabajos realizados
                await lapTablaModel.destroy({
                    where : {
                        CodigoBita : _dataConsulta.Codigo
                    }
                });
                // Recorremos los bloques obtenidos
                var _Conta = 1;
                for (let index = 0; index < _dataBloques_J.length; index++)
                {
                    
                    const rsBloque = _dataBloques_J[index];
                    //varDump(`>>>>>>>> Bloque => ${rsBloque.Bloque}`);
                    
                    // KKKKKKKKKKKKKKKKKKK Ahora obtenemos las AREAS de cada BLOQUE.  KKKKKKKKKKKKKKKKKKK
                    var _dataBitArea = await bitacoraAreaModel.findAll({
                        where : {
                            IdBitacora : { [Op.in]: _arrCodigos },
                            IdBloque : rsBloque.IdBloque
                        },
                        group : 'IdArea'
                    });
                    // 00000000000000 LIMPIAR ARREGLO 00000000000000
                    _Area = [];
                    for (let iArea = 0; iArea < _dataBitArea.length; iArea++)
                    {
                        const _rsArea  = _dataBitArea[iArea];
                        _arrIdAreas.push( _rsArea.id );
                        var _dataAreaO = await bitacoraSuperModel.findOne({
                            where : { Codigo: _rsArea.IdBitacora }
                        });
                        //varDump(`>>>>>>>> Bloque => ${rsBloque.Bloque}, Area => ${_rsArea.Area}.`);
                        
                        // KKKKKKKKKKKKKKKKKKK Ahora obtenemos los TRABAJOS de cada AREA.  KKKKKKKKKKKKKKKKKKK
                        var _dataTrabajo = await bitacoraTrabajoModel.findAll({
                            where : {
                                IdBitacora : { [Op.in]: _arrCodigos },
                                IdArea : _rsArea.IdArea
                            }
                        });
                        // 00000000000000 LIMPIAR ARREGLO 00000000000000
                        _Trabajo = [], _Fechas = [];
                        for (let iTabaj = 0; iTabaj < _dataTrabajo.length; iTabaj++)
                        {
                            const _rsTRabaj = _dataTrabajo[iTabaj];
                            _arrIdTrabajos.push( _rsTRabaj.id );
                            // 9999999999999999999999999999999999999999
                            var _fecha = moment( _rsTRabaj.Fecha ).format('DD/MM/YYYY');
                            _Fechas.push(_fecha);
                            // 9999999999999999999999999999999999999999
                            var _dataTrabajos = await bitacoraSuperModel.findOne({
                                where : {
                                    Codigo: _rsTRabaj.IdBitacora
                                }
                            });
                            var _IdBitacora = _rsTRabaj.IdBitacora;
                            var _IdBit = parseInt( _IdBitacora.replace( /^\D+/g, '') );
                            // Ahora los archivos asociados a este trabajo...
                            var _dataFiles = await archiGoogleModel.findAll({
                                where : {
                                    formulario  : 'BITACORA_SUPER',
                                    correlativo : _IdBit
                                }
                            });
                            _Trabajo.push({ 'trabajos' : _dataTrabajos , 'archivos' : _dataFiles });
                            //varDump(`>>>>>>>> Bloque => ${rsBloque.Bloque}, Area => ${_rsArea.Area}, Tabajo => ${_rsTRabaj.Trabajo}, [${_IdBit}], con ${_dataFiles.length} archivos.`);
                        }// For Trabajo
                        
                        // Guardamos los codigos recolectados
                        var _txtTrab = _arrIdTrabajos.join(','), _txtArea = _arrIdAreas.join(',');
                        await reporteLapModel.update({
                            NroAreas : _txtArea , 
                            NroTrabajos : _txtTrab
                        },{
                            where : {
                                id : _dataConsulta.id
                            }
                        });
                        _Area.push({ 'Area' : _dataAreaO , 'trabajo' : _Trabajo });
                        // lapTablaModel
                    }// For Areas
                    _arrBloques.push({ 'bloque' : rsBloque , 'areas' : _Area });
                    _Conta++;
                    
                }// For Bloques
            }else{
                varDump(`No hay resultados en esta busqueda`);
            }

            
            _response.bloque = _arrBloques;
            var _fec = _dataConsulta.FecInicio;
            var _arFecha = _fec.split('-');
            var _MesName = _arrayMeses[ parseInt(_arFecha[1]) ];

            // varDump(`######### GENERAR REPORTE GESTION LAP: ${_dataConsulta.FecInicio} >>>>>>>>>>>>>>>> ${_arFecha[1]}.`);

            // Iniciamos dibujo de html para descargar.
            _htmlFInal = _htmlHead;
            _htmlFInal  += `
                <!-- ENCABEZADO -->
                <div class=" container " >
                    <img src="${_URL_NODE}api/file_fi21/lap/asset/header-01" style="width:700px; display:block; margin: 0 auto;">
                    <div id="textoHeader" ><h2 class="text-center" >${_MesName} ${_arFecha[0]}</h2></div>
                </div>
                <!-- ./container -->

                <!-- ESTO CREA UNA NUEVA PAGINA -->
                <div style="page-break-after:always;" ></div>
                
                <!-- INDICES -->
                <div class=" container " >
                    <table class=" table " >
                        <thead>
                            <tr>
                                <th>Contenido</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque01" >01 Cumplimiento del programa del servicio preventivo de limpieza.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque02" >02 Relación de trabajadores.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque03" >03 Relación de maquinaria.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque04" >04 Reporte de hallazgos.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque05" >05 Reporte de incidencias.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque06" >06 Charla del mes.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque07" >07 Registro asistencia personal.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque08" >08 Rotación de personal.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque09" >09 Incidentes y accidentes.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque10" >10 Derrame de combustible.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque11" >11 Uso de kit anti derrame.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque12" >12 Mantenimiento de maquinaria y equipos críticos.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque13" >13 Consolidado de consumo de materiales.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque14" >14 Control de traslado y barrido de camión barredor.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque15" >15 Informe de mantenimiento de la barredora.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque16" >16 Desempeño del personal.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque17" >17 Otros trabajos.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque18" >18 Registro del peso fod.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque19" >19 Personal AID.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque20" >20 Relación de personal sancionado.</a></h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4><a href="#Bloque21" >21 Trabajos no realizados.</a></h4>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!--<img src="${_URL_NODE}api/file_fi21/lap/asset/indice01" style="width:900px; display:block; margin: 0 auto;" />
                    <img src="${_URL_NODE}api/file_fi21/lap/asset/indice02" style="width:900px; display:block; margin: 0 auto;" />
                    <img src="${_URL_NODE}api/file_fi21/lap/asset/indice03" style="width:900px; display:block; margin: 0 auto;" />
                    <img src="${_URL_NODE}api/file_fi21/lap/asset/indice04" style="width:900px; display:block; margin: 0 auto;" />-->
                </div>
                <!-- ./container -->
                <!-- ESTO CREA UNA NUEVA PAGINA 
                <div style="page-break-after:always;" ></div>-->`;
            // XXXXXXX Generamos html de bloque 0 XXXXXXX
            //_html += `</body></html>`;
            /*_html = _htmlHead;
            var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-0.html`;
            fs.writeFileSync( _Archivo , _html );*/
            varDump(`Bloque 0 generado.......`);



            if( _arrBloques )
            {
                //
                
                var _arBloque = _arrBloques;
                var _CSGO = 2;
                _CSGO = 1;

// Tabla de contenido con bloque y areas

_htmlFInal += `
<div class=" container " id="Bloque01" >
    <img src="${_URL_NODE}api/file_fi21/lap/asset/01"  />
`;
for (let iBloque = 0; iBloque < _arBloque.length; iBloque++)
{
    //
    
    const _rsBloque = _arBloque[iBloque].bloque;
    _htmlFInal += `
		<table class="table table-hover ">
            <thead>
            <tr>
                <th>ITEM.</th>
                <th>${_rsBloque.Bloque}</th>
                <th>Frecuencia</th>
                <th>|</th>
            </tr>
            </thead>
            <tbody>`;

            var _insertTabla = {};
            _insertTabla.uu_id      = await helpersController.renovarToken();

            _insertTabla.Contador   = _CSGO;
            _insertTabla.IdBloque   = _rsBloque.id;
            _insertTabla.CodigoBita = _dataConsulta.Codigo;
            _insertTabla.Bloque     = _rsBloque.Bloque;
            // INSERTAR EN TABLA PARA EL REPORTE
            await lapTablaModel.create( _insertTabla );
            
            
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            var _dataAreas = _arBloque[iBloque].areas;
            for (let iArea = 0; iArea < _dataAreas.length; iArea++)
            {
                //
                const _rsArea = _dataAreas[iArea].Area;
                const _dataTrabajo = _dataAreas[iArea].trabajo;
                var _Fechas = [];
                if( _rsArea.Estado != 'Anulado' )
                {
                    var _insertTabla = {};
                    _insertTabla.uu_id      = await helpersController.renovarToken();

                    _insertTabla.Contador   = _CSGO;
                    _insertTabla.IdBloque   = _rsBloque.id;
                    _insertTabla.CodigoBita = _dataConsulta.Codigo;
                    _insertTabla.Trabajo     = _rsArea.AreaBloque;
                    //
                    _htmlFInal += `<tr>`;
                    _htmlFInal += `<td>${_CSGO}</td><td>${_rsArea.AreaBloque}</td><td>${_rsArea.TurnoArea}</td>`;
                    _insertTabla.Frecuencia = _rsArea.TurnoArea;
                    // Ahora vamos a obtener las fechas de cada trabajo que se hizo...
                    for (let iTrab = 0; iTrab < _dataTrabajo.length; iTrab++)
                    {
                        const _rsT = _dataTrabajo[iTrab].trabajos;
                        var _fecha = moment( _rsT.Fecha ).format('DD/MM/YYYY');
                        _Fechas.push(_fecha);
                    }
                    _htmlFInal += `<td>${_Fechas.join(', ')}</td>`;
                    _htmlFInal += `</tr>`;
                    _CSGO++;
                    _insertTabla.Fechas = _Fechas.join(',');
                    //
                    // INSERTAR EN TABLA PARA EL REPORTE
                    await lapTablaModel.create( _insertTabla );
                }
            }
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            _htmlFInal += `</tbody>
		</table>`;
    _CSGO++;
    
    //
}




_htmlFInal += `</div>
<!-- ./container -->
<hr/>

<!-- ESTO CREA UNA NUEVA PAGINA -->
<div style="page-break-after:always;" ></div>`;

var _htmldetalle = ``;
_htmldetalle += `
<div class=" container " >
`;


await lapBloque1Model.destroy({
    where : {
        CodigoBita : _dataConsulta.Codigo
    }
});

var _CSGO_Bloque = 1, _CSGO_Area = 1, _CSGO_Trabajo = 1;

for (let iBloque = 0; iBloque < _arBloque.length; iBloque++)
{
    _CSGO_Area = 1, _CSGO_Trabajo = 1;

    var _InsertBloque1 = {};
    _InsertBloque1.uu_id = await helpersController.renovarToken();
    //
    const _rsBloque = _arBloque[iBloque].bloque;
    //
    _htmldetalle += `<div class=" titulo1 " >${_CSGO_Bloque} ${_rsBloque.Bloque}</div>`;

    _InsertBloque1.IdBloque     = _rsBloque.id;
    _InsertBloque1.Bloque       = _rsBloque.Bloque;// 9999
    _InsertBloque1.CodigoBita   = _dataConsulta.Codigo;
    await lapBloque1Model.create( _InsertBloque1 );


    var _dataAreas = _arBloque[iBloque].areas;
    for (let iArea = 0; iArea < _dataAreas.length; iArea++)
    {
        var _InsertBloque1 = {};
        _CSGO_Trabajo = 1;
        //
        const _rsArea = _dataAreas[iArea].Area;
        _htmldetalle += `
        <div class=" titulo2 " >${_CSGO_Bloque}.${_CSGO_Area} ${_rsArea.AreaBloque}</div>
        `;
        _InsertBloque1.uu_id = await helpersController.renovarToken();
        _InsertBloque1.IdBloque   = _rsBloque.id;
        _InsertBloque1.Area       = _rsArea.AreaBloque; // 9999
        _InsertBloque1.CodigoBita = _dataConsulta.Codigo;
        await lapBloque1Model.create( _InsertBloque1 );
        
        const _dataTrabajo = _dataAreas[iArea].trabajo;
        for (let iTrab = 0; iTrab < _dataTrabajo.length; iTrab++)
        {
            var _InsertBloque1 = {};
            //
            const _rsTrabajo = _dataTrabajo[iTrab].trabajos;
            const _dataArchivos = _dataTrabajo[iTrab].archivos;
            _htmldetalle += `
            <div class=" titulo3 " >${_CSGO_Bloque}.${_CSGO_Area}.${_CSGO_Trabajo} ${_rsTrabajo.Trabajo}</div>
            <!--<img src="${_URL_NODE}api/file_fi21/lap/asset/trabajo-01" style="width:650px;">-->
            `;
            //
            _InsertBloque1.uu_id = await helpersController.renovarToken();
            _InsertBloque1.IdBloque     = _rsBloque.id;
            _InsertBloque1.Trabajo      = _rsTrabajo.Trabajo; // 9999
            _InsertBloque1.CodigoBita   = _dataConsulta.Codigo;
            await lapBloque1Model.create( _InsertBloque1 );
            //
            varDump( ` ####### Buscando detalle en: ${_rsTrabajo.Codigo} XXXXXXXXXXXXXXX ${_rsTrabajo.Trabajo}.#######` );
            //
            // :TODO bitacoraDetalleModel
            var _dataDetalle = await bitacoraDetalleModel.findAll({
                where : {
                    CodigoHead : _rsTrabajo.Codigo
                }
            });
            for (let indexD = 0; indexD < _dataDetalle.length; indexD++)
            {
                var _InsertBloque1 = {};

                // _htmldetalle = _htmlHead;

                const _rsD = _dataDetalle[indexD];
                varDump(`Buscando archivos en detalle >>>> ${_rsD.Codigo}.`);
                // Files detalle
                var _filesDet = await archiGoogleModel.findAll({
                    where : {
                        Cod001 : _rsD.Codigo ,
                        formulario : 'DETALLE_BITACORA'
                    },
                    limit : 10
                });
                //
                _htmldetalle += `
                <div class="subTexto" >
                    <h3 class="text-primary">${_rsD.Nombre}</h3>
                </div>
                `;
                _InsertBloque1.uu_id = await helpersController.renovarToken();
                _InsertBloque1.IdBloque     = _rsBloque.id;
                _InsertBloque1.Sector       = _rsD.Nombre; // 9999
                _InsertBloque1.CodigoBita   = _dataConsulta.Codigo;
                await lapBloque1Model.create( _InsertBloque1 );
                
                varDump(`######################CCCCCCCCCXXXXXXX ${_rsD.Codigo} WWWWWWWWWWWWWWWWWW ${_rsD.Nombre} hay ${_filesDet.length} archivos`);
                //
                _htmldetalle += `<table class=" table tblFotos " >
                <tbody>`;
                var _ctd = 1, _img01 = ``, _img03 = ``;
                for (let iFiles = 0; iFiles < _filesDet.length; iFiles++)
                {
                    var _InsertBloque1 = {};
                    
                    const rsFile = _filesDet[iFiles];

                    if( _ctd == 1 )
                    {
                        _img01 = rsFile.RutaThumbnail;// rsFile.ruta_fisica;
                        _img03 = rsFile.url_compress;
                        _htmldetalle += `<tr>`;
                    }
                    //downloadImage( rsFile.url , rsFile.nombre_fisico ).then(console.log).catch(console.error);
                    _htmldetalle += `
                    <td>
                        <a data-fancybox="gallery" class=" aImg " href="${rsFile.url}" >
                            <img src="${rsFile.url}" alt="${rsFile.nombre_archivo}" class=" ThumbImg ">
                        </a>
                    </td>
                    <!-- td -->`;
                    _ctd++;
                    if( _ctd > 2 )
                    {
                        _InsertBloque1.Img01 = _img01;
                        _InsertBloque1.Img02 = rsFile.RutaThumbnail;// rsFile.ruta_fisica;
                        _InsertBloque1.Img03 = _img03
                        _InsertBloque1.Img04 = rsFile.url_compress;
                        _InsertBloque1.uu_id = await helpersController.renovarToken();
                        _InsertBloque1.IdBloque     = _rsBloque.id;
                        //_InsertBloque1.Sector       = '>'; // 9999
                        _InsertBloque1.CodigoBita   = _dataConsulta.Codigo;
                        await lapBloque1Model.create( _InsertBloque1 );
                        _img01 = ``;
                        //
                        _htmldetalle += `</tr>`;
                        _ctd = 1;
                    }
                }
                
                _htmldetalle += `</tbody>
                </table>`;
                //
                _htmldetalle += `</div><!-- row -->
                <hr/>`;
                //
                
                /*_htmldetalle += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Detalle-${_rsD.Codigo}.html`;
                fs.writeFileSync( _Archivo , _htmldetalle );*/
                _arrDetails.push(_rsD.id);
            } // for Detalle
            _html += `<!-- ESTO CREA UNA NUEVA PAGINA -->
	        <div style="page-break-after:always;" ></div>`;
            //
        }// for
        //
        _CSGO_Area++;
    }// for
    _CSGO_Bloque++;
} // for

/////////////////////////////////
_htmlFInal += _htmldetalle;
/////////////////////////////////

/*_html += `</body></html>`;
var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-1.html`;
fs.writeFileSync( _Archivo , _html );*/

varDump(`Bloque 1 generado.......`);

_response.details = _arrDetails.join(',');

/*_html += `
</div>
<!-- ./container -->
<!-- ESTO CREA UNA NUEVA PAGINA -->
<div style="page-break-after:always;" ></div>`;*/

                



                // *** RELACIÓN DE TRABAJADORES ***
                //_html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataOpers = await xlsLAPTrabajadoresCabModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque02" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/02" />
                        <hr/>`;
                        for (let index = 0; index < _dataOpers.length; index++) {
                            const rs = _dataOpers[index];
                            var _data01 = await dibujarSector( 'XLS_OPERARIOS_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                } // if
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-2.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 2 generado.......`);



                // *** RELACIÓN DE MAQUINARIA ***
                // _html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await xlsLAPMaquinariaCabModel.findAll({
                    where : $where
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque03" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/03" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_MAQUINARIA_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }// if
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-3.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 3 generado.......`);




                // *** REPORTE DE HALLAZGOS ***
                //_html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await xlsLAPhallazgoCabModel.findAll({
                    where : $where
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque04" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/04" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_HALLAZGOS_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-4.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 4 generado.......`);



                // *** REPORTE DE INCIDENCIAS ***
                //_html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await xlsLAPIncidenciasCabModel.findAll({
                    where : $where
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque05" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/05" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_INCIDENCIAS_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-5.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 5 generado.......`);



                // *** CHARLA DEL MES ***
                // _html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await xlsLAPCharlaMesModel.findAll({
                    where : $where
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque06" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/06" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_CHARLA_MES_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-6.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 6 generado.......`);




                // *** REGISTRO DE ASISTENCIA DEL PERSONAL ***
                // _html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await xlsLAPAsistenciaModel.findAll({
                    where : $where
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque07" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/07" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_ASISTENCIA_OPERARIOS_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-7.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 7 generado.......`);




                // *** ROTACION DEL PERSONAL *** 
                //_html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await xlsLAPRotaPersonalModel.findAll({
                    where : $where
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque08" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/08" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_ROTACION_PERSONAL_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-8.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 8 generado.......`);




                // *** REPORTE DE INCIDENTES Y ACCIDENTES *** 
                //_html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await xlsLAPAccidentesInciModel.findAll({
                    where : $where
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque09" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/09" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_ACCIDENTES_INCIDENTES_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-9.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 9 generado.......`);




                // *** REPORTE DE DERRAME DE COMBUSTIBLE *** 
                //_html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await xlsLAPDerrameCombustibleModel.findAll({
                    where : $where
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque10" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/10" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_LAP_DERRAME_COMBUSTIBLE' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-10.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 10 generado.......`);



                // *** REPORTE DE USO DEL KIT ANTI DERRAME ***
                //_html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await LAPKitAntiderrameCabModel.findAll({
                    where : $where
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque11" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/11" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_KIT_ANTIDERRAME_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-11.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 11 generado.......`);




                // *** INFORMES DE MANTENIMIENTO DE MAQUINARIAS Y EQUIPOS CRÍTICOS *** 
                //_html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await xlsLAPMantMaqCabModel.findAll({
                    where : $where
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque12" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/12" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_MANT_MAQUINARIA_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-12.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 12 generado.......`);



                // *** CONSOLIDADO DE CONSUMO DE MATERIALES ***  
                //_html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await xlsLAPReqMatCabModel.findAll({
                    where : $where
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque13" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/13" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_REQMATERIAL_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-13.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 13 generado.......`);



                // *** CONTROL DE TRASLADO Y BARRIDO DEL CAMIÓN BARREDOR ***
                //_html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await LAPCarritoBarredorCabModel.findAll({
                    where : $where
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque14" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/14" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_CARRITO_BARREDOR_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-14.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 14 generado.......`);



                // *** INFORME DE MANTENIMIENTO DE LA BARREDORA ***
                //_html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await xlsLAPMantBarredoraModel.findAll({
                    where : $where
                })
                .catch( function (err) {
                    varDump( err );
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque15" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/15" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_MANT_BARREDORA_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-15.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 15 generado.......`);



                // ***  INFORME DE DESEMPEÑO DE PERSONAL  ***
                //_html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await xlsLAPDesempenioPersonalModel.findAll({
                    where : $where
                })
                .catch( function (err) {
                    varDump( err );
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="Bloque16" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/16" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_DESEMPENIO_PERSONAL_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-16.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 16 generado.......`);



                // *** OTROS TRABAJOS ***
                //_html = _htmlHead;

                var $where  = {};
                $where.Estado   =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha    = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataApoyo  = await xlsLAPApoyoCabModel.findAll({
                    where : $where
                })
                .catch( function (err) {
                    varDump( err );
                });
                _htmlFInal += `
                <div class=" container " id="Bloque17" >
                    <img src="${_URL_NODE}api/file_fi21/lap/asset/17" />
                    <hr/>`;
                if(_dataApoyo )
                {
                
                    for (let index = 0; index < _dataApoyo.length; index++)
                    {
                        const rs = _dataApoyo[index];
                        var _Detalle = await xlsLAPApoyoDeModel.findAll({
                            where : {
                                CodigoHead : rs.Codigo
                            }
                        });
                        for (let indexD = 0; indexD < _Detalle.length; indexD++)
                        {
                            const rsD = _Detalle[indexD];
                            _htmlFInal += `<h3 class="" >${rsD.Ubicacion}</h3>`;
                            var _dataFilesD = await archiGoogleModel.findAll({
                                where : {
                                    formulario : 'LAP_APOYO' ,
                                    Cod001 : rsD.Codigo ,
                                    token : rsD.uu_id
                                }
                            });

                            _htmlFInal += `<table class=" table tblFotos " >
                            <tbody>`;
                            var _ctd = 1;
                            for (let iFiles = 0; iFiles < _dataFilesD.length; iFiles++)
                            {
                                const rsFile = _dataFilesD[iFiles];
                                if( _ctd == 1 )
                                {
                                    _htmlFInal += `<tr>`;
                                }
                                _htmlFInal += `
                                <td>
                                    <a data-fancybox="gallery" class=" aImg " href="${rsFile.url}" >
                                        <img src="${rsFile.url}" alt="${rsFile.nombre_archivo}" class=" ThumbImg ">
                                    </a>
                                </td>
                                <!-- td -->`;
                                _ctd++;
                                if( _ctd > 2 )
                                {
                                    _htmlFInal += `</tr>`;
                                    _ctd = 1;
                                }
                            }// for
                            _htmlFInal += `</tbody>
                            </table>`;
                        }// for
                    }// for
                
                } // i
                _htmlFInal += `</div>
                <!-- ./container -->
                <!-- ESTO CREA UNA NUEVA PAGINA 
                <div style="page-break-after:always;" ></div>-->`;

                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-17.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 17 generado.......`);



                // ***  PESO FOD ***
                //_html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await LapPesoFodModel.findAll({
                    where : $where
                })
                .catch( function (err) {
                    varDump( err );
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="XLS_PESO_FOD_LAP" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/18" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_PESO_FOD_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-18.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 18 generado.......`);



                // ***  PERSONAL AID ***
                // _html = _htmlHead;
                
                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await LapPersonalAIDModel.findAll({
                    where : $where
                })
                .catch( function (err) {
                    varDump( err );
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="XLS_PERSONAL_AID_LAP" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/19" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_PERSONAL_AID_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-19.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 19 generado.......`);



                // ***  PERSONAL SANCIONADO ***
                // _html = _htmlHead;

                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataMaqui = await LapPersonalSancionadoModel.findAll({
                    where : $where
                })
                .catch( function (err) {
                    varDump( err );
                });
                if(_dataMaqui )
                {
                    //
                    _htmlFInal += `
                    <div class=" container " id="XLS_PERSONAL_SANCIONADO_LAP" >
                        <img src="${_URL_NODE}api/file_fi21/lap/asset/20" />
                        <hr/>`;
                        for (let index = 0; index < _dataMaqui.length; index++) {
                            const rs = _dataMaqui[index];
                            var _data01 = await dibujarSector( 'XLS_PERSONAL_SANCIONADO_LAP' , rs.Codigo )
                            _htmlFInal += _data01;
                        }
                        _htmlFInal += `</div>
                    <!-- ./container -->
                    <!-- ESTO CREA UNA NUEVA PAGINA 
	                <div style="page-break-after:always;" ></div>-->`;
                    //
                }
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-20.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 20 generado.......`);
                



                // *** TRABAJO NO REALIZADO ***
                // *** OTROS TRABAJOS ***
                //_html = _htmlHead;

                var $where  = {};
                $where.Estado   =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha    = { [Op.gte ] : _dataConsulta.FecInicio , [Op.lte ]: _dataConsulta.FecFin };
                var _dataApoyo  = await LapTrabajoNoRealizadoModel.findAll({
                    where : $where
                })
                .catch( function (err) {
                    varDump( err );
                });
                //varDump(`FFFFFFFFFFFFFFFFFF TRABAJO NO REALIZADO: ${_dataApoyo.length} FFFFFFFFFFFFFFFFFF`);
                _htmlFInal += `
                <div class=" container " id="Bloque21" >
                    <img src="${_URL_NODE}api/file_fi21/lap/asset/21" />
                    <hr/>`;
                if(_dataApoyo )
                {
                
                    for (let index = 0; index < _dataApoyo.length; index++)
                    {
                        const rs = _dataApoyo[index];
                        var _Detalle = await LapTrabajoNoRealizadoDetModel.findAll({
                            where : {
                                CodigoHead : rs.Codigo
                            }
                        });
                        for (let indexD = 0; indexD < _Detalle.length; indexD++)
                        {
                            const rsD = _Detalle[indexD];
                            _htmlFInal += `<h3 class="" >${rsD.Ubicacion}</h3>`;
                            var _dataFilesD = await archiGoogleModel.findAll({
                                where : {
                                    formulario : 'XLS_TRABAJO_NO_REALIZADO_LAP' ,
                                    Cod001 : rsD.Codigo ,
                                    token : rsD.uu_id
                                }
                            });

                            _htmlFInal += `<table class=" table tblFotos " >
                            <tbody>`;
                            var _ctd = 1;
                            for (let iFiles = 0; iFiles < _dataFilesD.length; iFiles++)
                            {
                                const rsFile = _dataFilesD[iFiles];
                                if( _ctd == 1 )
                                {
                                    _htmlFInal += `<tr>`;
                                }
                                _htmlFInal += `
                                <td>
                                    <a data-fancybox="gallery" class=" aImg " href="${rsFile.url}" >
                                        <img src="${rsFile.url}" alt="${rsFile.nombre_archivo}" class=" ThumbImg ">
                                    </a>
                                </td>
                                <!-- td -->`;
                                _ctd++;
                                if( _ctd > 2 )
                                {
                                    _htmlFInal += `</tr>`;
                                    _ctd = 1;
                                }
                            }// for
                            _htmlFInal += `</tbody>
                            </table>`;
                        }// for
                    }// for
                
                } // i
                _htmlFInal += `</div>
                <!-- ./container -->
                <!-- ESTO CREA UNA NUEVA PAGINA 
                <div style="page-break-after:always;" ></div>-->`;
                
                /*_html += `</body></html>`;
                var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_NroReporte}-21.html`;
                fs.writeFileSync( _Archivo , _html );*/
                varDump(`Bloque 21 generado.......`);







                // * // * // * // * // * // * // * // * // * // * // * // * //
                //              *** Escribimos el archivo. ***
                // * // * // * // * // * // * // * // * // * // * // * // * //
                _htmlFInal += `
                <hr/>
                <img src="${_URL_NODE}api/file_fi21/lap/asset/footer-01" />
                <img src="${_URL_NODE}api/file_fi21/lap/asset/footer-02" />
                <hr/>
                <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js" integrity="sha512-uURl+ZXMBrF4AwGaWmEetzrd+J5/8NRkWAvJx5sbPSSuOb0bZLqf+tOzniObO00BjHa/dD7gub9oCGMLPQHtQA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
            
                <script type="text/javascript">
                $(function(){
                    $('a[href^="#"]').click(function() {
                        var destino = $(this.hash);
                        if (destino.length == 0) {
                          destino = $('a[name="' + this.hash.substr(1) + '"]');
                        }
                        if (destino.length == 0) { destino = $('html'); }
                        $('html, body').animate({ scrollTop: destino.offset().top }, 500);
                        return false;
                    });
               });
                </script>
                </body></html>`;
                var _archivoHTML = `${_RUTA_PROYECTO}adjuntos/reporte_lap/LAP-Reporte-${_dataConsulta.Codigo}.html`;
                fs.writeFileSync( _archivoHTML , _htmlFInal );
                /**/
            }
        }
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Informe generado.` };
        //
    } catch (error) {
        varDump(error);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CONVERTIR HTML A IMAGEN             //
//////////////////////////////////////////////////////////
router.post('/html_img', async (req,res)=>{
    // Detalles(,), Codigo
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        // Primero convertimos los bloques... (21)
        var _Codigo = req.body.Codigo;
        for (let index = 0; index < 22; index++) {
            //
            var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_Codigo}-${index}.html`;
            var _salida  = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_Codigo}-${index}.png`;
            //
            let contenidoHtml = fs.readFileSync( _Archivo , 'utf8' );
            await nodeHtmlToImage({
                output : _salida ,
                html   : contenidoHtml
            })
            .then(() => console.log( `Bloque-${_Codigo}-${index}` ));
            // Configuracion de PDF
            /*var options = { 
                format  : 'A4' ,
                header  : {  "height": "15mm"} ,
                footer  : { "height": "15mm"} , 
                border  : { top:'50px',bottom:'50px',left:'20px'} ,
                path    : _salida 
            };
            let file = [{ content : contenidoHtml }];
            //
            html_to_pdf.generatePdfs(file, options).then(output => {
                console.log("PDF Buffer:-", output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
            });*/
        }
        //
        var _IdS = req.body.Detalles;
		var Detalles = _IdS.split(',');
        for (let index = 0; index < Detalles.length; index++)
        {
            const IdDet = Detalles[index];
            var _Codigo = await helpersController.pad_with_zeroes( IdDet , 8 );
            _Codigo = 'DB'+_Codigo;
            var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Detalle-${_Codigo}.html`;
            var _salida  = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Detalle-${_Codigo}.png`;
            //
            let contenidoHtml = fs.readFileSync( _Archivo , 'utf8' );
            //
            await nodeHtmlToImage({
                output : _salida ,
                html   : contenidoHtml
            })
            .then(() => console.log( `Detalle-${_Codigo}.png` ));
            // Configuracion de PDF
            /*var options = { 
                format  : 'A4' ,
                header  : {  "height": "15mm"} ,
                footer  : { "height": "15mm"} , 
                border  : { top:'50px',bottom:'50px',left:'20px'} ,
                path    : _salida 
            };
            let file = [{ content : contenidoHtml }];
            //
            html_to_pdf.generatePdfs(file, options).then(output => {
                console.log("PDF Buffer:-", output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
            });*/
        }
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Finalizado.` };
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


//////////////////////////////////////////////////////////
//                  UNIR TODOS LOS PDF                    //
//////////////////////////////////////////////////////////
router.post('/unir_pdf', async (req,res)=>{
    // Detalles(,), Codigo
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        var merger = new PDFMerger();
        var _arPDF = [];
        // Primero convertimos los bloques... (21)
        var _Codigo = req.body.Codigo;
        for (let index = 0; index < 22; index++) {
            //
            var _salida  = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Bloque-${_Codigo}-${index}.pdf`;
            //
            _arPDF.push( _salida );
            //
        }
        //
        var _IdS = req.body.Detalles;
		var Detalles = _IdS.split(',');
        for (let index = 0; index < Detalles.length; index++)
        {
            const IdDet = Detalles[index];
            var _Codigo = await helpersController.pad_with_zeroes( IdDet , 8 );
            _Codigo = 'DB'+_Codigo;
            var _salida  = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Detalle-${_Codigo}.pdf`;
            //
            _arPDF.push( _salida );
            //
        }
        /**
        var _RepoOUT = `${_RUTA_PROYECTO}adjuntos/reporte_lap/LAP-Reporte-${_Codigo}.pdf`;
        for (let index = 0; index < _arPDF.length; index++) {
            const pdf = _arPDF[index];
            await (async () => {
                merger.add( pdf );
                await merger.save( _RepoOUT );
            })();
        }
        /**/
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `PDF generado.` };
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

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/html_img2', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Detalle-DB00000167.html`;
        var _salida  = `${_RUTA_PROYECTO}adjuntos/reporte_lap/Detalle-DB00000167.png`;
        var contenidoHtml = fs.readFileSync( _Archivo , 'utf8' );
        //
        await nodeHtmlToImage({
            output : _salida ,
            html   : contenidoHtml
        })
        .then(() => console.log('The image was created successfully!'));
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Generado.` };
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

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/phantom', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        phantom.create().then(function(ph) {
            ph.createPage().then(function(page) {
                var _url = `https://ssays-orquesta.com:8444/api/file_fi21/ver/lap/reporte/RL00000005`;
                _tiempo = ( 1000 * 60 ) ;
                page.open( _url ).then(function(status) {
                    setTimeout(function() {
                        page.render('google.pdf').then(function() {
                            console.log('Page Rendered');
                            ph.exit();
                        });
                    }, _tiempo );
                });
            });
        });
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Listo.` };
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

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/word1', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun("Hello World"),
                            new TextRun({
                                text: "Foo Bar",
                                bold: true,
                            }),
                            new TextRun({
                                text: "\tGithub is the best",
                                bold: true,
                            }),
                        ],
                    }),
                ],
            }],
        });
        //
        const b64string = await Packer.toBase64String(doc);
        res.setHeader('Content-Disposition', 'attachment; filename=My Document.docx');
        res.send(Buffer.from(b64string, 'base64'));
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Word Generado.` };
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
//////////////////////////////////////////////////////////
//                  COMPRIMIR REPORTE LAP                    //
//////////////////////////////////////////////////////////
router.post('/zip_word', async (req,res)=>{
    // Codigo, File
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        var zipper 	= new zip();

        var _Entidad = await reporteLapModel.findOne({
            where : {
                Codigo : req.body.Codigo
            }
        })
        .catch(function (err) {
            varDump( err );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });

        if( _Entidad )
        {
            // FIle Informe gestión Mayo-2022 >>>> [LAP-Mayo-2022]
            var txtNombre = _Entidad.Nombre;
            var _arNombre = txtNombre.split(' ');
            var _file = req.body.File ;//`LAP-`+_arNombre[2];
            var _pathFile = `${_RUTA_ORQ3}/operaciones/public/${_file}`;
            _response.origin = _pathFile;
            var ZipNombre = `Zip_${_file}.zip`;
            // Comprimir
            if ( fs.existsSync( _pathFile ) ) {
                //file exists
                zipper.addLocalFile( _pathFile );
            }else{
                varDump(`No existe doc: ${_pathFile}`);
            }
            zipper.writeZip( `${_RUTA_ORQ3}/operaciones/public/${ZipNombre}` );
		    _response.zip = ZipNombre;
            await reporteLapModel.update({
                Documento_Zip : ZipNombre
            },{
                where : {
                    id : _Entidad.id
                }
            });
        }


        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Informe descargado` };
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
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

            }
        });
    });
}
// -------------------------------------------------------------
function pad_with_zeroes(number, length)
{

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}
// -------------------------------------------------------------
async function execQuery_xls( _where , _limit  )
{
    // Obtener encabezados
    // CodigoHead
    var _dataResp = [];
    var _arAtributos = [];
    var NroCols = 0;
    //
    var _DataCab = await cargaExcelModelCab.findOne({
        where : _where
    });

    if( _DataCab )
    {
        NroCols = _DataCab.NroCols;
        _arAtributos.push( ['Indice' ,'#'] );
        for (let index = 1; index <= NroCols; index++)
        {
            var _No = await pad_with_zeroes( index , 2 );
            _arAtributos.push( [ `Col${_No}` , _DataCab[ `Cab${_No}` ] ] );
        }
        _dataResp = await cargaExcelModelDet.findAll({
            attributes : _arAtributos ,
            order : [
                ['Indice' , 'ASC']
            ],
            where : {
                CodigoHead : _DataCab.Codigo
            },
            limit : 1000
        });
    }else{
        varDump(`NO hay datos`);
    }

    return _dataResp;
    //
}
// -------------------------------------------------------------
async function dibujarSector( Flag , Codigo )
{
    var _htmlTabla = ``;
    //
    //varDump(`Buscando archivos en: ${Flag} >>>> ${Codigo}.`);
    var _dataFiles = await archiGoogleModel.findAll({
        where : {
            formulario : Flag ,
            Cod001 : Codigo
        }
    });
    try {
        //
        //varDump(`FLAG: ${Flag}, tienen ${_dataFiles.length} archivos.`);
        for (let index = 0; index < _dataFiles.length; index++)
        {
            const _rs = _dataFiles[index];
            var _rf   = _rs.extension;
            var _extension = _rf.toLowerCase();
            var NroPaginas = _rs.NroPaginas;
            varDump(`FLAG: ${Flag}, extensión: ${_extension}. >>>>>>>>>>>>> ${_rs.id}. NroPaginas: ${NroPaginas}.`);
            switch ( _extension )
            {
                case 'xlsx':
                case 'xls':
                    // + // + // + // + // + // + // + // + // + // + // + //
                    // Vamos a dibujar la tabla.
                    _htmlTabla += `<table class=" table table-hover cell-border compact hover nowrap row-border table-striped table-hover " id="Bloque-${Flag}" cellspacing="0" width="100%" style="width:100%">`;

                    var _dataXLS = await execQuery_xls( { 'IdArchivo' :_rs.id , 'CodigoHead' : Codigo } , 800  );
                    if( _dataXLS )
                    {
                        //
                        _htmlTabla += `<thead>`;
                        _htmlTabla += `<tr>`;
                        // Dibujamos primero el head...
                        var _cOuntK = 0;
                        for (let indexK = 0; indexK < _dataXLS.length; indexK++) {
                            const element = _dataXLS[indexK];
                            if( _cOuntK == 0 )
                            {
                                for ( var property in element.dataValues )
                                {
                                    _htmlTabla += `<th>${property}</th>`;
                                }
                            }
                            _cOuntK++;
                        }
                        _htmlTabla += `</tr>`;
                        _htmlTabla += `</thead>`;

                        // Ahora a dibujar el body...
                        _htmlTabla += `<tbody>`;
                        for (let index = 0; index < _dataXLS.length; index++) {
                            //
                            const _rsData = _dataXLS[index];
                            _htmlTabla += `<tr>`;
                            for ( var property in _rsData.dataValues )
                            {
                                _htmlTabla += `<td>${_rsData.dataValues[property]}</td>`;
                            }
                            _htmlTabla += `</tr>`;
                            //
                        }
                        _htmlTabla += `</tbody></table>`;
                        // 
                    }
                break;
                case 'pdf':
                    //    CONVERTIMOS LOS PDF EN IMAGENES

                    _htmlTabla += `<div class=" row " style="border: 1px silver solid;" >`;
                    for (let indF = 0; indF < NroPaginas; indF++)
                    {
                        _htmlTabla += `<div class=" col-lg-12 col-md-12 " >`;
                            var _idnice = parseInt( indF ) + 1;
                            //var _fileIMG = _RUTA_PROYECTO+'adjuntos/reporte_lap/'+'PDF_IMG_'+_rs.id+'_'+_idnice+'.png';
                            var _Archivol = 'PDF_IMG_'+_rs.id+'_'+_idnice;
                            var _fileIMG = `${_URL_NODE}api/file_fi21/lap/pdf/${_Archivol}`;
                            _htmlTabla += `<img src="${_fileIMG}" class=" img-responsive img-fluid" />`;
                        _htmlTabla += `</div>`;
                    }
                    _htmlTabla += `</div>`;
                break;
                default:
                    //
                break;
            }
        }
        //
    } catch (error) {
        varDump(`Error al generar sector reporte LAP`);
        varDump(error);
    }
        
    
    // Vamos a dibujar el PDF.

    //varDump( _htmlTabla );
    return _htmlTabla;
}
// -------------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
module.exports = router;
// -------------------------------------------------------------


