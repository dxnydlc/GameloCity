// pteFichaInspModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_pte_ficha_inspeccion',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
        IdFichaInspeccion: type.INTEGER,

		Nombre   : type.STRING,
        NroFicha : type.STRING,
        Version : type.INTEGER,
        Fecha : type.STRING,

        IdCliente: type.INTEGER,
        Cliente : type.STRING,

        Contacto  : type.STRING,
        Direccion : type.TEXT,
        Servicios : type.STRING,

        IdEjecutivo : type.INTEGER,
        Ejecutivo   : type.STRING,
        MailEjecutivo : type.STRING,

        EspecificacionServicio : type.TEXT,

        Moneda      : type.STRING,
        Validez     : type.STRING,
        FormaPago   : type.STRING,
        OC_Trans    : type.STRING,
        Depositar_a : type.STRING,
        Cta_Detracciones : type.STRING,
        InstaServicio    : type.STRING,
        SobreCosto       : type.STRING,

        SubTotal    : type.DECIMAL(10, 6),
        Igv 		: type.DECIMAL(10, 6),
        Total 		: type.DECIMAL(10, 6),

        Estado      : type.STRING,
        id_empresa  : type.INTEGER,
        empresa     : type.STRING,
        
        CodUsuario          : type.INTEGER,
        UsuarioCreado       : type.STRING,
        UsuarioModificado   : type.STRING,
        UsuarioAnulado  : type.STRING,
        deleted_at      : type.DATE,

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