
// planosDetModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_planos_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
        CodigoHead : type.STRING,
		Tipo 	: type.STRING,
		Nombre  : type.STRING,
		Titulo 	: type.STRING,
        Area    : type.STRING,
		Top     : type.BIGINT,
		Left    : type.STRING,
        Estado  : type.STRING,
        Indice  : type.INTEGER,
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
