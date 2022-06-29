// requisicionAlmacelDetModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_requisicion_almacen_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id 			: type.STRING,
		IdRequisicion 	: type.STRING,
        IdArticulo      : type.STRING,
		Articulo        : type.STRING,
		UnidadMedida    : type.STRING,
		Cantidad        : type.DECIMAL(20,2),
        CostoUnit       : type.DECIMAL(20,2),
        Total           : type.DECIMAL(20,2),
		Glosa           : type.TEXT,
        token           : type.STRING,
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