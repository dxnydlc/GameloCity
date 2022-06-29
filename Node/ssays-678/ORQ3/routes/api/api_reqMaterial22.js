
// api_reqMaterial22.js

var _NombreDoc = 'api_reqMaterial22';
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
const { reqMaterialesCabModel, reqMaterialesDetModel, User, sequelize, archiGoogleModel, sucursalModel, clienteModel, seriesDocModel } = require('../../db');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

// COntrolador
const helpersController   = require('../../controllers/helpersController');
const permisosController  = require('../../controllers/permisosController');
const estadoDocController = require('../../controllers/estadoDocController');

// VALIDACION
var _Requeridos = [
    check('Fecha' ,'Ingrese fecha').not().isEmpty(),
    check('IdSucursal' ,'Seleccione Local').not().isEmpty(),
    check('IdClienteProv' ,'Seleccione Cliente').not().isEmpty()
];

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
reqMaterialesCabModel.belongsTo(reqMaterialesDetModel,{
	as : 'Detalle', foreignKey 	: 'IdRequerimientoCab',targetKey: 'IdRequerimientoCab',
});










// -------------------------------------------------------------
async function execQuery_buscar( _where , _limit  )
{
    //
    
    var _dataResp = [];
    var _NOmbre = `Cliente`;
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('IdRequerimientoCab') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('IdRequerimientoCab') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

    var _atributos = [
        _editItem,
        _DelItem,
        ['IdRequerimientoCab','Nro.'],
        ['cliente','Cliente'],
        ['sucursal','Local'],
        ['TipProducto','Tipo'],
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('Fecha') , _fechaONlyLatFormat ) , 'Fecha'], 
        ['NroGuia','Guia'],
        'Estado',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'], 
    ];
    //
    _dataResp = await reqMaterialesCabModel.findAll({
        attributes : _atributos,
        where : _where
    })

    
    return _dataResp;
    //
}
// -------------------------------------------------------------
async function execQuery( _where , _limit  )
{
    //
    
    var _dataResp = [];
    var _NOmbre = `Cliente`;
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('IdRequerimientoCab') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('IdRequerimientoCab') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

    var _atributos = [
        _editItem,
        _DelItem,
        ['IdRequerimientoCab','Nro.'],
        ['cliente','Cliente'],
        ['sucursal','Local'],
        ['TipProducto','Tipo'],
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('Fecha') , _fechaONlyLatFormat ) , 'Fecha'], 
        ['NroGuia','Guia'],
        'Estado',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'], 
    ];
    //
    _dataResp = await reqMaterialesCabModel.findAll({
        attributes : _atributos ,
        order : [
            ['IdRequerimientoCab' , 'DESC']
        ],
        where : _where,
        limit : _limit
    })
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
        _response.data = await execQuery( [] , 300  );
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
//          LISTAR PRODUCTOS DE UN REQ. MAT             //
//////////////////////////////////////////////////////////
router.post('/listar/producto', async (req,res)=>{
    // id, nombre
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        var _where = {};
        //
        if( req.body.id != '' ){
            // Buscamos por ID
            _where.Codigo = req.body.id;
            //
            _response.data = await execQuery( _where , 200  );
            //
        }else{
            // Buscamos por nombre
            _where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
            //
            _response.data = await execQuery( _where , 200  );
        }
    } catch (error) {
        helpersController.captueError( err.original , `>>>${error}` );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
    res.json( $response );
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
        var _where = {};
        //
        if(req.body.IdClienteProvB){
            
            _where.IdClienteProv = req.body.IdClienteProvB;
            //
           
            _response.data = await execQuery_buscar( _where , 200  );
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
//////////////////////////////////////////////////////////
//      			    OBTENER LISTA     			    //
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        _response.ut   = await helpersController.getUserData( req.headers['api-token'] );
        _response.data = await execQuery( $where , 100  );
        //
    } catch (error) {
        helpersController.captueError( err.original , `>>>${error}` );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }
    //
    return res.status(_response.codigo).json( _response );

    res.json( $response );
});
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
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        var $IdRequerimientoCab = 0;

        // Serie y correlativo
        var _serieDoc = await seriesDocModel.findOne({
            attributes: ['IdSerieDoc','Serie', 'UltCorrelativo'],
            where : {
                IdTipoDoc : 8
            }
        })
        .catch(function (err) {
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        if( _serieDoc ){
            var _Corr = _serieDoc.UltCorrelativo + 1;
            $IdRequerimientoCab = _Corr;
            req.body.IdRequerimientoCab = $IdRequerimientoCab;
        }else{
            // NO HAY SERIE!!!!
        }

        req.body.Estado     = 'Digitado';
        req.body.FechaMod   = moment().format('YYYY-MM-DD HH:mm:ss');
        req.body.UsuarioMod = $userData.dni;
        startdate           = moment().format('YYYY-MM-DD');
        var new_date        = moment(startdate, "DD-MM-YYYY").add(5, 'days');
        req.body.FechaEnt   = new_date;
        //
        await reqMaterialesCabModel.create(req.body)
        .catch(function (err) {
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
       
        var _dataGuardado = await reqMaterialesCabModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //

        if( _dataGuardado )
        {
            // Actualizamos el ultimo correlativo
            await seriesDocModel.update({
                UltCorrelativo : $IdRequerimientoCab
            },{
                where : {
                    IdSerieDoc : _serieDoc.IdSerieDoc
                }
            });
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.IdRequerimientoCab , 8 );
            _Codigo = 'RM'+_Codigo;
            await reqMaterialesCabModel.update({
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
            await reqMaterialesDetModel.update({
                IdRequerimientoCab : $IdRequerimientoCab
            },{
                where : {
                    Token : req.body.uu_id
                }
            });
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se guardó el documento ${_Codigo} correctamente.` };
        }

        _response.item = await reqMaterialesCabModel.findOne({
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
router.post('/get_data', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.cliente = [];

    try {
        //
        var _Entidad = await reqMaterialesCabModel.findOne({
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
        _response.data = _Entidad;
        if( _Entidad )
        {
            // Cliente data
            var _dataCli = await clienteModel.findOne({
                where : {
                    IdClienteProv : _Entidad.IdClienteProv
                }
            });
            _response.cliente = _dataCli;
            // Locales
            var _Locales = await sucursalModel.findAll({
                where : {
                    IdClienteProv : _Entidad.IdClienteProv
                }
            });
            _response.locales = _Locales;
            //
        }
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se cargaron los datos del documento: ${_Entidad.Codigo}.` };
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
        await reqMaterialesCabModel.update(req.body,{
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await reqMaterialesCabModel.findOne({
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
    // uuid
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        await reqMaterialesCabModel.update({
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
        
        _response.item = await reqMaterialesCabModel.findOne({
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
//////////////////////////////////////////////////////////
//                  IMPORTAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.post('/importar', async (req,res)=>{
    // IdReq, Token
    
    var _response = {};
    _response.codigo = 200;
    _response.locales = [];

    try {
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        _response.data = [];
        //
        
        var _Entidad = await reqMaterialesCabModel.findOne({
            where : {
                IdRequerimientoCab : req.body.IdReq
            }
        });
        _response.data = _Entidad;
        // Existe¿? entonces creamos el detalle
        if( _Entidad )
        {
            //
            // Cliente data
            var _dataCli = await clienteModel.findOne({
                where : {
                    IdClienteProv : _Entidad.IdClienteProv
                }
            });
            _response.cliente = _dataCli;
            // Locales
            var _Locales = await sucursalModel.findAll({
                where : {
                    IdClienteProv : _Entidad.IdClienteProv
                }
            });
            _response.locales = _Locales;
            //
            //
            var _detallePre = await reqMaterialesDetModel.findAll({
                where : {
                    IdRequerimientoCab : req.body.IdReq
                }
            });
            for (let index = 0; index < _detallePre.length; index++) {
                const _rsRM = _detallePre[index];
                // - //
                var _insertData = {};
                _insertData.uu_id       = await helpersController.renovarToken();
                _insertData.IdProducto  = _rsRM.IdProducto;
                _insertData.producto    = _rsRM.producto;
                _insertData.unidad_medida = _rsRM.unidad_medida;
                _insertData.tipo_producto = `MATERIALES_PLANTA`;
                _insertData.IdClase     = _rsRM.IdClase;
                _insertData.IdUMedida   = _rsRM.IdUMedida;
                _insertData.Cantidad    = _rsRM.Cantidad;
                _insertData.CostoUnit   = _rsRM.CostoUnit;
                _insertData.Total       = _rsRM.Total;
                _insertData.Glosa       = _rsRM.Glosa;
                _insertData.token       = req.body.Token;
                // - //
                reqMaterialesDetModel.create( _insertData );
            }
        }
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se importó el documento ${req.body.IdReq} correctamente.` };
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
//                  APROBAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/aprobar', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];

    try {
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        // USUARIO PUEDE APROBAR
        var _aprobar = await permisosController.verPermiso2( 8 , $userData.dni , 'Aprobar' );
        varDump( _aprobar );
        if( _aprobar.Estado == 'Denegado' ){
            return res.status(401).json( _aprobar );
        }
        // DOCUMENTO SE PUEDE APROBAR
        var _DocDisponible = await estadoDocController.docDisponible( 'REQMAT' , ['Digitado'] , req.body.IdRequerimientoCab );
        if( _DocDisponible.Estado == 'Denegado' ){
            return res.status(401).json( { msg : _DocDisponible } );
        }
        //
        var _Entidad = await reqMaterialesCabModel.findOne({
            where : {
                uu_id : req.body.uu_id
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
            // Cambiar estado
            await reqMaterialesCabModel.update({
                Estado : 'Aprobado',
                UsuarioAprob : $userData.dni
            },{
                where : {
                    IdRequerimientoCab : _Entidad.IdRequerimientoCab
                }
            })
            .catch(function (err) {
                varDump(err);
                _response.codigo = 400;
                _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
            });
        }
        _Entidad = await reqMaterialesCabModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        })
        _response.item = _Entidad;

        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se aprobó: ${_Entidad.IdRequerimientoCab}.` };
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
//                  ANULAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/anular', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];

    try {
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        // USUARIO PUEDE APROBAR
        var _aprobar = await permisosController.verPermiso2( 8 , $userData.dni , 'Aprobar' );
        varDump( _aprobar );
        if( _aprobar.Estado == 'Denegado' ){
            return res.status(401).json( _aprobar );
        }
        // DOCUMENTO SE PUEDE APROBAR
        var _DocDisponible = await estadoDocController.docDisponible( 'REQMAT' , ['Digitado','Aprobado'] , req.body.IdRequerimientoCab );
        if( _DocDisponible.Estado == 'Denegado' ){
            return res.status(401).json( { msg : _DocDisponible } );
        }
        //
        var _Entidad = await reqMaterialesCabModel.findOne({
            where : {
                uu_id : req.body.uu_id
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
            // Cambiar estado
            await reqMaterialesCabModel.update({
                Estado : 'Anulado',
                UsuarioAprob : $userData.dni
            },{
                where : {
                    IdRequerimientoCab : _Entidad.IdRequerimientoCab
                }
            })
            .catch(function (err) {
                varDump(err);
                _response.codigo = 400;
                _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
            });
        }
        _Entidad = await reqMaterialesCabModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        })
        _response.item = _Entidad;

        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se anuló: ${_Entidad.IdRequerimientoCab}.` };
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
// -------------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
module.exports = router;
// -------------------------------------------------------------

