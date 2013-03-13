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

            // init the localstorage variable
            var cache      = (localStorage['tweets-text'] ? localStorage['tweets-text'] : false);
            var cachedTime = (localStorage['tweets-cached-time'] ? localStorage['tweets-cached-time'] : false);

            // Calculate the time since last cache
            minutesSinceLastCache = ((currentTime.getTime() - cachedTime) / 1000) / 60;

            // Check cached time vs user set option from plugin
            // If greater than then lets reset the localStorage
            if (minutesSinceLastCache > options.refresh) {
                localStorage.clear();
                console.warn('LocalStorage has been cleared');
            }

            // If html5 localstorage is available and
            // the cache variable exists
            if (Modernizr.localstorage && localStorage['tweets-text'] && localStorage['tweets-cached-time']) {

                // Output the html that has been stored
                // and enjoy how fast this runs :-)
                return $this.html(cache);
            }

            // Use OAuth to authenticate
            // Grab User timeline
            $.ajax({
                dataType: "json",
                url: "php/oAuth.php",
                data: options
            }).done(function (data) {

                // Set the current system time
                var now = new Date();

                // Loop through results
                $.each(data, function(key, value) {

                    // Format the create_at time into a js date obj
                    created_at = new Date(value['created_at']);

                    // Calculate the time posted
                    timePosted = getTimePosted(now, created_at);

                    // Get the tweets with links formatted
                    tweet = formatLinks(value['text'].toString());

                    // Output the html
                    output += '<div class="twitter-single-tweet"><div class="twitter-tweet">' + tweet + '</div><div class="twitter-posted-at">' + timePosted + '</div></div>';

                });

                // Cache the output into html5 localStorage
                if (Modernizr.localstorage) {

                    // Grab the localtime in ms for the variable
                    var cachedTime = new Date().getTime();

                    // Set the appended output html string
                    // into the localStorage
                    localStorage['tweets-text']        = output;
                    localStorage['tweets-cached-time'] = cachedTime;
                }

                // Set the current element to display the output html
                $this.html(output);

            }).fail(function (e) {

                console.error('There was an error with OAuth or the Twitter service is down');
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
