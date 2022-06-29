// api_personalOS.js

const router = require('express').Router();

const { personal_otModel,User } = require('../../db');

const {check,validationResult} = require('express-validator');

const { Op } = require("sequelize");


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100  Funciona Ok   			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    console.log('funciona');
	$response.data = await personal_otModel.findAll({
        order : [
            ['IdPersonalOT' , 'DESC']
        ],
        limit : 10
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
        $where.IdPersonalOS = req.body.id;
        //
        $response.data = await personalOSModel.findAll({
            order : [
                ['IdPersonalOS' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        $where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        $response.data = await personalOSModel.findAll({
            order : [
                ['IdPersonalOS' , 'DESC']
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
/*
router.get('/lista/:IdOS/:token',async(req,res)=>{
    var $response    = {};
    $response.estado = 'OK';
    $response.data   = [];
    $response.ut     = await getUserData( req.headers['api-token'] );

    var IdOS = parseInt( req.params.IdOS ), token = req.params.token;

    if( IdOS > 0 ){
        $response.data = await personalOSModel.findAll({
            where : {
                IdOS : IdOS
            },
            order : [
                ['Personal' , 'DESC']
            ]
        });
    }else{
        $response.data = await personalOSModel.findAll({
            where : {
                C010 : token
            },
            order : [
                ['Personal' , 'DESC']
            ]
        });
    }
        

    res.json( $response );
});
*/
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR CLASE Funciona ok			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('Anexo' ,'Ingrese Anexo').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	console.log('Agregar personal_otModel');
    console.log(req.body);
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    req.body.uu_id = await renovarToken();
    // Existe el personal en la lista de esta OS??
    var Exsite = await personal_otModel.findOne({
        where : {
            IdOT : req.body.IdOT,
            IdEmp : req.body.IdEmp,
        }
    });
    if( Exsite ){
        return res.status(200).json({ estado : 'ERROR',error:'El personal ya está asignado.' });
    }
    //
    $response.data = await personal_otModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await personal_otModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    $response.data = await personal_otModel.findAll({
        order : [
            ['IdPersonalOT' , 'DESC']
        ]
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR CLASE   FUnciona OK  //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    console.log('get_data');
    console.log(req.body);
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    
    $response.data = await personal_otModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
  
    res.json( $response );
});

// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR CLASE funciona ok   //
//////////////////////////////////////////
router.put('/:uuid', [
    check('Anexo' ,'El Anexo es obligatorio').not().isEmpty(),
], async (req,res)=>{
    // uuid
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    console.log('actualizar');
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

	await personal_otModel.update(req.body,{
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
    
    $response.item = await personal_otModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await personal_otModel.findAll({
        order : [
            ['IdPersonalOT' , 'DESC']
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

	await personal_otModel.destroy({
		where : { 
            uu_id : req.params.uuid 
        }
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