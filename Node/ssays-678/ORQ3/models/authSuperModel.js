// authSuperModel.js
module.exports = (sequelize, type) => {
	return sequelize.define( 'orq_auditoria_supervisor' , {
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
        Codigo  : type.STRING,
		
		IdSupervisor : type.INTEGER,
		Supervisor   : type.STRING,

        Giro    : type.STRING,
        Fecha   : type.DATE,
        Hora    : type.STRING,
        Evento  : type.STRING,
        Tipo    : type.STRING,
        Estado  : type.STRING,

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