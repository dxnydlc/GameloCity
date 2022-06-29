// clienteExcluidoModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_cliente_excluido',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id       : type.STRING,
		Codigo      : type.STRING,
        id_cliente  : type.STRING,
		cliente     : type.STRING,
		documento   : type.STRING,
		vencimiento : type.DATEONLY,
		estado      : type.STRING,
		Motivo		: type.STRING,
        deleted_at  : type.DATE,
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