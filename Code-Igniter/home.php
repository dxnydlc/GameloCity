

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


<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('content') ?>

<!-- ============================================================== -->


<!-- Content Header (Page header) -->
<section class="content-header">
    <h1>
        Unidad de negocios.
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
<?= $this->include('unidad_negocio/formUndNegocio') ?>


<!-- MOdal -->
<?= $this->include('unidad_negocio/mdlUndNegocio') ?>


</section>


<!-- ============================================================== -->

<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('los_js') ?>



<script src="<?= esc($APP_URL) ?>librerias/unidad_negocio/home_unidad_negocio.js?v=<?= $VERSION ?>"></script>



<?= $this->endSection() ?>
<!-- ************************************************** -->




