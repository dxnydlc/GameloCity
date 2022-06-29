
// api_app_tecnico.js




var _NombreDoc = 'api_app_tecnico';
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
const { otModel, OSModel, productosModel } = require('../../db31');
const { errorLogModel } = require('../../dbA');
const { asignarTecnicoModel, clienteModel, productoTrabajoOTModel, xlsLAPIncidenciasDetModel, User, sequelize, archiGoogleModel, sucursalModel } = require('../../db');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";



// Controlador
const helpersController  = require('../../controllers/helpersController');
const estadoDocController = require('../../controllers/estadoDocController');



// VALIDACION
var _Requeridos = [
    check('Fecha' ,'Ingrese fecha').not().isEmpty(),
    check('IdLocal' ,'Seleccione Local').not().isEmpty(),
    check('IdCliente' ,'Seleccione Cliente').not().isEmpty()
];







// -------------------------------------------------------------
async function execQueryTecnico( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `Tecnico`;
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

    var _atributos = [
        'IdOT',
        ['IdTecnico','DNI'],
        'Tecnico',
        'Celular',
        'Correo',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('Inicio') , _fechaLatFormat ) , 'Inicio'], 
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('Fin') , _fechaLatFormat ) , 'Fin'], 
        'Duracion', 
        'Estado',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'], 
    ];
    //
    _dataResp = await asignarTecnicoModel.findAll({
        attributes : _atributos ,
        order : [
            ['id' , 'DESC']
        ],
        where : _where,
        limit : _limit
    })
    return _dataResp;
    //
}
// -------------------------------------------------------------
async function tblTecnico01( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `nombre_cliente`;
    var _tomaOT = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('IdOT') , '" data-estado="', sequelize.col('Estado') ,'" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" verOT btn btn-block btn-primary btn-xs"><i class="fa fa-check-square" ></i></button>') , 'Tomar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

    var _atributos = [
        _tomaOT ,
        'IdOT',
        ['nombre_cliente','Cliente'],
        ['local','Local'],
        ['nombre_sistema','Servicio'],
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('FechaMySQL') , _fechaONlyLatFormat ) , 'Fecha'], 
        ['SubEstado','Estado']
    ];
    //
    var _dataOT = await asignarTecnicoModel.findAll({
        attributes : [ 'IdOT' ] ,
        where : _where,
        limit : _limit
    });
    //
    var _arrOts = [];
    for (let index = 0; index < _dataOT.length; index++) {
        const _rs = _dataOT[index];
        _arrOts.push( _rs.IdOT );
    }
    //
    varDump( _arrOts );
    if( _arrOts.length > 0 )
    {
        _dataResp = await otModel.findAll({
            attributes : _atributos ,
            order : [
                ['IdOT' , 'DESC']
            ],
            where : {
                IdOT : { [Op.in]: _arrOts }
            },
            limit : _limit
        });
    }
    return _dataResp;
    //
}
// -------------------------------------------------------------
async function tblPorductos01( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `Producto`;
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Ed.' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'An.' ];

    var _atributos = [
        _editItem ,
        _DelItem,
        ['IdProducto','CodProd.'],
        ['Producto','Descripción'],
        ['Ingrediente','Ing. activo'],
        'Dosis',
        [ 'TiempoEspera' , 'Tiempo espera' ]
    ];
    //
    _dataResp = await productoTrabajoOTModel.findAll({
        attributes : _atributos ,
        order : [
            ['Codigo' , 'DESC']
        ],
        where : _where,
        limit : _limit
    })
    .catch(function (err) {
        varDump( err );
    });
    //
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
        var _userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        varDump( _userData.dni );
        _response.data = await tblTecnico01( { IdTecnico : _userData.dni } , 200  );
        
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `OTs cargadas.` };
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
router.post('/get_ot', async (req,res)=>{
    // IdOT
    var _response = {};
    _response.codigo = 200;

    _response.cliente = [];
    _response.data    = [];
    _response.tecnico = [];
    _response.local   = [];
    _response.trabajo = [];

    try {
        //
        var _userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        var _Entidad = await otModel.findOne({
            where : {
                IdOT : req.body.IdOT
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
            // Data de trabajo
            var _trabajoTec = await asignarTecnicoModel.findOne({
                where : {
                    IdOT : _Entidad.IdOT , 
                    IdTecnico : _userData.dni 
                }
            });
            _response.trabajo = _trabajoTec;
            // Cliente
            var _cliente = await clienteModel.findOne({
                where : {
                    IdClienteProv : _Entidad.IdClienteProv
                }
            });
            _response.cliente = _cliente;
            var _where = {
                IdOT : _Entidad.IdOT ,
                IdOS : _Entidad.NroOS 
            };
            var _Local = await sucursalModel.findOne({
                where : {
                    IdSucursal : _Entidad.IdLocal
                }
            });
            _response.local = _Local;
            _response.tecnico = await execQueryTecnico( _where , 2000  );
        }
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Datos de OT cargado.` };
        //
    } catch (error) {
        varDump( err );
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
router.post('/iniciar_trabajo', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        var _userData = await helpersController.getUserData( req.headers['api-token'] );
        // Ya tiene un trabajo iniciado¿?
        if( _userData.trabajo_iniciado )
        {
            _response.codigo = 202;
            // Hace cuanto ha inciado el trabajo.
            var _FechaMod = moment().format('YYYY-MM-DD HH:mm:ss');
            var now     = _FechaMod;
            var then    = _userData.trabajo_iniciado;
            var _Diff   = moment.utc(moment(now,"YYYY-MM-DD HH:mm:ss").diff(moment(then,"YYYY-MM-DD HH:mm:ss"))).format("HH:mm:ss");
            //
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `warning` , 'texto' : `Tiene un trabajo iniciado: ${_Diff}.` };
            //
        }else{
            //
            var _Entidad = await asignarTecnicoModel.findOne({
                where : {
                    uu_id : req.body.uuid
                }
            })
            .catch(function (err) {
                varDump( err );_response.codigo = 400;
                _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
            });
            //
            _response.data = _Entidad;
            if( _Entidad )
            {
                //
                var _IdOS = _Entidad.IdOS;
                var _IdOT = _Entidad.IdOT;
                // Asignar trabajo
                await asignarTecnicoModel.update({
                    Estado : 'Iniciado'
                },{
                    where : {
                        uu_id : req.body.uuid
                    }
                });
                // Usuario.
                await User.update({
                    IdOT : _Entidad.IdOT ,
                    trabajo_ot : _Entidad.id ,
                    trabajo_iniciado : moment().format('YYYY-MM-DD HH:mm:ss')
                },{
                    where : {
                        id : _userData.id
                    }
                });
                //
            }
            //
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `success` , 'texto' : `Trabajo iniciado.` };
        }
        //
    } catch (error) {
        varDump( error );_response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/finalizar_trabajo', async (req,res)=>{
    // uuid, SubEstado, IdOT
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        var _Entidad = await asignarTecnicoModel.findOne({
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
            // CAMBIAR SUB ESTADO OT
            await otModel.update({
                SubEstado : req.body.SubEstado
            },{
                where : {
                    IdOT : _Entidad.IdOT
                }
            });
            // FINALIZAR TRABAJO USUARIO
            await User.update({
                trabajo_ot : null ,
                trabajo_iniciado : null
            },{
                where : {
                    id : $userData.id
                }
            });
            // CAMBIAR ESTADO TRABAJO
            var _trabajoOT = ``;
            switch ( req.body.SubEstado ) {
                case 'Realizado':
                case 'Realizado-T':
                    _trabajoOT = `Realizado`;
                break;
                case 'Cancelado':
                case 'Documentacion':
                case 'Error De Digitacion':
                case 'Otros':
                    _trabajoOT = `Cancelado`;
                break;
                default:
                    _trabajoOT = `*`;
                break;
            }
            await asignarTecnicoModel.update({
                Estado : _trabajoOT
            },{
                where : {
                    id : _Entidad.id
                }
            });
        }
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Trabajo OT ${req.body.SubEstado}.` };
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
router.post('/imagenes', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        var _Entidad = await archiGoogleModel.findAll({
            where : {
                Token : req.body.uuid
            }
        })
        .catch(function (err) {
            varDump( err );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        //
        _response.data = _Entidad;
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Archivos cargados.` };
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

//////////////////////////////////////////
//       ELIMINAR ARCHIVO            //
//////////////////////////////////////////
router.post('/delFile/:uu_id', async (req,res)=>{
    //console.log(req.params.uu_id);
	await archiGoogleModel.destroy({
		where : {
            uu_id : req.params.uu_id 
            }
	});
	res.json({estado:'OK'});
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//              AGREGAR PRODUCTOS A LA LISTA            //
//////////////////////////////////////////////////////////
router.post('/add_productos', async (req,res)=>{
    // Token, Prods
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        var _userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        if( _userData.trabajo_ot )
        {
            // Hay trabajo inciado
            var _dataTrabajo = await asignarTecnicoModel.findOne({
                where : {
                    id : _userData.trabajo_ot
                }
            });
            var _TextProds = req.body.Prods;
            var _ArrProds  = _TextProds.split(',');
            for (let index = 0; index < _ArrProds.length; index++) {
                const _rs = _ArrProds[index];
                var _Producto = await productosModel.findOne({
                    where : {
                        IdProducto: _rs
                    }
                });
                if( _Producto )
                {
                    // productoTrabajoOTModel
                    var _insertar = {
                        IdOT : _dataTrabajo.IdOT ,
                        IdOS : _dataTrabajo.IdOS ,
                        IdTecnico    : _userData.dni ,
                        Tecnico      : _userData.name , 
                        IdProducto   : _Producto.IdProducto , 
                        Producto     : _Producto.Descripcion , 
                        Ingrediente  : '-' ,
                        Dosis        : '-' ,
                        TiempoEspera : '-' ,
                        Token        : req.body.Token
                    };
                    var _uuid = await helpersController.renovarToken();
                    _insertar.uu_id = _uuid;
                    await productoTrabajoOTModel.create( _insertar )
                    .catch(function (err) {
                        varDump( err );
                    });
                }
            }
            //
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Productos agregados.` };
            //
        }else{
            //
            _response.codigo = 202;
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `No hay trabajo curso.` };
        }
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
router.post('/get_productos', async (req,res)=>{
    // Token
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        _response.data = await tblPorductos01( { Token : req.body.Token } , 200  );
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Productos cargados.` };
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
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/carga_producto', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        var _where = {};
        //
        var _dataProd = await productoTrabajoOTModel.findOne({
            where : {
                uu_id : req.body.uuid
            }
        });
        _response.data = _dataProd;
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Item cargado.` };
        //
    } catch (error) {
        varDump(  error );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
    res.json( $response );
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//               ACTUALIZAR DATOS PRODUCTO              //
//////////////////////////////////////////////////////////
router.post('/update_producto', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        //
        delete req.body.id;
        await productoTrabajoOTModel.update( req.body ,{
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Item Guardado.` };
        //
    } catch (error) {
        varDump(  error );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
    res.json( $response );
});
// -------------------------------------------------------------

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

    try {
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        await asignarTecnicoModel.create(req.body)
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await asignarTecnicoModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        if( _dataGuardado )
        {
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'INC'+_Codigo;
            await asignarTecnicoModel.update({
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
            await xlsLAPIncidenciasDetModel.update({
                CodigoHead : _Codigo
            },{
                where : {
                    Token : req.body.uu_id
                }
            });
            // Unir con detalle.
            await archiGoogleModel.update({
                Cod001 : _Codigo ,
                correlativo : _dataGuardado.id
            },{
                where : {
                    token : req.body.uu_id
                }
            });
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se guardó el documento ${_Codigo} correctamente.` };
        }

        _response.item = await asignarTecnicoModel.findOne({
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
    _response.files   = [];

    try {
        //
        var _Entidad = await asignarTecnicoModel.findOne({
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
            // Files
            var _Files = await archiGoogleModel.findAll({
                where : {
                    token : _Entidad.uu_id
                }
            });
            _response.files = _Files;
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
        // DOCUMENTO DIPONIBLE PARA GUARDAR?
        var _DocDisponible = await estadoDocController.docDisponible2( 'GAAA' , ['Activo'] , req.body.Codigo );
        varDump( _DocDisponible );
        if( _DocDisponible.codigo == 202 ){
            return res.status(200).json( _DocDisponible );
        }
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        _response.data = [];
        //
        await asignarTecnicoModel.update(req.body,{
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await asignarTecnicoModel.findOne({
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
        // DOCUMENTO DIPONIBLE PARA ANULAR?
        var _DocDisponible = await estadoDocController.docDisponible2( 'GAAAA' , ['Activo'] , req.body.Codigo );
        varDump( _DocDisponible );
        if( _DocDisponible.codigo == 202 ){
            return res.status(200).json( _DocDisponible );
        }
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        await asignarTecnicoModel.update({
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
        
        _response.item = await asignarTecnicoModel.findOne({
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

