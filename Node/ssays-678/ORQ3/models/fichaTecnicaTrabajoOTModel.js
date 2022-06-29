
// fichaTecnicaTrabajoOTModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_ficha_ejecucion_servicio',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id   : type.STRING ,
		Codigo  : type.STRING ,
        IdTrabajo : type.INTEGER ,
        IdOS    : type.INTEGER ,
        IdOT    : type.INTEGER ,
        NroCert : type.INTEGER ,
        IdCliente   : type.BIGINT ,
        Cliente     : type.STRING ,
        IdLocal     : type.INTEGER ,
        Local       : type.STRING ,
        IdServicio  : type.INTEGER ,
        Servicio    : type.STRING,
        IdTecnico   : type.INTEGER ,
        Tecnico     : type.STRING,
		Diagnostico      : type.TEXT,
		Condicion        : type.TEXT,
		TrabajoRealizado : type.TEXT,
        AccionCorrectiva : type.TEXT,
        Observaciones    : type.TEXT,
        Estado       : type.STRING,
		IdUsuarioMod : type.INTEGER,
		UsuarioMod 	 : type.STRING,
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
