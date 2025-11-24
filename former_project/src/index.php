<?php
require_once __DIR__ . '/auth.php';
// Vérification de l'authentification
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accueil - QCM Website</title>
    <link rel="stylesheet" href="css/create-qcm.css">
    <script src="js/header.js"></script>
</head>
<body>
    <header id=main-header>
        <h1 class="main_title">Bienvenue sur SOSprépa</h1>
        <nav class="nav-link">
            <ul>
                <!-- Si l'utilisateur n'est pas connecté il a accès à des liens de connexion-->
                <?php if (!$isLoggedIn): ?>
                    <li><a href="register.php">Créer un compte</a></li>
                    <li><a href="login.php">Connexion</a></li>
                <?php endif; ?>

                <li><a href="index.php">Accueil</a></li>
                
                <!-- Si l'utilisateur est un professeur, alors il a accès au menu de création de qcm -->
                <?php if ($isLoggedIn && $isTeacher): ?>
                    <li><a href="create-qcm.php">Créer un QCM</a></li>
                <?php endif; ?>
                
                <li><a href="select-qcm.php">Liste de QCM</a></li>
                <li><a href="lessons.php">Notions de cours</a></li>
            </ul>
        </nav>
    </header>

    <!-- Affichage des messages flash -->
    <?php if (!empty($_SESSION['flash_message'])): ?>
    <div class="flash-message">
        <?= htmlspecialchars($_SESSION['flash_message']) ?>
    </div>
    <?php unset($_SESSION['flash_message']); ?>
    <?php setcookie("flash_message", "", time() - 3600, "/"); ?>
    <?php endif; ?>

    <main>
  <section>
    <h2>Pourquoi choisir SOSprépa ?</h2>
    <ul>
      <li>✅ Aligné avec le programme EFREI</li>
      <li>✅ Révision efficace et interactive</li>
      <li>✅ Accessible sur tous les appareils</li>
    </ul>
  </section>

  <section>
    <h2>Pour qui ?</h2>
    <p>🎓 Élèves de 1ʳᵉ et 2ᵉ année motivés à réussir leurs CC et à gagner en confiance.</p>
  </section>

  <section>
    <h2>Comment ça marche ?</h2>
    <ol>
      <li>📂 Choisis une matière</li>
      <li>📝 Lance un QCM</li>
      <li>📊 Analyse tes résultats</li>
      <li>🔁 Progresse à ton rythme</li>
    </ol>
    <button id="boutonaction" onclick="window.location.href='select-qcm.php'">Passer à l'action !
        <style>
            button{
                display: inline-block;
                font-weight: bold;
                color:#fcf3e8;
                background: linear-gradient(50deg, #db7850, #d64237);
                border-radius: 30px;
                padding: 10px 10px;
                cursor: pointer;
                border: none;
                margin-top: 0; /* Pas d'espace pour ce bouton */
            }

            button:hover {
                background: #a04945;
            }
        </style>
    </button>
  </section>

  <section>
    <h2>Témoignages</h2>
    <blockquote>“C’est exactement ce qu’il me fallait pour mes révisions !”</blockquote>
    <blockquote>“Super simple d’utilisation et très pratique pour les contrôles !”</blockquote>
  </section>
</main>
    <footer>
        <p>&copy; 2025 QCM Website</p>
    </footer>
    <script src="js/main.js"></script>
</body>
</html>