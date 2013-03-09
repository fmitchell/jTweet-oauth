// Wrap the plugin in the jquery dollar sign
// This will prevent overriding other methods with 
// the same name as the plugin
// Additionally we can use $ to reference jquery
(function($){

    // Map the plugin name as a function in jQuery
    $.fn.tweet = function() {

        // Allow chaining by returning the this keyword
        return this.each(function() {

                     // Output a console message to show the plugin
                     // is working
                     console.log('We have called the tweet plugin');
        });

    };

})(jQuery);
