// empresaModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_empresas',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		razon_social    : type.STRING,
		nombre_comercial: type.STRING,
		ruc             : type.INTEGER,
        parte_grupo     : type.STRING,
        contacto        : type.STRING,
        correo          : type.STRING,
        telefono        : type.STRING,
        direccion       : type.STRING,
        logo        : type.STRING,
        logo_40     : type.STRING,
        logo_400    : type.STRING,
        estado      : type.STRING,
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