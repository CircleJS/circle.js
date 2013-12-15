/*
 *  Project: circle.js
 *  Description: A library for focusing page elements.
 *  Author: Greasidis Thodoris, Nona Maria
 *  License: MIT
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "circle",
        defaults = {
            animate: false,
            animationMode: 'transition' // 'animation'
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).

            var $target = $(this.element);
            var targetOffset = $target.offset();
            
            var $circle = $('.blueCircle');
            if (!$circle.length) {
                var cssClass = "blueCircle";
                if (this.options.animate) {
                    if (this.options.animationMode === 'animation') {
                        cssClass += " blueCircleAnimated";
                    }
                }

                $circle = $('<div class="' + cssClass + '"></div>');
                $circle.appendTo('body');
            }

            var h = $target.outerHeight();
            var w = $target.outerWidth();
            var diag = Math.sqrt(h*h + w*w);

            // assuming that all border widths are equal
            var border = parseFloat($circle.css('border-top-width'));
            var paddingTop = parseFloat($circle.css('padding-top'));
            var paddingLeft = parseFloat($circle.css('padding-left'));

            $circle.css({
                'top': Math.ceil(targetOffset.top + h/2 - diag/2 - border - paddingTop),
                'left': Math.ceil(targetOffset.left + w/2 - diag/2 - border - paddingLeft),
                'height': Math.ceil(diag),
                'width': Math.ceil(diag)
            });

            if (this.options.animate && this.options.animationMode === 'transition') {
                var initialScale = 5;

                $circle.css({
                    'transform': 'scale(' + initialScale + ')',
                });

                setTimeout(function(){
                    $circle.addClass('blueCircleTransitioned');
                    $circle.css({
                        'transform': 'scale(1)',
                        'opacity': 1
                    });
                }, 0);
            }
        },

        destroy: function(el, options) {
            var $circle = $('.blueCircle');
            if ($circle && $circle.length) {
                $circle.remove();
            }
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );