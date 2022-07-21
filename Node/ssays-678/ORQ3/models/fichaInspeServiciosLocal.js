// fichaInspeServiciosLocal.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_fichainsp_local_servicios',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id 		: type.STRING,
		Tipo 		: type.STRING,
		IdFichaInspeccion   : type.INTEGER,
		IdLocal     : type.INTEGER,
        Local       : type.STRING,
        IdServicio      : type.STRING,
        Servicio        : type.STRING,
        IdFrecuencia    : type.STRING,
		Frecuencia      : type.STRING,
		Volumen 		: type.STRING,
		Glosa 			: type.STRING,
		NroServicio     : type.STRING,
		NroAplicaciones : type.INTEGER,
        CostoUnitario   : type.STRING,
        Moneda      : type.STRING,
        Total       : type.STRING,
        SubTotal    : type.STRING,
        IGV         : type.STRING,
        Estado      : type.STRING,
        FechaHoraProgramar    : type.DATE,
        NroOS       : type.STRING,
        id_empresa  : type.STRING,
		empresa     : type.STRING,

		IdProducto 	: type.INTEGER,
		Producto 	: type.STRING,

        UsuarioCreado  : type.STRING,
        UsuarioModificado : type.STRING,
		UsuarioAnulado : type.STRING,

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