
const router = require('express').Router();

const middleware = require('./middleware');
const middlewareHeader = require('./middlewareHeader');

const apiFilsRouter = require('./api/films');
const apiUsersRouter = require('./api/users');
const api_os = require('./api/api_os');
const api_clientes = require('./api/api_clientes');
const api_sst = require('./api/api_sst');
// Backend
const api_backend = require('./api/api_backend');
// Buscador (combos select2)
const api_buscar = require('./api/api_buscar');

// Buscar combos select2 (con seguridad)
const api_buscar2 = require('./api/api_buscar2');


const api_certificados = require('./api/api_certificados');
// Requerimiento de materiales
const api_reqMaterial = require('./api/api_reqMaterial');
// Requerimiento de materiales
const api_logLogin = require('./api/api_logLogin');
// Puesto ISO
const api_puestoIso = require('./api/api_puestoIso');

// Serie Documento
const api_serieDoc = require('./api/api_serieDoc');

// OT
const api_ot = require('./api/api_ot');
// Areas
const api_area = require('./api/api_area');
// Trabajo OT
const api_trabajoOT = require('./api/api_trabajoOT');
// Trabajo OT
const api_usuario = require('./api/api_usuarios');
// App (trabajo)
const api_app = require('./api/api_app');
// Ficha de inspección
const api_fichaInspeccion = require('./api/api_fichaInspeccion');
// Ubigeo
const api_ubigeo = require('./api/api_ubigeo');
// Locales ficha de inpección
const api_localesFichaInpec = require('./api/api_localesFichaInspec');
// Requerimiento de personal
const api_reqPersonal = require('./api/api_reqPersonal');
// Resultado Emo
const api_resultadoEMO = require('./api/api_resultadoEmo');
// Detalle PA
const api_detallePA = require('./api/api_detallePA');
// ALmacen
const api_Almacen = require('./api/api_almacen');
// Empresa
const api_Empresa = require('./api/api_empresas');
// Sucursales
const api_Locales = require('./api/api_locales');
// Centro de costos
const api_cc = require('./api/api_cc');
// Formulario servicios ficha de inspeccion
const api_formServFichaInspeccion = require('./api/fichainspeccion/api_formServFichaInsp');
// Servicios Ficha de inspección
const api_serviciosLocalesFichaInspec = require('./api/fichainspeccion/api_serviciosLocal');
// Frecuencia
const api_frecuencia = require('./api/api_frecuencia');
// Acceso módulo
const api_acceso_modulo = require('./api/api_acceso_modulo');
// Config empresa
const api_configEmpresa = require('./api/api_configEmpresa');
// Permiso por horas
const api_permisoHoras = require('./api/api_permisoHoras');
// Tipo de documento
const api_tipoDocumento = require('./api/api_tipoDocumento');
// Plantilla
const api_plantilla = require('./api/api_plantilla');
// Detalle de plantilla
const api_plantillaDetalle = require('./api/api_plantillaDetalle');
// PTE
const api_pte = require('./api/fichainspeccion/api_pte');
// Ficha sintomalogica
const api_fichaSinto = require('./api/api_fichaSinto');
// Ficha inspeccion [CERTIFICADO]
const api_fichInspCertificado = require('./api/fichainspeccion/api_FicInspcertificado');
// Ficha inspeccion [FACTURA]
const api_fichInspFactura = require('./api/fichainspeccion/api_fichaInspFact');
// Archivos almacenados en google
const api_archivosGoogle = require('./api/api_archivosGoogle');
// Archivods
const api_files = require('./api/api_files');

// Aprobaciones
const api_aprobaciones = require('./api/api_aprobaciones');

// Accidentes
const api_accidentes = require('./api/api_accidentes');

// Capacitaciones
const api_capacitaciones = require('./api/api_capacitaciones');

// Ficha de personal
const api_ficha_personal = require('./api/api_ficha_personal');

// Sistemas servicios OS
const api_sistemas = require('./api/api_sistemas');

// Clase de producto
const api_claseProd = require('./api/api_claseProd');

// Sub clase producto 01
const api_subClaseProd01 = require('./api/api_subClaseProd01');

// Sub clase producto 02
const api_subClaseProd02 = require('./api/api_subClaseProd02');

// Sub clase producto 03
const api_subClaseProd03 = require('./api/api_subClaseProd03');

// Incidencias App - OLI
const api_incidencias = require('./api/api_incidencias');

// codigos_q
const api_codigosQR = require('./api/api_codigosQR');

// Operarios
const api_operarios = require('./api/api_operarios');

// Tareo
const api_tareo = require('./api/api_tareo');

// Tareo operarios
const api_tareo_operarios = require('./api/api_tareo_operarios');

// usuarios cliente
const api_usuariosCliente = require('./api/api_usuariosCliente');

// Horario
const api_horario = require('./api/api_horario');

// Retenes
const api_retenes = require('./api/api_retenes');

