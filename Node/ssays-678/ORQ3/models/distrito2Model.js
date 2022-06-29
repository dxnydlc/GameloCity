// distrito2Model

module.exports = (sequelize, type) => {
	return sequelize.define('orq_distritos',{
		id:{
			type : type.STRING,
			primaryKey : true,
			autoIncrement: true
		},
		name 		: type.STRING,
		province_id : type.STRING,
		department_id : type.STRING,

	},{
		timestamps: false,
		freezeTableName: true
	})
}