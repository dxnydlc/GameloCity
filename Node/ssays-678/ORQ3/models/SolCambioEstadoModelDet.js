// SolCambioEstadoModelDet

module.exports = (sequelize, type) => {
	return sequelize.define('orq_soli_cambio_estado_doc_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		CodigoCab   : type.STRING,
        TDoc    : type.STRING,
		NroDoc  : type.INTEGER,
		Motivo  : type.TEXT,
        Token   : type.STRING,
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

