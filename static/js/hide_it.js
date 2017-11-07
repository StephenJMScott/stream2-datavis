$('a').on('click', function(){
   var target = $(this).attr('rel');
   $("#"+target).show().siblings("div").hide();
});

// $('#opt2').on('click', function() {
//   $()
// })