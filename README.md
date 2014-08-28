# jQuery Legacy Ajax

Enable posting form data including files asynchronously in legacy IE browsers without any Flash

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/toruta39/jquery-jquery-legacy-ajax/master/dist/jquery.jquery-legacy-ajax.min.js
[max]: https://raw.github.com/toruta39/jquery-jquery-legacy-ajax/master/dist/jquery.jquery-legacy-ajax.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery-legacy-ajax.min.js"></script>
<script>
jQuery(function($) {
  $.legacyAjax({
    url: '/path/to/your/api'
    data: {
      imagefile: $('#image-file-input'), // file selected in the input will be uploaded
      imagename: $('#image-name-input').val() // primitive value can be passed as usual
    }
  }).then(function(res) {
    console.log(res);
  }, function(err) {
    console.log(err.responseText);
  });
});
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
