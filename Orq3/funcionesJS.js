
// ==============================================================================

// ******* NODE JS *******
socket.emit('accion:todos',{
	user:$nomU,
	msg:'Aprobar Req.Mat. #'+$('#frmDocumento #IdRequerimientoCab').val(),
	dni:$dniU
});
// ******* NODE JS *******

// ==============================================================================

// ******* NODE JS *******
socket.emit('accion:audit',{
	user  : $nomU,
	msg   : 'Aprobar Req.Mat. #'+$('#frmDocumento #IdRequerimientoCab').val(),
	dni   : $dniU,
	serie : 0,
	corr  : 0,
	form  : _AuthFormulario,
	url   : window.location.href,
	token : ''
});
// ******* NODE JS *******

// ESCUCHAR RESPUESTA
socket.on('emitir_doc_ventas', function( data ){
    $('#mdlEmitir').modal('hide');
    if( data.data.dni == $dniU ){
      // Leer el XML
      if( data != undefined ){
        leerXML();
      }
    }
});

// ==============================================================================

// Abril URL
let _file = json.file;
let _url = `${_URL_NODE3}api/imgs/descargar_home/${_file}/Req.Dinero.xlsx`;
location.href = _url;

// ==============================================================================

function initOrq()
{
    //
    getAll( `${_urlCab}paginar?page=${_pagina}&limit=${_limite}` );
    //
}

// ==============================================================================

// AVANZAR PAGINADOR
/* ------------------------------------------------------------- */
$(document).delegate('.paginador_x', 'click', function(event) {
    event.preventDefault();
    let _url = $(this).attr('href');
    if( _url ){
        getAll( _url );
    }
});
/* ------------------------------------------------------------- */

// ==============================================================================

function guardarDoc()
{
	//
	try {
		$('#wrapper_form').waitMe({
			effect  : 'facebook',
			text    : 'Espere...',
			bg      : 'rgba(255,255,255,0.7)',
			color   : '#146436',fontSize:'20px',textPos : 'vertical',
			onClose : function() {}
		});
        var url = `${_urlServicio}`, metodo = `POST`;
        // - //
        var _dataSerializada = $('#frmDocumento').serialize();
        var Id = parseInt( $('#frmDocumento #id').val() ),uu_id = $('#frmDocumento #uu_id').val()
        if( Id > 0 ){
            url = `${_urlServicio}${uu_id}`;
            metodo = `PUT`;
        }
		$.ajax({
			url     : url,
            data    : _dataSerializada , 
			method  : metodo,
			dataType: "json",
			headers : {
				Authorization : `Bearer ${_session3001}`
			}
		})
		.done(function(  json ,textStatus, xhr ) {
			//
            console.log(xhr.status);
			switch ( xhr.status )
            {
                case 200:
                    //
                    let data = json.data;
                    $('#frmDocumento #id').val( data.id );
                    $('#frmDocumento #uu_id').val( data.uu_id );
                    //
                break;
                case 202:
                    // denegado...
                    tostada( json.title , json.texto , json.clase );
                break;
                default:
                break;
            }
			/**/
		})
		.fail(function(xhr, status, error) {
            getError01(xhr, status, error);
			$('#wrapper_form').waitMe('hide');
		})
		.always(function() {
			$('#wrapper_form').waitMe('hide');
		});
	} catch (error) {
		alert( error );
		$('#wrapper_form').waitMe('hide');
	}
	//
}
// ==============================================================================
function cargarDoc()
{
	//
	try {
		$('#wrapper_form').waitMe({
			effect  : 'facebook',
			text    : 'Espere...',
			bg      : 'rgba(255,255,255,0.7)',
			color   : '#146436',fontSize:'20px',textPos : 'vertical',
			onClose : function() {}
		});
        var url = `${_urlServicio}`, metodo = `POST`;
        // - //
        var _dataSerializada = $('#frmDocumento').serialize();
        //
		$.ajax({
			url     : url,
            data    : _dataSerializada , 
			method  : metodo,
			dataType: "json",
			headers : {
				Authorization : `Bearer ${_session3001}`
			}
		})
		.done(function(  json ,textStatus, xhr ) {
			//
			switch ( xhr.status )
            {
                case 200:
                    //
                    let data = json.data;
                    $.each( json.data , function( key , value ){
                        $('#frmDocumento #'+key).val(value);
                    });
                    //
                break;
                case 202:
                    // denegado...
                    tostada( json.title , json.texto , json.clase );
                break;
                default:
                break;
            }
			/**/
		})
		.fail(function(xhr, status, error) {
            getError01(xhr, status, error);
			$('#wrapper_form').waitMe('hide');
		})
		.always(function() {
			$('#wrapper_form').waitMe('hide');
		});
	} catch (error) {
		alert( error );
		$('#wrapper_form').waitMe('hide');
	}
	//
}
// ==============================================================================
function getError01(xhr, status, error) 
{
    //
    let responseJSON = xhr.responseJSON;
    let message = responseJSON.message;
    switch (xhr.status) {
        case 400://varios mensajes
            if( Array.isArray( message ) ){
                for (let index = 0; index < message.length; index++) {
                    const item = message[index];
                    tostada2( { titulo : 'Error' , 'texto' : item , clase : 'error' } );
                }
            }else{
                tostada2( { titulo : 'Error' , 'texto' : message , clase : 'error' } );
            }
        break;
        case 409:
            tostada2( { titulo : 'Error' , 'texto' : `${message}` , clase : 'error' } );
        break;
        default:
            tostada2( { titulo : 'Error' , 'texto' : `${xhr.status}-${error}` , clase : 'error' } );
        break;
    }
}

