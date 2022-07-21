// seriesDocModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_seriesdocumentos',{
		IdSerieDoc :{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
        IdTipoDoc       : type.INTEGER,
		documento       : type.STRING,
		Serie           : type.STRING,
		UltCorrelativo  : type.INTEGER,
		FechaSerie 		: type.DATEONLY,
		Glosa           : type.STRING,
        UsuarioMod      : type.STRING,
        FechaMod        : {
			type: type.DATE,
			field: 'created_at',
		},
        CorrElectronico : type.STRING,
        id_empresa      : type.INTEGER,
        empresa         : type.STRING,
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
