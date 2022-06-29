
// productosModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_productos',{
		IdProducto:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		IdClase     : type.DOUBLE,
		sub_clase   : type.STRING,
		ProveedorPrecio : type.DOUBLE,
        EAN         : type.STRING,
        IdUMedida   : type.INTEGER,
        unidad_medida : type.STRING,
        PLU         : type.INTEGER,
        Codigo1     : type.STRING,
        Codigo2     : type.STRING,
        Descripcion : type.TEXT,
        IdSubClase1 : type.STRING,
        sub_clase1  : type.STRING,
        IdSubClase2 : type.STRING,
        sub_clase2  : type.STRING,
        IdSubClase3 : type.STRING,
        sub_clase3  : type.STRING,
        cu_ponderado : type.DECIMAL(10, 5),
        Stock       : type.FLOAT(11, 2),
        Stock_min   : type.DECIMAL(10, 5),
        StockUsados : type.FLOAT(11, 2),
        StockVivando    : type.INTEGER,
        CostoUnit       : type.DECIMAL(20, 4),
        tipo_cambio     : type.DECIMAL(10, 2),
        CostoUnit_soles : type.DECIMAL(10, 2),
        CostoPromedio   : type.DECIMAL(10, 2),
        Total           : type.FLOAT(11, 4),
        StockD      : type.FLOAT(11, 4),
        C017        : type.STRING,
        Estado      : type.INTEGER,
        IdAlmacen   : type.INTEGER,
        almacen     : type.STRING,
        C020        : type.STRING,
        IdMarca     : type.INTEGER,
        marca       : type.STRING,
        C024        : type.DECIMAL(20, 2),
        Ubicacion   : type.STRING,
        C026        : type.STRING,
        C027        : type.STRING,
        C028        : type.STRING,
        UsuarioMod  : type.INTEGER,
        nombre_usuario  : type.STRING,
        FechaMod        : type.STRING,
        Tipo            : type.STRING,
        IdMoneda        : type.INTEGER,
        moneda          : type.STRING,
        color           : type.STRING,
        material        : type.STRING,
        sku             : type.TEXT,
        id_empresa      : type.INTEGER,
        empresa         : type.STRING,
        flag            : type.STRING,
        mover_kardex    : type.STRING,
        codigo_sunat    : type.STRING,
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
