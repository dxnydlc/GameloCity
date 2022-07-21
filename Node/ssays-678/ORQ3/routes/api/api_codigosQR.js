var _NombreDoc = 'api_codigosQR';
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

var _LogoSSAYS = 'https://api2.ssays-orquesta.com/logo-ssays-2019-2.png';



// Modelos
const { archivoCodigoQRModel, codigosQRCabModel, codigosQRDetModel, archiGoogleModel, User } = require('../../db');

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
codigosQRCabModel.belongsTo(codigosQRDetModel,{
	as : 'Detalle', foreignKey 	: 'Codigo',targetKey: 'CodigoHead',
});

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			// 
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await codigosQRCabModel.findAll({
        order : [
            ['Codigo' , 'DESC']
        ],/*
        where:{
             [Op.or]: [{Estado: 'Activo'}, {Estado: 'Aprobado'}, {Estado: 'Anulado'}]
        },
        */
        limit : 200
    });

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
    
    if( req.body.Codigo ){
        // Buscamos por ID
        $where.Codigo = req.body.Codigo;
        //
        $response.data = await codigosQRCabModel.findOne({           
            where : $where
        });
      
        $response.item = await archivoCodigoQRModel.findAll({
            where : {
                token : $response.data.uu_id 
            }
        });
        //
    }

    
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
    
	await archivoCodigoQRModel.destroy({
		where : { 
            id : req.params.idImg 
        }
    });
    $response.data = await archivoCodigoQRModel.findAll({
        where : {
            id : req.params.idImg 
        }
    });
    res.json( $response );
});
// -------------------------------------------------------
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                   BORRAR ADJUNTO NODE                //
//////////////////////////////////////////////////////////
router.delete('/:idImg_/:token', async (req,res)=>{
    // uuid es el padre , token es el hijo
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );
 
	await archiGoogleModel.destroy({
		where : { 
            id : req.params.idImg_ 
        }
    });
    $response.data = await archiGoogleModel.findAll({
        where : {
            token : req.params.token 
        }
    });
   
    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//        BUSCAR EN DOCUMENTO PRINCIPAL CODIGO QR       //
//////////////////////////////////////////////////////////
router.post('/buscar/cod_qr', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    
    if( req.body.Codigo ){
        // Buscamos por ID
        $where.Codigo = req.body.Codigo;
        //
        $response.data = await codigosQRCabModel.findAll({           
            where : $where
        });
      
    }else{
        $response.data = await codigosQRCabModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ]
        });
    }

    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELIMINAR DOCUMENTO                  //
