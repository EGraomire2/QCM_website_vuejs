let forms = [];
let number_of_forms = 0;

// Fonction pour ajouter l'écouteur sur une pastille (dot)
function addDotListener(dot, toggleMultiple, answersContainer) {
    dot.addEventListener('click', function() {
        if (!toggleMultiple.checked) {
            // Mode unique : désactive toutes les autres pastilles du formulaire
            answersContainer.querySelectorAll('.answer-dot').forEach(d => d.classList.remove('correct'));
            dot.classList.add('correct');
        } else {
            dot.classList.toggle('correct');
        }
    });
}

/**
 * Configure un formulaire de question en assignant des ID uniques et en ajoutant
 * tous les écouteurs d'événements nécessaires.
 */
function setupForm(formContainer, formIndex) {
    // Mise à jour de l'input de la question
    const questionInput = formContainer.querySelector('.question-field input');
    if (!questionInput) {
        console.error("L'élément de la question n'a pas été trouvé dans le formulaire", formIndex);
        return;
    }
    questionInput.id = `question-input-${formIndex}`;
    questionInput.name = `question-${formIndex}`;
    
    // Récupération du conteneur des réponses
    const answersContainer = formContainer.querySelector('.answers');
    if (!answersContainer) {
        console.error("L'élément des réponses n'a pas été trouvé dans le formulaire", formIndex);
        return;
    }
    // Récupération du bouton pour ajouter une réponse
    const addAnswerButton = formContainer.querySelector('.add-answer');
    if (!addAnswerButton) {
        console.error("Le bouton pour ajouter une réponse n'a pas été trouvé dans le formulaire", formIndex);
        return;
    }
    addAnswerButton.dataset.formIndex = formIndex;

    // Mise à jour du toggle multiple et du texte associé
    const toggleMultiple = formContainer.querySelector('.toggle-multiple');
    if (!toggleMultiple) {
        console.error("L'élément toggle multiple n'a pas été trouvé dans le formulaire", formIndex);
        return;
    }
    toggleMultiple.id = `toggle-multiple-${formIndex}`;
    const toggleStatus = formContainer.querySelector('.toggle-status');
    if (!toggleStatus) {
        console.error("L'élément toggle status n'a pas été trouvé dans le formulaire", formIndex);
        return;
    }
    toggleStatus.id = `toggle-status-${formIndex}`;

    // Compteur de réponses propre à ce formulaire
    let answerCount = answersContainer.querySelectorAll('.answer').length;

    // Attachement des écouteurs sur les pastilles existantes
    formContainer.querySelectorAll('.answer-dot').forEach(dot => addDotListener(dot, toggleMultiple, answersContainer));

    // (après la création des points, on récupère le nouveau champ)
    const explanationTextarea = formContainer.querySelector('.explanation-field textarea');
    explanationTextarea.id   = `explanation-${formIndex}`;
    explanationTextarea.name = `explanation-${formIndex}`;

    // Récupération du bloc de points intégré dans le HTML
    const pointsFields = formContainer.querySelector('.points-fields');
    if (!pointsFields) {
        console.error("Le bloc points-fields n'a pas été trouvé dans le formulaire", formIndex);
        return;
    }
    const negativeValueSpan = pointsFields.querySelector('.negative-value');
    const pointsValueSpan = pointsFields.querySelector('.points-value');

    // Définir la valeur par défaut du point négatif et du nombre de points
    let negativePointsValue = toggleMultiple.checked ? 0.5 : 0;
    let questionPointsValue = 2;
    negativeValueSpan.textContent = negativePointsValue;
    pointsValueSpan.textContent = questionPointsValue;

    // Boutons pour ajuster le point négatif (incrémentation de 0.25)
    const decreaseNegative = pointsFields.querySelector('.decrease-negative');
    const increaseNegative = pointsFields.querySelector('.increase-negative');
    decreaseNegative.addEventListener('click', () => {
        if (negativePointsValue > 0){        
            negativePointsValue = Math.round((negativePointsValue - 0.25) * 100) / 100;
            negativeValueSpan.textContent = negativePointsValue;}

    });
    increaseNegative.addEventListener('click', () => {
        negativePointsValue = Math.round((negativePointsValue + 0.25) * 100) / 100;
        negativeValueSpan.textContent = negativePointsValue;
    });

    // Boutons pour ajuster le nombre de points de la question (incrémentation de 1)
    const decreasePoints = pointsFields.querySelector('.decrease-points');
    const increasePoints = pointsFields.querySelector('.increase-points');
    decreasePoints.addEventListener('click', () => {
        questionPointsValue = Math.max(0, questionPointsValue - 0.5);
        pointsValueSpan.textContent = questionPointsValue;
    });
    increasePoints.addEventListener('click', () => {
        questionPointsValue += 0.5;
        pointsValueSpan.textContent = questionPointsValue;
    });

    // Écouteur pour le toggle multiple
    toggleMultiple.addEventListener('change', function() {
        if (toggleMultiple.checked) {
            toggleStatus.textContent = 'Sélection multiple';
            negativePointsValue = 0.5;
        } else {
            toggleStatus.textContent = 'Sélection unique';
            negativePointsValue = 0;
            const dots = answersContainer.querySelectorAll('.answer-dot.correct');
            if (dots.length > 1) {
                dots.forEach((d, index) => {
                    if (index > 0) d.classList.remove('correct');
                });
            }
        }
        negativeValueSpan.textContent = negativePointsValue;
    });

    // Écouteur pour le bouton "Ajouter une réponse"
    addAnswerButton.addEventListener('click', function() {
        console.log(`Ajout d'une réponse dans le formulaire ${formIndex}`);
        answerCount++;
        const answerDiv = document.createElement('div');
        answerDiv.classList.add('answer');
        answerDiv.innerHTML = `
            <span class="answer-dot" title="Cliquez pour marquer comme bonne réponse"></span>
            <label for="answer${formIndex}-${answerCount}">Réponse ${answerCount} :</label>
            <input type="text" id="answer${formIndex}-${answerCount}" name="answer${formIndex}-${answerCount}" required>
            <button type="button" class="remove-answer">Supprimer</button>
        `;
        answersContainer.appendChild(answerDiv);

        // Ajout de l'écouteur sur la nouvelle pastille
        const newDot = answerDiv.querySelector('.answer-dot');
        addDotListener(newDot, toggleMultiple, answersContainer);

        // Écouteur pour le bouton "Supprimer" de la réponse
        answerDiv.querySelector('.remove-answer').addEventListener('click', function() {
            answersContainer.removeChild(answerDiv);
            answerCount--;
        });
    });

    return {
        formContainer,
        getData: function() {
            const question = questionInput.value;
            const answerInputs = answersContainer.querySelectorAll('input[type="text"]');
            const answers = Array.from(answerInputs).map(input => input.value);
            const correctAnswers = [];
            answersContainer.querySelectorAll('.answer').forEach((answerDiv, index) => {
                const dot = answerDiv.querySelector('.answer-dot');
                if (dot && dot.classList.contains('correct')) {
                    correctAnswers.push(index);
                }
            });
            return {
                question: question,
                answers: answers,
                correctAnswers: correctAnswers,
                multipleCorrect: toggleMultiple.checked,
                negativePoints: negativePointsValue,
                questionPoints: questionPointsValue,
                explanation : explanationTextarea.value
            };
        },
        resetForm: function() {
            questionInput.value = "";
            answersContainer.innerHTML = `
                <div class="answer">
                    <span class="answer-dot" title="Cliquez pour marquer comme bonne réponse"></span>
                    <label for="answer${formIndex}-1">Réponse 1 :</label>
                    <input type="text" id="answer${formIndex}-1" name="answer${formIndex}-1" required>
                </div>
                <div class="answer">
                    <span class="answer-dot" title="Cliquez pour marquer comme bonne réponse"></span>
                    <label for="answer${formIndex}-2">Réponse 2 :</label>
                    <input type="text" id="answer${formIndex}-2" name="answer${formIndex}-2" required>
                </div>
            `;
            answerCount = 2;
            answersContainer.querySelectorAll('.answer-dot').forEach(dot => addDotListener(dot, toggleMultiple, answersContainer));
            
            // Reset du champs d'explication
            explanationTextarea.value = "";
            
            // Réinitialisation des points
            negativePointsValue = toggleMultiple.checked ? -0.5 : 0;
            questionPointsValue = 2;
            negativeValueSpan.textContent = negativePointsValue;
            pointsValueSpan.textContent = questionPointsValue;
        }
    };
} // Fin de setupForm

