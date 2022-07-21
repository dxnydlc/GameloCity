// api_adn_servMedico.js

const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();


// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');

// >>>>>>>>>>>>>    NEXMO       >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

// >>>>>>>>>>>>> ------    SPARKPOST   ------ >>>>>>>>>>>>>
const SparkPost = require('sparkpost');
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET);


// LEER EXCEL
const reader = require('xlsx');
const fs = require('fs'); 

// XML
const _RUTA_XML = process.env.RUTA_XML;

// Modelos
const { adnSolServCabModel, User, adnSolServDetModel, archiGoogleModel, sucursalModel, aprobacionesModel, proveedorModel } = require('../../db');

// COntrolador
const permisosController  = require('../../controllers/permisosController');
const estadoDocController = require('../../controllers/estadoDocController');

// WHATSAPP
const config = require("./whatsapp.js");
const tokenWS = config.token, apiUrlWS = config.apiUrl;
const fetch = require('node-fetch');
var _LogoSSAYS = 'https://api2.ssays-orquesta.com/logo-ssays-2019-2.png';

// Exportar a EXCEL
const excel = require('node-excel-export');







// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
adnSolServCabModel.belongsTo(adnSolServDetModel,{
	as : 'Detalle', foreignKey 	: 'Codigo',targetKey: 'CodigoHead',
});

