'use strict';

const prefs = {
  'overwrite-origin': true,
};

const cors = {};
cors.onHeadersReceived = ({responseHeaders}) => {
  if (prefs['overwrite-origin'] === true) {
    const o = responseHeaders.find(({name}) => name.toLowerCase() === 'access-control-allow-origin');
    if (o) {
      o.value = '*';
    }
    else {
      responseHeaders.push({
        'name': 'Access-Control-Allow-Origin',
        'value': '*'
      });
    }
  }
  return {responseHeaders};
};

cors.remove = () => {
    chrome.webRequest.onHeadersReceived.removeListener(cors.onHeadersReceived);
};

cors.install = () => {
  cors.remove();
  const extra = ['blocking', 'responseHeaders'];
  if (/Firefox/.test(navigator.userAgent) === false) {
    extra.push('extraHeaders');
  }
  chrome.webRequest.onHeadersReceived.addListener(cors.onHeadersReceived, {
    urls: ['http://192.168.45.73:9000/*']
  }, extra);
};

cors.onCommand = () => {
  cors.install();
};

chrome.storage.local.get(prefs, ps => {
    Object.assign(prefs, ps);
    cors.onCommand();
  });