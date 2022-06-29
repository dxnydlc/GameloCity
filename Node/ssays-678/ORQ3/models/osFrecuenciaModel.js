module.exports = (sequelize, type) => {
	return sequelize.define('utb_osfrecuencia',{
		idFrecuencia:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		Descripcion : type.STRING,
		Dias        : type.INTEGER,
		Estado      : type.STRING,
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