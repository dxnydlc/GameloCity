// resultadoEmoModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_emo_resultados',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		dni     : type.INTEGER,
        usuario : type.STRING,

        id_archivo      : type.INTEGER,
        archivo         : type.STRING,
        vencimiento     : type.DATEONLY,
        emision         : type.DATEONLY,
        clinica         : type.STRING,
        aptitud         : type.STRING,
        tipo_archivo_salud : type.STRING,
        glosa       : type.STRING,
        carpeta     : type.STRING,
        id_empresa  : type.INTEGER,
        empresa     : type.STRING,
        
		deleted_at : type.DATE,
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