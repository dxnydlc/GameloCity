//bitacora.js

/* ------------------------------------------------------------- */
var table, tblDetalle;
/* ------------------------------------------------------------- */
var _Sucursales = [], _ItemsReq = [], itemsConcar = [], _indexItemConcar = 0;
/* ------------------------------------------------------------- */
var _TipoCambio = 3.70;
/* ------------------------------------------------------------- */
var _ArrMeses = [ "", "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ];
/* ------------------------------------------------------------- */
var _NroMes = parseInt( moment().format('MM') );
/* ------------------------------------------------------------- */
var uploadObj;
/* ------------------------------------------------------------- */
var _FechaInic_DRP = moment().format('DD/MM/YYYY') , _FechaFin_DRP = moment().format('DD/MM/YYYY');
$('input[name="datefilter"]').val(`${_FechaInic_DRP} - ${_FechaFin_DRP}`);
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
        getAll();
        /* ------------------------------------------------------------- */
        table = $('#wrapperTable').DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [
                [25, 50, 100],
                [25, 50, 100]
            ],
            "order" 	 : [[ 2, "desc" ]],
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
        /* ------------------------------------------------------------- */
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5'
            ]
        }).container().appendTo($('#botones'));
        /* ------------------------------------------------------------- */
        $('#btnCrearDoc').click(function (e) { 
            e.preventDefault();
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
            $('#frmDocumento #id').val(0);
            $('#frmDocumento #Codigo').val(0);
            //
            CKEDITOR.instances.Glosa2.setData( '' );
            renovarToken();
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
        CKEDITOR.editorConfig = function( config ) {
            config.language = 'es';
            config.uiColor  = '#F7B42C';
            config.height   = 300;
            config.toolbarCanCollapse = true;
            config.removePlugins = 'easyimage, cloudservices';
        };
        /* ------------------------------------------------------------- */
        Glosa2 = CKEDITOR.replace( 'Glosa2',{
            toolbar: [
                {
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
                items: [ 'Table']
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
        /* ------------------------------------------------------------- */
        uploadObj = $("#showoldupload").uploadFile({
            url             :  _URL_HOME +  'adjunto/bitacora/sup' ,
            dragDrop        : true,
            fileName        : "formData",
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
                var data ={
                    '_token': $('meta[name="csrf-token"]').attr('content') , 
                    'token' : $('#frmDocumento #uu_id').val(),
                    "Id"   : $('#frmDocumento #id').val(),
                    "Cod"  : $('#frmDocumento #Codigo').val()
                };
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
                
                uploadObj.reset();
                var _json = files.responses[ $n - 1 ].adjuntos;
                console.log( _json );
                populateImg( _json )
            }
        });
        /* ------------------------------------------------------------- */
        $('#btnGuardarR').click(function (e) { 
            e.preventDefault();
            guardar();
        });        
        /* ------------------------------------------------------------- */
        $(document).delegate('.cerrarFrame','click',function(e){
            e.preventDefault();
            $('a[href="#tabHome"]').tab('show');
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.openDoc','click',function(e){
            e.preventDefault();
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
            CKEDITOR.instances.Glosa2.setData( '' );
            cargarDoc( uuid );
            //
        });
        /* ------------------------------------------------------------- */
        $('#btnAnularR').click(function (e) { 
            e.preventDefault();
            var uuid = $('#frmDocumento #uu_id').val();
            $.confirm({
                title: 'Anuar',
                content: '' +
                '<form action="" class="formName">' +
                '<div class="form-group">' +
                '<label>Motivo de anulación.</label>' +
                '<input type="text" class="name form-control" required />' +
                '</div>' +
                '</form>',
                buttons: {
                    formSubmit: {
                        text: 'Submit',
                        btnClass: 'btn-blue',
                        action: function () {
                            var _Motivo = this.$content.find('.name').val();
                            if(!_Motivo){
                                $.alert('Ingrese motivo');
                                return false;
                            }
                            anular( uuid , _Motivo );
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
        });
        /* ------------------------------------------------------------- */
        $('#btnAprobarR').click(function (e) { 
            e.preventDefault();
            $.confirm({
                title: 'Confirmar',
                type    : 'orange',
                content: 'Confirme aprobar documento',
                autoClose: 'Cancelar|10000',
                buttons: {
                    Confirmar: {
                        keys: [ 'enter','Y' ],
                        text : 'Confirmar (Y)',
                        btnClass: 'btn-blue',
                        action : function () {
                            aprobar();
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
        $(document).delegate('.delData', 'click', function(event) {
            event.preventDefault();
            var $id = $(this).data('id'), uuid = $(this).data('uuid') ;
            
            $.confirm({
                title: 'Anuar',
                content: '' +
                '<form action="" class="formName">' +
                '<div class="form-group">' +
                '<label>Motivo de anulación.</label>' +
                '<input type="text" class="name form-control" required />' +
                '</div>' +
                '</form>',
                buttons: {
                    formSubmit: {
                        text: 'Submit',
                        btnClass: 'btn-blue',
                        action: function () {
                            var _Motivo = this.$content.find('.name').val();
                            if(!_Motivo){
                                $.alert('Ingrese motivo');
                                return false;
                            }
                            anular( uuid , _Motivo );
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
        });
        /* ------------------------------------------------------------- */
        $('#btn_OpenFiltro').click(function (e) { 
            e.preventDefault();
            $('#mdlFitro').modal('show');
        });
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
				"format"        : "DD/MM/YYYY",
				"separator"     : " - ",
				"applyLabel"    : "Aplicar",
				"cancelLabel"   : "Cancela",
				"fromLabel"     : "desde",
				"toLabel"       : "hasta",
				"customRangeLabel": "Definir",
				"weekLabel"     : "W",
				"daysOfWeek" : [
					"Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"
				],
				"monthNames": [
					"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
				],
				"firstDay": 1
            },
        }, function(start, end, label) {
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
        var $eventcboCliente = $('#cboCliente').select2({
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
        $eventcboCliente.on("select2:select", function (e) { 
            var Texto = e.params.data.text, IdClienteProv = e.params.data.id;
            $('#frmDocumento #Cliente').val(Texto);
            getLocales_src( IdClienteProv );
        });
        /* ------------------------------------------------------------- */
        $('#cboLocal').select2({
            width : '100%'
        });
        /* ------------------------------------------------------------- */
        var $eventcboSupervisor = $('#cboSupervisor').select2({
            ajax: {
                url: _URL_NODE3+'/api/src/usuarios_select2/',
                dataType : 'json',
                data     : function (params) {
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
        $('#btnBuscar').click(function (e) { 
            e.preventDefault();
            buscarData();
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
function renovarToken_Item()
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
    $('#frmDetalle #uu_id').val( result );   
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
}
/* ------------------------------------------------------------- */
function populateImg( json )
{
    var _html = ``;
    if( json )
    {
        $.each( json , function( key, rs ) {
            _html += `<div class="col-xs-6 col-md-3 col-lg-2 " >
                <a data-fancybox="gallery" href="${rs.url}" class="thumbnail" >
                    <img src="${rs.url}" alt="${rs.nombre_archivo}" />
                </a>
            </div>`;
		});
    }
    $('#wrapper_imgs').html( _html );
}
/* ------------------------------------------------------------- */
function guardar()
{
    // Guardamos los datos.
    var _Glosa2 = CKEDITOR.instances.Glosa2.getData();
    $('#frmDocumento #Glosa').val( _Glosa2 );
    // - //
    var url = `${_URL_NODE3}/api/bitacora_supervisor`, metodo = `POST`;
    // - //
    var _dataSerializada = $('#frmDocumento').serialize();
    var Id = parseInt( $('#frmDocumento #id').val() ),uu_id = $('#frmDocumento #uu_id').val()
    if( Id > 0 ){
        url = `${_URL_NODE3}/api/bitacora_supervisor/${uu_id}`;
        metodo = `PUT`;
    }
    //
    $('#frmDocumento').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : url,
        method  : metodo,
        data    : _dataSerializada,
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
                $('#frmDocumento #id').val( json.item.id );
                $('#frmDocumento #Codigo').val( json.item.Codigo );
                msgBox2( 'Correcto' , 'Se guardaron los datos' , 'green' );
            break;
        }
    })
    .fail(function(xhr, status, error) {
        capturaError( xhr );
        $('#frmDocumento').waitMe('hide');
    })
    .always(function() {
        $('#frmDocumento').waitMe('hide');
    });
    //    
}
/* ------------------------------------------------------------- */
function getAll()
{
    //
    $('#wrapperTable').waitMe({
    effect  : 'facebook',
    text    : 'Espere...',
    bg      : 'rgba(255,255,255,0.7)',
    color   : '#146436',fontSize:'20px',textPos : 'vertical',
    onClose : function() {}
    });
    $.ajax({
        url     : `${_URL_NODE3}/api/bitacora_supervisor`,
        method  : "GET",
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
            alert(json.error);
        break;
        case 'OK':
            var $jsonData = populateCC( json );
            table.clear();
            table.rows.add($jsonData).draw();
        break;
    }
    })
    .fail(function(xhr, status, error) {
        capturaError( xhr );
        $('#wrapperTable').waitMe('hide');
    })
    .always(function() {
        $('#wrapperTable').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function populateCC( json )
{
	//
	var $data = [], $CSGO = 1;
	if( json.data != undefined ){
        $.each( json.data , function( key, value ) {
            var $o = [];
            $o.push(`<button data-id="${value.id}" data-nombre="${value.Supervisor}" data-uuid="${value.uu_id}" type="button" class=" openDoc btn btn-block btn-primary btn-xs" ><i class="fa fa-edit " ></i></button>`);
            switch(value.Estado){
                case 'Activo':
                    $o.push(`<button data-id="${value.id}" data-nombre="${value.Supervisor}" data-uuid="${value.uu_id}" type="button" class=" delData btn btn-block btn-danger btn-xs"  ><i class="fa fa-trash " ></i></button>`);
                break;
                case 'Aprobado':
                    $o.push(`<button data-id="${value.id}" data-nombre="${value.Supervisor}" data-uuid="${value.uu_id}" type="button" class=" delData btn btn-block btn-danger btn-xs"  ><i class="fa fa-trash " ></i></button>`);
                break;
                case 'Anulado':
                    $o.push(``);
                break;
            }

            $o.push(value.Codigo);
            $o.push(value.Cliente);
            $o.push(value.Local);
            var $fecha = moment( value.Fecha ).format('DD/MM/YYYY');
            $o.push($fecha);
            // Estado.
            var _gtml = ``;
            switch(value.Estado){
                case 'Activo':
                    _gtml = `<span class="badge bg-light-blue">${value.Estado}</span>`;
                break;
                case 'Aprobado':
                    _gtml = `<span class="badge bg-green">${value.Estado}</span>`;
                break;
                case 'Anulado':
                    _gtml = `<span class="badge bg-red">${value.Estado}</span>`;
                break;
            }
            $o.push(_gtml);

            $o.push(value.Supervisor);
            var $fecha = moment( value.updatedAt ).format('DD/MM/YYYY h:mm a');
            $o.push($fecha);
            //
            $data.push( $o );
            $CSGO++;
        });
	}
	//
	return $data;
}
/* ------------------------------------------------------------- */
function cargarDoc( uuid )
{
    $('#frmDocumento').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : `${_URL_NODE3}/api/bitacora_supervisor/get_data`,
        method  : "POST",
        data    : { 'uuid' : uuid },
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
            // negocio...
            var rs = json.data;
            if( json.data != undefined ){
                $.each( json.data , function( key, value ) {
                    $('#frmDocumento #'+key).val(value);
                });
                CKEDITOR.instances.Glosa2.setData( json.data.Glosa );
                // 
                var _htmlE = '';
                switch( rs.Estado ){
                    case 'Activo':
                        _htmlE = `<div class="alert alert-info alert-dismissible"><h4><i class="icon fa fa-info"></i> ${rs.Estado}</h4></div>`;
                    break;
                    case 'Aprobado':
                        _htmlE = `<div class="alert alert-success alert-dismissible"><h4><i class="icon fa fa-check"></i> ${rs.Estado}</h4></div>`;
                    break;
                    case 'Anulado':
                        _htmlE = `<div class="alert alert-danger alert-dismissible"><h4><i class="icon fa fa-ban"></i> ${rs.Estado}</h4>${rs.MotivoAnulacion}</div>`;
                    break;
                    default:
                        _htmlE = `_nada_`;
                    break;
                }
                $('#frmDocumento #wrappeer_Estado').html(_htmlE);
                // Cliente
                $('#frmDocumento #IdCliente').html(`<option value="${rs.IdCliente}" >${rs.Cliente}</option>`);
                $('#frmDocumento #IdCliente').trigger('change');
                // Sucursal
                _Sucursales = json.locales;
				if( json.locales != undefined )
                {
					var _html = '<option value="" >Todos</option>';
					$.each( json.locales , function( key, value ) {
                        _html += '<option value="'+value.IdSucursal+'" >'+value.IdSucursal+'-'+value.Descripcion+'</option>'; 
                    });
					$('#frmDocumento #IdLocal').html( _html );
                    $('#frmDocumento #IdLocal').val( rs.IdLocal );
                    $('#frmDocumento #IdLocal').trigger('change');
				}
                // Archivos
                populateImg( json.files );
            }
            
        break;
        }
    })
    .fail(function(xhr, status, error) {
        capturaError( xhr );
        $('#frmDocumento').waitMe('hide');
    })
    .always(function() {
        $('#frmDocumento').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function aprobar()
{
    //
    $('#frmDocumento').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    var _dataS = { 'uuid' : $('#frmDocumento #uu_id').val() };
    $.ajax({
        url     : `${_URL_NODE3}/api/bitacora_supervisor/aprobar`,
        method  : "POST" ,
        data    : _dataS ,
        dataType: "json" ,
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
                // negocio...
                if( json.found == 'NO' ){
                    msgBox2( 'Error' , 'No se puede aprobar el documento.' , 'red' );
                    return true;
                }else{
                    msgBox2( 'Correcto' , 'Se aprobó el documento.' , 'green' );
                }
            break;
        }
    })
    .fail(function(xhr, status, error) {
        // capturaError( xhr );
        $('#frmDocumento').waitMe('hide');
    })
    .always(function() {
        $('#frmDocumento').waitMe('hide');
    });
    //
}
/* ------------------------------------------------------------- */
function anular( uuid , Motivo )
{
    //
    $('#frmDocumento').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    //
    var _dataS = { 'uuid' : uuid , 'Motivo' : Motivo };
    //
    $.ajax({
        url     : `${_URL_NODE3}/api/bitacora_supervisor/anular`,
        method  : "POST" ,
        data    : _dataS ,
        dataType: "json" ,
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
                // negocio...
                if( json.found == 'NO' ){
                    msgBox2( 'Error' , 'No se puede anular el documento.' , 'red' );
                    return true;
                }else{
                    msgBox2( 'Correcto' , 'Se anuló el documento.' , 'green' );
                }
            break;
        }
    })
    .fail(function(xhr, status, error) {
        // capturaError( xhr );
        $('#frmDocumento').waitMe('hide');
    })
    .always(function() {
        $('#frmDocumento').waitMe('hide');
    });
    //
}
/* ------------------------------------------------------------- */
function getLocales_src( IdClienteProv )
{
	$('body').waitMe({
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
					$('#cboLocal').html( _html );
                    $('#cboLocal').trigger('change');
				}
			break;
		}
	})
	.fail(function(xhr, status, error) {
		capturaError( xhr );
		$('body').waitMe('hide');
	})
	.always(function() {
		$('body').waitMe('hide');
	});
}
/* ------------------------------------------------------------- */
function buscarData()
{
    $('#wrapperTable').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    var _dataBuscar = {
        Inicio  : _FechaInic_DRP ,
        Fin     : _FechaFin_DRP ,
        IdCliente : $('#cboCliente').val() ,
        IdLocal : $('#cboLocal').val() ,
        IdSuper : $('#cboSupervisor').val() ,
        Id : ''
    };
    $.ajax({
        url     : `${_URL_NODE3}/api/bitacora_supervisor/buscar`,
        method  : "POST",
        data    : _dataBuscar ,
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
        capturaError( xhr );
        $('#wrapperTable').waitMe('hide');
    })
    .always(function() {
        $('#wrapperTable').waitMe('hide');
        $('#mdlFitro').modal('hide');
    });
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
