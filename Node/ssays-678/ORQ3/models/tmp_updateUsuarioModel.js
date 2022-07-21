// tmp_updateUsuarioModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('tmp_orq_update_usuarios',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Token   : type.STRING,
		DNI     : type.INTEGER,
		Nombre  : type.STRING,
		Paterno : type.STRING,
        Materno : type.STRING,
		Correo  : type.STRING,
        Celular : type.STRING,
		Estado  : type.STRING,
		Puesto  : type.STRING,
		Turno   : type.STRING,
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
