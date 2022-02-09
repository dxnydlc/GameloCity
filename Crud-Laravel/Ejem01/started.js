
/* ------------------------------------------------------------- */
var  _AuthFormulario = 'VENTA-RESUMEN-BOLETA';
/* ------------------------------------------------------------- */
var table;
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
        $('#btnBuscar').click(function (e) { 
            e.preventDefault();
            buscar();
        });
        /* ------------------------------------------------------------- */
        $('#btnCrear').click(function (e) { 
            e.preventDefault();
            $('#frmDocumento #lblTitulo').html(`Nuevo resumen de boletas`);
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
            renovarTokenG( '#frmDocumento #uu_id' );
        });
        /* ------------------------------------------------------------- */
        $('#btnCerrarForm').click(function (e) { 
            e.preventDefault();
            $('#home-tab').trigger('click');
        });
        /* ------------------------------------------------------------- */
        table = $('#tblDatos').DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [
              [25, 50, 100],
              [25, 50, 100]
            ],
            "searching" : true,
            "order"     : [[ 0, "desc" ]],
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
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
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
