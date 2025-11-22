// This file contains the JavaScript logic for displaying the selected QCM and handling the submission of answers.

function addDotListener(dot, isUnique, answersContainer) {
    console.log("On rentre dans la fonction addDotListener");
    dot.addEventListener('click', function() {
        if (isUnique) {
            // Mode unique : désactive toutes les autres pastilles du formulaire
            answersContainer.querySelectorAll('.answer-dot').forEach(d => d.classList.remove('correct'));
            dot.classList.add('correct');
        } else {
            dot.classList.toggle('correct');
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    console.log("dom content loaded");
    const qcmButton = document.querySelector('#submit-qcm');
    const qcmFieldsets = document.querySelectorAll('.div-body');
    const allDots = document.querySelectorAll('.answer-dot');

    const errorMessage = document.getElementById('error-container');
    const successMessage = document.getElementById('success-container');

    for (let i = 0; i < qcmFieldsets.length; i++) {
        console.log("On rentre dans la boucle for de qcmFieldsets");
        let dots = qcmFieldsets[i].querySelectorAll('.answer-dot');
        let questionId = qcmFieldsets[i].dataset.questionId;
        let isUnique = questions[questionId]['Type_of_question'] === 'unique' ? true : false;

        for (let j = 0; j < dots.length; j++) {
            console.log("On rentre dans la boucle for de dots");
            const dot = dots[j];
            addDotListener(dot, isUnique, qcmFieldsets[i]);
        }
    }

    

    qcmButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission

        hasAnswered = Array.from(allDots).filter(dot => dot.classList.contains('correct')).map(dot => {
            return {
                questionId: dot.dataset.questionId,
                propositionId: dot.dataset.propositionId
            }
        });

        const answerData = {
            qcmId: qcmId,
            answers: hasAnswered,
            date : new Date().toString()
        };

        fetch('../answer-qcm-submit.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(answerData)
        })
        .then(res => res.text())
        .then(text => {
            console.log("Réponse brute :", text);
            const data = JSON.parse(text); // ← parse manuellement ensuite
                if (data.error) {
                    errorMessage.textContent = data.error;
                } else {
                    successMessage.textContent = "Vous avez répondu au formulaire !";
                    console.log("Débuggage :", data.debug);
                    window.location.href = `correction.php?qcm-id=${encodeURIComponent(qcmId)}&attempt-id=${encodeURIComponent(data.attemptId)}`;
                }
            })
            .catch(error => {
                console.error("Error:", error);
                errorMessage.textContent = "Impossible de contacter le serveur.";
            })

    }
    );

});