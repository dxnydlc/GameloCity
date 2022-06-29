// LAPCarritoBarredorDetModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_info_mant_barredora_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
		CodigoHead  : type.STRING,
        Codigo  : type.STRING,
        Observacion : type.TEXT,
		Fecha   : type.DATEONLY,
		Causa   : type.TEXT,
        Estado  : type.STRING,
        Token   : type.STRING,
        MedidaCorrectiva : type.TEXT,
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


