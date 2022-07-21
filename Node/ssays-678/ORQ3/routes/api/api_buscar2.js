// api_buscar2.js
// API PARA BUSCAR CON TOKEN DE SEGURIDAD

const router = require('express').Router();
const { QueryTypes } = require('sequelize');

const { sistemasModel } = require('../../db31');



const { areaModel,puestoIsoModel,sequelize,User,clienteModel,giroModel, docVentasCab, 
	departamentoModel,provinciaModel,distrito2Model, sucursalModel,centroCostosModel,
	configEmpresa, permisoHorasModel,tipoPagoModel, fichaInspeccionModel,articulosModel,productosModel, proveedorModel, resumenFacturasCabModel } = require('../../db');

// MOMENT
var moment = require('moment-timezone');
moment().tz("America/Lima").format();

// -------------------------------------------------------

// -------------------------------------------------------

router.get('/',async(req,res)=>{
	const films = await areaModel.findAll();
	res.json( films );
});

// -------------------------------------------------------

// Obtener las areas
router.get('/areas',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
    const { Op } = require("sequelize");
    $where.Descripcion = { [Op.like ] : '%'+req.query.q+'%' };
    $where.Estado = 1;

    $response.results = await areaModel.findAll({
        attributes : [ ['CodArea','id'] , [ sequelize.fn('concat', sequelize.col("CodArea"),"-",sequelize.col("Descripcion") ) , 'text' ] ],
        where : $where
    });

	res.json( $response );
});

// -------------------------------------------------------

// Obtener puestos de un area
router.get('/puesto_area/:idArea',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
    const { Op } = require("sequelize");
    //$where.Descripcion = { [Op.like ] : '%'+req.query.q+'%' };
	$where.Estado = 1;
	$where.IdArea = req.params.idArea;
	$response.idArea = req.params.idArea;

    $response.results = await puestoIsoModel.findAll({
        attributes : [ ['idPuestoIso','id'] , [ sequelize.fn('concat', sequelize.col("idPuestoIso"),"-",sequelize.col("Descripcion") ) , 'text' ] ,'IdArea','area' ],
        where : $where
    });

	res.json( $response );
});

// -------------------------------------------------------
// Obtener usuarios en base a un area
router.get('/usuarios_puesto/:idPuesto',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	if( isNaN( $number ) )
	{
		// Buscar por texto
		$where.name = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por DNI
		$where.dni = req.query.q;
	}
    
	$where.deleted_at = { [Op.is ] : null };
	$where.idPuestoIso = req.params.idPuesto;

    $response.results = await User.findAll({
        attributes : [ 
			['dni','id'] , 
			[ sequelize.fn('concat', sequelize.col("dni"),"-",sequelize.col("name") ) , 'text' ] ,
			'celular'
		],
        where : $where
    });

	res.json( $response );
});

// -------------------------------------------------------

//////////////////////////////////////////////////////////////
//		SELECT PARA CC [ CodContable - NOMBRE ]			//
//////////////////////////////////////////////////////////////
router.get('/cc_select2',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	$where.Estado = 1;
	const { Op } = require("sequelize");
	var _number = req.query.q;

	// if( $number.length > 6 ){
		$where.Descripcion = { [Op.like ] : '%'+req.query.q+'%' };
	// }else{
	// 	$where.CodContable = req.query.q;
	// }
	// // if( $number.length > 6 )
	// // {
	// // 	var str = req.query.q;
	// // 	var resQ = str.replace(" ", "%");
	// // 	$where.Descripcion = { [Op.like ] : '%'+resQ+'%' };
	// // }
	// // else
	// // {
	// // 	$where.CodContable = req.query.q;
	// // }
	// // $where.Estado = 1;
	// // $where.deleted_at = { [Op.is ] : null };
	// sequelize.where( sequelize.fn("concat", sequelize.col("CodContable"), ' ' ,sequelize.col("Descripcion") ), { [Op.like]: '%'+req.query.q+'%' });

    /*$response.results = await centroCostosModel.findAll({
        attributes : [ 
			['IdCentro','id'] , 
			[ sequelize.fn('concat', sequelize.col("CodContable"),"-",sequelize.col("Descripcion") ) , 'text' ] ,
			'empresa','CodContable'
		],
        where : $where
    });*/

	const _dataCC = await sequelize.query( `SELECT IdCentro as id, CONCAT(CodContable,' ',Descripcion) as text,empresa,CodContable FROM utb_centrocostos WHERE Estado = 1 AND CONCAT(CodContable,' ',Descripcion) like '%${_number}%';` , { type: QueryTypes.SELECT } );
	$response.results = _dataCC;

	res.json( $response );
});

