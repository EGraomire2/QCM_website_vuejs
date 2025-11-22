document.addEventListener("DOMContentLoaded", function () {
    const subjectForm = document.getElementById("create-subject");
    const chapterForm = document.getElementById("create-chapter");

    const errorMessage = document.getElementById("error-container");
    const successMessage = document.getElementById("success-container");

    const subjectNameInput = document.getElementById("subject-name");

    const subjectSelect = document.getElementById("subject-select");
    const chapterNameInput = document.getElementById("chapter-name");

    subjectForm.addEventListener("submit", function (event) {
        event.preventDefault();
        errorMessage.textContent   = "";
        successMessage.textContent = "";

        const subjectName = subjectNameInput.value.trim();

        if (!subjectName) {
            errorMessage.textContent = "Merci de remplir le nom du sujet !";
            return;
        }

        fetch("create-subject-submit.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ subjectName: subjectName })
        })
            .then(res => res.text())
            .then(text => {
                console.log("Réponse brute :", text);
                const data = JSON.parse(text); // ← parse manuellement ensuite
                if (data.error) {
                    errorMessage.textContent = data.error;
                } else {
                    // Assuming the server returns the new subject ID
                    const newOption = document.createElement("option");
                    newOption.value = data.insertedId; // Assuming the server returns the new subject ID
                    newOption.textContent = subjectName;
                    subjectSelect.appendChild(newOption);
                    successMessage.textContent = "Matière créée avec succès !";
                }
            })
            .catch(error => {
                console.error("Error:", error);
                errorMessage.textContent = "Impossible de contacter le serveur.";
            })
            .finally(() => {
                // Clear the form
                subjectNameInput.value = "";
            });
    }); 

    chapterForm.addEventListener("submit", function (event) {
        event.preventDefault();
        errorMessage.textContent   = "";
        successMessage.textContent = "";

        const subjectId = subjectSelect.value;
        const chapterName = chapterNameInput.value.trim();

        if (!subjectId || !chapterName) {
            errorMessage.textContent = "Merci de remplir le nom du chapitre et de choisir un sujet !";
            return;
        }

        fetch("../create-chapter-submit.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ subjectId: subjectId, chapterName: chapterName })
        })
        .then(res => res.text())
        .then(text => {
            console.log("Réponse brute :", text);
            const data = JSON.parse(text); // ← parse manuellement ensuite
                if (data.error) {
                    errorMessage.textContent = data.error;
                } else {
                    successMessage.textContent = "Chapitre créé avec succès !";
                }
            })
            .catch(error => {
                console.error("Error:", error);
                errorMessage.textContent = "Impossible de contacter le serveur.";
            })
            .finally(() => {
            // Clear the form
            chapterNameInput.value = "";
            subjectSelect.selectedIndex = 0; // Reset the select to the first option  
        });
    });  
});