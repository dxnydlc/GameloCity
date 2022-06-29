// localesFI21Model.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_ficha_inspeccion_locales',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
        Codigo       : type.STRING,
        IdLocalOrigin : type.STRING,
        Origen      : type.STRING,
        IdFichaInspeccion : type.STRING,
        NombreLocal : type.STRING,
		Contacto    : type.STRING,
        IdDepartamento: type.STRING,
        Departamento: type.STRING,
        IdProvincia : type.STRING,
        Provincia   : type.STRING,
        IdDistrito  : type.STRING,
        Distrito: type.STRING,
        Ciudad  : type.STRING,
        IdGiro  : type.INTEGER,
        NombreGiro  : type.STRING,
        TipoDir     : type.STRING,
        NombreCalle : type.STRING,
        NroCalle    : type.STRING,
        OtrosCalle  : type.STRING,
        Direccion   : type.TEXT,
        Lat     : type.STRING,
        Lng     : type.STRING,
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
