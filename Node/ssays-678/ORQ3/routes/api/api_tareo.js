
// api_tareo.js

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
const { tareoModel, User, tareoDetalle3Model, tareoSubModel, turnoCabModel, sequelize, sucursalModel } = require('../../db');


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
tareoDetalle3Model.belongsTo(tareoSubModel,{
	as : 'DetTar3', foreignKey 	: 'id',targetKey: 'IdDetTareo',
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await tareoModel.findAll({
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
        $response.data = await tareoModel.findAll({
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
        $response.data = await tareoModel.findAll({
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

	$response.data = await tareoModel.findAll({
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
    check('IdCliente' ,'Seleccione Cliente').not().isEmpty(),
    check('IdLocal'   ,'Seleccione Local').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
    var _ArMeses = [0,"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    if(! req.body.IdArea ){
        delete req.body.IdArea;
    }
    req.body.IdSupervisor = $userData.dni;
    req.body.Supervisor   = $userData.name;
    // Año - Mes
    // var _FeCha    = req.body.Fecha;
    // var _ArFecha  = _FeCha.split('-');
    // var _Mes      = parseInt( _ArFecha[1] );
    // req.body.Mes  = _ArMeses[_Mes];
    // req.body.Anio = _ArFecha[0];
    //
    await tareoModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await tareoModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 5 );
        _Codigo = 'TAR'+_Codigo;
        await tareoModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
        // Unir detalle
        await tareoDetalle3Model.update({
            CodigoHeader : _Codigo,
            IdTareo      : _dataGuardado.id
        },{
            where : {
                Token : req.body.uu_id
            }
        });
    }

    $response.item = await tareoModel.findOne({
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
    // uuid, Dia
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.deta = [];

    _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];
    var _Dia = 'Dia'+await pad_with_zeroes( req.body.Dia , 2 );
    _Atributos.push([ _Dia, 'Dia']);

    //  Data entidad
    var _Entidad = await tareoModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = _Entidad;
    if( _Entidad ){
        // Cargar detalle
        var _Detalle = await tareoDetalle3Model.findAll({
            attributes : _Atributos,
            order : [
                [ 'Nombre' , 'DESC' ]
            ],
            where : {
                CodigoHeader : _Entidad.Codigo
            },
            include: [{
                model : tareoSubModel,
                as    : 'DetTar3',
                where : {
                    'NroDia' : _Dia
                }
            }]
        });
        $response.deta = _Detalle;
        // Sucursal
        var _Sucursal = await sucursalModel.findAll({
            where : {
                Estado : 1,
                IdClienteProv : _Entidad.IdCliente
            }
        });
        $response.local = _Sucursal;
        // Turno
        var _Turnos = await turnoCabModel.findAll({
            where : {
                Estado      : 'ACTIVO',
                IdCliente   : _Entidad.IdCliente,
                IdLocal     : _Entidad.IdLocal            }
        });
        $response.turno = _Turnos;
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//           CARGAR COMENTARIO OPERARIO                 //
//////////////////////////////////////////////////////////
router.post('/get/comentario', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.deta = [];

    var _Entidad = await tareoDetalle3Model.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = _Entidad;
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//           GUARDAR COMENTARIO OPERARIO                //
//////////////////////////////////////////////////////////
router.post('/set/comentario', async (req,res)=>{
    // uuid, glosa, Dia, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.deta = [];

    _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];

    //var _Dia = 'Dia'+await pad_with_zeroes( req.body.Dia , 2 );
    //_Atributos.push([ _Dia, 'Dia']);

    await tareoDetalle3Model.update({
        Glosa : req.body.glosa
    },{
        where : {
            uu_id : req.body.uuid
        }
    });
    var _Entidad = await tareoDetalle3Model.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.item = _Entidad;

    //

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              AGREGAR PERSONAL OPERARIO               //
//////////////////////////////////////////////////////////
router.post('/add/personal',  [
    check('dni' ,'Seleccione trabajador').not().isEmpty(),
    //check('IdTurno'   ,'Seleccione un turno').not().isEmpty(),
    check('puesto'   ,'Ingresa un puesto').not().isEmpty(),
], async (req,res)=>{
    // dni, nombre, puesto, glosa, Token, IdTareo, Codigo
    // -> IdTurno, Dia

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.deta = [];

    _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];

    //var _Dia = 'Dia'+await pad_with_zeroes( req.body.Dia , 2 );
    //_Atributos.push([ _Dia, 'Dia']);

    /*var _dataTurno = await turnoCabModel.findOne({
        where : {
            id : req.body.IdTurno
        }
    });*/

    // Existe¿?
    var _ExisteOper = await tareoDetalle3Model.findOne({
        where : {
            DNI   : req.body.dni ,
            Token : req.body.Token
        }
    });
    if( _ExisteOper ){
        $response.estado = 'ERROR';
        $response.error  = 'El personal ya existe en la lista';
    }else{
        // Agregamos al personal...
        var _dataInsertar     = {};
        _dataInsertar.uu_id   = await renovarToken();
        _dataInsertar.Token   = req.body.Token;
        _dataInsertar.DNI     = req.body.dni;
        _dataInsertar.Nombre  = req.body.nombre;
        _dataInsertar.Cargo   = req.body.puesto;
        _dataInsertar.Glosa   = req.body.glosa;
        if( req.body.IdTareo ){
            _dataInsertar.IdTareo = req.body.IdTareo;
        }
        _dataInsertar.CodigoHeader = req.body.Codigo;
        await tareoDetalle3Model.create(_dataInsertar)
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        //await sequelize.query(`UPDATE orq_tareo_detalle3 SET ${_Dia}= '${_dataTurno.Nombre}' WHERE uu_id='${_dataInsertar.uu_id}';`);
        var _dataSubTareo3 = await tareoDetalle3Model.findOne({
            where :{
                uu_id : _dataInsertar.uu_id
            }
        })
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        // El sub detalle de Tareo
        var _Fecha = moment().format('YYYY-MM-DD');
        if( _dataSubTareo3 ){
            //if( _dataTurno ){
                for (let index = 1; index < 32; index++) {
                    var _tmpDia = 'Dia'+await pad_with_zeroes( index , 2 );
                    var _insertSub        = {};
                    //var _Inicio           = _dataTurno.Inicio;
                    //var _Fin              = _dataTurno.Fin;
                    _insertSub.uu_id      = await renovarToken();
                    _insertSub.IdDetTareo = _dataSubTareo3.id;
                    _insertSub.NroDia     = _tmpDia;
                    _insertSub.Estado     = 'N/D';
                    await tareoSubModel.create( _insertSub )
                    .catch(function (err) {
                        $response.estado = 'ERROR';
                        $response.error  = err.original.sqlMessage;
                        res.json( $response );
                    });
                }// For dias
                // Actualizamos día actual
                //var now   = moment( `${_Fecha} ${_Inicio}` ).format('YYYY-MM-DD HH:mm');
                //var then  = moment( `${_Fecha } ${_Fin}` ).format('YYYY-MM-DD HH:mm');
                //var NroHoras = moment.utc( moment(then,"YYYY-MM-DD HH:mm").diff(moment(now,"YYYY-MM-DD HH:mm")) ).format("HH:mm");
                //console.log(`Hora laboradas ${NroHoras}.`);
                /*await tareoSubModel.update({
                    NroHoras : NroHoras,
                    Estado   : 'A Tiempo',
                    IdTurno  : _dataTurno.id,
                    Turno    : _dataTurno.Nombre,
                    Inicio   : _dataTurno.Inicio,
                    Fin      : _dataTurno.Fin,
                },{
                    where : {
                        IdDetTareo : _dataSubTareo3.id,
                        NroDia : _Dia
                    }
                });*/
            //}
        }
    }

    /*$response.data = await tareoDetalle3Model.findAll({
        attributes : _Atributos,
        order : [
            [ 'Nombre' , 'DESC' ]
        ],
        where : {
            Token : req.body.Token
        },
        include: [{
            model : tareoSubModel,
            as    : 'DetTar3',
            where : {
                'NroDia' : _Dia
            }
        }]
    });*/

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                ELIMINAR PERSONAL OPERARIO            //
//////////////////////////////////////////////////////////
router.post('/del/personal', async (req,res)=>{
    // uuid, Token, Dia

    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];
    var _Dia = 'Dia'+await pad_with_zeroes( req.body.Dia , 2 );
    _Atributos.push([ _Dia, 'Dia']);
    
    // Eliminar marca del día.
    await sequelize.query(`UPDATE orq_tareo_detalle3 SET ${_Dia}= 'X' WHERE uu_id='${req.body.uuid}';`);

    $response.data = await tareoDetalle3Model.findAll({
        attributes : _Atributos,
        order : [
            [ 'Nombre' , 'DESC' ]
        ],
        where : {
            Token : req.body.Token
        },
        include: [{
            model : tareoSubModel,
            as    : 'DetTar3',
            where : {
                'NroDia' : _Dia
            }
        }]
    });
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('IdCliente' ,'Seleccione Cliente').not().isEmpty(),
    check('IdLocal'   ,'Seleccione Local').not().isEmpty(),
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
    var _ID = req.body.id;
    delete req.body.id;
    if(! req.body.IdArea )
    {
        delete req.body.IdArea;
    }
	await tareoModel.update(req.body,{
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

    // Unir detalle
    await tareoDetalle3Model.update({
        IdTareo : _ID ,
        CodigoHeader : req.body.Codigo
    },{
        where : {
            Token : req.body.uu_id
        }
    });
    
    $response.item = await tareoModel.findOne({
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

    // Auditoria
    req.body.DNIAnulado = $userData.dni;
    req.body.AnuladoPor = $userData.name;

    $anuladoPor = $userData.name;

	await tareoModel.update({
        Estado      : 'Anulado',
        DNIAnulado  : $userData.dni,
        AnuladoPor  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await tareoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//       CARGAR OPERARIOS CLIENTE / LOCAL (SOLO VER)     //
//////////////////////////////////////////////////////////
router.post('/ver/personal', async (req,res)=>{
    // IdCli, IdLocal, IdArea
    var $response = {}, _whereUsuario = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.deta = [];

    _whereUsuario.estado = 1;
    _whereUsuario.dni    = { [Op.gt] : 0 };
    _whereUsuario.cliente   = req.body.IdCli;
    _whereUsuario.sucursal  = req.body.IdLocal;
    if( req.body.IdArea ){
        _whereUsuario.id_area = req.body.IdArea;
    }

    var _Operarios = await User.findAll({
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular','idPuestoIso','puestoiso'],
        where : _whereUsuario
    });

    $response.data = _Operarios;
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//           CARGAR OPERARIOS CLIENTE / LOCAL           //
//////////////////////////////////////////////////////////
router.post('/get/operarios/local', async (req,res)=>{
    // IdCli , IdLocal, Token, IdArea
    // -> IdTurno, Dia, Turno

    var $response = {}, _whereUsuario = {};
    $response.estado = 'OK';
    $response.data = [];
    _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];

    var _Dia = 'Dia'+await pad_with_zeroes( req.body.Dia , 2 );
    _Atributos.push([ _Dia, 'Dia']);

    /*var _dataTurno = await turnoCabModel.findOne({
        where : {
            id : req.body.IdTurno
        }
    });*/

    _whereUsuario.estado = 1;
    _whereUsuario.dni    = { [Op.gt] : 0 };
    _whereUsuario.cliente   = req.body.IdCli;
    _whereUsuario.sucursal  = req.body.IdLocal;
    if( req.body.IdArea ){
        _whereUsuario.id_area = req.body.IdArea;
    }
    console.log(_whereUsuario);
    var _Operarios = await User.findAll({
        where : _whereUsuario
    });
    if( _Operarios ){
        console.log(`Creando tareo de operarios => ${_Operarios.length}.`);
        for (let index = 0; index < _Operarios.length; index++) {
            const _UserOP = _Operarios[index];
            var _dataInsertar   = {};
            _dataInsertar.uu_id = await renovarToken();
            _dataInsertar.Token = req.body.Token;
            _dataInsertar.DNI   = _UserOP.dni;
            _dataInsertar.Nombre    = _UserOP.name;
            _dataInsertar.Cargo     = _UserOP.puestoiso;
            await tareoDetalle3Model.create(_dataInsertar)
            .catch(function (err) {
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
            // await sequelize.query(`UPDATE orq_tareo_detalle3 SET ${_Dia}= '${_dataTurno.Nombre}' WHERE uu_id='${_dataInsertar.uu_id}';`);
            var _dataSubTareo3 = await tareoDetalle3Model.findOne({
                where :{
                    uu_id : _dataInsertar.uu_id
                }
            })
            .catch(function (err) {
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
            console.log(`Creando data de: ${_UserOP.name}.`);
            // El sub detalle de Tareo
            var _Fecha = moment().format('YYYY-MM-DD');
            if( _dataSubTareo3 ){
                //if( _dataTurno ){
                    for (let index = 1; index < 32; index++) {
                        var _tmpDia = 'Dia'+await pad_with_zeroes( index , 2 );
                        var _insertSub        = {};
                        //var _Inicio           = _dataTurno.Inicio;
                        //var _Fin              = _dataTurno.Fin;
                        _insertSub.uu_id      = await renovarToken();
                        _insertSub.IdDetTareo = _dataSubTareo3.id;
                        //_insertSub.IdTurno    = _dataTurno.id;
                        //_insertSub.Turno      = _dataTurno.Nombre;
                        //_insertSub.Inicio     = _dataTurno.Inicio;
                        //_insertSub.Fin        = _dataTurno.Fin;
                        _insertSub.NroDia     = _tmpDia;
                        _insertSub.Estado     = 'N/D';
                        await tareoSubModel.create( _insertSub )
                        .catch(function (err) {
                            $response.estado = 'ERROR';
                            $response.error  = err.original.sqlMessage;
                            res.json( $response );
                        });
                    }// For dias
                    // Actualizamos día actual
                    //var now   = moment( `${_Fecha} ${_Inicio}` ).format('YYYY-MM-DD HH:mm');
                    //var then  = moment( `${_Fecha } ${_Fin}` ).format('YYYY-MM-DD HH:mm');
                    //var NroHoras = moment.utc( moment(then,"YYYY-MM-DD HH:mm").diff(moment(now,"YYYY-MM-DD HH:mm")) ).format("HH:mm");
                    //console.log(`Hora laboradas ${NroHoras}.`);
                    /*await tareoSubModel.update({
                        NroHoras : NroHoras,
                        Estado   : 'A Tiempo',
                        IdTurno  : _dataTurno.id,
                        Turno    : _dataTurno.Nombre,
                        Inicio   : _dataTurno.Inicio,
                        Fin      : _dataTurno.Fin,
                    },{
                        where : {
                            IdDetTareo : _dataSubTareo3.id,
                            NroDia : _Dia
                        }
                    });*/
                //}
            }
        }
    }
    /*$response.data = await tareoDetalle3Model.findAll({
        attributes : _Atributos,
        order : [
            [ 'Nombre' , 'DESC' ]
        ],
        where : {
            Token : req.body.Token
        },
        include: [{
            model : tareoSubModel,
            as    : 'DetTar3',
            where : {
                'NroDia' : _Dia
            }
        }]
    });*/

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ESTABLECER TURNO                    //
//////////////////////////////////////////////////////////
router.post('/set/turno', async (req,res)=>{
    // Ids (,), IdTurno, Turno, Dia, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];
    var _Dia = 'Dia'+await pad_with_zeroes( req.body.Dia , 2 );
    _Atributos.push([ _Dia, 'Dia']);

    var $ids = req.body.Ids;
	var _arIds = $ids.split(',');
    var _Fecha = moment().format('YYYY-MM-DD');

    var _dataTurno = await turnoCabModel.findOne({
        where : {
            id : req.body.IdTurno
        }
    });
    var _Inicio = _dataTurno.Inicio;
    var _Fin    = _dataTurno.Fin;

    for (let index = 0; index < _arIds.length; index++)
    {
        const _IdSD = _arIds[index];
        console.log(`--->${_IdSD}`);
        var now   = moment( `${_Fecha} ${_Inicio}` ).format('YYYY-MM-DD HH:mm');
        var then  = moment( `${_Fecha } ${_Fin}` ).format('YYYY-MM-DD HH:mm');
        var NroHoras = moment.utc( moment(then,"YYYY-MM-DD HH:mm").diff(moment(now,"YYYY-MM-DD HH:mm")) ).format("HH:mm");
        await tareoSubModel.update({
            IdTurno : _dataTurno.id,
            Turno   : _dataTurno.Nombre,
            Inicio  : _dataTurno.Inicio,
            Fin     : _dataTurno.Fin,
            NroHoras: NroHoras
        },{
            where : {
                IdDetTareo : _IdSD,
                NroDia : _Dia
            }
        });
        await tareoDetalle3Model.update({
            IdTurno : _dataTurno.id,
            Turno   : _dataTurno.Nombre
        },{
            where : {
                id     : _IdSD,
            }
        });
        // Actualizar nombre de tareo
        await sequelize.query(`UPDATE orq_tareo_detalle3 SET ${_Dia}= '${_dataTurno.Nombre}' WHERE id=${_IdSD};`);
    }

    $response.data = await tareoDetalle3Model.findAll({
        attributes : _Atributos,
        order : [
            [ 'Nombre' , 'DESC' ]
        ],
        where : {
            Token : req.body.Token
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DETALLE 3                    //
//////////////////////////////////////////////////////////
router.post('/get/detalle', async (req,res)=>{
    // IdDet3
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];
    var _Dia = 'Dia'+await pad_with_zeroes( req.body.Dia , 2 );
    _Atributos.push([ _Dia, 'Dia']);

    $response.data = await tareoDetalle3Model.findOne({
        attributes : _Atributos,
        where : {
            id : req.body.IdDet3
        },
        include: [{
            model : tareoSubModel,
            as    : 'DetTar3',
            where : {
                NroDia : _Dia
            }
        }]
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ESTABLECER Estado                   //
//////////////////////////////////////////////////////////
router.post('/set/estado', async (req,res)=>{
    // Ids(,), Estado, CodEstado, Dia, Token, HInicio, HFin
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];
    var _Dia = 'Dia'+await pad_with_zeroes( req.body.Dia , 2 );
    _Atributos.push([ _Dia, 'Dia']);
    var $ids = req.body.Ids;
	var _arIds = $ids.split(',');
    var _Fecha = moment().format('YYYY-MM-DD'), _Inicio = req.body.HInicio, _Fin = req.body.HFin;
    // Codios de turnos especiales donde se coloca la sumatoria de horas en lugar de solo el codigo
    var _ArCodigosEsp = [ 'DT' , 'SA' ];

    for (let index = 0; index < _arIds.length; index++)
    {
        // Vamos a recibir la HInicio y la HFin en base a eso calculamos el Nro de Horas trabajadas...
        const _IdSD = _arIds[index];
        console.log(`--->${_IdSD}`);
        var _NroHoras = '08:00', _HInicio = '', _HFin = '';
        //
        if( _ArCodigosEsp.includes(req.body.CodEstado) ){
            if( _Inicio && _Fin )
            {
                _HInicio  = _Inicio;
                _HFin     = _Fin;
                var now   = moment( `${_Fecha} ${_Inicio}` ).format('YYYY-MM-DD HH:mm');
                var then  = moment( `${_Fecha } ${_Fin}` ).format('YYYY-MM-DD HH:mm');
                _NroHoras = moment.utc( moment(then,"YYYY-MM-DD HH:mm").diff(moment(now,"YYYY-MM-DD HH:mm")) ).format("HH:mm");
            }
        }
        //
        await tareoSubModel.update({
            IdTurno : 0,
            Turno   : '',
            Inicio  : _HInicio,
            Fin     : _HFin,
            NroHoras: _NroHoras,
            Estado    : req.body.Estado,
            CodEstado : req.body.CodEstado,
        },{
            where : {
                IdDetTareo : _IdSD,
                NroDia : _Dia
            }
        });
        await tareoDetalle3Model.update({
            IdTurno : 0,
            Turno   : req.body.CodEstado
        },{
            where : {
                id : _IdSD
            }
        });
        // Actualizar nombre de tareo
        await sequelize.query(`UPDATE orq_tareo_detalle3 SET ${_Dia}= '${req.body.CodEstado}' WHERE id=${_IdSD} ;`);
    }

    $response.data = await tareoDetalle3Model.findAll({
        attributes : _Atributos,
        order : [
            [ 'Nombre' , 'DESC' ]
        ],
        where : {
            Token : req.body.Token
        },
        include: [{
            model : tareoSubModel,
            as    : 'DetTar3',
            where : {
                NroDia : _Dia
            }
        }]
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CAMBIO DE DIA                       //
//////////////////////////////////////////////////////////
router.post('/data/dia', async (req,res)=>{
    // Token , Dia
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];
    var _Dia = 'Dia'+await pad_with_zeroes( req.body.Dia , 2 );
    _Atributos.push([ _Dia, 'Dia']);

    $response.data = await tareoDetalle3Model.findAll({
        attributes : _Atributos,
        order : [
            [ 'Nombre' , 'DESC' ]
        ],
        where : {
            Token : req.body.Token
        },
        include: [{
            model : tareoSubModel,
            as    : 'DetTar3',
            where : {
                NroDia : _Dia
            }
        }]
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  RANGO FECHAS                        //
//////////////////////////////////////////////////////////
router.post('/data/fechas', async (req,res)=>{
    // Token , Inicio, Fin
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var a = moment( req.body.Inicio );
    var b = moment( req.body.Fin );
    var _diff = b.diff( a , 'days' );
    $response.diff = _diff;

    _Atributos = [ 'id', 'uu_id', 'DNI','Nombre','Glosa' ], _colsTabla = [];

    for (let index = 0; index <= _diff; index++) {

        var new_date = moment( req.body.Inicio ).add( index , 'days');
        var day = new_date.format('DD');
        var month = new_date.format('MM');
        var year = new_date.format('YYYY');
        //

        var _Dia = 'Dia'+day;//await pad_with_zeroes( req.body.Dia , 2 );
        _Atributos.push([ _Dia, 'Dia'+index ]);
        _colsTabla.push( day );

    }

    varDump(_Atributos);
    $response.cols = _colsTabla;
        

    /**/
    $response.data = await tareoDetalle3Model.findAll({
        attributes : _Atributos,
        order : [
            [ 'Nombre' , 'DESC' ]
        ],
        where : {
            Token : req.body.Token
        },
        include: [{
            model : tareoSubModel,
            as    : 'DetTar3',
            where : {
                NroDia : _Dia
            }
        }]
    });
    /**/
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  FILTRO DE OPERARIOS                 //
//////////////////////////////////////////////////////////
router.post('/data/filtro', async (req,res)=>{
    // Token , Dia, dnis
    var $response = {}, _where1 = {}, _where2 = {};
    $response.estado = 'OK';
    $response.data = [];

    _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];
    var _Dia = 'Dia'+await pad_with_zeroes( req.body.Dia , 2 );
    _Atributos.push([ _Dia, 'Dia']);

    _where1.Token = req.body.Token;

    _where2.NroDia = _Dia;

    if( req.body.dnis ){
        var $ids = req.body.dnis;
        var _arIds = $ids.split(',');
        _where1.DNI = { [Op.in] : _arIds };
    }

    $response.data = await tareoDetalle3Model.findAll({
        attributes : _Atributos,
        order : [
            [ 'Nombre' , 'DESC' ]
        ],
        where : _where1,
        include: [{
            model : tareoSubModel,
            as    : 'DetTar3',
            where : _where2
        }]
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

//////////////////////////////////////////////////////////
//                ESTABLECER TURNO 2022                 //
//////////////////////////////////////////////////////////
router.post('/set/turno22', async (req,res)=>{
    // Ids_Dia(,) , IdTurno, Turno, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    /**/
    // Desglosamos
    var Ids_Dia = req.body.Ids_Dia;
    var _arData = Ids_Dia.split(','), _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];
    var _dataTurno = await turnoCabModel.findOne({
        where : {
            id : req.body.IdTurno
        }
    });
    var _Inicio = _dataTurno.Inicio;
    var _Fin    = _dataTurno.Fin;
    var _Fecha  = moment().format('YYYY-MM-DD');

    for (let index = 0; index < _arData.length; index++) {
        const _LineaIn  = _arData[index];
        varDump( _LineaIn );
        var _arLineaIn  = _LineaIn.split('_');
        const _Dia      = _arLineaIn[1];
        const _IdSD     = _arLineaIn[0];
        _Atributos.push( [ _Dia , 'Dia' ] );
        //
        console.log(`Id ==>${_IdSD}, dia ==> ${_Dia}`);
        var now   = moment( `${_Fecha} ${_Inicio}` ).format('YYYY-MM-DD HH:mm');
        var then  = moment( `${_Fecha } ${_Fin}` ).format('YYYY-MM-DD HH:mm');
        var NroHoras = moment.utc( moment(then,"YYYY-MM-DD HH:mm").diff(moment(now,"YYYY-MM-DD HH:mm")) ).format("HH:mm");
        await tareoSubModel.update({
            IdTurno : _dataTurno.id,
            Turno   : _dataTurno.Nombre,
            Inicio  : _dataTurno.Inicio,
            Fin     : _dataTurno.Fin,
            NroHoras: NroHoras
        },{
            where : {
                IdDetTareo : _IdSD,
                NroDia : `Dia${_Dia}`
            }
        });
        await tareoDetalle3Model.update({
            IdTurno : _dataTurno.id,
            Turno   : _dataTurno.Nombre
        },{
            where : {
                id     : _IdSD,
            }
        });
        // Actualizar nombre de tareo
        await sequelize.query(`UPDATE orq_tareo_detalle3 SET Dia${_Dia}= '${_dataTurno.Nombre}' WHERE id=${_IdSD};`);
        //
    }

    /**/
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ESTABLECER Estado                   //
//////////////////////////////////////////////////////////
router.post('/set/estado22', async (req,res)=>{
    // Id_Dia(,), Estado, CodEstado, Token, HInicio, HFin
    var $response       = {};
    $response.estado    = 'OK';
    $response.data      = [];
    
    /**/

    // Desglosamos
    var Ids_Dia = req.body.Ids_Dia;
    var _arData = Ids_Dia.split(','), _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];
    var _Fecha = moment().format('YYYY-MM-DD'), _Inicio = req.body.HInicio, _Fin = req.body.HFin;
    // Codios de turnos especiales donde se coloca la sumatoria de horas en lugar de solo el codigo
    var _ArCodigosEsp = [ 'DT' , 'SA' ];

    for (let index = 0; index < _arData.length; index++) {
        const _LineaIn  = _arData[index];
        var _arLineaIn  = _LineaIn.split('_');
        const _Dia      = _arLineaIn[1];
        const _IdSD     = _arLineaIn[0];
        _Atributos.push([ _Dia, 'Dia']);
        //
        console.log(`Id ==>${_IdSD}, dia ==> ${_Dia}`);
        var _NroHoras = '08:00', _HInicio = '', _HFin = '';
        //
        if( _ArCodigosEsp.includes(req.body.CodEstado) ){
            if( _Inicio && _Fin )
            {
                _HInicio  = _Inicio;
                _HFin     = _Fin;
                var now   = moment( `${_Fecha} ${_Inicio}` ).format('YYYY-MM-DD HH:mm');
                var then  = moment( `${_Fecha } ${_Fin}` ).format('YYYY-MM-DD HH:mm');
                _NroHoras = moment.utc( moment(then,"YYYY-MM-DD HH:mm").diff(moment(now,"YYYY-MM-DD HH:mm")) ).format("HH:mm");
            }
        }
        //
        await tareoSubModel.update({
            IdTurno : 0,
            Turno   : '',
            Inicio  : _HInicio,
            Fin     : _HFin,
            NroHoras: _NroHoras,
            Estado    : req.body.Estado,
            CodEstado : req.body.CodEstado,
        },{
            where : {
                IdDetTareo : _IdSD,
                NroDia : `Dia${_Dia}`
            }
        });
        await tareoDetalle3Model.update({
            IdTurno : 0,
            Turno   : req.body.CodEstado
        },{
            where : {
                id : _IdSD
            }
        });
        // Actualizar nombre de tareo
        await sequelize.query(`UPDATE orq_tareo_detalle3 SET Dia${_Dia}= '${req.body.CodEstado}' WHERE id=${_IdSD} ;`);
        //
    }

    /**/
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                    QUITAR UN TURNO                   //
//////////////////////////////////////////////////////////
router.post('/quitar/turno', async (req,res)=>{
    // Ids_Dia(,), Token
    //
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    /**/
    // Desglosamos
    var Ids_Dia = req.body.Ids_Dia;
    var _arData = Ids_Dia.split(','), _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];

    for (let index = 0; index < _arData.length; index++) {
        const _LineaIn  = _arData[index];
        varDump( _LineaIn );
        var _arLineaIn  = _LineaIn.split('_');
        const _Dia      = _arLineaIn[1];
        const _IdSD     = _arLineaIn[0];
        _Atributos.push( [ _Dia , 'Dia' ] );
        //YYY-MM-DD HH:mm").diff(moment(now,"YYYY-MM-DD HH:mm")) ).format("HH:mm");
        await tareoSubModel.update({
            IdTurno : 0,
            Turno   : '',
            Inicio  : '',
            Fin     : '',
            NroHoras: '',
            CodEstado : ''
        },{
            where : {
                IdDetTareo : _IdSD,
                NroDia : `Dia${_Dia}`
            }
        });
        await tareoDetalle3Model.update({
            IdTurno : null,
            Turno   : null
        },{
            where : {
                id     : _IdSD,
            }
        });
        // Actualizar nombre de tareo
        await sequelize.query(`UPDATE orq_tareo_detalle3 SET Dia${_Dia}= 'X' WHERE id=${_IdSD};`);
        //
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  QUITAR UN PERSONAL                  //
//////////////////////////////////////////////////////////
router.post('/quitar/personal', async (req,res)=>{
    // Dnis(,), Token
    // -
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    // Borrar personal
    // Desglosamos
    var Ids_Dia = req.body.Dnis;
    var _arData = Ids_Dia.split(',');

    for (let index = 0; index < _arData.length; index++) {
        const _dni = _arData[index];
        // =>
        await tareoDetalle3Model.destroy({
            where : {
                DNI   : _dni ,
                Token : req.body.Token
            }
        });
        // =>
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  AGREGAR PRESONAL FROM DNI           //
//////////////////////////////////////////////////////////
router.post('/add_personal_varios', async (req,res)=>{
    // DNI (,), IdCli , IdLocal, Token, IdArea
    // IdTareo, CodigoTareo

    var $response = {}, _whereUsuario = {};
    $response.estado = 'OK';
    $response.data = [];
    _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];
    var _arrSi = [], _arrNo = [];

    var Ids_Dia = req.body.DNI;
    var _arData = Ids_Dia.split(',');

    for (let index = 0; index < _arData.length; index++) {
        const _dni = parseInt( _arData[index] );
        //
        //_whereUsuario.estado = { [Op.in]: [ '1', 'Activo' ] };
        _whereUsuario.dni    = _dni;
        //_whereUsuario.cliente   = req.body.IdCli;
        //_whereUsuario.sucursal  = req.body.IdLocal;
        if( req.body.IdArea ){
            //_whereUsuario.id_area = req.body.IdArea;
        }
        console.log(_whereUsuario);
        var _Operarios = await User.findOne({
            where : _whereUsuario
        });
        //
        if( _Operarios )
        {
            //
            _arrSi.push( _dni );
            const _UserOP       = _Operarios;
            var _dataInsertar   = {};
            _dataInsertar.uu_id = await renovarToken();
            _dataInsertar.Token = req.body.Token;
            _dataInsertar.DNI   = _UserOP.dni;
            _dataInsertar.Nombre    = _UserOP.name;
            _dataInsertar.Cargo     = _UserOP.puestoiso;
            _dataInsertar.CodigoHeader = req.body.CodigoTareo;
            if( req.body.IdTareo ){
                _dataInsertar.IdTareo = req.body.IdTareo;
            }
            await tareoDetalle3Model.create(_dataInsertar)
            .catch(function (err) {
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
            // await sequelize.query(`UPDATE orq_tareo_detalle3 SET ${_Dia}= '${_dataTurno.Nombre}' WHERE uu_id='${_dataInsertar.uu_id}';`);
            var _dataSubTareo3 = await tareoDetalle3Model.findOne({
                where :{
                    uu_id : _dataInsertar.uu_id
                }
            })
            .catch(function (err) {
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
            console.log(`Creando data de: ${_UserOP.name}.`);
            // El sub detalle de Tareo
            var _Fecha = moment().format('YYYY-MM-DD');
            if( _dataSubTareo3 ){
                //if( _dataTurno ){
                    for (let index = 1; index < 32; index++) {
                        var _tmpDia = 'Dia'+await pad_with_zeroes( index , 2 );
                        var _insertSub        = {};
                        _insertSub.uu_id      = await renovarToken();
                        _insertSub.IdDetTareo = _dataSubTareo3.id;
                        _insertSub.NroDia     = _tmpDia;
                        _insertSub.Estado     = 'N/D';
                        await tareoSubModel.create( _insertSub )
                        .catch(function (err) {
                            $response.estado = 'ERROR';
                            $response.error  = err.original.sqlMessage;
                            res.json( $response );
                        });
                    }// For dias
                //}
            }
            //
        }else{
            //
            _arrNo.push( _dni );
        }
        //
    }

    // Usuarios si encontrados
    if( _arrSi.length > 0 ){
        $response.oper_si = _arrSi.join(',');
    }else{
        $response.oper_si = '';
    }
    // Usuarios no encontrados
    if( _arrNo.length > 0 ){
        $response.oper_no = _arrNo.join(',');
    }else{
        $response.oper_no = '';
    }

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  AGREGAR PRESONAL FROM DNI           //
//////////////////////////////////////////////////////////
router.post('/add_personal_xls', async (req,res)=>{
    // IdCli , IdLocal, Token, IdArea
    // IdTareo, CodigoTareo

    var $response = {}, _whereUsuario = {};
    $response.estado = 'OK';
    $response.data = [];
    _Atributos = [ 'id', 'uu_id', 'DNI','Nombre' ];
    var _arrSi = [], _arrNo = [];

    var _dataUsers = await User.findAll({
        where : {
            Flag : req.body.Token
        }
    });

    for (let index = 0; index < _dataUsers.length; index++) {
        var _Operarios = _dataUsers[index];
        const _dni = parseInt( _Operarios.dni );
        //
        _whereUsuario.dni = _dni;
        console.log(_whereUsuario);
        //
        if( _Operarios )
        {
            //
            _arrSi.push( _dni );
            const _UserOP       = _Operarios;
            var _dataInsertar   = {};
            _dataInsertar.uu_id = await renovarToken();
            _dataInsertar.Token = req.body.Token;
            _dataInsertar.DNI   = _UserOP.dni;
            _dataInsertar.Nombre    = _UserOP.name;
            _dataInsertar.Cargo     = _UserOP.puestoiso;
            _dataInsertar.CodigoHeader = req.body.CodigoTareo;
            if( req.body.IdTareo ){
                _dataInsertar.IdTareo = req.body.IdTareo;
            }
            await tareoDetalle3Model.create(_dataInsertar)
            .catch(function (err) {
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
            // await sequelize.query(`UPDATE orq_tareo_detalle3 SET ${_Dia}= '${_dataTurno.Nombre}' WHERE uu_id='${_dataInsertar.uu_id}';`);
            var _dataSubTareo3 = await tareoDetalle3Model.findOne({
                where :{
                    uu_id : _dataInsertar.uu_id
                }
            })
            .catch(function (err) {
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
            console.log(`Creando data de: ${_UserOP.name}.`);
            // El sub detalle de Tareo
            var _Fecha = moment().format('YYYY-MM-DD');
            if( _dataSubTareo3 ){
                //if( _dataTurno ){
                    for (let index = 1; index < 32; index++) {
                        var _tmpDia = 'Dia'+await pad_with_zeroes( index , 2 );
                        var _insertSub        = {};
                        _insertSub.uu_id      = await renovarToken();
                        _insertSub.IdDetTareo = _dataSubTareo3.id;
                        _insertSub.NroDia     = _tmpDia;
                        _insertSub.Estado     = 'N/D';
                        await tareoSubModel.create( _insertSub )
                        .catch(function (err) {
                            $response.estado = 'ERROR';
                            $response.error  = err.original.sqlMessage;
                            res.json( $response );
                        });
                    }// For dias
                //}
            }
            //
        }else{
            //
            _arrNo.push( _dni );
        }
        //
    }

    // Usuarios si encontrados
    if( _arrSi.length > 0 ){
        $response.oper_si = _arrSi.join(',');
    }else{
        $response.oper_si = '';
    }
    // Usuarios no encontrados
    if( _arrNo.length > 0 ){
        $response.oper_no = _arrNo.join(',');
    }else{
        $response.oper_no = '';
    }

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
async function setvalorDia( arreglo ){
    //
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