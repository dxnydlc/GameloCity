// xlsLAPMantMaqPartesModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_xls_mant_maq_partes',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
		CodigoHead : type.STRING,

		Parte   : type.STRING,
		Estado  : type.STRING,
        Token  : type.STRING,

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
