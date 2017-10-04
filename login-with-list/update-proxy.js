var minimist = require('minimist'),
  fs = require('fs'),
  proxyPath = 'ionic.config.json',
  defaultOpts = {
    serverUrl: 'http://127.0.0.1:8081/rest'
  };

var options = minimist(process.argv.slice(2), {
  default: defaultOpts,
  string: ['serverUrl']
});

if (!options.serverUrl) {
  options.serverUrl = defaultOpts.serverUrl;
}

if (!/\/rest$/.test(options.serverUrl)) {
  options.serverUrl += options.serverUrl.slice('-1') === '/' ? 'rest' : '/rest';
}

if (! fs.existsSync(proxyPath)) {
  return;
}

var config = JSON.parse(fs.readFileSync(proxyPath, 'utf8'));
if (!config.proxies) {
  config.proxies = [];
}


var toCreate = false,
  toUpdate = true;

toCreate = ! config.proxies.some(function(proxy) {
  if (proxy.path === '/rest') {
    if (proxy.proxyUrl === options.serverUrl) {
      toUpdate = false;
    } else {
      proxy.proxyUrl = options.serverUrl;
    }
    return true;
  }
});

if (toCreate || toUpdate) {
  if (toCreate) {
    config.proxies.push({
      path: '/rest',
      proxyUrl: options.serverUrl
    });
  }
  fs.writeFileSync(proxyPath, JSON.stringify(config), 'utf8');
}