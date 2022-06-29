
// productoTrabajoOTModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_productos_trabajo_ot',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
        CodigoHead : type.STRING,
		IdOT    : type.INTEGER,
		IdOS    : type.INTEGER,
        IdTecnico   : type.INTEGER,
		Tecnico     : type.STRING,
        IdProducto  : type.INTEGER,
		Producto    : type.STRING,
        Ingrediente : type.STRING,
        Dosis       : type.STRING,
        TiempoEspera : type.STRING,
        Token       : type.STRING,
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

