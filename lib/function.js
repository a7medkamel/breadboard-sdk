var fetch               = require('isomorphic-fetch')
  , polyfunc_id         = require('@polyfunc/id')
  , mime                = require('mime-types')
  , _                   = require('lodash')
  ;

class PolyFunction {
  constructor(uri, options = {}) {
    let { blob, gateway } = options;

    Object.assign(this, { uri, blob, gateway });
  }

  run_url(options = {}) {
    let { uri, gateway } = this;

    return polyfunc_id.run_url(uri, { gateway });
  }

  call(options = {}) {
    let { method
        , headers   = {}
        , body
        , blob
        , ctx
        , authorization } = options
      , url               = this.run_url()
      ;

    if (!method) {
      if (body) {
        method = 'POST';
      } else {
        method = 'GET';
      }
    }

    if (blob) {
      headers['blob'] = (new Buffer(blob)).toString('base64');
    }

    if (authorization) {
      if (authorization === true) {
        let { headers : h = {} } = (ctx || {});
        if (h['authorization']) {
          headers['authorization'] = h['authorization'];
        }
      }

      if (_.isString(authorization)) {
        headers['authorization'] = authorization;
      }
    }

    if (_.isObject(body)) {
      body = JSON.stringify(body);
      Object.assign(headers, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    }

    return fetch(url, {
              method
            , body
            , headers
          })
          .then((response) => {
            let content_type  = response.headers.get('content-type')
              , extension     = mime.extension(content_type)
              , charset       = mime.charset(content_type)
              , pragma        = []
              ;

            try {
              let head = response.headers.get('manual-pragma');

              pragma = JSON.parse(head);
            } catch (err) {}

            response.breadboard = { content_type, extension, charset, pragma };

            return response;
          })
  }
}

module.exports = PolyFunction;
