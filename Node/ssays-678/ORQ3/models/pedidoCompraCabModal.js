// pedidoCompraCabModal.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_pedidocompracab',{
		IdPedCompraCab : {
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        C001        : type.INTEGER,
        Fecha       : type.DATE,
        IdCentro    : type.INTEGER,
		centro_costo    : type.STRING,
        Solicitante     : type.INTEGER,
		nombre_solicitante  : type.STRING,
        AutorizadoPor       : type.INTEGER,
		nombre_autorizado   : type.STRING,
		Glosa       : type.TEXT,
        Estado      : type.STRING,
		FechaMod    : type.DATE,
        UsuarioMod  : type.STRING,
        Imp         : type.INTEGER,
        Atendido    : type.INTEGER,
        Referencia  : type.TEXT,
        oCompra     : type.STRING,
        UsuarioModAn : type.STRING,
        FechaModAn   : type.DATE,
        UsuarioModAp : type.STRING,
        FechaModAp   : type.STRING,
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