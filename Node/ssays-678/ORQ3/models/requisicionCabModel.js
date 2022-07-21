// requisicionCabModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_requisicion_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
        IdRequisicion   : type.INTEGER,
        TipoServicio    : type.STRING,
        UnidadNegocio   : type.STRING,
        MontoMax        : type.DECIMAL(20,2),
        TipoDocOrigen   : type.STRING,
        NroDocOrigen    : type.STRING,
        IdClienteProv   : type.INTEGER,
        Cliente         : type.STRING,
        IdSucursal      : type.INTEGER,
        Sucursal        : type.STRING,
        Fecha 	        : type.DATEONLY,
        FechaEntrega 	: type.DATEONLY,
        MesCorrsp       : type.STRING,
        Anio            : type.INTEGER,
        TipProducto     : type.STRING,
        IdCentro        : type.INTEGER,
        Centro_costos   : type.STRING,
        CodContaCC      : type.STRING,
        Glosa           : type.TEXT,
        DireccionPartida: type.STRING,
        DireccionDestino: type.STRING,
        Porcentaje      : type.INTEGER,
        Recepciona      : type.INTEGER,
        NombreRecepciona: type.STRING,
        Atendido        : type.INTEGER,
        NroGuia         : type.STRING,
        IdUbigeo        : type.STRING,
        Departamento    : type.STRING,
        Provincia       : type.STRING,
        Distrito        : type.STRING,
        TotalDetalle    : type.DECIMAL(20,2),
        TipoCambio      : type.DECIMAL(20,2),
        NroItemsDetalle : type.INTEGER,
        Estado          : type.STRING,

        UsuarioMod      : type.STRING,
        FechaMod        : type.DATEONLY,
        UsuarioModAp    : type.STRING,
        FechaModAp      : type.DATEONLY,
        UsuarioModAn    : type.STRING,
        FechaModAn      : type.DATEONLY,
        MotivoAnulacion : type.STRING,
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