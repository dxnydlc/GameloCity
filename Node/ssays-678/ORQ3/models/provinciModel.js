// provinciModel.js
// provinciaModel

module.exports = (sequelize, type) => {
	return sequelize.define('orq_provincias',{
		id:{
			type : type.STRING,
			primaryKey : true,
			autoIncrement: true
		},
        name : type.STRING,
        department_id : type.STRING
	},{
		timestamps: false,
		freezeTableName: true
	})
}