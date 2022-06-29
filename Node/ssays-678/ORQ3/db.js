const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const filmModel 	= require('./models/film');
const userModel 	= require('./models/users');
const osModel 		= require('./models/osModel');
const orq_cliente 	= require('./models/clienteModel');
const tbl_sucursal  = require('./models/sucursalModel');
const orq_utbClienteModel = require('./models/utbClienteModel');

const tbl_distrito 		= require('./models/distritoModel');
const tbl_accesoModulo 	= require('./models/accesoModuloModel');

const tbl_pedAlmacenH 	= require('./models/paHeaderModel');
const tbl_pedAlmacenD 	= require('./models/paDetModel');

// Cargo de certificado
const tbl_CargoCertificado = require('./models/cargoCertificadoModel');
// Cargo de certificado
const tbl_Certificado = require('./models/certificadoModel');
// Requerimiento de materiales
const tbl_ReqMateriales = require('./models/reqMatModel');
// Log login
const tbl_logLogin = require('./models/loginLogModel');
// Areas
const tbl_areas = require('./models/areasModel');
// Puesto iso
const tbl_puestoIso = require('./models/puestoIsoModel');
// OT
const tbl_ot = require('./models/otModel');

// Trabajo OT
const tbl_trabajoOT = require('./models/trabajoOTModel');
// Archivo Google
const orq_archivGoogle = require('./models/archiGoogleModel');
// Archivo constancia supervision
const orq_archivo_constanciasup = require('./models/archivoConstSupModel');
// Archivo constancia supervision
const orq_archivoCodigoQRModel = require('./models/archivoCodigoQrModel');
// Trabajo OT Prodcutos
const tbl_trabajoOTProductos = require('./models/otrabajoOTProds');
// Productos
const utb_productos_Model = require('./models/productosModel');
// Ficha de inspección
const utb_fichaInspeccion = require('./models/fichainspModel');

// Distrito
const utb_distrito = require('./models/distrito2Model');
// Departamento
const utb_departamento = require('./models/depaModel');
// Provincia
const utb_provincia = require('./models/provinciModel');
// Locales ficha de inspección
const orq_LocalFichaInspec = require('./models/localFichaInspe');
// Requerimiento de personal
const orq_reqPersonalModel = require('./models/reqPersonalModel');
// Resultado emo
const orq_resultadoEmo = require('./models/resultadoEmoModel');
// Almacen
const utb_almacen = require('./models/almacenModel');
// Empresa
const utb_empresas = require('./models/empresaModel');
// Centro de costos
const utb_CentroCostos = require('./models/centroCostosModel');
// Formulario servicios ficha de inspeccion
const orq_formServFichaInspe = require('./models/fichaInspFormServiciosModel');
// Servicios asignados aun loca ficha de inspeccion
const orq_serviciosLocalFicInspec = require('./models/fichaInspeServiciosLocal');
// Frecuencia
const utb_frecuencia = require('./models/frecuenciaModel');
// Configuracion empresa
const orq_configEmpresa = require('./models/configEmpresaModel');
// Per4miso por horas
const utb_permisoHoras = require('./models/permisoHorasModel');
// Tipo de documentos
const utb_tipoDoc = require('./models/tipoDocModel');
// Plantilla
const orq_plantilla = require('./models/plantillaModel');
// Detalle Plantilla
const orq_plantilladetalle = require('./models/plantillaDetalleModel');
// Ficha sintomalogica
const orq_fichaSinto = require('./models/fichaSintoModel');
// Tipo pago
const utb_tipoPagoModel = require('./models/tipoPagoModel');
// certificado ficha de inspeccion
const orq_fichaInspCert = require('./models/fichaInspCertModel');
// certificado ficha de inspeccion
const orq_fichaInspFactModel = require('./models/fichaInspFactModel');
// PTE
const orq_pteFichaInspModel = require('./models/pteFichaInspModel');
// Ficha de personal
const orq_fichaPersonal = require('./models/fichaPersonalModel');

// Aprobaciones
const orq_aprobaciones = require('./models/aprobacionesModel');

// Accidentes
const orq_accidente = require('./models/accidenteModel');

// medidas_correctivas
const orq_medidas_correctivas = require('./models/medidasCorrectivasModel');

// responsable
const orq_responsable = require('./models/responsableModel');

// Capacitaciones
const orq_capacitacion = require('./models/capacitacionCabModel');
// Capacitaciones asistentes
const orq_capacitacionAsistentes = require('./models/capacitacionDetModel');
// Sistemas / servicios OS
const orq_sistemas = require('./models/sistemasModel');
// Clase de producto
const orq_claseProd = require('./models/claseProdModel');
// Sub Clase de producto 01
const orq_subClaseProd01 = require('./models/subClaseProd01Model');
// Sub clase producto 02
const orq_subClaseProd02 = require('./models/subClaseProd02Model');
// Sub clase producto 03
const orq_subClaseProd03 = require('./models/subClaseProd03Model');

// Tareo 
const orq_tareo = require('./models/tareoModel');

// Tareo -  detalle 2
const orq_tareoDet2= require('./models/tareoDet2Model');

// Sub detalle de tareo
const orq_tareoSubModel = require('./models/tareoSubModel');


// Incidencias App Clientes
const orq_incidencias = require('./models/incidenciasModel');

// Requerimiento de dinero
const orq_dinero = require('./models/dineroModel');

// Usuarios clientes
const orq_usuariosCliente = require('./models/usuariosClienteModel');

// Horario
const orq_horario = require('./models/horarioModel');

// Detalle de horario
const orq_horarioDet = require('./models/horarioDetModel');

// Retenes
const orq_retenes = require('./models/retenesModel');

// Grupo clientes
const orq_grupoClientes = require('./models/grupoClienteModel');

// Votaciones
const orq_votacion = require('./models/votacionModel');

// Inscripcion votaciones
const orq_inscripcionVotacion = require('./models/inscripcionVotacionModel');

// OS Frecuencia
const orq_osFrecuenciaModel = require('./models/osFrecuenciaModel');

// OS Indica
const orq_indicaModel = require('./models/indicaModel');

// Personal OS
const tbl_personal_os = require('./models/personalOSModel');

// Personal OT
const tbl_personalOt = require('./models/personal_otModel');

// Auditoria OS/OT
const tbl_audioriaOSOT = require('./models/audioriaOSOTModel');

