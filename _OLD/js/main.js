
$(window).load(function() {

    // Loader
    $('#loader-logo').animate({ opacity: 0 }, 700);
    $('#loader').animate({ opacity: 0 },
        700,
        function() {
            $('#loader-logo').css("display","none");
            $('#loader').css("display","none");
            $('#header-container').animate({ opacity : 1 });
            $('#main-container').animate({ opacity : 1 });
            $('#footer-container').animate({ opacity : 1 });
            $('#about').animate({ backgroundPosition : '100% 0px' }, 700);
            $('#about .info').animate({ 'margin-top' : 0, 'opacity' : 1 }, 1200);
        }
    );

});

$(function() {

    // Easing effect
    $.easing.smoothmove = function (x, t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    };

    // Menu events
    $(document).on('click', '.menu-item', function(event) {
        event.preventDefault();
        $(document).scrollTo('#' + $(this).data('anchor'), 1200, { offset : -100, easing : 'smoothmove' });
    });

    // "Go to top" event
    $(document).on('click', '.goto-top', function(event) {
        event.preventDefault();
        $(document).scrollTo('#header-container', 1200, { easing : 'smoothmove' });
    });

    // Skills section animation
    $('#skills').waypoint(function() { loadSkills(); },
    { offset: '50%', triggerOnce: true });

    // Portfolio section animation
    $('#portfolio').waypoint(function() { loadPortfolio(); },
    { offset: '50%', triggerOnce: true });

    // Other Stuff section animation
    $('#other-stuff').waypoint(function() { loadOtherStuff(); },
    { offset: '50%', triggerOnce: true });

    // Contact section animation
    $('#contact').waypoint(function() { loadContact(); },
    { offset: '60%', triggerOnce: true });

    // Masonry init
    var container = document.querySelector('#portfolio');
    var msnry = new Masonry( container, {
      itemSelector: '.item'
    });

    $(window).on('resize', function() {
        msnry.destroy();
        container = document.querySelector('#portfolio');
        msnry = new Masonry( container, {
          itemSelector: '.item'
        });
    });

    var viewportWidth = $(window).width();
    if (viewportWidth >= 750) {
        onClickPortfolio();

        // Close event on portfolio expanded itens
        $(document).on('click', '#portfolio .big .info .close', function() {
            var $obj = $(this).parent().parent();
            $obj.unbind("mousemove");
            $obj.removeClass('big');
            $obj.find('.info').stop().animate({ 'opacity' : '0' }, 300, function() {
                $obj.find('.info').css('display', 'none');
                $obj.stop()
                    .animate({ 'width' : '33.3333333%', 'height' : '50%', 'left' : $obj.data('left'), 'top' : $obj.data('top') }, 500, function() {
                        $obj.find('.screen').stop().animate({ 'top' : '0', 'left' : '0' }, 300);
                        $('#portfolio .item').not(this).stop().animate({ 'opacity' : '1' }, 300, function() {
                            $obj.css('z-index','').addClass('small');
                            onClickPortfolio();
                        });
                });
            });
        });
    };

    // Contact form
    var form = $('#contactform');
    var formMessages = $('#contactform-return');

    $(form).submit(function(event) {
        event.preventDefault();

        $button = $(form).find('button');
        $button.attr('disabled', 'disabled');
        $button.animate({
            opacity: .6
        }, 100);

        var formData = $(form).serialize();
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData
        })
        .done(function(response) {
            $(formMessages).removeClass('error');
            $(formMessages).addClass('success');
            $(formMessages).text(response);

            $('#name').val('');
            $('#email').val('');
            $('#message').val('');
        })
        .fail(function(data) {
            $(formMessages).removeClass('success');
            $(formMessages).addClass('error');

            if (data.responseText !== '') {
                $(formMessages).text(data.responseText);
            } else {
                $(formMessages).text('Oops! An error occured and your message could not be sent.');
            }
        })
        .always(function() {
            $button.removeAttr('disabled');
            $button.animate({
                opacity: 1
            }, 100);
        });
    });

});

function onClickPortfolio() {
    // Click event on portfolio itens
    $(document).on('click', '#portfolio .small', function() {
        var $obj = $(this);
        $obj.removeClass('small');
        $(document).off('click', '#portfolio .small');
        $('#portfolio .item').not(this).stop().animate({ 'opacity' : '0.2' }, 300, function() {
            $obj.css('z-index','2')
                .addClass('big')
                .data('left', $obj.position().left)
                .data('top', $obj.position().top)
                .stop()
                .animate({ 'width' : '100%', 'height' : '100%', 'top' : '0', 'left' : '0' }, 500, function() {
                    $obj.find('.info').css('display', 'block').animate({ 'opacity' : '1' }, 300);
                    $obj.bind('mousemove', function(e){
                        var offset = $(this).offset();
                        // var xPos = e.pageX - offset.left;
                        var yPos = e.pageY - offset.top;
                        // var mouseXPercent = Math.round(xPos / $(this).width() * 100);
                        var mouseYPercent = Math.round(yPos / $(this).height() * 100);
                        var movementHeight = $(this).find('.screen').height() - 562;
                        $(this).find('.screen').stop().animate({
                                'top' : '-' + (movementHeight * (mouseYPercent/100)) + 'px'
                            },
                            {
                                duration: 600,
                                queue: false,
                                easing: 'smoothmove'
                            }
                        );
                    });
                });
        });
    });
}

function loadSkills() {
    $('#skills .sub').animate(
        { opacity: 1 },
        400,
        function () {
            $('#skills .container').each(function(i) {
                var $col = $(this).find('.column');
                var perc = $col.data('perc');
                $col.delay(i*200).animate({
                    'height' : perc + '%'
                }, 800, function() {
                    $col.find('.percentage').css('display', 'block').stop().animate(
                        { opacity: 1 }
                    );
                    $col.find('.desc').css('display', 'block').stop().animate(
                        { opacity: 1 }
                    );
                });
            });
        }
    );
};

function loadPortfolio() {
    $('#portfolio .item').each(function() {
        $(this).animate({ opacity: 1 }, 1200);
    });
};

function loadOtherStuff() {
    $('#other-stuff .info').animate({ 'margin-top' : 0, 'opacity' : 1 }, 1200);
}

function loadContact() {
    $('#contact .info').animate({ 'margin-top' : 0, 'opacity' : 1 }, 1200);
}
