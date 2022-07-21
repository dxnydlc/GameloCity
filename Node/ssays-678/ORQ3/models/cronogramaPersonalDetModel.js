
// cronogramaPersonalDetModel.js


module.exports = (sequelize, type) => {
	return sequelize.define('orq_cronograma_usuario_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
        CodigoHead  : type.STRING,

        Indice  : type.INTEGER,
        Hinicio     : type.TIME,
        HFin        : type.TIME,
		Horario     : type.STRING,
		Actividad   : type.STRING,
        Lu      : type.STRING,
        Ma      : type.STRING,
        Mi      : type.STRING,
        Ju      : type.STRING,
        Vi      : type.STRING,
        Sa      : type.STRING,
        Do      : type.STRING,
        Token   : type.STRING,
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

