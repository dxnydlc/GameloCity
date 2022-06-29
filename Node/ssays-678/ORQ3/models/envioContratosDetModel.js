// envioContratosDetModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_envio_contatos_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id        : type.STRING,
		CodigoEnvio  : type.STRING,
		Token        : type.STRING,
        Glosa        : type.TEXT,
        IdArchivo    : type.INTEGER,
		Archivo      : type.STRING,
        DNI          : type.INTEGER,
        Nombre       : type.STRING,
		Email 		 : type.STRING,
		Celular      : type.STRING,
        Estado       : type.STRING,
		Resultado 	 : type.STRING,
		ResultadoCelular : type.STRING,
		Visto 		 : type.STRING,
		FechaVisto 	 : type.DATE,
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