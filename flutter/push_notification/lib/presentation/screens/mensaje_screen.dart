import 'package:flutter/material.dart';

class MnesajeScreen extends StatelessWidget {
  const MnesajeScreen({super.key});

  @override
  Widget build(BuildContext context) {

    final args = ModalRoute.of( context )?.settings.arguments ?? 'no data';

    return Scaffold(
      appBar: AppBar(
        title: Text('Inicio'),
      ),
      body: Center(
        child: Text('$args' , style : TextStyle( fontSize: 30 ) ),
      ),
    );
  }
}