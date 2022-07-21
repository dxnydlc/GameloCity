// users.js
// User

module.exports = (sequelize, type) => {
	const User = sequelize.define('users',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		Codigo 	: type.STRING,
		uu_id 	: type.STRING,
		name 	: type.STRING,
		email 	: type.STRING,
		mail_notifi : type.STRING,
		TipoUsuario : type.STRING,
		Firma 		: type.TEXT,
		Sexo 		: type.STRING,
		idUbigeo 	: type.STRING,
		email_verified_at : type.DATE,
		password 	: type.STRING,
		Direccion 	: type.STRING,
		api_token 	: type.STRING,
		avatar 		: type.STRING,
		avatar_40 	: type.TEXT,
		avatar_400 	: type.TEXT,
		codemp 		: type.INTEGER,
		nombre 		: type.STRING,
		apellidop 	: type.STRING,
		apellidom 	: type.STRING,
		Iniciales 	: type.STRING,
		dni 		: type.INTEGER,
		usuario 	: type.STRING,
		estado 		: type.STRING,
		idpuestopersonal : type.STRING,
		puesto 		: type.STRING,
		last_login 	: type.DATE,
		lat_login 	: type.STRING,
		lng_login 	: type.STRING,
		modulo_login 	: type.STRING,
		cliente 		: type.INTEGER,
		nombre_cliente 	: type.STRING,
		sucursal 		: type.INTEGER,
		nombre_local 	: type.STRING,
		codarea 		: type.STRING,
		fechanacimiento : type.DATEONLY,
		id_centro_costo : type.INTEGER,
		centrocosto 	: type.STRING,
		idPuestoIso 	: type.INTEGER,
		puestoiso 		: type.INTEGER,
		usuariomod 		: type.STRING,
		fechamod 		: type.STRING,
		emailalternativo : type.STRING,
		emailmant 		: type.STRING,
		emailsarah 		: type.STRING,
		emaildosif 		: type.STRING,
		emailfact 		: type.STRING,
		emailasistSane 	: type.STRING,
		emailprog 		: type.STRING,
		emailcert 		: type.STRING,
		emailseg 		: type.STRING,
		observaciones 	: type.STRING,
		source 			: type.STRING,
		id_area 	: type.INTEGER,
		area 		: type.STRING,
		anexo 		: type.STRING,
		celular 	: type.STRING,
		id_almacen 	: type.INTEGER,
		almacen 	: type.STRING,
		notas 		: type.STRING,
		skills 		: type.STRING,
		acerca_de_mi : type.STRING,
		id_horario   : type.INTEGER,
		horario 	 : type.STRING,
		n_amigos 	 : type.STRING,
		unidad_negocio 	 : type.STRING,
		IdOT 			 : type.INTEGER,
		trabajo_ot 		 : type.STRING,
		trabajo_iniciado : type.DATE,
		sup_iniciada	 : type.DATE,
		IdSupIniciada 	 : type.INTEGER,

		IdSupervisor 	: type.INTEGER,
		Supervisor 		: type.STRING,
		Fecha_Ingreso 	: type.DATEONLY,
		Inicio_Contrato : type.DATEONLY,
		Fin_Contrato 	: type.DATEONLY,
		Categoria_Brevete : type.STRING,
		Caducidad_Brevete : type.STRING,
		Flag 				: type.STRING,
		UsuarioCreado 		: type.STRING,
		UsuarioModificado 	: type.STRING,
		UsuarioAnulado 		: type.STRING,

		id_empresa 	: type.INTEGER,
		empresa 	: type.STRING,
		remember_token : type.STRING,
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
	});

	User.prototype.toJSON =  function () {
		var values = Object.assign({}, this.get());
	  
		delete values.password;
		return values;
	  }

	  return User;
}