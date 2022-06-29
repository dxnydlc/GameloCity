// api_requisicion.js


const router = require('express').Router();

var moment = require('moment-timezone');
moment().tz("America/Lima").format();


const { requisicionCabModel,User,requisicionDetModel,autRequisicionModel,sucursalModel, aprobacionesModel } = require('../../db');

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

	$response.data = await requisicionCabModel.findAll({
        order : [
            ['IdRequisicion' , 'DESC']
        ],
        limit :  10
    });

    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//                      BUSCAR CLASE                    //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // Id, IdCli, IdSucursal, UndNeg, InicioC, FinC, Estado
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    var _arrIds = [];
    if( req.body.IdReq ){
        // Buscamos por ID        
        var $IdReq = req.body.IdReq;
        _arrIds = $IdReq.split(',');
        
        $where.IdRequisicion = { [Op.in]: _arrIds };
        //
        $response.data = await requisicionCabModel.findAll({
            order : [
                ['IdRequisicion' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        if(req.body.cboCliente){
            $where.IdClienteProv = req.body.cboCliente;
        }
        if(req.body.cboSucursal){
            $where.IdSucursal = req.body.cboSucursal;
        }
        if(req.body.InicioC){
            $where.Fecha = { [Op.gte ]: req.body.InicioC, [Op.lte ]: req.body.FinC };
           // console.log('Entra 2');
        }
        if(req.body.Estado){
            $where.Estado = req.body.Estado;
        }
        if(req.body.UnidadNegocio){
            $where.UnidadNegocio = req.body.UnidadNegocio;
        }
        
        $response.data = await requisicionCabModel.findAll({
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

	$response.data = await requisicionCabModel.findAll({
        where : {
            Estado : 'Aprobado'
        },
        order : [
            ['Cliente' , 'DESC']
        ],
        limit : 100
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR REQUISICION       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('IdClienteProv' ,'Selecciona un cliente').not().isEmpty(),
    check('IdSucursal' ,'Selecciona una sucursal').not().isEmpty(),
    check('TipoServicio' ,'Selecciona un tipo de servicio').not().isEmpty(),
    check('FechaEntrega' ,'Selecciona un tipo de servicio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    var _IdRequisicion = 0;
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    // 99999999999999999999999999999999999999
    var Auditoria = {};
    Auditoria.uuid = await renovarToken();
    Auditoria.IdUsuario = $userData.dni;
    Auditoria.Usuario   = $userData.dni;
    Auditoria.token     = req.body.token;
    // 99999999999999999999999999999999999999

    req.body.Fecha          = moment().format('YYYY-MM-DD');
    req.body.UsuarioMod     = $userData.name;
    req.body.FechaMod       = moment().format('YYYY-MM-DD');
    req.body.Estado         = 'Digitado';
    //
    var ItemInsertado = await requisicionCabModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    $response.data = ItemInsertado;
    ItemInsertado = await requisicionCabModel.findOne({
        where : { uu_id : req.body.uu_id }
    });
    if( ItemInsertado ){
        // Generamos el ID requisición
        _IdRequisicion   = 'R'+await pad_with_zeroes( ItemInsertado.id , 5 );
        $response.id_str = _IdRequisicion;
        await requisicionCabModel.update({
            IdRequisicion : _IdRequisicion
        },{
            where : { id : ItemInsertado.id }
        });
        // Obtenemos los datos del documento.
        ItemInsertado = await requisicionCabModel.findOne({
            where : { uu_id : ItemInsertado.uu_id }
        });
    }
    $response.data = ItemInsertado;
    // 99999999999999999999999999999999999999
    Auditoria.IdRequisicion = _IdRequisicion;
    Auditoria.Accion = `Guardar Requisición interna #${_IdRequisicion}`;
    // 99999999999999999999999999999999999999

    // Guardamos auditoria...
    // 99999999999999999999999999999999999999
    var myJSON = JSON.stringify(req.body);
    Auditoria.data_json = myJSON;
    await autRequisicionModel.create(Auditoria);
    // 99999999999999999999999999999999999999

    // Unir detalle
    await requisicionDetModel.update({
        IdRequisicion : _IdRequisicion
    },{
        where : {
            token : req.body.uu_id
        }
    });
    // Show detalle
    var _detalle = await requisicionDetModel.findAll({
        where : {
            IdRequisicion : _IdRequisicion
        }
    });
    $response.detalle = _detalle;
    // Auditoria
    await autRequisicionModel.update({
        IdRequisicion : _IdRequisicion
    },{
        where : {
            token : req.body.uu_id
        }
    });
    // Show Auditoria
    var _Auditoria = await autRequisicionModel.findAll({
        where : {
            IdRequisicion : _IdRequisicion
        }
    });
    $response.auth = _Auditoria;
    

    $response.item = await requisicionCabModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//       SINCRONIZAR DETALLE REQUISICION                //
//////////////////////////////////////////////////////////
router.post('/syncitems', async (req,res)=>{
    // Vamos a unir los items con el IdRequisicion
    // IdReq, token, Id(Orquesta)
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

    // Header
    await requisicionCabModel.update({
        IdRequisicion : req.body.IdReq
    },{
        where : {
            id : req.body.Id
        }
    });
    // Detalles
    await requisicionDetModel.update({
        IdRequisicion : req.body.IdReq
    },{
        where : {
            token : req.body.token
        }
    });
    // Auditoria
    await autRequisicionModel.update({
        IdRequisicion : req.body.IdReq
    },{
        where : {
            token : req.body.token
        }
    });
    // 99999999999999999999999999999999999999
    Auditoria.Accion = `Unir detalle: ${req.body.IdReq}}`;
    // 99999999999999999999999999999999999999
    // Guardamos auditoria...
    // 99999999999999999999999999999999999999
    var myJSON = JSON.stringify(req.body);
    Auditoria.data_json = myJSON;
    //await autRequisicionModel.create(Auditoria);
    // 99999999999999999999999999999999999999

    var _detalle = await requisicionDetModel.findAll({
        where : {
            IdRequisicion : req.body.IdReq
        }
    });
    $response.data = _detalle;
    
    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//                  CARGAR REQUISICION                  //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response       = {};
    $response.estado    = 'OK';
    $response.data      = [];
    $response.locales   = [];
    $response.detalle   = [];
    $response.auth      = [];

    var Item = await requisicionCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = Item;
    if( Item ){
        // Locales del cliente...
        var Locales = await sucursalModel.findAll({
            where : {
                IdClienteProv : Item.IdClienteProv,
                Estado : 1
            },
            order : [['Descripcion','ASC']]
        });
        $response.locales = Locales;
        // Detalle
        $response.detalle = await requisicionDetModel.findAll({
            where : {
                IdRequisicion : Item.IdRequisicion
            }
        });
        // Auditoria
        $response.auth = await autRequisicionModel.findAll({
            where : {
                IdRequisicion : Item.IdRequisicion
            }
        });
    }
    
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                   ACTUALIZAR REQUISICION             //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('IdClienteProv' ,'Selecciona un cliente').not().isEmpty(),
    check('IdSucursal' ,'Selecciona una sucursal').not().isEmpty(),
    check('TipoServicio' ,'Selecciona un tipo de servicio').not().isEmpty(),
    check('FechaEntrega' ,'Selecciona un tipo de servicio').not().isEmpty(),
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

    // 99999999999999999999999999999999999999
    var Auditoria = {};
    Auditoria.uuid = await renovarToken();
    Auditoria.IdUsuario = $userData.dni;
    Auditoria.Usuario   = $userData.dni;
    Auditoria.token     = req.body.token;
    // 99999999999999999999999999999999999999

    // Auditoria
    req.body.UsuarioMod     = $userData.name;
    req.body.FechaMod       = moment().format('YYYY-MM-DD');
    req.body.Estado         = 'Digitado';

	await requisicionCabModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    $response.item = await requisicionCabModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });
    // Show detalle
    var _detalle = await requisicionDetModel.findAll({
        where : {
            IdRequisicion : $response.item.IdRequisicion
        }
    });
    $response.detalle = _detalle;

    // 99999999999999999999999999999999999999
    Auditoria.Accion = `Actualizar Requisición #${$response.item.IdRequisicion}`;
    // 99999999999999999999999999999999999999
    // Guardamos auditoria...
    // 99999999999999999999999999999999999999
    var myJSON = JSON.stringify(req.body);
    Auditoria.data_json = myJSON;
    await autRequisicionModel.create(Auditoria);
    // 99999999999999999999999999999999999999


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
    var Item = await requisicionCabModel.findOne({
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
            IdTipoDoc : 8,
            IdUser    : $userData.dni,
            aprobar   : 'SI'
        }
    });

    if( $response.estado == 'OK' ){
        if( PermisosUser ){
            await requisicionCabModel.update({
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

    var Item = await requisicionCabModel.findOne({
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
                IdTipoDoc : 8,
                IdUser    : $userData.dni,
                anular    : 'SI'
            }
        });
        if( PermisosUser ){
            await requisicionCabModel.update({
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

//////////////////////////////////////////////////////////
//                      ELIMINAR CLASE                  //
//////////////////////////////////////////////////////////
router.delete('/anular/:uuid', async (req,res)=>{
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

	await requisicionCabModel.update({
        Estado      : 0,
        UsuarioMod  : $userData.dni,
        nombre_usuario  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await requisicionCabModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await requisicionCabModel.findAll({
        order : [
            ['sSSSSS' , 'ASC']
        ]
    });
    
    res.json( $response );
});

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
        await requisicionDetModel.update(req.body,{
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
        await requisicionDetModel.create(req.body)
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
        Detalle = await requisicionDetModel.findAll({
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
        var Total = await requisicionDetModel.sum('Total',{
            where: {
                IdRequisicion : IdRequisicion
            }
        });
        // Suma total de las cantidades...
        var Items = await requisicionDetModel.count({
            where: {
                IdRequisicion : IdRequisicion
            }
        });
    }else{
        Detalle = await requisicionDetModel.findAll({
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
        var Total = await requisicionDetModel.sum('Total',{
            where: {
                token : token
            }
        });
        // Suma total de las cantidades...
        var Items = await requisicionDetModel.count({
            where: {
                token : token
            }
        });
    }
    
    $response.Items = Items;
    $response.Total = Total;
    $response.data = Detalle;
    $response.auth = Auth;
    $response.item = await requisicionDetModel.findOne({
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

    $response.data = await requisicionDetModel.findOne({
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

    var Item = await requisicionDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    if( Item ){
        await requisicionDetModel.destroy({
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
        _Detalle = await requisicionDetModel.findAll({
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
        var Total = await requisicionDetModel.sum('Total',{
            where: {
                IdRequisicion : IdRequisicion
            }
        });
        // Suma total de las cantidades...
        var Items = await requisicionDetModel.count({
            where: {
                IdRequisicion : IdRequisicion
            }
        });
    }else{
        _Detalle = await requisicionDetModel.findAll({
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
        var Total = await requisicionDetModel.sum('Total',{
            where: {
                token : token
            }
        });
        // Suma total de las cantidades...
        var Items = await requisicionDetModel.count({
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