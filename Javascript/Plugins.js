

// ******* NODE JS *******
socket.emit('accion:todos',{
	user:$nomU,
	msg:'Aprobar Req.Mat. #'+$('#frmDocumento #IdRequerimientoCab').val(),
	dni:$dniU
});
// ******* NODE JS *******


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

/*
<!-- SweetAlert -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>
<!-- SweetAlert -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.min.js"></script>

<style type="text/css">
    .swal2-popup {
      font-size: 1.4rem !important;
    }
    #NroOTs_tagsinput{
        width:100%!important;
    }
</style>

/**/
function call_ajax()
{
	//
	try {
		$('#wrapperTable').waitMe({
			effect  : 'facebook',
			text    : 'Espere...',
			bg      : 'rgba(255,255,255,0.7)',
			color   : '#146436',fontSize:'20px',textPos : 'vertical',
			onClose : function() {}
		});
		var _dataSerie = $('#frmDocumento').serialize();
		$.ajax({
			url     : `${_URL_NODE3}/api/`,
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
                    tostada2( json.resp );
                    getAll();
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
			capturaError( xhr );
			// get_Error( xhr );
			$('#wrapperTable').waitMe('hide');
		})
		.always(function() {
			$('#wrapperTable').waitMe('hide');
		});
	} catch (error) {
		alert( error );
		$('#wrapperTable').waitMe('hide');
	}
	//
}
/**/

// gv-5mq435yjxoyjyb.dv.googlehosted.com. r7e73oz4xnwv



// Perdir confirmacion con Sweet Alert
swal({
	title	: "TITULO***AQUI",
	text 	: "DESCRIPCION**AQUI",
	icon 	: "warning",
	buttons : true,
	dangerMode: true,
    buttons: ["Cerrar", "Ejecutar"],
})
.then((willDelete) => {

	if (willDelete) {

		//

	}

});

// Prompt para esperar
swal("Write something here:", {
  content: "input",
})
.then((value) => {
  swal(`You typed: ${value}`);
});

// confirmar ante un evento
swal({
  text: 'Search for a movie. e.g. "La La Land".',
  content: "input",
  button: {
    text: "Search!",
    closeModal: false,
  },
})
.then( name => {
  if (!name) throw null;
 
  return fetch(`https://itunes.apple.com/search?term=${name}&entity=movie`);
});


var _data = { 
	'_token'  : $('meta[name="csrf-token"]').attr('content') , 
	'idLista' : _arrDetalle[ _currentExtorno ].id 
};
$('#frmDocumento').waitMe({
	effect  : 'facebook',
	text    : 'Espere...',
	bg      : 'rgba(255,255,255,0.7)',
	color   : '#146436',fontSize:'20px',textPos : 'vertical',
	onClose : function() {}
});
$.post( _URL_HOME + 'ejec_extkdx_lista', _data , function(data, textStatus, xhr) {
	/*optional stuff to do after success */
}, 'json')
.fail(function(xhr, status, error) {
	Swal.fire({
		icon: 'error',
		title: 'Oops...',
		text: error,
    });
})
.done( function( json ) {
	switch(json.estado)
	{
		case 'ERROR':
			var $texto = '', $arError = [];
			$.each( json.errores , function( key, value ) {
			  $arError.push( value );
			});
			$texto = $arError.join(', ');
			Swal.fire({
			  icon: 'error',
			  title: 'Revise lo siguiente...',
			  text: `${$texto}`
			});
		break;
		case 'OK':
			// negocio...
			var $jsonData = populateCC( json );
			table.clear();
			table.rows.add($jsonData).draw();
		break;
	}
	$('#frmDocumento').waitMe('hide');
})
.always(function() {
	$('#frmDocumento').waitMe('hide');
});



$('#mdlParticipantes .modal-content')

// AJAX NODE
$('#wrapperTable').waitMe({
	effect  : 'facebook',
	text    : 'Espere...',
	bg      : 'rgba(255,255,255,0.7)',
	color   : '#146436',fontSize:'20px',textPos : 'vertical',
	onClose : function() {}
});
$.ajax({
	url     : `${_URL_NODE3}/api/`,
	method  : "POST",
	data    : { 'IdReq' : 0 },
	dataType: "json",
	headers : {
		"api-token" : _TokenUser,
		"user-token" : _token_node
	}
})
.done(function(  json ) {
	switch(json.estado)
	{
		case 'ERROR':
			Swal.fire(json.error);
		break;
		case 'OK':
			// negocio...
			var $jsonData = populateCC( json );
			table.clear();
			table.rows.add($jsonData).draw();
		break;
	}
})
.fail(function(xhr, status, error) {
	// capturaError( xhr );
	if( xhr.status == 422 )
	{
		// 422 es decir un error de validacion de datos...
		var $errores = xhr.responseJSON, $texto = '', $arError = [];
		$.each( $errores.errores , function( key, value ) {
			$arError.push( value.msg );
		});
		$texto = $arError.join(', ');
		Swal.fire({
			icon: 'error',
			title: 'Revise lo siguiente...',
			text: `${$texto}`
		});
	}else{
		alert('Error al ejecutar');
	}
	$('#wrapperTable').waitMe('hide');
})
.always(function() {
	$('#wrapperTable').waitMe('hide');
});

