// api_requisicionAlmacen.js

const router = require('express').Router();

var moment = require('moment-timezone');
moment().tz("America/Lima").format();

const { requisicionAlmacelCabModel,User, requisicionAlmacelDetModel,autRequisicionModel,aprobacionesModel } = require('../../db');

const {check,validationResult} = require('express-validator');

const { Op } = require("sequelize");


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await requisicionAlmacelCabModel.findAll({
        order : [
            ['IdRequisicion' , 'DESC']
        ],
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////
//          BUSCAR CLASE            //
//////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    
    if(req.body.id){
        // Buscamos por ID
        $where.IdRequisicion = req.body.id;
        //
        $response.data = await requisicionAlmacelCabModel.findAll({
            order : [
                ['IdRequisicion' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        if(req.body.IdSolicitante){
            $where.IdSolicitante = req.body.IdSolicitante;
        }
        if(req.body.IdAutorizadoPor){
            $where.IdAutorizadoPor = req.body.IdSolicitante;
        }
        if(req.body.Emision){
            $where.Fecha = req.body.Emision;
        }
        if(req.body.Entrega){
            $where.FechaEntrega = req.body.Entrega;
        }
        //
        $response.data = await requisicionAlmacelCabModel.findAll({
            order : [
                ['IdRequisicion' , 'DESC']
            ],
            where : $where
        });
    }

    
    res.json( $response );
});
// ---------------------------------------


//////////////////////////////////////////////////////////
//      			OBTENER LISTA     			//
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await requisicionAlmacelCabModel.findAll({
        where : {
            Estado : 1
        },
        order : [
            ['Descripcion' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              AGREGAR REQUISICION ALMACEN             //
//////////////////////////////////////////////////////////
router.post('/', [
    check('CodContaCC' ,'Selecciona un centro de costos').not().isEmpty(),
    check('IdAutorizadoPor' ,'Es necesario seleccionar una persona que autoriza.').not().isEmpty(),
    check('IdSolicitante' ,'Es necesario eleccionar un solicitante.').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    var _IdRequisicion = 0;
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.Fecha          = moment().format('YYYY-MM-DD');
    req.body.UsuarioMod     = $userData.name;
    req.body.FechaMod       = moment().format('YYYY-MM-DD');
    req.body.Estado         = 'Digitado';
    //
    var ItemInsertado = await requisicionAlmacelCabModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    ItemInsertado = await requisicionAlmacelCabModel.findOne({
        where : { uu_id : req.body.uu_id }
    });
    if( ItemInsertado ){
        // Generamos el ID requisición
        _IdRequisicion   = 'A'+await pad_with_zeroes( ItemInsertado.id , 5 );
        $response.id_str = _IdRequisicion;
        await requisicionAlmacelCabModel.update({
            IdRequisicion : _IdRequisicion
        },{
            where : { id : ItemInsertado.id }
        });
        // Obtenemos los datos del documento.
        ItemInsertado = await requisicionAlmacelCabModel.findOne({
            where : { uu_id : ItemInsertado.uu_id }
        });
    }
    $response.data = ItemInsertado;

    // Unir detalle
    await requisicionAlmacelDetModel.update({
        IdRequisicion : _IdRequisicion
    },{
        where : {
            token : req.body.uu_id
        }
    });
    // Show detalle
    var _detalle = await requisicionAlmacelDetModel.findAll({
        where : {
            IdRequisicion : _IdRequisicion
        }
    });
    $response.detalle = _detalle;
    

    $response.item = await requisicionAlmacelCabModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

///////////////////////////////////////////////////////////
//              CARGAR REQUISICION ALMACEN               //
///////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var Entidad = await requisicionAlmacelCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = Entidad;
    var _detalle = await requisicionAlmacelDetModel.findAll({
        where : {
            IdRequisicion : Entidad.IdRequisicion
        }
    });
    $response.detalle = _detalle;
    
    res.json( $response );
});
// ---------------------------------------

///////////////////////////////////////////////////////////
//              ACTUALIZAR REQUISICION ALMACEN           //
///////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('CodContaCC' ,'Selecciona un centro de costos').not().isEmpty(),
    check('IdAutorizadoPor' ,'Es necesario seleccionar una persona que autoriza.').not().isEmpty(),
    check('IdSolicitante' ,'Es necesario eleccionar un solicitante.').not().isEmpty(),
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
    req.body.UsuarioMod     = $userData.name;
    req.body.FechaMod       = moment().format('YYYY-MM-DD');
    req.body.Estado         = 'Digitado';

	await requisicionAlmacelCabModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await requisicionAlmacelCabModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });
    // Show detalle
    var _detalle = await requisicionAlmacelDetModel.findAll({
        where : {
            IdRequisicion : $response.item.IdRequisicion
        }
    });
    $response.detalle = _detalle;

    res.json( $response );
});
// -------------------------------------------------------

///////////////////////////////////////////////////////////
//               ELIMINAR REQUISICION ALMACEN            //
///////////////////////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    delete req.body.UsuarioMod;
    // delete req.body.editado_por;
    req.body.UsuarioMod = $userData.name;

    $anuladoPor = $userData.name;

	await requisicionAlmacelCabModel.update({
        Estado      : 0,
        UsuarioMod  : $userData.dni,
        nombre_usuario  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await requisicionAlmacelCabModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await requisicionAlmacelCabModel.findAll({
        order : [
            ['Descripcion' , 'ASC']
        ]
    });
    
    res.json( $response );
});

// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                  APROBAR REQUISICION                 //
//////////////////////////////////////////////////////////
router.post('/aprobar', async (req,res)=>{
    // uuid , IdReq
    var $response       = {};
    $response.estado    = 'OK';
    $response.data      = [];

    var $userData = await getUserData( req.headers['api-token'] );
    // 99999999999999999999999999999999999999
    var Auditoria = {};
    Auditoria.uuid = await renovarToken();
    Auditoria.IdUsuario = $userData.dni;
    Auditoria.Usuario   = $userData.dni;
    Auditoria.token     = req.body.token;
    // 99999999999999999999999999999999999999
    var Item = await requisicionAlmacelCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    if( Item.Estado != 'Digitado' ){
        $response.estado = 'ERROR';
        $response.error  = 'El documento no se puede aprobar, estado '+Item.Estado;
    }
    var PermisosUser = await aprobacionesModel.findOne({
        where : {
            IdTipoDoc : 49,
            IdUser    : $userData.dni,
            aprobar   : 'SI'
        }
    });

    if( $response.estado == 'OK' ){
        if( PermisosUser ){
            await requisicionAlmacelCabModel.update({
                Estado       : 'Aprobado',
                UsuarioModAp : $userData.name,
                FechaModAp   : moment().format('YYYY-MM-DD')
            },{
                where : {
                    uu_id : req.body.uuid
                }
            });
            // 99999999999999999999999999999999999999
            Auditoria.Accion = `Aprobar Requisición #${req.body.IdReq}`;
            // 99999999999999999999999999999999999999
            // Guardamos auditoria...
            // 99999999999999999999999999999999999999
            var myJSON = JSON.stringify(req.body);
            Auditoria.data_json = myJSON;
            await autRequisicionModel.create(Auditoria);
            // 99999999999999999999999999999999999999
        }else{
            $response.estado = 'ERROR';
            $response.estado = 'Su usuario no cuenta con permisos para realizar esta acción';
        }
    }


    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ANULAR REQUISICION                 //
//////////////////////////////////////////////////////////
router.post('/anular', async (req,res)=>{
    // uuid , IdReq, Motivo
    var $response       = {};
    $response.estado    = 'OK';
    $response.data      = [];

    var $userData = await getUserData( req.headers['api-token'] );
    // 99999999999999999999999999999999999999
    var Auditoria = {};
    Auditoria.uuid = await renovarToken();
    Auditoria.IdUsuario = $userData.dni;
    Auditoria.Usuario   = $userData.dni;
    Auditoria.token     = req.body.token;
    // 99999999999999999999999999999999999999

    var Item = await requisicionAlmacelCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    if( Item.Estado == 'Anulado' ){
        $response.estado = 'ERROR';
        $response.error  = 'El documento se encuetra anulado';
    }

    if( $response.estado == 'OK' ){
        var PermisosUser = await aprobacionesModel.findOne({
            where : {
                IdTipoDoc : 49,
                IdUser    : $userData.dni,
                anular    : 'SI'
            }
        });
        if( PermisosUser ){
            await requisicionAlmacelCabModel.update({
                Estado       : 'Anulado',
                UsuarioModAn : $userData.name,
                FechaModAn   : moment().format('YYYY-MM-DD'),
                MotivoAnulacion : req.body.Motivo
            },{
                where : {
                    uu_id : req.body.uuid
                }
            });
            // 99999999999999999999999999999999999999
            Auditoria.Accion = `Aprobar Requisición #${req.body.IdReq}`;
            // 99999999999999999999999999999999999999
            // Guardamos auditoria...
            // 99999999999999999999999999999999999999
            var myJSON = JSON.stringify(req.body);
            Auditoria.data_json = myJSON;
            await autRequisicionModel.create(Auditoria);
            // 99999999999999999999999999999999999999
        }else{
            $response.estado = 'ERROR';
            $response.estado = 'Su usuario no cuenta con permisos para realizar esta acción';
        }
    }
    

    
    
    res.json( $response );
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


//////////////////////////////////////////////////////////
//             AGREGAR ITEMS A LA RQUISICION            //
//////////////////////////////////////////////////////////
router.post('/item', [
    check('IdArticulo' ,'Seleccione un artículo').not().isEmpty(),
    check('Cantidad' ,'Ingrese una cantidad').not().isEmpty(),
], async (req,res)=>{
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
    // 
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var Detalle = [],Auth = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // 99999999999999999999999999999999999999
    var Auditoria = {};
    Auditoria.uuid = await renovarToken();
    Auditoria.IdUsuario = $userData.dni;
    Auditoria.Usuario   = $userData.dni;
    Auditoria.token     = req.body.token;
    // 99999999999999999999999999999999999999

    var Id = parseInt( req.body.id ), IdRequisicion = req.body.IdRequisicion, token = req.body.token;
    if( Id > 0 ){
        // Actualizar
        delete req.body.id;
        await requisicionAlmacelDetModel.update(req.body,{
            where : { 
                uu_id : req.body.uu_id 
            }
        })
        .catch(function (err) {
            console.log(err);
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        // 99999999999999999999999999999999999999
        Auditoria.Accion = `Editar articulo: ${req.body.IdArticulo}-${req.body.Articulo}`;
        // 99999999999999999999999999999999999999
    }else{
        // Nuevo
        await requisicionAlmacelDetModel.create(req.body)
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        // 99999999999999999999999999999999999999
        Auditoria.Accion = `Agregar articulo: ${req.body.IdArticulo}-${req.body.Articulo}`;
        // 99999999999999999999999999999999999999
    }
    // Guardamos auditoria...
    // 99999999999999999999999999999999999999
    var myJSON = JSON.stringify(req.body);
    Auditoria.data_json = myJSON;
    await autRequisicionModel.create(Auditoria);
    // 99999999999999999999999999999999999999
    // Devolvemos todo el detalle
    if( IdRequisicion > 0 ){
        Detalle = await requisicionAlmacelDetModel.findAll({
            where : {
                IdRequisicion : IdRequisicion
            }
        });
        Auth = await autRequisicionModel.findAll({
            where : {
                IdRequisicion : IdRequisicion
            }
        });
        // Suma total de los items...
        var Total = await requisicionAlmacelDetModel.sum('Total',{
            where: {
                IdRequisicion : IdRequisicion
            }
        });
        // Suma total de las cantidades...
        var Items = await requisicionAlmacelDetModel.count({
            where: {
                IdRequisicion : IdRequisicion
            }
        });
    }else{
        Detalle = await requisicionAlmacelDetModel.findAll({
            where : {
                token : token
            }
        });
        Auth = await autRequisicionModel.findAll({
            where : {
                token : token
            }
        });
        // Suma total de los items...
        var Total = await requisicionAlmacelDetModel.sum('Total',{
            where: {
                token : token
            }
        });
        // Suma total de las cantidades...
        var Items = await requisicionAlmacelDetModel.count({
            where: {
                token : token
            }
        });
    }
    
    $response.Items = Items;
    $response.Total = Total;
    $response.data = Detalle;
    $response.auth = Auth;
    $response.item = await requisicionAlmacelDetModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    
    
    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                  CARGAR ITEMS                       //
//////////////////////////////////////////////////////////
router.post('/get_item', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await requisicionAlmacelDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                  ELIMINAR ITEMS                      //
//////////////////////////////////////////////////////////
router.delete('/delitem', async (req,res)=>{
    // Descripcion
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );
    // 99999999999999999999999999999999999999
    var Auditoria = {};
    Auditoria.uuid = await renovarToken();
    Auditoria.IdUsuario = $userData.dni;
    Auditoria.Usuario   = $userData.dni;
    Auditoria.token     = req.body.token;
    // 99999999999999999999999999999999999999

    var IdRequisicion = parseInt( req.body.IdReq), token = req.body.token;
    var _Detalle = [], _Auth = [];

    var Item = await requisicionAlmacelDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    if( Item ){
        await requisicionAlmacelDetModel.destroy({
            where : { 
                uu_id : req.body.uuid
            }
        });
        // 99999999999999999999999999999999999999
        Auditoria.Accion = `Eliminar articulo: ${Item.IdArticulo}-${Item.Articulo}`;
        // 99999999999999999999999999999999999999
    }

    // Guardamos auditoria...
    // 99999999999999999999999999999999999999
    var myJSON = JSON.stringify(req.body);
    Auditoria.data_json = myJSON;
    await autRequisicionModel.create(Auditoria);
    
    if( IdRequisicion > 0 ){
        _Detalle = await requisicionAlmacelDetModel.findAll({
            where : {
                IdRequisicion : IdRequisicion
            }
        });
        _Auth = await autRequisicionModel.findAll({
            where : {
                IdRequisicion : IdRequisicion
            }
        });
        // Suma total de los items...
        var Total = await requisicionAlmacelDetModel.sum('Total',{
            where: {
                IdRequisicion : IdRequisicion
            }
        });
        // Suma total de las cantidades...
        var Items = await requisicionAlmacelDetModel.count({
            where: {
                IdRequisicion : IdRequisicion
            }
        });
    }else{
        _Detalle = await requisicionAlmacelDetModel.findAll({
            where : {
                token : token
            }
        });
        _Auth = await autRequisicionModel.findAll({
            where : {
                token : token
            }
        });
        // Suma total de los items...
        var Total = await requisicionAlmacelDetModel.sum('Total',{
            where: {
                token : token
            }
        });
        // Suma total de las cantidades...
        var Items = await requisicionAlmacelDetModel.count({
            where: {
                token : token
            }
        });
    }

    $response.Items = Items;
    $response.Total = Total;
    $response.data = _Detalle;
    $response.auth = _Auth;

    
    res.json( $response );
});
// -------------------------------------------------------


// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
async function renovarToken()
{
    var length = 12;
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

module.exports = router;