// -------------------------------------------------------

//////////////////////////////////////////////////////////////
//		SELECT PARA USUARIOS [ DNI - NOMBRE ]			//
//////////////////////////////////////////////////////////////
router.get('/usuarios_select2',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	if( isNaN( $number ) )
	{
		// Buscar por texto
		var str = req.query.q;
		var resQ = str.replace(" ", "%");
		$where.name = { [Op.like ] : '%'+resQ+'%' };
	}
	else
	{
		// BUscar por DNI
		$where.dni = req.query.q;
	}

	$where.estado = { [Op.in] : [ 1 , 'Activo' ] };
	$where.deleted_at = { [Op.is ] : null };

    $response.results = await User.findAll({
        attributes : [ 
			['dni','id'] , 
			[ sequelize.fn('concat', sequelize.col("dni"),"-",sequelize.col("name") ) , 'text' ] ,
			'celular','email','id_empresa','empresa','fechanacimiento','id_area','area','idPuestoIso','puestoiso',
			'id_centro_costo','centrocosto', 'Inicio_Contrato','Sexo','emailalternativo', 'name', 'nombre', 'apellidop', 'apellidom'
		],
        where : $where,
		limit : 20,
		order : [
			[ 'name' , 'ASC' ]
		]
    });

	res.json( $response );
});

// -------------------------------------------------------

//////////////////////////////////////////////////////////////
//		SELECT PARA USUARIOS [ NOMBRE ]			//
//////////////////////////////////////////////////////////////
router.get('/usuarios_select3',async(req,res)=>{
	// Aqui en lugar del is se enviara el "usuario"
    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	if( isNaN( $number ) )
	{
		// Buscar por texto
		var str = req.query.q;
		var resQ = str.replace(" ", "%");
		$where.name = { [Op.like ] : '%'+resQ+'%' };
	}
	else
	{
		// BUscar por DNI
		$where.dni = req.query.q;
	}

	$where.estado = { [Op.in] : [ 1 , 'Activo' ] };
	$where.deleted_at = { [Op.is ] : null };
	// [ sequelize.fn('concat', sequelize.col("dni"),"-",sequelize.col("name") ) , 'text' ] ,
    $response.results = await User.findAll({
        attributes : [ 
			['dni','id'] , 
			['name','text'] , 
			'celular','email','id_empresa','empresa','fechanacimiento','id_area','area','idPuestoIso','puestoiso',
			'id_centro_costo','centrocosto', 'Inicio_Contrato','nombre','apellidop','apellidom','Sexo'
		],
        where : $where,
		limit : 20
    });

	res.json( $response );
});

// -------------------------------------------------------

//////////////////////////////////////////////////////////////
//		SELECT PARA LOCALES			//
//////////////////////////////////////////////////////////////
router.get('/locales_select2/:IdCli',async(req,res)=>{

    var $response 		= {};
	$response.estado 	= 'OK';
	$response.results 	= [];
    var $where 			= {};
	const { Op } 		= require("sequelize");
	var $number 		= req.params.IdCli;

	if( isNaN( $number ) )
	{
		// Buscar por texto
		$where.name = { [Op.like ] : '%'+req.params.IdCli+'%' };
	}
	else
	{
		// BUscar por IdClienteProv
		$where.IdClienteProv = req.params.IdCli;
	}

	$where.Estado = 1;
	$where.deleted_at = { [Op.is ] : null };

    $response.results = await sucursalModel.findAll({
        attributes : [ 
			['IdSucursal','id'] , 
			[ sequelize.fn('concat', sequelize.col("IdSucursal"),"-",sequelize.col("Descripcion") ) , 'text' ] ,
			'Direccion','Contacto'
		],
		where : $where,
		order : [
			[ 'Descripcion' , 'ASC' ]
		]
    });

	res.json( $response );
});

// -------------------------------------------------------