// ==============================================================================

// LLENAR UN FORMULARIO
let data = json.data;
$.each( json.data , function( key , value ){
    $('#frmDetalle #'+key).val(value);
});

// ==============================================================================

function getAll()
{
	//
	try {
		$('#wrapper_form').waitMe({
			effect  : 'facebook',
			text    : 'Espere...',
			bg      : 'rgba(255,255,255,0.7)',
			color   : '#146436',fontSize:'20px',textPos : 'vertical',
			onClose : function() {}
		});
		$.ajax({
			url     : url,
			method  : "GET",
			dataType: "json",
			headers : {
				Authorization : `Bearer ${_session3001}`
			}
		})
		.done(function(  json ,textStatus, xhr ) {
			//
            console.log(xhr.status);
			switch ( xhr.status )
            {
                case 200:
                    //
                break;
                case 202:
                    // denegado...
                    tostada( json.title , json.texto , json.clase );
                break;
                default:
                break;
            }
			/**/
		})
		.fail(function(xhr, status, error) {
            getError01(xhr, status, error);
			$('#wrapper_form').waitMe('hide');
		})
		.always(function() {
			$('#wrapper_form').waitMe('hide');
		});
	} catch (error) {
		alert( error );
		$('#wrapper_form').waitMe('hide');
	}
	//
}
// ==============================================================================
// #########    DATE RANGE PICKER #########
/**
<link rel="stylesheet" href="{{ asset('plugins/daterangepicker-master/daterangepicker.css') }}">
<script src="{{ asset('plugins/daterangepicker-master/daterangepicker.js') }}"></script>
<div class="form-group">
    <label for="rngFechas" >Rango de fechas</label> 
    <input type="text" id="datefilter" name="datefilter" class=" form-control input-lg " value="" maxlength="150" />
</div>
<!-- ./form-group -->
*/

