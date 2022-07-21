// productoFI21Model.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_ficha_inspeccion_productos',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
		IdLocal : type.INTEGER,
		Local   : type.STRING,
        IdServicio  : type.INTEGER,
		Servicio    : type.STRING,
        IdProducto  : type.INTEGER,
		Producto    : type.STRING,

        Cantidad : type.DECIMAL(20,2),
        CostoUnt : type.DECIMAL(20,2),
        Total    : type.DECIMAL(20,2),

        Token    : type.STRING,
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
