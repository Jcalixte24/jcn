import 'package:flutter/material.dart';

import 'screens/login_screen.dart'; 

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'La Casa Bismark',
      debugShowCheckedModeBanner: false, // Enlève le bandeau "Debug" rouge en haut à droite
      theme: ThemeData(
        // Définit la couleur principale (Violet) pour toute l'application
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF7F13EC)),
        useMaterial3: true,
      ),
      // C'est ici qu'on dit à l'appli de démarrer sur la page de connexion
      home: const LoginScreen(), 
    );
  }
}