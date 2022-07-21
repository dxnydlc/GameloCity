// SolCambioEstadoModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_soli_cambio_estado_doc_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
        IdSolicitante   : type.INTEGER,
        Solicitante     : type.STRING,
        IdAutorizado    : type.INTEGER,
        Autorizado      : type.STRING,
        Motivo  : type.TEXT,
        Fecha   : type.DATE,
        Mes     : type.STRING,
		Anio    : type.INTEGER,
        NroItems: type.INTEGER,
        Estado  : type.STRING,
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

