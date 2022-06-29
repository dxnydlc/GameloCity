
// XLSLapMaquinariaDetModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_xls_maquinaria_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		CodigoHead  : type.STRING,
		Placa       : type.STRING,
		Descripcion : type.STRING,
		Modelo  : type.STRING,
        Marca   : type.STRING,
        Serie   : type.STRING,
        Cliente : type.TEXT,
        Estado  : type.STRING,
		Token   : type.STRING,
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

