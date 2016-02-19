/*! dreamslider - v1.0.0 - 2016-02-19
* https://github.com/dreamweiver/dreamSlider
* Copyright (c) 2016 Manoj Kumar L; Licensed MIT */
//Paul Irish smartresize : http://paulirish.com/2009/throttled-smartresize-jquery-event-handler/
(function ($) {
    'use strict';
   // debouncing function from John Hann
   // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;
        return function debounced() {
            var obj = this;
            var args = arguments;
            function delayed() {
                if (!execAsap) {
                    func.apply(obj, args);
                }
                timeout = null;
            }
            if (timeout) {
                clearTimeout(timeout);
            } else if (execAsap) {
                func.apply(obj, args);
            }
            timeout = setTimeout(delayed, threshold || 100);
        };
    };


   //Mary Lou : http://tympanus.net/codrops/2010/11/30/merging-image-boxes/
   //Dream Slider functions starts here
    var dreamSlider = function ($container, options) {

        //flag to control the click event
        var flgClick = true;
        //the wrapper/ root div
        var $imWrapper = $container.find('.im_wrapper');
        //the thumbs
        var $thumbs = $imWrapper.children('div');
        //all the images
        var $thumbImgs = $thumbs.find('img');
        //number of images
        var nmbThumbs = $thumbs.length;
        //image loading status
        var $imLoading = null;
        //the next and previous buttons
        var $imNext = null;
        var $imPrev = null;
        //number of thumbs per line
        var perLine = options.rowCount;
        //animation effectfrom options
        var easingEffect = 'none';
        //number of thumbs per column
        var perCol = Math.ceil(nmbThumbs / perLine);
        //Number of thumbs on View port as per standard size(1024 X 768)
        var nmbThumbsInViewPort = 30;
        //Grid layout for single mode
        var $gridLayoutSingleMode = $imWrapper.children('div').slice(0, nmbThumbsInViewPort);
        //index of the current thumb
        var current = -1;
        //mode = grid | single
        var mode = 'grid';
        //thumbs in current view port
        var $curViewPortThumbs;
        //an array with the positions of the thumbs
        //we will use it for the navigation in single mode
        var positionsArray = [];
        var i;
        var loaded = 0;
        //generic hover handler
        var hoverHandler = null;
        //generic blur handler
        var blurHandler = null;
        var easeOptionFallabck = false;

        //load 'easeEffect' option to plugin
        if (!!options.easeEffect) {
            easingEffect = options.easeEffect;
        }
        //Custom jquery easing function
        jQuery.extend(jQuery.easing, {
            easeOutBounce: function (x, t, b, c, d) {
                if ((t /=  d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
                }
            }
        });

        for (i = 0; i < nmbThumbs; ++i) {
            positionsArray[i] = i;
        }

        //add loader & navigation controls to script(next & previous)
        var staticTmpl = '<div class="im_loading">'+
                              '<div class="loader-inner line-scale-pulse-out">'+
                                '<div></div>' +
                                '<div></div>' +
                                '<div></div>' +
                                '<div></div>' +
                                '<div></div>' +
                              '</div>'+
                          '</div>'+
                          '<div class="im_next"></div>' +
                          '<div class="im_prev"></div>';
        $container.append(staticTmpl);

        $imLoading = $container.find('.im_loading');
        $imNext = $container.find('.im_next');
        $imPrev = $container.find('.im_prev');

        //preload all the images
        $imLoading.show();

        //hover handlers section begin
        //hover handler for bounce animation
        function thumbsBounceHover($this) {
            $this.filter(':not(:animated)').animate({
                top: parseInt($this.css('top')) - 25
            }, 500, 'easeOutBounce',
                    function () {
                $this.animate({
                    top: parseInt($this.css('top')) + 25
                }, 500, 'easeOutBounce');
            });
        }

        function thumbsStandOutHover($this) {
            $this.siblings().stop().fadeTo(300, 0.5);
            /*$this.siblings().stop()
            .css({
               'filter'         : 'blur(2px)',
               '-webkit-filter' : 'blur(2px)',
               '-moz-filter'    : 'blur(2px)',
               '-o-filter'      : 'blur(2px)',
               '-ms-filter'     : 'blur(2px)'
            });*/
        }

        function option3Hover() {
            //option  hover handler
            return;
        }

        //hover handlers section end

        //blur handlers section begin
        function thumbsBounceBlur() {
            return;
        }

        function thumbsStandOutBlur($this) {
            $this.siblings().stop().fadeTo(500, 1);
           /* $this.siblings().stop()
            .css({
               'filter'         : 'blur(0px)',
               '-webkit-filter' : 'blur(0px)',
               '-moz-filter'    : 'blur(0px)',
               '-o-filter'      : 'blur(0px)',
               '-ms-filter'     : 'blur(0px)'
            });*/
        }

        function option3Blur() {
            return;
        }

        //blur handlers section end

        function hoverEffect($targetThumbs) {
            $targetThumbs.hover(function () {
                hoverHandler($(this));
            }, function () {
                blurHandler($(this));
            });
        }

        //attach hover & blur handler,if easing effect option is passed to plugin
        if (easingEffect !== 'none') {
            if (easingEffect === 'bounce') {
                hoverHandler = thumbsBounceHover;
                blurHandler = thumbsBounceBlur;
            } else if (easingEffect === 'standOut') {
                hoverHandler = thumbsStandOutHover;
                blurHandler = thumbsStandOutBlur;
            } else if (easingEffect === 'option3') {
                hoverHandler = option3Hover;
                blurHandler = option3Blur;
            } else {
                //when invalid 'easeEffect' provided set default ease effect(Zoom) & fallback
                $thumbImgs.addClass('default_ease_zoom');
                easeOptionFallabck = true;
                return;
            }
            //finally attach hover and blur handlers to all $thumbs
            hoverEffect($thumbs);
        } else {
            $thumbImgs.addClass('default_ease_zoom');
        }

        //controls if we can click on the thumbs or not
        //if theres an animation in progress
        //we don't want the user to be able to click
        function setflag() {
            flgClick = !flgClick;
        }

        //disperses the thumbs in a grid based on windows dimentions
        function disperse() {
            if (!flgClick) {
                return;
            }
            setflag();
            mode = 'grid';
            //center point for first thumb along the width of the window
            var spacesW = $(window).width() / (perLine + 1);
            //vertical space captured for each thumb as noOfThumbsPerColumn * heightOfThumb
            //var spacesH = $(window).height()/(perCol + 1);
            var verticalHeight = ($thumbs.height() + 30) * perCol;
            var spacesH = verticalHeight / (perCol + 1);
            //console.log("width and height:" + $(window).width() + ":" + $(window).height());

            //let's disperse the thumbs equally on the page
            $thumbs.each(function (i) {
                var $thumb = $(this);
                //calculate left and top for each thumb,
                //considering how many we want per line
                var left = spacesW * ((i % perLine) + 1) - $thumb.width() / 2;
                var top = spacesH * (Math.ceil((i + 1) / perLine)) - $thumb.height() / 2;
                //lets give a random degree to each thumb
                //var rotate = Math.floor(Math.random() * 41) - 20;
                /*
                now we animate the thumb to its final positions;
                we also fade in its image, animate it to 115x115,
                and remove any background image  of the thumb - this
                is not relevant for the first time we call disperse,
                but when changing from single to grid mode
                */
                var param = {
                    left: left + 'px',
                    top: top + 'px'
                };

                $thumb.stop()
                    .animate(param, 700, function () {
                        //if(i==nmbThumbs-1){
                        if (i === nmbThumbsInViewPort - 1) {
                            setflag();
                        }
                    })
                    .find('img')
                    .fadeIn(700, function () {
                        $thumb.css({
                            'background-image': 'none'
                        });
                        $(this).animate({
                            width: '115px',
                            height: '115px',
                            marginTop: '5px',
                            marginLeft: '5px'
                        }, 150);
                    });
            });

            //attach the hover effect back to the $thumbs
            if (easingEffect !== 'none' && !easeOptionFallabck) {

                //remove/reverse all animation effects from  all $thumbs
                //before despersing them
                $thumbs.fadeTo(100, 1);

                //attach the hover and blur handlers back to all $thumbs
                hoverEffect($thumbs);
            }
            //add border radius back to thumbs
            $thumbs.addClass('curved');
        }

        //starts the animation
        function start() {
            $imLoading.hide();
            //disperse the thumbs in a grid
            disperse();
        }

        $thumbImgs.each(function () {
            var $this = $(this);

            $('<img/>').load(function () {
                ++loaded;
                if (loaded === nmbThumbs * 2) {
                    start();
                }
            }).attr('src', $this.attr('src'));

            $('<img/>').load(function () {
                ++loaded;
                if (loaded === nmbThumbs * 2) {
                    start();
                }
            }).attr('src', $this.attr('src'));
        });

        /* Add background position to each grid in current view port */
        function addBackgroundPosition(thumbs) {
            var xpos;
            var ypos;
            var index = 0;
            var xposPX = '';
            var yposPX = '';

            //remove background-position css from all thumbs
            $(thumbs).css('background-position', '');

            for (ypos = 0; ypos >= -625; ypos = ypos - 125) {
                for (xpos = 0; xpos >= -625; xpos = xpos - 125) {
                    xposPX = xpos + 'px';
                    yposPX = ypos + 'px';
                    $(thumbs).eq(index++).css('background-position', xposPX + ' ' + yposPX);
                }
            }
            return thumbs;
        }

        //removes the navigation buttons
        function removeNavigation() {
            $imNext.stop().animate({right: '-50px'}, 300);
            $imPrev.stop().animate({left: '-50px'}, 300);
        }

        //add the navigation buttons
        function addNavigation() {
            $imNext.stop().animate({right: '0px'}, 300);
            $imPrev.stop().animate({left: '0px'}, 300);
        }



        //scroll to single mode view
        function scrollToView(targetIndex) {
            var targetThumb = $imWrapper.children('div').slice(targetIndex, targetIndex + 1);
            var targetOffsetTop = targetThumb.offset().top;
            $('html, body').animate({
                scrollTop: targetOffsetTop
            }, 900);
        }


        /*
        when we click on a thumb, we want to merge them
        and show the full image that was clicked.
        we need to animate the thumbs positions in order
        to center the final image in the screen. The
        image itself is the background image that each thumb
        will have (different background positions)
        If we are currently seeing the single image,
        then we want to disperse the thumbs again,
        and with this, showing the thumbs images.
        */

        $thumbs.on('click', function () {
            if (!flgClick) {
                return;
            }
            setflag();

            var $this = $(this);
            var gridStartIndex = 0;
            var gridEndIndex = 0;

            //calculate the dimentions of the for every thumb to show in single mode
            var fW = perLine * 125;
            var fH = perCol * 125;
            var fL = $(window).width() / 2 - fW / 2;
            var fT = $(window).height() / 2 - fH / 2;

            current = $this.index();

            if (mode === 'grid') {
                mode = 'single';

                //remove border radius from thumbs in single mode
                $thumbs.removeClass('curved');

                //the source of the full image
                var imageSrc = $this.find('img').attr('src');

                //dynamically calculate current grid in viewport & get start & end index of thumbs
                if (current < 30) {
                    gridStartIndex = 0;
                } else {
                    gridStartIndex = Math.floor(Math.abs((current - 24) / 6)) * 6;
                }

                //gridStartIndex = Math.floor(current / 30) * 30;
                gridEndIndex = gridStartIndex + nmbThumbsInViewPort;
                $curViewPortThumbs = $imWrapper.children('div').slice(gridStartIndex, gridEndIndex);
                $gridLayoutSingleMode = addBackgroundPosition($curViewPortThumbs);

                //scroll to active single mode view
                scrollToView(gridStartIndex);


                //remove the hover animation effect from all thumbs
                $thumbs.off('mouseenter mouseleave');

                //remove/reverse all animation effects from $curViewPortThumbs
                //before showing them in single mode
                $curViewPortThumbs.fadeTo(100, 1);

                //$thumbs.each(function(i){
                $gridLayoutSingleMode.each(function (i) {
                    var $thumb = $(this);
                    var $image = $thumb.find('img');

                    if (i === 0) {
                        // remove the suffix 'px' from the css property value
                        fT = parseInt($thumb.css('top'), 10);
                    }

                    //var left = fL + (i % perLine) * 125;
                    //var top = fT + Math.floor(i / perLine) * 125;

                    //first we animate the thumb image
                    //to fill the thumbs dimentions
                    $image.stop().animate({
                        width: '100%',
                        height: '100%',
                        marginTop: '0px',
                        marginLeft: '0px'
                    }, 150, function () {
                        /*
                        set the background image for the thumb
                        and animate the thumb_imgs postions and rotation
                        */
                       var param = {
                            left: fL + (i % perLine) * 125 + 'px',
                            top: fT + Math.floor(i / perLine) * 125 + 'px'
                        };

                        $thumb.css({
                            'background-image': 'url(' + imageSrc + ')',
                            'background-size': '750px 625px'
                        }).stop()
                            .animate(param, 1200, function () {
                                //insert navigation for the single mode
                                //if(i==nmbThumbs-1){
                                if (i === nmbThumbsInViewPort - 1) {
                                    addNavigation();
                                    setflag();
                                }
                            });
                        //fade out the thumb's image
                        $image.fadeOut(700);
                    });
                });
            } else {
                setflag();
                //remove navigation
                removeNavigation();
                //if we are on single mode then disperse the thumbs
                disperse();
            }
        });

        //User clicks next button (single mode)
        $imNext.bind('click', function () {
            if (!flgClick) {
                return;
            }
            setflag();

            ++current;
            var $nextThumb = $imWrapper.children('div:nth-child(' + (current + 1) + ')');
            if ($nextThumb.length > 0) {
                var imageSrc = $nextThumb.find('img').attr('src');
                var arr = Array.shuffle(positionsArray.slice(0));
                $thumbs.each(function (i) {
                    //we want to change each divs background image
                    //on a different point of time
                    var t = $(this);
                    setTimeout(function () {
                        t.css({
                            'background-image': 'url(' + imageSrc + ')'
                        });
                        if (i === nmbThumbs - 1) {
                            setflag();
                        }
                    }, arr.shift() * 20);
                });
            } else {
                setflag();
                --current;
                return;
            }
        });

        //User clicks prev button (single mode)
        $imPrev.bind('click', function () {
            if (!flgClick) {
                return;
            }
            setflag();
            --current;
            var $prevThumb = $imWrapper.children('div:nth-child(' + (current + 1) + ')');
            if ($prevThumb.length > 0) {
                var imageSrc = $prevThumb.find('img').attr('src');
                var arr = Array.shuffle(positionsArray.slice(0));
                $thumbs.each(function (i) {
                    var t = $(this);
                    setTimeout(function () {
                        t.css({
                            'background-image': 'url(' + imageSrc + ')'
                        });
                        if (i === nmbThumbs - 1) {
                            setflag();
                        }
                    }, arr.shift() * 20);
                });
            } else {
                setflag();
                ++current;
                return;
            }
        });

        //on windows resize call the disperse function
        $(window).smartresize(function () {
            removeNavigation();
            disperse();
        });

        //function to shuffle an array
        Array.shuffle = function (array){
            var j,x,k;
            for( k = array.length; k;
            j = parseInt(Math.random() * k),
            x = array[--k], array[k] = array[j], array[j] = x){
                //empty block
            }
            return array;
        };
    };

   /* Public jquery functions exposed */
   //Smart Resize
   jQuery.fn.smartresize = function (fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger('smartresize');
    };

   //Dream Slider
   jQuery.fn.dreamSlider = function (options) {
        return dreamSlider($(this), options);
    };

}(jQuery));
