// aprobacionesModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_aprobaciones',{
		IdAprobar:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
        },
        uu_id           : type.STRING,
		Codigo  : type.STRING,
		IdTipoDoc       : type.INTEGER,
		tipo_documento  : type.STRING,
		IdUser          : type.STRING,
        id_empresa      : type.INTEGER,
        empresa         : type.STRING,
        nombre_usuario : type.STRING,
        editar      : type.STRING,
        crear       : type.STRING,
        anular      : type.STRING,
        aprobar     : type.STRING,
		Estado      : type.STRING,
        deleted_at  : type.DATE,
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