// Producto OS
const tbl_productosOS = require('./models/productosOSModel');

// Producto OT
const tbl_productosOT = require('./models/productosOTModel');

// Articulos - Concar
const tbl_articulosModel = require('./models/articulosModel');

// Requisicion - cab
const orq_requisicionCabModel = require('./models/requisicionCabModel');

// Requisicion - det
const orq_requisicionDetModel = require('./models/requisicionDetModel');

// Requisicion - auditoria
const orq_autRequisicionModel = require('./models/autRequisicionModel');

// requisicion Almacel Detalle
const orq_requisicionAlmacelDetModel = require('./models/requisicionAlmacelDetModel');

// Requisición Almacen cabecera
const orq_requisicionAlmacelCabModel = require('./models/requisicionAlmacelCabModel');

// Solicitud de SSGG
const orq_solicitudSSGGModel = require('./models/solicitudSSGGModel');

// Auditoria (2)
const orq_auditoria2Model = require('./models/auditoria2Model');

// Detalle de tareo 3
const orq_tareoDetalle3Model = require('./models/tareoDetalle3Model');

// Supervision
const orq_supervisionModel = require('./models/SupervisionModel');

// Auditoria supervisión
const orq_authSuperModel = require('./models/authSuperModel');

// Cliente excluido
const orq_clienteExcluidoModel = require('./models/clienteExcluidoModel');

// Detalle req de materiales
const orq_reqMaterialDetalleModel = require('./models/reqMaterialDetalleModel');

// Activos
const utb_activosModel = require('./models/activosModel');

// Utilidades
const utb_utilidadesModel = require('./models/utilidadesModel');

// Constancia de supervisión
const utb_constSuperModel = require('./models/constSuperModel');

// Banco
const utb_bancoModel = require('./models/bancoModel');

// Giro
const utb_giro = require('./models/giroModel');

// ENvio de boletas CAB
const orq_envioBoletaCabModel = require('./models/envioBoletaCabModel');

// ENvio de boletas DET
const orq_envioBoletaDetModel = require('./models/envioBoletaDetModel');

// Solicitud de reparacion de maquina
const orq_soliReparacionMaqModel = require('./models/soliReparacionMaqModel');

// Pedido de compra - CAB
const utb_pedidoCompraCabModal = require('./models/pedidoCompraCabModal');

// Pedido de compra - DET
const utb_pedidoCompraDetModal = require('./models/pedidoCompraDetModal');

// Lideres
const utb_lideresModel = require('./models/lideresModel');

// Asistencia
const orq_asistenciaCabModel = require('./models/asistenciaCabModel');
const orq_asistenciaDetModel = require('./models/asistenciaDetModel');

// Turnos
const orq_turnoCabModel = require('./models/turnoCabModel');

// Carga de contratos
const orq_envioContratosCabModel = require('./models/envioContratosCabModel');
const orq_envioContratosDetModel = require('./models/envioContratosDetModel');

// Solicitud servicios ADN
const orq_adnSolServCabModel = require('./models/adnSolServCabModel');
const orq_adnSolServDetModel = require('./models/adnSolServDetModel');

// Codigos QR
const orq_codigosQRCabModel = require('./models/codigosQRCabModel');
const orq_codigosQRDetModel = require('./models/codigosQRDetModel');

// Solicitud servicios
const orq_sol_nuevo_servicio = require('./models/solServicioModel');

// Doc ventas
const orq_docVentasCab = require('./models/docVentasCab');
const orq_docVentasDet = require('./models/docVentasDet');

// Plan de cuenta
const orq_planCuentaModel = require('./models/planCuentaModel');

// Catalogo 7
const utb_catalogo7Model = require('./models/catalogo7Model');

// Series documentos
const utb_seriesDocModel = require('./models/seriesDocModel');

// Proveedores
const orq_proveedorModel = require('./models/proveedorModel');

// Servicios
const orq_serviciosModel = require('./models/serviciosModel');

// Sub clase 1
const utb_subClase1Model = require('./models/subClase1Model');
// Repositorio
const orq_repoModel = require('./models/repoModel');

// Solicitud de cambio de estado documento
const orq_SolCambioEstadoModel 		= require('./models/SolCambioEstadoModel');
const orq_SolCambioEstadoModelDet 	= require('./models/SolCambioEstadoModelDet');

// Resumen de boletas
const orq_resumenBoletasCabModel = require('./models/resumenBoletasCabModel');
const orq_resumenBoletasDetModel = require('./models/resumenBoletasDetModel');

// Resumen de facturas
const orq_resumenFacturasCabModel = require('./models/resumenFacturasCabModel');
const orq_resumenFacturasDetModel = require('./models/resumenFacturasDetModel');

// Coutas documento de ventas
const orq_docVentaCuotaModel = require('./models/docVentaCuotaModel');

// Ficha inspeccion cab 2021
const orq_fichaInspecCabMode = require('./models/ficha_inspec2021/fichaInspecCabMode');

// Reportes
const orq_reportesModel = require('./models/reportesModel');

// Resumen de baja de Nota de Credito/Débito
const orq_resumenNotasCabModel = require('./models/resumenNotasCabModel');
const orq_resumenNotasDetModel = require('./models/resumenNotasDetModel');

// Locales de ficha de inspecion 2021
const orq_localesFI21Model = require('./models/ficha_inspec2021/localesFI21Model');
// Servicios en locales de ficha de inspeccion 2021
const orq_serviciosLocalFI2021 = require('./models/ficha_inspec2021/serviciosLocalFI2021');
// Penalidades ficha de inspeccion local servicio
const orq_penalidadesLocalServFI21Modal = require('./models/ficha_inspec2021/penalidadesLocalServFI21Modal');
// Productos ficha de inspeccion
const orq_productoFI21Model = require('./models/ficha_inspec2021/productoFI21Model');
// Diagnostico de plagas
const orq_diagPlagasFI21Model = require('./models/ficha_inspec2021/diagPlagasFI21Model');
// Tanque y pozo ceptico
const orq_tanquepozoFI21Model = require('./models/ficha_inspec2021/tanquepozoFI21Model');
// Tanque y pozo ceptico DATOS
const orq_tanquePozoDatosFI21Model = require('./models/ficha_inspec2021/tanquePozoDatosFI21Model');
// Manejo de residuos
const orq_manejoResiduosFI21Model = require('./models/ficha_inspec2021/manejoResiduosFI21Model');

