

<?= $this->extend('layout/principal') ?>



<!-- ************************************************** -->
<?= $this->section('titulo') ?>
Dashboard
<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('header') ?>
SSAYS
<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('los_css') ?>

<link rel="stylesheet" href="https://cdn.datatables.net/2.2.2/css/dataTables.dataTables.min.css">
<link rel="stylesheet" href="https://cdn.datatables.net/autofill/2.7.0/css/autoFill.dataTables.min.css">
<!-- botones -->
<link rel="stylesheet" href="https://cdn.datatables.net/buttons/3.2.2/css/buttons.dataTables.min.css">
<!-- ColReorder -->
<link rel="stylesheet" href="https://cdn.datatables.net/colreorder/2.0.4/css/colReorder.dataTables.min.css">

<!-- keytabable -->
<link rel="stylesheet" href="https://cdn.datatables.net/keytable/2.12.1/css/keyTable.dataTables.min.css">
<!-- Responsive -->
<link rel="stylesheet" href="https://cdn.datatables.net/responsive/3.0.4/css/responsive.dataTables.min.css">



<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('content') ?>

<!-- ============================================================== -->




<section class="content-header">
    <h1>
        DDDD
        <small>todos los documentos generados</small>
    </h1>
    <ol class="breadcrumb">
        <li><a href="/dashboard" ><i class="fa fa-dashboard"></i> Inicio</a></li>
        <li><a href="#">Procesos</a></li>
        <li class="active">DDDD</li>
    </ol>
</section>


<!-- Main content -->
<section class="content"  >
    
    <div class=" row " id="wrapper_home" >
        <!-- ./col -->
        <div class=" col-lg-12 col-md-12 " >
            <div class="box box-success " >
            <div class="box-header with-border">
                <h3 class="box-title">Resultado</h3>
            </div>
                <!-- /.box-header -->
                <div class="box-body" >
                    <div class="row">
                        <div class=" col-lg-8 col-md-8 " ></div>
                        <!-- ./col -->
                         <div class=" col-lg-2 col-md-2 " >
                            <a href="#" class="btn btn-primary btn-block pull-left " id="btnOpen_SRC" ><i class="fa fa-search"></i> Filtro</a>
                            <hr>
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " >
                            <a id="btnCrear" href="#" class="btn btn-primary btn-block pull-right " data-id="0" ><i class="icofont-plus"></i> Crear</a>
                            <hr>
                        </div>
                        <!-- ./col -->
                    </div>
                    <hr>
                    <table id="TablaHomePs" class=" table table-hover cell-border compact hover nowrap row-border table-striped table-hover " cellspacing="0" width="100%" style="width:100%">
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>Nro</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Actualizado</th>
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



    <div id="wrapper_form" style="display:none;" >
        <?= $this->include( '/servicios25/frmServicios25' ) ?>
    </div>
    

</section>



<!-- ============================================================== -->

<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('los_js') ?>



<script type="text/javascript" src="https://cdn.datatables.net/2.2.2/js/dataTables.min.js" ></script>
<script type="text/javascript" src="https://cdn.datatables.net/autofill/2.7.0/js/dataTables.autoFill.min.js" ></script>
<!-- botones -->
<script type="text/javascript" src="https://cdn.datatables.net/buttons/3.2.2/js/dataTables.buttons.min.js" ></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/3.2.2/js/buttons.colVis.min.js" ></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/3.2.2/js/buttons.print.min.js" ></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/3.2.2/js/buttons.html5.min.js" ></script>
<!-- ColReorder -->
<script type="text/javascript" src="https://cdn.datatables.net/colreorder/2.0.4/js/dataTables.colReorder.min.js" ></script>
<!-- keytable -->
<script type="text/javascript" src="https://cdn.datatables.net/keytable/2.12.1/js/dataTables.keyTable.min.js" ></script>
<!-- Responsive -->
<script type="text/javascript" src="https://cdn.datatables.net/responsive/3.0.4/js/dataTables.responsive.min.js" ></script>






<script type="text/javascript" src="<?= esc($APP_URL) ?>librerias/servicios25/homeServicios25.js?v=<?= $VERSION ?>" ></script>

<?= $this->endSection() ?>
<!-- ************************************************** -->