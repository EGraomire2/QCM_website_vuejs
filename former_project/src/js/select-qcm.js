document.addEventListener('DOMContentLoaded', () => {
    function setupForm(qcmData) {
    // Mise à jour de l'input de la question
    const wrapper = document.createElement('div');

    // On recherche si l'utilisateur a déjà répondu à ce QCM
    var attemptData = null;
    let isAttempted = false;
    attemptedQCM.forEach(attempt => {
      console.log("Voici l'ID de la tentative : " + attempt.ID_Attempt + " et l'ID du QCM : " + qcmData.ID_QCM);
      if (attempt.ID_QCM === qcmData.ID_QCM) {
        isAttempted = true;
        attemptData = attempt;
        console.log("Voici la tentative : " + attempt.ID_Attempt + " et l'ID du QCM : " + qcmData.ID_QCM);
      }
    });

    if (!isAttempted){
      wrapper.innerHTML = `<div class="div-body">
                        <h3 class=qcm-title></h3>
                        <p class=difficulty></p>
                        <button class="answer-button">Répondre</button>
                      </div>`; // On insère le HTML
    }
    else {
      wrapper.innerHTML = `<div class="div-body attempted">
                        <h3 class=qcm-title></h3>
                        <p class=difficulty></p>
                        <p class="date"></p>
                        <p class="grade"></p>
                        <div class="buttons">
                          <button class="answer-button">Nouvelle tentative</button>
                          <button class="correction-button">Correction</button>
                        </div>
                      </div>`;
    }

    const qcm = wrapper.firstElementChild; // ✅ On récupère le vrai bloc <div class="div-body">
    qcm.querySelector('.qcm-title').textContent = qcmData.Name_QCM;
    if (qcmData.Difficulty === 0) {
      qcm.querySelector('.difficulty').textContent = 'Facile';
    } else if (qcmData.Difficulty === 1) {
      qcm.querySelector('.difficulty').textContent = 'Moyen';
    } else if (qcmData.Difficulty === 2) {
      qcm.querySelector('.difficulty').textContent = 'Difficile';
    } 
    qcm.querySelector('.answer-button').addEventListener('click', () => {
      // Redirection vers la page de réponse au QCM
      window.location.href = `answer-qcm.php?id=${encodeURIComponent(qcmData.ID_QCM)}`;
    });

    // Si l'utilisateur a déjà tenté le QCM
    if (isAttempted) {
      qcm.querySelector('.date').textContent = `Date de la tentative : ${new Date(attemptData.Date_Attempt).toLocaleDateString('fr-FR')}`;
      qcm.querySelector('.grade').textContent = `Note : ${attemptData.Grade}/20`;
      qcm.querySelector('.correction-button').addEventListener('click', () => {
        // Redirection vers la page de correction du QCM
        window.location.href = `correction.php?qcm-id=${encodeURIComponent(attemptData.ID_QCM)}&attempt-id=${encodeURIComponent(attemptData.ID_Attempt)}`;
      });
    }

    return qcm;
  }

  // Vide et masque le conteneur des QCM
  function clearQCMContainer() {
    qcmContainer.innerHTML = '';
    qcmContainer.style.display = 'none';
  }

  console.log('Chargement du script select-qcm.js');

  const subjectSelect = document.getElementById('subject-list');
  const chapterSelect = document.getElementById('chapter-list');

  const qcmContainer = document.querySelector('.forms-body');
  clearQCMContainer(); // Vide le conteneur au chargement de la page et le masque

  // Vide un <select>, en laissant l'option index 0 (placeholder)
  function clearOptions(select) {
    while (select.options.length > 1) {
      select.remove(1);
    }
  }

  // Listener pour le changement de matière
  subjectSelect.addEventListener('change', () => {
    const chosenId = subjectSelect.value;
    clearOptions(chapterSelect);
    chapterSelect.selectedIndex = 0; // ✅ Réinitialise la sélection
    clearQCMContainer();


    if (!chosenId) return; // rien à faire si aucune matière sélectionnée

    // Filtrer les chapitres correspondant à cette matière
    const filtered = chapters.filter(ch => String(ch.ID_Subject) === chosenId);

    // Ajouter une <option> pour chacun
    for (const ch of filtered) {
      const opt = document.createElement('option');
      opt.value = ch.ID_Chapter;
      opt.textContent = ch.Chapter_name;
      chapterSelect.appendChild(opt);
    }
    });

  // Listener pour le changement de chapitre
  chapterSelect.addEventListener('change', () => {
    console.log('Changement de chapitre détecté !');
    const chosenId = chapterSelect.value;
    clearQCMContainer();

    if (!chosenId) return; // rien à faire si aucun chapitre sélectionné

    // Filtrer les matières correspondant à ce chapitre
    qcmList.forEach(element => { console.log("Voici le chapitre de cet élément : " + element["ID_chapter"] + "" + element);  // Affiche chaque ID_Chapter dans la console
      
    });
    const filtered = qcmList.filter(sub => String(sub.ID_chapter) === chosenId);
    console.error('QCM trouvés pour le chapitre', chosenId, filtered);

      // si on a au moins un QCM, on affiche le conteneur
      if (filtered.length) {
        qcmContainer.style.display = 'block';
      }

    // Ajouter un template pour chaque QCM du chapitre
    for (const sub of filtered) {
      const node = setupForm(sub);
      qcmContainer.appendChild(node);
    }
  });
});