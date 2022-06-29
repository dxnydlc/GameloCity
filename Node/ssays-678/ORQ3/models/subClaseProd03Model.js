// subClaseProd03Model.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_subclase3',{
		IdSubClase3 :{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id           : type.STRING,
		Descripcion     : type.STRING,
		C003            : type.STRING,
        C004            : type.STRING,
        IdSubClase2     : type.INTEGER,
        SubClase2      : type.STRING,
        C007            : type.STRING,
        Estado          : type.STRING,
        codigo_sunat    : type.STRING,
        UsuarioMod      : type.STRING,
        nombre_usuario  : type.STRING,
        FechaMod        : type.STRING,
        id_empresa      : type.INTEGER,
        empresa         : type.STRING,
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