// monitoreoModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_monitoreo',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: false
		},
		uu_id           : type.STRING,
		Constancia 		: type.STRING,
		IdSupervisor 	: type.DOUBLE,
		Supervisor		: type.TEXT,
		IdCliente 		: type.TEXT,
		Cliente 		: type.STRING,
		IdLocal			: type.STRING,
		Local 			: type.STRING,
		Fecha   		: type.STRING,
		Hora_inicio 	: type.STRING,
        Hora_fin    	: type.STRING,
		Documento_org   : type.STRING,
        IdReportadoPor 	: type.STRING,
        ReportadoPor    : type.STRING,
		Observaciones  	: type.STRING,
		Accion 			: type.TEXT,
		Estado 			: type.TEXT,
		Fecha_Cons 		: type.TEXT,
		IdArea 			: type.TEXT,
		Area 			: type.TEXT,
		Observado 		: type.TEXT,
		deleted_at 		: type.DATE,
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