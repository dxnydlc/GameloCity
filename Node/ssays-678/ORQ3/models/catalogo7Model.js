// catalogo7Model.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_catalogo7',{
		IdCatalogo7 : {
			type          : type.INTEGER,
			primaryKey    : true,
			autoIncrement : true
		},
		Descripcion : type.STRING,
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
