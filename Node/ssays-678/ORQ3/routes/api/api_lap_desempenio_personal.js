// api_lap_desempenio_personal.js




var _NombreDoc = 'api_lap_desempenio_personal';
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

// Archivos
const fs = require('fs');
var path    = require('path');

// EXAMINAR PDF
const pdfC = require('pdf-page-counter');

// PDF to imagen
const pdf2img = require('pdf2img');

// RUTAS
const _RUTA_PROYECTO = process.env.RUTA_PROYECTO;



// Modelos
const { errorLogModel } = require('../../dbA');
const { xlsLAPDesempenioPersonalModel, xlsLAPIncidenciasDetModel, User, sequelize, archiGoogleModel, sucursalModel, cargaExcelModelCab } = require('../../db');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

// COntrolador
const helpersController  = require('../../controllers/helpersController');
const permisosController  = require('../../controllers/permisosController');
const estadoDocController = require('../../controllers/estadoDocController');

// VALIDACION
var _Requeridos = [
    check('Fecha' ,'Ingrese fecha').not().isEmpty(),
    check('IdLocal' ,'Seleccione Local').not().isEmpty(),
    check('IdCliente' ,'Seleccione Cliente').not().isEmpty()
];

// -------------------------------------------------------------
async function execQuery( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `Cliente`;
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-codigo="', sequelize.col('Codigo') , '" data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

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
    _dataResp = await xlsLAPDesempenioPersonalModel.findAll({
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
        await xlsLAPDesempenioPersonalModel.create(req.body)
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await xlsLAPDesempenioPersonalModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        if( _dataGuardado )
        {
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'DP'+_Codigo;
            await xlsLAPDesempenioPersonalModel.update({
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
            // Unir con Excel.
            await cargaExcelModelCab.update({
                CodigoHead : _Codigo
            },{
                where : {
                    Token : req.body.uu_id
                }
            });
            // Unir con archivos
            await archiGoogleModel.update({
                Cod001 : _Codigo ,
                correlativo : _dataGuardado.id
            },{
                where : {
                    token : req.body.uu_id,
                    formulario : 'XLS_DESEMPENIO_PERSONAL_LAP'
                }
            });
            var _file = await convertirPDF( 'XLS_DESEMPENIO_PERSONAL_LAP' , _Codigo );
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se guardó el documento ${_Codigo} correctamente.` };
        }

        _response.item = await xlsLAPDesempenioPersonalModel.findOne({
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
        var _Entidad = await xlsLAPDesempenioPersonalModel.findOne({
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
        var _DocDisponible = await estadoDocController.docDisponible2( 'DESM_PERSON' , ['Activo'] , req.body.Codigo );
        varDump( _DocDisponible );
        if( _DocDisponible.codigo == 202 ){
            return res.status(200).json( _DocDisponible );
        }
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        _response.data = [];
        //
        delete req.body.id;
        await xlsLAPDesempenioPersonalModel.update(req.body,{
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            varDump( err.original );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await xlsLAPDesempenioPersonalModel.findOne({
            where : {
                uu_id : req.params.uuid
            }
        });
        // 342206 343129
        // Unir con Excel.
        await cargaExcelModelCab.update({
            CodigoHead : req.body.Codigo
        },{
            where : {
                Token : req.params.uuid 
            }
        });
        // Unir con archivos
        await archiGoogleModel.update({
            Cod001 : req.body.Codigo ,
            correlativo : req.body.id
        },{
            where : {
                token : req.params.uuid ,
                formulario : 'XLS_DESEMPENIO_PERSONAL_LAP'
            }
        });
        var _file = await convertirPDF( 'XLS_DESEMPENIO_PERSONAL_LAP' , req.body.Codigo );
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se actualizó el documento ${req.body.Codigo} correctamente.` };
        //
    } catch (error) {
        varDump( error );
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
        var _DocDisponible = await estadoDocController.docDisponible2( 'DESM_PERSON' , ['Activo'] , req.body.Codigo );
        varDump( _DocDisponible );
        if( _DocDisponible.codigo == 202 ){
            return res.status(200).json( _DocDisponible );
        }
        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        await xlsLAPDesempenioPersonalModel.update({
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
        
        _response.item = await xlsLAPDesempenioPersonalModel.findOne({
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
async function convertirPDF( Flag , Codigo )
{
    // Vamos a convertir el PDF en imagenes bonitas.
    var _dataFiles = await archiGoogleModel.findAll({
        where : {
            formulario : Flag ,
            Cod001 : Codigo
        }
    });

    try {
        //
        varDump(`FLAG: ${Flag}, tienen ${_dataFiles.length} archivos.`);
        for (let index = 0; index < _dataFiles.length; index++)
        {
            const _rs = _dataFiles[index];
            var _rf   = _rs.extension;
            var _extension = _rf.toLowerCase();
            varDump(`FLAG: ${Flag}, extensión: ${_extension}.`);
            switch ( _extension )
            {
                case 'pdf':
                    //    CONVERTIMOS LOS PDF EN IMAGENES
                    var _RutaPDF = _rs.ruta_fisica, NroPaginas = 0;
                    let dataBuffer = fs.readFileSync( _RutaPDF );

                    if ( fs.existsSync( _RutaPDF ) )
                    {
                        //
                        await pdfC(dataBuffer).then(function( dataPDF ) {
                            // number of pages
                            NroPaginas = dataPDF.numpages;
                            console.log(dataPDF.numpages);
                            // number of rendered pages
                        });
                        //
                    }
                    varDump(`Este PDF tiene ${NroPaginas} páginas. >>>> ID File ${_rs.id}.`);
                    // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    await archiGoogleModel.update({
                        NroPaginas : NroPaginas
                    },{
                        where : { formulario : Flag , Cod001 : Codigo }
                    });
                    // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    pdf2img.setOptions({
                        type    : 'png',
                        size    : 1024,
                        density : 600,
                        page    : null,
                        outputdir: _RUTA_PROYECTO+'adjuntos/reporte_lap',
                        outputname: 'PDF_IMG_'+_rs.id
                    });

                    var infoGeneradaPDF = [];
                    await pdf2img.convert( _RutaPDF , function(err, infoImgPdf  ) {
                        if (err){
                            //
                            console.log(err)
                            //
                        }else{
                            //
                            infoGeneradaPDF = infoImgPdf;
                        }
                    });
                break;
                default:
                    //
                break;
            }
        }
        //
    } catch (error) {
        varDump(`Error al generar sector reporte LAP`);
        varDump(error);
    }

    return 'ok';
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

