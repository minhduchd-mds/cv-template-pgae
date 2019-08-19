var main = {};
(function($){
    "use strict";

    main.goToTop = function () {
        var $goToTop = $('#back-to-top');

        $goToTop.on("click", function () {
            $('body,html').animate({scrollTop:0},1000);
            return false;
        });

        window.onscroll = function() {scrollFunction()};

        function scrollFunction() {
            if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                $('#back-to-top').show();
            } else {
                $('#back-to-top').hide();
            }
        }
        var prevScrollpos = window.pageYOffset;
        window.onscroll = function() {
            var currentScrollPos = window.pageYOffset;
            if (prevScrollpos > currentScrollPos) {
                document.getElementById("banner-text").style.top = "0";
            } else {
                document.getElementById("banner-text").style.top = "-75px";
            }
            prevScrollpos = currentScrollPos;
        }
    };
    main.counters = function () {
        $('.timer').countTo();
    };
    main.rightBar = function (){
        $('.right-bar').hide();
        $('.more-details').hide();
        $('#setting').on('click',function (e) {
            $('.hoverlay').show();
            $('.right-bar').css({
                'right':'0',
                'display':'block'
            });
            e.preventDefault();
        });
        $('.right-bar-toggle').on('click',function (e) {
            e.preventDefault();
            $('#setting').removeClass('active');
            $('.hoverlay').hide();
            $('.right-bar').css({
                'right':'-270px',
                'display':'none'
            });
        });
        $('#more-details').on('click',function (e) {
            $('.more-details').toggle();
            e.preventDefault();
        })

    };
    main.search =function(){
        $('#trigger-overlay').click(function () {
            $('#myOverlay').show();
            $('.closebtn').click(function () {
                $('#myOverlay').hide();
            })
        })
    };

    main.navhover = function(){
        $(".dropdown").hover(
            function () {
                $('.dropdown-menu', this).stop(true, true).slideDown("fast");
                $(this).toggleClass('open');
            },
            function () {
                $('.dropdown-menu', this).stop(true, true).slideUp("fast");
                $(this).toggleClass('open');
            }
        );

        $( ".dropdown.fade" ).hover(function() {
            $( this ).fadeOut( 100 );
            $( this ).fadeIn( 500 );
        });
    };
    main.action = function(){

        $('#header .setting-mobiles-nav  .btn-group a').click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            var toggle =  $(this).attr('data-toggle');
            $('section[aria-labelledby = '+toggle+']').addClass('active').siblings().removeClass('active');
        });
    };
    var auidoArray = [];
    var nameArray = [];

    main.audio = function(){


        var audio = $('.hiragnana').find('.audio').find('audio').attr('data-audio');

        $('.audio-play-auto').each(function () {
            auidoArray.push($(this).attr('data-audio'));
            nameArray.push($(this).attr('id'));
        });

        $('.hiragnana li a').click(function () {

            var active = $(this).attr('data-name');
            var audio = $('.hiragnana').find('.audio').find('audio').attr('data-audio');

            var play = $(this).attr('data-play');
            // lay ra danh sanh  audio
            for(var i in auidoArray){
                var sector = auidoArray[i];
                (function(sec){
                    if(active === sec){
                        $('a[data-name = '+active+']').addClass('play');
                        $('audio[data-audio = '+sec+']').addClass('play-auto'+sec).siblings().removeClass("play-auto" +sec);
                        $('.play-auto'+sec).get(0).play();
                    }
                }(sector))
            }
        });


    };
    var textArray =[];
    main.game = function(){
        for (var i in auidoArray){
            var name = auidoArray[i];
        }
        for (var k  in textArray){
            var textarray = textArray[k];
        }
        console.log(textarray)
        $("#vocabulary-game-message").keypress(function (e) {
            var conten ='';
            if (e.keyCode == 13) {
                var text = $('#vocabulary-game-message').val('');
                textArray.push(text);

                conten +='<div>'+textarray+'</div>';
                $('#vocabulary-game-message').val('');
            }
            $('.vocabulary-game-content').html(conten);

        });

    };
    main.chat = function(){
        // chat message
        var myDataRef = new Firebase("https://matrimony-chat.firebaseio.com/");
        var count = 0;
        var sent_message_image = [];

        $("#messageInput").keypress(function (e){
            if(e.keyCode == 13){ //Enter
                var d = new Date();
                var text = $("#messageInput").val();
                var minutes = d.getMinutes();

                var userm =  {
                    id:1,
                    count: count,
                    name: "admin",
                    image: sent_message_image,
                    time: minutes,
                    text: text,
                    status: "1"
                };
                myDataRef.push(userm); //cho phép thêm nhiều bản ghi
                $("#messageInput").val("");
            }
            count++;
        });
        myDataRef.on('child_added', function (snapshot){
            var message = snapshot.val();
            viewchat(message.name, message.text, message.image, message.time, message.id);
        });

        function viewchat(name, text,image,time,id) {
            var items ='';
            items +='<div class="chat float-left">\n' +
                ' <div class="titles">'+name+'</div>' +
                ' <div class="message">'+text+'</div>' +
                '</div>';
            $('<div/>').prepend(items).appendTo($(".chat-content"));
        }

    };

    $(document).ready(function () {
        new WOW().init();
        main.counters();
        main.goToTop();
        main.rightBar();
        main.search();
        main.navhover();
        main.action();
        main.audio();
        main.game();
        main.chat();
    });

    (function (factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD
            define(['jquery'], factory);
        } else if (typeof exports === 'object') {
            // CommonJS
            factory(require('jquery'));
        } else {
            // Browser globals
            factory(jQuery);
        }
    }(function ($) {
        var CountTo = function (element, options) {
            this.$element = $(element);
            this.options  = $.extend({}, CountTo.DEFAULTS, this.dataOptions(), options);
            this.init();
        };

        CountTo.DEFAULTS = {
            from: 0,               // the number the element should start at
            to: 0,                 // the number the element should end at
            speed: 1000,           // how long it should take to count between the target numbers
            refreshInterval: 100,  // how often the element should be updated
            decimals: 0,           // the number of decimal places to show
            formatter: formatter,  // handler for formatting the value before rendering
            onUpdate: null,        // callback method for every time the element is updated
            onComplete: null       // callback method for when the element finishes updating
        };

        CountTo.prototype.init = function () {
            this.value     = this.options.from;
            this.loops     = Math.ceil(this.options.speed / this.options.refreshInterval);
            this.loopCount = 0;
            this.increment = (this.options.to - this.options.from) / this.loops;
        };

        CountTo.prototype.dataOptions = function () {
            var options = {
                from:            this.$element.data('from'),
                to:              this.$element.data('to'),
                speed:           this.$element.data('speed'),
                refreshInterval: this.$element.data('refresh-interval'),
                decimals:        this.$element.data('decimals')
            };

            var keys = Object.keys(options);

            for (var i in keys) {
                var key = keys[i];

                if (typeof(options[key]) === 'undefined') {
                    delete options[key];
                }
            }

            return options;
        };

        CountTo.prototype.update = function () {
            this.value += this.increment;
            this.loopCount++;

            this.render();

            if (typeof(this.options.onUpdate) == 'function') {
                this.options.onUpdate.call(this.$element, this.value);
            }

            if (this.loopCount >= this.loops) {
                clearInterval(this.interval);
                this.value = this.options.to;

                if (typeof(this.options.onComplete) == 'function') {
                    this.options.onComplete.call(this.$element, this.value);
                }
            }
        };

        CountTo.prototype.render = function () {
            var formattedValue = this.options.formatter.call(this.$element, this.value, this.options);
            this.$element.text(formattedValue);
        };

        CountTo.prototype.restart = function () {
            this.stop();
            this.init();
            this.start();
        };

        CountTo.prototype.start = function () {
            this.stop();
            this.render();
            this.interval = setInterval(this.update.bind(this), this.options.refreshInterval);
        };

        CountTo.prototype.stop = function () {
            if (this.interval) {
                clearInterval(this.interval);
            }
        };

        CountTo.prototype.toggle = function () {
            if (this.interval) {
                this.stop();
            } else {
                this.start();
            }
        };

        function formatter(value, options) {
            return value.toFixed(options.decimals);
        }

        $.fn.countTo = function (option) {
            return this.each(function () {
                var $this   = $(this);
                var data    = $this.data('countTo');
                var init    = !data || typeof(option) === 'object';
                var options = typeof(option) === 'object' ? option : {};
                var method  = typeof(option) === 'string' ? option : 'start';

                if (init) {
                    if (data) data.stop();
                    $this.data('countTo', data = new CountTo(this, options));
                }

                data[method].call(data);
            });
        };
    }));
})(jQuery);
