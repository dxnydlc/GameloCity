// api_operarios.js
var _NombreDoc = 'api_operarios';

const router = require('express').Router();

// WHATSAPP
const config = require("./whatsapp.js");
const tokenWS = config.token, apiUrlWS = config.apiUrl;
const fetch = require('node-fetch');
var _LogoSSAYS = 'https://api2.ssays-orquesta.com/logo-ssays-2019-2.png';

// LEER EXCEL
const reader = require('xlsx')

// Otro diver para leer XLXS
const readXlsxFile = require('read-excel-file/node')

const dotenv = require('dotenv');
dotenv.config();

const { User, sucursalModel, fichaSintoModel, resultadoEmoModel, archiGoogleModel, fichaPersonalModel , 
    puestoIsoModel, capacitacionModel, capacitacionDetModel, paHeaderModel, paDetModel, numRechazadosModel } = require('../../db');

const { errorLogModel, tmp_updateUsuarioModel } = require('../../dbA');

const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

var _MODULO_LND = process.env.MODULO_LND;

// #####################################################
resultadoEmoModel.belongsTo(archiGoogleModel,{
	as : 'Detalle', foreignKey 	: 'id_archivo',targetKey: 'id',
});
// -----------------------------------------------------
capacitacionModel.belongsTo( capacitacionDetModel ,{
	as : 'DetCapa01', foreignKey 	: 'Codigo',targetKey: 'CodigoHead',
});
// -----------------------------------------------------
paHeaderModel.belongsTo(paDetModel,{
	as : 'DetPA01', foreignKey 	: 'IdPedAlmacenCab',targetKey: 'IdPedAlmacenCab',
});
// #####################################################



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await User.findAll({
        order : [
            ['id' , 'DESC']
        ],
        where : {
            TipoUsuario : { [Op.is] : null }
        },
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//                  BUSCAR OPERARIOS                    //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // dni, nombre, cliente, local, nombre, idPuesto
    var $response    = {};
    $response.estado = 'OK';
    $response.data   = [];
    $response.nodata = [];
    var $where = {};

    if( req.body.dni != '' ){
        // Buscamos por ID, buscamos uno por uno.
        var dataDNI = req.body.dni;
        var arDNI = dataDNI.split(',');
        
        for (let index = 0; index < arDNI.length; index++) {
            const _dni = arDNI[index];
            var dataOper = await User.findOne({
                where : {
                    dni : _dni
                }
            });
            if(! dataOper ){
                console.log(`No existe el dni: ${_dni}`);
                $response.nodata.push(_dni);
            }else{
                console.log(`Existe el dni: ${_dni}`);
                $response.data.push(dataOper);
            }
        }
        // var $arOSs = [];
		// var $IdOSs = req.body.dni;
		// $arOSs = $IdOSs.split(',');
        // $where.dni = $arOSs;
        // //
        // $response.data = await User.findAll({
        //     order : [
        //         ['name' , 'DESC']
        //     ],
        //     where : $where
        // });
        //
    }else{
        // Buscamos por nombre
        if( req.body.nombre )
        {
            $where.name = { [Op.like] : '%'+req.body.nombre+'%' }
        }
        if( req.body.cliente )
        {
            $where.cliente = req.body.cliente;
        }
        if( req.body.local )
        {
            $where.sucursal = req.body.local;
        }
        if( req.body.idPuesto ){
            $where.idPuestoIso = req.body.idPuesto;
        }
        //
        $response.data = await User.findAll({
            order : [
                ['name' , 'DESC']
            ],
            where : $where
        });
    }

    
    res.json( $response );
});


// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ENVIAR FIRMA                        //
//////////////////////////////////////////////////////////
router.post('/enviarFirma', async (req,res)=>{
    // dni, nombre, cliente, local, nombre, idPuesto
    var $response    = {};
    $response.estado = 'OK';
    var $celular;

    var $celular = req.body.celular;
    var $dni = req.body.dni;
   
    if($celular && $dni){
        
        var $usuario = await User.findOne({
            where : {
                dni : $dni
            }
        });

        var $numRechazado = await numRechazadosModel.findOne({
            where :{
                celular : $celular,
                Estado : 'Activo'
            }
        });
     
        if($numRechazado){    
            console.log('Número existe en la lista de rechazados');
        }else{          
            console.log('Número No existe en la lista de rechazados');
            
            var $url_firma = process.env.MODULO_LND+'datos_user/'+$usuario.uu_id;
        
            if( $celular.length == 9 )
            {
                const from = 'SSAYS SAC';
                var to   = '51'+$celular;

var texto1 = `
Departamento de RRHH SSAYS SAC,
Hola *${$usuario.name}*, Por favor ingresa a este enlace para completar tus datos: ${$url_firma}
Si no puede visualizar los links correctamente, por favor agrega este número a tus contactos,
Si consideras que esto es un error o ya no deseas que te enviemos mensajes por favor escribe la palabra *salir*. gracias por su atención.
`;
                    // Enviando texto
                    var _envioCel = await apiChatApi( 'sendMessage', { phone : to , body: texto1 });
            }
    
        }
    }else{
        $response.estado = 'NO';
    }
            
     
    
    
    res.json( $response);
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER LISTA                       //
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await User.findAll({
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
//                      AGREGAR CLASE       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('dni' ,'El DNI es obligatorio').not().isEmpty(),
    check('name' ,'El nombre es obligatorio').not().isEmpty(),
    check('idPuestoIso' ,'El nombre es obligatorio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
    // Sexo
    req.body.uu_id = await renovarToken();
    if(! req.body.fechanacimiento ){
        delete req.body.fechanacimiento;
    }
    if( req.body.cliente == '' ){
        delete req.body.cliente;
    }
    if( req.body.estado == '' ){
        req.body.estado = 'Activo';
    }
    if( req.body.sucursal == '' ){
        delete req.body.sucursal;
    }
    if( req.body.idPuestoIso == '' ){
        delete req.body.idPuestoIso;
    }
    if( req.body.id_centro_costo == '' ){
        delete req.body.id_centro_costo;
    }
    if( req.body.Fecha_Ingreso == '' ){
        delete req.body.Fecha_Ingreso;
    }
    if( req.body.Inicio_Contrato == '' ){
        delete req.body.Inicio_Contrato;
    }
    if( req.body.Fin_Contrato == '' ){
        delete req.body.Fin_Contrato;
    }
    if( req.body.IdSupervisor == '' ){
        delete req.body.IdSupervisor;
    }
    if( req.body.IdSupervisor != '' || req.body.IdSupervisor != null ){
        delete req.body.IdSupervisor;
    }
    req.body.password = 'SSAYS';
    req.body.source   = _NombreDoc;
    req.body.email = req.body.uu_id+'_'+req.body.dni+'@ssays.com.pe';
    req.body.api_token = await renovarToken();

	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioCreado = $userData.name;
    //
    $response.data = await User.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    var _dataGuardado = await User.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 5 );
        _Codigo = 'USR'+_Codigo;
        await User.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
    }

    $response.item = await User.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });


	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR OPERARIO                     //
//////////////////////////////////////////////////////////
router.post('/by_dni', async (req,res)=>{
    // dni
    var $response       = {};
    $response.estado    = 'OK';
    $response.data      = [];
    $response.locales   = [];
    $response.emo       = [];
    $response.fs        = [];
    $response.legajo    = [];

    var dataOper = await User.findOne({
        where : {
            dni : req.body.dni
        },
        attributes: {
            exclude: ['password','']
        }
    });
    $response.data = dataOper;
    // Locales...
    if( dataOper ){
        var sLocales = await sucursalModel.findAll({
            where : {
                IdClienteProv : $response.data.cliente,
                Estado : 1
            }
        });
        $response.locales = sLocales;
        // EMO/COVID
        var _Emo = await resultadoEmoModel.findAll({
            where : {
                dni : dataOper.dni
            },
            limit : 5,
            order : [[ 'id' , 'DESC' ]],
            include: [{
		        model: archiGoogleModel,
		        as: 'Detalle'
		    }]
        });
        $response.emo = _Emo;

        // Ficha sintoma
        $response.fs = await fichaSintoModel.findAll({
            where : {
                dni : dataOper.dni
            },
            limit : 5,
            order : [[ 'id' , 'DESC' ]]
        });
        // Legajos
        var fichaPersonal = await fichaPersonalModel.findOne({
            where : {
                dni : dataOper.dni
            }
        });
        $response.fichap = fichaPersonal;
        if( fichaPersonal ){
            $response.idFP = fichaPersonal.id;
            // Arhivos del legajo
            var _legajos = await archiGoogleModel.findAll({
                where : {
                    formulario  : 'FICHA_PERSONAL',
                    correlativo : fichaPersonal.id
                },
                order : [[ 'id' , 'DESC' ]]
            });
            $response.legajo = _legajos;
        }
    }

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR OPERARIO                     //
//////////////////////////////////////////////////////////
router.post('/by_id', async (req,res)=>{
    // id
    var $response       = {};
    $response.estado    = 'OK';
    $response.data      = [];
    $response.locales   = [];
    $response.emo       = [];
    $response.fs        = [];
    $response.legajo    = [];
    $response.puestoISO = [];

    var dataOper = await User.findOne({
        where : {
            id : req.body.id
        },
        attributes: {
            exclude: ['password','']
        }
    });
    $response.data = dataOper;
    
    if( dataOper ){
        // Puestos ISO
        if( dataOper.id_area ){
            $response.id_area = dataOper.id_area;
            var puestos = await puestoIsoModel.findAll({
                where : {
                    IdArea : dataOper.id_area
                }
            });
            $response.puestoISO = puestos;
        }
        // Locales...
        var sLocales = await sucursalModel.findAll({
            where : {
                IdClienteProv : $response.data.cliente,
                Estado : 1
            }
        });
        $response.locales = sLocales;
        // EMO/COVID
        var _Emo = await resultadoEmoModel.findAll({
            where : {
                dni : dataOper.dni
            },
            limit : 5,
            order : [[ 'id' , 'DESC' ]],
            include: [{
		        model: archiGoogleModel,
		        as: 'Detalle'
		    }]
        });
        $response.emo = _Emo;

        // Ficha sintoma
        $response.fs = await fichaSintoModel.findAll({
            where : {
                dni : dataOper.dni
            },
            limit : 5,
            order : [[ 'id' , 'DESC' ]]
        });
        // Legajos
        var fichaPersonal = await fichaPersonalModel.findOne({
            where : {
                dni : dataOper.dni
            }
        });
        $response.fichap = fichaPersonal;
        if( fichaPersonal ){
            $response.idFP = fichaPersonal.id;
            // Arhivos del legajo
            var _legajos = await archiGoogleModel.findAll({
                where : {
                    formulario  : 'FICHA_PERSONAL',
                    correlativo : fichaPersonal.id
                },
                order : [[ 'id' , 'DESC' ]]
            });
            $response.legajo = _legajos;
        }
        var _Capas = await capacitacionModel.findAll({
            order: [
                ['Codigo', 'DESC']
            ],
            where: {
                Estado : { [Op.in] : ['Aprobado','Iniciado','Finalizado'] }
            },
            include: [{
                model   : capacitacionDetModel,
                as      : 'DetCapa01',
                where   : {
                    IdColaborador : dataOper.dni
                }
            }]
        });
        $response.capas = _Capas;
    }

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR OPERARIO                     //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.locales = [];
    $response.emo = [];
    $response.fs    = [];

    var dataOper = await User.findOne({
        where : {
            uu_id : req.body.uuid
        },
        attributes: {
            exclude: ['password','']
        }
    });
    $response.data = dataOper;
    // Locales...
    if( dataOper ){
        var sLocales = await sucursalModel.findAll({
            where : {
                IdClienteProv : $response.data.cliente,
                Estado : 1
            }
        });
        $response.locales = sLocales;
        // EMO/COVID
        var _Emo = await resultadoEmoModel.findAll({
            where : {
                dni : dataOper.dni
            },
            limit : 5,
            order : [[ 'id' , 'DESC' ]],
            include: [{
		        model: archiGoogleModel,
		        as: 'Detalle'
		    }]
        });
        $response.emo = _Emo;

        // Ficha sintoma
        $response.fs = await fichaSintoModel.findAll({
            where : {
                dni : dataOper.dni
            },
            limit : 5,
            order : [[ 'id' , 'DESC' ]]
        });
        var _Capas = await capacitacionModel.findAll({
            order: [
                ['Codigo', 'DESC']
            ],
            where: {
                Estado : { [Op.in] : ['Aprobado','Iniciado','Finalizado'] }
            },
            include: [{
                model   : capacitacionDetModel,
                as      : 'DetCapa01',
                where   : {
                    IdColaborador : dataOper.dni
                }
            }]
        });
        $response.capas = _Capas;
    }

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//        OPERARIOS DE UN CLIENTE       //
//////////////////////////////////////////
router.post('/bycliente', async (req,res)=>{
    // cliente, local, horario
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await User.findAll({
        where : {
            cliente     : req.body.cliente ,
            sucursal    : req.body.local
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR BY DNI          //
//////////////////////////////////////////
router.post('/bydni', [
    check('idUser' ,'El DNI es obligatorio').not().isEmpty(),
], async (req,res)=>{
    // idUser
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }

    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    var $arOSs = [];
    var $IdOSs = req.body.idUser;
    $arOSs = $IdOSs.split(',');
    delete req.body.idUser;

	var r = await User.update(req.body,{
		where : { 
            dni : { [Op.in] : $arOSs }
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR BY DNI          //
//////////////////////////////////////////
router.post('/update_by_dni', [
    check('dni' ,'El DNI es obligatorio').not().isEmpty(),
], async (req,res)=>{
    // dni ...
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }

    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

	var r = await User.update(req.body,{
		where : { 
            dni : req.body.dni
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR OPERARIO          //
//////////////////////////////////////////
router.put('/:uuid', [
    check('dni' ,'El DNI es obligatorio').not().isEmpty(),
    check('name' ,'El nombre es obligatorio').not().isEmpty(),
    check('idPuestoIso' ,'Seleccione un puesto Iso').not().isEmpty(),
], async (req,res)=>{
    // uuid
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }

    if(! req.body.fechanacimiento ){
        delete req.body.fechanacimiento;
    }
    if( req.body.cliente == '' ){
        delete req.body.cliente;
    }
    if( req.body.estado == '' ){
        req.body.estado = 'Activo';
    }
    if( req.body.sucursal == '' ){
        delete req.body.sucursal;
    }
    if( req.body.idPuestoIso == '' ){
        delete req.body.idPuestoIso;
    }
    if( req.body.id_centro_costo == '' ){
        delete req.body.id_centro_costo;
    }
    if( req.body.Fecha_Ingreso == '' ){
        delete req.body.Fecha_Ingreso;
    }
    if( req.body.Inicio_Contrato == '' ){
        delete req.body.Inicio_Contrato;
    }
    if(! req.body.Fin_Contrato ){
        delete req.body.Fin_Contrato;
    }
    if(! req.body.IdSupervisor ){
        delete req.body.IdSupervisor;
    }

    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    var _Entidad = await User.findOne({
        where : {
            uu_id : req.params.uuid 
        }
    });
    if(! _Entidad )
    {
        var _Entidad = await User.findOne({
            where : {
                dni : req.body.dni
            }
        });
    }
        
    if( _Entidad )
    {
        req.body.UsuarioModificado = $userData.name;
        delete req.body.id;
        await User.update(req.body,{
            where : { 
                id : _Entidad.id
            }
        })
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
    }
    
        
    
    $response.item = await User.findOne({
        where : {
            uu_id : req.body.uu_id
        }
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

    // Auditoria
    delete req.body.UsuarioMod;
    // delete req.body.editado_por;
    req.body.UsuarioMod = $userData.name;

    $anuladoPor = $userData.name;

	await User.update({
        Estado      : 0,
        UsuarioMod  : $userData.dni,
        nombre_usuario  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await User.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await User.findAll({
        order : [
            ['Descripcion' , 'ASC']
        ]
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR CAPACITACIONES               //
//////////////////////////////////////////////////////////
router.post('/get_capas', async (req,res)=>{
    // dni
    var $response       = {};
    $response.estado    = 'OK';
    $response.data      = [];
    var _UserData = await getUserData( req.headers['api-token'] );
    //
    var _Data = await capacitacionModel.findAll({
        order: [
            ['Codigo', 'DESC']
        ],
        where: {
            Estado : { [Op.in] : ['Aprobado','Iniciado','Finalizado'] }
        },
        include: [{
            model   : capacitacionDetModel,
            as      : 'DetCapa01',
            where   : {
                IdColaborador : _UserData.dni,
                Puntuacion : { [Op.gte] : 14 }
            }
        }]
    });
    $response.data = _Data;
    //
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR PEDIDOS ALMACEN              //
//////////////////////////////////////////////////////////
router.post('/get_ped_almacen', async (req,res)=>{
    // dni
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    //
    var _Data = await paHeaderModel.findAll({
        order: [
            ['IdPedAlmacenCab', 'DESC']
        ],
        where: {
            Estado : { [Op.in] : ['Aprobado'] },
            Solicitante : req.body.dni
        },
        include: [{
            model: paDetModel,
            as: 'DetPA01',
        }]
    });
    //
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			IMPORTAR FROM XLS                   //
//////////////////////////////////////////////////////////
router.post('/importar_xls',async(req,res)=>{
    // IdFile, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var _dnis = [], _Token = req.body.Token;
    var _TokenUpdate = await renovarToken();
    $response.TokenUpdate = _TokenUpdate;
    //
    $response.ut = await getUserData( req.headers['api-token'] );

	var _Archivo = await archiGoogleModel.findOne({
        where : {
            id : req.body.IdFile
        }
    });
 
    $response.file = _Archivo;

    if( _Archivo ){
        varDump(`Archivo ${_Archivo.id} existe ${_Archivo.nombre_archivo}`);
        // Reading our test file
        const file = reader.readFile( _Archivo.ruta_fisica );
      
        let data = [];
        const sheets = file.SheetNames

        //varDump( sheets );
        for(let i = 0; i < sheets.length; i++)
        {
            // temp: obtiene del excel los datos del usuario 
            const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]); 
          
            await temp.forEach( async (res) => {
                //varDump(`DNI a procesar => ${res.DNI}.`);
                var _DNI = parseInt(res.DNI);
                if( res.DNI )
                {
                    // guardamos los datos del usuario en la variable _dataProk
                    var _dataProk = {
                        uu_id   : await renovarToken(),
                        Token   : _TokenUpdate,
                        DNI     : _DNI,
                        Nombre  : res.Nombre,
                        Paterno : res.Paterno,
                        Materno : res.Materno
                    };
                    if( res.Celular ){
                        _dataProk.Celular = res.Celular;
                    }
                    if( res.Correo ){
                        _dataProk.Correo = res.Correo;
                    }
                    await captueError( _dataProk , '' );
                    await tmp_updateUsuarioModel.create( _dataProk )
                    .catch(function (err) {
                        varDump(`Error al agregar al tmp DNI: ${res.DNI}.`);
                        console.log(_NombreDoc);
                        console.log(err);
                    });

                }
                /*
                    
                    //
                    var _usuario = await User.findOne({
                        attributes: [ 'id', 'uu_id', 'name', 'email', 'dni' ],
                        where : {
                            dni : _DNI
                        }
                    });
                    //
                    var _datUseUpdt = {};
                    //
                    _datUseUpdt.Flag = _Token;
                    _datUseUpdt.name = `${res.Paterno} ${res.Materno} ${res.Nombre}`;
                    _datUseUpdt.nombre    = res.Nombre;
                    _datUseUpdt.apellidop = res.Paterno;
                    _datUseUpdt.apellidom = res.Materno;
                    if( res.Celular ){
                        _datUseUpdt.celular = res.Celular;
                    }
                    if( res.Correo ){
                        _datUseUpdt.emailalternativo = res.Correo;
                    }
                    await captueError(`DNI: ${_DNI} Nombre: ${res.Nombre}, Paterno: ${res.Paterno}, Materno: ${res.Materno}.`);
                    //
                    if( _usuario )
                    {
                        await captueError( `DNI: ${res.DNI} existe con id: ${_usuario.id}; Nombre: ${res.Nombre}, Paterno: ${res.Paterno}, Materno: ${res.Materno}.` , '' );
                        //varDump(`DNI: ${res.DNI} existe con id: ${_usuario.id}.`);
                        // Actualizamos data de usuario
                        _datUseUpdt.uu_id = await renovarToken();
                        //varDump( _datUseUpdt );
                        var _uopU = await User.update(_datUseUpdt , {
                            where : {
                                dni : _usuario.dni
                            }
                        })
                        .catch(function (err) {
                            varDump(`Error al actualizar DNI: ${res.DNI}.`);
                            console.log(_NombreDoc);
                            console.log(err);
                        });
                        varDump( _uopU );
                    }else{
                        // Agregamos el usuario
                        _datUseUpdt.email    = await renovarToken()+'@ssays.com.pe';
                        _datUseUpdt.uu_id    = await renovarToken();
                        _datUseUpdt.password = 'FROM_XLS';
                        _datUseUpdt.dni      = res.DNI;
                        //varDump( _datUseUpdt );
                        await User.create( _datUseUpdt )
                        .catch(function (err) {
                            varDump(`Error al crear DNI: ${res.DNI}.`);
                            console.log(_NombreDoc);
                            console.log(err);
                        });
                    }
                    //_dnis.push( res.DNI );
                }
                /**/
            })
        }
        //
        $response.token = _Archivo.token;
        //
        var UsersAfectados = await User.findAll({
            where : {
                Flag : _Token
            }
        });
        if( UsersAfectados )
        {
            for (let index = 0; index < UsersAfectados.length; index++) {
                const rs = UsersAfectados[index];
                _dnis.push( rs.dni );
            }
        }
    }
    //

    //
    $response.dnis = _dnis.join(',');

    res.json( $response );
    //
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//          CARGAR XLS SOLO ESOS TIPOS DE ARCHIVOS      //
//////////////////////////////////////////////////////////
router.post('/importar_xlsx', async (req,res)=>{
    // ####### DEPRECADO ######
    // IdFile, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _dnis = [], _Token = req.body.Token;
    //
    $response.ut = await getUserData( req.headers['api-token'] );

	var _Archivo = await archiGoogleModel.findOne({
        where : {
            id : req.body.IdFile
        }
    });

    $response.file = _Archivo;

    if( _Archivo ){
        varDump(`Archivo ${_Archivo.id} existe ${_Archivo.nombre_archivo}`);
        // Reading our test file
        const _RutaArchivo = _Archivo.ruta_fisica;

        // File path.
        readXlsxFile( _RutaArchivo ).then((rows , errors ) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            varDump( rows[0] );
            rows[0].forEach( async (res) => {
                varDump( res );
            });
        });
        // OTRO

        // Reading our test file
        const file = reader.readFile( _RutaArchivo )
        
        let data = []
        
        const sheets = file.SheetNames
        
        for(let i = 0; i < sheets.length; i++)
        {
            const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]])
            temp.forEach((res) => {
                data.push(res)
            })
        }
        
        // Printing data
       

    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//       PROCESAR LISTA TMP GENERADA DESDE EL EXCEL     //
//////////////////////////////////////////////////////////
router.post('/procesar_tmp', async (req,res)=>{
    // Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _DataTMP = await tmp_updateUsuarioModel.findAll({
        where : {
            Token  : req.body.Token ,
            Estado : 'Pendiente'
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage; res.json( $response );
    });

    varDump(`Vamos a procesar: ${_DataTMP.length} registros tmp: ${req.body.Token}`);

    if( _DataTMP )
    {
        for (let index = 0; index < _DataTMP.length; index++) {
            const _rs = _DataTMP[index];
            // Existe¿?
            var _Usuario = await User.findOne({
                attributes: [ 'id', 'uu_id', 'name', 'email', 'dni' ],
                where : {
                    dni : _rs.DNI
                }
            });
            // Actualizar usuario
            var _datUseUpdt  = {};
            _datUseUpdt.Flag = req.body.Token;
            _datUseUpdt.name = `${_rs.Paterno} ${_rs.Materno} ${_rs.Nombre}`;
            _datUseUpdt.nombre    = _rs.Nombre;
            _datUseUpdt.apellidop = _rs.Paterno;
            _datUseUpdt.apellidom = _rs.Materno;
            _datUseUpdt.source    = _NombreDoc;
            if( _Usuario )
            {
                if( _rs.Celular ){
                    _datUseUpdt.celular = _rs.Celular;
                }
                if( _rs.Correo ){
                    _datUseUpdt.emailalternativo = _rs.Correo;
                }
                //
                var _uopU = await User.update(_datUseUpdt , {
                    where : {
                        dni : _rs.DNI
                    }
                })
                .catch(function (err) {
                    varDump(`Error al actualizar DNI: ${_rs.DNI}.`);
                    console.log(_NombreDoc);
                    console.log(err);
                });
                //
            }else{
                // Agregamos el usuario
                _datUseUpdt.email    = await renovarToken()+`_${_rs.DNI}@ssays.com.pe`;
                _datUseUpdt.uu_id    = await renovarToken();
                _datUseUpdt.password = 'FROM_XLS';
                _datUseUpdt.dni      = _rs.DNI;
                //varDump( _datUseUpdt );
                await User.create( _datUseUpdt )
                .catch(function (err) {
                    varDump(`Error al crear DNI: ${_rs.DNI}.`);
                    console.log(_NombreDoc);
                    console.log(err);
                });
            }
            // Marcamos como procesado
            await tmp_updateUsuarioModel.update({
                Estado : 'Procesado'
            },{
                where : {
                    id : _rs.id
                }
            });
        }
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//               IMPORTAR FROM XLS VERSION 2            //
//////////////////////////////////////////////////////////
router.post('/importar_xls_2',async(req,res)=>{
    // Incuye puesto y turno
    // IdFile, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var _dnis = [], _Token = req.body.Token;
    var _TokenUpdate = await renovarToken();
    $response.TokenUpdate = _TokenUpdate;
    //
    $response.ut = await getUserData( req.headers['api-token'] );

	var _Archivo = await archiGoogleModel.findOne({
        where : {
            id : req.body.IdFile
        }
    });

    $response.file = _Archivo;

    if( _Archivo ){
        varDump(`Archivo ${_Archivo.id} existe ${_Archivo.nombre_archivo}`);
        // Reading our test file
        const file = reader.readFile( _Archivo.ruta_fisica );
        let data = [];
        const sheets = file.SheetNames
        //varDump( sheets );
        for(let i = 0; i < sheets.length; i++)
        {
            const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]]);
                //varDump(temp);
            await temp.forEach( async (res) => {
                //varDump(`DNI a procesar => ${res.DNI}.`);
                var _DNI = parseInt(res.DNI);
                if( res.DNI )
                {
                    var _dataProk = {
                        uu_id   : await renovarToken(),
                        Token   : _TokenUpdate,
                        DNI     : _DNI,
                        Nombre  : res.Nombre,
                        Paterno : res.Paterno,
                        Materno : res.Materno
                    };
                    if( res.Turno ){
                        _dataProk.Turno = res.Turno;
                    }
                    if( res.Puesto ){
                        _dataProk.Puesto = res.Puesto;
                    }
                    if( res.Celular ){
                        _dataProk.Celular = res.Celular;
                    }
                    if( res.Correo ){
                        _dataProk.Correo = res.Correo;
                    }
                    await captueError( _dataProk , '' );
                    await tmp_updateUsuarioModel.create( _dataProk )
                    .catch(function (err) {
                        varDump(`Error al agregar al tmp DNI: ${res.DNI}.`);
                        console.log(_NombreDoc);
                        console.log(err);
                    });

                }
            })
        }
        //
        $response.token = _Archivo.token;
        //
    }
    //
    varDump(`Se terminó la carga de DNI por excel.`);
    //
    $response.dnis = _dnis.join(',');
    res.json( $response );
    //
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
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
async function captueError( error , post )
{
    var _envio       = JSON.stringify(post);
    var _descripcion = JSON.stringify(error);
    var _uuid = await renovarToken();
    await errorLogModel.create({
        uu_id : _uuid,
        modulo : _NombreDoc,
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
