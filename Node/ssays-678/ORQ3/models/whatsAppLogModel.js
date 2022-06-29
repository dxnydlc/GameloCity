// whatsAppLogModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_whatsapp_log',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Usuario : type.STRING,
		DNI 	: type.INTEGER,
		Celular : type.STRING,
		Mensaje : type.TEXT,
        Fecha   : type.DATE,
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