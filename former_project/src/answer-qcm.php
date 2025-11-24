<?php
require_once __DIR__ . '/auth.php';

// Vérification de l'authentification
if (!$isLoggedIn) {
    http_response_code(403);
    $_SESSION['flash_message'] = "Vous devez être connecté pour accéder à cette page.";
    setcookie("flash_message", urlencode($_SESSION['flash_message']), time() + 86400, "/", "", false, true);
    header("Location: login.php");
    exit;
}

// Vérifier et valider l'ID du QCM dans l'URL
if (!isset($_GET['id']) || !ctype_digit($_GET['id'])) {
    http_response_code(400);
    $_SESSION['flash_message'] = "ID de QCM invalide.";
    setcookie("flash_message", urlencode($_SESSION['flash_message']), time() + 86400, "/", "", false, true);
    header("Location: select-qcm.php");
    exit;
}
$qcmId = (int)$_GET['id'];

try {
    // Connexion à la BDD
    $bdd = new PDO(
        "mysql:host=$db_userserver;port=3307;dbname=$db_name;charset=utf8",
        $db_username,
        $db_password
    );
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Récupérer les informations du QCM
    $stmtQcm = $bdd->prepare("
        SELECT Name_QCM, Difficulty
        FROM QCM
        WHERE ID_QCM = ?
    ");
    $stmtQcm->execute([$qcmId]);
    $qcm = $stmtQcm->fetch(PDO::FETCH_ASSOC);

    if (!$qcm) {
        echo "<h1>QCM non trouvé.</h1>";
        exit;
    }

    // Récupérer les questions du QCM
    $stmtQuestions = $bdd->prepare("
        SELECT 
            ID_Question,
            Question_heading,
            Type_of_question,
            Negative_points,
            Number_of_points
        FROM Question
        WHERE ID_QCM = ?
    ");
    $stmtQuestions->execute([$qcmId]);
    $questions = $stmtQuestions->fetchAll(PDO::FETCH_ASSOC);

    // Pour chaque question, récupérer les propositions
    foreach ($questions as &$question) {
        $stmtAnswers = $bdd->prepare("
            SELECT 
                ID_Proposition,
                Proposition,
                Validity
            FROM Possible_answer
            WHERE ID_Question = ?
        ");
        $stmtAnswers->execute([$question['ID_Question']]);
        $question['answers'] = $stmtAnswers->fetchAll(PDO::FETCH_ASSOC);
    }
    unset($question);

} catch (PDOException $e) {
    echo "<p>Erreur base de données : " . htmlspecialchars($e->getMessage()) . "</p>";
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Répondre au QCM – <?= htmlspecialchars($qcm['Name_QCM']) ?></title>
  <link rel="stylesheet" href="css/answer.css">
  <script src="js/header.js"></script>
</head>

<body>
<header id="main-header">
  <h1>QCM : <?= htmlspecialchars($qcm['Name_QCM']) ?></h1>
  <nav class="nav-link">
    <ul>
      <li><a href="index.php">Accueil</a></li>
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
  <form class="answer-qcm-form" method="POST" action="answer-qcm-submit.php">
    <div id="error-container" style="color:red"></div>
    <div id="success-container" style="color:green"></div>
    
    <div class="div-header">
      <p class="difficulty">Difficulté : 
        <?php if ($qcm['Difficulty'] == 0): ?>
            Facile
        <?php elseif ($qcm['Difficulty'] == 1): ?>
            Moyen
        <?php elseif ($qcm['Difficulty'] == 2): ?>
            Difficile
        <?php endif; ?>
      </p>
    </div>  
    
    <input type="hidden" name="qcmId" value="<?= $qcmId ?>">

    <?php foreach ($questions as $index => $question): ?>
      <div class="div-body" id="question-<?= $index + 1?>" data-question-id="<?= htmlspecialchars($question['ID_Question']) ?>">
        <div class="div-header">
          <div class="question-points">
            <label for="max-points">Nombre de points de la question : <?= htmlspecialchars($question['Number_of_points']) ?></label>
          </div>
          <?php if ($question['Type_of_question'] == 'unique'): ?>
            <div class="question-type">
              <label for="question-type">Type de question : Choix unique</label>
              <div class="question-negative-points">Points négatifs : <?= htmlspecialchars($question['Negative_points']) ?></div>
            </div>
          <?php elseif ($question['Type_of_question'] == 'multiple'): ?>
            <div class="question-type">
              <label for="question-type">Type de question : Choix multiple</label>
            </div>
          <?php endif; ?>
          <h3><?= htmlspecialchars($question['Question_heading']) ?></h3>
        </div>
        

        

        <?php foreach ($question['answers'] as $ans): ?>
          <span class="answer-dot" title="Cliquez pour marquer comme bonne réponse" 
          data-proposition-id="<?= htmlspecialchars($ans['ID_Proposition']) ?>" 
          data-question-id="<?=htmlspecialchars($question['ID_Question']) ?>">
          </span>
          <label class="proposition">  
            <?= htmlspecialchars($ans['Proposition']) ?>
          </label><br>
        <?php endforeach; ?>
      </div>
    <?php endforeach; ?>

    <button id="submit-qcm" type="submit">Valider mes réponses</button>
  </form>
</main>
<script>
  const qcmId = <?= json_encode($qcmId) ?>;
  
  let rawQuestions = <?= json_encode($questions) ?>;

  let questions = {};
  rawQuestions.forEach((question) => {
    questions[question.ID_Question] = question;
  });
</script>
<script src="js/answer-qcm.js"></script>
</body>
</html>
