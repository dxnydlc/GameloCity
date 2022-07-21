// tareoDetalle3Model.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_tareo_detalle3',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
        IdTareo     : type.INTEGER,
		CodigoHeader  : type.STRING,
		DNI         : type.INTEGER,
		Nombre      : type.STRING,
        Cargo       : type.STRING,
        Token : type.STRING,
        Glosa : type.TEXT,
        Dia01 : type.STRING,
        Dia02 : type.STRING,
        Dia03 : type.STRING,
        Dia04 : type.STRING,
        Dia05 : type.STRING,
        Dia06 : type.STRING,
        Dia07 : type.STRING,
        Dia08 : type.STRING,
        Dia09 : type.STRING,
        Dia10 : type.STRING,
        Dia11 : type.STRING,
        Dia12 : type.STRING,
        Dia13 : type.STRING,
        Dia14 : type.STRING,
        Dia15 : type.STRING,
        Dia16 : type.STRING,
        Dia17 : type.STRING,
        Dia18 : type.STRING,
        Dia19 : type.STRING,
        Dia20 : type.STRING,
        Dia21 : type.STRING,
        Dia22 : type.STRING,
        Dia23 : type.STRING,
        Dia24 : type.STRING,
        Dia25 : type.STRING,
        Dia26 : type.STRING,
        Dia27 : type.STRING,
        Dia28 : type.STRING,
        Dia29 : type.STRING,
        Dia30 : type.STRING,
        Dia31 : type.STRING,

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