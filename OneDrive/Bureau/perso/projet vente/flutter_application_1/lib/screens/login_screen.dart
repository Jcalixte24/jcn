import 'package:flutter/material.dart';
import 'admin/admin_dashboard.dart';
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // Contrôleurs
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController(); // Nouveau
  final TextEditingController _nameController = TextEditingController(); // Nouveau pour l'inscription
  
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  bool _isLoginSelected = true; // true = Connexion, false = Inscription

  // Couleurs
  final Color primaryRed = const Color(0xFFFF3B30);
  final Color darkBlue = const Color(0xFF1A1A2E);

  @override
  Widget build(BuildContext context) {
    // LayoutBuilder 
    return Scaffold(
      backgroundColor: Colors.black,
      body: LayoutBuilder(
        builder: (context, constraints) {
          return Stack(
            children: [
              // IMAGE DE FOND 
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                height: constraints.maxHeight * 0.45, // 45% de la hauteur dispo
                child: Container(
                  decoration: const BoxDecoration(
                    image: DecorationImage(
                      image: NetworkImage(
                        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
                      ),
                      fit: BoxFit.cover,
                    ),
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withOpacity(0.2),
                          Colors.black.withOpacity(0.7),
                        ],
                      ),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 20),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: Colors.white.withOpacity(0.3)),
                          ),
                          child: const Text(
                            "MODE & TENDANCE",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          "La mode ivoirienne\nvous attend.",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            height: 1.1,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              Align(
                alignment: Alignment.bottomCenter,
                child: Container(
                  height: constraints.maxHeight * 0.65, // Prend 65% du bas
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(30),
                      topRight: Radius.circular(30),
                    ),
                  ),
                  child: Column(
                    children: [
                      const SizedBox(height: 20),
                      // Indicateur visuel pour scroller (optionnel)
                      Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.grey[300],
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      
                      // Le contenu scrollable
                      Expanded(
                        child: SingleChildScrollView(
                          padding: const EdgeInsets.fromLTRB(24, 20, 24, 20),
                      
                          physics: const BouncingScrollPhysics(), 
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // --- CONNEXION / INSCRIPTION ---
                              Container(
                                padding: const EdgeInsets.all(4),
                                decoration: BoxDecoration(
                                  color: Colors.grey[100],
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Row(
                                  children: [
                                    Expanded(child: _buildTabButton("Se connecter", true)),
                                    Expanded(child: _buildTabButton("S'inscrire", false)),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 24),

                              // --- FORMULAIRE  ---
                              AnimatedCrossFade(
                                duration: const Duration(milliseconds: 300),
                                crossFadeState: _isLoginSelected 
                                    ? CrossFadeState.showFirst 
                                    : CrossFadeState.showSecond,
                                
                                // VUE 1 : CONNEXION
                                firstChild: _buildLoginForm(),

                                // VUE 2 : INSCRIPTION
                                secondChild: _buildSignupForm(),
                              ),

                              const SizedBox(height: 24),

                              // --- SEPARATEUR ---
                              Row(
                                children: [
                                  Expanded(child: Divider(color: Colors.grey[200])),
                                  Padding(
                                    padding: const EdgeInsets.symmetric(horizontal: 16),
                                    child: Text("Ou continuer avec", 
                                      style: TextStyle(color: Colors.grey[400], fontSize: 12)),
                                  ),
                                  Expanded(child: Divider(color: Colors.grey[200])),
                                ],
                              ),
                              const SizedBox(height: 24),

                              // --- BOUTONS SOCIAUX ---
                              Row(
                                children: [
                                  Expanded(
                                    child: _buildSocialButton(
                                      "Google", 
                                      Icons.g_mobiledata,
                                      Colors.black87, 
                                      () {}
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: _buildSocialButton(
                                      "Facebook", 
                                      Icons.facebook, 
                                      const Color(0xFF1877F2), 
                                      () {}
                                    ),
                                  ),
                                ],
                              ),
                              // Espace pour éviter que le clavier cache le bas sur petit écran
                              const SizedBox(height: 20),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  // --- WIDGET DU FORMULAIRE DE CONNEXION ---
  Widget _buildLoginForm() {
    return Column(
      children: [
        _buildPhoneField(),
        const SizedBox(height: 16),
        _buildPasswordField(_passwordController, "Mot de passe", _isPasswordVisible, () {
          setState(() => _isPasswordVisible = !_isPasswordVisible);
        }),
        Align(
          alignment: Alignment.centerRight,
          child: TextButton(
            onPressed: () {},
            child: Text("Mot de passe oublié ?", 
              style: TextStyle(color: primaryRed, fontWeight: FontWeight.w600, fontSize: 13)),
          ),
        ),
        const SizedBox(height: 8),
        _buildActionButton("Se connecter"),
      ],
    );
  }

  // --- WIDGET DU FORMULAIRE D'INSCRIPTION ---
  Widget _buildSignupForm() {
    return Column(
      children: [
        // Champ Nom complet 
        Container(
          decoration: BoxDecoration(
            color: Colors.grey[50],
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: TextField(
            controller: _nameController,
            decoration: const InputDecoration(
              hintText: "Nom complet (ex: Jean Kouassi)",
              prefixIcon: Icon(Icons.person_outline, color: Colors.grey),
              border: InputBorder.none,
              contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            ),
          ),
        ),
        const SizedBox(height: 16),
        
        _buildPhoneField(),
        const SizedBox(height: 16),
        
        _buildPasswordField(_passwordController, "Mot de passe", _isPasswordVisible, () {
          setState(() => _isPasswordVisible = !_isPasswordVisible);
        }),
        const SizedBox(height: 16),
        
        // Champ Confirmation 
        _buildPasswordField(_confirmPasswordController, "Confirmer le mot de passe", _isConfirmPasswordVisible, () {
          setState(() => _isConfirmPasswordVisible = !_isConfirmPasswordVisible);
        }),
        
        const SizedBox(height: 24),
        _buildActionButton("Créer mon compte"),
      ],
    );
  }

  // --- COMPOSANTS RÉUTILISABLES ---

  Widget _buildPhoneField() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
            decoration: BoxDecoration(
              border: Border(right: BorderSide(color: Colors.grey.shade300)),
            ),
            child: const Row(
              children: [
                Text("🇨🇮", style: TextStyle(fontSize: 20)),
                SizedBox(width: 8),
                Text("+225", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black54)),
              ],
            ),
          ),
          Expanded(
            child: TextField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                hintText: "01 02 03 04 05",
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPasswordField(TextEditingController controller, String hint, bool isVisible, VoidCallback onToggle) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: TextField(
        controller: controller,
        obscureText: !isVisible,
        decoration: InputDecoration(
          hintText: hint,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          prefixIcon: const Icon(Icons.lock_outline, color: Colors.grey),
          suffixIcon: IconButton(
            icon: Icon(isVisible ? Icons.visibility : Icons.visibility_off, color: Colors.grey),
            onPressed: onToggle,
          ),
        ),
      ),
    );
  }

  Widget _buildActionButton(String text) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () {
          if (_isLoginSelected) {
            print("Tentative de connexion...");
          } else {
            print("Tentative d'inscription avec confirmation...");
            if (_passwordController.text != _confirmPasswordController.text) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Les mots de passe ne correspondent pas !"))
              );
            }
          }
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryRed,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 18),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          elevation: 0, 
        ),
        child: Text(text, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildTabButton(String text, bool isLoginTab) {
    bool isSelected = _isLoginSelected == isLoginTab;
    return GestureDetector(
      onTap: () {
        setState(() {
          _isLoginSelected = isLoginTab;
         
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          boxShadow: isSelected
              ? [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, spreadRadius: 1)]
              : [],
        ),
        child: Center(
          child: Text(
            text,
            style: TextStyle(
              color: isSelected ? primaryRed : Colors.grey[600],
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSocialButton(String label, IconData icon, Color color, VoidCallback onTap) {
    return OutlinedButton(
      onPressed: onTap,
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 12),
        side: BorderSide(color: Colors.grey.shade200),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(width: 8),
          Text(label, style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}