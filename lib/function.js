var fetch               = require('isomorphic-fetch')
  , polyfunc_id         = require('@polyfunc/id')
  , mime                = require('mime-types')
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
        , forward_auth    = false
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

    if (ctx) {
      if (forward_auth) {
        let { headers : h = {} } = ctx;
        headers['authorization'] = h['authorization']
      }
    }

    if (authorization) {
      headers['authorization'] = authorization;
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
