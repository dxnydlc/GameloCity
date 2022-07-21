// capacitacionModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_capacitaciones_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
		Titulo  : type.STRING,
		Temas   : type.STRING,
		IdArea_Org  : type.INTEGER,
		Area_Org  	: type.STRING,
		IdArea_Rec  : type.INTEGER,
		Area_Rec  	: type.STRING,
		FechaHora   : type.DATE,
		FechaFin 	: type.DATE,
		Tipo  		: type.STRING,
		Unidad 		: type.STRING,
		IdCliente  	: type.INTEGER,
		Cliente  	: type.STRING,
		IdLocal  	: type.INTEGER,
		Local  		: type.STRING,
		Direccion 	: type.TEXT,
		LatDir 		: type.STRING,
		LngDir 		: type.STRING,
		Glosa   	: type.TEXT,
		IdExpositor : type.INTEGER,
		Expositor   : type.STRING,
		IdResponsable   : type.INTEGER,
		Responsable     : type.STRING,
		LinkRepositorio : type.STRING,
		LinkRegistro 	: type.STRING,
		Estado      	: type.STRING,
		NroAsistentes 	: type.INTEGER,
		NroFaltas 		: type.INTEGER,

		IdCreadoPor 	: type.INTEGER,
		CreadoPor       : type.STRING,
		IdModificadoPor : type.INTEGER,
		ModificadoPor   : type.STRING,
		IdAnuladoPor 	: type.INTEGER,
		AnuladoPor      : type.STRING,
		Lugar 		: type.STRING,
		Hinicio 	: type.DATE,
		HFin 		: type.DATE,
		Duracion 	: type.STRING,
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