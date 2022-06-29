// horarioModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_horario',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		Codigo 		: type.STRING,
		horario     : type.STRING,
		estado      : type.STRING,
		IdCliente 	: type.INTEGER,
        Cliente     : type.STRING,
		IdLocal 	: type.INTEGER,
        Local 		: type.STRING,
        id_empresa  : type.INTEGER,
        empresa     : type.STRING,
        deleted_at  : type.DATE,
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