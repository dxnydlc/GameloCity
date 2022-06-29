// grupoClienteModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_grupo_clientes',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id   : type.STRING,
		Nombre  : type.STRING,
		CreadoPor       : type.STRING,
		ModificadoPor   : type.INTEGER,
		AnuladoPor      : type.STRING,
		Estado 			: type.STRING,
        deleted_at      : type.DATE,
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