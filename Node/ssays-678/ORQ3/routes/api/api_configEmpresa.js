
// api_configEmpresa.js

const router = require('express').Router();

const { configEmpresa,User } = require('../../db');

const {check,validationResult} = require('express-validator');


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await configEmpresa.findAll({
        order : [
            ['id' , 'DESC']
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

	$response.data = await configEmpresa.findAll({
        where : {
            estado : 1
        },
        order : [
            ['id' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//              AGREGAR CONFIG          //
//////////////////////////////////////////
router.post('/', [
    check('id_empresa' ,'Seleccione una empresa').not().isEmpty(),
    check('tipo_doc' ,'Seleccione el tipo documento es obligatorio').not().isEmpty()
] ,async (req,res)=>{
    //
	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioCreado = $userData.name;
    $response.data = await configEmpresa.create(req.body);
    $response.data = await configEmpresa.findAll({
        order : [
            ['id' , 'DESC']
        ]
    });
    //
    res.json( $response );
    //
});
// -------------------------------------------------------

//////////////////////////////////////////
//             CARGAR CONFIG            //
//////////////////////////////////////////
router.post('/get_cierre', async (req,res)=>{
    // Tipo
    var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';
    $response.data = [];

    $response.data = await configEmpresa.findOne({
        where : {
            tipo_doc : req.body.Tipo
        }
    });
    if( $response.data ){
        $response.encontrado = 'SI';
    }
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//          ACTUALIZAR CONFIG           //
//////////////////////////////////////////
router.put('/:uuid', [
    check('id_empresa' ,'Seleccione una empresa').not().isEmpty(),
    check('tipo_doc' ,'Seleccione el tipo documento es obligatorio').not().isEmpty()
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

	await configEmpresa.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    $response.data = await configEmpresa.findAll({
        order : [
            ['id' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//           ELIMINAR CONFIG            //
//////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    // delete req.body.UsuarioModificado;
    // delete req.body.UsuarioCreado;
    req.body.UsuarioAnulado = $userData.name;

    $anuladoPor = $userData.name;

	await configEmpresa.update({
        estado      : 'Anulado',
        UsuarioAnulado : $anuladoPor
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    var $dataEntidad = await configEmpresa.findOne({
        where : {
            uu_id : req.params.uuid 
        }
    });
    
    // obtener los datos
    if( $dataEntidad )
    {
        $response.data = await configEmpresa.findAll({
            order : [
                ['id' , 'DESC']
            ]
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