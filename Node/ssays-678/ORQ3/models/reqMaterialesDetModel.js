
//reqMaterialesDetModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_requerimientosdet',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id : type.STRING,
        IdRequerimientoCab : type.INTEGER,
        IdRequerimientoDet : type.INTEGER,
        IdProducto         : type.INTEGER,
        producto           : type.STRING,
        unidad_medida      : type.STRING,
        tipo_producto      : type.STRING,
        IdClase     : type.INTEGER,
        IdUMedida   : type.INTEGER,
        Cantidad    : type.DECIMAL(20,2),
        CostoUnit   : type.DECIMAL(20,2),
        Total       : type.DECIMAL(20,2),
        Glosa       : type.TEXT,
        PedCompra   : type.INTEGER,
        oCompra     : type.INTEGER,
        pEntrada    : type.INTEGER,
        Atendido    : type.INTEGER,
        Guia        : type.INTEGER,
        CantGuia    : type.INTEGER,
        Almacen     : type.STRING,
        flag        : type.STRING,
		token       : type.STRING,
		estructura  : type.STRING,
		id_empresa  : type.INTEGER,
		empresa     : type.STRING,
        deleted_at  : type.DATE,
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
