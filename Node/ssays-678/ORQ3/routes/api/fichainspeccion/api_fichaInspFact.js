// api_fichaInspFact.js

const router = require('express').Router();

const { fichaInspFactModel, User, tipoPagoModel } = require('../../../db');

const {check,validationResult} = require('express-validator');


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await fichaInspFactModel.findAll({
        order : [
            ['id' , 'ASC']
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

	$response.data = await fichaInspFactModel.findAll({
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
//      			    AGREGAR DOC       	    		//
//////////////////////////////////////////////////////////
router.post('/', [
    check('IdFichaInspeccion' ,'Debe guardar la ficha de inspección primero').not().isEmpty(),
    check('TipoComprobante' ,'Indicar el tipo de documento a emitir').not().isEmpty(),
    check('IdCondicionPago' ,'Indicar la condición de venta').not().isEmpty(),
    
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
    $response.data = await fichaInspFactModel.create(req.body);
    $response.data = await fichaInspFactModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR HABITACION            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // IdFicha
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await fichaInspFactModel.findOne({
        where : {
            IdFichaInspeccion : req.body.IdFicha,
            Estado : 'Activo'
        }
    });
    // El tipo de pago
    $response.fpago = await tipoPagoModel.findAll({
        order: [
            ['Descripcion', 'ASC']
        ],
    });
    
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR HABITACION            //
//////////////////////////////////////////
router.put('/:uuid', [
    check('IdFichaInspeccion' ,'Debe guardar la ficha de inspección primero').not().isEmpty(),
    check('TipoComprobante' ,'Indicar el tipo de documento a emitir').not().isEmpty(),
    check('IdCondicionPago' ,'Indicar la condición de venta').not().isEmpty(),
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
    //delete req.body.UsuarioMod;
    //delete req.body.anulado_por;
    req.body.UsuarioModificado = $userData.name;

	await fichaInspFactModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    $response.data = await fichaInspFactModel.findOne({
        where : {
            uu_id : req.params.uuid,
            Estado : 'Activo'
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

	await fichaInspFactModel.update({
        estado      : 0,
        UsuarioMod : $anuladoPor
    },{
		where : { 
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    var $dataEntidad = await fichaInspFactModel.findOne({
        where : {
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    
    // obtener los datos
    console.log( $dataEntidad.id_empresa );
    if( $dataEntidad )
    {
        $response.data = await fichaInspFactModel.findAll({
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