const modal = document.querySelector(".modal-overlay");
const closeBtn = document.getElementById("modal-close");
const standartTicket = document.getElementById("standart-tickets");
const vipTicket = document.getElementById("vip-tickets");
const overlay = document.querySelector(".modal-overlay")

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



standartTicket.addEventListener("click", () => {
    alert("Standart Tickets bought!");
});

vipTicket.addEventListener("click", () => {
    alert("VIP Tickets bought!");
});

overlay.addEventListener("click", () => {
    modal.classList.remove("show");
})