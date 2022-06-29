// metodosSistemaModel.js

module.exports = (sequelize , type) => {
	return sequelize.define('utb_metodos',{
		IdMetodo : {
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		Descripcion : type.STRING,
        IdSistema   : type.INTEGER,
		createdAt : {
			type: type.DATE,
			field: 'created_at',
		},
		updatedAt : {
			type: type.DATE,
			field: 'updated_at'
		}
	},{
		timestamps: true,
		freezeTableName: true
	})
};

