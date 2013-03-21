# jQuery Twitter Plugin with OAuth support #
This plugin build arround the twitteroauth library to create 
an easy to use way of grabbing tweets from Twitter's 1.1 api

## Implementation ##
1. Include jquery, modernizr, and the plugin javascript
2. Include php folder
3. Setup OAuth (see below steps for OAuth Setup)
4. Execute the plugin
5. Enjoy :-)

Sample Call  

        $('#your-selector').tweet({  
            count: 10,  
            screen_name: "twitter-handle"  
        });

### Plugin Options ###
* count             - The number of tweets to return  
* screen_name       - The twitter user to return tweets for
* exclude_replies   - Whether or not to exclude replies
* include_rts       - Whether or not to include retweets
* refresh           - The refresh interval in minutes

**Note:** For exlude_replies and include_rts the number of returned tweets are filtered 
after the count option is executed.  
For example if you have a count of 20, have set exclude_replies 
to true, and have 3 replies then there will be 17 tweets displayed.

## dev.Twitter.com & OAuth Setup ##
1. First you will need to create a developer account at https://dev.twitter.com/  
2. Next you need to create a new application under My Applications  
3. Make sure to set the url to the website you intend to use this plugin on  
*Note:* If you want to use this locally then set the url to something like http://localhost/myTestPage.php  
4. Finally go to the OAuth tool tab for the application and copy / paste the four keys at the top into the file php/config.php.

You have now succesfully setup OAuth with twitter.

## Twitter Error Codes ##
https://dev.twitter.com/docs/error-codes-responses

## Third-Party Library ##
Plugin uses third-party php library twitteroauth   
Developed by Abraham Williams | abraham@abrah.am | http://abrah.am | @abraham  
https://github.com/abraham/twitteroauth to authenticate against twitter's api.





## TODO ##
1. Implement User Profile Picture logic
2. Base Css styles
3. Fallback php cacheing

