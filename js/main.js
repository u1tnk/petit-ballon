import $ from 'jquery'
global.jQuery = $
import slick from 'slick-carousel-browserify'
(() => {
    window.addEventListener('load', () => {
        $('.detail-carousel').show()
        slick($('.detail-carousel'), {
            dots: true,
            arrows: true,
        })
   });
})();
