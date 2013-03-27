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
            screen_name: 'the base username',
            count: 5,
            exclude_replies: false,
            include_rts: true,
            refresh: 1
        };

        // Use the jQuery method extend to merge
        // the defaults and options arrays
        options = $.extend({}, defaults, options);

        // Allow chaining by returning the this keyword
        return this.each(function() {

            // Cache the jquery keyword
            var $this = $(this);
            var output = '';
            var currentTime = new Date();
            var retrieveLocalStorage = null;
            var timeSinceCached = null;
            var now = null;
            var cachedAt = null;

            // If localstorage is available
            if (
                Modernizr.localstorage
                && localStorage['tweets']
                && JSON.parse(localStorage['tweets'])) {

                // Grab the tweets from localStorage
                retrieveLocalStorage = JSON.parse(localStorage['tweets']);

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
                url: "/php/requestOAuth.php",
                data: options

            }).done(function (data) {

                // Set the current system time
                now = new Date();

                // Loop through results
                $.each(data, function(key, value) {

                    // Format the create_at time into a js date obj
                    created_at = new Date(value['created_at']);

                    // Calculate the time posted
                    timePosted = getTimePosted(now, created_at);

                    // Get the tweets with links formatted
                    tweetText = formatLinks(value['text'].toString());

                    // Output the html
                    output += '<div class="twitter-single-tweet"><div class="twitter-tweet">' + tweetText + '</div><div class="twitter-posted-at">' + timePosted + '</div></div>';

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
                    localStorage['tweets'] = JSON.stringify(tweets);
                }

                // Set the current element to display the output html
                $this.html(output);

            }).fail(function (e) {

                console.error('There was an error with OAuth, the Twitter service is down, or your php/requestOAuth.php is missing/invalid');
            });

        });

    };

    function getTimePosted(startDate, endDate) {

        // Init var
        var timePosted, diff, seconds, minutes, hours;

        // What is the difference in timing between tweets
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

    function formatLinks (text) {
        var tweet = '';

        var linkRegex = /(((https?:\/\/)|(www1?))\S+)/gi;
        var hashRegex = /(\#{1}(\w+))/gi;
        var atRegex = /(\@{1}(\w+))/gi;

        tweet = text
            .replace(linkRegex, '<a href="$1">$1</a>')
            .replace(hashRegex, '<a href="https://www.twitter.com/$1">$1</a>')
            .replace(atRegex,   '<a href="https://www.twitter.com/$1">$1</a>');

        return tweet;
    }

})(jQuery);
