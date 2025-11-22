<?php
session_start();

header('Content-Type: application/json');

$db_userserver = "localhost";
$db_username = "root";
$db_password = "";
$db_name = "sos_prepa_bdd";

$response = ["success" => false];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = filter_var(trim($_POST["email"]), FILTER_VALIDATE_EMAIL);
    $password = $_POST["password"];

    if (!$email) {
        $response['error'] = "Adresse e-mail invalide.";
        echo json_encode($response);
        exit;
    }

    try {    
        $bdd = new PDO("mysql:host=$db_userserver;port=3307;dbname=$db_name;charset=utf8", $db_username, $db_password);
        $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Sélection de l'utilisateur par email uniquement
        $stmt = $bdd->prepare("SELECT * FROM Accountt WHERE Email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['Password'])) {
            session_regenerate_id(true);
            $token = bin2hex(random_bytes(16));
            
            $stmtUpdate = $bdd->prepare("UPDATE Accountt SET Token = ? WHERE Email = ?");
            $stmtUpdate->execute([$token, $email]);
            
            $_SESSION['email'] = $email;
            $_SESSION['token'] = $token;
            $_SESSION['id_user'] = $user['ID_user'];
            
            setcookie("token", $token, time() + 86400, "/", "", false, true);
            setcookie("email", $email, time() + 86400, "/", "", false, true);
            setcookie("id_user", $user['ID_user'], time() + 86400, "/", "", false, true);

            $response['success'] = true;
        } 
        else {
            $response['error'] = "Email ou mot de passe incorrect.";
        }
    } catch (PDOException $e) {
        error_log("Erreur PDO : " . $e->getMessage());
        $response['error'] = "Erreur de connexion, veuillez réessayer.";
    } finally {
        $bdd = null;
    }
} else {
    $response['error'] = "Formulaire soumis incorrectement.";
}

echo json_encode($response);
exit;
?>
