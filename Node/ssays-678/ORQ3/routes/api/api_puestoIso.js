// api_puestoIso.js

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
const { puestoIsoModel, User, areaModel } = require('../../db');

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
puestoIsoModel.belongsTo( areaModel ,{
	as : 'DetArea1', foreignKey 	: 'IdArea',targetKey: 'CodArea',
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 



//////////////////////////////////////////////////////////
//            OBTENER LOS PUESTOS ISO DE UN AREA 	    //
//////////////////////////////////////////////////////////
router.get('/get/:IdArea',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.data = [];
    //var $where = {};
   
   /* $where.IdArea = req.params.IdArea
    console.log('holaaaaaaaaaaaaaaa');
    $response.data = await puestoIsoModel.findAll({
        where : $where,
        order : [
            [ 'Descripcion' , 'ASC' ]
        ]
    });
*/
    $response.data = await puestoIsoModel.findAll({
        where : {
            Estado : 1,
            IdArea : req.params.IdArea
        },
        order : [
            ['Descripcion' , 'DESC']
        ]
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await puestoIsoModel.findAll({
        order : [
            ['Codigo' , 'DESC']
        ],
        limit : 200,
        include: [{
            model: areaModel,
            as: 'DetArea1'
        }]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // IdArea, descripción
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    
    if( req.body.IdArea != '' ){
        // Buscamos por ID
        $where.IdArea = req.body.IdArea;
        //
    }else{
        // Buscamos por nombre
        $where.Descripcion = { [Op.like] : '%'+req.body.Descripcion+'%' }
        //
    }
    //
    $response.data = await puestoIsoModel.findAll({
        order : [
            ['Descripcion' , 'DESC']
        ],
        where : $where,
        include: [{
            model: areaModel,
            as: 'DetArea1'
        }]
    });

    
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

	$response.data = await puestoIsoModel.findAll({
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
// -------------------- -----------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR DOCUMENTO       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('IdArea' ,'Seleccione un área').not().isEmpty(),
    check('Descripcion' ,'Ingrese un nombre').not().isEmpty(),
    check('FormReq' ,'Ingrese requisitos').not().isEmpty(),
    check('ExpReq' ,'Ingrese expreriencia').not().isEmpty(),
    check('Educacion' ,'Ingrese educación').not().isEmpty(),
    check('Habilidad' ,'Ingrese habilidades').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    // Maximo ID
    var _IdArea = await puestoIsoModel.max('idPuestoIso') + 1;
    //var _Codigo = await pad_with_zeroes( _IdArea , 5 );
    //_Codigo = 'PI'+_Codigo;
    //req.body.Codigo  = _Codigo;
    req.body.idPuestoIso = _IdArea;
    //console.log(req.body.Codigo);
    //
    await puestoIsoModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    var _dataGuardado = await puestoIsoModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });


    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 8 );
        _Codigo = 'PI'+_Codigo;
        //console.log("holaaaaaaa: "+_Codigo);
        await puestoIsoModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
    }

    $response.item = await puestoIsoModel.findOne({
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

    $response.data = await puestoIsoModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

// Usuarios por puesto ISO. [ idPuesto ]
//////////////////////////////////////////////////////////
//                  USUARIOS POR PUESTO ISO             //
//////////////////////////////////////////////////////////
router.post('/usuarios_by_puesto', async (req,res)=>{
    // idPuesto
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _dataUsuarios = await User.findOne({
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular'],
        where : {
            idPuestoiso : req.body.idPuesto,
            estado : { [Op.ne] : 0 }
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
   
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
    console.log("actualizar");
    delete req.body.id;
	await puestoIsoModel.update(req.body,{
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
    
    $response.item = await puestoIsoModel.findOne({
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
    
	await puestoIsoModel.update({
        Estado      : 0, // 0: Activo; 1: Anulado
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await puestoIsoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });
    console.log($response);
    res.json( $response );
});
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