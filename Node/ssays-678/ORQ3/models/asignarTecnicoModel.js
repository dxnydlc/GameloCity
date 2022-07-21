
// asignarTecnicoModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_personal_asignado_ot',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING,
		Codigo  : type.STRING,
		IdOS    : type.INTEGER,
        IdOT    : type.INTEGER,

        IdTecnico   : type.INTEGER,
        Tecnico     : type.STRING,
        Celular     : type.STRING,
        Correo      : type.STRING,
        IdCliente   : type.BIGINT,
        Cliente     : type.STRING,
		IdLocal : type.INTEGER,
		Local   : type.STRING,
        IdServicio  : type.INTEGER,
        Servicio    : type.STRING,

		Estado  : type.STRING,
		
		Inicio  : type.DATE,
        Fin     : type.DATE,
        Duracion    : type.STRING,

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

