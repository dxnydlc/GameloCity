// api_almacen.js

const router = require('express').Router();

const { almacenModel,User,provinciaModel,distrito2Model } = require('../../db');

const {check,validationResult} = require('express-validator');


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await almacenModel.findAll({
        order : [
            ['IdAlmacen' , 'DESC']
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

	$response.data = await almacenModel.findAll({
        where : {
            Estado : 1
        },
        order : [
            ['Descripcion' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//      			AGREGAR ALMACEN       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('Descripcion' ,'El nombre es obligatorio').not().isEmpty(),
    check('Direccion' ,'La dirección es obligatoria').not().isEmpty(),
    check('Pais' ,'seleccione un país').not().isEmpty(),
    check('Departamento' ,'Seleccione un departamento').not().isEmpty(),
    check('Provincia' ,'Seleccione una provincia').not().isEmpty(),
    check('Distrito' ,'Seleccione un distrito').not().isEmpty(),
] ,async ( req , res )=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioMod = $userData.name;

    var IdAlmacen = await almacenModel.max('IdAlmacen') + 1;
    req.body.IdAlmacen = IdAlmacen;
    await almacenModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await almacenModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    $response.data = await almacenModel.findAll({
        order : [
            ['IdAlmacen' , 'DESC']
        ]
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR ALMACEN            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.dist = [];
    $response.prov = [];

    $response.data = await almacenModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    if( $response.data )
    {
            // Provincias
            if( $response.data.Departamento != null ){
                $response.prov = await provinciaModel.findAll({
                    where : {
                        department_id : $response.data.Departamento
                    }
                });
            }
            
            // Distrito de la provincia
            if( $response.data.Provincia != null )
            {
                $response.dist = await distrito2Model.findAll({
                    where : {
                        province_id : $response.data.Provincia
                    }
                });
            }
    }
    
    
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR ALMACEN            //
//////////////////////////////////////////
router.put('/:uuid', [
    check('Descripcion' ,'El nombre es obligatorio').not().isEmpty(),
    check('Direccion' ,'La dirección es obligatoria').not().isEmpty(),
    check('Pais' ,'seleccione un país').not().isEmpty(),
    check('Departamento' ,'Seleccione un departamento').not().isEmpty(),
    check('Provincia' ,'Seleccione una provincia').not().isEmpty(),
    check('Distrito' ,'Seleccione un distrito').not().isEmpty(),
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
    req.body.UsuarioMod = $userData.name;

	await almacenModel.update(req.body,{
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
    
    $response.item = await almacenModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await almacenModel.findAll({
        order : [
            ['IdAlmacen' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR ALMACEN            //
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
    req.body.UsuarioMod = $userData.name;

    $anuladoPor = $userData.name;

	await almacenModel.update({
        Estado      : 0,
        UsuarioMod  : $userData.name
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await almacenModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await almacenModel.findAll({
        order : [
            ['IdAlmacen' , 'DESC']
        ]
    });
    
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