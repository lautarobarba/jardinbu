// INITIALIZE AOS - Animate On Scroll Library
AOS.init();

// Add style to navbar on scroll
$(document).scroll(function() {
  if($(document).scrollTop() >= 10 ) {
    $('#navbar').addClass('navbar-scrolled');
  } else {
    $('#navbar').removeClass('navbar-scrolled');
  }
});

// Click over link will collapse navbar
$(".nav-link").on("click", function () {
  $("#navbarLinks").collapse("hide");
});

// Home-section background toggle
setInterval(() => {
  // console.log('Cambiando fondo de home-section');
  const homeSection = $('#home-section');
  if(homeSection.hasClass('forest-summer-background')){
    homeSection.removeClass('forest-summer-background');
    homeSection.addClass('forest-winter-background');
  } else {
    homeSection.removeClass('forest-winter-background');
    homeSection.addClass('forest-summer-background');
  }
}, 5000);

// Leaflet
var map = L.map('map').setView([-54.781111, -68.292613], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  minZoom: 12,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker = L.marker([-54.781111, -68.292613]).addTo(map);
marker.bindPopup("Jardín Botánico Ushuaia").openPopup();
