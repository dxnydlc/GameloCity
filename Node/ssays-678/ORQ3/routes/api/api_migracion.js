// api_migracion.js

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


/*const { 
        CF0002FACT, centroCostosModel, clienteModel, planCuentaModel, docVentasCab, User, docVentasDet, 
        resumenBoletasDetModel,resumenBoletasCabModel, resumenFacturasCabModel, resumenFacturasDetModel,
        tipoPagoModel
    } = require('../../db');


*/
// Modelos
const { errorLogModel } = require('../../dbA');
//const { DBmssql } = require('../../DBmssql');

const { 
    CF0002FACT, centroCostosModel, clienteModel, planCuentaModel, docVentasCab, User, docVentasDet,
    tipoPagoModel
} = require('../../db');

// -------------------------------------------------------

//////////////////////////////////////////////////////////
//    Enviar datos de Orquesta a COBORD    			    //
//////////////////////////////////////////////////////////
router.get('/:fecha/:fin/:fechaAn',async(req,res)=>{
        // Vamos a realizar la migración de facturas
    // fecha, fin
    var $response = {};
    $response.estado = 'OK';
    $response.existe = 'NO';
    var _DocsData = [];
    var _dataVenta = [];
    var _dataDetalle = [];
    var _dataPlanCuenta = [];
    var $where = {};
    var $whereDetalle = {};
    var $whereCab = {};
    
    $response.ut = await getUserData( req.headers['api-token'] );
 
    if(req.params.fin){

        var _DocsData = await docVentasCab.findAll({
            where:{
                FechaEmision : { [Op.gte ]: req.body.fecha },
                FechaVencimiento : { [Op.lte ]: req.body.Fin }    
            }            
        });
    }else{
        var _DocsData = await docVentasCab.findAll({
            where:{
                FechaEmision : { [Op.eq ]: req.body.fecha }
            }            
        });

    }

    
    _DocsData = await docVentasCab.findAll({
        where : $where            
    });

    if( _DocsData ){
        CSGO = 1;
        
        _DocsData.forEach( async function(res, indice, array) {
            // Tipo de documento
            var TDoc = '';
     
            switch ( res.TipoDoc ) {
                case 'F':
                    TDoc = 'FT';
                break;
                case 'B':
                    TDoc = 'BV';
                break;
                case 'NC':
                    TDoc = 'NC';
                break;
                case 'ND':
                    TDoc = 'ND';
                break;
            }
            
            _dataDetalle = await docVentasDet.findOne({
                where : {
                    Serie : res.Serie,
                    Correlativo : res.Correlativo,
                    TipoDoc : res.TipoDoc
                },
                order : [
                    ['id' , 'DESC']
                ],
            });
            
            _dataPlanCuenta = await planCuentaModel.findOne({
                where : {
                    IdCuenta :  res.IdCtaConta
                }
            });
            
            var _dataRepComercial = await User.findOne({
                where : {
                    dni : res.IdVendedor
                }
            });
            
            var _dataCliente = await clienteModel.findOne({
                where : {
                    IdClienteProv : res.IdCliente
                }
            });
            
            if(_dataCliente){
                
                var _dataCentroCosto = await centroCostosModel.findOne({
                    where : {
                        IdCentro : _dataCliente.IdCentro
                    }
                });
            }else{
                mensaje = 'El RUC no existe';
                return mensaje;
            }
            
            var _dataTipoPago = await tipoPagoModel.findOne({
                where : {
                    IdTipoPago : res.IdCondPago
                }
            });
            
            var CodContable = '';
            if( _dataCentroCosto ){
                
                var CodContable = _dataCentroCosto.CodContable;
                
            }
            
            var preGlosa = '';
            //console.log(_dataDetalle);
            if( _dataDetalle ){              
                var preGlosa = _dataDetalle.Descripcion;             
            }
            
            //Clean : Elimina carácteres especiales
            var Glosa = clean( preGlosa );
            //console.log(preGlosa+' == '+Glosa);
            if( Glosa == '' ){
                Glosa = '-';
            }
           // console.log(res.Estado);
            if( res.Estado == 'Anulado' ){
                var Glosa = 'ANULADO';
            }

            // ---------------------------------------------------------------------------------------------
            // ---------------------------------------------------------------------------------------------
            // ---------------------------------------------------------------------------------------------

            var InsertData =[];
            // CF_CCODAGE
            InsertData['CF_CCODAGE'] = '0001' ;
            // CF_CTD
            InsertData['CF_CTD'] = TDoc ;
            // CF_CNUMSER
            InsertData['CF_CNUMSER'] = res.Serie;
            // CF_CNUMDOC
            InsertData['CF_CNUMDOC'] = res.Correlativo.padStart(7,'0' );
            //console.log(InsertData['CF_CNUMDOC']);
            // $InsertData['CF_CNUMDOC'] = str_pad( $rs->Correlativo , 7 , '0' , STR_PAD_LEFT );
            // CF_DFECDOC
            InsertData['CF_DFECDOC'] = moment(res.FechaEmision).format('YYYY-MM-DD HH:mm:ss');         
            // CF_DFECVEN
            InsertData['CF_DFECVEN'] = moment(res.FechaVencimiento).format('YYYY-MM-DD HH:mm:ss');
            // CF_CVENDE -> Id representante comercial

            if( _dataRepComercial ){
                InsertData['CF_CVENDE'] = _dataRepComercial.id;
            }else{
                InsertData['CF_CVENDE'] = '00' ;
            }
            //# CF_CCODCLI
            InsertData['CF_CCODCLI'] = res.IdCliente ;
            //# CF_CNOMBRE
            InsertData['CF_CNOMBRE'] = _dataCliente.Razon.substr( 0 , 80 );
            //# CF_CDIRECC
            var tmpDir = res.Direccion.substr( 0 , 80 );
            InsertData['CF_CDIRECC'] = clean( tmpDir );
            //# CF_CRUC
            InsertData['CF_CRUC'] = res.IdCliente ;
            // CF_CFORVEN -> TO-DO REFERENCIA A LA TABLA DE FORMA DE PAGO
            InsertData['CF_CFORVEN'] = res.IdTipoPago; //#'003' ;
            //# CF_CALMA
            InsertData['CF_CALMA'] = '0001' ;
            var Moneda
            if( res.IdMoneda == 1 ){
                Moneda = 'MN';
            }else{
                Moneda = 'US';
            }

            //#CF_CCODMON
            InsertData['CF_CCODMON'] = Moneda ;
            //# CF_NTIPCAM
            var numDec = parseFloat(res.TipoCambio).toFixed(2);
            InsertData['CF_NTIPCAM'] = numDec;
            InsertData['CF_NTIPCAM'] = parseFloat( InsertData['CF_NTIPCAM'] );
            //# CF_CESTADO
            if( res.Estado == 'Anulado' ){
                InsertData['CF_CESTADO'] = 'A' ;
            }else{
                InsertData['CF_CESTADO'] = 'V' ;
            }
            // # CF_CSECUE
            var cadena = CSGO +''; // convertimos entero a cadena           
            var valor = cadena.padStart(4,'0' );            
            InsertData['CF_CSECUE'] = valor;
            //# CF_CCODIGO TO-DO
            if( _dataPlanCuenta ){
                InsertData['CF_CCODIGO'] = _dataPlanCuenta.NroCuenta ;
            }else{
                InsertData['CF_CCODIGO'] = '000' ;
            }

            //# CF_NCANTID
            InsertData['CF_NCANTID'] = 1 ;

          
            if( res.IdMoneda == 1 ){
               
                //# SOLES >>>>>>>>
            // # CF_NPRECIO
                var SubTotal_PEN = parseFloat(res.SubTotal_PEN).toFixed(2);
                InsertData['CF_NPRECIO'] = SubTotal_PEN;
                //# CF_NIGV
                var IGV_PEN = parseFloat(res.IGV_PEN).toFixed(2);
                InsertData['CF_NIGV'] = IGV_PEN;
                //# CF_NIMPORT
                var Total_PEN = parseFloat(res.Total_PEN).toFixed(2);
                InsertData['CF_NIMPORT'] = Total_PEN;

               
            }else{
            // # DOLARES >>>>>>>>
                //# CF_NPRECIO
                var SubTotal_Doc = parseFloat(res.SubTotal_Doc).toFixed(2);
                InsertData['CF_NPRECIO'] = SubTotal_Doc;
                //# CF_NIGV
                var IGV_Doc = parseFloat(res.IGV_Doc).toFixed(2);
                InsertData['CF_NIGV'] = IGV_Doc;
                //# CF_NIMPORT
                var Total_Doc = parseFloat(res.Total_Doc).toFixed(2);
                InsertData['CF_NIMPORT'] = Total_Doc;
            }

            InsertData['CF_NPRECIO'] = parseFloat( InsertData['CF_NPRECIO'] );
            InsertData['CF_NIGV'] = parseFloat( InsertData['CF_NIGV'] );
            InsertData['CF_NIMPORT'] = parseFloat( InsertData['CF_NIMPORT'] );
            //# CF_CCENCOS
            InsertData['CF_CCENCOS'] = CodContable.trim();

            //# CF_CACCANU
            if( res.Estado == 'Anulado' ){
                //# Si se vuelve a mandar le pones S...
                
                InsertData['CF_CACCANU'] = '' ;
            }
            var SerieAfectado;
            var TDocRef;
            if( res.TipoDocAfectado == '01' ){
                SerieAfectado = 'F001';
                TDocRef = 'FT';
            }else{
                SerieAfectado = 'B001';
                TDocRef = 'BV';
            }
            var docAfectado = parseInt(res.TipoDocAfectado);
          
            var CorrDocAfectado = docAfectado;
            FechaDocAfect = '';
            
            var CF_CTIPNC = '';
       
            //res.TipoDoc  = 'NC';
            
            switch ( res.TipoDoc ) {
                case 'F':
                    //# CF_CRFAG
                    InsertData['CF_CRFAG'] = '0001';
                break;
                case 'B':
                // # CF_CRFAG
                    InsertData['CF_CRFAG'] = '0001';
                break;
                case 'NC':
                    CF_CTIPNC = '02';
                    if(SerieAfectado)
                        $whereCab.Serie = { [Op.eq ]: SerieAfectado };
                    if(CorrDocAfectado)
                        $whereCab.Correlativo = { [Op.eq ]: CorrDocAfectado };
                    
                    var DocLastRef = await docVentasCab.findOne({
                        where : $whereCab
                    });                    
                    //# CF_CRFAG
                    InsertData['CF_CRFAG'] = '0001';//#'NC';
                    //# CF_CRFTD
                    InsertData['CF_CRFTD'] = TDocRef;
                    //# CF_CRFNSER
                    InsertData['CF_CRFNSER'] = SerieAfectado;
                    //# CF_CRFNDOC
                  
                    if(CorrDocAfectado){                        
                        var CorrDocAfectado = parseInt(CorrDocAfectado);
                        var CorrDocAfectado_cad = CorrDocAfectado.padStart(7, '0' ); 
                 
                        InsertData['CF_CRFNDOC'] = CorrDocAfectado_cad;
                    }
                    //# CF_DRFFDOC
                    if( DocLastRef ){
                        FechaDocAfect = DocLastRef.FechaEmision;
                    }
                    InsertData['CF_DRFFDOC'] = moment(FechaDocAfect).format('YYYY-MM-DD HH:mm:ss');
                break;
                case 'ND':
                   //# $CF_CTIPNC = '02';
                    if(SerieAfectado)
                        $whereCab.Serie = { [Op.eq ]: SerieAfectado };
                    if(CorrDocAfectado)
                        $whereCab.Correlativo = { [Op.eq ]: CorrDocAfectado };

                 
                   var DocLastRef = await docVentasCab.findOne({
                       where : $whereCab
                   });

                   // # CF_CRFAG
                   InsertData['CF_CRFAG'] = '0001';//#'ND';
                   //# CF_CRFTD
                   InsertData['CF_CRFTD'] = TDocRef;
                   //# CF_CRFNSER
                   InsertData['CF_CRFNSER'] = SerieAfectado;
                   //# CF_CRFNDOC
                   if(CorrDocAfectado){  
                        var CorrDocAfectado = parseInt(CorrDocAfectado);
                        var CorrDocAfectado_cad = CorrDocAfectado.padStart(7, '0' ); 
                        InsertData['CF_CRFNDOC'] = CorrDocAfectado_cad;
                   }
                   //# CF_DRFFDOC
                   if( DocLastRef ){
                       FechaDocAfect = DocLastRef.FechaEmision;
                   }
                   InsertData['CF_DRFFDOC'] = moment(FechaDocAfect).format('YYYY-MM-DD HH:mm:ss');
                 
                break;
            }
            InsertData['CF_CTIPNC'] = CF_CTIPNC;
            //# CF_CTF
            InsertData['CF_CTF'] = 'IN';
            //# CF_CTXT
          
            var Glosa = Glosa.padStart(0 , 60 );
            InsertData['CF_CTXT'] = Glosa.substr( 0 , 60 );
            
            var insertHeader = [
                {
                    name: 'CF_CTD', type: 'varchar',value: InsertData['CF_CTD']
                },{
                    name: 'CF_CNUMSER', type: 'varchar',value: InsertData['CF_CNUMSER']
                },{
                    name: 'CF_CNUMDOC', type: 'varchar',value: InsertData['CF_CNUMDOC']
                },{
                    name: 'CF_DFECDOC', type: 'varchar',value: InsertData['CF_DFECDOC']
                },{
                    name: 'CF_DFECVEN', type: 'varchar',value: InsertData['CF_DFECVEN']
                },{
                    name: 'CF_CVENDE', type: 'varchar',value: InsertData['CF_CVENDE']
                },{
                    name: 'CF_CCODCLI', type: 'varchar',value: InsertData['CF_CCODCLI']
                },{
                    name: 'CF_CNOMBRE', type: 'varchar',value: InsertData['CF_CNOMBRE']
                },{
                    name: 'CF_CDIRECC', type: 'varchar',value: InsertData['CF_CDIRECC']
                },{
                    name: 'CF_CRUC', type: 'varchar',value: InsertData['CF_CRUC']
                },{
                    name: 'CF_CFORVEN', type: 'varchar',value: InsertData['CF_CFORVEN']
                },{
                    name: 'CF_CALMA', type: 'varchar',value: InsertData['CF_CALMA']
                },{
                    name: 'CF_CCODMON', type: 'varchar',value: InsertData['CF_CCODMON']
                },{
                    name: 'CF_NTIPCAM', type: 'varchar',value: InsertData['CF_NTIPCAM']
                },{
                    name: 'CF_CESTADO', type: 'varchar',value: InsertData['CF_CESTADO']
                },{
                    name: 'CF_CSECUE', type: 'varchar',value: InsertData['CF_CSECUE']
                },{
                    name: 'CF_CCODIGO', type: 'varchar',value: InsertData['CF_CCODIGO']
                },{
                    name: 'CF_NCANTID', type: 'varchar',value: InsertData['CF_NCANTID']
                },{
                    name: 'CF_NPRECIO', type: 'varchar',value: InsertData['CF_NPRECIO']
                },{
                    name: 'CF_NIGV', type: 'varchar',value: InsertData['CF_NIGV']
                },{
                    name: 'CF_NIMPORT', type: 'varchar',value: InsertData['CF_NIMPORT']
                },{
                    name: 'CF_CCENCOS', type: 'varchar',value: InsertData['CF_CCENCOS']
                },{
                    name: 'CF_CACCANU', type: 'varchar',value: InsertData['CF_CACCANU']
                },{
                    name: 'CF_CRFAG', type: 'varchar',value: InsertData['CF_CRFAG']
                },{
                    name: 'CF_CRFTD', type: 'varchar',value: InsertData['CF_CRFTD']
                },{
                    name: 'CF_CRFNSER', type: 'varchar',value: InsertData['CF_CRFNSER']
                },{
                    name: 'CF_CRFNDOC', type: 'varchar',value: InsertData['CF_CRFNDOC']
                },{
                    name: 'CF_DRFFDOC', type: 'varchar',value: InsertData['CF_DRFFDOC']
                },{
                    name: 'CF_CTIPNC', type: 'varchar',value: InsertData['CF_CTIPNC']
                },{
                    name: 'CF_CTF', type: 'varchar',value: InsertData['CF_CTF']
                },{
                    name: 'CF_CTXT', type: 'varchar',value: InsertData['CF_CTXT']
                }
            ];
       
            $response.i = insertHeader;
            //res.Serie
           // console.log(rs.id);
           console.log('hasta aquí');
           const qExisteReq = await DBmssql.executeQuery(`TRUNCATE TABLE CF0002FACT `);
            //console.log(qExisteReq);
           // var dataResultado = qExisteReq.data[0].length;
            
           $response.id = res.id;
           console.log($response.id);
           // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
           var qCab = `INSERT CF0002FACT 
                                            (
                                                CF_CTD,CF_CNUMSER,CF_CNUMDOC,CF_DFECDOC,CF_DFECVEN,CF_CVENDE,CF_CCODCLI,
                                                CF_CDIRECC,CF_CCODMON,CF_NTIPCAM, CF_CESTADO,CF_CCODIGO,CF_NPRECIO,CF_NIGV,CF_NIMPORT,
                                                CF_CRFNSER, CF_CRFNDOC, CF_DRFFDOC, CF_CTXT
                                            )
               VALUES(
                        @CF_CTD, @CF_CNUMSER, @CF_CNUMDOC, @CF_DFECDOC, @CF_DFECVEN, @CF_CVENDE, @CF_CCODCLI,
                        @CF_CDIRECC, @CF_CCODMON, @CF_NTIPCAM, @CF_CESTADO, @CF_CCODIGO, @CF_NPRECIO, @CF_NIGV, @CF_NIMPORT,
                        @CF_CRFNSER, @CF_CRFNDOC, @CF_DRFFDOC, @CF_CTXT
                    )`;
           const qInsertHeader = await DBmssql.executeQuery( qCab , insertHeader );
           $response.insert = qInsertHeader;

        });
        
    }

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 
    var _dataVenta = await docVentasCab.findAll({
        where:{
            FechaAn :req.params.fechaAn
        }
    });

    if( _dataVenta ){
        
        CSGO = 1;
        _dataVenta.forEach( async function(res, indice, array) {
           
            var TDoc = '';
            switch ( res.TipoDoc ) {
                case 'F':
                    TDoc  = 'FT';
                break;
                case 'B':
                    TDoc  = 'BV';
                break;
                case 'NC':
                    TDoc  = 'NC';
                break;
                case 'ND':
                    TDoc  = 'ND';
                break;
            }
            
            var _dataDetalle = await docVentasDet.findOne({
                where : {
                    Serie : res.Serie,
                    Correlativo : res.Correlativo,
                    TipoDoc : res.TipoDoc
                },
                order : [
                    ['id' , 'DESC']
                ],
            });
            
            var _dataPlanCuenta = await planCuentaModel.findOne({
                where : {
                    IdCuenta : res.IdCtaConta
                }
            });
            
            var _dataRepComercial = await User.findOne({
                where : {
                    dni : res.IdVendedor
                }
            });
            
            var _dataCliente = await clienteModel.findOne({
                where : {
                    IdClienteProv : res.IdCliente
                }
            });
            
            if(_dataCliente){
          
                var _dataCentroCosto = await centroCostosModel.findOne({
                    where : {
                        IdCentro :  _dataCliente.IdCentro
                    }
                });
                
            }else{
                mensaje = 'El RUC no existe';
                return mensaje;
            }
            
            var _dataTipoPago = await tipoPagoModel.findOne({
                where : {
                    IdTipoPago : res.IdCondPago
                }
            });
            
            var CodContable = '';
            if( _dataCentroCosto ){
                var CodContable = _dataCentroCosto.CodContable;
            }
         
            var preGlosa = '';
            if( _dataDetalle ){
                var preGlosa = _dataDetalle.Descripcion;
            }
            var Glosa = clean( preGlosa );
                    if( Glosa == '' ){
                        Glosa = '-';
                    }
            if( res.Estado == 'Anulado' ){
                var Glosa = 'ANULADO';
            }
            
            // ---------------------------------------------------------------------------------------------
            // ---------------------------------------------------------------------------------------------
            // ---------------------------------------------------------------------------------------------

            var _InsertData =[];
            // CF_CCODAGE
            _InsertData['CF_CCODAGE'] = '0001' ;
            // CF_CTD
            _InsertData['CF_CTD'] = TDoc ;
            // CF_CNUMSER
            _InsertData['CF_CNUMSER'] = res.Serie ;
            // CF_CNUMDOC
            var cadena = res.Correlativo +'';
            _InsertData['CF_CNUMDOC'] = res.Correlativo.padStart(7,'0' );
            //console.log(_InsertData['CF_CNUMDOC']);
            // $InsertData['CF_CNUMDOC'] = str_pad( $rs->Correlativo , 7 , '0' , STR_PAD_LEFT );
            // CF_DFECDOC
            _InsertData['CF_DFECDOC'] = moment(res.FechaEmision).format('YYYY-MM-DD HH:mm:ss');         
            // CF_DFECVEN
            _InsertData['CF_DFECVEN'] = moment(res.FechaVencimiento).format('YYYY-MM-DD HH:mm:ss');
            // CF_CVENDE -> Id representante comercial

            if( _dataRepComercial ){
                _InsertData['CF_CVENDE'] = _dataRepComercial.id;
            }else{
                _InsertData['CF_CVENDE'] = '00' ;
            }
            //# CF_CCODCLI
            _InsertData['CF_CCODCLI'] = res.IdCliente ;
            //# CF_CNOMBRE
            _InsertData['CF_CNOMBRE'] = _dataCliente.Razon.substr( 0 , 80 );
            //# CF_CDIRECC
            var tmpDir = res.Direccion.substr( 0 , 80 );
            _InsertData['CF_CDIRECC'] = clean( tmpDir );
            //# CF_CRUC
            _InsertData['CF_CRUC'] = res.IdCliente ;
            // CF_CFORVEN -> TO-DO REFERENCIA A LA TABLA DE FORMA DE PAGO
            _InsertData['CF_CFORVEN'] = res.IdTipoPago; //#'003' ;
            //# CF_CALMA
            _InsertData['CF_CALMA'] = '0001' ;
            var Moneda
            if( res.IdMoneda == 1 ){
                Moneda = 'MN';
            }else{
                Moneda = 'US';
            }

            //#CF_CCODMON
            _InsertData['CF_CCODMON'] = Moneda ;
            //# CF_NTIPCAM
            var numDec = parseFloat(res.TipoCambio).toFixed(2);
            _InsertData['CF_NTIPCAM'] = numDec;
            _InsertData['CF_NTIPCAM'] = parseFloat( _InsertData['CF_NTIPCAM'] );
           // console.log(_InsertData['CF_NTIPCAM']);
            //# CF_CESTADO
            if( res.Estado == 'Anulado' ){
                _InsertData['CF_CESTADO'] = 'A' ;
            }else{
                _InsertData['CF_CESTADO'] = 'V' ;
            }
            // # CF_CSECUE
            CSGO = CSGO +'';
            _InsertData['CF_CSECUE'] = CSGO.padStart(4,'0' );
            //console.log(_InsertData['CF_CSECUE']);
            //# CF_CCODIGO TO-DO
            if( _dataPlanCuenta ){
                _InsertData['CF_CCODIGO'] = _dataPlanCuenta.NroCuenta ;
            }else{
                _InsertData['CF_CCODIGO'] = '000' ;
            }
            //# CF_NCANTID
            _InsertData['CF_NCANTID'] = 1 ;
            if( res.IdMoneda == 1 ){
                //# SOLES >>>>>>>>
            // # CF_NPRECIO
                var SubTotalSoles = parseFloat(res.SubTotalSoles).toFixed(2);
                _InsertData['CF_NPRECIO'] = SubTotalSoles;
                //# CF_NIGV
                var IGVSoles = parseFloat(res.IGVSoles).toFixed(2);
                _InsertData['CF_NIGV'] = IGVSoles;
                //# CF_NIMPORT
                var TotalSoles = parseFloat(res.TotalSoles).toFixed(2);
                _InsertData['CF_NIMPORT'] = TotalSoles;
            }else{
            // # DOLARES >>>>>>>>
                //# CF_NPRECIO
                var SubTotalDoc = parseFloat(res.SubTotalDoc).toFixed(2);
                _InsertData['CF_NPRECIO'] = SubTotalDoc;
                //# CF_NIGV
                var IGVDoc = parseFloat(res.IGVDoc).toFixed(2);
                _InsertData['CF_NIGV'] = IGVDoc;
                //# CF_NIMPORT
                var TotalDoc = parseFloat(res.TotalDoc).toFixed(2);
                _InsertData['CF_NIMPORT'] = TotalDoc;
            }
            _InsertData['CF_NPRECIO'] = parseFloat( _InsertData['CF_NPRECIO'] );
            _InsertData['CF_NIGV'] = parseFloat( _InsertData['CF_NIGV'] );
            _InsertData['CF_NIMPORT'] = parseFloat( _InsertData['CF_NIMPORT'] );
            //# CF_CCENCOS
            _InsertData['CF_CCENCOS'] = CodContable.trim();
            //console.log(_InsertData['CF_CCENCOS']+' == '+CodContable);
            //# CF_CACCANU
            if( res.Estado == 'Anulado' ){
                //# Si se vuelve a mandar le pones S...
                _InsertData['CF_CACCANU'] = '' ;
            }
            var SerieAfectado;
            var TDocRef;
            //console.log(res.TipoDocAfectado);
            if( res.TipoDocAfectado == '01' ){
                SerieAfectado = 'F001';
                TDocRef = 'FT';
            }else{
                SerieAfectado = 'B001';
                TDocRef = 'BV';
            }
           
            var docAfectado = parseInt(res.docAfectado);
            CorrDocAfectado = docAfectado;
            FechaDocAfect = '';

            var CF_CTIPNC = '';
            console.log(res.TipoDoc);
            switch ( res.TipoDoc ) {
                case 'F':
                    //# CF_CRFAG
                    _InsertData['CF_CRFAG'] = '0001';
                break;
                case 'B':
                // # CF_CRFAG
                _InsertData['CF_CRFAG'] = '0001';
                break;
                case 'NC':
                    CF_CTIPNC = '02';

                    var DocLastRef = await docVentasCab.findOne({
                        where : {
                            Serie :{[op.eq]: SerieAfectado},
                            Correlativo :{[op.eq]: CorrDocAfectado}
                        }
                    });

                    //# CF_CRFAG
                    _InsertData['CF_CRFAG'] = '0001';//#'NC';
                    //# CF_CRFTD
                    _InsertData['CF_CRFTD'] = TDocRef;
                    //# CF_CRFNSER
                    _InsertData['CF_CRFNSER'] = SerieAfectado;
                    //# CF_CRFNDOC
                    var CorrDocAfectado = parseInt(CorrDocAfectado);
                    var CorrDocAfectado_cad = CorrDocAfectado.padStart(7, '0' ); 
                    
                    _InsertData['CF_CRFNDOC'] = CorrDocAfectado_cad;
                    //# CF_DRFFDOC
                    if( DocLastRef ){
                        FechaDocAfect = DocLastRef.FechaEmision;
                    }
                    _InsertData['CF_DRFFDOC'] = moment(FechaDocAfect).format('YYYY-MM-DD HH:mm:ss');
                break;
                case 'ND':
                    //# $CF_CTIPNC = '02';
                    var DocLastRef = await docVentasCab.findOne({
                        where : {
                            Serie :{[op.eq]: SerieAfectado},
                            Correlativo :{[op.eq]: CorrDocAfectado}
                        }
                    });
                // # CF_CRFAG
                    _InsertData['CF_CRFAG'] = '0001';//#'ND';
                    //# CF_CRFTD
                    _InsertData['CF_CRFTD'] = TDocRef;
                    //# CF_CRFNSER
                    _InsertData['CF_CRFNSER'] = SerieAfectado;
                    //# CF_CRFNDOC
                    var CorrDocAfectado = parseInt(CorrDocAfectado);
                    var CorrDocAfectado_cad = CorrDocAfectado.padStart(7, '0' ); 
                    _InsertData['CF_CRFNDOC'] = CorrDocAfectado_cad;
                    //# CF_DRFFDOC
                    if( DocLastRef ){
                        FechaDocAfect = DocLastRef.FechaEmision;
                    }
                    _InsertData['CF_DRFFDOC'] = moment(FechaDocAfect).format('YYYY-MM-DD HH:mm:ss');
                break;
            }

            _InsertData['CF_CTIPNC'] = CF_CTIPNC;
            //# CF_CTF
            _InsertData['CF_CTF'] = 'IN';
            //# CF_CTXT
            var Glosa = Glosa.padStart(0 , 60 );            
            _InsertData['CF_CTXT'] = Glosa.substr( 0 , 60 );

        // #return $InsertData;
            
            // # return $InsertData;
            // DB::enableQueryLog();
             /*   var dataInsertada = await CF0002FACT.create(InsertData).catch(function (err) {        
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );        
                //console.log(err);
            });
            
            // # Marcamos que fue enviado a COBORD
                if( dataInsertada ){
                    await docVentasCab.update(req.body,{
                        where : { 
                            Serie : {[op.eq]: res.Serie},
                            TipoDocumento : {[op.eq]: res.TipoDocumento},
                            Correlativo : {[op.eq]: res.Correlativo},
                        }
                    });
                }
                */
                CSGO++;
        });
    }

});
// -------------------------------------------------------

// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
function clean($string) {
   // const str = "abc's test#s";
   $string = $string.replace(' ', ' ', $string); // Replaces all spaces with hyphens.
   //$string = preg_replace('/[^A-Za-z0-9\-]/', ' ', $string); // Removes special chars.

   $string = $string.replace(/[^a-zA-Z0-9]/g, '', $string );
   

    return $string.replace('/-+/', '-', $string); // Replaces multiple hyphens with single one;
 }
// -------------------------------------------------------
async function renovarToken()
{
    var length = 25;
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


module.exports = router;