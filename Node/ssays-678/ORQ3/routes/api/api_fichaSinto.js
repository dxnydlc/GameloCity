
// api_fichaSinto.js

const router = require('express').Router();

const dotenv = require('dotenv');
dotenv.config();
// SPARKPOST
const SparkPost = require('sparkpost')
const client    = new SparkPost(process.env.SPARKPOST_SECRET)
// MOMENT
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');
// NEXMO
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

const { whatsAppLogModel, errorLogModel } = require('../../dbA');
const { fichaSintoModel, User, telegramModel } = require('../../db');


const {check,validationResult} = require('express-validator');
var Mailvalidator = require("email-validator");

var $urlSST = 'http://ssays-orquesta.com/fs';
const { Op } = require("sequelize");
const users = require('../../models/users');

// Escribir imagen
const Jimp = require('jimp') ;
const URL_FICHASINT = process.env.URL_FICHASINT, _URL_NODE = process.env.URL_NODE, PATH_FIRMAS = process.env.PATH_FIRMAS, _URL_ORQ3 = process.env.URL_ORQ3, _RUTA_ORQ3 = process.env.RUTA_ORQ3;

// >>>>>>>>>>>>>    WHATSAPP       >>>>>>>>>>>>>
const config = require("./whatsapp.js");
const tokenWS = config.token, apiUrlWS = config.apiUrl;
const fetch = require('node-fetch');

const fs = require('fs');

// TELEGRAM
const { Telegraf, Scenes , Stage, session } = require('telegraf');
const _telegramToken = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf( _telegramToken );







