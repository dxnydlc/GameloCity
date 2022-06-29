// docVentasDet231.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_docventaselecdet',{
		IdDetalleDoc:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		Serie : type.STRING,
		Correlativo : type.STRING,
        TipoItem : type.STRING,
        IdProducto : type.INTEGER,
        DocumentoRef : type.TEXT,
        Cantidad : type.DECIMAL(20,4),
        PrecioUnit : type.DECIMAL(20,4),
        Total : type.DECIMAL(20,4),
        Glosa : type.TEXT,
        Descripcion : type.TEXT,
        TipoDocumento : type.STRING,
        token : type.STRING,
        c011 : type.STRING,
        C012 : type.STRING,
        C013 : type.STRING,
        C014 : type.STRING,
        C015 : type.STRING,
        TextoAuxiliar500_1 : type.STRING,
        TextoAuxiliar500_2 : type.STRING,
        TextoAuxiliar500_3 : type.STRING,
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
