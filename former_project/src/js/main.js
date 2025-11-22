// This file handles the general functionality of the website, such as navigation and any shared scripts across pages.

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Add any specific navigation logic here if needed
            console.log(`Navigating to ${link.getAttribute('href')}`);
        });
    });

    // Additional shared scripts can be added here
});

function test (){
    let h1 = document.querySelector(".main_title");
    h1.classList.toggle("test");
    h1.style.color = "red"
}