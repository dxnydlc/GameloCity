// api_trabajoCronograma.js

var _NombreDoc = 'api_trabajoCronograma';

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
const { cronogramaPersonalCabModel,cronogramaPersonalDetModel, cronogramaTrabajoInfoModel, cronogramaTrabajoDetModel, cronogramaTrabajoCabModel, User, sequelize, archiGoogleModel, sucursalModel } = require('../../db');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

// COntrolador
const helpersController  = require('../../controllers/helpersController');

// VALIDACION
var _Requeridos = [
    check( 'CodActividad' ,'Seleccione actividad a trabajar' ).not().isEmpty()
];







// -------------------------------------------------------------
async function execQuery( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `Actividad`;
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

    var _atributos = [
        _editItem,
        _DelItem,
        'Codigo',
        ['CodigoTrabDet','CodAct.'],
        'Actividad',
        ['Usuario','Operario'],
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('Fecha') , _fechaONlyLatFormat ) , 'Fecha'], 
        'Revision',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'], 
    ];
    //
    _dataResp = await cronogramaTrabajoInfoModel.findAll({
        attributes : _atributos ,
        order : [
            ['Codigo' , 'DESC']
        ],
        where : _where,
        limit : _limit
    })
    return _dataResp;
    //
}
// -------------------------------------------------------------
async function tblSeleccion( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `Actividad`;

    var _chkItem =  [ sequelize.fn('CONCAT' , '<label  data-uuid="', sequelize.col('uu_id') , '" for="chk_', sequelize.col('id') , '" ><input class=" lblCheck " type="checkbox" value="', sequelize.col('id') , '" id="chk_', sequelize.col('id') , '" name="chkActApp" /> ', sequelize.col('Codigo') , '</label>' ) , 'Sel.' ];

    var _atributos = [
        _chkItem ,
        'Actividad',
        ['Usuario','Supervisor'],
        'Revision',
        [ 'Glosa', 'Coment.'],
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('Fecha') , _fechaONlyLatFormat ) , 'Fecha'], 
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'], 
    ];
    //
    _dataResp = await cronogramaTrabajoInfoModel.findAll({
        attributes : _atributos ,
        order : [
            ['Codigo' , 'DESC']
        ],
        where : _where,
        limit : _limit
    })
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
//      			GUARDAR TAREA       			//
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
        req.body.IdUsuario = $userData.dni;
        req.body.Usuario   = $userData.name;
        req.body.Fecha     = moment().format('YYYY-MM-DD');
        // 
        await cronogramaTrabajoInfoModel.create(req.body)
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await cronogramaTrabajoInfoModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        if( _dataGuardado )
        {
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'TRA'+_Codigo;
            await cronogramaTrabajoInfoModel.update({
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
            await archiGoogleModel.update({
                correlativo : _dataGuardado.id ,
                Cod001 : _Codigo
            },{
                where : {
                    Token : req.body.uu_id
                }
            });
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Tarea ${_Codigo} guardada.` };
        }

        _response.item = await cronogramaTrabajoInfoModel.findOne({
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
//      			GUARDAR TAREA       			//
//////////////////////////////////////////////////////////
router.post('/guardar', _Requeridos ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var _response = {};
    _response.codigo = 200;
    _response.item = [];

    try {
        //
        var $userData = await getUserData( req.headers['api-token'] );
        //
        req.body.IdUsuario = $userData.dni;
        req.body.Usuario   = $userData.name;
        req.body.Fecha     = moment().format('YYYY-MM-DD');
        CodigoTrabDet = req.body.CodActividad;
        var _NombreActividad = ``;
        var _dataActividad = await cronogramaTrabajoDetModel.findOne({
        where : {
            Codigo : req.body.CodActividad
        }
        });
        if( _dataActividad )
        {
        _NombreActividad = _dataActividad.Actividad;
        }
        var _dataInsertado = {};
        _dataInsertado.Fecha    = moment().format('YYYY-MM-DD');
        // uu_id
        _dataInsertado.uu_id    =  req.body.uu_id;
        // CodActividad
        _dataInsertado.CodigoTrabDet = req.body.CodActividad;
        _dataInsertado.Actividad     = _NombreActividad;
        // Glosa
        _dataInsertado.Glosa     = req.body.Glosa;
        // Revision
        _dataInsertado.Revision  = req.body.Revision;
  
        _dataInsertado.IdUsuario = $userData.dni;
        _dataInsertado.Usuario   = $userData.name;
        // 
        await cronogramaTrabajoInfoModel.create( _dataInsertado )
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await cronogramaTrabajoInfoModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        if( _dataGuardado )
        {
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'TRA'+_Codigo;
            await cronogramaTrabajoInfoModel.update({
                Codigo : _Codigo
            },{
                where  : {
                    uu_id : req.body.uu_id
                }
            })
            .catch(function (err) {
                _respuesta.codigo = 500;
                _respuesta.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
            });
            // Unir con detalle.
            await archiGoogleModel.update({
                Cod001 : _Codigo
            },{
                where : {
                    Token : req.body.uu_id
                }
            });
        }

        // Data guardada
        _response.item = await cronogramaTrabajoInfoModel.findOne({
            attributes: [ 
            'uu_id', 'Codigo', ['CodigoTrabDet','CodActividad'], 'Actividad', 'Glosa', 'Revision', 'Usuario',
            [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'],  
            ],
            where : {
                uu_id : req.body.uu_id
            }
        });
        // 
        _response.resp = { 'titulo' : `Correcto` , 'clase' : 'success' , 'texto' : 'Datos guardados correctamente' } ;
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
    _response.header  = [];
    _response.detalle = [];
    _response.activid = [];
    _response.archivos = [];

    try {
        //
        var _Entidad = await cronogramaTrabajoInfoModel.findOne({
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
            // Archivos
            var _archivos = await archiGoogleModel.findAll({
                attributes : [ ['url','Img'], [ 'url' ,'Thumb' ] ],
                where : {
                    token : _Entidad.uu_id
                }
            });
            _response.archivos = _archivos;
            // Data Detalle de actividad
            var _detalle = await cronogramaTrabajoDetModel.findOne({
                where : {
                    Codigo : _Entidad.CodigoTrabDet
                }
            });
            _response.detalle= _detalle;
            if( _detalle )
            {
                // Encabezado del cronograma
                var _head = await cronogramaTrabajoCabModel.findOne({
                    where : {
                        Codigo : _detalle.CodigoHead
                    }
                });
                _response.header = _head;
                // Locales
                var _Locales = await sucursalModel.findAll({
                    where : {
                        IdClienteProv : _head.IdCliente
                    }
                });
                _response.locales = _Locales;
                // Actividades
                var _activi = await cronogramaTrabajoDetModel.findAll({
                    where : {
                        CodigoHead : _head.Codigo
                    },
                    order : [
                        ['id' , 'ASC']
                    ],
                });
                _response.activid = _activi;
            }
            //
        }
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se cargaron los datos del documento: ${_Entidad.Codigo}.` };
        //
    } catch (error) {
        varDump( error );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//         CARGAR DOCUMENTO PARA LA APP DE SSAYS        //
//////////////////////////////////////////////////////////
router.post('/cargar', async (req,res)=>{
    // uu_id
    var _response = {};
    _response.codigo = 200;

    _response.archivos  = [];
    _response.data      = [];

    varDump(`APP SSAYS cargar trabajo => ${req.body.uu_id}.`);

    try {
        //
        var _Entidad = await cronogramaTrabajoInfoModel.findOne({
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
        if( _Entidad )
        {
            //
            var _dataFull = {};
            _dataFull.uu_id     = _Entidad.uu_id;
            _dataFull.Id        = _Entidad.id;
            _dataFull.Codigo    = _Entidad.Codigo;
            _dataFull.CodActividad  = _Entidad.CodigoTrabDet;
            _dataFull.Actividad     = _Entidad.Actividad;
            _dataFull.Usuario       = _Entidad.Usuario;
            _dataFull.Revision      = _Entidad.Revision;
            _dataFull.Glosa         = _Entidad.Glosa;
            _dataFull.Fecha = moment(_Entidad.updatedAt).format('YYYY-MM-DD HH:mm:ss');
            _response.data = _dataFull;
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se cargó documento: ${_Entidad.Codigo}.` };
        }else{
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `No existe el trabajo.` };
        }
        
        if( _Entidad )
        {
            // Archivos
            var _archivos = await archiGoogleModel.findAll({
                attributes : [ ['url','Img'], [ 'url' ,'Thumb' ] ],
                where : {
                    token : _Entidad.uu_id
                }
            });
            _response.archivos = _archivos;
        }
        varDump(`Archivos para ver en la app => `);
        varDump(_response.archivos);
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
        await cronogramaTrabajoInfoModel.update(req.body,{
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await cronogramaTrabajoInfoModel.findOne({
            where : {
                uu_id : req.params.uuid
            }
        });
        // 342206 343129
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Tarea ${req.body.Codigo} actualizada.` };
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
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.post('/actualizar', _Requeridos , async (req,res)=>{
    // uu_id
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var _response = {};
    _response.codigo = 200;

    try {
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        var _NombreActividad = ``;
        var _dataActividad = await cronogramaTrabajoDetModel.findOne({
        where : {
            Codigo : req.body.CodActividad
        }
        });
        if( _dataActividad )
        {
            _NombreActividad = _dataActividad.Actividad;
        }
        var _dataInsertado = {};
        // CodActividad
        _dataInsertado.CodigoTrabDet = req.body.CodActividad;
        _dataInsertado.Actividad     = _NombreActividad;
        // Glosa
        _dataInsertado.Glosa     = req.body.Glosa;
        // Revision
        _dataInsertado.Revision  = req.body.Revision;
        await cronogramaTrabajoInfoModel.update( _dataInsertado ,{
            where : {
                uu_id : req.body.uu_id
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        // Data guardada
        _response.item = await cronogramaTrabajoInfoModel.findOne({
            attributes: [ 
            'uu_id', 'Codigo', ['CodigoTrabDet','CodActividad'], 'Actividad', 'Glosa', 'Revision', 'Usuario',
            [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'],  
            ],
            where : {
                uu_id : req.body.uu_id
            }
        });
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Tarea actualizada.` };
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
        await cronogramaTrabajoInfoModel.update({
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
        
        _response.item = await cronogramaTrabajoInfoModel.findOne({
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
//       OBTENER ACTIVIDADES PARA LA APP DE SSAYS       //
//////////////////////////////////////////////////////////
router.post('/get_actividades', async (req,res)=>{
    /*
    Vamos a mostrar todas las activiades que tiene este usuario basado en 
    su IdClinte e IdLocal
    */
   // fecha
    _respuesta = {};
    _respuesta.codigo = 200;

    try {
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        varDump(req.headers['api-token']);
        var _userLogin = await getUserData( req.headers['api-token'] );
        var _TipoUsuario = _userLogin.TipoUsuario;
        varDump(`Actividades, cliente: ${_userLogin.nombre_cliente}, Local: ${_userLogin.nombre_local}`);
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        var _Fecha = req.body.fecha;

        if(! _Fecha )
        {
            // Fecha de hoy por defecto
            _Fecha = moment().format('YYYY-MM-DD');
        }

        varDump(`Fecha a usar: ${_Fecha}.`);
        varDump(`TipoUsuario: ${_TipoUsuario}.`);

        var _cabCronograma = await cronogramaPersonalCabModel.findAll({
            where : {
                IdCliente : _userLogin.cliente ,
                IdLocal   : _userLogin.sucursal ,
            }
        })
        .catch(function (err) {
            _respuesta.codigo = 400;
            _respuesta.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original };
        });

        var _arrIds = [];
        if( _cabCronograma )
        {
            for (let index = 0; index < _cabCronograma.length; index++)
            {
                const dataCab = _cabCronograma[index];
                _arrIds.push( dataCab.Codigo );
            }
            varDump(`Código de cronograma: ${_arrIds}.`);
        }else{
            varDump(`***no hay Cronograma***`);
        }

        // Traemos el detalle de las actividades a realizar
        var _dataActividades = await cronogramaPersonalDetModel.findAll({
            attributes : [ 'Codigo' ,'Horario' ,'Actividad' ],
            where: {
            CodigoHead : { [Op.in] : _arrIds }
            }
        });

        // Nodo de listado
        var _nodoHome = [];
        for (let index = 0; index < _dataActividades.length; index++)
        {
            const _rs = _dataActividades[index];
            var _Estado = 'Pendiente';
            var _o = {};

            if( _TipoUsuario == 'Administrativo' )
            {
                // Buscamos por administrador, todos los usuarios
                var _trabajo = await cronogramaTrabajoInfoModel.findAll({
                    where: {
                        CodigoTrabDet : _rs.Codigo,
                        Fecha : _Fecha
                    }
                });
                //
            }else{
                // Buscamos por usuario logeado
                var _trabajo = await cronogramaTrabajoInfoModel.findAll({
                    where: {
                        CodigoTrabDet : _rs.Codigo,
                        IdUsuario : _userLogin.dni,
                        Fecha : _Fecha
                    }
                });
                //
            }
            varDump(`Codigo: ${_rs.Codigo} >>>>> Actividad: ${_rs.Actividad} >>>>> ${_trabajo.length}.`);
            
            // Actividad - Codigo de la actividad
            _o.Codigo = _rs.Codigo;
            // Actividad - Nombre actividad / ${_rs.Codigo}>>
            _o.Actividad = `${_rs.Actividad} - ${_rs.Horario}`;
            if( _trabajo.length > 0 )
            {
                for (let indexA = 0; indexA < _trabajo.length; indexA++) {
                    const _rsT = _trabajo[indexA];
                    // Trabajo - uuid de trabajo
                    _o.uuid   = _rsT.uu_id;
                    // Trabajo - Fecha de trabajo
                    _o.Fecha   = moment(_rsT.Fecha).format('DD/MM/YYYY');
                    // Nombre
                    _o.Nombre = _rsT.Usuario
                }
                _o.Estado = `Realizado`;
            }else{
                _o.Estado = _Estado;
                // Nombre
                if( _TipoUsuario == 'Administrativo' )
                {
                    //
                    _o.Nombre = ``;
                }else{
                    _o.Nombre = _userLogin.name;
                    //
                }
            }
            //
            _nodoHome.push( _o );
        }
        _respuesta.data = _nodoHome;

        _respuesta.msg = { 'titulo' : `Correcto` , 'clase' : 'success' , 'msg' : 'Datos cargados.' } ;
        //
    } catch (error) {
      _respuesta.codigo = 500;
      _respuesta.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    res.status(_respuesta.codigo).send( _respuesta );
});
// -------------------------------------------------------------
router.post('/get_actividades_old', async (req,res)=>{
    /*
    Vamos a mostrar todas las activiades que tiene este usuario basado en 
    su IdClinte e IdLocal
    */
   // fecha
    _respuesta = {};
    _respuesta.codigo = 200;

    try {
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        varDump(req.headers['api-token']);
        var _userLogin = await getUserData( req.headers['api-token'] );
        var _TipoUsuario = _userLogin.TipoUsuario;
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        var _Fecha = req.body.fecha;

        if(! _Fecha )
        {
            // Fecha de hoy por defecto
            _Fecha = moment().format('YYYY-MM-DD');
        }

        varDump(`Fecha a usar: ${_Fecha}.`);
        varDump(`TipoUsuario: ${_TipoUsuario}.`);

        var _cabCronograma = await cronogramaTrabajoCabModel.findAll({
            where : {
                IdCliente : _userLogin.cliente ,
                IdLocal   : _userLogin.sucursal ,
            }
        })
        .catch(function (err) {
            _respuesta.codigo = 400;
            _respuesta.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original };
        });

        var _arrIds = [];
        if( _cabCronograma )
        {
            for (let index = 0; index < _cabCronograma.length; index++)
            {
                const dataCab = _cabCronograma[index];
                _arrIds.push( dataCab.Codigo );
            }
            varDump(`Código de cronograma: ${_arrIds}.`);
        }else{
            varDump(`***no hay Cronograma***`);
        }

        // Traemos el detalle de las actividades a realizar
        var _dataActividades = await cronogramaTrabajoDetModel.findAll({
            attributes : [ 'Codigo' ,'Horario' ,'Actividad' ],
            where: {
            CodigoHead : { [Op.in] : _arrIds }
            }
        });

        // Nodo de listado
        var _nodoHome = [];
        for (let index = 0; index < _dataActividades.length; index++)
        {
            const _rs = _dataActividades[index];
            var _Estado = 'Pendiente';
            var _o = {};

            if( _TipoUsuario == 'Administrativo' )
            {
                // Buscamos por administrador
                var _trabajo = await cronogramaTrabajoInfoModel.findAll({
                    where: {
                        CodigoTrabDet : _rs.Codigo,
                        Fecha : _Fecha
                    }
                });
                //
            }else{
                // Buscamos por usuario logeado
                var _trabajo = await cronogramaTrabajoInfoModel.findAll({
                    where: {
                        CodigoTrabDet : _rs.Codigo,
                        IdUsuario : _userLogin.dni,
                        Fecha : _Fecha
                    }
                });
                //
            }
            varDump(`Codigo: ${_rs.Codigo} >>>>> Actividad: ${_rs.Actividad} >>>>> ${_trabajo.length}.`);
            
            // Actividad - Codigo de la actividad
            _o.Codigo = _rs.Codigo;
            // Actividad - Nombre actividad / ${_rs.Codigo}>>
            _o.Actividad = `${_rs.Actividad} - ${_rs.Horario}`;
            if( _trabajo.length > 0 )
            {
                for (let indexA = 0; indexA < _trabajo.length; indexA++) {
                    const _rsT = _trabajo[indexA];
                    // Trabajo - uuid de trabajo
                    _o.uuid   = _rsT.uu_id;
                    // Trabajo - Fecha de trabajo
                    _o.Fecha   = moment(_rsT.Fecha).format('DD/MM/YYYY');
                    // Nombre
                    _o.Nombre = _rsT.Usuario
                }
                _o.Estado = `Realizado`;
            }else{
                _o.Estado = _Estado;
                // Nombre
                if( _TipoUsuario == 'Administrativo' )
                {
                    //
                    _o.Nombre = ``;
                }else{
                    _o.Nombre = _userLogin.name;
                    //
                }
            }
            //
            _nodoHome.push( _o );
        }
        _respuesta.data = _nodoHome;

        _respuesta.msg = { 'titulo' : `Correcto` , 'clase' : 'success' , 'msg' : 'Datos cargados.' } ;
        //
    } catch (error) {
      _respuesta.codigo = 500;
      _respuesta.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    res.status(_respuesta.codigo).send( _respuesta );
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//         LISTAR TAREAS FINALIZADAS EN LA APP           //
//////////////////////////////////////////////////////////
router.post('/listar_from_app', async (req,res)=>{
    // inicio , fin
    var _response = {};
    _response.codigo = 200;

    _response.data    = [];

    try {
        //
        var _where      = {};
        _where.Fecha    = { [ Op.gte ] : req.body.inicio , [ Op.lte ] : req.body.fin };
        _response.data  = await tblSeleccion( _where , 2000  );
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Datos cargados.` };
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
router.post('/by_ids', async (req,res)=>{
    // ids(,)
    var _response = {};
    _response.codigo = 200;

    _response.data    = [];

    try {
        //
        var _ids    = req.body.ids;
        var _arrIds = _ids.split(',');
        var _Entidad = await cronogramaTrabajoInfoModel.findAll({
            where : {
                id : { [Op.in] : _arrIds }
            }
        })
        .catch(function (err) {
            varDump( err );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        //
        var _data = [];
        if( _Entidad )
        {
            for (let index = 0; index < _Entidad.length; index++) {
                const _rs = _Entidad[index];
                var _o = {};
                // Archivos
                var _archivos = await archiGoogleModel.findAll({
                    attributes : [ ['url','Img'], [ 'url' ,'Thumb' ] , 'id' ],
                    where : {
                        token : _rs.uu_id
                    }
                });
                _o.data = _rs;
                _o.files = _archivos;
                _data.push( _o );
            }
        }
        //
        _response.data = _data;

        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Imágenes cargadas.` };
        //
    } catch (error) {
        varDump( error );
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

//////////////////////////////////////////////////////////
//                  LISTAR OPERARIOS                    //
//////////////////////////////////////////////////////////
router.post('/items/all', async (req,res)=>{
    // Token
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        //
        var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" type="button" class=" itemEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
        var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" type="button" class=" itemDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

        var _DataSec = await archiGoogleModel.findAll({
            where : {
                Token : req.body.Token
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        //
        _response.data = _DataSec;
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se información cargada correctamente.` };
        //
    } catch (error) {
        //
        varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
        //
    }
    
    return res.status(_response.codigo).json( _response );
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELMINAR OPERARIO                    //
//////////////////////////////////////////////////////////
router.post('/items/del', async (req,res)=>{
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        //
        await archiGoogleModel.destroy({
            where : {
                uu_id : req.body.uuid
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se eliminó la imagen.` };
        //
    } catch (error) {
        //
        varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
        //
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
async function getUserData( $token )
{
    //
    var $data;
    var _antributos = [
        'id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular','Iniciales','cliente','sucursal',
        ['cliente','IdCliente'], ['nombre_cliente','Cliente'], ['sucursal','IdLocal'], ['nombre_local','Local'], 'TipoUsuario' ,
        'nombre_cliente', 'nombre_local'
    ];
    $data = await User.findOne({
        attributes: _antributos ,
        where : {
            api_token : $token
        }
    });
    return $data;
    //
};
// -------------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
module.exports = router;
// -------------------------------------------------------------

