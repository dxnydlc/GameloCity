
// notificarUsuarioModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_notificar_usuarios_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},

		uu_id				: type.STRING,
		Codigo     			: type.STRING,		
		Tipo     			: type.STRING,
		Texto     			: type.STRING,
		Nombre     			: type.STRING,
		Fecha_publicacion   : type.DATE,
		Fecha_inicio   : type.DATE,
		fecha_fin   : type.DATE,
		URL_destino     	: type.STRING,
		Estado				: type.STRING,
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