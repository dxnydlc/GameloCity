
@extends('layouts.principal')

@section('titulo')
Requisicion
@endsection



@section('losCSS')

<!-- SweetAlert -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>

<style type="text/css">

.swal2-popup {
    font-size: 1.6rem !important;
}
.form-control  input[type="text"]{
    padding: 3px 3px !important;
    height: 27px !important;
}
.form-group {
    margin-bottom: 6px !important;
}
.wdt-100{
    width: 100% !important;
    max-width: 100px;
}
.h1, .h2, .h3, h1, h2, h3{
    margin-bottom: 5px !important;
    margin-top: 5px !important;
}
.panel-primary {
    border-color: #3d784d;
}
.panel-primary>.panel-heading {
    color: #fff;
    background-color: #3d784d;
    border-color: #3d784d;
}
.panel-heading {
    padding: 1px 9px;
}
.list-inline>li{
    padding-bottom: 10px;
}
.table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th{
    padding: 2px !important;
}

</style>

@endsection

@section('content')
<!-- Content Header (Page header) -->
<section class="content-header">
    <h1>
        Registro de Requisicion
        <small>todos los documentos generados</small>
    </h1>
    <ol class="breadcrumb">
        <li><a href="{{ url('home') }}"><i class="fa fa-dashboard"></i> Inicio</a></li>
        <li><a href="#">Procesos</a></li>
        <li class="active">Requisicion</li>
    </ol>
</section>


<!-- Main content -->
<section class="content"  >
    <div>
        <!-- Nav tabs -->
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active">
                <a href="#tabHome" aria-controls="tabHome" role="tab" data-toggle="tab">Busqueda</a>
            </li>
            <li role="presentation">
                <a href="#tabDoc" aria-controls="tabDoc" role="tab" data-toggle="tab">Documento</a>
            </li>
        </ul>
        <hr/>
        <!-- ################################################################### -->
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="tabHome" >
                <div class=" row " >
                    <!-- ./col -->
                    <div class=" col-lg-12 col-md-12 " >
                        <div class="box box-success " >
                        <div class="box-header with-border">
                            <h3 class="box-title">Resultado</h3>
                        </div>
                            <!-- /.box-header -->
                            <div class="box-body" id="homeWrapper" >
                                <div class="row">
                                    <div class=" col-lg-2 col-md-2 " >
                                        <a href="#" class="btn btn-primary btn-block pull-left " id="btnOpen_SRC" ><i class="fa fa-search"></i> Filtro</a>
                                    </div>
                                    <!-- ./col -->
                                    <div class=" col-lg-8 col-md-8 " ></div>
                                    <!-- ./col -->
                                    <div class=" col-lg-2 col-md-2 " >
                                        <a id="btnCrear" href="#" class="btn btn-primary btn-block pull-right " data-id="0" ><i class="icofont-plus"></i> Crear</a>
                                    </div>
                                    <!-- ./col -->
                                </div>
                                <hr>
                                <table class=" table table-hover cell-border compact hover nowrap row-border table-striped table-hover " id="wrapperTable" cellspacing="0" width="100%" style="width:100%">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th># Req.</th>
                                            <th>Cliente</th>
                                            <th>Sucursal</th>
                                            <th>Mes</th>
                                            <th>Fec.Req.</th>
                                            <th>% Acum.</th>
                                            <th>T.Prod</th>
                                            <th>#Guia</th>
                                            <th>#Items</th>
                                            <th>Estado</th>
                                            <th>Actualizado</th>
                                            <th>Creado por</th>
                                            <th>Aprobado por</th>
                                            <th>Anulado por</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead> 
                                    <tbody></tbody>
                                </table>
                            </div>
                        <!-- ./box-body -->
                        <div class="box-footer" >
                            <div id="botones"></div>
                        </div>
                        <!-- ./box-footer -->
                        </div>
                    </div>
                    <!-- ./col -->
                </div>
                <!-- ./row -->
            </div>
            <!-- &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& -->
            <div role="tabpanel" class="tab-pane" id="tabDoc">
                <!-- Formulario -->
                @include('requisicion.frmRequisicion')
                <!-- /Formulario -->
            </div>
        </div>
        <!-- ################################################################### -->
    </div>

</section>

<a href="#" id="makeIDConcar" >_</a>


<!-- Formulario -->
@include('requisicion.modelRequisicion')
<!-- /Formulario -->


@endsection

@section('scripts')

<script src="https://cdn.datatables.net/buttons/1.5.2/js/dataTables.buttons.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js" ></script>
<script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.html5.min.js" ></script>
<script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.print.min.js" ></script>

<script src="https://momentjs.com/downloads/moment.min.js"></script>

