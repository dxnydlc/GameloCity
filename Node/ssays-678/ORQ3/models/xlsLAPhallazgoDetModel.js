// xlsLAPhallazgoDetModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_xls_hallazgos_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
		CodigoHead : type.STRING,

		Objeto 	: type.STRING,
		Seguridad : type.STRING,
		Lugar 	: type.STRING,
		FechaHora : type.DATE,

		DNI 	: type.INTEGER,
		Nombre 	: type.STRING,
		Paterno : type.STRING,
		Materno : type.STRING,

		Token 	: type.STRING,
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
