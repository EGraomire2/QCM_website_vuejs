<?php
session_start();

$isLoggedIn = isset($_SESSION['token']) && isset($_SESSION['email']) && isset($_SESSION['id_user']);
$isTeacher = FALSE;
$isJsonRequest = strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;
    
$db_userserver = "localhost";
$db_username = "root";
$db_password = "";
$db_name = "sos_prepa_bdd";

if ($isLoggedIn) {
    try {
        $bdd = new PDO("mysql:host=$db_userserver;port=3307;dbname=$db_name;charset=utf8", $db_username, $db_password);
        $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Vérifier que l'utilisateur existe et que le token correspond
        $stmt = $bdd->prepare("SELECT Token, Teacher FROM Accountt WHERE ID_user = ?");
        $stmt->execute([$_SESSION['id_user']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && $user['Token'] === $_SESSION['token']) {
            $isTeacher = (bool)$user['Teacher'];
        }
        // Si l'utilisateur n'existe pas ou que les tokens ne correspondent pas, rediriger
        else if ($isJsonRequest) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Token invalide']);
            exit;
        } else {
            $_SESSION['flash_message'] = "Erreur d authentification - le token ne correspond pas a l ID.";
            setcookie("flash_message", urlencode("Erreur d authentification - le token ne correspond pas a l ID."), time() + 86400, "/", "", false, true);
            header("Location: login.php");
            exit;
        }
    } catch (PDOException $e) {
        // En cas d'erreur, vous pouvez rediriger ou afficher un message d'erreur customisé
        if ($isJsonRequest) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erreur BDD: ' . $e->getMessage()]);
            exit;
        }
        else {
        $_SESSION['flash_message'] = "Erreur de connexion a la base de donnees lors de l'authentification : " . $e->getMessage();
        setcookie("flash_message", urlencode("Erreur de connexion a la base de donnees lors de l'authentification : " . $e->getMessage()), time() + 86400, "/", "", false, true);
        header("Location: login.php");
        exit;}
    } finally {
        // Fermer la connexion
        $bdd = null;
    }
}
?>