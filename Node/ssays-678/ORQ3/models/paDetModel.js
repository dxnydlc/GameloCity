// paDetModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_pedidoalmacendet',{
		IdPedAlmacenDet:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		IdPedAlmacenCab : type.INTEGER,
		uu_id 			: type.STRING,
		IdProducto 		: type.INTEGER,
		CostoUnit 		: type.DECIMAL(20, 3),
		producto 		: type.STRING,
		IdUMedida 		: type.INTEGER,
		unidad_medida 	: type.STRING,
		Cantidad 		: type.INTEGER,
		Glosa 			: type.TEXT,
		id_almacen 	: type.INTEGER,
		almacen 	: type.STRING,
		CantAte 		: type.DECIMAL(10, 6),
		CantPen 		: type.DECIMAL(10, 6),
		CantAteNuevo 	: type.DECIMAL(10, 6),
		CantEntregadoNuevo : type.DECIMAL(10, 6),
		CantPendienteNuevo : type.DECIMAL(10, 6),
		id_almacen_nuevo : type.INTEGER,
		almacen_nuevo 	 : type.STRING,
		CantAteUsado 		: type.DECIMAL(10, 6),
		CantEntregadoUsado 	: type.DECIMAL(10, 6),
		CantPendienteUsado 	: type.DECIMAL(10, 6),
		id_almacen_usado 	: type.INTEGER,
		almacen_usado 		: type.STRING,
		EstAt 		: type.STRING,
		Resta 		: type.DECIMAL(10, 6),
		Atendido 	: type.INTEGER,
		PedCompra 	: type.INTEGER,
		oCompra 	: type.INTEGER,
		pEntrada 	: type.INTEGER,

		FechaEntrega : type.DATE,

		MotivoCambio : type.TEXT,
		FechaInspeccion : type.DATE,

		UsuarioModifica : type.STRING,
		FechaModifica 	: type.DATE,

		token 		: type.STRING,
		id_empresa 	: type.INTEGER,
		empresa 	: type.STRING,
		created_at 	: type.DATE,
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