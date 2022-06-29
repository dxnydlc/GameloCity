// api_lap_operarios.js

var _NombreDoc = 'api_lap_operarios';
const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");


// LEER EXCEL
const reader = require('xlsx')


// Archivos
const fs = require('fs');
var path    = require('path');

// EXAMINAR PDF
const pdfC = require('pdf-page-counter');

// PDF to imagen
const pdf2img = require('pdf2img');

// RUTAS
const _RUTA_PROYECTO = process.env.RUTA_PROYECTO;


// Otro diver para leer XLXS
const readXlsxFile = require('read-excel-file/node')


// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');


// Modelos
const { errorLogModel, tmp_updateUsuarioModel } = require('../../dbA');
const { sequelize, xlsLAPTrabajadoresCabModel, User, archiGoogleModel, xlsLAPTrabajadoresDetModel , sucursalModel, cargaExcelModelCab, cargaExcelModelDet } = require('../../db');

// COntrolador
const permisosController  = require('../../controllers/permisosController');
const estadoDocController = require('../../controllers/estadoDocController');
const helpersController = require('../../controllers/helpersController');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

// VALIDACION
var _Requeridos = [
    check('Fecha' ,'Ingrese fecha').not().isEmpty(),
    check('IdLocal' ,'Seleccione Local').not().isEmpty(),
    check('IdCliente' ,'Seleccione Cliente').not().isEmpty()
];



// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
xlsLAPTrabajadoresCabModel.belongsTo( xlsLAPTrabajadoresDetModel ,{
	as : 'Detalle', foreignKey 	: 'Codigo',targetKey: 'CodigoHead',
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



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
    _dataResp = await xlsLAPTrabajadoresCabModel.findAll({
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
        await xlsLAPTrabajadoresCabModel.create(req.body)
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await xlsLAPTrabajadoresCabModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        if( _dataGuardado )
        {
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'OPE'+_Codigo;
            await xlsLAPTrabajadoresCabModel.update({
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
                    formulario : 'XLS_OPERARIOS_LAP'
                }
            });
            // Convertir PDFs A IMG
            var _file = await convertirPDF( 'XLS_OPERARIOS_LAP' , _Codigo );
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se guardó el documento ${_Codigo} correctamente.` };
        }

        _response.item = await xlsLAPTrabajadoresCabModel.findOne({
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
        var _Entidad = await xlsLAPTrabajadoresCabModel.findOne({
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

        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        _response.data = [];
        //
        await xlsLAPTrabajadoresCabModel.update(req.body,{
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await xlsLAPTrabajadoresCabModel.findOne({
            where : {
                uu_id : req.params.uuid
            }
        });
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
                formulario : 'XLS_OPERARIOS_LAP'
            }
        });
        var _file = await convertirPDF( 'XLS_OPERARIOS_LAP' , req.body.Codigo );
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

        //
        var $userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        await xlsLAPTrabajadoresCabModel.update({
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
        
        _response.item = await xlsLAPTrabajadoresCabModel.findOne({
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
// -------------------------------------------------------
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
async function renovarToken()
{
    var length = 40;
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
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular','Iniciales'],
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
async function captueError( error , post )
{
    var _envio       = JSON.stringify(post);
    var _descripcion = JSON.stringify(error);
    var _uuid = await renovarToken();
    await errorLogModel.create({
        uu_id : _uuid,
        modulo : 'api_reqPersonal',
        descripcion : _descripcion,
        envio : _envio
    })
    .catch(function (err) {
        console.log(_NombreDoc);
        console.log(err);
    });
}
// -------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
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
//////////////////////////////////////////////////////////
//      			IMPORTAR FROM XLS                   //
//////////////////////////////////////////////////////////
router.post('/importar_xls',async(req,res)=>{
    // IdFile, Token, Codigo, Flag

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
        var _arColumnas = [], _arDetalle = [];
        var _TokenCab = await helpersController.renovarToken();
        var _dataInCab = {};

        if( _Archivo )
        {
            varDump(`Archivo ${_Archivo.id} existe ${_Archivo.nombre_archivo}`);
            // Reading our test file
            const file = reader.readFile( _Archivo.ruta_fisica );
            let data = [];
            const sheets = file.SheetNames
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            const temp = reader.utils.sheet_to_json(
                file.Sheets[ file.SheetNames[ 0 ] ]
            );
            var _CSGO = 1;
            var _insertCab   = {};
            _insertCab.uu_id = _TokenCab;
            _insertCab.Token = req.body.Token;
            _insertCab.Flag  = req.body.Flag;
            _insertCab.CodigoHead   = req.body.Codigo;
            _insertCab.IdArchivo    = _Archivo.id;
            _insertCab.Archivo      = _Archivo.nombre_archivo;
            var _Codigo = ``;
            
            // Generar encabezado
            await temp.forEach( async (res) => {
                var _Columnas = Object.keys( res );
                
                _insertCab.NroCols = _Columnas.length;
                for (let index = 0; index < _Columnas.length; index++) {
                    const _cab = _Columnas[index];
                    var _o = await pad_with_zeroes( index + 1, 2 );
                    _insertCab['Cab'+_o] = _cab;
                    _arColumnas.push( _cab );
                }
            });
            // Va a generar varios, luego agrupamos.
            setTimeout( async function(){
                _dataInCab = await cargaExcelModelCab.create( _insertCab );
                _Codigo = await pad_with_zeroes( _dataInCab.id , 8 );
                _Codigo = 'XLS'+_Codigo;
                await cargaExcelModelCab.update({
                    Codigo : _Codigo
                },{
                    where  : {
                        uu_id : _TokenCab
                    }
                })
                .catch(function (err) {
                    varDump( err );
                });
                console.log('FINALIZAMOS ENCABEZADOS');
            }, 500 );
            
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

            const temp2 = reader.utils.sheet_to_json(
                file.Sheets[ file.SheetNames[0] 
            ]);
            //varDump(temp);
            await temp2.forEach( async (res) => {
                var _Columnas = Object.values( res );
                //varDump( _Columnas );
                /**/
                // Preparamos para insertar
                var _insertarDet    = {};
                _insertarDet.Indice = _CSGO;
                _CSGO++;
                _insertarDet.uu_id  = await helpersController.renovarToken();
                _insertarDet.Token  = _TokenCab;
                //
                _arDetalle.push( _insertarDet );
                //
                /**/
                setTimeout( async function(){
                    _insertarDet.CodigoHead = _Codigo;
                    for (let index = 0; index < _Columnas.length; index++) {
                        const _cab = _Columnas[index];
                        var _o = await pad_with_zeroes( index + 1, 2 );
                        _insertarDet['Col'+_o] = _cab;
                        delete _insertarDet;
                    }
                }, 500 );
                /**/
            });

            //
            _response.token = _Archivo.token;

            setTimeout( async function(){
                varDump(`FINALIZAMOS DETALLE`);
                cargaExcelModelDet.bulkCreate( _arDetalle );
                //varDump( _arColumnas );
            }, 3000 );
                
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
router.post('/rptoperarios',async(req,res)=>{
    // Cliente, Local, Inicio, Fin
    var _response = {};
    _response.codigo = 200;
    var _where = {};

    if( req.body.Cliente ){
        _where.IdCliente = req.body.Cliente;
    }
    if( req.body.Local ){
        _where.IdLocal = req.body.Local;
    }
    if( req.body.Fecha ){
        _where.Fecha = req.body.Fecha;
    }
    _where.Fecha = { [Op.gte ]: req.body.Inicio,[Op.lte ]: req.body.Fin };

    try {
        _response.data   = [];
        var _arrCodigos  = [];
        var _arExcelData = [];
        var _arPDFdata   = [];
        //
        _dataResp = await xlsLAPTrabajadoresCabModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : _where
        });
        _response.w   = _dataResp
        for (let index = 0; index < _dataResp.length; index++) {
            const _rs = _dataResp[ index ];
            _arrCodigos.push( _rs.Codigo );
        }
        _response.codH = _arrCodigos;
        var _cabExcel = await cargaExcelModelCab.findAll({
            where : {
                CodigoHead : { [Op.in] : _arrCodigos },
                Flag : 'XLS_OPERARIOS_LAP'
            }
        });
        // Archivos excel
        var _srCabExcel = [];
        for (let index = 0; index < _cabExcel.length; index++) {
            const _dsxls = _cabExcel[index];
            var _CodExcel = _dsxls.Codigo;
            _srCabExcel.push( _CodExcel );
            varDump(`>>>>>>>>>>>>>>>>>>>>>> codigoExcel ${_CodExcel}`);
            var _dataX = await execQueryEXCEL( { CodigoHead : _CodExcel } , _dsxls , _dsxls.NroCols , 500  );
            _arExcelData.push( _dataX );
        }
        _response.headFile = _srCabExcel;
        // Archivos pdf
        _arPDFdata = await archiGoogleModel.findAll({
            where : {
                formulario : 'XLS_INCIDENCIAS_LAP',
                extension : 'pdf',
                Cod001 : { [Op.in] : _arrCodigos }
            }
        });
        //
        _response.data = { 'excel' : _arExcelData , 'pdf' : _arPDFdata };
        //
    } catch (error) {
        helpersController.captueError( '' , `>>>${error}` );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }
    //
    return res.status(_response.codigo).json( _response );
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
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;