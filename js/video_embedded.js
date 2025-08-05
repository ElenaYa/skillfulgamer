$(document).ready(function() {
    var $openModalButtons = $('.request-loader');
    var $overlay = $('#modal-overlay');
    var $closeModal = $('.modal-close');
    var $videoFrame = $('#modal-video-frame');

    $openModalButtons.on('click', function() {
        var videoUrl = $(this).data('video');
        $videoFrame.attr('src', videoUrl + "?autoplay=1");
        $overlay.css('display', 'flex');
    });

    $closeModal.on('click', function() {
        $overlay.css('display', 'none');
        $videoFrame.attr('src', '');
    });

    $overlay.on('click', function(e) {
        if (e.target === this) {
            $overlay.css('display', 'none');
            $videoFrame.attr('src', '');
        }
    });
});