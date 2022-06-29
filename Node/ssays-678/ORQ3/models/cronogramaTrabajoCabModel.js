// cronogramaTrabajoCabModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_cronograma_trabajo_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id     : type.STRING,
		Codigo    : type.STRING,
		IdCliente : type.BIGINT,
		Cliente   : type.STRING,
		IdLocal   : type.INTEGER,
        Local     : type.STRING,
        IdSupervisor : type.INTEGER,
        Supervisor   : type.STRING,
        Estado  : type.STRING,
        Turno   : type.STRING,
        Glosa   : type.TEXT,
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


