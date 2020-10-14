$(function () {
   $('.wg-features-widget .feature').on('click', function (event) {
       console.log(event)
       var $this = $(this);
       var $clone = $this.clone().addClass('feature-clone position-absolute')
       $clone.css($this.position())
       $clone.find('.buttons').hide()
       $this.after($clone)
       $clone.children('.feature-inner').css('min-height', ($this.height() + 2) + 'px')
       $clone.children('.feature-inner').children('p').css('opacity', 0)
       $clone.find('img').css('width', ($clone.find('img').width()) + 'px')
       $clone.animate({
           left: '15px',
           // maxWidth: $this.parent().width() + 'px',
           maxWidth: 100 * (($this.parent().width() - 2 * 15) / $this.parent().width()) + '%',
       }, 800, function(...asd) {
           console.log(asd)
           $clone.children().children('div.content').show()
           $clone.children().children('p, div.content').animate({
               opacity: 1
           }, 300)
       })
       $this.parent().children(':not(.feature-clone)').animate({ opacity: 0.3 })
   });
});
