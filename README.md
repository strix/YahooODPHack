# YahooODPHack
Discovering various methods of exploiting Yahoo's ODP system.

## Attempts

### Phantom bruteforce
Uses [phantom.js](http://phantomjs.org/) and [node.js](https://nodejs.org/) in an attempt to bruteforce the 4 character password after having the cookies to appear as a "trusted machine" so the password would only be 4 characters instead of 8.  The result: yahoo actually keeps track server side to see how many failed attempts have been made.  If there are more than 8 failed attempts you have to resend your code (although yahoo will not indicate to you if you need to do a resend) and since you can only send your code every minute, it makes bruteforcing impossible.  Props to Yahoo.