// Manejo de residuos
const orq_manejoResiduosDatosFI21Model = require('./models/ficha_inspec2021/manejoResiduosDatosFI21Model');

// Bitacora de supervisor
const orq_bitacoraSuperModel = require('./models/bitacoraSuperModel');

// Incidencias, comentarios
const orq_incidenciaComentarioModel = require('./models/incidenciaComentarioModel');

// Apoyo datos
const orq_apoyoDataModel = require('./models/apoyoDataModel');

// Bitacora / Bloque
const orq_bitacoraBloqueModel = require('./models/bitacoraBloqueModel');

// Bitacora / Area
const orq_bitacoraAreaModel = require('./models/bitacoraAreaModel');

// Bitacora / Trabajo
const orq_bitacoraTrabajoModel = require('./models/bitacoraTrabajoModel');

// LAP XLS OPERARIOS
const orq_xlsLAPTrabajadoresCabModel = require('./models/xlsLAPTrabajadoresCabModel');
const orq_xlsLAPTrabajadoresDetModel = require('./models/xlsLAPTrabajadoresDetModel');

// LAP XLS HALLAZGOS
const orq_xlsLAPhallazgoCabModel = require('./models/xlsLAPhallazgoCabModel');
const orq_xlsLAPhallazgoDetModel = require('./models/xlsLAPhallazgoDetModel');

// Números Rechazados whatssap
const orq_numRechazadosModel = require('./models/numRechazadosModel');

// LAP XLS INCIDENCIAS
const orq_xlsLAPIncidenciasCabModel = require('./models/xlsLAPIncidenciasCabModel');
const orq_xlsLAPIncidenciasDetModel = require('./models/xlsLAPIncidenciasDetModel');

// LAP XLS MAQUINARIA
const orq_xlsLAPMaquinariaCabModel = require('./models/xlsLAPMaquinariaCabModel');
const orq_XLSLapMaquinariaDetModel = require('./models/XLSLapMaquinariaDetModel');

// LAP MANT MAQUINARIA
const orq_xlsLAPMantMaqPartesModel = require('./models/xlsLAPMantMaqPartesModel');
const orq_xlsLAPMantMaqCabModel    = require('./models/xlsLAPMantMaqCabModel');
const orq_xlsLAPMantMaqDetModel    = require('./models/xlsLAPMantMaqDetModel');

// LAP REQ MATERIALES
const orq_xlsLAPReqMatDetModel = require('./models/xlsLAPReqMatDetModel');
const orq_xlsLAPReqMatCabModel = require('./models/xlsLAPReqMatCabModel');

// LAP KIT ANTIDERRAME
const orq_LAPKitAntiderrameCabModel = require('./models/LAPKitAntiderrameCabModel');

// CARRITO BARREDOR
const orq_LAPCarritoBarredorCabModel = require('./models/LAPCarritoBarredorCabModel');
const orq_LAPCarritoBarredorDetModel = require('./models/LAPCarritoBarredorDetModel');

// Cronograma.
const orq_cronogramaTrabajoCabModel  = require('./models/cronogramaTrabajoCabModel');
const orq_cronogramaTrabajoDetModel  = require('./models/cronogramaTrabajoDetModel');
const orq_cronogramaTrabajoInfoModel = require('./models/cronogramaTrabajoInfoModel');

// Cargar Excel
const orq_cargaExcelModelCab  = require('./models/cargaExcelModelCab');
const orq_cargaExcelModelDet  = require('./models/cargaExcelModelDet');

//Ficha técnica
const orq_fichaTecnicaModel  = require('./models/fichaTecnicaModel');
const orq_fichaTecnica_perModel  = require('./models/fichaTecnica_perModel');
const orq_fichaTecnica_proModel  = require('./models/fichaTecnica_proModel');

// Req de materiales 2022
const orq_reqMaterialesCabModel  = require('./models/reqMaterialesCabModel');
const orq_reqMaterialesDetModel  = require('./models/reqMaterialesDetModel');

// Notificar Usuario
const orq_notificarUsuarioModel  = require('./models/notificarUsuarioModel');

// LAP Apoyo
const orq_xlsLAPApoyoCabModel  = require('./models/xlsLAPApoyoCabModel');

// LAP Apoyo
const orq_xlsLAPApoyoDeModel  = require('./models/xlsLAPApoyoDeModel');

// Orden de compra - proveedor
const orq_ordenCompraModal  = require('./models/ordenCompraModal');

// LAP charla del mes
const orq_xlsLAPCharlaMesModel  = require('./models/xlsLAPCharlaMesModel');

// LAP asistencia
const orq_xlsLAPAsistenciaModel  = require('./models/xlsLAPAsistenciaModel');

// LAP Rotacion de personal
const orq_xlsLAPRotaPersonalModel  = require('./models/xlsLAPRotaPersonalModel');

// LAP Accidentes Incidentes
const orq_xlsLAPAccidentesInciModel  = require('./models/xlsLAPAccidentesInciModel');

// LAP Accidentes Incidentes
const orq_xlsLAPDerrameCombustibleModel  = require('./models/xlsLAPDerrameCombustibleModel');

// LAP Mant barredora
const orq_xlsLAPMantBarredoraModel  = require('./models/xlsLAPMantBarredoraModel');

// LAP Desempeño de personal
const orq_xlsLAPDesempenioPersonalModel  = require('./models/xlsLAPDesempenioPersonalModel');

// LAP REPORTE
const orq_reporteLapModel  = require('./models/reporteLapModel');

// BITACORA DETALLE 
const orq_bitacoraDetalleModel  = require('./models/bitacoraDetalleModel');

// PLANOS
const orq_planosModel = require('./models/planosModel');
const orq_planosDetModel = require('./models/planosDetModel');

// Feedback reporte LAP
const orq_feedbackLAPModel = require('./models/feedbackLAPModel');

// Lap Peso food
const orq_LapPesoFodModel = require('./models/LapPesoFodModel');

// Lap Personal sancionado
const orq_LapPersonalSancionadoModel = require('./models/LapPersonalSancionadoModel');

// Lap personal AID
const orq_LapPersonalAIDModel = require('./models/LapPersonalAIDModel');

// Lap trabajo on realizado
const orq_LapTrabajoNoRealizadoModel = require('./models/LapTrabajoNoRealizadoModel');

// Asignar tecnico a servicio
const orq_asignarTecnicoModel = require('./models/asignarTecnicoModel');

