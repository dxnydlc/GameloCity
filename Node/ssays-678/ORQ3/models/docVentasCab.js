// docVentasCab.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_doc_ventas_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
        Codigo      : type.STRING,
        TipoDoc     : type.STRING,
        Serie       : type.STRING,
		Correlativo : type.STRING,
        TipoVenta   : type.STRING,
		IdCliente   : type.INTEGER,
		Cliente     : type.STRING,
        Direccion   : type.TEXT,
        ubigeoAdquiriente       : type.STRING,
        urbanizacionAdquiriente : type.STRING,
        departamentoAdquiriente : type.STRING,
        provinciaAdquiriente    : type.STRING,
        distritoAdquiriente     : type.STRING,
        paisAdquiriente         : type.STRING,
        IdCondPago  : type.INTEGER,
        CondPago    : type.STRING,
        IdCtaConta  : type.INTEGER,
        CtaConta    : type.STRING,
        IdVendedor  : type.INTEGER,
        Vendedor    : type.STRING,
        IdTipAfect  : type.INTEGER,
        TipAfect    : type.STRING,
        Glosa       : type.TEXT,
        FechaEmision: type.DATEONLY,
        FechaVencimiento : type.DATEONLY,
        UndNegocio  : type.STRING,
        IdMoneda    : type.INTEGER,
        Moneda      : type.STRING,
        SubTotal_Doc: type.DECIMAL(20,4),
        Total_Doc   : type.DECIMAL(20,4),
        IGV_Doc     : type.DECIMAL(20,4),
        SubTotal_PEN: type.DECIMAL(20,4),
        Total_PEN   : type.DECIMAL(20,4),
        IGV_PEN     : type.DECIMAL(20,4),
        TipoCambio  : type.DECIMAL(20,4),
        TasaIGV     : type.DECIMAL(20,4),
        TasaDetrac  : type.DECIMAL(20,4),
        MontoDetrac : type.DECIMAL(20,4),
        MontoLetras : type.TEXT,
        MotivoNC    : type.STRING,
        OptNC       : type.STRING,
        IncIGV      : type.STRING,
        OpGravada   : type.STRING,
        NroGuia     : type.STRING,
        NroHES      : type.STRING,
        OrdenCompra : type.STRING,
        NroCert     : type.STRING,
        Estado      : type.STRING,
        EstadoBznlk : type.STRING,
        URL_PDF     : type.TEXT,
        URL_XML     : type.TEXT,
        XML_SUNAT   : type.TEXT,
        Firma_Bizlinks : type.TEXT,
        NroItems    : type.INTEGER,

        HRecepcion  : type.STRING,
        Contacto    : type.STRING,
        DirEnvio    : type.TEXT,
        NotaEnvio   : type.STRING,
        ReqFactura  : type.STRING,

        CorreoEnvio : type.STRING,
        BancoNacion : type.TEXT,
        BancoCredito: type.TEXT,
        BancoScotia : type.TEXT,
        BancoBBVA   : type.TEXT,
        Autorizacion: type.TEXT,
        Emisor      : type.STRING,
        FormaPagoNegociable : type.INTEGER,
        MontoNetoPendiente  : type.DECIMAL(20,4),

        IdUsuarioMod: type.INTEGER,
        UsuarioMod  : type.STRING,
        IdUsuarioAp : type.INTEGER,
        UsuarioAp   : type.STRING,
        FechaAp     : type.DATE,
        IdUsuarioAn : type.INTEGER,
        UsuarioAn   : type.STRING,
        MotivoAn    : type.TEXT,
        FechaAn     : type.DATE,

        TipoDocAfectado : type.STRING,
        SerieAfectado   : type.STRING,
        MotivoAfectado  : type.TEXT,
        CorrelativoAfectado     : type.STRING,

        IdUsuarioEnvioBizlinks  : type.INTEGER,
        UsuarioEnvioBizlinks    : type.STRING,
        FechaEnvioBizlinks      : type.DATE,

        IdResumenAlta : type.STRING,
        IdResumenBaja : type.STRING,

        SignOnLineCmd : type.TEXT,
        ResultadoXML  : type.TEXT,
        
        Flag : type.STRING,

        Entregado_A     : type.STRING,
        FechaEntrega_A  : type.DATEONLY,
        FechaCliente    : type.DATEONLY,
        FechaTesoreria  : type.DATEONLY,

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