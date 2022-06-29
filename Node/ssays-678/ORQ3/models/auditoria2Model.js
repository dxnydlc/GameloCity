// auditoria2Model
module.exports = (sequelize, type) => {
	return sequelize.define('orq_auditoria2',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		TipoDoc     : type.STRING,
        Serie       : type.STRING,
        Correlativo : type.STRING,
		Accion      : type.INTEGER,
		Estado      : type.STRING,
        FechaMod    : type.DATE,
        Accion      : type.INTEGER,
		Estado      : type.STRING,
        IdUsuario   : type.INTEGER,
		Usuario     : type.STRING,
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