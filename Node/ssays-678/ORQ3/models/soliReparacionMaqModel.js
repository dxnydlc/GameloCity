// soliReparacionMaqModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_solicitud_reparacion',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		Codigo      : type.STRING,
        FechaSolicitud : type.DATEONLY,
		IdCliente   : type.INTEGER,
		Cliente     : type.STRING,
        IdLocal     : type.INTEGER,
		Local       : type.STRING,
		AteInicio 	: type.STRING,
		AteFin 		: type.STRING,
        Direccion   : type.TEXT,
        Depa        : type.STRING,
        Prov        : type.STRING,
        Dist        : type.STRING,
        IdUbigeo    : type.STRING,
        IdActivo    : type.INTEGER,
        TActivo     : type.STRING,
        Marca       : type.STRING,
        Descripcion : type.TEXT,
        IdCreadoPor : type.INTEGER,
        CreadoPor   : type.STRING,
        Estado      : type.STRING,
        FechaAtencion   : type.DATEONLY,
        IdTecnico       : type.INTEGER,
        Tecnico         : type.STRING,
        Observaciones   : type.TEXT,
        Tecnico         : type.STRING,
        Diagnostico     : type.TEXT,
		EnvioMail 		: type.STRING,
		FehaEnvioMail 	: type.DATE,
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