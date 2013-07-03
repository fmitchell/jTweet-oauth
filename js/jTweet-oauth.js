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
 * @version 1.1
 */

// Wrap the plugin in the jquery dollar sign
// This will prevent overriding other methods with
// the same name as the plugin
// Additionally we can use $ to reference jquery
// Closure to allow for private / public methods
(function($){

    // Map the plugin name as a function in jQuery
    // Pass in the options parameter for overriding defaults
    $.fn.jTweet = function(options) {

        // Set the default plugin values
        // Merge the options into the settings var
        var settings = $.extend({}, $.fn.jTweet.defaults, options);

        // Allow chaining by returning the this keyword
        return this.each(function() {

            // Cache the jquery keyword
            var $this = $(this);

            // init vars
            var cachedAt = null;
            var currentTime = new Date();
            var output = '';
            var now = null;
            var retrieveLocalStorage = null;
            var timeSinceCached = null;
            var singleProfileImage = '';

            // If localstorage is available
            if (
                Modernizr.localstorage
                && localStorage['jTweets-oauth']
                && JSON.parse(localStorage['jTweets-oauth'])) {

                // Grab the tweets from localStorage
                retrieveLocalStorage = JSON.parse(localStorage['jTweets-oauth']);

                // Calculate the time in minutes since last cached
                timeSinceCached = ((currentTime.getTime() - retrieveLocalStorage['cachedAt']) / 1000) / 60;

                // Check cached time vs user set option from plugin
                // If greater than then lets reset the localStorage
                if (timeSinceCached > settings.refresh) {

                    localStorage.clear();
                    console.warn('LocalStorage has been cleared');

                } else {

                    // Output the cached html for tweets
                    return $this.html(retrieveLocalStorage['text']);

                }
            }

            // Use OAuth to authenticate
            // Grab User timeline
            $.ajax({
                dataType: "json",
                url: "../php/requestOAuth.php",
                data: settings

            }).done(function (data) {

                // Set the current system time
                now = new Date();

                // Error Check
                if (typeof data.errors != 'undefined' && data.errors[0].hasOwnProperty('code')) {

                    // Make sure we are in debug mode before outputting the direct
                    // api errors
                    if (settings.debug) {

                        // Log the error to the console
                        console.error('Twitter Error Code (' + data.errors[0].code + '): ' + data.errors[0].message);

                        // Debug: store error in localstorage (optional)
                        localStorage['jTweets-oauth-error-log'] = 'Twitter Error Code (' + data.errors[0].code + '): ' + data.errors[0].message;
                    }

                    // Early return for errors
                    return $this.html(settings.no_tweets_msg);
                }


                // Loop through results
                $.each(data, function(key, value) {

                    // init userImage
                    userImage = '';

                    // IE balks at trying to format a date string use this regex method
                    // from stackoverflow
                    created_at = $.fn.jTweet.parseDate(value['created_at']);

                    // Calculate the time posted
                    timePosted = $.fn.jTweet.getTimePosted(now, created_at);

                    // Get the tweets with links formatted
                    tweetText = $.fn.jTweet.formatLinks(value['text'].toString());

                    // Make sure show_profile_image is true and Check for empty string
                    if (settings.show_profile_image && value.user.profile_image_url !== '' && singleProfileImage === '') {

                        // Create the user profile image
                        userImage = '<img src="' + value.user.profile_image_url + '" alt="' + value.user.screen_name + ': ' + value.user.description + '" class="' + settings.css_prefix_class + '-profile-image"/>';

                        if (settings.show_single_profile_image) {
                            singleProfileImage = userImage;
                            userImage = '';
                        }
                    }

                    // Output the html
                    output += '<div class="' + settings.css_prefix_class + '-single-tweet">' + userImage + '<div class="' + settings.css_prefix_class + '-tweet-text">' + tweetText + '<div class="' + settings.css_prefix_class + '-posted-at">' + timePosted + '</div></div></div>';

                });



                // Are we displaying a main twitter handle link
                if (settings.show_screen_name_link) {
                    output = '<a href="https://www.twitter.com/' + settings.screen_name + '" class="' + settings.css_prefix_class + '-screen-name-link">@' + settings.screen_name + '</a>' + output;
                }

                // For single profile images
                if (settings.show_profile_image && singleProfileImage !== '') {
                    output = singleProfileImage + output;
                }

                // Cache the output into html5 localStorage
                if (Modernizr.localstorage) {

                    // Grab the localtime in ms for the variable
                    cachedAt = new Date().getTime();

                    // Format the object prior to stringify
                    tweets = {
                        'text': output,
                        'cachedAt': cachedAt
                    };

                    // Stringify the array so we only need to look at
                    // one localstorage value
                    localStorage['jTweets-oauth'] = JSON.stringify(tweets);
                }

                // Set the current element to display the output html
                $this.html(output);

            }).fail(function (e) {

                // We haz fail
                console.error('There was an error with OAuth, the Twitter service is down, or php/requestOAuth.php is missing/invalid');

                // If debug mode then dump the event varaible
                if (settings.debug) {
                    console.error(e);
                }

            });

        });

    };


    /**
     * Public access to default plugin settings
     *
     * This allows the user to change settings before
     * even calling the plugin. It also allows for unit testing
     * opportunities.
     */
    $.fn.jTweet.defaults = {
        count: 5, // The number of tweets to grab
        css_prefix_class: 'jTweet', // The class to prefix the top level html element with for styling
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

    /**
     * Get Time Posted
     *
     * Determine the elapsed time for the posts
     *
     * @param  {Date} startDate The Start date
     * @param  {Date} endDate   The End date
     * @return {string}         The formatted string for time posted
     */
    $.fn.jTweet.getTimePosted = function (startDate, endDate) {

        // Init var
        var timePosted, diff, seconds, minutes, hours;

        // What is the difference in timing between jTweets-oauth
        diff = startDate.getTime() - endDate.getTime();

        // Calculate the seconds for the difference
        seconds = diff / 1000;
        minutes = seconds / 60;
        hours = minutes / 60;

        // If seconds are less than 60 then it was just posted
        if (seconds < 60) {
            timePosted = 'just now';

        // If less than 60 minutes then it is within the hour
        // display minutes
        } else if (minutes < 60) {
            minutes = Math.floor(minutes);
            timePosted = (minutes > 1) ? minutes + ' minutes ago' : 'about a minute ago';

        // If Less than 24 hours it is the same day
        // display hours
        } else if (hours < 24) {
            hours = Math.floor(hours);
            timePosted = (hours > 1) ? hours + ' hours ago' : 'about an hour ago';

        // If greater than 24 then it is a couple days ago
        // display days
        } else if (hours >= 24) {
            days = Math.floor(hours / 24);
            timePosted = (days > 1) ? days + ' days ago' : 'about a day ago';
        }

        return timePosted;
    };

    /**
     * Format Links
     *
     * This method will convert hyperlinks, hash tags, an replies
     * into valid links
     *
     * @author Josh Frankel <joshmfrankel@gmail.com>
     * @param  {string} text The Tweet text
     * @return {string}      The formatted text
     */
    $.fn.jTweet.formatLinks = function (text) {

        // init the output variable
        var tweet = '';

        // Link regex for http/https/www
        var linkRegex = /(((https?:\/\/)|(www1?))\S+)/gi;

        // Hash tag regex with replace
        var hashRegex = /(\#{1}(\w+))/gi;

        // @ tag regex for username replace, email address are not allowed
        //var atRegex = /(\s\@{1}(\w+))/gi;
        var atRegex = /(\s{1}|^)(\@{1}(\w+))(\s{1}|\.$|$)/gi;

        // The Regex replace
        tweet = text
            .replace(linkRegex, '<a href="$1">$1</a>')
            .replace(hashRegex, '<a href="https://www.twitter.com/$1">$1</a>')
            .replace(atRegex,   '<a href="https://www.twitter.com/$2">$2</a>');

        // return the formatted tweet
        return tweet;
    };

    /**
     * Parse Date
     *
     * Takes a date in string format and parses
     * it into a proper dateTime
     *
     * @author  Stackoverflow
     * @param  {string} str The datetime string to convert
     * @return {Date}       A Properly formatted datetime
     */
    $.fn.jTweet.parseDate = function (str) {
        var v=str.split(' ');
        return new Date(Date.parse(v[1]+" "+v[2]+", "+v[5]+" "+v[3]+" UTC"));
    };

})(jQuery);
