// auditoriaSSAYSModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_auditoria',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id 		: type.STRING,
        DNI     	: type.INTEGER,
		Usuario 	: type.STRING,
		Modulo  	: type.STRING,
        Formulario  : type.STRING,
        Evento      : type.STRING,
        Entrada     : type.TEXT,
        Salida      : type.TEXT,
        Glosa       : type.TEXT,
        Serie       : type.STRING,
        Correlativo : type.STRING,
		UrlOrigen 	: type.TEXT,
		TokenDoc  	: type.STRING,
		id_empresa  : type.INTEGER,
		empresa  	: type.STRING,
		deleted_at  : type.DATE,
		createdAt: {
			type    : type.DATE,
			field   : 'created_at',
		},
		updatedAt: {
			type    : type.DATE,
			field   : 'updated_at'
		}
	},{
        timestamps      : true,
        freezeTableName : true
	})
}