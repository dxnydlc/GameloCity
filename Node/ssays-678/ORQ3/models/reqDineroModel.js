// reqDineroModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_reqdinero',{
		IdReqDinero:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id               : type.STRING,
		Fecha               : type.STRING,
        Solicitante         : type.INTEGER,
        usuario_comercial   : type.STRING,
        Jefe            : type.INTEGER,
        nombre_jefe     : type.STRING,
        Area            : type.INTEGER,
        nombre_area     : type.STRING,
        CentroCosto     : type.INTEGER,
        nombre_cc       : type.STRING,
        Importe         : type.DECIMAL(9,4),
        TipoReq         : type.STRING,
        ImportePagar    : type.DECIMAL(9,4),
        Detraccion      : type.DECIMAL(9,4),
        TipoDisposicion     : type.INTEGER,
        disposicion         : type.STRING,
        NroCuenta           : type.TEXT,
        Motivo              : type.TEXT,
        motivo_anulacion    : type.STRING,
        FechaRendicion      : type.DATEONLY,
        C012                : type.TEXT,
        IdMoneda            : type.STRING,
        moneda              : type.STRING,
        Estado              : type.STRING,
        UsuarioAprueba  : type.STRING,
        FechaAprobado   : type.DATE,
        UsuarioAnula    : type.STRING,
        FechaAnulado    : type.DATE,
        FechaMod        : type.DATE,
        UsuarioMod  : type.STRING,
        C021        : type.STRING,
        FechaAt     : type.DATEONLY,
        Recibido    : type.DATE,
        RecibidoPor : type.STRING,
        Rendido     : type.DATE,
        RendidoPor  : type.STRING,
        C027        : type.STRING,
        Banco       : type.STRING,
        IdBanco     : type.STRING,
        TipoCuentaBancaria      : type.STRING,
        TitularCuentaBancaria   : type.STRING,
        dni_beneficiario        : type.STRING,
        token           : type.STRING,
        C032            : type.STRING,
        C033            : type.STRING,
        C034            : type.STRING,
        GlosaPago       : type.TEXT,
        NomCheque       : type.STRING,
        Atendido        : type.INTEGER,
        FechaAte        : type.STRING,
        TipoDisposicionAte          : type.STRING,
        BancoAte                    : type.TEXT,
        TipoCuentaBancariaAte       : type.TEXT,
        TitularCuentaBancariaAte    : type.TEXT,
        NroCuentaAte        : type.TEXT,
        NomChequeAte        : type.STRING,
        FechaRendicionFin   : type.STRING,
        NroDocRendicionFin  : type.STRING,
        TipoCambio          : type.DECIMAL(9,4),
        numero_operacion    : type.STRING,
        idbanco_operacion   : type.INTEGER,
        banco_operacion     : type.STRING,
        fecha_operacion     : type.DATEONLY,
        archivo_adjunto     : type.STRING,
        id_adjunto          : type.INTEGER,
        is_adjunto          : type.INTEGER,
        id_empresa          : type.INTEGER,
        empresa             : type.STRING,

		deletd_at : type.DATE,
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