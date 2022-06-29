// numRechazadosModel
module.exports = (sequelize, type) => {
	return sequelize.define('orq_numeros_rechazados',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		Codigo     : type.STRING,
		uu_id     : type.STRING,
		celular     : type.STRING,
		Estado     : type.STRING,
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