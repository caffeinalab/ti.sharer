var WNAME = 'com.caffeinalab.titanium.sharer';
if (Alloy.Globals.Trimethyl == null) {
	Ti.API.warn(WNAME + ': This widget require Trimethyl to be installed (https://github.com/CaffeinaLab/Trimethyl)');
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
			borderWidth: 0,
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
			borderWidth: 0,
		}
	},
	whatsapp: {
		callback: function(e) {
			require('T/sharer').whatsapp(e.shareObj);
		},
		args: {
			title: ' Whatsapp',
			image: WPATH('images/whatsapp.png'),
			backgroundColor: '#45C856',
			borderWidth: 0,
		}
	},
	email: {
		callback: function(e) {
			require('T/sharer').email(e.shareObj);
		},
		args: {
			title: ' Email',
			image: WPATH('images/email.png'),
			borderColor: '#fff',
		}
	},
	message: {
		callback: function(e) {
			require('T/sharer').message(e.shareObj);
		},
		args: {
			title: ' ' + L('message', 'Message'),
			image: WPATH('images/message.png'),
			borderColor: '#fff',
		}
	},
	copytoclipboard: {
		callback: function(e) {
			Ti.UI.Clipboard.setText(e.shareObj.url);
			e.source.title = ' ' + L('link_copied', 'Link copied!');
		},
		args: {
			title: ' ' + L('copy_link', 'Copy link'),
			image: WPATH('images/copytoclipboard.png'),
			borderColor: '#fff'
		}
	},
};


/*
Pragma private
*/

function setDriversRowUI(driversNamesArray) {
	var data = [];
	_.each(driversNamesArray, function(name) {
		if (drivers[name] == null) {
			Ti.API.error(WNAME+': No share system found with name ' + name);
			return;
		}

		var $row = Ti.UI.createTableViewRow({
			driver: name,
			selectedBackgroundColor: 'transparent',
		 });
		$row.add( Widget.createController('button', drivers[name].args).getView() );
		data.push($row);
	});
	$.sharer_Cont.data = data;
}


/*
Pragma public
*/

exports.setDriver = function(name, def) {
	drivers[name] = def;
};

exports.extendDriverArgs = function(name, newArgs) {
	_.extend(drivers[name].args, newArgs);
};

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
	$.sharer_Win.addEventListener('open', function(){
		$.sharer_Win.activity.actionBar.hide();
	});
}


/**
 * @method show
 * Shared object
 * @param  {Object} so
 * @param  {Array} where
 */
exports.show = function(so, where) {
	if (so == null) throw new Error('Please set a sharing object');

	setDriversRowUI(where || [ 'facebook', 'twitter', 'whatsapp', 'email', 'message', 'copytoclipboard' ]);
	shareObj = so;

	$.sharer_Win.opacity = 0;
	$.sharer_Win.open();
	$.sharer_Win.animate({ opacity: 1 });
};

/**
 * @method hide
 * @return {[type]} [description]
 */
exports.hide = function() {
	$.sharer_Win.close();
};
