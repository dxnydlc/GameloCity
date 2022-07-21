// api_bitacora_detalle.js


var _NombreDoc = 'api_bitacora_detalle';
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

const fs = require('fs');

// media-thumbnail
const mt = require('media-thumbnail');

// >>>>>>>>>>>>>    NEXMO       >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

// LEER EXCEL
const reader = require('xlsx');

// Modelos
const { errorLogModel } = require('../../dbA');
const { bitacoraDetalleModel, User, sequelize, archiGoogleModel, sucursalModel } = require('../../db');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";



// Controlador
const helpersController  = require('../../controllers/helpersController');
const estadoDocController = require('../../controllers/estadoDocController');


const RUTA_APP = process.env.RUTA_PROYECTO;
const URL_NODE = process.env.URL_NODE;


// VALIDACION
var _Requeridos = [
    check('Nombre' ,'Ingrese nombre').not().isEmpty()
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
    _dataResp = await bitacoraDetalleModel.findAll({
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
//      			 OBTENER LISTA COMBO     			//
//////////////////////////////////////////////////////////
router.post('/combo',async(req,res)=>{
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        var _data = await bitacoraDetalleModel.findAll({
            where : {
                CodigoHead : req.body.Codigo
            }
        });
        _response.data = _data;
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `success` , 'texto' :  `Sectores cargados.` };
        //
    } catch (error) {
        varDump(  error );
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
        await bitacoraDetalleModel.create(req.body)
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await bitacoraDetalleModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        if( _dataGuardado )
        {
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'DB'+_Codigo;
            await bitacoraDetalleModel.update({
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
                Cod001 : _Codigo ,
                correlativo : _dataGuardado.id
            },{
                where : {
                    token : req.body.uu_id
                }
            });
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Guardado.` };
        }

        _response.item = await bitacoraDetalleModel.findOne({
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
        var _Entidad = await bitacoraDetalleModel.findOne({
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
            // Files
            var _Files = await archiGoogleModel.findAll({
                where : {
                    token : _Entidad.uu_id
                }
            });
            _response.files = _Files;
            //
        }
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Cargar detalle.` };
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
        await bitacoraDetalleModel.update(req.body,{
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await bitacoraDetalleModel.findOne({
            where : {
                uu_id : req.params.uuid
            }
        });
        // 342206 343129
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Actualizado.` };
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
        await bitacoraDetalleModel.destroy({
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Eliminado.` };
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
//                CARGAR ARCHIVOS BY TOKEN              //
//////////////////////////////////////////////////////////
router.post('/files_by_token', async (req,res)=>{
    // Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await archiGoogleModel.findAll({
        where : {
            token : req.body.Token
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    
    res.json( $response );
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//            DETALLE Y ARCHIVOS POR CADA UNO           //
//////////////////////////////////////////////////////////
router.post('/get_detalle', async (req,res)=>{
    // CodigoHead
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        var _dataFinal = [];
        var _Entidad = await bitacoraDetalleModel.findAll({
            where : {
                CodigoHead : req.body.CodigoHead
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        //

        if( _Entidad )
        {
            //
            for (let index = 0; index < _Entidad.length; index++) {
                const rs = _Entidad[index];
                // Archivos en este nodo.
                var _Files = await archiGoogleModel.findAll({
                    where : {
                        token : rs.uu_id ,
                        formulario : 'DETALLE_BITACORA'
                    }
                });
                _dataFinal.push( { data : rs , files : _Files } );
            }
            //
        }
        _response.data = _dataFinal;
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Cargar detalle.` };
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
router.post('/add_sector_fotos', async (req,res)=>{
    // IdsFoto(,), IdSector, Sector, CodigoHead, Token
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        var _IdSector = req.body.IdSector;
        if( _IdSector )
        {
            // Sector existente, solo agregamos las fotos...
            var _Entidad = await bitacoraDetalleModel.findOne({
                where : {
                    Codigo : req.body.IdSector
                }
            });
            if( _Entidad ){
                await clonarImagenes( req.body.IdsFoto , _Entidad.id , _Entidad.Codigo , _Entidad.uu_id , $userData );
            }
        }else{
            // Creamos el sector
            var _insert = {
                uu_id   : await helpersController.renovarToken(),
                CodigoHead : req.body.CodigoHead ,
                Nombre  : req.body.Sector ,
                Token   : req.body.Token
            };
            await bitacoraDetalleModel.create( _insert );
            var _Entidad = await bitacoraDetalleModel.findOne({
                where : {
                    uu_id : _insert.uu_id
                }
            });
            if( _Entidad ){
                var _Codigo = await helpersController.pad_with_zeroes( _Entidad.id , 8 );
                _Codigo = 'DB'+_Codigo;
                await xlsLAPIncidenciasCabModel.update({
                    Codigo : _Codigo
                },{
                    where  : {
                        uu_id : req.body.uu_id
                    }
                })
                .catch(function (err) {
                    varDump( err );
                });
                await clonarImagenes( req.body.IdsFoto , _Entidad.id , _Entidad.Codigo , _Entidad.uu_id , $userData );
            }
        }
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se agregaron las fotos al documento.` };
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

async function clonarImagenes( ids , Id , Codigo01 , Token , _userData )
{
    //
    var _ids = ids;
    var _arIds = _ids.split(",");
    var _dataFiles = await archiGoogleModel.findAll({
        where : {
            id : { [Op.in]: _arIds }
        }
    });
    for (let index = 0; index < _dataFiles.length; index++) {
        const ItemFoto = _dataFiles[index];
        var _insertFoto = {
            uu_id       : await helpersController.renovarToken(),
            ruta_fisica     : ItemFoto.ruta_fisica , 
            RutaOriginal    : ItemFoto.RutaOriginal ,
            RutaThumbnail   : ItemFoto.RutaThumbnail ,
            id_usuario      : _userData.dni , 
            usuario         : _userData.name , 
            formulario      : 'DETALLE_BITACORA' , 
            nombre_archivo  : ItemFoto.nombre_archivo , 
            size            : ItemFoto.size , 
            nombre_fisico   : ItemFoto.nombre_fisico , 
            extension       : ItemFoto.extension , 
            url             : ItemFoto.url , 
            url_original    : ItemFoto.url_original , 
            url_thumb       : ItemFoto.url_thumb , 
            url_compress    : ItemFoto.url_compress , 
            url_400         : ItemFoto.url_400 , 
            url_40          : ItemFoto.url_40 , 
            tipo_documento  : ItemFoto.tipo_documento , 
            Cod001          : Codigo01 , 
            correlativo     : Id , 
            token           : Token , 
        };
        await archiGoogleModel.create( _insertFoto );
    }
    //
    return 'OK';
}
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//          COMPRIMIR LAS IMAGENES DEL INFORME LAP      //
//////////////////////////////////////////////////////////
router.post('/compress_pics', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];
    var _RutaFile = RUTA_APP+'adjuntos/archivos/';

    try {
        //
        var _Sectores = await bitacoraDetalleModel.findAll({
            order : [
                [ 'id' , 'ASC' ]
            ]
        });
        // limit : 3
        for (let index = 0; index < _Sectores.length; index++) {
            const Item = _Sectores[index];
            var _files = await archiGoogleModel.findAll({
                where : {
                    formulario : 'DETALLE_BITACORA' , 
                    Cod001 : Item.Codigo
                }
            });
            for (let indexF = 0; indexF < _files.length; indexF++) {
                const _File = _files[indexF];
                var _NombreFisico = _File.nombre_fisico;
                var arExt = _NombreFisico.split('/');
                _NombreFisico = arExt[ arExt.length - 1 ];
                var _fileJPG = _File.ruta_fisica;
                var _ruta_thumb = `${_RutaFile}Thumb_${_NombreFisico}`;
                try {
                    if ( fs.existsSync(_fileJPG) )
                    {
                        /**/
                        await mt.forImage(
                            _fileJPG , _ruta_thumb , { width  : 300, height : 300, preserveAspectRatio: true } 
                        )
                        .then( () => console.log('Imagen ThumbNail creada') , err => console.error(err) );
                        /**/
                        await archiGoogleModel.update({
                            url_thumb     : `${URL_NODE}api/imgs/thumb/${_File.uu_id}/${_NombreFisico}` ,
                            RutaThumbnail : _ruta_thumb
                        },{
                            where :{
                                id : _File.id
                            }
                        });
                        varDump(`File updated: ${_File.id} => ${indexF}`);
                        /**/
                    }
                } catch(err) {
                console.error(err)
                }
            }
        }
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Comprimidas.` };
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
function varDump( _t )
{
    console.log( _t );
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
module.exports = router;
// -------------------------------------------------------------

