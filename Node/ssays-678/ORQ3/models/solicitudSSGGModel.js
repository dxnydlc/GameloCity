// solicitudSSGGModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_solicitud_ssgg_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id           : type.STRING,
        IdSolicitante   : type.INTEGER,
		Solicitante     : type.STRING,
        ServicioRealizar : type.STRING,
        OtroServicioRealizar : type.STRING,
        IdCliente       : type.INTEGER,
        Cliente         : type.STRING,
        IdSucursal      : type.INTEGER,
        Sucursal        : type.STRING,
        Direccion       : type.TEXT,
        Contacto        : type.STRING,
        Telefono        : type.STRING,
        InicioServicio  : type.DATE,
        FinServicio     : type.DATE,
        HoraServicio    : type.STRING,
		Glosa           : type.TEXT,
        Estado          : type.STRING,

        IdCreadoPor     : type.INTEGER,
        CreadoPor       : type.STRING,
        IdModificadoPor : type.INTEGER,
        ModificadoPor   : type.STRING,
        IdAnuladoPor    : type.INTEGER,
        AnuladoPor      : type.STRING,
        MotivoAnulacion : type.STRING,

		deleted_at      : type.STRING,
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