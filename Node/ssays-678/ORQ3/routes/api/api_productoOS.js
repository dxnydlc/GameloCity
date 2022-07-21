// api_productoOS
// productosOSModel

var _NombreDoc = 'api_productoOS';
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
const { productosOSModel } = require('../../db31');
const { xlsLAPIncidenciasDetModel, User, sequelize, archiGoogleModel, sucursalModel } = require('../../db');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

// COntrolador
const helpersController  = require('../../controllers/helpersController');
const osController  = require('../../controllers/osController');


// VALIDACION
var _Requeridos = [
    check('IdProducto' ,'Ingrese maquinaria').not().isEmpty(),
    check('Cantidad' ,'Ingrese Cantidad').not().isEmpty(),
];




// -------------------------------------------------------------
async function execQuery( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `producto`;
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('IDProductoOS') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" data-flag="', sequelize.col('TipoDetalle') ,'" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('IDProductoOS') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" data-flag="', sequelize.col('TipoDetalle') ,'" type="button" class=" delProd btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

    var _atributos = [
        _DelItem,
        ['IdProducto','Cod.'],
        ['producto','Descripción'],
        ['UMedida','U.Med.'],
        'Cantidad',
        ['Glosa','Glosa']
    ];
    //
    _dataResp = await productosOSModel.findAll({
        attributes : _atributos ,
        order : [
            ['IDProductoOS' , 'DESC']
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
router.get('/:IdOS/:Flag/:Token',async(req,res)=>{
    var _response = {};
    _response.codigo = 200;
    var _where = {};

    try {
        var _IdOS = parseInt( req.param.IdOS );
        if( _IdOS > 0 ){
            _where.IdOS  = req.params.IdOS;
        }else{
            _where.Token = req.params.Token;
        }
        _where.TipoDetalle = req.params.Flag;
        _response.data = [];
        _response.ut   = await helpersController.getUserData( req.headers['api-token'] );
        //
        _response.data = await execQuery( _where , 200  );
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' :  `Productos cargados.` };
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
    var _IdOS = parseInt(req.body.IdOS);

    /**/
    if( _IdOS > 0 )
    {
        // DOCUMENTO DIPONIBLE PARA GUARDAR?
        var _DocDisponible = await osController.docDisponible( ['Digitado'] , req.body.IdOS );
        varDump( _DocDisponible );
        if( _DocDisponible.resp.Estado == 'Denegado' ){
            return res.status(500).json( _DocDisponible );
        }
    }
    /**/

    try {
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        await productosOSModel.create(req.body)
        .catch(function (err) {
            varDump( err.original );
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await productosOSModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        _response.item = _dataGuardado;
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Producto ${req.body.producto} agregado.` };
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
        var _Entidad = await productosOSModel.findOne({
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
            //
            // Locales
            var _Locales = await sucursalModel.findAll({
                where : {
                    IdClienteProv : _Entidad.IdCliente
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
        var $userData = await getUserData( req.headers['api-token'] );
        _response.data = [];
        //
        await productosOSModel.update(req.body,{
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await productosOSModel.findOne({
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
        var _Entidad = await productosOSModel.findOne({
            where : {
                uu_id : req.params.uuid
            }
        });
        if( _Entidad )
        {
            var _IdOS = parseInt(_Entidad.IdOS);
            /**
            if( _IdOS > 0 )
            {
                // DOCUMENTO DIPONIBLE PARA GUARDAR?
                var _DocDisponible = await osController.docDisponible( ['Digitado'] , _IdOS );
                if( _DocDisponible.resp.Estado == 'Denegado' ){
                    return res.status(500).json( _DocDisponible );
                }
            }
            /**/
            await productosOSModel.destroy({
                where : { 
                    uu_id : req.params.uuid 
                }
            })
            .catch(function (err) {
                helpersController.captueError( err.original , req.body );
                _response.codigo = 400;
                _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
            });

            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `${_Entidad.producto} quitado.` };
        }else{
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Item no encontrado.` };
        }
        //
    } catch (error) {
        varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
});
// -------------------------------------------------------------
// 343550
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
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

