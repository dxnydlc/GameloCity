

<?= $this->extend('layout/principal') ?>



<!-- ************************************************** -->
<?= $this->section('titulo') ?>
Dashboard
<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('header') ?>
Contratos
<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('los_css') ?>

<link href="https://nestjs-mysql.ssays-orquesta.com/web/plugins/jquery-upload-file-master/css/uploadfile.css" rel="stylesheet" />

<link rel="stylesheet" href="https://nestjs-mysql.ssays-orquesta.com/web/plugins/fancybox-master/dist/jquery.fancybox.min.css" />

<link rel="stylesheet" href="https://nestjs-mysql.ssays-orquesta.com/web/plugins/daterangepicker-master/daterangepicker.css" />

<link rel="stylesheet" href="https://nestjs-mysql.ssays-orquesta.com/web/plugins/bootstrap-fileinput-master/css/fileinput.css" />


<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('content') ?>

<!-- ============================================================== -->


<!-- Content Header (Page header) -->
<section class="content-header">
    <h1>
        Carga de boletas.
        <small>SSAYS</small>
    </h1>
</section>

<!-- Main content -->
<section class="content"  >
    
    <!-- RESULTADOS HOME -->
    <div class=" box box-primary " id="wrapperTable" >

        <!-- /.box-header -->
        <div class=" box-body " >
            <div class=" row " >
                <div class=" col-lg-8 col-md-8 " ></div>
                <!-- ./col -->
                <div class=" col-lg-4 col-md-4 " >
                    <!-- <a href="#" class="btn btn-app pull-right" >
                        <i class="fa fa-search"></i> Filtro
                    </a> -->
                    <a id="btnCrear" href="#" class="btn btn-app pull-right" >
                        <i class="fa fa-plus"></i> Nuevo
                    </a>
                </div>
                <!-- ./col -->
            </div>
            <!-- ./BOTONES DE COMANDO -->
            <div id="TablaHome" style="min-height:100px;overflow:auto;min-height:150px;" >
                <table id="TablaHomePs" class=" table table-striped table-no-bordered table-hover " style="width:100%" >
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Código</th>
                            <th>Tipo</th>
                            <th>Mes</th>
                            <th>Año</th>
                            <th>Cliente</th>
                            <th>Local</th>
                            <th>Estado</th>
                            <th>Creado por</th>
                            <th>Modificado</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
        <!-- /.box-body -->
        <div class=" box-footer " >
            <div id="botonesPS" ></div>
        </div>
        <!-- /.box-footer -->
    </div>
    <!-- ./box -->


<!-- Formulario -->
<?= $this->include('envio_boletas/frmEnvBoleta') ?>


<!-- MOdal -->
<?= $this->include('envio_boletas/mdlEnvBoleta') ?>


</section>


<!-- ============================================================== -->

<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('los_js') ?>


<script src="https://cdn.datatables.net/buttons/1.5.2/js/dataTables.buttons.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js" ></script>
<script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.html5.min.js" ></script>
<script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.print.min.js" ></script>







<script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.13.216/build/pdf.min.js" integrity="sha256-Yjn9rQHDeN29XFpZN9iixcSI5lf9Spfmv/3g+w3gqao=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.13.216/pdf.worker.min.js"></script>

<script src="https://nestjs-mysql.ssays-orquesta.com/web/plugins/bootstrap-fileinput-master/js/fileinput.min.js" ></script>
<script src="https://nestjs-mysql.ssays-orquesta.com/web/plugins/bootstrap-fileinput-master/js/locales/es.js" ></script>
<script src="https://nestjs-mysql.ssays-orquesta.com/web/plugins/bootstrap-fileinput-master/js/plugins/piexif.js" ></script>
<script src="https://nestjs-mysql.ssays-orquesta.com/web/plugins/bootstrap-fileinput-master/js/plugins/sortable.js" ></script>



<script src="<?= esc($APP_URL) ?>librerias/envio_boletas/homeEnvBoletas.js?v=<?= $VERSION ?>"></script>



<?= $this->endSection() ?>
<!-- ************************************************** -->



