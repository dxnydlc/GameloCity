// xlsLAPReqMatDetModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_xls_reqmaterial_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
		CodigoHead : type.STRING,
		CodigoProd : type.STRING,
		Descripcion : type.STRING,
		UnidadMedida : type.STRING,
        Cantidad : type.STRING,
        Semana01 : type.STRING,
        Semana02 : type.STRING,
        Semana03 : type.STRING,
        Semana04 : type.STRING,
        Token : type.STRING,
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
