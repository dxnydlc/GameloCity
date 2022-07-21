// adnSolServCabModel.js
//solo fecha dateOnly
module.exports = (sequelize, type) => {
	return sequelize.define('adn_sol_serv_cab',{
		id:{
			type            : type.INTEGER,
			primaryKey      : true,
			autoIncrement   : true
		},
		uu_id   			: type.STRING,
		Codigo  			: type.STRING,
		IdProveedorFinal    : type.INTEGER,
		ProveedorFinal      : type.STRING,
		IdProveedor     	: type.INTEGER,
		Proveedor       	: type.STRING,
        IdCliente     		: type.INTEGER,
		Cliente       		: type.STRING,
		IdLocal 			: type.INTEGER,
		Local 				: type.STRING,
        TExamen         	: type.STRING,
		PerfilEMO 			: type.STRING,
		protocolo 			: type.STRING,
        FechaCita       	: type.DATEONLY,
		Turno 				: type.STRING,
		FechaProgramacion   : type.DATEONLY,
        IdSolicitante   	: type.INTEGER,
        Solicitante     	: type.STRING,
		FechaSolicitud   	: type.DATE,
        IdArea      		: type.STRING,
        Area        		: type.STRING,
        Glosa       		: type.TEXT,
        Estado      		: type.STRING,
        NroPersonal     	: type.INTEGER,
        NroFaltas       	: type.INTEGER,
        NroAsistencias  	: type.INTEGER,
        IdAprobadoPor   	: type.INTEGER,
        AprobadoPor     	: type.STRING,
		FechaAprobado   : type.DATE,
		IdAsignadoPor   	: type.INTEGER,
        AsignadoPor     	: type.STRING,
		FechaAsignado   : type.DATE,
		IdDestaque 			: type.INTEGER,
		Destaque 			: type.STRING,
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
