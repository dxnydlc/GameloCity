
// api_actividadesCronograma.js


var _NombreDoc = 'api_actividadesCronograma';
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
const { cronogramaTrabajoCabModel, cronogramaTrabajoDetModel, cronogramaTrabajoInfoModel, xlsLAPIncidenciasDetModel, User, sequelize, archiGoogleModel, sucursalModel } = require('../../db');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

// Controlador
const helpersController  = require('../../controllers/helpersController');

// VALIDACION
var _Requeridos = [
    check('Actividad' ,'Ingrese actividad.').not().isEmpty(),
    check('Hinicio' ,'Ingrese hora de inicio.').not().isEmpty(),
    check('HFin' ,'Ingrese hora de fin.').not().isEmpty()
];

// -------------------------------------------------------------
async function execQuery( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `Actividad`;
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" itemEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" itemDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

    var _atributos = [
        _DelItem,
        _editItem,
        ['Indice','Nro.'],
        'Horario',
        'Actividad',
        'Lu',
        'Ma',
        'Mi',
        'Ju',
        'Vi',
        'Sa',
        'Do',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'], 
    ];
    //
    _dataResp = await cronogramaTrabajoDetModel.findAll({
        attributes : _atributos ,
        order : [
            ['Codigo' , 'ASC']
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
router.post('/lista',async(req,res)=>{
    // Token
    var _response = {};
    _response.codigo = 200;
    _response.data = [];
    var _where = {};
    _where.Token = req.body.Token;

    try {
        _response.ut   = await helpersController.getUserData( req.headers['api-token'] );
        _response.data = await execQuery( _where , 200  );
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
        let _hoy = moment().format('YYYY-MM-DD');
        var _Hinicio = moment( `${_hoy} ${req.body.Hinicio}` ).format('h:mm a');
        var _HFin = moment( `${_hoy} ${req.body.HFin}` ).format('h:mm a');
        req.body.Horario = `${_Hinicio} - ${_HFin}`;
        //
        await cronogramaTrabajoDetModel.create(req.body)
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await cronogramaTrabajoDetModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        if( _dataGuardado )
        {
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'ACT'+_Codigo;
            await cronogramaTrabajoDetModel.update({
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

            _response.resp = { 'titulo' : `Correcto` , 'clase' : `success` , 'texto' : `Actividad agregada.` };
            // Actualizar indice.
            await updateIdices( _dataGuardado.Token );
        }
        _response.item = await cronogramaTrabajoDetModel.findOne({
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

    try {
        //
        var _Entidad = await cronogramaTrabajoDetModel.findOne({
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
        await cronogramaTrabajoDetModel.update(req.body,{
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await cronogramaTrabajoDetModel.findOne({
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
        await cronogramaTrabajoDetModel.destroy({
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            varDump( err );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        //
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
//                  CARGAR DOCUMENTO                    //
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
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      
        var _Fecha = req.body.fecha;

        if(! _Fecha ){
            // Fecha de hoy por defecto
            _Fecha = moment().format('YYYY-MM-DD');
        }

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
            for (let index = 0; index < _cabCronograma.length; index++) {
                const dataCab = _cabCronograma[index];
                _arrIds.push( dataCab.Codigo );
            }
        }else{
            varDump(` no hay _cabCronograma`);
        }
            
        varDump( _arrIds );

        // Traemos el detalle de las activiades a realizar
        var _dataActividades = await cronogramaTrabajoDetModel.findAll({
            attributes : [ 'Codigo' ,'Horario' ,'Actividad' ],
            where: {
            CodigoHead : { [Op.in] : _arrIds }
            }
        });
        //_respuesta.actividades = _dataActividades;
        // Activiades que YA ha realizado
        var _Data = await cronogramaTrabajoInfoModel.findAll({
            attributes: [ 
            'id','uu_id', 'Codigo', ['CodigoTrabDet','CodActividad'], 'Actividad', 'Glosa', 'Revision', 'Usuario',
            [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'],  
            ],
            where: {
            Fecha : _Fecha,
            IdUsuario : _userLogin.dni
            }
        });
        //_respuesta.data = _Data;
        // Nodo de listado
        var _nodoHome = [];
        for (let index = 0; index < _dataActividades.length; index++) {
            const _rs = _dataActividades[index];
            var _Estado = 'Pendiente';
            var _o = {};
            var _trabajo = await cronogramaTrabajoInfoModel.findAll({
            where: {
                CodigoTrabDet : _rs.Codigo,
                IdUsuario : _userLogin.dni
            }
            });
            varDump(`>>>>${_rs.Codigo} - ${_userLogin.dni} >>>>> ${_trabajo.length}.`);
            
            // Actividad - Codigo de la actividad
            _o.Codigo = _rs.Codigo;
            // Actividad - Nombre actividad
            _o.Actividad = `${_rs.Actividad} - ${_rs.Horario}`;
            if( _trabajo.length > 0 )
            {
            for (let indexA = 0; indexA < _trabajo.length; indexA++) {
                const _rsT = _trabajo[indexA];
                // Trabajo - uuid de trabajo
                _o.uuid   = _rsT.uu_id;
                // Trabajo - Fecha de trabajo
                _o.Fecha   = moment(_rsT.Fecha).format('DD/MM/YYYY');
            }
            _o.Estado = `Realizado`;
            }else{
            _o.Estado = _Estado;
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
async function updateIdices( Token )
{
    // Esta funcion va a generar los indices en el detalle del cronograma
    var _Detalles = await cronogramaTrabajoDetModel.findAll({
        where : {
            Token : Token
        },
        order : [
            [ 'id' , 'asc' ]
        ]
    });
    //
    varDump(`Hay ${_Detalles.length} detalles. en : ${Token}.`);
    //
    for (let index = 0; index < _Detalles.length; index++) {
        const rs = _Detalles[index];
        await cronogramaTrabajoDetModel.update({
            Indice : index + 1,
        },{
            where : {
                id : rs.id
            }
        });
    }
}
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
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
//      			IMPORTAR FROM XLS                   //
//////////////////////////////////////////////////////////
router.post('/importar_xls',async(req,res)=>{
    // IdFile, Token

    var _response = {};
    _response.codigo = 200;

    try {
        //
        _response.data = [];
        _response.ut = await helpersController.getUserData( req.headers['api-token'] );
        var _Archivo = await archiGoogleModel.findOne({
            where : {
                id : req.body.IdFile
            }
        });
        _response.file = _Archivo;

        if( _Archivo )
        {
            varDump(`Archivo ${_Archivo.id} existe ${_Archivo.nombre_archivo}`);
            // Reading our test file
            const file = reader.readFile( _Archivo.ruta_fisica );
            let data = [];
            const sheets = file.SheetNames
            //varDump( sheets );
            for(let i = 0; i < sheets.length; i++)
            {
                const temp = reader.utils.sheet_to_json(
                    file.Sheets[file.SheetNames[i]]);
                    //varDump(temp);
                await temp.forEach( async (res) => {
                    if( res.Fecha )
                    {
                        //
                        var _dataProk = {
                            uu_id  : await helpersController.renovarToken(),
                            Token  : req.body.Token,
                            Ocurrencia  : res.Ocurrencia,
                            Cubiculo    : res.Cubiculo,
                            HelpDesk    : res.HelpDesk,
                            Banio       : res.Banio,
                            Ubicacion   : res.Ubicacion
                        };
                        try {
                            var _Fecha = res.Fecha;
                            varDump(_Fecha);
                            if( _Fecha ){
                                var _fecMy = _Fecha.split('/');
                                var _fechaMYSQL = `${_fecMy[2]}-${_fecMy[1]}-${_fecMy[0]}`;
                                varDump(_fechaMYSQL);
                                _dataProk.Fecha = _fechaMYSQL;
                            }
                        } catch (error) {
                            //
                        }
                        await xlsLAPIncidenciasDetModel.create( _dataProk )
                        .catch(function (err) {
                            varDump(`${err}.`);
                        });
                        //
                    }
                })
            }
            //
            _response.token = _Archivo.token;
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
// -------------------------------------------------------

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

        var _atributos = [
            //_editItem, 
            _DelItem, 
            ['CodigoProd','Código'], 
            ['Descripcion' ,'Descripción SAP'],
            ['UnidadMedida','Und.Med.'],
            'Cantidad',
            ['Semana01','Semana 01'],
            ['Semana02','Semana 02'],
            ['Semana03','Semana 03'],
            ['Semana04','Semana 04'],
            [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'], 
        ];
        var _DataSec = await xlsLAPReqMatDetModel.findAll({
            attributes : _atributos ,
            where : {
                Token : req.body.Token
            },
            order : [
                [ 'id' , 'ASC' ]
            ]
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
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELMINAR OPERARIO                    //
//////////////////////////////////////////////////////////
router.post('/items/del', async (req,res)=>{
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        //
        await XLSLapMaquinariaDetModel.destroy({
            where : {
                uu_id : req.body.uuid
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se eliminó el registro correctamente.` };
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
        ['cliente','IdCliente'], ['nombre_cliente','Cliente'], ['sucursal','IdLocal'], ['nombre_local','Local']
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