// App clientes
const api_app_clientes = require('./api/api_app_clientes');

// Grupo de clientes
const api_grupoClientes = require('./api/api_grupoClientes');

// Votaciones
const api_votaciones = require('./api/api_votaciones');

// Inscripciones votaciones
const api_inscripcion_votaciones = require('./api/api_inscripcion_votaciones');

// OS Frecuencia
const api_osFrecuencia = require('./api/api_osFrecuencia');

// OS Indica
const api_OSIndica = require('./api/api_OSIndica');

// Tipo de pago
const api_TipoPago = require('./api/api_TipoPago');

// Personal OS
const api_personalOS = require('./api/api_personalOS');

// Personal OT
const api_personalOT = require('./api/api_personalOT');

// Auditoria OS/OT
const api_auditoriaOSOT = require('./api/api_auditoriaOSOT');

// Productos OS
const api_productoOS = require('./api/api_productoOS');

// Productos OT
const api_productoOT = require('./api/api_productoOT');

// Articulos
const api_articulos = require('./api/api_articulos');

// Requisicion
const api_requisicion = require('./api/api_requisicion');

// Requisicion de almacen
const api_requisicionAlmacen = require('./api/api_requisicionAlmacen');

// Pedido de almacen
const api_pedidoAlmacen = require('./api/api_pedidoAlmacen');

// Vistas html de index...
const api_vistas = require('./api/api_vistas');

// Inicio/ fin supervicion
const api_supervision = require('./api/api_supervision');

// Auditoria de supervisión
const api_authSupervisor = require('./api/api_authSupervisor');


// Cargar archivos
const api_archivos = require('./api/api_archivos');
const api_files_2 = require('./api/api_files_2');
const api_files_Boletas = require('./api/api_files_Boletas');
const api_files_Contratos = require('./api/api_files_Contratos');
const api_files_imagenes = require('./api/api_files_imagenes');
const api_avatar = require('./api/api_avatar');
const api_files_fi21 = require('./api/api_files_fi21');

const api_file_capa = require('./api/api_file_capa');



// Activos
const api_activos = require('./api/api_activos');

// Utilidades
const api_utilidades = require('./api/api_utilidades');

const api_utilidades31 = require('./api/api_utilidades31');

// Giros
const api_giros = require('./api/api_giros');

// Envio de boletas
const api_EnvioBoletas = require('./api/api_EnvioBoletas');

// Solicitud reparacion equipos
const api_SolReparacionMaq = require('./api/api_SolReparacionMaq');

// Solicitud servicios
const api_Sol_servicio = require('./api/api_Sol_servicio');

// Pedido de compra
const api_pedidoCompra = require('./api/api_pedidoCompra');

// Whatsapp
const api_whatsapp = require('./api/api_whatsapp');

// Lideres equipo
const api_lider = require('./api/api_lider');

// Asistencias
const api_asistencias = require('./api/api_asistencias');

// Turno
const api_turnos = require('./api/api_turnos');

// Envio contratos
const api_EnvioContrato = require('./api/api_EnvioContrato');

// Cliente excluido
const api_clienteExcluido = require('./api/api_clienteExcluido');

// ADN Servicios Medicos
const api_adn_servMedico = require('./api/api_adn_servMedico');

// Plan de cuenta
const api_planCuenta = require('./api/api_planCuenta');

// Doc electrónico
const api_docVentasB = require('./api/api_docVentasB');
const api_docVentasF = require('./api/api_docVentasF');

// Catalogo 7
const api_catalogo7 = require('./api/api_catalogo7');

// Proveedores
const api_proveedores = require('./api/api_proveedores');

// Servicios
const api_servicios = require('./api/api_servicios');

//sub clase 1
const api_subclase1 = require('./api/api_subclase1');

// Error log (bd)
const api_errorLog = require('./api/api_errorLog');

// Repositorio
const api_repositorio = require('./api/api_repositorio');
const api_files_repositorio = require('./api/api_files_repositorio');

// Medidas_correctivas
const api_medidas_correctivas = require('./api/api_medidas_correctivas');

// responsable
const api_responsable = require('./api/api_responsable');

// Cambio de estado OS
const api_solcambioestado_doc = require('./api/api_solcambioestado_doc');

// Documentos de ventas (helper general)
const api_docVentas = require('./api/api_docVentas');

// Resumen de boletas
const api_resumenBoletas = require('./api/api_resumenBoletas');

// Requerimiento dinero
const api_reqDinero = require('./api/api_reqDinero');

// Banco
const api_banco = require('./api/api_banco');

// Resumen de facturas
const api_resumenFactura = require('./api/api_resumenFactura');

// Nota de Credito
const api_NotaCredito = require('./api/api_NotaCredito');

// Sucursales
const api_sucursales = require('./api/api_sucursales');

// Migración de facturas.
const api_migracion = require('./api/api_migracion');

// Reporte Ventas.
const api_ventas_reporte = require('./api/api_ventas_reporte');

