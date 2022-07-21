// votacionModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_votaciones',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Nombre  : type.STRING,
		DNI     : type.INTEGER,
		Puesto  : type.STRING,
        Unidad  : type.STRING,
        Firma   : type.TEXT,
		Tag 	: type.STRING,
        OpcionSeleccionada : type.STRING,
        deleted_at  : type.DATE,
		createdAt : {
			type  : type.DATE,
			field : 'created_at',
		},
		updatedAt : {
			type  : type.DATE,
			field : 'updated_at'
		}
	},{
		timestamps: true,
		freezeTableName: true
	})
}