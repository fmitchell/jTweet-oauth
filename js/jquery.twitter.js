// Wrap the plugin in the jquery dollar sign
// This will prevent overriding other methods with 
// the same name as the plugin
// Additionally we can use $ to reference jquery
(function($){

    // Map the plugin name as a function in jQuery
    // Pass in the options parameter for overriding defaults
    $.fn.tweet = function(options) {

        // Set the default plugin values
        var defaults = {
            username: 'the base username',
            count: 5
        };

        // Use the jQuery method extend to merge
        // the defaults and options arrays
        options = $.extend({}, defaults, options);

        // Allow chaining by returning the this keyword
        return this.each(function() {

            // Output a console message to show the plugin
            // is working
            console.log(options);

        });

    };

})(jQuery);