// Ficha de inspección 2021
const api_fi2021 = require('./api/fi2021/api_fi2021');

// Reportes
const api_reportes = require('./api/api_reportes');

// Resumen nota de credito
const api_resumenNC = require('./api/api_resumenNC');

// Nota de debito
const api_NotaDebito = require('./api/api_NotaDebito');

// Resumen nota de debito
const api_resumenND = require('./api/api_resumenND');

// Ficha de inspección 2021
const api_localesFI21 = require('./api/fi2021/api_localesFI21');

// Penalidades ficha de inspeccion local servicios
const api_penalidadesFI = require('./api/fi2021/api_penalidadesFI');

// Productos en servicios de local
const api_productosF121 = require('./api/fi2021/api_productosF121');
// Diagnostico de plagas FI 21
const api_diagPlaga = require('./api/fi2021/api_diagPlaga');

// Constancia Supervision
const api_constancia_supervision = require('./api/api_constancia_supervision');

// Tanque pozo septico Ficha de inspecon 2021
const api_tanquePozo = require('./api/fi2021/api_tanquePozo');

// Tanque pozo datos Ficha de inspeccion 2021
const api_TanquePozoDatos = require('./api/fi2021/api_TanquePozoDatos');

// Cuotas doc de ventas
const api_couta = require('./api/api_couta');

// Manejo de residuos
const api_manejoResiduosFI21 = require('./api/fi2021/api_manejoResiduosFI21');

// Manejo de residuos - datos
const api_manejoResiduosDatos = require('./api/fi2021/api_manejoResiduosDatos');


// home
const api_home = require('./api/api_home');

// Bitacora supervisor
const api_bitacoraSuper = require('./api/api_bitacoraSuper');

// Apoyo data
const api_apoyoData = require('./api/api_apoyoData');

// LAP Carga de operarios xls
const api_lap_operarios = require('./api/api_lap_operarios');

const api_codigosQR_archivos = require('./api/api_codigosQR_archivos');


const api_datos_user = require('./api/api_datos_user');

// LAP carga xls Hallazgos
const api_lap_hallazgos = require('./api/api_lap_hallazgos');


// Números Rechazados whatssap
const api_numRechazados = require('./api/api_numRechazados');

/// LAP carga Incidencias
const api_lap_incidencias = require('./api/api_lap_incidencias');

/// LAP carga Maquinaria
const api_lap_maquinaria = require('./api/api_lap_maquinaria');

// LAP Mant Manquinaria
const api_lap_mant_maquinaria = require('./api/api_lap_mant_maquinaria');

// LAP Req. Materiales
const api_lap_req_material = require('./api/api_lap_req_material');

// LAP KIT ANTI DERRAME
const api_lap_kit_antiderrame = require('./api/api_lap_kit_antiderrame');

// Carrito barredor
const api_carrito_barredor = require('./api/api_carrito_barredor');

// OS 2022
const api_os22 = require('./api/api_os22');

// Maquinaria OS
const api_maquinariaOS = require('./api/api_maquinariaOS');

// Metodos de sistemas
const api_metodosSistema = require('./api/api_metodosSistema');

// Metodos sistemas en una OS
const api_sistemasMetodosOS = require('./api/api_sistemasMetodosOS');


const api_files_cod_qr = require('./api/api_files_cod_qr');

// LAP asistencia del personal
const api_lap_asistencia = require('./api/api_lap_asistencia');

// Cronograma de trabajo 2022
const api_cronogramaTrabajo = require('./api/api_cronogramaTrabajo');

// Cronograma de trabajo 2022
const api_actividadesCronograma = require('./api/api_actividadesCronograma');

// Excel cargado
const api_excel_data = require('./api/api_excel_data');

// ficha tecnica
const api_fichatecnica = require('./api/api_fichatecnica');

// Req. materiales
const api_reqMaterial22 = require('./api/api_reqMaterial22');

// Req. materiales det
const api_reqMaterialDet = require('./api/api_reqMaterialDet');

// Números Rechazados whatssap
const api_notificar_usuario = require('./api/api_notificar_usuario');

//# Notificar Usuario - archivo
const api_files_notificar_usuario = require('./api/api_files_notificar_usuario');

// Trabajos por actividades
const api_trabajoCronograma = require('./api/api_trabajoCronograma');

// CLientes versiṕon 2.0 (2022)
const api_clientes2022 = require('./api/api_clientes2022');

// Archivo app operarios
const api_files_app = require('./api/api_files_app');

// PDF manejo
const api_pdf = require('./api/api_pdf');
// Auditoria
const api_auditoria = require('./api/api_auditoria');

// LAP Apoyo
const api_lap_apoyo = require('./api/api_lap_apoyo');
const api_lap_apoyo_det = require('./api/api_lap_apoyo_det');

// Editor archivos 2022
const api_archivos2022 = require('./api/api_archivos2022');


