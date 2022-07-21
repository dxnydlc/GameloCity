// api_histo_mant.js

var _NombreDoc = 'api_histo_mant';
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

// LEER EXCEL
const reader = require('xlsx');

// Modelos
const { errorLogModel } = require('../../dbA');
const { 
    histoMantModal, User, sequelize, histoMantDetModal, productosModel
    } = require('../../db');

//const {otModel} = require('../../db31');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

// Controlador
const helpersController  = require('../../controllers/helpersController');
const estadoDocController = require('../../controllers/estadoDocController');

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
histoMantDetModal.belongsTo(productosModel,{
	as : 'Detalle', foreignKey 	: 'IdProducto',targetKey: 'IdProducto',
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// VALIDACION
var _Requeridos = [
    check('IdClaseBien' ,'Ingrese Descripción').not().isEmpty(),
    check('Placa' ,'Ingrese Placa').not().isEmpty(),
    check('Marca' ,'Ingrese Marca').not().isEmpty(),
    check('Capacidad' ,'Ingrese Capacidad').not().isEmpty(),
    check('NroEtiqFisica' ,'Ingrese Nro Etiqueta Fisica').not().isEmpty(),
    check('FechaAltaBien' ,'Ingrese Fecha').not().isEmpty()
    
];

var _RequeridosRU = [
    check('IdProducto' ,'Seleccione Producto').not().isEmpty(),
    check('Cantidad' ,'Ingrese Cantidad').not().isEmpty(),
    check('Glosa' ,'Ingrese Glosa').not().isEmpty()
];

// -------------------------------------------------------------
async function execQueryRR( _where , _limit  )
{
    //
    console.log('execQueryRR');
    var _dataResp = [];
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') , '" data-codigo="', sequelize.col('Codigo'), '" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') , '" data-codigo="', sequelize.col('Codigo'), '" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];
    
    var _atributos = [
        _editItem,
        _DelItem,
        'id',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('FechaS') , _fechaONlyLatFormat ) , 'Fecha Solicitada'],  
        ['IdGuia', 'Nro Guía'],
        ['Dir_partida', 'Punto Partida'],
        ['Dir_llegada', 'Punto Llegada'],
        ['FechaA', 'Fecha Atención'],
        ['NroSolicitud', 'Nro Solicitud'],
        ['Diagnostico', 'Diagnóstico'],
        ['TrabajoRealizado', 'Trabajo Realizado'],
        ['Nombre_tecnico', 'Técnico'],
        'Observaciones',
        ['NroReporte', 'Reporte'],
        ['Cliente', 'Cliente'],
        'Estado',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'],
    ];
    //
    productosModel
    _dataResp = await histoMantDetModal.findAll({
        attributes : _atributos,
        order : [
            ['id' , 'DESC']
        ],
        where : _where,
        limit : _limit
    });
    return _dataResp;
    //
}

// -------------------------------------------------------------
//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO RR              //
//////////////////////////////////////////////////////////
router.post('/buscarRR', async (req,res)=>{
    // id, nombre
    var _response = {};
    _response.codigo = 200;
    _response.data = [];
    try {
        var $where = {};
        //
       
        if( req.body.Codigo ){
            // Buscamos por Constancia
            $where.Codigo = req.body.Codigo;
            //
            _response.data = await execQuery( $where , 200  );
            //
        }else{
            // Buscamos por Cliente
            if(req.body.Cliente){
                $where.IdClienteProv = req.body.Cliente;
            }
            // Buscamos por Custodio
            if(req.body.Custodio){
                $where.CodEmp = req.body.Custodio;
            }
            // Buscamos por Placa
            if(req.body.Placa){
                $where.Placa = req.body.Placa;
            }
            
            //
            _response.data = await execQuery( $where , 200  );
        }
    } catch (error) {
        helpersController.captueError( err.original , `>>>${error}` );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
    //res.json( $response );
});

// -------------------------------------------------------------
async function execQueryRU( _where, _limit  )
{
    //
    console.log('execQueryRU');
    var _dataResp = [];
    var _dataRespProd = [];

    
    console.log('_dataRespProd.descripcion: ');
    console.log(_dataRespProd);

    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') , '" data-codigo="', sequelize.col('Codigo'), '" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') , '" data-codigo="', sequelize.col('Codigo'), '" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];
    
    var _atributos = [
        _editItem,
        _DelItem,
        'id',
        ['IdProducto', 'IdProducto'],
        ['Producto', 'Descripción'],
        ['Cantidad', 'Cantidad'],
        ['Glosa', 'Glosa']
    ];
    //
    /*
    _dataRespProd = await productosModel.findOne({
        where : {
            Tipo : 'Repuesto',
            IdProducto : _idp
        },
    });
    */
    _dataResp = await histoMantModal.findAll({
        attributes : _atributos,
        order : [
            ['id' , 'DESC']
        ],
        where : _where,
        limit : _limit
    });
    return _dataResp;
    //


}


