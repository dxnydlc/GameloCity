// proveedorModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_proveedor',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		Codigo      : type.STRING,
		uu_id       : type.STRING,
		Tipo        : type.STRING,		
        Razon       : type.STRING,
        RUC         : type.INTEGER,
        Direccion   : type.TEXT,
		Lat : type.STRING,
		Lng : type.STRING,
		LinkMapa 	: type.TEXT,
        IdMoneda    : type.INTEGER,
        moneda      : type.STRING,
        Telefono    : type.STRING,
        Estado      : type.INTEGER,
        UsuarioMod  : type.STRING,
		FechaMod    : type.DATE,
		Fax         : type.STRING,
        Movil       : type.STRING,
        Email       : type.STRING,
        Contacto    : type.STRING,
        Glosa       : type.TEXT,
        IdGiro      : type.INTEGER,
        nombre_giro : type.STRING,
        NombreComercial : type.STRING,
        IdCentro        : type.INTEGER,
		CentroCosto    : type.STRING,
        TipoServicio    : type.STRING,
		CondicionPago        		: type.INTEGER,
		CondicionPagoDescripcion    : type.STRING,
        llave           : type.STRING,
        MaxEMO          : type.INTEGER,
		Aforo        : type.INTEGER,
		IdClienteProv : type.INTEGER,
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

