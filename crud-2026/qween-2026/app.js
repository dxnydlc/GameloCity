/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
let urlCab = `${_URL_NESTMy}v1/flag/`;
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
var _AuthFormulario = 'ADMIN-PERMISOS-USUARIOS';
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
let idCab = 0, uuidCab = ``, xIdClienteProv = 0, xIdSucursal = 0;
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
let xIdArea = 0 , xIdPuesto = 0 ;
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
let dataEnviarPost = ``;
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
let dataJson = [];
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/**
 * CONFIGURACIÓN GLOBAL DEL CRUD
 */
const CONFIG = {
    apiUrl: `${_URL_NESTMy}v1/flag/` , 
    sessionToken: typeof _session3001 !== 'undefined' ? _session3001 : 'TU_TOKEN_AQUI',
    
    // Columnas de la tabla (Las 2 primeras son botones de acción)
    tableColumns: [
        { key: 'accion_editar', label: 'Editar', isAction: true, actionType: 'edit' },
        { key: 'accion_anular', label: 'Anular', isAction: true, actionType: 'delete' },
        { key: 'id', label: 'ID' },
        //{ key: 'uu_id', label: 'UUID' },
        { key: 'Codigo', label: 'Código' },
        { key: 'Descripcion', label: 'Descripción' },
        { key: 'Estado', label: 'Estado' }
    ],

    // Campos del formulario
    formFields: [
        { key: 'id', type: 'hidden' },
        { key: 'uu_id', type: 'hidden', label: 'UUID', readonly: true },
        { key: 'Codigo', type: 'text', label: 'Código', required: true },
        { key: 'Descripcion', type: 'text', label: 'Descripción', required: true },
        { key: 'Estado', type: 'text', label: 'Estado', readonly: true }
    ],

    // Valores por defecto al crear
    defaultValues: {
        id: 0,
        uu_id: '',
        Estado: 'Activo'
    },

    // Configuración de combos
    combos: []
};