// scotiabank SCI-R-2020150735
// ***************************************************************************
// ***************************************************************************
// ***************************************************************************
// <script src="https://momentjs.com/downloads/moment.min.js"></script>

function populateCC( json )
{
	//
	var $data = [], $CSGO = 1;
	if( json.data != undefined ){
		$.each( json.data , function( key, rs ) {
			var $o = [];
			$o.push($CSGO);
			$o.push(rs.local);
			//
			var $fecha = moment( rs.fecha_asignado ).format('DD/MM/YYYY h:mm a');
            $o.push($fecha);
			//
			$data.push( $o );
			$CSGO++;
		});
	}
	//
	return $data;
}

// ***************************************************************************

var $eventUser = $('#cboTecnico').select2({
	ajax: {
		url: function () {
		return $urlSelect2;
		},
		dataType: 'json'
		// Additional AJAX parameters go here; see the end of this chapter for the full code of this example
	},
	processResults: function (data) {
		return {
		results: data
		};
	},
	minimumInputLength : 3,width : '100%'
});








// AJAX-API
$('body').waitMe({
	effect  : 'facebook',
	text    : 'Espere...',
	bg      : 'rgba(255,255,255,0.7)',
	color   : '#146436',fontSize:'20px',textPos : 'vertical',
	onClose : function() {}
});
$.ajax({
	url     : _URL_API + 'get/data/reqmat',
	method  : "POST",
	data    : { 'IdReq' : 0 },
	dataType: "json",
	headers : {
	    "api-token" : _TokenUser
	}
})
.done(function(  json ) {
	if( json.estado == 'ERROR' )
	{
		var $error = json.errores;
		makeErrores( $error );
	}else{
		if( json.estado == 'OK' ){
			// Aprobar
		}else{
			escuchaRespuesta( json );
		}
	}
})
.fail(function() {
    FalloJS();
})
.always(function() {
    $('body').waitMe('hide');
});



// ALERT SW
swal("Hello world!");

// OK
swal("Good job!", "You clicked the button!", "success");
// ERROR
swal("Good job!", "You clicked the button!", "error");
// correcto con promises
 swal( "Correcto!" , "Click on either the button or outside the modal." , "success" )
    .then((value) => {
      document.location.href = _URL_HOME + 'sol_analisis/' + json.data.id + 'edit';
    });

// Loading
$('#wrapperTable').loading({
	message: 'Generando...'
});

$('#wrapperTable').loading('stop');

// Solo numeros
// <script src="{{ asset('plugins/jQuery-Mask-Plugin-master/dist/jquery.mask.js') }}" ></script>
$('#txt_cantidad').mask("##0", {reverse: true});

/*
// datetimepicker
<!-- bootstrap datetimepicker -->
<link rel="stylesheet" href="{{ asset('plugins/bootstrap-datetimepicker-master/build/css/bootstrap-datetimepicker.css') }}">

<!-- bootstrap datetimepicker -->
<script src="{{ asset('plugins/bootstrap-datetimepicker-master/build/js/bootstrap-datetimepicker.min.js') }}"></script>

//Date picker
$('#fecha_estimada').datetimepicker({
	format : 'DD/MM/YYYY h:mm A'
});

 */

// Datepicke - ingles default
$('#datepicker').datepicker({
    language: "es",
    autoclose: true
});

// Autocompletar buscar productos
$("#buscador_d3d5e").tokenInput( _servicio , {
	theme             : "facebook",
	prePopulate       : _prepopulated,
	hintText          : "Buscar producto",
	noResultsText     : "No hay documento",
	searchingText     : "Buscando Ficha...",
	minChars          : 2,
	tokenLimit        : 6,
	propertyToSearch: "name",
	resultsFormatter: function(item){ return "<li>" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + item.name + " Ficha: " + item.id + "</div></div></li>" },
	tokenFormatter: function(item) { return "<li><p>" + item.name + " Id: " + item.id + "</p></li>" },
	onAdd: function (item) {

        $('#wrapperTable').loading({
			message: 'Cargando...'
		});

        $('#filtro').val('ids');
		buscarDocs();

	},
	onDelete: function (item) {

        $('#filtro').val('todo');
        buscarDocs();

	}
});

/**
<!-- DATE RANGE -->
<link rel="stylesheet" href="{{ asset('plugins/daterangepicker-master/daterangepicker.css') }}">

<!-- DATE RANGE -->
<script src="{{ asset('plugins/daterangepicker-master/moment.min.js') }}"></script>
<script src="{{ asset('plugins/daterangepicker-master/daterangepicker.js') }}"></script>

/**/
// Colocar rango de fechas
var start 	 = moment().subtract( 5 , 'days');
var end 	 = moment();
var _minDate = moment().subtract( 6 , 'months');

