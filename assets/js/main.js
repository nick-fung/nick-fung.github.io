// Scroll Duration in milliseconds
const scrollDuration = 500;

$(document).ready(function(){
    var buttons = document.getElementsByTagName("buttons");
   
    $("button").addClass("animated fadeInDown");
    $('#header').addClass("animated fadeInDown");

    // Navbar buttons
    $('nav button').click(function(){
        var targID = this.id.replace("_btn","");
        scrolly(targID);
    });
    
    // Links open modal items based on button id
    $('a').not('[href]').click(function(){
        $('.modal_background').fadeIn("slow");
        var linkID = "#" + this.id.split("_")[0]; 
        $(linkID).fadeIn("slow");
        $(linkID).calculateContentSize();
    });
   
    // Closing modal container
    $('.close').click(function(){
        $(this).parent().fadeOut('fast');
        $('.modal_background').fadeOut('fast');
    });

    $('.modal_item').each(function(){
            if($(this).has(':visible'))
            $(this).calculateContentSize();
    });

    // Resize the item when window is resized
    $(window).resize(function(){
        $('.modal_item').each(function(){
            if($(this).has(':visible'))
                $(this).calculateContentSize();
        });
    });
});

// Smoothly scroll to target element
function scrolly(targetElement){
    var edgeOffset = $('nav').height();
    console.log(edgeOffset);
    container = document.getElementById("container");
    containScroller = zenscroll.createScroller(container, scrollDuration, edgeOffset);

    var target = document.getElementById(targetElement);
     
    // Stops the button for a while
    containScroller.to(target, scrollDuration);

}

// JQuery function
$.fn.calculateContentSize = function(){
    this.each(function(){
        var headerHeight = $(this).find('header').outerHeight();
        $(this).find('.modal_content')[0].style.marginTop=headerHeight + 'px';
        var itemHeight = $('.modal_item').outerHeight();
        contentHeight = (0.95*itemHeight - headerHeight);
        $(this).find('.modal_content').height(contentHeight);
    });
};
