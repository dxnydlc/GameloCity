// localFichaInspe.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_localesFicha',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		IdLocalOrigin 	: type.INTEGER,
		Origen 			: type.STRING,
		IdFichaInspeccion: type.STRING,
		NombreLocal : type.STRING,
        Contacto    : type.STRING,
        Departamento: type.STRING,
		Provincia   : type.STRING,
        Distrito    : type.STRING,
        Ciudad      : type.STRING,
		IdGiro 		: type.INTEGER,
		Giro      	: type.STRING,
		TipoDir     : type.STRING,
        NombreCalle : type.STRING,
        NroCalle    : type.STRING,
		OtrosCalle  : type.STRING,
        Direccion   : type.STRING,
        lat         : type.STRING,
        lng         : type.STRING,
        Estado      : type.STRING,
        id_empresa  : type.INTEGER,
        empresa     : type.STRING,
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