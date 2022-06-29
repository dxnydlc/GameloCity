// reportesModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_reportes',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        id_usuario  : type.INTEGER,
        usuario     : type.STRING,
        modulo      : type.STRING,
        formulario  : type.STRING,
        nombre      : type.STRING,
        fecha_inicio : type.DATE,
        fecha_fin    : type.DATE,
        id_documentos : type.STRING,
        check1      : type.STRING,
        id_adjunto  : type.INTEGER,
        archivo_referencia : type.STRING,
        registros   : type.INTEGER,
        tag : type.STRING,
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
