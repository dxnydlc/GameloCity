// articulosModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_articulos',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id           : type.STRING,
		CodigoArticulo  : type.STRING,
		Descripcion     : type.STRING,
		UnidadMedida    : type.STRING,
        Moneda          : type.STRING,
        Cuenta          : type.STRING,
        FCompra         : type.DATE,
        Precio          : type.DECIMAL(20,2),
        Estado          : type.STRING,
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