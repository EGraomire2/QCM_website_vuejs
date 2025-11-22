<?php
session_start();
header('Content-Type: application/json');

$db_userserver = "localhost";
$db_username = "root";
$db_password = "";
$db_name = "sos_prepa_bdd";

$response = ["success" => false];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Assainissement et validation
    $name = trim($_POST["name"]);
    $email = filter_var(trim($_POST["email"]), FILTER_VALIDATE_EMAIL);
    $password1 = $_POST["password1"];
    $password2 = $_POST["password2"];

    if (!$email) {
        $response['error'] = "Adresse e-mail invalide.";
        echo json_encode($response);
        exit;
    }
    if (empty($name)) {
        $response['error'] = "Le nom d'utilisateur est obligatoire.";
        echo json_encode($response);
        exit;
    }
    if ($password1 !== $password2) {
        $response['error'] = "Les mots de passe ne correspondent pas.";
        echo json_encode($response);
        exit;
    }
    if (strlen($password1) < 8) {
        $response['error'] = "Le mot de passe doit contenir au moins 8 caractères.";
        echo json_encode($response);
        exit;
    }

    try {    
        $bdd = new PDO("mysql:host=$db_userserver;port=3307;dbname=$db_name;charset=utf8", $db_username, $db_password);
        $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Vérifier si le nom d'utilisateur est déjà utilisé
        $stmt = $bdd->prepare("SELECT * FROM Accountt WHERE Nickname = ?");
        $stmt->execute([$name]);
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            $response['error'] = "Ce nom d'utilisateur est déjà utilisé.";
            echo json_encode($response);
            exit;
        }

        // Vérifier si l'email est déjà utilisé
        $stmt = $bdd->prepare("SELECT * FROM Accountt WHERE Email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            $response['error'] = "Cette adresse e-mail est déjà utilisée.";
            echo json_encode($response);
            exit;
        }

        // Insertion dans la table Accountt
        $hashedPassword = password_hash($password1, PASSWORD_DEFAULT);
        $stmt = $bdd->prepare("INSERT INTO Accountt (Token, Administrator, Teacher, Score_account, Nickname, Email, Password) VALUES (?, ?, ?, ?, ?, ?, ?)");
        // Pour l'instant, on insère une chaîne vide pour le token (il pourra être généré lors de la connexion)
        if ($stmt->execute(['', 0, 0, 0, $name, $email, $hashedPassword])) {
            $response['success'] = true;
        } else {
            $response['error'] = "Erreur lors de l'inscription.";
        }
    }
    catch (PDOException $e) {
        error_log("Erreur PDO : " . $e->getMessage());
        $response['error'] = "Erreur de connexion, veuillez réessayer.";
    }
    finally {
        $bdd = null;
    }
} else {
    $response['error'] = "Formulaire soumis incorrectement.";
}

echo json_encode($response);
exit;
?>
