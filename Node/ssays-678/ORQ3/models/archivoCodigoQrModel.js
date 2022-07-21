// archivoCodigoQrModel

module.exports = (sequelize, type) => {
	return sequelize.define('orq_archivo_codigoqr',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id           : type.STRING,
		id_modulo       : type.INTEGER,
		modulo          : type.STRING,
        formulario      : type.TEXT,
        nombre_archivo  : type.STRING,
        nombre_fisico   : type.STRING,
        extension       : type.STRING,
        url             : type.STRING,
        tipo_documento  : type.STRING,
        serie           : type.STRING,
        correlativo     : type.STRING,
        id_empresa      : type.STRING,
        empresa         : type.STRING,
        token           : type.TEXT,
        glosa           : type.TEXT,
        guardado_en     : type.STRING,
        usuario         : type.STRING,
        id_usuario      : type.INTEGER,
        url_400         : type.INTEGER,
        url_40          : type.INTEGER,
        size            : type.TEXT,
        id_mail         : type.TEXT,
        id_respuesta    : type.INTEGER,
        ruta_fisica     : type.TEXT,
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
