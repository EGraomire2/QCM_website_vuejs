<?php
require_once __DIR__ . '/auth.php';
// Vérification de l'authentification
?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="/css/lessons.css">
  <title>Menu PDF</title>
  <script src="js/header.js"></script>
</head>
<body>
  <header id="main-header">
    <h1 class="main_title">Fiches de révisions</h1>
    <nav class="nav-link">
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
  <main id="pdf"> 
    <h2 id="pdf-title"></h2> <!-- <-- H2 est déplacé ici, tout en haut du main -->

    <div class="pdf-selector">
      <label for="pdf-select">Choisissez votre fiche de révisions :</label>
      <select id="pdf-select">
        <option value="">-- Sélectionner un PDF --</option>
        <option value="docs/Fiche_Methodes_1_SM301.pdf">S3-Probabilités-1</option>
        <option value="docs/Fiche_Methodes_2_SM301.pdf">S3-Probabilités-2</option>
        <option value="docs/Fiche_Methodes_SM302.pdf">S3-Fonctions de plusieurs variables</option>
        <option value="docs/Fiche_Methodes_Chapitre_1_SM202.pdf">S2-Analyse 2 Chapitre 1</option>
        <option value="docs/Fiche_Methodes_Chapitre_1_SM402.pdf">S4-Automates finis et expression rationnelles</option>
        <option value="docs/Fiche_Methodes_Chapitre_2_1_SM202.pdf">S2-Analyse 2 Chapitre 2 n°1</option>
        <option value="docs/Fiche_Methodes_Chapitre_2_2_SM202.pdf">S2-Analyse 2 Chapitre 2 n°2</option>
        <option value="docs/Fiche_Methodes_Chapitre_3_SM202.pdf">S2-Analyse 2 Chapitre 3</option>
        <option value="docs/Fiche_Methodes_SM401.pdf">S4-Modélisation Mathématiques</option>
        <option value="docs/Fiche_Trigonometrie.pdf">Fiche trigonométrie</option>
      </select>
    </div> 

    <button id="download-button" style="display: none;">Télécharger</button>

    <iframe id="pdf-viewer" style="display: none;"></iframe>

    <script>
      const select = document.getElementById('pdf-select');
      const iframe = document.getElementById('pdf-viewer');
      const downloadBtn = document.getElementById('download-button');
      const pdfTitle = document.getElementById('pdf-title');

      select.addEventListener('change', () => {
        const pdf = select.value;
        const selectedOptionText = select.options[select.selectedIndex].text;

        if (pdf) {
          iframe.src = pdf;
          iframe.style.display = 'block';
          downloadBtn.style.display = 'inline-block';
          pdfTitle.textContent = selectedOptionText; // <-- titre mis à jour
          downloadBtn.onclick = () => {
            window.open(pdf, '_blank');
          };
        } else {
          iframe.style.display = 'none';
          downloadBtn.style.display = 'none';
          pdfTitle.textContent = ''; // <-- vide le titre
          iframe.src = '';
        }
      });
    </script>
  </main>
</body>
</html>
