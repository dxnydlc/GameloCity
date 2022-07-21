// audioriaOSOTModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_auditoria_os_ot',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		TipoDoc     : type.STRING,
        Correlativo : type.INTEGER,
		Accion      : type.STRING,
		Estado      : type.STRING,
        FechaMod    : type.DATE,
        UsuarioMod  : type.STRING,
        NomUsuario  : type.STRING,
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
