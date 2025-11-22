window.onload=function() {
    button1 = document.getElementById("button1");
    button2 = document.getElementById("button2");
    button3 = document.getElementById("button3");
    button4 = document.getElementById("button4");

    emergency1 = document.getElementById("emergency1");
    emergency2 = document.getElementById("emergency2");
    emergency3 = document.getElementById("emergency3");
    emergency4 = document.getElementById("emergency4");


    button1.addEventListener("click", function() {
        emergency1.style.display = "block";
        emergency2.style.display = "none";
        emergency3.style.display = "none";
        emergency4.style.display = "none";

        button1.classList.add("selected-button");
        button2.classList.remove("selected-button");
        button3.classList.remove("selected-button");
        button4.classList.remove("selected-button");
    });

    button2.addEventListener("click", function() {
        emergency1.style.display = "none";
        emergency2.style.display = "block";
        emergency3.style.display = "none";
        emergency4.style.display = "none";

        button1.classList.remove("selected-button");
        button2.classList.add("selected-button");
        button3.classList.remove("selected-button");
        button4.classList.remove("selected-button");
    });

    button3.addEventListener("click", function() {
        emergency1.style.display = "none";
        emergency2.style.display = "none";
        emergency3.style.display = "block";
        emergency4.style.display = "none";

        button1.classList.remove("selected-button");
        button2.classList.remove("selected-button");
        button3.classList.add("selected-button");
        button4.classList.remove("selected-button");
    });

    button4.addEventListener("click", function() {
        emergency1.style.display = "none";
        emergency2.style.display = "none";
        emergency3.style.display = "none";
        emergency4.style.display = "block";

        button1.classList.remove("selected-button");
        button2.classList.remove("selected-button");
        button3.classList.remove("selected-button");
        button4.classList.add("selected-button");
    });
}