// ordenCompra_proveedor
const api_ordenCompra_proveedor = require('./api/api_ordenCompra_proveedor');

// LAP Charla del Mes
const api_lap_charla_mes = require('./api/api_lap_charla_mes');

// LAP Rotacion de personal
const api_lap_rotacion_personal = require('./api/api_lap_rotacion_personal');

// LAP incidentes y accidentes
const api_lap_accidentes_incidentes = require('./api/api_lap_accidentes_incidentes');

// LAP derrame de combustible
const api_lap_derrame_cumbustible = require('./api/api_lap_derrame_cumbustible');

// LAP mantenimiento de barredora
const api_lap_mant_barredora = require('./api/api_lap_mant_barredora');

// LAP desempeño de personal
const api_lap_desempenio_personal = require('./api/api_lap_desempenio_personal');

// LAP Generar reporte
const api_lap_reporte = require('./api/api_lap_reporte');

// Bitacora detalle
const api_bitacora_detalle = require('./api/api_bitacora_detalle');

// Planos
const api_planos = require('./api/api_planos');

// Trampas en planos
const api_planos_trampas = require('./api/api_planos_trampas');

// FeedBack reporte LAP
const api_lap_feedback = require('./api/api_lap_feedback');

// alerta_ot
const api_alertaOT = require('./api/api_alertaOT');

// LAP peso fod
const api_lap_peso_fod = require('./api/api_lap_peso_fod');

// LAP Personal AID
const api_lap_personal_aid = require('./api/api_lap_personal_aid');

// LAP Personal sancionado
const api_lap_personal_sancionado = require('./api/api_lap_personal_sancionado');

// LAP trabajo no realizado
const api_lap_trabajo_no_realizado = require('./api/api_lap_trabajo_no_realizado');

// Asignar OT
const api_asignar_tecnico = require('./api/api_asignar_tecnico');

// Auth de usuario
const api_auth_usuario = require('./api/api_auth_usuario');

// App Tecnico
const api_app_tecnico = require('./api/api_app_tecnico');

// Productos OT
const api_productosOT22 = require('./api/api_productosOT22');

// Carga de imagenes
const api_files_img = require('./api/api_files_img');

// Ficha de ejecucion de servicio
const api_fichaEjecucionTrabajo = require('./api/api_fichaEjecucionTrabajo');

// Trabajo no realizado Det
const api_lap_trabajonotralizadoDet = require('./api/api_lap_trabajonotralizadoDet');

// Generar doc word lap
const api_lap_docs = require('./api/api_lap_docs');

// Google Drive v1
const api_google_drive02 = require('./api/api_google_drive02');

// Telegram
const api_telegram = require('./api/api_telegram');

// monitoreo
const api_monitoreo = require('./api/api_monitoreo');

// Personal a cronograma
const api_personal_cronograma = require('./api/api_personal_cronograma');

// Consulta notificaciones
const api_notificaciones = require('./api/api_notificaciones');

// maquinaria equipos
const api_maq_equipos = require('./api/api_maq_equipos');

// historial mantenimiento
const api_histo_mant = require('./api/api_histo_mant');




























// **********************************************************************
// **********************************************************************
// **********************************************************************




























// Auth de usuario
router.use( '/auth' , api_auth_usuario );

// Filmes
router.use('/films', middleware.checkToken, apiFilsRouter);

// Usuario
router.use('/users',apiUsersRouter);

// OS
router.use('/os',middleware.checkToken, api_os);

// Cliente (cuentas)
router.use( '/clientes' , middleware.checkToken , api_clientes );

// SST
router.use('/sst', middleware.checkToken,api_sst);

// Buscador de combos ( sin seguridad )
router.use('/buscar', api_buscar );

// Buscador de combos ( CON SEGURIDAD )
router.use('/src' , middlewareHeader.checkToken , api_buscar2 );

// Certificados
router.use('/certificado', middleware.checkToken , api_certificados );

// Requerimiento de materiales
router.use('/req_materiales', middleware.checkToken , api_reqMaterial );

// LogLogin
router.use('/log_login',  api_logLogin );

// Puesto iso API
router.use('/puesto_iso', middleware.checkToken , api_puestoIso );

// Serie Doc API
router.use('/serie_doc', middleware.checkToken , api_serieDoc );

