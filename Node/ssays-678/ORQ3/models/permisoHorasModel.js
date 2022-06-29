// permisoHorasModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_permisoxhora',{
		idPermiso:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
        },
        uu_id       : type.STRING,
		TipoDoc     : type.STRING,
		nombre_documento : type.STRING,
		TopeHora    : type.INTEGER,
        Fecha       : type.DATEONLY,
        Usuario     : type.INTEGER,
        nombre_usuario : type.STRING,
        AutorizadoPor       : type.INTEGER,
        NombreAutorizadoPor : type.STRING,
        Hora        : type.STRING,
        Estado      : type.INTEGER,
        idClienteProv   : type.DOUBLE,
        cliente         : type.STRING,
        Motivo          : type.STRING,
        hora_inicio     : type.STRING,
        hora_fin        : type.STRING,
        UsuarioCreado     : type.STRING,
        UsuarioModificado : type.STRING,
        UsuarioAnulado    : type.STRING,
        UsuarioMod      : type.STRING,
        FechaMod        : type.DATE,
        token           : type.STRING,
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