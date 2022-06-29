// api_plantilla.js

const router = require('express').Router();

const { plantillaModel,User } = require('../../db');

const {check,validationResult} = require('express-validator');



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await plantillaModel.findAll({
        order : [
            ['id' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER PLANTILLA        			//
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await await plantillaModel.findAll({
        order : [
            ['Nombre' , 'ASC']
        ],
        where : {
            Estado : 'Activo'
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR PLANTILLA       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('Tipo' ,'El tipo de plantilla es obligatorio').not().isEmpty(),
    check('Nombre' ,'El nombre de plantilla es obligatorio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioCreado = $userData.name;
    await plantillaModel.create(req.body);
    $response.insert = await plantillaModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    $response.data = await getLista();

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR PLANTILLA            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // id
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await plantillaModel.findOne({
        where : {
            id : req.body.id
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR PLANTILLA           //
//////////////////////////////////////////
router.put('/:uuid', [
    check('Tipo' ,'El tipo de plantilla es obligatorio').not().isEmpty(),
    check('Nombre' ,'El nombre de plantilla es obligatorio').not().isEmpty(),
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
    delete req.body.UsuarioCreado;
    delete req.body.UsuarioAnulado;
    req.body.UsuarioModificado = $userData.name;

	await plantillaModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    $response.data = await getLista();

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR PLANTILLA             //
//////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    delete req.body.UsuarioCreado;
    delete req.body.UsuarioModificado;
    req.body.UsuarioAnulado = $userData.name;

    $anuladoPor = $userData.name;

	await plantillaModel.update({
        Estado      : 'Anulado',
        UsuarioAnulado : $anuladoPor
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    var $dataEntidad = await plantillaModel.findOne({
        where : {
            uu_id : req.params.uuid 
        }
    });
    
    if( $dataEntidad )
    {
        $response.data = await getLista();
    }
    
    res.json( $response );
});

// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
async function getLista()
{
    //
    var $data = await plantillaModel.findAll({
        order : [
            ['id' , 'DESC']
        ]
    });
    //
    return $data;
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