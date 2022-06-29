// xlsLAPIncidenciasDetModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_xls_incidencias_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		CodigoHead  : type.STRING,
		Fecha       : type.DATEONLY,
		Ocurrencia  : type.TEXT,
		Cubiculo    : type.STRING,
        HelpDesk    : type.STRING,
        Banio       : type.STRING,
        Ubicacion   : type.TEXT,
		Token       : type.STRING,
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

