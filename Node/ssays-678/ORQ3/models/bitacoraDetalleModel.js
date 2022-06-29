
// bitacoraDetalleModel.js



module.exports = (sequelize, type) => {
	return sequelize.define('orq_bitacora_detalle',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
		CodigoHead : type.STRING,
		Nombre  : type.STRING,
		Glosa   : type.TEXT,
        Estado  : type.STRING,
        Token  : type.STRING,
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


