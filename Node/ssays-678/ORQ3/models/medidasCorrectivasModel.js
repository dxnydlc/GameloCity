// medidasCorrectivasModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_medidas_correctivas',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id 			: type.STRING, 
		Codigo      	: type.STRING,       
        Descripcion     : type.STRING,
        IdResponsable   : type.INTEGER,
        Responsable     : type.STRING,
        Fecha_ejecucion : type.STRING,
        EstadoEjecucion : type.STRING,
        Estado          : type.STRING,
		Token           : type.STRING,
       // CreadoPor                           : type.STRING,
       // ModificadoPor                       : type.STRING,
       // AnuladoPor                          : type.STRING,
      
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