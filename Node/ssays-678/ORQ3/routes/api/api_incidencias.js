
// api_incidencias.js

var _NombreDoc = 'api_incidencias';
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


// WHATSAPP
const config = require("./whatsapp.js");
const tokenWS = config.token, apiUrlWS = config.apiUrl;
const fetch = require('node-fetch');
var _LogoSSAYS = 'https://api2.ssays-orquesta.com/logo-ssays-2019-2.png';



// Modelos
const { incidenciasModel, archiGoogleModel, User, usuariosClienteModel, incidenciaComentarioModel, errorLogModel } = require('../../db');



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    $response.ut = await getUserData( req.headers['api-token'] );
    $where.idCliente = $response.ut.cliente;
	$response.data = await incidenciasModel.findAll({
        order : [
            ['id' , 'DESC']
        ],
        where : $where,
        limit : 200
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      	OBTENER ULTIMOS 100 | OPERACIONES           //
//////////////////////////////////////////////////////////
router.get('/operaciones',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    $response.ut = await getUserData( req.headers['api-token'] );
    $where.idCliente = $response.ut.cliente;
	$response.data = await incidenciasModel.findAll({
        order : [
            ['id' , 'DESC']
        ],
        limit : 200
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          BUSCAR CLASE            //
//////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};

    if( req.body.id != '' ){
        // Buscamos por ID
        $where.id = req.body.id;
        //
        $response.data = await incidenciasModel.findAll({
            order : [
                ['id' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        $where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        $response.data = await incidenciasModel.findAll({
            order : [
                ['id' , 'DESC']
            ],
            where : $where
        });
    }

    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER LISTA     			//
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await incidenciasModel.findAll({
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
//      			AGREGAR CLASE       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('Contenido' ,'El Contenido es obligatorio').not().isEmpty(),
    check('Asunto' ,'Ingrese asunto').not().isEmpty()
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.IdCliente = $userData.cliente;
    req.body.Cliente = $userData.nombre_cliente;
    req.body.IdLocal = $userData.sucursal;
    req.body.Local = $userData.nombre_local;
    req.body.Fecha = moment().format('YYYY-MM-DD HH:mm:ss'); // DATETIME
    req.body.Anio  = moment().format('YYYY');
    req.body.Mes   = moment().format('MM');



    req.body.Estado = "Digitado";
    $response.data = await incidenciasModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    var _dataGuardado = await incidenciasModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 5 );
        _Codigo = 'I'+_Codigo;
        await incidenciasModel.update({
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
        // Unir con archivos
        await archiGoogleModel.update({
            correlativo : _dataGuardado.id
        },{
            where : { 
                token : _dataGuardado.uu_id
                
            }
        })
        .catch(function (err) {
         
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        
        _dataGuardado = await incidenciasModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        // Enviar mensaje al supervisor
        enviarMensaje( _dataGuardado );
    }

    $response.item = _dataGuardado;
   
    $response.data = await archiGoogleModel.findOne({
        where : {
            token : $response.item.uu_id
        }
    });

	res.json( $response );
    
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                      CARGAR DATA                     //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await incidenciasModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    $response.archivo = await archiGoogleModel.findAll({
        where : {
            token : $response.data.uu_id,
            formulario : 'INCIDENTES',
            correlativo : $response.data.id
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR CLASE          //
//////////////////////////////////////////
router.put('/:uuid', [
    check('Contenido' ,'El Contenido es obligatorio').not().isEmpty(),
    check('Asunto' ,'Ingrese asunto').not().isEmpty()
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
    req.body.UsuarioMod     = $userData.dni;
    req.body.nombre_usuario = $userData.name;

	await incidenciasModel.update(req.body,{
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
    
    $response.item = await incidenciasModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await incidenciasModel.findAll({
        order : [
            ['id' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR CLASE            //
//////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

	await incidenciasModel.update({
        Estado      : 'Anulado',
  
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });

    // obtener los datos
    //console.log($response);
    $response.item = await incidenciasModel.findOne({
        order : [
            ['id' , 'DESC']
        ],
        limit : 200
    });

    res.json( $response );
});

// -------------------------------------------------------
//////////////////////////////////////////
//       ELIMINAR ARCHIVO            //
//////////////////////////////////////////
router.post('/delFile/:uu_id', async (req,res)=>{
    //console.log(req.params.uu_id);
	await archiGoogleModel.destroy({
		where : {
            uu_id : req.params.uu_id 
            }
	});
	res.json({estado:'OK'});
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//            ASIGNAR SUPERVISOR A INCIDENCIA           //
//////////////////////////////////////////////////////////
router.post('/asignar_super', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    await incidenciasModel.update({
        IdSupervisor : $userData.dni ,
        Supervisor   : $userData.name ,
        Estado : 'En-Proceso'
    },{
        where : {
            uu_id : req.body.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//            AGREGAR COMENTARIO A INCIDENCIA           //
//////////////////////////////////////////////////////////
router.post('/add_comentario', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var _userData = await getUserData( req.headers['api-token'] );

    req.body.IdUsuario = _userData.dni;
    req.body.Usuario   = _userData.name;
    //
    await incidenciaComentarioModel.create(req.body)
    .catch(function (err) {
        console.log(_NombreDoc);
        captueError( err.original , req.body );
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await incidenciaComentarioModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    if( _dataGuardado )
    {
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 8 );
        _Codigo = 'CI'+_Codigo;
        await incidenciaComentarioModel.update({
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
        //
        // Unir con archivos
        await archiGoogleModel.update({
            correlativo : _dataGuardado.id
        },{
            where : { 
                token : _dataGuardado.uu_id
                
            }
        })
        .catch(function (err) {
         
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
    }

    $response.item = await incidenciaComentarioModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    // Archivos Google
    $response.files = await archiGoogleModel.findAll({
        where : {
            token : _dataGuardado.uu_id
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/get_comentarios', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [], _dataFinal = [];

    var _Entidad = await incidenciasModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });

    if( _Entidad )
    {
        varDump(`Existe incidencia => ${_Entidad.id}`);
        var _ComentariosData = await incidenciaComentarioModel.findAll({
            where : {
                IdInci : _Entidad.id
            }
        });
        varDump( `===>`+_ComentariosData.length );
        for (let index = 0; index < _ComentariosData.length; index++)
        {
            // Comentarios
            const _rs  = _ComentariosData[index];
            varDump(`Comment => ${_rs.id}`);
            // Arcihvos Google
            const _Img = await archiGoogleModel.findAll({
                where : {
                    token : _rs.uu_id
                }
            });
            var _o = [];
            _dataFinal.push( { 'data' : _rs , 'img' : _Img } );
        }
    }
    $response.data = _dataFinal;
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CERRAR INCIDENCIA                   //
//////////////////////////////////////////////////////////
router.post('/cerrar', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    await incidenciasModel.update({
        Estado : 'Cerrado'
    },{
        where : {
            uu_id : req.body.uuid
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