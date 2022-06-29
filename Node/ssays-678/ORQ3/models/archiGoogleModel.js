
// archiGoogleModel

module.exports = (sequelize, type) => {
	return sequelize.define('orq_archivo_interno',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		id_modulo   : type.INTEGER,
		guardado_en : type.STRING,
        ruta_fisica     : type.TEXT,
        RutaOriginal    : type.TEXT,
        RutaThumbnail   : type.TEXT,
        id_usuario      : type.STRING,
        usuario         : type.STRING,
        modulo          : type.STRING,
        formulario      : type.STRING,
        nombre_archivo  : type.STRING,
        size            : type.STRING,
        nombre_fisico   : type.STRING,
        extension       : type.STRING,
        NroPaginas      : type.INTEGER,
        url             : type.TEXT,
        url_original    : type.TEXT,
        url_thumb       : type.TEXT,
        url_compress    : type.TEXT,
        url_400 : type.TEXT,
        url_40  : type.TEXT,
        tipo_documento : type.STRING,
        Cod001  : type.STRING,
        Cod002  : type.STRING,
        Cod003  : type.STRING,
        serie       : type.STRING,
        correlativo : type.INTEGER,
        id_mail     : type.INTEGER,
        id_respuesta: type.INTEGER,
        token       : type.TEXT,
        glosa       : type.TEXT,
        id_carpeta  : type.INTEGER,
        carpeta     : type.STRING,
        publico     : type.STRING,
        id_post     : type.INTEGER,
        id_empresa  : type.INTEGER,
        empresa     : type.STRING,
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
