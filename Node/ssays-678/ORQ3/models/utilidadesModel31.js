// activosModel31
module.exports = (sequelize, type) => {
	return sequelize.define('utb_movilidad',{
		IdMovilidad : {
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        Codigo              : type.STRING,
        uu_id               : type.STRING,        
        IdEmpleado          : type.INTEGER,
        nombre              : type.STRING,
        Fecha               : type.DATEONLY,
        Cliente             : type.STRING,
        Direccion           : type.STRING,
        Pais                : type.STRING,
        Departamento        : type.STRING,
        NombreDepartamento  : type.STRING,
        Provincia           : type.STRING,
        NombreProvincia     : type.STRING,
        Distrito            : type.STRING,
        NombreDistrito     : type.STRING,
        TipoDir             : type.STRING,
        NombreCalle         : type.STRING,
        NroCalle            : type.STRING,
        OtrosCalle          : type.STRING,
        Npersonas   : type.INTEGER,
        Sdejar      : type.STRING,
        dejyrec     : type.STRING,
        hdejyrec    : type.STRING,
        Recojo      : type.STRING,
        HoraRecojo  : type.STRING,
        Material    : type.STRING,
        Espera      : type.STRING,
        NHEspera    : type.STRING,
        Observacion : type.STRING,
        Hora        : type.STRING,
        Estado      : type.STRING,
        FechaMod    : type.DATE,
        IdUsuarioMod: type.INTEGER,
        UsuarioMod  : type.STRING,
        Atendido    : type.INTEGER,
        id_empresa  : type.INTEGER,
        empresa     : type.STRING,
        lat         : type.STRING,
        lng         : type.STRING,
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