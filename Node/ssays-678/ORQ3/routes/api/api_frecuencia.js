// api_frecuencia.js

const router = require('express').Router();

const { frecuenciaModel,User } = require('../../db');

const {check,validationResult} = require('express-validator');


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await frecuenciaModel.findAll({
        order : [
            ['Descripcion' , 'ASC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER LISTA     			//
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{

    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];

    try {
        //
        var _dataE = await frecuenciaModel.findAll({
            order : [
                ['Descripcion' , 'DESC']
            ]
        })
        .catch(function (err) {
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        _response.data = _dataE;
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se cargaron los datos del documento.` };
        //
    } catch (error) {
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }
    //
    return res.status(_response.codigo).json( _response );
    //
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR ALMACEN       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('nombre' ,'El nombre es obligatorio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioMod = $userData.name;
    $response.data = await frecuenciaModel.create(req.body);
    $response.data = await frecuenciaModel.findOne({
        where : {
            IdAlmacen : req.body.IdAlmacen
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR HABITACION            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // IdAlmacen
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await frecuenciaModel.findOne({
        where : {
            IdAlmacen : req.body.IdAlmacen
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR HABITACION            //
//////////////////////////////////////////
router.put('/:IdAlmacen', [
    check('id_ambiente' ,'Seleccione un ambiente').not().isEmpty(),
    check('nombre' ,'El nombre es obligatorio').not().isEmpty(),
], async (req,res)=>{
    // IdAlmacen
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Auditoria
    delete req.body.UsuarioMod;
    delete req.body.anulado_por;
    req.body.editado_por = $userData.name;

	await frecuenciaModel.update(req.body,{
		where : { 
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    $response.data = await frecuenciaModel.findOne({
        where : {
            IdAlmacen : req.body.IdAlmacen
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

	await frecuenciaModel.update({
        estado      : 0,
        UsuarioMod : $anuladoPor
    },{
		where : { 
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    var $dataEntidad = await frecuenciaModel.findOne({
        where : {
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    
    // obtener los datos
    console.log( $dataEntidad.id_empresa );
    if( $dataEntidad )
    {
        $response.data = await frecuenciaModel.findAll({
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