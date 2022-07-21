
// cronogramaTrabajoInfoModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_cronograma_trabajo_info',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
		CodigoTrabDet : type.STRING,
        Actividad : type.STRING,
        IdUsuario : type.INTEGER,
		Usuario   : type.STRING,
		Revision  : type.STRING,
        Glosa     : type.TEXT,
		Fecha 	  : type.DATEONLY,
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