function cb(start, end) {
    $('#reportrange span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
}

cb(start, end);

/* ------------------------------------------------------------------------------------------------------ */

$('input[name="daterange"]').daterangepicker(
	{
		"locale": {
	        "format": "DD/MM/YYYY",
	        "separator": " - ",
	        "applyLabel": "Apply",
	        "cancelLabel": "Cancel",
	        "fromLabel": "Desde",
	        "toLabel": "Hasta",
	        "weekLabel": "W",
	        "daysOfWeek": [
	        	"Dom",
	            "Lun",
	            "Mar",
	            "Mie",
	            "Jue",
	            "Vie",
	            "Sab"
	            
	        ],
	        "monthNames": [
	            "Enero",
	            "Febrero",
	            "Marzo",
	            "Abril",
	            "Mayo",
	            "Junio",
	            "Julio",
	            "Agosto",
	            "Septiembre",
	            "Octubre",
	            "Noviembre",
	            "Diciembre"
	        ],
	        "firstDay": 1
	    },
		startDate 	: start,
    	endDate 	: end,
    	maxDate : '{{ FECHA_LAT }}',
	}, function(start, end, label) {
		console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
		$('#fecIn').val( start.format('YYYY-MM-DD') );
		$('#fecFi').val( end.format('YYYY-MM-DD') );
		// Llamamos al servicio...
		//buscarDocs();
		// minDate 	: _minDate,

	}
);






/*
 Nuevo datepicker

<link rel="stylesheet" href="{{ asset('plugins/datepicker-master/dist/datepicker.css') }}">
.datepicker{
    z-index: 1100 !important;
}
.dropdown-menu
{
    opacity: 1 !important;
    box-shadow: none;
    visibility: visible;
}
.daterangepicker.dropdown-menu
{
    z-index: 99 !important;
}
.daterangepicker
{
    display: none;
}
.datepicker-container
{
	z-index: 9999 !important;
}


<script src="{{ asset('plugins/datepicker-master/dist/datepicker.js') }}"></script>
<script src="{{ asset('plugins/datepicker-master/datepicker.es-ES.js') }}"></script>
 */

$('#FechaSint').datepicker({
    language: 'es-ES',
    autoHide: true,
    autoPick : true,
    format : 'dd/mm/yyyy'
});


// Select2
// <link href="{{ asset('plugins/select2/dist/css/select2.css') }}" rel="stylesheet"/>
// <script src="{{ asset('plugins/select2/dist/js/select2.full.js') }}" ></script>
// 
// <link href="{{ asset('plugins/select2-4.0.6-rc.1/dist/css/select2.css') }}" rel="stylesheet"/>
// <script src="{{ asset('plugins/select2-4.0.6-rc.1/dist/js/select2.full.js') }}"></script>
// 
// $('.combillo').select2();
/*
var $eventUser = $('.select-corr').select2({
	ajax: {
		url: _URL_API + 'src/clientes/get',
		dataType: 'json'
		// Additional AJAX parameters go here; see the end of this chapter for the full code of this example
	},
	processResults: function (data) {
	    return {
	      results: data
	    };
  	},
  	minimumInputLength : 3,width : '100%'
});
//call back on select
$eventUser.on("select2:select", function (e) { 
	var _idUser = e.params.data.id;
	console.log("select2:select", _idUser );
});
/**/

// Buscar producto
/* ------------------------------------------------------------- */
var $eventUser = $('#cboProducto').select2({
ajax: {
  url: _URL_HOME + 'src_producto',
  dataType: 'json'
  // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
},
processResults: function (data) {
    return {
      results: data
    };
  },
  minimumInputLength : 3,
});
/* ------------------------------------------------------------- */
$eventUser.on("select2:select", function (e) { 
var _idUser = e.params.data.id;
console.log("select2:select", _idUser );
buscarUser( _idUser );
});

/*
// RESPONSIVE

<link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.2.3/css/responsive.dataTables.min.css">

<script src="https://cdn.datatables.net/responsive/2.2.3/js/dataTables.responsive.min.js" ></script>

<th class=" all " >CANTIDAD</th>

// responsive: true,
// Clases table cell-border compact stripe hover table-striped table-hover

*/
/* ---------------------------------------------------- */
$('#wrapperTable').DataTable({
    "pagingType": "full_numbers",
    "lengthMenu": [
        [25, 50, 100],
        [25, 50, 100]
    ],
	"order" 	 : [[ 0, "desc" ]],
	"aaSorting"  : [],
	"searching": false,
	"responsive" : true,
	"scrollX" 	 : true ,
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
                'copy',
                'excel',
                'csv',
                'pdf',
                'print'
            ]
        }
    ],
    language : {
        sProcessing: "Procesando...",
		sLengthMenu: "Mostrar _MENU_ registros",
		sZeroRecords: "No se encontraron resultados",
		sEmptyTable: "Ningún dato disponible en esta tabla",
		sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
		sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
		sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
		sInfoPostFix: "",
		sSearch: "Buscar:",
		sUrl: "",
		sInfoThousands: ",",
		sLoadingRecords: "Cargando...",
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
    },
    "createdRow": function( row, data, dataIndex){
    	switch( data[8] ){
    		case 'Digitado':
    			$(row).addClass('text-primary');
    		break;
    		case 'Aprobado':
    			$(row).addClass('text-success');
    		break;
    		case 'Anulado':
    			$(row).addClass('text-danger');
    		break;
    	}
    },
    serverSide: true,
    ajax: {
        url: _URL_API + 'paginar/ficha/inspeccion',
        type: 'POST' ,
        data : { '_token' : $('meta[name="csrf-token"]').attr('content') } , 
        headers : {
          "api-token" : _TokenUser
        }
    },
    "bProcessing": true,
    "bServerSide": true,
    "columns" : [
		{ "data" : "idFichaInspeccion" } , 
		{ "data" : "DocCliente" } , 
		{ "data" : "NomCliente" } , 
		{ "data" : "DireccionServicio" } , 
		{ "data" : "usuario_comercial" } ,
		{ "data" : "updated_at" } ,
		{ "data" : "accion1" } , 
		{ "data" : "accion2" } , 
		{ "data" : "accion3" } 
    ],
    columnDefs: [
      {
        targets : [ 6 , 7 , 8 ], className : 'text-info'
      },
      {
        targets : [ 9 , 10 , 11 ], className : 'text-danger'
      }
    ],
    dom: "<'row'<'col-sm-3'l><'col-sm-3'f><'col-sm-6'p>>" +
	"<'row'<'col-sm-12'tr>>" +
	"<'row'<'col-sm-5'i><'col-sm-7'p>>",
	"initComplete": function(settings, json) {
		// Ocultamos el buscados - preloader
		$('#wrapperTable').waitMe('hide');
    },
    "drawCallback": function( settings ) {
		var api = this.api();
		// Ocultamos el buscados - preloader
		$('#wrapperTable').waitMe('hide');
    }
});
/* desactivar ordenable
columnDefs: [
	{ orderable: false, targets: [11,12] } , 
	{ className: 'text-right', targets: [ 8,9] }
],
 */
