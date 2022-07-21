// api_numRechazados.js

const router = require('express').Router();

const { numRechazadosModel,User } = require('../../db');
const { errorLogModel } = require('../../dbA');
const { Op } = require("sequelize");
const {check,validationResult} = require('express-validator');


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/listas',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
   console.log('listar');
	$response.data = await numRechazadosModel.findAll({});
  
    res.json( $response );
});

//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    console.log('Buscar: ');
    console.log('req.body.celular: ');
    console.log(req.body.celular);
    if( req.body.celular){
        // Buscamos por ID
        $where.celular = { [Op.like] : '%'+req.body.celular+'%' }
        //
        $response.data = await numRechazadosModel.findAll({
            where : $where
        });
        //
    }

    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR DOCUMENTO       			//
//////////////////////////////////////////////////////////
router.post('/',async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    //
    req.body.Estado = 'Activo';
    await numRechazadosModel.create(req.body)
    .catch(function (err) {
       
        captueError( err.original , req.body );
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await numRechazadosModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    
    if( _dataGuardado )
    {
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 6 );
        _Codigo = 'NR'+_Codigo;
        console.log('_Codigo: '+_Codigo);
        await numRechazadosModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        })
        .catch(function (err) {
            captueError( err.original , req.body );
          
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
    }
    $response.item = await numRechazadosModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // IdAlmacen
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.data = await numRechazadosModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
   
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', async (req,res)=>{
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


	await numRechazadosModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
	    
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    $response.item = await numRechazadosModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELIMINAR DOCUMENTO                  //
//////////////////////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{

    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );
  
	await numRechazadosModel.update({
        Estado      : 'Anulado'
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });

    $response.item = await numRechazadosModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });
    
    res.json( $response );

/*
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );


    // Auditoria


	await tipoDocumentoModel.destroy({
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    
    $response.item = await tipoDocumentoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });
*/
  
});
// -------------------------------------------------------
async function renovarToken()
{
    var length = 40;
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

module.exports = router;