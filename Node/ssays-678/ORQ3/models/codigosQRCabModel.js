// incidenciasModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('codigos_cab_qr',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
        },
        uu_id 		: type.STRING,  
		Codigo      : type.STRING, 
		Nombre      : type.STRING,
		IdProducto  : type.INTEGER,
		Producto    : type.STRING,
		Estado   	: type.STRING,
        //deleted_at  : type.DATE,
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