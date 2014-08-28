/*
 * jquery-legacy-ajax
 *
 *
 * Copyright (c) 2014 Joshua Zhang
 * Licensed under the MIT license.
 */

(function ($) {

  $.legacyAjax = function(opt) {
    opt = $.extend({}, $.legacyAjax.defaultOpt, opt);
    opt._uid = Math.floor(Math.random() * 90000) + 10000;

    var d = $.Deferred();

    var form = $.legacyAjax.appendFormToBody(opt);
    var iframe = $.legacyAjax.appendIFrameToBody(opt);

    iframe.on('load', function() {
      var href = this.contentWindow.location.href;
      var res;

      if (!href || href === 'about:blank') { return; }

      try {
        res = JSON.parse(this.contentWindow.document.body.innerHTML);
      } catch (_error) {
        d.reject({
          responseText: this.contentWindow.document.body.innerHTML
        });
        return;
      }

      d.resolve(res);

      iframe.remove();
    });

    setTimeout(function() {
      form.submit();

      form.children().each(function() {
        var releaseSelf = $(this).data('releaseSelf');
        if (releaseSelf) { releaseSelf($(this)); }
      });

      form.remove();
    }, 100);

    return d.promise();
  };

  $.legacyAjax.defaultOpt = {
    type: 'POST',
    contentType: 'multipart/form-data',
    url: '',
    data: {}
  };

  $.legacyAjax.appendFormToBody = function(opt) {
    var key, val;

    var data = opt.data;

    var form = $('<form>').attr({
      enctype: opt.contentType,
      method: opt.type,
      action: opt.url,
      target: 'ajax' + opt._uid
    }).css({
      width: 0,
      height: 0,
      visiblility: 'hidden',
      overflow: 'hidden'
    });

    var inputs = $('');
    for (key in data) {
      val = data[key];
      inputs = inputs.add(this.dataToInput(val, key));
    }

    return form.append(inputs).appendTo('body');
  };

  $.legacyAjax.appendIFrameToBody = function(opt) {
    var iframe = $('<iframe>').attr({
      name: 'ajax' + opt._uid
    }).css({
      width: 0,
      height: 0,
      visiblility: 'hidden',
      overflow: 'hidden'
    });

    return iframe.appendTo('body');
  };

  $.legacyAjax.dataToInput = function(val, key) {
    switch (true) {
      case $.isArray(val):
        return this.arrayToInputs(val, key);
      case $.isPlainObject(val):
        return this.objectToInputs(val, key);
      case (val instanceof $):
        return this.inputToInput(val, key);
      default:
        return $('<input>').attr({type: 'text', name: key}).val(val);
    }
  };

  $.legacyAjax.arrayToInputs = function(arr, key) {
    var input, val;

    var inputs = $('');
    for (var i = 0, l = arr.length; i < l; i++) {
      val = arr[i];
      input = this.dataToInput(val, key + '[]');
      inputs = inputs.add(input);
    }

    return inputs;
  };

  $.legacyAjax.objectToInputs = function(obj, key) {
    var input, subkey, val;

    var inputs = $('');
    for (subkey in obj) {
      val = obj[subkey];
      input = this.dataToInput(val, key + '[' + subkey + ']');
      inputs = inputs.add(input);
    }

    return inputs;
  };

  $.legacyAjax.inputToInput = function(input, key) {
    var spanPlaceholder = $('<span>').insertBefore(input);

    return input.data({
      prevName: input.attr('name'),
      spanPlaceholder: spanPlaceholder,
      releaseSelf: this.releaseInput
    }).attr({
      name: key
    });
  };

  $.legacyAjax.releaseInput = function(input) {
    var spanPlaceholder = input.data('spanPlaceholder');
    var prevName = input.data('prevName');

    input.insertAfter(spanPlaceholder).attr({
      name: prevName
    }).data({
      prevName: void 0,
      spanPlaceholder: void 0,
      releaseSelf: void 0
    });
  };

}(jQuery));
