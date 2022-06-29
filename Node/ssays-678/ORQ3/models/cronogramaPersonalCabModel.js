
// cronogramaPersonalCabModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_cronograma_usuario_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
        CodigoHead : type.STRING,
        DNI     : type.INTEGER,
		Nombre  : type.STRING,
		Paterno : type.STRING,
        Materno : type.STRING,

        IdCliente : type.BIGINT,
		Cliente   : type.STRING,
		IdLocal   : type.INTEGER,
        Local     : type.STRING,

        Estado  : type.STRING,

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
