// api_NotaCredito.js
var _NombreDoc = `api_NotaCredito`, _TipoDocG = `NC`;

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
const { OSModel,conjuntoOSModel, otModel, docVentasCab231, docVentasDet231 } = require('../../db31');
const { docVentaCuotaModel, docVentasCab, User, docVentasDet, sistemasModel, clienteModel, seriesDocModel, departamentoModel, provinciaModel, distrito2Model } = require('../../db');

var _TasaIGV = 0.18;

// XML
const _RUTA_XML = process.env.RUTA_XML;
const _SOAP_URL = process.env.SOAP_URL;
const _SOAP_USER = process.env.SOAP_USER;
const _SOAP_PASSWD = process.env.SOAP_PASSWD;

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
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // corr, cli, inic, fin, estadodoc, estadoprov, usuariomod, facturas, tdocafect, docafecto
    var $response    = {};
    $response.estado = 'OK';
    $response.data   = [];
    var $where       = {};
    $where.TipoDoc   = _TipoDocG;

    // Si buscamos por facturas.
    if( req.body.docafecto != '' )
    {
        var $ids = req.body.docafecto, arrCorrs = [];
		var $arIds = $ids.split(',');
        for (let index = 0; index < $arIds.length; index++) {
            const rs = $arIds[index];
            var _Codigo = await pad_with_zeroes( rs , 8 );
            arrCorrs.push( _Codigo );
        }
        console.log( arrCorrs );
        //
        $response.data = await docVentasCab.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where: {
		        CorrelativoAfectado : { [Op.in] : arrCorrs },
                TipoDocAfectado : req.body.tdocafect
		    },
        });
        //
    }else{
        // Buscamos por otros datos.
        if( req.body.corr != '' )
        {
            // Buscamos por Correlativos | pad_with_zeroes
            var $ids = req.body.corr, arrCorrs = [];
            var $arIds = $ids.split(',');
            for (let index = 0; index < $arIds.length; index++) {
                const rs = $arIds[index];
                var _Codigo = await pad_with_zeroes( rs , 8 );
                arrCorrs.push( _Codigo );
            }
            console.log( arrCorrs );
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
            // Usuario mod
            if( req.body.usuariomod )
            {
                $where.IdUsuarioMod = req.body.usuariomod;
            }
            varDump( $where );
            //
            $response.data = await docVentasCab.findAll({
                order : [
                    ['Codigo' , 'DESC']
                ],
                where : $where
            });
        }
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
    check('CorrelativoAfectado' ,'Seleccione un documento.').not().isEmpty(),
    check('MotivoAfectado' ,'Ingrese un motivo.').not().isEmpty(),
    check('MotivoNC' ,'Ingrese un Motivo de Nota de crédito.').not().isEmpty(),
    check('FechaEmision' ,'Fecha de emisión.').not().isEmpty()
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	// Fecha
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    var _DataDoc;
    var _dataCli;
    if( req.body.Flag == 'ORQ3' )
    {
        _DataDoc = await docVentasCab.findOne({
            where : {
                TipoDoc : req.body.TipoDocAfectado ,
                Serie   : req.body.SerieAfectado ,
                Correlativo : req.body.CorrelativoAfectado
            }
        });
    }else{
        _DataDoc = await docVentasCab231.findOne({
            where : {
                TipoDocumento : req.body.TipoDocAfectado ,
                Serie   : req.body.SerieAfectado ,
                Correlativo : req.body.CorrelativoAfectado
            }
        });
    }
        
    if( _DataDoc )
    {
        if( req.body.Flag == 'ORQ3' ){
            _dataCli = await clienteModel.findOne({
                where : {
                    IdClienteProv : _DataDoc.IdCliente
                }
            });
        }else{
            _dataCli = await clienteModel.findOne({
                where : {
                    IdClienteProv : _DataDoc.IdClienteProv
                }
            });
        }
            
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        var _IncIGV = _DataDoc.IncIGV , _TasaIGV = _DataDoc._TasaIGV , _TipoCambio = req.body.TipoCambio, _Moneda = req.body.Moneda;
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Auditoria
        req.body.IdUsuarioMod   = $userData.dni;
        req.body.UsuarioMod     = $userData.name;
        req.body.Estado         = 'Activo';
        // Serie y correlativo
        var _TipoDocAfectado = req.body.TipoDocAfectado;
        if( _TipoDocAfectado == 'B' )
        {
            // Si es una NC aplicada a Boleta tomaremos el ultimo correlativo
            var _Corr = await docVentasCab.max( 'Correlativo', { 
                where: { 
                    TipoDocAfectado : 'B' ,
                    TipoDoc : 'NC'
                } 
            });
            _Corr = parseInt( _Corr ) + 1;
            varDump(`Ultimo correlativo de NC a boleta: ${_Corr}.`);
            req.body.Correlativo = await pad_with_zeroes(_Corr,8);
        }else{
            // BUSCAMOS LA UTIMA SERIE EN BD
            var _serieDoc = await seriesDocModel.findOne({
                attributes: ['IdSerieDoc','Serie', 'UltCorrelativo'],
                where : {
                    IdTipoDoc : 16
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
        }
        //
        req.body.TipoDoc = _TipoDocG;
        if( req.body.Flag == 'ORQ3' )
        {
            req.body.IdCliente = _DataDoc.IdCliente;
            req.body.Cliente = _DataDoc.Cliente;
            req.body.Direccion          = _DataDoc.Direccion;
            req.body.ubigeoAdquiriente  = _DataDoc.ubigeoAdquiriente;
            req.body.urbanizacionAdquiriente = _DataDoc.urbanizacionAdquiriente;
            req.body.departamentoAdquiriente = _DataDoc.departamentoAdquiriente;
            req.body.provinciaAdquiriente    = _DataDoc.provinciaAdquiriente;
            req.body.distritoAdquiriente     = _DataDoc.distritoAdquiriente;
            req.body.paisAdquiriente         = _DataDoc.paisAdquiriente;
            req.body.IdCondPago = _DataDoc.IdCondPago;
            req.body.CondPago   = _DataDoc.CondPago;
            req.body.IdCtaConta = _DataDoc.IdCtaConta;
            req.body.CtaConta   = _DataDoc.CtaConta;
            req.body.IdVendedor = _DataDoc.IdVendedor;
            req.body.Vendedor   = _DataDoc.Vendedor;
            req.body.IdTipAfect = _DataDoc.IdTipAfect;
            req.body.TipAfect   = _DataDoc.TipAfect;
            req.body.TasaIGV    = _DataDoc.TasaIGV;
            req.body.Glosa      = _DataDoc.Glosa;
            //req.body.FechaEmision   =  moment().format('YYYY-MM-DD');
            req.body.UndNegocio     = _DataDoc.UndNegocio;
            req.body.IdMoneda       = _DataDoc.IdMoneda;
            req.body.Moneda         = _DataDoc.Moneda;
            req.body.IncIGV         = _DataDoc.IncIGV;

            req.body.CorreoEnvio    = _DataDoc.CorreoEnvio;
            req.body.BancoNacion    = _DataDoc.BancoNacion;
            req.body.BancoCredito   = _DataDoc.BancoCredito;
            req.body.BancoScotia    = _DataDoc.BancoScotia;
            req.body.BancoBBVA      = _DataDoc.BancoBBVA;
            req.body.Autorizacion   = _DataDoc.Autorizacion;
            req.body.Emisor         = _DataDoc.Emisor;
            // Vamos a colocar el Emisor
            var _Facty = $userData.name, _UndNegocio = _DataDoc.UndNegocio, _Vended = _DataDoc.Vendedor;
            var _Facturador = await inicialesUsuario( _Facty );
            var _Vendedor = await inicialesUsuario( _Vended );
            req.body.Emisor = `${_Vendedor}-${_Facturador}-${_UndNegocio}`;
            // 999999999999999999999999999999999999999999999999999
        }else{
            // 999999999999999999999999999999999999999999999999999
            
            req.body.IdCliente = _DataDoc.IdClienteProv;
            req.body.Cliente = _DataDoc.nombre_cliente;
            req.body.Direccion          = _DataDoc.Direccion;
            req.body.ubigeoAdquiriente  = _DataDoc.idUbigeo;
            req.body.urbanizacionAdquiriente = _dataCli.Urbanizacion;
            req.body.departamentoAdquiriente = _dataCli.NombreDepartamento;
            req.body.provinciaAdquiriente    = _dataCli.NombreProvincia;
            req.body.distritoAdquiriente     = _dataCli.Urbanizacion;
            req.body.paisAdquiriente         = _dataCli.Pais;
            req.body.IdCondPago = _DataDoc.IdTipoPago;
            req.body.CondPago   = _DataDoc.nombre_tipopago;
            req.body.IdCtaConta = _DataDoc.IdCuenta;
            req.body.CtaConta   = _DataDoc.nombre_cuenta;
            req.body.IdVendedor = _DataDoc.RepComercial;
            req.body.Vendedor   = _DataDoc.nombre_repcomercial;
            //req.body.IdTipAfect = _DataDoc.IdTipAfect;
            //req.body.TipAfect   = _DataDoc.TipAfect;
            req.body.TasaIGV    = 0.18;
            req.body.Glosa      = _DataDoc.Glosa;
            //req.body.FechaEmision   =  moment().format('YYYY-MM-DD');
            //req.body.UndNegocio     = _DataDoc.UndNegocio;
            req.body.IdMoneda       = _DataDoc.IdMoneda;
            if( parseInt(_DataDoc.IdMoneda) == 1 ){
                req.body.Moneda         ='PEN';
            }else{
                req.body.Moneda         ='USD';
            }
            req.body.IncIGV         = _DataDoc.IncIGV;

            if( _dataCli.Email ){
                req.body.CorreoEnvio = _dataCli.Email;
            }else{
                req.body.CorreoEnvio = '-';
            }
            req.body.BancoNacion    = _DataDoc.NotaBancos;
            req.body.BancoCredito   = _DataDoc.TextoAuxiliar100_1;
            req.body.BancoScotia    = _DataDoc.TextoAuxiliar100_2;
            req.body.BancoBBVA      = _DataDoc.TextoAuxiliar100_3;
            req.body.Autorizacion   = _DataDoc.Autorizaciones;
            //var _ggg = await inicialesUsuario( $userData.dni );
            //req.body.Emisor         = _DataDoc.Usuemisor;
            // Vamos a colocar el Emisor
            var _Facty = $userData.name, _UndNegocio = req.body.UndNegocio, _Vended = req.body.Vendedor;
            var _Facturador = await inicialesUsuario( $userData.dni );
            var _Vendedor = await inicialesUsuario( _DataDoc.RepComercial );
            req.body.Emisor = `${_Vendedor}-${_Facturador}-${_UndNegocio}`;
        }
            
        //
        await docVentasCab.create( req.body )
        .catch(function (err) {
            varDump(err);
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
            if( req.body.TipoDocAfectado == 'F' )
            {
                //
                await seriesDocModel.update({
                    UltCorrelativo : _Corr
                },{
                    where : {
                        IdSerieDoc : _serieDoc.IdSerieDoc
                    }
                });
                //
            }
            //
            var _Codigo = await pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'NC'+_Codigo;
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
            // Unir con cuotas
            await docVentaCuotaModel.update({
                CodigoHead : _Codigo
            },{
                where : {
                    Token : req.body.uu_id
                }
            });
            // Calcular montos.
            var _dataDetalle = await docVentasDet.findOne({ 
                where: {
                    CodigoHead : _Codigo
                } 
            })
            .catch(function (err) {
                console.log(`Leven 04 | `+err.original.sqlMessage);
                $response.estado = 'ERROR';$response.error = err.original.sqlMessage;res.json( $response );
            });
            varDump(`SubTotal_PEN: ${_dataDetalle.ValorUnit}, Total_PEN: ${_dataDetalle.PrecioUnit}, IGV_PEN : ${_dataDetalle.IgvUnit}`);
            if( _dataDetalle ){
                await docVentasCab.update({
                    SubTotal_PEN: _dataDetalle.ImporteTotalSinImpuesto,
                    Total_PEN   : _dataDetalle.ImporteUnitarioConImpuesto,
                    IGV_PEN     : _dataDetalle.ImporteTotalImpuestos,
                    SubTotal_Doc: _dataDetalle.ImporteTotalSinImpuesto,
                    Total_Doc   : _dataDetalle.ImporteUnitarioConImpuesto,
                    IGV_Doc     : _dataDetalle.ImporteTotalImpuestos
                },{
                    where  : {
                        uu_id : req.body.uu_id
                    }
                })
                .catch(function (err) {
                    console.log(`Leven 05`);
                    $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
                });
            }
        }
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
    $response.doc = [];

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
        var _totalDet = await docVentasDet.sum('Total',{ 
            where: {
                Token : _Entidad.uu_id
            }
        });
        $response.total = _totalDet;
        var _Corr = await pad_with_zeroes( _Entidad.CorrelativoAfectado , 8 );
        var _whereCab = {};
        //
        if( _Entidad.Flag == 'ORQ3' )
        {
            // Doc ORQ3
            _whereCab = {
                TipoDoc : _Entidad.TipoDocAfectado ,
                Serie   : _Entidad.SerieAfectado ,
                Correlativo : _Corr ,
                Estado      : 'Aprobado'
            };
            var _DataDocVta = await docVentasCab.findOne({
                where : _whereCab
            })
            .catch(function (err) {
                captueError( err.original , req.body );
                console.log(_NombreDoc);
                $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
            });
            $response.doc = _DataDocVta;
        }else{
            // Doc ORQ2
            _whereCab = {
                TipoDocumento : _Entidad.TipoDocAfectado ,
                Serie   : _Entidad.SerieAfectado ,
                Correlativo : _Entidad.CorrelativoAfectado ,
                Estado      : 'Aprobado'
            };
            var _DataDocVta = await docVentasCab231.findOne({
                where : _whereCab
            })
            .catch(function (err) {
                captueError( err.original , req.body );
                console.log(_NombreDoc);
                $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
            });
            $response.doc = _DataDocVta;
        }
        varDump(_whereCab);
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
    check('CorrelativoAfectado' ,'Seleccione un documento.').not().isEmpty(),
    check('MotivoAfectado' ,'Ingrese un motivo.').not().isEmpty()
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
        // Calcular montos.
        var _dataDetalle = await docVentasDet.findOne({ 
            where: {
                CodigoHead : _Entidad.Codigo
            } 
        })
        .catch(function (err) {
            console.log(`Leven 04 | `+err.original.sqlMessage);
            $response.estado = 'ERROR';$response.error = err.original.sqlMessage;res.json( $response );
        });
        varDump(`SubTotal_PEN: ${_dataDetalle.ValorUnit}, Total_PEN: ${_dataDetalle.PrecioUnit}, IGV_PEN : ${_dataDetalle.IgvUnit}`);
        if( _dataDetalle ){
            await docVentasCab.update({
                SubTotal_PEN: _dataDetalle.ImporteTotalSinImpuesto,
                Total_PEN   : _dataDetalle.ImporteUnitarioConImpuesto,
                IGV_PEN     : _dataDetalle.ImporteTotalImpuestos,
                SubTotal_Doc: _dataDetalle.ImporteTotalSinImpuesto,
                Total_Doc   : _dataDetalle.ImporteUnitarioConImpuesto,
                IGV_Doc     : _dataDetalle.ImporteTotalImpuestos
            },{
                where  : {
                    uu_id : req.body.uu_id
                }
            })
            .catch(function (err) {
                console.log(`Leven 05`);
                $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
            });
        }
    }

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
//                      LEER XML                        //
//////////////////////////////////////////////////////////
router.post('/leer/xml', async (req,res)=>{
    // NroDoc
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _Archivo = `${_TipoDocG}-${req.body.NroDoc}.xml`;
    if( _Archivo.length > 5  ){
        var _fullURL = _RUTA_XML+"/"+_Archivo

        let xml_string = fs.readFileSync( _fullURL , "utf8");

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
//               ACTUALIZAR ITEM DOCUMENTO              //
//////////////////////////////////////////////////////////
router.post('/item/update', async (req,res)=>{
    // [form ]
    var $response = {};
    $response.estado = 'OK';
    $response.data  = [];
    $response.items = [];

    var _uuid = req.body.uu_id, _id = req.body.id, _Codigo = req.body.CodigoHead;
    
    // 666666666666666666666666666666666666666666666666666666666666
    var _Modificable = await validarEstado2( req.body.CodigoHead , 'Activo' );
    if( _Modificable != '' ){
        var _errGAA = [{ msg : _Modificable }];return res.status(422).json({ errores : _errGAA });
    }
    // 666666666666666666666666666666666666666666666666666666666666

    var _Entidad = await docVentasDet.findOne({
        where : {
            uu_id : _uuid,
            id    : _id
        }
    });
    varDump(`ValorUnit : ${req.body.ValorUnit}`);
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

    delete req.body.uuid;
    delete req.body.id;
    if( _Entidad )
    {
        delete req.body.uuid;
        delete req.body.id;
        // Actualizamos el IGV del item
        var _PrecItem = parseFloat( req.body.PrecioUnit ), _PrecUnit = parseFloat( req.body.ValorUnit );
        var _igvItem = _PrecItem - _PrecUnit;
        //req.body.IgvUnit = _igvItem;
        await docVentasDet.update(req.body,{
            where : {
                uu_id : _uuid,
                id    : _id
            }
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
    var _totalDet = await docVentasDet.sum('Total',{ 
        where: {
            Token : req.body.Token
        }
    });
    $response.total = _totalDet;
    //TODO: Al actualizar un item debemos actuaizar todo el encabezado
    // Actualizamos data del encabezado.
    if( _Codigo != 0 )
    {
        var _dataEncabezado = await docVentasCab.findOne({
            where : {
                Codigo : _Codigo
            }
        });
        var _IncIGV = _dataEncabezado.IncIGV, _Moneda = _dataEncabezado.Moneda;
        var _TipoCambio = _dataEncabezado.TipoCambio;
        var _subTotal = await docVentasDet.sum('Total', { 
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
            await docVentasCab.update({
                SubTotal_PEN: _SubTotal_PEN,
                Total_PEN   : _Total_PEN,
                IGV_PEN     : _IGV_PEN,
                SubTotal_Doc: _SubTotal_Doc,
                Total_Doc   : _Total_Doc,
                IGV_Doc     : _IGV_Doc
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
    }
    
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
//               VALIDAR ESTADO DOCUMENTO               //
//////////////////////////////////////////////////////////
async function validarEstado( _CodigoHead , _Mod )
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
    }
    return _respuesta;
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
async function captueError( error , post )
{
    var _envio       = JSON.stringify(post);
    var _descripcion = JSON.stringify(error);
    var _uuid = await renovarToken();
    await errorLogModel.create({
        uu_id : _uuid,
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
function varDump( _t )
{
    console.log( _t );
}
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
async function maxeXML( _Data , _Det , $userData )
{
    var _userData = $userData, _Detalle = _Det[0];
    // Data de las cuotas.
    var _Coutas = await docVentaCuotaModel.findAll({
        where : {
            CodigoHead : _Data.Codigo
        }
    });
    // Data documento afectado
    var _dataDocAfectado, _Flag = _Data.Flag;
    if( _Data.Flag == 'ORQ3' ){
        _dataDocAfectado = await docVentasCab.findOne({
            where : {
                TipoDoc : _Data.TipoDocAfectado ,
                Serie   : _Data.SerieAfectado ,
                Correlativo : _Data.CorrelativoAfectado 
            }
        });
    }else{
        _dataDocAfectado = await docVentasCab231.findOne({
            where : {
                TipoDocumento : _Data.TipoDocAfectado ,
                Serie   : _Data.SerieAfectado ,
                Correlativo : _Data.CorrelativoAfectado 
            }
        });
    }
    // _NombreDoc
    var _Archivo = `NC-${_Data.Serie}-${_Data.Correlativo}.php`;
    var _emailCliente = _Data.CorreoEnvio, _createdAt = _Data.createdAt, _DirCliente = ``, _Horacreado = ``;
    var _tasaIGV = parseFloat( _Data.TasaIGV * 100 ).toFixed(2);
    if( _createdAt ){
        _Horacreado = moment( _createdAt ).format('HH:mm:ss');
    }
    // El documento afectado es Boleta o Factura¿?
    var _TipoDocAfect = '01';
    if( _Data.TipoDocAfectado == 'B' ){
        _TipoDocAfect = '03';
    }
    // Razon social con FIX
    var _RazonSocialCli = await revisaRazon( _Data.Cliente );
    
    // es ruc o dni¿?
    var _TipoDocCli = 1, _IdCliente = parseInt( _Data.IdCliente);
    if( _Data.IdCliente > 99999999 ){
        _TipoDocCli = 6;
    }
    if( _TipoDocCli == 1 )
    {
        // IdCliente, si es < 8 le agregamos zeros a la izquierda
        if( _IdCliente < 9999999 )
        {
            var _IdCliente = await pad_with_zeroes( _IdCliente , 8 );
        }
    }
    var _Moneda = _Data.Moneda;
    var _Total      = parseFloat(_Data.Total_PEN).toFixed(2);
    var _SubTotal   = parseFloat( _Data.SubTotal_PEN ).toFixed(2);
    var _igv        = parseFloat( _Data.IGV_PEN ).toFixed(2);
    //
    if( _Data.Moneda != 'PEN' )
    {
        _Total      = parseFloat( _Data.Total_Doc ).toFixed(2);
        _SubTotal   = parseFloat( _Data.SubTotal_Doc ).toFixed(2);
        _igv        = parseFloat( _Data.IGV_Doc ).toFixed(2);
    }
    var _totalSUM_IGV = ``;
    console.log(`_Total: ${_Total} |_SubTotal: ${_SubTotal} |_igv`);
    // Letra a numero
    var _text = _Data.MontoLetras.trim();
    var _MontoLetras = _text.toUpperCase();

    // Jalar el codigo de producto SUNAT para el codigo de producto de aqui
    var _codigoProductoSUNAT = 76111501;
    var _detalleC = await docVentasDet.findOne({
        where : {
            TipoDoc : _Data.TipoDocAfectado ,
            Serie   : _Data.SerieAfectado ,
            Correlativo : _Data.CorrelativoAfectado 
        }
    });
    if( _detalleC )
    {
        if( _detalleC.IdProducto )
        {
            _codigoProductoSUNAT = _detalleC.IdProducto;
        }
    }

//Campos adicionales Emisor
var _OrdenCompra  = ``, _NroCert = ``, _NroGuia = ``, _NroHES = ``;
if( _Flag == 'ORQ3' ){
    // Data de Orquesta 3
    if( _dataDocAfectado.OrdenCompra ){
        _OrdenCompra  = `<ordenCompra>${_dataDocAfectado.OrdenCompra}</ordenCompra>`;
    }
    if( _dataDocAfectado.NroCert ){
        _NroCert  = `<codigoAuxiliar40_2>9275</codigoAuxiliar40_2>
        <textoAuxiliar40_2>${_dataDocAfectado.NroCert}</textoAuxiliar40_2>`;
    }
    if( _dataDocAfectado.NroGuia ){
        _NroGuia  = `<codigoAuxiliar100_5>9178</codigoAuxiliar100_5>
        <textoAuxiliar100_5>${_dataDocAfectado.NroGuia}</textoAuxiliar100_5>`;
    }
    if( _dataDocAfectado.NroHES ){
        _NroHES  = `<codigoAuxiliar40_2>8301</codigoAuxiliar40_2>
        <textoAuxiliar40_2>${_dataDocAfectado.NroHES}</textoAuxiliar40_2>`;
    }
}else{
    // Data de Orquesta 2
    if( _dataDocAfectado.ordenCompra ){
        _OrdenCompra  = `<ordenCompra>${_dataDocAfectado.ordenCompra}</ordenCompra>`;
    }
    if( _dataDocAfectado.NroCertificado ){
        _NroCert  = `<codigoAuxiliar40_2>9275</codigoAuxiliar40_2>
        <textoAuxiliar40_2>${_dataDocAfectado.NroCertificado}</textoAuxiliar40_2>`;
    }
    if( _dataDocAfectado.NroGuia ){
        _NroGuia  = `<codigoAuxiliar100_5>9178</codigoAuxiliar100_5>
        <textoAuxiliar100_5>${_dataDocAfectado.NroGuia}</textoAuxiliar100_5>`;
    }
    if( _dataDocAfectado.hes ){
        _NroHES  = `<codigoAuxiliar40_2>8301</codigoAuxiliar40_2>
        <textoAuxiliar40_2>${_dataDocAfectado.hes}</textoAuxiliar40_2>`;
    }
}

// La NC es codigo 13, con monto cero¿?
var _NCNegociable = `<formaPagoNegociable>0</formaPagoNegociable>`;
if( _Data.MotivoNC == 13 )
{
    _NCNegociable = `
<formaPagoNegociable>1</formaPagoNegociable>
<montoNetoPendiente>${parseFloat(_dataDocAfectado.MontoNetoPendiente).toFixed(2)}</montoNetoPendiente>
`;
//
    for (let index = 0; index < _Coutas.length; index++) {
        var rsC = _Coutas[index];
        var _NroCuota = rsC.NroCuota;
        _NCNegociable += `<montoPagoCuota${_NroCuota}>${parseFloat(rsC.MontoPagoCuota).toFixed(2)}</montoPagoCuota${_NroCuota}>
    <fechaPagoCuota${_NroCuota}>${rsC.FechaPagoCuota}</fechaPagoCuota${_NroCuota}>`;
    }
}



var _SignOnLineCmd = `
<SignOnLineCmd declare-sunat="1" declare-direct-sunat="1" publish="1" output="PDF">
<parameter value="20102187211" name="idEmisor"/>
<parameter value="07" name="tipoDocumento"/>
<documento>


<correoEmisor>-</correoEmisor>
<correoAdquiriente>-</correoAdquiriente>

<numeroDocumentoEmisor>20102187211</numeroDocumentoEmisor>
<tipoDocumentoEmisor>6</tipoDocumentoEmisor>
<tipoDocumento>07</tipoDocumento>

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

<numeroDocumentoAdquiriente>${_IdCliente}</numeroDocumentoAdquiriente>
<razonSocialAdquiriente>${_RazonSocialCli}</razonSocialAdquiriente>
<!-- ### 1 DNI, 6 RUC ### -->
<tipoDocumentoAdquiriente>${_TipoDocCli}</tipoDocumentoAdquiriente>


<direccionAdquiriente>${_Data.Direccion.trim()}</direccionAdquiriente>
<ubigeoAdquiriente>${_Data.ubigeoAdquiriente.trim()}</ubigeoAdquiriente>
<urbanizacionAdquiriente>${_Data.urbanizacionAdquiriente.trim()}</urbanizacionAdquiriente>
<provinciaAdquiriente>${_Data.provinciaAdquiriente.trim()}</provinciaAdquiriente>
<departamentoAdquiriente>${_Data.departamentoAdquiriente.trim()}</departamentoAdquiriente>
<distritoAdquiriente>${_Data.distritoAdquiriente.trim()}</distritoAdquiriente>
<paisAdquiriente>${_Data.paisAdquiriente.trim()}</paisAdquiriente>


<tipoMoneda>${_Data.Moneda}</tipoMoneda>
<totalValorVentaNetoOpGravadas>${parseFloat(_Data.SubTotal_Doc).toFixed(2)}</totalValorVentaNetoOpGravadas>
<totalIgv>${parseFloat(_Data.IGV_Doc).toFixed(2)}</totalIgv>
<totalImpuestos>${parseFloat(_Data.IGV_Doc).toFixed(2)}</totalImpuestos>
<totalVenta>${parseFloat(_Data.Total_Doc).toFixed(2)}</totalVenta>
<!-- ### Anulación de la operación ### -->
<codigoSerieNumeroAfectado>${_Data.MotivoNC}</codigoSerieNumeroAfectado>

<motivoDocumento>${_Data.MotivoAfectado.trim()}</motivoDocumento>
<!-- ### 01 Factura, 03 Boleta ### -->
<tipoDocumentoReferenciaPrincipal>${_TipoDocAfect}</tipoDocumentoReferenciaPrincipal>
<numeroDocumentoReferenciaPrincipal>${_Data.SerieAfectado}-${_Data.CorrelativoAfectado}</numeroDocumentoReferenciaPrincipal>

<codigoLocalAnexoEmisor>0000</codigoLocalAnexoEmisor>



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

<!-- ### EMISOR ### -->
<codigoAuxiliar40_3>9278</codigoAuxiliar40_3>
<textoAuxiliar40_3>${_Data.Emisor}</textoAuxiliar40_3>
<!-- ### AUTORIZACION ### -->
<codigoAuxiliar500_4>9804</codigoAuxiliar500_4>
<textoAuxiliar500_4>${_Data.Autorizacion}</textoAuxiliar500_4>
<!-- ### MONTO LETRAS ### -->
<codigoLeyenda_1>1000</codigoLeyenda_1>
<textoLeyenda_1>SON: ${_MontoLetras}</textoLeyenda_1>
<!-- ### IGV PER ### -->
<codigoAuxiliar40_1>9011</codigoAuxiliar40_1>
<textoAuxiliar40_1>18%</textoAuxiliar40_1>


 

 

<item>

<numeroOrdenItem>1</numeroOrdenItem>
<codigoProducto>-</codigoProducto>
<descripcion>DOCUMENTO EMITIDO POR:-${_Data.MotivoAfectado.trim()}</descripcion>
<cantidad>1.00</cantidad>
<unidadMedida>NIU</unidadMedida>
<importeUnitarioSinImpuesto>${parseFloat(_Data.SubTotal_Doc).toFixed(2)}</importeUnitarioSinImpuesto>
<importeUnitarioConImpuesto>${parseFloat(_Data.Total_Doc).toFixed(2)}</importeUnitarioConImpuesto>
<codigoImporteUnitarioConImpuesto>01</codigoImporteUnitarioConImpuesto>
<importeTotalSinImpuesto>${parseFloat(_Data.SubTotal_Doc).toFixed(2)}</importeTotalSinImpuesto>
<codigoRazonExoneracion>10</codigoRazonExoneracion>
<importeIgv>${parseFloat(_Data.IGV_Doc).toFixed(2)}</importeIgv>        
<tipoMoneda>${_Data.Moneda}</tipoMoneda>



<codigoProductoSUNAT>${_codigoProductoSUNAT}</codigoProductoSUNAT>
<montoBaseIgv>${parseFloat(_Data.SubTotal_Doc).toFixed(2)}</montoBaseIgv>
<tasaIgv>18.00</tasaIgv>
<importeTotalImpuestos>${parseFloat(_Data.IGV_Doc).toFixed(2)}</importeTotalImpuestos>



</item>

${_NCNegociable}

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
    captueError( err.original , req.body );
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


$myfile = fopen("NC-${_Data.Serie}-${_Data.Correlativo}.xml", "w") or die("Unable to open file!");

//$txt = $response;
$txt = $textoXML11;

fwrite($myfile, $txt);

fclose($myfile);

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
    <div id="chat-window ">
    <div id="output"></div>
    <div id="actions"></div>
    </div>
    <input type="text" id="username" value="${_userData.name}" >
    <input type="text" id="message"  value="ID:${_userData.dni}" >
    <button id="send" >Enviarsh</button>
    </div>

    <h1>Generando doc: NC-${_Data.Serie}-${_Data.Correlativo}</h1>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js" ></script>
    <script src="https://tecnico.ssays-orquesta.com/js/chat.js" ></script>
    <script src="https://ejecutivo.ssays-orquesta.com/js/node_orq3.js" ></script>
    <script>
    var $nomU = '${_userData.name}', $dniU = '${_userData.dni}';
    // ******* NODE JS *******
    socket.emit('emitir_doc_ventas',{
        user : $nomU,
        msg  : 'NC-${_Data.Serie}-${_Data.Correlativo}',
        dni  : $dniU
    });
    // ******* NODE JS *******
    </script>
  </body>
</html>
`;
    // Escribimos el archivo.
    fs.writeFileSync( _RUTA_XML+"/"+_Archivo , _dataEscribe );
}
// -------------------------------------------------------
// -------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// -------------------------------------------------------
// -------------------------------------------------------


module.exports = router;


