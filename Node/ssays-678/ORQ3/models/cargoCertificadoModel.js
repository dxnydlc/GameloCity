//cargoCertificadoModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_cargo_certificado',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		id_certificado : type.INTEGER,
		id_os 		: type.INTEGER,
		id_cliente 	: type.INTEGER,
		cliente 	: type.STRING,
		fecha 		: type.DATEONLY,
		id_recepcion : type.INTEGER,
		recibido_por : type.STRING,
		id_entregado : type.INTEGER,
		entregado_a  : type.STRING,
		fecha_entrega 	: type.DATEONLY,
		fecha_retorno 	: type.DATEONLY,
		recepcion_anulado : type.STRING,
		observaciones 	: type.TEXT,
		id_empresa 		: type.INTEGER,
		empresa 		: type.STRING,
		deleted_at 		: type.DATE,
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
