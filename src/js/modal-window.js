const modal = document.querySelector(".modal-overlay");
const closeBtn = document.getElementById("modal-close");
const standardTicket = document.getElementById("standard-tickets");
const vipTicket = document.getElementById("vip-tickets");
const overlay = document.querySelector(".modal-overlay");
const moreInfo = document.querySelector(".btn");
const authorInfo = document.getElementById("authorInfo");
const restInfo = document.querySelector(".btn2");
const restOfAuthors = document.getElementById("restAuthorInfo");


standardTicket.addEventListener("click", () => {
    alert("Standard Ticket bought")
});

vipTicket.addEventListener("click", () => {
    alert("VIP Ticket bought")
});




function openModal() {
    setTimeout(() => {
        modal.classList.add("show");
    }, 1000);
}

function closeModal() {
    modal.classList.remove("show");
}

openModal();

closeBtn.addEventListener("click", closeModal);

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        closeModal();
    }
})

moreInfo.addEventListener("click", () => {
    fetch("../JSON/authors.json")
        .then(res => res.json())
        .then(data => {
            const AW = data.authors["Atlas Weekend"];
            console.log(AW);

            authorInfo.textContent = `Name: ${AW.name} Date: ${AW.date}, Location: ${AW.location}`;

            authorInfo.style.display = "block";
            restInfo.style.display = "block";
        });
})

const authorsToShow = [
    "LP",
    "Monatik",
    "Eurovision 2021 Finals"
];

restInfo.addEventListener("click", () => {
    fetch("../JSON/authors.json")
        .then(res => res.json())
        .then(data => {

            restOfAuthors.textContent = authorsToShow.map(name => {
                const a = data.authors[name];

                return `
                    ${name}
                    ${a.date}
                    ${a.location}
                `;
            }).join("");

            restOfAuthors.style.display = "block";
            restInfo.style.display = "none"
        });
});