<!-- SweetAlert -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.min.js"></script>

<script src="{{ asset('plugins/select2-4.0.6-rc.1/dist/js/select2.full.js') }}"></script>

<script type="text/javascript">
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
//
(function($){
	$(document).ready(function()
		{
        /* ------------------------------------------------------------- */
        getAll();
        getTC();
        /* ------------------------------------------------------------- */
        table = $('#wrapperTable').DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [
                [25, 50, 100],
                [25, 50, 100]
            ],
            "searching" : true,
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
        tblDetalle = $('#tblDetalle').DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [
                [15, 20, 100],
                [15, 20, 100]
            ],
            "searching" : true,
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
        var buttons = new $.fn.dataTable.Buttons(tblDetalle, {
            buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdfHtml5'
            ]
        }).container().appendTo($('#botonesDetalle'));
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $('#btnCrear').click(function (e) { 
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
            $('#frmDocumento #IdRequisicion').val(0);
            $('#frmDocumento #wrappeer_Estado').val('');
            $('#frmDocumento #TipoCambio').val(_TipoCambio);
            $('#frmDocumento #Porcentaje').val(0);
            $('#frmDocumento #Atendido').val(0);
            $('#frmDocumento #NroItemsDetalle').val(0);
            $('#frmDocumento #TotalDetalle').val(0);
            $('#frmDocumento #TipoServicio').val('');
            $('#frmDocumento #Anio').val('{{ ANIO }}');
            $('#frmDocumento #Fecha').val('{{ FECHA_MYSQL }}');
            $('#frmDocumento #TE_MiProgreso').css({'width':'0%'})
            $('#frmDocumento #TE_MiProgreso').html(0);
            $('#frmDocumento #TE_MiProgreso').attr('aria-valuenow',0);
            tblDetalle.clear();
            tblDetalle.rows.add([]).draw();
            _Sucursales = [];
            _ItemsReq = [];
            itemsConcar = [];
            _indexItemConcar = 0;
            $('#frmDocumento #IdClienteProv').html(``);
            $('#frmDocumento #IdClienteProv').trigger('change');
            $('#frmDocumento #IdSucursal').html(``);
            $('#frmDocumento #IdSucursal').trigger('change');
            $('#frmDocumento #mdlInTitulo').html(`Crear nueva requisición`);
            $('#frmDocumento #MesCorrsp').val( _ArrMeses[_NroMes] );
            renovarToken();
            // tblDetalle.columns.adjust().draw();
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.delData', 'click', function(event) {
            event.preventDefault();
            var $id = $(this).data('id'), uuid = $(this).data('uuid'), nombre = $(this).data('nombre');
            
            Swal.fire({
                title: 'Confirmar',
                text: "Anular requisición Nro: "+nombre,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, anular'
            }).then((result) => {
                if (result.isConfirmed) {
                    var motivo = prompt("Ingrese un motivo");
                    console.log(motivo);
                    if(! motivo ){
                        Swal.fire('Ingrese un motivo');
                        return true;
                    }
                    anularRequi(uuid , motivo , nombre);
                }
            });
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.cerrarFrame','click',function(e){
            e.preventDefault();
            $('a[href="#tabHome"]').tab('show');
        });
        /* ------------------------------------------------------------- */
        $('#frmDocumento #btnGuardar').click(function (e) { 
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
        $('#btnOpen_SRC').click(function (e) { 
            e.preventDefault();
            $('#mdlSRC').modal('show');
        });
        /* ------------------------------------------------------------- */
        $('#btnBuscar').click(function (e) { 
            e.preventDefault();
            buscar();
        });
        /* ------------------------------------------------------------- */
        var $eventCliente = $('#frmDocumento #IdClienteProv').select2({
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
        $eventCliente.on("select2:select", function (e) { 
            var Razon = e.params.data.Razon, IdClienteProv = e.params.data.id, IdCentro = e.params.data.IdCentro, centro_costos = e.params.data.centro_costos, CodContaCC = e.params.data.CodContaCC;
            $('#frmDocumento #IdCentro').val(IdCentro);
            $('#frmDocumento #Centro_costos').val(centro_costos);
            $('#frmDocumento #CodContaCC').val(CodContaCC);
            console.log( IdCentro , centro_costos , CodContaCC );
            $('#frmDocumento #Cliente').val(Razon);
            getLocales( IdClienteProv );
        });
        /* ------------------------------------------------------------- */
        var $eventSucursal = $('#frmDocumento #IdSucursal').select2({
            width : '100%'
        });
        /* ------------------------------------------------------------- */
        $eventSucursal.on("select2:select", function (e) { 
            var IdConcar = parseInt(e.params.data.id), TipoDoc = $('#frmDocumento #TipProducto').val();
            $.each( _Sucursales , function( key, rs ) {
                if( rs.IdConcar == IdConcar ){
                    $('#frmDocumento #Sucursal').val(rs.Descripcion);
                    $('#frmDocumento #DireccionDestino').val(rs.Direccion);
                    // Ubigeo
                    $('#frmDocumento #IdUbigeo').val(rs.IdUbigeo);
                    $('#frmDocumento #Departamento').val(rs.Departamento);
                    $('#frmDocumento #Provincia').val(rs.Provincia);
                    $('#frmDocumento #Distrito').val(rs.Distrito);
                    switch (TipoDoc) {
                        case 'MATERIALES':
                            $('#frmDocumento #MontoMax').val(rs.MontoMax);
                        break;
                        case 'IMPLEMENTOS':
                            $('#frmDocumento #MontoMax').val(rs.MontoImplementos);
                        break;
                        case 'INDUMENTARIA/EPPS':
                            $('#frmDocumento #MontoMax').val(rs.MontoIndumentarias);
                        break;
                        case 'MAQUINARIAS Y EQUIPOS':
                            $('#frmDocumento #MontoMax').val(0);
                        break;
                        case 'INSUMOS Y OTROS':
                            $('#frmDocumento #MontoMax').val(0);
                        break;
                        case 'LINEA INSTITUCIONAL':
                            $('#frmDocumento #MontoMax').val(rs.MontoLineaInstitucional);
                        break;
                        default:
                            $('#frmDocumento #MontoMax').val(rs.MontoMax);
                        break;
                    }
                }
            });
        });
        /* ------------------------------------------------------------- */
        var $eventClienteSRC = $('#mdlSRC #cboCliente').select2({
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
        $eventClienteSRC.on("select2:select", function (e) { 
            var IdClienteProv = e.params.data.id;
            getLocales_src( IdClienteProv );
        });
        /* ------------------------------------------------------------- */
        $('#mdlSRC #cboSucursal').select2({
            width : '100%'
        });
        /* ------------------------------------------------------------- */
        var $eventSRC_Arti = $('#mdlSRC #srcArticulo').select2({
            ajax: {
                url: _URL_NODE3+'/api/src/select2_articulos/',
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
        var $eventRecepciona = $('#frmDocumento #Recepciona').select2({
            ajax: {
                url: _URL_NODE3+'/api/src/usuarios_select2/',
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
        $eventRecepciona.on("select2:select", function (e) { 
            var Recepciona = e.params.data.text;
            $('#frmDocumento #NombreRecepciona').val(Recepciona);
        });
        /* ------------------------------------------------------------- */
        $('#btnOpenItems').click(function (e) { 
            e.preventDefault();
            limpiarItem();
            $('#mdlArticulos').modal('show');
        });
        /* ------------------------------------------------------------- */
        $('#btnNuevoProdi').click(function (e) { 
            e.preventDefault();
            limpiarItem();
            $("#frmDetalle #IdArticulo").select2('open');
            $(".select2-search__field")[0].focus();
        });
        /* ------------------------------------------------------------- */
        var $eventArticulos = $('#frmDetalle #IdArticulo').select2({
            ajax: {
                url: _URL_NODE3+'/api/src/select2_articulos/',
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
        $eventArticulos.on("select2:select", function (e) { 
            var IdArticulo = e.params.data.id , UnidadMedida = e.params.data.UnidadMedida,Precio = e.params.data.Precio,Articulo = e.params.data.text;
            $('#frmDetalle #Articulo').val(Articulo);
            $('#frmDetalle #UnidadMedida').val(UnidadMedida);
            $('#frmDetalle #CostoUnit').val(Precio);
            setTimeout(function(){ $('#frmDetalle #Cantidad').trigger('focus'); $('#frmDetalle #Cantidad').select(); }, 300 );
            $('#frmDetalle #btnAddProdi').show();
            // Ya existe ¿?
            $.each( _ItemsReq , function( key, rs ) {
                if( IdArticulo == rs.IdArticulo ){
                    console.log('Existe');
                    $('#frmDetalle #lblArticulo').html(`El artículo ya existe en la lista`);
                    $('#frmDetalle #btnAddProdi').hide();
                    return true;
                }else{
                    console.log('NO Existe');
                }
            });
            //
        });
        /* ------------------------------------------------------------- */
        $('#mdlArticulos').on('shown.bs.modal', function (e) {
            // Pre seleccionar un combo select2
            $("#frmDetalle #IdArticulo").select2('open');
            $(".select2-search__field")[0].focus();
        });
        /* ------------------------------------------------------------- */
        $("input[type='text']").click(function () {
            $(this).select();
        });
        /* ------------------------------------------------------------- */
        $('#frmDetalle #Cantidad').change(function(e){
            var Cantidad = parseFloat( $('#frmDetalle #Cantidad').val() ), CostoUnit = parseFloat($('#frmDetalle #CostoUnit').val());
            if( Cantidad <= 0 ){
                alert('Cantidad inválida');
                return true;
            }
            var Total = Cantidad * CostoUnit;
            $('#frmDetalle #Total').val( Total );
        });
        /* ------------------------------------------------------------- */
        $('#frmDetalle #CostoUnit').change(function(e){
            var Cantidad = parseFloat( $('#frmDetalle #Cantidad').val() ), CostoUnit = parseFloat($('#frmDetalle #CostoUnit').val());
            if( Cantidad <= 0 ){
                alert('Cantidad inválida');
                return true;
            }
            var Total = Cantidad * CostoUnit;
            $('#frmDetalle #Total').val( Total );
        });
        /* ------------------------------------------------------------- */
        $('#frmDetalle #TipProducto').change(function(e){
            var _data = $('#frmDetalle #TipProducto').val();
            $('#frmDetalle #TipoProducto').val(_data);
        });
        /* ------------------------------------------------------------- */
        $('#btnAddProdi').click(function (e) { 
            e.preventDefault();
            guardarItem();
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.editItem', 'click', function(event) {
            event.preventDefault();
            var $id = $(this).data('id'), uuid = $(this).data('uuid'), $nombre = $(this).data('nombre');
            cargarItem( uuid )
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.delItem', 'click', function(event) {
            event.preventDefault();
            var $id = $(this).data('id'), uuid = $(this).data('uuid'), $nombre = $(this).data('nombre');
            Swal.fire({
                title: 'Confirmar',
                text: "Eliminar articulo : "+$nombre,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar'
            }).then((result) => {
                if (result.isConfirmed) {
                    EliminarItem( uuid );
                }
            });
        });
        /* ------------------------------------------------------------- */
        $('#btnGuardarR').click(function (e) { 
            e.preventDefault();
            var NroItemsDetalle = parseInt( $('#frmDocumento #NroItemsDetalle').val() );
            if( NroItemsDetalle == 0 ){
                Swal.fire('Debes ingresar al menos un item');
                return true;
            }
            var CodContaCC = $('#frmDocumento #CodContaCC').val();
            if( CodContaCC == '' ){
                Swal.fire('Este cliente no cuenta con centro de costos, comunicar al área comercial.');
                return true;
            }
            guardar();
            //makeReqConcar();
        });
        /* ------------------------------------------------------------- */
        $('#btnAnularR').click(function (e) { 
            e.preventDefault();
            var IdReq = $('#frmDocumento #IdRequisicion').val();
            var uuid = $('#frmDocumento #uu_id').val();
            
            Swal.fire({
                title: 'Confirmar',
                text: "Anular requisición Nro: "+IdReq,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, anular'
            }).then((result) => {
                if (result.isConfirmed) {
                    var motivo = prompt("Ingrese un motivo");
                    console.log(motivo);
                    if(! motivo ){
                        Swal.fire('Ingrese un motivo');
                        return true;
                    }
                    anularRequi(uuid , motivo , IdReq);
                }
            });
        });
        /* ------------------------------------------------------------- */
        $('#btnAprobarR').click(function (e) { 
            e.preventDefault();
            var IdReq = $('#frmDocumento #IdRequisicion').val();
            var uuid = $('#frmDocumento #uu_id').val();
            Swal.fire({
                title: 'Confirmar',
                text: "Aprobar requisición Nro: "+IdReq,
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#09801d',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, aprobar'
            }).then((result) => {
                if (result.isConfirmed) {
                    aprobarRequi( uuid );
                }
            });
        });
        /* ------------------------------------------------------------- */
        $('#makeIDConcar').click(function (e) { 
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
    });
})(jQuery);
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
        url     : `${_URL_NODE3}/api/requisicion`,
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
function populateCC( json )
{
	//
	var $data = [], $CSGO = 1;
	if( json.data != undefined ){
        $.each( json.data , function( key, value ) {
            var $o = [];
            $o.push($CSGO);
            $o.push(`<a href="#" data-id="${value.id}" data-uuid="${value.uu_id}" class=" openDoc " >${value.IdRequisicion}</a>`);
            $o.push(value.Cliente);
            $o.push(value.Sucursal);
            $o.push(value.MesCorrsp);
            var $fecha = moment( value.Fecha ).format('DD/MM/YYYY');
            $o.push($fecha);
            $o.push(value.Porcentaje);
            $o.push(value.TipProducto);
            $o.push(value.NroGuia);
            $o.push(value.NroItemsDetalle);

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
            $o.push(value.UsuarioMod);
            $o.push(value.UsuarioModAp);
            $o.push(value.UsuarioModAn);

            $o.push(`<button data-id="${value.id}" data-nombre="${value.IdRequisicion}" data-uuid="${value.uu_id}" type="button" class=" openDoc btn btn-block btn-primary btn-xs">Editar</button>`);
            $o.push(`<button data-id="${value.id}" data-nombre="${value.IdRequisicion}" data-uuid="${value.uu_id}" type="button" class=" delData btn btn-block btn-danger btn-xs">Anular</button>`);

            //
            $data.push( $o );
            $CSGO++;
        });
	}
	//
	return $data;
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
function guardar()
{
    // - //
    var url = `${_URL_NODE3}/api/requisicion`, metodo = `POST`;
    // - //
    var _dataSerializada = $('#frmDocumento').serialize();
    var Id = parseInt( $('#frmDocumento #id').val() ),uu_id = $('#frmDocumento #uu_id').val()
    if( Id > 0 ){
        url = `${_URL_NODE3}/api/requisicion/${uu_id}`;
        metodo = `PUT`;
    }
    $('#mdlGuardando').modal('show');
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
            alert(json.error);
            $('#frmDocumento').waitMe('hide');
            $('#mdlGuardando').modal('hide');
        break;
        case 'OK':
            _indexItemConcar = 0;
            itemsConcar = [];
            $('#lblEventos').html(`<div class="well">Guardando requisición...</div>`);
            $('#frmDocumento #id').val( json.item.id );
            console.log(json.item.IdRequisicion);
            $('#frmDocumento #IdRequisicion').val( json.item.IdRequisicion );
            _indexItemConcar = 0;
            itemsConcar      = json.detalle;
            makeReqConcar();
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
        $('#frmDocumento').waitMe('hide');
        $('#mdlGuardando').modal('hide');
    })
    .always(function() {
        //$('#frmDocumento').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function makeReqConcar()
{
    $('#mdlGuardando').modal('show');
    $('#lblEventos').html(`<div class="well">Transmitiendo a Concar...</div>`);
    // Vamos a generar el ID en cocar para usarla aqui...
    // Estado digitado [1] , Anulado [6], Aprobado [7]
    // Primero guardamos el encabezado luego los detalles...
    var dataCab = {
        "IdReq"  : $('#frmDocumento #IdRequisicion').val(),
        "Fecha"  : $('#frmDocumento #Fecha').val(),
        "CodCC"  : $('#frmDocumento #CodContaCC').val(),
        "Estado" : 1,
        "Total"  : $('#frmDocumento #TotalDetalle').val(),
        "TC"     : _TipoCambio,
        "Glosa"  : $('#frmDocumento #Glosa').val(),
        "IdCli"  : $('#frmDocumento #IdClienteProv').val(),
        "IdSuc"  : $('#frmDocumento #IdSucursal').val(),
        "Idrans" : "0001"
    }
    $.ajax({
        url     : `${_URL_CONCAR}/req/crear`,
        method  : "POST",
        data    : dataCab,
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
                _indexItemConcar = 0;
                //itemsConcar = [];
                //IdReq = parseInt( json.IdRequisicion );
                //$('#frmDocumento #IdRequisicion').val( IdReq );
                if( json.insert.success == false ){
                    alert('No se ha podido establecer comunicación con servidor Concar...');
                    $('#mdlGuardando').modal('hide');
                    return true;
                }
                //guardar();
                saveItemConcar();
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
            alert('No se ha podido establecer comunicación con servidor Concar...');
            $('#mdlGuardando').modal('hide');
        }
        $('#wrapperTable').waitMe('hide');
    })
    .always(function() {
        $('#wrapperTable').waitMe('hide');
    });
    
    
}
/* ------------------------------------------------------------- */
function syncDetalle( token , IdReq , IdOrq )
{
    // DEPRECADO *
    $.ajax({
        url     : `${_URL_NODE3}/api/requisicion/syncitems`,
        method  : "POST",
        data    : { 'IdReq' : IdReq , 'token' : token , 'Id' : IdOrq },
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
                // Ahora enviamos ese detalle al servicio de concars...
                _indexItemConcar = 0;
                itemsConcar      = json.data;
                saveItemConcar();
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
function saveItemConcar()
{
    console.log(`${_indexItemConcar} de ${itemsConcar.length}`);

    if( _indexItemConcar >= itemsConcar.length ){
        Swal.fire(
            'Correcto', 'Se guardó la requisición Nro.'+$('#frmDocumento #IdRequisicion').val(), 'success'
        );
        $('#mdlGuardando').modal('hide');
        $('#lblEventos').html('');
        return true;
    }
    var data = itemsConcar[_indexItemConcar];
    console.log(data);
    if( data == undefined ){ return true; }
    var dataDet = {
        "IdReq"     : $('#frmDocumento #IdRequisicion').val(),
        "NroItem"   : _indexItemConcar+1,
        "IdArticulo": data.IdArticulo,
        "Articulo"  : data.Articulo,
        "UM"        : data.UnidadMedida,
        "CenCost"   : $('#frmDocumento #CodContaCC').val(),
        "Cantidad"  : data.Cantidad,
        "CU"        : data.CostoUnit,
        "TC"        : _TipoCambio,
        "Total"     : data.Total,
        "Glosa"     : data.Glosa
    };
    $.ajax({
        url     : `${_URL_CONCAR}/req/items`,
        method  : "POST",
        data    : dataDet,
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
                _indexItemConcar++;
                saveItemConcar();
            break;
        }
    })
    .fail(function(xhr, status, error) {})
    .always(function() {});
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
        url     : `${_URL_NODE3}/api/requisicion/get_data`,
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
                // 
                var _htmlE = '';
                switch( rs.Estado ){
                    case 'Digitado':
                        _htmlE = `<div class="alert alert-info alert-dismissible"><h4><i class="icon fa fa-info"></i> Digitado</h4></div>`;
                    break;
                    case 'Aprobado':
                        _htmlE = `<div class="alert alert-success alert-dismissible"><h4><i class="icon fa fa-check"></i> Aprobado</h4></div>`;
                    break;
                    case 'Anulado':
                        _htmlE = `<div class="alert alert-danger alert-dismissible"><h4><i class="icon fa fa-ban"></i> Anulado</h4>${rs.MotivoAnulacion}</div>`;
                    break;
                    default:
                        _htmlE = `_nada_`;
                    break;
                }
                $('#frmDocumento #wrappeer_Estado').html(_htmlE);
                // Cliente
                $('#frmDocumento #IdClienteProv').html(`<option value="${rs.IdClienteProv}" >${rs.Cliente}</option>`);
                $('#frmDocumento #IdClienteProv').trigger('change');
                // Sucursal
                _Sucursales = json.locales;
				if( json.locales != undefined ){
					var _html = '<option value="" >Todos</option>';
					$.each( json.locales , function( key, value ) {
                        _html += '<option value="'+value.IdSucursal+'" >'+value.IdSucursal+'-'+value.Descripcion+'</option>'; 
                    });
					$('#frmDocumento #IdSucursal').html( _html );
                    $('#frmDocumento #IdSucursal').val( rs.IdSucursal );
                    $('#frmDocumento #IdSucursal').trigger('change');
				}
                // Items...
                var $jsonData = populateCC_Detalle( json.detalle );
                tblDetalle.clear();
                tblDetalle.rows.add($jsonData).draw();
                progreso();
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
        $('#frmDocumento').waitMe('hide');
    })
    .always(function() {
        $('#frmDocumento').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function buscar()
{
    $('#wrapperTable').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : `${_URL_NODE3}/api/requisicion/buscar`,
        method  : "POST",
        data    : { 'id' : $('#txtID').val(),'nombre' : $('#txtNombre').val() },
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
            var $jsonData = populateCC( json );
            table.clear();
            table.rows.add($jsonData).draw();
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
function guardarItem()
{
    // requisicion
    $('#mdlArticulos .modal-content').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : `${_URL_NODE3}/api/requisicion/item`,
        method  : "POST",
        data    : $('#mdlArticulos #frmDetalle').serialize(),
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
                _ItemsReq = json.data;
                var $jsonData = populateCC_Detalle( json.data );
                tblDetalle.clear();
                tblDetalle.rows.add($jsonData).draw();
                $('#frmDetalle #id').val(json.item.id);
                $('#frmDocumento #TotalDetalle').val(json.Total);
                $('#frmDocumento #NroItemsDetalle').val(json.Items);
                progreso();
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
        $('#mdlArticulos .modal-content').waitMe('hide');
    })
    .always(function() {
        $('#mdlArticulos .modal-content').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function populateCC_Detalle( json )
{
	//
	var $data = [], $CSGO = 1;
	if( json != undefined ){
		$.each( json , function( key, rs ) {
			var $o = [];
			$o.push($CSGO);
			$o.push(rs.IdArticulo);
            $o.push(rs.Articulo);
            $o.push(rs.UnidadMedida);
            $o.push(rs.TipoProducto);
            $o.push(rs.Glosa);
            $o.push(rs.Cantidad);
            $o.push(rs.CostoUnit);
            $o.push(rs.Total);
			//
			var $fecha = moment( rs.createdAt ).format('DD/MM/YYYY h:mm a');
            $o.push($fecha);
			// ******************
            $o.push(`<button data-id="${rs.id}" data-uuid="${rs.uu_id}" data-nombre="${rs.Articulo}" type="button" class=" editItem btn btn-block btn-primary btn-xs">Editar</button>`);
            $o.push(`<button data-id="${rs.id}" data-uuid="${rs.uu_id}" data-nombre="${rs.Articulo}" type="button" class=" delItem  btn btn-block btn-danger btn-xs">Eliminar</button>`);
            // ******************
			$data.push( $o );
			$CSGO++;
		});
	}
	//
	return $data;
}
/* ------------------------------------------------------------- */
function cargarItem( uuid )
{
    $('body').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : `${_URL_NODE3}/api/requisicion/get_item`,
        method  : "POST",
        data    : { 'uuid' : uuid },
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
                var data = json.data;
                if( data != undefined ){
                    $.each( data , function( key, rs ) {
                        $('#frmDetalle #'+key).val(rs);
                    });
                    $('#frmDetalle #IdArticulo').html(`<option value="${data.IdArticulo}" >${data.Articulo}</option>`);
                }
                $('#mdlArticulos').modal('show');
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
        $('body').waitMe('hide');
    })
    .always(function() {
        $('body').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function limpiarItem()
{
    $('#frmDetalle input[type="text"]').each(function(e){
        $(this).val('');
    });
    $('#frmDetalle input[type="hidden"]').each(function(e){
        $(this).val('');
    });
    $('#frmDetalle input[type="number"]').each(function(e){
        $(this).val('0');
    });
    $('#frmDetalle #IdArticulo').html('');
    $('#frmDetalle #IdArticulo').trigger('change');
    $('#frmDetalle #id').val(0);
    var IdRequisicion = $('#frmDocumento #IdRequisicion').val();
    $('#frmDetalle #IdRequisicion').val(IdRequisicion);
    var uuid = $('#frmDocumento #uu_id').val();
    $('#frmDetalle #token').val(uuid);
    var _TipProducto = $('#frmDocumento #TipProducto').val();
    $('#frmDetalle #TipoProducto').val(_TipProducto);
    renovarToken_Item();
    $('#frmDetalle #btnAddProdi').show();
}
/* ------------------------------------------------------------- */
function EliminarItem( uuid )
{
    $('#tblDetalle').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    var IdRequisicion = $('#frmDocumento #IdRequisicion').val();
    var Token = $('#frmDocumento #uu_id').val();
    $.ajax({
        url     : `${_URL_NODE3}/api/requisicion/delitem`,
        method  : "DELETE",
        data    : { 'IdReq' : IdRequisicion, 'uuid' : uuid, 'token' : Token },
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
                var $jsonData = populateCC_Detalle( json.data );
                tblDetalle.clear();
                tblDetalle.rows.add($jsonData).draw();
                $('#frmDocumento #TotalDetalle').val(json.Total);
                $('#frmDocumento #NroItemsDetalle').val(json.Items);
                progreso();
                //  
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
        $('#tblDetalle').waitMe('hide');
    })
    .always(function() {
        $('#tblDetalle').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function progreso()
{
    var _MontoMax = parseFloat( $('#frmDocumento #MontoMax').val() );
    var _porcentaje = 0;
    if( _MontoMax > 0 ){
        var _TotalDetalle = parseFloat( $('#frmDocumento #TotalDetalle').val() );
        _porcentaje = parseInt( (_TotalDetalle*100)/_MontoMax );
        var clase = 'progress-bar';
        // progress-bar-success
        if( _porcentaje < 88 ){
            clase += ' progress-bar-success';
        }
        if( _porcentaje > 88 ){
            clase += ' progress-bar-warning';
        }
        if( _porcentaje >= 100 ){
            clase += ' progress-bar-danger';
        }
        
        
        // 
        $('#frmDocumento #TE_MiProgreso').removeClass();
        $('#frmDocumento #TE_MiProgreso').addClass(clase);
        $('#frmDocumento #TE_MiProgreso').css({'width':_porcentaje+'%'})
        $('#frmDocumento #TE_MiProgreso').html(`${_porcentaje}%`);
        $('#frmDocumento #TE_MiProgreso').attr('aria-valuenow',_porcentaje);
    }

    $('#frmDocumento #Porcentaje').val(_porcentaje);
    
}
/* ------------------------------------------------------------- */
function getTC()
{
    // Tipo de cambio de concar
    $.ajax({
        url     : `${_URL_CONCAR}/tc`,
        method  : "GET",
        dataType: "json",
        headers : {
            "api-token"  : _TokenUser,
            "user-token" : _token_node
        }
    })
    .done(function( json ) {
        switch(json.estado)
        {
            case 'ERROR':
                alert(`Error`);
            break;
            case 'OK':
                var data = json.data[0];
                _TipoCambio = data.XMEIMP2;
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
            alert('Error al intentar obtener el tipo de cambio');
        }
    })
    .always(function() {
        //
    });
}
/* ------------------------------------------------------------- */
function aprobarRequi( uuid )
{
    $('#mdlGuardando').modal('show');
    $('#lblEventos').html(`<div class="well">Aprobando requisición...</div>`);

    $('#frmDocumento').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    var IdReq = $('#frmDocumento #IdRequisicion').val();
    $.ajax({
        url     : `${_URL_NODE3}/api/requisicion/aprobar`,
        method  : "POST",
        data    : { 'uuid' : uuid , 'IdReq' : IdReq },
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
                $('#mdlGuardando').modal('hide');
                $('#lblEventos').html(``);
                $('#frmDocumento').waitMe('hide');
            break;
            case 'OK':
                estadoReqConcar( 7 , IdReq);
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
        $('#frmDocumento').waitMe('hide');
    })
    .always(function() {
        //$('#frmDocumento').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function anularRequi(uuid , motivo , IdReq )
{
    $('#mdlGuardando').modal('show');
    $('#lblEventos').html(`<div class="well">Anulando requisición...</div>`);

    $('#frmDocumento').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : `${_URL_NODE3}/api/requisicion/anular`,
        method  : "POST",
        data    : { 'uuid' : uuid , 'IdReq' : IdReq, 'Motivo' : motivo },
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
                $('#mdlGuardando').modal('hide');
                $('#lblEventos').html(``);
                $('#frmDocumento').waitMe('hide');
            break;
            case 'OK':
                estadoReqConcar(6 , IdReq);
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
        $('#frmDocumento').waitMe('hide');
    })
    .always(function() {
        //$('#frmDocumento').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function estadoReqConcar( Estado , IdReq )
{
    //
    //var IdReq = $('#frmDocumento #IdRequisicion').val();
    $.ajax({
        url     : `${_URL_CONCAR}/req/estado`,
        method  : "POST",
        data    : { 'Estado' : Estado, 'IdReq' : IdReq },
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
                $('#mdlGuardando').modal('hide');
                Swal.fire(
                    'Correcto',
                    'Se cambió el estado de la requisición Nro. '+IdReq,
                    'success'
                );
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
        $('#frmDocumento').waitMe('hide');
    })
    .always(function() {
        $('#frmDocumento').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function makeIdConcar()
{
    $('#wrapperTable').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : `${_URL_NODE3}/api/clientes/make_ids_concar`,
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
                alert(`Terminado`);
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
}
/* ------------------------------------------------------------- */
function clonarLocales()
{
    $('#wrapperTable').waitMe({
        effect  : 'facebook',
        text    : 'Espere...',
        bg      : 'rgba(255,255,255,0.7)',
        color   : '#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : `${_URL_NODE3}/api/sucursales/clone_locales`,
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
                alert(`Terminado`);
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
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function getLocales( IdClienteProv )
{
	$('#frmDocumento').waitMe({
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
                _Sucursales = json.data;
				if( json.data != undefined ){
					var _html = '<option value="" >Todos</option>';
					$.each( json.data , function( key, value ) {
                        _html += `<option value="${value.IdConcar}" >${value.IdConcar}-${value.Descripcion}</option>`; 
                        //_html += '<option value="'+value.IdSucursal+'" >'+value.IdSucursal+'-'+value.Descripcion+'</option>'; 
                    });
					$('#frmDocumento #IdSucursal').html( _html );
                    $('#frmDocumento #IdSucursal').trigger('change');
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
		$('#frmDocumento').waitMe('hide');
	})
	.always(function() {
		$('#frmDocumento').waitMe('hide');
	});
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
					var _html = '<option value="" >Todos</option>';
					$.each( json.data , function( key, value ) {
						_html += '<option value="'+value.IdSucursal+'" >'+value.IdSucursal+'-'+value.Descripcion+'</option>'; 
						});
					$('#cboSucursal').html( _html );
                    $('#cboSucursal').trigger('change');
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
		$('body').waitMe('hide');
	})
	.always(function() {
		$('body').waitMe('hide');
	});
}
/* ------------------------------------------------------------- */
</script>

@endsection
