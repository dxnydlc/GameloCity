// 28/09/2022
// @drdelacruzm


// ******* NODE JS *******
socket.emit('accion:audit',{
	user  : $nomU,
	msg   : `Aprobar Req.Mat. # ${$('#frmDocumento #IdRequerimientoCab').val()}`,
	dni   : $dniU,
	serie : 0,
	corr  : 0,
	form  : _AuthFormulario,
	url   : window.location.href,
	token : ''
});
// ******* NODE JS *******


// ******* NODE JS *******
socket.emit('accion:audit',{
	user  : $nomU,
	msg   : `Aprobar Req.Mat. # ${$('#frmDocumento #IdRequerimientoCab').val()}`,
	dni   : $dniU,
	serie : $('#frmDocumento #Serie').val(),
	corr  : $('#frmDocumento #Correlativo').val(),
	form  : _AuthFormulario,
	url   : window.location.href,
	token : $('#frmDocumento #uu_id').val()
});
// ******* NODE JS *******



// ######### FUNCION GENERAL #########

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
			// capturaError( xhr );
			get_Error( xhr );
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



// ######### FUNCIONES HELPER #########

/* ------------------------------------------------------------- */
function initOrq()
{
    // Esta funcción SIEMPRE deberá existir, aqui se ponen las funciones que vamos a llamar automáticamente.
    renovarToken( '#frmDocumento #uu_id' );
    $('#frmDocumento #id').val(0);
    $('#frmDocumento #Codigo').val(0);
	//
	let _fecha1 = moment().format('DD/MM/YYYY');
    $('#datefilter').val( _fecha1+' - '+_fecha1 );
    _fecha1 = moment().format('YYYY-MM-DD');
    // TOKEN INT
    let _date = Date.now();
    let _dec1 = Math.floor(Math.random() * 100), _dec2 = Math.floor(Math.random() * 100);
    let _TokenInt = `${_date}${_dec1}${_dec2}`;
    $('#frmDocumento #TokenInt').val( _TokenInt );
    // ******* NODE JS *******
    socket.emit('accion:audit',{
        user  : $nomU,
        msg   : 'Home Formulario Requisición de Materiales',
        dni   : $dniU,
        serie : 0,
        corr  : 0,
        form  : _AuthFormulario,
        url   : window.location.href,
        token : $('#frmDocumento #uu_id').val()
    });
}
/* ------------------------------------------------------------- */
function msgBox( _titulo , _mensaje )
{
    $.confirm({
        title   : _titulo,
        content : _mensaje,
        type    : 'red',
        buttons : {
          heyThere: {
            text: 'Correcto (Y)', // text for button
            btnClass: 'btn-blue', // class for the button
            keys: ['y', 'Y'], // keyboard event for button
            isHidden: false, // initially not hidden
            isDisabled: false, // initially not disabled
            action: function(heyThereButton){
            }
        },
        }
    });
}
/* ------------------------------------------------------------- */
function msgBox2( _titulo , _mensaje , clase )
{
    $.confirm({
        title   : _titulo,
        content : _mensaje,
        autoClose: 'Ok|30000',
        type    : clase,
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
}
/* ------------------------------------------------------------- */
function varDump( _texto )
{
    console.log( _texto );
}
/* ------------------------------------------------------------- */
function tostada( _titulo , _mensaje , _icono )
{
    // Se oculta a los 10 segundos 
    // success, warning, error, info
    $.toast({
        heading : _titulo,
        text    : _mensaje ,
        icon    : _icono,
        hideAfter   : 5000,
        showHideTransition:  'slide',
        position: 'bottom-center',
    });
}
/* ------------------------------------------------------------- */
function tostada2( _dataJson )
{
    // Se oculta a los 10 segundos 
    // success, warning, error, info
    $.toast({
        heading : _dataJson.titulo,
        text    : _dataJson.texto ,
        icon    : _dataJson.clase,
        hideAfter   : 10000,
        showHideTransition:  'slide',
        position: 'bottom-center',
    });
}
/* ------------------------------------------------------------- */
function get_Error( xhr )
{
  //
  varDump(xhr);
  switch ( xhr.status ) {
    case 422:
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
    break;
    case 500:
      tostada2( xhr.responseJSON.resp );
    break;
    case 401:
      tostada2( xhr.responseJSON.msg );
    break;
    default:
      tostada( 'Error' , xhr.responseText , 'red' );
    break;
  }
  //
}
/* ------------------------------------------------------------- */
function dibuja_tablita( json , _target , _tipo )
{
    //
    let _htmlTabla = ``, _tableName = `wrapperTable`;
    switch (_tipo) {
        case 'CAB':
            _tableName = `wrapperTable`
            try {
                table.destroy();
            } catch (error) {}
        break;
        case 'DET':
            _tableName = `tblDetalle`
            try {
                tblDetalle.destroy();
            } catch (error) {}
        break;
        case 'AUTH':
            _tableName = `tblAuth`
            try {
                tblAuth.destroy();
            } catch (error) {}
        break;
    }

    _htmlTabla += `<table class=" table table-hover cell-border compact hover nowrap row-border table-striped table-hover " id="${_tableName}" cellspacing="0" width="100%" style="width:100%">`;

    if( json.length > 0 )
    {
        //
        _htmlTabla += `<thead>`;
        _htmlTabla += `<tr>`;
        // Dibujamos primero el head...
        $.each( json[0] , function( key, rs ){
            _htmlTabla += `<th>${key}</th>`;
        });
        _htmlTabla += `</tr>`;
        _htmlTabla += `</thead>`;

        // Ahora a dibujar el body...
        _htmlTabla += `<tbody>`;
        for (let index = 0; index < json.length; index++) {
            //
            const _rsData = json[index];
            _htmlTabla += `<tr>`;
            $.each( _rsData , function( key, rs ){
                if( rs ){
                    _htmlTabla += `<td>${rs}</td>`;
                }else{
                    _htmlTabla += `<td></td>`;
                }
            });
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
    // varDump( _htmlTabla );
    $(_target).html( _htmlTabla );
    // ##################### D ###########################
    setTimeout(function () {
		aplicarDataTable( _tipo , _target );
	}, 1000);
    // ##################### D ###########################
}
/* ------------------------------------------------------------- */
function aplicarDataTable( tipo )
{
    //
    let _opciones = {
        "pagingType": "full_numbers",
        "lengthMenu": [
        [25, 50, 100],
        [25, 50, 100]
        ],
        "searching" : true,
        "order"     : [[ 1, "desc" ]],
        "scrollX"   : true,
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
            switch( data[16] ){
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
        dom: "<'row'<'col-sm-3'l><'col-sm-3'f><'col-sm-6'p>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "initComplete": function(settings, json) {
            $('#tblDatos').waitMe('hide');
        },
        "drawCallback": function( settings ) {
            var api = this.api();
            $('#tblDatos').waitMe('hide');
        }
    };
    //
    switch (tipo) {
        case 'CAB':
            //
            try {
                tblHome.destroy();
            } catch (error) {
                //
            }
            tblHome = $('#wrapperTable').DataTable( _opciones );
            tblHome.columns.adjust().draw();
            setTimeout(function () {
                var buttons = new $.fn.dataTable.Buttons( tblHome , {
                    buttons: [
                    'copyHtml5',
                    'excelHtml5',
                    'csvHtml5',
                    'pdfHtml5'
                    ]
                }).container().appendTo($('#btnHomeTbls'));
            }, 1000);
            //
        break;
        case 'DET':
            //
            try {
                tblDetalle.destroy();
            } catch (error) {
                //
            }
            tblDetalle = $('#tblDetalle').DataTable( _opciones );
            //tblDetalle.columns.adjust().draw();
            //
        break;
        case 'AUTH':
            //
            try {
                tblAuth.destroy();
            } catch (error) {
                //
            }
            tblAuth = $('#tblAuth').DataTable( _opciones );
            //tblDetalle.columns.adjust().draw();
            //
        break;
        default:
            //
        break;
    }
    //
}
/* ------------------------------------------------------------- */
function populateFiles( data , target )
{
    //
    let _html = `<div class="row">`, _urlIMG = ``;
    for (let index = 0; index < data.length; index++) {
        const rs = data[index];
        switch ( rs.extension ) {
            case 'pdf':
                _urlIMG = `${_URL_HOME}ico/pdf-ico.png`;
            break;
            case 'doc':
            case 'docx':
                _urlIMG = `${_URL_HOME}ico/word-ico.png`;
            break;
            case 'xls':
            case 'xlsx':
                _urlIMG = `${_URL_HOME}ico/excel-ico.png`;
            break;
            case 'ppt':
            case 'pptx':
                _urlIMG = `${_URL_HOME}ico/ppt-ico.png`;
            break;
            default:
                _urlIMG = `${_URL_HOME}ico/file-icon.png`;
            break;
        }
        _html += `<div class="col-sm-4 col-md-4">
        <div class="thumbnail">
            <img src="${_URL_HOME}ico/pdf-ico.png" alt="${rs.nombre_archivo}" >
            <div class="caption">
                <p>${rs.nombre_archivo}</p>
                <p>
                <a href="${rs.url}" target="_blank" class=" btn-sm btn btn-primary" role="button">Descargar</a>
                </p>
            </div><!-- ./caption -->
            </div><!-- ./thumbnail -->
        </div>`;
    }
    _html += `<div class="row">`;
    $(target).html( _html );
}
/* ------------------------------------------------------------- */
function renovarToken( obj )
{
    var length = 25;
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
    $( obj ).val( result );   
}
/* ------------------------------------------------------------- */
function guardarDoc()
{
	//
	try {
        // - //
        let url = `${_URL_NODE3}/api/requisicion`, metodo = `POST`;
        // - //
        let _dataSerializada = $('#frmDocumento').serialize();
        let Id = parseInt( $('#frmDocumento #id').val() ),uu_id = $('#frmDocumento #uu_id').val()
        if( Id > 0 ){
            url = `${_URL_NODE3}/api/requisicion/${uu_id}`;
            metodo = `PUT`;
        }
        $('#mdlGuardando').modal('show');
        //
		$('#Contenedor').waitMe({
			effect  : 'facebook',
			text    : 'Espere...',
			bg      : 'rgba(255,255,255,0.7)',
			color   : '#146436',fontSize:'20px',textPos : 'vertical',
			onClose : function() {}
		});
		let _dataSerie = $('#frmDocumento').serialize();
		$.ajax({
			url     : url ,
			method  : metodo ,
			data    : _dataSerie ,
			dataType: "json" ,
			headers : {
				"api-token"  : _TokenUser ,
				"user-token" : _token_node
			}
		})
		.done(function(  json ) {
			/**/
			switch (json.codigo) {
                case 200:
                    _indexItemConcar = 0;
                    itemsConcar = [];
                    $('#lblEventos').html(`<div class="well">Guardando requisición...</div>`);
                    $('#frmDocumento #id').val( json.item.id );
                    console.log(json.item.IdRequisicion);
                    $('#frmDocumento #IdRequisicion').val( json.item.IdRequisicion );
                    _indexItemConcar = 0;
                    itemsConcar      = json.detalle;
                    // Envia a crear req en CONCAR
                    //truncateItemSQL();
                    makeReqConcar();

                    getAll();

                    // ******* NODE JS *******
                    socket.emit('accion:audit',{
                        user  : $nomU,
                        msg   : 'Guardar Requisición de Materiales #'+$('#frmDocumento #IdRequisicion').val(),
                        dni   : $dniU,
                        serie : 0,
                        corr  : $('#frmDocumento #id').val(),
                        form  : _AuthFormulario,
                        url   : window.location.href,
                        token : $('#frmDocumento #uu_id').val()
                    });
                    // ******* NODE JS *******
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
/* ------------------------------------------------------------- */




// ARCHIVOS
$("#btnOpenModalFiles").on( "click", function(e) {
    e.preventDefault();
    /**/
    try {
        $('#formData').fileinput('destroy');
    } catch (error) {
        console.error(error);
    }
    dibujarCargador();
    /**/
    $('#mdlArchivos56').modal('show');
});
/**
<!-- Modal -->
<div class=" modal fade " id="mdlArchivos56" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false" >
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel" >Cargar archivos.</h4>
			</div>
			<div class="modal-body">

                <div class="file-loading">
                    
                    <input id="formData" name="formData" type="file" multiple data-browse-on-zone-click="true" data-show-preview="true" >
                </div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
			</div>
		</div>
	</div>
</div>
<div class=" row " >
    <div class=" col-lg-3 col-md-3 " >
        <a id="btnOpenModalFiles" href="#" class="btn btn-primary "><i class="fa fa-cloud-upload" ></i> Cargar archivos.</a>
    </div>
    <!-- ./col -->
    <div class=" col-lg-3 col-md-3 " ></div>
    <!-- ./col -->
    <div class=" col-lg-3 col-md-3 " ></div>
    <!-- ./col -->
    <div class=" col-lg-3 col-md-3 " ></div>
    <!-- ./col -->
</div>
<!-- ./row -->
<hr>
<div class=" row " >
    <div class=" col-lg-12 col-md-12 " >
        <div id="wrapper_thumbs_files"></div>
    </div>
    <!-- ./col -->
</div>
<!-- ./row -->
<hr>
/**/
function dibujarCargador()
{
    //
    var _dataEnvio ={
        '_token': $('meta[name="csrf-token"]').attr('content') , 
        'Token' : $('#frmDocumento #uu_id').val(),
        'Id'    : $('#frmDocumento #id').val(),
        'IdDoc' : $('#frmDocumento #Codigo').val(),
        'Flag' : _AuthFormulario
    };
    $('#formData').fileinput({
        theme       : 'fas',
        language    : 'es',
        uploadUrl   : `${_URL_NODE3}/api/archivos_todos/carga/`,
        allowedFileExtensions: [ 'xls' , 'xlsx' , 'pdf' , 'jpg' , 'jpeg' , 'png' , 'doc' , 'docx' , 'ppt' , 'pptx' ],
        showPreview     : true ,
        uploadExtraData : _dataEnvio,
    }).on('fileuploaded', function( event, previewId, index, fileId) {
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
        console.log('File Uploaded', 'ID: ' + fileId + ', Thumb ID: ' + previewId);
        varDump( previewId.response );

        try {
            var _NroItems = previewId.response.adjuntos.length;
            var json = previewId.response.adjuntos[ _NroItems-1 ];
            var _Token = $('#frmDocumento #uu_id').val();
            populateArchivoThumbs( previewId.response.adjuntos );
        } catch (error) {
            alert(error);
        }

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    }).on('filebatchuploadcomplete', function(event, preview, config, tags, extraData) {
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
        
        $('#formData').fileinput('refresh');
        tostada2( { titulo : 'Correcto' , texto : 'Archivo(s) cargado' , clase : 'success' } );

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    }).on('fileuploaderror', function(event, data, msg) {
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
        console.log('File Upload Error', 'ID: ' + data.fileId + ', Thumb ID: ' + data.previewId);
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    });
}
/* ------------------------------------------------------------- */
function populateArchivoThumbs( json )
{
    var _html = ``;
    if( json )
    {
        $.each( json , function( key, rs ) {
            switch (rs.extension) {
                // ---------------------------------------------------------------
                case 'xls':
                case 'xlsx':
                    _html += `
                    <div class="col-xs-6 col-md-3 col-lg-2 " id="wrap_pdf${rs.id}" >
                        <a target="_blank" data-id="${rs.id}" data-ext="${rs.extension}" data-uuid="${rs.uu_id}" data-codigo="${rs.Cod001}" href="${rs.url}" class=" thumbnail verFile " >
                            <img src="https://ssays-orquesta.com/ico/excel-ico.png" alt="${rs.nombre_archivo}" />
                            <small>${rs.nombre_archivo}</small>
                            <a href="#" data-nombre="${rs.nombre_archivo}" data-id="${rs.id}" data-uuid="${rs.uu_id}" class=" delPDf text-danger" ><i class="fa fa-close" ></i> quitar archivo</a>
                        </a>
                    </div>`;
                break;
                // ---------------------------------------------------------------
                case 'doc':
                case 'docx':
                    _html += `
                    <div class="col-xs-6 col-md-3 col-lg-2 " id="wrap_pdf${rs.id}" >
                        <a target="_blank" data-id="${rs.id}" data-ext="${rs.extension}" data-uuid="${rs.uu_id}" data-codigo="${rs.Cod001}" href="${rs.url}" class=" thumbnail verFile " >
                            <img src="https://ssays-orquesta.com/ico/word-ico.png" alt="${rs.nombre_archivo}" />
                            <small>${rs.nombre_archivo}</small>
                            <a href="#" data-nombre="${rs.nombre_archivo}" data-id="${rs.id}" data-uuid="${rs.uu_id}" class=" delPDf text-danger" ><i class="fa fa-close" ></i> quitar archivo</a>
                        </a>
                    </div>`;
                break;
                // ---------------------------------------------------------------
                case 'ppt':
                case 'pptx':
                    _html += `
                    <div class="col-xs-6 col-md-3 col-lg-2 " id="wrap_pdf${rs.id}" >
                        <a target="_blank" data-id="${rs.id}" data-ext="${rs.extension}" data-uuid="${rs.uu_id}" data-codigo="${rs.Cod001}" href="${rs.url}" class=" thumbnail verFile " >
                            <img src="https://ssays-orquesta.com/ico/ppt-ico.png" alt="${rs.nombre_archivo}" />
                            <small>${rs.nombre_archivo}</small>
                            <a href="#" data-nombre="${rs.nombre_archivo}" data-id="${rs.id}" data-uuid="${rs.uu_id}" class=" delPDf text-danger" ><i class="fa fa-close" ></i> quitar archivo</a>
                        </a>
                    </div>`;
                break;
                // ---------------------------------------------------------------
                case 'pdf':
                    _html += `
                    <div class="col-xs-6 col-md-3 col-lg-2 " id="wrap_pdf${rs.id}" >
                        <a target="_blank" data-id="${rs.id}" data-ext="${rs.extension}" data-uuid="${rs.uu_id}" data-codigo="${rs.Cod001}" href="${rs.url}" class=" thumbnail verFile " >
                            <img src="https://ssays-orquesta.com/ico/pdf-ico.png" alt="${rs.nombre_archivo}" />
                            <small>${rs.nombre_archivo}</small>
                            <a href="#" data-nombre="${rs.nombre_archivo}" data-id="${rs.id}" data-uuid="${rs.uu_id}" class=" delPDf text-danger" ><i class="fa fa-close" ></i> quitar archivo</a>
                        </a>
                    </div>`;
                break;
                // ---------------------------------------------------------------
                default:
                    _html += `<div data-ext="${rs.extension}" data-uuid="${rs.uu_id}" data-codigo="${rs.Cod001}" class="col-xs-6 col-md-3 col-lg-2 " id="wrap_pdf${rs.id}" >
                        <a target="_blank" data-id="${rs.id}" data-fancybox="gallery" href="${rs.url}" class=" thumbnail verFile " >
                            <img src="${rs.url}" alt="${rs.nombre_archivo}" />
                            <small>${rs.nombre_archivo}</small>
                            <a href="#" data-nombre="${rs.nombre_archivo}" data-id="${rs.id}" data-uuid="${rs.uu_id}" class=" delPDf text-danger" ><i class="fa fa-close" ></i> quitar imagen</a>
                        </a>
                    </div>`;
                break;
                // ---------------------------------------------------------------
            }
                    
		});
    }
    $('#wrapper_thumbs_files').html( _html );
}
/* ------------------------------------------------------------- */
function getArchivos()
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
		var _dataSerie = {
            Flag    : `SOL_CAMBIO_ESTADO_DOC` ,
            Token   : $('#frmDocumento #uu_id').val() , 
            Codigo  : $('#frmDocumento #Codigo').val() , 
            Id : $('#frmDocumento #id').val() 
        };
		$.ajax({
			url     : `${_URL_NODE3}/api/archivos22/get_archivos/`,
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
/* ------------------------------------------------------------- */













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
    var _Id = e.params.data.id, _Texto = e.params.data.text;
    console.log("select2:select", _Id );
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
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
