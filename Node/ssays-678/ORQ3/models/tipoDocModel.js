// tipoDocModel
module.exports = (sequelize, type) => {
	return sequelize.define('utb_tipodocumento',{
		IdTipoDoc:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		Codigo     : type.STRING,
		uu_id     : type.STRING,
		Descripcion     : type.STRING,
		CodAlternativo  : type.STRING,
		id_empresa  : type.INTEGER,
        empresa     : type.STRING,
		Estado     : type.STRING,
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