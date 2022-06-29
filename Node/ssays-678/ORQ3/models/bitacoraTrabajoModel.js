// bitacoraTrabajoModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_bitacora_super_trabajo',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		IdSuperior  : type.INTEGER,
		IdArea   : type.STRING,
		Area     : type.STRING,
		IdTrabajo   : type.STRING,
		Trabajo     : type.STRING,
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
