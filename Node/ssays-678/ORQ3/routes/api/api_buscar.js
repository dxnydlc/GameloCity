// api_buscar

const router = require('express').Router();

const { areaModel, puestoIsoModel, sequelize, User, clienteModel, giroModel,
	departamentoModel, provinciaModel, distrito2Model, sucursalModel, centroCostosModel,
	configEmpresa, permisoHorasModel, tipoPagoModel, fichaSintoModel,trabajoOTModel,personalOTModel,otModel } = require('../../db');

// MOMENT
var moment = require('moment-timezone');
moment().tz("America/Lima").format();

const { Op } = require("sequelize");

trabajoOTModel.belongsTo(
    otModel,
    {
        targetKey: 'IdOT',
        foreignKey: 'IdOT',
        as : 'OTd'
    }
);


// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
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
	const { Op } = require("sequelize");
	var $number = req.query.q;
	if( isNaN( $number ) )
	{
		// Buscar por texto
		var str = req.query.q;
		var resQ = str.replace(" ", "%");
		$where.Descripcion = { [Op.like ] : '%'+resQ+'%' };
	}
	else
	{
		// BUscar por CodContable
		$where.CodContable = req.query.q;
	}

	$where.Estado = 1;
	$where.deleted_at = { [Op.is ] : null };

    $response.results = await centroCostosModel.findAll({
        attributes : [ 
			['IdCentro','id'] , 
			[ sequelize.fn('concat', sequelize.col("CodContable"),"-",sequelize.col("Descripcion") ) , 'text' ] ,
			'empresa'
		],
        where : $where
    });

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

	$where.estado = 1;
	$where.deleted_at = { [Op.is ] : null };

    $response.results = await User.findAll({
        attributes : [ 
			['dni','id'] , 
			[ sequelize.fn('concat', sequelize.col("dni"),"-",sequelize.col("name") ) , 'text' ] ,
			'celular','email','id_empresa','empresa','fechanacimiento','id_area','area','idPuestoIso','puestoiso'
		],
        where : $where
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
			[ 'Razon' , 'text' ] ,
			'IdGiro','IdCentro','monto_materiales','monto_implementos','monto_indumentaria','monto_intitucional'
		],
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

	try {
		if( req.params.fecha ){
			var $FechaUser = moment( req.params.fecha ).format('YYYY-MM-DD');
		}else{
			var $FechaUser = $FechhOY
		}
	} catch (error) {
		var $FechaUser = $FechhOY
	}
		
	
	console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'+req.params.fecha);
	console.log(' FechhOY => '+$FechhOY);
	console.log(' FechaUser => '+$FechaUser + ' Original: '+ req.params.fecha);
	var $arFechaHoy = $FechhOY.split('-'),$arFecUser = $FechaUser.split('-');
	var a = moment( $FechhOY );
	var b = moment( $FechaUser );
	var $diasDiff = b.diff(a, 'days');
	$diasDiff = parseInt( b.diff(a, 'days') );
	console.log('>>>>>'+$diasDiff);

	$response.diff_h = $diasDiff;
	console.log();

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
						Fecha 	: $FechaUser,
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

/////////////////////////////////////////////////////////
//   	      CALENDARIO FICHA SINTOMATOLOGIA 	       //
////////////////////////////////////////////////////////
router.get('/calendario/fichasinto', async (req,res)=>{
	// uuid

	var sStart  = req.query.start
	var sEnd    = req.query.end

	var arStart = sStart.split('T');
	var arEnd   = sEnd.split('T');

	var Inicio  = arStart[0], Fin = arEnd[0];
	var arInicio = Inicio.split('-'), arFin = Fin.split('-');

	var mInicio   = moment( arInicio ); 
	var mFin 	  = moment( arFin );
	var sDiffDias = mFin.diff( mInicio , 'days' );
	// TODO lo anterior es para saber la diferencia entre las fechas
	var dataExp = [];
	
	var test1 = new Date(Inicio);
	var test2 = new Date(Fin);
	var result_diff = moment(test2).diff(moment(test1), "days");
	console.log(`-------> ${result_diff}`);
	console.log( result_diff );
	sDiffDias = result_diff;

	for (let index = 0; index <= sDiffDias; index++) {
		var gFecha = moment( Inicio , "YYYY-MM-DD").add( index , 'days');
		var jFecha = moment(gFecha).format('YYYY-MM-DD'), gArrFecha = jFecha.split('T');
		console.log( jFecha );
		// Que respondieron OK
		var dRespondido = await fichaSintoModel.count({
			where: {
				DateResp : jFecha,
				EstadoTrabajador : 'Respondido',
				Revisar : { [Op.is] : null }
			}
		});
		// Que respondieron OBSERVADO
		var dObservado = await fichaSintoModel.count({
			where: {
				DateResp : jFecha,
				EstadoTrabajador : 'Respondido',
				Revisar : 'SI'
			}
		});
		if(dRespondido > 0 ){
			var sTexto = `Fichas Obs. ${dObservado}`;
			var _O = { 'title' : sTexto , start : jFecha, color : '#f5bf42', textColor : 'black' };
			dataExp.push(_O);
			var sTexto = `Fichas OK ${dRespondido}`;
			var _O = { 'title' : sTexto , start : jFecha, color: '#378006' };
			dataExp.push(_O);
		}
		
	}

	console.log( sDiffDias );
	console.log( Inicio , Fin );
	
	var sData = [
		{
			"title" : "All Day Event",
			"start" : "2021-02-01"
		},
		{
			"title" : "Long Event",
			"start" : "2021-02-07",
			"end" 	: "2021-02-10"
		},
	];

	res.json( dataExp );
});
// -------------------------------------------------------
/////////////////////////////////////////////////////////
//   	      CALENDARIO TRABAJOS OT AGENDA 	       //
////////////////////////////////////////////////////////
router.get('/calendario/agenda', async (req,res)=>{

	var sStart  = req.query.start
	var sEnd    = req.query.end
	var dataExp = [], $response = [];

	var arStart = sStart.split('T');
	var arEnd   = sEnd.split('T');

	var Inicio  = arStart[0], Fin = arEnd[0];
	var arInicio = Inicio.split('-'), arFin = Fin.split('-');
	// sequelize.where(sequelize.fn('date', sequelize.col('fecha_ot')), '=', Inicio),

	var sData = await trabajoOTModel.findAll({
		where : sequelize.where(sequelize.fn('date', sequelize.col('fecha_ot')), '=', Inicio),
		include: [{
			model: otModel,
			as: 'OTd',
		}]
	})
	.catch(function (err) {
		console.log( err );
		$response.estado = 'ERROR';
		$response.error  = err.original.sqlMessage;
		res.json( $response );
	});

	///console.log( sData );
	if( sData ){
		for (let index = 0; index < sData.length; index++) {
			const rs = sData[index], sOT = rs.OTd;
			var FechaHora = moment( rs.fecha_ot ).format('YYYY-MM-DD HH:mm:ss');
			var sFechaHuman = moment( rs.fecha_ot ).format('DD/MM/YYYY HH:mm:ss');
			console.log( FechaHora );

			var titulo1 = await pad_de_ultra_Derecha(  `OT #${rs.IdOT} ${rs.usuario}` , 70 );
			var sTexto = `${titulo1} ${sOT.nombre_cliente}____${sOT.local}`;
			var _O = { 
				'title' : sTexto , start : FechaHora, color: '#378006', id : rs.uu_id,
				IdOT : rs.IdOT , Tecnico : rs.usuario, Cliente : sOT.nombre_cliente, Local : sOT.local,
				fechaOT : sFechaHuman
			};
			dataExp.push(_O);
		}
	}

	res.json( dataExp );
});
// -------------------------------------------------------
async function pad_de_ultra_Derecha(num, size) {
    num = num.toString();
    while (num.length < size) num = num+"_";
    return num;
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
async function tiempoPaso1( $tiempo )
{
	var $arTiempo = $tiempo.split(':');
	var $hora 	= '';
	var $minuto = '';
	if( $arTiempo.length > 0 ){
		// Hora
		if( parseInt( $arTiempo[0] ) > 0 ){
			$hora = parseInt( $arTiempo[0] );
		}
		// Minuto
		if( parseInt( $arTiempo[1] ) > 0 ){
			$minuto = parseInt( $arTiempo[1] );
		}
	}
	if( parseInt($hora) > 0 ){
		return `${$hora} hora y ${$minuto} minutos`;
	}else{
		return `${$minuto} minutos`;
	}
	
}
// -------------------------------------------------------
module.exports = router;
