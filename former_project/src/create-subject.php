<?php
require_once __DIR__ . '/auth.php';
// Vérification de l'authentification

// Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
if (!$isLoggedIn) {
    $_SESSION['flash_message'] = "Vous devez être connecté pour accéder à cette page.";
    setcookie("flash_message", urlencode("Vous devez être connecté pour accéder à cette page."), time() + 86400, "/", "", false, true);
    header("Location: login.php");
    exit;
}

// Si l'utilisateur n'est pas un professeur, rediriger vers la page d'accueil
if (!$isTeacher) {
    $_SESSION['flash_message'] = "Seuls les professeurs peuvent accéder à cette page.";
    setcookie("flash_message", urlencode("Seuls les professeurs peuvent accéder à cette page."), time() + 86400, "/", "", false, true);
    header("Location: index.php");
    exit;
}

try {
    // Connexion à la BDD
    $bdd = new PDO("mysql:host=$db_userserver;port=3307;dbname=$db_name;charset=utf8", $db_username, $db_password);
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // On récupère la liste des matières 
    $stmt = $bdd->prepare("SELECT * FROM Subjectt");
    $stmt->execute();
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);
  } 
catch (PDOException $e) {
    // En cas d'erreur, vous pouvez rediriger ou afficher un message d'erreur customisé
    $_SESSION['flash_message'] = "Erreur de connexion à la base de données : " . $e->getMessage();
    setcookie("flash_message", urlencode("Erreur de connexion à la base de données : " . $e->getMessage()), time() + 86400, "/", "", false, true);
    header("Location: login.php");
    exit;
}
finally {
    // Fermer la connexion
    $bdd = null;
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Créer un QCM</title>
  <link rel="stylesheet" href="css/create-qcm.css">
  <script src="js/header.js"></script>
</head>
<body>
  <header id="main-header">
    <h1 class="main_title">Créer un QCM</h1>
    <nav class="nav-link">
      <ul>
        <li><a href="index.php">Accueil</a></li>
        <li><a href="create-qcm.php">Créer un QCM</a></li>
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
        <div class=forms-container>
            
            <div id="error-container" style="color:red"></div>
            <div id="success-container" style="color:green"></div>

            <div class="div-body">
              <form id="create-chapter">
                  <h2>Créer un chapitre</h2>
                  <div class="answers">
                    <label for="subject-select">Choisir une matière </label>
                    <select name="subject-select" id="subject-select" required>
                        <option value="" disabled selected>-- Sélectionner une matière --</option>
                        <?php foreach ($subjects as $subject): ?>
                        <option value="<?= htmlspecialchars($subject['ID_Subject']) ?>"><?= htmlspecialchars($subject['Subject_name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                    <br><br>
                    <label for="chapter-name">Nom du chapitre</label>
                    <input type="text" id="chapter-name" name="chapter-name" required class=chapter-name>
                  </div>
                  <button type="submit" class=submit-chapter>Créer le chapitre</button>
              </form>
            </div>

            <div class="div-body">
              <form id="create-subject">
                  <h2>Créer une matière</h2>
                  <div class="answers">
                    <label for="subject-name">Nom de la matière </label>
                    <input type="text" id="subject-name" name="subject-name" required class=subject-name>
                  </div>
                  <button type="submit" class=submit-subject>Créer la matière</button>
              </form>
            </div>
        </div>
    </main>
    <script src="js/create-subject.js"></script>
</body>
</html>