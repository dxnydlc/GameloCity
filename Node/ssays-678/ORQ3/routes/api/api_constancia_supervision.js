// api_utilidades.js

var _NombreDoc = 'dddddddddddd';
const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();
// >>>>>>>>>>>>>    SPARKPOST   >>>>>>>>>>>>>
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET)
// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');
// >>>>>>>>>>>>>    NEXMO       >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

// Modelos
const { constSuperModel,User, archivoConstSupModel, archiGoogleModel } = require('../../db');



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{ // FUNCION PARA CLIENTE
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    $response.ut = await getUserData( req.headers['api-token'] );
   // console.log('Listar Movilidad');
   $where.estado =  {[Op.or]: ['Aprobado', 'Cerrado']};
	$response.data = await constSuperModel.findAll({
        order : [
            ['id' , 'DESC']
        ],
        where : $where,
        limit : 200
    });

    res.json( $response );

});

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 200     			//
//////////////////////////////////////////////////////////
router.get('/listar/Supervision',async(req,res)=>{ // FUNCIÓN PARA OPERACIONES
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    $response.ut = await getUserData( req.headers['api-token'] );
   // console.log('Listar Movilidad');
   
	$response.data = await constSuperModel.findAll({
        order : [
            ['id' , 'ASC']
        ]
    });

    res.json( $response );

});

// módulo supervisor en node.
//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 200     			// 
//////////////////////////////////////////////////////////
router.get('/supervisor',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    $response.ut = await getUserData( req.headers['api-token'] );
   // console.log('Listar Movilidad');
  // $where.estado =  {[Op.or]: ['Aprobado', 'Cerrado']};
	$response.data = await constSuperModel.findAll({
        order : [
            ['id' , 'DESC']
        ],
        where : $where,
        limit : 200
    });

    res.json( $response );

});

//////////////////////////////////////////////////////////
//     	OBTENER  IMAGENES DE UN DOCUMENTO    	    //
//////////////////////////////////////////////////////////

router.get('/:token',async(req,res)=>{
	var $response = {};
  $response.estado = 'OK';
 
  const $data = await archivoConstSupModel.findAll({
    where : {
      token : req.params.token
    }
  });

  $response.data = $data;
  
  res.json( $response );
});

// -------------------------------------------------------


//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // Código del registro, codigo del cliente, código del local
   
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
   
    if(req.body.id_cliente){
        $where.id_cliente = parseFloat(req.body.id_cliente);
    }
    
    if(req.body.local){
        $where.id_local = req.body.local;
    }

    if(req.body.contacto){
        $where.nombre_contacto_cliente = { [Op.like] : '%'+req.body.contacto+'%' };
    }

        $response.data = await constSuperModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
        //
    
        
            
        //$where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        /*
        $response.data = await constSuperModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
      */
    

    
    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//      			    OBTENER LISTA     			    //
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await constSuperModel.findAll({
        where : {
            Estado : 'Activo'
        },
        order : [
            ['Codigo' , 'DESC']
        ],
        limit : 100
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR DOCUMENTO       			//
//////////////////////////////////////////////////////////
router.post('/', [
    
    check('id_cliente' ,'Ingrese Cliente').not().isEmpty(),
    
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
  
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    //var $FechaMod       =  moment().format('YYYY-MM-DD HH:mm:ss');
    
    req.body.id_adsAcargo = $userData.dni;
    req.body.adsAcargo = $userData.name;
    req.body.estado = 'Digitado';

    req.body.id_usuarioCreador = $userData.dni;
    req.body.usuarioCreador = $userData.name;
    req.body.id_empresa = $userData.id_empresa;
    req.body.empresa = $userData.empresa;
    console.log('req.body');
    console.log(req.body);
    await constSuperModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    var _dataGuardado = await constSuperModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
  
    if( _dataGuardado ){
        var _correlativo = _dataGuardado.id;
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 8 );
        _Codigo = 'CSup'+_Codigo;
        await constSuperModel.update({
            Codigo : _Codigo,
            correlativo : _correlativo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
    }

    $response.item = await constSuperModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	await archivoConstSupModel.update({
        correlativo      : $response.item.id
        
    },{
		where : { 
            token : req.body.uu_id
        }
    });

	res.json( $response );
  
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
   
    $response.data = await constSuperModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
 
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('id_cliente' ,'Ingrese Cliente').not().isEmpty(),
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

    req.body.id_usuarioCreador = $userData.dni;
    req.body.usuarioCreador = $userData.name;
    req.body.id_empresa = $userData.id_empresa;
    req.body.empresa = $userData.empresa;

	await constSuperModel.update(req.body,{
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
    
    $response.item = await constSuperModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    res.json( $response );
});

//////////////////////////////////////////////////////////
// ACTUALIZAR DOCUMENTO FIRMA, PUNTAJE Y OBSERVACIÓN    //
//////////////////////////////////////////////////////////
router.put('/firmapo/:uuid', [
    check('puntuaje' ,'Ingrese Puntaje').not().isEmpty(),
    check('obs_complementarias' ,'Ingrese Observaciones').not().isEmpty()
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

    req.body.id_usuarioCreador = $userData.dni;
    req.body.usuarioCreador = $userData.name;
    req.body.id_empresa = $userData.id_empresa;
    req.body.empresa = $userData.empresa;
	await constSuperModel.update(req.body,{
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
    
    $response.item = await constSuperModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELIMINAR DOCUMENTO                  //
//////////////////////////////////////////////////////////
router.delete('/anular/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    //req.body.DNIAnulado = $userData.dni;
   // req.body.AnuladoPor = $userData.name;

    $anuladoPor = $userData.name;
 
	await constSuperModel.update({
        estado      : 'Anulado',
        
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await constSuperModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
//////////////////////////////////////////////////////////
//                  APROBAR DOCUMENTO                   //
//////////////////////////////////////////////////////////
router.post('/aprobar', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var $userData = await getUserData( req.headers['api-token'] );
    var $FechaMod           =  moment().format('YYYY-MM-DD HH:mm:ss');
   
    await constSuperModel.update({
        IdUsuarioMod: $userData.dni,
        UsuarioMod  : $userData.name,
        FechaMod    : $FechaMod,
        Estado      : 'Aprobado',

    },{
        where : {
            uu_id : req.body.uuid
        }
    });
  
    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                   BORRAR ADJUNTO                     //
//////////////////////////////////////////////////////////
router.delete('/:idImg', async (req,res)=>{
    // uuid es el padre , token es el hijo
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );
    
	await archivoConstSupModel.destroy({
		where : { 
            id : req.params.idImg 
        }
    });
    $response.data = await archivoConstSupModel.findAll({
        where : {
            id : req.params.idImg 
        }
    });
    res.json( $response );
});
// -------------------------------------------------------
/*
// BORRAR ADJUNTO 
    router.post('/del_file', async (req,res)=>{
    // uuid

   
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _Editad = await archiGoogleModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
   
    if( _Editad ){
        await archiGoogleModel.destroy({
            where : {
                uu_id : req.body.uuid
            }
        });
    }
  
    res.json( $response );
});
*/
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
async function renovarToken()
{
    var length = 25;
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