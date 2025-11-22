console.log("Chargement du script de connexion...");

// JS pour soumettre le formulaire en AJAX
document.getElementById('login-form').addEventListener('submit', function(e) {
  console.log("Formulaire soumis !");
  e.preventDefault(); // Empêche le comportement par défaut
  const errorContainer = document.getElementById('error-container');
  errorContainer.innerHTML = ""; // Réinitialise les erreurs
  
  // Récupère les données du formulaire
  const formData = new FormData(this);
  // Optionnel : convertir en JSON
  // const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
  
  // Envoi via fetch
  fetch('login-submit.php', {
    method: 'POST',
    credentials: 'same-origin',   // <–– IMPORTANT pour les cookies
    body: formData // On peut aussi envoyer jsonData avec l'en-tête "Content-Type": "application/json"
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      // Redirection ou gestion du succès      
      console.log("Connexion réussie !");
      window.location.href = 'index.php'; // Redirige vers la page d'accueil
    } else {
      // Afficher le message d'erreur retourné
      errorContainer.innerHTML = result.error;
    }
  })
  .catch(error => {
    errorContainer.innerHTML = "Une erreur est survenue.";
    console.error("Erreur lors de la soumission du formulaire", error);
  });
});
