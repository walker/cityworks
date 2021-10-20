# Cityworks node.js API wrapper

This API wrapper for Cityworks follows the Cityworks release schedule as closely as possible. Functionality may be missing depending on necessity or use.

Require the class:

      var cityworks = require('../dist/index.js');

Configure the instance that is then available:

      cityworks.configure('my.cityworks.domain')

Authenticate with the Cityworks install:

      cityworks.authenticate('myuser', 'mypassword').then(resp => {

      }).catch(error => {
        console.log(error.message);
      });


Get the currently valid token in order to store it in a session or cookie:

      cityworks.getToken();

Provide a saved token instead of the standard u/p auth:

      cityworks.setToken('mytoken');