// Productos en el trabajo OT
const orq_productoTrabajoOTModel = require('./models/productoTrabajoOTModel');

// Ficha de ejecución de servicio de servicio OT
const orq_fichaTecnicaTrabajoOTModel = require('./models/fichaTecnicaTrabajoOTModel');

// Trabo no realizado detalle
const orq_LapTrabajoNoRealizadoDetModel = require('./models/LapTrabajoNoRealizadoDetModel');

// Tabla LAP
const orq_lapTablaModel = require('./models/lapTablaModel');
const orq_lapBloque1Model = require('./models/lapBloque1Model');

// Cronograma asignado a personal...
const orq_cronogramaPersonalCabModel = require('./models/cronogramaPersonalCabModel');
const orq_cronogramaPersonalDetModel = require('./models/cronogramaPersonalDetModel');

// tabla Monitoreo
const orq_monitoreoModel = require('./models/monitoreoModel');

// Telegram
const orq_telegramModel = require('./models/telegramModel');
const orq_telegramChatModel = require('./models/telegramChatModel');

// nueva tabla activos 2022
const orq_activos_2022Model = require('./models/activos_2022Model');

// nueva tabla Historial Mantenimiento
const orq_histoMantModal = require('./models/histoMantModal');

// nueva tabla Historial Mantenimiento detalle
const orq_histoMantDetModal = require('./models/histoMantDetModal');










































/**/
// DEVELOPS
const sequelize = new Sequelize(process.env.DB_database,process.env.DB_user,process.env.DB_password,{
	host:process.env.DB_host,
	dialect  : 'mysql',
	timezone : 'America/Lima',
	logging  : false,
	dialectOptions: {
		timezone: "local",
	}
});
/**/





























const Film = filmModel(sequelize,Sequelize);
const User = userModel(sequelize,Sequelize);
const OS = osModel(sequelize,Sequelize);
const clienteModel = orq_cliente(sequelize,Sequelize);

const distritoModel = tbl_distrito(sequelize,Sequelize);
const accesoModuloModel = tbl_accesoModulo(sequelize,Sequelize);

// Pedido de almacen
const paHeaderModel = tbl_pedAlmacenH(sequelize,Sequelize);
const paDetModel = tbl_pedAlmacenD(sequelize,Sequelize);

// Cargo certificado
const cargoCertificadoModel = tbl_CargoCertificado(sequelize,Sequelize);
// Cargo certificado
const CertificadoModel = tbl_Certificado(sequelize,Sequelize);
// Requerimiento de materiales
const reqMaterialesModel = tbl_ReqMateriales(sequelize,Sequelize);
// Login Log
const logLoginModel = tbl_logLogin(sequelize,Sequelize);
// Areas
const areaModel = tbl_areas(sequelize,Sequelize);
// Puesto Iso
const puestoIsoModel = tbl_puestoIso(sequelize,Sequelize);
// OT
const otModel = tbl_ot(sequelize,Sequelize);
// Peronsal OT
const personalOTModel = tbl_personalOt(sequelize,Sequelize);
// Trabajo OT
const trabajoOTModel = tbl_trabajoOT(sequelize,Sequelize);
// Archivo google
const archiGoogleModel = orq_archivGoogle(sequelize,Sequelize);
// Archivo constancia supervision
const archivoConstSupModel = orq_archivo_constanciasup(sequelize,Sequelize);

// Archivo constancia supervision
const archivoCodigoQRModel = orq_archivoCodigoQRModel(sequelize,Sequelize);

// Trabajo OT Productos
const trabajoOTProdModel = tbl_trabajoOTProductos(sequelize,Sequelize);
// Productos
const productosModel = utb_productos_Model(sequelize,Sequelize);
// FIcha de inspección
const fichaInspeccionModel = utb_fichaInspeccion(sequelize,Sequelize);

// Distrito 2
const distrito2Model = utb_distrito(sequelize,Sequelize);
// Departamento
const departamentoModel = utb_departamento(sequelize,Sequelize);
// Provincia
const provinciaModel = utb_provincia(sequelize,Sequelize);
// Local Ficha de inspección
const localFichaInpecModel = orq_LocalFichaInspec(sequelize,Sequelize);
// Requerimiento de personal
const reqPersonalModel = orq_reqPersonalModel(sequelize,Sequelize);
// Resultado EMO
const resultadoEmoModel = orq_resultadoEmo(sequelize,Sequelize);
// Almacen
const almacenModel = utb_almacen(sequelize,Sequelize);
// Empresas
const empresasModel = utb_empresas(sequelize,Sequelize);
// Sucursales
const sucursalModel = tbl_sucursal(sequelize,Sequelize);
// Centro de costos
const centroCostosModel = utb_CentroCostos(sequelize,Sequelize);
// Formulario servicios ficha de inspeccion
const formServFichaInspModel = orq_formServFichaInspe(sequelize,Sequelize);
// Servicios asignados aun loca ficha de inspeccion
const serviciosLocalFicInpecModel = orq_serviciosLocalFicInspec(sequelize,Sequelize);
// Frecuencia
const frecuenciaModel = utb_frecuencia(sequelize,Sequelize);
// Configuracion empresa
const configEmpresa = orq_configEmpresa(sequelize,Sequelize);
// Prmiso por horas
const permisoHorasModel = utb_permisoHoras(sequelize,Sequelize);
// Tipo de documento
const tipoDocumentoModel = utb_tipoDoc(sequelize,Sequelize);
// Plantilla
const plantillaModel = orq_plantilla(sequelize,Sequelize);
// Detalle Plantilla
const plantillaDetalleModel = orq_plantilladetalle(sequelize,Sequelize);
// Ficha sintomalogica
const fichaSintoModel = orq_fichaSinto(sequelize,Sequelize);
// Tipo pago
const tipoPagoModel = utb_tipoPagoModel(sequelize,Sequelize);
// certificado ficha de inspeccion
const fichaInspCertModel = orq_fichaInspCert(sequelize,Sequelize);
// certificado ficha de inspeccion
const fichaInspFactModel = orq_fichaInspFactModel(sequelize,Sequelize);
// PTE
const pteFichaInspModel = orq_pteFichaInspModel(sequelize,Sequelize);
// Ficha de personal
const fichaPersonalModel = orq_fichaPersonal(sequelize,Sequelize);

