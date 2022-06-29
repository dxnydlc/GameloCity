
// sistemasMetodosOSModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_sistemasosdet',{
		IdSistemasOS : {
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id   : type.STRING,
		IdOS    : type.INTEGER,
		Sistema : type.INTEGER,
		nombre_sistema : type.STRING,
		Metodo  : type.INTEGER,
		nombre_metodo  : type.STRING,
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

