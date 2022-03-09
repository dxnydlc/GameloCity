//xls_incidencias.js

/* ------------------------------------------------------------- */
var  _AuthFormulario = 'XLS_INCIDENCIAS_LAP';
/* ------------------------------------------------------------- */
var table, tblDetalle;
/* ------------------------------------------------------------- */
var _urlServicio = `${_URL_NODE3}/api/lap_incidencias/`;
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
        initOrq();
        /* ------------------------------------------------------------- */
        $('#btnBuscar').click(function (e) { 
            e.preventDefault();
            buscar();
        });
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
        $("#btn_OpenFiltro").on( "click", function() {
            e.preventDefault();
            $('#mdlFiltro').modal('show');
        });
        /* ------------------------------------------------------------- */
        // ARCHIVOS
        $("#btnOpenModalFiles").on( "click", function(e) {
            e.preventDefault();
            //uploadObj.reset();
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
        /* ------------------------------------------------------------- */
        var $eventIdCliente = $('#frmDocumento #IdCliente').select2({
            ajax: {
                url: _URL_NODE3+'/api/src/clientes2_select2/',
                dataType: 'json',
                data: function (params) {
                    var query = {
                        q : params.term,
                        "user_token" : _token_node
                    }
                    // Query parameters will be ?search=[term]&type=public
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
        $eventIdCliente.on("select2:select", function (e) { 
            var Texto = e.params.data.text, IdClienteProv = e.params.data.id;
            $('#frmDocumento #Cliente').val(Texto);
            getLocales( IdClienteProv );
        });
        /* ------------------------------------------------------------- */
        var $eventIdLocal = $('#frmDocumento #IdLocal').select2({
            width : '100%'
        });
        /* ------------------------------------------------------------- */
        $eventIdLocal.on("select2:select", function (e) { 
            var Texto = e.params.data.text, IdClienteProv = e.params.data.id;
            $('#frmDocumento #Local').val(Texto);
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.editRow', 'click', function(event) {
            event.preventDefault();
            var $id = $(this).data('id'), $uuid = $(this).data('uuid'), $nombre = $(this).data('nombre');
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.delRow', 'click', function(event) {
            event.preventDefault();
            var $id = $(this).data('id'), $uuid = $(this).data('uuid'), $nombre = $(this).data('nombre');
            $.confirm({
                title: 'Confirmar',
                type    : 'orange',
                content: 'Eliminar registro: '+$nombre,
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
        });
        /* ------------------------------------------------------------- */
        $("#btn-updateLista").on( "click", function(e) {
            e.preventDefault();
            listarItems();
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.docDelete', 'click', function(event) {
            event.preventDefault();
            var _id = $(this).data('id'), _uuid = $(this).data('uuid'), _nombre = $(this).data('nombre');
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
})(jQuery);
/* ------------------------------------------------------------- */
function initOrq()
{
    // Esta funcción SIEMPRE deberá existir, aqui se ponen las funciones que vamos a llamar automáticamente.
    getAll();
    renovarToken( '#frmDocumento #uu_id' );
    $('#frmDocumento #id').val(0);
    $('#frmDocumento #Codigo').val(0);
}
/* ------------------------------------------------------------- */
function renovarToken()
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
    $('#frmDocumento #uu_id').val( result );   
}
/* ------------------------------------------------------------- */
function getAll()
{
    try {
        //
    $('#wrapperTable').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
        });
        $.ajax({
            url     : `${_urlServicio}`,
            method  : "GET",
            dataType: "json",
            headers : {
                "api-token"  : _TokenUser,
                "user-token" : _token_node
            }
        })
        .done(function(  json ) {
            switch (json.codigo) {
                case 200:
                    dibujarTabla_cab( json.data , '#wrapperTable' );
                break;
                default:
                break;
            }
        })
        .fail(function(xhr, status, error) {
            get_Error( xhr );
            $('#wrapperTable').waitMe('hide');
        })
        .always(function() {
            $('#wrapperTable').waitMe('hide');
        });
    } catch (error) {
        alert( error );
    }
}
/* ------------------------------------------------------------- */
function cargarDoc( uuid )
{
    try {
        //tblDetalle.columns.adjust().draw();
        $('#frmDocumento').waitMe({
            effect  : 'facebook',
            text    : 'Espere...',
            bg      : 'rgba(255,255,255,0.7)',
            color   : '#146436',fontSize:'20px',textPos : 'vertical',
            onClose : function() {}
        });
        $.ajax({
            url     : `${_urlServicio}get_data`,
            method  : "POST",
            data    : { 'uuid' : uuid },
            dataType: "json",
            headers : {
            "api-token"  : _TokenUser,
            "user-token" : _token_node
            }
        })
        .done(function(  json ) {
            switch (json.codigo) {
                case 200:
                    var rs = json.data;
                    if( json.data != undefined ){
                        $.each( json.data , function( key, value ) {
                            $('#frmDocumento #'+key).val(value);
                        });
                        $('#frmDocumento #IdCliente').html(`<option value="${rs.IdCliente}" >${rs.Cliente}</option>`);
                        $('#frmDocumento #IdCliente').trigger('change');
                        // Locales
                        if( json.locales != undefined ){
                            var _html = '<option value="" >Todos</option>';
                            $.each( json.locales , function( key, value ) {
                                _html += '<option value="'+value.IdSucursal+'" >'+value.IdSucursal+'-'+value.Descripcion+'</option>'; 
                                });
                            $('#frmDocumento #IdLocal').html( _html );
                            $('#frmDocumento #IdLocal').val( rs.IdLocal );
                            $('#frmDocumento #IdLocal').trigger('change');
                        }
                    }
                    listarItems();
                    tostada( json.resp.titulo , json.resp.texto , json.resp.clase );
                break;
                default:
                break;
            }
        })
        .fail(function(xhr, status, error) {
            get_Error( xhr );
            $('#frmDocumento').waitMe('hide');
        })
        .always(function() {
            $('#frmDocumento').waitMe('hide');
        });
    } catch (error) {
        varDump(error);
        alert( error );
		$('#wrapperTable').waitMe('hide');
    }
    
}
/* ------------------------------------------------------------- */
function getLocales( IdClienteProv )
{
	$('#wrapperTable').waitMe({
		effect: 'facebook',
		text: 'Guardando...',
		bg: 'rgba(255,255,255,0.7)',
		color:'#146436'
	});
	$.ajax({
		url     : `${_URL_NODE3}/api/locales/${IdClienteProv}`,
		method  : "GET",
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
				alert(json.error);
			break;
			case 'OK':
				if( json.data != undefined ){
					var _html = `<option value="" >Todos</option>`;
					$.each( json.data , function( key, value ) {
						_html += `<option value="${value.IdSucursal}" >${value.IdSucursal}-${value.Descripcion}</option>`; 
                    });
					$('#frmDocumento #IdLocal').html( _html );
                    $('#frmDocumento #IdLocal').trigger('change');
				}
			break;
		}
	})
	.fail(function(xhr, status, error) {
		get_Error( xhr );
		$('#wrapperTable').waitMe('hide');
	})
	.always(function() {
		$('#wrapperTable').waitMe('hide');
	});
}
/* ------------------------------------------------------------- */
function populateImg( json )
{
    var _html = ``;
    if( json )
    {
        $.each( json , function( key, rs ) {
            _html += `<div class="col-xs-6 col-md-3 col-lg-2 " id="wp_img_${rs.id}" >
                <a data-fancybox="gallery" href="${rs.url}" class="thumbnail" >
                    <img src="${rs.url}" alt="${rs.nombre_archivo}" />
                    <a href="#" data-id="${rs.id}" data-uuid="${rs.uu_id}" class=" rem_img text-danger" ><i class="fa fa-close" ></i> quitar imagen</a>
                </a>
            </div>`;
		});
    }
    $('#wrapper_imgs').html( _html );
}
/* ------------------------------------------------------------- */
function listarItems()
{
	//
	try {
		$('#tblDetalle').waitMe({
			effect  : 'facebook',
			text    : 'Espere...',
			bg      : 'rgba(255,255,255,0.7)',
			color   : '#146436',fontSize:'20px',textPos : 'vertical',
			onClose : function() {}
		});
        var _Token = $('#frmDocumento #uu_id').val();
		var _dataSerie = { 'Token' : _Token };
		$.ajax({
			url     : `${_urlServicio}items/all`,
			method  : "POST",
			data    : _dataSerie ,
			dataType: "json",
			headers : {
				"api-token"  : _TokenUser,
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
                    dibujarTabla_detalle( json.data , '#tblDetalle' );
				break;
			}
		})
		.fail(function(xhr, status, error) {
			get_Error( xhr );
			$('#tblDetalle').waitMe('hide');
		})
		.always(function() {
			$('#tblDetalle').waitMe('hide');
		});
	} catch (error) {
		alert( error );
		$('#tblDetalle').waitMe('hide');
	}
	//
}
/* ------------------------------------------------------------- */
function guardar_Data()
{
	//
    // - //
    var url = `${_urlServicio}`, metodo = `POST`;
    // - //
    var _dataSerializada = $('#frmDocumento').serialize();
    var Id = parseInt( $('#frmDocumento #id').val() ),uu_id = $('#frmDocumento #uu_id').val()
    if( Id > 0 ){
        url = `${_urlServicio}${uu_id}`;
        metodo = `PUT`;
    }
    //
	try {
		$('#frmDocumento').waitMe({
			effect  : 'facebook',
			text    : 'Espere...',
			bg      : 'rgba(255,255,255,0.7)',
			color   : '#146436',fontSize:'20px',textPos : 'vertical',
			onClose : function() {}
		});
		var _dataSerie = $('#frmDocumento').serialize();
		$.ajax({
			url     : url,
			method  : metodo,
			data    : _dataSerie ,
			dataType: "json",
			headers : {
				"api-token"  : _TokenUser,
				"user-token" : _token_node
			}
		})
		.done(function(  json ) {
            switch (json.codigo) {
                case 200:
                    // negocio...
                    tostada( json.resp.titulo , json.resp.texto , json.resp.clase );
                    $('#frmDocumento #id').val( json.item.id );
                    $('#frmDocumento #Codigo').val( json.item.Codigo );
                break;
                default:
                break;
            }
			switch(json.estado)
			{
				case 'ERROR':
					Swal.fire(json.error);
				break;
				case 'OK':
					
				break;
			}
		})
		.fail(function(xhr, status, error) {
			get_Error( xhr );
			$('#frmDocumento').waitMe('hide');
		})
		.always(function() {
			$('#frmDocumento').waitMe('hide');
		});
	} catch (error) {
		alert( error );
		$('#frmDocumento').waitMe('hide');
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
function dibujarTabla_detalle( json , _target )
{
    var _htmlTabla = ``;
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
                _htmlTabla += `<td>${rs}</td>`;
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
    varDump( _htmlTabla );
    $(_target).html( _htmlTabla );
    aplicarDataTable( 'DET' );
}
/* ------------------------------------------------------------- */
function dibujarTabla_cab( json , _target )
{
    var _htmlTabla = ``;
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
            const _rsData = json[index];
            _htmlTabla += `<tr>`;
            $.each( _rsData , function( key, rs ){
                _htmlTabla += `<td>${rs}</td>`;
            });
            _htmlTabla += `</tr>`;
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
    $(_target).html( _htmlTabla );
    aplicarDataTable( 'CAB' );
}
/* ------------------------------------------------------------- */
function aplicarDataTable( tipo )
{
    //
    var _opciones = {
        "pagingType": "full_numbers",
        "lengthMenu": [
        [25, 50, 100],
        [25, 50, 100]
        ],
        "searching" : true,
        "order"     : [[ 2, "desc" ]],
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
                table.destroy();
            } catch (error) {
                //
            }
            table = $('#wrapperTable').DataTable( _opciones );
            table.columns.adjust().draw();
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
        default:
            //
        break;
    }
    //
}
/* ------------------------------------------------------------- */
function cargarXLS_operarios( _Token , IdFile )
{
    //
    try {
        // * //
        $('body').waitMe({
            effect  : 'facebook',
            text    : 'Espere...',
            bg      : 'rgba(255,255,255,0.7)',
            color   : '#146436',fontSize:'20px',textPos : 'vertical',
            onClose : function() {}
        });
        $.ajax({
            url     : `${_urlServicio}importar_xls`,
            method  : "POST",
            data    : { 'IdFile' : IdFile , 'Token' : _Token },
            dataType: "json",
            headers : {
                "api-token"  : _TokenUser,
                "user-token" : _token_node
            }
        })
        .done(function(  json ) {
            switch (json.codigo) {
                case 200:
                    setTimeout(function(){ listarItems();$('body').waitMe('hide'); }, 10000);
                    $('#mdlArchivos56').modal('hide');
                break;
                default:
                    //
                break;
            }
        })
        .fail(function(xhr, status, error) {
            get_Error( xhr );
            $('body').waitMe('hide');
        })
        .always(function() {
            //$('body').waitMe('hide');
        });

    } catch (error) {
        alert( error  );
        $('body').waitMe('hide');
    }
    //
}
/* ------------------------------------------------------------- */
function dibujarCargador()
{
    //
    var _dataEnvio ={
        '_token': $('meta[name="csrf-token"]').attr('content') , 
        'Token' : $('#frmDocumento #uu_id').val(),
        'Id'    : $('#frmDocumento #id').val(),
        'Flag' : _AuthFormulario
    };
    $('#formData').fileinput({
        theme       : 'fas',
        language    : 'es',
        uploadUrl   : `${_URL_HOME}/adjunto/lap/xls/operarios`,
        allowedFileExtensions: [ 'xls' , 'xlsx' ],
        showPreview     : true ,
        uploadExtraData : _dataEnvio,
    }).on('fileuploaded', function( event, previewId, index, fileId) {
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
        console.log('File Uploaded', 'ID: ' + fileId + ', Thumb ID: ' + previewId);
        varDump( previewId.response );

        try {
            var json = previewId.response.adjuntos[0];
            var _Token = $('#frmDocumento #uu_id').val();
            // CallBack
            cargarXLS_operarios( _Token , json.id );
        } catch (error) {
            alert(error);
        }

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    }).on('filebatchuploadcomplete', function(event, preview, config, tags, extraData) {
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
        
        $('#formData').fileinput('refresh');

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    }).on('fileuploaderror', function(event, data, msg) {
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
        console.log('File Upload Error', 'ID: ' + data.fileId + ', Thumb ID: ' + data.previewId);
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    });
}
/* ------------------------------------------------------------- */

