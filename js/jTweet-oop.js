/**
 * jTweet-oauth
 *
 * This plugin build arround the twitteroauth library to create
 * an easy to use way of grabbing tweets from Twitter's 1.1 api
 *
 * @author Joshua Frankel <joshmfrankel@gmail.com>
 * @copyright Copyright (c) 2013, Joshua Frankel
 * @link https://github.com/joshmfrankel/jTweet-oauth
 * @see  Twitteroauth https://github.com/abraham/twitteroauth for authentication details
 * @version 0.9
 */

// Wrap the plugin in the jquery dollar sign
// This will prevent overriding other methods with
// the same name as the plugin
// Additionally we can use $ to reference jquery
(function($){

    // Plugin code
    var jTweet = function(element)
    {
        var elem = $(element);
        var obj = this;

        // Set the default plugin values
        var defaults = {
            count: 5,
            css_prefix_class: 'jTweet',
            debug: false,
            exclude_replies: false,
            include_rts: true,
            no_tweets_msg: 'There are no tweets available',
            refresh: 5,
            screen_name: 'the base username',
            show_profile_image: true,
            show_single_profile_image: true,
            show_screen_name_link: true
        };

        // Use the jQuery method extend to merge
        // the defaults and options arrays
        options = $.extend({}, defaults, options);

        // Public Method
        this.publicMethod = function() {
            console.log('public called');
        };

        var privateMethod = function() {
            console.log('private called');
        };

    };

    // Plugin Code
    $.fn.jTweet = function(options) {

        return this.each(function() {

            var element = $(this);

            // Return early if the object exists
            if (element.data('jTweet')) {
                return;
            }

            // Instantiate a new obj
            var jTweet = new jTweet(this, options);

            // Store plugin object in
            element.data('jTweet', jTweet);
        });

    });

})(jQuery);
