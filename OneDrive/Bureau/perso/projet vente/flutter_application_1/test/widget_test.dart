import 'package:flutter_test/flutter_test.dart';
// Important : On importe le fichier main pour avoir accès à MyApp
// Si votre projet s'appelle autrement que flutter_application_1, changez le nom ici
import 'package:flutter_application_1/main.dart'; 

void main() {
  testWidgets('Vérifie que la page de connexion s\'affiche', (WidgetTester tester) async {
    // 1. On lance l'application virtuelle (MyApp)
    await tester.pumpWidget(const MyApp());

    // 2. On vérifie que le texte "Bon retour !" est présent à l'écran
    // (findsOneWidget signifie "On doit en trouver exactement un")
    expect(find.text('Bon retour !'), findsOneWidget);

    // 3. On vérifie que le texte "Créer un compte" est aussi là
    expect(find.text('Créer un compte'), findsOneWidget);

    // 4. On s'assure qu'il n'y a PAS de compteur "0" (comme dans l'ancienne app)
    expect(find.text('0'), findsNothing);
  });
}