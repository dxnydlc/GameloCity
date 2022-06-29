// fichaTecnicaModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_fichatecnica',{
		IdFichaTecnica:{
			type            : type.INTEGER,
			primaryKey      : true,
			autoIncrement   : true
		},
		uu_id   			: type.STRING,
		Codigo  			: type.STRING,
		IdClienteProv       : type.DOUBLE(20,0),
		Cliente    			: type.STRING,
		IdSucursal      	: type.DOUBLE(20,0),
		Sucursal   			: type.STRING,
		Direccion       	: type.STRING,
		Giro     			: type.DOUBLE(20,0),
		Area       			: type.STRING,
        Fecha     			: type.DATE,
		NroOS       		: type.INTEGER,
		Servicio 			: type.DOUBLE(20,0),
		nroCert 			: type.INTEGER,
        CantOT         		: type.INTEGER,
		Observaciones 		: type.TEXT,
		condsan 			: type.TEXT,
		IdSupervisor       : type.DOUBLE(20,0),
        Supervisor       	: type.STRING,
		accionesco 			: type.TEXT,
		Diagnostico   		: type.TEXT,
        Estado   			: type.TEXT,
        UsuarioMod     		: type.INTEGER,
		FechaMod   			: type.DATE,
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