/* ------------------------------------------------------------- */
var _arrayDiasSemana = ['Do','Lu','Ma','Mi','Ju','Vi','Sa'], _FechaInic_DRP = '', _FechaFin_DRP = '';
/* ------------------------------------------------------------- */
var _arrayMeses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
/* ------------------------------------------------------------- */
$('input[name="datefilter"]').daterangepicker({
    autoUpdateInput: false,
    ranges: {
        'Hoy': [moment(), moment()],
        'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Hace 7 dias': [moment().subtract(6, 'days'), moment()],
        'Hace 30 dias': [moment().subtract(29, 'days'), moment()],
        'Este mes': [moment().startOf('month'), moment().endOf('month')],
        'Mes anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    "locale": {
        "format": "DD/MM/YYYY",
        "separator": " - ",
        "applyLabel": "Aplicar",
        "cancelLabel": "Cancela",
        "fromLabel": "desde",
        "toLabel": "hasta",
        "customRangeLabel": "Definir",
        "weekLabel": "W",
        "daysOfWeek": [
            "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"
        ],
        "monthNames": [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ],
        "firstDay": 1
    },
}, function(start, end, label) {
    var _Token = $('#frmDocumento #uu_id').val();
    //
    _FechaInic_DRP = start.format('YYYY-MM-DD');
    _FechaFin_DRP  = end.format('YYYY-MM-DD');
});
/* ------------------------------------------------------------- */
$('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});
/* ------------------------------------------------------------- */
$('input[name="datefilter"]').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
});
/* ------------------------------------------------------------- */


// #########    ./DATE RANGE PICKER #########