// OT API
router.use('/ot', middleware.checkToken , api_ot );
// AREA API
router.use('/areas', middleware.checkToken , api_area );
// Trabajo OT API
router.use('/trabajo_ot', middleware.checkToken , api_trabajoOT );
// Usuario API
router.use('/usuario', middleware.checkToken , api_usuario );
// App API
router.use('/app', middleware.checkToken , api_app );
// Ficha de inspeccion
router.use('/ficha_inspeccion', middleware.checkToken , api_fichaInspeccion );
// Api Ubigeo
router.use('/ubigeo', middleware.checkToken , api_ubigeo );
// Locales ficha de inspección
router.use('/local_fichainspec', middleware.checkToken , api_localesFichaInpec );
// Requerimiento de personal
router.use('/req_personal', middleware.checkToken , api_reqPersonal );
// Resultado EMO
router.use('/resultado_emo', middleware.checkToken , api_resultadoEMO );
// Detalle de PA
router.use('/detalle_pa', middleware.checkToken , api_detallePA );
// Almacen
router.use('/almacen', middleware.checkToken , api_Almacen );
// Empresas
router.use('/empresas', middleware.checkToken , api_Empresa );
// Locales
router.use('/locales', middleware.checkToken , api_Locales );
// Centro de costos
router.use('/centro_costos', middleware.checkToken , api_cc );
// Formulario ficha de inspeccion
router.use('/serv_form_fichainspec', middleware.checkToken , api_formServFichaInspeccion );
// Servicios local ficha de inspección
router.use('/serv_local_fichainspec', middleware.checkToken , api_serviciosLocalesFichaInspec );
// Frecuencia entrega
router.use('/frecuencia', middleware.checkToken , api_frecuencia );
// Acceso modulo
router.use('/acceso_modulo', middleware.checkToken , api_acceso_modulo );
// Config empresa
router.use('/config', middleware.checkToken , api_configEmpresa );
// Permiso por horas
router.use('/permiso_x_horas', middleware.checkToken , api_permisoHoras );
// Tipo de documento
router.use('/tipo_doc', middleware.checkToken , api_tipoDocumento );
// Plantillas
router.use('/plantillas', middleware.checkToken , api_plantilla );
// Detalle de plantilla
router.use('/detalle_plantilla', middleware.checkToken , api_plantillaDetalle );
// PTE
router.use('/pte', middleware.checkToken , api_pte );
// Ficha sintomalogica
router.use('/fichasinto', middleware.checkToken , api_fichaSinto );
// Ficha inspeccion [CERTIFICADO]
router.use('/fichainsp_certificado', middleware.checkToken , api_fichInspCertificado );
// Ficha inspeccion [FACTURA]
router.use('/fichainsp_factura', middleware.checkToken , api_fichInspFactura );

// Archivos almacenados en Google
router.use('/archivos_gl', middleware.checkToken , api_archivosGoogle );

// Archivos
router.use('/files',api_files);

// Aprobaciones
router.use('/aprobaciones', middleware.checkToken , api_aprobaciones );

// Accidentes SST
router.use('/accidentes', middleware.checkToken , api_accidentes );

// Capacitaciones
router.use('/capacitaciones', middleware.checkToken , api_capacitaciones );

// Ficha de personal
router.use('/ficha_personal', middleware.checkToken , api_ficha_personal );

// Sistemas servicios OS
router.use('/sistemas_os', middleware.checkToken , api_sistemas );

// Clase de producto
router.use('/clase_producto', middleware.checkToken , api_claseProd );

// Sub clase de producto 01
router.use('/sub_clase_producto01', middleware.checkToken , api_subClaseProd01 );

// Sub clase producto 02
router.use('/sub_clase_producto02', middleware.checkToken , api_subClaseProd02 );

// Sub clase producto 03
router.use('/sub_clase_producto03', middleware.checkToken , api_subClaseProd03 );

// Backend... en silencio
router.use('/bknd', api_backend );

// Incidencias App - OLI
router.use('/app_incidencias', middleware.checkToken , api_incidencias );

// codigos_q
router.use('/codigos_qr', middleware.checkToken , api_codigosQR );

// Operarios
router.use('/operarios', middleware.checkToken , api_operarios );

// Tareo
router.use('/tareo', middleware.checkToken , api_tareo );

// usuarios asignados a clientes
router.use('/clientes_usuarios', middleware.checkToken , api_usuariosCliente );

// Horarios
router.use('/horarios', middleware.checkToken , api_horario );

// retenes
router.use('/retenes', middleware.checkToken , api_retenes );

// App clientes
router.use('/app_clientes', middleware.checkToken , api_app_clientes );

// Grupo de clientes
router.use('/grupo_clientes', middleware.checkToken , api_grupoClientes );

// Votaciones
router.use('/votaciones', middleware.checkToken , api_votaciones );

// Inscripciones votaciones
router.use('/inscripcion_votaciones', middleware.checkToken , api_inscripcion_votaciones );

// OS Frecuencia
router.use('/os_frecuencia', middleware.checkToken , api_osFrecuencia );

// OS Indicar
router.use('/os_indicar', middleware.checkToken , api_OSIndica );

// Tipo de pago
router.use('/tipo_pago', middleware.checkToken , api_TipoPago );

// Personal OS
router.use('/per_os', middleware.checkToken , api_personalOS );

// Personal OT
router.use('/per_ot', middleware.checkToken , api_personalOT );

// Auditoría OS/OT
router.use('/auth_os', middleware.checkToken , api_auditoriaOSOT );

