const events = [
  {
    title: "School of Engineering",
    date: "August 15, 2025",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    description: "Engineering programs focusing on civil, mechanical and electrical disciplines.",
    ongoing: true
  },
  {
    title: "School of Management Science",
    date: "September 02, 2025",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
    description: "Business, accounting and management courses with practical workshops.",
    ongoing: false
  },
  {
    title: "School of Health Science",
    date: "October 10, 2025",
    image: "https://images.unsplash.com/photo-1581090700227-1e8e6a3bdf4d",
    description: "Programs in nursing, public health and laboratory sciences.",
    ongoing: true
  },
  {
    title: "School of Art & Design",
    date: "November 12, 2025",
    image: "https://images.unsplash.com/photo-1494949649104-ec0f6d8d3b30",
    description: "Creative programs in visual arts, graphic design and media.",
    ongoing: false
  },
  {
    title: "School of Computer Science",
    date: "December 01, 2025",
    image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
    description: "Computer science, AI and software engineering tracks.",
    ongoing: true
  },
  {
    title: "School of Law",
    date: "January 20, 2026",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    description: "Law and legal studies with moot court sessions.",
    ongoing: false
  }
];

const container = document.getElementById("events-container");

events.forEach(event => {
  const col = document.createElement("div");
  col.className = "col s12 m6 l4";

  col.innerHTML = `
    <div class="card event-card">
      <div class="card-body d-flex">
        <div class="event-main">
          <h5 class="event-title">${event.title}</h5>
          <img class="event-img" src="${event.image}?auto=format&fit=crop&w=1200&q=80" alt="${event.title}">
          <p class="event-desc">${event.description}</p>
          <div class="event-meta">Date: <strong>${event.date}</strong></div>
          <div class="event-actions">
            <button class="status-btn ${event.ongoing ? 'on' : 'off'}">${event.ongoing ? 'Ongoing' : 'Closed'}</button>
            <button class="btn continue-btn">Continue</button>
          </div>
        </div>
      </div>
    </div>
  `;

  container.appendChild(col);
});

// Navigate to form page when any Continue button is clicked
document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest('.continue-btn');
  if (!btn) return;
  e.preventDefault();
  window.location.assign('form.html');
});