// api_locales.js

const router = require('express').Router();

const { sucursalModel,User, departamentoModel, provinciaModel, distrito2Model } = require('../../db');

const {check,validationResult} = require('express-validator');


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/:IdCli',async(req,res)=>{ // envía DNI y nombre local
    //IdCli (req.params.IdCli)
    var $IdClienteProv = req.params.IdCli;
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await sucursalModel.findAll({
        where : {
            IdClienteProv : $IdClienteProv ,
            Estado : 1
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/listar/:IdCli',async(req,res)=>{
    //IdCli (req.params.IdCli)
    var $IdClienteProv = req.params.IdCli;

    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await sucursalModel.findAll({
        where : {
            IdClienteProv : $IdClienteProv,
            Estado : 1
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------
router.get('/lista/:IdCli',async(req,res)=>{
    //IdCli (req.params.IdCli)
    var $IdClienteProv = req.params.IdCli;

    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await sucursalModel.findAll({
        where : {
            IdClienteProv : $IdClienteProv,
            Estado : 1
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR LOCAL       			//
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

//    req.body.UsuarioMod = $userData.name;
    var _IdSucursal = await sucursalModel.max('IdSucursal') + 1;
    req.body.IdSucursal = _IdSucursal;

    var _Codigo = await pad_with_zeroes( _IdSucursal , 8 );
    _Codigo = 'LC'+_Codigo;
    req.body.Codigo  = _Codigo;
    
    await sucursalModel.create(req.body)
    .catch(function (err) {
        
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );        
       //console.log(err);
    });


    $response.data = await sucursalModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR LOCAL  con condición //
//////////////////////////////////////////
router.post('/get_tipCliente', async (req,res)=>{
    // IdAlmacen
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    console.log("CARGAR LOCAL  con condición ");
    $response.data = await sucursalModel.findAll({
        where : {
            IdClienteProv : req.body.IdClienteProv
        }
    });
    
    res.json( $response );
});

//////////////////////////////////////////
//          CARGAR HABITACION            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // IdSucursal
    var $response = {};
    $response.depa = [];
    $response.prov = [];
    $response.dist = [];
    //
    $response.estado = 'OK';
    $response.data = [];
    var _IdSucursal = parseInt( req.body.IdSucursal );
    var _Entidad = await sucursalModel.findOne({
        where : {
            IdSucursal : _IdSucursal
        }
    });

    $response.data = _Entidad;
    $response.depa = await departamentoModel.findAll();
    if( _Entidad )
    {
        if( _Entidad.Departamento )
        {
            $response.prov = await provinciaModel.findAll({
                where : {
                    department_id : _Entidad.Departamento
                }
            });
        }
        if( _Entidad.Provincia )
        {
            $response.dist = await distrito2Model.findAll({
                where : {
                    province_id : _Entidad.Provincia
                }
            });
        }
    }
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR HABITACION            //
//////////////////////////////////////////
router.put('/:uu_id', [
    check('Descripcion' ,'El nombre es obligatorio').not().isEmpty(),
], async (req,res)=>{
    // IdLocal
    console.log(req.params);
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
    //req.body.editado_por = $userData.name;

	await sucursalModel.update(req.body,{
		where : { 
            uu_id : req.params.uu_id 
        }
    });
    $response.data = await sucursalModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR Local            //
//////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // IdAlmacen
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    delete req.body.UsuarioMod;
    delete req.body.editado_por;
    req.body.anulado_por = $userData.name;
    //console.log(req.params.uuid);
    $anuladoPor = $userData.name;
    
	await sucursalModel.update({
        Estado      : 0
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    var $dataEntidad = await sucursalModel.findOne({
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
// -------------------------------------------------------
function pad_with_zeroes( number , length )
{
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
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