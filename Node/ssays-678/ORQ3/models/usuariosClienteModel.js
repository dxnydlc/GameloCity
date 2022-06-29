// usuariosClienteModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_usuarios_cliente',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id       : type.STRING,
        id_cliente  : type.INTEGER,
        cliente     : type.STRING,
        id_local    : type.INTEGER,
        local       : type.STRING,
        id_usuario  : type.INTEGER,
        nombre      : type.STRING,
        tipo_usuario    : type.STRING,
        observaciones   : type.TEXT,
        Estado          : type.STRING,
        id_empresa      : type.STRING,
        empresa         : type.STRING,
        deleted_at      : type.DATE,
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