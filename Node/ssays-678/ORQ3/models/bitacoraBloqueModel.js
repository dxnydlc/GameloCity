// bitacoraBloqueModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_bitacora_super_bloque',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
		IdBloque    : type.STRING,
		Bloque      : type.STRING,
		IdBitacora  : type.STRING,
        Token_Bitacora : type.STRING,
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
