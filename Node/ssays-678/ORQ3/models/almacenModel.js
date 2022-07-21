// almacenModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_almacen',{
		IdAlmacen:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id 		: type.STRING,
		Descripcion : type.STRING,
		Direccion   : type.STRING,
		Estado      : type.INTEGER,
        Glosa       : type.STRING,
        UsuarioMod  : type.STRING,
        FechaMod    : type.DATE,
        id_empresa  : type.INTEGER,
		empresa     : type.STRING,
		
		Pais 			: type.STRING,
		Departamento 	: type.STRING,
		Provincia 		: type.STRING,
		Distrito	 	: type.STRING,
		TipoDir 		: type.STRING,
		NombreCalle     : type.STRING,
		NroCalle     	: type.STRING,
		OtrosCalle     	: type.STRING,
		Ubigeotxt 		: type.STRING,
		Urbanizacion 	: type.STRING,
		lat 			: type.STRING,
		lng 			: type.STRING,

        deleted_at  : type.DATE,
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