
// api_pdf.js



var _NombreDoc = 'api_pdf';
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

// PDF
const pdf = require("html-pdf");
const fs = require("fs");
const path = require('path');
var html_to_pdf = require('html-pdf-node');



// LEER EXCEL
const reader = require('xlsx');

// Modelos
const { errorLogModel } = require('../../dbA');
const { xlsLAPIncidenciasCabModel, xlsLAPIncidenciasDetModel, User, sequelize, archiGoogleModel, sucursalModel } = require('../../db');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

// Controlador
const helpersController  = require('../../controllers/helpersController');

// Rutas ENV
var _RUTA_PROYECTO = process.env.RUTA_PROYECTO;





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

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/demo01', async (req,res)=>{
    // vamos a convertir un HTML  a PDF
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];

    try {
        //
        const ubicacionPlantilla = require.resolve( _RUTA_PROYECTO+"adjuntos/demo01.html");
        //
        let contenidoHtml = fs.readFileSync( ubicacionPlantilla , 'utf8' );
        //
        const valorPasadoPorNode = "Soy un valor pasado desde JavaScript";
        //
        contenidoHtml = contenidoHtml.replace("{{valor}}", valorPasadoPorNode);
        //varDump(contenidoHtml);
        //
        var _salida   = _RUTA_PROYECTO+"adjuntos/pdf/"+'pdf-salida_'+moment().format('YYYY-MM-DD_HH-mm-ss')+'.pdf';
        //
        // Configuracion de PDF
        var options = { 
            format  : 'A4' ,
            header  : {  "height": "15mm"} ,
            footer  : { "height": "15mm"} , 
            border  : { top:'50px',bottom:'50px',left:'20px'} ,
            path    : _salida 
        };
        //
        let file = [{ content : contenidoHtml }];
        //
        html_to_pdf.generatePdfs(file, options).then(output => {
            console.log("PDF Buffer:-", output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
        });
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `PDF terminado` };
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
//                  PDF CERTIFICADO                    //
//////////////////////////////////////////////////////////
router.post('/certificado', async (req,res)=>{
    // vamos a convertir un HTML  a PDF
    // IdCert
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];

    try {
        //
        var IdCert = req.body.IdCert;
        var _Archivo = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${IdCert}.html`;
        var _ArchivoP = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${IdCert}-P.html`;
        varDump(_Archivo);
        varDump(_ArchivoP);
        // >>>>>>>>>>>>>>>
        const ubicacionPlantilla = require.resolve( _Archivo );
        //
        let contenidoHtml = fs.readFileSync( ubicacionPlantilla , 'utf8' );
        //
        var _salida = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${IdCert}.pdf`;
        // Configuracion de PDF
        let options = { 
            format  : 'A4' , 
            path    : _salida , 
        };
        //
        let file = [{ content : contenidoHtml }];
        html_to_pdf.generatePdfs(file, options).then(output => {
            console.log("PDF Buffer:-", output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
        });
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        const ubicacionPlantilla2 = require.resolve( _ArchivoP );
        //
        let contenidoHtml2 = fs.readFileSync( ubicacionPlantilla2 , 'utf8' );
        //
        var _salida = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${IdCert}-P.pdf`;
        // Configuracion de PDF
        let options2 = { 
            format  : 'A4' , 
            path    : _salida , 
        };
        //
        let file2 = [{ content : contenidoHtml2 }];
        html_to_pdf.generatePdfs( file2 , options2 ).then(output => {
            console.log("PDF Buffer:-", output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
        });
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `PDF terminado` };
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
//                  PDF CERTIFICADO                    //
//////////////////////////////////////////////////////////
router.post('/certificado/usuario', async (req,res)=>{
    // vamos a convertir un HTML  a PDF
    // IdCert
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];

    try {
        //
        var _Series = req.body.IdCert;
		var _ArCerts = _Series.split(",");
        for (let index = 0; index < _ArCerts.length; index++) {
            const IdCert = _ArCerts[index];
            var _Archivo = `${_RUTA_PROYECTO}adjuntos/certificados/C-${IdCert}.html`;
            // >>>>>>>>>>>>>>>
            const ubicacionPlantilla = require.resolve( _Archivo );
            //
            let contenidoHtml = fs.readFileSync( ubicacionPlantilla , 'utf8' );
            //
            var _salida = `${_RUTA_PROYECTO}adjuntos/certificados/C-${IdCert}.pdf`;
            // Configuracion de PDF
            let options = { 
                format  : 'A4' , 
                path    : _salida , 
            };
            //
            let file = [{ content : contenidoHtml }];
            html_to_pdf.generatePdfs( file, options ).then(output => {
                console.log("PDF Buffer:-", output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
            });
        } // For
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `PDF terminado, comprimiendo...` };
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

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/ver/certificado/:IdCert/:Flag',async(req,res)=>{
    // correr en:
    // api_files_fi21.js
    var $response = {};
    $response.estado = 'ERROR';
    var _dataFile = [];

    var _salida = ``;

    switch ( req.params.Flag ) {
        case 'U':
            // Usuario
            _salida = `${_RUTA_PROYECTO}adjuntos/certificados/C-${IdCert}.pdf`;
        break;
        case 'F':
            // Frontal 
            _salida = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${IdCert}.pdf`;
        break;
        //
        case 'P':
            // Frontal 
            _salida = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${IdCert}-P.pdf`;
        break;
        //
        case 'A':
            // HTML Frontal.
            _salida = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${IdCert}.html`;
        break;
        //
        case 'B':
            // HTML posterior.
            _salida = `${_RUTA_PROYECTO}adjuntos/certificados/Cert-${IdCert}-P.html`;
        break;
        //
        default:
        break;
    }

    varDump(`>>>>>>>>>>>>  ${_salida}.`);
    express.static(__dirname + '/public');

    res.sendFile( _salida );
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//                  PDF CERTIFICADO                    //
//////////////////////////////////////////////////////////
router.post('/lap', async (req,res)=>{
    // vamos a convertir un HTML  a PDF
    // IdRep
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];

    try {
        //
        var IdRep = req.body.IdRep;
        var _Archivo = `${_RUTA_PROYECTO}adjuntos/reporte_lap/LAP-Reporte-${IdRep}.html`;
        varDump(_Archivo);
        // >>>>>>>>>>>>>>>
        const ubicacionPlantilla = require.resolve( _Archivo );
        //
        let contenidoHtml = fs.readFileSync( ubicacionPlantilla , 'utf8' );
        //
        var _salida = `${_RUTA_PROYECTO}adjuntos/reporte_lap/LAP-Reporte-${IdRep}.pdf`;
        // Configuracion de PDF
        let options = { 
            format  : 'A4' , 
            path    : _salida , 
        };
        //
        let file = [{ content : contenidoHtml }];
        html_to_pdf.generatePdfs(file, options).then(output => {
            console.log("PDF Buffer:-", output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
        });
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `PDF terminado` };
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
//       PDF FICHA TÉCNICA DE EJECUCIÓN DE SERVICIO     //
//////////////////////////////////////////////////////////
router.post('/pdf_fo52', async (req,res)=>{
    // vamos a convertir un HTML  a PDF
    // Codigo
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];

    try {
        //
        var Codigo = req.body.Codigo;
        var _Archivo = `${_RUTA_PROYECTO}adjuntos/html/FTES_${Codigo}.html`;
        varDump(_Archivo);
        // >>>>>>>>>>>>>>>
        const ubicacionPlantilla = require.resolve( _Archivo );
        //
        let contenidoHtml = fs.readFileSync( ubicacionPlantilla , 'utf8' );
        //
        var _salida = `${_RUTA_PROYECTO}adjuntos/app-tecnicos/FTES_${Codigo}.pdf`;
        // Configuracion de PDF
        let options = { 
            format  : 'A4' , 
            path    : _salida , 
        };
        //
        let file = [{ content : contenidoHtml }];
        html_to_pdf.generatePdfs(file, options).then(output => {
            console.log("PDF Buffer:-", output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
        });
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `PDF terminado` };
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
// -------------------------------------------------------------
// -------------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
module.exports = router;
// -------------------------------------------------------------

