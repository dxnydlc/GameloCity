// xlsLAPReqMatCabModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_xls_reqmaterial_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
		Codigo : type.STRING,
		
        IdCliente   : type.BIGINT,
        Cliente     : type.STRING,
		IdLocal : type.INTEGER,
		Local   : type.STRING,
        Fecha   : type.DATEONLY,
        Estado  : type.STRING,
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