// Productos OS
router.use('/prods_os', middleware.checkToken , api_productoOS );

// Productos OT
router.use('/prods_ot', middleware.checkToken , api_productoOT );

// Articulos
router.use('/articulos', middleware.checkToken , api_articulos );

// Requisicion
router.use('/requisicion', middleware.checkToken , api_requisicion );

// Requisicion de almacen
router.use('/requisicion_almacen', middleware.checkToken , api_requisicionAlmacen );

// Pedido de almacen
router.use('/pedido_almacen', middleware.checkToken , api_pedidoAlmacen );

// Vistas html de index... / TODOS CON token (node)  por parametro url
router.use('/vista', api_vistas );

// Tareo operarios
router.use('/tareo_operarios', middleware.checkToken , api_tareo_operarios );

// Inicio/ fin supervicion
router.use('/supervision', middleware.checkToken , api_supervision );

// Auditoria de supervisión
router.use('/auth_supervision', middleware.checkToken , api_authSupervisor );

// Cargar archivos
router.use('/archi', middleware.checkToken , api_archivos );
router.use('/files_2', api_files_2 );
router.use('/avatar', middlewareHeader.checkToken , api_avatar );


// Carga de boletas
router.use('/files_boletas', api_files_Boletas );

// Carga de contratos
router.use('/files_contratos', api_files_Contratos );

// Carga imágenes constancia de supervisión
router.use('/files_imagenes', api_files_imagenes );

// Archivos capacitacion
router.use('/files_capa', api_file_capa );

// Activos
router.use('/activo', middleware.checkToken , api_activos );

// Utilidades
router.use('/utilidades', middleware.checkToken , api_utilidades );

router.use('/utilidades31', middleware.checkToken , api_utilidades31 );

// Giro
router.use('/giro', middleware.checkToken , api_giros );

// Envio de boletas
router.use('/envio_boletas', middleware.checkToken , api_EnvioBoletas );

// Solicitud reparacion equipos
router.use('/sol_reparacion', middleware.checkToken , api_SolReparacionMaq );

// Solicitud servicios
router.use('/sol_servicio', middleware.checkToken , api_Sol_servicio );

// Pedido de compra
router.use('/pedido_compra', middleware.checkToken , api_pedidoCompra );

// Whatsapp
router.use('/whatsapp', middleware.checkToken , api_whatsapp );

// Lideres equipo
router.use('/lideres', middleware.checkToken , api_lider );

// Asistencias
router.use('/asistencia', middleware.checkToken , api_asistencias );
// Turno
router.use('/turno', middleware.checkToken , api_turnos );
// Envio contratos
router.use('/envio_contratos', middleware.checkToken , api_EnvioContrato );
// Cliente excluido
router.use('/cliente_excluido', middleware.checkToken , api_clienteExcluido );
// ADN Servicios Medicos
router.use('/emo', middleware.checkToken , api_adn_servMedico );
// Plan de cuenta
router.use('/plan_cuenta', middleware.checkToken , api_planCuenta );
// Doc electrónico
router.use('/doc_ventas/b', middleware.checkToken , api_docVentasB );
router.use('/doc_ventas/f', middleware.checkToken , api_docVentasF );
// Catalogo 7
router.use('/catalogo7', middleware.checkToken , api_catalogo7 );
// Proveedores
router.use('/proveedores', middleware.checkToken , api_proveedores );
// Servicios
router.use('/servicios', middleware.checkToken , api_servicios );
//sub clase 1
router.use('/subclase1', middleware.checkToken , api_subclase1 );
// Error log
router.use('/error_log', middleware.checkToken , api_errorLog );
// Repositorio
router.use('/repositorio', middleware.checkToken , api_repositorio );
router.use('/files_repositorio', api_files_repositorio );

// medidas_correctivas
router.use('/medidas_correctivas', middleware.checkToken , api_medidas_correctivas );

// responsable
router.use('/responsable', middleware.checkToken , api_responsable );

// Cambio de estado OS
router.use('/cambio_estado_doc', middleware.checkToken , api_solcambioestado_doc );

// Documentos de venas (helper general)
router.use('/doc_ventas', middleware.checkToken , api_docVentas );

// Resumen de boletas
router.use('/resumen_boleta_alta', middleware.checkToken , api_resumenBoletas );

// Requerimiento de dinero
router.use('/api_reqDinero', middleware.checkToken , api_reqDinero );

// Banco
router.use('/api_banco', middleware.checkToken , api_banco );

// Resumen de facturas baja
router.use('/resumen_baja_factura', middleware.checkToken , api_resumenFactura );

// Nota de Credito
router.use('/nota_credito', middleware.checkToken , api_NotaCredito );

// Sucursales
router.use('/sucursales', middleware.checkToken , api_sucursales );

// Migracion de facturas
router.use('/migracion', middleware.checkToken , api_migracion );

// Reporte ventas
router.use('/reporte', middleware.checkToken , api_ventas_reporte );

