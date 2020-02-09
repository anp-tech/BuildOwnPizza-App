/* SOURCES: 
  https://www.w3schools.com/bootstrap4/bootstrap_ref_js_collapse.asp
  https://www.w3schools.com/bootstrap4/bootstrap_ref_js_carousel.asp
*/

$(document).ready(function () {
  $(".navbar-toggler").click(function () {
    $(".collapse").collapse('toggle');
  });

  $('#myCarouselSlide').carousel({
    interval: 2500
  });

  $('.slide1').click(function () {
    $('#myCarouselSlide').carousel(0);
  });

  $('.slide2').click(function () {
    $('#myCarouselSlide').carousel(1);
  });

  $('.slide3').click(function () {
    $('#myCarouselSlide').carousel(2);
  });

});