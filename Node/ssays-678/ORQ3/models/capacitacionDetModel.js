// capacitacionAsistentesModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_capacitaciones_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
        },
        uu_id      	: type.STRING,
		CodigoHead 	: type.STRING,
		IdColaborador 	: type.INTEGER,
		Puntuacion 		: type.INTEGER,
		Colaborador   	: type.STRING,
        PuestoISO 	  	: type.STRING,
        Estado        	: type.STRING,
		CreadoPor 		: type.STRING,
		ModificadoPor 	: type.STRING,
		AnuladoPor 		: type.STRING,
        Token 			: type.STRING,
		Correo 			: type.STRING,
		Celular 		: type.STRING,
		Notificado 		: type.STRING,
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