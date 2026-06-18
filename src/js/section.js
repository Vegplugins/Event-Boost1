const API_KEY = "jxWT0gCyzAuvgoWkQFCaAWIvZTEHniLr";
const paginationContainer = document.querySelector(".pagination");

let currentAttractionId = "";

async function fetchEvents(pageNumber = 0, attractionId = "") {
  const grid = document.getElementById("eventsGrid");
  if (!grid) return;

  grid.innerHTML = '<p style="color: #ff007f;">Загрузка ивентов...</p>';


  let url = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&countryCode=DE&size=20&page=${pageNumber}&apikey=${API_KEY}`;


  if (attractionId) {
    url += `&attractionId=${attractionId}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);

    const data = await response.json();

    if (!data._embedded || !data._embedded.events) {
      grid.innerHTML = '<p style="color: #ff007f;">События не найдены.</p>';
      if (paginationContainer) paginationContainer.innerHTML = "";
      return;
    }

    const events = data._embedded.events;
    grid.innerHTML = "";

    events.forEach((event) => {
      const title = event.name;
      const date = event.dates?.start?.localDate || "Дата неизвестна";
      const venueInfo = event._embedded?.venues?.[0];
      const location = venueInfo
        ? `${venueInfo.name} (${venueInfo.city?.name || ""})`
        : "Место не указано";
      const imageObj =
        event.images?.find(
          (img) => img.ratio === "4_3" || img.ratio === "3_2",
        ) || event.images?.[0];
      const imgUrl = imageObj
        ? imageObj.url
        : "https://via.placeholder.com/300x400";

      const card = document.createElement("div");
      card.classList.add("event-card");

   
      card.dataset.eventJson = JSON.stringify(event);

      card.innerHTML = `
                <div class="event-image-wrapper">
                    <img src="${imgUrl}" alt="${title}">
                </div>
                <div class="event-title">${title}</div>
                <div class="event-date">${date}</div>
                <div class="event-location">${location}</div>
            `;

      grid.appendChild(card);
    });

 
    if (data.page) {
      renderPagination(data.page.totalPages, data.page.number);
    }
  } catch (error) {
    console.error("Ошибка:", error);
    grid.innerHTML = `<p style="color: red; text-align: center;">Ошибка загрузки: ${error.message}</p>`;
  }
}


function renderPagination(totalPages, currentPage) {
  if (!paginationContainer) return;

  
  const maxPages = totalPages > 10 ? 10 : totalPages;
  let markup = "";

  for (let i = 0; i < maxPages; i++) {
    
    const activeClass = i === currentPage ? "active" : "";
    
    markup += `<span class="page-num ${activeClass}" data-page="${i}">${i + 1}</span>`;
  }

  paginationContainer.innerHTML = markup;
}


if (paginationContainer) {
  paginationContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("page-num")) return;

    const clickedPage = Number(e.target.dataset.page);

   
    fetchEvents(clickedPage, currentAttractionId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


function renderModalContent(eventData) {
  const buyTicketsUrl = eventData.url || "#";
  const attractionId = eventData._embedded?.attractions?.[0]?.id || "";

  const modalMarkup = `
        <div class="modal">
            <h2 style="color: #ff007f;">${eventData.name}</h2>
            <a href="${buyTicketsUrl}" target="_blank" rel="noopener noreferrer" class="buy-tickets-btn" style="color: #ff007f; font-weight: bold;">
                BUY TICKETS
            </a>
            <button class="more-events-btn" data-attraction="${attractionId}">
                MORE FROM THIS AUTHOR
            </button>
        </div>
    `;

  const modalContainer = document.getElementById("modal-container");
  if (modalContainer) {
    modalContainer.innerHTML = modalMarkup;
  }
}


const modalContainer = document.getElementById("modal-container");
if (modalContainer) {
  modalContainer.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("more-events-btn")) return;

    const attractionId = e.target.dataset.attraction;
    if (!attractionId || attractionId === "undefined") {
      alert("Інформація про автора відсутня");
      return;
    }

    currentAttractionId = attractionId;

  
    fetchEvents(0, currentAttractionId);

   
  });
}


fetchEvents(0);

