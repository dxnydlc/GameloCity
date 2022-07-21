
// LapTrabajoNoRealizadoDetModel.jsdelivr

module.exports = (sequelize, type) => {
	return sequelize.define('orq_lap_trabajo_no_realizado_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id : type.STRING,
        CodigoHead : type.STRING,
		Codigo	   : type.STRING,
        Ubicacion  : type.STRING,
        Token      : type.INTEGER,
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

