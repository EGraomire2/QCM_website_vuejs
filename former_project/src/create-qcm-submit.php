<?php
header('Content-Type: application/json');
// importe auth.php, qui fait le session_start et valide token + Teacher==1
require_once __DIR__.'/auth.php';

// Lire le JSON reçu
$json = file_get_contents('php://input');
$data = json_decode($json, true);
error_log("Données brutes reçues : " . $json);

if (!$data) {
    // Gérer l'erreur si le JSON est invalide
    echo "Données JSON invalides : " . json_last_error_msg();
    http_response_code(400);
    exit;
}

if (!$isLoggedIn) {
    http_response_code(401);
    echo json_encode(["error" => "Utilisateur non authentifie (token invalide)."]);
    error_log("Token invalide pour l'utilisateur ID: " . $_SESSION['id_user']);
    exit;
}

if (!$isTeacher) {
    http_response_code(403);
    echo json_encode(["error" => "Acces refuse : vous n'êtes pas professeur."]);
    exit;
}


// $data contient:
// $data['qcmName']
// $data['qcmSubject']
// $data['difficulty']
// $data['questions'] => tableau de questions
// Pour chaque question, vous avez :
// - question : le texte de la question
// - answers : tableau de réponses
// - isCorrect : tableau de booléens indiquant la validité de chaque réponse
// - multipleCorrect, negativePoints, questionPoints

$bdd = null;
try{    
    $bdd = new PDO("mysql:host=$db_userserver;port=3307;dbname=$db_name;charset=utf8", $db_username, $db_password);
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Démarrage de la transaction
    $bdd->beginTransaction();

    $userId = $_SESSION['id_user']; // ID de l'utilisateur connecté

    // Insertion dans la table QCM
    $stmtQcm = $bdd->prepare("INSERT INTO QCM (Name_QCM, Difficulty, ID_user, ID_Chapter) VALUES (?, ?, ?, ?)");
    $stmtQcm->execute([$data['qcmName'], $data['difficulty'], $userId, $data['qcmChapter']]);
    $qcmId = $bdd->lastInsertId();

    // Insertion des questions
    foreach ($data['questions'] as $q) {
        // Déterminer le type de question à partir du booléen multipleCorrect
        $type_of_question = $q['multipleCorrect'] ? 'multiple' : 'unique';

        // Insertion dans la table Question
        $stmtQuestion = $bdd->prepare("INSERT INTO Question (Question_heading, Number_of_points, Type_of_question, Negative_points, Explanation, ID_QCM) VALUES (?, ?, ?, ?, ?, ?)");
        $stmtQuestion->execute([$q['question'], $q['questionPoints'], $type_of_question, $q['negativePoints'], $q['explanation'], $qcmId]);
        $questionId = $bdd->lastInsertId();

        // Insertion des réponses possibles pour cette question
        foreach ($q['answers'] as $index => $answerText) {
            // L'élément isCorrect est attendu sous forme de booléen dans le JSON.
            $isCorrect = isset($q['isCorrect'][$index]) && $q['isCorrect'][$index] ? 1 : 0;
            $stmtAnswer = $bdd->prepare("INSERT INTO Possible_answer (Proposition, Validity, ID_Question) VALUES (?, ?, ?)");
            $stmtAnswer->execute([$answerText, $isCorrect, $questionId]);
        }
    }

    // Validation de la transaction
    $bdd->commit();

    echo json_encode(["success" => true, "message" => "QCM créé avec succès."]);

} catch (PDOException $e) {
    if ($bdd->inTransaction()) {
        $bdd->rollBack();
    }
    http_response_code(500);
    echo "Erreur : " . $e->getMessage();
}
finally {
    // Fermer la connexion
    $bdd = null;
}
?>