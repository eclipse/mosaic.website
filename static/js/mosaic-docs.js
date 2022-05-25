$(window).on('load', function() {
    var $docsNav = $('#docs-nav')
    if ($docsNav.length > 0) {
        var $docsTocItem = $docsNav.find('li.active').parent().parent('.docs-toc-item')
        if ($docsTocItem.length > 0) {
            $docsNav.scrollTop($docsTocItem.position().top - 30)
        }
    }
})