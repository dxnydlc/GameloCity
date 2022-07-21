// api_adn_servMedico.js

const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();
// >>>>>>>>>>>>>    SPARKPOST   >>>>>>>>>>>>>
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET);

// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');

// >>>>>>>>>>>>>    NEXMO       >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

// LEER EXCEL
const reader = require('xlsx')

// Modelos
const { solServicioModel, User, archiGoogleModel, sistemasModel } = require('../../db');

// COntrolador
const { permisosController } = require('../../controllers/permisosController');



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/sistemas',async(req,res)=>{ //sistemasModel
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    console.log('listar sistemasModel');
	$response.data = await sistemasModel.findAll({
        order : [
            ['Descripcion' , 'ASC']
        ],
        limit : 200
    });

    res.json( $response );
});

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
	$response.data = await solServicioModel.findAll({
        order : [
            ['Codigo' , 'DESC']
        ],
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
  
    if( req.body.Codigo ){
        // Buscamos por ID
        $where.Codigo = req.body.Codigo;
        //
        $response.data = await adnSolServCabModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        if(req.body.TipoExamen){
            $where.TExamen = { [Op.like] : '%'+req.body.TipoExamen+'%' }
        }

        if(req.body.Proveedor){
            $where.IdProveedor = req.body.Proveedor;
        }
          
        if(req.body.Cliente){
            $where.IdCliente = req.body.Cliente;
        }

        if(req.body.Perfil){
            $where.PerfilEMO = req.body.Perfil;
        }

        if(req.body.Solicitante){
            console.log(req.body);
            $where.IdSolicitante = req.body.Solicitante;
        }
 
        //
       // console.log($where);

        $response.data = await adnSolServCabModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
    }

    
    res.json( $response );
});

//////////////////////////////////////////////////////////
//              BUSCAR APROBADOS EN DOCUMENTO           //
//////////////////////////////////////////////////////////
router.post('/buscarAprobados', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
  
    if( req.body.Codigo ){
        // Buscamos por ID
        $where.Codigo = req.body.Codigo;
        $where.Estado = 'Aprobado';
        //
        $response.data = await adnSolServCabModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        if(req.body.TipoExamen){
            $where.TExamen = { [Op.like] : '%'+req.body.TipoExamen+'%' }
        }

        if(req.body.Proveedor){
            $where.IdProveedor = req.body.Proveedor;
        }
          
        if(req.body.Cliente){
            $where.IdCliente = req.body.Cliente;
        }

        if(req.body.Perfil){
            $where.PerfilEMO = req.body.Perfil;
        }

        if(req.body.Solicitante){
            $where.Solicitante = req.body.Solicitante;
        }
        $where.Estado = 'Aprobado';
       
        $response.data = await adnSolServCabModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
    }

    
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

	$response.data = await adnSolServCabModel.findAll({
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
    check('id_sistema' ,'Seleccione Servicio').not().isEmpty(),
    check('contenido' ,'Agregue contenido').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    
    req.body.id_usuario = $userData.dni;
    req.body.usuario   = $userData.name;
    req.body.id_empresa   = $userData.id_empresa;
    
    await solServicioModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await solServicioModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 6 );
        _Codigo = 'SOLServ'+_Codigo;
        await solServicioModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
    }

    $response.item = await solServicioModel.findOne({
        where : {
            uu_id : req.body.uu_id
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

    $response.data = await solServicioModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//     	OBTENER  IMAGENES DE UN DOCUMENTO    	    //
//////////////////////////////////////////////////////////

router.get('/:token',async(req,res)=>{
	var $response = {};
  $response.estado = 'OK';
 
  const $data = await archiGoogleModel.findAll({
    where : {
      token : req.params.token
    }
  });

  $response.data = $data;
  console.log("$response.data: ");
  console.log($response.data);
  res.json( $response );
});
// -------------------------------------------------------

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
    
	await archiGoogleModel.destroy({
		where : { 
            id : req.params.idImg 
        }
    });
    $response.data = await archiGoogleModel.findAll({
        where : {
            id : req.params.idImg 
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
// -------------------------------------------------------
// -------------------------------------------------------
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


