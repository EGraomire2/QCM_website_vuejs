<?php
header('Content-Type: application/json');
require_once __DIR__ . '/auth.php';

$debug = []; // tableau pour stocker les infos de test

// Lire le JSON reçu
$json = file_get_contents('php://input');
$payload = json_decode($json, true);
if (!$payload || !isset($payload['qcmId'], $payload['answers']) || !is_array($payload['answers'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Données manquantes ou mal formées.']);
    exit;
}

if (!$isLoggedIn) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Non authentifié.']);
    exit;
}

$qcmId   = (int) $payload['qcmId'];
$answers = $payload['answers'];

try {
    $bdd = new PDO("mysql:host=$db_userserver;port=3307;dbname=$db_name;charset=utf8", $db_username, $db_password);
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $bdd->beginTransaction();

    // Si l'utilisateur a déjà fait une tentative de réponse au QCM, on supprime son ancienne tentative
    $stmt = $bdd->prepare("DELETE FROM Attempt WHERE ID_QCM = ? AND ID_user = ?");
    $stmt->execute([$qcmId, $_SESSION['id_user']]);

    $stmt = $bdd->prepare("INSERT INTO Attempt (Date_attempt, Grade, ID_QCM, ID_user) VALUES (NOW(), 0, ?, ?)");
    $stmt->execute([$qcmId, $_SESSION['id_user']]);
    $attemptId = $bdd->lastInsertId();

    $questions = $bdd->prepare("SELECT * FROM Question WHERE ID_QCM = ?");
    $questions->execute([$qcmId]);
    $questions = $questions->fetchAll(PDO::FETCH_ASSOC);

    $totalPoints = 0;
    $earnedPoints = 0;

    $insertAnswerQ = $bdd->prepare("INSERT INTO Answer_question (Points_earned, ID_Question, ID_Attempt) VALUES (?, ?, ?)");
    $insertHasAnswered = $bdd->prepare("INSERT INTO Has_answered (ID_Proposition, ID_Answer) VALUES (?, ?)");

    $getPropositions = $bdd->prepare("SELECT ID_Proposition, Validity FROM Possible_answer WHERE ID_Question = ?");

    foreach ($questions as $question) {
        $questionId = $question['ID_Question']; // ID de la question

        // On Récupère les propositions de la question
        $getPropositions->execute([$questionId]);
        $propositions = $getPropositions->fetchAll(PDO::FETCH_ASSOC);                
        
        // On récupère le nombre de points de la question 
        $Number_of_points = $question['Number_of_points'];
        $Points_earned = (int)$Number_of_points;
        $isUnique = ($question['Type_of_question'] === 'unique'); // Bool si la question est unique ou multiple
        
        
        $selected = [];
        foreach ($answers as $resp) {
            if ($resp['questionId'] == $questionId) {
                $selected[] = $resp['propositionId'];
            }
        }
        foreach ($propositions as $prop) {
            // --------- Application des pertes de points -------
            // Si la question est unique, on regarde si la bonne réponse a été sélectionnée
            if ($isUnique){
                if ($prop['Validity'] && !in_array($prop['ID_Proposition'], $selected)){
                    $Points_earned = - $question['Negative_points'];
                    $debug[] = ["Proposition ID : " . $prop['ID_Proposition'] . " est l'unique reponse mais n est pas selectionnee .". $Points_earned];
                }
            }else{
                if (in_array($prop['ID_Proposition'], $selected)) {
                    if (!$prop['Validity']) {
                        $Points_earned -= $question['Negative_points'];
                        $debug[] = ["Proposition ID : " . $prop['ID_Proposition'] . " est fausse.". $Points_earned];
                    }
                } else {
                    if ($prop['Validity']) {
                        $Points_earned -= $question['Negative_points'];
                        $debug[] = ['Cette proposition : '. $prop['ID_Proposition'] . 'n a pas ete selectionnee ' . $Points_earned];
                    }
                }

                if ($Points_earned < 0) {
                    $Points_earned = 0;
                }
            }

            // --------- Fin Application des pertes de points -------
        }
        
        // Insertion de la réponse dans la table Answer_question
        $insertAnswerQ->execute([$Points_earned, $questionId, $attemptId]);
        $answerId = $bdd->lastInsertId();

        foreach ($selected as $propId) {
            $insertHasAnswered->execute([(int)$propId, $answerId]);
        }

        $totalPoints  += $Number_of_points;
        $earnedPoints += $Points_earned;
        $debug[] = ["number of points : ". $totalPoints . " earned points : " . $earnedPoints];
    }

    $grade = ($earnedPoints / $totalPoints) * 20;
    if ($grade < 0) {
        $grade = 0;
    }
    $stmt = $bdd->prepare("UPDATE Attempt SET Grade = ? WHERE ID_Attempt = ?");
    $stmt->execute([$grade, $attemptId]);

    $bdd->commit();

    echo json_encode([
        'success'      => true,
        'attemptId'    => $attemptId,
        'totalPoints'  => $totalPoints,
        'earnedPoints' => $earnedPoints,
        'debug'       => $debug
    ]);

} catch (PDOException $e) {
    if ($bdd && $bdd->inTransaction()) {
        $bdd->rollBack();
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erreur BDD: ' . $e->getMessage()]);
    exit;
}
