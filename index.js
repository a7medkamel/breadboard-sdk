var Promise             = require('bluebird')
  , _                   = require('lodash')
  , fetch               = require('isomorphic-fetch')
  , git                 = require('taskmill-core-git')
  // , content_type        = require('content-type')
  , mime                = require('mime-types')
  , PolyFunction        = require('./lib/function')
  ;

function run(host, owner, repo, filename, options = {}) {
  let { breadboard, branch, token, method = 'GET', headers = {}, body, blob, platform } = options;

  let url = git.url(host, owner, repo, filename, { breadboard, branch, token, platform });

  if (blob) {
    headers['blob'] = (new Buffer(blob)).toString('base64');
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

function func(name) {
  return new PolyFunction(name);
}

module.exports = {
    run
  , function : func
};
