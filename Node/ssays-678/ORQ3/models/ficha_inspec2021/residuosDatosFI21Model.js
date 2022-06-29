// residuosDatosFI21Model.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_ficha_inspeccion_manejo_residuo_datos',{
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

		TipoResiduo     : type.STRING,
		Clasificacion   : type.STRING,
		Trampa          : type.STRING,
		DispFinal       : type.STRING,
        SuccionCamion   : type.STRING,
        SuccionBomba    : type.STRING,
        CantidadPesoVol : type.STRING,
        Observacion     : type.STRING,
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
