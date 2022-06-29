// api_resumenNC.js

var _NombreDoc = 'api_resumenNC', _TipoDocG_ = 'NC';
const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();
// >>>>>>>>>>>>>    SPARKPOST   >>>>>>>>>>>>>
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET)
// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');
// >>>>>>>>>>>>>    NEXMO       >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

// Archivos
const fs = require('fs');

// Leer un XML
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

// Modelos
const { errorLogModel } = require('../../dbA');
const { resumenNotasCabModel, User, resumenNotasDetModel, docVentasCab, seriesDocModel, resumenBoletasCabModel } = require('../../db');


var _TasaIGV = 0.18;

// XML
const _RUTA_XML = process.env.RUTA_XML;
const _SOAP_URL = process.env.SOAP_URL;
const _SOAP_USER = process.env.SOAP_USER;
const _SOAP_PASSWD = process.env.SOAP_PASSWD;





//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    // tipo
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    varDump( req.query );

	$response.data = await resumenNotasCabModel.findAll({
        where : {
            TipoResumen : req.query.tipo
        },
        order : [
            ['Codigo' , 'ASC']
        ],
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};

    if( req.body.id != '' ){
        // Buscamos por ID
        $where.Codigo = req.body.id;
        //
        $response.data = await resumenNotasCabModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        $where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        $response.data = await resumenNotasCabModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
    }

    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			    OBTENER LISTA     			    //
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await resumenNotasCabModel.findAll({
        where : {
            Estado : 'Activo'
        },
        order : [
            ['Codigo' , 'DESC']
        ],
        limit : 100
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR DOCUMENTO       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('FechaComprobante' ,'Seleccione fecha de comprobantes').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    var _FechaEmision = moment().format('YYYY-MM-DD');
    varDump(_FechaEmision);

    // Numero de resumenes creados HOY
    var _Contador = await getCountResumenes();

    // Numero de resumenes creados HOY
    /*var _Contador = await resumenNotasCabModel.count({
        where: { 
            FechaEmision : _FechaEmision ,
            TipoResumen : req.body.TipoResumen
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });*/
    //
    _Contador = _Contador + 1;
    var _NroResumen = await pad_with_zeroes( _Contador , 3 );
    var _ResumenId = moment().format('YYYYMMDD');
    _ResumenId = `${req.body.TipoResumen}-${_ResumenId}-${_NroResumen}`;

    req.body.IdUsuario = $userData.dni;
    req.body.Usuario   = $userData.name;
    req.body.FechaEmision   = _FechaEmision;
    req.body.ResumenId      = _ResumenId;
    //
    await resumenNotasCabModel.create(req.body)
    .catch(function (err) {
        console.log(_NombreDoc);
        captueError( err.original , req.body );
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    //
    //varDump(req.body);
    //
    var _dataGuardado = await resumenNotasCabModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 8 );
        _Codigo = 'RB'+_Codigo;
        await resumenNotasCabModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        })
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        await resumenNotasDetModel.update({ IdCab : _dataGuardado.id },{
            where : {
                Token : _dataGuardado.uu_id
            }
        });
    }

    var _Item = await resumenNotasCabModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    var _Det = await resumenNotasDetModel.findAll({
        where : {
            Token : _Item.uu_id
        }
    });

    $response.item = _Item;
    if( req.body.TipoResumen == 'RC' ){
        // Resumen de Comprobante
        await maxeXML( _Item , _Det ,$userData );
    }else{
        // Resumen Anulado
        await maxeXML( _Item , _Det ,$userData );
    }

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR DOCUMENTO       			//
//////////////////////////////////////////////////////////
router.post('/guardar_alta', [
    check('FechaComprobante' ,'Seleccione fecha de comprobantes').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    var _FechaEmision = moment().format('YYYY-MM-DD');
    varDump(_FechaEmision);

    // Numero de resumenes creados HOY
    var _Contador = await getCountResumenes();

    // Numero de resumenes creados HOY
    /*var _Contador = await resumenNotasCabModel.count({
        where: { 
            FechaEmision : _FechaEmision ,
            TipoResumen : req.body.TipoResumen
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });*/
    //
    _Contador = _Contador + 1;
    var _NroResumen = await pad_with_zeroes( _Contador , 3 );
    var _ResumenId = moment().format('YYYYMMDD');
    _ResumenId = `${req.body.TipoResumen}-${_ResumenId}-${_NroResumen}`;

    req.body.IdUsuario = $userData.dni;
    req.body.Usuario   = $userData.name;
    req.body.FechaEmision   = _FechaEmision;
    req.body.ResumenId      = _ResumenId;
    //
    await resumenNotasCabModel.create(req.body)
    .catch(function (err) {
        console.log(_NombreDoc);
        captueError( err.original , req.body );
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    //
    //varDump(req.body);
    //
    var _dataGuardado = await resumenNotasCabModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 8 );
        _Codigo = 'RB'+_Codigo;
        await resumenNotasCabModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        })
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        await resumenNotasDetModel.update({ IdCab : _dataGuardado.id },{
            where : {
                Token : _dataGuardado.uu_id
            }
        });
    }

    var _Item = await resumenNotasCabModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    var _Det = await resumenNotasDetModel.findAll({
        where : {
            Token : _Item.uu_id
        }
    });

    $response.item = _Item;
    if( req.body.TipoResumen == 'RC' ){
        // Resumen de Comprobante
        await maxeXML_Alta( _Item , _Det ,$userData );
    }else{
        // Resumen Anulado
        await maxeXML_Alta( _Item , _Det ,$userData );
    }

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/guardar_alta/:uuid', [
    check('FechaComprobante' ,'Seleccione fecha de comprobantes').not().isEmpty(),
], async (req,res)=>{
    // uuid
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Auditoria

	await resumenNotasCabModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
	    console.log(_NombreDoc);
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    var _Item = await resumenNotasCabModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });
    var _Det = await resumenNotasDetModel.findAll({
        where : {
            Token : _Item.uu_id
        }
    });

    $response.item = _Item;
    if( req.body.TipoResumen == 'RC' ){
        // Resumen de Comprobante
        await maxeXML_Alta( _Item , _Det ,$userData );
    }else{
        // Resumen Anulado
        await maxeXML_Alta( _Item , _Det ,$userData );
    }

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.detalle = [];

    var _Data = await resumenNotasCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _Data;
    if( _Data )
    {
        var _Items = await resumenNotasDetModel.findAll({
            where : {
                Token : _Data.uu_id
            }
        });
        $response.detalle = _Items;
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('FechaComprobante' ,'Seleccione fecha de comprobantes').not().isEmpty(),
], async (req,res)=>{
    // uuid
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Auditoria

	await resumenNotasCabModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
	    console.log(_NombreDoc);
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    var _Item = await resumenNotasCabModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });
    var _Det = await resumenNotasDetModel.findAll({
        where : {
            Token : _Item.uu_id
        }
    });

    $response.item = _Item;
    if( req.body.TipoResumen == 'RC' ){
        // Resumen de Comprobante
        await maxeXML( _Item , _Det ,$userData );
    }else{
        // Resumen Anulado
        await maxeXML( _Item , _Det ,$userData );
    }

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELIMINAR DOCUMENTO                  //
//////////////////////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    req.body.DNIAnulado = $userData.dni;
    req.body.AnuladoPor = $userData.name;

    $anuladoPor = $userData.name;

	await resumenNotasCabModel.update({
        Estado      : 'Anulado',
        DNIAnulado  : $userData.dni,
        AnuladoPor  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    
    $response.item = await resumenNotasCabModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  APROBAR DOCUMENTO                   //
//////////////////////////////////////////////////////////
router.post('/aprobar', async (req,res)=>{
    // uuid, id, Codigo
    var $response = {};
    $response.estado = 'OK';
    $response.data  = [];
    $response.items = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // 666666666666666666666666666666666666666666666666666666666666
    var _Modificable = await validarEstado( req.body.Codigo , ['Digitado'] );
    if( _Modificable != '' ){
        var _errGAA = [{ msg : _Modificable }];return res.status(422).json({ errores : _errGAA });
    }
    // 666666666666666666666666666666666666666666666666666666666666

    var _Entidad = await resumenNotasCabModel.findOne({
        where : {
            uu_id : req.body.uuid,
            id    : req.body.id
        }
    });
    if( _Entidad )
    {
        await resumenNotasCabModel.update({
            EstadoDoc : 'Aprobado',
        },{
            where : {
                uu_id : req.body.uuid,
                id    : req.body.id
            }
        });
        // Ahora marcamos todos los detalles
        var _Detalles = await resumenNotasDetModel.findAll({
            where : {
                Token : _Entidad.uu_id
            }
        });
        if( _Detalles ){
            for (let index = 0; index < _Detalles.length; index++) {
                const rs = _Detalles[index];
                var _dataUpdate = {};
                if( _Entidad.TipoResumen == 'RA' ){
                    _dataUpdate.IdResumenBaja = _Entidad.ResumenId;
                }else{
                    _dataUpdate.IdResumenAlta = _Entidad.ResumenId;
                }
                await docVentasCab.update( _dataUpdate ,{
                    where : { TipoDoc : 'NC' , Serie : rs.Serie , Correlativo : rs.Correlativo }
                });
                varDump(`Marcando doc en resumen : ${rs.Serie}-${rs.Correlativo}`);
            }
        }
        _Entidad = await resumenNotasCabModel.findOne({
            where : {
                uu_id : req.body.uuid,
                id    : req.body.id
            }
        });
        $response.data  = _Entidad;
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  APROBAR DOCUMENTO                   //
//////////////////////////////////////////////////////////
router.post('/anular', async (req,res)=>{
    // uuid, id, Codigo
    var $response = {};
    $response.estado = 'OK';
    $response.data  = [];
    $response.items = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // 666666666666666666666666666666666666666666666666666666666666
    var _Modificable = await validarEstado( req.body.Codigo , ['Digitado'] );
    if( _Modificable != '' ){
        var _errGAA = [{ msg : _Modificable }];return res.status(422).json({ errores : _errGAA });
    }
    // 666666666666666666666666666666666666666666666666666666666666

    var _Entidad = await resumenNotasCabModel.findOne({
        where : {
            uu_id : req.body.uuid,
            id    : req.body.id
        }
    });
    if( _Entidad )
    {
        await resumenNotasCabModel.update({
            EstadoDoc : 'Anulado',
            IdResumenAlta : null
        },{
            where : {
                uu_id : req.body.uuid,
                id    : req.body.id
            }
        });
        _Entidad = await resumenNotasCabModel.findOne({
            where : {
                uu_id : req.body.uuid,
                id    : req.body.id
            }
        });
        $response.data  = _Entidad;
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//               VALIDAR ESTADO DOCUMENTO               //
//////////////////////////////////////////////////////////
async function validarEstado( _CodigoHead , _Mod )
{
    // VAMOS A VALIDAR EL ESTADO DEL DOCUMENTO PARA PODER MODIFICAR
    // Solo se modifica si [Estado] es "Activo" y EstadoBznlk es nulo
    _NombreDoc
    
    var _respuesta = ``;
    var _dataDoc = await resumenNotasCabModel.findOne({
        where : {
            Codigo   : _CodigoHead
        }
    });
    if( _dataDoc )
    {
        //
        var _Estado = _dataDoc.EstadoDoc, _EstadoBznlk = _dataDoc.EstadoBznlk;
        if( _EstadoBznlk )
        {
            _respuesta = `El documento ya fue enviado a Bizlinks`;
        }else{
            if(! _Mod.includes( _Estado ) )
            {
                _respuesta = `El documento no se puede modificar`;
            }
        }
        //
    }else{
        _respuesta = `Debe guardar el documento antes de aprobarlo.`;
    }
    return _respuesta;
}
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CHECK ESTADO DOC                    //
//////////////////////////////////////////////////////////
router.post('/check', async (req,res)=>{
    // uuid, id
    var $response = {};
    $response.estado = 'OK';
    $response.data  = [];
    $response.items = [];

    var _Entidad = await resumenNotasCabModel.findOne({
        where : {
            uu_id : req.body.uuid,
            id    : req.body.id
        }
    });
    if( _Entidad )
    {
        $response.data  = _Entidad;
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                      LEER XML                        //
//////////////////////////////////////////////////////////
router.post('/leer/xml', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = ``;

    var _Entidad = await resumenNotasCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    if( _Entidad )
    {
        $response.e = _Entidad;
        if( _Entidad.ResultadoXML )
        {
            let xml_string = _Entidad.ResultadoXML;
            parser.parseString(xml_string, function(error, result) {
                if(error === null) {
                    console.log(result);
                    // parsing to json
                    let data = JSON.stringify(result)
                    $response.data = result;
                }
                else {
                    console.log(error);
                    $response.estado = 'ERROR';
                    $response.error  = error;
                }
            });
        }
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              ACTUALIZAR ESTADOS BIZLINKS             //
//////////////////////////////////////////////////////////
router.post('/update/bizlinks', async (req,res)=>{
    // uu_id
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var _uuid = req.body.uu_id;
    var $userData = await getUserData( req.headers['api-token'] );

    delete req.body.uu_id;

    req.body.IdUsuarioEnvioBizlinks = $userData.dni;
    req.body.UsuarioEnvioBizlinks   = $userData.name;
    req.body.FechaEnvioBizlinks     = moment().format('YYYY-MM-DD HH:mm:ss');

    await resumenNotasCabModel.update( req.body , {
        where : {
            uu_id : _uuid
        }
    });

    var _Entidad = await resumenNotasCabModel.findOne({
        where : {
            uu_id : _uuid
        }
    });
    $response.data = _Entidad;

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELIMINAR UN ITEM                    //
//////////////////////////////////////////////////////////
router.post('/item/delete', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.detalle = [];

    var _Data = await resumenNotasDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _Data;
    if( _Data )
    {
        await resumenNotasDetModel.destroy({
            where : {
                uu_id : req.body.uuid
            }
        });
        var _Items = await resumenNotasDetModel.findAll({
            where : {
                Token : _Data.Token
            }
        });
        $response.detalle = _Items;
    }
    
    res.json( $response );
});
// -------------------------------------------------------
async function getCountResumenes()
{
    // Vamos a contar cuantos resumenes se han generado hy y a contar.
    var _Nro = 0;

    var _FechaEmision = moment().format('YYYY-MM-DD');

    var _CountRBoleta = await resumenBoletasCabModel.count({
        where : {
            FechaEmision : _FechaEmision
        }
    });
    varDump( `_CountRBoleta: ${_CountRBoleta}` );
    _Nro = _Nro + _CountRBoleta;
    var _CountRNotas = await resumenNotasCabModel.count({
        where : {
            FechaEmision : _FechaEmision
        }
    });
    varDump( `_CountRNotas : ${_CountRNotas}` );
    _Nro = _Nro + _CountRNotas;
    return _Nro;
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
function varDump( _t )
{
    console.log( _t );
}
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
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular'],
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
async function maxeXML( _Data , _Det , _userData )
{
    //
    var _Archivo = `${_Data.ResumenId}.php`;
    var _SignOnLineCmd = ``;
    // Escribir detalle
    var _NroItem = 1, _dataDetalle = ``;
    for (let d = 0; d < _Det.length; d++) {
        const rsd = _Det[d];
        _dataDetalle += `
<ResumenItem>
<numeroFila>${rsd.NumeroFila}</numeroFila>
<tipoDocumento>07</tipoDocumento>
<serieDocumentoBaja>${rsd.Serie}</serieDocumentoBaja>
<numeroDocumentoBaja>${rsd.Correlativo}</numeroDocumentoBaja>
<motivoBaja>${rsd.MotivoBaja}</motivoBaja>
</ResumenItem>
`;

    }
    //

_SignOnLineCmd = `
<SignOnLineSummaryCmd declare-sunat="1" replicate="1" output="">
<parameter value="20102187211" name="idEmisor"/>
<parameter value="RA" name="tipoDocumento"/>
<documento>

<numeroDocumentoEmisor>20102187211</numeroDocumentoEmisor>
<tipoDocumentoEmisor>6</tipoDocumentoEmisor>
<resumenId>${_Data.ResumenId}</resumenId>
<fechaEmisionComprobante>${_Data.FechaComprobante}</fechaEmisionComprobante>
<fechaGeneracionResumen>${_Data.FechaEmision}</fechaGeneracionResumen>
<razonSocialEmisor>SALUBRIDAD SANEAMIENTO AMBIENTAL Y SERVICIOS S.A.C.</razonSocialEmisor>
<correoEmisor>-</correoEmisor>
<resumenTipo>${_Data.TipoResumen}</resumenTipo>
<inHabilitado>1</inHabilitado>

${_dataDetalle}

</documento>
</SignOnLineSummaryCmd>
`;

// Guardamos el signed enviado
await resumenNotasCabModel.update({ SignOnLineCmd : _SignOnLineCmd },{
    where : { 
        uu_id : _Data.uu_id 
    }
})
.catch(function (err) {
    captueError( err.original , req.body );
    console.log(_NombreDoc);
    $response.estado = 'ERROR';
    $response.error  = err;
    res.json( $response );
});

var _dataEscribe = `<?php 
#$dataFromTheForm = $_POST['fieldName']; // request data from the form
$soapUrl = "${_SOAP_URL}"; // asmx URL of WSDL
$soapUser = "${_SOAP_USER}";  //  username
$soapPassword = "${_SOAP_PASSWD}"; // password

// xml post structure

$xml_post_string = '
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.ce.ebiz.com/">
<soapenv:Header/>
<soapenv:Body>
<ws:invoke>
<!--Optional:-->
<command>

<![CDATA[
${_SignOnLineCmd}
]]>

</command>
</ws:invoke>
</soapenv:Body>
</soapenv:Envelope>
';


$headers = array(
   'Content-type: text/xml;charset="utf-8"',
   "Accept: text/xml",
   "Cache-Control: no-cache",
   "Pragma: no-cache",
   "SOAPAction: http://testing.bizlinks.com.pe/integrador21/ws/invoker?wsdl", // your op URL
   "Content-length: ".strlen($xml_post_string),
);

$url = $soapUrl;

// PHP cURL  for https connection with auth
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, $soapUser.":".$soapPassword); // username and password - declared at the top of the doc
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml_post_string); // XML REQUEST
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// converting
$response = curl_exec($ch); 
curl_close($ch);

#echo $response;
#echo '["OK"]';

// >>>>>>>>>>>>>>>>>>>>>>>>>>
$textoXML1 = str_replace( "&lt;" , "<" , $response );
$textoXML2 = str_replace( "&gt;" , ">" , $textoXML1 );

$textoXML3 = str_replace( '<?xml version="1.0" encoding="utf-8"?>' , '' , $textoXML2 );
$textoXML4 = str_replace( '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' , '' , $textoXML3 );
$textoXML5 = str_replace( "<soapenv:Body>" , "" , $textoXML4 );
$textoXML6 = str_replace( '<ns2:invokeResponse xmlns:ns2="http://ws.ce.ebiz.com/">' , '' , $textoXML5 );
$textoXML7 = str_replace( "<return>" , "" , $textoXML6 );
$textoXML8 = str_replace( "</ns2:invokeResponse>" , "" , $textoXML7 );
$textoXML9 = str_replace( "</soapenv:Body>" , "" , $textoXML8 );
$textoXML10= str_replace( "</soapenv:Envelope>" , "" , $textoXML9 );
$textoXML11= str_replace( "</return>" , "" , $textoXML10 );


$myfile = fopen("${_TipoDocG_}-${_Data.ResumenId}.xml", "w") or die("Unable to open file!");

//$txt = $response;
$txt = $textoXML11;

fwrite($myfile, $txt);

fclose($myfile);

# Colocar resultado #
$servername = "${process.env.DB_host}"; $username = "${process.env.DB_user}"; $password = "${process.env.DB_password}"; $dbname = "${process.env.DB_database}";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$sql = "UPDATE orq_resumen_facturas_cab SET ResultadoXML = '$textoXML11' WHERE uu_id = '${_Data.uu_id}'";
if ($conn->query($sql) === TRUE) {
  echo "<span>Record updated successfully</span>";
} else {
  echo "<span>Error updating record: " . $conn->error."</span>";
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SSAYS</title>
<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" rel="stylesheet">
<style type="text/css">
h1,p,div,th,a,td{
font-family: 'Montserrat', sans-serif;
}
</style>
</head>
<body>
<div id="chat-container" style="display:none;" >
<div id="chat-window ">
<div id="output"></div>
<div id="actions"></div>
</div>
<input type="text" id="username" value="${_userData.name}" >
<input type="text" id="message"  value="ID:${_userData.dni}" >
<button id="send" >Enviarsh</button>
</div>

<h1>Generando doc: ${_Data.ResumenId}</h1>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js" ></script>
<script src="https://tecnico.ssays-orquesta.com/js/chat.js" ></script>
<script src="https://ejecutivo.ssays-orquesta.com/js/node_orq3.js" ></script>
<script>
var $nomU = '${_userData.name}', $dniU = '${_userData.dni}';
// ******* NODE JS *******
socket.emit('emitir_doc_ventas',{
user : $nomU,
msg  : 'F-${_Data.ResumenId}',
dni  : $dniU
});
// ******* NODE JS *******
</script>
</body>
</html>
`;
// Escribimos el archivo.
fs.writeFileSync( `${_RUTA_XML}/${_TipoDocG_}-${_Archivo}` , _dataEscribe );
}
// -------------------------------------------------------
async function maxeXML_Alta( _Data , _Det , _userData )
{
    //
    var _Archivo = `${_Data.ResumenId}.php`, _numeroCorrelativoBoletaModificada = ``;
    
    // Escribir detalle
    var _NroItem = 1, _dataDetalle = ``;
    for (let d = 0; d < _Det.length; d++)
    {
        const rsd = _Det[d];

        // Data de la NC 
        var _TD = 'NC';
        if( rsd.TipoDocumento == '07'  )
        {
            _TD = 'NC';
        }else{
            _TD = 'ND';
        }
        var _dataNC = await docVentasCab.findOne({
            where: {
                TipoDoc : _TD,
                Serie   : rsd.Serie ,
                Correlativo : rsd.Correlativo
            }
        });

        if( _dataNC )
        {
            _numeroCorrelativoBoletaModificada = `${_dataNC.SerieAfectado}-${_dataNC.CorrelativoAfectado}`;
        }

        // es ruc o dni¿?
        var _IdCliente = await pad_with_zeroes( rsd.NumeroDocumentoAdquiriente , 8 );
        if( rsd.IdCliente > 99999999 ){
            _IdCliente = await pad_with_zeroes( rsd.NumeroDocumentoAdquiriente , 11 );
        }

        _dataDetalle += `
<SummaryItem>
<numeroFila>${rsd.NumeroFila}</numeroFila>
<tipoDocumento>${rsd.TipoDocumento}</tipoDocumento>
<tipoDocumentoAdquiriente>${rsd.TipoDocumentoAdquiriente}</tipoDocumentoAdquiriente>
<numeroDocumentoAdquiriente>${_IdCliente}</numeroDocumentoAdquiriente>
<tipoMoneda>${rsd.TipoMoneda}</tipoMoneda>
<numeroCorrelativo>${rsd.NumeroCorrelativo}</numeroCorrelativo>
<numeroCorrelativoBoletaModificada>${_numeroCorrelativoBoletaModificada}</numeroCorrelativoBoletaModificada>
<tipoDocumentoModificado>03</tipoDocumentoModificado>
<estadoItem>${rsd.EstadoItem}</estadoItem>
<totalValorVentaOpGravadasConIgv>${rsd.TotalValorVentaOpGravadaConIgv}</totalValorVentaOpGravadasConIgv>
<totalValorVentaOpExoneradasIgv>${rsd.TotalValorVentaOpExoneradasIgv}</totalValorVentaOpExoneradasIgv>
<totalValorVentaOpInafectasIgv>${rsd.TotalValorVentaOpInafectasIgv}</totalValorVentaOpInafectasIgv>
<totalIsc>${rsd.TotalIsc}</totalIsc>
<totalIgv>${rsd.TotalIgv}</totalIgv>
<totalVenta>${rsd.TotalVenta}</totalVenta>
<totalOtrosCargos>${rsd.TotalOtrosCargos}</totalOtrosCargos>
</SummaryItem>
`;

    }
    //
// SignOnLineSummaryCmd

var _SignOnLineCmd = `
<SignOnLineSummaryCmd declare-sunat="1" replicate="1" output="">
<parameter value="20102187211" name="idEmisor"/>
<parameter value="RC" name="tipoDocumento"/>    
<parameter value="185" name="version"/>
<resumen>

<tipoDocumentoEmisor>6</tipoDocumentoEmisor>
<numeroDocumentoEmisor>20102187211</numeroDocumentoEmisor>
<resumenId>${_Data.ResumenId}</resumenId>
<fechaEmisionComprobante>${_Data.FechaComprobante}</fechaEmisionComprobante>
<fechaGeneracionResumen>${_Data.FechaEmision}</fechaGeneracionResumen>

<razonSocialEmisor>SALUBRIDAD SANEAMIENTO AMBIENTAL Y SERVICIOS S.A.C.</razonSocialEmisor>
<correoEmisor>-</correoEmisor>
<resumenTipo>RC</resumenTipo>
<inhabilitado>1</inhabilitado>

${_dataDetalle}

</resumen>
</SignOnLineSummaryCmd>
`;

// Guardamos el signed enviado
varDump( _SignOnLineCmd );
var _gtr = await resumenNotasCabModel.update({
        SignOnLineCmd : _SignOnLineCmd
    },{
    where : { 
        uu_id : _Data.uu_id 
    }
})
.catch(function (err) {
    captueError( err.original , req.body );
    console.log(_NombreDoc);
    $response.estado = 'ERROR';
    $response.error  = err;
    res.json( $response );
});
varDump(`resumenNotasCabModel. => Actualizar SignOnline ${_gtr} - ${_Data.uu_id} | ${_Data.id}.`);

var _dataEscribe = `<?php 
#$dataFromTheForm = $_POST['fieldName']; // request data from the form
$soapUrl = "${_SOAP_URL}"; // asmx URL of WSDL
$soapUser = "${_SOAP_USER}";  //  username
$soapPassword = "${_SOAP_PASSWD}"; // password

// xml post structure

$xml_post_string = '
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.ce.ebiz.com/">
<soapenv:Header/>
<soapenv:Body>
<ws:invoke>
<!--Optional:-->
<command>
<![CDATA[

${_SignOnLineCmd}

]]>

</command>
</ws:invoke>
</soapenv:Body>
</soapenv:Envelope>
';


$headers = array(
   'Content-type: text/xml;charset="utf-8"',
   "Accept: text/xml",
   "Cache-Control: no-cache",
   "Pragma: no-cache",
   "SOAPAction: http://testing.bizlinks.com.pe/integrador21/ws/invoker?wsdl", // your op URL
   "Content-length: ".strlen($xml_post_string),
);

$url = $soapUrl;

// PHP cURL  for https connection with auth
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, $soapUser.":".$soapPassword); // username and password - declared at the top of the doc
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml_post_string); // XML REQUEST
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// converting
$response = curl_exec($ch); 
curl_close($ch);

#echo $response;
#echo '["OK"]';

// >>>>>>>>>>>>>>>>>>>>>>>>>>
$textoXML1 = str_replace( "&lt;" , "<" , $response );
$textoXML2 = str_replace( "&gt;" , ">" , $textoXML1 );

$textoXML3 = str_replace( '<?xml version="1.0" encoding="utf-8"?>' , '' , $textoXML2 );
$textoXML4 = str_replace( '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' , '' , $textoXML3 );
$textoXML5 = str_replace( "<soapenv:Body>" , "" , $textoXML4 );
$textoXML6 = str_replace( '<ns2:invokeResponse xmlns:ns2="http://ws.ce.ebiz.com/">' , '' , $textoXML5 );
$textoXML7 = str_replace( "<return>" , "" , $textoXML6 );
$textoXML8 = str_replace( "</ns2:invokeResponse>" , "" , $textoXML7 );
$textoXML9 = str_replace( "</soapenv:Body>" , "" , $textoXML8 );
$textoXML10= str_replace( "</soapenv:Envelope>" , "" , $textoXML9 );
$textoXML11= str_replace( "</return>" , "" , $textoXML10 );


$myfile = fopen("${_TipoDocG_}-${_Data.ResumenId}.xml", "w") or die("Unable to open file!");
//$txt = $response;
$txt = $textoXML11;
fwrite($myfile, $txt);
fclose($myfile);

# Colocar resultado #
$servername = "${process.env.DB_host}"; $username = "${process.env.DB_user}"; $password = "${process.env.DB_password}"; $dbname = "${process.env.DB_database}";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$sql = "UPDATE orq_resumen_notas_cab SET ResultadoXML = '$textoXML11' WHERE uu_id = '${_Data.uu_id}'";
if ($conn->query($sql) === TRUE) {
  echo "<span>Record updated successfully</span>";
} else {
  echo "<span>Error updating record: " . $conn->error."</span>";
}


?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SSAYS</title>
<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" rel="stylesheet">
<style type="text/css">
h1,p,div,th,a,td{
font-family: 'Montserrat', sans-serif;
}
</style>
</head>
<body>
<div id="chat-container" style="display:none;" >
<div id="chat-window ">
<div id="output"></div>
<div id="actions"></div>
</div>
<input type="text" id="username" value="${_userData.name}" >
<input type="text" id="message"  value="ID:${_userData.dni}" >
<button id="send" >Enviarsh</button>
</div>

<h1>Generando doc: ${_Data.ResumenId}</h1>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js" ></script>
<script src="https://tecnico.ssays-orquesta.com/js/chat.js" ></script>
<script src="https://ejecutivo.ssays-orquesta.com/js/node_orq3.js" ></script>
<script>
var $nomU = '${_userData.name}', $dniU = '${_userData.dni}';
// ******* NODE JS *******
socket.emit('emitir_doc_ventas',{
user : $nomU,
msg  : '${_Data.ResumenId}',
dni  : $dniU
});
// ******* NODE JS *******
</script>
</body>
</html>
`;
// Escribimos el archivo.
fs.writeFileSync( `${_RUTA_XML}/${_TipoDocG_}-${_Archivo}` , _dataEscribe );
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

module.exports = router;
