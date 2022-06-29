
// planosModel.js


module.exports = (sequelize, type) => {
	return sequelize.define('orq_planos_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
        IdCliente   : type.BIGINT,
		Cliente     : type.STRING,
		IdLocal     : type.INTEGER,
		Local       : type.STRING,
        IdServicio  : type.INTEGER,
		Servicio    : type.STRING,
        IdArchivo   : type.INTEGER,
		Archivo     : type.STRING,
        Nombre      : type.STRING,
        Estado      : type.STRING,
        Alto    : type.BIGINT,
        Ancho   : type.BIGINT,
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


