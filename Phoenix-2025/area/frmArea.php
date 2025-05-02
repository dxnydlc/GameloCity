

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



<?= $this->endSection() ?>
<!-- ************************************************** -->






<!-- ************************************************** -->
<?= $this->section('content') ?>

<!-- ============================================================== -->



<div id="wrapper_form" class="card border border-primary " >
    <div class="card-header">
        <div class="row">
            <div class="col-lg-11"></div>
            <div class="col-lg-1">
                <button id="cerrarForm" class="btn-close" type="button" aria-label="Close"></button>
            </div>
        </div>
    </div>
    <div class="card-body">
        
        <form id="frmDocumento" autocomplete="off" >
            <input type="hidden" id="id" name="id" value="0" />
            <input type="hidden" id="uu_id" name="uu_id" value="" />


            <div class=" row " >
                <div class=" col-lg-2 col-md-2 mb-3  " >
                    <div class="form-group">
                        <label for="Codigo" >Código</label> 
                        <input type="text" name="Codigo" id="Codigo" class="form-control" value="" maxlength="150" />
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

            <div class=" row " >
                <div class=" col-lg-6 col-md-6 " >
                    <div class="form-group mb-3 " >
                        <label for="Nombre" >Descripción</label> 
                        <input type="text" name="Nombre" id="Nombre" class="form-control" value="" maxlength="150" />
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

            <div class=" row " >
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
            </div>
            <!-- ./row -->

        </form>

        <hr>

        <div class=" row " >
            <div class=" col-lg-2 col-md-2 " >
                <button id="btnSalirForm" class=" btn btn-outline-secondary me-1 mb-1 " type="button"><i class=" fas fa-sign-out-alt "></i> Salir</button>
                <hr>
            </div>
            <!-- ./col -->
            <div class=" col-lg-2 col-md-2 " ></div>
            <!-- ./col -->
            <div class=" col-lg-2 col-md-2 " ></div>
            <!-- ./col -->
            <div class=" col-lg-2 col-md-2 " ></div>
            <!-- ./col -->
            <div class=" col-lg-2 col-md-2 " ></div>
            <!-- ./col -->
            <div class=" col-lg-2 col-md-2 " >
                <button id="btnGuardarForm" class=" btn btn-outline-primary me-1 mb-1 " type="button"><i class=" fas fa-save "></i> Guardar</button>
                <hr>
            </div>
            <!-- ./col -->
        </div>
        <!-- ./row -->

    </div>
</div>





        



<!-- ============================================================== -->

<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('los_js') ?>


<script type="text/javascript">
    var idDoc     = <?= $Id ?>;
    var IndiceDoc = '<?= $Indice ?>';
</script>


<script type="text/javascript" src="<?= esc($APP_URL) ?>librerias/area/frmArea.js?v=<?= $VERSION ?>" ></script>

<?= $this->endSection() ?>
<!-- ************************************************** -->