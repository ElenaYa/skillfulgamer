$(function(){
   var swiperPartner = new Swiper('.swiper.swiperPartner',{
        autoplay: {
            delay: 3000,
        },
        speed: 2000,
        slidesPerView: 2,
        spaceBetween: 10,
        loop: true,
        hasNavigation: true,
        grabCursor: true,
        breakpoints: {
            1024: {
                slidesPerView: 5
            },
            768: {
                slidesPerView: 4
            },
            319: {
                slidesPerView: 2
            }
        },
        pagination: {
        enabled: true,
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        },
   });
});

$(function(){
    var swiperTestimonial = new Swiper('.swiper.swiperTestimonial',{
        autoplay: {
            delay: 3000,
        },
        speed: 2000,
        slidesPerView: 2,
        spaceBetween: 5,
        loop: true,
        hasNavigation: true,
        grabCursor: true,
        breakpoints: {
            1024:{
                slidesPerView: 2,
            },
            319: {
                slidesPerView: 1,
            },
        },
    });
});