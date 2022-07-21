// otrabajoOTProds

module.exports = (sequelize, type) => {
	return sequelize.define('orq_trabajo_ot_productos',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		id_trabajo  : type.INTEGER,
		IdOT        : type.INTEGER,
        IdProducto  : type.INTEGER,
        Producto    : type.STRING,
        IngActivo   : type.STRING,
        Dosis           : type.STRING,
        TiempoEspera    : type.STRING,
		estado          : type.STRING,
		IdCreadoPor 	: type.STRING,
		CreadoPor 		: type.STRING,
		IdAnuladoPor 	: type.STRING,
		AnuladoPor 		: type.STRING,
		FechaAnulado 	: type.DATE,
        deleted_at      : type.DATE,
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
