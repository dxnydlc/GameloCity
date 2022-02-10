
/* ------------------------------------------------------------- */
var  _AuthFormulario = 'AeraDiv';
/* ------------------------------------------------------------- */
var table;
/* ------------------------------------------------------------- */
var _urlServicio = `${_URL_NODE3}/api/apoyo_data/`;
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
            $('#frmDocumento #lblTitulo').html(`Nuevo area/division`);
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
            $('#frmDocumento #Flag').val(`AREA_DIV`);
            $('#frmDocumento #Codigo').val(0);
            $('#frmDocumento #id').val(0);
            renovarToken( '#frmDocumento #uu_id' );
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.cerrarFrame','click',function(e){
            e.preventDefault();
            $('a[href="#tabHome"]').tab('show');
        });
        /* ------------------------------------------------------------- */
        table = $('#wrapperTable').DataTable({
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
        });
        /* ------------------------------------------------------------- */
        $("#btnGuardar").on( "click", function(e) {
            e.preventDefault();
            guardar();
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
            cargarDoc( uuid );
            //
        });
        /* ------------------------------------------------------------- */
        $("#btn_OpenFiltro").on( "click", function() {
            e.preventDefault();
            $('#mdlFiltro').modal('show');
        });
        /* ------------------------------------------------------------- */
        $(document).delegate( '.delData', 'click',function (e) { 
            e.preventDefault();
            var uuid = $(this).data('uuid'),id = $(this).data('id'), _Cod = $(this).data('cod');
            $.confirm({
                title: 'Confirmar',
                type    : 'orange',
                content: 'Confirme anular documento Nro. '+_Cod,
                autoClose: 'Cancelar|10000',
                buttons: {
                    Confirmar: {
                        keys: [ 'enter','Y' ],
                        text : 'Confirmar (Y)',
                        btnClass: 'btn-blue',
                        action : function () {
                            anularDoc( uuid );
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
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
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
}
/* ------------------------------------------------------------- */
function guardar()
{
    // Guardamos los datos.
    // - //
    var url = _urlServicio, metodo = `POST`;
    // - //
    var _dataSerializada = $('#frmDocumento').serialize();
    var Id = parseInt( $('#frmDocumento #id').val() ),uu_id = $('#frmDocumento #uu_id').val()
    if( Id > 0 ){
        url = `${_urlServicio}/${uu_id}`;
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
                getAll();
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
    //
    $('#wrapperTable').waitMe({
    effect  : 'facebook',
    text    : 'Espere...',
    bg      : 'rgba(255,255,255,0.7)',
    color   : '#146436',fontSize:'20px',textPos : 'vertical',
    onClose : function() {}
    });
    $.ajax({
        url     : `${_urlServicio}/AREA_DIV`,
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
            $o.push(`<button data-id="${value.id}" data-nombre="${value.Descripcion}" data-uuid="${value.uu_id}" type="button" class=" openDoc btn btn-block btn-primary btn-xs Gaaa " ><i class="fa fa-edit " ></i></button>`);
            switch(value.Estado){
                case 'Digitado':
                    $o.push(`<button data-id="${value.id}" data-nombre="${value.Descripcion}" data-uuid="${value.uu_id}" data-cod="${value.Codigo}" type="button" class=" delData btn btn-block btn-danger btn-xs"  ><i class="fa fa-trash " ></i></button>`);
                break;
                case 'Aprobado':
                    $o.push(`<button data-id="${value.id}" data-nombre="${value.Descripcion}" data-uuid="${value.uu_id}" data-cod="${value.Codigo}" type="button" class=" delData btn btn-block btn-danger btn-xs"  ><i class="fa fa-trash " ></i></button>`);
                break;
                case 'Anulado':
                    $o.push(``);
                break;
            }

            $o.push(value.Codigo);
            $o.push(value.Descripcion);

            // Estado.
            var _gtml = ``;
            switch(value.Estado){
                case 'Digitado':
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
        url     : `${_urlServicio}/get_data`,
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
function anularDoc( uuid )
{
    $('#frmDocumento').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : `${_urlServicio}/${uuid}`,
        method  : "DELETE",
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
            // negocio...
            msgBox2( 'Correcto' , 'Documento anulado correctamente' , 'green' );
            getAll();
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
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */