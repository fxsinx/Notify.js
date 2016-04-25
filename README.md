# Notify.js

Notify.js is a JavaScript plugin for better Publish/subscribe programming by using match rules.

It is written in ECMAScript 6 and can be transpiled to ES 5 code for most browsers and environments.

## Usage

For most of the case you may include the library by:

```javascript
var Notify = require('./notify.js');
```
```html
<script src="./notify.js" charset="utf-8" type="text/javascript"></script>
```

Replace `notify.js` with `./dist/es5-notify.js` if you want it to be ES5 compatible.

The plugin provides you basic and easy-to-use APIs for you to manage all the notifications.

### Register

You can register a notification by:

```javascript
const notifyID = Notify.on('foo', function(note){
    // ... deal with the notification
});
```
You'll supposed to get an unique Notify ID (String), which can be used to cancel the notification.

You can register notifications with `*`, which means matching any notifications:

```javascript
const notifyID = Notify.on('*', function(note){
    // Any expression will trigger this one
});
```

or specify the path with `*`:

```javascript
const notifyID = Notify.on('foo/*', function(note){
    /* Responsive to:
    `foo/bar`
    `foo/woo`
    `foo/hoo`
    `foo/bar/woo`

    Not responsive to:
    `foo`
    `bar`
    `foo/`
    */
});
```

```javascript
const notifyID = Notify.on('foo/*/*', function(note){
    /* Responsive to:
    `foo/bar/woo`
    `foo/woo/bar/ABC`

    Not responsive to:
    `foo`
    `foo/bar`
    `foo/bar/`
    */
});
```

**Note**: `*` matches everything.

**Note**: Leading and trailing `/` will be ignored.

### Unsubscribe

It's easy to unsubscribe notification as long as you've got the Notify ID.

```javascript
let boolr = Notify.off(notifyID);
```

`boolr` can be `true` or `false`, indicating whether the operation is successful or not.

### Post notification

It's easy to post/trigger a notification:

```javascript
Notify.trigger('foo/bar', target, data);
```

The following rules will be applied when posting an notification:

> `foo` triggers `foo`, `f*`, `*`

> `foo/bar` triggers `foo`, `foo/bar`, `foo/*`, `foo/b*`, `*`

> `foo/bar` **DOES NOT** trigger `foo/woo`, `foo/bar*`, `Foo/Bar`

> `foo/bar/woo` triggers `foo`, `foo/bar`, `foo/bar/woo`, `foo/bar/*`, `foo/*/*`, `*/*/*`, `foo/bar/*`, `foo/*`, `f*`, `*`

**Note**: Your trigger expression cannot contain `*`, which can be misleading.

### Deal with data

Once you have passed extra parameters to `Notify.trigger`, they will be send to the function that is to be triggered:

```javascript
const deal = function(note){
    console.log(note.target); // the target
    console.log(note.data); // the data that passed in
    console.log(note.expression); // current expression of itself that applied
    console.log(note.actualExpression); // the trigger expression
};

const notifyID = Notify.on('foo/*', deal);

Notify.trigger('foo'); // Will not trigger `deal`
Notify.trigger('foo/bar', target, data); // Triggering `deal`

Notify.off(notifyID); // Unsubscribe

Notify.trigger('foo/bar'); // Will not trigger `deal`
```

### Clear all registered notifications

You can remove all registered notifications by calling:

```javascript
Notify.clearAll();
```
