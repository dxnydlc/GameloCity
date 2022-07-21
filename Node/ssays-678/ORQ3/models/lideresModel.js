// lideresModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_lideres_equipo',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		Codigo 		: type.STRING,
        id_usuario  : type.INTEGER,
		usuario     : type.STRING,
		glosa_usuario : type.STRING,
        nivel       : type.INTEGER,
        id_area     : type.INTEGER,
        area        : type.STRING,
        unidad_negocio : type.STRING,
		Estado 		: type.STRING,
        UsuarioMod  : type.INTEGER,
		UsuarioN 	: type.STRING,
        id_empresa  : type.INTEGER,
        FechaMod    : type.DATE,
        empresa     : type.STRING,
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