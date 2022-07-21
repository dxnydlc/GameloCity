// activos_2022Model
module.exports = (sequelize, type) => {
	return sequelize.define('orq_activos',{
		id : {
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id           : type.STRING,
        Codigo          : type.STRING,        
        IdClaseBien     : type.INTEGER,
		clase_bien      : type.STRING,
        Placa           : type.STRING,
		Marca           : type.STRING,
        Capacidad       : type.INTEGER,
        NroEtiqFisica   : type.INTEGER,
        FechaAltaBien   : type.DATE,
        IdCliente       : type.INTEGER,
        Cliente         : type.STRING,
        IdCustodio      : type.INTEGER,
        Custodio        : type.STRING,
        MaterialPred    : type.STRING,        
        Modelo          : type.STRING,       
        Estado          : type.STRING,
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