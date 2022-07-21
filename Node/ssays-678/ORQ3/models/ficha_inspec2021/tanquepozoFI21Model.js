// tanquepozoFI21Model.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_ficha_inspeccion_tanque_pozo',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		Codigo      : type.STRING,
		IdLocal     : type.INTEGER,
		Local       : type.STRING,
        IdServicio  : type.INTEGER,
		Servicio    : type.STRING,
        Flag        : type.STRING,
        Tipo        : type.STRING,
        Cantidad    : type.STRING,
        Volumen     : type.STRING,
        Descripcion : type.STRING,
        Token       : type.STRING,
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
