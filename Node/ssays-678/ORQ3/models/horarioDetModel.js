// horarioDetModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_horario_detalle',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
        },
        uu_id       : type.STRING,
		id_horario  : type.INTEGER,
		token       : type.STRING,
		glosa       : type.STRING,
        dia         : type.STRING,
        inicio      : type.STRING,
        fin         : type.STRING,
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