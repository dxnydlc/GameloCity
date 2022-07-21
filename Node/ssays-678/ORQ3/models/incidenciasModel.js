// incidenciasModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_incidencias',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
        },
        uu_id 		: type.STRING,  
		Codigo      : type.STRING, 
		Asunto      : type.STRING,
        Local       : type.STRING,
        //IdLocal int, IdCliente bigInt(12), Cliente varchar(150), Mes, Anio, Fecha
        Contenido   : type.STRING,
        Estado      : type.STRING,
        
        IdLocal     : type.INTEGER,
        IdCliente   : type.INTEGER,
        Cliente     : type.STRING,
		IdSupervisor   : type.INTEGER,
        Supervisor     : type.STRING,
        Mes         : type.INTEGER,
        Anio        : type.INTEGER,
        Fecha       : type.DATE,
        //deleted_at  : type.DATE,
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