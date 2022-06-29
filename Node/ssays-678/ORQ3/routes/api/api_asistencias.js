// api_asistencias.js

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

// LEER EXCEL
const reader = require('xlsx')

// Modelos
const { tareoModel, turnoCabModel, tareoDetalle3Model, asistenciaCabModel, User, asistenciaDetModel, horarioDetModel, horarioModel, archiGoogleModel, sucursalModel } = require('../../db');

const _arrayMeses = ["" ,"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await asistenciaCabModel.findAll({
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
        $response.data = await asistenciaCabModel.findAll({
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
        $response.data = await asistenciaCabModel.findAll({
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
    //
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await asistenciaCabModel.findAll({
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
    check('IdLocal' ,'Seleccione local').not().isEmpty(),
    check('Fecha' ,'Seleccione fecha').not().isEmpty(),
    check('IdCliente' ,'Seleccione cliente').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.DNICreado = $userData.dni;
    req.body.CreadoPor = $userData.name;
    // Aactualizando contadores
    const NroFaltas = await asistenciaDetModel.count({
        where: {
            Token : req.body.uu_id,
            Estado : 'Falta'
        }
    });
    req.body.NroFaltas = NroFaltas;
    const NroPersonal = await asistenciaDetModel.count({
        where: {
            Token : req.body.uu_id,
            Estado : { [Op.ne] : 'Falta' }
        }
    });
    req.body.NroPersonal = NroPersonal;
    const NroTarde = await asistenciaDetModel.count({
        where: {
            Token : req.body.uu_id,
            Estado :'Tarde'
        }
    });
    req.body.NroTarde = NroTarde;
    const NroTemprano = await asistenciaDetModel.count({
        where: {
            Token : req.body.uu_id,
            Estado :'Temprano'
        }
    });
    req.body.NroTemprano = NroTemprano;
    const NroATiempo = await asistenciaDetModel.count({
        where: {
            Token : req.body.uu_id,
            Estado :'A Tiempo'
        }
    });
    req.body.NroATiempo = NroATiempo;
    //
    await asistenciaCabModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await asistenciaCabModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 5 );
        _Codigo = 'ASIS'+_Codigo;
        await asistenciaCabModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
        // Unir con detalle
        await asistenciaDetModel.update({ CodigoHead : _Codigo },{
            where : {
                Token : req.body.uu_id
            }
        });
    }

    $response.item = await asistenciaCabModel.findOne({
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
    $response.local = [];
    $response.detalle  = [];
    $response.horarios = [];

   var _Entidad = await asistenciaCabModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = _Entidad;
    if( _Entidad ){
        // Sucursales
        var _Locales = await sucursalModel.findAll({
            where : {
                Estado : 1,
            IdClienteProv : _Entidad.IdCliente
            }
        });
        $response.local = _Locales;
        // Detalle personal
        var _Detalle = await asistenciaDetModel.findAll({
            where : {
                CodigoHead : _Entidad.Codigo
            }
        });
        $response.detalle = _Detalle;
        // Horarios
        var _Horarios = await horarioModel.findAll({
            where : {
                IdCliente : _Entidad.IdCliente ,
                IdLocal   : _Entidad.IdLocal ,
                estado : 'Activo'
            }
        });
        $response.horarios = _Horarios;
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('IdLocal' ,'Seleccione local').not().isEmpty(),
    check('Fecha' ,'Seleccione fecha').not().isEmpty(),
    check('IdCliente' ,'Seleccione cliente').not().isEmpty(),
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
    req.body.DNIModificado = $userData.dni;
    req.body.ModificadoPor  = $userData.name;

	await asistenciaCabModel.update(req.body,{
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
    
    $response.item = await asistenciaCabModel.findOne({
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

	await asistenciaCabModel.update({
        Estado      : 'Anulado',
        DNIAnulado  : $userData.dni,
        AnuladoPor  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await asistenciaCabModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  AGREGAR DETALLE                     //
//////////////////////////////////////////////////////////
router.post('/detalle/add', async (req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var _DNIS = req.body.DNIS, _Tipo = req.body.Tipo;
    delete req.body.DNIS;
    delete req.body.Tipo;

    var _Dia = moment( req.body.Fecha ).format('dddd'), _Estado = '', _Fecha = req.body.Fecha, _Hora = req.body.Hora;
    $response.dia = _Dia;
    var _Horario = await horarioModel.findOne({
        where : {
            id : req.body.IdHorario
        }
    });

    if( _Tipo != 'Seleccionar operario' ){
        // 99999999999999999999999999999999999999999999999
        var $arrDNIs = [];
		var $IdOSs = _DNIS;
		$arrDNIs   = $IdOSs.split(',');
        for (let index = 0; index < $arrDNIs.length; index++) {
            const _elDNI = $arrDNIs[index];
            // Ya existe¿?
            var _Entidad = await asistenciaDetModel.findOne({
                where : {
                    IdUsuario : _elDNI,
                    Token : req.body.Token
                }
            });
            if( _Entidad ){
                //
            }else{
                if( _Horario ){
                    var _Detalle = await horarioDetModel.findOne({
                        where : {
                            id_horario : _Horario.id
                        }
                    });
                    if( _Detalle ){
                        var _Inicio = _Detalle.inicio, _Glosa = ``;
                        $response.maxIngreso  = _Inicio;
                        $response.Horaingreso = _Hora;
                        var now   = moment( `${_Fecha} ${_Inicio}` ).format('YYYY-MM-DD HH:mm');
                        var then  = `${_Fecha } ${_Hora}`;
                        if( now < then ){
                            var _diff = moment.utc( moment(then,"YYYY-MM-DD HH:mm").diff(moment(now,"YYYY-MM-DD HH:mm")) ).format("HH:mm");
                            _Estado = 'Tarde';
                            _Glosa = `${_diff} Tarde`;
                        }else{
                            var _diff = moment.utc( moment(now,"YYYY-MM-DD HH:mm").diff(moment(then,"YYYY-MM-DD HH:mm")) ).format("HH:mm");
                            _Estado = 'Temprano';
                            _Glosa = `${_diff} Temprano`;
                        }
                        if( now == then ){
                            _Estado = 'A Tiempo';
                        }
                        $response.diff  = _diff;
                        req.body.Glosa  = _Glosa;
                    }else{
                        _Estado = 'Sin-Horario';
                        req.body.Glosa = _Glosa;
                    }
                    req.body.Estado = _Estado;
                }
                var _UsuarioData = await User.findOne({
                    attributes : [ 'id' ,'dni', 'name','puestoiso' ],
                    where : {
                        dni : _elDNI
                    }
                });
                if( _UsuarioData ){
                    req.body.uu_id      = await renovarToken();
                    req.body.IdUsuario  = _UsuarioData.dni;
                    req.body.Usuario    = _UsuarioData.name;
                    req.body.Cargo     = _UsuarioData.puestoiso;
                    await asistenciaDetModel.create( req.body )
                    .catch(function (err) {
                        $response.estado = 'ERROR';
                        $response.error  = err.original.sqlMessage;
                        res.json( $response );
                    });
                }
            }
        }
        // END FOR
        // 99999999999999999999999999999999999999999999999
    }else{
        // 99999999999999999999999999999999999999999999999
        // Ya existe¿?
        var _Entidad = await asistenciaDetModel.findOne({
            where : {
                IdUsuario : req.body.IdUsuario,
                Token : req.body.Token
            }
        });
        if( _Entidad ){
            $response.estado = 'ERROR';
            $response.error  = 'El personal ya existe en la lista.';
        }else{
            if( _Horario ){
                var _Detalle = await horarioDetModel.findOne({
                    where : {
                        id_horario : _Horario.id
                    }
                });
                if( _Detalle ){
                    var _Inicio = _Detalle.inicio, _Glosa = ``;
                    $response.maxIngreso  = _Inicio;
                    $response.Horaingreso = _Hora;
                    var now   = moment( `${_Fecha} ${_Inicio}` ).format('YYYY-MM-DD HH:mm');
                    var then  = `${_Fecha } ${_Hora}`;
                    if( now < then ){
                        var _diff = moment.utc( moment(then,"YYYY-MM-DD HH:mm").diff(moment(now,"YYYY-MM-DD HH:mm")) ).format("HH:mm");
                        _Estado = 'Tarde';
                        _Glosa = `${_diff} Tarde`;
                    }else{
                        var _diff = moment.utc( moment(now,"YYYY-MM-DD HH:mm").diff(moment(then,"YYYY-MM-DD HH:mm")) ).format("HH:mm");
                        _Estado = 'Temprano';
                        _Glosa = `${_diff} Temprano`;
                    }
                    if( now == then ){
                        _Estado = 'A Tiempo';
                    }
                    $response.diff  = _diff;
                    req.body.Glosa  = _Glosa;
                }else{
                    _Estado = 'Sin-Horario';
                    req.body.Glosa = _Glosa;
                }
                req.body.Estado = _Estado;
            }
            var _UsuarioData = await User.findOne({
                attributes : [ 'id' ,'dni', 'name' , 'puestoiso' ],
                where : {
                    dni : req.body.IdUsuario
                }
            });
            if( _UsuarioData ){
                req.body.uu_id      = await renovarToken();
                req.body.IdUsuario  = _UsuarioData.dni;
                req.body.Usuario    = _UsuarioData.name;
                req.body.Cargo     = _UsuarioData.puestoiso;
                await asistenciaDetModel.create( req.body )
                .catch(function (err) {
                    $response.estado = 'ERROR';
                    $response.error  = err.original.sqlMessage;
                    res.json( $response );
                });
            }
            // await asistenciaDetModel.create( req.body )
            // .catch(function (err) {
            //     $response.estado = 'ERROR';
            //     $response.error  = err.original.sqlMessage;
            //     res.json( $response );
            // });
        }
        // 99999999999999999999999999999999999999999999999
    }
    
    // >
    var _dataI = await asistenciaDetModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    var _dataAll = await asistenciaDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    });
    $response.item = _dataI;
    $response.data = _dataAll;
        
    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                  ACTUALIZAR DETALLE                  //
//////////////////////////////////////////////////////////
router.post('/detalle/update', async (req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var _ID = req.body.id;
    delete req.body.DNIS;
    delete req.body.Tipo;
    delete req.body.id;
    //
    await asistenciaDetModel.update( req.body ,{
        where : {
            id : _ID
        }
    });
    var _dataI = await asistenciaDetModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    var _dataAll = await asistenciaDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    });
    $response.item = _dataI;
    $response.data = _dataAll;
    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                     AGREGAR FALTA                    //
//////////////////////////////////////////////////////////
router.post('/detalle/falta', async (req,res)=>{
    // Token, DNI, Nombre, IdHorario, Horario
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    //
    var _Insertar = {};
    _Insertar.uu_id = await renovarToken();
    _Insertar.Estado    = 'Falta';
    _Insertar.Token     = req.body.Token;
    _Insertar.IdHorario = req.body.IdHorario;
    _Insertar.Horario   = req.body.Horario;
    var _UsuarioData = await User.findOne({
        attributes : [ 'id' ,'dni', 'name', 'puestoiso' ],
        where : {
            dni : req.body.DNI
        }
    });
    if( _UsuarioData ){
        _Insertar.IdUsuario  = _UsuarioData.dni;
        _Insertar.Usuario    = _UsuarioData.name;
        _Insertar.Cargo      = _UsuarioData.puestoiso;
        await asistenciaDetModel.create( _Insertar );
    }
   
    //
    $response.item = await asistenciaDetModel.findOne({
        where : {
            uu_id : _Insertar.uu_id
        }
    });
    $response.data = await asistenciaDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    });
    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                    ELIMINAR DETALLE                  //
//////////////////////////////////////////////////////////
router.post('/detalle/del', async (req,res)=>{
    // uuid, Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    await asistenciaDetModel.destroy({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = await asistenciaDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    });
    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                    DEVOLVER DETALLE                  //
//////////////////////////////////////////////////////////
router.post('/detalle/all', async (req,res)=>{
    // Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.data = await asistenciaDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    });
    res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////
//                    CARGAR DETALLE                    //
//////////////////////////////////////////////////////////
router.post('/detalle/get', async (req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.data = await asistenciaDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//           IMPORTAR ASISTENCIA DESDE EXCEL            //
//////////////////////////////////////////////////////////
router.post('/importar', async (req,res)=>{
    // Fecha, IdHorario, Horario, Token, uuid(file)
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.noexiste = [], NoExiste = [];
    $response.invalido = [], NoValido = [];
    //
    var Token = req.body.Token, Horario = req.body.Horario, IdHorario = req.body.IdHorario, Fecha = req.body.Fecha, _Archivo = {};
    /**/
    var _Dia = moment( req.body.Fecha ).format('dddd'), _Estado = '';
    $response.dia = _Dia;
    var _Horario = await horarioModel.findOne({
        where : {
            id : req.body.IdHorario
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _Archivo = await archiGoogleModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    $response.file = _Archivo;
    /**/
    //
    if( _Archivo ){
        // Reading our test file
        const file = reader.readFile( _Archivo.ruta_fisica );
        let data = [];
        const sheets = file.SheetNames
        
        for(let i = 0; i < sheets.length; i++)
        {
            const temp = reader.utils.sheet_to_json(
                    file.Sheets[file.SheetNames[i]])
            temp.forEach( async (resx) => {

                var _Insertar = {};
                var _Hora = resx.Ingreso, _DNI = resx.DNI;
                var _validoHora = await validarHora(_Hora);
                console.log('>>>>>>>>>>>>>>>>'+_validoHora+' ===>> '+_Hora);
                /**/
                if( _validoHora == 'SI' ){
                    // Ya existe¿?
                    var _Entidad = await asistenciaDetModel.findOne({
                        where : {
                            IdUsuario : _DNI,
                            Token : Token
                        }
                    })
                    .catch(function (err) {
                        $response.estado = 'ERROR';
                        $response.error  = err.original.sqlMessage;
                        res.json( $response );
                    });
                    console.log('>>>>>>>>>token');
                    if(! _Entidad ){
                        _Insertar.IdHorario = IdHorario;
                        _Insertar.Horario   = Horario;
                        _Insertar.Fecha     = Fecha;
                        _Insertar.Token     = Token;
                        _Insertar.Hora      = _Hora;
                        var _Detalle = await horarioDetModel.findOne({
                            where : {
                                id_horario : _Horario.id
                            }
                        });
                        if( _Detalle ){
                            var _Inicio = _Detalle.inicio, _Glosa = ``;
                            $response.maxIngreso  = _Inicio;
                            $response.Horaingreso = _Hora;
                            var now   = moment( `${Fecha} ${_Inicio}` ).format('YYYY-MM-DD HH:mm');
                            var then  = `${Fecha } ${_Hora}`;
                            if( now < then ){
                                var _diff = moment.utc( moment(then,"YYYY-MM-DD HH:mm").diff(moment(now,"YYYY-MM-DD HH:mm")) ).format("HH:mm");
                                _Estado = 'Tarde';
                                _Glosa = `${_diff} Tarde`;
                            }else{
                                var _diff = moment.utc( moment(now,"YYYY-MM-DD HH:mm").diff(moment(then,"YYYY-MM-DD HH:mm")) ).format("HH:mm");
                                _Estado = 'Temprano';
                                _Glosa = `${_diff} Temprano`;
                            }
                            if( now == then ){
                                _Estado = 'A Tiempo';
                            }
                            $response.diff  = _diff;
                            _Insertar.Glosa  = _Glosa;
                        }else{
                            _Estado = 'Sin-Horario';
                            _Insertar.Glosa = _Glosa;
                        }
                        _Insertar.Estado = _Estado;
                        // Insertando detalle
                        var _UsuarioData = await User.findOne({
                            attributes : [ 'id' ,'dni', 'name','puestoiso' ],
                            where : {
                                dni : _DNI
                            }
                        });
                        if( _UsuarioData ){
                            _Insertar.uu_id      = await renovarToken();
                            _Insertar.IdUsuario  = _UsuarioData.dni;
                            _Insertar.Usuario    = _UsuarioData.name;
                            _Insertar.Cargo     = _UsuarioData.puestoiso;
                            await asistenciaDetModel.create( _Insertar )
                            .catch(function (err) {
                                $response.estado = 'ERROR';
                                $response.error  = err.original.sqlMessage;
                                res.json( $response );
                            });
                        }else{
                            NoExiste.push(`El DNI:${_DNI} no existe en la base de datos`);
                        }
                    }
                    //-------------------------
                }else{
                    NoValido.push(`El DNI:${_DNI} tiene formato de hora no válido usar HH:mm`);
                    console.log('Hora no valida');
                }
                /**/
            });
        }
        // Printing data
        // console.log(data);
        //$response.token = _Archivo.token;
    }

    $response.data = await asistenciaDetModel.findAll({
        where : {
            Token : req.body.Token
        }
    });
    $response.token = req.body.Token;

    $response.invalido = NoValido.join(', ');
    $response.noexiste = NoExiste.join(', ')

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  JSON ASISTENCIA APP                    //
//////////////////////////////////////////////////////////
router.post('/listar_asistencia', async (req,res)=>{
    // Fecha, dni
    var _response = {};
    _response.codigo = 200;

    _response.data = [];

    try {
        //
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        varDump(req.headers['api-token']);
        var _userLogin = await getUserData( req.headers['api-token'] );
        var _TipoUsuario = _userLogin.TipoUsuario;
        varDump(`APP Asistencia, cliente: ${_userLogin.nombre_cliente}, Local: ${_userLogin.nombre_local}`);

        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        var _Fecha = req.body.Fecha;
        if(! _Fecha  )
        {
            _Fecha = moment().format('YYYY-MM-DD');
        }
        var _arFecha = _Fecha.split('-');
        var _nMes = parseInt( _arFecha[1] );
        var _Mes = _arrayMeses[ _nMes ];
        var _dia = `Dia${_arFecha[2]}`;

        var _where = {};
        _where.Mes = _Mes;
        _where.Anio = _arFecha[0];
        _where.IdCliente = _userLogin.cliente;
        _where.IdLocal = _userLogin.sucursal;


        // turnoCabModel | tareoDetalle3Model
        var _dataTareo = await tareoModel.findOne({
            where : _where
        });
        //

        var _data = [];
        if( _dataTareo )
        {
            // Ahora vamos a por el detalle
            if( req.body.dni )
            {
                // Buscamos un colaborador en especifico
                var _Detalle = await tareoDetalle3Model.findAll({
                    //attributes : [ 'id' , 'DNI', 'Nombre' , [_dia , 'dia' ] ],
                    where : {
                        IdTareo : _dataTareo.id ,
                        DNI : req.body.dni
                    }
                });
            }else{
                // MOstramos todos
                var _Detalle = await tareoDetalle3Model.findAll({
                    //attributes : [ 'id' , 'DNI', 'Nombre' , [_dia , 'dia' ] ],
                    where : {
                        IdTareo : _dataTareo.id
                    }
                });
            }
            
            for (let index = 0; index < _Detalle.length; index++) {
                var _o = {};
                const rs = _Detalle[index];
                varDump(rs[ _dia ]);
                var _turno = rs[ _dia ];
                if( _turno != 'X' )
                {
                    // Traemo turno
                    var _whereT = {
                        IdCliente : _userLogin.cliente,
                        IdLocal : _userLogin.sucursal ,
                        Nombre : _turno
                    };
                    var _turnoData = await turnoCabModel.findOne({
                        //attributes : [ 'id' ,'Inicio' , 'Fin' ],
                        where : _whereT
                    });
                    if( _turnoData )
                    {
                        _o.Fecha = moment(_Fecha).format('DD/MM/YYYY')+' '+_turnoData.Inicio;
                        _o.Turno = _turno;
                    }else{
                        _o.Fecha = moment(_Fecha).format('DD/MM/YYYY');
                        _o.Turno = ``;
                    }
                }else{
                    _o.Fecha = moment(_Fecha).format('DD/MM/YYYY');
                    _o.Turno = ``;
                }
                var _txtNombre = rs.Nombre;
                _o.Nombre = _txtNombre.toUpperCase();
                _o.DNI = rs.DNI ;
                _data.push(_o);
            }//for
        }
        
        varDump( _data );
        _response.data = _data;

        /*if( req.body.dni )
        {
            //
            var _o = {
                Nombre : 'ARREDONDO  TELLO  JENNIFER MYRENA',
                DNI : req.body.dni,
                Fecha : moment(_Fecha).format('DD/MM/YYYY')+' 13:00',
                Turno : 'Tarde'
            };
            _data.push(_o);
            //
        }else{
            //
            var _o = {
                Nombre : 'PRADO MENDOZA YESSENIA DEL PILAR',
                DNI : 42455006,
                Fecha : moment(_Fecha).format('DD/MM/YYYY')+' 06:00',
                Turno : 'Mañana'
            };
            _data.push(_o);
            var _o = {
                Nombre : 'CHUQUIPIONDO PISCO  ROSA',
                DNI : 47994514,
                Fecha : moment(_Fecha).format('DD/MM/YYYY')+' 06:00',
                Turno : 'Mañana'
            };
            _data.push(_o);
            var _o = {
                Nombre : 'ROMERO URIARTE JULIA',
                DNI : 28114159,
                Fecha : moment(_Fecha).format('DD/MM/YYYY')+' 06:00',
                Turno : 'Mañana'
            };
            _data.push(_o);
            var _o = {
                Nombre : 'ALCANTARA GOICOCHEA MARIA INES',
                DNI : 41775216,
                Fecha : moment(_Fecha).format('DD/MM/YYYY')+' 06:00',
                Turno : 'Mañana'
            };
            _data.push(_o);
            var _o = {
                Nombre : 'GUEVARA ESQUIVEL  MARVIE DENISE',
                DNI : 10338916,
                Fecha : moment(_Fecha).format('DD/MM/YYYY')+' 06:00',
                Turno : 'Mañana'
            };
            _data.push(_o);
            var _o = {
                Nombre : 'ORE ASTETE FIORELA FAVIOLA',
                DNI : 44984297,
                Fecha : moment(_Fecha).format('DD/MM/YYYY')+' 06:00',
                Turno : 'Mañana'
            };
            _data.push(_o);
            var _o = {
                Nombre : 'ESPINOZA ALAMA DELIA',
                DNI : 25828543,
                Fecha : moment(_Fecha).format('DD/MM/YYYY')+' 06:00',
                Turno : 'Mañana'
            };
            _data.push(_o);
            var _o = {
                Nombre : 'ABATE  CUEVA  DAYANN SARAYS',
                DNI : 74766366,
                Fecha : moment(_Fecha).format('DD/MM/YYYY')+' 06:00',
                Turno : 'Mañana'
            };
            _data.push(_o);
            var _o = {
                Nombre : 'CASTILLO  CRUZ  MARIA ISABEL',
                DNI : 10099256,
                Fecha : moment(_Fecha).format('DD/MM/YYYY')+' 13:00',
                Turno : 'Tarde'
            };
            _data.push(_o);
            var _o = {
                Nombre : 'AREVALO GALLO BETTY HAYDEE',
                DNI : 80223557,
                Fecha : moment(_Fecha).format('DD/MM/YYYY')+' 13:00',
                Turno : 'Tarde'
            };
            _data.push(_o);
            var _o = {
                Nombre : 'ARREDONDO  TELLO  JENNIFER MYRENA',
                DNI : 46703965,
                Fecha : moment(_Fecha).format('DD/MM/YYYY')+' 13:00',
                Turno : 'Tarde'
            };
            _data.push(_o);
            _response.data = _data;
            //
        }*/
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : 'success' , 'texto' : 'Información cargada correcto' } ;
        //
    } catch (error) {
        varDump(error);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});
// -------------------------------------------------------------
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
function varDump( _t )
{
    console.log( _t );
}
// -------------------------------------------------------
async function validarHora(inputField) {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputField);
    var _retorno = '';
    if (isValid) {
        _retorno = 'SI';
    } else {
        _retorno = 'NO';
    }

    return _retorno;
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
    //
    var $data;
    var _antributos = [
        'id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular','Iniciales','cliente','sucursal',
        ['cliente','IdCliente'], ['nombre_cliente','Cliente'], ['sucursal','IdLocal'], ['nombre_local','Local'], 'TipoUsuario' ,
        'nombre_cliente', 'nombre_local'
    ];
    $data = await User.findOne({
        attributes: _antributos ,
        where : {
            api_token : $token
        }
    });
    return $data;
    //
};
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