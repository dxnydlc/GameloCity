// resumenBoletasDetModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_resumen_boletas_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		ResumenId   : type.STRING,
		IdCab       : type.INTEGER,
        NumeroFila  : type.INTEGER,
		TipoDocumento   : type.STRING,
        TipoMoneda      : type.STRING,

        RUCDocumento    : type.STRING,
        FechaDocumento  : type.STRING,
        RazonSocialDocumento : type.STRING,

        NumeroCorrelativo           : type.STRING,
		Serie 		: type.STRING,
		Correlativo : type.STRING,
		MotivoBaja 	: type.TEXT,
        TipoDocumentoAdquiriente    : type.STRING,
        NumeroDocumentoAdquiriente  : type.STRING,
        EstadoItem  : type.INTEGER,
        TotalValorVentaOpGravadaConIgv  : type.DECIMAL(20,2),
        TotalValorVentaOpExoneradasIgv  : type.DECIMAL(20,2),
        TotalValorVentaOpInafectasIgv   : type.DECIMAL(20,2),
        
        TotalIsc   : type.DECIMAL(20,2),
        TotalIgv   : type.DECIMAL(20,2),
        TotalVenta : type.DECIMAL(20,2),
        TotalOtrosCargos : type.DECIMAL(20,2),
        Token : type.STRING,
		IdDocAsoc : type.INTEGER,
		IdFacturador : type.INTEGER,
		Facturador   : type.STRING,
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

