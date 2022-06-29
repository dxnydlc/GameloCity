// api_plantillaDetalle.js

const router = require('express').Router();

const { plantillaDetalleModel,User } = require('../../db');

const {check,validationResult} = require('express-validator');


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/:idPlant',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await getLista( req.params.idPlant );

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

	$response.data = await plantillaDetalleModel.findAll({
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
//      			AGREGAR DETALLE       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('Tipo' ,'El tipo de documento es obligatorio').not().isEmpty(),
    check('Titulo' ,'El título es obligatorio').not().isEmpty(),
    check('Contenido' ,'El contenido es obligatorio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioCreado = $userData.name;
    req.body.uu_id = await renovarToken();
    await plantillaDetalleModel.create(req.body);
    $response.data = await getLista( req.body.id_plantilla );

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR DETALE               //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uu_id
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await plantillaDetalleModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//          ACTUALIZAR DETALLE          //
//////////////////////////////////////////
router.put('/:uuid', [
    check('Tipo' ,'El tipo de documento es obligatorio').not().isEmpty(),
    check('Titulo' ,'El título es obligatorio').not().isEmpty(),
    check('Contenido' ,'El contenido es obligatorio').not().isEmpty(),
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

	await plantillaDetalleModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    $response.data = await plantillaDetalleModel.findOne({
        where : {
            uu_id : req.params.uuid 
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR HABITACION            //
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
    req.body.UsuarioAnulado = $userData.name;

    $anuladoPor = $userData.name;

	await plantillaDetalleModel.update({
        Estado      : 'Anulado',
        UsuarioAnulado : $anuladoPor
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    var $dataEntidad = await plantillaDetalleModel.findOne({
        where : {
            uu_id : req.params.uuid 
        }
    });
    
    if( $dataEntidad )
    {
        $response.data = await getLista( $dataEntidad.id_plantilla );
    }
    
    res.json( $response );
});

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
async function getLista( $idPlant )
{
    //
    var $data = await plantillaDetalleModel.findAll({
        order : [
            ['id' , 'DESC']
        ],
        where : {
            id_plantilla : $idPlant
        }
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
