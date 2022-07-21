// resumenFacturasCabModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_resumen_facturas_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		Codigo      : type.STRING,
        ResumenId   : type.STRING,
		TipoResumen : type.STRING,
		RucEmisor   : type.INTEGER,
		RazonSocial : type.STRING,
        FechaComprobante : type.DATEONLY,
        FechaEmision     : type.DATEONLY,
        IdUsuario   : type.INTEGER,
        Usuario     : type.STRING,
        EstadoDoc   : type.STRING,
        EstadoBizLnk: type.STRING,
        Motivo      : type.TEXT,
		URL_PDF 	: type.TEXT,
		URL_XML 	: type.TEXT,
		XML_SUNAT 	: type.TEXT,
		Firma_Bizlinks : type.STRING,
		Flag 	: type.STRING,
		SignOnLineCmd 	: type.TEXT,
		ResultadoXML 	: type.TEXT,
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

