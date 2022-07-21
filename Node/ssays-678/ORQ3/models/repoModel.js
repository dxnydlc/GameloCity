// repoModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_repositorio',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
		Disco 	: type.STRING,
		Parent 	: type.INTEGER,
		Ruta    : type.TEXT,
		Label   : type.STRING,
        EsDriver    : type.INTEGER,
        EsFolder    : type.INTEGER,
        EsSubFolder : type.INTEGER,
		SubItems    : type.TEXT,
		Extension 	: type.STRING,
        IdUsuario   : type.INTEGER,
        Usuario     : type.STRING,
        Estado      : type.STRING,
        id_empresa  : type.INTEGER,
        empresa     : type.STRING,
		Icono 		: type.STRING,
		IdCliente 	: type.BIGINT,
		IdLocal  	: type.INTEGER,
		url : type.TEXT,
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
