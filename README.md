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


API
===

###`GET /?url=foo.bar.com`

Makes a GET request on foo.bar.com
Uses [request](https://github.com/mikeal/request) so it follows
redirects.

A successful response looks like:

```

{
  "message": {
    "answer": "node activity detected",
    "reasons": [
      {
        "name": "ecstatic",
        "found": true,
        "reasons": [
          "Found server: ecstatic-0.4.12 header in response"
        ]
      },
      {
        "name": "Browserify",
        "found": true,
        "reasons": [
          //LOTS OF JAVASCRIPT HERE
        ]
      }
    ]
  }
}
```

###`DELETE /?url=foo.bar.com`

Removes foo.bar.com's results from the redis cache


###`GET /cache`

Returns a list of cached urls

```
[
  {
    "url": "http://twitter.com",
    "ttl": 906
  },
  {
    "url": "http://ebay.com",
    "ttl": 902
  }
]
```

###`GET /counts`

Returns a list of positive urls

```
[
  {
    "url": "http://substack.net",
    "count": 42
  }
]
```

####`GET /counts?url=foo.bar.com`

Returns an object with a count key.

```
{
  "count": 17
}
```
If the specified url isn't in redis, return a count of 0
