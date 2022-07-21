// fichaInspecCabModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('film',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		title : type.STRING,
		description: type.STRING,
		score : type.INTEGER,
		director : type.STRING,
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
