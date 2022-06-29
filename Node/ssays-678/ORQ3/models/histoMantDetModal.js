// histoMantDetModal
module.exports = (sequelize, type) => {
	return sequelize.define('orq_historialdet',{
		id : {
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id		: type.STRING,
        Codigo      : type.STRING,        
        Token     	: type.STRING,
		IdProducto  : type.INTEGER,
        Producto    : type.STRING,
		Cantidad    : type.INTEGER,
        IdHistorial	: type.INTEGER,
        Glosa   	: type.STRING,
        Tipo   		: type.STRING,
        IdEmpresa   : type.INTEGER,
        Empresa     : type.STRING,
        Estado      : type.INTEGER,
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