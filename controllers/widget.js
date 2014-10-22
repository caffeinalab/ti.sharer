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
			e.source.title = L('link_copied', 'Link copied!');
		},
		args: {
			borderColor: '#fff',
			title: L('copy_link', 'Copy link')
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

function getDriverRow(name) {
	if (drivers[name] == null) {
		throw new Error(WNAME+': No share system found with name ' + name);
	}

	var $row = Ti.UI.createTableViewRow({ driver: name });
	$row.add( Widget.createController('button', drivers[name].args).getView() );
	return $row;
}

function setDrivers(drivers) {
	$.sharer_Cont.data = _.map(drivers, getDriverRow);
}

/*
UI Listeners
*/

$.sharer_Cont.addEventListener('click', function(e) {
	if (e.rowData.driver == null) return;
	drivers[e.rowData.driver].callback({
		shareObj: shareObj,
		source: e.source
	});
});


$.sharer_Close.addEventListener('click', function() {
	exports.hide();
});

if (OS_ANDROID) {
	$.sharer_Win.addEventListener('open', function(e){
		$.sharer_Win.activity.actionBar.hide();
	});
}

exports.show = function(so, opt) {
	if (so == null) {
		throw new Error('Please set a sharing object');
	}

	shareObj = _.clone(so);
	opt = parseArgs(opt);

	setDrivers(opt.drivers);
	$.sharer_Win.open();
};

exports.hide = function() {
	$.sharer_Win.close();
};
