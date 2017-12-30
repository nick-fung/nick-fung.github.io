// Scroll Duration in milliseconds
const scrollDuration = 500;

$(document).ready(function(){
    var buttons = document.getElementsByTagName("buttons");

    container = document.getElementById("container");
    containScroller = zenscroll.createScroller(container, scrollDuration, 0);

    
    $("button").addClass("animated fadeInDown");
    $('#header').addClass("animated fadeInDown");

    // Navbar buttons
    $('#about_me_btn').click(function(){
        scrolly("about_me")});
    $('#projects_btn').click(function(){
        scrolly("projects")});
    $('#experience_btn').click(function(){
        scrolly("experience")});
    
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
    var target = document.getElementById(targetElement);
     
    // Stops the button for a while
    $(':button').prop('disabled', true);
    containScroller.center(target, scrollDuration, 0, function(){
        $(':button').prop('disabled', false);
    });

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
