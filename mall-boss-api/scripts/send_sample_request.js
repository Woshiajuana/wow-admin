define([
  'jquery',
  'lodash',
], function($, _) {

  const initDynamic = function() {
    // Button send
    $('.sample-request-send').off('click');
    $('.sample-request-send').on('click', function(e) {
      e.preventDefault();
      const $root = $(this).parents('article');
      const group = $root.data('group');
      const name = $root.data('name');
      const version = $root.data('version');
      sendSampleRequest(group, name, version, $(this).data('sample-request-type'));
    });

    // Button clear
    $('.sample-request-clear').off('click');
    $('.sample-request-clear').on('click', function(e) {
      e.preventDefault();
      const $root = $(this).parents('article');
      const group = $root.data('group');
      const name = $root.data('name');
      const version = $root.data('version');
      clearSampleRequest(group, name, version);
    });
  }; // initDynamic

  function sendSampleRequest(group, name, version, type) {
    const $root = $('article[data-group="' + group + '"][data-name="' + name + '"][data-version="' + version + '"]');

    // Optional header
    const header = {};
    $root.find('.sample-request-header:checked').each(function(i, element) {
      const group = $(element).data('sample-request-header-group-id');
      $root.find('[data-sample-request-header-group="' + group + '"]').each(function(i, element) {
        const key = $(element).data('sample-request-header-name');
        let value = element.value;
        if (!element.optional && element.defaultValue !== '') {
          value = element.defaultValue;
        }
        header[key] = value;
      });
    });

    // create JSON dictionary of parameters
    const param = {};
    const paramType = {};
    $root.find('.sample-request-param:checked').each(function(i, element) {
      const group = $(element).data('sample-request-param-group-id');
      $root.find('[data-sample-request-param-group="' + group + '"]').not(function() {
        return $(this).val() == '' && $(this).is("[data-sample-request-param-optional='true']");
      }).each(function(i, element) {
        const key = $(element).data('sample-request-param-name');
        let value = element.value;
        if (!element.optional && element.defaultValue !== '') {
          value = element.defaultValue;
        }
        param[key] = value;
        paramType[key] = $(element).next().text();
      });
    });

    // grab user-inputted URL
    let url = $root.find('.sample-request-url').val();

    // Insert url parameter
    const pattern = pathToRegexp(url, null);
    const matches = pattern.exec(url);
    for (let i = 1; i < matches.length; i++) {
      const key = matches[i].substr(1);
      if (param[key] !== undefined) {
        url = url.replace(matches[i], encodeURIComponent(param[key]));

        // remove URL parameters from list
        delete param[key];
      }
    } // for

    $root.find('.sample-request-response').fadeTo(250, 1);
    $root.find('.sample-request-response-json').html('Loading...');
    refreshScrollSpy();

    _.each(param, function(val, key) {
      const t = paramType[ key ].toLowerCase();
      if (t === 'object' || t === 'array') {
        try {
          param[ key ] = JSON.parse(val);
        } catch (e) {
        }
      }
    });

    // append headers from db
    if (typeof localStorage === 'undefined') {
      alert("浏览器不支持 'localStorage' 特性， 请使用新版本Chrome 调试!!! \n\n---  ");
      return;
    }

    if (typeof URL === 'undefined') {
      alert("浏览器不支持 'URL' 特性， 请使用新版本Chrome 调试!!! \n\n---  ");
      return;
    }

    _.each([ 'user-agent', 'access-token', 'x-forwarded-for', 'device-uuid', 'user-agent-extra', 'app-vendor' ], function(storeKey) {
      const storeVal = sessionStorage.getItem(storeKey);
      if (storeVal) {
        header[storeKey] = storeVal;
      }
    });

    // send AJAX request, catch success or error callback
    const ajaxRequest = {
      url,
      headers: header,
      data: param,
      type: type.toUpperCase(),
      success: displaySuccess,
      error: displayError,
      // beforeSend: function (xhr) {
      //   xhr.overrideMimeType('text/plain; charset=x-user-defined');
      // },
    };

    $.ajax(ajaxRequest);

    function encode64(inputStr) {
      const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      let outputStr = '';
      let i = 0;

      while (i < inputStr.length) {
        const byte1 = inputStr.charCodeAt(i++) & 0xff;
        const byte2 = inputStr.charCodeAt(i++) & 0xff;
        const byte3 = inputStr.charCodeAt(i++) & 0xff;

        const enc1 = byte1 >> 2;
        const enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);

        var enc3,
          enc4;
        if (isNaN(byte2)) {
          enc3 = enc4 = 64;
        } else {
          enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
          if (isNaN(byte3)) {
            enc4 = 64;
          } else {
            enc4 = byte3 & 63;
          }
        }
        outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
      }
      return outputStr;
    }


    function displaySuccess(data, status, jqXHR) {
      let jsonResponse;
      const contentType = jqXHR.getResponseHeader('content-type') || '';
      const setAccessToken = jqXHR.getResponseHeader('set-access-token');
      if (setAccessToken) {
        sessionStorage.setItem('access-token', setAccessToken);
      }

      if (contentType.indexOf('image/svg+xml') === 0) {
        jsonResponse = '<img src="data:image/svg+xml;base64,' + encode64(jqXHR.responseText) + '">';
      } else {
        try {
          jsonResponse = JSON.parse(jqXHR.responseText);
          jsonResponse = JSON.stringify(jsonResponse, null, 4);
        } catch (e) {
          jsonResponse = data;
        }
      }
      $root.find('.sample-request-response-json').html(jsonResponse);
      refreshScrollSpy();
    }

    function displayError(jqXHR, textStatus, error) {
      let message = 'Error ' + jqXHR.status + ': ' + error;
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(jqXHR.responseText);
        jsonResponse = JSON.stringify(jsonResponse, null, 4);
      } catch (e) {
        jsonResponse = escape(jqXHR.responseText);
      }

      if (jsonResponse) { message += '<br>' + jsonResponse; }

      // flicker on previous error to make clear that there is a new response
      if ($root.find('.sample-request-response').is(':visible')) { $root.find('.sample-request-response').fadeTo(1, 0.1); }

      $root.find('.sample-request-response').fadeTo(250, 1);
      $root.find('.sample-request-response-json').html(message);
      refreshScrollSpy();
    }
  }

  function clearSampleRequest(group, name, version) {
    const $root = $('article[data-group="' + group + '"][data-name="' + name + '"][data-version="' + version + '"]');

    // hide sample response
    $root.find('.sample-request-response-json').html('');
    $root.find('.sample-request-response').hide();

    // reset value of parameters
    $root.find('.sample-request-param').each(function(i, element) {
      element.value = '';
    });

    // restore default URL
    const $urlElement = $root.find('.sample-request-url');
    $urlElement.val($urlElement.prop('defaultValue'));

    refreshScrollSpy();
  }

  function refreshScrollSpy() {
    $('[data-spy="scroll"]').each(function() {
      $(this).scrollspy('refresh');
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /**
   * Exports.
   */
  return {
    initDynamic,
  };

});
