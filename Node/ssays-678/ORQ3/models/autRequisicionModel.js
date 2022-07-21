// autRequisicionModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_auth_requisicion',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
        IdUsuario   : type.INTEGER,
        Usuario     : type.STRING,
        IdRequisicion: type.INTEGER,
        token       : type.STRING,
        Accion      : type.STRING,
        Evento      : type.STRING,
        Glosa       : type.STRING,
        data_json   : type.TEXT,

		deleted_at : type.DATE,
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