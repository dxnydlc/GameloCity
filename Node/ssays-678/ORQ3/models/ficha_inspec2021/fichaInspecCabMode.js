// fichaInspecCabMode.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_ficha_inspeccion_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        IdFicha : type.BIGINT,
		uu_id : type.STRING,
		Codigo: type.STRING,

        IdClienteProv   : type.BIGINT,
        TipoCliente     : type.STRING,
        TipoDocCliente  : type.STRING,
        NombreCliente   : type.TEXT,
        NombreComercial : type.TEXT,
        NroDNI : type.INTEGER,
        NroRUC : type.BIGINT,
        IdGiro : type.INTEGER,
        NombreGiro : type.STRING,
        IdDepartamento : type.STRING,
        Departamento : type.STRING,
        IdProvincia : type.STRING,
        Provincia   : type.STRING,
        IdDistrito  : type.STRING,
        Distrito    : type.STRING,
        TipoDir     : type.STRING,
        NombreCalle : type.STRING,
        NroCalle : type.STRING,
        OtrosCalle  : type.STRING,
        Urbanizacion : type.STRING,
        Direccion : type.TEXT,
        ReferenciaDireccion : type.TEXT,
        Lat : type.TEXT,
        Lng : type.TEXT,
        TelefonoCliente : type.STRING,
        AnexoCliente    : type.STRING,
        CelularCliente  : type.STRING,
        NroOC       : type.STRING,
        Concacto    : type.STRING,
        CelularContacto : type.STRING,
        TelefonoContacto : type.STRING,
        AnexoContacto   : type.STRING,
        CorreoContacto  : type.STRING,
        CorreoFacturar  : type.STRING,
        IdCentroCostos  : type.INTEGER,
        CentroCostos    : type.STRING,
        MotivoSolicitud : type.STRING,
        FechaContacto   : type.DATE,
        FormaContacto   : type.STRING,
        OtrosContacto   : type.STRING,
        IdRepComercial  : type.INTEGER,
        RepComercial    : type.STRING,
        Estado  : type.STRING,
        EstadoContacto  : type.STRING,
        NroLocales      : type.INTEGER,
        NroServicios    : type.INTEGER,
        NroOSs : type.INTEGER,
        NroOTs : type.INTEGER,
        IdUsuarioMod    : type.INTEGER,
        UsuarioMod      : type.STRING,
        MotivoAnulado   : type.TEXT,
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

