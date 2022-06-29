// adnSolServDetModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('adn_sol_serv_det',{
		id:{
			type            : type.INTEGER,
			primaryKey      : true,
			autoIncrement   : true
		},
		uu_id      : type.STRING,
		CodigoHead : type.STRING,
		DNI        : type.INTEGER,
		Nombre     : type.STRING,
		Paterno    : type.STRING,
		Materno    : type.STRING,
        FecNac     : type.DATEONLY,
        Sexo    : type.STRING,
        Puesto  : type.STRING,
        Celular : type.STRING,
        Correo  : type.STRING,
        Estado  : type.STRING,
		IdProveedor : type.BIGINT(12),
		Proveedor : type.STRING,
		FechaRepro : type.DATEONLY,
        Token   : type.STRING,
		EnvioWhatsApp : type.STRING,
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
