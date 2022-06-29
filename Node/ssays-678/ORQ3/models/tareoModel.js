// tareoModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_tareo',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		Codigo 		: type.STRING,
		Nombre 		: type.STRING,
		IdCliente 	: type.DOUBLE,
		Cliente 	: type.STRING,
		IdLocal 	: type.DOUBLE,
		Local 		: type.STRING,
		IdArea 		: type.INTEGER,
		Area 		: type.STRING,
		IdTurno 	: type.INTEGER,
		Turno 		: type.STRING,
		Anio		: type.INTEGER,
		Mes   		: type.STRING,
		Fecha 		: type.INTEGER,
		IdSupervisor   	: type.STRING,
		Supervisor 		: type.INTEGER,
		Estado      	: type.STRING,
		NroOperarios 	: type.INTEGER,
		NroFaltas 		: type.INTEGER,
		NroAsistencias 	: type.INTEGER,
        deleted_at  	: type.DATE,
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