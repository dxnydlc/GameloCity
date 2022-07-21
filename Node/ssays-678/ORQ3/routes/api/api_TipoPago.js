// api_TipoPago.js

const router = require('express').Router();

const { tipoPagoModel,User } = require('../../db');

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

	$response.data = await tipoPagoModel.findAll({
        order : [
            ['IdTipoPago' , 'DESC']
        ]
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

    if( req.body.id != '' ){
        // Buscamos por ID
        $where.IdTipoPago = req.body.id;
        //
        $response.data = await tipoPagoModel.findAll({
            order : [
                ['IdTipoPago' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        $where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        $response.data = await tipoPagoModel.findAll({
            order : [
                ['IdTipoPago' , 'DESC']
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
    var _response = {};
    _response.codigo = 200;

    try {
        //
        var _Entidad = await tipoPagoModel.findAll({
            where : {
                Estado : 'Activo'
            },
            order : [
                ['Descripcion' , 'DESC']
            ]
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        //
        _response.data = _Entidad;
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se cargaron los datos del documento: ${_Entidad.Codigo}.` };
        //
    } catch (error) {
        varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR CLASE       			//
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

    var IdTipoPago = await tipoPagoModel.max('IdTipoPago') + 1;
    req.body.IdTipoPago = IdTipoPago;
    //
    $response.data = await tipoPagoModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await tipoPagoModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    $response.data = await tipoPagoModel.findAll({
        order : [
            ['IdTipoPago' , 'DESC']
        ]
    });

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

    $response.data = await tipoPagoModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
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

	await tipoPagoModel.update(req.body,{
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
    
    $response.item = await tipoPagoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await tipoPagoModel.findAll({
        order : [
            ['IdTipoPago' , 'DESC']
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

	await tipoPagoModel.update({
        Estado      : 'Anulado',
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await tipoPagoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await tipoPagoModel.findAll({
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