// Aprobaciones
const aprobacionesModel = orq_aprobaciones(sequelize,Sequelize);

// Accidentes
const accidenteModel = orq_accidente(sequelize,Sequelize);

// Medidas correctivas
const medidasCorrectivasModel = orq_medidas_correctivas(sequelize,Sequelize);

// Medidas correctivas
const responsableModel = orq_responsable(sequelize,Sequelize);

// Capacitaciones
const capacitacionModel = orq_capacitacion(sequelize,Sequelize);
// Capacitaciones asistentes
const capacitacionDetModel = orq_capacitacionAsistentes(sequelize,Sequelize);
// Sistemas / servicios OS
const sistemasModel = orq_sistemas(sequelize,Sequelize);
// Clase de producto
const claseProdModel = orq_claseProd(sequelize,Sequelize);
// Sub clase de producto 01
const subClaseProd01Model = orq_subClaseProd01(sequelize,Sequelize);
// Sub clase de producto 02
const subClaseProd02Model = orq_subClaseProd02(sequelize,Sequelize);
// Sub clase de producto 03
const subClaseProd03Model = orq_subClaseProd03(sequelize,Sequelize);

// Tareo
const tareoModel = orq_tareo(sequelize,Sequelize);

// Tareo -  detalle 2
const tareoDet2Model = orq_tareoDet2(sequelize,Sequelize);

// Incidencias App OLI
const incidenciasModel = orq_incidencias(sequelize,Sequelize);

const dineroModel = orq_dinero(sequelize,Sequelize);

// Clientes usuario
const usuariosClienteModel = orq_usuariosCliente(sequelize,Sequelize);

// Horario
const horarioModel = orq_horario(sequelize,Sequelize);

// Detalle de horario
const horarioDetModel = orq_horarioDet(sequelize,Sequelize);

// Retenes
const retenesModel = orq_retenes(sequelize,Sequelize);

// Grupo de clientes
const grupoClienteModel = orq_grupoClientes(sequelize,Sequelize);

// Votaciones
const votacionModel = orq_votacion(sequelize,Sequelize);

// Inscripcion votaciones
const inscripcionVotacionModel = orq_inscripcionVotacion(sequelize,Sequelize);

// OS Frecuencia
const osFrecuenciaModel = orq_osFrecuenciaModel(sequelize,Sequelize);

// OS Indica
const indicaModel = orq_indicaModel(sequelize,Sequelize);

// Personal OS
const personalOSModel = tbl_personal_os(sequelize,Sequelize);

// Personal OT
const personal_otModel = tbl_personalOt(sequelize,Sequelize);

// Auditoria OS/OT
const audioriaOSOTModel = tbl_audioriaOSOT(sequelize,Sequelize);

// Producto OS
const productosOSModel = tbl_productosOS(sequelize,Sequelize);

// Producto OT
const productosOTModel = tbl_productosOT(sequelize,Sequelize);

// Articulos
const articulosModel = tbl_articulosModel(sequelize,Sequelize);

// Requisicion - cab
const requisicionCabModel = orq_requisicionCabModel(sequelize,Sequelize);

// Requisicion - det
const requisicionDetModel = orq_requisicionDetModel(sequelize,Sequelize);

// Requisicion - auditoria
const autRequisicionModel = orq_autRequisicionModel(sequelize,Sequelize);

// requisicion Almacel Detalle
const requisicionAlmacelDetModel = orq_requisicionAlmacelDetModel(sequelize,Sequelize);

// Requisición Almacen cabecera
const requisicionAlmacelCabModel = orq_requisicionAlmacelCabModel(sequelize,Sequelize);

// Solicitud de SSGG
const solicitudSSGGModel = orq_solicitudSSGGModel(sequelize,Sequelize);
 
// Auditoria (2)
const auditoria2Model = orq_auditoria2Model(sequelize,Sequelize);

// Detalle de tareo 3
const tareoDetalle3Model  = orq_tareoDetalle3Model(sequelize,Sequelize);

// Supervision
const supervisionModel  = orq_supervisionModel(sequelize,Sequelize);

// Auditoria supervisión
const authSuperModel  = orq_authSuperModel(sequelize,Sequelize);

// Cliente excluido
const clienteExcluidoModel  = orq_clienteExcluidoModel(sequelize,Sequelize);

// Detalle req de materiales
const reqMaterialDetalleModel  = orq_reqMaterialDetalleModel(sequelize,Sequelize);

// Activos
const activosModel  = utb_activosModel(sequelize,Sequelize);

// Utilidades
const utilidadesModel  = utb_utilidadesModel(sequelize,Sequelize);

// Utilidades
const constSuperModel  = utb_constSuperModel(sequelize,Sequelize);

// Bancos
const bancoModel  = utb_bancoModel(sequelize,Sequelize);

// Giro
const giroModel = utb_giro(sequelize,Sequelize);

// ENvio de boletas CAB
const envioBoletaCabModel = orq_envioBoletaCabModel(sequelize,Sequelize);

// ENvio de boletas DET
const envioBoletaDetModel = orq_envioBoletaDetModel(sequelize,Sequelize);

// Solicitud de reparacion de maquina
const soliReparacionMaqModel = orq_soliReparacionMaqModel(sequelize,Sequelize);

// Pedido de compra - CAB
const pedidoCompraCabModal = utb_pedidoCompraCabModal(sequelize,Sequelize);

// Pedido de compra - DET
const pedidoCompraDetModal = utb_pedidoCompraDetModal(sequelize,Sequelize);

// Lideres
const lideresModel = utb_lideresModel(sequelize,Sequelize);

// Asistencia
const asistenciaCabModel = orq_asistenciaCabModel(sequelize,Sequelize);
const asistenciaDetModel = orq_asistenciaDetModel(sequelize,Sequelize);

// Turnos
const turnoCabModel = orq_turnoCabModel(sequelize,Sequelize);

// Sub detalle de tareo
const tareoSubModel = orq_tareoSubModel(sequelize,Sequelize);

// Carga de contratos
const envioContratosCabModel = orq_envioContratosCabModel(sequelize,Sequelize);
const envioContratosDetModel = orq_envioContratosDetModel(sequelize,Sequelize);

// Solicitud servicios ADN
const adnSolServCabModel = orq_adnSolServCabModel(sequelize,Sequelize);
const adnSolServDetModel = orq_adnSolServDetModel(sequelize,Sequelize);

