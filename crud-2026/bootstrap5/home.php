

<?= $this->extend('layout/principal') ?>



<!-- ************************************************** -->
<?= $this->section('titulo') ?>
Areas
<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('header') ?>
SSAYS
<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('los_css') ?>

<link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
<link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.2/css/buttons.dataTables.min.css">


  <style>
    /* Animación glow */
    .chip-glow {
      animation: glowPulse 2s infinite ease-in-out;
    }

    @keyframes glowPulse {
      0%   { box-shadow: 0 0 0px rgba(0,0,0,0.0); }
      50%  { box-shadow: 0 0 12px rgba(255,255,255,0.7); }
      100% { box-shadow: 0 0 0px rgba(0,0,0,0.0); }
    }
  </style>


<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('content') ?>

<!-- ============================================================== -->

<div id="wrapper_home" class="card" >
    
    <div class="card-body">

        <h4>Servicios</h4>

        <!-- TABS -->
  <ul class=" nav nav-tabs nav-underline " id="editorTabs" role="tablist">

    <!-- TAB FIJO (NO TIENE BOTÓN CERRAR) -->
    <li class="nav-item" role="presentation">
      <button class="nav-link active"
              id="tab-listado"
              data-bs-toggle="tab"
              data-bs-target="#tab-content-listado"
              type="button">
        Listado
      </button>
    </li>

  </ul>

  <!-- CONTENIDO DE TABS -->
  <div class="tab-content" id="editorTabsContent">

    <!-- CONTENIDO DEL TAB FIJO -->
    <div class="tab-pane fade show active" id="tab-content-listado" role="tabpanel">

      <button class="btn btn-success my-3" onclick="nuevoRegistro()">Nuevo</button>

      <div id="tablaContainer"></div>

    </div>

  </div>

        <!-- ....................................................... -->
    </div>
</div>






<div id="wrapper_form" style="display:none;" >
    <?= $this->include( '/catalogo/sistemas/frmSistemas' ) ?>
</div>





<div id="notif-overlay" 
     style="display:none; position:fixed; top:0; left:0; width:100%; height:100%;
            background:rgba(0,0,0,0.35); z-index:9998; opacity:0; transition:opacity .3s;">
</div>

<div id="notif-modal-container"
     style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%);
            z-index:9999; max-width:420px; width:90%; opacity:0; transition:opacity .3s;">
</div>






<!-- ============================================================== -->

<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('los_js') ?>




<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.print.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>

  <!-- Moment.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js"></script>



<script type="text/javascript" src="<?= esc($APP_URL) ?>librerias/catalogo/sistemas/homeSistemas.js?v=<?= $VERSION ?>" ></script>

<?= $this->endSection() ?>
<!-- ************************************************** -->