// fichaInspCertModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_fichainsp_certificado',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
        IdFichaInspeccion: type.INTEGER,
        Requiere : type.STRING,
        
		IdFrecuencia : type.INTEGER,
        Frecuencia : type.STRING,

        EmitirA : type.STRING,
        InfoCert : type.STRING,
        FechaHoraEntregaCertificado : type.STRING,
        
        Estado      : type.STRING,
        id_empresa  : type.INTEGER,
        empresa     : type.STRING,

        UsuarioCreado       : type.STRING,
        UsuarioModificado   : type.STRING,
        UsuarioAnulado      : type.STRING,

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