// api_reqPersonal.js

var _NombreDoc = 'api_reqPersonal';

const router = require('express').Router();

const { errorLogModel } = require('../../dbA');


const { 
    User,
    reqPersonalModel,
    distrito2Model,
	departamentoModel,
    provinciaModel,
    fichaPersonalModel,
    areaModel,
    sucursalModel,
    puestoIsoModel,
} = require('../../db');

const {check,validationResult} = require('express-validator');

const { Op } = require("sequelize");


var moment = require('moment-timezone');
moment().tz("America/Lima").format();


reqPersonalModel.belongsTo(fichaPersonalModel,{
	as : 'Detalle', foreignKey 	: 'IdReqPersonal',targetKey: 'IdReqPersonal',
});

fichaPersonalModel.belongsTo(reqPersonalModel,{
	as : 'Detalle2', foreignKey 	: 'IdReqPersonal',targetKey: 'IdReqPersonal',
});


//////////////////////////////////////////////////////////
//      			BUSCAR HOME PERSONAL       			//
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // IdReq, inicio, fin, Area, cboCliente, cboLocal, Puesto, TFecha
	var $response = {};
	$response.estado = 'OK';
    var $where = {}, $where2 = {};
    
	if( req.body.IdReq != '' )
    {
        // Buscamos por ids
        var $arIdReq = [];
		var $IdReq = req.body.IdReq;
		$arIdReq = $IdReq.split(',');
        $response.data = await reqPersonalModel.findAll({
			order: [
				['IdReqPersonal', 'DESC']
			],
			where : {
                IdReqPersonal : $arIdReq
            },
		});
    }else{
        // Buscamos por los datos...

        
        // Cliente
        if( req.body.cboCliente != undefined && req.body.cboCliente != '' )
        {
            $where.Cliente = req.body.cboCliente;
        }
        // Local
        if( req.body.cboLocal != undefined && req.body.cboLocal != '' )
        {
            $where.Sucursal = req.body.cboLocal;
        }
        // Area
        if( req.body.IdArea != undefined && req.body.IdArea != '' )
        {
            $where.IdArea = req.body.IdArea;
        }
        // Puesto
        if( req.body.idPuestoIso != undefined && req.body.idPuestoIso != '' )
        {
            $where.idPuestoIso = req.body.idPuestoIso;
        }
        // FechaPresentacion
        console.log(req.body.inicio,req.body.fin );

        switch (req.body.TFecha) {
            case 'Creacion':
                $where.FechaEmision = { 
                    [Op.gte ] : req.body.inicio,
                    [Op.lte ] : req.body.fin 
                };
            break;
            case 'Presentacion':
                $where.FechaPresentacion = { 
                    [Op.gte ] : req.body.inicio,
                    [Op.lte ] : req.body.fin 
                };
            break;
            default:
                $where.FechaPresentacion = { 
                    [Op.gte ] : req.body.inicio,
                    [Op.lte ] : req.body.fin 
                };
            break;
        }

        

        $response.data = await reqPersonalModel.findAll({
			order: [
				['IdReqPersonal', 'DESC']
			],
            where : $where,
		});
    }
	
	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//         APROBAR REQ PERSONAL         //
