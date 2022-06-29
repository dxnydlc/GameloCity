// envioBoletaCabModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_envio_boletas_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id        : type.STRING,
		Codigo       : type.STRING,
		IdCC         : type.DOUBLE(20,0),
		CentroCostos : type.STRING,
        IdCliente    : type.DOUBLE(20,0),
		Cliente      : type.STRING,
        IdLocal      : type.INTEGER,
        Local        : type.STRING,
		IdArea       : type.INTEGER,
        Area         : type.STRING,
		Categoria    : type.STRING,
        Anio         : type.INTEGER,
        Mes          : type.STRING,
        Glosa        : type.TEXT,
        NroBoletas   : type.INTEGER,
        NroEnvios    : type.INTEGER,
        NroAbiertos  : type.INTEGER,
        Estado       : type.STRING,
        DNICreado    : type.INTEGER,
        AnuladoPor   : type.STRING,
		Flag	   	 : type.STRING,
		CreadoPor: type.STRING,
        DNIModificado: type.INTEGER,
        ModificadoPor: type.STRING,
        DNIAnulado   : type.INTEGER,
        AnuladoPor   : type.STRING,
        MotivoAnulado: type.TEXT,
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