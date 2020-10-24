$(function () {
    $('.wg-cards .open-hidden-content a').on('click', function (event) {
        event.preventDefault();
        var $this = $(this);
        var cardIndex = $this.attr('data-card-index');
        var $card = $('#card-wrap-' + cardIndex);
        var $hiddenContent = $('#hidden-content-' + cardIndex);

        if ($card.length > 0 && $hiddenContent.length > 0) {
            // Enable overlay
            $card.siblings('.overlay').addClass('active');

            // Blur cards
            $card.addClass('blurred');
            $card.siblings('.card-wrap').addClass('blurred');

            // Show hidden content
            var posTop = $card.position().top + 30
            var parentHeight = $card.parent().height();
            var hiddenContentHeight = $hiddenContent.height();
            var maxPosTop = parentHeight - hiddenContentHeight - 30;
            console.log(posTop, parentHeight, hiddenContentHeight, maxPosTop)
            $hiddenContent.css('top', Math.min(posTop, maxPosTop) + 'px')
            $hiddenContent.addClass('visible');
        }
    });

    $('.wg-cards .hidden-content .close a').on('click', function (event) {
        event.preventDefault();
        var $this = $(this);
        var cardIndex = $this.attr('data-card-index');
        var $hiddenContent = $('#hidden-content-' + cardIndex);

        if ($hiddenContent.length > 0) {
            // Enable overlay
            $hiddenContent.siblings('.overlay').removeClass('active');

            // Blur cards
            $hiddenContent.siblings('.card-wrap').removeClass('blurred');

            // Show hidden content
            $hiddenContent.removeClass('visible');
        }
    });
});