//////////////////////////////////////////////////////////
//      			BUSCAR POST                			//
//////////////////////////////////////////////////////////
router.post('/dashboard', async (req,res)=>{
	// dni, nombre, inicio, fin, Estado
	var $response = {}, $where = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    var sHoy = moment().format('YYYY-MM-DD');
    console.log( sHoy );

    // Que respondieron OK
    var dRespondido = await fichaSintoModel.count({
        where: {
            DateResp : sHoy ,
            EstadoTrabajador : 'Respondido',
            Revisar  : { [Op.is] : null }
        }
    });
    // Que respondieron OBSERVADO
    var dObservado = await fichaSintoModel.count({
        where: {
            DateResp : sHoy ,
            EstadoTrabajador : 'Respondido',
            Revisar  : 'SI'
        }
    });

    $response.respondido = dRespondido;
    $response.observado  = dObservado;

    // Datos de este mes...
    const sPrimerDia = moment().clone().startOf('month').format('YYYY-MM-DD');
    console.log(sPrimerDia);
    var sDataMes = await fichaSintoModel.findAll({
        where : {
            FechaResp : { [Op.gte] : sPrimerDia },
            FechaResp : { [Op.lte] : sHoy }
        }
    });
    //$response.data = sDataMes;

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

	/*$response.data = await getData({
        where : {
            DateResp : moment().format('YYYY-MM-DD')
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });*/

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

	$response.data = await fichaSintoModel.findAll({
        where : {
            EstadoDoc : 'Activo'
        },
        order : [
            ['id' , 'DESC']
        ],
        limit : 400
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      		BUSCAR RPT OPERACIONES       			//
//////////////////////////////////////////////////////////
router.post('/operaciones', async (req,res)=>{
	// dni, tipo, cliente, local, inicio, fin
	var $response = {}, $where = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    var Dni     = req.body.dni;
    var Cliente = req.body.cliente;
    var Local   = req.body.local;
    var Tipo    = req.body.tipo;
    var Inicio  = req.body.inicio, Fin = req.body.fin;
    var sUsuarios = [], arrDNIS = [];

    $where = {};
    if( Dni != '' )
    {
        // Buscar por DNI's
        var $arOSs = [];
		var $IdOSs = Dni;
		arrDNIS = $IdOSs.split(',');
        //$where.dni = { [Op.in] : $arOSs };
    }else{
        // Buscar por los demas campos¿
        if( Cliente != '' && Local != '' ){
            // obtenemos los DNI de las personas asignadas a este cliente local
            sUsuarios = await User.findAll({
                attributes: ['id', 'dni','name'],
                where : {
                    cliente : Cliente , sucursal : Local
                },
                order : [['dni','ASC']],
                group : 'dni'
            });
        }
        if( Cliente != '' && Local == '' ){
            // obtenemos los DNI de las personas asignadas a este cliente
            sUsuarios = await User.findAll({
                attributes: ['id', 'dni','name'],
                where : {
                    cliente : Cliente
                },
                order : [['dni','ASC']],
                group : 'dni'
            });
        }
        if( sUsuarios ){
            for (let index = 0; index < sUsuarios.length; index++) {
                const rs = sUsuarios[index];
                arrDNIS.push(rs.dni);
            }
        }
    }
    

    
    
    if( Tipo == 'ByFechas' ){
        console.log(Inicio,Fin);
        // Buscamos por rango de fechas
        $where.DateResp = { [Op.gte ]: Inicio, [Op.lte ]: Fin };
        console.log(arrDNIS.length);
        if( arrDNIS.length > 0 ){
            $where.dni = { [Op.in ]: arrDNIS };
        }
        /**/
        $response.data = await fichaSintoModel.findAll({
            where : $where
        })
        .catch(function (err) {
            // handle error;
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        /**/
        console.log( $where );
    }
    if( Tipo == 'ByUltima' ){
        // El ultimo registro de cada DNI
        var _dataResp = [];
        for (let index = 0; index < arrDNIS.length; index++) {
            const sDNI = arrDNIS[index];
            var item = await fichaSintoModel.findOne({
                where : {
                    dni : sDNI
                },
                order : [
                    [ 'id' , 'DESC' ]
                ]
            });
            if( item ){
                _dataResp.push(item);
            }
        }
        //console.log( _dataResp );
        $response.data = _dataResp;
    }
    $response.dni = arrDNIS;
        

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			BUSCAR POST                			//
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
	// dni, nombre, inicio, fin, Estado
	var $response = {}, $where = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    $where = {};
    if( req.body.dni != '' )
    {
        // Buscar por DNI
        $where.dni = req.body.dni;
    }
    if( req.body.Estado )
    {
        // Buscar por DNI
        $where.Revisar = req.body.Estado;
    }

    // Buscar por los demas campos
    $where.created_at = { [Op.gte ]: req.body.inicio+' 00:01:00',[Op.lte ]: req.body.fin+' 23:59:00' };

    $response.data = await fichaSintoModel.findAll({
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR FICHA              			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('dni' ,'Seleccione un colaborador').not().isEmpty(),
    check('Colaborador' ,'Ingrese nombre de colaborador').not().isEmpty(),
    check('id_area' ,'Seleccione un área').not().isEmpty(),
    check('id_puesto' ,'Seleccione un puesto').not().isEmpty(),
    check('id_empresa' ,'Seleccione una empresa').not().isEmpty(),
    check('Edad' ,'Ingrese su edad').not().isEmpty(),
    check('Sexo' ,'Seleccione sexo').not().isEmpty(),
    check('Direccion' ,'Ingrese su Dirección').not().isEmpty(),
] ,async (req,res)=>{

    try {
        
        const errors = validationResult(req);
        if( ! errors.isEmpty() ){
            return res.status(422).json({ errores : errors.array() });
        }
        
        var $response = {};
        $response.estado = 'OK';
        var $userData = await getUserData( req.headers['api-token'] );
        if( req.body.FechaNacimiento == '' ){
            delete req.body.FechaNacimiento;
            delete req.body.Edad;
        }

        console.log('>>>>>>>>>>>>>> GUARDAR FICHA SINTOMATOLOGIA >>>>>>>>>>>>>>');
        console.log(req.body);
        req.body.UsuarioCreado = $userData.name;
        $response.insert = await fichaSintoModel.create(req.body)
        .catch(function (err) {
            console.log('>>>>>>>>>>>>>> ERROR FICHA SINTOMATOLOGIA >>>>>>>>>>>>>>');
            console.log(err);
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        // Si todo esta bien notificamos mensaje de WhatsApp de bienvenida.
        var _Celular = req.body.Telefono;
        if( _Celular )
        {
            if( _Celular.length == 9 )
            {
                var _Colaborador = req.body.Colaborador.trim();
                var _DNI = req.body.dni.trim();
                _Celular = _Celular.trim();
                // Ya se envio el mensaje de bienvenida¿?
                var _ExisteWA = await whatsAppLogModel.findOne({
                    where: {
                        Celular : _Celular,
                        DNI : _DNI
                    }
                });
                if(! _ExisteWA )
                {
                    /*try {
                        _Celular = '51'+_Celular;
                        // Enviamos mensaje de bienvenida
                        var _texto = `Hola *${_Colaborador}*, te saluda el Robot de Orquesta - SSAYS SAC. desde este número te enviaremos información referente al sistema, *por favor agreganos a tu números de contacto*, gracias.`;
                        await apiChatApi( 'sendMessage', { phone : _Celular , body: _texto });
                        var logWA     = {};
                        logWA.uu_id   = await renovarToken();
                        logWA.Usuario = _Colaborador;
                        logWA.DNI     = _DNI;
                        logWA.Celular = _Celular;
                        logWA.Mensaje = _texto;
                        logWA.Fecha   = moment().format('YYYY-MM-DD');
                        await whatsAppLogModel.create( logWA );
                    } catch (error) {
                        console.log(`ERROR AL ENVIAR WHATSAPP`);
                    }*/
                }
            }
        }
        console.log('>>>>>>>>>>>>>> UPDATE USERS >>>>>>>>>>>>>>');
        var  updateDatos = {};
        if( req.body.FechaNacimiento ){
            updateDatos.fechanacimiento = req.body.FechaNacimiento;
        }
        if( req.body.Telefono ){
            updateDatos.celular = req.body.Telefono;
        }
        if( req.body.Email ){
            updateDatos.mail_notifi = req.body.Email;
        }
        if( req.body.Direccion ){
            updateDatos.Direccion = req.body.Direccion;
        }
        if( req.body.Sexo ){
            updateDatos.Sexo = req.body.Sexo;
        }
        await User.update( updateDatos , {
            where : {
                dni : req.body.dni
            }
        });
        

        res.json( $response );

        // ---------------------------------------------------
    } catch (error) {
        console.error(error);
    }

 
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//          CARGAR FICHA            //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await fichaSintoModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//         ¿YA HIZO SU FICHA ESA SEMANA?            //
//////////////////////////////////////////////////////////
router.post('/consulta', async (req,res)=>{
    // dni
    // TODO: MEJORAR ESTE QUERY
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.diff = 0;
    $response.last = '', $response.uuid = '';


    const today = moment();
    const from_date = today.startOf('week');
    var _PrimerDiaSemana = from_date.format('YYYY-MM-DD');
    $response.firstWeek = _PrimerDiaSemana;

    var _prevDat = await fichaSintoModel.findOne({
        where : {
            dni : req.body.dni,
            FechaResp : { [Op.not] : null },
            FechaResp : { [Op.gte] : _PrimerDiaSemana }
        },
        order : [
            ['id' , 'DESC']
        ],
        limit : 1
    });

    if( _prevDat )
    {
        $response.uuid = _prevDat.uu_id;
        $response.data = _prevDat;
        var _lastFecha = moment(_prevDat.FechaResp).format('YYYY-MM-DD');
        var _fechaHoy  = moment().format('YYYY-MM-DD');
        
        var fecha1 = moment(_lastFecha, 'DD-MM-YYYY'); 
        var fecha2 = moment(_fechaHoy, 'DD-MM-YYYY');
        
        var now   = moment().format('YYYY-MM-DD');
        var then  = moment(_prevDat.FechaResp).format('YYYY-MM-DD');
        console.log(`now: ${now}, then: ${then}`);
        var _diff = moment.utc(moment(now,"YYYY-MM-DD").diff(moment(then,"YYYY-MM-DD"))).format("DD");

        var given = moment(_prevDat.FechaResp, "YYYY-MM-DD");
        var current = moment().startOf('day');

        //Difference in number of days
        var _diff2 = moment.duration(current.diff(given)).asDays();
        $response.diff = parseInt( _diff2 );
        // Nombre del día
        var dt = moment( now , "YYYY-MM-DD HH:mm:ss")
        $response.dia = dt.format('dddd');

        //TODO:Este codigo esta mal
        //$response.diff = parseInt( _diff ); MALO
        $response.last = moment(_prevDat.FechaResp).format('DD/MM/YYYY');
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//          CARGAR FICHA BY ID           //
//////////////////////////////////////////////////////////
router.post('/get_data_id', async (req,res)=>{
    // id
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await fichaSintoModel.findOne({
        where : {
            id : req.body.id
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////////////////////
//       ACTUALIZAR FICHA            //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('dni' ,'Seleccione un colaborador').not().isEmpty(),
    check('Colaborador' ,'Ingrese nombre de colaborador').not().isEmpty(),
    check('id_area' ,'Seleccione un área').not().isEmpty(),
    check('id_puesto' ,'Seleccione un puesto').not().isEmpty(),
    check('id_empresa' ,'Seleccione un puesto').not().isEmpty(),
    check('Edad' ,'Ingrese su edad').not().isEmpty(),
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
    delete req.body.UsuarioCreado;
    delete req.body.UsuarioAnulado;
    req.body.UsuarioModificado = $userData.name;

	await fichaSintoModel.update(req.body,{
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
    //$response.data = await getData();

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              ACTUALIZAR FICHA USUARIO                //
//////////////////////////////////////////////////////////
router.put('/user:uuid', [
    check('dni' ,'Seleccione un colaborador').not().isEmpty(),
    check('id_area' ,'Seleccione un área').not().isEmpty(),
    check('id_puesto' ,'Seleccione un puesto').not().isEmpty(),
    check('id_empresa' ,'Seleccione un puesto').not().isEmpty(),
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
    delete req.body.UsuarioCreado;
    delete req.body.UsuarioAnulado;
    req.body.UsuarioModificado = $userData.name;

	await fichaSintoModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    //$response.data = await getData();

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//       ELIMINAR HABITACION            //
//////////////////////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    delete req.body.UsuarioCreado;
    delete req.body.UsuarioModificado;
    req.body.UsuarioAnulado = $userData.name;

    $anuladoPor = $userData.name;

	await fichaSintoModel.update({
        EstadoDoc      : 'Anulado',
        UsuarioMod : $anuladoPor
    },{
		where : { 
            uu_id : req.params.uuid
        }
    });
    var $dataEntidad = await fichaSintoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    // obtener los datos
    if( $dataEntidad )
    {
        //$response.data = await getData();
    }

    res.json( $response );
});

// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      		ENVIAR MAIL FICHA              			//
//////////////////////////////////////////////////////////
router.post('/sendMail', [
    check('id' ,'Debe guardar el documento antes de enviarlo').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioCreado = $userData.name;
    var $dataEntidad = await fichaSintoModel.findOne({
        where : {
            id      : req.body.id,
            uu_id   : req.body.uuid,
        }
    });
    if( $dataEntidad )
    {
        //
        var $body    = await getBody( $dataEntidad );
        var $validar = Mailvalidator.validate($dataEntidad.Email); // true
        if( $validar )
        {
                // Enviar correo...
                client.transmissions.send({
                    content: {
                        from : {
                            email : 'robot@ssays-orquesta.com',
                            name  : 'Robot de Orquesta'
                        },
                        subject   : `Ficha de Sintomatología COVID-19`,
                        html      : $body
                    },
                    recipients: [
                        {address: $dataEntidad.Email }
                    ]
                })
                .then(data => {
                    console.log('Correo enviado al usuario')
                    console.log(data);
                    var $FechaMod = moment().format('YYYY-MM-DD HH:mm:ss');
                    // - //
                    fichaSintoModel.update({
                        IdMailSend    : data.results.id,
                        FechaSendMail : $FechaMod
                    },{
                        where  : {
                            id : $dataEntidad.id
                        }
                    });
                    // - //
                })
                .catch(err => {
                    console.log('Whoops! Something went wrong')
                    console.log(err)
                });
                //
        }
        
    }

	res.json( $response );
});

//////////////////////////////////////////////////////////
//              DIBUJAR FICHA EN IMAGEN PNG             //
//////////////////////////////////////////////////////////
router.post('/dibujar', async (req,res)=>{
    // uuid
    var $response        = {};
    $response.estado     = 'OK';
    $response.encontrado = 'NO';
    $response.data       = [];
    $response.archivo    = '', _firmaIMG = ``, _Celular = ``;
    var _dataUsuario = {};

    var _dataFicha = await fichaSintoModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });

    if( _dataFicha )
    {
        _dataUsuario = await User.findOne({
            attributes: ['Firma'],
            where : {
                dni : _dataFicha.dni
            }
        });
        _Celular = _dataFicha.Telefono;
        // Si existe la firma la imprimimos.
        if( _dataUsuario )
        {
            if( _dataUsuario.Firma ){
                _firmaIMG = `${PATH_FIRMAS}/${_dataFicha.dni}.png`
            }
            /*_firmaIMG = `${URL_FICHASINT}/firma_${_dataFicha.uu_id}.png`;
            const data   = _dataFicha.firma;
            var base64Data = data.replace(/^data:image\/png;base64,/, "");
            require("fs").writeFile( _firmaIMG , base64Data, 'base64', function(err) {
                console.log(`Èrror al dibujar la firma. ${err}`);
                console.log(err);
            });*/
        }

        $response.encontrado = 'SI', _top = 500;
        var _archivoSalida  = `ficha/FS_SSAYS_${_dataFicha.uu_id}.png`;
        var _archivoSalidaU = `${_dataFicha.dni}.png`;
        $response.archivo   = _archivoSalida;

        var _creado = moment( _dataFicha.createdAt ).format('DD/MM/YYYY HH:mm:ss');
        // Reading image
        const image = await Jimp.read('assets/Ficha-Sintomato-02.png');
        // Defining the text font
        const fontLight = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        const font      = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        const fonth1    = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
        image.print(fonth1, 10, 350, { text : 'FICHA DE SINTOMATOLOGÍA COVID-19' , alignmentX : Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE } , 2480 );
        image.print(fonth1, 10, 450, { text : `Fecha: ${_creado}`  , alignmentX : Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE } , 2480 );
        // Sub titulo
        _top = 600;
        image.print(font, 100, _top, 'He recibido explicación del objetivo de esta evaluación y me comprometo a responder con la verdad.');
        _top += 50;
        image.print(font, 100, _top, 'También he sido informado que de omitir o falsear información estaré perjudicando la salud de mis compañeros, lo cual es una falta grave.');
        _top += 50;
        image.print(font, 100, _top, '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
        _top += 50;

        // Datos del encabezado
        image.print(font, 100, _top, 'Empresa: SALUBRIDAD SANEAMIENTO AMBIENTAL Y SERVICIOS SAC');
        image.print(font, 1500, _top, 'RUC  : 20102187211');
        _top += 50;
        image.print(font, 100, _top, `Apellidos y Nombres: ${_dataFicha.Colaborador}`);
        image.print(font, 1500, _top, `DNI  : ${_dataFicha.dni}`);
        _top += 50;
        image.print(font, 100, _top, 'Área de trabajo: -');
        image.print(font, 1500, _top, `Celular: ${_dataFicha.Telefono}`);
        _top += 50;
        image.print(font, 100, _top, `Dirección: ${_dataFicha.Direccion}`);
        _top += 50;
        var _fecnac = moment( _dataFicha.FechaNacimiento ).format('DD/MM/YYYY')
        image.print(font, 100, _top, `Fec. nac: ${_fecnac}`);
        image.print(font, 1500, _top, `Edad: ${_dataFicha.Edad}`);
        _top += 50;
        image.print(font, 100, _top, '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
        _top += 80;
        image.print(font, 100, _top, `En los últimos catorce (14) días ha tenido alguno de los síntomas siguientes:` );
        _top += 50;
        image.print(font, 100, _top, '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
        _top += 50;
        var _resp = ``;
        image.print(font, 100, _top, `1. Sensación de alza térmica o fiebre (especificar)`);
        if(! _dataFicha.bloque1_preg01 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `2. Tos, estornudos o dificultad para respira`);
        if(! _dataFicha.bloque1_preg02 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `3. Dolor de garganta`);
        if(! _dataFicha.bloque1_preg03 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `4. Congestión o secreción nasal`);
        if(! _dataFicha.bloque1_preg04 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `5. Expectoración o flema amarilla o verdosa`);
        if(! _dataFicha.bloque1_preg05 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `6. Pérdida del olfato o pérdida del gusto`);
        if(! _dataFicha.bloque1_preg06 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `7. Dolor abdominal, náuseas o diarrea`);
        if(! _dataFicha.bloque1_preg07 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `8. Dolor en el pecho`);
        if(! _dataFicha.bloque1_preg08 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `9. Desorientación o confusión`);
        if(! _dataFicha.bloque1_preg09 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `10. Coloración azul en los labios`);
        if(! _dataFicha.bloque1_preg10 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `11. Está tomando alguna medicación (detalle):`);
        if(! _dataFicha.bloque1_preg11 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
        _top += 80;
        image.print(font, 100, _top, `En los últimos catorce (14) días (detallar, de ser afirmativa la respuesta):` );
        _top += 50;
        image.print(font, 100, _top, '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
        _top += 50;
        image.print(font, 100, _top, `1. Ha tenido contacto con personas casos sospechosos o confirmados de COVID-19`);
        if(! _dataFicha.bloque2_preg01 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `2. Ha viajado al exterior`);
        if(! _dataFicha.bloque2_preg02 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `3. Ha visitado un establecimiento de salud`);
        if(! _dataFicha.bloque2_preg03 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 80;
        image.print(font, 100, _top, `Tiene los siguientes factores de riesgo:` );
        _top += 50;
        image.print(font, 100, _top, '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
        _top += 50;
        image.print(font, 100, _top, `1. Edad mayor de 65 años`);
        if(! _dataFicha.bloque3_preg01 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `2. Hipertensión arterial`);
        if(! _dataFicha.bloque3_preg02 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `3. Enfermedad cardiovascular (especificar)`);
        if(! _dataFicha.bloque3_preg03 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `4. Cáncer`);
        if(! _dataFicha.bloque3_preg04 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `5. Diabetes mellitus`);
        if(! _dataFicha.bloque3_preg05 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `6. Obesidad con IMC de 40 a más`);
        if(! _dataFicha.bloque3_preg06 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `7. Asma o enfermedad respiratoria crónica (detallar)`);
        if(! _dataFicha.bloque3_preg07 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `8. Insuficiente renal crónica`);
        if(! _dataFicha.bloque3_preg08 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `9. Enfermedad o tratamiento Inmunosupresor u otro estado de inmunosupresión`);
        if(! _dataFicha.bloque3_preg09 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;
        image.print(font, 100, _top, `10. Otro (detallar)`);
        if(! _dataFicha.bloque3_preg10 ){_resp = `NO`;}else{_resp = `SI`;}
        image.print(font, 1500, _top, `| ${_resp} |`);
        _top += 50;

        // FIRMA
        _top += 500;
        if( _firmaIMG ){
            console.log('><>>>>>> URL FIRMA '+_firmaIMG);
            var _imgFirm = await Jimp.read( _firmaIMG );
            //var _imgFirm = await Jimp.read( 'assets/ficha/upload8.jpg' );
            //console.log(_imgFirm);
            image.composite( _imgFirm , 1400,  _top ); 
        }
        _top += 250;
        image.print(font, 330, _top, `DRA. ADA QUINTANILLA ACEVEDO`);
        image.print(font, 1450, _top, `TRABAJADOR`);

        // Writing image after processing
        try {
            await image.writeAsync('assets/'+_archivoSalida);
            await image.writeAsync( `${_RUTA_ORQ3}/intranet/public/fichac/${_archivoSalidaU}` );
        } catch (error) {
            captueError( error , '' );
            console.error(error);
            // expected output: ReferenceError: nonExistentFunction is not defined
            // Note - error messages will vary depending on browser
        }
        console.log('<<<<<<<<<<<<<<<<<<<<<FICHA SINTOMATOLOGICA DIBUJADA>>>>>>>>>>>>>>>>>>>>>>>');
        // Enviar primer mensaje
    }
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//          ENVIAR LA FICHA POR WHATSAPP            //
//////////////////////////////////////////////////////////
router.post('/enviar', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    try {
        
    

    var _dataFicha = await fichaSintoModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });

    if( _dataFicha )
    {
        var _archivoSalida  = `${URL_FICHASINT}/ficha/FS_SSAYS_${_dataFicha.uu_id}.png`;
        var _archivoUser  = `${URL_FICHASINT}/ficha/FS_SSAYS_${_dataFicha.dni}.png`;
        console.log(`Enviando archivo: ${_archivoSalida}`);
        try {
            if (fs.existsSync(_archivoSalida)) {
                // Copiamos la ficha a la intranete public
                //fs.copyFileSync( _archivoSalida , _archivoUser );
                console.log(`>>>>>>>>>>La ficha SI existe: =)`);
            }
          } catch(err) {
            console.log(`>>>>>>>>>>La ficha no existe: ${err}`);
          }
          // Enviams por telegram
          varDump(`Buscando chat de: ${_dataFicha.dni}`)
          var _dataChat = await telegramModel.findOne({
            where : {
                DNI : _dataFicha.dni
            }
          });
          var _DNI = _dataFicha.dni;
          var _foto1 = `${_URL_ORQ3}/fichac/${_DNI}.png`;
          var _foto = _foto1.replace('https','http');
          if( _dataChat ){
            if( _dataChat.IdChat ){
                varDump(`>>>Id chat Telegram: ${_dataChat.IdChat}`);
                var _IdChat = parseInt( _dataChat.IdChat );
                bot.telegram.sendPhoto( _IdChat , _foto );
                bot.telegram.sendMessage( _IdChat , `Ficha Covid generada correctamente` );
            }
          }

        _Celular = _dataFicha.Telefono;
        // Todo bien¿? ahora enviamos al whatsApp del usuario
        /**
        if( _Celular )
        {
            if( _Celular.length == 9 )
            {
                var _fechaH   = moment().format('DD/MM/YYYY HH:mm:ss');
                var _Nombre   = _dataFicha.Colaborador;
                var _Phono1   = '51'+_Celular, _DNI = _dataFicha.dni;
                var _foto = `${_URL_NODE}api/files/fs/${_DNI}/foto.png`; console.log(_foto);
                //await apiChatApi('sendFile',{ phone : _Phono1 , body: `https://api2.ssays-orquesta.com/Robot-Orquesta.png` , filename : 'Logo SSAYS SAC' });
                // El texto
var _Asunto = `Robot - Orquesta
Hola *${_Nombre.trim()}*, se ha generado correctamente tu ficha Covid19, la cual puedes descargar desde aquí:
${_foto}
Emisión: ${_fechaH} | Celular: ${_Celular}
================================
Si no puede visualizar los links correctamente, por favor agrega este número a tus contactos,
Si consideras que esto es un error o ya no deseas que te enviemos mensajes por favor escribe la palabra *salir*. gracias por su atención.`;
                // sendLink
                var _tg = await apiChatApi( 'sendMessage', { phone : _Phono1 , body: _Asunto });
                // https://ssays-orquesta.com:8444/api/files/fs/42968274/foto.png
                varDump( _Asunto );
                //var _sendFile = await apiChatApi('sendFile',{ phone : _Phono1 , body: _foto , filename : 'Logo SSAYS SAC' });
                varDump( _tg );
                //
                var logWA     = {};
                logWA.uu_id   = await renovarToken();
                logWA.Usuario = _Nombre;
                logWA.DNI     = _DNI;
                logWA.Celular = _Celular;
                logWA.Mensaje = _Asunto;
                logWA.Fecha   = moment().format('YYYY-MM-DD');
                await whatsAppLogModel.create( logWA );
            }
        }
        /**/
    }

    } catch (error) {
        varDump( error )
    }
    
    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                  ENVIO MESNAJE DE PRUEBA             //
//////////////////////////////////////////////////////////
router.post('/send01', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    try {
        //
        // ENVIAR MENSAJE
        bot.telegram.sendMessage( 1590904112 , `ENVIO BOLETA` );
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Enviado` };
        //
    } catch (error) {
        varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});

// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
async function getData()
{
    var $data = await fichaSintoModel.findAll({
        order : [
            ['id' , 'DESC']
        ]
    });

    return $data;
}
// -------------------------------------------------------
async function getUserData( $token )
{
    var $data;
    $data = await User.findOne({
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular','Firma'],
        where : {
            api_token : $token
        }
    });
    return $data;
}
async function getBody( $data , $dataUser )
{
    //
    var $html = `<!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <!-- NAME: GDPR SUBSCRIBER ALERT -->
            <!--[if gte mso 15]>
            <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Ficha de Sintomatología COVID-19</title>
            
        <style type="text/css">
            p{
                margin:10px 0;
                padding:0;
            }
            table{
                border-collapse:collapse;
            }
            h1,h2,h3,h4,h5,h6{
                display:block;
                margin:0;
                padding:0;
            }
            img,a img{
                border:0;
                height:auto;
                outline:none;
                text-decoration:none;
            }
            body,#bodyTable,#bodyCell{
                height:100%;
                margin:0;
                padding:0;
                width:100%;
            }
            .mcnPreviewText{
                display:none !important;
            }
            #outlook a{
                padding:0;
            }
            img{
                -ms-interpolation-mode:bicubic;
            }
            table{
                mso-table-lspace:0pt;
                mso-table-rspace:0pt;
            }
            .ReadMsgBody{
                width:100%;
            }
            .ExternalClass{
                width:100%;
            }
            p,a,li,td,blockquote{
                mso-line-height-rule:exactly;
            }
            a[href^=tel],a[href^=sms]{
                color:inherit;
                cursor:default;
                text-decoration:none;
            }
            p,a,li,td,body,table,blockquote{
                -ms-text-size-adjust:100%;
                -webkit-text-size-adjust:100%;
            }
            .ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{
                line-height:100%;
            }
            a[x-apple-data-detectors]{
                color:inherit !important;
                text-decoration:none !important;
                font-size:inherit !important;
                font-family:inherit !important;
                font-weight:inherit !important;
                line-height:inherit !important;
            }
            .templateContainer{
                max-width:600px !important;
            }
            a.mcnButton{
                display:block;
            }
            .mcnImage,.mcnRetinaImage{
                vertical-align:bottom;
            }
            .mcnTextContent{
                word-break:break-word;
            }
            .mcnTextContent img{
                height:auto !important;
            }
            .mcnDividerBlock{
                table-layout:fixed !important;
            }
        /*
        @tab Page
        @section Heading 1
        @style heading 1
        */
            h1{
                /*@editable*/color:#222222;
                /*@editable*/font-family:Helvetica;
                /*@editable*/font-size:40px;
                /*@editable*/font-style:normal;
                /*@editable*/font-weight:bold;
                /*@editable*/line-height:150%;
                /*@editable*/letter-spacing:normal;
                /*@editable*/text-align:center;
            }
        /*
        @tab Page
        @section Heading 2
        @style heading 2
        */
            h2{
                /*@editable*/color:#222222;
                /*@editable*/font-family:Helvetica;
                /*@editable*/font-size:34px;
                /*@editable*/font-style:normal;
                /*@editable*/font-weight:bold;
                /*@editable*/line-height:150%;
                /*@editable*/letter-spacing:normal;
                /*@editable*/text-align:left;
            }
        /*
        @tab Page
        @section Heading 3
        @style heading 3
        */
            h3{
                /*@editable*/color:#444444;
                /*@editable*/font-family:Helvetica;
                /*@editable*/font-size:22px;
                /*@editable*/font-style:normal;
                /*@editable*/font-weight:bold;
                /*@editable*/line-height:150%;
                /*@editable*/letter-spacing:normal;
                /*@editable*/text-align:left;
            }
        /*
        @tab Page
        @section Heading 4
        @style heading 4
        */
            h4{
                /*@editable*/color:#999999;
                /*@editable*/font-family:Georgia;
                /*@editable*/font-size:20px;
                /*@editable*/font-style:italic;
                /*@editable*/font-weight:normal;
                /*@editable*/line-height:125%;
                /*@editable*/letter-spacing:normal;
                /*@editable*/text-align:left;
            }
        /*
        @tab Header
        @section Header Container Style
        */
            #templateHeader{
                /*@editable*/background-color:#F2F2F2;
                /*@editable*/background-image:none;
                /*@editable*/background-repeat:no-repeat;
                /*@editable*/background-position:center;
                /*@editable*/background-size:cover;
                /*@editable*/border-top:0;
                /*@editable*/border-bottom:0;
                /*@editable*/padding-top:36px;
                /*@editable*/padding-bottom:0;
            }
        /*
        @tab Header
        @section Header Interior Style
        */
            .headerContainer{
                /*@editable*/background-color:#FFFFFF;
                /*@editable*/background-image:none;
                /*@editable*/background-repeat:no-repeat;
                /*@editable*/background-position:center;
                /*@editable*/background-size:cover;
                /*@editable*/border-top:0;
                /*@editable*/border-bottom:0;
                /*@editable*/padding-top:45px;
                /*@editable*/padding-bottom:45px;
            }
        /*
        @tab Header
        @section Header Text
        */
            .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
                /*@editable*/color:#808080;
                /*@editable*/font-family:Helvetica;
                /*@editable*/font-size:16px;
                /*@editable*/line-height:150%;
                /*@editable*/text-align:left;
            }
        /*
        @tab Header
        @section Header Link
        */
            .headerContainer .mcnTextContent a,.headerContainer .mcnTextContent p a{
                /*@editable*/color:#007E9E;
                /*@editable*/font-weight:normal;
                /*@editable*/text-decoration:underline;
            }
        /*
        @tab Body
        @section Body Container Style
        */
            #templateBody{
                /*@editable*/background-color:#F2F2F2;
                /*@editable*/background-image:none;
                /*@editable*/background-repeat:no-repeat;
                /*@editable*/background-position:center;
                /*@editable*/background-size:cover;
                /*@editable*/border-top:0;
                /*@editable*/border-bottom:0;
                /*@editable*/padding-top:0;
                /*@editable*/padding-bottom:0;
            }
        /*
        @tab Body
        @section Body Interior Style
        */
            .bodyContainer{
                /*@editable*/background-color:#FFFFFF;
                /*@editable*/background-image:none;
                /*@editable*/background-repeat:no-repeat;
                /*@editable*/background-position:center;
                /*@editable*/background-size:cover;
                /*@editable*/border-top:0;
                /*@editable*/border-bottom:0;
                /*@editable*/padding-top:0;
                /*@editable*/padding-bottom:45px;
            }
        /*
        @tab Body
        @section Body Text
        */
            .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
                /*@editable*/color:#808080;
                /*@editable*/font-family:Helvetica;
                /*@editable*/font-size:16px;
                /*@editable*/line-height:150%;
                /*@editable*/text-align:left;
            }
        /*
        @tab Body
        @section Body Link
        */
            .bodyContainer .mcnTextContent a,.bodyContainer .mcnTextContent p a{
                /*@editable*/color:#007E9E;
                /*@editable*/font-weight:normal;
                /*@editable*/text-decoration:underline;
            }
        /*
        @tab Footer
        @section Footer Style
        */
            #templateFooter{
                /*@editable*/background-color:#F2F2F2;
                /*@editable*/background-image:none;
                /*@editable*/background-repeat:no-repeat;
                /*@editable*/background-position:center;
                /*@editable*/background-size:cover;
                /*@editable*/border-top:0;
                /*@editable*/border-bottom:0;
                /*@editable*/padding-top:0;
                /*@editable*/padding-bottom:36px;
            }
        /*
        @tab Footer
        @section Footer Interior Style
        */
            .footerContainer{
                /*@editable*/background-color:#333333;
                /*@editable*/background-image:none;
                /*@editable*/background-repeat:no-repeat;
                /*@editable*/background-position:center;
                /*@editable*/background-size:cover;
                /*@editable*/border-top:0;
                /*@editable*/border-bottom:0;
                /*@editable*/padding-top:45px;
                /*@editable*/padding-bottom:45px;
            }
        /*
        @tab Footer
        @section Footer Text
        */
            .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
                /*@editable*/color:#FFFFFF;
                /*@editable*/font-family:Helvetica;
                /*@editable*/font-size:12px;
                /*@editable*/line-height:150%;
                /*@editable*/text-align:center;
            }
        /*
        @tab Footer
        @section Footer Link
        */
            .footerContainer .mcnTextContent a,.footerContainer .mcnTextContent p a{
                /*@editable*/color:#FFFFFF;
                /*@editable*/font-weight:normal;
                /*@editable*/text-decoration:underline;
            }
        @media only screen and (min-width:768px){
            .templateContainer{
                width:600px !important;
            }
    
    }	@media only screen and (max-width: 480px){
            body,table,td,p,a,li,blockquote{
                -webkit-text-size-adjust:none !important;
            }
    
    }	@media only screen and (max-width: 480px){
            body{
                width:100% !important;
                min-width:100% !important;
            }
    
    }	@media only screen and (max-width: 480px){
            .mcnRetinaImage{
                max-width:100% !important;
            }
    
    }	@media only screen and (max-width: 480px){
            .mcnImage{
                width:100% !important;
            }
    
    }	@media only screen and (max-width: 480px){
            .mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{
                max-width:100% !important;
                width:100% !important;
            }
    
    }	@media only screen and (max-width: 480px){
            .mcnBoxedTextContentContainer{
                min-width:100% !important;
            }
    
    }	@media only screen and (max-width: 480px){
            .mcnImageGroupContent{
                padding:9px !important;
            }
    
    }	@media only screen and (max-width: 480px){
            .mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{
                padding-top:9px !important;
            }
    
    }	@media only screen and (max-width: 480px){
            .mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{
                padding-top:18px !important;
            }
    
    }	@media only screen and (max-width: 480px){
            .mcnImageCardBottomImageContent{
                padding-bottom:9px !important;
            }
    
    }	@media only screen and (max-width: 480px){
            .mcnImageGroupBlockInner{
                padding-top:0 !important;
                padding-bottom:0 !important;
            }
    
    }	@media only screen and (max-width: 480px){
            .mcnImageGroupBlockOuter{
                padding-top:9px !important;
                padding-bottom:9px !important;
            }
    
    }	@media only screen and (max-width: 480px){
            .mcnTextContent,.mcnBoxedTextContentColumn{
                padding-right:18px !important;
                padding-left:18px !important;
            }
    
    }	@media only screen and (max-width: 480px){
            .mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{
                padding-right:18px !important;
                padding-bottom:0 !important;
                padding-left:18px !important;
            }
    
    }	@media only screen and (max-width: 480px){
            .mcpreview-image-uploader{
                display:none !important;
                width:100% !important;
            }
    
    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Heading 1
        @tip Make the first-level headings larger in size for better readability on small screens.
        */
            h1{
                /*@editable*/font-size:30px !important;
                /*@editable*/line-height:125% !important;
            }
    
    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Heading 2
        @tip Make the second-level headings larger in size for better readability on small screens.
        */
            h2{
                /*@editable*/font-size:26px !important;
                /*@editable*/line-height:125% !important;
            }
    
    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Heading 3
        @tip Make the third-level headings larger in size for better readability on small screens.
        */
            h3{
                /*@editable*/font-size:20px !important;
                /*@editable*/line-height:150% !important;
            }
    
    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Heading 4
        @tip Make the fourth-level headings larger in size for better readability on small screens.
        */
            h4{
                /*@editable*/font-size:18px !important;
                /*@editable*/line-height:150% !important;
            }
    
    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Boxed Text
        @tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
        */
            .mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{
                /*@editable*/font-size:14px !important;
                /*@editable*/line-height:150% !important;
            }
    
    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Header Text
        @tip Make the header text larger in size for better readability on small screens.
        */
            .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
                /*@editable*/font-size:16px !important;
                /*@editable*/line-height:150% !important;
            }
    
    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Body Text
        @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
        */
            .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
                /*@editable*/font-size:16px !important;
                /*@editable*/line-height:150% !important;
            }
    
    }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Footer Text
        @tip Make the footer content text larger in size for better readability on small screens.
        */
            .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
                /*@editable*/font-size:14px !important;
                /*@editable*/line-height:150% !important;
            }
    
    }</style></head>
        <body>
            <!--*|IF:MC_PREVIEW_TEXT|*-->
            <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span><!--<![endif]-->
            <!--*|END:IF|*-->
            <center>
                <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                    <tr>
                        <td align="center" valign="top" id="bodyCell">
                            <!-- BEGIN TEMPLATE // -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" valign="top" id="templateHeader">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;">
        <tbody class="mcnImageBlockOuter">
                <tr>
                    <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                        <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;">
                            <tbody><tr>
                                <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">
                                    
                                        
                                            <img align="center" alt="" src="https://api2.ssays-orquesta.com/logo-ssays-2019-2.png" width="196" style="max-width:196px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage">
                                        
                                    
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateBody">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody><tr>
                            
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                            
                                <h3>Hola ${$data.Colaborador},</h3><br>
                                <p>Debido a la coyuntura actual necesitamos que complete el formulario en link siguiente.</p>
                                <p>Por favor le pedimos su colaboración</p>
                            </td>
                        </tr>
                    </tbody></table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
        <tbody class="mcnDividerBlockOuter">
            <tr>
                <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px 0px;">
                    <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                        <tbody><tr>
                            <td>
                                <span></span>
                            </td>
                        </tr>
                    </tbody></table>
    <!--            
                    <td class="mcnDividerBlockInner" style="padding: 18px;">
                    <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
    -->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
        <tbody class="mcnButtonBlockOuter">
            <tr>
                <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                    <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 3px;background-color: #00ADD8;">
                        <tbody>
                            <tr>
                                <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Helvetica; font-size: 18px; padding: 18px;">
                                    <a class="mcnButton " title="Acceder" href="${$urlSST}/${$data.dni}/${$data.uu_id}" target="_self" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Comenzar</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateFooter">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="footerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody><tr>
                            
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                            
                                <em>Copyright © *|CURRENT_YEAR|* *|LIST:COMPANY|*, All rights reserved.</em>
    <br>
    *|IFNOT:ARCHIVE_PAGE|*
        *|LIST:DESCRIPTION|*
        <br>
        <br>
        <strong>Our mailing address is:</strong>
        <br>
        *|HTML:LIST_ADDRESS_HTML|* *|END:IF|*
        <br>
        <br>
        Want to change how you receive these emails?<br>
        You can <a href="*|UPDATE_PROFILE|*">update your preferences</a> or <a href="*|UNSUB|*">unsubscribe from this list</a>.
        <br>
        <br>
        *|IF:REWARDS|* *|HTML:REWARDS|*
    *|END:IF|*
    
                            </td>
                        </tr>
                    </tbody></table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                            </table>
                            <!-- // END TEMPLATE -->
                        </td>
                    </tr>
                </table>
            </center>
        </body>
    </html>
    `;

    return $html;
}
// -------------------------------------------------------
async function apiChatApi( method , params ){
    try {
        const options = {};
        options['method'] = "POST";
        options['body'] = JSON.stringify(params);
        options['headers'] = { 'Content-Type': 'application/json' };
        
        const url = `${apiUrlWS}${method}?token=${tokenWS}`; 
        
        const apiResponse = await fetch(url, options);
        const jsonResponse = await apiResponse.json();
        return jsonResponse;
    } catch (error) {
        return {};
    }
}
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
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;