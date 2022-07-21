// api_os22.js

var _NombreDoc = 'api_os22';
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
const { OSModel, personalOSModel, productosOSModel, sistemasMetodosOSModel } = require('../../db31');
const { xlsLAPIncidenciasDetModel, User, sequelize, archiGoogleModel, sucursalModel, clienteModel } = require('../../db');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

// COntrolador
const helpersController  = require('../../controllers/helpersController');
const osController  = require('../../controllers/osController');


// VALIDACION
var _Requeridos = [
    check('FechaMySQL' ,'Ingrese fecha').not().isEmpty(),
    check('IdLocal' ,'Seleccione Local').not().isEmpty(),
    check('IdClienteProv' ,'Seleccione Cliente').not().isEmpty()
];

// -------------------------------------------------------------
async function execQuery( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `nombre_cliente`;
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('IdOS') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('IdOS') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

    var _atributos = [
        _editItem,
        _DelItem,
        ['IdOS','Nro. OS'],
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('FechaMySQL') , _fechaONlyLatFormat ) , 'Fecha'], 
        ['nombre_cliente','Cliente'],
        ['local','Local'],
        ['TipoServicio','Tip.Serv.'],
        ['NroAplicacion','Aplic.'],
        'NroFactura',
        'NroBoleta',
        ['IncCertificado','Inc.Cert'],
        ['NroCertificado','Nro.Cert.'],
        'Estado',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'], 
    ];
    //
    _dataResp = await OSModel.findAll({
        attributes : _atributos ,
        order : [
            ['IdOS' , 'DESC']
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
    _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Documentos cargados.` };
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

    // DOCUMENTO DIPONIBLE PARA GUARDAR?
    var _DocDisponible = await osController.docDisponible( ['Digitado'] , req.body.IdOS );
    varDump( _DocDisponible );
    if( _DocDisponible.Estado == 'Denegado' ){
        return res.status(400).json( _DocDisponible );
    }

    try {
        // getUserData
        //
        await OSModel.create(req.body)
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 500;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
        });
        var _dataGuardado = await OSModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        //
        if( _dataGuardado )
        {
            var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
            _Codigo = 'INC'+_Codigo;
            await OSModel.update({
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
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se guardó el documento ${_Codigo} correctamente.` };
        }

        _response.item = await OSModel.findOne({
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
    _response.CliCert = [];
    _response.LocalCert = [];
    _response.CliFact = [];
    _response.CliData = [];

    try {
        //
        var _Entidad = await OSModel.findOne({
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
            var _cliData = await clienteModel.findOne({
                where : { IdClienteProv : _Entidad.IdClienteProv }
            });
            _response.CliData = _cliData;
            // Cliente Cert
            var _cliCert = await clienteModel.findOne({
                where : { IdClienteProv : _Entidad.ClienteCert }
            });
            _response.CliCert = _cliCert;
            // Locales CLi cert
            if( _cliCert ){
                //
                var _LocalesCert = await sucursalModel.findAll({
                    where : {
                        IdClienteProv : _Entidad.ClienteCert ,
                        Estado : 1
                    }
                });
                _response.LocalCert = _LocalesCert;
                //
            }
            // Cliente Fact
            var _cliFact = await clienteModel.findOne({
                where : { IdClienteProv : _Entidad.ClienteFact }
            });
            _response.CliFact = _cliFact;
            // Locales
            var _Locales = await sucursalModel.findAll({
                where : {
                    IdClienteProv : _Entidad.IdClienteProv ,
                    Estado : 1
                }
            });
            _response.locales = _Locales;
            //
        }
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se cargó OS: ${_Entidad.IdOS}.` };
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

    // DOCUMENTO DIPONIBLE PARA GUARDAR?
    var _DocDisponible = await osController.docDisponible( ['Digitado'] , req.body.IdOS );
    varDump( _DocDisponible );
    if( _DocDisponible.resp.Estado == 'Denegado' ){
        return res.status(500).json( _DocDisponible );
    }

    try {
        //
        _response.data = [];
        //
        await OSModel.update(req.body,{
            where : { 
                uu_id : req.params.uuid 
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await OSModel.findOne({
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
        await OSModel.update({
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
        
        _response.item = await OSModel.findOne({
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
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/importar_os', async (req,res)=>{
    // IdOS, Token
    /*
    Lo que hará este servicio es devolver los datos de la OS como en get_data
    Pero copiará el detalle de la os en un nuevo documento
    */
   // sqlMessage
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.CliCert = [];
    _response.LocalCert = [];
    _response.CliFact = [];
    _response.CliData = [];

    try {
        //
        var _Entidad = await OSModel.findOne({
            where : {
                IdOS : req.body.IdOS
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
            // ************* Clonamos personal OS *************
            var _personalOS = await personalOSModel.findAll({
                where : {
                    IdOS : req.body.IdOS
                }
            });
            for (let index = 0; index < _personalOS.length; index++) {
                const _rsData = _personalOS[index];
                var _dataInsertar = {
                    uu_id    : await helpersController.renovarToken(),
                    IdOS     : 0,
                    IdEmp    : _rsData.IdEmp,
                    Personal : _rsData.Personal,
                    Cantidad : _rsData.Cantidad,
                    Puesto   : _rsData.Puesto,
                    Token    : req.body.Token,
                    Glosa    : _rsData.Glosa,
                };
                await personalOSModel.create( _dataInsertar );
            }
            // ************* Clonamos productos *************
            var _productosOS = await productosOSModel.findAll({
                where : {
                    IdOS : req.body.IdOS
                }
            });
            for (let index = 0; index < _productosOS.length; index++) {
                const _rsData = _productosOS[index];
                var _dataInsertar = {
                    uu_id    : await helpersController.renovarToken(),
                    IdOS     : 0,
                    Cantidad : _rsData.Cantidad,
                    Glosa    : _rsData.Glosa,
                    TipoDetalle : _rsData.TipoDetalle,
                    UM       : _rsData.UM,
                    UMedida  : _rsData.UMedida,
                    IdProducto : _rsData.IdProducto,
                    producto : _rsData.producto,
                    Token    : req.body.Token
                };
                await productosOSModel.create( _dataInsertar );
            }
            // ************* Clonamos sistemas metodos *************
            var _sistemasMetodosOS = await sistemasMetodosOSModel.findAll({
                where : {
                    IdOS : req.body.IdOS
                }
            });
            for (let index = 0; index < _sistemasMetodosOS.length; index++) {
                const _rsData = _sistemasMetodosOS[index];
                var _dataInsertar = {
                    uu_id   : await helpersController.renovarToken(),
                    IdOS    : 0,
                    Sistema : _rsData.Sistema,
                    nombre_sistema : _rsData.nombre_sistema,
                    Metodo  : _rsData.Metodo,
                    nombre_metodo : _rsData.nombre_metodo,
                    Token   : req.body.Token
                };
                await sistemasMetodosOSModel.create( _dataInsertar );
            }
            
            // Cliente data
            var _cliData = await clienteModel.findOne({
                where : { IdClienteProv : _Entidad.IdClienteProv }
            });
            _response.CliData = _cliData;
            // Cliente Cert
            var _cliCert = await clienteModel.findOne({
                where : { IdClienteProv : _Entidad.ClienteCert }
            });
            _response.CliCert = _cliCert;
            // Locales CLi cert
            if( _cliCert ){
                //
                var _LocalesCert = await sucursalModel.findAll({
                    where : {
                        IdClienteProv : _Entidad.ClienteCert ,
                        Estado : 1
                    }
                });
                _response.LocalCert = _LocalesCert;
                //
            }
            // Cliente Fact
            var _cliFact = await clienteModel.findOne({
                where : { IdClienteProv : _Entidad.ClienteFact }
            });
            _response.CliFact = _cliFact;
            // Locales
            var _Locales = await sucursalModel.findAll({
                where : {
                    IdClienteProv : _Entidad.IdClienteProv ,
                    Estado : 1
                }
            });
            _response.locales = _Locales;
            //
        }
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se importó OS: ${_Entidad.IdOS}.` };
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

    async function execQueryrReporte( _where , _limit  )
    {
        //
        var _dataResp = [];
        var _NOmbre = `ReporteOS2`;
    

        var _atributos = [
            ['IdOS','Nro. OS'],
            ['TipoServicio','Tip.Serv.'],
            ['Descripcion','Descripción'],
            ['Servicio','Servicio'],
            ['nombre_cliente','Cliente'],
            ['local','Local'],
            ['Direccion','Local'],
            ['NroAplicacion','Aplicación'],
            ['Adicionales','Adicionales'],
            ['OTRealizada','OT Realizada'],
            ['giro','Giro'],
            [ sequelize.fn('DATE_FORMAT' ,sequelize.col('Fecha') , _fechaONlyLatFormat ) , 'Fecha'],
            //['dias','Días'],
            ['Hora','Hora'],
            //['medida','Área'],
            ['Estado','Estado'],
            ['Supervisor','Supervisor'],
            [ sequelize.fn('DATE_FORMAT' ,sequelize.col('FechaConformidad') , _fechaONlyLatFormat ) , 'Fecha Conformidad'],
            ['PersonalTecnico','Personal Técnico'],
            ['IncCertificado','Inc. Certificado'],
            ['NroFactura','Factura'],
            ['NroBoleta','Boleta'],
            ['NroCertificado','Certificado'],
        ];
        //
        _dataResp = await OSModel.findAll({
            attributes : _atributos ,
            order : [
                ['IdOS' , 'DESC']
            ],
            where : _where,
            limit : _limit
        })
        return _dataResp;
        //
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
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
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

