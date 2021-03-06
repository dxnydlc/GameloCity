// reqPersonalModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_reqpersonal',{
		IdReqPersonal:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
        },
        uu_id           : type.STRING,
		FechaEmision    : type.DATEONLY,
		cant_cubierta   : type.STRING,
		IdPuestoPersonal: type.INTEGER,
        Cantidad        : type.INTEGER,
        IdArea          : type.INTEGER,
        area            : type.STRING,
        JefeInmediato   : type.INTEGER,
        jefe_inmediato  : type.STRING,
        Motivo          : type.INTEGER,
        Tiempo          : type.TEXT,
        Documentos      : type.TEXT,
        Horario         : type.TEXT,
        Salario         : type.TEXT,
        Solicitante         : type.INTEGER,
        nombre_solicitante  : type.STRING,
        Cliente             : type.DOUBLE,
        nombre_cliente      : type.STRING,
        Sucursal            : type.INTEGER,
        nombre_sucursal     : type.STRING,
        Conocimientos       : type.TEXT,
        Estudios            : type.TEXT,
        Experiencia         : type.TEXT,
        CursosEspecializacion       : type.TEXT,
        CaracteristicasPersonales   : type.TEXT,
        Sexo                : type.TEXT,
        Edad                : type.TEXT,
        Habilidades         : type.TEXT,
        FechaPresentacion   : type.DATEONLY,
        UsuarioAprob        : type.TEXT,
        FechaAprob          : type.DATE,
        Dias            : type.TEXT,
        PuestoIso       : type.STRING,
        idPuestoIso     : type.INTEGER,
        Estado          : type.TEXT,
        UsuarioCerrado  : type.STRING,
        FechaCerrado    : type.DATE,
        estado_reclutamiento : type.STRING,
        UsuarioMod      : type.TEXT,
        FechaMod        : type.DATE,
        C031            : type.TEXT,
        C032            : type.DATE,
        C033            : type.TEXT,
        C034            : type.TEXT,
        C035            : type.TEXT,
        C036            : type.TEXT,
        C037            : type.DATE,
        Glosa           : type.TEXT,
        C039            : type.TEXT,
        C040            : type.TEXT,
        Atendido        : type.INTEGER,
        Direccion       : type.STRING,
        Comentario      : type.TEXT,
        Departamento    : type.STRING,
        Departamento_nombre     : type.STRING,
        Provincia               : type.STRING,
        Provincia_nombre        : type.STRING,
        IdDistrito              : type.STRING,
        Distrito_nombre         : type.STRING,
        distrito                : type.STRING,
        FechaInicio             : type.DATEONLY,
        PersAsignado            : type.TEXT,
        ObsRequerimiento    : type.STRING,
        dni_vigente         : type.STRING,
        cert_policial       : type.STRING,
        cert_domiciliario   : type.STRING,
        ant_penales         : type.STRING,
        carnet_sanidad      : type.STRING,
        cv_doc              : type.STRING,
        asignacion_familiar : type.STRING,
        verificativa        : type.STRING,
        recibo_servicios    : type.STRING,
        id_responsable      : type.INTEGER,
        responsable         : type.STRING,
        sol_emo             : type.STRING,
        uniforme            : type.TEXT,
        const_estudios      : type.STRING,
        estado_emo          : type.STRING,
        protocolo_industrial : type.STRING,
        bono_nocturno        : type.STRING,
        dec_domiciliario     : type.STRING,
        bonificacion         : type.STRING,
        fecha_emision_emo   : type.DATEONLY,
        motivo_anulado      : type.TEXT,
        FechaAprobado       : type.DATE,
        UsuarioAprobado     : type.STRING,
        
        UsuarioAnulado      : type.STRING,
        FechaAnulado        : type.DATE,

        id_empresa          : type.INTEGER,
        empresa             : type.STRING,
        deleted_at          : type.DATE,
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