// Ficha de inspección 2021
router.use('/ficha_inspec2021', middleware.checkToken , api_fi2021 );

// Reportes
router.use('/reportes', middleware.checkToken , api_reportes );

// Resumen nota de credito
router.use('/resumen_nota_credito', middleware.checkToken , api_resumenNC );

// Nota de debito
router.use('/nota_debito', middleware.checkToken , api_NotaDebito );

// Resumen nota de debito
router.use('/resumen_nota_debito', middleware.checkToken , api_resumenND );

// Ficha de inspección 2021
router.use('/locales_fi21', middleware.checkToken , api_localesFI21 );

// Archivos ficha de inspección Local - Servicio
router.use('/file_fi21',  api_files_fi21 );

// Penalidades ficha de inspeccion local servicios
router.use('/penlidades_fi21', middleware.checkToken , api_penalidadesFI );

// Productos en servicios de local
router.use('/productos_fi21', middleware.checkToken , api_productosF121 );

// Diagnostico de plagas FI 21
router.use('/diag_plaga_fi21', middleware.checkToken , api_diagPlaga );

// Constancia Supervision
router.use('/constancia_supervision', middleware.checkToken , api_constancia_supervision );

// Tanque pozo septico Ficha de inspecon 2021
router.use('/tanque_pozo_fi21', middleware.checkToken , api_tanquePozo );

// Tanque pozo datos Ficha de inspeccion 2021
router.use('/tanque_pozo_datos_fi21', middleware.checkToken , api_TanquePozoDatos );

// Cuotas doc de ventas
router.use('/cuotas', middleware.checkToken , api_couta );

// Manejo de residuos
router.use('/manejo_residuos_fi21', middleware.checkToken , api_manejoResiduosFI21 );

// Manejo de residuos - datos
router.use('/manejo_residuos_datos_fi21', middleware.checkToken , api_manejoResiduosDatos );


// home
router.use('/home', middleware.checkToken , api_home );

// Bitacora supervisor
router.use('/bitacora_supervisor', middleware.checkToken , api_bitacoraSuper );

// Apoyo data
router.use('/apoyo_data', middleware.checkToken , api_apoyoData );

// LAP Carga de operarios xls
router.use('/lap_operarios', middleware.checkToken , api_lap_operarios );
// consulta código qr para ver archivos
router.use('/codigosQR_archivos', api_codigosQR_archivos );

// consulta código qr para ver archivos
router.use('/datos_user', api_datos_user );

// LAP carga xls Hallazgos
router.use('/lap_hallazgos', middleware.checkToken , api_lap_hallazgos );


// Números Rechazados whatssap
router.use('/numeros_rechazados', api_numRechazados );

/// LAP carga Incidencias
router.use('/lap_incidencias', middleware.checkToken , api_lap_incidencias );

// LAP carga Incidencias
router.use('/lap_maquinaria', middleware.checkToken , api_lap_maquinaria );

// LAP Mant Manquinaria
router.use('/lap_mant_maquinaria', middleware.checkToken , api_lap_mant_maquinaria );

// LAP Req. Materiales
router.use('/lap_req_material', middleware.checkToken , api_lap_req_material );

// LAP KIT ANTI DERRAME
router.use('/lap_kit_anti', middleware.checkToken , api_lap_kit_antiderrame );

// Carrito barredor
router.use('/lap_carrito_barredor', middleware.checkToken , api_carrito_barredor );

// OS 2022
router.use('/orden_servicio_22', middleware.checkToken , api_os22 );

// Maquinaria OS
router.use('/maquinaria_os', middleware.checkToken , api_maquinariaOS );

// Metodos de sistemas de OS (servicios)
router.use('/metodos_sistema', middleware.checkToken , api_metodosSistema );

// Metodos sistemas en una OS
router.use('/metodos_sistema_os', middleware.checkToken , api_sistemasMetodosOS );

//# QR
//router.use('/files_2', api_files_2 );
router.use('/files_cod_qr', api_files_cod_qr );

//# QR
//router.use( 'adjunto_codi_archivo' , 'adjuntoArchivoController@adjuntar_imagen_codigo_qr' );

// LAP asistencia del personal
router.use('/lap_asistencia_opers', middleware.checkToken , api_lap_asistencia );

// Cronograma de trabajo 2022
router.use('/cronogramaTrabajo', middleware.checkToken , api_cronogramaTrabajo );

// Cronograma de trabajo 2022
router.use('/actividades_cronograma', middleware.checkToken , api_actividadesCronograma );

// Excel cargado
router.use('/excel_carga', middleware.checkToken , api_excel_data );

// Ficha técnica
router.use('/fichatecnica', middleware.checkToken , api_fichatecnica );

// Req. materiales
router.use('/req_materiales2022', middleware.checkToken , api_reqMaterial22 );

// Req. materiales det
router.use('/req_materiales_det', middleware.checkToken , api_reqMaterialDet );

