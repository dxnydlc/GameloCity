// trabajoOTModel


module.exports = (sequelize, type) => {
	return sequelize.define('orq_trabajo_ot',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id       : type.STRING,
        IdOT       : type.INTEGER,
        fecha_ot 	: type.DATEONLY,
		id_usuario  : type.INTEGER,
        usuario     : type.STRING,
        dni         : type.STRING,
		celular     : type.STRING,
		correo_tecnico     : type.STRING,
        puesto      : type.STRING,
		estado      : type.STRING,
		obs_servicio: type.TEXT,
		diagnostico : type.TEXT,
		condicion 	: type.TEXT,
		accion_correctiva : type.TEXT,
		obs_cliente : type.TEXT,
		firma_cliente : type.STRING,
        lat_inicio  : type.STRING,
        lng_inicio  : type.STRING,
        inicio_trabajo : type.DATE,
		fin_trabajo : type.DATE,
		duracion 	: type.STRING,
        img_inicio  : type.TEXT,
        img_fin     : type.TEXT,
        lat_fin     : type.STRING,
		lng_fin     : type.STRING,
		puntaje 	: type.STRING,
		motivo 		: type.TEXT,
		notificado 	: type.STRING,
        id_empresa  : type.INTEGER,
        empresa     : type.STRING,
        deleted_at  : type.DATE,
        fecha_asignado : type.DATE,
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