// Codigos QR
const codigosQRCabModel = orq_codigosQRCabModel(sequelize,Sequelize);
const codigosQRDetModel = orq_codigosQRDetModel(sequelize,Sequelize);


// Solicitud servicios ADN
const solServicioModel = orq_sol_nuevo_servicio(sequelize,Sequelize);

// Doc ventas
const docVentasCab = orq_docVentasCab(sequelize,Sequelize);
const docVentasDet = orq_docVentasDet(sequelize,Sequelize);

// Plan de cuenta
const planCuentaModel = orq_planCuentaModel(sequelize,Sequelize);

// Catalogo 7
const catalogo7Model = utb_catalogo7Model(sequelize,Sequelize);

// Series documentos
const seriesDocModel = utb_seriesDocModel(sequelize,Sequelize);

// Proveedores
const proveedorModel = orq_proveedorModel(sequelize,Sequelize);

// Servicios
const serviciosModel = orq_serviciosModel(sequelize,Sequelize);

// Sub clase 1
const subClase1Model = utb_subClase1Model(sequelize,Sequelize);
// Repositorio
const repoModel = orq_repoModel(sequelize,Sequelize);

// Cambio de estado documento
const SolCambioEstadoModel 	  = orq_SolCambioEstadoModel(sequelize,Sequelize);
const SolCambioEstadoModelDet = orq_SolCambioEstadoModelDet(sequelize,Sequelize);

// Resumen de boletas
const resumenBoletasCabModel  = orq_resumenBoletasCabModel(sequelize,Sequelize);
const resumenBoletasDetModel = orq_resumenBoletasDetModel(sequelize,Sequelize);

// Resumen de facturas
const resumenFacturasCabModel  = orq_resumenFacturasCabModel(sequelize,Sequelize);
const resumenFacturasDetModel  = orq_resumenFacturasDetModel(sequelize,Sequelize);

// Coutas documento de ventas
const docVentaCuotaModel  = orq_docVentaCuotaModel(sequelize,Sequelize);

// Ficha inspeccion cab 2021
const fichaInspecCabMode  = orq_fichaInspecCabMode(sequelize,Sequelize);

// Reportes
const reportesModel  = orq_reportesModel(sequelize,Sequelize);

// Resumen de baja de Nota de Credito/Débito
const resumenNotasCabModel  = orq_resumenNotasCabModel(sequelize,Sequelize);
const resumenNotasDetModel  = orq_resumenNotasDetModel(sequelize,Sequelize);

// Locales de ficha de inspecion 2021
const localesFI21Model  = orq_localesFI21Model(sequelize,Sequelize);

// Servicios en locales de ficha de inspeccion 2021
const serviciosLocalFI2021  = orq_serviciosLocalFI2021(sequelize,Sequelize);

// Penalidades ficha de inspeccion local servicio
const penalidadesLocalServFI21Modal  = orq_penalidadesLocalServFI21Modal(sequelize,Sequelize);

// Productos ficha de inspeccion
const productoFI21Model  = orq_productoFI21Model(sequelize,Sequelize);

// Diagnostico de plagas
const diagPlagasFI21Model  = orq_diagPlagasFI21Model(sequelize,Sequelize);

// Tanque y pozo ceptico
const tanquepozoFI21Model  = orq_tanquepozoFI21Model(sequelize,Sequelize);

// Tanque y pozo ceptico DATOS
const tanquePozoDatosFI21Model  = orq_tanquePozoDatosFI21Model(sequelize,Sequelize);

// Manejo de residuos
const manejoResiduosFI21Model  = orq_manejoResiduosFI21Model(sequelize,Sequelize);

// Manejo de residuos - datos
const manejoResiduosDatosFI21Model  = orq_manejoResiduosDatosFI21Model(sequelize,Sequelize);

// Bitacora de supervisor
const bitacoraSuperModel  = orq_bitacoraSuperModel(sequelize,Sequelize);

// Incidencias, comentarios
const incidenciaComentarioModel  = orq_incidenciaComentarioModel(sequelize,Sequelize);

// Apoyo datos
const apoyoDataModel  = orq_apoyoDataModel(sequelize,Sequelize);

// Bitacora / Bloque
const bitacoraBloqueModel  = orq_bitacoraBloqueModel(sequelize,Sequelize);

// Bitacora / Area
const bitacoraAreaModel  = orq_bitacoraAreaModel(sequelize,Sequelize);

// Bitacora / Trabajo
const bitacoraTrabajoModel  = orq_bitacoraTrabajoModel(sequelize,Sequelize);

// LAP XLS OPERARIOS
const xlsLAPTrabajadoresCabModel  = orq_xlsLAPTrabajadoresCabModel(sequelize,Sequelize);
const xlsLAPTrabajadoresDetModel  = orq_xlsLAPTrabajadoresDetModel(sequelize,Sequelize);

// LAP XLS HALLAZGOS
const xlsLAPhallazgoCabModel  = orq_xlsLAPhallazgoCabModel(sequelize,Sequelize);
const xlsLAPhallazgoDetModel  = orq_xlsLAPhallazgoDetModel(sequelize,Sequelize);

// Números Rechazados whatssap
const numRechazadosModel = orq_numRechazadosModel(sequelize,Sequelize);

// LAP XLS INCIDENCIAS
const xlsLAPIncidenciasCabModel = orq_xlsLAPIncidenciasCabModel(sequelize,Sequelize);
const xlsLAPIncidenciasDetModel = orq_xlsLAPIncidenciasDetModel(sequelize,Sequelize);

// LAP XLS MAQUINARIA
const xlsLAPMaquinariaCabModel = orq_xlsLAPMaquinariaCabModel(sequelize,Sequelize);
const XLSLapMaquinariaDetModel = orq_XLSLapMaquinariaDetModel(sequelize,Sequelize);

// LAP MANT MAQUINARIA
const xlsLAPMantMaqPartesModel = orq_xlsLAPMantMaqPartesModel(sequelize,Sequelize);
const xlsLAPMantMaqCabModel    = orq_xlsLAPMantMaqCabModel(sequelize,Sequelize);
const xlsLAPMantMaqDetModel    = orq_xlsLAPMantMaqDetModel(sequelize,Sequelize);

// LAP REQ MATERIALES
const xlsLAPReqMatDetModel = orq_xlsLAPReqMatDetModel(sequelize,Sequelize);
const xlsLAPReqMatCabModel = orq_xlsLAPReqMatCabModel(sequelize,Sequelize);

