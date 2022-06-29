
// api_fichaEjecucionTrabajo.js



var _NombreDoc = 'api_fichaEjecucionTrabajo';
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

// Archivos
const fs = require('fs');

// >>>>>>>>>>>>>    NEXMO       >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

// LEER EXCEL
const reader = require('xlsx');

// Modelos
const { otModel, OSModel, productosModel } = require('../../db31');
const { productoTrabajoOTModel, fichaTecnicaTrabajoOTModel, asignarTecnicoModel, User, sequelize, archiGoogleModel, sucursalModel, clienteModel } = require('../../db');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

const _RUTA_PROYECTO = process.env.RUTA_PROYECTO;

// Controlador
const helpersController  = require('../../controllers/helpersController');
const estadoDocController = require('../../controllers/estadoDocController');



// VALIDACION
var _Requeridos = [
    check('Fecha' ,'Ingrese fecha').not().isEmpty(),
    check('IdLocal' ,'Seleccione Local').not().isEmpty(),
    check('IdCliente' ,'Seleccione Cliente').not().isEmpty()
];


const _css = `
<style>
label,p,h1,h2,h3,h4,h5,a,div,span,th,td, input{
    font-family: 'Ubuntu', sans-serif;
}
.invoice-box {
    max-width: 800px;
    margin: auto;
    padding: 30px;
    border: 1px solid #eee;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    font-size: 16px;
    line-height: 24px;
    /*font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;*/
    color: #555;
}

.invoice-box table {
    width: 100%;
    line-height: inherit;
    text-align: left;
}

.invoice-box table td {
    padding: 5px;
    vertical-align: top;
}

.invoice-box table tr td:nth-child(2) {
    text-align: right;
}

.invoice-box table tr.top table td {
    padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
    font-size: 45px;
    line-height: 45px;
    color: #333;
}

.invoice-box table tr.information table td {
    padding-bottom: 15px;
}

.invoice-box table tr.heading td {
    background: #eee;
    border-bottom: 1px solid #ddd;
    font-weight: bold;
}

.invoice-box table tr.details td {
    padding-bottom: 20px;
}

.invoice-box table tr.item td {
    border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
    border-bottom: none;
}

.invoice-box table tr.total td:nth-child(2) {
    border-top: 2px solid #eee;
    font-weight: bold;
}

@media only screen and (max-width: 600px) {
    .invoice-box table tr.top table td {
        width: 100%;
        display: block;
        text-align: center;
    }

    .invoice-box table tr.information table td {
        width: 100%;
        display: block;
        text-align: center;
    }
}

/** RTL **/
.invoice-box.rtl {
    direction: rtl;
    /*font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;*/
}

.invoice-box.rtl table {
    text-align: right;
}

.invoice-box.rtl table tr td:nth-child(2) {
    text-align: left;
}
.ft12{
    font-size: 12px;
}
.ft10{
    font-size: 10px;line-height:14px;
}
.txtCenter{
    text-align: center !important;
}
.txtRight{
    text-align: right !important;
}
.txtLeft{
    text-align: left !important;
}
</style>
`;


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
    _dataResp = await fichaTecnicaTrabajoOTModel.findAll({
        attributes : _atributos ,
        order : [
            ['Codigo' , 'DESC']
        ],
        where : _where,
        limit : _limit
    });
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
router.post('/' ,async (req,res)=>{

	var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        //
        var _userData = await helpersController.getUserData( req.headers['api-token'] );
        if( _userData.trabajo_ot )
        {
            // Hya trabajo en curso
            var _dataOT = await otModel.findOne({
                where : {
                    IdOT : _userData.IdOT
                }
            });
            var _trabajoData = await asignarTecnicoModel.findOne({
                where : {
                    id : _userData.trabajo_ot
                }
            })
            .catch(function (err) {
                varDump( err ); _response.codigo = 500;
                _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
            });
            //
            req.body.IdUsuarioMod = _userData.dni;
            req.body.UsuarioMod   = _userData.name;
            req.body.IdTrabajo  = _userData.trabajo_ot;
            req.body.IdTecnico  = _userData.dni;
            req.body.Tecnico    = _userData.name;
            req.body.IdOS       = _dataOT.NroOS;
            req.body.IdOT       = _dataOT.IdOT;
            _dataOT.NroCertificado ? req.body.NroCert = _dataOT.NroCertificado : req.body.NroCert = 0;
            req.body.IdCliente  = _dataOT.IdClienteProv;
            req.body.Cliente    = _dataOT.nombre_cliente;
            req.body.IdLocal    = _dataOT.IdLocal;
            req.body.Local      = _dataOT.local;
            req.body.IdServicio = _trabajoData.IdServicio;
            req.body.Servicio   = _trabajoData.Servicio;
            //
            await fichaTecnicaTrabajoOTModel.create(req.body)
            .catch(function (err) {
                varDump( err ); _response.codigo = 500;
                _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
            });
            var _dataGuardado = await fichaTecnicaTrabajoOTModel.findOne({
                where : {
                    uu_id : req.body.uu_id
                }
            });
            //
            if( _dataGuardado )
            {
                var _Codigo = await helpersController.pad_with_zeroes( _dataGuardado.id , 8 );
                _Codigo = 'FTE'+_Codigo;
                await fichaTecnicaTrabajoOTModel.update({
                    Codigo : _Codigo
                },{
                    where  : {
                        uu_id : req.body.uu_id
                    }
                })
                .catch(function (err) {
                    varDump( err );
                    _response.codigo = 500;
                    _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${err.original}.` };
                });
                // Unir con detalle.
                await archiGoogleModel.update({
                    Cod001 : _Codigo ,
                    correlativo : _dataGuardado.id
                },{
                    where : {
                        token : req.body.uu_id ,
                        formulario : 'APP_TECNICO_FICHA_TECNICA'
                    }
                });
                // marcar productos
                await productoTrabajoOTModel.update({
                    CodigoHead : _Codigo
                },{
                    where : {
                        Token : req.body.uu_id
                    }
                });
                _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Ficha guardada.` };
            }

            _response.item = await fichaTecnicaTrabajoOTModel.findOne({
                where : {
                    uu_id : req.body.uu_id
                }
            });
            await makeHtml( _response.item );
            //
        }else{
            // Ya no hay trabajo en curso
            _response.codigo = 202;
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `No hay trabajo en curso.` };
            //
        }   
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
router.post('/get_by_id', async (req,res)=>{
    // id
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        var _userData = await helpersController.getUserData( req.headers['api-token'] );
        //
        var _Entidad = await fichaTecnicaTrabajoOTModel.findOne({
            where : {
                IdTrabajo : req.body.id ,
                IdTecnico : _userData.dni
            }
        })
        .catch(function (err) {
            varDump( err );
            _response.codigo = 400;_response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        //
        _response.data = _Entidad;
        if( _Entidad )
        {
            // Files
            var _Files = await archiGoogleModel.findAll({
                where : {
                    token : _Entidad.uu_id
                }
            });
            _response.files = _Files;
            //
        }
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Ficha cargada.` };
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
router.post('/get_data', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        var _Entidad = await fichaTecnicaTrabajoOTModel.findOne({
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
router.put('/:uuid' , async (req,res)=>{
    // uuid
    
    var _response = {};
    _response.codigo = 200;

    try {
        //
        var _userData = await helpersController.getUserData( req.headers['api-token'] );
        if( _userData.trabajo_ot )
        {
            //
            req.body.IdUsuarioMod = _userData.dni;
            req.body.UsuarioMod   = _userData.name;
            await fichaTecnicaTrabajoOTModel.update( req.body ,{
                where : { 
                    uu_id : req.params.uuid 
                }
            })
            .catch(function (err) {
                helpersController.captueError( err.original , req.body );
                _response.codigo = 400;
                _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
            });
            // marcar productos
            await productoTrabajoOTModel.update({
                CodigoHead : req.body.Codigo
            },{
                where : {
                    Token : req.body.uu_id
                }
            });
            // Marcar archivos
            await archiGoogleModel.update({
                Cod001 : req.body.Codigo ,
                correlativo : req.body.id
            },{
                where : {
                    token : req.body.uu_id
                }
            });
            _response.item = await fichaTecnicaTrabajoOTModel.findOne({
                where : {
                    uu_id : req.params.uuid
                }
            });
            if( _response.item )
            {
                await makeHtml( _response.item );
            }
            //
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Ficha guardada.` };
            //
        }else{
            // Ya no hay trabajo en curso
            _response.codigo = 202;
            _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `No hay trabajo en curso.` };
            //
        }
    } catch (error) {
        varDump ( error );
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
        await fichaTecnicaTrabajoOTModel.update({
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
        
        _response.item = await fichaTecnicaTrabajoOTModel.findOne({
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
//           FINALIZAR FICHA EJECUCION SERVICIO         //
//////////////////////////////////////////////////////////
router.post('/finalizar_ficha', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        // Se coloca el estado en finalizado.
        await fichaTecnicaTrabajoOTModel.update({
            Estado : 'Finalizado',
        },{
            where : {
                uu_id : req.body.uu_id
            }
        });
        // Se genera el documento en PDF
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `success` , 'texto' : `Ficha finalizada.` };
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
async function makeHtml( data )
{
    //
    var _archivoName = `FTES_${data.Codigo}.html`;
    const _dataCli = await clienteModel.findOne({
        where : {
            IdClienteProv : data.IdCliente
        }
    });
    varDump(`Idsucursal : ${data.IdLocal}`);
    const _dataLocal = await sucursalModel.findOne({
        where : {
            IdSucursal : data.IdLocal
        }
    });
    // Archivos...
    var _filesHtml = ``, _CSGO = 1;
    var _Files = await archiGoogleModel.findAll({
        where : {
            formulario : 'APP_TECNICO_FICHA_TECNICA' ,
            Cod001     : data.Codigo
        }
    });
    for (let index = 0; index < _Files.length; index++) {
        const rs = _Files[index];
        if( _CSGO > 3 )
        {
            //
            _filesHtml += `</tr>`
            _CSGO = 1;
            //
        }
        if( _CSGO == 1 ){
            //
            _filesHtml += `<tr>`
            //
        }
        _filesHtml += `<td style="50%" ><img style="width:100%;" src="${rs.url_thumb}" title="${rs.nombre_archivo}" /></td>`
        _CSGO++;
    }
    /**/
    var _htmlProds = ``;
    var _dataProds = await productoTrabajoOTModel.findAll({
        where : {
            IdOT : data.IdOT
        }
    });
    for (let index = 0; index < _dataProds.length; index++) {
        const rs = _dataProds[index];
        _htmlProds = `<tr>`;
            _htmlProds += `<td class=" txtLeft ft12 " >${rs.Producto}</td>`;
            _htmlProds += `<td class=" txtLeft ft12 " >${rs.Ingrediente}</td>`;
            _htmlProds += `<td class=" txtLeft ft12 " >${rs.Dosis}</td>`;
            _htmlProds += `<td class=" txtLeft ft12 " >${rs.TiempoEspera}</td>`;
        _htmlProds = `</tr>`;
    }
    /**/
    var _personalOT = await asignarTecnicoModel.findAll({
        where : {
            IdOT : data.IdOT
        }
    });
    var _personalHtml = ``, _dnis = [];
    for (let index = 0; index < _personalOT.length; index++) {
        const rs = _personalOT[index];
        _dnis.push( rs.IdTecnico );
    }
    var _personalOT = await User.findAll({
        where : {
            dni : { [Op.in]: _dnis }
        }
    });
    for (let index = 0; index < _personalOT.length; index++) {
        const rs = _personalOT[index];
        _personalHtml += `<tr>`;
            _personalHtml += `<td class=" txtLeft ft12 " >${rs.name}</td>`;
            _personalHtml += `<td class=" txtLeft ft12 " >${rs.puestoiso}</td>`;
            _personalHtml += `<td class=" txtLeft ft12 " >${rs.dni}</td>`;
        _personalHtml += `</tr>`;
    }
    var _creado = moment( data.createdAt ).format('DD/MM/YYYY');
    //
    var TrabRealizado = ``;
    switch ( data.TrabajoRealizado )
    {
        case 'DESINFECCION':
            TrabRealizado = `Desinfección`;
        break;
        case 'DESINSECTIZACION':
            TrabRealizado = `Desinsectización`;
        break;
        case 'DESRATIZACION':
            TrabRealizado = `Desratización`;
        break;
        case 'LIMPIEZA_CISTERNA':
            TrabRealizado = `Limpieza y desinfección de cisternas o reservorios de agua`;
        break;
        case 'POZO_SEPTICOS':
            TrabRealizado = `Limpieza de tanques sépticos/trampas de grasa`;
        break;
    }
    TrabRealizado = TrabRealizado.toUpperCase();
    //
    var _html = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>Ficha Tecnica de Evaluación y Descripción de Actividades</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
            ${_css}
        </head>

        <body>
            <div class="invoice-box">
                <table cellpadding="0" cellspacing="0" style="border: 1px #053F5C solid;" >
                    <tr class="top">
                        <td>
                            <img src="https://api2.ssays-orquesta.com/logo-ssays-2019-2.png" style="width: 100%; max-width: 114px" />
                        </td>
                        <td>
                            <p class="ft12" style="text-align:center;">FICHA TECNICA DE EVALUACION Y DE DESCRIPCION DE ACTIVIDADES</p>
                        </td>
                        <td class=" ft10 txtRight " style="max-width:180px" ><p>FO-52<br/>VERSIÓN 00</p></td>
                    </tr>
                </table>
                
                <table cellpadding="0" cellspacing="0">
                    <tr class="top">
                        <td colspan="2">
                            <table>
                                <tr>
                                    <td class="title">
                                        <!-- LOGO -->
                                    </td>

                                    <td class="ft12" >
                                        Nro # : <b>${data.Codigo}</b><br />
                                        Creado : <b>${_creado}</b><br />
                                        Usuario : <b>${data.UsuarioMod}</b>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr class="information">
                        <td colspan="2">
                            <table>
                                <tr>
                                    <td class="ft12" >
                                        <b>${data.Cliente}</b><br />
                                        <b>${_creado}</b><br />
                                        <b>${data.Local}</b>
                                    </td>

                                    <td class="ft12" >
                                        N° de Certificado : <b>${data.NroCert}</b><br />
                                        N° Orden servicio : <b>${data.IdOS}</b><br />
                                        N° Orden trabajo : <b>${data.IdOT}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="ft12" >
                                        Dirección : ${_dataLocal.Direccion}<br />
                                        Giro : ${_dataCli.nombre_giro}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>

                <table cellpadding="0" cellspacing="0">
                    <tr class="heading">
                        <td class="ft12" >1.- Diágnostico:</td>
                    </tr>
                    <tr>
                        <td class="ft10" >(consignar una breve descripción del problema)</td>
                    </tr>
                    <tr>
                        <td class="ft12" >${data.Diagnostico}</td>
                    </tr>
                </table>
                <table cellpadding="0" cellspacing="0">
                    <tr class="heading">
                        <td class="ft12" >2.- Condición sanitaria de la zona circundante:</td>
                    </tr>
                    <tr>
                        <td class="ft12" >${data.Condicion}</td>
                    </tr>
                </table>
                <table cellpadding="0" cellspacing="0">
                    <tr class="heading">
                        <td class="ft12" >3.- Trabajos realizados:</td>
                    </tr>
                    <tr>
                        <td class="ft12" >${TrabRealizado}</td>
                    </tr>
                </table>
                <table cellpadding="0" cellspacing="0">
                    <tr class="heading">
                        <td class="ft12" colspan="4">4.- Productos químicos y biológicos utilizados:</td>
                    </tr>
                    <tr>
                        <th class="ft12" >Producto</th>
                        <th class="ft12" >Ingrediente activo</th>
                        <th class="ft12" >Dosis</th>
                        <th class="ft12" >Tiempo de espera</th>
                    </tr>
                    <!-- FOR -->
                    ${_htmlProds}
                    <!-- /FOR -->
                </table>
                <table cellpadding="0" cellspacing="0">
                    <tr class="heading">
                        <td class="ft12" >5.- Acciones correctivas:</td>
                    </tr>
                    <tr>
                        <td class="ft12" >${data.AccionCorrectiva}</td>
                    </tr>
                </table>
                <table cellpadding="0" cellspacing="0">
                    <tr class="heading">
                        <td class="ft12" >6.- Observaciónes/recomendaciónes:</td>
                    </tr>
                    <tr>
                        <td class="ft12" >${data.Observaciones}</td>
                    </tr>
                </table>
                <table cellpadding="0" cellspacing="0">
                    <tr class="heading">
                        <td class="ft12" colspan="2" >7.- Evidencia fotografica:</td>
                    </tr>
                    <!-- FOR -->
                    ${_filesHtml}
                    <!-- /FOR -->
                </table>
                <table cellpadding="0" cellspacing="0">
                    <tr class="heading">
                        <td class="ft12" colspan="3">8.- Personal que intervino en el trabajo:</td>
                    </tr>
                    <tr>
                        <th class="ft12" >Apellidos y nombre</th>
                        <th class="ft12" >Cargo</th>
                        <th class="ft12" >DNI</th>
                    </tr>
                    <!-- FOR -->
                    ${_personalHtml}
                    <!-- /FOR -->
                </table>
            </div>
        </body>
    </html>`;
    var _rutaFile = `${_RUTA_PROYECTO}adjuntos/html/${_archivoName}`;
    varDump( _rutaFile );
    fs.writeFileSync( _rutaFile , _html );
    //
}
// -------------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
module.exports = router;
// -------------------------------------------------------------

