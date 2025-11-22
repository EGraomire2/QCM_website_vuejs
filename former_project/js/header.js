

window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


document.addEventListener("DOMContentLoaded", () => {
const burger = document.querySelector('.burger-menu input');
const sidebar = document.querySelector('.sidebar');

burger.addEventListener('change', () => {
    if (burger.checked) {
    sidebar.classList.add('show');
    } else {
    sidebar.classList.remove('show');
    }
});
});