// LAP KIT ANTIDERRAME
const LAPKitAntiderrameCabModel = orq_LAPKitAntiderrameCabModel(sequelize,Sequelize);

// CARRITO BARREDOR
const LAPCarritoBarredorCabModel = orq_LAPCarritoBarredorCabModel(sequelize,Sequelize);
const LAPCarritoBarredorDetModel = orq_LAPCarritoBarredorDetModel(sequelize,Sequelize);

// Cronograma.
const cronogramaTrabajoCabModel  = orq_cronogramaTrabajoCabModel(sequelize,Sequelize);
const cronogramaTrabajoDetModel  = orq_cronogramaTrabajoDetModel(sequelize,Sequelize);
const cronogramaTrabajoInfoModel = orq_cronogramaTrabajoInfoModel(sequelize,Sequelize);

// Cargar Excel
const cargaExcelModelCab  = orq_cargaExcelModelCab(sequelize,Sequelize);
const cargaExcelModelDet  = orq_cargaExcelModelDet(sequelize,Sequelize);


// Ficha Técnica
const fichaTecnicaModel  	 = orq_fichaTecnicaModel(sequelize,Sequelize);
const fichaTecnica_perModel  = orq_fichaTecnica_perModel(sequelize,Sequelize);
const fichaTecnica_proModel  = orq_fichaTecnica_proModel(sequelize,Sequelize);


// Req de materiales 2022
const reqMaterialesCabModel = orq_reqMaterialesCabModel(sequelize,Sequelize);
const reqMaterialesDetModel = orq_reqMaterialesDetModel(sequelize,Sequelize);

// Notificar Usuario
const notificarUsuarioModel = orq_notificarUsuarioModel(sequelize,Sequelize);

// LAP Apoyo
const xlsLAPApoyoCabModel = orq_xlsLAPApoyoCabModel(sequelize,Sequelize);

// LAP Apoyo
const xlsLAPApoyoDeModel = orq_xlsLAPApoyoDeModel(sequelize,Sequelize);

// Notificar Usuario
const utbClienteModel = orq_utbClienteModel(sequelize,Sequelize);


// orden Compra proveedor
const ordenCompraModal = orq_ordenCompraModal(sequelize,Sequelize);

// LAP charla del mes
const xlsLAPCharlaMesModel = orq_xlsLAPCharlaMesModel(sequelize,Sequelize);

// LAP asistencia
const xlsLAPAsistenciaModel = orq_xlsLAPAsistenciaModel(sequelize,Sequelize);

// LAP Rotacion de personal
const xlsLAPRotaPersonalModel = orq_xlsLAPRotaPersonalModel(sequelize,Sequelize);

// LAP Accidentes Incidentes
const xlsLAPAccidentesInciModel = orq_xlsLAPAccidentesInciModel(sequelize,Sequelize);

// LAP Accidentes Incidentes
const xlsLAPDerrameCombustibleModel = orq_xlsLAPDerrameCombustibleModel(sequelize,Sequelize);

// LAP Mant barredora
const xlsLAPMantBarredoraModel = orq_xlsLAPMantBarredoraModel(sequelize,Sequelize);

// LAP Desempeño de personal
const xlsLAPDesempenioPersonalModel = orq_xlsLAPDesempenioPersonalModel(sequelize,Sequelize);

// LAP REPORTE
const reporteLapModel = orq_reporteLapModel(sequelize,Sequelize);

// BITACORA DETALLE
const bitacoraDetalleModel = orq_bitacoraDetalleModel(sequelize,Sequelize);

// PLANOS
const planosModel 	 = orq_planosModel(sequelize,Sequelize);
const planosDetModel = orq_planosDetModel(sequelize,Sequelize);

// Feedback reporte LAP
const feedbackLAPModel 	 = orq_feedbackLAPModel(sequelize,Sequelize);

// Lap Peso food
const LapPesoFodModel = orq_LapPesoFodModel(sequelize,Sequelize);

// Personal sancionado.
const LapPersonalSancionadoModel = orq_LapPersonalSancionadoModel(sequelize,Sequelize);

// Lap personal AID
const LapPersonalAIDModel = orq_LapPersonalAIDModel(sequelize,Sequelize);

// Lap trabajo on realizado
const LapTrabajoNoRealizadoModel = orq_LapTrabajoNoRealizadoModel(sequelize,Sequelize);

// Asignar tecnico a servicio
const asignarTecnicoModel = orq_asignarTecnicoModel(sequelize,Sequelize);

// Productos en el trabajo OT
const productoTrabajoOTModel = orq_productoTrabajoOTModel(sequelize,Sequelize);

// Ficha de ejecución de servicio de servicio OT
const fichaTecnicaTrabajoOTModel = orq_fichaTecnicaTrabajoOTModel(sequelize,Sequelize);

// Trabo no realizado detalle
const LapTrabajoNoRealizadoDetModel = orq_LapTrabajoNoRealizadoDetModel(sequelize,Sequelize);

// Tabla LAP
const lapTablaModel = orq_lapTablaModel(sequelize,Sequelize);
const lapBloque1Model = orq_lapBloque1Model(sequelize,Sequelize);

// Cronograma asignado a personal...
const cronogramaPersonalCabModel = orq_cronogramaPersonalCabModel(sequelize,Sequelize);
const cronogramaPersonalDetModel = orq_cronogramaPersonalDetModel(sequelize,Sequelize);

// Tabla Monitoreo
const monitoreoModel = orq_monitoreoModel(sequelize,Sequelize);

// Telegram
const telegramModel = orq_telegramModel(sequelize,Sequelize);
const telegramChatModel = orq_telegramChatModel(sequelize,Sequelize);

//nueva tabla activos 2022
const activos_2022Model = orq_activos_2022Model(sequelize,Sequelize);

//nueva tabla historial mantenimiento
const histoMantModal = orq_histoMantModal(sequelize,Sequelize);

//nueva tabla historial mantenimiento detalle
const histoMantDetModal = orq_histoMantDetModal(sequelize,Sequelize);





























