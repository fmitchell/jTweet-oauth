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
 * @version 0.7
 */

// Prevent console.log errors
(function(){for(var a,e=function(){},b="assert clear count debug dir dirxml error exception group groupCollapsed groupEnd info log markTimeline profile profileEnd table time timeEnd timeStamp trace warn".split(" "),c=b.length,d=window.console=window.console||{};c--;)a=b[c],d[a]||(d[a]=e)})();

// Wrap the plugin in the jquery dollar sign
// This will prevent overriding other methods with
// the same name as the plugin
// Additionally we can use $ to reference jquery
(function($){

    // Map the plugin name as a function in jQuery
    // Pass in the options parameter for overriding defaults
    $.fn.jTweet = function(options) {

        // Set the default plugin values
        var defaults = {
            screen_name: 'the base username',
            count: 5,
            exclude_replies: false,
            include_rts: true,
            refresh: 5,
            show_profile: true,
            css_prefix_class: 'jTweet',
            debug: false,
            no_tweets_msg: 'There are no tweets available'
        };

        // Use the jQuery method extend to merge
        // the defaults and options arrays
        options = $.extend({}, defaults, options);

        // Allow chaining by returning the this keyword
        return this.each(function() {

            // Cache the jquery keyword
            var $this = $(this);

            // init vars
            var output = '';
            var currentTime = new Date();
            var retrieveLocalStorage = null;
            var timeSinceCached = null;
            var now = null;
            var cachedAt = null;

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
                if (timeSinceCached > options.refresh) {

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
                url: "./php/requestOAuth.php",
                data: options

            }).done(function (data) {

                // Set the current system time
                now = new Date();

                // Error Check
                if (typeof data.errors != 'undefined' && data.errors[0].hasOwnProperty('code')) {

                    // Make sure we are in debug mode before outputting the direct
                    // api errors
                    if (options.debug) {

                        // Log the error to the console
                        console.error('Twitter Error Code (' + data.errors[0].code + '): ' + data.errors[0].message);

                        // Debug: store error in localstorage (optional)
                        localStorage['jTweets-oauth-error-log'] = 'Twitter Error Code (' + data.errors[0].code + '): ' + data.errors[0].message;
                    }

                    // Early return for errors
                    return $this.html(options.no_tweets_msg);
                }


                // Loop through results
                $.each(data, function(key, value) {

                    // init userImage
                    userImage = '';

                    // IE balks at trying to format a date string use this regex method
                    // from stackoverflow
                    created_at = parseDate(value['created_at']);

                    // Calculate the time posted
                    timePosted = getTimePosted(now, created_at);

                    // Get the tweets with links formatted
                    tweetText = formatLinks(value['text'].toString());

                    // Make sure show_profile is true and Check for empty string
                    if (options.show_profile && value.user.profile_image_url !== '') {

                        // Create the user profile image
                        userImage = '<img src="' + value.user.profile_image_url + '" alt="' + value.user.screen_name + ': ' + value.user.description + '/>';
                    }

                    // Output the html
                    output += '<div class="' + options.css_prefix_class + '-single-tweet">' + userImage + '<div class="' + options.css_prefix_class + '-tweet-text">' + tweetText + '<div class="' + options.css_prefix_class + '-posted-at">' + timePosted + '</div></div></div>';

                });

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
                if (options.debug) {
                    console.error(e);
                }

            });

        });

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
    function getTimePosted(startDate, endDate) {

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
    }

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
    function formatLinks (text) {

        // init the output variable
        var tweet = '';

        // Link regex for http/https/www
        var linkRegex = /(((https?:\/\/)|(www1?))\S+)/gi;

        // Hash tag regex with replace
        var hashRegex = /(\#{1}(\w+))/gi;

        // @ tag regex for username replace, email address are not allowed
        var atRegex = /(\s\@{1}(\w+))/gi;

        // The Regex replace
        tweet = text
            .replace(linkRegex, '<a href="$1">$1</a>')
            .replace(hashRegex, '<a href="https://www.twitter.com/$1">$1</a>')
            .replace(atRegex,   '<a href="https://www.twitter.com/$1">$1</a>');

        // return the formatted tweet
        return tweet;
    }

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
    function parseDate(str) {
        var v=str.split(' ');
        return new Date(Date.parse(v[1]+" "+v[2]+", "+v[5]+" "+v[3]+" UTC"));
    }

})(jQuery);
