// otModel

module.exports = (sequelize, type) => {
	return sequelize.define('utb_ordentrabajo',{
		IdOT:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id           : type.STRING,
		Anexo           : type.INTEGER,
        Fecha           : type.INTEGER,
        FechaMySQL 	    : type.DATEONLY,
		RepComercial    : type.INTEGER,
        Nombre_RepComercial : type.STRING,
        IdClienteProv   : type.DOUBLE,
        nombre_cliente  : type.STRING,
        IdLocal         : type.INTEGER,
        local           : type.STRING,
        Direccion       : type.TEXT,
        IdGiro          : type.INTEGER,
        giro            : type.STRING,
        Precio          : type.DECIMAL(20, 6),
        IncIGV          : type.INTEGER,
        Indicador       : type.INTEGER,
        TipoComprobante : type.INTEGER,
        IncCertificado  : type.INTEGER,
        IGVPorcentaje   : type.INTEGER,
        TipoCambio      : type.DECIMAL(20, 6),
        NroOC           : type.TEXT,
        Medida          : type.TEXT,
        Duracion        : type.TEXT,
        Descripcion     : type.TEXT,
        Referencia      : type.TEXT,
        Solicitante     : type.TEXT,
        NroCertificado  : type.STRING,
        Glosa           : type.STRING,
        Estado          : type.INTEGER,        
        InformeActivo   : type.STRING,
        NroOS           : type.INTEGER,
        Hora            : type.INTEGER,
        TipoDocOrigen   : type.TEXT,
        NroDocOrigen    : type.TEXT,
        UsuarioMod          : type.INTEGER,
        nombre_usuario_mod  : type.STRING,
        UsuarioAp           : type.STRING,
        UsuarioAn           : type.STRING,
        FechaMod        : type.DATE,
        NroFactura      : type.STRING,
        IdMoneda        : type.INTEGER,
        MotivoAnulacion : type.TEXT,
        C034            : type.TEXT,
        CondicionVenta  : type.INTEGER,
        nombre_condicionventa : type.STRING,
        NroRecibo       : type.TEXT,
        NroBoleta       : type.STRING,
        C038            : type.TEXT,
        C039            : type.TEXT,
        C040            : type.INTEGER,
        C041            : type.INTEGER,
        TotalSoles      : type.DECIMAL(20, 6),
        SubTotalSoles   : type.DECIMAL(20, 6),
        IGVSoles        : type.DECIMAL(20, 6),
        TotalDoc        : type.DECIMAL(20, 6),
        SubTotalDoc     : type.DECIMAL(20, 6),
        IGVDoc          : type.DECIMAL(20, 6),
        C048            : type.DECIMAL(20, 6),
        C049            : type.TEXT,
        SubEstado       : type.TEXT,
        FechaConformidad    : type.DATE,
        ObsConformidad      : type.TEXT,
        PersonalTecnico     : type.TEXT,
        C054                : type.TEXT,
        C055                : type.DATE,
        C056                : type.TEXT,
        C057                : type.TEXT,
        FichaInspeccion     : type.TEXT,
        PropuestaTecnica    : type.TEXT,
        DireccionFiscal     : type.TEXT,
        NroAplicacion       : type.STRING,
        IncMovilidad        : type.INTEGER,
        Supervisor          : type.INTEGER,
        nombre_supervisor   : type.STRING,
        TipoServicio        : type.STRING,
        HoraInicioServ      : type.INTEGER,
        HoraFinServ         : type.INTEGER,
        RUC             : type.DOUBLE,
        Servicio        : type.INTEGER,
        nombre_sistema  : type.STRING,
        Nota            : type.TEXT,
        Volumen         : type.INTEGER,
        AOtro           : type.TEXT,
        CPOtro          : type.TEXT,
        Programacion    : type.INTEGER,
        Mantenimiento   : type.INTEGER,
        Facturacion     : type.INTEGER,
        AsistSaneamiento: type.INTEGER,
        Dosificacion    : type.INTEGER,
        Autorizado      : type.INTEGER,
        Telefono        : type.TEXT,
        impreso         : type.INTEGER,
        url_pdf         : type.TEXT,
        id_empresa      : type.INTEGER,
        empresa         : type.STRING,
        deleted_at      : type.DATE,
		createdAt       : {
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