
// api_excel_data.js

var _NombreDoc = 'api_excel_data';
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
const { cargaExcelModelCab, cargaExcelModelDet, User, sequelize, archiGoogleModel, sucursalModel } = require('../../db');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

// COntrolador
const helpersController  = require('../../controllers/helpersController');

// VALIDACION
var _Requeridos = [
    check('Fecha' ,'Ingrese fecha').not().isEmpty(),
    check('IdLocal' ,'Seleccione Local').not().isEmpty(),
    check('IdCliente' ,'Seleccione Cliente').not().isEmpty()
];

// -------------------------------------------------------------
async function execQuery( _where , _limit  )
{
    // Obtener encabezados
    // CodigoHead
    var _dataResp = [];
    var _arAtributos = [];
    var NroCols = 0;
    //
    var _DataCab = await cargaExcelModelCab.findOne({
        where : _where
    });

    if( _DataCab )
    {
        NroCols = _DataCab.NroCols;
        _arAtributos.push( ['Indice' ,'#'] );
        for (let index = 1; index <= NroCols; index++)
        {
            var _No = await pad_with_zeroes( index , 2 );
            _arAtributos.push( [ `Col${_No}` , _DataCab[ `Cab${_No}` ] ] );
        }
        _dataResp = await cargaExcelModelDet.findAll({
            attributes : _arAtributos ,
            order : [
                ['Indice' , 'ASC']
            ],
            where : {
                CodigoHead : _DataCab.Codigo
            },
            limit : 1000
        });
    }else{
        varDump(`NO hay datos`);
    }

    return _dataResp;
    //
}
//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/listar', async (req,res)=>{
    // CodigoH
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];

    try {
        //
        _response.data = await execQuery( { 'CodigoHead' : req.body.CodigoH } , 200  );
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se cargaron los datos.` };
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
router.post('/listar2', async (req,res)=>{
    // CodigoH, Flag
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];

    try {
        //
        _response.data = await execQuery( { 'CodigoHead' : req.body.CodigoH , Flag : req.body.Flag } , 200  );
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se cargaron los datos.` };
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
//                  LISTAR UN ARCHIVO                    //
//////////////////////////////////////////////////////////
// -------------------------------------------------------------
router.post('/by_idfile', async (req,res)=>{
    // IdFile
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];

    try {
        //
        _response.data = await execQuery( { 'IdArchivo' : req.body.IdFile } , 500  );
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se cargaron los datos.` };
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
////////////////////////////////////////////////////////////
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
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/importar_header', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    // _Entidad
    try {
        //
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
                _response.CodFile = _Codigo;
                //
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
                console.log('FINALIZAMOS ENCABEZADOS '+_Codigo);
            }, 500 );
            
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        }
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Encabezado cargado: ${_Codigo}.` };
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
router.post('/importar_detalle', async (req,res)=>{
    // Codigo, IdFile, Token, Flag
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];

    try {
        //
        var _Codigo = req.body.Codigo;
        _response.data = [];
        _response.ut = await helpersController.getUserData( req.headers['api-token'] );
        var _Archivo = await archiGoogleModel.findOne({
            where : {
                id : req.body.IdFile
            }
        });
        _response.file  = _Archivo;
        var _arColumnas = [], _arDetalle = [];
        var _TokenCab   = req.body.Token;
        var _dataInCab  = {};
        var _CSGO = 1;

        var _Header = await cargaExcelModelCab.findOne({
            where : {
                Token : req.body.Token ,
                IdArchivo : req.body.IdFile
            }
        });
        if( _Header )
        {
            _Codigo = _Header.Codigo;
        }

        if( _Archivo )
        {
            varDump(`Archivo ${_Archivo.id} existe ${_Archivo.nombre_archivo}`);
            // Reading our test file
            const file = reader.readFile( _Archivo.ruta_fisica );
            let data = [];
            const sheets = file.SheetNames
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
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Documento importado.` };
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
function pad_with_zeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}
// -------------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
module.exports = router;
// -------------------------------------------------------------

