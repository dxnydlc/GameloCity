// asistenciaDetModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_asistencia_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		CodigoHead  : type.STRING,
		IdUsuario   : type.INTEGER,
		Usuario     : type.STRING,
		Cargo 		: type.STRING,
        IdHorario   : type.INTEGER,
		Horario     : type.STRING,
        Fecha       : type.STRING,
        Hora        : type.STRING,
        Glosa       : type.STRING,
        Estado      : type.STRING,
        Token       : type.STRING,
        DNICreado   : type.INTEGER,
        CreadoPor   : type.STRING,
        DNIModificado   : type.INTEGER,
        ModificadoPor   : type.STRING,
        DNIAnulado      : type.INTEGER,
        AnuladoPor      : type.STRING,
        MotivoAnulado   : type.TEXT,
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