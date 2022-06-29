// sucursalModel.js
// sucursalModel
module.exports = (sequelize, type) => {
	return sequelize.define('orq_sol_nuevo_servicio',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: false
		},
		uu_id		: type.STRING,
		Codigo 		: type.STRING,
		id_usuario 	: type.INTEGER,
		usuario		: type.STRING,
		id_sistema 	: type.INTEGER,
		sistema 	: type.STRING,
		contenido	: type.TEXT,
		servicios 	: type.TEXT,
		token   	: type.TEXT,
		lat 		: type.STRING,
        lng    		: type.STRING,
		estado     	: type.STRING,
        id_empresa 	: type.INTEGER,
        empresa    	: type.STRING,
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