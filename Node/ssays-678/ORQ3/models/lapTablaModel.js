
// lapTablaModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_lap_tabla',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
		Codigo : type.STRING,
        IdBloque : type.INTEGER,
        CodigoBita : type.STRING,

        Contador : type.INTEGER,
		Bloque   : type.TEXT,
        Trabajo  : type.TEXT,
		Frecuencia : type.STRING,
        Fechas   : type.TEXT,
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

