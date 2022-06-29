// paHeaderModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_pedidoalmacencab',{
		IdPedAlmacenCab:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id 				: type.STRING,
		Fecha 				: type.DATEONLY,
		fecha_entrega 	 	: type.DATEONLY,
		pendiente_recojo 	: type.INTEGER,
		IdCentro 			: type.INTEGER,
		centro_costos 		: type.STRING,
		Solicitante 		: type.TEXT,
		nombre_solicitante 	: type.STRING,
		AutorizadoPor 		: type.INTEGER,
		nombre_autorizado 	: type.STRING,
		Glosa 				: type.TEXT,
		Estado 			: type.STRING,
		id_almacen 		: type.INTEGER,
		almacen 		: type.STRING,
		FechaMod 		: type.DATE,
		UsuarioMod 		: type.STRING,
		Atendido 		: type.INTEGER,
		EstadoAtendido 	: type.STRING,
		FechaModAt 		: type.DATE,
		UsuarioModAt 	: type.STRING,
		UsuarioModAp 	: type.STRING,
		FechaModAp 		: type.DATE,
		MotivoAnular 	: type.STRING,
		UsuarioModAn 	: type.DATE,
		fecha_pedlisto 	: type.DATE,
		usuariomod_pedlisto : type.STRING,
		PC 				: type.INTEGER,
		OC 				: type.INTEGER,
		PE 				: type.INTEGER,
		DocDevuelto 	: type.STRING,
		dentro_fecha 	: type.INTEGER,
		TipoCambio 		: type.DECIMAL(10, 3),
		total_items 	: type.DECIMAL(10, 6),
		flag_atencion 	: type.STRING,
		id_empresa 		: type.INTEGER,
		empresa 		: type.STRING,
		deleted_at : type.DATE,
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