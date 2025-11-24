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

    // On récupère la liste des CHAPITRES
    $stmt = $bdd->prepare("SELECT * FROM Chapter");
    $stmt->execute();
    $chapters = $stmt->fetchAll(PDO::FETCH_ASSOC);
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

<!-- create-qcm.php -->
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
    <form id="create-qcm-form">

      <div id="error-container" style="color:red"></div>
      <div id="success-container" style="color:green"></div>

      <div class="div-header">
        <div class="qcm-name-div">
          <label for="qcm-name">Nom du QCM :</label>
          <input type="text" class="qcm-name" id="qcm-name" name="qcm-name" required>
        </div>

        <div class="qcm-subject-div">
          <label for="qcm-subject">Matière :</label>
          <!-- Menu déroulant de la liste des matières -->
          <select class="qcm-subject" id="qcm-subject" name="qcm-subject" required>
            <option value="">Sélectionnez une matière</option>
            <?php
            foreach ($subjects as $subject) {
                // On protège bien les valeurs et libellés
                $id   = htmlspecialchars($subject['ID_Subject'], ENT_QUOTES);
                $name = htmlspecialchars($subject['Subject_name'], ENT_QUOTES);
                echo "<option value=\"$id\">$name</option>";
            }
            ?>
          </select>
        </div>

        <div class="qcm-chapter-div">
          <label for="qcm-subject">Chapitre :</label>
          <!-- Menu déroulant de la liste des chapitre -->
          <select class="qcm-chapter" id="qcm-chapter" name="qcm-chapter" required>
            <option value="">Sélectionnez un chapitre</option>
            <!-- Les options sont ajoutés dynamiquement en JS -->
          </select>
        </div>

        <p>
          La matière ou bien le chapitre n'est pas encore disponible ?
          <a href="create-subject.php">Ajoutez-en !</a>
        </p>
      </div>
      
      <div id="forms-body">
        <div class="div-body">
          <div class="question-field">
            <label for="question">Question :</label>
            <input type="text" class="question-input" name="question" required>
          </div>
          <div class="answers">
            <div class="answer">
              <span class="answer-dot" title="Cliquez pour marquer comme bonne réponse"></span>
              <label for="answer1">Réponse 1 :</label>
              <input type="text" id="answer1" name="answer1" required>
            </div>
            <div class="answer">
              <span class="answer-dot" title="Cliquez pour marquer comme bonne réponse"></span>
              <label for="answer2">Réponse 2 :</label>
              <input type="text" id="answer2" name="answer2" required>
            </div>
          </div>
          <div class="button-field">
            <button type="button" class="add-answer">Ajouter une réponse</button>
          </div>
          <div class="toggle-switch-container">
            <span>Mode de réponse :</span>
            <label class="switch">
              <input type="checkbox" class="toggle-multiple" name="toggle-multiple">
              <span class="slider round"></span>
            </label>
            <span class="toggle-status">Sélection unique</span>
          </div>
          <div class="explanation-field">
            <label for="explanation">Explication :</label>
            <textarea id="explanation" class="explanation" name="explanation" rows="3" placeholder="Entrez ici l'explication qui sera afficher lors de la correction..."></textarea>
          </div>
          <div class="points-fields">
            <div class="negative-points">
              <label>Point négatif :</label>
              <div class="points">
                <button type="button" class="decrease-negative">-</button>
                <span class="negative-value">0</span>
                <button type="button" class="increase-negative">+</button>
              </div>
            </div>
            <div class="question-points">
              <label>Nombre de points :</label>
              <div class="points">
                <button type="button" class="decrease-points">-</button>
                <span class="points-value">2</span>
                <button type="button" class="increase-points">+</button>
              </div>
            </div>
          </div>
        </div>
        <div class="buttons">
          <button type="button" id="add-question">Ajouter une question</button>
          <div class="difficulty-field">
            <label for="difficulty">Difficulté :</label>
            <select id="difficulty" name="difficulty" required>
              <option value="easy">Facile</option>
              <option value="medium" selected>Moyen</option>
              <option value="hard">Difficile</option>
            </select> 
          </div>         
          <button type="submit" id="submit-qcm">Créer le QCM</button> <!-- L'envoie est traité en JavaScript -->
        </div>
      </div>
    </form>
  </main>
  <script>
  // Variables globales pour stocker les matières et chapitres
  const subjects = <?= json_encode($subjects, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
  const chapters = <?= json_encode($chapters, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
  </script>
  <script src="js/create-qcm.js"></script>
</body>
</html>