
// errorLogModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_error_log',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id       : type.STRING,
		modulo      : type.STRING,
		metodo      : type.STRING,
		descripcion : type.TEXT,
		envio       : type.TEXT,
        id_usuario  : type.TEXT,
        usuario     : type.TEXT,
        id_empresa  : type.TEXT,
        empresa     : type.TEXT,
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