//"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
/* ---------------------------------------------------- */
// table = $('#wrapperTable').DataTable();
var buttons = new $.fn.dataTable.Buttons(table, {
   buttons: [
   'copyHtml5',
   'excelHtml5',
   'csvHtml5',
   'pdfHtml5'
   ]
}).container().appendTo($('#botones'));
/* ---------------------------------------------------- */
table.on( 'search.dt', function () {
	// Mostramos el buscados - preloader
    $('#wrapperTable').waitMe({
		effect 	: 'facebook',
		text 	: 'Buscando...',
		bg 		: 'rgba(255,255,255,0.7)',
		color 	: '#146436'
	});
} );
/* ------------------------------------------------------------------------ */

// Edit record
table.on('click', '.edit', function() {
    $tr = $(this).closest('tr');

    if ($tr.hasClass('child')) {
        $tr = $tr.prev('.parent');
    }

    var data = table.row($tr).data();
    alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
});

/* ------------------------------------------------------------------------------------------------------ */

// Delete a record
table.on('click', '.remove', function(e) {
    $tr = $(this).closest('tr');
    table.row($tr).remove().draw();
    e.preventDefault();
});

/* ------------------------------------------------------------------------------------------------------ */

//Like record
table.on('click', '.like', function() {
    alert('You clicked on Like button');
});
/* ------------------------------------------------------------------------------------------------------ */
$('#wrapperTable').loading({
	message: 'Cargando...'
});
/* ------------------------------------------------------------------------------------------------------ */
loadTabla();
/* ------------------------------------------------------------------------------------------------------ */
function loadTabla()
{
	
	$('#wrapperTable').loading({
		message: 'Generando...'
	});
	var _data = { 
		'_token'  : $('meta[name="csrf-token"]').attr('content') 
	};

	$.post( _URL_HOME + 'get_home_rva', _data , function(data, textStatus, xhr) {
		/*optional stuff to do after success */
	}, 'json')
	.fail(function() {

		$.notify({
	        message: "Error al generar, por favor intente una vez más."
	    }, {
	        type: 'warning', timer: 8000, placement: { from: 'top', align: 'right' }
	    });

	})
	.done( function( json ) {

		table.clear();
		table.rows.add( json.data ).draw();
		if( _datatbl_src )
		{
			table.search( _datatbl_src ).draw();
		}

	})
	.always(function() {
		$('#wrapperTable').loading('stop');
	});
}
/* ------------------------------------------------------------------------------------------------------ */
$(document).delegate('.delItem', 'click', function(event) {
	event.preventDefault();
	$tr = $(this).closest('tr');
	var _IdObjeto = $(this).data('id'), _nombre = $(this).data('nombre');
	var _data = { 
		'_token'  : $('meta[name="csrf-token"]').attr('content') , 
		'_method' : 'DELETE'
	};
	swal({
		title	: "Confirmar",
		text 	: "Anular documento: " + _nombre,
		icon 	: "warning",
		buttons : true,
		dangerMode: true,
	    buttons: ["Cerrar", "Ejecutar"],
	})
	.then((willDelete) => {
		if (willDelete) {
			$('body').waitMe({
				effect: 'facebook',
				text: 'Guardando...',
				bg: 'rgba(255,255,255,0.7)',
				color:'#146436'
			});
			$.post( _URL_HOME + 'lista_documentos/' + _IdObjeto , _data , function(data, textStatus, xhr) {
				/*optional stuff to do after success */
			}, 'json')
			.fail(function() {
				$.notify({
			        message: "Error al generar, por favor intente una vez más."
			    }, {
			        type: 'warning', timer: 8000, placement: { from: 'top', align: 'right' }
			    });
			})
			.done( function( json ) {
				table.row($tr).remove().draw();
				swal( "Correcto" , "activos: " + _nombre + " elminado correctamente", "success" );
			})
			.always(function() {
				$('body').waitMe('hide');
			});
		}
	});
});
/* ------------------------------------------------------------------------------------------------------ */
// WAIT ME!
// <link rel="stylesheet" href="{{ asset('plugins/waitMe-31.10.17/waitMe.min.css') }}">
// <script src="{{ asset('plugins/waitMe-31.10.17/waitMe.min.js') }}"></script>
/* ------------------------------------------------------------------------------------------------------ *
$('body').waitMe({
	effect: 'facebook',
	text: 'Guardando...',
	bg: 'rgba(255,255,255,0.7)',
	color:'#146436'
});
$('body').waitMe('hide');
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
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */


