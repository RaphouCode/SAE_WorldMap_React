const btnFr = document.getElementById("btn-fr");
const btnEn = document.getElementById("btn-en");
const frTitle = document.getElementById("fr-title");
const enTitle = document.getElementById("en-title");
const frContent = document.getElementById("fr");
const enContent = document.getElementById("en");


// Fait avec Inteligence Artificielle
function setLang(lang) {
    if (lang === "fr") {
        frTitle.style.display = "block";
        frContent.style.display = "block";
        enTitle.style.display = "none";
        enContent.style.display = "none";
        btnFr.classList.add("active");
        btnEn.classList.remove("active");
    } else {
        frTitle.style.display = "none";
        frContent.style.display = "none";
        enTitle.style.display = "block";
        enContent.style.display = "block";
        btnEn.classList.add("active");
        btnFr.classList.remove("active");
    }
}

btnFr.onclick = () => setLang("fr");
btnEn.onclick = () => setLang("en");
setLang("fr");