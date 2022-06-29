// incidenciaComentarioModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_incidencias_comentarios',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
        CodInci     : type.STRING,
        IdInci      : type.DOUBLE(20,2),
		Comentario  : type.TEXT,
		IdUsuario   : type.STRING,
        Usuario     : type.STRING,
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