// Correspond à un main dans le JavaScript ; se déclenche lorsque la page a fini de charger
document.addEventListener('DOMContentLoaded', function() {
    const errorMessage = document.getElementById("error-container");
    const successMessage = document.getElementById("success-container");

    const qcmForm = document.querySelector('#create-qcm-form');
    const formsBody = document.querySelector('#forms-body');
    const addQuestionButton = document.getElementById('add-question');
    const buttonsDiv = document.querySelector('.buttons');

    // Template HTML pour un nouveau formulaire de question
    const defaultFormHTML = `
    <div class="div-body">
      <div class="question-field">
        <label for="question">Question :</label>
        <input type="text" class="question-input" name="question" required>
      </div>
      <div class="answers">
        <div class="answer">
          <span class="answer-dot" title="Cliquez pour marquer comme bonne réponse"></span>
          <label for="answer1">Réponse 1 :</label>
          <input type="text" id="answer1" name="answer1" required>
        </div>
        <div class="answer">
          <span class="answer-dot" title="Cliquez pour marquer comme bonne réponse"></span>
          <label for="answer2">Réponse 2 :</label>
          <input type="text" id="answer2" name="answer2" required>
        </div>
      </div>
      <div class="button-field">
        <button type="button" class="add-answer">Ajouter une réponse</button>
      </div>
      <div class="toggle-switch-container">
        <span>Mode de réponse :</span>
        <label class="switch">
          <input type="checkbox" class="toggle-multiple" name="toggle-multiple">
          <span class="slider round"></span>
        </label>
        <span class="toggle-status">Sélection unique</span>
      </div>
      <div class="explanation-field">
        <label for="explanation">Explication :</label>
        <textarea id="explanation" name="explanation" rows="3" placeholder="Entrez ici l'explication qui sera afficher lors de la correction..."></textarea>
      </div>
      <div class="points-fields">
          <div class="negative-points">
              <label>Point négatif :</label>
              <div class="points">
                <button type="button" class="decrease-negative">-</button>
                <span class="negative-value">0</span>
                <button type="button" class="increase-negative">+</button>
              </div>
          </div>
          <div class="question-points">
              <label>Nombre de points :</label>
              <div class="points">
                <button type="button" class="decrease-points">-</button>
                <span class="points-value">2</span>
                <button type="button" class="increase-points">+</button>
              </div>
          </div>
      </div>
    </div>
    `;

    // Récupération du conteneur de la première question (déjà présent dans le HTML)
    const initialFormContainer = document.querySelector('.div-body');

    // Configuration du formulaire initial présent dans le HTML
    number_of_forms++;
    const initialForm = setupForm(initialFormContainer, number_of_forms);
    forms.push(initialForm);

    const subjectSelect = document.getElementById('qcm-subject');
    const chapterSelect = document.getElementById('qcm-chapter');

  // Fonction utilitaire : vide un <select>
  function clearOptions(select) {
    while (select.options.length > 1) { // conserve toujours l'option index 0
      select.remove(1);
    }
  }

  // Listener pour le changement de matière
  subjectSelect.addEventListener('change', () => {
    const chosenId = subjectSelect.value;
    clearOptions(chapterSelect);

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

    // Au clic sur "Ajouter une question", on crée un nouveau formulaire vide à partir du template
    addQuestionButton.addEventListener('click', function() {
        console.log("Ajout d'une nouvelle question");
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = defaultFormHTML;
        // Récupération de l'élément div-body créé à partir du template
        const newFormContainer = tempContainer.firstElementChild;
        number_of_forms++;
        const newForm = setupForm(newFormContainer, number_of_forms);
        forms.push(newForm);

        // Ajout d'un bouton de suppression pour ce formulaire (exclusif au formulaire ajouté)
        const buttonField = newFormContainer.querySelector('.button-field');
        const deleteButton = document.createElement('button');
        deleteButton.type = "button";
        deleteButton.classList.add('delete-question');
        deleteButton.textContent = "Supprimer la question";
        // Positionnement à côté du bouton "Ajouter une réponse"
        buttonField.appendChild(deleteButton);
        deleteButton.addEventListener('click', function() {
            // Suppression du conteneur du formulaire
            newFormContainer.remove();
            // Retirer le formulaire supprimé du tableau global
            forms = forms.filter(form => form.formContainer !== newFormContainer);
            number_of_forms--;
        });

        // Insertion du nouveau formulaire avant la div des boutons
        formsBody.insertBefore(newFormContainer, buttonsDiv);
    });

    // Gestion de la soumission du QCM
    qcmForm.addEventListener('submit', function(event) {
        event.preventDefault();
        errorMessage.textContent   = "";
        successMessage.textContent = "";

        const allQCMData = forms.map(form => form.getData());
        for (let data of allQCMData) {
            if (data.question.trim() === '' || data.answers.some(answer => answer.trim() === '')) {
                alert('Veuillez remplir tous les champs pour chaque question.');
                return;
            }
        }


        ////////////// Mise en forme des données ///////////////////
        // Récupérer les données des formulaires questions
        const questionsData = forms.map(form => {
            const data = form.getData();
            const isCorrect = data.answers.map((_, index) => data.correctAnswers.includes(index));
            return {
            question: data.question,
            answers: data.answers,
            isCorrect: isCorrect,
            multipleCorrect: data.multipleCorrect,
            negativePoints: data.negativePoints,
            questionPoints: data.questionPoints,
            explanation: data.explanation
            };
        });
        

        // Récupérer les données du QCM (nom, matière, difficulté, etc.)
        const qcmName = document.querySelector('.qcm-name').value.trim();
        const qcmSubject = document.querySelector('.qcm-subject').value;
        const qcmChapter = document.querySelector('.qcm-chapter').value;
        const difficulty = document.getElementById('difficulty').value;
    
        // Construire l'objet global
        const qcmData = {
            qcmName: qcmName,
            qcmSubject: qcmSubject,
            qcmChapter: qcmChapter,
            difficulty: difficulty,
            questions: questionsData,
            nb_questions: number_of_forms
        };
        ///////////// Fin de Mise en forme des données /////////////////


        //////////// Envoi des données au serveur //////////////////

        fetch("create-qcm-submit.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(qcmData)
        })
        .then(res => res.text())
        .then(text => {
            console.log("Réponse brute :", text);
            const data = JSON.parse(text); // ← parse manuellement ensuite
                if (data.error) {
                    errorMessage.textContent = data.error;
                } else {
                    successMessage.textContent = "QCM créé avec succès !";
                }
            })
            .catch(error => {
                console.error("Error:", error);
                errorMessage.textContent = "Impossible de contacter le serveur.";
            })

        // Réinitialisation du formulaire
        forms.slice(1).forEach(form => form.formContainer.remove()); // Supprime les formulaires ajoutés dynamiquement
        forms[0].resetForm(); // Réinitialisation du premier formulaire
        forms = [forms[0]]; // Réinitialisation du tableau de formulaires
        number_of_forms = 1; // Réinitialisation du compteur de formulaires
        document.querySelector('.qcm-name').value = ''; // Réinitialisation du nom du QCM
        document.querySelector('.qcm-subject').selectedIndex = 0; // Réinitialisation de la matière
        document.querySelector('.qcm-chapter').selectedIndex = 0; // Réinitialisation du chapitre
    });
});