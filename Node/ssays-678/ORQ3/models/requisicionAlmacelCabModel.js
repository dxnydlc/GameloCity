// requisicionAlmacelCabModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_requisicion_almacen_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id 			: type.STRING,
		IdRequisicion 	: type.STRING,
		IdSolicitante 	: type.INTEGER,
		Solicitante 	: type.STRING,
		IdAutorizadoPor : type.INTEGER,
		AutorizadoPor 	: type.STRING,
		IdCentro 		: type.INTEGER,
		CentroCostos 	: type.STRING,
		CodContaCC 		: type.STRING,
		Glosa 			: type.TEXT,
		Fecha 			: type.DATE,
		FechaEntrega 	: type.DATE,
		TotalDetalle 	: type.DECIMAL(20,2),
		NroItemsDetalle : type.DECIMAL(20,2),
		TipoCambio 		: type.DECIMAL(20,2),
		Estado 			: type.STRING,
		UsuarioMod 		: type.STRING,
		FechaMod 		: type.DATE,
		UsuarioModAp 	: type.STRING,
		FechaModAp 		: type.DATE,
		UsuarioModAn 	: type.STRING,
		FechaModAn 		: type.DATE,
		MotivoAnulacion : type.TEXT,
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