//////////////////////////////////////////////////////////
router.delete('/:id/:uuid', async (req,res)=>{
    // uuid
  
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );
    
	await codigosQRCabModel.update({
        Estado      : 'Anulado'
    },{
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
router.delete('/del_documento/:id/:uuid', async (req,res)=>{
    // uuid
    
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );
    
	await codigosQRCabModel.update({
        Estado      : 'Anulado'
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('Nombre' ,'Ingresar Nombre del Producto').not().isEmpty(),
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
  
    delete req.body.id;
	await codigosQRCabModel.update(req.body,{
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
    
    $response.item = await codigosQRCabModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});

// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/update_producto/:uuid', [
    check('Nombre' ,'Ingrese Producto').not().isEmpty(),
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
    
    delete req.body.id;
	await codigosQRDetModel.update(req.body,{
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
    
    $response.data = await codigosQRDetModel.findAll({
        where : {
            Token : req.body.Token,
            Estado : 'Activo'
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR 2 DOCUMENTO       			//
//////////////////////////////////////////////////////////

router.post('/add/producto', [
    check('IdProducto' ,'Seleccionar Producto').not().isEmpty()
], async (req,res)=>{   
	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });	}

	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
 
    $response.data = await codigosQRCabModel.findOne({
        where : {
            uu_id : req.body.Token
        }
    });
  
    if($response.data){
        var CodHeader = $response.data.Codigo;
    }else{
        CodHeader = '-';
    }
    await codigosQRDetModel.create({
        Estado : req.body.Estado,
        uu_id : req.body.uu_id,
        Token : req.body.Token,
        IdProducto : req.body.IdProducto,
        Nombre : req.body.Nombre,
        CodigoHead : CodHeader
        
    } )
    .catch(function (err){
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
        //console.log(err);
    });


    $response.data = await codigosQRDetModel.findAll({
        where : {
            Token : req.body.Token,
            Estado : 'Activo'
        }
    });
    
	res.json( $response );
});
// ------------------------------------------------------- , 
//////////////////////////////////////////////////////////
//      			AGREGAR DOCUMENTO       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('Nombre' ,'Ingresar Nombre del Producto').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    
    delete req.body.tblOperarios_length;
     
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.IdSolicitante = $userData.dni;
    req.body.Solicitante   = $userData.name;
    req.body.Estado = 'Activo';
 
    await codigosQRCabModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await codigosQRCabModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 6 );
        _Codigo = 'CODQR'+_Codigo;
        await codigosQRCabModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
        // Unir con detalle
        await codigosQRDetModel.update({
            CodigoHead : _Codigo,
        },{
            where : { Token : req.body.uu_id }
        });
    }

    $response.item = await codigosQRCabModel.findOne({
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
    $response.data = [], $response.locales = [];
    
    var _Item = await codigosQRCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.item = _Item;
    if( _Item ){
        $response.data = await codigosQRDetModel.findAll({
            where : {
                CodigoHead : _Item.Codigo,
                Estado      : 'Activo'
            }
        });
     
    }
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR archivo                    //
//////////////////////////////////////////////////////////
router.post('/get_files', async (req,res)=>{
    // token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [], $response.locales = [];
  
    var _Item = await archiGoogleModel.findAll({
        where : {
            token : req.body.token
        }
    });
   
    $response.data = _Item;
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR PACIENTE                     //
//////////////////////////////////////////////////////////
router.post('/producto/get', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    
    $response.item = await codigosQRDetModel.findOne({
        where : {
            id : req.body.id
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
 
  const $data = await archivoCodigoQRModel.findAll({
    where : {
      token : req.params.token
    }
  });

  $response.data = $data;
  
  res.json( $response );
});

// -------------------------------------------------------
//////////////////////////////////////////////////////////
//     	OBTENER  IMAGENES DE UN DOCUMENTO NODE   	    //
//////////////////////////////////////////////////////////

router.get('/:token_22/mostrar',async(req,res)=>{
	var $response = {};
  $response.estado = 'OK';
   
    $response.data = await archiGoogleModel.findAll({
        where : {
            token : req.params.token_22 
        }
    });
  
    res.json( $response );

});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//            ELIMINAR DOCUMENTO PERSONAL               //
//////////////////////////////////////////////////////////
router.delete('/del_producto/:id/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );
    
	await codigosQRDetModel.update({
        Estado      : 'Anulado'
    },{
		where : { 
            id : req.params.id 
        }
    });
    $response.data = await codigosQRDetModel.findAll({
        where : {
            Token : req.params.uuid,
            Estado : 'Activo'
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
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular','sucursal', 'nombre_local', 'cliente','nombre_cliente'],
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
async function enviarMensaje( data )
{
    // Los Supervisores asignados a este cliente...
    var _dataSuper = await usuariosClienteModel.findAll({
        where :{
            id_cliente : data.IdCliente ,
            id_local   : data.IdLocal
        }
    });
    //
    varDump(`INCIDENCIA-Usuarios en => ${data.IdCliente}, Local => ${data.IdLocal}.`);
    //
    if( _dataSuper )
    {
        varDump(`Existe supervisor para ese cliente/local`)
        // Ahora los datos del supervisor
        for (let index = 0; index < _dataSuper.length; index++) {
            const rsI = _dataSuper[index];
            var _DataUser = await User.findOne({
                where : {
                    dni : rsI.id_usuario
                }
            });
            if( _DataUser )
            {
                var _Celular = _DataUser.celular
                // Enviar mensaje...
                if( _Celular )
                {
                    var $celular = _Celular;
                    if( $celular.length == 9 )
                    {
                        var to   = '51'+$celular;
                        // Enviar WhatsApp
                        console.log(`WhatsApp a: ${_DataUser.Nombre}-${_DataUser.DNI}_`);
var texto1 = `
Orquesta - Oper.Limpieza,
Hola *${_DataUser.name}*, Se ha reportado una incidencia Nro. *${data.Codigo}* en, *${data.Cliente}* / *${data.Local}*, Título: *${data.Asunto}*, por favor ingrese al sistema para revisar la incidencia.
`;
                        // Enviando texto
                        await apiChatApi( 'message', { phone : to , body: texto1 });
                        // Enviando logo ssays
                        //await apiChatApi( 'sendFile', { phone : to , body: _LogoSSAYS , filename : 'logo SSAYS' });
                        
                        var _Resultado = 'Enviado Celular '+$celular;
                        // --------------------------------
                        // --------------------------------
                        console.log(`Enviando a WhatsApp ${to}`);
                    }
                }
            }
        }
        
    }
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
// -------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// -------------------------------------------------------
async function apiChatApi( method , params ){
    const options = {};
    options['method'] = "POST";
    if( params != '' ){
        options['body'] = JSON.stringify(params);
    }
    options['headers'] = { 'Content-Type': 'application/json' };
    
    const url = `${apiUrlWS}/${method}?token=${tokenWS}`; 
    
    const apiResponse = await fetch(url, options);
    const jsonResponse = await apiResponse.json();
    return jsonResponse;
}
// -------------------------------------------------------
async function apiChatApiGET( method , params ){
    const options = {};
    options['method'] = "GET";
    if( params != '' ){
        options['body'] = JSON.stringify(params);
    }
    options['headers'] = { 'Content-Type': 'application/json' };
    
    const url = `${apiUrlWS}${method}?token=${tokenWS}`; 
    
    const apiResponse = await fetch(url, options);
    console.log(apiResponse);
    const jsonResponse = await apiResponse.json();
    return jsonResponse;
}
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
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
module.exports = router;
// -------------------------------------------------------