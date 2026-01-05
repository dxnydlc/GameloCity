import 'package:flutter/material.dart';
import 'package:push_notification/presentation/screens/screens.dart';


/*
flutter build appbundle
flutter build apk --release
 
android/app/build.gradle
android/app/src/main/AndroidManifest.xml
android/app/src/debug/AndroidManifest.xml
android/app/src/main/kotlin/com/example/familia_ssays_2025/MainActivity.kt

android/settings.gradle ||| ...android.application" version "8.2.1" 
*/

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Material App',
      initialRoute: 'home',
      routes: {
        'home'    : ( _ ) => HomeScreen() , 
        'mensaje' : ( _ ) => MnesajeScreen() , 
      },
    );
  }
}