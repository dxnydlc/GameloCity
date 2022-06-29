// turnoCabModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_turno_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		Codigo  : type.STRING,
		uu_id   : type.STRING,
        Nombre  : type.STRING,
        Estado  : type.STRING,
		IdCliente   : type.INTEGER,
		Cliente     : type.STRING,
        IdLocal     : type.INTEGER,
		Local       : type.STRING,
		Inicio 		: type.STRING,
		Fin 		: type.STRING,
        deleted_at : type.DATE,
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