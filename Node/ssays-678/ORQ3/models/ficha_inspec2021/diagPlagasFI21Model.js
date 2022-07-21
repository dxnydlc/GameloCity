// diagPlagasFI21Model.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_ficha_inspeccion_diag_plagas',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
		IdLocal : type.INTEGER,
		Local   : type.STRING,
        IdServicio  : type.INTEGER,
		Servicio    : type.STRING,

        TipoPLaga   : type.STRING,
        AreaTratar  : type.STRING,
        EspecArea   : type.STRING,
        NivelInfestacion : type.STRING,

        IndicadorPresencia  : type.STRING,
        OtrosIndicadores    : type.STRING,
        AreasZonasCriticas  : type.STRING,
        

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
