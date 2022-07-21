// plantillaModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_plantilla',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Tipo    : type.STRING,
        Nombre  : type.STRING,
        Estado  : type.STRING,
        id_empresa  : type.STRING,
        empresa     : type.STRING,
        UsuarioCreado       : type.STRING,
        UsuarioModificado   : type.STRING,
        UsuarioAnulado  : type.STRING,
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
