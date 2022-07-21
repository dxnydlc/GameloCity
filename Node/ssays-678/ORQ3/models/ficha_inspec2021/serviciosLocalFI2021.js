// serviciosLocalFI2021.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_ficha_inspeccion_servicios_local',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id 		: type.STRING,
		Codigo		: type.STRING,
		IdLocal 	: type.INTEGER,
        Local		: type.STRING,
        IdServicio 	: type.INTEGER,
        Servicio	: type.STRING,
		Flag 		: type.STRING,

		TipoServicioEjecutar	: type.STRING,
		CondSanitaria	: type.STRING,
		CaracEstructurales	: type.STRING,
		CaracEstructurales	: type.STRING,
		EPPsSolicitados	: type.STRING,
		PresenciaSup	: type.STRING,
		PresenciaSupEHS	: type.STRING,
		CharlaInduccion	: type.STRING,
		FechaCharlaInduccion	: type.STRING,

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
