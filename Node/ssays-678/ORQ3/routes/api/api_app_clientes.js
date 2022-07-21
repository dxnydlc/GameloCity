// api_app_clientes.js

const router = require('express').Router();
// MOMENT
var moment = require('moment-timezone');
moment().tz("America/Lima").format();

const { tareoModel,User,retenesModel, tareoDet2Model, CertificadoModel, horarioDetModel, asistenciaDetModel, asistenciaCabModel } = require('../../db');

const {check,validationResult} = require('express-validator');

const { Op } = require("sequelize");

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
asistenciaCabModel.belongsTo(asistenciaDetModel,{
	as : 'DetAs001', foreignKey 	: 'Codigo',targetKey: 'CodigoHead',
});
tareoModel.belongsTo(tareoDet2Model,{
	as : 'Detalle', foreignKey 	: 'id',targetKey: 'IdTareo',
});
retenesModel.belongsTo(tareoDet2Model,{
	as : 'Detalle', foreignKey 	: 'IdTareo',targetKey: 'IdTareo',
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

///////////////////////////////////////////////////
//      			ASISTENCIAS     			//
//////////////////////////////////////////////////
router.post('/dashboard2',async(req,res)=>{
    // asistencias 2021
    // IdCli, Local, Horario, Fecha
    var $response = {}, _where = {};
    $response.estado = 'OK';

    var _where = {};
    _where.IdCliente = req.body.IdCli;
    _where.Estado = 'Activo';
    // Local
    if( req.body.Local ){
        _where.IdLocal = req.body.Local;
    }
    // Fecha
    if( req.body.Fecha ){
        _where.Fecha = req.body.Fecha;
    }
    // Horario
    if( req.body.Horario ){
        _where.IdHorario = req.body.Horario;
    }

    // Numero de asistencias Fecha / sin horario
    const NroAsistencias = await asistenciaCabModel.sum('NroPersonal',{
        where: _where
    });
    $response.asistencias = NroAsistencias;
    const NroFaltas = await asistenciaCabModel.sum('NroFaltas',{
        where: _where
    });
    $response.faltas = NroFaltas;

    res.json( $response );
});
// ----------------------------------------------

///////////////////////////////////////////////////
//      			ASISTENCIAS     			//
//////////////////////////////////////////////////
router.post('/asistencias2',async(req,res)=>{
    // IdCli, Local, Horario, Fecha
    var $response = {}, where = {};
    $response.estado = 'OK';
    $response.data = [];

    var _where = {};
    _where.IdCliente = req.body.IdCli;
    _where.Estado = 'Activo';
    // Local
    if( req.body.Local ){
        _where.IdLocal = req.body.Local;
    }
    // Fecha
    if( req.body.Fecha ){
        _where.Fecha = req.body.Fecha;
    }
    // Horario
    if( req.body.Horario ){
        _where.IdHorario = req.body.Horario;
    }

    var _Data = await asistenciaCabModel.findAll({
        where : _where,
        include: [{
            model: asistenciaDetModel,
            as: 'DetAs001',
            where : {
                Estado : {[Op.not] : null }
            }
        }]
    });
    $response.data = _Data;

    res.json( $response );
});
// ----------------------------------------------

///////////////////////////////////////////////////
//      			ASISTENCIAS     			//
//////////////////////////////////////////////////
router.post('/asistencias',async(req,res)=>{
    // IdCli, Local, Horario
    var $response = {}, where = {};
    $response.estado = 'OK';
    $response.asistentes = [];
    $response.retenes = [];
    $response.a = 0;
    $response.f = 0;
    $response.r = 0;
    var Local = req.body.Local, Horario = req.body.Horario;

    var DataUser = await getUserData( req.headers['api-token'] );
    var _IdCliente = DataUser.cliente, _IdLocal = DataUser.sucursal;
    var FechaHoy = moment().format('YYYY-MM-DD');

    where.Estado        = 'Activo';
    where.FechaInicio   = { [ Op.gte ] : FechaHoy };
    where.IdCliente     = _IdCliente;

    // Sucursal
    if( Local ){
        where.IdLocal = Local;
    }
    // Horario
    if( Horario ){
        where.IdHorario = Horario;
    }


    // Número de asistencias
    var NroAsistencias = await tareoModel.sum('NroAsistencias', {
        where: where
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    $response.a = NroAsistencias;
    // Número de faltas
    var NroFaltas = await tareoModel.sum('NroFaltas', {
        where: where
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    $response.f = NroFaltas;
    // Número de retenes aceptados
    var where2 = {};
    where2.Estado = 'Aceptado';
    where2.Fecha  = FechaHoy;
    where2.IdCliente = _IdCliente;
    if( Local ){
        where2.IdLocal = Local;
    }
    if( Horario ){
        where2.IdHorario = Horario;
    }
    var NroRetenes = await retenesModel.sum('id', {
        where: where2
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    $response.r = NroRetenes;
    $response.where2 = where2;

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // Listado de operarios
    $response.asistentes = await tareoModel.findAll({
        where: where,
        include: [{
            model: tareoDet2Model,
            as: 'Detalle'
        }]
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    // Listado de retenes
    $response.retenes = await retenesModel.findAll({
        where: where2
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

//////////////////////////////////////////////////////////
//      			RETENES DEL CLIENTE     			//
//////////////////////////////////////////////////////////
router.post('/bycliente',async(req,res)=>{
    // cliente, local, horario
    var $response = {}, _where = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.retenes = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    var FechaHoy = moment().format('YYYY-MM-DD');
    var cliente = req.body.cliente, Local = req.body.local, Horario = req.body.horario;
    var arrTareos = [], arDNIS = [];
    
    _where.Estado = 'Aceptado';
    _where.Fecha  = FechaHoy;
    _where.IdCliente = cliente;
    // Sucursal
    if( Local ){
        _where.IdLocal = Local;
    }
    // Horario
    if( Horario ){
        _where.IdHorario = Horario;
    }

	var dataRetenes = await retenesModel.findAll({
        where : _where,
    });
    for (let index = 0; index < dataRetenes.length; index++) {
        const rs = dataRetenes[index];
        arrTareos.push( rs.IdTareo );
        arDNIS.push( rs.DNI );
    }
    console.log(arDNIS);
    // Listamos
    $response.data = await tareoDet2Model.findAll({
        where: {
            IdTareo : { [Op.in] : arrTareos },
            DNI     : { [Op.in] : arDNIS }
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    var dataRetenes = await retenesModel.findAll({
        where : _where,
        include: [{
            model: tareoDet2Model,
            as: 'Detalle',
            where : {
                DNI : { [Op.in] : arDNIS }
            }
        }]
    });
    $response.retenes = dataRetenes;

    res.json( $response );
});
// -------------------------------------------------------

///////////////////////////////////////////////////
//      			FALTAS     			//
//////////////////////////////////////////////////
router.post('/faltas',async(req,res)=>{
    // Local, Horario
    var $response = {}, where = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.a = 0;
    $response.f = 0;
    $response.r = 0;
    var Local = req.body.Local, Horario = req.body.Horario;

    var DataUser = await getUserData( req.headers['api-token'] );
    var _IdCliente = DataUser.cliente, _IdLocal = DataUser.sucursal;
    var FechaHoy = moment().format('YYYY-MM-DD');

    where.Estado        = 'Activo';
    where.FechaInicio   = { [ Op.gte ] : FechaHoy };
    where.IdCliente     = _IdCliente;

    // Sucursal
    if( Local ){
        where.IdLocal = Local;
    }
    // Horario
    if( Horario ){
        where.IdHorario = Horario;
    }

    // lista de faltas
    $response.data = await tareoModel.findAll({
        where: where,
        include: [{
            model: tareoDet2Model,
            as: 'Detalle',
            where : {
                Estado : 'F'
            }
        }]
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
//        OPERARIOS DE UN CLIENTE       //
//////////////////////////////////////////
router.post('/operarios', async (req,res)=>{
    // cliente, local, horario
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await User.findAll({
        attributes : [ 'id', 'dni', 'name', 'idPuestoIso', 'puestoiso', 'id_area','area','cliente','nombre_cliente','sucursal','nombre_local','id_horario','horario' ],
        where : {
            cliente     : req.body.cliente 
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//        CRTIFICADOS DE UN CLIENTE       //
//////////////////////////////////////////
router.post('/certificado', async (req,res)=>{
    // cliente, local, horario
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await CertificadoModel.findAll({
        where : {
            IdClienteProv : req.body.cliente ,
            Estado : 'Aprobado'
        }
    });
    
    res.json( $response );
});
// ---------------------------------------


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
        //attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular'],
        where : {
            api_token : $token
        }
    });
    return $data;
}


module.exports = router;