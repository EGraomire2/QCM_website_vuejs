<?php
header('Content-Type: application/json');
// importe auth.php, qui fait le session_start et valide token + Teacher==1
require_once __DIR__.'/auth.php';

// Lire le JSON reçu
$json = file_get_contents('php://input');
$data = json_decode($json, true);
if (!$data || !isset($data['subjectName'])) {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'error'   => 'Champ subjectName manquant'
    ]);
    exit;
}

if (!$isLoggedIn) {
    http_response_code(401);
    echo json_encode(['success'=>false,'error'=>'Non authentifié']);
    exit;
}

if (!$isTeacher) {
    http_response_code(403);
    echo json_encode(['success'=>false,'error'=>'Accès refusé' . $isTeacher]);
    exit;
}


$bdd = null;
try{    
    $bdd = new PDO("mysql:host=$db_userserver;port=3307;dbname=$db_name;charset=utf8", $db_username, $db_password);
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Démarrage de la transaction
    $bdd->beginTransaction();

    // On insert dans la table subjectt
    $stmtSubject = $bdd->prepare("INSERT INTO Subjectt (Subject_name) VALUES (?)");
    $stmtSubject->execute([$data['subjectName']]);
    $insertedId = $bdd->lastInsertId(); // Récupérer l'ID de la matière insérée

    // Validation de la transaction
    $bdd->commit();

    echo json_encode(["success" => true, "message" => "Matière créée avec succès.", "insertedId" => $insertedId]);
} catch (PDOException $e) {
    if ($bdd && $bdd->inTransaction()) {
        $bdd->rollBack();
    }
    http_response_code(500);
    echo json_encode([
      'success'=>false,
      'error'  => 'Erreur BDD: '.$e->getMessage()
    ]);
}
finally {
    // Fermer la connexion
    $bdd = null;
}
?>