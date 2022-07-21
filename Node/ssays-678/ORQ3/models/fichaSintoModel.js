// fichaSintoModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_ficha_sintomatologia',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id            : type.STRING,
		EstadoTrabajador : type.STRING,
        EstadoDoc        : type.INTEGER,

        dni         : type.STRING,
        Colaborador : type.STRING,
        FechaNacimiento : type.STRING,
        Edad            : type.STRING,
        Telefono        : type.STRING,
        Email           : type.STRING,
        Direccion       : type.STRING,
        Sexo            : type.STRING,

        id_area     : type.INTEGER,
        area        : type.STRING,
        id_puesto   : type.INTEGER,
        puesto      : type.STRING,

        bloque1_preg01 : type.STRING,
        bloque1_preg01_text : type.STRING,
        bloque1_preg02 : type.STRING,
        bloque1_preg03 : type.STRING,
        bloque1_preg04 : type.STRING,
        bloque1_preg05 : type.STRING,
        bloque1_preg06 : type.STRING,
        bloque1_preg07 : type.STRING,
        bloque1_preg08 : type.STRING,
        bloque1_preg09 : type.STRING,
        bloque1_preg10 : type.STRING,
        bloque1_preg11 : type.STRING,
        bloque1_preg11_text : type.STRING,

        bloque2_preg01 : type.STRING,
        bloque2_preg01_text : type.STRING,
        bloque2_preg02 : type.STRING,
        bloque2_preg02_text : type.STRING,
        bloque2_preg03 : type.STRING,
        bloque2_preg03_text : type.STRING,

        bloque3_preg01 : type.STRING,
        bloque3_preg02 : type.STRING,
        bloque3_preg03 : type.STRING,
        bloque3_preg03_text : type.STRING,
        bloque3_preg04 : type.STRING,
        bloque3_preg05 : type.STRING,
        bloque3_preg06 : type.STRING,
        bloque3_preg07 : type.STRING,
        bloque3_preg07_text : type.STRING,
        bloque3_preg08 : type.STRING,
        bloque3_preg09 : type.STRING,
        bloque3_preg10 : type.STRING,
        bloque3_preg10_text : type.STRING,

        id_empresa  : type.STRING,
        empresa     : type.STRING,
        firma       : type.STRING,
        FechaResp   : type.DATE,
        DateResp    : type.DATEONLY,

        IdMailSend      : type.STRING,
        FechaSendMail   : type.STRING,
        Revisar         : type.STRING,
        Motivo          : type.STRING,

        UsuarioCreado     : type.STRING,
        UsuarioModificado : type.STRING,
        UsuarioAnulado    : type.STRING,

        deleted_at  : type.DATE,
		createdAt   : {
			type    : type.DATE,
			field   : 'created_at',
		},
		updatedAt   : {
			type    : type.DATE,
			field   : 'updated_at'
		}
	},{
		timestamps: true,
		freezeTableName: true
	})
}