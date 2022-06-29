// giroModel
module.exports = (sequelize, type) => {
	return sequelize.define('utb_giro',{
		IdGiro:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		Codigo 		: type.STRING,
		uu_id 		: type.STRING,
		Descripcion : type.STRING,
		C003        : type.STRING,
		C004        : type.STRING,
        C005        : type.STRING,
        Estado      : type.STRING,
        UsuarioMod  : type.STRING,
        FechaMod    : type.DATE,
        id_empresa  : type.INTEGER,
        empresa     : type.STRING,
        deleted_at  : type.DATE,
		createdAt   : {
			type    : type.DATE,
			field   : 'created_at',
		},
		updatedAt   : {
			type    : type.DATE,
			field   : 'updated_at'
		}
	},{
		timestamps      : true,
		freezeTableName : true
	})
}
