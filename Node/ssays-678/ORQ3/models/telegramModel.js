
// telegramModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_telegram_conexion',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
		Codigo : type.STRING,
		IdChat: type.BIGINT,
        FirstName : type.STRING,
        LastName : type.STRING,

		DNI     : type.INTEGER,
		Nombre  : type.STRING,
        Paterno : type.STRING,
        Materno : type.STRING,
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

