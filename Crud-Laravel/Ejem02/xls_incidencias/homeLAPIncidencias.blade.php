
@extends('layouts.principal')

@section('titulo')
Incidencias LAP
@endsection




@section('losCSS')

<!-- SweetAlert -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>

<link href="{{ asset('plugins/jquery-upload-file-master/css/uploadfile.css') }}" rel="stylesheet">

<link rel="stylesheet" href="{{ asset('plugins/fancybox-master/dist/jquery.fancybox.min.css') }}" />

<link rel="stylesheet" href="{{ asset('plugins/daterangepicker-master/daterangepicker.css') }}">

<link rel="stylesheet" href="{{ asset('plugins/bootstrap-fileinput-master/css/fileinput.css') }}">

<!-- Toast -->
<link href="{{ asset('plugins/jquery-toast-plugin-master/src/jquery.toast.css') }}" rel="stylesheet"/>

<script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.13.216/build/pdf.min.js" integrity="sha256-Yjn9rQHDeN29XFpZN9iixcSI5lf9Spfmv/3g+w3gqao=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.13.216/pdf.worker.min.js"></script>


@endsection







@section('content')

<!-- Content Header (Page header) -->
<section class="content-header">
    <h1>
        Carga de xls para incidencias.
        <small>reporte LAP</small>
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
                                        <a href="#" class="btn btn-primary btn-block pull-left " id="btn_OpenFiltro" ><i class="fa fa-search"></i> Filtro</a>
                                    </div>
                                    <!-- ./col -->
                                    <div class=" col-lg-8 col-md-8 " ></div>
                                    <!-- ./col -->
                                    <div class=" col-lg-2 col-md-2 " >
                                        <a id="btnCrear" href="#" class="btn btn-primary btn-block pull-right " data-id="0" ><i class="icofont-plus"></i> Nuevo</a>
                                    </div>
                                    <!-- ./col -->
                                </div>
                                <hr>
                                <div id="TablaHome"></div>
                                <!--<table class=" table table-hover cell-border compact hover nowrap row-border table-striped table-hover " id="wrapperTable" cellspacing="0" width="100%" style="width:100%">
                                </table>-->
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
                @include('LAP.xls_incidencias.frmLAPIncidencias')
                <!-- /Formulario -->
            </div>
        </div>
        <!-- ################################################################### -->
    </div>

</section>



<!-- Formulario -->
@include('LAP.xls_incidencias.mdlLAPIncidencias')
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

<script src="https://cdn.ckeditor.com/4.14.0/standard-all/ckeditor.js"></script>

<script src="{{ asset('plugins/jquery-upload-file-master/js/jquery.uploadfile.min.js') }}" ></script>

<script src="{{ asset('plugins/fancybox-master/dist/jquery.fancybox.min.js') }}"></script>

<script src="{{ asset('plugins/daterangepicker-master/daterangepicker.js') }}"></script>


<script src="{{ asset('plugins/bootstrap-fileinput-master/js/fileinput.min.js') }}" ></script>
<script src="{{ asset('plugins/bootstrap-fileinput-master/js/locales/es.js') }}" ></script>
<script src="{{ asset('plugins/bootstrap-fileinput-master/js/plugins/piexif.js') }}" ></script>
<script src="{{ asset('plugins/bootstrap-fileinput-master/js/plugins/sortable.js') }}" ></script>


<!-- Toast -->
<script src="{{ asset('plugins/jquery-toast-plugin-master/src/jquery.toast.js') }}"></script>


<script src="{{ asset('js/xls_incidencias.js') }}"></script>




@endsection

