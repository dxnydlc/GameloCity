// resumenNotasCabModel.js.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_resumen_notas_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id : type.STRING,
        Codigo      : type.STRING,
        ResumenId   : type.STRING,
        TipoResumen : type.STRING,

        Inhabilitado    : type.INTEGER,
        RucEmisor       : type.BIGINT,
        RazonSocial     : type.STRING,
        FechaComprobante : type.DATEONLY,
        FechaEmision : type.DATEONLY,
        CorreoEmisor    : type.STRING,
        IdUsuario       : type.INTEGER,
        Usuario         : type.STRING,
        Motivo          : type.TEXT,
        EstadoDoc       : type.STRING,
        EstadoBizLnk    : type.STRING,
        URL_PDF     : type.TEXT,
        URL_XML     : type.TEXT,
        XML_SUNAT   : type.TEXT,
        Firma_Bizlinks : type.TEXT,
        Flag : type.STRING,
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

