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
var Sharer = Alloy.createWidget('com.caffeinalab.titanium.sharer', { /* opt */ });
Sharer.show({
	url: 'http://google.it',
	text: "Your awesome message!"
});
```

## Constructor options

#### `blur` (Boolean, default: `true`)

*This option will be available on 3.4.0 GA.*

Blur the window.

#### `drivers` (String/Array, default: ALL)

Set the global enabled drivers.
With an array `[ 'facebook', 'twitter', 'sms' ]` or a comma-separated String `facebook,twitter,sms`.

## API

#### `show(so, [opt]) `

The `so` object represents a `Trimethyl.share` argument.

* `url`: The link to share
* `text`: The personal share message to use, when supported by driver.
* `image`: The image to share. Can be a URL or `Ti.Blob`.

The `opt` are merged right with the `Constructor options`.

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
