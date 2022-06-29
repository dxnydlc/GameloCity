// histoMantModal
module.exports = (sequelize, type) => {
	return sequelize.define('orq_historialmant',{
		id : {
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id           	: type.STRING,
        Codigo          	: type.STRING,        
        FechaS     			: type.DATEONLY,
		FechaA      		: type.DATEONLY,
        NroSolicitud        : type.STRING,
		Diagnostico         : type.STRING,
        TrabajoRealizado	: type.STRING,
        IdTecnico   		: type.INTEGER,
        Nombre_tecnico   	: type.STRING,
        Observaciones       : type.STRING,
        NroReporte         	: type.STRING,
        IdGuia      		: type.INTEGER,
        Dir_partida        	: type.STRING,
        Dir_llegada    		: type.STRING,        
        Estado_guia         : type.STRING,       
        Requerimientos      : type.STRING,
		ReqServ          	: type.STRING,
		IdClienteProv       : type.INTEGER,
		Cliente          	: type.STRING,
		IdLocal          	: type.INTEGER,
		Sucursal          	: type.STRING,
		Atendido          	: type.STRING,
		Tipo          		: type.INTEGER,
		Ubicacion          	: type.STRING,
		IdActivos          	: type.INTEGER,
		FechaMod          	: type.DATEONLY,
		UsuarioMod          : type.STRING,
		Placa          		: type.STRING,
		Id_empresa          : type.INTEGER,
		Empresa          	: type.STRING,
		Estado          	: type.STRING,
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