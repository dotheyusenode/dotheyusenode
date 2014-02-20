dotheyusenode
=============

Do they use node?

###Checks for the presence of

* express.js
* sails.js
* koa
* ecstatic
* CoffeeScript Compiled JavaScript
* Browserify prepared JavaScript

Development
-----------
* install nodejs
* install deps `npm install`
* install redis `brew install redis` or `sudo apt-get install
  redis-server`

Testing
-------
* Make sure redis-server is running on default port 6379
* `npm test`

Production
----------
* On Heroku
* Production Redis will be picked up by an ENV var REDISTOGO\_URL

