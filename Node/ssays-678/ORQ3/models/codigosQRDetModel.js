// incidenciasModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('codigos_det_qr',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
        },
        uu_id 		: type.STRING,  
	    CodigoHead  : type.STRING, 
		IdProducto  : type.INTEGER,
		Nombre      : type.STRING,
		Token   	: type.STRING,
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