<script type="text/javascript"></script>

/* ------------------------------------------------------------------------------------------------------ */
function renovarToken() {
	var length = 12;
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   result += '-';
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   result += '-';
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   $('#frmDocumento #uu_id').val( result );
}
/* ------------------------------------------------------------------------------------------------------ */
$('#dearchivo').change(function(event) {
    // dearchivo -> nombre del input file
    var formData = new FormData();
    var _size = this.files[0].size;
    var file = this.files[0];
    if( _size > 15000 )
    {
    	$.alert({
		    title: 'Archivo muy grande',
		    content: 'Sólo archivos menor a 15MB de tamaño',
		    type : 'green'
		});
      // swal( "Archivo muy grande" , "Sólo archivos menor a 1MB de tamaño" , "error" );
      return true;
    }
    formData.append('formData', file);
    $.ajax({
        url: _URL_HOME +  'adjunto/solicitud/analisis/detalle',  //Server script to process data
        type: 'POST',
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: formData,
        contentType: false,
        processData: false,
        //Ajax events
        success: function( json ){
          if( json.status == 'OK' )
          {
            $('#archivo_adjunto').val( json.data.nombre_archivo );
            $('#id_adjunto').val( json.data.id );
          }else{
          	escuchaRespuesta( json );
          }
        },
        beforeSendfunction( xhr ) {
          $('#loadingAdjunto').fadeIn();
        },
        error() {
          $.notify({
              message: "Error al generar, por favor intente una vez más."
          }, {
              type: 'warning', timer: 8000, placement: { from: 'top', align: 'right' }
          });
        },
        complete() {
          $('#loadingAdjunto').fadeOut();
        }
      });
});
/* ------------------ VERSION 2019 CON INDICADOR DE PORCENTAJE SUBIDO ------------------ */
$('#dearchivo').change(function(event) {
    // dearchivo -> nombre del input file
    var formData = new FormData();
    var _size = this.files[0].size;
    var file = this.files[0];

    formData.append('formData', file);
    formData.append('id_const', $('#frmDocumento #id').val() );

    $('body').waitMe({
      effect : 'facebook',
      text   : 'Subiendo...',
      bg     : 'rgba(255,255,255,0.7)',
      color  : '#146436'
    });

    var ajax = new XMLHttpRequest();
    ajax.open( "POST" , _URL_HOME +  'adjunto/const/supImg' ); // http://www.developphp.com/video/JavaScript/File-Upload-Progress-Bar-Meter-Tutorial-Ajax-PHP
    //use file_upload_parser.php from above url
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.setRequestHeader( 'X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content') );
    ajax.addEventListener("load", completeHandler, false);
    ajax.addEventListener("error", errorHandler, false);
    ajax.addEventListener("abort", abortHandler, false);
    ajax.onreadystatechange = function (aEvt) {
      console.log( 'status>>>>>>' , ajax.status , 'readyState>>>>>>>>>>>>>>' , ajax.readyState );
      if ( ajax.readyState == 4 ) {
        switch( ajax.status )
        {
          case 200:
            console.log( aEvt );
          break;
          case 500:
            FalloJS();
          break;
        }
      }
      $('body').waitMe('hide');
    };
    ajax.send( formData );
});
/* ------------------------------------------------------------- */
function progressHandler(event) {
	_("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes de " + event.total;
	var percent = ( event.loaded / event.total ) * 100;
	_("progressBar").value = Math.round(percent);
	$('.waitMe_container .waitMe_text').html( '<span style="font-size:40px;" >' + Math.round(percent) + '% cargado</span>');
}
/* ------------------------------------------------------------- */
function completeHandler(event) {
  // _("status").innerHTML = event.target.responseText;
  try {
    var json = JSON.parse( event.target.response );
    /**/
    if( json.estado == 'OK' )
    {
      $('#wrapperImages').html( json.adjuntos );
    }else{
      escuchaRespuesta( json );
    }
    /**/
  }
  catch(err) {
    // document.getElementById("demo").innerHTML = err.message;
  }
  _("progressBar").value = 0; //wil clear progress bar after successful upload
}
/* ------------------------------------------------------------- */
function errorHandler(event) {
  // _("status").innerHTML = "Upload Failed";
  FalloJS();
}
/* ------------------------------------------------------------- */
function abortHandler(event) {
  _("status").innerHTML = "Upload Aborted";
}
/* ------------------------------------------------------------- */
function _(el) {
  return document.getElementById(el);
}
/* ------------------------------------------------------------- *
<!-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -->
<progress id="progressBar" value="0" max="100" style="width:100%;"></progress>
<br>
<h3 id="status"></h3>
<p id="loaded_n_total"></p>
<!-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -->
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------ */
// ALERT CONFIRM JQUERY
// <link href="{{ asset('plugins/jquery-confirm-master/css/jquery-confirm.css') }}" rel="stylesheet"/>
// <script src="{{ asset('plugins/jquery-confirm-master/js/jquery-confirm.js') }}" ></script>
// $.alert({ title: 'Error de datos', content: 'Selecciona un producto de la lista' , 'type' : 'red' });
/*
// confirmar
$.confirm({
    title: 'Confirm!',
    content: 'Simple confirm!',
    type : 'green',
    buttons: {
        confirm: function () {
            $.alert('Confirmed!');
        },
        cancel: function () {
            $.alert('Canceled!');
        },
        somethingElse: {
            text: 'Something else',
            btnClass: 'btn-blue',
            keys: ['enter', 'shift'],
            action: function(){
                $.alert('Something else?');
            }
        }
    }
});

$.confirm({
    title: 'Prompt!',
    content: '' +
    '<form action="" class="formName">' +
    '<div class="form-group">' +
    '<label>Enter something here</label>' +
    '<input type="text" placeholder="Your name" class="name form-control" required />' +
    '</div>' +
    '</form>',
    buttons: {
        formSubmit: {
            text: 'Submit',
            btnClass: 'btn-blue',
            action: function () {
                var name = this.$content.find('.name').val();
                if(!name){
                    $.alert('provide a valid name');
                    return false;
                }
                $.alert('Your name is ' + name);
            }
        },
        cancel: function () {
            //close
        },
    },
    onContentReady: function () {
        // bind to events
        var jc = this;
        this.$content.find('form').on('submit', function (e) {
            // if the user submits the form by pressing enter in the field.
            e.preventDefault();
            jc.$$formSubmit.trigger('click'); // reference the button and click it
        });
    }
});

$.alert({
    title: 'Alert!',
    content: 'Simple alert!',
    type : 'green'
});
 */
/* ------------------------------------------------------------------------------------------------------ *
// Easy autocomplete
<link rel="stylesheet" href="{{ asset('plugins/EasyAutocomplete-1.3.5/easy-autocomplete.min.css') }}">
<link rel="stylesheet" href="{{ asset('plugins/EasyAutocomplete-1.3.5/easy-autocomplete.themes.min.css') }}">

<script src="{{ asset('plugins/EasyAutocomplete-1.3.5/jquery.easy-autocomplete.min.js') }}"></script>

var option_umedida = {
	url: function(phrase) {
		return  _URL_HOME + 'search_umedida';
	},
	ajaxSettings: {
		dataType: "json",
		method: "POST",
		data: {
		dataType: "json",
			'_token'  : $('meta[name="csrf-token"]').attr('content') , 
		}
	},
	template: {
		type: "Descripcion",
		fields: {
			description: "IdUMedida"
		}
	},
	preparePostData: function(data) {
		data.phrase = $('#IdUMedida').val();
		return data;
	},
	getValue: function(element) { 
		$('#unidad_medida').val(element.id )  ; 
		return element.Descripcion;
	},
	requestDelay: 400
};
/* ------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------ */

/*
<script src="{{ asset('plugins/bootstrap-maxlength-master/src/bootstrap-maxlength.js') }}" ></script>
 */

$('.maxlen').maxlength({
    alwaysShow: true,
    threshold: 10,
    warningClass: "label label-primary",
    limitReachedClass: "label label-success",
    placement: 'top',
    message: 'Usando %charsTyped% de %charsTotal% letras.'
});

/*
CONCAT(RIGHT(a.FechaEmision,2),'/',MID(a.FechaEmision,5,2),'/',LEFT(a.FechaEmision,4)) AS 'FECHA',
DB::enableQueryLog();
DB::getQueryLog();
 

// TAG INPIUTS
// jQuery-Tags-Input-master
<!-- TagInput -->
<link rel="stylesheet" type="text/css" href="{{ asset('plugins/jQuery-Tags-Input-master/dist/jquery.tagsinput.min.css') }}" />
<!-- TagInput -->
<script src="{{ asset('plugins/jQuery-Tags-Input-master/dist/jquery.tagsinput.min.js') }}"></script>
// $('#tags').tagsInput();
// 

/*

<link rel="stylesheet" href="{{ asset('plugins/fancybox-master/dist/jquery.fancybox.min.css') }}" />
<script src="{{ asset('plugins/fancybox-master/dist/jquery.fancybox.min.js') }}"></script>

<a data-fancybox="gallery" href="big_1.jpg"><img src="small_1.jpg"></a>
<a data-fancybox="gallery" href="big_2.jpg"><img src="small_2.jpg"></a

*/


// RICH TEXT
// <link rel="stylesheet" type="text/css" href="{{ asset('plugins/RichText-master/src/richtext.min.css') }}">
// <script src="{{ asset('plugins/RichText-master/src/jquery.richtext.min.js') }}" ></script>

/*
$('#frmDocumento #acerca_de_mi').richText({
	height : 100,
	// uploads
	imageUpload: true,
	fileUpload: true,
	// media
	videoEmbed: true,
	// link
	urls: true,
	// tables
	table: true,
	// fonts
	fonts: true,
	fontList: [
	  "Arial", 
	  "Arial Black", 
	  "Comic Sans MS", 
	  "Courier New", 
	  "Geneva", 
	  "Georgia", 
	  "Helvetica", 
	  "Impact", 
	  "Lucida Console", 
	  "Tahoma", 
	  "Times New Roman",
	  "Verdana"
	]
});
 */


// Bootstrap select
// <link href="{{ asset('plugins/bootstrap-select-1.13.9/dist/css/bootstrap-select.min.css') }}" rel="stylesheet"/>
// <script src="{{ asset('plugins/bootstrap-select-1.13.9/dist/js/bootstrap-select.min.js') }}" ></script>

/*

$('#sucursal').selectpicker();

$('#sucursal').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
	var $firstText = $( "#sucursal option:selected" ).text();
	$('#frmDocumento #nombre_local').val( $firstText );
});

if( json.results != undefined ){
	var _html = '', $firstText = '';
	$.each( json.results , function( key, value ) {
	if( $firstText == '' ){
		$firstText = value.text;
	}
	_html += '<option value="'+value.text+'" data-icon="fa fa-bank" data-subtext="'+value.id+'" >'+value.text+'</option>'; 
	});
	$('#sucursal').html( _html );
	$('#sucursal').selectpicker('refresh');
	$('#frmDocumento #nombre_local').val( $firstText );
}




<!-- iCheck -->
<link rel="stylesheet" href="{{ asset('plugins/iCheck/flat/blue.css') }}" >

<!-- iCheck -->
<script src="{{ asset('plugins/iCheck/icheck.min.js') }}" ></script>

//Enable iCheck plugin for checkboxes
//iCheck for checkbox and radio inputs
$('.mailbox-messages input[type="checkbox"]').iCheck({
  checkboxClass: 'icheckbox_flat-blue',
  radioClass: 'iradio_flat-blue'
});

$('input').iCheck('check', function(){
  alert('Well done, Sir');
});

$('input').on('ifChecked', function(event){
  alert(event.type + ' callback');
});

$('input').on('ifUnchecked', function(event){
  alert(event.type + ' callback');
});

// change input's state to 'checked'
$('input').iCheck('check');

// remove 'checked' state
$('input').iCheck('uncheck');

// toggle 'checked' state
$('input').iCheck('toggle');

// change input's state to 'disabled'
$('input').iCheck('disable');

// remove 'disabled' state
$('input').iCheck('enable');

// change input's state to 'indeterminate'
$('input').iCheck('indeterminate');

// remove 'indeterminate' state
$('input').iCheck('determinate');

// apply input changes, which were done outside the plugin
$('input').iCheck('update');

// remove all traces of iCheck
$('input').iCheck('destroy');




Sweet alert2
============
<!-- sweetAlert2 -->
<link href="{{ asset('plugins/bootstrap-sweetalert-master/dist/sweetalert.css') }}" rel="stylesheet"/>
<!-- SweeAlert -->
<script src="{{ asset('plugins/bootstrap-sweetalert-master/dist/sweetalert.min.js') }}" ></script>

Swal.fire('Any fool can use a computer')

Swal.fire(
  'The Internet?',
  'That thing is still around?',
  'question'
);
Swal.fire({
  icon: 'error',
  title: 'Oops...',
  text: 'Something went wrong!',
  footer: '<a href>Why do I have this issue?</a>'
});

Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
}).then((result) => {
  if (result.value) {
    Swal.fire(
      'Deleted!',
      'Your file has been deleted.',
      'success'
    )
  }
});





// UPLOAD FILE
<link href="{{ asset('plugins/jquery-upload-file-master/css/uploadfile.css') }}" rel="stylesheet">
<script src="{{ asset('plugins/jquery-upload-file-master/js/jquery.uploadfile.min.js') }}" ></script>

// http://hayageek.com/docs/jquery-upload-file.php

var uploadObj;

uploadObj = $("#showoldupload").uploadFile({
    url             :  _URL_HOME +  'subir/archivo/post' ,
    dragDrop        : true,
    fileName        : "formData",
    formData: {     '_token'  : $('meta[name="csrf-token"]').attr('content') , 'token' : _SessionToken } ,
    returnType      : "json",
    showDelete      : true,
    statusBarWidth  : 500,
    dragdropWidth   : 500,
    maxFileSize     : 20000*1024,
    showPreview     : true,
    previewHeight   : "70px",
    previewWidth    : "70px",
    dragDropStr     : "<span><b>Arrastra tus archivos aquí :)</b></span>",
    abortStr        : "Abandonar",
    cancelStr       : "Mejor no...",
    doneStr         : "Correcto",
    multiDragErrorStr : "Por favor revisa las restricciónes de archivos.",
    allowedTypes    : 'jpg,png,jpeg',
	extErrorStr     : "Sólo archivo de imágenes ()JPG,JPEG,PNG)",
    sizeErrorStr    : "El máximo de tamaño es 20Mb:",
    uploadErrorStr  : "Error",
    uploadStr       : "Cargar",
	dynamicFormData: function()
	{
	    //var data ="XYZ=1&ABCD=2";
	    var data ={"XYZ":1,"ABCD":2};
	    return data;        
	},
    deleteCallback: function (data, pd) {
        var $datita = { '_token'  : $('meta[name="csrf-token"]').attr('content') , 'id' : data.data.id , 'uu_id' : data.data.uu_id };
        // console.log( 'Hola!!! >>>' , data , $datita );
        if( data.data != undefined ){
            $.post( "del/archivo/post" , $datita ,
                function (resp,textStatus, jqXHR) {
                    //Show Message  
                    // alert("File Deleted");
            });
        }
        pd.statusbar.hide(); //You choice.
    },
    afterUploadAll:function(files,data,xhr,pd)
    {
		console.log( files, data );
		var $n = files.responses.length;
		console.log( 'hay '+$n +' Archivos...');
        // $('#btnAplicadFilesPost').removeClass('disabled').removeAttr('disabled');
    }
});

uploadObj.reset();

SPARKPOST PRUEBAS API-KEY
bdc8af3644a42a7e30c39ae355275ee89c43ea6b

unique_id_4_graduate_students_list


<!-- Toast -->
<link href="{{ asset('plugins/jquery-toast-plugin-master/src/jquery.toast.css') }}" rel="stylesheet"/>

<!-- Toast -->
<script src="{{ asset('plugins/jquery-toast-plugin-master/src/jquery.toast.js') }}"></script>

$.toast({
    heading: 'Error',
    text: 'Report any <a href="https://github.com/kamranahmedse/jquery-toast-plugin/issues">issues</a>',
    showHideTransition: 'fade',
    icon: 'error'
});
$.toast({
    heading: 'Warning',
    text: 'It is going to be supper easy for you to use ;)',
    showHideTransition: 'plain',
    icon: 'warning'
});
$.toast({
    heading: 'Success',
    text: 'And these were just the basic demos! Scroll down to check further details on how to customize the output.',
    showHideTransition: 'slide',
    icon: 'success'
});
$.toast({
    heading: 'Can I add <em>icons</em>?',
    text: 'Yes! check this <a href="https://github.com/kamranahmedse/jquery-toast-plugin/commits/master">update</a>.',
    hideAfter: false,
    icon: 'success'
});






$("button").click(function() {
	var $btn = $(this);
	$btn.button('loading');
	// simulating a timeout
	setTimeout(function () {
		$btn.button('reset');
	}, 1000);
});

$('#btnMakeReqMasivo').button('Procesando cosa...');
$('#btnMakeReqMasivo').button('reset');





<script src="{{ asset('plugins/jquery.inputfilter-master/js/jquery.inputfilter.min.js') }}" ></script>

$('#txtDiaM').inputfilter({
    allowNumeric: true,
    allowText: false,
    allowCustom: [',','.']
});


// CKEDITOR


CKEDITOR.editorConfig = function( config ) {
	config.language = 'es';
	config.uiColor = '#F7B42C';
	config.height = 300;
	config.toolbarCanCollapse = true;
	config.removePlugins = 'easyimage, cloudservices';
};
/* ------------------------------------------------------------- *
Extra_InfAdicional = CKEDITOR.replace( 'Extra_InfAdicional',{
	toolbar: [{
	  name: 'document',
	  items: ['Print']
	},
	{
	  name: 'clipboard',
	  items: ['Undo', 'Redo']
	},
	{
	  name: 'styles',
	  items: ['Format', 'Font', 'FontSize']
	},
	{
	  name: 'colors',
	  items: ['TextColor', 'BGColor']
	},
	{
	  name: 'align',
	  items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
	},
	'/',
	{
	  name: 'basicstyles',
	  items: ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting']
	},
	{
	  name: 'links',
	  items: ['Link', 'Unlink']
	},
	{
	  name: 'paragraph',
	  items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote']
	},
	{
	  name: 'insert',
	  items: ['Image', 'Table']
	},
	{
	  name: 'tools',
	  items: ['Maximize']
	},
	{
	  name: 'editing',
	  items: ['Scayt']
	}
	],

	extraAllowedContent: 'h3{clear};h2{line-height};h2 h3{margin-left,margin-top}',

	// Adding drag and drop image upload.
	extraPlugins: 'print,format,font,colorbutton,justify,uploadimage',
	uploadUrl: _URL_HOME+'simple/carga/archivo',

	// Configure your file manager integration. This example uses CKFinder 3 for PHP.
	filebrowserBrowseUrl: '/apps/ckfinder/3.4.5/ckfinder.html',
	filebrowserImageBrowseUrl: '/apps/ckfinder/3.4.5/ckfinder.html?type=Images',
	filebrowserUploadUrl: _URL_HOME+'simple/carga/archivo',
	filebrowserImageUploadUrl: _URL_HOME+'simple/carga/archivo',

	height: 260,

	removeDialogTabs: 'image:advanced;link:advanced'
});
/**/

// editor.setData('');
// CKEDITOR.instances.Extra_InfAdicional.setData( '' );
// var $info = CKEDITOR.instances.Extra_InfAdicional.getData();


/**/

