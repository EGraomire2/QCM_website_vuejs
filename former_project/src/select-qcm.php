<?php
require_once __DIR__ . '/auth.php';

// Vérification de l'authentification
if (!$isLoggedIn) {
    $_SESSION['flash_message'] = "Vous devez être connecté pour accéder à cette page.";
    setcookie("flash_message", urlencode("Vous devez être connecté pour accéder à cette page."), time() + 86400, "/", "", false, true);
    header("Location: login.php");
    exit;
}

try {
    $bdd = new PDO("mysql:host=$db_userserver;port=3307;dbname=$db_name;charset=utf8", $db_username, $db_password);
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //On récupère la liste des matières
    $stmt = $bdd->prepare("SELECT * FROM Subjectt");
    $stmt->execute();
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // On récupère la liste des chapitres
    $stmt = $bdd->prepare("SELECT * FROM Chapter");
    $stmt->execute();
    $chapters = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Récupérer les QCM disponibles pour l'utilisateur
    $stmt = $bdd->prepare("SELECT * FROM QCM WHERE ID_user = ?");
    $stmt->execute([$_SESSION['id_user']]);
    $qcmList = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // On récupère la liste des QCM auquel l'utilisateur a répondu
    $stmt = $bdd->prepare('SELECT ID_Attempt, ID_QCM, Grade, Date_Attempt FROM Attempt WHERE ID_user = ?');
    $stmt->execute([$_SESSION['id_user']]);
    $attemptedQCM = $stmt->fetchAll(PDO::FETCH_ASSOC);
} 
catch (PDOException $e) {
    $_SESSION['flash_message'] = "Erreur de connexion à la base de données - lors de la récupération des qcm disponibles : " . $e->getMessage();
    setcookie("flash_message", urlencode("Erreur de connexion à la base de données - lors de la récupération des qcm disponibles : " . $e->getMessage()), time() + 86400, "/", "", false, true);
    header("Location: index.php");
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
    <title>Répondre à un QCM</title>
    <link rel="stylesheet" href="css/select-qcm.css">
    <script src="js/header.js"></script>
</head>
<body>
    <header id="main-header">
        <h1 class="main_title">S'exercer et progresser</h1>
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
    
    <br><br><br><br>
    <!-- Affichage des messages flash -->
    <?php if (!empty($_SESSION['flash_message'])): ?>
    <div class="flash-message">
        <?= htmlspecialchars($_SESSION['flash_message']) ?>
    </div>
    <?php unset($_SESSION['flash_message']); ?>
    <?php setcookie("flash_message", "", time() - 3600, "/"); ?>
    <?php endif; ?>

    <main>
        <div class="div-header">
            <h2>Liste des QCM disponibles</h2>    
            <label for="subject-list">Choisissez une matière :</label>
            <select id="subject-list" name="subject-list" required>
                <option value="" disabled selected>-- Sélectionner une matière --</option>
                <?php foreach ($subjects as $subject): ?>
                <option value="<?= htmlspecialchars($subject['ID_Subject']) ?>"><?= htmlspecialchars($subject['Subject_name']) ?></option>
                <?php endforeach; ?>
            </select>
            <br><br>
            <label ofr="chapter-list">Choisissez un chapitre :</label>
            <select id="chapter-list" name="chapter-list" required>
                <option value="" disabled selected>-- Sélectionner un chapitre --</option>
                <!-- Options de chapitre à remplir dynamiquement -->
            </select>
        </div>

        <!-- Affichage des qcm correspondant -->
        <div class="forms-body">
            <!-- Liste des QCM à remplir dynamiquement -->
        </div>
    </main>
    <script>
        // Variables globales pour stocker les matières et chapitres
        const subjects = <?= json_encode($subjects, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
        const chapters = <?= json_encode($chapters, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
        const qcmList = <?= json_encode($qcmList, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
        const attemptedQCM = <?= json_encode($attemptedQCM, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
    </script>
    <script src="js/select-qcm.js"></script>
</body>
</html>