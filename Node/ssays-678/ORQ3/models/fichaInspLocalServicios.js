// fichaInspLocalServicios.js
// **** DEPRECADOO **** usar  fichaInspeServiciosLocal

module.exports = (sequelize, type) => {
	return sequelize.define('orq_fichainsp_local_servicios',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
		idFichaInspeccion: type.STRING,
        IdLocal     : type.INTEGER,
        Local       : type.STRING,
        IdServicio  : type.INTEGER,
        Servicio    : type.STRING,
        IdFrecuencia    : type.INTEGER,
        Frecuencia      : type.STRING,
		NroServicio     : type.STRING,
        CostoUnitario   : type.DECIMAL(20,2),
        Moneda      : type.STRING,
        Total       : type.DECIMAL(20,2),
        SubTotal    : type.DECIMAL(20,2),
        IGV         : type.DECIMAL(20,2),

        Estado      : type.STRING,
        FechaHoraProgramar     : type.DATE,
        NroOS     : type.STRING,

        id_empresa  : type.INTEGER,
        empresa     : type.STRING,

        creado_por     : type.STRING,
        editado_por     : type.STRING,
        anulado_por     : type.STRING,

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