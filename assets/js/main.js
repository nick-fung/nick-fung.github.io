// Scroll Duration in milliseconds
const scrollDuration = 500;
$('button').addClass('hvr-sink');

function scrolly(targetElement){
    var container = document.getElementById("container");
    var containScroller = zenscroll.createScroller(container, scrollDuration, 0);
    var target = document.getElementById(targetElement);
    var buttons = document.getElementsByTagName("buttons");
     
    // Stops the button for a while
    $(':button').prop('disabled', true);
    containScroller.center(target, scrollDuration, 0, function(){
        $(':button').prop('disabled', false);
    });

}
