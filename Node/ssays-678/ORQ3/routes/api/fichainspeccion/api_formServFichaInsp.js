
// api_formServFichaInsp.js

const router = require('express').Router();

const { formServFichaInspModel,User } = require('../../../db');

const {check,validationResult} = require('express-validator');

// MOMENT
var moment = require('moment-timezone');
moment().tz("America/Lima").format();


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await formServFichaInspModel.findAll({
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

	$response.data = await formServFichaInspModel.findAll({
        where : {
            estado : 1
        },
        order : [
            ['Descripcion' , 'ASC']
        ]
    });
    

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR FORMULARIO       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('IdLocal' ,'Es necesario guardar el local').not().isEmpty(),
    check('IdFichaInspeccion' ,'Es necesario guardar la ficha primero').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioCreado = $userData.name;
    req.body.created_at =  moment().format('YYYY-MM-DD HH:mm:ss');

    $response.data = await formServFichaInspModel.create(req.body);
    $response.data = await formServFichaInspModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR FORMULARIO            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // IdFichaInspeccion, IdLocal
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await formServFichaInspModel.findOne({
        where : {
            IdFichaInspeccion : req.body.IdFichaInspeccion,
            IdLocal : req.body.IdLocal
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR HABITACION            //
//////////////////////////////////////////
router.put('/:id', [
    check('IdLocal' ,'Es necesario guardar el local').not().isEmpty(),
    check('IdFichaInspeccion' ,'Es necesario guardar la ficha primero').not().isEmpty(),
], async (req,res)=>{
    // id
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
    delete req.body.UsuarioAnulado;
    req.body.UsuarioModificado = $userData.name;

	await formServFichaInspModel.update(req.body,{
		where : { 
            id : req.params.id 
        }
    });
    $response.data = await formServFichaInspModel.findOne({
        where : {
            id : req.params.id
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

	await formServFichaInspModel.update({
        estado      : 0,
        UsuarioMod : $anuladoPor
    },{
		where : { 
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    var $dataEntidad = await formServFichaInspModel.findOne({
        where : {
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    
    // obtener los datos
    console.log( $dataEntidad.id_empresa );
    if( $dataEntidad )
    {
        $response.data = await formServFichaInspModel.findAll({
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