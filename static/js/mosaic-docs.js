$(window).on('load', function() {
    var $docsNav = $('#docs-nav')
    var $docsTocItem = $docsNav.find('li.active').parent().parent('.docs-toc-item')
    $docsNav.scrollTop($docsTocItem.position().top - 30)
})