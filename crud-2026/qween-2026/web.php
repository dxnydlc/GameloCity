

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

 <!-- toastr CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">


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



<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <h3>Gestión de Flags</h3>
            <hr>
            
            <!-- Contenedor de Pestañas (Tabs) -->
            <div id="tabs-container">
                <ul class="nav nav-tabs" id="dynamic-tabs" role="tablist">
                    <!-- Tab FIJO de Listado General (no se puede cerrar) -->
                    <li role="presentation" class="active tab-fixed" id="tab-link-listado">
                        <a href="#tab-listado" aria-controls="tab-listado" role="tab" data-toggle="tab">
                            <span class="glyphicon glyphicon-list"></span> Listado General
                        </a>
                    </li>
                </ul>
                <div class="tab-content" id="dynamic-tabs-content">
                    <!-- Contenido del Tab FIJO -->
                    <div role="tabpanel" class="tab-pane active" id="tab-listado">
                        <div class="panel panel-default" style="margin-bottom: 0; border: none;">
                            <div class="panel-body" style="paddiqqng: 0;">

                                <div class="pull-right" style="margin-bottom: 10px;">
                                    <button id="btnNuevo" class="btn btn-primary">
                                        <span class="glyphicon glyphicon-plus"></span> Nuevo Registro
                                    </button>
                                    <button id="btnRecargar" class="btn btn-default">
                                        <span class="glyphicon glyphicon-refresh"></span> Recargar
                                    </button>
                                </div>
                                <div class="clearfix"></div>
                                <div class="table-responsive">
                                    <table id="tablaDatos" class="table table-striped table-bordered table-hover">
                                        <thead id="tablaHead"></thead>
                                        <tbody id="tablaBody"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>



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

<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>




<script type="text/javascript" src="<?= esc($APP_URL) ?>librerias/flag_2026/homeFlag26.js?v=<?= $VERSION ?>" ></script>

<?= $this->endSection() ?>
<!-- ************************************************** -->