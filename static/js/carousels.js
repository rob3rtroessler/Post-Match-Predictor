/*
    CAROUSEL BEHAVIOR
*/

// define carousel behaviour
let carousel = $('#outputCarousel');

// prevent rotating
carousel.carousel({
    interval: false
})

function explore() {

    // go to explore on both carousels
    carousel.carousel(0)
    carousel.carousel('pause')
}

function generate() {
    carousel.carousel(1)
    carousel.carousel('pause')
}
