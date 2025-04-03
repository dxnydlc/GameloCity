
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
let _AuthFormulario = `FORMULARIO_PLANTILLA`;
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
let urlServicio = `${_URL_NESTMy}v1/aaaaaa`;
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
let xIp = ``;
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
let TablaHomePs;
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
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
        // TECLAS ESPECIALES
        $(document).keydown(function(event) {
            //Tecla CTRL presionada
            if (!event.ctrlKey){ return true; }
            let letra = String.fromCharCode(event.which);
            letra = letra.toUpperCase();
            switch ( letra ) {
                case 'Q':
                    if( confirm('¿Cerrar documento?') ){
                        $('#wrapper_form').hide();
                        $('#wrapperTable').fadeIn('slow');
                        //$('#wrapperTabla').show();
                        //$('#frmDocumento').hide();
                        event.preventDefault();
                    }
                    break;
            
                default:
                    break;
            }
            // $("#result").text(String.fromCharCode(event.which));
            
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $("#btnOpenFiltro").on( "click", function(e) {
            e.preventDefault();
            $('#wrapperTable').fadeOut('slow');
            $('#wrapper_filtro').fadeIn('slow');
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $('#btnCrearNuevo').click(function (e) { 
            e.preventDefault();

            $('#wrapperTable').fadeOut('slow');
            $('#wrapper_form').fadeIn('slow');

            crearNuevo();
            
            //tblDetalle.columns.adjust().draw();
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $("#btnCerarFiltro").on( "click", function(e) {
            e.preventDefault();
            $('#wrapper_filtro').fadeOut('slow');
            $('#wrapperTable').fadeIn('slow');
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $(document).delegate('#btnCerrarForm','click',function(e){
            e.preventDefault();

            $('#wrapper_form').fadeOut('slow');
            $('#wrapperTable').fadeIn('slow');

            table.columns.adjust().draw();
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $(document).delegate('#btnCerrarForm2','click',function(e){
            e.preventDefault();

            $('#wrapper_form').fadeOut('slow');
            $('#wrapperTable').fadeIn('slow');

            table.columns.adjust().draw();
        });
        /* ------------------------------------------------------------- */
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
        /* ------------------------------------------------------------- */
        TablaHomePs = $('#TablaHomePs').DataTable({
            pagingType : "full_numbers",
            lengthMenu : [
                [ 100 , 200, 200 ],
                [ 100 , 200, 200 ],
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
            "searching" : false,
            "order"     : [[ 2, "desc" ]],
            "scrollX"   : true,
            language : optsLangDatatable,
            dom: "<'row'<'col-sm-3'l><'col-sm-3'f><'col-sm-6'p>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
            "initComplete": function(settings, json) {
                //
            },
            createdRow : function (row, data, rowIndex) {
                
                //
                
            },
            /* columns : [
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
            ], */
        });
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
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $("#btnPrint").on( "click", function(e) {
            e.preventDefault();
            // ******* NODE JS *******
            socket.emit('accion:audit',{
                user  : $nomU,
                msg   : `EVENTO |> ${xIp}` ,
                dni   : $dniU,
                serie : 0,
                corr  : 0,
                form  : _AuthFormulario,
                url   : window.location.href,
                token : ''
            });
            // ******* NODE JS *******
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $("#btnAnular").on( "click", function(e) {
            e.preventDefault();
            $.confirm({
                title   : 'Confirmar',
                type    : 'orange',
                content : `Confirme eliminar documento` ,
                autoClose: 'Cancelar|10000',
                buttons: {
                    Confirmar: {
                        keys: [ 'enter','Y' ],
                        text : 'Confirmar (Y)',
                        btnClass: 'btn-blue',
                        action : function () {
                            //
                            // ******* NODE JS *******
                            socket.emit('accion:audit',{
                                user  : $nomU,
                                msg   : `EVENTO |> ${xIp}` ,
                                dni   : $dniU,
                                serie : 0,
                                corr  : 0,
                                form  : _AuthFormulario,
                                url   : window.location.href,
                                token : ''
                            });
                            // ******* NODE JS *******
                            //
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
        $("#btnAprobar").on( "click", function(e) {
            e.preventDefault();
            // ******* NODE JS *******
            socket.emit('accion:audit',{
                user  : $nomU,
                msg   : `EVENTO |> ${xIp}` ,
                dni   : $dniU,
                serie : 0,
                corr  : 0,
                form  : _AuthFormulario,
                url   : window.location.href,
                token : ''
            });
            // ******* NODE JS *******
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $("#btnNuevoDoc").on( "click", function(e) {
            e.preventDefault();

            crearNuevo();

            // ******* NODE JS *******
            socket.emit('accion:audit',{
                user  : $nomU,
                msg   : `EVENTO |> ${xIp}` ,
                dni   : $dniU,
                serie : 0,
                corr  : 0,
                form  : _AuthFormulario,
                url   : window.location.href,
                token : ''
            });
            // ******* NODE JS *******
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $("#btnGuardar").on( "click", function(e) {
            e.preventDefault();
            // ******* NODE JS *******
            socket.emit('accion:audit',{
                user  : $nomU,
                msg   : `EVENTO |> ${xIp}` ,
                dni   : $dniU,
                serie : 0,
                corr  : 0,
                form  : _AuthFormulario,
                url   : window.location.href,
                token : ''
            });
            // ******* NODE JS *******
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
    });

})(jQuery);
/* ------------------------------------------------------------- */
function initOrq(){
    //
    getIP();
    //
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function crearNuevo()
{
    //
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
    let uuID = generateUUID();
    $( '#frmDocumento #uu_id' ).val( uuID );
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
async function getIP()
{
    let ipFin = ``;
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        //document.getElementById('ip').innerText = `Your IP Address: ${data.ip}`;
        xIp = `${data.ip}`;
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
    return ipFin;
}
/* ------------------------------------------------------------- */
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
/* ------------------------------------------------------------- */