

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

<!-- DataTables -->
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">

<!-- Select2 -->
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />


<style>
.chip-glow {
    animation: glowPulse 2s infinite ease-in-out;
}
@keyframes glowPulse {
    0%   { box-shadow: 0 0 0px rgba(255,255,255,0.0); }
    50%  { box-shadow: 0 0 12px rgba(255,255,255,0.7); }
    100% { box-shadow: 0 0 0px rgba(255,255,255,0.0); }
}
</style>


<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('content') ?>

<!-- ============================================================== -->




<section class="content-header">
    <h1>
        Asistencia eventos
        <small>todos los documentos generados</small>
    </h1>
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
                    
                    
                    <h2 class="text-primary">Editor JSON Avanzado (Bootstrap 3)</h2>

                    <!-- TABS -->
                    <ul class="nav nav-tabs" id="editorTabs">
                        <li class="active">
                        <a href="#tab-content-listado" id="tab-listado" data-toggle="tab">Listado</a>
                        </li>
                    </ul>

                    <!-- TAB CONTENT -->
                    <div class="tab-content" id="editorTabsContent">

                        <div class="tab-pane fade in active" id="tab-content-listado">
                        <button class="btn btn-success" onclick="nuevoRegistro()">Nuevo</button>
                        <div id="tablaContainer" class="mt-3"></div>
                        </div>

                    </div>
                    
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
        <?= $this->include( '/permisos_usuario/frmPermisoUsuario' ) ?>
    </div>
    

</section>



<div id="notification-container"
     style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            z-index: 9999; width: 100%; max-width: 400px;">
</div>

<!-- ============================================================== -->

<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('los_js') ?>


<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

<!-- Moment.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js"></script>





<script type="text/javascript" src="<?= esc($APP_URL) ?>librerias/permisos_usuarios/homePermisoUsuario.js?v=<?= $VERSION ?>" ></script>

<?= $this->endSection() ?>
<!-- ************************************************** -->