// Notificar usuario
router.use('/notificar_usuario', middleware.checkToken, api_notificar_usuario );

//# Notificar Usuario - archivo
router.use('/files_notificar_usuario', api_files_notificar_usuario );

// Trabajos por actividades
router.use('/trabajos_actividades', middleware.checkToken, api_trabajoCronograma );

// CLientes versiṕon 2.0 (2022)
router.use('/clientes_2', middleware.checkToken, api_clientes2022 );

// Archivo app operarios
router.use('/files_img_generico',  api_files_app );

// auditoria
router.use('/auditoria',  api_auditoria );

// PDF manejo
router.use('/pdf',  middleware.checkToken, api_pdf );

// LAP Apoyo
router.use('/lap_apoyo',  middleware.checkToken, api_lap_apoyo );
router.use('/lap_apoyodet',  middleware.checkToken, api_lap_apoyo_det );

// Editor archivos 2022
router.use('/archivos22',  middleware.checkToken, api_archivos2022 );

// ordenCompra_proveedor
router.use('/ordenCompra_proveedor', middleware.checkToken, api_ordenCompra_proveedor );

// LAP Charla del Mes
router.use('/lap_charla_mes',  middleware.checkToken, api_lap_charla_mes );

// LAP Rotacion de personal
router.use('/lap_rotacion_personal',  middleware.checkToken, api_lap_rotacion_personal );

// LAP incidentes y accidentes
router.use('/lap_accidentes_incidentes',  middleware.checkToken, api_lap_accidentes_incidentes );

// LAP derrame de combustible
router.use('/lap_derrame_combustible',  middleware.checkToken, api_lap_derrame_cumbustible );

// LAP mantenimiento de barredora
router.use('/lap_mant_barredora',  middleware.checkToken, api_lap_mant_barredora );

// LAP desempeño de personal
router.use( '/lap_desempenio_personal' ,  middleware.checkToken , api_lap_desempenio_personal );

// LAP Generar reporte
router.use( '/lap_reporte' ,  middleware.checkToken , api_lap_reporte );

// ordenCompra_proveedor
router.use('/ordenCompra_proveedor', api_ordenCompra_proveedor );

// Bitacora detalle
router.use( '/bitacora_detalle' ,  middleware.checkToken , api_bitacora_detalle );

// Planos
router.use( '/cliente_planos' ,  middleware.checkToken , api_planos );

// Trampas en planos
router.use( '/trampas_planos' ,  middleware.checkToken , api_planos_trampas );

// FeedBack reporte LAP
router.use( '/lap_feedback' ,  middleware.checkToken , api_lap_feedback );

// alertaOT
router.use( '/alerta_ot' ,  middleware.checkToken , api_alertaOT );

// LAP peso fod
router.use( '/lap_peso_fod' ,  middleware.checkToken , api_lap_peso_fod );

// LAP Personal AID
router.use( '/lap_personal_aid' ,  middleware.checkToken , api_lap_personal_aid );

// LAP Personal sancionado
router.use( '/lap_personal_sancionado' ,  middleware.checkToken , api_lap_personal_sancionado );

// LAP trabajo no realizado
router.use( '/lap_trabajo_no_doit' ,  middleware.checkToken , api_lap_trabajo_no_realizado );

// Asignar OT
router.use( '/asignar_tecnico' ,  middleware.checkToken , api_asignar_tecnico );

// App Tecnico
router.use( '/app_tecnico' ,  middleware.checkToken , api_app_tecnico );

// Productos OT
router.use( '/produtos_ot' ,  middleware.checkToken , api_productosOT22 );

// Carga de imagenes
router.use( '/imgs' ,  api_files_img );

// Ficha de ejecucion de servicio
router.use( '/ficha_ejecucion_trabajo' ,  middleware.checkToken , api_fichaEjecucionTrabajo );

// Trabajo no realizado Det
router.use( '/trabajo_no_realizado_det' ,  middleware.checkToken , api_lap_trabajonotralizadoDet );

// Generar doc word lap
router.use( '/lap_dosc' ,  api_lap_docs );

// Google Drive v1
router.use( '/google_drive1' ,  middleware.checkToken , api_google_drive02 );

// Telegram
router.use( '/telegram' ,  middleware.checkToken , api_telegram );

// monitoreo
router.use( '/monitoreo' ,  middleware.checkToken , api_monitoreo );

// Personal a cronograma
router.use( '/personal_cronograma' ,  middleware.checkToken , api_personal_cronograma );

// Ver notificaciones
router.use('/notificaciones' , api_notificaciones );

// maquinaria equipos
router.use( '/maquinaria_equipos' ,  middleware.checkToken , api_maq_equipos );

// Historial Mantenimiento
router.use( '/historial_mantenimiento' ,  middleware.checkToken , api_histo_mant );























// test
router.use('/hola',(req,res)=>{
	res.send( { '200' : 'File access right' } );
});


module.exports = router;



