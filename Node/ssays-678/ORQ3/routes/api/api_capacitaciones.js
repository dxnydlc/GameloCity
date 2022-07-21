// api_capacitaciones.js

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
// >>>>>>>>>>>>>    WHATSAPP       >>>>>>>>>>>>>
const config = require("./whatsapp.js");
const tokenWS = config.token, apiUrlWS = config.apiUrl;
const fetch = require('node-fetch');

// API GOOGLE MAPS
var MAPS_KEY2 = process.env.MAPS_KEY2

// >>>>>>>>>>>>>    Plantillas Mail    >>>>>>>>>>>>>
const { mail_capacitacion } = require( './mail_plantillas' );

// LEER EXCEL
const reader = require('xlsx')

// Modelos
const { capacitacionModel , User , capacitacionDetModel , archiGoogleModel, sucursalModel } = require('../../db');


// #####################################################
// -----------------------------------------------------
capacitacionModel.belongsTo( capacitacionDetModel ,{
	as : 'DetCapa02', foreignKey 	: 'Codigo',targetKey: 'CodigoHead',
});
// -----------------------------------------------------
// #####################################################

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await capacitacionModel.findAll({
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

    if( req.body.id != '' ){
        // Buscamos por ID
        $where.Codigo = req.body.id;
        //
        $response.data = await capacitacionModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        $where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        $response.data = await capacitacionModel.findAll({
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

	$response.data = await capacitacionModel.findAll({
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
    check('Titulo' ,'Ingrese un título').not().isEmpty(),
    check('FechaHora' ,'Ingrese fecha hora').not().isEmpty(),
    check('Responsable' ,'Ingrese responsable').not().isEmpty(),
    check('Expositor' ,'Ingrese expositor').not().isEmpty(),
    check('IdCliente' ,'Seleccione cliente').not().isEmpty(),
    check('IdLocal' ,'Seleccione local').not().isEmpty(),
    check('Direccion' ,'Ingrese dirección').not().isEmpty(),
    check('Glosa' ,'Ingrese glosa').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.IdCreadoPor = $userData.dni;
    req.body.CreadoPor   = $userData.name;
    //
    delete req.body.Hinicio;
    delete req.body.HFin;
    
    // Link para registro
    var $urlRegistro = process.env.MODULO_LND+'registro/capa/'+req.body.uu_id;
    try{
        await bitly
        .shorten($urlRegistro)
        .then(function(result) {
            _urlBirlyRegistro = result.link;
        })
        .catch(function(error) {
            console.error(error);
        });
    }catch( error ){
        console.log(error);
    }
    req.body.LinkRegistro = _urlBirlyRegistro;
    // >>>>>>>>>>>>>> BITLY

    // Generar link repositorio de carpeta, SOLO SI HAY ARCHIVOS....
    const NroFiles = await archiGoogleModel.count({
        where: {
            token : req.body.uu_id,
            formulario : 'CAPACITACION'
        }
    });
    if( NroFiles > 0 )
    {
        var $url = process.env.MODULO_LND+'carpeta/'+req.body.uu_id, _urlBirly = '';
        var _urlBirlyRegistro = '';
        // >>>>>>>>>>>>>> BITLY
        try{
            await bitly
            .shorten($url)
            .then(function(result) {
                _urlBirly = result.link;
            })
            .catch(function(error) {
                console.error(error);
            });
        }catch( error ){
            console.log(error);
        }
        req.body.LinkRepositorio = _urlBirly;
    }
    //
    await capacitacionModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await capacitacionModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        // Nro participantes...
        var _NroParticipantes = await capacitacionDetModel.count({
            where : {
                Token : req.body.uu_id
            }
        });
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 7 );
        _Codigo = 'CAP'+_Codigo;
        await capacitacionModel.update({
            Codigo          : _Codigo ,
            NroAsistentes   : _NroParticipantes
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
        // Unir con detalle
        await capacitacionDetModel.update({
            CodigoHead : _Codigo
        },{
            where : {
                Token : req.body.uu_id
            }
        });
        /// Unir archivos
        await archiGoogleModel.update({
            correlativo : _dataGuardado.id
        },{
            where : {
                token : req.body.uu_id,
                formulario : 'CAPACITACION'
            }
        });
    }

    $response.item = await capacitacionModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    $response.data = await capacitacionModel.findAll({
        order : [
            ['Codigo' , 'DESC']
        ],
        limit : 200
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
    $response.estado    = 'OK';
    $response.data      = [];
    $response.invitados = [];
    $response.archivos  = [];
    $response.sucursal  = [];

    var _Entidad = await capacitacionModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = _Entidad;
    if( _Entidad ){
        // Invitados
        var _Detalle = await capacitacionDetModel.findAll({
            where : {
                CodigoHead : _Entidad.Codigo
            }
        });
        $response.invitados = _Detalle;
        // Archivos
        var _Archivos = await archiGoogleModel.findAll({
            where : {
                token : _Entidad.uu_id
            }
        });
        $response.archivos = _Archivos;
        // Sucursales
        var _Sucursales = await sucursalModel.findAll({
            where : {
                IdClienteProv : _Entidad.IdCliente
            }
        });
        $response.sucursal  = _Sucursales;
    }

    
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/get_data_codigo', async (req,res)=>{
    // Codigo
    var $response = {};
    $response.estado    = 'OK';
    $response.data      = [];
    var _Entidad = await capacitacionModel.findOne({
        where : {
            Codigo : req.body.Codigo
        },
        include: [{
            model   : capacitacionDetModel,
            as      : 'DetCapa02',
        }]
    });
    $response.data = _Entidad;
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('Titulo' ,'Ingrese un título').not().isEmpty(),
    check('FechaHora' ,'Ingrese fecha hora').not().isEmpty(),
    check('Responsable' ,'Ingrese responsable').not().isEmpty(),
    check('Expositor' ,'Ingrese expositor').not().isEmpty(),
    check('IdCliente' ,'Seleccione cliente').not().isEmpty(),
    check('IdLocal' ,'Seleccione local').not().isEmpty(),
    check('Direccion' ,'Ingrese dirección').not().isEmpty(),
    check('Glosa' ,'Ingrese glosa').not().isEmpty(),
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
    req.body.IdModificadoPor = $userData.dni;
    req.body.ModificadoPor  = $userData.name;

    delete req.body.Hinicio;
    delete req.body.HFin;

    // Nro participantes...
    var _NroParticipantes = await capacitacionDetModel.count({
        where : {
            Token : req.body.uu_id
        }
    });
    req.body.NroAsistentes = _NroParticipantes;

	await capacitacionModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await capacitacionModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELIMINAR CAPACITACION                  //
//////////////////////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    $anuladoPor = $userData.name;

    $response.item = await capacitacionModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

	await capacitacionModel.update({
        Estado      : 'Anulado',
        IdAnuladoPor: $userData.dni,
        AnuladoPor  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  AGREGAR ASISTENTE                   //
//////////////////////////////////////////////////////////
router.post('/asistente/add', [
    check('Estado' ,'Seleccione estado').not().isEmpty(),
    check('Colaborador' ,'Ingrese participante').not().isEmpty()
] , async (req,res)=>{

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.item = [];
    var $where = {};
    var $userData = await getUserData( req.headers['api-token'] );
    
    // Ya existe en la lista¿?
    var _DNI = req.body.IdColaborador;
    var ExisteLista = await capacitacionDetModel.count({
        where : {
            Token : req.body.Token ,
            IdColaborador : _DNI
        }
    });
    console.log(ExisteLista);
    if( ExisteLista > 0 )
    {
        $response.estado = 'ERROR';
        $response.error  = 'El asistente ya figura en la lista';
    }else{
        req.body.CreadoPor = $userData.name;
        await capacitacionDetModel.create( req.body )
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        var _ItemInsertado = await capacitacionDetModel.findOne({
            where : {
                Token : req.body.Token
            }
        });
        $response.item = _ItemInsertado;
    }

    $response.data = await capacitacionDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    });

    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR ASISTENTE                //
//////////////////////////////////////////////////////////
router.put('/asistente/update', [
    check('Estado' ,'Seleccione estado').not().isEmpty(),
    check('Colaborador' ,'Ingrese participante').not().isEmpty()
] , async (req,res)=>{

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.item = [];
    var $where = {};
    var $userData = await getUserData( req.headers['api-token'] );

    // Puntuación 
    if(! req.body.Puntuacion ){
        delete req.body.Puntuacion;
    }
    
    // Entidad
    var _Entidad = await capacitacionDetModel.findOne({
        where : {
            Token : req.body.Token
        }
    });
    if( _Entidad ){
        delete req.body.id;
        req.body.ModificadoPor = $userData.name;
        await capacitacionDetModel.update( req.body ,{
            where : {
                uu_id : req.body.uu_id
            }
        });
    }

    var _ItemInsertado = await capacitacionDetModel.findOne({
        where : {
            Token : req.body.Token
        }
    });
    $response.item = _ItemInsertado;

    $response.data = await capacitacionDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    });

    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR ASISTENTE                    //
//////////////////////////////////////////////////////////
router.post('/asistente/get', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await capacitacionDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ANULAR ASISTENTE                   //
//////////////////////////////////////////////////////////
router.post('/asistente/del' , async (req,res)=>{
    // uuid, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.item = [];
    var $where = {};
    var $userData = await getUserData( req.headers['api-token'] );

    // Ya existe en la lista¿?
    var _DNI = req.body.IdColaborador;

    $response.item = await capacitacionDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    await capacitacionDetModel.destroy({
        where : {
            uu_id : req.body.uuid
        }
    });
    //
    $response.data = await capacitacionDetModel.findAll({
        where : {
            Token : req.body.Token ,
        }
    });
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  TRAER ASISTENTES                   //
//////////////////////////////////////////////////////////
router.post('/asistente/all' , async (req,res)=>{
    // token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.item = [];
    var $where = {};
    var $userData = await getUserData( req.headers['api-token'] );


    var _Asistentes = await capacitacionDetModel.findAll({
        where : {
            Token : req.body.token
        }
    });
    $response.data = _Asistentes;

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  APROBAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.post('/aprobar',  async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.item = [];
    var $where = {};
    var $userData = await getUserData( req.headers['api-token'] );
    
    // Entidad
    var _Entidad = await capacitacionModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    if( _Entidad ){
        await capacitacionModel.update({
            Estado : 'Aprobado',
        },{
            where : {
                uu_id : req.body.uuid
            }
        });
    }
    $response.data = _Entidad;
    var _DetalleCapa = await capacitacionDetModel.findAll({
        where : {
            CodigoHead : _Entidad.Codigo
        }
    });
    console.log(_Entidad.Codigo);
    console.log( _DetalleCapa.length );
    for ( let index = 0 ; index < _DetalleCapa.length ; index++ )
    {
        var rs = _DetalleCapa[index], _Resultado = 'Error', _urlBirly = '';
        var _Email = rs.Correo, _Celular = rs.Celular;
        // Mapita
        var _Mapita = ``, _FechaHora = '';
        if( _Entidad.LatDir ){
            if( _Entidad.LngDir ){
                _Mapita = `https://maps.googleapis.com/maps/api/staticmap?size=400x300&maptype=roadmap&zoom=15&markers=color:red%7Clabel:S%7C${_Entidad.LatDir},${_Entidad.LngDir}&key=${MAPS_KEY2}`;
            }
        }
        _FechaHora = moment( _Entidad.FechaHora ).format('DD/MM/YYYY HH:mm:ss');
        //
        if( _Email ){
            var _Asunto = `Capacitación: ${_Entidad.Titulo}`;
            // 000000000000000000000000000000000000000000000000
            var _htmlBody = mail_capacitacion( 
                _Asunto , 
                `Capacitación: ${_Entidad.Titulo}` ,
                _Entidad ,
                rs ,
                _urlBirly,
                _FechaHora,
                `<img src="${_Mapita}" style="height:400px;width:300px;" />`
            );
            // 000000000000000000000000000000000000000000000000
            await clientMail.transmissions.send({
                options: {
                    //sandbox: true
                },
                content: {
                    from : {
                        name  : 'Robot de Orquesta',
                        email : 'robot@ssays-orquesta.com'
                    },
                    subject : _Asunto,
                    html    : _htmlBody
                },
                recipients : 
                    [{address: _Email }]
            })
            .then( async data => {
                console.log('Woohoo! You just sent your first mailing!');
                var _Aceptados = parseInt(data.results.total_accepted_recipients);
                if( _Aceptados > 0 ){
                    var _Resultado = 'Enviado Mail '+data.results.id;
                    // --------------------------------
                    await capacitacionDetModel.update({
                        Notificado : _Resultado
                    },{ where : { uu_id : rs.uu_id } });
                    // --------------------------------
                }
                console.log(data);
            })
            .catch(err => {
                console.log('Whoops! Something went wrong');
                console.log(err);
            });
        }
        // Ahora enviamos el mensaje de texto
        if( _Celular )
        {
            if( _Celular.length == 9 )
            {
                const from = 'SSAYS SAC';
                var _Phono1   = '51'+_Celular;
                var _FechaHora = moment(_Entidad.FechaHora).format('DD/MM/YYYY HH:mm:ss');
                // Enviar WhatsApp
                await apiChatApi('sendFile',{ phone : _Phono1 , body: `https://api2.ssays-orquesta.com/logo-ssays-2019-2.png` , filename : 'Logo SSAYS SAC' });
                var _archivosRepo = ``;
                if( _Entidad.LinkRepositorio ){
                    _archivosRepo = `Revisa el material adicional aquí ${_Entidad.LinkRepositorio}.`;
                }
                // ${_Mapita}
var _Asunto = `
Hola *${rs.Colaborador}*,
Estás selecionado para participar de la capacitación _${_Entidad.Tipo}_ *${_Entidad.Titulo}*
El área expositor: ${_Entidad.Area_Org}
Expositor: *${_Entidad.Expositor}*, responsable: *${_Entidad.Responsable}*.
Dirigida al área: *${_Entidad.Area_Rec}*
La cual se llevará a cabo en:
*${_Entidad.Cliente}* - *${_Entidad.Local}*
_${_Entidad.Direccion}_ *${_Entidad.Lugar}*
Fecha/hora: _${_FechaHora}_
${_archivosRepo}
_${_Entidad.Glosa}_
Contamos con tu participación, recuerda que estas capacitaciones son importantes, muchas gracias por su atención.
`;

                // Enviar WhatsApp
                await apiChatApi( 'sendMessage', { phone : _Phono1 , body: _Asunto });
                console.log(`Enviando a WhatsApp ${_Phono1}`);
            }
        }
    }
    

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ANULAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/anular',  async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.item = [];
    var $where = {};
    var $userData = await getUserData( req.headers['api-token'] );
    
    // Entidad
    var _Entidad = await capacitacionDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    if( _Entidad ){
        await capacitacionDetModel.update({
            Estado : 'Anulado',
            IdAnuladoPor : $userData.dni ,
            AnuladoPor   : $userData.name 
        },{
            where : {
                uu_id : req.body.uuid
            }
        });
    }
    _Entidad = await capacitacionDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = _Entidad;

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  INICIAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/iniciar',  async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.item = [];
    var $where = {};
    var $userData = await getUserData( req.headers['api-token'] );
    
    // Entidad
    var _Entidad = await capacitacionModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    if( _Entidad ){
        await capacitacionModel.update({
            Estado  : 'Iniciado',
            Hinicio : moment().format('YYYY-MM-DD HH:mm:ss')
        },{
            where : {
                uu_id : req.body.uuid
            }
        });
    }
    _Entidad = await capacitacionModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = _Entidad;

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  FINALIZAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/finalizar',  async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.item = [];
    var $where = {};
    var $userData = await getUserData( req.headers['api-token'] );
    
    // Entidad
    var _Entidad = await capacitacionModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    var $FechaMod = moment().format('YYYY-MM-DD HH:mm:ss');
    var now     = $FechaMod;
    var then    = _Entidad.Hinicio;
    var _Duracion   = moment.utc(moment(now,"YYYY-MM-DD HH:mm:ss").diff(moment(then,"YYYY-MM-DD HH:mm:ss"))).format("HH:mm:ss")
    console.log(`Duración: ${_Duracion}`);
    //
    if( _Entidad ){
        await capacitacionModel.update({
            Estado : 'Finalizado',
            HFin   : $FechaMod ,
            Duracion : _Duracion
        },{
            where : {
                uu_id : req.body.uuid
            }
        });
    }
    _Entidad = await capacitacionModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = _Entidad;

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  DEVOLVER ARCHIVOS                   //
//////////////////////////////////////////////////////////
router.post('/archivos',  async (req,res)=>{
    // token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.item = [];
    var $where = {};
    var $userData = await getUserData( req.headers['api-token'] );
    
    // Entidad
    var _Entidad = await archiGoogleModel.findAll({
        where : {
            token : req.body.token
        }
    });
    $response.data = _Entidad;

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//          IMPORTAR ASISTENTES DESDE UN EXCEL          //
//////////////////////////////////////////////////////////
router.post('/importar_xls', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado    = 'OK';
    $response.data      = [];

    var _Archivo = await archiGoogleModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.file = _Archivo;

    if( _Archivo ){
        // Reading our test file
        const file = reader.readFile( _Archivo.ruta_fisica );
        let data = [];
        const sheets = file.SheetNames
        
        for(let i = 0; i < sheets.length; i++)
        {
            const temp = reader.utils.sheet_to_json(
                    file.Sheets[file.SheetNames[i]])
            temp.forEach( async (res) => {
                var _Insertar = {};
                _Insertar.uu_id = await renovarToken();
                _Insertar.IdColaborador = res.DNI;
                _Insertar.Colaborador   = res.Nombre;
                _Insertar.Correo        = res.Correo;
                _Insertar.Celular       = res.Celular;
                _Insertar.Token         = _Archivo.token;
                _Insertar.PuestoISO     = res.puesto;
                data.push(res);
                //console.log( _Insertar );
                await capacitacionDetModel.create( _Insertar );
            })
        }
        // Printing data
        // console.log(data);
        $response.token = _Archivo.token;

        $response.data = await capacitacionDetModel.findAll({
            where : {
                Token : _Archivo.token
            }
        });
    }

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//             IMPORTAR NOTAS DESDE UN EXCEL            //
//////////////////////////////////////////////////////////
router.post('/importar_notas', async (req,res)=>{
    // uuid (archivo), Token
    var $response = {};
    $response.estado    = 'OK';
    $response.data      = [];

    var _Archivo = await archiGoogleModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.file = _Archivo;

    if( _Archivo ){
        // DNI | Nombre | Nota
        const file = reader.readFile( _Archivo.ruta_fisica );
        let data = [];
        const sheets = file.SheetNames
        
        for(let i = 0; i < sheets.length; i++)
        {
            const temp = reader.utils.sheet_to_json(
                    file.Sheets[file.SheetNames[i]])
            temp.forEach( async (res) => {
                data.push(res);
                await capacitacionDetModel.update({
                    Puntuacion : res.Nota
                },{
                    where : {
                        Token : req.body.Token,
                        IdColaborador :  res.DNI
                    }
                });
            })
        }
        // Printing data
        // console.log(data);
        $response.token = _Archivo.token;
    }

    res.json( $response );
});
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
async function apiChatApi( method , params ){
    const options = {};
    options['method'] = "POST";
    options['body'] = JSON.stringify(params);
    options['headers'] = { 'Content-Type': 'application/json' };
    
    const url = `${apiUrlWS}/${method}?token=${tokenWS}`; 
    
    const apiResponse = await fetch(url, options);
    const jsonResponse = await apiResponse.json();
    return jsonResponse;
}
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;