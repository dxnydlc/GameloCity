// planCuentaModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_plancuenta',{
		IdCuenta:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Descripcion: type.STRING,
        Estado      : type.STRING,
        NroCuenta   : type.STRING,
        CodFacturacion : type.STRING,
        debe_haber  : type.STRING,
		id_empresa  : type.INTEGER,
		empresa     : type.STRING,
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
