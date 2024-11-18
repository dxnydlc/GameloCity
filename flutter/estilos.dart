
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';



// ...................................................
// final Medida = MediaQuery.of(context).size;
// ...................................................
TextStyle getHeaderStyle(BuildContext context) => GoogleFonts.dmSans(
  fontSize    : 27,
  fontWeight  : FontWeight.bold,
  //color       : Theme.of(context).textColor,
);
// ...................................................
TextStyle txtTitulo( BuildContext context) => GoogleFonts.dmSans(
  fontSize : 18 , 
  color    : Colors.white
);
// ...................................................
TextStyle txtTituloHome( BuildContext context) => GoogleFonts.dmSans(
  fontSize : 18 , 
  color    : Color( 0XFF1B4332 ) , 
  fontWeight : FontWeight.w700
);
// ...................................................
TextStyle textBuscador( BuildContext context) => GoogleFonts.dmSans(
  fontSize : 14 , 
  color    : const Color( 0XFF1B4332 )
);
// ...................................................
TextStyle txtReg12( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 12 , 
  color : Color( 0XFF1B4332 )
);
// ...................................................
TextStyle txtBtn16W ( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 16 , 
  color : Color( 0XFFD8F3DC )
);
// ...................................................
TextStyle txtBtn14 ( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 14 , 
  color : Color( 0XFFD8F3DC )
);
// ...................................................
// ...................................................
TextStyle txtTitulo2 ( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 18 , color : Color( 0XFFffffff ) 
);
// ...............................................
TextStyle txtCliente ( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 11 , color : Color( 0XFF2D6A4F ) 
);
// ...............................................
TextStyle txtSucursal( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 11 , color : Color( 0XFF0077b6 ) 
);
// ...................................................
TextStyle txtCerrar( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 16 , color : Color( 0XFFfb8500 ) , 
);
// ...................................................
TextStyle txtClienteSrc( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 11, color: Color(0XFF2D6A4F)
);
// ...................................................
TextStyle txtSucursalSrc( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 11, color: Color(0XFF0077b6)
);
// ...................................................
TextStyle codigoCS( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 11, color: Color(0XFF0077b6) , 
  fontWeight  : FontWeight.bold,
);
// ...................................................
TextStyle clienteCS ( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 12 , color : Color( 0XFF2D6A4F ) 
);
// ...................................................
TextStyle sucursalCS ( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 12 , color : Color( 0XFF264653 ) 
);
// ...................................................
TextStyle usarioCS ( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 12 , color : const Color( 0XFF005f73 ) 
);
// ...................................................
// FORMULARIO CONSTANCIA SUPERVISION
TextStyle CodConstanciaSupForm( BuildContext context) => GoogleFonts.dmSans(
  fontSize : 18 , 
  color    : Colors.white , 
  fontWeight : FontWeight.w700
);
// ...................................................
TextStyle SucursalCSForm( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 16, color: Color(0XFF0077b6) , 
  fontWeight  : FontWeight.bold,
);
// ...................................................
TextStyle textCliCSForm( BuildContext context) => GoogleFonts.dmSans(
  fontSize : 14 , 
  color    : const Color( 0XFF1B4332 )
);
// ...................................................
TextStyle labelNroServicio( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 16, color: Color(0XFF0077b6) , 
  fontWeight  : FontWeight.bold,
);
// ...................................................
TextStyle txtCajaTexto( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 14 , color : Color( 0XFF184e77 ) 
);
// ...................................................
TextStyle labelSalir( BuildContext context) => GoogleFonts.dmSans(
  fontSize    : 24, 
  color       : Color(0XFFee9b00 ) , 
  fontWeight  : FontWeight.bold,
);
// ...................................................
TextStyle chkTexto( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 14 , color : Color( 0XFF0077b6 ) 
);
// ...................................................
TextStyle txtOpts( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 12 , color : Color( 0XFF2D6A4F )
);
// ...................................................
TextStyle txtRegular( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 14 , color : Color( 0XFF2D6A4F ) 
);
// ...................................................
TextStyle txt16Verde( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 16 , color : Color( 0XFF2D6A4F ) 
);
// ...................................................
TextStyle txt16Azul( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 16 , color : Color( 0XFF003049 ) 
);
// ...................................................
TextStyle NroTecnicos( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 30 , color : Color( 0XFF184e77 ) 
);
// ...................................................
TextStyle txt14_rg( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 14 , color : Color( 0XFF1B4332 )
);
// ...................................................
TextStyle txt12_rg( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 12 , color : Color( 0XFF40916C )
);
// ...................................................
TextStyle txtInfoSmall( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 11 , color : Color( 0XFF40916C )
);
// ...................................................
TextStyle txtTituloIn( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 16 , color : Color( 0XFF0077b6 ) 
);
// ...................................................
TextStyle txtCajaTexto2( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 14 , color : Color( 0XFF184e77 ) 
);
// ...................................................
TextStyle txtBotonesFirma( BuildContext context) => GoogleFonts.dmSans(
  fontSize: 14 , color : Color( 0XFF0077b6 ) 
);
// ...................................................
TextStyle TextoDescarga( BuildContext context) => GoogleFonts.dmSans(
  fontSize   : 22 , 
  color      : Color( 0XFF2d6a4f ) , 
  fontWeight : FontWeight.w600,
);
// ...................................................
TextStyle TextoPercentDescarga( BuildContext context) => GoogleFonts.dmSans(
  fontSize   : 20 , 
  color      : Color( 0XFF669bbc ) , 
  fontWeight : FontWeight.w600,
);
// ...................................................
TextStyle txtxNombre_asis( BuildContext context) => GoogleFonts.dmSans(
  fontSize : 12 , 
  color    : const Color( 0XFF1B4332 ) , 
  fontWeight: FontWeight.w600 , 
);
// ...................................................
TextStyle txtDNI_asis( BuildContext context) => GoogleFonts.dmSans(
  fontSize   : 14 , 
  color      : Color( 0XFF2d6a4f ) , 
  fontWeight : FontWeight.w600,
);
// ...................................................
TextStyle txtDatos_asis( BuildContext context) => GoogleFonts.dmSans(
  fontSize   : 14 , 
  color      : Color( 0XFF2d6a4f ) , 
);
// ...................................................
TextStyle txtMarca_asis_ok( BuildContext context) => GoogleFonts.dmSans(
  fontSize   : 16 , 
  color      : Colors.white , 
  fontWeight : FontWeight.w600,
);
// ...................................................
TextStyle txtModal = const TextStyle(
  fontFamily  : 'DMSans-Regular', 
  fontSize    : 16, 
  color       : Color(0XFF003566)
);
// ...................................................
TextStyle txtHoraMarca1 = const TextStyle(
  fontFamily  : 'DMSans-Regular', 
  fontSize    : 24, 
  color       : Color(0XFF003566)
);
// ...................................................
TextStyle txtTipoMarca = const TextStyle(
  fontFamily  : 'DMSans-Regular', 
  fontSize    : 18, 
  color       : Color(0XFF003566)
);
// ...................................................
TextStyle txtHoraDetalle() => GoogleFonts.dmSans(
  fontSize   : 16 , 
  color      : Color( 0XFF2d6a4f ) , 
  fontWeight : FontWeight.w600,
);
// ...................................................
TextStyle txtTardanzaDetalle() => GoogleFonts.dmSans(
  fontSize   : 16 , 
  color      : const Color( 0XFFfb8500 ) , 
  fontWeight : FontWeight.w600,
);
// ...................................................
TextStyle txtRefrigerioDetalle() => GoogleFonts.dmSans(
  fontSize   : 16 , 
  color      : const Color( 0XFF99582a ) , 
  fontWeight : FontWeight.w600,
);
// ...................................................
// ...................................................
// ...................................................

TextStyle tituloVentana() => const TextStyle(
  fontFamily: 'DMSans-Regular', fontSize: 18 , color : Color( 0XFFD8F3DC ) 
);

TextStyle txtRIT() => GoogleFonts.dmSans(
  fontSize   : 12 , 
  //color      : const Color( 0XFFFFF ) , 
  fontWeight : FontWeight.w600,
);
TextStyle txtTardanzaMes() => GoogleFonts.dmSans(
  fontSize   : 14 , 
  color      : const Color( 0XFFfb8500 ) , 
  fontWeight : FontWeight.w600,
);
// ...................................................
TextStyle txtEntradaMes() => GoogleFonts.dmSans(
  fontSize    : 14, 
  color       : Color(0XFF003566) , 
  fontWeight : FontWeight.w600,
);
// ...................................................
TextStyle txtRefrigerioMes() => GoogleFonts.dmSans(
  fontSize    : 14, 
  color       : Color( 0XFF1a759f ) , 
  fontWeight : FontWeight.w600,
);
// ...................................................
TextStyle txtSalidaMes() => GoogleFonts.dmSans(
  fontSize    : 14, 
  color       : Color( 0XFF2d6a4f ) , 
  fontWeight : FontWeight.w600,
);
// ...................................................