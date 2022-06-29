
// conjuntoOSModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_conjuntoos',{
		IDConjunto : {
			type          : type.INTEGER,
			primaryKey    : true,
			autoIncrement : true
		},
        IdOS        : type.INTEGER,
        IdOT        : type.INTEGER,
        AnexoOT     : type.INTEGER,
		Glosa       : type.TEXT,
		NroFactura  : type.STRING,
		Descripcion : type.STRING,
        Total       : type.DECIMAL(20, 6),
        Sumar       : type.INTEGER,
        Estado      : type.STRING,
        id_empresa      : type.INTEGER,
        empresa         : type.STRING,
        MotivoAnulacion : type.TEXT,
        C012            : type.TEXT,
        C013            : type.TEXT,
        FechaMod        : type.TEXT,
        UsuarioMod      : type.TEXT,
        NroBoleta       : type.TEXT,
        NroRecibo       : type.TEXT,
        NroCertificado  : type.TEXT,
		createdAt : {
			type: type.DATE,
			field: 'created_at',
		},
		updatedAt : {
			type: type.DATE,
			field: 'updated_at'
		}
	},{
		timestamps: true,
		freezeTableName: true
	})
}
