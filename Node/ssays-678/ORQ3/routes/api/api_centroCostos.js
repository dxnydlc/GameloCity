// api_centroCostos.js

const router = require('express').Router();

const { centroCostosModel,User } = require('../../db');

const {check,validationResult} = require('express-validator');


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await centroCostosModel.findAll({
        order : [
            ['Descripcion' , 'ASC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER LISTA     			//
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await centroCostosModel.findAll({
        where : {
            Estado : 1
        },
        order : [
            ['Descripcion' , 'ASC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR ALMACEN       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('nombre' ,'El nombre es obligatorio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioMod = $userData.name;
    $response.data = await centroCostosModel.create(req.body);
    $response.data = await centroCostosModel.findOne({
        where : {
            IdAlmacen : req.body.IdAlmacen
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR HABITACION            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // IdAlmacen
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await centroCostosModel.findOne({
        where : {
            IdAlmacen : req.body.IdAlmacen
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR HABITACION            //
//////////////////////////////////////////
router.put('/:IdAlmacen', [
    check('id_ambiente' ,'Seleccione un ambiente').not().isEmpty(),
    check('nombre' ,'El nombre es obligatorio').not().isEmpty(),
], async (req,res)=>{
    // IdAlmacen
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Auditoria
    delete req.body.UsuarioMod;
    delete req.body.anulado_por;
    req.body.editado_por = $userData.name;

	await centroCostosModel.update(req.body,{
		where : { 
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    $response.data = await centroCostosModel.findOne({
        where : {
            IdAlmacen : req.body.IdAlmacen
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR HABITACION            //
//////////////////////////////////////////
router.delete('/:IdAlmacen', async (req,res)=>{
    // IdAlmacen
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    delete req.body.UsuarioMod;
    // delete req.body.editado_por;
    req.body.anulado_por = $userData.name;

    $anuladoPor = $userData.name;

	await centroCostosModel.update({
        estado      : 0,
        UsuarioMod : $anuladoPor
    },{
		where : { 
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    var $dataEntidad = await centroCostosModel.findOne({
        where : {
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    
    // obtener los datos
    console.log( $dataEntidad.id_empresa );
    if( $dataEntidad )
    {
        $response.data = await centroCostosModel.findAll({
            where : {
                id_empresa : $dataEntidad.id_empresa
            }
        });
    }
    
    res.json( $response );
});

// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
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