// loginLogModel

module.exports = (sequelize, type) => {
	return sequelize.define('orq_login_log',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
		id_usuario  : type.INTEGER,
		usuario     : type.STRING,
        dni         : type.STRING,
        email       : type.STRING,
        estado      : type.STRING,
        equipo      : type.STRING,
        modulo      : type.STRING,
        lat_login   : type.STRING,
        lng_login   : type.STRING,
        id_empresa      : type.INTEGER,
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
