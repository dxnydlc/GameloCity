// claseProdModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_claseproducto',{
		IdClaseProd:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
        },
        uu_id       : type.STRING,
		Descripcion : type.STRING,
        C003        : type.STRING,
        C004        : type.STRING,
        C005        : type.STRING,
        C007        : type.STRING,
        Estado      : type.INTEGER,
		UsuarioMod  : type.INTEGER,
        nombre_usuario : type.STRING,
        codigo_sunat : type.STRING,
        FechaMod    : type.STRING,
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