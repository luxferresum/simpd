(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['io'] };
  }

  define('socket.io', [], vendorModule);
})();
