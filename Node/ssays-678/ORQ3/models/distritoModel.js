module.exports = (sequelize, type) => {
	return sequelize.define('orq_ubigeo_distritos',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		name 		: type.STRING,
		province_id : type.INTEGER,
		department_id : type.INTEGER,

	},{
		timestamps: false,
		freezeTableName: true
	})
}