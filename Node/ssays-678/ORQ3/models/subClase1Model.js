// subClase1Model

module.exports = (sequelize, type) => {
	return sequelize.define('utb_subclase1',{
		IdSubClase1 : {
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Descripcion : type.STRING,
        C003    : type.STRING,
        C004    : type.STRING,
		IdclaseProd     : type.INTEGER,
		clase_producto  : type.STRING,
        NombreClase1    : type.STRING,
        C007            : type.STRING,
        Estado          : type.INTEGER,
        UsuarioMod      : type.INTEGER,
        FechaMod        : type.STRING,
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


