function scrolly(element){
    var defaultDuration = 500;
    var edgeOffset = 30;
    var myDiv = document.getElementById("container");
    var myScroller = zenscroll.createScroller(myDiv, defaultDuration, edgeOffset);
    var target = document.getElementById(element);
    myScroller.center(target);
}

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;
sticky *= 1.25;
var container = document.getElementById("container");

//$('#container').bind('mousewheel DOMMouseScroll', function (e) { return false; });

$('#container').scroll(function(){

    //    console.log("Curr. Y offset: " + container.scrollTop);
    //   console.log("Sticky: " + sticky);
    if (container.scrollTop >= sticky) {
        navbar.classList.add("sticky");
    }
    else{
        navbar.classList.remove("sticky");
    }
    return false;
});
