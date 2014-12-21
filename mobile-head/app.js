document.addEventListener('polymer-ready', function(e) {
  console.log('title set correctly: ', document.title == 'mobile-head title');
  console.log('head tag:', document.head);
});