/**
sequelize.sync({force : false })
	.then(()=>{
		console.log('tablas sincronizadas!.');
	});
/**/
// sequelize
module.exports = {
	sequelize,
	Film,
	User,
	OS,
	clienteModel,
	distritoModel,
	accesoModuloModel,
	paHeaderModel,
	paDetModel,
	cargoCertificadoModel,
	CertificadoModel,
	reqMaterialesModel,
	logLoginModel,
	areaModel,
	puestoIsoModel,
	otModel,
	personalOTModel,
	trabajoOTModel,
	archiGoogleModel,
	archivoConstSupModel,
	trabajoOTProdModel,
	productosModel,
	fichaInspeccionModel,
	distrito2Model,
	departamentoModel,
	provinciaModel,
	localFichaInpecModel,
	reqPersonalModel,
	resultadoEmoModel,
	almacenModel,
	empresasModel,
	sucursalModel,
	centroCostosModel,
	formServFichaInspModel,
	serviciosLocalFicInpecModel,
	frecuenciaModel,
	configEmpresa,
	permisoHorasModel,
	tipoDocumentoModel,
	plantillaModel,
	plantillaDetalleModel,
	fichaSintoModel,
	tipoPagoModel,
	fichaInspCertModel,
	fichaInspFactModel,
	pteFichaInspModel,
	fichaPersonalModel,
	aprobacionesModel,
	accidenteModel,
	medidasCorrectivasModel,
	responsableModel,
	capacitacionModel,
	capacitacionDetModel,
	sistemasModel,
	claseProdModel,
	subClaseProd01Model,
	subClaseProd02Model,
	subClaseProd03Model,
	tareoModel,
	tareoDet2Model,
	incidenciasModel,
	dineroModel,
	usuariosClienteModel,
	horarioModel,
	horarioDetModel,
	retenesModel,
	grupoClienteModel,
	votacionModel,
	inscripcionVotacionModel,
	osFrecuenciaModel,
	indicaModel,
	personalOSModel,
	personal_otModel,
	audioriaOSOTModel,
	productosOSModel,
	productosOTModel,
	articulosModel,
	requisicionCabModel,
	requisicionDetModel,
	autRequisicionModel,
	requisicionAlmacelDetModel,
	requisicionAlmacelCabModel,
	solicitudSSGGModel,
	auditoria2Model,
	tareoDetalle3Model,
	supervisionModel,
	authSuperModel,
	clienteExcluidoModel,
	reqMaterialDetalleModel,
	activosModel,
	utilidadesModel,
	constSuperModel,
	bancoModel,
	giroModel,
	envioBoletaCabModel,
	envioBoletaDetModel,
	soliReparacionMaqModel,
	pedidoCompraCabModal,
	pedidoCompraDetModal,
	lideresModel,
	asistenciaCabModel,
	asistenciaDetModel,
	turnoCabModel,
	tareoSubModel,
	envioContratosCabModel,
	envioContratosDetModel,
	adnSolServCabModel,
	adnSolServDetModel,
	codigosQRCabModel,
	codigosQRDetModel,
	docVentasCab,
	docVentasDet,
	planCuentaModel,
	catalogo7Model,
	seriesDocModel,
	proveedorModel,
	serviciosModel,
	subClase1Model,
	repoModel,
	SolCambioEstadoModel,
	SolCambioEstadoModelDet,
	resumenBoletasCabModel,
	resumenBoletasDetModel,
	resumenFacturasCabModel,
	resumenFacturasDetModel,
	docVentaCuotaModel,
	fichaInspecCabMode,
	reportesModel ,
	resumenNotasCabModel , 
	resumenNotasDetModel ,
	localesFI21Model,
	serviciosLocalFI2021,
	penalidadesLocalServFI21Modal,
	productoFI21Model,
	diagPlagasFI21Model,
	tanquepozoFI21Model,
	tanquePozoDatosFI21Model,
	manejoResiduosFI21Model,
	manejoResiduosDatosFI21Model,
	bitacoraSuperModel ,
	incidenciaComentarioModel,
	solServicioModel,
	apoyoDataModel,
	archivoCodigoQRModel,
	bitacoraBloqueModel,
	bitacoraAreaModel,
	bitacoraTrabajoModel,
	xlsLAPTrabajadoresCabModel,
	xlsLAPTrabajadoresDetModel,
	xlsLAPhallazgoCabModel,
	xlsLAPhallazgoDetModel,
	numRechazadosModel,
	xlsLAPIncidenciasCabModel,
	xlsLAPIncidenciasDetModel,
	xlsLAPMaquinariaCabModel,
	XLSLapMaquinariaDetModel,
	xlsLAPMantMaqPartesModel,
	xlsLAPMantMaqCabModel,
	xlsLAPMantMaqDetModel,
	xlsLAPReqMatDetModel,
	xlsLAPReqMatCabModel,
	LAPKitAntiderrameCabModel,
	LAPCarritoBarredorCabModel,
	LAPCarritoBarredorDetModel,
	cronogramaTrabajoCabModel,
	cronogramaTrabajoDetModel,
	cronogramaTrabajoInfoModel,
	cargaExcelModelCab,
	cargaExcelModelDet,
	fichaTecnicaModel, 
	fichaTecnica_perModel, 
	fichaTecnica_proModel,
	reqMaterialesCabModel,
	reqMaterialesDetModel,
	notificarUsuarioModel,
	xlsLAPApoyoCabModel,
	xlsLAPApoyoDeModel,
	utbClienteModel,
	ordenCompraModal ,
	xlsLAPCharlaMesModel,
	xlsLAPAsistenciaModel,
	xlsLAPRotaPersonalModel,
	xlsLAPAccidentesInciModel ,
	xlsLAPDerrameCombustibleModel ,
	xlsLAPMantBarredoraModel ,
	xlsLAPDesempenioPersonalModel ,
	reporteLapModel ,
	bitacoraDetalleModel ,
	planosModel ,
	planosDetModel ,
	feedbackLAPModel ,
	LapPesoFodModel , 
	LapPersonalSancionadoModel , 
	LapPersonalAIDModel , 
	LapTrabajoNoRealizadoModel , 
	asignarTecnicoModel , 
	productoTrabajoOTModel ,
	fichaTecnicaTrabajoOTModel , 
	LapTrabajoNoRealizadoDetModel , 
	lapTablaModel ,
	lapBloque1Model,
	monitoreoModel,
	lapBloque1Model,
	cronogramaPersonalCabModel ,
	cronogramaPersonalDetModel ,
	telegramModel ,
	telegramChatModel,
	activos_2022Model,
	histoMantModal,
	histoMantDetModal
}



// * //
