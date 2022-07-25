
// clienteModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_cliente',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		Codigo       : type.STRING,
		uu_id 		 : type.STRING,
		Tipo 		 : type.INTEGER,
		id_rubro 	 : type.INTEGER,
		rubro 		 : type.STRING,
		tipo_cliente : type.STRING,
		Razon 		 : type.STRING,
		RUC 		 : type.DOUBLE,
		Direccion 			: type.TEXT,
		ReferenciaDireccion : type.TEXT,
		IdMoneda 		: type.INTEGER,
		moneda 			: type.STRING,
		Telefono 		: type.STRING,
		Estado 			: type.INTEGER,
		IdGrupo 		: type.INTEGER,
		Grupo 			: type.STRING,
		UsuarioMod 		: type.STRING,
		FechaMod 		: type.DATE,
		Fax 			: type.STRING,
		Movil 			: type.STRING,
		Email 			: type.STRING,
		EmailContacto 	: type.STRING,
		Contacto 		: type.STRING,
		Glosa 			: type.TEXT,
		IdGiro 			: type.INTEGER,
		nombre_giro 	: type.STRING,
		NombreComercial : type.STRING,
		IdCentro 		: type.INTEGER,
		centro_costos 	: type.STRING,
		TipoServicio 	: type.STRING,
		DiaDespacho 	: type.STRING,
		ColaboradorAsig : type.STRING,
		TipoCliente 	: type.STRING,
		TerminosR 		: type.STRING,
		MontoMaxReq 	: type.STRING,
		C025 			: type.STRING,
		CondicionPago 	: type.INTEGER,
		CentroCosto 	: type.INTEGER,
		CodContaCC 		: type.STRING,
		DNI 			: type.STRING,
		VisitasProg 	: type.INTEGER,
		CarnetExt 		: type.STRING,
		AgenteRet 		: type.STRING,
		Tipodocumento 	: type.STRING,
		Urbanizacion 	: type.STRING,
		idUbigeo 		: type.STRING,
		ubigeo 			: type.STRING,
		Pais 			: type.STRING,
		Departamento 	: type.STRING,
		NombreDepartamento : type.STRING,
		Provincia 		: type.STRING,
		NombreProvincia : type.STRING,
		Distrito 		: type.STRING,
		TipoDir 		: type.STRING,
		NombreCalle 	: type.STRING,
		NroCalle 		: type.STRING,
		OtrosCalle 		: type.STRING,
		EjecutivoCuentas 			: type.STRING,
		NombreEjecutivoCuentas 		: type.STRING,
		EjecutivoCuentas_OSA 		: type.STRING,
		NombreEjecutivoCuentas_OSA 	: type.STRING,
		EjecutivoCuentas_OLI 		: type.STRING,
		NombreEjecutivoCuentas_OLI 	: type.STRING,
		CodMoneda 		: type.STRING,
		NombreMoneda 	: type.STRING,
		EstadoDoc 		: type.STRING,
		ContactoOLI 	: type.STRING,
		MovilOLI 		: type.STRING,
		EmailOLI 		: type.STRING,
		monto_contrato 	: type.DECIMAL(10, 6),
		go 				: type.DECIMAL(10, 6),
		gad 			: type.DECIMAL(10, 6),
		ut 				: type.DECIMAL(10, 6),
		operarios 		: type.DECIMAL(10, 6),
		locales 		: type.INTEGER,
		vencimiento_contrato 	: type.DATEONLY,
		inicio_contrato 		: type.DATEONLY,
		UsuarioModOLI 	: type.STRING,
		FechaModOLI 	: type.DATE,
		ContactoOSA 	: type.STRING,
		MovilOSA 		: type.STRING,
		EmailOSA 		: type.STRING,
		UsuarioModOSA 	: type.STRING,
		FechaModOSA 	: type.STRING,
		llave 			: type.STRING,
		id_ejecutivo_cuenta_osa : type.INTEGER,
		ejecutivo_cuenta_osa 	: type.STRING,
		id_facturador 			: type.INTEGER,
		monto_materiales 	: type.DECIMAL(20, 6),
		monto_implementos 	: type.DECIMAL(20, 6),
		monto_indumentaria 	: type.DECIMAL(20, 6),
		monto_intitucional 	: type.DECIMAL(20, 6),
		id_ejecutivo_cuenta_oli : type.INTEGER,
		ejecutivo_cuenta 	: type.STRING,
		facturador 			: type.STRING,
		id_ejecutivo_cuenta  : type.INTEGER,
		ejecutivo_cuenta_oli : type.STRING,
		IdClienteProv : type.DOUBLE,
		lat 	: type.TEXT,
		lng 	: type.TEXT,
		tags 	: type.TEXT,
		logo 	: type.STRING,
		logo_40 	: type.TEXT,
		logo_400 	: type.TEXT,
		id_empresa 	: type.INTEGER,
		empresa 	: type.STRING,
		deleted_at 	: type.DATE,
		createdAt: {
			type: type.DATE,
			field: 'created_at',
		},
		updatedAt: {
			type: type.DATE,
			field: 'updated_at'
		}
	},{
		timestamps: true,
		freezeTableName: true
	})
}