//////////////////////////////////////////////////////////////
//		SELECT PARA CLIENTES [ RUC - RAZON SOCIAL ]			//
//////////////////////////////////////////////////////////////
router.get('/clientes_select2',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	$where.Estado = 1;
	
	if( isNaN( $number ) )
	{
		// Buscar por texto
		$where.Razon = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por DNI
		$where.IdClienteProv = req.query.q;
	}
    
	$where.deleted_at = { [Op.is ] : null };

    $response.results = await clienteModel.findAll({
        attributes : [ 
			['IdClienteProv','id'] , 
			[ sequelize.fn('concat', sequelize.col("IdClienteProv"),"-",sequelize.col("Razon") ) , 'text' ] ,
			'IdGiro','IdCentro'
		],
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////////
//		SELECT PARA CLIENTES [ RAZON SOCIAL ]			//
//////////////////////////////////////////////////////////////
router.get('/clientes2_select2',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	$where.Estado = 1;
	
	var $select = [
		['IdClienteProv','id'] , 
			[ 'Razon' , 'text' ] ,
			'IdGiro','nombre_giro','IdCentro','monto_materiales','monto_implementos','monto_indumentaria',
			'monto_intitucional','IdGiro','NombreComercial','Departamento','Provincia',
			'Distrito','TipoDir','NombreCalle','NroCalle','OtrosCalle','Urbanizacion','lat','lng',
			'Contacto','Email','Movil','Telefono','EmailContacto','IdClienteProv','centro_costos','Razon','uu_id',
			'CodContaCC','Direccion','DNI','RUC'
	];

	if( isNaN( $number ) )
	{
		// Buscar por texto
		$where.Razon = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por DNI
		$where.IdClienteProv = req.query.q;
	}
    
	$where.deleted_at = { [Op.is ] : null };

    $response.results = await clienteModel.findAll({
        attributes : $select,
        where : $where
    });
	
	res.json( $response );
});

// -------------------------------------------------------
//////////////////////////////////////////////////////////////
//		SELECT PARA PROVEEDORES [ RAZON SOCIAL ]			//
//////////////////////////////////////////////////////////////
router.get('/proovs2_select2',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	$where.Estado = 1;

	var $select = [
		['IdClienteProv','id'] , 
		[ 'Razon' , 'text' ] ,
		'Razon','IdClienteProv','MaxEMO'
	];
	if( isNaN( $number ) )
	{
		// Buscar por texto
		$where.Razon = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por DNI
		$where.IdClienteProv = req.query.q;
	}

    $response.results = await proveedorModel.findAll({
        attributes : $select,
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////////
//				SELECT PARA GIRO DE EMPRESA					//
//////////////////////////////////////////////////////////////
router.get('/giros_select2',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	if( isNaN( $number ) )
	{
		// Buscar por texto
		$where.Descripcion = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por DNI
		$where.IdGiro = req.query.q;
	}
    
	$where.deleted_at = { [Op.is ] : null };

    $response.results = await giroModel.findAll({
        attributes : [ 
			['IdGiro','id'] , 
			[ sequelize.fn('concat', sequelize.col("IdGiro"),"-",sequelize.col("Descripcion") ) , 'text' ] 
		],
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////////
//					SELECT2 PARA DEPARTAMENTO				//
//////////////////////////////////////////////////////////////
router.get('/departamento_select2',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	if( isNaN( $number ) )
	{
		// Buscar por texto
		$where.name = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por DNI
		$where.IdGiro = req.query.q;
	}
    
	// $where.deleted_at = { [Op.is ] : null };

    $response.results = await departamentoModel.findAll({
        attributes : [ 
			'id' , 
			[ sequelize.fn('concat', sequelize.col("id"),"-",sequelize.col("name") ) , 'text' ] 
		],
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////////
//					SELECT2 PARA PROVINCIA 					//
//////////////////////////////////////////////////////////////
router.get('/provincia_select2/:DepId',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;

	$where.department_id = req.params.DepId;

	if( isNaN( $number ) )
	{
		// Buscar por texto
		$where.name = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por DNI
		$where.IdGiro = req.query.q;
	}
    
	// $where.deleted_at = { [Op.is ] : null };

    $response.results = await provinciaModel.findAll({
        attributes : [ 
			['id'] , 
			[ sequelize.fn('concat', sequelize.col("id"),"-",sequelize.col("name") ) , 'text' ] 
		],
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////////
//					SELECT2 PARA DISTRITO 					//
//////////////////////////////////////////////////////////////
router.get('/distrito_select2/:ProvId',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;

	$where.province_id = req.params.ProvId;

	if( isNaN( $number ) )
	{
		// Buscar por texto
		$where.name = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por DNI
		$where.IdGiro = req.query.q;
	}
    
	// $where.deleted_at = { [Op.is ] : null };

    $response.results = await distrito2Model.findAll({
        attributes : [ 
			['id'] , 
			[ sequelize.fn('concat', sequelize.col("id"),"-",sequelize.col("name") ) , 'text' ] 
		],
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////////
//					 APERTURA DE SISTEMA					//
//////////////////////////////////////////////////////////////
router.get('/sis_apertura/:tdoc/:dni/:idcliprov/:fecha',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.diff = '';
    var $where = {};
	const { Op } = require("sequelize");
	var $FechhOY = moment().format('YYYY-MM-DD');
	var $FechaUser = moment( req.params.fecha ).format('YYYY-MM-DD');
	var $arFechaHoy = $FechhOY.split('-'),$arFecUser = $FechaUser.split('-');
	var a = moment( $arFechaHoy );
	var b = moment($arFecUser);
	var $diasDiff = parseInt( b.diff(a, 'days') );
	$response.diff_h = $diasDiff;

	if( $diasDiff <=1 ){
		//
		var $tdoc = req.params.tdoc;
		$tdoc 	  = $tdoc.toUpperCase();
		var $Usuario = req.params.dni;
		var $IdClienteProv = req.params.idcliprov;

		var $dataConfig = await configEmpresa.findOne({
			where : {
				tipo_doc : $tdoc,
				estado 	 : 'Activo'
			}
		});

		if( $dataConfig )
		{
			//
			var now   = moment().format('YYYY-MM-DD HH:mm');
			var then  = `${$FechhOY } ${$dataConfig.cierre}`;
			var $diff = moment.utc(moment(now,"YYYY-MM-DD HH:mm").diff(moment(then,"YYYY-MM-DD HH:mm"))).format("HH:mm:ss")
			if( now  <= then )
			{
				$response.msg 	 = `Aun abierto`;
				$response.estado = 'OK';
			}else{
				var $tiempoPaso = await tiempoPaso1( $diff );
				$response.msg 	 = `Sistema cerrado hace ${$tiempoPaso}`;
				$response.estado = 'CERRADO';
				// El IdClienteProv del cliente tiene apertura para este dni¿?
				var $idDoc = 13;
				if( $tdoc == 'OT' ){
					$idDoc = 14;
				}
				var $PermisoHoras = await permisoHorasModel.findOne({
					where : {
						TipoDoc : $idDoc,
						Estado  : 1,
						Fecha 	: $FechhOY,
						Usuario : $Usuario,
						idClienteProv : $IdClienteProv
					},
					order : [
						[ 'idPermiso' , 'DESC' ]
					]
				});
				if( $PermisoHoras )
				{
					var then  = `${$FechhOY } ${$PermisoHoras.hora_fin}`;
					var $diff = moment.utc(moment(now,"YYYY-MM-DD HH:mm").diff(moment(then,"YYYY-MM-DD HH:mm"))).format("HH:mm:ss")
					if( now  <= then )
					{
						$response.msg 	 = `Permiso especial disponible`;
						$response.estado = 'OK';
					}else{
						var $tiempoPaso = await tiempoPaso1( $diff );
						$response.msg 	 = `Su aperturá finalizo hace ${$tiempoPaso}`;
					}
				}
			}
			$response.diff = $diff;
			$response.now  = now;
			$response.then = then;
			//
		}
		//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	}else{
		// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		$response.msg 	 = `Superior a hoy y mañana`;
		$response.estado = 'OK';
	}

	res.json( $response );
});
// -------------------------------------------------------
// Obtener los tipo pago
router.get('/tipo_pago',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
    const { Op } = require("sequelize");
    //$where.Descripcion = { [Op.like ] : '%'+req.query.q+'%' };
	//$where.Estado = 1;
	//$where.IdArea = req.params.idArea;
	$response.idArea = req.params.idArea;

    $response.results = await tipoPagoModel.findAll({
        attributes : [ ['IdTipoPago','id'] , [ sequelize.fn('concat', sequelize.col("IdTipoPago"),"-",sequelize.col("Descripcion") ) , 'text' ] ],
        order: [
			['Descripcion', 'DESC']
		]
    });

	res.json( $response );
});
// -------------------------------------------------------
//////////////////////////////////////////////////////////////
//					SELECT2 PARA SISTMAS OS					//
//////////////////////////////////////////////////////////////
router.get('/sistemas_os',async(req,res)=>{
	console.log('sistemas_os: ');
    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	$where.Estado = 'Activo';

	if( isNaN( $number ) )
	{
		// Buscar por texto
		$where.Descripcion = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por DNI
		$where.IdSistema = req.query.q;
	}
    
	// $where.deleted_at = { [Op.is ] : null };

    $response.results = await sistemasModel.findAll({
        attributes : [ 
			['IdSistema','id'] , 
			[ sequelize.fn('concat', sequelize.col("IdSistema"),"-",sequelize.col("Descripcion") ) , 'text' ] 
		],
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//			SELECT PARA FICHA DE INSPECCION				//
//////////////////////////////////////////////////////////
router.get('/select2_ficha_inspec',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	$where.Estado = 'En-proceso';

	var $select = [
		['idFichaInspeccion','id'] , 
		[ sequelize.fn('concat', sequelize.col("idFichaInspeccion"),"-",sequelize.col("NomCliente") ) , 'text' ],
		'NomCliente'
	];

	if( isNaN( $number ) )
	{
		// Buscar por cliente
		$where.NomCliente = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por ID
		$where.idFichaInspeccion = req.query.q;
	}
    
	$where.deleted_at = { [Op.is ] : null };

    $response.results = await fichaInspeccionModel.findAll({
        attributes : $select,
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//			SELECT PARA ARTICULOS CONCAR				//
//////////////////////////////////////////////////////////
router.get('/select2_articulos',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	$where.Estado = 'V';

	// [ sequelize.fn('concat', sequelize.col("CodigoArticulo"),"-",sequelize.col("Descripcion") ) , 'text' ],
	var $select = [
		['CodigoArticulo','id'] , 
		[ 'Descripcion' , 'text' ],
		'UnidadMedida','Precio'
	];
	
	if( parseInt( $number.length ) >= 15 )
	{
		// Buscar por cliente
		$where.Descripcion = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por ID
		$where.CodigoArticulo = req.query.q;
	}
    
	$where.deleted_at = { [Op.is ] : null };

    $response.results = await articulosModel.findAll({
        attributes : $select,
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//					SELECT PARA PRODUCTOS				//
//////////////////////////////////////////////////////////
router.get('/select2_productos',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	$where.Estado = 1;

	var $select = [
		['IdProducto','id'] , 
		[ sequelize.fn('concat', sequelize.col("IdProducto"),"-",sequelize.col("Descripcion") ) , 'text' ],
		'unidad_medida','CostoUnit_soles','IdUMedida'
	];

	if( isNaN( $number ) )
	{
		// Buscar por cliente
		$where.Descripcion = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por ID
		$where.IdProducto = req.query.q;
	}
    
	$where.deleted_at = { [Op.is ] : null };

    $response.results = await productosModel.findAll({
        attributes : $select,
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//					SELECT PARA PRODUCTOS				//
//////////////////////////////////////////////////////////
router.get('/select2_productos2',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	$where.Estado = 1;

	var $select = [
		['IdProducto','id'] , 
		[ 'Descripcion' , 'text' ],
		'unidad_medida','CostoUnit_soles','IdUMedida', 'codigo_sunat'
	];

	if( isNaN( $number ) )
	{
		// Buscar por cliente
		$where.Descripcion = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por ID
		$where.IdProducto = req.query.q;
	}
    
	$where.deleted_at = { [Op.is ] : null };

    $response.results = await productosModel.findAll({
        attributes : $select,
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//					SELECT PARA PRODUCTOS				//
//////////////////////////////////////////////////////////
router.get('/select2_codsunat',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	$where.Estado = 1;

	var $select = [
		['codigo_sunat','id'] , 
		[ 'Descripcion' , 'text' ]
	];

	if( isNaN( $number ) )
	{
		// Buscar por cliente
		$where.Descripcion = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por ID
		$where.IdProducto = req.query.q;
	}
    
	$where.deleted_at = { [Op.is ] : null };

    $response.results = await productosModel.findAll({
        attributes : $select,
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//			   SELECT PARA RESUMEN DE FACTURA			//
//////////////////////////////////////////////////////////
router.get('/select2_resumen_f',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");

	var $select = [
		['ResumenId','id'] , 
		[ 'ResumenId' , 'text' ]
	];

	$where.ResumenId = { [Op.like ] : '%'+req.query.q+'%' };
	$where.EstadoDoc = 'Aprobado';

    $response.results = await resumenFacturasCabModel.findAll({
        attributes : $select,
        where : $where ,
		limit : 10
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  UPDATE RESULTADO XML                //
//////////////////////////////////////////////////////////
router.post('/updt_resultado', async (req,res)=>{
    // uuid, text
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await docVentasCab.update({
		ResultadoXML : req.body.text
	},{
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
     
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
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