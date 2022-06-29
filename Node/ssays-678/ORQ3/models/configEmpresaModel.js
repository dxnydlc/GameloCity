// configEmpresaModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_configuracion',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		id_empresa  : type.INTEGER,
		empresa     : type.INTEGER,
        tipo_doc    : type.STRING,
        cierre      : type.STRING,
        glosa       : type.STRING,
        estado      : type.STRING,
        UsuarioCreado       : type.STRING,
        UsuarioModificado   : type.STRING,
        UsuarioAnulado      : type.STRING,
        deleted_at : type.STRING,

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
