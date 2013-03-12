# A Jquery Twitter plugin #

## Usage ##
For this plugin to work with Twitter's 1.1 api you first need to setup OAuth.  Luckily there is an excellent plugin called twitteroauth which will take care of this for us.

### OAuth Setup ###
Plugin uses twitteroauth by abraham https://github.com/abraham/twitteroauth to authenticate against twitter's api.

1. First you will need to create a developer account at https://dev.twitter.com/  
2. Next you need to create a new application under My Applications  
3. Make sure to set the url to the website you intend to use this plugin on  
*Note* If you want to use this locally then set the url to something like http://localhost/myTestPage.php  
4. Finally go to the OAuth tool tab for the application and copy / paste the four keys at the top into the file php/oAuth.php.

You have now succesfully setup OAuth with twitter.

## Plugin Options ##
* count             - The number of tweets to return  
* screen_name       - The twitter user to return tweets for
* exclude_replies   - Whether or not to exclude replies
* include_rts       - Whether or not to include retweets

*Note: * For exlude_replies and include_rts the number of returned tweets are filtered after the count option is executed.  For example if you have a count of 20, have set exclude_replies to true, and have 3 replies then there will be 17 tweets displayed.

