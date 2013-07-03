# jQuery Twitter Plugin with OAuth support #
**Version:** 1.0 
This plugin build arround the twitteroauth library to create  
an easy to use way of grabbing tweets from Twitter's 1.1 api

## TODO ##
1. Basic CSS Styles
2. PHP APC Cache for server caching
3. Convert requestOAuth.php into a class 
4. Add support for multiple types of api requests

## Implementation ##
1. Include jquery, modernizr, and the plugin javascript as scripts
2. Setup OAuth (see below steps for OAuth Setup)
3. Fill out the application keys in config.php
4. Call the jquery method
5. Enjoy :-)

## dev.Twitter.com & OAuth Setup ##
1. First you will need to create a developer account at https://dev.twitter.com/  
2. Next you need to create a new application under My Applications  
3. Make sure to set the url to the website you intend to use this plugin on  
*Note:* If you want to use this locally then set the url to something like http://localhost/myTestPage.php  
4. Finally go to the OAuth tool tab for the application and copy / paste the four keys at the top into the file php/config.php.

You have now succesfully setup OAuth with twitter.  

## Plugin Options ##
* **count** *(int)*                             - The number of tweets to return  
* **css_prefix_class** *(string)*               - The class to prefix the output html classes with
* **debug** *(boolean)*                         - The debug flag to enable output to the console with error messages.
* **exclude_replies** *(boolean)*               - Whether or not to exclude replies
* **include_rts** *(boolean)*                   - Whether or not to include retweets
* **no_tweets_msg** *(string)*                  - The HTML to display if there are no tweets
* **refresh** *(int)*                           - The refresh interval in minutes 
* **screen_name** *(string)*                    - The twitter user to grab tweets from
* **show_profile_image** *(boolean)             - The profile image flag to enable screen_name profile images
* **show_single_profile_image** *(string)*      - Whether or not we should only display a single profile image at the top of the feed. show_profile_image must be set to true
* **show_screen_name_link** *(boolean)*         - Show the screen name link at the top of the twitter HTML output

**Note:** For exlude_replies and include_rts the number of returned tweets are filtered 
after the count option is executed.  
For example if you have a count of 20, have set exclude_replies 
to true, and have 3 replies then there will be 17 tweets displayed.

## Example Call

        $('#your-selector').tweet({  
            count: 10,  
            screen_name: "twitter-handle"  
        });

## Resources
* Twitter Error Codes (https://dev.twitter.com/docs/error-codes-responses)

## Third-Party Library ##
Plugin uses third-party php library twitteroauth   
Developed by Abraham Williams | abraham@abrah.am | http://abrah.am | @abraham  
https://github.com/abraham/twitteroauth to authenticate against twitter's api.