// You can define styles as json object
const styles = {
    celdita1 : {
        alignment : {
            horizontal  : 'left'
        },
        font : {
            sz : 9,
        }
    },
    celdita2 : {
        alignment : {
            horizontal  : 'center'
        },
        font : {
            sz : 8,
        },
        border :{
            bottom : {
                style : 'dashed', color : '1f7a29'
            }
        }
    },
    TituloSimple:{
        alignment : {
            vertical    : 'center',
            horizontal  : 'center'
        },
        font: {
            color: {
            rgb: '666'
            },
            sz: 10,
            bold: true,
        },
        border : {
            top : {
                style : 'dashed', color : '666'
            },
            bottom : {
                style : 'dashed', color : '666'
            },
            left:{
                style : 'dashed', color : '666'
            }
        }
    },
    headerDark: {
        fill: {
            fgColor: {
                rgb: '111430'
            }
        },
        alignment : {
            vertical    : 'center',
            horizontal  : 'center'
        },
        font: {
            color: {
            rgb: 'FFFFFFFF'
            },
            sz: 14,
            bold: true,
            underline: true
        }
    },
    cellVacio: {
        fill: {
            fgColor: {
                rgb: 'd1cec7'
            }
        }
    },
    cellGreen: {
        fill: {
            fgColor: {
            rgb: 'FF00FF00'
            }
        }
    }
};
const specification = {
    Col1: { // <- the key should match the actual data key
        displayName : 'DNI', // <- Here you specify the column header
        headerStyle : styles.TituloSimple, // <- Header style
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col2: { // <- the key should match the actual data key
        displayName : 'Gpo.', // <- Here you specify the column header
        headerStyle : styles.TituloSimple, // <- Header style
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col3: { // <- the key should match the actual data key
        displayName : 'Hora Cita', // <- Here you specify the column header
        headerStyle : styles.TituloSimple, // <- Header style
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col4: { // <- the key should match the actual data key
        displayName : 'APELLIDOS Y NOMBRES', // <- Here you specify the column header
        headerStyle : styles.TituloSimple, // <- Header style
        width       : 120,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col5: { // <- the key should match the actual data key
        displayName : 'FECHA DE NACIMIENTO', // <- Here you specify the column header
        headerStyle : styles.TituloSimple, // <- Header style
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col6: { // <- the key should match the actual data key
        displayName : 'EDAD',
        headerStyle : styles.TituloSimple, // <- Header style
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col7: { // <- the key should match the actual data key
        displayName : 'SEXO',
        headerStyle : styles.TituloSimple, // <- Header style
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col8: {
        displayName : 'CELULAR',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col9: {
        displayName : 'PRUEBA RAPIDA Nro.',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col10: {
        displayName : 'CLINICA PROVEEDORA',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col11: {
        displayName : 'RAZÓN SOCIAL',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col12: {
        displayName : 'OCUPACIÓN',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col13: {
        displayName : 'TIPO DE EMO',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col14: {
        displayName : 'PERFIL DE EMO',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col15: {
        displayName : 'FECHA DE EXAMEN',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col16: {
        displayName : 'RESULTADO',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col17: {
        displayName : 'ADMINISTRACION DE VACUNA',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col18: {
        displayName : 'UNIDAD',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col19: {
        displayName : 'SUCURSAL',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col20: {
        displayName : 'MOTIVO SOLICITUD',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col21: {
        displayName : 'TURNO A CUBRIR',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    },
    Col22: {
        displayName : 'SOLICITANTE',
        headerStyle : styles.TituloSimple,
        width       : 90,
        cellStyle   : function(value, row) {
            return styles.celdita1
        }
    }
}

const merges = [
    { start: { row: 1, column: 1 }, end: { row: 1, column: 38 } },
    { start: { row: 2, column: 1 }, end: { row: 2, column: 38 } },
    //{ start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
];

// Required de POST/UPDATE
var _requiredDoc = [
    check('IdProveedor' ,'Seleccione proveedor').not().isEmpty(),
    check('IdCliente' ,'Seleccione cliente').not().isEmpty(),
    check('TExamen' ,'Seleccione tipo de examen').not().isEmpty(),
   // check('PerfilEMO' ,'Seleccione protocolo').not().isEmpty(),
    check('IdDestaque' ,'Seleccione Unidad de destaque').not().isEmpty(),
    check('IdLocal' ,'Seleccione una sucursal').not().isEmpty(),
    check('FechaCita' ,'Seleccione Fecha Cita').not().isEmpty(),
    check('Turno' ,'Seleccione Turno').not().isEmpty(),
];










//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await adnSolServCabModel.findAll({
        order : [
            ['Codigo' , 'DESC']
        ],/*
        where:{
             [Op.or]: [{Estado: 'Activo'}, {Estado: 'Aprobado'}, {Estado: 'Anulado'}]
        },
        */
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/aprobados',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    
	$response.data = await adnSolServCabModel.findAll({
        order : [
            ['Codigo' , 'DESC']
        ],
        where:{
            [Op.or]: [{Estado: 'Aprobado'}, {Estado: 'Asignado'}]
       },
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
  
    if( req.body.Codigo ){
        // Buscamos por ID
        $where.Codigo = req.body.Codigo;
        //
        $response.data = await adnSolServCabModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        if(req.body.TipoExamen){
            $where.TExamen = { [Op.like] : '%'+req.body.TipoExamen+'%' }
        }

        if(req.body.Proveedor){
            $where.IdProveedor = req.body.Proveedor;
        }
          
        if(req.body.Cliente){
            $where.IdCliente = req.body.Cliente;
        }

        if(req.body.Perfil){
            $where.PerfilEMO = req.body.Perfil;
        }

        if(req.body.Solicitante){
            
            $where.IdSolicitante = req.body.Solicitante;
        }

        $response.data = await adnSolServCabModel.findAll({
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
//              BUSCAR EN DOCUMENTO - REPORTE           //
//////////////////////////////////////////////////////////
router.post('/reporte', async (req,res)=>{
    var $response = {};
	$response.estado = 'OK';
	$response.data = [];
	var $where = {};

    if( req.body.Codigo ){
        // Buscamos por ID
        $where.Codigo = req.body.Codigo;
        //
        $response.data = await adnSolServCabModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where,
		    include: [{
		        model: adnSolServDetModel,
		        as: 'Detalle'
		    }]
        });
        //
    }else{
        if(req.body.TipoExamen){
            $where.TExamen = { [Op.like] : '%'+req.body.TipoExamen+'%' }
        }

        if(req.body.Proveedor){
            $where.IdProveedor = req.body.Proveedor;
        }
          
        if(req.body.Cliente){
            $where.IdCliente = req.body.Cliente;
        }

        if(req.body.Perfil){
            $where.PerfilEMO = req.body.Perfil;
        }

        if(req.body.Solicitante){
            
            $where.IdSolicitante = req.body.Solicitante;
        }

        if(req.body.FechaCita){
            
            $where.FechaCita = { [Op.eq] : req.body.FechaCita }
        }
        $response.data = await adnSolServCabModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where,
		    include: [{
		        model: adnSolServDetModel,
		        as: 'Detalle'
		    }]
        });
    }
    
    res.json( $response );
});

//////////////////////////////////////////////////////////
//              BUSCAR APROBADOS EN DOCUMENTO           //
//////////////////////////////////////////////////////////
router.post('/buscarAprobados', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
  
        if( req.body.Codigo ){            
            $where.Codigo = req.body.Codigo;
            //
        }else{
            
            if(req.body.TipoExamen){
                $where.TExamen = { [Op.like] : '%'+req.body.TipoExamen+'%' }
            }

            if(req.body.Proveedor){
                $where.IdProveedor = req.body.Proveedor;
            }
            
            if(req.body.Cliente){
                $where.IdCliente = req.body.Cliente;
            }

            if(req.body.Perfil){
                $where.PerfilEMO = req.body.Perfil;
            }

            if(req.body.Solicitante){
                $where.Solicitante = req.body.Solicitante;
            }
            //$where.Estado = [Op.or]: {[Estado: 'Aprobado', Estado: 'Asignado']};
            
                  
        }
        $where.Estado = { [Op.in]: [ 'Aprobado'  , 'Asignado'  ] }
        $response.data = await adnSolServCabModel.findAll({
            
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
        
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

	$response.data = await adnSolServCabModel.findAll({
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
router.post('/', _requiredDoc ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
    
    delete req.body.tblOperarios_length;
    // Nro Pacientes
    var NroPacientes = await adnSolServDetModel.count({
        where: { 
            Token : req.body.uu_id
        }
    });   
	var $response = {};
    $response.estado = 'OK';
    $response.proveedor = [];
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.NroPersonal    = NroPacientes;
    req.body.IdSolicitante  = $userData.dni;
    req.body.Solicitante    = $userData.name;
    req.body.FechaSolicitud = moment().format('YYYY-MM-DD HH:mm:ss');
    
    req.body.FechaCita     =   moment(req.body.FechaCita).format('YYYY-MM-DD');
   /* where : {
                    IdClienteProv : req.body.IdProveedorFinal
                }
    */
    $response.proveedor = await proveedorModel.findOne({
        where : {
            RUC : req.body.IdProveedor
        }
    });
    req.body.Proveedor    = $response.proveedor.Razon;
    await adnSolServCabModel.create(req.body)
    .catch(function (err) {
        $response.Estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await adnSolServCabModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 6 );
        _Codigo = 'EMO'+_Codigo;
        await adnSolServCabModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
        // Unir con detalle
        await adnSolServDetModel.update({
            CodigoHead : _Codigo,
        },{
            where : { Token : req.body.uu_id }
        });
    }

    $response.item = await adnSolServCabModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [], $response.locales = [];

    var _Item = await adnSolServCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.item = _Item;
    if( _Item ){
        $response.data = await adnSolServDetModel.findAll({
            where : {
                CodigoHead : _Item.Codigo,
                Estado      : {[Op.in]:['Activo', 'Aprobado', 'Asignado']}
            }
        });
        // Sucursales de [ sucursalModel ]
        var _Sucursales = await sucursalModel.findAll({
            where : {
                IdClienteProv : _Item.IdDestaque
            }
        });
        $response.locales = _Sucursales;
    }
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', _requiredDoc , async (req,res)=>{
    // uuid
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }

    // DOCUMENTO DIPONIBLE PARA GUARDAR?
    var _DocDisponible = await estadoDocController.docDisponible( 'SOL_EMO' , ['Activo'] , req.body.Codigo );
    varDump( _DocDisponible );
    if( _DocDisponible.Estado == 'Denegado' ){
        return res.status(200).json( _DocDisponible );
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    delete req.body.id;
    req.body.FechaCita     =   moment(req.body.FechaCita).format('YYYY-MM-DD HH:mm:ss');
	await adnSolServCabModel.update(req.body,{
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
    
    $response.item = await adnSolServCabModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  APROBAR DOCUMENTO                  //
//////////////////////////////////////////////////////////
router.put('/aprobar/:uuid', [
    check('FechaProgramacion' ,'Seleccione Fecha de programación').not().isEmpty(),
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
    req.body.AprobadoPor = moment().format('YYYY-MM-DD HH:mm:ss');
    delete req.body.id;
	await adnSolServCabModel.update({
        FechaProgramacion      : req.body.FechaProgramacion,
        AprobadoPor : req.body.AprobadoPor
    },{
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
    
    $response.item = await adnSolServCabModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

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

	await adnSolServCabModel.update({
        Estado      : 'Anulado',
        DNIAnulado  : $userData.dni,
        AnuladoPor  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await adnSolServCabModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});

//////////////////////////////////////////////////////////
//            ELIMINAR DOCUMENTO PERSONAL               //
//////////////////////////////////////////////////////////
router.delete('/del_persona/:id/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );
    
	await adnSolServDetModel.update({
        Estado      : 'Anulado'
    },{
		where : { 
            id : req.params.id 
        }
    });
    $response.data = await adnSolServDetModel.findAll({
        where : {
            Token : req.params.uuid,
            Estado : 'Activo'
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ADD PACIENTE                     //
//////////////////////////////////////////////////////////
router.post('/paciente/add', async (req,res)=>{
    // *
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var _id = parseInt( req.body.id );
    
    if( _id <= 0 ){
        // Creamos nuevo
        await adnSolServDetModel.create( req.body )
        .catch(function (err){
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
    }else{
        // Actualizamos datos
        delete req.body.id;
        await adnSolServDetModel.update( req.body , {
            where : {
                uu_id : req.body.uu_id
            }
        })
        .catch(function (err){
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
    }
        

    $response.item = await adnSolServDetModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    $response.data = await adnSolServDetModel.findAll({
        where : {
            Token : req.body.Token,
            Estado: 'Activo'
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//   ACTUALIZAR FECHA REPROGRAMACIÓN, ENVIAR MENSAJES   //
//////////////////////////////////////////////////////////
router.post('/paciente/fecha_rep', [
    check('IdProveedorFinal' ,'Seleccione Clinica Final').not().isEmpty(),
], async (req,res)=>{
    // Ids, Token, FechaRepro, IdProveedorFinal, ProveedorFinal
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    
    var $userData = await getUserData( req.headers['api-token'] );

    //req.body.FechaCita = req.body.FechaRepro;
    //  F001-00048417

    // EL USUARIO PUEDE APROBAR¿?
    var _aprobar = await permisosController.verPermiso( 54 , $userData.dni , 'Aprobar' );
    varDump( _aprobar );
    if( _aprobar.Estado == 'Denegado' ){
        return res.status(200).json( _aprobar );
    }

    await adnSolServCabModel.update({
        Estado : 'Asignado',
        IdProveedorFinal  : req.body.IdProveedorFinal,
        ProveedorFinal    : req.body.ProveedorFinal,
        IdAsignadoPor     : $userData.dni,
        AsignadoPor       : $userData.name ,
        FechaProgramacion : req.body.FechaRepro,
        FechaAsignado  :   moment().format('YYYY-MM-DD HH:mm:ss')
    },{
        where  : {
            uu_id : req.body.Token
        }
    });

    // NOTIFICAR AL USUARIO SOLICITANTE...

    var _arrIds = [];
    var $ids = req.body.Ids;
    _arrIds = $ids.split(',');
    
    await adnSolServDetModel.update({  
        FechaRepro  : req.body.FechaRepro,
        IdProveedor : req.body.IdProveedorFinal,
        Proveedor   : req.body.ProveedorFinal,
        Estado      : 'Asignado'
    },{
        where  : {
            id : { [Op.in]: _arrIds }
        }
    });
    
    // Vamos a enviar mensajes a los pacientes seleccionados.
    var _dataSend = await adnSolServDetModel.findAll({
        where : {
            id : { [Op.in]: _arrIds }
        }
    });

    if( _dataSend )
    {
        for (let index = 0; index < _dataSend.length; index++) {
            const _rs = _dataSend[index];
            var _linkBitly = ``;
            const dataProv = await proveedorModel.findOne({
                where : {
                    IdClienteProv : req.body.IdProveedorFinal
                }
            });
            const _dataCab = await adnSolServCabModel.findOne({
                where : {
                    Codigo : _rs.CodigoHead
                }
            });
            var _mapa = ``, _direccion = ``;
            if( dataProv )
            {
                _mapa = dataProv.LinkMapa;
                _direccion = dataProv.Direccion;
            }
            switch (_dataCab.TExamen) {
                case 'Antigeno':
                    _linkBitly = `*Importante* por favor leer las indicaciónes para el ingreso: https://bit.ly/3pPGp8t`;
                break;
                case 'EMO-Ocupacional':
                case 'EMO-PreOcupacional':
                case 'EMO-PreOcupacional-Antigeno':
                case 'EMO':
                    _linkBitly = `*Importante* por favor leer las indicaciónes para el ingreso: https://bit.ly/3KsX4Xc`;
                break;
                case 'ETAS':
                    _linkBitly = `*Importante* por favor leer las indicaciónes para el ingreso: https://bit.ly/3MB10Y3`;
                break;
                case 'COVID':
                    _linkBitly = `*Importante* por favor leer las indicaciónes para el ingreso: https://bit.ly/34oh3qI`;
                break;
                case 'Antigeno':
                break;
                case 'Antigeno':
                break;
                case 'Antigeno':
                break;
            }
            /*
            Antigeno = https://bit.ly/3pPGp8t
            EMO      = https://bit.ly/3KsX4Xc
            ETAS     = https://bit.ly/3MB10Y3 ¿?
            COVID    = https://bit.ly/34oh3qI
            */
            //
            if( _rs.Celular )
            {
                var $celular = _rs.Celular;
                if( $celular.length == 9 )
                {
                    // Nro de envio
                    var to   = '51'+$celular, _fechaHora = '';
                    if( _dataCab.FechaProgramacion )
                    {
                        _fechaHora = moment(_dataCab.FechaProgramacion).format('YYYY-MM-DD');
                    }
                    if( _dataCab.Turno == 'Mañana' )
                    {
                        _fechaHora = _fechaHora+' 08:00';
                    }else{
                        _fechaHora = _fechaHora+' 13:30';
                    }
                    var texto1 = `
SSAYS SAC, Hola *${_rs.Nombre}, ${_rs.Paterno}*, confirmamos tu cita para la clínica: ${_dataCab.ProveedorFinal}, dirección: *${_direccion}*. *Fecha/Hora* ${_fechaHora}.`;
                    if( _mapa ){
                        texto1 += ` Esta es la ubicación en el mapa: ${_mapa}`;
                    }
                    texto1 += `
Por favor llevar su DNI/Fotocheck en entrada así como su carnet de vacuación.
${_linkBitly}
Si no puede visualizar los links correctamente, por favor *agrega este número a tus contactos* ,
Si consideras que esto es un error o ya no deseas que te enviemos mensajes por favor escribe la palabra *salir*. gracias por su atención.`;
                    var _envioCel = await apiChatApi( 'sendMessage', { phone : to , body: texto1 });
                    //varDump(_envioCel);
                    if( _envioCel )
                    {
                        if( _envioCel.sent == true )
                        {
                            varDump(`ADN => MSG ENVIADO CORRECTAMENTE: ${to}`);
                            // Actualizar estado envio
                            await adnSolServDetModel.update({
                                EnvioWhatsApp : _envioCel.id
                            },{
                                where : {
                                    id : _rs.id
                                }
                            });
                        }
                    }
                }
            }
        }
    }
    
    $response.data = await adnSolServDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    });
    res.json( $response );
  
    
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR PACIENTE                     //
//////////////////////////////////////////////////////////
router.post('/paciente/get', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.item = await adnSolServDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  TODOS LOS PACIENTES                 //
//////////////////////////////////////////////////////////
router.post('/paciente/all', async (req,res)=>{
    // Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.data = await adnSolServDetModel.findAll({
        where : {
            Token : req.body.Token,
            Estado: 'Activo'
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//          IMPORTAR ASISTENTES DESDE UN EXCEL          //
//////////////////////////////////////////////////////////
router.post('/importar_xls', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado    = 'OK';
    $response.data      = [];

    var _Archivo = await archiGoogleModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.file = _Archivo;

    if( _Archivo ){
        // Reading our test file
        const file = reader.readFile( _Archivo.ruta_fisica );
        let data = [];
        const sheets = file.SheetNames
        
        for(let i = 0; i < sheets.length; i++)
        {
            const temp = reader.utils.sheet_to_json(
                    file.Sheets[file.SheetNames[i]])
            temp.forEach( async (res) => {
                var _Insertar = {};
                _Insertar.uu_id     = await renovarToken();
                _Insertar.DNI       = res.DNI;
                _Insertar.Nombre    = res.Nombre;
                _Insertar.Paterno   = res.Paterno;
                _Insertar.Materno   = res.Materno;
                if( res.FecNac ){
                    var _FEcha = res.FecNac;
                    var _arFec = _FEcha.split('/');
                    _Insertar.FecNac = `${_arFec[2]}-${_arFec[1]}-${_arFec[0]}`;
                }
                _Insertar.Sexo      = res.Sexo;
                _Insertar.Puesto    = res.Puesto;
                _Insertar.Celular   = res.Celular;
                _Insertar.Correo    = res.Correo;
                _Insertar.Token     = _Archivo.token;
                //console.log(_Insertar);
                data.push(res);
                //console.log( _Insertar );
                await adnSolServDetModel.create( _Insertar );
            })
        }
        // Printing data
        // console.log(data);
        $response.token = _Archivo.token;
    }
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  APROBAR DOCUMENTO                   //
//////////////////////////////////////////////////////////
router.post('/aprobar', async (req,res)=>{
    // uuid
    var $response = {};
    $response.Estado = 'OK';
    $response.data = [];

    var $userData = await getUserData( req.headers['api-token'] );

    // Primero debemos revisar si el documento existe.
    var _Entidad = await adnSolServCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });

    // EL USUARIO PUEDE APROBAR¿?
    var _aprobar = await permisosController.verPermiso( 54 , $userData.dni , 'Aprobar' );
    varDump( _aprobar );
    if( _aprobar.Estado == 'Denegado' ){
        return res.status(200).json( _aprobar );
    }
    // DOCUMENTO DIPONIBLE PARA APROBAR¿?
    var _DocDisponible = await estadoDocController.docDisponible( 'SOL_EMO' , ['Activo'] , _Entidad.Codigo );
    varDump( _DocDisponible );
    if( _DocDisponible.Estado == 'Denegado' ){
        return res.status(200).json( _DocDisponible );
    }
    req.body.FechaCita     =   moment(req.body.FechaCita).format('YYYY-MM-DD');
    await adnSolServCabModel.update({
        IdAprobadoPor   :   $userData.dni ,
        AprobadoPor     :   $userData.name ,
        Estado          :   'Aprobado',
        FechaAprobado  :   moment().format('YYYY-MM-DD HH:mm:ss')
    },{
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.Estado = 'OK';

    /*
    var _dataAprobaciones = await aprobacionesModel.findAll({
        where : {
            IdTipoDoc : '54', // en base de datos de produccón es 54
            Estado : 'Activo',
            aprobar : 'SI',
            IdUser : $userData.dni
        }
    });
    var $dataServMed = await adnSolServCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    if($dataServMed){
        if(_dataAprobaciones.length == 1){          
            var $dataServMed = await adnSolServCabModel.findOne({
                where : {
                    uu_id : req.body.uuid
                }
            });        
            if($dataServMed.Estado == 'Aprobado'){
        
                $response.estado = 'NO';
            }else{                
                await adnSolServCabModel.update({
                    IdAprobadoPor : $userData.dni ,
                    AprobadoPor   : $userData.name ,
                    Estado        : 'Aprobado'
                },{
                    where : {
                        uu_id : req.body.uuid
                    }
                });
                $response.estado = 'OK';
               
            }
        }else{
            $response.estado = 'DENEGADO';
        }
    }else{
        $response.estado = 'VACIO';
    }
    /** */
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR 2 DOCUMENTO       			//
//////////////////////////////////////////////////////////
router.post('/solicitud/paciente', async (req,res)=>{
    
    
	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });	}

    delete req.body.tblOperarios_length;
    
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    
    if(! req.body.FecNac )
    {
        delete req.body.FecNac;
        console.log(`}>>>>>>>>>>>>>>>>>>>>>>>>>`);
    }
    
    var $dataUser = await User.findOne({
        where : {
            dni : req.body.dni
        }
    });
    if($dataUser){
        // CREAR EL ENCABEZADO
        await adnSolServCabModel.create(req.body)
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        var _dataGuardado = await adnSolServCabModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
    }
    
    if( _dataGuardado ){
        
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 6 );
        _Codigo = 'EMO'+_Codigo;
        await adnSolServCabModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
        
    }
    req.body.Estado = '1';

    if(_dataGuardado){
        await adnSolServDetModel.create({
            uu_id : req.body.uu_id,
            CodigoHead: _Codigo,
            DNI : req.body.dni,
            Nombre : req.body.NombreU,
            Paterno : req.body.ApellidoPaterno,
            Materno : req.body.ApellidoMaterno,
            FecNac : req.body.FecNac,
            Sexo : req.body.Sexo,
            Puesto : req.body.Puesto,
            Celular : req.body.Celular,
            Correo : req.body.email,
            FecNac : req.body.FecNac,
            Estado : req.body.Estado
        } )
            .catch(function (err){
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
    }
    
    $response.item = await adnSolServCabModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    
    

	res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/generar_xls', async (req,res)=>{
    // Fecha
    var $response = {};
    $response.estado = 'OK';
    $response.data = [], $response.locales = [];

    var _FechaH = moment().format('YYYY-MM-DD HH_mm_ss'), _Fecha = moment().format('DD/MM/YYYY');
    _Archivo = `SSAYS-Consolidado-${_FechaH}.xlsx`;
    var _FechaConsulta = req.body.Fecha, _FechaConsultaLat = moment(_FechaConsulta).format('DD/MM/YYYY');


    //Array of objects representing heading rows (very top)
const heading = [
    [
        { value: 'SERVICIOS MEDICOS ADN S.A.C.', style: styles.headerDark }
    ],[
        { value: 'Examenes programados '+_FechaConsultaLat, style: styles.headerDark }
    ],[ 
        '.' 
    ]
];

    var _dataEMO = await adnSolServCabModel.findAll({
        order : [
            ['Codigo' , 'DESC']
        ],
        where : {
            Estado : 'Asignado',
            FechaProgramacion : _FechaConsulta
        },
        include: [{
            model: adnSolServDetModel,
            as: 'Detalle',
            where : {
                Estado : 'Asignado',
                FechaRepro : _FechaConsulta
            },
        }]
    });
    
    const dataset = [];

    /**/
    for (let index = 0; index < _dataEMO.length; index++)
    {
        //
        const _rsData = _dataEMO[index], _darODO = {};
        const _Detalle = _rsData.Detalle;
        //
        // DOCUMENTO DE IDENTIDAD
        _darODO.Col1 = _Detalle.DNI;
        // Gpo.
        _darODO.Col2 = '';
        // Hora Cita
        if( _rsData == 'Día' )
        {
            _darODO.Col3 = '08:00';
        }else{
            _darODO.Col3 = '01:30';
        }
        
        // 
        _darODO.Col4 = `${_Detalle.Paterno} ${_Detalle.Materno} ${_Detalle.Nombre}`;
        if( _Detalle.FecNac )
        {
            //
            var _FecNac = moment( _Detalle.FecNac ).format('DD/MM/YYYY');
            varDump( `Fecha nac: ${_FecNac}` );
            _darODO.Col5 = _FecNac;
            var a = moment();
            var b = moment( _Detalle.FecNac , 'YYYY-MM-DD');
            var age  = moment.duration(a.diff(b));
            var _Edad = age.years();
            varDump( `Edad: ${_Edad}` );
            _darODO.Col6 = _Edad;
            //
        }else{
            _darODO.Col5 = '';
            _darODO.Col6 = '';
        }
        _darODO.Col7 = _Detalle.Sexo;
        _darODO.Col8 = _Detalle.Celular;
        _darODO.Col9 = '';
        _darODO.Col10 = _rsData.ProveedorFinal;
        _darODO.Col11 = _rsData.Cliente;
        // OCUPACIÓN
        _darODO.Col12 = _Detalle.Puesto;

        _darODO.Col13 = _rsData.TExamen;
        _darODO.Col14 = _rsData.protocolo;
        // FECHA DE EXAMEN
        var _FechaProgramacion = moment( _Detalle.FecNac ).format('DD/MM/YYYY');
        _darODO.Col15 = _FechaProgramacion;
        _darODO.Col16 = '';
        _darODO.Col17 = '';
        _darODO.Col18 = _rsData.Destaque;
        _darODO.Col19 = _rsData.Local;
        _darODO.Col20 = _rsData.Glosa;
        _darODO.Col21 = '';
        _darODO.Col22 = _rsData.Solicitante;
        //
        dataset.push( _darODO );
    }
    /**/
    
    
    
    /**/
    const report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
        {
            name    : 'Data: '+_FechaConsultaLat, // <- Specify sheet name (optional)
            heading : heading, // <- Raw heading array (optional)
            merges  : merges, // <- Merge cell ranges
            specification: specification, // <- Report specification
            data    : dataset // <-- Report data
        }
        ]
    );
    /**/

  // You can then return this straight
  //res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
  //return res.send(report);
    /**/
    // Escribimos el archivo.
    fs.writeFileSync( _RUTA_XML+"/"+_Archivo , report );
    // Ahora los vamos a convertir en base64
    let buff = fs.readFileSync( _RUTA_XML+"/"+_Archivo );
    let base64data = buff.toString('base64');
    // 000000000000000000000000000000000000000000000000
    await clientMail.transmissions.send({
        options: {
            //sandbox: true
        },
        content: {
            from : {
                name  : 'Robot de Orquesta',
                email : 'robot@ssays-orquesta.com'
            },
            subject : 'Lista de pacientes '+_FechaConsulta,
            html    : 'Robot Orquesta, <br/>Se adjunta data de pacientes a programar en fecha '+_FechaConsulta+'.<br/>Gracias por su atención.',
            attachments: [
                {
                  name: "Pacientes "+_FechaConsulta+".xls",
                  type: "application/vnd.ms-excel",
                  data: base64data
                }
              ]
        },
        recipients : 
            [
                { address : 'ddelacruz@ssays-orquesta.com' },
                { address : 'administracion@servimedicadn.com' },
                { address : 'htirado@servimedicadn.com.pe' },
            ]
    })
    .then( async data => {
        console.log('Woohoo! You just sent your first mailing!');
    })
    .catch(err => {
        console.log('Whoops! Something went wrong');
        console.log(err);
    });
    /**/
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
function varDump( _t )
{
    console.log( _t );
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
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;


