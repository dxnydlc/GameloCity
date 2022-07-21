// depaModel
// departamentoModel

module.exports = (sequelize, type) => {
	return sequelize.define('orq_departamentos',{
		id:{
			type : type.STRING,
			primaryKey : true,
			autoIncrement: true
		},
		name : type.STRING
	},{
		timestamps: false,
		freezeTableName: true
	})
}