
// bitacoraSuperModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_bitacora_super',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id  : type.STRING,
        Codigo : type.STRING,
        Fecha  : type.DATEONLY,
		Anio   : type.INTEGER,
        Mes    : type.INTEGER,
		IdCliente : type.DOUBLE(20,0) ,
		Cliente : type.STRING,
        IdLocal : type.INTEGER,
		Local   : type.STRING,
        Glosa   : type.TEXT,
		IdArea1   : type.STRING,
		Area1   : type.STRING,
		IdArea2 : type.STRING,
		Area2   : type.STRING,
		IdBloque : type.STRING,
		Bloque   : type.STRING,
		IdAreaBloque : type.STRING,
		AreaBloque   : type.STRING,
		TurnoArea 	 : type.STRING,
		IdTrabajo    : type.STRING,
		Trabajo 	 : type.STRING,
		TurnoTrabajo : type.STRING,
		Estado  : type.STRING,
		MotivoAnulado: type.TEXT,
        IdSupervisor : type.INTEGER,
		Supervisor   : type.STRING,
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

