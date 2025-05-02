

<?= $this->extend('layout/clear') ?>


<!-- ************************************************** -->
<?= $this->section('titulo') ?>
Inicio
<?= $this->endSection() ?>
<!-- ************************************************** -->
<?= $this->section('header') ?>
MIP
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



<style>
    p,td,th,a{
        font-size :  12px;
    }
</style>

<?= $this->endSection() ?>
<!-- ************************************************** -->






<!-- ************************************************** -->
<?= $this->section('content') ?>

<!-- ============================================================== -->



<div id="TopPaginaOrq3" class="card" >
    
    <div class="card-body">
        <!-- ....................................................... -->
         <div class="row">
            <div class="col-lg-9 col-md-9"></div>
            <div class="col col-md-auto">
                <nav class=" nav justify-content-end doc-tab-nav align-items-center " >
                    <button id="btnHomeFiltro" class=" btn btn-sm btn-phoenix-primary code-btn ms-2 collapsed " >
                        <span class="fas fa-search me-2" data-fa-transform="shrink-3"></span> Buscar
                    </button>
                    <button id="btnNuevoDoc" class=" btn btn-sm btn-phoenix-primary code-btn ms-2 collapsed " >
                        <span class="fas fa-plus me-2" data-fa-transform="shrink-3"></span> Crear
                    </button>
                </nav>
            </div>
         </div>
        <ul class="nav nav-pills " id="tabHome" role="tablist" >

            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Lista</button>
            </li>

            <li class="nav-item" role="presentation">
                <button class="nav-link " id="filtro-tab" data-bs-toggle="tab" data-bs-target="#home-filtro-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Filtro</button>
            </li>

        </ul>
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


<script type="text/javascript" src="<?= esc($APP_URL) ?>librerias/area/homeArea.js?v=<?= $VERSION ?>" ></script>

<?= $this->endSection() ?>
<!-- ************************************************** -->