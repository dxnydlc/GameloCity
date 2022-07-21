// api_detallePA.js

const router = require('express').Router();

const { paDetModel,User,paHeaderModel } = require('../../db');

const {check,validationResult} = require('express-validator');

// SPARKPOST
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET)
// MOMENT
var moment = require('moment-timezone');
moment().tz("America/Lima").format();


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/:uuid',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await paDetModel.findAll({
        where : {
            id_empresa : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR DETALLE PA       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('nombre' ,'El nombre es obligatorio').not().isEmpty(),
    check('id_empresa' ,'Debes tener una empresa asignada a tu usuario').not().isEmpty()
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.creado_por = $userData.name;
    $response.data = await paDetModel.create(req.body);
    $response.data = await paDetModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR DETALLE PA            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // id
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await paDetModel.findOne({
        where : {
            IdPedAlmacenDet : req.body.id
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR DETALLE PA            //
//////////////////////////////////////////
router.put('/:id', [
    check('IdPedAlmacenCab' ,'Seleccione un ID').not().isEmpty(),
    check('IdProducto' ,'Seleccione un producto').not().isEmpty()
], async (req,res)=>{

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Fecha de inspección
    if( req.body.FechaInspeccion != null ){
        var str = req.body.FechaInspeccion;
        var res = str.split("T");
        req.body.FechaInspeccion = `${res}:00`;
    }

    // Auditoria
    req.body.UsuarioModifica = $userData.name;
    req.body.FechaModifica   =  moment().format('YYYY-MM-DD HH:mm:ss');

	await paDetModel.update(req.body,{
		where : { 
            IdPedAlmacenDet : req.params.id 
        }
    });
    $response.data = await paDetModel.findOne({
        where : {
            IdPedAlmacenDet : req.body.IdPedAlmacenDet,
            IdProducto      : req.body.IdProducto
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR DETALLE PA            //
//////////////////////////////////////////
router.delete('/:uuid/:user', async (req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    delete req.body.creado_por;
    delete req.body.editado_por;
    req.body.anulado_por = $userData.name;

    $anuladoPor = $userData.name;

	await paDetModel.update({
        estado      : 'Anulado',
        anulado_por : $anuladoPor
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    var $dataEntidad = await paDetModel.findOne({
        where : {
            uu_id : req.params.uuid 
        }
    });
    
    // obtener los datos
    console.log( $dataEntidad.id_empresa );
    if( $dataEntidad )
    {
        $response.data = await paDetModel.findAll({
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