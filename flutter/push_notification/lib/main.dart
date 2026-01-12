import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:push_notification/core/services/push_notifications_service.dart';
import 'package:push_notification/presentation/screens/screens.dart';


/*
flutter build appbundle
flutter build apk --release
 
android/app/build.gradle
android/app/src/main/AndroidManifest.xml
android/app/src/debug/AndroidManifest.xml
android/app/src/main/kotlin/com/example/familia_ssays_2025/MainActivity.kt

android/settings.gradle ||| ...android.application" version "8.2.1" 

// https://firebase.flutter.dev/docs/messaging/notifications

*/

void main() async{

  WidgetsFlutterBinding.ensureInitialized();
  await PushNotioficationService.initializeApp();

  runApp(const MyApp());

}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {

  final GlobalKey<NavigatorState> navigatorKey = new GlobalKey<NavigatorState>();
  final GlobalKey<ScaffoldMessengerState> messengerKey = new GlobalKey<ScaffoldMessengerState>();

  @override
  void initState() {
    super.initState();

    // context
    PushNotioficationService.messageStream.listen( (message){

      log('MyApp $message');

      navigatorKey.currentState?.pushNamed( 'mensaje' , arguments: message );

      final snackBar = SnackBar(content: Text( message  ) );
      messengerKey.currentState?.showSnackBar( snackBar );

    } );

  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title                   : 'Material App',
      initialRoute            : 'home',
      navigatorKey            : navigatorKey,
      scaffoldMessengerKey    : messengerKey,
      routes: {
        'home'    : ( _ ) => HomeScreen() , 
        'mensaje' : ( _ ) => MnesajeScreen() , 
      },
    );
  }
}