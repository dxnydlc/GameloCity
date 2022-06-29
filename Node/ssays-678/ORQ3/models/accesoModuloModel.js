// accesoModuloModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_acceso_modulo',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		Codigo 	   : type.STRING,
		uu_id 	   : type.STRING,
		modulo 	   : type.STRING,
		id_usuario : type.INTEGER,
		email 	   : type.STRING,
		usuario    : type.STRING,
		estado 	   : type.STRING,

		UsuarioCreado 	  : type.STRING,
		UsuarioModificado : type.STRING,
		UsuarioAnulado 	  : type.STRING,

		id_empresa 	: type.INTEGER,
		empresa 	: type.STRING,
		deleted_at 	: type.DATE,
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