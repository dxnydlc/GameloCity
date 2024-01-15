/**
// Color en elevatedbutton icon
// https://www.flutterbeads.com/elevated-button-color-in-flutter/

ElevatedButton(
  onPressed: () {},
  style: ElevatedButton.styleFrom(
    foregroundColor : Colors.white ,
    backgroundColor : Colors.green.shade300 , // Text Color (Foreground color),
    fixedSize       : const Size(150, 70)
  ),
  child: const Text(
    'Elevated Button',
    style: TextStyle(fontSize: 40),
  ),
)

==================================================== NUEVA PANTALLA ====================================================
// ...................................................
final Medida = MediaQuery.of(context).size;
// ...................................................
TextStyle txtTitulo = TextStyle(
  fontFamily: 'FiraCode-Regular', fontSize: 18 , color : Color( 0xFF081C15 ) 
);
// ...................................................
const txtReg12 = TextStyle(
  fontFamily: 'FiraCode-Regular', fontSize: 12 , color : Color( 0XFF1B4332 )
);
// ...................................................
const txtBtn16W = TextStyle(
  fontFamily: 'FiraCode-Bold', fontSize: 18 , color : Color( 0XFFD8F3DC )
);
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
return Scaffold(
  appBar: AppBar(
    title : Text( 'Monitoreo' , style : txtTitulo ),
    actions: [
      IconButton(
        onPressed: (){
          Navigator.pushReplacementNamed(context, HomeMonitoreo_Screen.routerPantalla );
        }, 
        icon : const Icon( IconlyLight.close_square , color : Color( 0XFFD8F3DC ) , )
      ),
    ],
  ),
  body: Container(
    width: double.infinity , 
    child: Padding(
      padding: const EdgeInsets.all(8.0),
      child: SizedBox(
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              children: [
                // ...................................................
                Text('Ingrese Nro de OT'),
                // ...................................................
                // ...................................................
                // ...................................................
                // ...................................................
                // ...................................................
                // ...................................................
              ],
            ),
          ),
        ),
      ),
    ),
  ),
);
// ...................................................

==================================================== BOTON ====================================================

ElevatedButton.icon(
  style: ElevatedButton.styleFrom(
    foregroundColor : Color( 0XFFD8F3DC ) ,
    backgroundColor : Color( 0XFF2D6A4F ) , // Text Color (Foreground color),
    fixedSize       : const Size( 180 , 40 )
  ),
  onPressed: ()async{
    //
  }, 
  icon    : Icon( IconlyLight.arrow_right_2 ) , 
  label   : Text( 'Continuar' , style : txtBtn16W ) , 
),





==================================================== GUARDAR ==================================
Future<String> guardar ()async{

  isLoading = true;
  notifyListeners();

  String token = await _storage.read(key: 'token_session') ?? '';
  final headers = {
    'Content-Type'  : 'application/json',
    'Charset'       : 'utf-8',
    'Authorization' : 'Bearer $token'
  };
  var url;
  var resp;

  //
  if( TurnoSelect?.id == 0 ){
    url = Uri.https( _baseMysql , 'v1/asistencia-turnos/guardar' );
    resp = await http.post( url , headers : headers , body: TurnoSelect?.toRawJson() );
    //
  }else{
    //
    url = Uri.https( _baseMysql , 'v1/asistencia-turnos/actualizar/${TurnoSelect?.uuId}' );
    resp = await http.patch( url , headers : headers , body: TurnoSelect?.toRawJson() );
  }
  print( resp.body );

  CodigoResp = resp.statusCode;

  if( resp.statusCode == 200 )
  {
    TurnoSelect = TurnosModel.fromRawJson( resp.body );
    //
  }else{
    //
    final Map<String, dynamic> prevData = json.decode( resp.body );
    MessageResp = prevData['message'].toString();
  }

  isLoading = false;
  notifyListeners();
  return '';
}





==================================================== SETERS GETTERS ==================================
String _NuevaClave = '';

String get NuevaClave => _NuevaClave;
// ..................................................
set NuevaClave ( String value )
{
  _NuevaClave = value;
  notifyListeners();
}


*/