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
if (!isset($_GET['qcm-id']) || !ctype_digit($_GET['qcm-id']) || !isset($_GET['attempt-id']) || !ctype_digit($_GET['attempt-id'])) {
    http_response_code(400);
    $_SESSION['flash_message'] = "qcm-id ou user-id invalide.";
    setcookie("flash_message", urlencode($_SESSION['flash_message']), time() + 86400, "/", "", false, true);
    header("Location: select-qcm.php");
    exit;
}
$qcmId = (int)$_GET['qcm-id'];
$attemptId = (int)$_GET['attempt-id'];

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
            explanation,
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
        // Récupérer les propositions de la question
        $stmtAnswers = $bdd->prepare("
            SELECT 
                ID_Proposition,
                Proposition,
                Validity
            FROM Possible_answer
            WHERE ID_Question = ?
        ");
        $stmtAnswers->execute([$question['ID_Question']]);
        $question['propositions'] = $stmtAnswers->fetchAll(PDO::FETCH_ASSOC);

        // Récupérer les réponses de l'utilisateur
        $stmtAnswers = $bdd->prepare("SELECT P.ID_Proposition FROM Possible_answer AS P
        JOIN has_answered ON P.ID_Proposition = has_answered.ID_Proposition 
        JOIN answer_question ON has_answered.ID_Answer = answer_question.ID_Answer
        WHERE answer_question.ID_Attempt = ? AND answer_question.ID_Question = ?");
        $stmtAnswers->execute([$attemptId, $question['ID_Question']]);
        $question['answers'] = $stmtAnswers->fetchAll(PDO::FETCH_COLUMN, 0);

        // Récupérer les informations sur la réponse à la question
        $stmtQuestionAnswers = $bdd->prepare("SELECT ID_Answer, Points_earned, ID_Question
            FROM Answer_question
            WHERE ID_Attempt = ? AND ID_Question = ?");
        $stmtQuestionAnswers->execute([$attemptId, $question['ID_Question']]);
        $question['question_answer'] = $stmtQuestionAnswers->fetch(PDO::FETCH_ASSOC);
    }
    unset($question); // Libérer la référence

    // Récupérer la tentative de l'utilisateur
    $stmtAttempt = $bdd->prepare("SELECT * FROM Attempt WHERE ID_Attempt = ?");
    $stmtAttempt->execute([$attemptId]);
    $attempt = $stmtAttempt->fetch(PDO::FETCH_ASSOC);

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
    <title>Répondre à un QCM</title>
    <link rel="stylesheet" href="css/correct.css">
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
        
        <div class=div-header>
            <div class="qcm-header">
                <h2><?= htmlspecialchars($qcm['Name_QCM']) ?></h2>
                <label for="grade"> <?= htmlspecialchars($attempt['Grade']) ?>/20 </label>
            </div>
            
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
            <div class="question-points">
                <label for="max-points">Points maximum : <?= htmlspecialchars($question['Number_of_points']) ?></label>
                <label for="earned-points"> Points obtenus : <?= htmlspecialchars($question['question_answer']['Points_earned']) ?></label>
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

            <?php foreach ($question['propositions'] as $prop): ?>
                <?php if ($prop['Validity'] == 1): ?>
                <div class="true">
                <?php else: ?>
                <div class="false">
                <?php endif; ?>
                    <?php if (in_array($prop['ID_Proposition'], $question['answers'])): ?>
                        <span class="answer-dot correct" title="Vous avez sélectionné cette réponse"></span>
                    <?php else: ?>
                        <span class="answer-dot" title="Vous avez sélectionné cette réponse"></span>
                    <?php endif; ?>
                    <span class="proposition">  
                        <?= htmlspecialchars($prop['Proposition']) ?>
                    </span>
                </div>
            <?php endforeach; ?>
            <p class="explanation">
                <?php if ($question['explanation'] != ''): ?>
                    Explication : <?= htmlspecialchars($question['explanation']) ?>
                <?php endif; ?>
            </p>
        </div>
        <?php endforeach; ?>
    </form>
</main>
</body>
</html>