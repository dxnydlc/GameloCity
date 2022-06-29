// centroCostosModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_centrocostos',{
		IdCentro:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id 		: type.STRING,
		CodContable : type.STRING,
		Descripcion : type.STRING,
		ruc         : type.STRING,
        Estado      : type.STRING,
        id_empresa  : type.STRING,
        empresa     : type.STRING,
        deleted_at  : type.DATE,
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