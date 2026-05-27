

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

<div id="wrapper_home" class="card" >
    
    <div class="card-body">

        <h4>Areas</h4>

        <!-- ....................................................... -->
        <div class="row">
            <div class=" col-lg-6 col-md-6 " ></div>
            <!-- ./col -->
            <div class=" col-lg-2 col-md-2 " >
                <button id="btnGoImportar" class=" btn btn-default " data-bs-toggle="modal" data-bs-target="#mdlImportar" ><i class="fa a-cloud-upload"></i> Importar</button>
            </div>
            <!-- ./col -->
             <div class=" col-lg-2 col-md-2 " >
                <button id="btnOpenFiltro" class=" btn btn-default " ><i class="fa fa-search"></i> Filtro</button>
            </div>
            <!-- ./col -->
            <div class=" col-lg-2 col-md-2 " >
                <a id="btnCrear" href="#" class="btn btn-primary btn-block pull-right " data-id="0" >
                    <i class="icofont-plus"></i> Crear</a>
            </div>
            <!-- ./col -->
        </div>
        <hr>
        
        <div class="tab-content" id="tabContenido" >

            <hr>

            <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                <table id="TablaHomePs" class=" table table-striped table-no-bordered table-hover " style="width:100%" >
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>#</th>
                            <th>Codigo</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Creado</th>
                            <th>Modificado</th>
                            <th>Usuario</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <div class="tab-pane fade " id="home-filtro-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                
            <div class=" row " >
                <div class=" col-lg-3 col-md-3 " >
                    <div class="form-group">
                        <label for="Cliente" >Descripción</label> 
                        <input type="text" name="inicio" id="inicio" class="form-control" value="" maxlength="150" />
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
            </div>
            <!-- ./row -->

            </div>

        </div>

        <!-- ....................................................... -->
    </div>
</div>






<div id="wrapper_form" style="display:none;" >
    <?= $this->include( '/area/nuevo/frmArea2026' ) ?>
</div>





<div id="notif-overlay" 
     style="display:none; position:fixed; top:0; left:0; width:100%; height:100%;
            background:rgba(0,0,0,0.35); z-index:9998; opacity:0; transition:opacity .3s;">
</div>

<div id="notif-modal-container"
     style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%);
            z-index:9999; max-width:420px; width:90%; opacity:0; transition:opacity .3s;">
</div>





<?= $this->include( '/area/nuevo/mdlArea2026' ) ?>






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






<script type="text/javascript" src="<?= esc($APP_URL) ?>librerias/area/homeArea2026.js?v=<?= $VERSION ?>" ></script>

<?= $this->endSection() ?>
<!-- ************************************************** -->