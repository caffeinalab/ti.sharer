# Ti.Sharer

### com.caffeinalab.titanium.sharer

A simple **Sharing** widget heavy inspired to **AirBnb**, with default drivers and the ability to add custom drivers to share.

The widget use [Trimethyl.Share](https://github.com/CaffeinaLab/Trimethyl), so you **must** install Trimethyl to use it, or define your own custom drivers.

![](http://cl.ly/image/0i092a3w2L1H/687474703a2f2f662e636c2e6c792f6974656d732f3365306e337132723059316f31673372334b30432f494d475f313138342e504e47_iphone5c_yellow_portrait.png)

## Installation

#### Via Gittio

```
gittio install com.caffeinalab.titanium.sharer
```

#### Via Github

Download the latest release, unzip in `app/widgets` and add in your *config.json*, under `dependencies`:

```json
"dependencies": {
    "com.caffeinalab.titanium.sharer": "*"
}
```

## Usage

```javascript
var Sharer = Alloy.createWidget('com.caffeinalab.titanium.sharer');
Sharer.show({
	url: 'http://google.it',
	text: "Your awesome message!"
});
```

## API

#### `show(so, [where]) `

The `so` object represents a `Trimethyl.share` argument.

* `url`: The link to share
* `text`: The personal share message to use, when supported by driver.
* `image`: The image to share. Can be a URL or `Ti.Blob`.

`where` is an Array of Strings of enabled drivers.

#### `hide()`

Close the mask.

#### `setDriver(name, def)`

Add/replace a driver definition.

A **driver definition** is in this form

```javascript
{
	callback: function(e) { }, // The callback invoked on click (`e.source` represents the Button`
	args: {} // The property passed to the button
}
```

An example:

```javascript
copytoclipboard: {
	callback: function(e) {
		Ti.UI.Clipboard.setText(e.shareObj.url);
		e.source.titleid = L('Link copied!');
	},
	args: {
		borderColor: '#fff',
		titleid: L('Copy link')
	}
}
```

### `extendDriverArgs(name, args)`

Extend a driver only at UI level.
