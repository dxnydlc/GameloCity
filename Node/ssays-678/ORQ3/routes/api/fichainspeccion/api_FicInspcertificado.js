// api_FicInspcertificado.js

const router = require('express').Router();

const { fichaInspCertModel,User } = require('../../../db');

const {check,validationResult} = require('express-validator');


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await fichaInspCertModel.findAll({
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

	$response.data = await fichaInspCertModel.findAll({
        where : {
            Estado : 'Activo'
        },
        order : [
            ['Descripcion' , 'ASC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			    AGREGAR CERT          			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('Requiere' ,'Indicar si se requiere certificado o no').not().isEmpty(),
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
    $response.data = await fichaInspCertModel.create(req.body);
    $response.data = await fichaInspCertModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR CERTIFICADO          //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // IdFicha
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await fichaInspCertModel.findOne({
        where : {
            IdFichaInspeccion : req.body.IdFicha,
            Estado : 'Activo'
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR CERTIFICADO            //
//////////////////////////////////////////
router.put('/:uuid', [
    check('Requiere' ,'Indicar si se requiere certificado o no').not().isEmpty(),
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
    //delete req.body.anulado_por;
    req.body.UsuarioModificado = $userData.name;

	await fichaInspCertModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    $response.data = await fichaInspCertModel.findOne({
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

	await fichaInspCertModel.update({
        estado      : 0,
        UsuarioMod : $anuladoPor
    },{
		where : { 
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    var $dataEntidad = await fichaInspCertModel.findOne({
        where : {
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    
    // obtener los datos
    console.log( $dataEntidad.id_empresa );
    if( $dataEntidad )
    {
        $response.data = await fichaInspCertModel.findAll({
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