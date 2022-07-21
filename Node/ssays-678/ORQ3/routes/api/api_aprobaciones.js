// api_almacen.js

const router = require('express').Router();

const { aprobacionesModel,User, tipoDocumentoModel } = require('../../db');

const {check,validationResult} = require('express-validator');




//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    console.log("ORQ3-Listar");
	await aprobacionesModel.findAll({
        order : [
            ['IdAprobar' , 'DESC']
        ],
        limit : 500
    })
    .then(function(item){
        $response.data = item;
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        console.log(err.original.sqlMessage);
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

	await aprobacionesModel.findAll({
        order : [
            ['IdAprobar' , 'DESC']
        ],
        limit : 500
    })
    .then(function(item){
        $response.data = item;
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        console.log(err.original.sqlMessage);
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			FILTRAR LISTA     			//
//////////////////////////////////////////////////////////
router.post('/filtro',async(req,res)=>{
    // TipoDoc, Usuario
    var $response = {}, $where = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

    if( req.body.TipoDoc != '' ){
        $where.IdTipoDoc = req.body.TipoDoc;
    }
    if( req.body.Usuario != '' ){
        $where.IdUser = req.body.Usuario;
    }
	await aprobacionesModel.findAll({
        order : [
            ['IdAprobar' , 'DESC']
        ],
        where : $where,
        limit : 1000
    })
    .then(function(item){
        $response.data = item;
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR APROBACIÓN       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('IdTipoDoc' ,'Seleccione un tipo de documento').not().isEmpty(),
    check('IdUser' ,'Ingrese un usuario').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    
    await aprobacionesModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    console.log("ORQ3-Guardar");
    var _dataGuardado = await aprobacionesModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });


    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.IdAprobar , 8 );
        _Codigo = 'AP'+_Codigo;
        //console.log("holaaaaaaa: "+_Codigo);
        await aprobacionesModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
    }

    $response.item = await aprobacionesModel.findOne({
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
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await aprobacionesModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    console.log("ORQ3-Cargar");
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR             //
//////////////////////////////////////////
router.put('/:uuid', [
    check('IdTipoDoc' ,'Seleccione un tipo de documento').not().isEmpty(),
    check('IdUser' ,'Ingrese un usuario').not().isEmpty(),
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
    delete req.body.IdAprobar;
	await aprobacionesModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    await aprobacionesModel.findOne({
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .then(function(item){
        $response.item = item;
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    // Listado
    console.log("ORQ3-Actualizar");
    await aprobacionesModel.findOne({
        order : [
            ['IdAprobar' , 'DESC']
        ],
        limit : 500
    })
    .then(function(item){
        $response.data = item;
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR HABITACION            //
//////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

  
	await aprobacionesModel.update({
        Estado      : 'Anulado',
       // AnuladoPor  : $anuladoPor
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });

    // obtener los datos
    $response.item = await aprobacionesModel.findOne({
        order : [
            ['IdAprobar' , 'DESC']
        ],
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------
async function captueError( error , post )
{
    var _envio       = JSON.stringify(post);
    var _descripcion = JSON.stringify(error);
    var _uuid = await renovarToken();
    await errorLogModel.create({
        uu_id : _uuid,
        modulo : 'api_reqPersonal',
        descripcion : _descripcion,
        envio : _envio
    })
    .catch(function (err) {
        console.log(_NombreDoc);
        console.log(err);
    });
}
//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // codigo, nroPlaca, custodio, cliente
    console.log("ORQ3-Buscar");
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    
    if( req.body.IdUser != '' ){
        // Buscamos por NOMBRE USUARIO
        $where.IdUser = req.body.IdUser;
        
        //
        $response.data = await aprobacionesModel.findAll({
            order : [
                ['IdAprobar' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por documento
        //console.log('hola: '+req.body.custodio);
        //console.log("buscar: "+req.body.IdTipoDoc);
        if(req.body.IdTipoDoc){
            $where.IdTipoDoc = req.body.IdTipoDoc;
        }
        
        $response.data = await aprobacionesModel.findAll({
            order : [
                ['IdAprobar' , 'DESC']
            ],
            where : $where
        });
        //console.log($where);
    }

    
    res.json( $response );
});
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
async function getListado()
{
    //
    var $data;
    await aprobacionesModel.findAll({
        order : [
            ['IdAprobar' , 'DESC']
        ],
        limit : 500
    })
    .then(function(item){
        $data = item;
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
    });
    return $data;
}
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

module.exports = router;