// -------------------------------------------------------------
//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO RU              //
//////////////////////////////////////////////////////////
router.post('/buscarRU', async (req,res)=>{
    // id hm, Tipo = Requerimiento y id producto
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        var $where = {};
        //
       console.log('req.body: ');
       console.log(req.body);
        if( req.body.uuid){
            // Buscamos por Constancia
            $where.Token = req.body.uuid;
            //$where.id = req.body.id;
            
            //
            
            _response.data = await execQueryRU( $where, 200  );
            //
        }
        
    } catch (error) {
        helpersController.captueError( err.original , `>>>${error}` );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
    //res.json( $response );
});
// -------------------------------------------------------------
async function execQuery( _where , _limit  )
{
    //
    console.log('Entra');
    var _dataResp = [];
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') , '" data-codigo="', sequelize.col('Codigo'), '" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') , '" data-codigo="', sequelize.col('Codigo'), '" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];
    
    var _atributos = [
        _editItem,
        _DelItem,
        'id',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('FechaS') , _fechaONlyLatFormat ) , 'Fecha Solicitada'],  
        ['IdGuia', 'Nro Guía'],
        ['Dir_partida', 'Punto Partida'],
        ['Dir_llegada', 'Punto Llegada'],
        ['FechaA', 'Fecha Atención'],
        ['NroSolicitud', 'Nro Solicitud'],
        ['Diagnostico', 'Diagnóstico'],
        ['TrabajoRealizado', 'Trabajo Realizado'],
        ['Nombre_tecnico', 'Técnico'],
        'Observaciones',
        ['NroReporte', 'Reporte'],
        ['Cliente', 'Cliente'],
        'Estado',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'],
    ];
    //
    
    _dataResp = await histoMantModal.findAll({
        attributes : _atributos,
        order : [
            ['id' , 'DESC']
        ],
        where : _where,
        limit : _limit
    });
    console.log(_dataResp);
    return _dataResp;
    //
}
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
        _response.data = await execQuery( [] , 200  );
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
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        var $where = {};
        //
       
        if( req.body.Codigo ){
            // Buscamos por Constancia
            $where.Codigo = req.body.Codigo;
            //
            _response.data = await execQuery( $where , 200  );
            //
        }else{
            // Buscamos por Cliente
            if(req.body.Cliente){
                $where.IdClienteProv = req.body.Cliente;
            }
            // Buscamos por Custodio
            if(req.body.Custodio){
                $where.CodEmp = req.body.Custodio;
            }
            // Buscamos por Placa
            if(req.body.Placa){
                $where.Placa = req.body.Placa;
            }
            
            //
            _response.data = await execQuery( $where , 200  );
        }
    } catch (error) {
        helpersController.captueError( err.original , `>>>${error}` );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
    //res.json( $response );
});

// -------------------------------------------------------------
//////////////////////////////////////////////////////////
//      			AGREGAR DOCUMENTO       			//
//////////////////////////////////////////////////////////
router.post('/', _Requeridos ,async (req,res)=>{
    console.log('req.body: ');
    console.log(req.body);
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
        req.body.Estado = 'Activo';
        await activos_2022Model.create(req.body)
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await activos_2022Model.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
    
        if( _dataGuardado )
        {
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'MAQ'+_Codigo;
           
            await activos_2022Model.update({
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
            
        }
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se guardó el documento ${_Codigo} correctamente.` };
        _response.item = await activos_2022Model.findOne({
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
//      			AGREGAR DOCUMENTO RU    			//
//////////////////////////////////////////////////////////
router.post('/guardar/ru', _RequeridosRU ,async (req,res)=>{
    console.log('req.body 11: ');
    console.log(req.body);
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
        req.body.Estado = 'Activo';
        await histoMantDetModal.create(req.body)
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await histoMantDetModal.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        console.log('_dataGuardado 1');
        if( _dataGuardado )
        {
            console.log('_dataGuardado 2');
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'RU'+_Codigo;
           
            await histoMantDetModal.update({
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
            
        }
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se guardó el documento ${_Codigo} correctamente.` };
        _response.item = await histoMantDetModal.findOne({
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
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/cargar_data', async (req,res)=>{
    // uuid
  
    var _response = {};
    _response.codigo = 200;
    _response.data    = [];
    
    try {
        //
        _response.data = await activos_2022Model.findOne({
            where : {
                uu_id : req.body.uuid
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se cargaron los datos del documento: ${_response.data.Codigo}.` };
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
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uu_id', _Requeridos , async (req,res)=>{
    // uuid
    console.log('req.body: ');
    console.log(req.body);
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var _response = {};
    _response.codigo = 200;

    try {
        
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        _response.data = [];
        //
        await activos_2022Model.update(req.body,{
            where : { 
                uu_id : req.params.uu_id 
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await activos_2022Model.findOne({
            where : {
                uu_id : req.params.uu_id
            }
        });
        // 342206 343129
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se actualizó el documento ${req.body.Constancia} correctamente.` };
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
        await activos_2022Model.update({
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
        
        _response.item = await activos_2022Model.findOne({
            where : {
                uu_id : req.params.uuid
            }
        });
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se anuló el registro correctamente.` };
        //
    } catch (error) {
        varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
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
// -------------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
module.exports = router;
// -------------------------------------------------------------

