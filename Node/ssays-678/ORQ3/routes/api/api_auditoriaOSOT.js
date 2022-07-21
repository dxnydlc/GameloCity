// api_auditoriaOSOT.js


const router = require('express').Router();

const { audioriaOSOTModel,User } = require('../../db');

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

	$response.data = await audioriaOSOTModel.findAll({
        order : [
            ['id' , 'DESC']
        ],
        limit: 10
    });

    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//                      BUSCAR CLASE                    //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};

    if( req.body.id != '' ){
        // Buscamos por ID
        $where.id = req.body.id;
        //
        $response.data = await audioriaOSOTModel.findAll({
            order : [
                ['id' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        $where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        $response.data = await audioriaOSOTModel.findAll({
            order : [
                ['id' , 'DESC']
            ],
            where : $where
        });
    }

    
    res.json( $response );
});
// ---------------------------------------


//////////////////////////////////////////////////////////
//      			    OBTENER LISTA     			    //
//////////////////////////////////////////////////////////
router.get('/lista/:TDoc/:Id',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await audioriaOSOTModel.findAll({
        where : {
            TipoDoc     : req.params.TDoc,
            Correlativo : req.params.Id
        },
        order : [
            ['FechaMod' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			    AGREGAR CLASE       			//
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
    var id = await audioriaOSOTModel.max('id') + 1;
    req.body.id = id;
    //
    $response.data = await audioriaOSOTModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await audioriaOSOTModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    $response.data = await audioriaOSOTModel.findAll({
        order : [
            ['id' , 'DESC']
        ]
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                      CARGAR CLASE            //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await audioriaOSOTModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////////////////////
//                      ACTUALIZAR CLASE          //
//////////////////////////////////////////////////////////
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

	await audioriaOSOTModel.update(req.body,{
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
    
    $response.item = await audioriaOSOTModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await audioriaOSOTModel.findAll({
        order : [
            ['id' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELIMINAR CLASE            //
//////////////////////////////////////////////////////////
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

	await audioriaOSOTModel.update({
        Estado      : 0,
        UsuarioMod  : $userData.dni,
        nombre_usuario  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await audioriaOSOTModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await audioriaOSOTModel.findAll({
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
// -------------------------------------------------------

module.exports = router;
