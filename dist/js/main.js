
$(window).scroll(function() {
  if ($(document).scrollTop() > 50) {
    $('.navbar').removeClass('navbar--initial');
  } else {
    $('.navbar').addClass('navbar--initial');
  }
});
