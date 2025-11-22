    // Soumission en AJAX pour la page d'inscription
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Empêche la soumission classique
        const errorContainer = document.getElementById('error-container');
        errorContainer.innerHTML = ""; // Réinitialisation des erreurs
  
        // Récupération des données du formulaire via FormData
        const formData = new FormData(this);
  
        fetch("register-submit.php", {
          method: "POST",
          body: formData
        })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            // En cas de succès, redirection sur login ou la page de votre choix
            window.location.href = "login.php";
          } else {
            // Affichage du ou des messages d'erreur dans la div prévue
            errorContainer.innerHTML = result.error;
          }
        })
        .catch(error => {
          errorContainer.innerHTML = "Une erreur est survenue lors de l'envoi des données.";
          console.error("Erreur lors de la soumission du formulaire", error);
        });
      });