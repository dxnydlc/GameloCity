// api_usuariosCliente.js

const router = require('express').Router();

const { usuariosClienteModel, User, sucursalModel } = require('../../db');

const {check,validationResult} = require('express-validator');

const { Op } = require("sequelize");

usuariosClienteModel.hasMany(sucursalModel,{
	as : 'Locales', foreignKey 	: 'IdSucursal',targetKey: 'id_local',
});



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await usuariosClienteModel.findAll({
        order : [
            ['id' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/supervisores',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await usuariosClienteModel.findAll({
        order : [
            ['id' , 'DESC']
        ],
        where : {
            tipo_usuario : 'SUPERVISOR'
        },
        //group : 'id_cliente',
        include: [{
            model: sucursalModel,
            as: 'Locales'
        }]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//                BUSCAR                //
//////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};

    if( req.body.id != '' ){
        // Buscamos por ID
        $where.id = req.body.id;
        //
        $response.data = await usuariosClienteModel.findAll({
            order : [
                ['id' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        $where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        $response.data = await usuariosClienteModel.findAll({
            order : [
                ['id' , 'DESC']
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

	$response.data = await usuariosClienteModel.findAll({
        where : {
            Estado : 'Activo'
        },
        order : [
            ['id' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR CLASE       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('id_cliente' ,'Seleccione un cliente').not().isEmpty(),
    check('id_usuario' ,'Seleccione un usuario').not().isEmpty(),
    check('idsLocal' ,'Debe seleccionar un local').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    var IdsLocales = [];
    var $IdOSs = req.body.idsLocal;
    IdsLocales = $IdOSs.split(',');
    console.log(IdsLocales);
    delete req.body.idsLocal;
    delete req.body.wrapperTable2_length;
    delete req.body.deaLocal;
    delete req.body.id;

    // borramos anteriores....
    usuariosClienteModel.destroy({
        where : {
            id_cliente : req.body.id_cliente,
            id_usuario : req.body.id_usuario
        }
    });

    for (let index = 0; index < IdsLocales.length; index++) {
        const rs = IdsLocales[index];
        req.body.uu_id = await renovarToken();
        req.body.id_local = rs;
        var _dataLocal = await sucursalModel.findOne({
            where : {
                IdSucursal : rs
            }
        });
        if( _dataLocal ){
            req.body.local = _dataLocal.Descripcion;
        }
        //
        //console.log(req.body);
        //
        await usuariosClienteModel.create(req.body)
        .catch(function (err) {
            console.log(err);
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
    }

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR CLASE            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.locales = [];
    $response.locales_usuario = [];

    $response.data = await usuariosClienteModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });

    if( $response.data ){
        // ****************** Sucursales del cliente ******************
        $response.locales = await sucursalModel.findAll({
            where : {
                IdClienteProv : $response.data.id_cliente
            }
        })
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        // ****************** Sucursales asignadas al supervisor ******************
        $response.locales_usuario = await usuariosClienteModel.findAll({
            where : {
                id_cliente : $response.data.id_cliente,
                id_usuario : $response.data.id_usuario
            }
        })
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        // ******************
    }

    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR CLASE          //
//////////////////////////////////////////
router.put('/:uuid', [
    check('Descripcion' ,'El nombre es obligatorio').not().isEmpty(),
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
    req.body.UsuarioMod     = $userData.dni;
    req.body.nombre_usuario = $userData.name;

	await usuariosClienteModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    $response.item = await usuariosClienteModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await usuariosClienteModel.findAll({
        order : [
            ['id' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR CLASE            //
//////////////////////////////////////////
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

	await usuariosClienteModel.update({
        Estado      : 0,
        UsuarioMod  : $userData.dni,
        nombre_usuario  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await usuariosClienteModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await usuariosClienteModel.findAll({
        order : [
            ['Descripcion' , 'ASC']
        ]
    });
    
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


module.exports = router;