//////////////////////////////////////////
router.post('/aprobar', async (req,res)=>{
    // IdReq, uuid
	var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    var $userData = await getUserData( req.headers['api-token'] );
    var IdReqPersonal = req.body.IdReq;

	await reqPersonalModel.update({
        UsuarioAprob : $userData.dni ,
        FechaAprob   : moment().format('YYYY-MM-DD HH:mm:ss'),
        Estado       : 'Aprobado'
    },{
        where : {
            IdReqPersonal : req.body.IdReq ,
            uu_id   : req.body.uuid
        }
    })
    .catch(function (err) {
        varDump(err);
        console.log(`ERROR >>>> Aprobar => Req de personal.`);
        $response.estado = 'ERROR'; $response.error  = 'Error al aprobar la ficha.';
        res.json( $response );
        captueError( err.original , req.body );
        return res.status(200).json( $response );
    });
    
    // CREAR LAS FICHAS DE PERSONAL
    var _Entidad = await reqPersonalModel.findOne({
        where : {
            IdReqPersonal : req.body.IdReq ,
            uu_id   : req.body.uuid
        }
    });
    if( _Entidad )
    {
        var Cantidad = parseInt( _Entidad.Cantidad ), indice = 1;
        for (let index = 0; index < Cantidad; index++) {
            var insertar = {};
            insertar.uu_id  = await renovarToken();
            insertar.IdReqPersonal  = IdReqPersonal;
            insertar.nombres        = '* Por cubrir *';
            insertar.fuente         = '-';
            insertar.dni            = '';
            insertar.indice         = indice;
            insertar.asignacion_familiar    = _Entidad.asignacion_familiar;
            insertar.unidad_local           = `${_Entidad.nombre_cliente} - ${_Entidad.nombre_sucursal}`;
            insertar.sueldo                 = _Entidad.Salario;
            insertar.puesto                 = _Entidad.PuestoIso;
            insertar.turno_elegido          = _Entidad.Horario;
            insertar.inicio_contrato        = _Entidad.FechaPresentacion;
            insertar.id_cliente             = _Entidad.Cliente;
            insertar.cliente                = _Entidad.nombre_cliente;
            insertar.id_sucursal            = _Entidad.Sucursal;
            insertar.sucursal               = _Entidad.nombre_sucursal;
            insertar.id_puesto              = _Entidad.idPuestoIso;
            insertar.estado_reclutamiento   = 'POR_CUBRIR';
            //
            await fichaPersonalModel.create( insertar )
            .catch(function (err) {
                console.log(`ERROR >>>> Aprobar => Req de personal.`);
                $response.estado = 'ERROR'; $response.error  = 'Error al aprobar la ficha.';
                res.json( $response );
                captueError( err.original , insertar );
            });
            //
            indice++;
        }
    }


    $response.data = await reqPersonalModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        console.log(err);
        $response.estado = 'ERROR';
        if( err.original.sqlMessage != undefined ){
            $response.error  = err.original.sqlMessage;
        }else{
            $response.error  = err.original;
        }
        res.json( $response );
    });
	
	res.json( $response );
});
// -----------------------------------------


//////////////////////////////////////////
//         ANULAR REQ PERSONAL         //
//////////////////////////////////////////
router.post('/anular', async (req,res)=>{
    // IdReq, uuid, motivo
    var $response       = {};
    $response.estado    = 'OK';
    $response.data      = [];
    var $where          = {};
    var $userData = await getUserData( req.headers['api-token'] );

	reqPersonalModel.update({
        UsuarioAnulado : $userData.name ,
        FechaAnulado   : moment().format('YYYY-MM-DD HH:mm:ss'),
        deleted_at   : moment().format('YYYY-MM-DD HH:mm:ss'),
        Estado       : 'Anulado',
        motivo_anulado : req.body.motivo
    },{
        where : {
            IdReqPersonal : req.body.IdReq ,
            uu_id   : req.body.uuid
        }
    })
    .catch(function (err) {
        console.log(err);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.data = await reqPersonalModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        console.log(err);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;
        res.json( $response );
    });
	
	res.json( $response );
});
// -----------------------------------------


