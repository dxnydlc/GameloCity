// tareoSubModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_tareo_sub',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
        IdDetTareo  : type.INTEGER,
		NroDia 		: type.STRING,
		IdTurno     : type.STRING,
        Turno       : type.STRING,
		Inicio      : type.STRING,
		Fin         : type.STRING,
        Glosa       : type.STRING,
        NroHoras    : type.STRING,
        Estado      : type.STRING,
        CodEstado   : type.STRING,
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