// ==============================================================================
/* ------------------------------------------------------------- */
// Cargar datos formulario
$.each( json.data , function( key , value ){
    $('#frmDocumento #'+key).val(value);
});
/* ------------------------------------------------------------- */
var favorite = [];
$.each($("input[name='sport']:checked"), function(){
	favorite.push($(this).val());
});
alert("My favourite sports are: " + favorite.join(", "));
/* ------------------------------------------------------------- */
// salto de linea a ,
var arrCerts = NroCertificados.split("\n");
var arrSeries = arrCerts.join(',');
/* ------------------------------------------------------------- */
// Seleccionar todo el texto on focus
$("input[type='text']").click(function () {
    $(this).select();
});
$("input[type='text']").on("click", function () {
    $(this).select();
});
/* ------------------------------------------------------------- */
$('#ddddd').click(function (e) { 
	e.preventDefault();
});
/* ------------------------------------------------------------- */
$("#ddddd").on( "click", function(e) {
	e.preventDefault();
});
/* ------------------------------------------------------------- */
setTimeout(function(){ alert("Hello"); }, 3000);
/* ------------------------------------------------------------- */
$("input[type='button']").click(function(){
	var radioValue = $("input[name='gender']:checked").val();
	if(radioValue){
		alert("Your are a - " + radioValue);
	}
});
/* ------------------------------------------------------------- */
// url: _URL_NODE3+'/api/src/usuarios_select2/',
// select2_productos
// cc_select2
// giros_select2
// clientes2_select2
let _IdAutorizado = $('#frmDocumento #IdAutorizado').select2({
    ajax: {
        url : `${_URL_NODE3}/api/src/usuarios_select2/` ,
        dataType : 'json',
        data : function (params) {
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
_IdAutorizado.on("select2:select", function (e) { 
    let _Id = e.params.data.id, _Texto = e.params.data.text;
    console.log("select2:select", _Id );
	$('#frmDocumento #ClaseServicio').val( _Texto );
});
/* ------------------------------------------------------------- */
var num = 5.56789;
var n = num.toFixed(2);
/* ------------------------------------------------------------- */
$(document).delegate('.delData', 'click', function(event) {
	event.preventDefault();
	var $id = $(this).data('id'), $uuid = $(this).data('uuid'), $nombre = $(this).data('nombre');
});
/* ------------------------------------------------------------- */
$.confirm({
	title: 'Confirmar',
	type    : 'orange',
	content: 'Confirme eliminar documento',
	autoClose: 'Cancelar|10000',
	buttons: {
		Confirmar: {
			keys: [ 'enter','Y' ],
			text : 'Confirmar (Y)',
			btnClass: 'btn-blue',
			action : function () {
				delDocumento( $uuid );
			},
		},
		Cancelar: {
			keys: [ 'N' ],
			action : function () {
				//
			}
		},
	}
});
/* ------------------------------------------------------------- */
$.confirm({
	title   : 'Correcto',
	content : 'Se cambió el estado de las OS<br>Pulse <b>Y</b> para continuar',
	autoClose: 'Ok|30000',
	type    : 'blue',
	typeAnimated: true,
	buttons: {
		Ok: {
			text : 'OK (Y)',
			keys: ['Y'],
			action: function () {
				//
			}
		},
	}
});
/* ------------------------------------------------------------- */
$.dialog({
	title   : 'Correcto',
	content : 'Se quitó al personal de la lista.',
});
/* ------------------------------------------------------------- */
$.confirm({
	title   : 'Error',
	content : 'Para aprobar el documento primero debe guardarlo.............................',
	type    : 'red',
	buttons : {
		heyThere: {
		  text: 'OK (Y)', // text for button
		  btnClass: 'btn-blue', // class for the button
		  keys: ['enter', 'y'], // keyboard event for button
		  isHidden: false, // initially not hidden
		  isDisabled: false, // initially not disabled
		  action: function(heyThereButton){
			  // longhand method to define a button
			  // provides more features
		  }
		},
	}
});
/* ------------------------------------------------------------- */
$('#mdlArticulos').on('shown.bs.modal', function (e) {
	// Pre seleccionar un combo select2
	$("#frmDetalle #IdArticulo").select2('open');
	$(".select2-search__field")[0].focus();
});
/* ------------------------------------------------------------- */
function getLocales( IdClienteProv )
{
	//
	try {
		$('#Contenedor').waitMe({
			effect  : 'facebook',
			text    : 'Espere...',
			bg      : 'rgba(255,255,255,0.7)',
			color   : '#146436',fontSize:'20px',textPos : 'vertical',
			onClose : function() {}
		});
		var _dataSerie = $('#frmDocumento').serialize();
		$.ajax({
			url     : `${_URL_NODE3}/api/locales/listado/${IdClienteProv}`,
			method  : "POST",
			data    : _dataSerie ,
			dataType: "json",
			headers : {
				"api-token"  : _TokenUser,
				"user-token" : _token_node
			}
		})
		.done(function(  json ) {
			/**/
			switch (json.codigo) {
                case 200:
                    // negocio...
                    if( json.data )
                    {
                        let _html = '<option value="" >Todos</option>';
                        $.each( json.data , function( key, value ) {
                            _html += `<option value="${value.IdSucursal}" >${value.IdSucursal}-${value.Descripcion}</option>` ; 
                            });
                        $('#cboLocal').html( _html );
                        $('#cboLocal').trigger('change');
                    }
                break;
                case 202:
                    // denegado...
                    tostada( json.title , json.texto , json.clase );
                break;
                default:
                break;
            }
			/**/
		})
		.fail(function(xhr, status, error) {
			// capturaError( xhr );
			get_Error( xhr );
			$('#Contenedor').waitMe('hide');
		})
		.always(function() {
			$('#Contenedor').waitMe('hide');
		});
	} catch (error) {
		alert( error );
		$('#Contenedor').waitMe('hide');
	}
	//
} 
// ==============================================================================
/*

<link rel="stylesheet" href="https://cdn.datatables.net/select/1.7.0/css/select.dataTables.min.css" />
<link rel="stylesheet" href="https://unpkg.com/datatables-contextual-actions@latest/dist/dataTables.contextualActions.min.css"/>


<script src="https://cdn.datatables.net/buttons/1.5.2/js/dataTables.buttons.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js" ></script>
<script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.html5.min.js" ></script>
<script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.print.min.js" ></script>
<script src="https://cdn.datatables.net/select/1.7.0/js/dataTables.select.min.js" ></script>
<script src="https://unpkg.com/datatables-contextual-actions@latest/dist/dataTables.contextualActions.min.js"></script>
<!-- Bootbox -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/5.4.0/bootbox.min.js"></script>


<table id="TablaHomePs" class=" table table-striped table-no-bordered table-hover " style="width:100%" >
    <thead>
        <tr>
            <th></th>
            <th></th>
            <th>Local</th>
            <th>IdArticulo</th>
            <th>Articulo</th>
            <th>Cantidad</th>
            <th>U.Medida</th>
            <th>Costo</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>
*/
var TablaHomePs;
let optsLangDatatable = {
    sProcessing : "Procesando...",
    sLengthMenu : "Mostrar _MENU_ registros",
    sZeroRecords: "No se encontraron resultados",
    sEmptyTable : "Ningún dato disponible en esta tabla",
    sInfo       : "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    sInfoEmpty  : "Mostrando registros del 0 al 0 de un total de 0 registros",
    sInfoFiltered   : "(filtrado de un total de _MAX_ registros)",
    sInfoPostFix    : "",
    sSearch         : "Buscar:",
    sUrl            : "",
    sInfoThousands  : ",",
    sLoadingRecords : "Cargando...",
    oPaginate: {
        sFirst: "|<",
        sLast: ">|",
        sNext: ">",
        sPrevious: "<",
    },
    oAria: {
        sSortAscending: ": Activar para ordenar la columna de manera ascendente",
        sSortDescending: ": Activar para ordenar la columna de manera descendente",
    }
};

TablaHomePs = $('#TablaHomePs').DataTable({
    pagingType : "full_numbers",
    lengthMenu : [
        [ 100 , 200, 100 ],
        [ 100 , 200, 100 ],
    ],
    buttons: [
        {
            extend: 'collection',
            exportOptions: {
            modifier: {
            page: 'all',
            search: 'none'   
            }
            },
            text: 'Exportar',
            buttons: [
            'copy','excel','csv','pdf', 'print'
            ]
        }
    ],
    "searching" : true,
    "order"     : [[ 2, "desc" ]],
    "scrollX"   : true,
    language : optsLangDatatable,
    dom: "<'row'<'col-sm-3'l><'col-sm-3'f><'col-sm-6'p>>" +
    "<'row'<'col-sm-12'tr>>" +
    "<'row'<'col-sm-5'i><'col-sm-7'p>>",
    "initComplete": function(settings, json) {
        $('#tblDatos').waitMe('hide');
    },
    createdRow : function (row, data, rowIndex) {
        // Per-cell function to do whatever needed with cells
        $.each($('td', row), function (colIndex) {
            // For example, adding data-* attributes to the cell
            /* varDump( data );
            varDump( data[colIndex] ); */
            $(this).attr('data-id', data.id );
            $(this).attr('data-uuid', data.uu_id );
        });
        $(row).attr('data-id', data.id );
        $(row).attr('data-uuid', data.uu_id );
        $(row).attr('data-nombre', data.Articulo );

        // Cliente VARIOS (4)
        if( data.IdClienteProv == 0 ){
            $('td' ,row ).eq(4).html( data.ClienteVarios );
        }else{
            $('td' ,row ).eq(4).html( data.Cliente );
        }
        
        if( data.EstadoBlzk == 'SIGNED' ){
            $('td' ,row ).eq(7).html(`<span class="label label-success">${data.EstadoBlzk}</span>`);
        }else{
            $('td' ,row ).eq(7).html(`<span class="label label-danger">${data.EstadoBlzk}</span>`);
        }

        switch ( data.Estado ) {
            case 'Digitado':
                $('td' ,row ).eq(6).html(`<span class="label label-primary">${data.Estado}</span>`);
            break;
            case 'Aprobado':
                $('td' ,row ).eq(6).html(`<span class="label label-success">${data.Estado}</span>`);
            break;
            case 'Anulado':
                $('td' ,row ).eq(6).html(`<span class="label label-danger">${data.Estado}</span>`);
            break;
            case 'Emitido':
                $('td' ,row ).eq(6).html(`<span class="label label-success">${data.Estado}</span>`);
            break;
        }

        // Fecha Mod 12
        $('td' ,row ).eq( 12 ).html( moment( data.updated_at ).format('DD/MM/YYYY HH:mm') );

        
    },
    columns : [
        { "data" : null ,
            render: (data,type,row) => {
            return `<a href='#' data-uuid="${data.uu_id}" data-id="${data.id}" data-idarti="${data.IdArticulo}" class=" editarItem btn btn-primary btn-sm" ><i class="fa fa-edit" ></i></a>`;
            }
        },
        { "data" : null ,
            render: (data,type,row) => {
            return `<a href='#' data-uuid="${data.uu_id}" data-id="${data.id}" data-idarti="${data.IdArticulo}" class=" anularItem btn btn-danger btn-sm" ><i class="fa fa-trash" ></i></a>`;
            }
        },
        { "data" : "Local" } , 
        { "data" : "IdArticulo" } , 
        { "data" : "Articulo" } , 
        { "data" : "Cantidad" } , 
        { "data" : "UMedida" } , 
        { "data" : "CostoUnit" } , 
        { "data" : "Total" } , 
    ],
    select: {
        style: 'single'
    },
    columnDefs: [
        // Para agregar contador, donde el 2 es el Nro de la columna a sobre escribir
        {
            searchable  : false,
            orderable   : false,
            targets     : 2
        }
    ],
});
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
TablaHomePs.on('order.dt search.dt', function () {
    let i = 1;
    // Para agregar contador, donde el 2 es el Nro de la columna a sobre escribir
    TablaHomePs
        .cells(null, 2 , { search: 'applied', order: 'applied' })
        .every(function (cell) {
            this.data(i++);
        });
})
.draw();
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
var buttonsPS = new $.fn.dataTable.Buttons( TablaHomePs , {
    buttons: [
    'copyHtml5',
    'excelHtml5',
    'csvHtml5',
    'pdfHtml5'
    ]
}).container().appendTo( $('#botonesPS') );
//TablaHomePs.columns.adjust().draw();
/* ------------------------------------------------------------- */
TablaHomePs.clear();
TablaHomePs.rows.add( json.data ).draw();
TablaHomePs.columns.adjust().draw();
// ==============================================================================
TablaDetalleGE.on('click', 'tbody tr', function (e) {
    //e.currentTarget.classList.toggle('success');
});
// ==============================================================================
TablaDetalleGE.on( 'select', function ( e, dt, type, indexes ) {
    TablaDetalleGE[ type ]( indexes ).nodes().to$().addClass( 'success' );
    if ( type === 'row' ) {
        var data = TablaDetalleGE.rows( indexes ).data().pluck( 'id' );
        var node = dt.rows( indexes ).nodes()[0];
        var bid =  $(node).attr("bankid","gaaaa");
        let id      = $(node).data('id');
        let uuid    = $(node).data('uuid');
        let nombre  = $(node).data('nombre');
        $('#msgDetalle').html(`<div class="alert alert-success" role="alert">Seleccionado: <strong>${nombre}</strong></div>`);
    }
});
// ==============================================================================
TablaDetalleGE.on( 'deselect', function ( e, dt, type, indexes ) {
    TablaDetalleGE[ type ]( indexes ).nodes().to$().removeClass( 'success' );
    $('#msgDetalle').html('');
});
// ==============================================================================
// PARA EDITORES CON CLICK DERECHO
// Then set up some action options https://github.com/torrobinson/datatables-contextual-actions
var actionOptions = {
    iconPrefix: 'fa',
    classes: [],
    contextMenu: {
        enabled: true,
        isMulti: true,
        xoffset: -10,
        yoffset: -10,
        headerRenderer: function (rows) {
            if (rows.length > 1) {
                // For when we have contextMenu.isMulti enabled and have more than 1 row selected
                return rows.length + ' people selected';
            } else {
                let row = rows[0];
                if (row?.role !== '')
                    return row.Articulo + ' (' + row.IdArticulo + ')';
                else return row.Articulo;
            }
        },
        headerIsFollowedByDivider: true,
        showStaticOptions: false
    },
    // Using bootbox? Customize how you confirm an action
    showConfirmationMethod: bootbox.confirm,
    buttonList: {
        enabled: true,
        iconOnly: false,
        containerSelector: '#my-button-container',
        groupClass: 'btn-group',
        disabledOpacity: 0.4,
        dividerSpacing: 10,
    },
    deselectAfterAction: true,
    items: [
        // Empty starter seperator to demonstrate that it won't render
        {
            type: 'divider',
        },

        {
            type: 'static',
            title: 'Static Button',
            iconClass: 'fa-lock',
            buttonClasses: ['btn', 'btn-outline-primary'],
            contextMenuClasses: ['text-primary'],
            action: function () {
                bootbox.alert(
                    "I am a static button that doesn't care about what row is selected. I'm always clickable!"
                );
            },
        },

        // Demonstrate not rendering 3 back to back dividers, only 1
        {
            type: 'divider',
        },

        {
            type: 'option',
            multi: false,
            title: 'Editar',
            iconClass: 'fa-edit',
            buttonClasses: ['btn', 'btn-outline-secondary'],
            contextMenuClasses: ['text-secondary'],
            action: function (row) {
                bootbox.alert(
                    'Edit here for ' + row[0].Articulo
                );
            },
            isDisabled: function (row) {
                // Si comienza con A, s desabilita.
                //return row.Articulo.charAt(0) === 'A'; // 'A' name's can't edit, for example
            },
        },

        {
            type: 'divider',
        },

        {
            type: 'option',
            title: 'Eliminar',
            multi: true,
            multiTitle: 'Eliminar articulo',
            iconClass: 'fa-trash',
            buttonClasses: ['btn', 'btn-outline-danger'],
            contextMenuClasses: ['text-danger'],
            confirmation: function (rows) {
                var message =
                    rows.length > 1
                        ? 'Are you sure you want to delete ' +
                            rows.length +
                            ' employees?'
                        : 'Confirme eliminar:' +
                            rows[0].Articulo +
                            '?';
                return {
                    title:
                        rows.length > 1
                            ? 'Delete Employees'
                            : 'Elimnar articulo',
                    message: message,
                    buttons: {
                        cancel: {
                            className: 'btn-link',
                            label: 'Cancelar',
                        },
                        confirm: {
                            className: 'btn-danger',
                            label: '<i class="fa fa-trash"></i> Confirmar',
                        },
                    },
                };
            },
            action: function (rows) {
                // Change source data and redraw
                alert('tu no mete cabra zarambiche' + rows[0].Articulo);
                /* window.sampleData = window.sampleData.filter(
                    (data) =>
                        !rows
                            .map((row) => row.Articulo)
                            .includes(data.Articulo)
                );
                myTable
                    .clear()
                    .rows.add(window.sampleData)
                    .draw(); */
            },
        },

        {
            type: 'divider',
        },
    ],
};
/* ------------------------------------------------------------- */
// And initialize our plugin.
TablaDetalleGE.contextualActions( actionOptions );
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// contar array
var fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.length;
// ==============================================================================
// texto combo seleccionado 
var $texto = $( "#frmDocumento #id_ambiente option:selected" ).text();

var $id = $(this).data('id'),$uuid = $(this).data('uuid');

// setTimeout
setTimeout(function(){ alert("Hello"); }, 3000);
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
let camposCol = [
    { col : 'Editar' , data : ''  },
    { col : 'Nro' , data : 'Serie-Correlativo'  },
    { col : 'Fec.Creado' , data : 'FechaCreacion'  },
    { col : 'Fec. Tras.' , data : 'FechaTraslado'  },
    { col : 'Destinatario' , data : 'Cliente'  },
    { col : 'Local' , data : 'Sucursal'  },
    { col : 'TipoGuia' , data : 'TipoGuia'  },
    { col : 'Motivo' , data : 'MotivoTras'  },
    { col : 'T.doc' , data : 'Adj_Tipo'  },
    { col : 'Nro.doc' , data : 'Adj_Nro'  },
    { col : 'Estado' , data : 'Estado'  },
    { col : 'PesoNeto' , data : 'PesoNeto'  },
    { col : 'Um' , data : 'unidadMedidaPesoBruto'  },
    { col : 'Usuario' , data : 'UsuarioMod'  }, 
];
readJson_table_cab( json.items , 'TablaHome' , camposCol );
// LEER LA DATA Y CREAR LA TABLITA - CAB
function readJson_table_cab( json , target , _camposTbl )
{
    //
    let _htmlTabla = ``, _tableName = `tbl_${target}`;

    _htmlTabla += `<table class=" table table-hover cell-border compact hover nowrap row-border table-striped table-hover " id="${_tableName}" cellspacing="0" width="100%" style="width:100%">`;

    if( json.length > 0 )
    {
        //
        _htmlTabla += `<thead>`;
        _htmlTabla += `<tr>`;
        // Dibujamos primero el head...
        for (let index = 0; index < _camposTbl.length; index++) {
            const rs = _camposTbl[index];
            _htmlTabla += `<th>${rs.col}</th>`;
        }
        _htmlTabla += `</tr>`;
        _htmlTabla += `</thead>`;

        // Ahora a dibujar el body...
        _htmlTabla += `<tbody>`;
        for (let index = 0; index < json.length; index++) {
            //
            const _rsData = json[index];
            let btnEditar = `<a href="#!" data-id="${_rsData.id}" data-uuid="${_rsData.uu_id}" class=" ${target}_editarDoc btn btn-primary btn-sm " ><i class=" fa fa-edit " ></i></a>`;
            let btnAnular = `<a href="#!" data-id="${_rsData.id}" data-uuid="${_rsData.uu_id}" class=" ${target}_anularDoc btn btn-danger btn-sm " ><i class=" fa fa-trash " ></i></a>`;
            _htmlTabla += `<tr>`;
            for (let indexC = 0; indexC < _camposTbl.length; indexC++) {
                const col = _camposTbl[indexC];
                switch (col.col) {
                    case 'Editar':
                        _htmlTabla += `<td>${btnEditar}</td>`;
                    break;
                    case 'Anular':
                        _htmlTabla += `<td>${btnAnular}</td>`;
                    break;
                    case 'Nro':
                        _htmlTabla += `<td>${_rsData.Serie}-${_rsData.Correlativo}</td>`;
                    break;
                    default:
                        $.each( _rsData , function( key, rs ){
                            if( col.data == key ){
                                _htmlTabla += `<td>${rs}</td>`;
                            }
                        });
                    break;
                }
            }
            _htmlTabla += `</tr>`;
            //
        }
        _htmlTabla += `</tbody>`;
        // 
    }else{
        _htmlTabla += `<thead>`;
        _htmlTabla += `<tr>`;
        _htmlTabla += `<th></th><th></th><th>No hay datos disponibles...</th>`;
        _htmlTabla += `</tr>`;
        _htmlTabla += `</thead>`;
        _htmlTabla += `<tbody></tbody>`;
    }
    _htmlTabla += `</table>`;
    //
    $('#'+target).html( _htmlTabla );
    //
}
// ==============================================================================



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
//
(function($){
	$(document).ready(function()
    {
        /* ------------------------------------------------------------- */
        $('#btnCrear').click(function (e) { 
            e.preventDefault();
            $('#frmDocumento #lblTitulo').html(`Nuevo archivo operarios`);
            $('a[href="#tabDoc"]').tab('show');
            $('#frmDocumento input[type="text"]').each(function(e){
                $(this).val('');
            });
            $('#frmDocumento input[type="hidden"]').each(function(e){
                $(this).val('');
            });
            $('#frmDocumento input[type="number"]').each(function(e){
                $(this).val('0');
            });
            $('#frmDocumento textarea').each(function(e){
              $(this).val('');
            });
            $('#frmDocumento #Codigo').val(0);
            $('#frmDocumento #id').val(0);
            renovarToken( '#frmDocumento #uu_id' );
            //tblDetalle.columns.adjust().draw();
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.cerrarFrame','click',function(e){
            e.preventDefault();
            $('a[href="#tabHome"]').tab('show');
            table.columns.adjust().draw();
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.docEdit', 'click', function(event) {
            event.preventDefault();
            var _id = $(this).data('id'), _uuid = $(this).data('uuid'), _nombre = $(this).data('nombre');
            //
            $('a[href="#tabDoc"]').tab('show');
            //
            var uuid = $(this).data('uuid'),id = $(this).data('id');
            $('#frmDocumento input[type="text"]').each(function(e){
                $(this).val('');
            });
            $('#frmDocumento input[type="hidden"]').each(function(e){
                $(this).val('');
            });
            $('#frmDocumento input[type="number"]').each(function(e){
                $(this).val('0');
            });
            //
            cargarDoc( _uuid );
        });
        /* ------------------------------------------------------------- */
        $("#btnGuardarR").on( "click", function(e) {
            e.preventDefault();
            guardar_Data();
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
    });

})(jQuery);
/* ------------------------------------------------------------- */
function initOrq(){
    //
}
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


// <script type="text/javascript"></script>




function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };




  