//////////////////////////////////////////
//         CERRAR REQ PERSONAL         //
//////////////////////////////////////////
router.post('/cerrar', async (req,res)=>{
    // IdReq, uuid, motivo
    var $response       = {};
    $response.estado    = 'OK';
    $response.data      = [];
    var $where          = {};
    var $userData = await getUserData( req.headers['api-token'] );
    console.log('Cerrando Req.personal '+req.body.IdReq);

	reqPersonalModel.update({
        UsuarioCerrado : $userData.name ,
        FechaCerrado   : moment().format('YYYY-MM-DD HH:mm:ss'),
        Estado         : 'Cerrado'
    },{
        where : {
            IdReqPersonal : req.body.IdReq ,
            uu_id   : req.body.uuid
        }
    })
    .catch(function (err) {
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.data = await reqPersonalModel.findOne({
        where : {
            IdReqPersonal : req.body.IdReq ,
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;
        res.json( $response );
    });
	
	res.json( $response );
});
// -----------------------------------------



//////////////////////////////////////////
//          CARGAR REQ PERSONAL         //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // IdReq
    var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';
    $response.data = [];

    $response.departamento = [];
    $response.areas     = [];
    $response.distrito  = [];
    $response.locales   = [];
    $response.puestos   = [];
    $response.provincia = [];
    $response.personal  = [];

    var Entidad = await reqPersonalModel.findOne({
        where : {
            IdReqPersonal : req.body.IdReq
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    // *********** Departamento ***********
    $response.departamento = await departamentoModel.findAll({
        order : [
            [ 'name' , 'ASC' ]
        ]
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    // *********** Areas ***********
    $response.areas = await areaModel.findAll({
        order : [
            [ 'Descripcion' , 'ASC' ]
        ]
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    if( Entidad ){
        $response.encontrado = 'SI';
        $response.data = Entidad;

        
        
        // *********** Provincia ***********
        $response.provincia = await provinciaModel.findAll({
            where : {
                department_id : Entidad.Departamento
            },
            order : [
                [ 'name' , 'ASC' ]
            ]
        })
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        // *********** Distrito ***********
        $response.distrito = await distrito2Model.findAll({
            where : {
                province_id : Entidad.Provincia
            },
            order : [
                [ 'name' , 'ASC' ]
            ]
        })
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        // *********** Locales ***********
        var IdClienteProv = Entidad.Cliente;
        if( Entidad.Cliente < 99999 ){
            //
        }
        $response.locales = await sucursalModel.findAll({
            where : {
                IdClienteProv : Entidad.Cliente
            },
            order : [
                [ 'Descripcion' , 'ASC' ]
            ]
        })
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        // *********** Puestos ***********
        $response.puestos = await puestoIsoModel.findAll({
            where : {
                IdArea : Entidad.IdArea
            },
            order : [
                [ 'Descripcion' , 'ASC' ]
            ]
        })
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        // *********** Ficha de personal ***********

    }
    
        
    
    
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////////////////////
//      	CARGAR ULTIMOS REQ PERSONAL       			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';

	$response.data = await reqPersonalModel.findAll({
		limit: 400,
		order: [
			['IdReqPersonal', 'DESC']
		]
	});

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			CREAR REQ PERSONAL       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('Cliente' ,'Seleccione un cliente').not().isEmpty(),
    check('Cantidad' ,'Ingrese una cantidad').not().isEmpty(),
    check('Salario' ,'Ingrese el salario, sabías que esa palabra es por que a los romanos se les pagaba con sal¿?').not().isEmpty(),
    check('Sucursal' ,'Seleccione una sucursal').not().isEmpty(),
    check('FechaPresentacion' ,'Seleccione una fecha de presentación').not().isEmpty(),
    check('IdDistrito' ,'Seleccione un distrito').not().isEmpty(),
    check('Motivo' ,'Ingrese un motivo').not().isEmpty(),
    check('IdArea' ,'Seleccione un área').not().isEmpty(),
    check('Solicitante' ,'Seleccione un solicitante').not().isEmpty(),
    check('JefeInmediato' ,'Seleccione un jefe inmediato').not().isEmpty(),
    check('idPuestoIso' ,'Seleccione un puesto Iso').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    var IR = parseInt( req.body.id_responsable );
    if( isNaN(IR) ){
        delete req.body.id_responsable;
    }


    req.body.IdPuestoPersonal = 0;
    req.body.cant_cubierta  = 0;
    req.body.Estado         = 'Digitado';
    req.body.FechaInicio    = req.body.FechaPresentacion;
    req.body.UsuarioMod     = $userData.dni;
    req.body.FechaMod       = moment().format('YYYY-MM-DD HH:mm:ss');
    req.body.FechaEmision   = moment().format('YYYY-MM-DD');
    var IdReqPersonal       = await reqPersonalModel.max('IdReqPersonal') + 1;
    req.body.IdReqPersonal  = IdReqPersonal;
	
    $response.data = await reqPersonalModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    $response.id = IdReqPersonal;


    if( $response.data )
    {
        // movido al aprobar...
    }
	
	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      		CARGAR UN REQ PERSONAL       			//
//////////////////////////////////////////////////////////
router.post('/cargar', async (req,res)=>{

	var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';
    $response.depa = [];
    $response.prov = [];
    $response.dist = [];
	
	$response.data = await reqPersonalModel.findOne({
        where : {
            IdReqPersonal : req.body.id
        }
    });
    if( $response.data )
    {
        $response.encontrado = 'SI';
        // Departamento
        $response.depa = departamentoModel.findAll({
            order : [
                [ 'name' ,'ASC' ]
            ]
        });
        // Provincia
        if( $response.data.Departamento != null )
        {
            //
            $response.prov = provinciaModel.findAll({
                order : [
                    [ 'name' ,'ASC' ]
                ],
                where : {
                    department_id : $response.data.Departamento
                }
            });
            //
        }
        // Distrito
        if( $response.data.Provincia != null )
        {
            //
            $response.dist = distrito2Model.findAll({
                order : [
                    [ 'name' ,'ASC' ]
                ],
                where : {
                    province_id : $response.data.Provincia
                }
            });
            //
        }
    }
	
	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			REPORTE 001             			//
//////////////////////////////////////////////////////////
router.post('/rep001', async (req,res)=>{
    // IdReq, desde, hasta, cboCliente, cboLocal, cboDepa, cboProv, cboDistro
	
	var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );
    var $where = {};

    if( req.body.IdReq != '' )
    {
        // Buscamos por ids
        var $arIdReq = [];
		var $IdReq = req.body.IdReq;
		$arIdReq = $IdReq.split(',');
        $response.data = await reqPersonalModel.findAll({
			order: [
				['FechaPresentacion', 'DESC']
			],
			where : {
                IdReqPersonal : $arIdReq
            },
            include: [{
                model : fichaPersonalModel,
                as    : 'Detalle'
            }]
		});
    }else{
        // Buscamos por los datos...

        
        // Cliente
        if( req.body.cboCliente != undefined && req.body.cboCliente != '' )
        {
            $where.Cliente = req.body.cboCliente;
        }
        // Local
        if( req.body.cboLocal != undefined && req.body.cboLocal != '' )
        {
            $where.Sucursal = req.body.cboLocal;
        }
        // Departamento
        if( req.body.cboDepa != undefined && req.body.cboDepa != '' )
        {
            $where.Departamento = parseInt(req.body.cboDepa);
        }
        // Provincia
        if( req.body.cboProv != undefined && req.body.cboProv != '' )
        {
            $where.Provincia = req.body.cboProv;
        }
        // Distrito
        if( req.body.cboDistro != undefined && req.body.cboDistro != '' )
        {
            $where.IdDistrito = req.body.cboDistro;
        }

        // FechaPresentacion
        console.log(req.body.desde,req.body.hasta );

        $where.FechaPresentacion = { 
            [Op.gte ] : req.body.desde,
            [Op.lte ] : req.body.hasta 
        };

        $response.data = await reqPersonalModel.findAll({
			order: [
				['FechaPresentacion', 'DESC']
			],
			where : $where,
		    include: [{
		        model: fichaPersonalModel,
		        as: 'Detalle'
		    }]
		});
    }

    $response.w = $where;

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			REPORTE RCLITAMIENTO       			//
//////////////////////////////////////////////////////////
router.post('/rep_reclutamiento', async (req,res)=>{
    // NroReq (,), FecPres_Inicio, FecPres_Fin, Cliente, EstadoDoc, nombres, dni, depa, prov, dist
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );
    var $where = {}, $where2 = {};

    // - //

    // Buscamos por los id de requerimiento
    if( req.body.NroReq != '' )
    {
        // Buscamos por ids
        var $arIdReq = [];
		var $IdReq = req.body.NroReq;
		$arIdReq = $IdReq.split(',');
        $response.data = await reqPersonalModel.findAll({
			order: [
				['FechaPresentacion', 'DESC']
			],
			where : {
                IdReqPersonal : $arIdReq
            },
            include: [{
                model : fichaPersonalModel,
                as    : 'Detalle'
            }]
		});
    }else{
        $where.FechaPresentacion = { 
            [Op.gte ] : req.body.FecPres_Inicio,
            [Op.lte ] : req.body.FecPres_Fin 
        };
        if( req.body.EstadoDoc )
        {
            $where2.estado_ficha = req.body.EstadoDoc;
        }
        if( req.body.nombres ){
            $where2.nombres = { [Op.like] : '%'+req.body.nombres+'%' };
        }
        if( req.body.dni ){
            $where2.dni = req.body.dni;
        }
        if( req.body.Cliente ){
            $where.Cliente = req.body.Cliente;
        }
        if( req.body.depa ){
            $where.Departamento = req.body.depa;
        }
        if( req.body.prov ){
            $where.Provincia = req.body.prov;
        }
        if( req.body.dist ){
            $where.IdDistrito = req.body.dist;
        }
        


        // Lanzado busqueda implacable...
        $response.data = await reqPersonalModel.findAll({
			order: [
				['FechaPresentacion', 'DESC']
			],
			where : $where,
            include: [{
                model : fichaPersonalModel,
                as    : 'Detalle',
                where : $where2,
            }]
		});
    }

    res.json( $response );
});

//////////////////////////////////////////////////////////
//       ACTUALIZAR REQUERIMIENTO DE PERSONAL          //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('Cliente' ,'Seleccione un cliente').not().isEmpty(),
    check('Cantidad' ,'Ingrese una cantidad').not().isEmpty(),
    check('Sucursal' ,'Seleccione una sucursal').not().isEmpty(),
    check('FechaPresentacion' ,'Seleccione una fecha de presentación').not().isEmpty(),
    check('IdDistrito' ,'Seleccione un distrito').not().isEmpty(),
    check('Motivo' ,'Ingrese un motivo').not().isEmpty(),
    check('IdArea' ,'Seleccione un área').not().isEmpty(),
    check('Solicitante' ,'Seleccione un solicitante').not().isEmpty(),
    check('JefeInmediato' ,'Seleccione un jefe inmediato').not().isEmpty(),
    check('idPuestoIso' ,'Seleccione un puesto Iso').not().isEmpty(),
    check('id_responsable' ,'Seleccione un responsable').not().isEmpty(),
], async (req,res)=>{
    // IdReq
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Auditoria
    var IdReqPersonal = req.body.IdReqPersonal;
    $response.id = IdReqPersonal;
    delete req.body.IdReqPersonal;
    //
	await reqPersonalModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        console.log( err );
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    $response.data = await reqPersonalModel.findOne({
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

    res.json( $response );
});
// -------------------------------------------------------

// Borrar !!!!
router.delete('/:uuid', async (req,res)=>{

    var $response = {};
    $response.estado = 'OK';

	await fichaPersonalModel.update({
        deleted_at : moment().format('YYYY-MM-DD HH:mm:ss'),
    },{
		where : {
            uu_id : req.params.uuid
        }
	});
	
    es.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//    			REPORTE REQ DE PERSONAL       			//
//////////////////////////////////////////////////////////
router.post('/rep002', async (req,res)=>{
    // Inicio, Fin, Area, Puesto, Cliente, Estado, Soli, IdReq, TFecha
    
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );
    var $where = {},$where2 = {};

    if( req.body.IdReq != '' )
    {
        // Buscamos por ids
        var $arIdReq = [];
		var $IdReq = req.body.IdReq;
		$arIdReq = $IdReq.split(',');
        $response.data = await reqPersonalModel.findAll({
			order: [
				['FechaPresentacion', 'DESC']
			],
			where : {
                IdReqPersonal : $arIdReq ,
                deleted_at : { [Op.is] : null }
            },
            include: [{
                model : fichaPersonalModel,
                as    : 'Detalle'
            }]
		});
    }else{
        // Buscamos por los datos...
        $where.deleted_at = { [Op.is] : null };
        
        // Cliente
        if( req.body.Cliente != undefined && req.body.Cliente != '' )
        {
            $where.Cliente = req.body.Cliente;
        }
        // Area
        if( req.body.Area != undefined && req.body.Area != '' )
        {
            $where.IdArea = req.body.Area;
        }
        // Puesto
        if( req.body.Puesto != undefined && req.body.Puesto != '' )
        {
            $where.idPuestoIso = req.body.Puesto;
        }
        // Solicitante
        if( req.body.Soli != undefined && req.body.Soli != '' )
        {
            $where.Solicitante = req.body.Soli;
        }
        // Estado reclutamiento
        if( req.body.Estado != '' )
        {
            switch (req.body.Estado) {
                case 'Completado':
                    $where.estado_reclutamiento = { [Op.like] : req.body.Estado+'%' };
                    $where.Estado = { [Op.ne] : 'Anulado'};
                break;
                case 'Pendiente':
                    $where.estado_reclutamiento = req.body.Estado;
                    $where.Estado = { [Op.ne] : 'Anulado'};
                break;
                case 'Cerrado':
                    $where.Estado = req.body.Estado;
                break;
                default:
                break;
            }
            
            
        }
        //$where2.nombres = { [Op.ne ] : '* Por cubrir *'};
        /**
        // Departamento
        if( req.body.cboDepa != undefined && req.body.cboDepa != '' )
        {
            $where.Departamento = parseInt(req.body.cboDepa);
        }
        // Provincia
        if( req.body.cboProv != undefined && req.body.cboProv != '' )
        {
            $where.Provincia = req.body.cboProv;
        }
        // Distrito
        if( req.body.cboDistro != undefined && req.body.cboDistro != '' )
        {
            $where.IdDistrito = req.body.cboDistro;
        }
        /**/
        // FechaPresentacion
        if( req.body.TFecha == 'Presentacion' )
        {
            // Fecha de presentacición
            $where.FechaPresentacion = { 
                [Op.gte ] : req.body.Inicio,
                [Op.lte ] : req.body.Fin 
            };
        }else{
            // Fecha de creación
            $where.FechaEmision = { 
                [Op.gte ] : req.body.Inicio,
                [Op.lte ] : req.body.Fin 
            };
        }

        $response.data = await reqPersonalModel.findAll({
            order: [
                [ 'FechaPresentacion' , 'DESC' ]
            ],
            where : $where,
            include: [{
                model   : fichaPersonalModel,
                as      : 'Detalle',
            }]
		});
    }

    $response.w = $where;
	
	res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//    			REPORTE REQ DE PERSONAL       			//
//////////////////////////////////////////////////////////
router.post('/rep003', async (req,res)=>{
    // Inicio, Fin, Area, Puesto, Cliente, Estado, Soli, IdReq, TFecha, Local, Depa, Prov, Dist
    // DNI, Nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );
    var $where = {},$where2 = {};
    $where2.deleted_at = { [Op.is] : null };

    if( req.body.DNI ){
        $where2.dni = req.body.DNI;
    }
    if( req.body.Nombre ){
        $where2.nombres = { [Op.like] : '%'+req.body.Nombre+'%' };
    }

    if( req.body.IdReq != '' )
    {
        // Buscamos por ids
        var $arIdReq = [];
		var $IdReq = req.body.IdReq;
		$arIdReq = $IdReq.split(',');
        $response.data = await reqPersonalModel.findAll({
			order: [
				['FechaPresentacion', 'DESC']
			],
			where : {
                IdReqPersonal : $arIdReq ,
                deleted_at : { [Op.is] : null }
            },
            include: [{
                model : fichaPersonalModel,
                as    : 'Detalle',
                where : {
                    deleted_at : { [Op.is] : null }
                },
            }]
		});
    }else{
        // Buscamos por los datos...
        $where.deleted_at = { [Op.is] : null };
        
        // Cliente
        if( req.body.Cliente != undefined && req.body.Cliente != '' )
        {
            $where.Cliente = req.body.Cliente;
        }
        // Local
        if( req.body.Local != '' )
        {
            $where.Sucursal = req.body.Local;
        }
        // Area
        if( req.body.Area != undefined && req.body.Area != '' )
        {
            $where.IdArea = req.body.Area;
        }
        // Puesto
        if( req.body.Puesto != undefined && req.body.Puesto != '' )
        {
            $where.idPuestoIso = req.body.Puesto;
        }
        // Solicitante
        if( req.body.Soli != undefined && req.body.Soli != '' )
        {
            $where.Solicitante = req.body.Soli;
        }
        // Estado reclutamiento
        if( req.body.Estado != '' )
        {
            switch (req.body.Estado) {
                case 'Completado':
                    $where.estado_reclutamiento = { [Op.like] : req.body.Estado+'%' };
                    $where.Estado = { [Op.ne] : 'Anulado'};
                break;
                case 'Pendiente':
                    $where.estado_reclutamiento = req.body.Estado;
                    $where.Estado = { [Op.ne] : 'Anulado'};
                break;
                case 'Cerrado':
                    $where.Estado = req.body.Estado;
                break;
                default:
                break;
            }
            
            
        }
        //$where2.nombres = { [Op.ne ] : '* Por cubrir *'};
        /**/
        // Departamento
        if( req.body.Depa != '' )
        {
            $where.Departamento = req.body.Depa;
        }
        // Provincia
        if( req.body.Prov != undefined && req.body.Prov != '' )
        {
            $where.Provincia = req.body.Prov;
        }
        // Distrito
        if( req.body.Dist != undefined && req.body.Dist != '' )
        {
            $where.IdDistrito = req.body.Dist;
        }
        /**/
        // FechaPresentacion
        if( req.body.TFecha == 'Presentacion' )
        {
            // Fecha de presentacición
            $where.FechaPresentacion = { 
                [Op.gte ] : req.body.Inicio,
                [Op.lte ] : req.body.Fin 
            };
        }else{
            // Fecha de creación
            $where.FechaEmision = { 
                [Op.gte ] : req.body.Inicio,
                [Op.lte ] : req.body.Fin 
            };
        }

        $response.data = await reqPersonalModel.findAll({
            order: [
                [ 'FechaPresentacion' , 'DESC' ]
            ],
            where : $where,
            include: [{
                model   : fichaPersonalModel,
                as      : 'Detalle',
                where   : $where2,
            }]
		});
    }

    $response.w = $where;
	
	res.json( $response );
});
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

module.exports = router;