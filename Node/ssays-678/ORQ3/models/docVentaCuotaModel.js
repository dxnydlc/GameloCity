// docVentaCuotaModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_doc_ventas_cuotas',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		CodigoHead  : type.STRING,
		NroCuota    : type.INTEGER,
        MontoPagoCuota : type.DECIMAL(20,4),
		FechaPagoCuota : type.DATEONLY,
        Pendiente      : type.DECIMAL(20,4),
        Token          : type.STRING,
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
