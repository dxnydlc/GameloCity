// bitacoraAreaModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_bitacora_super_area',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		IdSuperior  : type.INTEGER,
		IdBloque  : type.STRING,
		Bloque    : type.STRING,
		IdArea  : type.STRING,
		Area    : type.STRING,
		IdBitacora      : type.STRING,
        Token_Bitacora  : type.STRING,
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
