// api_docVentas.js

var _NombreDoc = 'api_docVentas';
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


// Archivos | 36826
const fs = require('fs');

// Strip tags
var striptags = require('striptags');


// Ejecutar un php
var execPhp = require('exec-php');
var http = require('http');


// Leer un XML
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

// XML
const _RUTA_XML = process.env.RUTA_XML;
const _SOAP_URL = process.env.SOAP_URL;
const _SOAP_USER = process.env.SOAP_USER;
const _SOAP_PASSWD = process.env.SOAP_PASSWD;


// Modelos
const { errorLogModel } = require('../../dbA');
const { OSModel,conjuntoOSModel, otModel, docVentasCab231, docVentasDet231 } = require('../../db31');
const { docVentasCab, User, docVentasDet,resumenBoletasDetModel,resumenBoletasCabModel, resumenFacturasCabModel, resumenFacturasDetModel, docVentaCuotaModel, resumenNotasCabModel, resumenNotasDetModel } = require('../../db');



// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
resumenBoletasDetModel.belongsTo( docVentasCab ,{
	as : 'DetBol2', foreignKey 	: 'IdDocAsoc',targetKey: 'id',
});
conjuntoOSModel.belongsTo( OSModel ,{
	as : 'COS01', foreignKey 	: 'IdOS', targetKey: 'IdOS',
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>







//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // corr, cli, inic, fin, estadodoc, estadoprov, Facturador, Resumen, hes, oc, TipoDoc
    var $response    = {};
    $response.estado = 'OK';
    $response.data   = [];
    var $where       = {};

    if( req.body.corr != '' ){
        var $ids = req.body.corr, arrCorrs = [];
		var $arIds = $ids.split(',');
        for (let index = 0; index < $arIds.length; index++) {
            const rs = $arIds[index];
            var _Codigo = await pad_with_zeroes( rs , 8 );
            arrCorrs.push( _Codigo );
        }
        //
        $response.data = await docVentasCab.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where: {
		        Correlativo : { [Op.in] : arrCorrs }
		    },
        });
        //
    }else{
        // Buscamos por fecha emisión
        $where.FechaEmision = { [Op.gte ]: req.body.inic,[Op.lte ]: req.body.fin };
        // TipoDoc
        if( req.body.TipoDoc )
        {
            $where.TipoDoc = req.body.TipoDoc;
        }
        // Por cliente
        if( req.body.cli )
        {
            $where.IdCliente = req.body.cli;
        }
        // Por estado docuento
        if( req.body.estadodoc )
        {
            $where.Estado = req.body.estadodoc;
        }
        // Por estado bizlinks
        if( req.body.EstadoBznlk )
        {
            $where.EstadoBznlk = req.body.EstadoBznlk;
        }
        // Facturador
        if( req.body.Facturador ){
            $where.IdUsuarioMod = req.body.Facturador;
        }
        //  Resumen
        if( req.body.Resumen ){
            $where.IdResumenBaja = req.body.Resumen;
        }
        //  HES
        if( req.body.hes ){
            $where.NroHES = req.body.hes;
        }
        //  OC
        if( req.body.oc ){
            $where.OrdenCompra = req.body.oc;
        }
        varDump($where);
        $response.data = await docVentasCab.findAll({
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
//                BUSCAR EN VTA ACUMULADA               //
//////////////////////////////////////////////////////////
router.post('/buscar_vta_acumulada', async (req,res)=>{
    // corr, cli, inic, fin, estadodoc, estadoprov, Facturador, Resumen, hes, oc, TipoDoc
    var $response    = {};
    $response.estado = 'OK';
    $response.data   = [];
    var $where       = {};

    if( req.body.corr != '' ){
        var $ids = req.body.corr, arrCorrs = [];
		var $arIds = $ids.split(',');
        for (let index = 0; index < $arIds.length; index++) {
            const rs = $arIds[index];
            var _Codigo = await pad_with_zeroes( rs , 8 );
            arrCorrs.push( _Codigo );
        }
        //
        $response.data = await docVentasCab.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where: {
		        Correlativo : { [Op.in] : arrCorrs }
		    },
        });
        //
    }else{
        // Buscamos por fecha emisión
        $where.FechaEmision = { [Op.gte ]: req.body.inic,[Op.lte ]: req.body.fin };
        // TipoDoc
        if( req.body.TipoDoc )
        {
            $where.TipoDoc = req.body.TipoDoc;
        }
        // Por cliente
        if( req.body.cli )
        {
            $where.IdCliente = req.body.cli;
        }
        // Por estado docuento
        if( req.body.estadodoc )
        {
            $where.Estado = req.body.estadodoc;
        }
        // Por estado bizlinks
        if( req.body.estadoprov )
        {
            $where.EstadoBznlk = req.body.estadoprov;
        }
        // Facturador
        if( req.body.Facturador ){
            $where.IdUsuarioMod = req.body.Facturador;
        }
        //  Resumen
        if( req.body.Resumen ){
            $where.IdResumenBaja = req.body.Resumen;
        }
        //  HES
        if( req.body.hes ){
            $where.NroHES = req.body.hes;
        }
        //  OC
        if( req.body.oc ){
            $where.OrdenCompra = req.body.oc;
        }
        varDump($where);
        $response.data = await docVentasCab.findAll({
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
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await docVentasCab.findAll({
        order : [
            ['Codigo' , 'DESC']
        ],
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR ANULADOS                     //
//////////////////////////////////////////////////////////
router.post('/insert/boletas/anulados', async (req,res)=>{
    // Vamos a insertar el resumen de boletas anualdas
    // Fecha, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _where = {
        TipoDoc : 'B' ,
        Estado  : 'Anulado',
        FechaEmision  : req.body.Fecha,
        IdResumenBaja : { [Op.is]: null }
    };
    //varDump( _where );

    var _DocsData = await docVentasCab.findAll({
        where : _where
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage; res.json( $response );
    });

    if( _DocsData )
    {
        for (let index = 0; index < _DocsData.length; index++) {
            const rs = _DocsData[index];
            var _InsertData = {};
            _InsertData.uu_id       = await renovarToken();
            _InsertData.ResumenId   = 0;
            _InsertData.NumeroFila  = index+1;
            _InsertData.TipoDocumento   = '03';// Formato: n(2), validar catálogo 01
            _InsertData.TipoMoneda      = 'PEN';
            _InsertData.NumeroCorrelativo = `${rs.Serie}-${rs.Correlativo}`;
            _InsertData.Serie       = rs.Serie;
            _InsertData.Correlativo = rs.Correlativo;
            _InsertData.MotivoBaja  = rs.MotivoAn;
            _InsertData.TipoDocumentoAdquiriente = '6';
            _InsertData.NumeroDocumentoAdquiriente = rs.IdCliente;
            _InsertData.EstadoItem = 1;
            _InsertData.TotalValorVentaOpGravadaConIgv  = await decimalString( rs.SubTotal_Doc );
            _InsertData.TotalValorVentaOpExoneradasIgv  = await decimalString(0);
            _InsertData.TotalValorVentaOpInafectasIgv   = await decimalString(0);
            _InsertData.TotalIsc    = await decimalString(0);
            _InsertData.TotalIgv    = await decimalString( rs.IGV_Doc );
            _InsertData.TotalVenta  = await decimalString( rs.Total_Doc );
            _InsertData.TotalOtrosCargos = await decimalString(0);
            _InsertData.Token                = req.body.Token;
            _InsertData.RUCDocumento         = rs.IdCliente;
            _InsertData.FechaDocumento       = rs.FechaEmision;
            _InsertData.RazonSocialDocumento = rs.Cliente;
            _InsertData.IdDocAsoc            = rs.id;
            _InsertData.IdFacturador    = rs.IdUsuarioMod;
            _InsertData.Facturador      = rs.UsuarioMod;
            await resumenBoletasDetModel.create( _InsertData );
        }
    }
    // Devolvemos los insertado
    $response.data = await resumenBoletasDetModel.findAll({
        where : {
            Token : req.body.Token
        },
        include: [{
            model: docVentasCab,
            as: 'DetBol2'
        }]
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage; res.json( $response );
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR ANULADOS                     //
//////////////////////////////////////////////////////////
router.post('/insert/boletas/aprobados', async (req,res)=>{
    // Vamos a insertar el resumen de boletas anualdas
    // Fecha, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _where = {
        TipoDoc : 'B' ,
        Estado  : 'Aprobado',
        EstadoBznlk : 'SIGNED',
        FechaEmision  : req.body.Fecha,
        IdResumenAlta : { [Op.is]: null }
    };
    varDump( _where );

    var _DocsData = await docVentasCab.findAll({
        where : _where
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage; res.json( $response );
    });

    if( _DocsData )
    {
        for (let index = 0; index < _DocsData.length; index++) {
            const rs = _DocsData[index];
            var _InsertData = {};
            _InsertData.uu_id           = await renovarToken();
            _InsertData.ResumenId       = 0;
            _InsertData.NumeroFila      = index+1;
            _InsertData.TipoMoneda      = 'PEN';
            _InsertData.NumeroCorrelativo = `${rs.Serie}-${rs.Correlativo}`;
            _InsertData.Serie           = rs.Serie;
            _InsertData.Correlativo     = rs.Correlativo;

            // RUC = 06, DNI = 01
            var _TipoDocAdqui = '1';
            var _IdCliente = await pad_with_zeroes( rs.IdCliente , 8 );
            if( rs.IdCliente > 99999999 ){
                _IdCliente = await pad_with_zeroes( rs.IdCliente , 11 );
                _TipoDocAdqui = '6';
            }
            _InsertData.NumeroDocumentoAdquiriente = rs.IdCliente;
            _InsertData.TipoDocumentoAdquiriente = _TipoDocAdqui; // Formato: n(1), validar catálogo 01
            _InsertData.TipoDocumento   = '03';

            _InsertData.EstadoItem = 1;
            _InsertData.TotalValorVentaOpGravadaConIgv  = await decimalString( rs.SubTotal_Doc );
            _InsertData.TotalValorVentaOpExoneradasIgv  = await decimalString(0);
            _InsertData.TotalValorVentaOpInafectasIgv   = await decimalString(0);
            _InsertData.TotalIsc    = await decimalString(0);
            _InsertData.TotalIgv    = await decimalString( rs.IGV_Doc );
            _InsertData.TotalVenta  = await decimalString( rs.Total_Doc );
            _InsertData.TotalOtrosCargos = await decimalString(0);
            _InsertData.Token                = req.body.Token;
            _InsertData.RUCDocumento         = rs.IdCliente;
            _InsertData.FechaDocumento       = rs.FechaEmision;
            _InsertData.RazonSocialDocumento = rs.Cliente;
            _InsertData.IdDocAsoc            = rs.id;
            _InsertData.IdFacturador    = rs.IdUsuarioMod;
            _InsertData.Facturador      = rs.UsuarioMod;
            await resumenBoletasDetModel.create( _InsertData );
        }
    }
    // Devolvemos los insertado
    $response.data = await resumenBoletasDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage; res.json( $response );
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//             CARGAR ANULADOS  FACTURAS                //
//////////////////////////////////////////////////////////
router.post('/insert/facturas/anulados', async (req,res)=>{
    // Vamos a insertar el resumen de boletas anualdas
    // Fecha, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _where = {
        TipoDoc : 'F' ,
        Estado  : 'Anulado',
        FechaEmision  : req.body.Fecha,
        IdResumenBaja : { [Op.is]: null } ,
        EstadoBznlk   : 'SIGNED'
    };
    //varDump( _where );

    var _DocsData = await docVentasCab.findAll({
        where : _where
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage; res.json( $response );
    });

    if( _DocsData )
    {
        for (let index = 0; index < _DocsData.length; index++) {
            const rs = _DocsData[index];
            var _InsertData = {};
            _InsertData.uu_id       = await renovarToken();
            _InsertData.ResumenId   = 0;
            _InsertData.NumeroFila  = index+1;
            _InsertData.TipoDocumento   = '01'; // Formato: n(2), validar catálogo 01
            _InsertData.TipoMoneda      = 'PEN';
            _InsertData.NumeroCorrelativo = `${rs.Serie}-${rs.Correlativo}`;
            _InsertData.Serie       = rs.Serie;
            _InsertData.Correlativo = rs.Correlativo;
            _InsertData.MotivoBaja  = rs.MotivoAn;
            _InsertData.TipoDocumentoAdquiriente = '6';
            _InsertData.NumeroDocumentoAdquiriente = rs.IdCliente;
            _InsertData.EstadoItem = 1;
            _InsertData.TotalValorVentaOpGravadaConIgv  = await decimalString( rs.SubTotal_Doc );
            _InsertData.TotalValorVentaOpExoneradasIgv  = await decimalString(0);
            _InsertData.TotalValorVentaOpInafectasIgv   = await decimalString(0);
            _InsertData.TotalIsc    = await decimalString(0);
            _InsertData.TotalIgv    = await decimalString( rs.IGV_Doc );
            _InsertData.TotalVenta  = await decimalString( rs.Total_Doc );
            _InsertData.TotalOtrosCargos = await decimalString(0);
            _InsertData.Token                = req.body.Token;
            _InsertData.RUCDocumento         = rs.IdCliente;
            _InsertData.FechaDocumento       = rs.FechaEmision;
            _InsertData.RazonSocialDocumento = rs.Cliente;
            _InsertData.IdDocAsoc       = rs.id;
            _InsertData.IdFacturador    = rs.IdUsuarioMod;
            _InsertData.Facturador      = rs.UsuarioMod;
            await resumenFacturasDetModel.create( _InsertData );
        }
    }
    // Devolvemos los insertado
    $response.data = await resumenFacturasDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage; res.json( $response );
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//            CARGAR ANULADOS NOTA CREDITO              //
//////////////////////////////////////////////////////////
router.post('/insert/nc/anulados', async (req,res)=>{
    // Vamos a insertar el resumen de boletas anualdas
    // Fecha, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _where = {
        TipoDoc : 'NC' ,
        Estado  : 'Anulado',
        FechaEmision  : req.body.Fecha,
        IdResumenBaja : { [Op.is]: null } ,
        EstadoBznlk   : 'SIGNED'
    };
    //varDump( _where );

    var _DocsData = await docVentasCab.findAll({
        where : _where
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage; res.json( $response );
    });

    if( _DocsData )
    {
        for (let index = 0; index < _DocsData.length; index++) {
            const rs = _DocsData[index];
            var _InsertData = {};
            _InsertData.uu_id       = await renovarToken();
            _InsertData.ResumenId   = 0;
            _InsertData.NumeroFila  = index+1;
            _InsertData.TipoDocumento   = '07'; // Formato: n(2), validar catálogo 01
            _InsertData.TipoMoneda      = 'PEN';
            _InsertData.NumeroCorrelativo = `${rs.Serie}-${rs.Correlativo}`;
            _InsertData.Serie       = rs.Serie;
            _InsertData.Correlativo = rs.Correlativo;
            _InsertData.MotivoBaja  = rs.MotivoAn;
            _InsertData.TipoDocumentoAdquiriente = '6';
            _InsertData.NumeroDocumentoAdquiriente = rs.IdCliente;
            _InsertData.EstadoItem = 1;
            _InsertData.TotalValorVentaOpGravadaConIgv  = await decimalString( rs.SubTotal_Doc );
            _InsertData.TotalValorVentaOpExoneradasIgv  = await decimalString(0);
            _InsertData.TotalValorVentaOpInafectasIgv   = await decimalString(0);
            _InsertData.TotalIsc    = await decimalString(0);
            _InsertData.TotalIgv    = await decimalString( rs.IGV_Doc );
            _InsertData.TotalVenta  = await decimalString( rs.Total_Doc );
            _InsertData.TotalOtrosCargos = await decimalString(0);
            _InsertData.Token                = req.body.Token;
            _InsertData.RUCDocumento         = rs.IdCliente;
            _InsertData.FechaDocumento       = rs.FechaEmision;
            _InsertData.RazonSocialDocumento = rs.Cliente;
            _InsertData.IdDocAsoc       = rs.id;
            _InsertData.IdFacturador    = rs.IdUsuarioMod;
            _InsertData.Facturador      = rs.UsuarioMod;
            await resumenNotasDetModel.create( _InsertData );
        }
    }
    // Devolvemos los insertado
    $response.data = await resumenNotasDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log( err.original );
        console.log(_NombreDoc);
        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage; res.json( $response );
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//            CARGAR ANULADOS NOTA CREDITO              //
//////////////////////////////////////////////////////////
router.post('/insert/nc/aprobados/b', async (req,res)=>{
    // Vamos a insertar el resumen de boletas anualdas
    // Fecha, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _where = {
        TipoDoc : 'NC' ,
        Estado  : 'Aprobado',
        Serie   : 'B001',
        FechaEmision  : req.body.Fecha,
        IdResumenAlta : { [Op.is]: null } ,
        //EstadoBznlk   : 'SIGNED'
    };
    //varDump( _where );

    var _DocsData = await docVentasCab.findAll({
        where : _where
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage; res.json( $response );
    });

    if( _DocsData )
    {
        for (let index = 0; index < _DocsData.length; index++) {
            const rs = _DocsData[index];
            var _InsertData = {};
            _InsertData.uu_id       = await renovarToken();
            _InsertData.ResumenId   = 0;
            _InsertData.NumeroFila  = index+1;
            _InsertData.TipoDocumento   = '07'; // Formato: n(2), validar catálogo 01
            _InsertData.TipoMoneda      = 'PEN';
            _InsertData.NumeroCorrelativo = `${rs.Serie}-${rs.Correlativo}`;
            _InsertData.Serie       = rs.Serie;
            _InsertData.Correlativo = rs.Correlativo;
            _InsertData.MotivoBaja  = rs.MotivoAn;
            var _IdCliente = parseInt( rs.IdCliente );
            if( _IdCliente > 99999999 ){
                _InsertData.TipoDocumentoAdquiriente = '6';
            }else{
                _InsertData.TipoDocumentoAdquiriente = '1';
            }
            _InsertData.NumeroDocumentoAdquiriente = rs.IdCliente;
            _InsertData.EstadoItem = 1;
            _InsertData.TotalValorVentaOpGravadaConIgv  = await decimalString( rs.SubTotal_Doc );
            _InsertData.TotalValorVentaOpExoneradasIgv  = await decimalString(0);
            _InsertData.TotalValorVentaOpInafectasIgv   = await decimalString(0);
            _InsertData.TotalIsc    = await decimalString(0);
            _InsertData.TotalIgv    = await decimalString( rs.IGV_Doc );
            _InsertData.TotalVenta  = await decimalString( rs.Total_Doc );
            _InsertData.TotalOtrosCargos = await decimalString(0);
            _InsertData.Token                = req.body.Token;
            _InsertData.RUCDocumento         = rs.IdCliente;
            _InsertData.FechaDocumento       = rs.FechaEmision;
            _InsertData.RazonSocialDocumento = rs.Cliente;
            _InsertData.IdDocAsoc       = rs.id;
            _InsertData.IdFacturador    = rs.IdUsuarioMod;
            _InsertData.Facturador      = rs.UsuarioMod;
            await resumenNotasDetModel.create( _InsertData );
        }
    }
    // Devolvemos los insertado
    $response.data = await resumenNotasDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log( err.original );
        console.log(_NombreDoc);
        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage; res.json( $response );
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//            CARGAR ANULADOS NOTA DEBITO              //
//////////////////////////////////////////////////////////
router.post('/insert/nd/anulados', async (req,res)=>{
    // Vamos a insertar el resumen de NOtas de debito anualdas
    // Fecha, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _where = {
        TipoDoc : 'ND' ,
        Estado  : 'Anulado',
        FechaEmision  : req.body.Fecha,
        IdResumenBaja : { [Op.is]: null } ,
        EstadoBznlk   : 'SIGNED'
    };
    //varDump( _where );

    var _DocsData = await docVentasCab.findAll({
        where : _where
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage; res.json( $response );
    });

    if( _DocsData )
    {
        for (let index = 0; index < _DocsData.length; index++) {
            const rs = _DocsData[index];
            var _InsertData = {};
            _InsertData.uu_id       = await renovarToken();
            _InsertData.ResumenId   = 0;
            _InsertData.NumeroFila  = index+1;
            _InsertData.TipoDocumento   = '08'; // Formato: n(2), validar catálogo 01
            _InsertData.TipoMoneda      = 'PEN';
            _InsertData.NumeroCorrelativo = `${rs.Serie}-${rs.Correlativo}`;
            _InsertData.Serie       = rs.Serie;
            _InsertData.Correlativo = rs.Correlativo;
            _InsertData.MotivoBaja  = rs.MotivoAn;
            _InsertData.TipoDocumentoAdquiriente = '6';
            _InsertData.NumeroDocumentoAdquiriente = rs.IdCliente;
            _InsertData.EstadoItem = 1;
            _InsertData.TotalValorVentaOpGravadaConIgv  = await decimalString( rs.SubTotal_Doc );
            _InsertData.TotalValorVentaOpExoneradasIgv  = await decimalString(0);
            _InsertData.TotalValorVentaOpInafectasIgv   = await decimalString(0);
            _InsertData.TotalIsc    = await decimalString(0);
            _InsertData.TotalIgv    = await decimalString( rs.IGV_Doc );
            _InsertData.TotalVenta  = await decimalString( rs.Total_Doc );
            _InsertData.TotalOtrosCargos = await decimalString(0);
            _InsertData.Token                = req.body.Token;
            _InsertData.RUCDocumento         = rs.IdCliente;
            _InsertData.FechaDocumento       = rs.FechaEmision;
            _InsertData.RazonSocialDocumento = rs.Cliente;
            _InsertData.IdDocAsoc       = rs.id;
            _InsertData.IdFacturador    = rs.IdUsuarioMod;
            _InsertData.Facturador      = rs.UsuarioMod;
            await resumenNotasDetModel.create( _InsertData );
        }
    }
    // Devolvemos los insertado
    $response.data = await resumenNotasDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log( err.original );
        console.log(_NombreDoc);
        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage; res.json( $response );
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//           CARGAR DOCUMENTO PARA ND (ORQ3)            //
//////////////////////////////////////////////////////////
router.post('/getdoc/nd', async (req,res)=>{
    // tipo, serie, corr, token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [], $response.detalle = [];
    var _Corr = await pad_with_zeroes( req.body.corr , 8 );
    var _whereCab = {
        TipoDoc : req.body.tipo ,
            Serie   : req.body.serie ,
            Correlativo : _Corr ,
            Estado      : 'Aprobado'
    };
    varDump(_whereCab);
    var _Entidad = await docVentasCab.findOne({
        where : _whereCab
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _Entidad;
    if( _Entidad )
    {
        var _Detalle = await docVentasDet.findAll({
            where : {
                CodigoHead : _Entidad.Codigo
            }
        });
        $response.detalle = _Detalle;
        var _Cant = 1;
        // Creamos un item en blanco para colocar el motivo.
        var _InsertDet = {
            Descripcion : `ND a documento: ${req.body.tipo} ${req.body.serie}-${_Corr}`,
            uu_id    : await renovarToken(),
            Token    : req.body.token ,
            Cantidad : 1 ,
            TipoDoc     : req.body.tipo ,
            Serie       : req.body.serie ,
            Correlativo : _Corr ,
            CodigoProducto : 84121503 ,
            CodigoProductoSUNAT : 84000000 ,
            PrecioUnit : 0,//_Entidad.Total_Doc ,
            Total      : 0,//_Entidad.Total_Doc ,
            ValorUnit  : 0,//_Entidad.SubTotal_Doc ,
            IgvUnit    : 0,//_Entidad.IGV_Doc ,

            ImporteTotalSinImpuesto    :  0,//_Entidad.SubTotal_Doc ,
            ImporteUnitarioSinImpuesto :  0,//_Entidad.SubTotal_Doc / _Cant ,
            ImporteUnitarioConImpuesto :  0,//_Entidad.Total_Doc ,
            ImporteTotalImpuestos      :  0,//_Entidad.IGV_Doc ,
            MontoBaseIgv : 0,//_Entidad.SubTotal_Doc ,
            ImporteIgv   : 0,//_Entidad.IGV_Doc 
        };
        await docVentasDet.create(_InsertDet)
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        var _Items = await docVentasDet.findAll({
            where : {
                Token : req.body.token
            }
        });
        $response.items = _Items;
    }
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//           CARGAR DOCUMENTO PARA ND (ORQ2)            //
//////////////////////////////////////////////////////////
router.post('/getdoc/nd2', async (req,res)=>{
    // TRAER DOC PARA NC DESDE ORQUESTA 2.0
    // tipo, serie, corr, token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [], $response.detalle = [];
    var _Entidad = await docVentasCab231.findOne({
        where : {
            TipoDocumento : req.body.tipo ,
            Correlativo   : req.body.corr ,
            Serie  : req.body.serie ,
            Estado : 'Aprobado'
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _Entidad;
    if( _Entidad )
    {
        var _Detalle = await docVentasDet231.findAll({
            where : {
                TipoDocumento : req.body.tipo ,
                Serie         : req.body.serie ,
                Correlativo   : req.body.corr ,
            }
        })
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        $response.detalle = _Detalle;
        var _Cant = 1;
        // Creamos un item en blanco para colocar el motivo. id
        var _InsertDet = {
            Descripcion : `ND a documento: ${req.body.tipo} ${req.body.serie}-${req.body.corr}`,
            uu_id    : await renovarToken(),
            Token    : req.body.token ,
            Cantidad : 1 ,
            TipoDoc     : req.body.tipo ,
            Serie       : req.body.serie ,
            Correlativo : req.body.corr ,
            CodigoProducto : 84121503 ,
            CodigoProductoSUNAT : 84000000 ,
            PrecioUnit : 0,//_Entidad.Total_Doc ,
            Total      : 0,//_Entidad.Total_Doc ,
            ValorUnit  : 0,//_Entidad.SubTotal_Doc ,
            IgvUnit    : 0,//_Entidad.IGV_Doc ,

            ImporteTotalSinImpuesto    :  0,//_Entidad.SubTotal_Doc ,
            ImporteUnitarioSinImpuesto :  0,//_Entidad.SubTotal_Doc / _Cant ,
            ImporteUnitarioConImpuesto :  0,//_Entidad.Total_Doc ,
            ImporteTotalImpuestos      :  0,//_Entidad.IGV_Doc ,
            MontoBaseIgv : 0,//_Entidad.SubTotal_Doc ,
            ImporteIgv   : 0,//_Entidad.IGV_Doc 
        };
        await docVentasDet.create(_InsertDet)
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        var _Items = await docVentasDet.findAll({
            where : {
                Token : req.body.token
            }
        });
        $response.items = _Items;
    }
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//           CARGAR DOCUMENTO PARA NC (ORQ3)            //
//////////////////////////////////////////////////////////
router.post('/getdoc/nc', async (req,res)=>{
    // tipo, serie, corr, token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [], $response.detalle = [];
    var _Corr = await pad_with_zeroes( req.body.corr , 8 );
    var _whereCab = {
        TipoDoc : req.body.tipo ,
        Serie   : req.body.serie ,
        Correlativo : _Corr ,
        Estado      : 'Aprobado'
    };
    varDump(_whereCab);
    var _Entidad = await docVentasCab.findOne({
        where : _whereCab
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _Entidad;
    if( _Entidad )
    {
        var _Detalle = await docVentasDet.findAll({
            where : {
                CodigoHead : _Entidad.Codigo
            }
        });
        $response.detalle = _Detalle;
        var _Cant = 1;
        // Creamos un item en blanco para colocar el motivo.
        var _InsertDet = {
            Descripcion : `NC a documento: ${req.body.tipo} ${req.body.serie}-${_Corr}`,
            uu_id    : await renovarToken(),
            Token    : req.body.token ,
            Cantidad : 1 ,
            TipoDoc     : req.body.tipo ,
            Serie       : req.body.serie ,
            Correlativo : _Corr ,
            CodigoProducto : 84121503 ,
            CodigoProductoSUNAT : 84000000 ,
            PrecioUnit : 0,//_Entidad.Total_Doc ,
            Total      : 0,//_Entidad.Total_Doc ,
            ValorUnit  : 0,//_Entidad.SubTotal_Doc ,
            IgvUnit    : 0,//_Entidad.IGV_Doc ,

            ImporteTotalSinImpuesto    :  0,//_Entidad.SubTotal_Doc ,
            ImporteUnitarioSinImpuesto :  0,//_Entidad.SubTotal_Doc / _Cant ,
            ImporteUnitarioConImpuesto :  0,//_Entidad.Total_Doc ,
            ImporteTotalImpuestos      :  0,//_Entidad.IGV_Doc ,
            MontoBaseIgv : 0,//_Entidad.SubTotal_Doc ,
            ImporteIgv   : 0,//_Entidad.IGV_Doc 
        };
        await docVentasDet.create(_InsertDet)
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        var _Items = await docVentasDet.findAll({
            where : {
                Token : req.body.token
            }
        });
        $response.items = _Items;
        // Insertamos las cuotas del documento de referencia en la NC, porsiaca elige la opción NC 13
        var _dataCuotasO = await docVentaCuotaModel.findAll({
            where : {
                CodigoHead : _Entidad.Codigo
            }
        });
        if( _dataCuotasO )
        {
            for (let index = 0; index < _dataCuotasO.length; index++)
            {
                const rs = _dataCuotasO[index];
                //
                var _insertCuota = {
                    uu_id       : await renovarToken() ,
                    CodigoHead  : 0 ,
                    NroCuota    : rs.NroCuota ,
                    MontoPagoCuota : rs.MontoPagoCuota ,
                    FechaPagoCuota : rs.FechaPagoCuota ,
                    Pendiente      : rs.Pendiente ,
                    Token          : req.body.token
                };
                await docVentaCuotaModel.create( _insertCuota );
                //
            }
        }
    }
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//    CARGAR DOCUMENTO PARA NC (ORQ3) SERIE B, BOLETAS  //
//////////////////////////////////////////////////////////
router.post('/getdoc/nc/serieb', async (req,res)=>{
    // tipo, serie, corr, token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [], $response.detalle = [];
    var _Corr = await pad_with_zeroes( req.body.corr , 8 );
    var _whereCab = {
        TipoDoc : req.body.tipo ,
        Serie   : req.body.serie ,
        Correlativo : _Corr ,
        Estado      : 'Aprobado'
    };
    varDump(_whereCab);
    var _Entidad = await docVentasCab.findOne({
        where : _whereCab
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _Entidad;
    if( _Entidad )
    {
        var _Detalle = await docVentasDet.findAll({
            where : {
                CodigoHead : _Entidad.Codigo
            }
        });
        $response.detalle = _Detalle;
        var _Cant = 1;
        // Creamos un item en blanco para colocar el motivo.
        var _InsertDet = {
            Descripcion : `NC a documento: ${req.body.tipo} ${req.body.serie}-${_Corr}`,
            uu_id    : await renovarToken(),
            Token    : req.body.token ,
            Cantidad : 1 ,
            TipoDoc     : req.body.tipo ,
            Serie       : req.body.serie ,
            Correlativo : _Corr ,
            CodigoProducto : 84121503 ,
            CodigoProductoSUNAT : 84000000 ,
            PrecioUnit : 0,//_Entidad.Total_Doc ,
            Total      : 0,//_Entidad.Total_Doc ,
            ValorUnit  : 0,//_Entidad.SubTotal_Doc ,
            IgvUnit    : 0,//_Entidad.IGV_Doc ,

            ImporteTotalSinImpuesto    :  0,//_Entidad.SubTotal_Doc ,
            ImporteUnitarioSinImpuesto :  0,//_Entidad.SubTotal_Doc / _Cant ,
            ImporteUnitarioConImpuesto :  0,//_Entidad.Total_Doc ,
            ImporteTotalImpuestos      :  0,//_Entidad.IGV_Doc ,
            MontoBaseIgv : 0,//_Entidad.SubTotal_Doc ,
            ImporteIgv   : 0,//_Entidad.IGV_Doc 
        };
        await docVentasDet.create(_InsertDet)
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        var _Items = await docVentasDet.findAll({
            where : {
                Token : req.body.token
            }
        });
        $response.items = _Items;
        // Insertamos las cuotas del documento de referencia en la NC, porsiaca elige la opción NC 13
        var _dataCuotasO = await docVentaCuotaModel.findAll({
            where : {
                CodigoHead : _Entidad.Codigo
            }
        });
        if( _dataCuotasO )
        {
            for (let index = 0; index < _dataCuotasO.length; index++)
            {
                const rs = _dataCuotasO[index];
                //
                var _insertCuota = {
                    uu_id       : await renovarToken() ,
                    CodigoHead  : 0 ,
                    NroCuota    : rs.NroCuota ,
                    MontoPagoCuota : rs.MontoPagoCuota ,
                    FechaPagoCuota : rs.FechaPagoCuota ,
                    Pendiente      : rs.Pendiente ,
                    Token          : req.body.token
                };
                await docVentaCuotaModel.create( _insertCuota );
                //
            }
        }
    }
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//           CARGAR DOCUMENTO PARA NC (ORQ2)            //
//////////////////////////////////////////////////////////
router.post('/getdoc/nc2', async (req,res)=>{
    // TRAER DOC PARA NC DESDE ORQUESTA 2.0
    // tipo, serie, corr, token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [], $response.detalle = [];
    var _Entidad = await docVentasCab231.findOne({
        where : {
            TipoDocumento : req.body.tipo ,
            Correlativo   : req.body.corr ,
            Serie  : req.body.serie ,
            Estado : 'Aprobado'
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _Entidad;
    if( _Entidad )
    {
        var _Detalle = await docVentasDet231.findAll({
            where : {
                TipoDocumento : req.body.tipo ,
                Serie         : req.body.serie ,
                Correlativo   : req.body.corr ,
            }
        })
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        $response.detalle = _Detalle;
        var _Cant = 1;
        // Creamos un item en blanco para colocar el motivo. id
        var _InsertDet = {
            Descripcion : `NC a documento: ${req.body.tipo} ${req.body.serie}-${req.body.corr}`,
            uu_id    : await renovarToken(),
            Token    : req.body.token ,
            Cantidad : 1 ,
            TipoDoc     : req.body.tipo ,
            Serie       : req.body.serie ,
            Correlativo : req.body.corr ,
            CodigoProducto : 84121503 ,
            CodigoProductoSUNAT : 84000000 ,
            PrecioUnit : 0,//_Entidad.Total_Doc ,
            Total      : 0,//_Entidad.Total_Doc ,
            ValorUnit  : 0,//_Entidad.SubTotal_Doc ,
            IgvUnit    : 0,//_Entidad.IGV_Doc ,

            ImporteTotalSinImpuesto    :  0,//_Entidad.SubTotal_Doc ,
            ImporteUnitarioSinImpuesto :  0,//_Entidad.SubTotal_Doc / _Cant ,
            ImporteUnitarioConImpuesto :  0,//_Entidad.Total_Doc ,
            ImporteTotalImpuestos      :  0,//_Entidad.IGV_Doc ,
            MontoBaseIgv : 0,//_Entidad.SubTotal_Doc ,
            ImporteIgv   : 0,//_Entidad.IGV_Doc 
        };
        await docVentasDet.create(_InsertDet)
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        var _Items = await docVentasDet.findAll({
            where : {
                Token : req.body.token
            }
        });
        $response.items = _Items;
    }
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/get_doc_ventas', async (req,res)=>{
    // tipo, serie, corr
    var $response = {};
    $response.estado = 'OK';
    $response.data = [], $response.detalle = [];
    var _Entidad = await docVentasCab.findOne({
        where : {
            TipoDoc : req.body.tipo ,
            Serie   : req.body.serie ,
            Correlativo : req.body.corr
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _Entidad;
    if( _Entidad )
    {
        var _Detalle = await docVentasDet.findAll({
            where : {
                CodigoHead : _Entidad.Codigo
            }
        });
        $response.detalle = _Detalle;
    }
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                      LEER XML                        //
//////////////////////////////////////////////////////////
router.post('/leer/xml', async (req,res)=>{
    // Archivo
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _Entidad = await docVentasCab.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    if( _Entidad )
    {
        $response.e = _Entidad;
        if( _Entidad.ResultadoXML )
        {
            let xml_string = _Entidad.ResultadoXML;
            parser.parseString(xml_string, function(error, result) {
                if(error === null) {
                    console.log(result);
                    // parsing to json
                    let data = JSON.stringify(result)
                    $response.data = result;
                }else{
                    console.log(error);
                    $response.estado = 'ERROR';
                    $response.error  = error;
                }
            });
        }
    }
    /**
    var _Archivo = `${req.body.Archivo}.xml`;
    if( _Archivo.length > 5  ){
        var _fullURL = _RUTA_XML+"/"+_Archivo
        var _PHPfile = `${_RUTA_XML}/${req.body.Archivo}.php`;
        $response.file = _fullURL;
        $response.php  = _PHPfile;
        try {
            if (fs.existsSync(_fullURL)) {
                let xml_string = fs.readFileSync( _fullURL , "utf8");
                parser.parseString(xml_string, function(error, result) {
                    if(error === null) {
                        console.log(result);
                        let data = JSON.stringify(result)
                        $response.data = result;
                    }
                    else {
                        console.log(error);
                        $response.estado = 'ERROR';
                        $response.error  = error;
                    }
                });
            }else{
                $response.estado = 'ERROR';
                $response.error  = 'El archivo no existe.';
            }
        } catch(err) {
            console.error(err);
            $response.error  = err;
            $response.estado = 'ERROR';
        }
    }
    /**/
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                 LEER XML VERSION 2                   //
//////////////////////////////////////////////////////////
router.post('/leer/xml2', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    // - //
    var _DataY = await docVentasCab.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _DataY;
    if( _DataY ){
        parser.parseString( _DataY.ResultadoXML , function(error, result) {
            if(error === null) {
                console.log(result);
                let data = JSON.stringify(result)
                $response.xml = result;
            }
            else {
                console.log(error);
                $response.estado = 'ERROR';
                $response.error  = error;
            }
        });
    }
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//         LEER XML RESUMEN FACTURAS VERSION 2          //
//////////////////////////////////////////////////////////
router.post('/resumen/xml2', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    // - //
    var _DataY = await resumenFacturasCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _DataY;
    if( _DataY ){
        parser.parseString( _DataY.ResultadoXML , function(error, result) {
            if(error === null) {
                console.log(result);
                let data = JSON.stringify(result)
                $response.xml = result;
            }
            else {
                console.log(error);
                $response.estado = 'ERROR';
                $response.error  = error;
            }
        });
    }
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  VER CONJUNTO OS                     //
//////////////////////////////////////////////////////////
router.post('/ver_conjunto_os', async (req,res)=>{
    // IdConj
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _Entidad = await conjuntoOSModel.findAll({
        where : {
            IDConjunto : req.body.IdConj
        },
        include: [{
            model: OSModel,
            as: 'COS01'
        }]
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _Entidad;
    if( _Entidad )
    {
        for (let index = 0; index < _Entidad.length; index++) {
            const rs = _Entidad[index];
            //
        }
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/buscar_oc', async (req,res)=>{
    // oc
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await docVentasCab.findOne({
        where : {
            OrdenCompra : req.body.oc
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  VER CUOTAS DOCUMENTO                //
//////////////////////////////////////////////////////////
router.post('/get_cuotas', async (req,res)=>{
    // Codigo
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await docVentaCuotaModel.findAll({
        where : {
            CodigoHead : req.body.Codigo
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  GET VENTAS ACUMULADAS               //
//////////////////////////////////////////////////////////
router.post('/get_vta_acumuladas', async (req,res)=>{
    // ids[,]
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    if( req.body.ids != '' )
	{
		var $ids = req.body.ids;
		var $arIds = $ids.split(',');
		// Devolveremos sólo un registro para mostrar en la pantalla.
        $response.data = await docVentasCab.findOne({
            where : {
                id : { [Op.in] : $arIds }
            }
        })
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        //
    }
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  GET VENTAS ACUMULADAS               //
//////////////////////////////////////////////////////////
router.post('/set_vta_acumuladas', async (req,res)=>{
    // Vamos a colocar los datos de la venta acumuladas en los registros seleccinados.
    // ids[,]
    var $response    = {};
    $response.estado = 'OK';
    $response.data   = [];

    if( req.body.ids != '' )
	{
		var $ids    = req.body.ids;
		var $arIds  = $ids.split(',');
        delete req.body.ids;
        //
        if(! req.body.FechaEntrega_A ){
            delete req.body.FechaEntrega_A;
        }
        if(! req.body.FechaCliente ){
            delete req.body.FechaCliente;
        }
        if(! req.body.FechaTesoreria ){
            delete req.body.FechaTesoreria;
        }
		//
        varDump( $arIds );
        //
        await docVentasCab.update( req.body ,{
            where : {
                id : { [Op.in] : $arIds }
            }
        })
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        //
    }

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//               COPIAR ITEMS FACTURA/BOLETA            //
//////////////////////////////////////////////////////////
router.post('/copy_items_f', async (req,res)=>{
    // corr, token, codigo
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _Corr = await pad_with_zeroes( req.body.corr , 8 );
    varDump(_Corr);

    var _Entidad = await docVentasCab.findOne({
        where : {
            TipoDoc : 'F',
            Correlativo : _Corr
        }
    });

    if( _Entidad )
    {
        // vamos a cargar los detalles (items)
        var _DetalleEntidad = await docVentasDet.findAll({
            where : {
                CodigoHead : _Entidad.Codigo ,
                Token : _Entidad.uu_id
            }
        });
        if( _DetalleEntidad )
        {
            for (let index = 0; index < _DetalleEntidad.length; index++) {
                const rs = _DetalleEntidad[index];
                var _insert = {};
                // CodigoHead
                _insert.uu_id       = await renovarToken();
                _insert.Indice  = index + 1;
                _insert.TipoDoc = 'F';
                _insert.Serie   = 'F001';
                _insert.Correlativo = 0;
                _insert.CodigoHead  = req.body.codigo;
                _insert.IdServicio  = rs.IdServicio;
                _insert.Servicio    = rs.Servicio;
                _insert.IdProducto  = rs.IdProducto;
                _insert.Descripcion = rs.Descripcion;
                _insert.Cantidad    = rs.Cantidad;
                _insert.Moneda      = rs.Moneda;
                _insert.PrecioUnit = rs.PrecioUnit;
                _insert.ValorUnit   = rs.ValorUnit;
                _insert.IgvUnit = rs.IgvUnit;
                _insert.Total   = rs.Total;
                _insert.NroOS   = rs.NroOS;
                _insert.ConjOS  = rs.ConjOS;
                _insert.CodigoProducto      = rs.CodigoProducto;
                _insert.CodigoProductoSUNAT = rs.CodigoProductoSUNAT;
                _insert.InfoAdic01 = rs.InfoAdic01;
                _insert.InfoAdic02 = rs.InfoAdic02;
                _insert.InfoAdic03 = rs.InfoAdic03;
                _insert.Token   = req.body.token;
                _insert.Flag    = rs.Flag;
                _insert.ImporteTotalSinImpuesto     = rs.ImporteTotalSinImpuesto;
                _insert.ImporteUnitarioSinImpuesto  = rs.ImporteUnitarioSinImpuesto;
                _insert.ImporteUnitarioConImpuesto  = rs.ImporteUnitarioConImpuesto;
                _insert.MontoBaseIgv    = rs.MontoBaseIgv;
                _insert.ImporteIgv      = rs.ImporteIgv;
                _insert.ImporteTotalImpuestos = rs.ImporteTotalImpuestos;
                varDump( _insert );
                await docVentasDet.create( _insert )
                .catch(function (err) {
                    captueError( err.original , req.body );
                    console.log(_NombreDoc);
                    $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
                });
            }
        }
    }else{
        $response.estado = 'ERROR';
        $response.error = 'No existe el documento';
    }

    $response.data = await docVentasDet.findAll({
        where : {
            Token : req.body.token
        }
    });
    // Suma del detalle
    var _totalDet = await docVentasDet.sum('ImporteTotalSinImpuesto',{ 
        where: {
            Token : req.body.token
        }
    });
    $response.total = _totalDet;

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
function varDump( _t )
{
    console.log( _t );
}
// -------------------------------------------------------
async function decimalString( numero )
{
    var num = parseFloat( numero );
    var _n = (Math.round(num * 100) / 100).toFixed(2);
    return `${_n}`;
}
// -------------------------------------------------------
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
async function captueError( error , post )
{
    var _envio       = JSON.stringify(post);
    var _descripcion = JSON.stringify(error);
    var _uuid = await renovarToken();
    await errorLogModel.create({
        uu_id : _uuid,
        modulo : 'api_reqPersonal',
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
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;





