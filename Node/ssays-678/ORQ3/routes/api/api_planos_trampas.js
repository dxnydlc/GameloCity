
// api_planos_trampas.js



var _NombreDoc = 'api_planos_trampas';
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
const { planosDetModel, xlsLAPIncidenciasDetModel, User, sequelize, archiGoogleModel, sucursalModel } = require('../../db');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";



// Controlador
const helpersController  = require('../../controllers/helpersController');
const estadoDocController = require('../../controllers/estadoDocController');



// VALIDACION
var _Requeridos = [
    check('CodigoHead' ,'Ingrese código').not().isEmpty()
];

// -------------------------------------------------------------
async function execQuery( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `Cliente`;
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

    var _atributos = [
        _editItem,
        _DelItem,
        'Codigo',
        'Cliente',
        'Local',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('Fecha') , _fechaONlyLatFormat ) , 'Fecha'], 
        'Estado',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'], 
    ];
    //
    _dataResp = await planosDetModel.findAll({
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
        var _Codigo = req.body.CodigoHead;
        var _index  = await planosDetModel.count({
            where : {
                CodigoHead : _Codigo ,
                Tipo : req.body.Tipo
            }
        });
        // Indice
        var _indice = parseInt( _index ) + 1;
        req.body.Indice = _indice;
        var _Indc = await helpersController.pad_with_zeroes( _indice , 3 );
        // Nombre
        var _Nombre = `${req.body.Tipo}-${_Indc}`;
        req.body.Nombre = _Nombre;
        switch ( req.body.Tipo ) {
            case 'C':
                req.body.Titulo = `Cebo`;
            break;
            case 'J':
                req.body.Titulo = `Jaula Tomahawk`;
            break;
            case 'T':
                req.body.Titulo = `Trampa pegante`;
            break;
            //
            default:
                break;
        }
        //
        await planosDetModel.create( req.body )
        .catch(function (err) {
            varDump( err );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await planosDetModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        if( _dataGuardado )
        {
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'TRAMPA'+_Codigo;
            await planosDetModel.update({
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
            // 
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Trampa agregada.` };
        }

        _response.item = await planosDetModel.findOne({
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
        var _Entidad = await planosDetModel.findOne({
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
        await planosDetModel.update(req.body,{
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await planosDetModel.findOne({
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
        await planosDetModel.update({
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
        
        _response.item = await planosDetModel.findOne({
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
                });
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
// -------------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
module.exports = router;
// -------------------------------------------------------------