// ============================================================================
// UTILIDADES
// ============================================================================

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function cleanPayload(data) {
    if (Array.isArray(data)) {
        return data.map(item => cleanObject(item));
    } else if (data && typeof data === 'object') {
        return cleanObject(data);
    }
    return data;
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function cleanObject(obj) {
    const newObj = {};
    for (let key in obj) {
        const cleanKey = key.trim();
        let val = obj[key];
        if (typeof val === 'string') val = val.trim();
        newObj[cleanKey] = val;
    }
    return newObj;
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function showLoading() {
    $('body').waitMe({ effect: 'bounce', text: 'Procesando...', bg: 'rgba(255,255,255,0.8)' });
}
function hideLoading() {
    $('body').waitMe('hide');
}

// ============================================================================
// FUNCIÓN CENTRALIZADA DE API (AJAX CON SWITCH CASE)
// ============================================================================

function apiCall( action , options = {} ) {
    return new Promise((resolve, reject) => {
        let url = CONFIG.apiUrl;
        let method = 'GET';
        let requestData = null;

        switch (action) {
            case 'getTodos':
                url             += 'get-todos';
                method          = 'GET';
                break;
            case 'getById':
                url             += `get-by-id/${options.id}`;
                method          = 'GET';
                break;
            case 'guardar':
                url             += 'guardar';
                method          = 'POST';
                requestData     = JSON.stringify(options.data);
                break;
            case 'actualizar':
                url             += `actualizar/${options.uu_id}`;
                method          = 'PATCH';
                requestData     = JSON.stringify(options.data);
                break;
            case 'anular':
                url             += `anular-by-id/${options.id}`;
                method          = 'DELETE';
                break;
            case 'getCombo':
                url             = options.url;
                method          = 'GET';
                break;
            default:
                reject(new Error(`Acción '${action}' no está configurada en apiCall.`));
                return;
        }

        const ajaxOptions = {
            url: url,
            type: method,
            headers: {
                'Authorization': `Bearer ${_session3001}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function(response) {
                if (response && response.data !== undefined) {
                    response.data = cleanPayload(response.data);
                }
                resolve(response);
            },
            error: function(xhr, status, error) {
                let errorMsg = 'Error desconocido en el servidor';
                if (xhr.responseJSON && xhr.responseJSON.msg && xhr.responseJSON.msg.texto) {
                    errorMsg = xhr.responseJSON.msg.texto;
                } else if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                } else if (xhr.responseText) {
                    errorMsg = xhr.responseText;
                } else {
                    errorMsg = error || xhr.statusText;
                }
                reject(new Error(errorMsg));
            }
        };

        if (requestData) {
            ajaxOptions.data = requestData;
        } else if (method === 'GET' && options.queryParams) {
            ajaxOptions.data = options.queryParams;
        }

        $.ajax(ajaxOptions);
    });
}

// ============================================================================
// LÓGICA DEL CRUD
// ============================================================================

async function cargarTabla() {
    showLoading();
    try {
        const response = await apiCall('getTodos');
        const data = Array.isArray(response.data) ? response.data : [];
        renderTabla(data);
    } catch (error) {
        console.error(error);
        toastr.error('Error al cargar los datos: ' + error.message, 'Error');
    } finally {
        hideLoading();
    }
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function renderTabla(data) {
    const thead = $('#tablaHead');
    const tbody = $('#tablaBody');
    thead.empty();
    tbody.empty();

    let headerRow = '<tr>';
    CONFIG.tableColumns.forEach(col => {
        headerRow += `<th>${col.label}</th>`;
    });
    headerRow += '</tr>';
    thead.append(headerRow);

    if (data.length === 0) {
        tbody.append(`<tr><td colspan="${CONFIG.tableColumns.length}" class="text-center">No hay registros</td></tr>`);
        return;
    }

    data.forEach(row => {
        let tr = '<tr>';
        CONFIG.tableColumns.forEach(col => {
            if (col.isAction) {
                if (col.actionType === 'edit') {
                    tr += `<td class="table-actions"><button class="btn btn-sm btn-info btn-edit" data-id="${row.id}"><span class="glyphicon glyphicon-pencil"></span> Editar</button></td>`;
                } else if (col.actionType === 'delete') {
                    tr += `<td class="table-actions"><button class="btn btn-sm btn-danger btn-anular" data-id="${row.id}"><span class="glyphicon glyphicon-trash"></span> Anular</button></td>`;
                }
            } else {
                tr += `<td>${row[col.key] !== null && row[col.key] !== undefined ? row[col.key] : ''}</td>`;
            }
        });
        tr += '</tr>';
        tbody.append(tr);
    });
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
async function abrirTab( id , existingData = null ) {
    const tabId = `tab-${id}`;
    const tabLinkId = `tab-link-${id}`;

    // Si el tab ya existe, solo darle foco
    if ($(`#${tabId}`).length > 0) {
        $(`#${tabLinkId} a`).tab('show');
        return;
    }

    let data = existingData;
    
    if (!data && id !== 0) {
        showLoading();
        try {
            const response = await apiCall('getById', { id: id });
            data = response.data;
        } catch (error) {
            hideLoading();
            toastr.error('Error al obtener el registro: ' + error.message, 'Error');
            return;
        }
        hideLoading();
    }

    if (id === 0) {
        data = { ...CONFIG.defaultValues, uu_id: generateUUID() };
    }

    const tituloTab = id === 0 ? 'Nuevo Registro' : `Editar ID: ${id}`;
    const tabLi = `
        <li role="presentation" id="${tabLinkId}">
            <a href="#${tabId}" aria-controls="${tabId}" role="tab" data-toggle="tab">
                ${tituloTab} <span class="btn-close-tab" data-tab="${tabId}" data-link="${tabLinkId}">&times;</span>
            </a>
        </li>
    `;
    $('#dynamic-tabs').append(tabLi);

    let formHtml = `
    <div class=" box box-primary " >
        <div class="box-header with-border">
            <h3 class="box-title">${tituloTab}</h3>
        </div>
        <!-- /.box-header -->
        <div class=" box-body " >
            <form id="form-${id}" class="form-horizontal">
                <div class=" row " style="margin-bottom:15px;" >
    `;
    
    CONFIG.formFields.forEach(field => {
        const value = data[field.key] !== undefined ? data[field.key] : '';
        const readonlyAttr = field.readonly ? 'readonly' : '';
        const requiredAttr = field.required ? 'required' : '';
        
        if (field.type === 'hidden') {
            formHtml += `<input type="hidden" name="${field.key}" id="${field.key}" value="${value}">`;
        } else {
            // Switch de los campos:
            formHtml += `
            
            `;
            switch ( field.key ) {
                case 'Codigo':
                    formHtml += `
                        <div class=" col-lg-3 col-md-3 " >
                            <div class="form-group">
                                <label class="col-sm-3 control-label">${field.label}</label>
                                <div class="col-sm-9">
                                    <input type="${field.type}" class="form-control" name="${field.key}" id="${field.key}"
                                        value="${value}" ${readonlyAttr} ${requiredAttr} ${field.step ? `step="${field.step}"` : ''}>
                                </div>
                            </div>
                        </div>
	                    <!-- ./col -->
                    `;
                break;
                // - //
                default:
                    formHtml += `
                        <div class=" col-lg-3 col-md-3 " >
                            <div class="form-group">
                                <label class="col-sm-3 control-label">${field.label}</label>
                                <div class="col-sm-9">
                                    <input type="${field.type}" class="form-control" name="${field.key}" id="${field.key}"
                                        value="${value}" ${readonlyAttr} ${requiredAttr} ${field.step ? `step="${field.step}"` : ''}>
                                </div>
                            </div>
                        </div>
	                    <!-- ./col -->
                    `;
                break;
            }
            
        }
    });

    // fin del .row
    formHtml += `
            </div>
    `;

    CONFIG.combos.forEach(combo => {
        formHtml += `
            <div class="form-group">
                <label class="col-sm-3 control-label">${combo.label}</label>
                <div class="col-sm-9">
                    <select class="form-control combo-load" name="${combo.fieldKey}" data-url="${combo.url}" data-value="${combo.valueKey}" data-text="${combo.textKey}" data-default="${combo.defaultValue}">
                        <option value="">Cargando...</option>
                    </select>
                </div>
            </div>
        `;
    });

    formHtml += `
        <hr/>
        <div class="form-group">
            <div class="col-sm-o1ffset-3 col-sm-9">
                <button type="submit" class="btn btn-success btn-guardar" data-id="${id}" data-uuid="" >
                    <span class="glyphicon glyphicon-floppy-disk"></span> Guardar
                </button>
                <button type="button" class="btn btn-default btn-cancelar-tab" data-tab="${tabId}" data-link="${tabLinkId}">
                    Cancelar
                </button>
            </div>
        </div>
    </form>`;

    formHtml += `
        </div>
        <!-- /.box-body -->
        <div class=" box-footer " >
        </div>
        <!-- /.box-footer -->
    </div>
    <!-- ./box -->
    `;

    const tabPane = `<div role="tabpanel" class="tab-pane" id="${tabId}">${formHtml}</div>`;
    $('#dynamic-tabs-content').append(tabPane);

    $(`#${tabLinkId} a`).tab('show');

    cargarCombosEnTab(tabId);
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
async function cargarCombosEnTab(tabId) {
    const tabContainer = $(`#${tabId}`);
    const selects = tabContainer.find('.combo-load');
    
    for (let select of selects) {
        const $select = $(select);
        const url = $select.data('url');
        const valueKey = $select.data('value');
        const textKey = $select.data('text');
        const defaultValue = $select.data('default');

        try {
            const response = await apiCall('getCombo', { url: url });
            const data = Array.isArray(response.data) ? response.data : [];
            
            let options = `<option value="${defaultValue}">-- Seleccione --</option>`;
            data.forEach(item => {
                options += `<option value="${item[valueKey]}">${item[textKey]}</option>`;
            });
            $select.html(options);
        } catch (error) {
            $select.html('<option value="">Error al cargar</option>');
            console.error('Error cargando combo:', error);
        }
    }
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
async function guardarRegistro( id , uuid , formData ) {
    showLoading();
    try {
        const action = id === 0 ? 'guardar' : 'actualizar';
        const response = await apiCall( action , { id: id , uu_id : uuid , data: formData } );
        
        const mensajeExito = (response.msg && response.msg.texto) ? response.msg.texto : 'Registro guardado exitosamente';
        toastr.success(mensajeExito, 'Éxito');
        
        const tabId = `tab-${id}`;
        const tabLinkId = `tab-link-${id}`;
        $(`#${tabId}`).remove();
        $(`#${tabLinkId}`).remove();

        // Volver al tab de listado
        $('#tab-link-listado a').tab('show');
        
        cargarTabla();
    } catch (error) {
        console.error(error);
        toastr.error('Error al guardar: ' + error.message, 'Error');
    } finally {
        hideLoading();
    }
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function anularRegistro(id) {
    $.confirm({
        title: 'Confirmar Anulación',
        content: `¿Está seguro que desea anular el registro con ID: <strong>${id}</strong>?`,
        icon: 'glyphicon glyphicon-warning-sign',
        theme: 'material',
        closeIcon: true,
        buttons: {
            confirmar: {
                text: 'Sí, Anular',
                btnClass: 'btn-danger',
                action: async function () {
                    showLoading();
                    try {
                        const response = await apiCall('anular', { id: id });
                        
                        const mensajeExito = (response.msg && response.msg.texto) ? response.msg.texto : 'Registro anulado correctamente';
                        toastr.success(mensajeExito, 'Éxito');
                        
                        cargarTabla();
                    } catch (error) {
                        console.error(error);
                        toastr.error('Error al anular: ' + error.message, 'Error');
                    } finally {
                        hideLoading();
                    }
                }
            },
            cancelar: {
                text: 'No, Cancelar',
                btnClass: 'btn-default'
            }
        }
    });
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
// ============================================================================
// EVENT LISTENERS
// ============================================================================

$(document).ready(function() {
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    toastr.options = {
        "closeButton"       : true,
        "progressBar"       : true,
        "positionClass"     : "toast-top-right",
        "timeOut"           : "4000",
        "showMethod"        : "fadeIn",
        "hideMethod"        : "fadeOut"
    };
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    // Cargar tabla inicial
    //cargarTabla();
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    // Botón Nuevo
    $('#btnNuevo').on('click', function() {
        abrirTab(0);
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    // Botón Recargar
    $('#btnRecargar').on('click', function() {
        cargarTabla();
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    // Delegación de eventos: Editar
    $('#tablaBody').on('click', '.btn-edit', function() {
        const id = $(this).data('id');
        abrirTab(id);
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    // Delegación de eventos: Anular
    $('#tablaBody').on('click', '.btn-anular', function() {
        const id = $(this).data('id');
        anularRegistro(id);
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    // PREVENIR que se pueda cerrar el tab fijo de listado
    $(document).on('click', '#tab-link-listado', function(e) {
        // Permitir el cambio de tab pero prevenir cualquier acción de cierre
        e.stopPropagation();
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    // Cerrar Tab dinámico (botón X)
    $(document).on('click', '.btn-close-tab', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const tabId = $(this).data('tab');
        const tabLinkId = $(this).data('link');
        $(`#${tabId}`).remove();
        $(`#${tabLinkId}`).remove();
        
        // Volver al tab de listado
        $('#tab-link-listado a').tab('show');
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    // Cancelar Tab dinámico
    $(document).on('click', '.btn-cancelar-tab', function(e) {
        e.preventDefault();
        const tabId = $(this).data('tab');
        const tabLinkId = $(this).data('link');
        $(`#${tabId}`).remove();
        $(`#${tabLinkId}`).remove();
        
        // Volver al tab de listado
        $('#tab-link-listado a').tab('show');
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    // Submit del formulario
    $(document).on('submit', 'form', function(e) {
        e.preventDefault();
        const form          = $(this);
        const id            = parseInt(form.find('.btn-guardar').data('id'));
        // Obtener el valor del input uu_id
        const uuIdValue     = form.find('input[name="uu_id"]').val();
        
        const formData = {};
        const arrayData = form.serializeArray();
        $.each(arrayData, function() {
            formData[this.name] = this.value;
        });

        form.find('.combo-load').each(function() {
            formData[$(this).attr('name')] = $(this).val();
        });

        guardarRegistro (id , uuIdValue , formData );
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    // SELECT 2 USUARIOS NEST
    let Supervisor = $('#frmDocumento #Supervisor').select2({
        ajax: {
            url : `${_URL_NESTMy}v1/publico/select2-reg-emple/` ,
            dataType : 'json',
            data : function (params) {
                var query = {
                    query : params.term,
                }
                return query;
            }
        },
        processResults: function (data) {
            return {
            results: data
            };
        },
        minimumInputLength : 3,width : '100%'
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    Supervisor.on("select2:select", function (e) { 
        let _Id = e.params.data.id, _Texto = e.params.data.text;
        console.log("select2:select", _Id );
        $('#frmDocumento #nombre_supervisor').val( _Texto );
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    // ARTICULOS SOFTCOM
    var $eventArticulos = $('#frmDocumento #IdArticulo').select2({
        ajax: {
            url: _URL_CONCAR+'/articulos/select2_articulos/',
            dataType: 'json',
            data: function (params) {
                var query = {
                    q : params.term,
                    "user_token" : _token_node
                }
                return query;
            }
        },
        processResults: function (data) {
            return {
                results: data
            };
        },
        minimumInputLength : 3,width : '100%'
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    $eventArticulos.on("select2:select", function (e) { 
        var IdArticulo = e.params.data.id , UnidadMedida = e.params.data.UnidadMedida,Precio = parseFloat( e.params.data.Precio) ,Articulo = e.params.data.text;
        $('#frmDetalle #Articulo').val(Articulo);
        $('#frmDetalle #UnidadMedida').val(UnidadMedida);
        $('#frmDetalle #CostoUnit').val(Precio);
        setTimeout(function(){ $('#frmDetalle #Cantidad').trigger('focus'); $('#frmDetalle #Cantidad').select(); }, 300 );
        /* if( Precio == 0 ){
            alert('ArtÃ­culo sin precio.');
            $('#mdlArticulos #btnAddProdi').hide();
        }else{
            $('#btnAddProdi').show();
        } */
        // Ya existe Â¿?
        //$('#btnAddProdi').show();
        /* $.each( _ItemsReq , function( key, rs ) {
            if( IdArticulo == rs.IdArticulo ){
                $('#frmDetalle #lblArticulo').html(`El artÃ­culo ya existe en la lista`);
                $('#frmDetalle #btnAddProdi').hide();
                return true;
            }else{
                console.log('NO Existe');
            }
        }); */
        //
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    // SELECT 2 CLIENTE NEST
    let IdClienteProv = $('#frmDocumento #IdClienteProv').select2({
        ajax: {
            url : `${_URL_NESTMy}v1/publico/clientes-select2/` ,
            dataType : 'json',
            data : function (params) {
                var query = {
                    q : params.term,
                }
                return query;
            }
        },
        processResults: function (data) {
            return {
            results: data
            };
        },
        minimumInputLength : 3,width : '100%'
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    IdClienteProv.on("select2:select", function (e) { 
        let _Id = e.params.data.id, _Texto = e.params.data.text;
        xIdClienteProv = _Id;
        $('#frmDocumento #Cliente').val( _Texto );
        ejecutarDoc( 'get-locales' );
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    let IdSucursal = $('#frmDocumento #IdSucursal').select2({
        width : '100%'
    });
    /* ------------------------------------------------------------- */
    IdSucursal.on("select2:select", function (e) { 
        let _Id = e.params.data.id, _Texto = e.params.data.text;
        console.log("select2:select", _Id );
        $('#frmDocumento #Sucursal').val( _Texto );
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    $("#QuitarSelect").on( "click", function(e) {
        e.preventDefault();
        $('#frmDocumento #IdClienteProv').html(``);
        $('#frmDocumento #IdClienteProv').trigger('change');

        $('#frmDocumento #IdSucursal').html(``);
        $('#frmDocumento #IdSucursal').trigger('change');
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    let IdArea = $('#frmDocumento #IdArea').select2({
        width : '100%'
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    IdArea.on("select2:select", function (e) { 
        let _Id = e.params.data.id, _Texto = e.params.data.text;
        xIdArea = _Id;
        $('#frmDocumento #Area').val( _Texto );
        ejecutarDoc( 'get-puestos' );
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    let IdPuesto = $('#frmDocumento #IdPuesto').select2({
        width : '100%'
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    IdPuesto.on("select2:select", function (e) { 
        let _Id = e.params.data.id, _Texto = e.params.data.text;
        $('#frmDocumento #Puesto').val( _Texto );
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    $("#ddddd").on( "click", function(e) {
        e.preventDefault();
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    $("#ddddd").on( "click", function(e) {
        e.preventDefault();
    });
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
});
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function initOrq(){
    cargarTabla();
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */