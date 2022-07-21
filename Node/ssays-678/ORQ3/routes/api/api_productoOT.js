// api_productoOS

const router = require('express').Router();

const { productosOTModel, User } = require('../../db');

const {check,validationResult} = require('express-validator');

const { Op } = require("sequelize");


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100  FUNCIONA OK   			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    
	$response.data = await productosOTModel.findAll({
        order : [
            ['IDProductoOT' , 'DESC']
        ],
        limit : 10
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			    OBTENER LISTA     			    //
//////////////////////////////////////////////////////////
/*router.get('/lista/:IdOS/:token',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

    var IdOS = parseInt( req.params.IdOS ), token = req.params.token;

    if( IdOS > 0 )
    {
        $response.data = await productosOSModel.findAll({
            where : {
                IdOS : IdOS,
                TipoDetalle : 'PRODUCTOS'
            },
            order : [
                ['IDProductoOS' , 'DESC']
            ]
        });
    }else{
        $response.data = await productosOSModel.findAll({
            where : {
                C010 : token,
                TipoDetalle : 'PRODUCTOS'
            },
            order : [
                ['IDProductoOS' , 'DESC']
            ]
        });
    }


    res.json( $response );
});
*/
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//      			    AGREGAR CLASE    Funciona OK   			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('producto' ,'El nombre es obligatorio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
    console.log('Registrar producto');
	console.log(req.body);
	
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    //req.body.UsuarioMod     = $userData.dni;
    //req.body.nombre_usuario = $userData.name;
    var IDProductoOT = await productosOTModel.max('IDProductoOT') + 1;
    req.body.IDProductoOT = IDProductoOT;
    //
    $response.data = await productosOTModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await productosOTModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    $response.data = await productosOTModel.findAll({
        order : [
            ['IDProductoOT' , 'DESC']
        ]
    });

	res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//                      CARGAR CLASE  Funciona OK       //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    console.log('get_data');
    console.log(req.body);
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    
    $response.data = await productosOTModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
  
    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//                      ACTUALIZAR CLASE  Funciona OK   //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('producto' ,'El nombre es obligatorio').not().isEmpty(),
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

    var IDProductoOT = await productosOTModel.max('IDProductoOT') + 1;
    req.body.IDProductoOT = IDProductoOT;

	await productosOTModel.update(req.body,{
		where : { 
            uu_id : req.body.uu_id 
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    $response.item = await productosOTModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//                      ELIMINAR CLASE  Funciona OK     //
//////////////////////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioMod     = $userData.dni;
    req.body.nombre_usuario = $userData.name;

    console.log(req.body);
    await productosOTModel.destroy({
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
// -------------------------------------------------------

module.exports = router;