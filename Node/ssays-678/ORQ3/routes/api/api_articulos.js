// api_articulos.js

const router = require('express').Router();

const { articulosModel,User } = require('../../db');

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

	$response.data = await articulosModel.findAll({
        order : [
            ['CodigoArticulo' , 'DESC']
        ],
        limit  : 100
    });

    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//                  BUSCAR CLASE            //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    
    if( req.body.id != '' ){
        // Buscamos por ID
        $where.CodigoArticulo = req.body.id;
        //
        $response.data = await articulosModel.findAll({
            order : [
                ['CodigoArticulo' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        $where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        $response.data = await articulosModel.findAll({
            order : [
                ['CodigoArticulo' , 'DESC']
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

	$response.data = await articulosModel.findAll({
        order : [
            ['Descripcion' , 'DESC']
        ],
        limit : 100
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR ARTICULOS       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('Descripcion' ,'El nombre es obligatorio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioMod     = $userData.dni;
    req.body.nombre_usuario = $userData.name;
    var CodigoArticulo = await articulosModel.max('CodigoArticulo') + 1;
    req.body.CodigoArticulo = CodigoArticulo;
    //
    $response.data = await articulosModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await articulosModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    $response.data = await articulosModel.findAll({
        order : [
            ['CodigoArticulo' , 'DESC']
        ]
    });

	res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//          AGREGAR ACTUALIZAR ARTICULOS       			//
//////////////////////////////////////////////////////////
router.post('/crud', [
    check('AR_CCODIGO' ,'El Código es obligatorio').not().isEmpty(),
    check('AR_CDESCRI' ,'El nombre es obligatorio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    var _dataInsert = {};
    var CodigoArticulo = req.body.AR_CCODIGO;
    _dataInsert.uu_id            = await renovarToken();
    _dataInsert.CodigoArticulo  = CodigoArticulo.trim();
    _dataInsert.Descripcion     =  req.body.AR_CDESCRI;
    _dataInsert.UnidadMedida    =  req.body.AR_CUNIDAD;
    _dataInsert.Moneda      =  req.body.AR_CMONCOM;
    _dataInsert.Cuenta      =  req.body.AR_CCUENTA;
    _dataInsert.Precio      =  req.body.AR_NPRECOM;
    _dataInsert.Estado      =  req.body.AR_CESTADO;
    //
	var $response = {};
    $response.i = _dataInsert;
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    //
    var Articulo = await articulosModel.findOne({
        where : {
            CodigoArticulo : _dataInsert.CodigoArticulo
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    if( Articulo ){
        // Actualizar
        await articulosModel.update(_dataInsert , { where : { CodigoArticulo : Articulo.CodigoArticulo } } );
    }else{
        // Insertar
        await articulosModel.create( _dataInsert );
    }
    var Arti = await articulosModel.findOne({
        where : {
            CodigoArticulo : _dataInsert.CodigoArticulo
        }
    });
    $response.data = Arti;


	res.json( $response );
});
// -------------------------------------------------------


/////////////////////////////////////////////////////////
//                  CARGAR ARTICULOS                   //
/////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await articulosModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

/////////////////////////////////////////////////////////
//                  ACTUALIZAR CLASE                    //
/////////////////////////////////////////////////////////
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

	await articulosModel.update(req.body,{
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
    
    $response.item = await articulosModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await articulosModel.findAll({
        order : [
            ['CodigoArticulo' , 'DESC']
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

	await articulosModel.update({
        Estado      : 0,
        UsuarioMod  : $userData.dni,
        nombre_usuario  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await articulosModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await articulosModel.findAll({
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