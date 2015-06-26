jQuery( document ).ready(function( $ ) {

	// General variables
	var	delta 		    = 0;
    var scrollThreshold = 1;
    var animating 		= false;

    // DOM elements
    var sectionsContainer = $('.vs-slider');
    var sections          = $('.vs-section');

	// Initialise styles
	var currentSection = sections.filter('.active');

    // Animations settings
	var	animationsSettings  = {
		visible: 'translateNone',
		top:     'translateUp.half',
		bottom:  'translateDown',
		easing:  'easeInCubic',
		duration: 800
	};

    // Initialise the vertical scroller
    function init() {

        // Define the height of sections
        sections.height( $( window ).height() );

        // Current section
        TweenLite.to(currentSection, 0, {
            opacity: 1,
            z: '0%',
            y: '0%'
        });

        // Bottom section
        if( currentSection.prev('.vs-section').index() > -1 ) {
            TweenLite.to(currentSection.prev('.vs-section'), 0, {
                opacity: 1,
                z: '0%',
                y: '-100%'
            });
        }

        // Top section
        if( currentSection.next('.vs-section').index() > -1 ) {
            TweenLite.to(currentSection.next('.vs-section'), 0, {
                opacity: 1,
                z: '0%',
                y: '100%'
            });
        }

        // Bind events
        bindEvents();

    }

    function prev() {
        // All tests will be done in the moveTo function
        moveTo( currentSection.index() - 1 );
    }

    function next() {
        // All tests will be done in the moveTo function
        moveTo( currentSection.index() + 1 );
    }

    function moveTo( sectionIndex ) {

        var nextSection;
        var animation;

        // Test the slider is not already moving and the requested section is not the current one
        if( !animating && currentSection.index() !== sectionIndex ) {

            // Animations starting
            animating = true;

            // Test if the requested section is not before the first or after the last one
            if( sectionIndex > -1 && sectionIndex < sections.length ) {

                if( sectionIndex > currentSection.index() ) { // Requested section is after the current one
                    nextSection   = currentSection.next('.vs-section');
                    animationFrom = '100%';
                    animationTo   = '-100%';
                } else { // Requested section is before the current one
                    nextSection   = currentSection.prev('.vs-section');
                    animationFrom = '-100%';
                    animationTo   = '100%';
                }

                // Actual animation
                currentSection.removeClass('active');

                var currentSectionTween = TweenLite.fromTo(currentSection, 0.8, {
                    z: '0%',
                    y: '0%'
                }, {
                    z: '0%',
                    y: animationTo
                });

                var nextSectionTween = TweenLite.fromTo(nextSection, 0.8,{
                    z: '0%',
                    y: animationFrom,
                    opacity: 1
                }, {
                    z: '0%',
                    y: '0%',
                    opacity: 1,

                    onComplete: function() {

                        nextSection.addClass('active');

                        // Animations stopped
                        animating      = false;
                        // Update current section variable
                        currentSection = nextSection;
                    }
                });


            } else {

                // At this stage the requested section is either after the last one or before the first one

                if( sectionIndex <= -1 ) { // Requested section is before the first one

                    console.log('before');

                } else if( sectionIndex >= sections.length ) { // Requested section is after the last one

                    console.log('after');

                }

                // Animations stopped
                animating = false;

            }

        } else {

            // Requested section is the current one
            return false;

        }

    }

    function bindEvents() {

        // Scroll with mousewheel actions
        $( window ).on('DOMMouseScroll mousewheel', function( event ) {

            // Check the scroll direction
            if ( event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0 ) {

                delta--;

                if( Math.abs( delta ) >= scrollThreshold ) {
                    prev();
                } else {
                    return false;
                }

            } else {

                delta++;

                if( delta >= scrollThreshold ) {
                    next();
                } else {
                    return false;
                }

            }

            // Reset delta
            delta = 0;

            return false;

        });

        // Keyboard arrows actions
        $( document ).on('keyup', function( event ) {

            if( event.which == '40' ) {
                next();
            } else if( event.which == '38' ) {
                prev();
            }

        });

        // Events for devices which support touch events
        if( Modernizr.touch ) {

            // Hammer.js

            // Swipe gesture
            var hammerVS = new Hammer( sectionsContainer[0] );

            hammerVS.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

            hammerVS.on('swipeup', function() {   next(); });
            hammerVS.on('swipedown', function() { prev(); });

            // Navigation arrows
            var hammerVSprev = new Hammer( $('.vs-prev')[0] );
            var hammerVSnext = new Hammer( $('.vs-next')[0] );

            hammerVSprev.on('tap', function() { prev(); });
            hammerVSnext.on('tap', function() { next(); });

        } else {

            $('.vs-prev').on('click', function() {
                prev();
            });

            $('.vs-next').on('click', function() {
                next();
            });

        }

    }

    // Vertical scroller initialisation
    init();

});

// // Register Velocity effects
// // None
// $.Velocity
//     .RegisterEffect('translateUp', {
//     	defaultDuration: 1,
//         calls: [
//             [ { translateZ: 0, translateY: '-100%' }, 1 ]
//         ]
//     });

// $.Velocity
//     .RegisterEffect('translateDown', {
//     	defaultDuration: 1,
//         calls: [
//             [ { translateZ: 0, translateY: '100%' }, 1 ]
//         ]
//     });

// $.Velocity
//     .RegisterEffect('translateNone', {
//     	defaultDuration: 1,
//         calls: [
//             [ { translateZ: 0, translateY: '0', opacity: '1' }, 1 ]
//         ]
//     });

// // Parallax
// $.Velocity
//     .RegisterEffect('translateUp.half', {
//     	defaultDuration: 1,
//         calls: [
//             [ { translateZ: 0, translateY: '-50%' }, 1 ]
//         ]
//     });
