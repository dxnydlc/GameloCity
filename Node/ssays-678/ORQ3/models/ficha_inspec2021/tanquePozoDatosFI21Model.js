// tanquePozoDatosFI21Model.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_ficha_inspeccion_tanque_pozo_datos',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id       : type.STRING,
		Codigo      : type.STRING,
		IdLocal     : type.INTEGER,
		Local       : type.STRING,
        IdServicio  : type.INTEGER,
		Servicio    : type.STRING,

		DesagueCercano 	: type.STRING,
		UltimoServicio 	: type.STRING,
		Distancia 		: type.STRING,
		Caracteristicas : type.STRING,
        Ingreso   		: type.STRING,
        GradoDificultad : type.STRING,
        Token           : type.STRING,
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
