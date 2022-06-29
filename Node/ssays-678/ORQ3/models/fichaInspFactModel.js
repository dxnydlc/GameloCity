// fichaInspFactModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_fichainsp_facturacion',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id             : type.STRING,
        IdFichaInspeccion : type.INTEGER,

		TipoComprobante : type.STRING,
        IdCondicionPago : type.INTEGER,
        CondicionPago   : type.STRING,

        CondFactura     : type.TEXT,

        AdjuntaOC           : type.STRING,
        CanceloAnticipado   : type.STRING,
        AdjuntaConformidadServicio  : type.STRING,
        FechaHoraEntregaFactura     : type.STRING,

        Estado      : type.STRING,
        id_empresa  : type.INTEGER,
        empresa     : type.STRING,

        UsuarioCreado       : type.STRING,
        UsuarioModificado   : type.STRING,
        UsuarioAnulado      : type.STRING,

		deleted_at : type.DATE,
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