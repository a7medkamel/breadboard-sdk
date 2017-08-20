var Promise             = require('bluebird')
  , _                   = require('lodash')
  , fetch               = require('isomorphic-fetch')
  , git                 = require('taskmill-core-git')
  ;
  // , mime                = require('mime-type/with-db')

function run(host, owner, repo, filename, options = {}) {
  let { breadboard, branch, token, method, headers = {}, body, blob } = options;

  let url = git.url(host, owner, repo, filename, { breadboard, branch, token });

  if (blob) {
    headers['blob'] = (new Buffer(blob)).toString('base64');
  }

  return fetch(url, {
            method
          , body
          , headers
        })
        .then((response) => {
          // var ext     = mime.extension(response.headers['content-type'])
          //   , enc     = mime.charset(response.headers['content-type']) || 'binary'
          //   , pragma  = []
          //   ;
          //
          // try {
          //   pragma = JSON.parse(response.headers['manual-pragma']);
          // } catch (err) {}
          return response;
        })
}

module.exports = {
  run
};
