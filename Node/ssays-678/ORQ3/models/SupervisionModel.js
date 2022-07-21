// SupervisionModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_supervision',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id   : type.STRING,
        Codigo  : type.STRING,
        IdCliente : type.INTEGER,
        Cliente : type.STRING,
        IdLocal : type.INTEGER,
        Local   : type.STRING,
        ImagenSup       : type.TEXT,
        ImagenSupFin    : type.TEXT,
        Supervisor      : type.INTEGER,
        NombreSupervisor : type.STRING,
        lat_inicio : type.STRING,
        lng_inicio : type.STRING,
        lat_fin : type.STRING,
        lng_fin : type.STRING,
        Estado  : type.STRING,
        Inicio  : type.DATE,
        Fin     : type.DATE,
        Tiempo  : type.STRING,
        Horas   : type.INTEGER,
        Minutos : type.INTEGER,
        id_empresa  : type.INTEGER,
        empresa     : type.STRING,
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
