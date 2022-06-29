// sistemasModel.js
// sistemas / servicios de la OS
module.exports = (sequelize, type) => {
	return sequelize.define('utb_sistemas',{
		IdSistema : {
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id 		: type.STRING,
		Descripcion : type.STRING,
		Estado : type.STRING,
		id_empresa  : type.INTEGER,
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