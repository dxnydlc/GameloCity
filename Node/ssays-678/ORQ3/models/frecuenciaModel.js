// frecuenciaModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_frecuenciaentrega',{
		IdFEntrega:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		Descripcion : type.STRING
	},{
		timestamps: false,
		freezeTableName: true
	})
}