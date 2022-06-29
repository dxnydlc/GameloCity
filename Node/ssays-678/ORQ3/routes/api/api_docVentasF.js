// @drdelacruzm | 06/1/2021

// api_docVentasF.js
var _NombreDoc = `api_docVentasF`, _TipoDocG = `F`;

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

// Archivos
const fs = require('fs');

// Strip tags
var striptags = require('striptags');


// Ejecutar un php
var execPhp = require('exec-php');
var http = require('http');


// Leer un XML
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });


// Modelos
const { errorLogModel } = require('../../dbA');
const { OSModel,conjuntoOSModel, otModel } = require('../../db31');
const { docVentasCab, User, docVentasDet, sistemasModel, clienteModel, seriesDocModel, departamentoModel, provinciaModel, distrito2Model,clienteMode, docVentaCuotaModel } = require('../../db');

var _TasaIGV = 0.18, _TasaDetraccion = 0.12;

// XML
const _RUTA_XML = process.env.RUTA_XML;
const _SOAP_URL = process.env.SOAP_URL;
const _SOAP_USER = process.env.SOAP_USER;
const _SOAP_PASSWD = process.env.SOAP_PASSWD;
const _URL_NODE    = process.env.URL_NODE;

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
        limit : 100,
        where : {
            TipoDoc : _TipoDocG
        }
    });

    $response.td = _TipoDocG;

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // corr, cli, inic, fin, estadodoc, estadoprov, Facturador, Resumen, hes, oc, UndNeg
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
		        Correlativo : { [Op.in] : arrCorrs },
                TipoDoc : _TipoDocG
		    },
        });
        //
    }else{
        $where.TipoDoc = _TipoDocG;
        // Buscamos por fecha emisión
        $where.FechaEmision = { [Op.gte ]: req.body.inic,[Op.lte ]: req.body.fin };
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
            $where.Estado = req.body.EstadoBznlk;
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
        // UndNeg
        if( req.body.UndNeg ){
            $where.UndNegocio = req.body.UndNeg;
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
//      			    OBTENER LISTA     			    //
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await docVentasCab.findAll({
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
    check('Direccion' ,'Ingrese dirección').not().isEmpty(),
    check('IdCondPago' ,'Seleccione condición pago').not().isEmpty(),
    check('IdCtaConta' ,'Seleccione cuenta contable').not().isEmpty(),
    check('IdVendedor' ,'Seleccione vendedor').not().isEmpty(),
    check('IdTipAfect' ,'Seleccione tipo afecto').not().isEmpty(),
    check('TipoCambio' ,'Ingrese tipo de cambio').not().isEmpty(),
    check('FechaEmision' ,'Ingrese fecha emisión').not().isEmpty(),
    check('CorreoEnvio' ,'Ingrese una dirección de correo').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

	var $response = {};
    $response.cuotas = [];
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    var _IncIGV = req.body.IncIGV, _TasaIGV = req.body.TasaIGV, _TipoCambio = req.body.TipoCambio, _Moneda = req.body.Moneda;
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // Auditoria
    req.body.IdUsuarioMod   = $userData.dni;
    req.body.UsuarioMod     = $userData.name;
    req.body.Estado         = 'Activo';
    // Serie y correlativo
    var _serieDoc = await seriesDocModel.findOne({
        attributes: ['IdSerieDoc','Serie', 'UltCorrelativo'],
        where : {
            IdTipoDoc : 2
        }
    })
    .catch(function (err) {
        console.log(`Leven 01`);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    if( _serieDoc ){
        var _Serie = _serieDoc.Serie, _Corr = _serieDoc.UltCorrelativo + 1;
        _Serie = 'F'+ await pad_with_zeroes(_Serie,3);
        console.log(`Correlativo a usar => ${_Corr}`);
        req.body.Serie = _Serie;
        req.body.Correlativo = await pad_with_zeroes(_Corr,8);
    }else{
        // NO HAY SERIE!!!!
    }
    // Vamos a colocar el Emisor
    var _InicialesFacturador = $userData.Iniciales, _InicialesVendedor = 0;
    var _Facty = $userData.name, _UndNegocio = req.body.UndNegocio, _Vended = req.body.Vendedor;
    var _Facturador = await inicialesUsuario( $userData.dni );
    var _Vendedor = await inicialesUsuario( req.body.IdVendedor );
    req.body.Emisor = `${_Vendedor}-${_Facturador}-${_UndNegocio}`;
    //
    await docVentasCab.create(req.body)
    .catch(function (err) {
        console.log(`Leven 02 | `+err.original.sqlMessage);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    var _dataGuardado = await docVentasCab.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado )
    {
        // Actualizamos el ultimo correlativo
        await seriesDocModel.update({
            UltCorrelativo : _Corr
        },{
            where : {
                IdSerieDoc : _serieDoc.IdSerieDoc
            }
        });
        //
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 8 );
        _Codigo = 'FAC'+_Codigo;
        await docVentasCab.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        })
        .catch(function (err) {
            console.log(`Leven 03`);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        // Unir con el detalle
        await docVentasDet.update({
            CodigoHead : _Codigo
        },{
            where : {
                Token : req.body.uu_id
            }
        });
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        // Calcular montos. la suma de todos los items.
        var _subTotal = await docVentasDet.sum('ImporteTotalSinImpuesto',{ 
            where: {
                CodigoHead : _Codigo
            }
        });
        var _total = 0 , _igv = 0;
        if( _IncIGV == 'SI' ){
            // Incluye IGV entonces el sub total es el total.
            _total = _subTotal;
            _igv = _subTotal * _TasaIGV;
            _subTotal = _total - _igv;
        }else{
            _igv = _subTotal * _TasaIGV;
            _total = _subTotal + _igv;
        }
        
        varDump(`_total :  ${_total}, _subTotal:${_subTotal}, _igv: ${_igv}`);
        var _SubTotal_Doc = _subTotal, _Total_Doc = _total, _IGV_Doc = _igv, _TasaDetrac = 0, _MontoDetrac = 0;
        var _SubTotal_PEN = 0, _Total_PEN = 0, _IGV_PEN = 0, _MontoNetoPendiente = 0;
        if( _Moneda == 'PEN' ){
            _SubTotal_PEN   = _SubTotal_Doc;
            _Total_PEN      = _Total_Doc;
            _IGV_PEN        = _IGV_Doc;
        }else{
            _SubTotal_PEN   = _SubTotal_Doc * _TipoCambio;
            _Total_PEN      = _Total_Doc * _TipoCambio;
            _IGV_PEN        = _IGV_Doc * _TipoCambio;
        }
        _MontoNetoPendiente = _Total_Doc;
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        // Detraccion
        if( _dataGuardado.IdCondPago != 27 ){
            if( _dataGuardado.TipoVenta == 'Servicio' )
            {
                // Si es una factura diferene a GRATUITO aplicar detraccion ( SIN DECIMALES ) y es servicio
                if( _Total_Doc > 700 ){
                    _TasaDetrac     = _TasaDetraccion;
                    var _tmpDetrac  = _Total_Doc * _TasaDetraccion;
                    _MontoDetrac    = Math.round( _tmpDetrac );
                }
            }
            // Vamos a generar la Couta
            const _IdNoTipoPago = [ 1 , 28 , 27 , 23 ];
            if(! _IdNoTipoPago.includes( _dataGuardado.IdCondPago ) )
            {
                // GENERAMOS LA CUOTA
                var _MontoPagoCuota = _Total_Doc - _MontoDetrac;
                _MontoNetoPendiente = _MontoPagoCuota;
                var _insertCuota = {
                    uu_id       : await renovarToken() ,
                    CodigoHead  : _Codigo ,
                    NroCuota    : 1 ,
                    MontoPagoCuota : _MontoPagoCuota ,
                    FechaPagoCuota : _dataGuardado.FechaVencimiento ,
                    Pendiente : 0,
                    Token : _dataGuardado.uu_id
                };
                var _CuotaResp = await docVentaCuotaModel.create( _insertCuota );
            }
        }
        // TODO: MontoNetoPendiente = 0 xq la primera couta será la que cancelará todo.
        await docVentasCab.update({
            MontoNetoPendiente : _MontoNetoPendiente.toFixed(2),
            SubTotal_PEN: _SubTotal_PEN.toFixed(2),
            Total_PEN   : _Total_PEN.toFixed(2),
            IGV_PEN     : _IGV_PEN.toFixed(2),
            SubTotal_Doc: _SubTotal_Doc.toFixed(2),
            Total_Doc   : _Total_Doc.toFixed(2),
            IGV_Doc     : _IGV_Doc.toFixed(2),
            TasaDetrac  : _TasaDetraccion.toFixed(2),
            MontoDetrac : _MontoDetrac.toFixed(2)
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        })
        .catch(function (err) {
            console.log(`Leven 05`);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        // Cuotas
        $response.cuotas = await docVentaCuotaModel.findAll({
            where : {
                CodigoHead : _dataGuardado.Codigo
            }
        });
    }

    var _Item = await docVentasCab.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    })
    .catch(function (err) {
        console.log(`Leven 06`);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });

    $response.item = _Item;

    // Dibujamos el php para enviar el xml
    var _detalle = await docVentasDet.findAll({
        where : {
            Token : req.body.uu_id
        }
    });
    
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    maxeXML( _Item , _detalle , $userData );

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid, id
    var $response = {};
    $response.estado = 'OK';
    $response.data  = [];
    $response.items = [];
    $response.cuotas = [];

    var _Entidad = await docVentasCab.findOne({
        where : {
            uu_id : req.body.uuid,
            id    : req.body.id
        }
    });
    $response.data  = _Entidad;
    if( _Entidad )
    {
        var _Items = await docVentasDet.findAll({
            where: {
                Token : _Entidad.uu_id
            }
        });
        $response.items = _Items;
        // Suma del detalle
        var _totalDet = await docVentasDet.sum('ValorUnit',{ 
            where: {
                Token : _Entidad.uu_id
            }
        });
        $response.total = _Entidad.SubTotal_Doc;
        // Cuotas
        $response.cuotas = await docVentaCuotaModel.findAll({
            where : {
                CodigoHead : _Entidad.Codigo
            }
        });
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CHECK ESTADO DOC                    //
//////////////////////////////////////////////////////////
router.post('/check', async (req,res)=>{
    // uuid, id
    var $response = {};
    $response.estado = 'OK';
    $response.data  = [];
    $response.items = [];

    var _Entidad = await docVentasCab.findOne({
        where : {
            uu_id : req.body.uuid,
            id    : req.body.id
        }
    });
    if( _Entidad )
    {
        $response.data  = _Entidad;
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('IdCliente' ,'Seleccione cliente').not().isEmpty(),
    check('Direccion' ,'Ingrese dirección').not().isEmpty(),
    check('IdCondPago' ,'Seleccione condición pago').not().isEmpty(),
    check('IdCtaConta' ,'Seleccione cuenta contable').not().isEmpty(),
    check('IdVendedor' ,'Seleccione vendedor').not().isEmpty(),
    check('IdTipAfect' ,'Seleccione tipo afecto').not().isEmpty(),
    check('TipoCambio' ,'Ingrese tipo de cambio').not().isEmpty(),
    check('FechaEmision' ,'Ingrese fecha emisión').not().isEmpty(),
    check('CorreoEnvio' ,'Ingrese una dirección de correo').not().isEmpty(),
], async (req,res)=>{
    // uuid
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }

    // 666666666666666666666666666666666666666666666666666666666666
    var _Modificable = await validarEstado( req.body.Codigo , 'Activo' );
    if( _Modificable != '' ){
        var _errGAA = [{ msg : _Modificable }];return res.status(422).json({ errores : _errGAA });
    }
    // 666666666666666666666666666666666666666666666666666666666666
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [], _Codigo = '';

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    var _IncIGV = req.body.IncIGV, _TasaIGV = req.body.TasaIGV, _TipoCambio = req.body.TipoCambio, _Moneda = req.body.Moneda;
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Auditoria
    req.body.IdUsuarioMod = $userData.dni;
    req.body.UsuarioMod   = $userData.name;

    delete req.body.id;

    var _Entidad = await docVentasCab.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    if( _Entidad )
    {
        _Codigo = req.body.Codigo;
        await docVentasCab.update(req.body,{
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
    }
    
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    // Calcular montos. la suma de todos los items.
    var _subTotal = await docVentasDet.sum('ImporteTotalSinImpuesto',{ 
        where: {
            CodigoHead : _Codigo
        }
    });
    var _total = 0 , _igv = 0;
    if( _IncIGV == 'SI' ){
        // Incluye IGV entonces el sub total es el total.
        _total = _subTotal;
        _igv = _subTotal * _TasaIGV;
        _subTotal = _total - _igv;
    }else{
        _igv = _subTotal * _TasaIGV;
        _total = _subTotal + _igv;
    }
    
    varDump(`_total :  ${_total}, _subTotal:${_subTotal}, _igv: ${_igv}`);
    var _SubTotal_Doc = _subTotal, _Total_Doc = _total, _IGV_Doc = _igv, _TasaDetrac = 0, _MontoDetrac = 0;
    var _SubTotal_PEN = 0, _Total_PEN = 0, _IGV_PEN = 0, _MontoNetoPendiente = 0;
    if( _Moneda == 'PEN' ){
        _SubTotal_PEN   = _SubTotal_Doc;
        _Total_PEN      = _Total_Doc;
        _IGV_PEN        = _IGV_Doc;
    }else{
        _SubTotal_PEN   = _SubTotal_Doc * _TipoCambio;
        _Total_PEN      = _Total_Doc * _TipoCambio;
        _IGV_PEN        = _IGV_Doc * _TipoCambio;
    }
    _MontoNetoPendiente = _Total_Doc;
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    // Detraccion
    if( _Entidad.IdCondPago != 27 ){
        // Si es una factura diferene a GRATUITO aplicar detraccion ( SIN DECIMALES )
        if( _Entidad.TipoVenta == 'Servicio' )
        {
            // Si es una factura diferene a GRATUITO aplicar detraccion ( SIN DECIMALES ) y es servicio
            if( _Total_Doc > 700 ){
                _TasaDetrac     = _TasaDetraccion;
                var _tmpDetrac  = _Total_Doc * _TasaDetraccion;
                _MontoDetrac    = Math.round( _tmpDetrac );
            }
        }
        //_TasaDetrac = _TasaDetraccion;
        //var _tmpDetrac = _Total_Doc * _TasaDetraccion;
        //_MontoDetrac = Math.round( _tmpDetrac );
    }
    // Vamos a generar la Couta
    const _IdNoTipoPago = [ 1 , 28 , 27 , 23 ];
    if(! _IdNoTipoPago.includes( _Entidad.IdCondPago ) )
    {
        // GENERAMOS LA CUOTA
        var _preCuota =  await docVentaCuotaModel.findOne({
            where : {
                CodigoHead  : _Codigo ,
            }
        });
        var _MontoPagoCuota = _Total_Doc - _MontoDetrac;
        _MontoNetoPendiente = _MontoPagoCuota;
        if( ! _preCuota ){
            var _insertCuota = {
                uu_id       : await renovarToken() ,
                CodigoHead  : _Codigo ,
                NroCuota    : 1 ,
                MontoPagoCuota : _MontoPagoCuota ,
                FechaPagoCuota : _Entidad.FechaVencimiento ,
                Pendiente : 0,
                Token : _Entidad.uu_id
            };
            var _CuotaResp = await docVentaCuotaModel.create( _insertCuota );
        }else{
            // Actualizamos la cuota
            varDump(`Actualizando cuota: ${_preCuota.id}, MontoPagoCuota : ${_MontoPagoCuota}`);
            await docVentaCuotaModel.update({
                MontoPagoCuota : _MontoPagoCuota
            },{
                where : {
                    id : _preCuota.id
                }
            });
        }
    }
    await docVentasCab.update({
        MontoNetoPendiente : _MontoNetoPendiente.toFixed(2),
        SubTotal_PEN: _SubTotal_PEN.toFixed(2),
        Total_PEN   : _Total_PEN.toFixed(2),
        IGV_PEN     : _IGV_PEN.toFixed(2),
        SubTotal_Doc: _SubTotal_Doc.toFixed(2),
        Total_Doc   : _Total_Doc.toFixed(2),
        IGV_Doc     : _IGV_Doc.toFixed(2),
        TasaDetrac  : _TasaDetraccion.toFixed(2),
        MontoDetrac : _MontoDetrac.toFixed(2)
    },{
        where  : {
            uu_id : req.body.uu_id
        }
    })
    .catch(function (err) {
        console.log(`Leven 05`);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });

    var _Item = await docVentasCab.findOne({
        where : { 
            uu_id : req.params.uuid 
        }
    });
    $response.item = _Item;
    var _detalle = await docVentasDet.findAll({
        where : {
            Token : req.body.uu_id
        }
    });
    maxeXML( _Item , _detalle , $userData );

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

	await docVentasCab.update({
        Estado      : 'Anulado',
        DNIAnulado  : $userData.dni,
        AnuladoPor  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await docVentasCab.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR FROM OS (231)                //
//////////////////////////////////////////////////////////
router.post('/importar/os' , [ check('NroOS' ,'Ingrese Nro de OS.').not().isEmpty(), ] , async (req,res)=>{
    // NroOS (,), Token, Codigo, td, serie, corr, moneda
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.cliente = [];

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    var _lastOS = {};
    var _Depa = ``, _Prov = ``, _Dist = ``, _Distrito = ``, _Pais = ``;

    var _ids   = req.body.NroOS;
    var _arIds = _ids.split(',');

    var _dataOSs = await OSModel.findAll({
        where : {
            IdOS : { [Op.in] : _arIds } , IncDocVenta : 1 , Facturado : 'NO',
            Estado : { [Op.in] : ['Aprobado','Finalizado'] } 
        }
    });

    console.log(_dataOSs.length);

    if( _dataOSs ){
        for( var i = 0; i < _dataOSs.length; i++ )
        {
            var _rs = _dataOSs[i];
            _lastOS = _rs;
            var _insertData = {};
            _insertData.uu_id       = await renovarToken();
            _insertData.Token       = req.body.Token;
            _insertData.CodigoHead  = req.body.Codigo;
            _insertData.TipoDoc     = req.body.td;
            _insertData.Serie       = req.body.serie;
            _insertData.Correlativo = req.body.corr;
            _insertData.Cantidad    = 1;
            _insertData.Flag = `Servicio`;
            // Es boleta tomamos el total
            if( _rs.IdMoneda == 1 ){
                // 
                _insertData.ValorUnit  = parseFloat( _rs.SubTotalSoles );
                _insertData.IgvUnit    = parseFloat( _rs.IGVSoles );
                _insertData.PrecioUnit = parseFloat( _rs.TotalSoles );
                _insertData.Total      = parseFloat( _rs.SubTotalSoles );
            }else{
                _insertData.ValorUnit  = parseFloat( _rs.SubTotalDoc );
                _insertData.IgvUnit    = parseFloat( _rs.IGVDoc );
                _insertData.PrecioUnit = parseFloat( _rs.TotalDoc );
                _insertData.Total      = parseFloat( _rs.SubTotalDoc );
            }
            // Valores de Sunat
            _insertData.CodigoProducto      = '4610225';
            _insertData.CodigoProductoSUNAT = '76111501';
            _insertData.ImporteTotalSinImpuesto     = parseFloat( _rs.SubTotalDoc );
            _insertData.ImporteUnitarioSinImpuesto  = parseFloat( _rs.SubTotalDoc );
            _insertData.ImporteUnitarioConImpuesto  = parseFloat( _rs.TotalDoc );
            _insertData.ImporteTotalImpuestos       = parseFloat( _rs.IGVDoc );
            _insertData.MontoBaseIgv = parseFloat( _rs.SubTotalDoc );
            _insertData.ImporteIgv   = parseFloat( _rs.IGVDoc );
            if( _rs.IdMoneda == 1 ){
                _insertData.Moneda  = 'PEN';
            }else{
                _insertData.Moneda  = 'USD';
            }
            // - //
            _insertData.NroOS = _rs.IdOS;
            // - //
            //_insertData.IdServicio  = _rs.Servicio;
            // Nombre del servicio (sistema)
            var _dataSistema = await sistemasModel.findOne({
                where : {
                    IdSistema : _rs.Servicio
                }
            })
            .catch(function (err){
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
            if( _dataSistema ){
                _insertData.Servicio= _dataSistema.Descripcion;
            }
            // TODO: la glosa
            var _Glosa = _rs.Descripcion.toString() 
            _Glosa = _Glosa.replace(/(\r\n|\n|\r)/gm, ' ');
            _insertData.Descripcion = _Glosa;
            await docVentasDet.create( _insertData )
            .catch(function (err) {
                $response.estado    = 'ERROR';
                $response.error     = err.original.sqlMessage;
                res.json( $response );
            });
        }
    }

    // Enviamos la OS
    $response.os = _lastOS;
    varDump(`>>>>> ${_lastOS.ClienteFact}`);
    // Data del cliente
    if( _lastOS.ClienteFact ){
        var _dataCliente = await clienteModel.findOne({
            where : {
                IdClienteProv : _lastOS.ClienteFact,
                Estado : 1
            }
        }).catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        $response.cliente = _dataCliente;
        if( _dataCliente ){
            // Departamento
            var _dataDepa = await departamentoModel.findOne({
                where : {
                    id : _dataCliente.Departamento
                }
            });
            if( _dataDepa ){
                _Depa = _dataDepa.name;
            }
            // Provincia
            var _dataProvi = await provinciaModel.findOne({
                where : {
                    id : _dataCliente.Provincia
                }
            });
            if( _dataProvi ){
                _Prov = _dataProvi.name;
            }
            // Distrito
            var _dataDistri = await distrito2Model.findOne({
                where : {
                    id : _dataCliente.Distrito
                }
            });
            if( _dataDistri ){
                _Dist = _dataDistri.name;
            }
            _Pais = _dataCliente.Pais;
        }
    }else{
        //$response.estado = 'WARN';
        //$response.error  = 'La OS no tiene cliente para facturar.';
    }

    $response.depa = _Depa;
    $response.prov = _Prov;
    $response.dist = _Dist;
    $response.pais = _Pais;

    $response.data = await docVentasDet.findAll({
        where: {
            Token : req.body.Token
        }
    });
    // Suma del detalle
    var _totalDet = await docVentasDet.sum('ValorUnit',{ 
        where: {
            Token : req.body.Token
        }
    });
    $response.total = _totalDet;
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//               IMPORTAR CONJUNTO DE OS                //
//////////////////////////////////////////////////////////
router.post('/importar/conjunto', async (req,res)=>{
    // IdConjunto, Token, Codigo, td, serie, corr, moneda
    var $response     = {};
    $response.estado  = 'OK';
    $response.data    = [];
    $response.cliente = [];
    var _Depa = ``, _Prov = ``, _Dist = ``, _Distrito = ``, _Pais = ``;

    var _dataCOnjunto = await conjuntoOSModel.findAll({
        where : {
            IDConjunto : req.body.IdConjunto
        }
    });
    if( _dataCOnjunto )
    {
        var _totalConjuntoOS = await conjuntoOSModel.sum( 'Total' , {
            where: {
                IDConjunto : req.body.IdConjunto
            }
        });
        // Recorremos todas las OS
        var _lastOS = {};
        var _SubTotalConjunto = _totalConjuntoOS, _subTotal = 0;
        for (let index = 0; index < _dataCOnjunto.length; index++) {
            const _itemOS = _dataCOnjunto[index];
            
            var _dataOS = await OSModel.findOne({
                where : {
                    IdOS : _itemOS.IdOS , IncDocVenta : 1 , Facturado : 'NO',
                    Estado : { [Op.in] : ['Aprobado','Finalizado'] } 
                }
            });
            if( _dataOS ){
                _lastOS = _dataOS;
                // >>>>>>>>>>>>>>>>>>>>>>>>>
                var _rs = _dataOS;
                _lastOS = _dataOS;
                // Boleta tomamos el total
                if( req.body.moneda == 'PEN' ){
                    _subTotal = _subTotal + parseFloat( _rs.SubTotalDoc );
                }else{
                    _subTotal = _subTotal + parseFloat( _rs.SubTotalDoc );
                }
                console.log( _itemOS.IdOS+' ++++ '+_rs.SubTotalDoc );
                // >>>>>>>>>>>>>>>>>>>>>>>>>
                //var _Total = 0, _IGV = _subTotal * _TasaIGV;
                //_Total = _subTotal + _IGV;
                // -
            }else{
                varDump(`>>>>>>>< CONJUNTO DE OS, OS ${_itemOS.IdOS} NO EXISTE >>>>>>>>>>>`);
            }
        }
        console.log(_subTotal);
        var _Total = 0, _IGV = _subTotal * _TasaIGV;
        _Total = _subTotal + _IGV;
        console.log(`Total de conjunto: ${_Total}. _SubTotalConjunto : ${_subTotal}, _IGV : ${_IGV}`);
        // Insertamos.
        var _insertData = {};
        _insertData.uu_id       = await renovarToken();
        _insertData.Token       = req.body.Token;
        _insertData.CodigoHead  = req.body.Codigo;
        _insertData.TipoDoc     = req.body.td;
        _insertData.Serie       = req.body.serie;
        _insertData.Correlativo = req.body.corr;
        _insertData.Cantidad    = 1;
        _insertData.PrecioUnit  = parseFloat( _Total ).toFixed(2);
        _insertData.ValorUnit   = parseFloat( _subTotal ).toFixed(2);
        _insertData.IgvUnit     = parseFloat( _IGV ).toFixed(2);
        _insertData.Total       = parseFloat( _Total ).toFixed(2);;
        _insertData.ConjOS      = req.body.IdConjunto;
        //_insertData.IdServicio  = _lastOS.Servicio;
        // Nombre del servicio (sistema)
        if(! _lastOS.Servicio ){
            varDump(`OS ${_lastOS.IdOS} no tiene Servicio...`);
        }
        var _dataSistema = await sistemasModel.findOne({
            where : {
                IdSistema : _lastOS.Servicio
            }
        });
        if( _dataSistema ){
            _insertData.Servicio= _dataSistema.Descripcion;
        }
        _insertData.Descripcion = _dataCOnjunto[0].Descripcion;
        // Valores de Sunat
        _insertData.CodigoProducto      = '4610225';
        _insertData.CodigoProductoSUNAT = '76111501';
        _insertData.ImporteTotalSinImpuesto     = parseFloat( _subTotal );
        _insertData.ImporteUnitarioSinImpuesto  = parseFloat( _subTotal );
        _insertData.ImporteUnitarioConImpuesto  = parseFloat( _Total );
        _insertData.ImporteTotalImpuestos       = parseFloat( _IGV );
        _insertData.MontoBaseIgv = parseFloat( _subTotal );
        _insertData.ImporteIgv   = parseFloat( _IGV );
        if( _rs.IdMoneda == 1 ){
            _insertData.Moneda  = 'PEN';
        }else{
            _insertData.Moneda  = 'USD';
        }
        // - //
        varDump(_insertData);
        await docVentasDet.create( _insertData )
        .catch(function (err) {
            $response.estado    = 'ERROR';
            $response.error     = err.original.sqlMessage;
            res.json( $response );
        });
    }
    
    // Enviamos la OS
    $response.os = _lastOS;
    // Data del cliente
    if( _lastOS ){
        var _dataCliente = await clienteModel.findOne({
            where : {
                IdClienteProv : _lastOS.ClienteFact
            }
        });
        $response.cliente = _dataCliente;
        if( _dataCliente ){
            // Departamento
            var _dataDepa = await departamentoModel.findOne({
                where : {
                    id : _dataCliente.Departamento
                }
            });
            if( _dataDepa ){
                _Depa = _dataDepa.name;
            }
            // Provincia
            var _dataProvi = await provinciaModel.findOne({
                where : {
                    id : _dataCliente.Provincia
                }
            });
            if( _dataProvi ){
                _Prov = _dataProvi.name;
            }
            // Distrito
            var _dataDistri = await distrito2Model.findOne({
                where : {
                    id : _dataCliente.Distrito
                }
            });
            if( _dataDistri ){
                _Dist = _dataDistri.name;
            }
            _Pais = _dataCliente.Pais;
        }
    }

    $response.depa = _Depa;
    $response.prov = _Prov;
    $response.dist = _Dist;
    $response.pais = _Pais;

    $response.data = await docVentasDet.findAll({
        where: {
            Token : req.body.Token
        }
    });
    // Suma del detalle
    $response.total = _subTotal;
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                      LEER XML                        //
//////////////////////////////////////////////////////////
router.post('/leer/xml', async (req,res)=>{
    // NroDoc
    var $response = {};
    $response.estado = 'OK';
    $response.data = ``;
    var _NroDoc = req.body.NroDoc;
    var _ArrDoc = _NroDoc.split('-');
    varDump(_ArrDoc);
    var _Entidad = await docVentasCab.findOne({
        where : {
            TipoDoc : 'F' ,
            Serie   : _ArrDoc[0] ,
            Correlativo : _ArrDoc[1] 
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
                }
                else {
                    console.log(error);
                    $response.estado = 'ERROR';
                    $response.error  = error;
                }
            });
        }
    }
    // - //
    /**
    var _Archivo = `${req.body.NroDoc}.xml`;
    if( _Archivo.length > 5  ){
        var _fullURL = _RUTA_XML+"/"+_Archivo
        let xml_string = fs.readFileSync( _fullURL , "utf8");
        // - //
        parser.parseString(xml_string, function(error, result) {
            if(error === null) {
                console.log(result);
                // parsing to json
                let data = JSON.stringify(result)
                $response.data = result;
            }
            else {
                console.log(error);
                $response.estado = 'ERROR';
                $response.error  = error;
            }
        });
    }
    /**/
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              ACTUALIZAR ESTADOS BIZLINKS             //
//////////////////////////////////////////////////////////
router.post('/update/bizlinks', async (req,res)=>{
    // uu_id
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var _uuid = req.body.uu_id;
    var $userData = await getUserData( req.headers['api-token'] );

    delete req.body.uu_id;

    req.body.IdUsuarioEnvioBizlinks = $userData.dni;
    req.body.UsuarioEnvioBizlinks   = $userData.name;
    req.body.FechaEnvioBizlinks     = moment().format('YYYY-MM-DD HH:mm:ss');

    await docVentasCab.update( req.body , {
        where : {
            uu_id : _uuid
        }
    });

    var _Entidad = await docVentasCab.findOne({
        where : {
            uu_id : _uuid
        }
    });
    $response.data = _Entidad;

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  APROBAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/aprobar', async (req,res)=>{
    // uuid, id
    var $response = {};
    $response.estado = 'OK';
    $response.data  = [];
    $response.items = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // 666666666666666666666666666666666666666666666666666666666666
    var _Modificable = await validarEstado( req.body.Codigo , ['Activo'] );
    if( _Modificable != '' ){
        var _errGAA = [{ msg : _Modificable }];return res.status(422).json({ errores : _errGAA });
    }
    // 666666666666666666666666666666666666666666666666666666666666

    var _Entidad = await docVentasCab.findOne({
        where : {
            uu_id : req.body.uuid,
            id    : req.body.id
        }
    });
    if( _Entidad )
    {
        await docVentasCab.update({
            Estado      : 'Aprobado',
            IdUsuarioAp : $userData.dni,
            UsuarioAp   : $userData.name,
            FechaAp     : moment().format('YYYY-MM-DD HH:mm:ss')
        },{
            where : {
                uu_id : req.body.uuid,
                id    : req.body.id
            }
        });
        // Marcamos la(s) OS
        var _detalle = await docVentasDet.findAll({
            where : {
                CodigoHead : _Entidad.Codigo
            }
        });
        if( _detalle ){
            for (let index = 0; index < _detalle.length; index++)
            {
                const rs = _detalle[index];
                if( rs.NroOS ){
                    // Marcamos OS
                    await OSModel.update({
                        NroFactura : `${_Entidad.Serie}-${_Entidad.Correlativo}` ,
                        Facturado  : 'SI'
                    },{
                        where : {
                            IdOS : rs.NroOS
                        }
                    });
                }
                if( rs.ConjOS )
                {
                    // conjuntoOSModel
                    var _listaOS = await conjuntoOSModel.findAll({
                        where : {
                            IDConjunto : rs.ConjOS
                        }
                    });
                    for (let h = 0; h < _listaOS.length; h++) {
                        const rsc = _listaOS[h];
                        await OSModel.update({
                            NroFactura : `${_Entidad.Serie}-${_Entidad.Correlativo}`,
                            Facturado  : 'SI'
                        },{
                            where : {
                                IdOS : rsc.IdOS
                            }
                        });
                    }
                }
            }
        }
        _Entidad = await docVentasCab.findOne({
            where : {
                uu_id : req.body.uuid,
                id    : req.body.id
            }
        });
        $response.data  = _Entidad;
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ANULAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/anular', async (req,res)=>{
    // uuid, id, motivo
    var $response = {};
    $response.estado = 'OK';
    $response.data  = [];
    $response.items = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // 666666666666666666666666666666666666666666666666666666666666
    var _Modificable = await validarEstado2( req.body.Codigo , ['Activo','Aprobado'] );
    if( _Modificable != '' ){
        var _errGAA = [{ msg : _Modificable }];return res.status(422).json({ errores : _errGAA });
    }
    // 666666666666666666666666666666666666666666666666666666666666

    var _Entidad = await docVentasCab.findOne({
        where : {
            uu_id : req.body.uuid,
            id    : req.body.id
        }
    });
    $response.data  = _Entidad;
    if( _Entidad )
    {
        await docVentasCab.update({
            Estado      : 'Anulado',
            IdUsuarioAn : $userData.dni,
            UsuarioAn   : $userData.name,
            MotivoAn    : req.body.motivo,
            FechaAn     : moment().format('YYYY-MM-DD HH:mm:ss')
        },{
            where : {
                uu_id : req.body.uuid,
                id    : req.body.id
            }
        });
        // Marcamos la(s) OS
        var _detalle = await docVentasDet.findAll({
            where : {
                CodigoHead : _Entidad.Codigo
            }
        });
        if( _detalle ){
            for (let index = 0; index < _detalle.length; index++)
            {
                const rs = _detalle[index];
                if( rs.NroOS ){
                    // Marcamos OS
                    await OSModel.update({
                        NroFactura : `` ,
                        Facturado  : 'NO'
                    },{
                        where : {
                            IdOS : rs.NroOS
                        }
                    });
                }
                if( rs.ConjOS )
                {
                    // conjuntoOSModel
                    var _listaOS = await conjuntoOSModel.findAll({
                        where : {
                            IDConjunto : rs.ConjOS
                        }
                    });
                    for (let h = 0; h < _listaOS.length; h++) {
                        const rsc = _listaOS[h];
                        await OSModel.update({
                            NroFactura : ``,
                            Facturado  : 'NO'
                        },{
                            where : {
                                IdOS : rsc.IdOS
                            }
                        });
                    }
                }
            }
        }
        _Entidad = await docVentasCab.findOne({
            where : {
                uu_id : req.body.uuid,
                id    : req.body.id
            }
        });
        $response.data  = _Entidad;
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  GET ITEM DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/item/get', async (req,res)=>{
    // uuid, id
    var $response = {};
    $response.estado = 'OK';
    $response.data  = [];
    $response.items = [];

    var _Entidad = await docVentasDet.findOne({
        where : {
            uu_id : req.body.uuid,
            id    : req.body.id
        }
    });
    $response.data  = _Entidad;
    if( _Entidad )
    {
        $response.data  = _Entidad;
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  GET ITEM DOCUMENTO                  //
//////////////////////////////////////////////////////////
router.post('/item/update', async (req,res)=>{
    // [form ] _TipoCambio
    var $response = {};
    $response.estado = 'OK';
    $response.data  = [];
    $response.items = [];
    $response.idVentDet = [];

    var $userData = await getUserData( req.headers['api-token'] );
    var _uuid = req.body.uu_id, _id = parseInt( req.body.id ), _Codigo = req.body.CodigoHead;
    varDump( parseInt( req.body.CodigoHead ) );
    if( _id > 0 && req.body.CodigoHead != 0 ){
        // 666666666666666666666666666666666666666666666666666666666666
        var _Modificable = await validarEstado( req.body.CodigoHead , 'Activo' );
        if( _Modificable != '' ){
            var _errGAA = [{ msg : _Modificable }];return res.status(422).json({ errores : _errGAA });
        }
        // 666666666666666666666666666666666666666666666666666666666666
    }
    
    if(! req.body.IdServicio  ){
        delete req.body.IdServicio;
    }

    var _Entidad = await docVentasDet.findOne({
        where : {
            uu_id : _uuid,
            id    : _id
        }
    });
    
    // Cantidad
    var _Cant = parseInt( req.body.Cantidad );
    // EL precio ingresado por el usuario
    var _ImporteUnitarioSinImpuesto = parseFloat(req.body.ValorUnit);
    // Cantidad * Precio unitario sin impuesto
    var _ImporteTotalSinImpuesto = _Cant * _ImporteUnitarioSinImpuesto;
    // IGV Unitario
    var _igvUnitIte = parseFloat( _ImporteUnitarioSinImpuesto * _TasaIGV);
    // El importe unitario "mas" el IGV tasa.
    var _ImporteUnitarioConImpuesto = _ImporteUnitarioSinImpuesto + _igvUnitIte;
    // El importe unitario sin IGV por la cantidad
    var _MontoBaseIgv = _Cant * _ImporteUnitarioSinImpuesto;
    // _ImporteTotalSinImpuesto por la tasa IGV
    var _ImporteIgv = parseFloat(_ImporteTotalSinImpuesto * _TasaIGV);
    // _ImporteTotalSinImpuesto por la tasa IGV
    var _ImporteTotalImpuestos = parseFloat(_ImporteTotalSinImpuesto * _TasaIGV);
    varDump(`_Cant : ${_Cant}, _ImporteUnitarioSinImpuesto: ${_ImporteUnitarioSinImpuesto}, _ImporteTotalSinImpuesto: ${_ImporteTotalSinImpuesto}, _ImporteUnitarioConImpuesto: ${_ImporteUnitarioConImpuesto}, _MontoBaseIgv: ${_MontoBaseIgv}, _ImporteIgv: ${_ImporteIgv}, _ImporteTotalImpuestos: ${_ImporteTotalImpuestos}`);
    
    // * //
    req.body.ImporteTotalSinImpuesto    = _ImporteTotalSinImpuesto;
    req.body.ImporteUnitarioSinImpuesto = _ImporteUnitarioSinImpuesto;
    req.body.ImporteUnitarioConImpuesto = _ImporteUnitarioConImpuesto;
    req.body.MontoBaseIgv   = _MontoBaseIgv;
    req.body.ImporteIgv     = _ImporteIgv;
    req.body.ImporteTotalImpuestos = _ImporteTotalImpuestos;
    // - //

    if( _Entidad )
    {
        delete req.body.uuid;
        delete req.body.id;
        // Actualizamos el IGV del item
        var _PrecItem = parseFloat( req.body.PrecioUnit ), _PrecUnit = parseFloat( req.body.ValorUnit );
        var _igvItem = _PrecItem - _PrecUnit;
        req.body.IgvUnit = _igvItem;
        await docVentasDet.update(req.body,{
            where : {
                uu_id : _uuid,
                id    : _id
            }
        })
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
    }else{
        // CREAMOS EL ITEM.
        await docVentasDet.create( req.body )
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
    }
    _Entidad = await docVentasDet.findOne({
        where : {
            uu_id : _uuid,
            id    : _id
        }
    });
    $response.data  = _Entidad;
    //
    $response.items = await docVentasDet.findAll({
        where: {
            Token : req.body.Token
        }
    });
    // Suma del detalle
    var _totalDet = await docVentasDet.sum('ImporteTotalSinImpuesto',{ 
        where: {
            Token : req.body.Token
        }
    });
    $response.total = _totalDet;
    //TODO: Al actualizar un item debemos actuaizar todo el encabezado
    // Actualizamos data del encabezado.
    if( _Codigo != '0' )
    {
        var _dataEncabezado = await docVentasCab.findOne({
            where : {
                Codigo : _Codigo
            }
        });
        // Total - Detracción (para actualizar la Cuota)
        var _IncIGV = _dataEncabezado.IncIGV, _Moneda = _dataEncabezado.Moneda;
        var _TipoCambio = _dataEncabezado.TipoCambio;
        // var _subTotal = await docVentasDet.sum('Total', { 
        var _subTotal = await docVentasDet.sum('ImporteTotalSinImpuesto', { 
            where: {
                CodigoHead : _Codigo
            } 
        })
        .catch(function (err) {
            console.log(`Leven 04 | `+err.original.sqlMessage);
            $response.estado = 'ERROR';$response.error = err.original.sqlMessage;res.json( $response );
        });
        if( _subTotal )
        {
            var _total = 0 , _igv = 0;
            if( _IncIGV == 'SI' ){
                _total = _subTotal;
                _igv = _subTotal * _TasaIGV;
                _subTotal = _total - _igv;
            }else{
                _igv = _subTotal * _TasaIGV;
                _total = _subTotal + _igv;
            }
            var _SubTotal_Doc = _subTotal, _Total_Doc = _total, _IGV_Doc = _igv;
            var _SubTotal_PEN = 0, _Total_PEN = 0, _IGV_PEN = 0;
            if( _Moneda == 'PEN' ){
                _SubTotal_PEN   = _SubTotal_Doc;
                _Total_PEN      = _Total_Doc;
                _IGV_PEN        = _IGV_Doc;
            }else{
                _SubTotal_PEN   = _SubTotal_Doc * _TipoCambio;
                _Total_PEN      = _Total_Doc * _TipoCambio;
                _IGV_PEN        = _IGV_Doc * _TipoCambio;
            }
            // Detraccion
            var _MontoDetrac = 0;
            if( _dataEncabezado.IdCondPago != 27 ){
                if( _dataEncabezado.TipoVenta == 'Servicio' )
                {
                    
                    // Si es una factura diferene a GRATUITO aplicar detraccion ( SIN DECIMALES ) y es servicio
                    if( _Total_Doc > 700 ){
                        _TasaDetrac = _TasaDetraccion;
                        var _tmpDetrac = _Total_Doc * _TasaDetraccion;
                        var _MontoDetrac = Math.round( _tmpDetrac );
                        varDump( `_Total_Doc: ${_Total_Doc} - _MontoDetrac: ${_MontoDetrac}`);
                    }
                }
                // Vamos a generar la Couta
                const _IdNoTipoPago = [ 1 , 28 , 27 , 23 ];
                if(! _IdNoTipoPago.includes( _dataEncabezado.IdCondPago ) )
                {
                    // Actualizar la cuota, siempre y cuando sea una cuota.
                    var NroCuotas = await docVentaCuotaModel.count({
                        where : {
                            CodigoHead : _dataEncabezado.Codigo
                        }
                    });
                    var _MontoPagoCuota = _Total_Doc - _MontoDetrac;
                    varDump(`*CUOTAS* _Total_Doc : ${_Total_Doc} , _MontoDetrac: ${_MontoDetrac}, _MontoPagoCuota: ${_MontoPagoCuota}`);
                    if( NroCuotas == 1 ){
                        await docVentaCuotaModel.update( { MontoPagoCuota : _MontoPagoCuota },{
                            where : {
                                CodigoHead : _dataEncabezado.Codigo
                            }
                        });
                    }
                }
            }
            await docVentasCab.update({
                SubTotal_PEN: _SubTotal_PEN.toFixed(2),
                Total_PEN   : _Total_PEN.toFixed(2),
                IGV_PEN     : _IGV_PEN.toFixed(2),
                SubTotal_Doc: _SubTotal_Doc.toFixed(2),
                Total_Doc   : _Total_Doc.toFixed(2),
                IGV_Doc     : _IGV_Doc.toFixed(2) ,
                TasaDetrac  : _TasaDetraccion.toFixed(2),
                MontoDetrac : _MontoDetrac.toFixed(2)
            },{
                where  : {
                    uu_id : _dataEncabezado.uu_id
                }
            })
            .catch(function (err) {
                console.log(`Leven 05`);
                $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
            });
        }
        _dataEncabezado = await docVentasCab.findOne({
            where : {
                Codigo : _Codigo
            }
        });
        // Volvemos a dibujar el php
        maxeXML( _dataEncabezado , $response.items , $userData );
    }
    $response.idVentDet = await docVentasDet.max('id') + 1;
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                   ELIMINAR ITEM                      //
//////////////////////////////////////////////////////////
router.post('/item/eliminar', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    var _Entidad = await docVentasDet.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });

    $response.data = await docVentasDet.destroy({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    //
    $response.data  = _Entidad;
    //
    if( _Entidad )
    {
        var _uuid = _Entidad.uu_id, _id = parseInt( _Entidad.id ), _Codigo = _Entidad.CodigoHead;
        //
        $response.items = await docVentasDet.findAll({
            where: {
                Token : _Entidad.Token
            }
        });
        // Suma del detalle
        var _totalDet = await docVentasDet.sum('ValorUnit',{ 
            where: {
                Token : _Entidad.Token
            }
        });
        $response.total = _totalDet;
        //TODO: Al actualizar un item debemos actuaizar todo el encabezado
        // Actualizamos data del encabezado.
        if( _Codigo != '0' )
        {
            var _dataEncabezado = await docVentasCab.findOne({
                where : {
                    Codigo : _Codigo
                }
            });
            // Total - Detracción (para actualizar la Cuota)
            var _IncIGV = _dataEncabezado.IncIGV, _Moneda = _dataEncabezado.Moneda;
            var _subTotal = await docVentasDet.sum('ValorUnit', { 
                where: {
                    CodigoHead : _Codigo
                } 
            })
            .catch(function (err) {
                console.log(`Leven 04 | `+err.original.sqlMessage);
                $response.estado = 'ERROR';$response.error = err.original.sqlMessage;res.json( $response );
            });
            if( _subTotal )
            {
                var _total = 0 , _igv = 0;
                if( _IncIGV == 'SI' ){
                    _total = _subTotal;
                    _igv = _subTotal * _TasaIGV;
                    _subTotal = _total - _igv;
                }else{
                    _igv = _subTotal * _TasaIGV;
                    _total = _subTotal + _igv;
                }
                var _SubTotal_Doc = _subTotal, _Total_Doc = _total, _IGV_Doc = _igv;
                var _SubTotal_PEN = 0, _Total_PEN = 0, _IGV_PEN = 0;
                if( _Moneda == 'PEN' ){
                    _SubTotal_PEN   = _SubTotal_Doc;
                    _Total_PEN      = _Total_Doc;
                    _IGV_PEN        = _IGV_Doc;
                }else{
                    _SubTotal_PEN   = _SubTotal_Doc * _TipoCambio;
                    _Total_PEN      = _Total_Doc * _TipoCambio;
                    _IGV_PEN        = _IGV_Doc * _TipoCambio;
                }
                // Detraccion
                var _MontoDetrac = 0;
                if( _dataEncabezado.IdCondPago != 27 ){
                    if( _dataEncabezado.TipoVenta == 'Servicio' )
                    {
                        
                        // Si es una factura diferene a GRATUITO aplicar detraccion ( SIN DECIMALES ) y es servicio
                        if( _Total_Doc > 700 ){
                            _TasaDetrac = _TasaDetraccion;
                            var _tmpDetrac = _Total_Doc * _TasaDetraccion;
                            var _MontoDetrac = Math.round( _tmpDetrac );
                            varDump( `_Total_Doc: ${_Total_Doc} - _MontoDetrac: ${_MontoDetrac}`);
                        }
                    }
                    // Vamos a generar la Couta
                    const _IdNoTipoPago = [ 1 , 28 , 27 , 23 ];
                    if(! _IdNoTipoPago.includes( _dataEncabezado.IdCondPago ) )
                    {
                        // Actualizar la cuota, siempre y cuando sea una cuota.
                        var NroCuotas = await docVentaCuotaModel.count({
                            where : {
                                CodigoHead : _dataEncabezado.Codigo
                            }
                        });
                        var _MontoPagoCuota = _Total_Doc - _MontoDetrac;
                        varDump(`*CUOTA* _Total_Doc : ${_Total_Doc} , _MontoDetrac: ${_MontoDetrac}, _MontoPagoCuota: ${_MontoPagoCuota}`);
                        if( NroCuotas == 1 ){
                            await docVentaCuotaModel.update( { MontoPagoCuota : _MontoPagoCuota },{
                                where : {
                                    CodigoHead : _dataEncabezado.Codigo
                                }
                            });
                        }
                    }
                }
                await docVentasCab.update({
                    SubTotal_PEN: _SubTotal_PEN.toFixed(2),
                    Total_PEN   : _Total_PEN.toFixed(2),
                    IGV_PEN     : _IGV_PEN.toFixed(2),
                    SubTotal_Doc: _SubTotal_Doc.toFixed(2),
                    Total_Doc   : _Total_Doc.toFixed(2),
                    IGV_Doc     : _IGV_Doc.toFixed(2) ,
                    TasaDetrac  : _TasaDetraccion.toFixed(2),
                    MontoDetrac : _MontoDetrac.toFixed(2)
                },{
                    where  : {
                        uu_id : _dataEncabezado.uu_id
                    }
                })
                .catch(function (err) {
                    console.log(`Leven 05`);
                    $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
                });
            }
            _dataEncabezado = await docVentasCab.findOne({
                where : {
                    Codigo : _Codigo
                }
            });
            // Volvemos a dibujar el php
            maxeXML( _dataEncabezado , $response.items , $userData );
        }
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//               VALIDAR ESTADO DOCUMENTO               //
//////////////////////////////////////////////////////////
async function validarEstado( _CodigoHead , _Mod )
{
    // VAMOS A VALIDAR EL ESTADO DEL DOCUMENTO PARA PODER MODIFICAR
    // Solo se modifica si [Estado] es "Activo" y EstadoBznlk es nulo
    _NombreDoc
    varDump(`ValidarEstado: ${_CodigoHead}, _Mod: ${_Mod}`);
    
    var _respuesta = ``;
    var _dataDoc = await docVentasCab.findOne({
        where : {
            TipoDoc : _TipoDocG,
            Codigo   : _CodigoHead
        }
    });
    if( _dataDoc )
    {
        //
        var _Estado = _dataDoc.Estado, _EstadoBznlk = _dataDoc.EstadoBznlk;
        varDump(`_EstadoBznlk: ${_EstadoBznlk}, _Estado: ${_Estado}`);
        if( _EstadoBznlk )
        {
            _respuesta = `El documento ya fue enviado a Bizlinks`;
        }else{
            if(! _Mod.includes( _Estado ) )
            {
                _respuesta = `El documento no se puede modificar`;
            }
        }
        //
    }else{
        _respuesta = `Debe guardar el documento antes de aprobarlo.`;
    }
    return _respuesta;
}
// -------------------------------------------------------
async function validarEstado2( _CodigoHead , _Mod )
{
    // VAMOS A VALIDAR EL ESTADO DEL DOCUMENTO PARA PODER MODIFICAR
    // Solo se modifica si [Estado] es "Activo" y EstadoBznlk es nulo
    _NombreDoc
    
    var _respuesta = ``;
    var _dataDoc = await docVentasCab.findOne({
        where : {
            TipoDoc : _TipoDocG,
            Codigo   : _CodigoHead
        }
    });
    if( _dataDoc )
    {
        //
        var _Estado = _dataDoc.Estado, _EstadoBznlk = _dataDoc.EstadoBznlk;
        if(! _Mod.includes( _Estado ) )
        {
            _respuesta = `El documento no se puede modificar`;
        }
        //
    }else{
        _respuesta = `Debe guardar el documento antes de aprobarlo.`;
    }
    return _respuesta;
}
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CHECK ESTADO DOC                    //
//////////////////////////////////////////////////////////
router.post('/buscar_os', [
    check('IdCli' ,'Seleccione Cliente').not().isEmpty(),
    check('Inicio' ,'Ingrese fecha inicio').not().isEmpty(),
    check('Fin' ,'Ingrese fecha fin').not().isEmpty(),
], async (req,res)=>{
    // IdCli, Inicio, Fin

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    var $response = {};
    $response.estado = 'OK';
    $response.data  = [];
    $response.items = [];
    var _where = {};
    _where.Estado = 'Aprobado';
    _where.IdClienteProv = req.body.IdCli;
    _where.FechaMySQL    = { [Op.gte ]: req.body.Inicio,[Op.lte ]: req.body.Fin };
    _where.IncDocVenta   = 1;
    _where.Facturado     = 'NO';

    console.log( _where );

    var _dataOS = await OSModel.findAll({
        where : _where,
        limit : 200
    });
    $response.data  = _dataOS;
    
    res.json( $response );
});
// -------------------------------------------------------

router.post('/buscar_ot', [
    check('IdCli' ,'Seleccione Cliente').not().isEmpty(),
    check('Inicio' ,'Ingrese fecha inicio').not().isEmpty(),
    check('Fin' ,'Ingrese fecha fin').not().isEmpty(),
], async (req,res)=>{
    // IdCli, Inicio, Fin

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    var $response = {};
    $response.estado = 'OK';
    $response.data  = [];
    $response.items = [];
    var _where = {};
    _where.IdClienteProv = req.body.IdCli;
    _where.FechaMySQL    = { [Op.gte ]: req.body.Inicio,[Op.lte ]: req.body.Fin };

    console.log( _where );

    var _dataOS = await otModel.findAll({
        where : _where,
        limit : 200
    });
    $response.data  = _dataOS;
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  AGREGAR UN CUOTA                    //
//////////////////////////////////////////////////////////
router.post('/couta/add', [
    check('MontoPagoCuota' ,'Ingrese un monto').not().isEmpty(),
    check('FechaPagoCuota' ,'Ingrese fecha').not().isEmpty()
] ,async (req,res)=>{
    // form
    var $response = {};
    $response.estado = 'OK';
    $response.data  = [];
    $response.items = [];

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    var _dataHead = await docVentasCab.findOne({
        where : {
            uu_id : req.body.Token
        }
    });
    if( _dataHead )
    {
        var _TipoVenta = _dataHead.TipoVenta;
    }

    // El monto actual supera la cuota ya acumulada?
    var _MontoPagoCuota = parseFloat( req.body.MontoPagoCuota );
    var _AcumuladoCuota = await docVentaCuotaModel.sum('MontoPagoCuota', { 
        where: { 
            Token : req.body.Token
        } 
    });
    var _tmpAcumulado = _MontoPagoCuota + _AcumuladoCuota;

    if( _MontoPagoCuota ){
        //
    }

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
async function renovarToken()
{
    var length = 35;
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
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular','Iniciales'],
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
async function inicialesUsuario( _dni )
{
    // Tiene Iniciales en modelo User
    var _Iniciales = ``, $nombre = ``, $texto = ``;
    var _Usuario = await User.findOne({
        where : {
            dni : _dni
        }
    });
    if( _Usuario )
    {
        $nombre = _Usuario.name;
        if( _Usuario.Iniciales )
        {
            _Iniciales = _Usuario.Iniciales;
        }
    }
    console.log(`Iniciales de: ${$nombre} - ${_Iniciales}.`);
    if(! _Iniciales )
    {
        var $name = $nombre;
        var $arTextos = $name.split(' ');
        console.log($arTextos);
        var $ArIniciales = [];

        for (let index = 0; index < $arTextos.length; index++) {
            const element = $arTextos[index];
            var str = element;
            if( element != '' ){
                var res = str.substring(0,1);
                $ArIniciales.push( res );
            }
        }
        //
        _Iniciales = $ArIniciales.join('');
    }
    return _Iniciales;
}
// -------------------------------------------------------
async function revisaRazon( _texto )
{
    console.log(`>>> ${_texto}`);
    var text = _texto;
    var txt1 = text.replace( '&' , '&#38;' );
    var txt2 = txt1.replace("<", "&#60;");
    var txt3 = txt2.replace(">", "&#62;");
    var txt4 = txt3.replace("'", "&#39;");
    var txt5 = txt4.replace('"', "&#34;");
    console.log(`<<< ${txt5}`);
    return txt5.trim();
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
async function maxeXML( _Data , _Det , $userData )
{
    var _userData = $userData;
    // Data de las cuotas.
    var _Coutas = await docVentaCuotaModel.findAll({
        where : {
            CodigoHead : _Data.Codigo
        }
    });
    // _NombreDoc
    var _Archivo = `${_Data.Serie}-${_Data.Correlativo}.php`;
    var _archivoSigned = `txt-${_Data.Serie}-${_Data.Correlativo}.txt`;
    var _emailCliente = _Data.CorreoEnvio, _createdAt = _Data.createdAt, _DirCliente = ``, _Horacreado = ``;
    console.log('>>>>> creado'+_createdAt);
    if( _createdAt ){
        _Horacreado = moment( _createdAt ).format('HH:mm:ss');
    }
    // Letra a numero
    var _text = _Data.MontoLetras.trim();
    var _MontoLetras = _text.toUpperCase();
    // Monto neto pendiente, dependiendo si es servicio o no se aplicará la detraccion
    var _MontoNetoPendiente = 0;

    // Codigo de la detraccion
    var _codigoDetraccion = `012`;
    switch( _Data.UndNegocio )
    {
        case 'Saneamiento':
            _codigoDetraccion = `022`;
        break;
        case 'Limpieza':
            _codigoDetraccion = `012`;
        break;
        case 'SS.GG.':
            _codigoDetraccion = `012`;
        break;
    }
    if( _Data.UndNegocio == 'Saneamiento' ){}

    // es ruc o dni¿?
    var _TipoDocCli = 1, _IdCliente = await pad_with_zeroes( _Data.IdCliente , 8 );
    if( _Data.IdCliente > 99999999 ){
        _TipoDocCli = 6;
        _IdCliente = await pad_with_zeroes( _Data.IdCliente , 11 );
    }
    // Razon social con FIX
    var _RazonSocialCli = await revisaRazon( _Data.Cliente );
    var _Moneda = _Data.Moneda;
    var _Total      = parseFloat(_Data.Total_PEN).toFixed(2);
    var _SubTotal   = parseFloat( _Data.SubTotal_PEN ).toFixed(2);
    var _igv        = parseFloat( _Data.IGV_PEN ).toFixed(2);
    var _MontoDetrac   = parseFloat( _Data.MontoDetrac ).toFixed(2);
    var _PerDetraccion = parseFloat( _Data.TasaDetrac ).toFixed(2) * 100;
    //
    if( _Data.Moneda != 'PEN' )
    {
        _Total      = parseFloat( _Data.Total_Doc ).toFixed(2);
        _SubTotal   = parseFloat( _Data.SubTotal_Doc ).toFixed(2);
        _igv        = parseFloat( _Data.IGV_Doc ).toFixed(2);
    }
    var _totalSUM_IGV = ``, _PerDetraccion = _TasaDetraccion * 100;
    // }}}}}}}}}}}}}

//Campos adicionales
var _OrdenCompra  = ``, _NroCert = ``, _NroGuia = ``, _NroHES = ``;
if( _Data.OrdenCompra ){
    _OrdenCompra  = `<ordenCompra>${_Data.OrdenCompra}</ordenCompra>`;
}
// TODO:Falta que me den el codigo de cada campo / 9275
if( _Data.NroCert ){
    _NroCert  = `<codigoAuxiliar40_2>9275</codigoAuxiliar40_2>
<textoAuxiliar40_2>${_Data.NroCert}</textoAuxiliar40_2>`;
}
// 
if( _Data.NroGuia ){
    _NroGuia  = `<codigoAuxiliar100_5>9178</codigoAuxiliar100_5>
<textoAuxiliar100_5>${_Data.NroGuia}</textoAuxiliar100_5>`;
}
var _HES = _Data.NroHES;
_HES = _HES.trim();
if( _HES ){
    _NroHES  = `<codigoAuxiliar40_2>8301</codigoAuxiliar40_2>
<textoAuxiliar40_2>${_Data.NroHES}</textoAuxiliar40_2>`;
}

var _SignOnLineCmd = `
<SignOnLineCmd declare-direct-sunat="1" output="PDF">
    <parameter value="20102187211" name="idEmisor"/>
    <parameter value="01" name="tipoDocumento"/>
    <documento>




<correoEmisor>-</correoEmisor>
<correoAdquiriente>-</correoAdquiriente>

<numeroDocumentoEmisor>20102187211</numeroDocumentoEmisor>
<tipoDocumentoEmisor>6</tipoDocumentoEmisor>
<tipoDocumento>01</tipoDocumento>
<razonSocialEmisor>SALUBRIDAD SANEAMIENTO AMBIENTAL Y SERVICIOS S.A.C.</razonSocialEmisor>
<nombreComercialEmisor>SSAYS</nombreComercialEmisor>

<serieNumero>${_Data.Serie}-${_Data.Correlativo}</serieNumero>
<fechaEmision>${_Data.FechaEmision}</fechaEmision>
<horaEmision>${_Horacreado}</horaEmision>

<ubigeoEmisor>150121</ubigeoEmisor>
<direccionEmisor>PJ. GRAL VIVANCO NRO. 100</direccionEmisor>
<urbanizacion>Pueblo Libre</urbanizacion>
<departamentoEmisor>LIMA</departamentoEmisor>
<provinciaEmisor>LIMA</provinciaEmisor>
<distritoEmisor>Pueblo Libre</distritoEmisor>
<paisEmisor>PE</paisEmisor>

<!-- ### BCP ### -->
<codigoAuxiliar100_1>9142</codigoAuxiliar100_1>
<textoAuxiliar100_1>${_Data.BancoCredito}</textoAuxiliar100_1>

<!-- ### SCOTIABANK ### -->
<codigoAuxiliar100_2>9156</codigoAuxiliar100_2>
<textoAuxiliar100_2>${_Data.BancoScotia}</textoAuxiliar100_2>

<!-- ### BBVA ### -->
<codigoAuxiliar100_3>9184</codigoAuxiliar100_3>
<textoAuxiliar100_3>${_Data.BancoBBVA}</textoAuxiliar100_3>
<!-- ### O/C ### -->
${_OrdenCompra}
<!-- ### CERTFICADO ### -->
${_NroCert}
<!-- ### GUIA¿? ### -->
${_NroGuia}
<!-- ### HES ### -->
${_NroHES}
<!-- ### COND VENTA ### -->
<codigoAuxiliar100_7>9416</codigoAuxiliar100_7>
<textoAuxiliar100_7>${_Data.CondPago}</textoAuxiliar100_7>
<!-- ### EMISOR ### -->
<codigoAuxiliar40_3>9278</codigoAuxiliar40_3>
<textoAuxiliar40_3>${_Data.Emisor}</textoAuxiliar40_3>
<!-- ### AUTORIZACION ### -->
<codigoAuxiliar500_4>9804</codigoAuxiliar500_4>
<textoAuxiliar500_4>${_Data.Autorizacion}</textoAuxiliar500_4>
<!-- ### MONTO LETRAS ### -->
<codigoLeyenda_1>1000</codigoLeyenda_1>
<textoLeyenda_1>${_MontoLetras}</textoLeyenda_1>
<!-- ### IGV PER ### -->
<codigoAuxiliar40_1>9011</codigoAuxiliar40_1>
<textoAuxiliar40_1>18%</textoAuxiliar40_1>


<numeroDocumentoAdquiriente>${_IdCliente}</numeroDocumentoAdquiriente>
<tipoDocumentoAdquiriente>${_TipoDocCli}</tipoDocumentoAdquiriente>
<razonSocialAdquiriente>${_RazonSocialCli}</razonSocialAdquiriente>
<tipoMoneda>${_Moneda}</tipoMoneda>



`;
// ############# GRATUITA ¿? #############
if( _Data.IdCondPago == 27 ){

    _SignOnLineCmd += `<totalTributosOpeGratuitas>${_igv}</totalTributosOpeGratuitas>
<totalValorVentaNetoOpGratuitas>${_SubTotal}</totalValorVentaNetoOpGratuitas>
<totalIgv>0.00</totalIgv>
<totalImpuestos>0.00</totalImpuestos>
<totalVenta>0.00</totalVenta>
<totalPrecioVenta>0.00</totalPrecioVenta>
<totalValorVenta>0.00</totalValorVenta>
<codigoLeyenda_2>1002</codigoLeyenda_2>
<textoLeyenda_2>TRANSFERENCIA GRATUITA DE UN BIEN Y/O SERVICIO PRESTADO GRATUITAMENTE</textoLeyenda_2>
`;
}else{
    _SignOnLineCmd += `<totalValorVentaNetoOpGravadas>${_SubTotal}</totalValorVentaNetoOpGravadas>
<totalIgv>${_igv}</totalIgv>
<totalImpuestos>${_igv}</totalImpuestos>
<totalVenta>${_Total}</totalVenta>
<totalPrecioVenta>${_Total}</totalPrecioVenta>
<totalValorVenta>${_SubTotal}</totalValorVenta>
`;
}
if( _Data.TipoVenta == 'Servicio' ){
// ############# DETRACCION #############
if( _Total > 700 && _Data.IdCondPago != 27 ){
    _SignOnLineCmd += `<codigoDetraccion>${_codigoDetraccion}</codigoDetraccion>
<porcentajeDetraccion>${_PerDetraccion}</porcentajeDetraccion>
<totalDetraccion>${_MontoDetrac}</totalDetraccion>
<numeroCtaBancoNacion>${_Data.BancoNacion}</numeroCtaBancoNacion>
<codigoLeyenda_2>2006</codigoLeyenda_2>
<textoLeyenda_2>Operación sujeta a detracción</textoLeyenda_2>
<formaPago>005</formaPago>
<tipoOperacion>1001</tipoOperacion>
`;
}else{
    _SignOnLineCmd += `<tipoOperacion>0101</tipoOperacion>`;
}
// ############# DETRACCION #############
}
else{
    _SignOnLineCmd += `<tipoOperacion>0101</tipoOperacion>`;
}
var _urbanizacionAdquiriente = _Data.urbanizacionAdquiriente.trim();
_SignOnLineCmd += `

<codigoLocalAnexoEmisor>0000</codigoLocalAnexoEmisor>

<direccionAdquiriente>${_Data.Direccion.trim()}</direccionAdquiriente>
<ubigeoAdquiriente>${_Data.ubigeoAdquiriente.trim()}</ubigeoAdquiriente>
<urbanizacionAdquiriente>${_urbanizacionAdquiriente.substring(1, 24)}</urbanizacionAdquiriente>
<provinciaAdquiriente>${_Data.provinciaAdquiriente.trim()}</provinciaAdquiriente>
<departamentoAdquiriente>${_Data.departamentoAdquiriente.trim()}</departamentoAdquiriente>
<distritoAdquiriente>${_Data.distritoAdquiriente.trim()}</distritoAdquiriente>
<paisAdquiriente>${_Data.paisAdquiriente.trim()}</paisAdquiriente>

`;
// ############## DETALLE DE
var _NroItem = 1, _dataDetalle = ``;
for (let d = 0; d < _Det.length; d++) {
    const rsd = _Det[d];
    var _Item_PrecioUnit = parseFloat(rsd.PrecioUnit).toFixed(2);
    var _Item_IgvUnit    = parseFloat(rsd.IgvUnit).toFixed(2);
    var _Item_ValorUnit  = parseFloat(rsd.ValorUnit).toFixed(2);
    
    var _importeTotalSinImpuesto = parseFloat( parseFloat(rsd.Cantidad) * _Item_ValorUnit ).toFixed(2);
    var _InfoAdic01 = rsd.InfoAdic01;
    var _subTexto = ``;
    var _CodigoProd = ``, _codigoProductoSUNAT = `76111501`;
    if( _Data.TipoVenta == 'Servicio' ){
        if( rsd.NroOS )
        {
            _CodigoProd = `OS-${rsd.NroOS}`;
        }
        if( rsd.ConjOS ){
            _CodigoProd = `COS-${rsd.ConjOS}`;
        }
        if(! _CodigoProd ){
            _CodigoProd = 84000000;
        }
        var _descri1 = rsd.Descripcion;
        var _descri2 = `POR ${rsd.Servicio}-`+_descri1.replace("\n"," ");
    }else{
        // Si es venta de producto va el id de producto de detalle¿? //:TODO
        _CodigoProd = `${rsd.IdProducto}`;
        _codigoProductoSUNAT = `${rsd.IdProducto}`;
        var _descri1 = rsd.Descripcion;
        var _descri2 = _descri1.replace("\n"," ");
    }
    // Hay sub texto¿?
    if( _InfoAdic01 ){
        _subTexto = `<codigoAuxiliar500_1>9056</codigoAuxiliar500_1><textoAuxiliar500_1>${_InfoAdic01}</textoAuxiliar500_1>`;
    }
    if( _Data.IdCondPago == 27 )
    {
        // GRATUITA importeReferencial
        _SignOnLineCmd += `<item>
        <numeroOrdenItem>${_NroItem}</numeroOrdenItem>
        <codigoProducto>${_CodigoProd}</codigoProducto>
        <codigoProductoSUNAT>${_codigoProductoSUNAT}</codigoProductoSUNAT>
        <unidadMedida>ZZ</unidadMedida>
        <descripcion>${_descri2.trim()}</descripcion>${_subTexto}
        
        <cantidad>${rsd.Cantidad}</cantidad>
        <!-- ### ESTE ES EL IMPORTE QUE SE VA A MULTIPLICAR POR LA CANTIDAD ### -->
        <importeReferencial>${parseFloat(rsd.ImporteTotalSinImpuesto).toFixed(2)}</importeReferencial>
        <!-- ### IGV ### -->
        <importeTotalImpuestos>${parseFloat(rsd.ImporteTotalImpuestos).toFixed(2)}</importeTotalImpuestos>
        <!-- ### MONTO OP GRATUITA ### -->
        <montoBaseIgv>${parseFloat(rsd.MontoBaseIgv).toFixed(2)}</montoBaseIgv>
        <tasaIgv>18.00</tasaIgv>
        <!-- ### IGV ### -->
        <importeIgv>${parseFloat(rsd.ImporteIgv).toFixed(2)}</importeIgv>
        <!-- ### cantidad x importeReferencial  ### -->
        <importeTotalSinImpuesto>${_importeTotalSinImpuesto}</importeTotalSinImpuesto>
        
        <importeUnitarioSinImpuesto>0.00</importeUnitarioSinImpuesto>
        <importeUnitarioConImpuesto>0.00</importeUnitarioConImpuesto>
        <codigoImporteReferencial>02</codigoImporteReferencial>
        <codigoRazonExoneracion>11</codigoRazonExoneracion>
        <codigoImporteUnitarioConImpuesto>01</codigoImporteUnitarioConImpuesto>
        </item>
        `;
    }else{
        // ONEROSA | importeIgv
        _SignOnLineCmd += `<item>
        <numeroOrdenItem>${_NroItem}</numeroOrdenItem>
        <codigoProducto>${_CodigoProd}</codigoProducto>
        <codigoProductoSUNAT>${_codigoProductoSUNAT}</codigoProductoSUNAT>
        <descripcion>${_descri2}</descripcion>${_subTexto}
        
        <cantidad>${rsd.Cantidad}</cantidad>
        <unidadMedida>ZZ</unidadMedida>
        <importeTotalSinImpuesto>${parseFloat(rsd.ImporteTotalSinImpuesto).toFixed(2)}</importeTotalSinImpuesto>
        <importeUnitarioSinImpuesto>${parseFloat(rsd.ImporteUnitarioSinImpuesto).toFixed(2)}</importeUnitarioSinImpuesto>
        <importeUnitarioConImpuesto>${parseFloat(rsd.ImporteUnitarioConImpuesto).toFixed(2)}</importeUnitarioConImpuesto>
        <codigoImporteUnitarioConImpuesto>01</codigoImporteUnitarioConImpuesto>
        <montoBaseIgv>${parseFloat(rsd.MontoBaseIgv).toFixed(2)}</montoBaseIgv>
        <tasaIgv>18.00</tasaIgv>
        <importeIgv>${parseFloat(rsd.ImporteIgv).toFixed(2)}</importeIgv>
        <importeTotalImpuestos>${parseFloat(rsd.ImporteTotalImpuestos).toFixed(2)}</importeTotalImpuestos>
        <codigoRazonExoneracion>10</codigoRazonExoneracion>
        </item>
        `;
    }
    _NroItem++;
}

// - //

_SignOnLineCmd += `

<montoNetoPendiente>${parseFloat(_Data.MontoNetoPendiente).toFixed(2)}</montoNetoPendiente>
<formaPagoNegociable>${_Data.FormaPagoNegociable}</formaPagoNegociable>

`;

if( parseInt( _Data.FormaPagoNegociable ) == 1 )
{
    if( _Coutas.length == 1 )
    {
        // Una sola cuota
        _SignOnLineCmd += `<montoPagoCuota1>${parseFloat(_Data.MontoNetoPendiente).toFixed(2)}</montoPagoCuota1>
        <fechaPagoCuota1>${_Coutas[0].FechaPagoCuota}</fechaPagoCuota1>`;
    }else{
        // Varias cuotas
        for (let index = 0; index < _Coutas.length; index++) {
            var rsC = _Coutas[index];
            var _NroCuota = rsC.NroCuota;
            _SignOnLineCmd += `<montoPagoCuota${_NroCuota}>${parseFloat(rsC.MontoPagoCuota).toFixed(2)}</montoPagoCuota${_NroCuota}>
        <fechaPagoCuota${_NroCuota}>${rsC.FechaPagoCuota}</fechaPagoCuota${_NroCuota}>`;
        }
    }
}

_SignOnLineCmd += `

    </documento>
</SignOnLineCmd>
`;

// Guardamos el signed enviado
await docVentasCab.update({ SignOnLineCmd : _SignOnLineCmd },{
    where : { 
        uu_id : _Data.uu_id 
    }
})
.catch(function (err) {
    captueError( err.original );
    console.log(_NombreDoc);
    $response.estado = 'ERROR';
    $response.error  = err;
    res.json( $response );
});

var _dataEscribe = `<?php 
#$dataFromTheForm = $_POST['fieldName']; // request data from the form
$soapUrl = "${_SOAP_URL}"; // asmx URL of WSDL
$soapUser = "${_SOAP_USER}";  //  username
$soapPassword = "${_SOAP_PASSWD}"; // password

// xml post structure

$xml_post_string = '
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.ce.ebiz.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <ws:invoke>
		<!--Optional:-->

<command>
<![CDATA[
    ${_SignOnLineCmd}
]]>
</command>

      </ws:invoke>
   </soapenv:Body>
</soapenv:Envelope>
';


$headers = array(
    'Content-type: text/xml;charset="utf-8"',
    "Accept: text/xml",
    "Cache-Control: no-cache",
    "Pragma: no-cache",
    "SOAPAction: http://testing.bizlinks.com.pe/integrador21/ws/invoker?wsdl", // your op URL
    "Content-length: ".strlen($xml_post_string),
);

$url = $soapUrl;

// PHP cURL  for https connection with auth
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, $soapUser.":".$soapPassword); // username and password - declared at the top of the doc
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
curl_setopt($ch, CURLOPT_TIMEOUT, 59);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml_post_string); // XML REQUEST
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// converting
$response = curl_exec($ch); 
curl_close($ch);

#echo $response;
#echo '["OK"]';

// >>>>>>>>>>>>>>>>>>>>>>>>>>
$textoXML1 = str_replace( "&lt;" , "<" , $response );
$textoXML2 = str_replace( "&gt;" , ">" , $textoXML1 );

$textoXML3 = str_replace( '<?xml version="1.0" encoding="utf-8"?>' , '' , $textoXML2 );
$textoXML4 = str_replace( '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' , '' , $textoXML3 );
$textoXML5 = str_replace( "<soapenv:Body>" , "" , $textoXML4 );
$textoXML6 = str_replace( '<ns2:invokeResponse xmlns:ns2="http://ws.ce.ebiz.com/">' , '' , $textoXML5 );
$textoXML7 = str_replace( "<return>" , "" , $textoXML6 );
$textoXML8 = str_replace( "</ns2:invokeResponse>" , "" , $textoXML7 );
$textoXML9 = str_replace( "</soapenv:Body>" , "" , $textoXML8 );
$textoXML10= str_replace( "</soapenv:Envelope>" , "" , $textoXML9 );
$textoXML11= str_replace( "</return>" , "" , $textoXML10 );

// Escribir XML
$myfile = fopen("${_RUTA_XML}${_Data.Serie}-${_Data.Correlativo}.xml", "w") or die("${_Data.Serie}-${_Data.Correlativo}.xml no encontrado");
fwrite($myfile, $textoXML11);
fclose($myfile);
// Agregar al TXT de resultado
#$myfile = fopen("${_RUTA_XML}${_archivoSigned}", "a+") or die("${_archivoSigned} no encontrado");
#fwrite($myfile, "############################ RESULTADO DEL ENVIO ############################" . PHP_EOL);
#fwrite($myfile, $textoXML11);
#fclose($myfile);

# Colocar resultado #
$servername = "${process.env.DB_host}"; $username = "${process.env.DB_user}"; $password = "${process.env.DB_password}"; $dbname = "${process.env.DB_database}";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$sql = "UPDATE orq_doc_ventas_cab SET ResultadoXML = '$textoXML11' WHERE uu_id = '${_Data.uu_id}'";
if ($conn->query($sql) === TRUE) {
  echo "<span>Record updated successfully</span>";
} else {
  echo "<span>Error updating record: " . $conn->error."</span>";
}

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SSAYS</title>
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" rel="stylesheet">
    <style type="text/css">
    h1,p,div,th,a,td{
        font-family: 'Montserrat', sans-serif;
    }
    </style>
  </head>
  <body>
    <div id="chat-container" style="display:none;" >
    <textarea  id="resultxml" class=" form-control " ><?php echo $textoXML11;?></textarea>
    <div id="chat-window ">
    <div id="output"></div>
    <div id="actions"></div>
    </div>
    <input type="text" id="username" value="${_userData.name}" >
    <input type="text" id="message"  value="ID:${_userData.dni}" >
    <button id="send" >Enviarsh</button>
    </div>

    <h1>Generando doc: ${_Data.Serie}-${_Data.Correlativo}</h1>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js" ></script>
    <script src="https://tecnico.ssays-orquesta.com/js/chat.js" ></script>
    <script src="https://ejecutivo.ssays-orquesta.com/js/node_orq3.js" ></script>
    <script>
    var $nomU = '${_userData.name}', $dniU = '${_userData.dni}';
    // ******* NODE JS *******
    socket.emit('emitir_doc_ventas',{
        user : $nomU,
        msg  : '${_Data.Serie}-${_Data.Correlativo}',
        dni  : $dniU
    });
    // ******* NODE JS *******

    </script>
  </body>
</html>
`;
    // Escribimos el archivo.
    fs.writeFileSync( _RUTA_XML+"/"+_Archivo , _dataEscribe );
    // Escribmos el arhivo SingOnLineCmd
    fs.writeFileSync( _RUTA_XML+"/"+_archivoSigned , _SignOnLineCmd );
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
function varDump( _t )
{
    console.log( _t );
}
// -------------------------------------------------------
// -------------------------------------------------------


module.exports = router;


