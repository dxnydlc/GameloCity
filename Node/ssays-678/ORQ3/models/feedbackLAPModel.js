
// feedbackLAPModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_rpt_lap_feedback',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
        CodigoInforme : type.STRING,
        Glosa   : type.TEXT,
		Estado  : type.STRING,
		IdUsuario : type.INTEGER,
		Usuario   : type.STRING,
		createdAt : {
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
