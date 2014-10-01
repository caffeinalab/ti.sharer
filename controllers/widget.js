var WNAME = 'com.caffeinalab.titanium.sharer';

if (Ti.Trimethyl == null) {
	Ti.API.warn(WNAME+': This widget require Trimethyl to be installed (https://github.com/CaffeinaLab/Trimethyl)');
}

var shareObj = null;

var drivers = {

	facebook: {
		callback: function(e) {
			require('T/sharer').facebook(e.shareObj);
		},
		args: {
			title: '  Facebook',
			image: WPATH('images/facebook.png'),
			backgroundColor: '#3b5998',
			borderWidth: 0.5,
			borderColor: '#2B406E'
		}
	},
	twitter: {
		callback: function(e) {
			require('T/sharer').twitter(e.shareObj);
		},
		args: {
			title: '  Twitter',
			image: WPATH('images/twitter.png'),
			backgroundColor: '#55acee',
			borderWidth: 0.5,
			borderColor: '#147AC8'
		}
	},
	googleplus: {
		callback: function(e) {
			require('T/sharer').googleplus(e.shareObj);
		},
		args: {
			title: '  Google+',
			image: WPATH('images/googleplus.png'),
			backgroundColor: '#dd4b39',
			borderWidth: 0.5,
			borderColor: '#AE2E1E'
		}
	},
	whatsapp: {
		callback: function(e) {
			require('T/sharer').whatsapp(e.shareObj);
		},
		args: {
			title: 'Whatsapp',
			borderColor: '#fff',
		}
	},
	email: {
		callback: function(e) {
			require('T/sharer').email(e.shareObj);
		},
		args: {
			borderColor: '#fff',
			title: 'Email',
		}
	},
	sms: {
		callback: function(e) {
			require('T/sharer').sms(e.shareObj);
		},
		args: {
			borderColor: '#fff',
			title: 'SMS'
		}
	},
	copytoclipboard: {
		callback: function(e) {
			Ti.UI.Clipboard.setText(e.shareObj.url);
			e.source.titleid = L('Link copied!');
		},
		args: {
			borderColor: '#fff',
			titleid: L('Copy link')
		}
	},

};

exports.setDriver = function(name, def) {
	drivers[name] = def;
};

var args = _.defaults(arguments[0] || {}, {
	blur: true,
	drivers: [
		'facebook',
		'twitter',
		'googleplus',
		'whatsapp',
		'email',
		'sms',
		'copytoclipboard'
	]
});

function parseArgs(opt) {
	var r = _.extend({}, args, opt);
	if (_.isString(r.drivers)) {
		r.drivers = opt.drivers.split(',');
	}
	return r;
}

function enableDriver(name) {
	if (drivers[name] == null) {
		Ti.API.error(WNAME+': No share system found with name ' + name);
		return;
	}

	var cArgs = drivers[name].args;
	cArgs.name = name;

	$.sharer_Cont.add(Widget.createController('button', cArgs).getView());
}

function setDrivers(drivers) {
	_.each($.sharer_Cont.children || [], function($c) {
		$.sharer_Cont.remove($c);
	});
	_.each(drivers, enableDriver);
}

/*
UI Listeners
*/

$.sharer_Cont.addEventListener('click', function(e) {
	if (e.source.name == null) return;

	drivers[e.source.name].callback({
		shareObj: shareObj,
		source: e.source
	});
});


$.sharer_Close.addEventListener('click', function() {
	exports.hide();
});


exports.show = function(so, opt) {
	if (so == null) {
		throw new Error('Please set a sharing object');
	}

	shareObj = _.clone(so);
	opt = parseArgs(opt);

	// Add the buttons
	setDrivers(opt.drivers);

	if (args.blur === true) {
		Ti.Media.takeScreenshot(function(e){
			try {
				var Blur = require('bencoding.blur');
				$.blurView.add(Blur.createGPUBlurImageView({
					height: Ti.UI.FILL,
					width: Ti.UI.FILL,
					image: e.media,
					blur: {
						type: Blur.GAUSSIAN_BLUR,
						radiusInPixels: 30
					}
				}));
				$.blurView.animate({ opacity: 1 });
			} catch (err) {}
		});
	}

	// Open the window
	$.sharer_Win.open();

};


exports.hide = function() {
	$.sharer_Win.close();
};
