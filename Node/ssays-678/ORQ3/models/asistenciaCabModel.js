// asistenciaCabModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_asistencia_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
        Codigo      : type.STRING,
        IdCliente   : type.INTEGER,
		Cliente     : type.STRING,
		IdLocal     : type.INTEGER,
		Local       : type.STRING,
		IdHorario 	: type.INTEGER,
		Horario 	: type.STRING,
		Fecha 		: type.DATEONLY,
        Anio        : type.STRING,
        Mes         : type.STRING,
        Glosa       : type.STRING,
        Estado      : type.STRING,
        DNICreado       : type.INTEGER,
        CreadoPor       : type.STRING,
        DNIModificado   : type.INTEGER,
        ModificadoPor   : type.STRING,
        DNIAnulado      : type.INTEGER,
        AnuladoPor      : type.STRING,
        MotivoAnulado   : type.STRING,
		NroPersonal : type.INTEGER,
		NroTarde 	: type.INTEGER,
		NroTemprano : type.INTEGER,
		NroATiempo 	: type.INTEGER,
		NroFaltas 	: type.INTEGER,
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