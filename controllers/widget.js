var args = arguments[0] || {};
args = _.extend({
	where: ['facebook','twitter','mail','sms','whatsapp','googleplus']
}, args);

var shareObj = null;
var Sharer = require('T/sharer');

var shareSystems = {

	facebook: {
		icon: WPATH('images/facebook.png'),
		background: '#3b5998',
		callback: Sharer.facebook
	},

	twitter: {
		icon: WPATH('images/twitter.png'),
		background: '#55acee',
		callback: Sharer.twitter
	},

	mail: {
		icon: WPATH('images/mail.png'),
		background: '#3C68E1',
		callback: Sharer.mail
	},

	sms: {
		icon: WPATH('images/messages.png'),
		background: '#46E825',
		callback: Sharer.sms
	},

	whatsapp: {
		icon: WPATH('images/whatsapp.png'),
		background: '#34af23',
		callback: Sharer.whatsapp
	},

	googleplus: {
		icon: WPATH('images/gplus.png'),
		background: '#dd4b39',
		callback: Sharer.googleplus
	},

	other: {
		callback: Sharer.multi,
		proxyObject: 'Button',
		proxyProperties: {
			width: Ti.UI.FILL,
			height: 50,
			title: L('Others'),
			color: '#555',
			font: { fontSize: 18 }
		}
	}

};
exports.shareSystems = shareSystems;

function genShareButton(def) {
	var $ui = Ti.UI[ 'create' + (def.proxyObject?def.proxyObject:'View') ](_.extend({
		borderColor: '#eee',
		width: Alloy.Globals.SCREEN_WIDTH/3,
		height: Alloy.Globals.SCREEN_WIDTH/3,
		callback: def.callback,
		icon: !!def.icon,
		onBackground: def.background
	}, def.proxyProperties || {}));

	if (def.icon) {
		$ui.add(Ti.UI.createImageView({
			touchEnabled: false,
			baseImage: def.icon,
			image: def.icon.replace(/(\.\w+)$/,"_0$1")
		}));
	}

	return $ui;
}

function enableShareSystems(where) {
	// Reset children
	_.each($.cfnSharerView.children||[], function($c){
		$.cfnSharerView.remove($c);
	});

	// add the buttons
	_.each(where, function(ss) {
		if (_.isString(ss)) {
			$.cfnSharerView.add(genShareButton(shareSystems[ss]));
		} else if (_.isObject(ss)) {
			$.cfnSharerView.add(genShareButton(ss));
		}
	});
}


// Show this view
function show(_shareObj, opt) {
	shareObj = _shareObj;
	opt = _.extend(args, opt || {});

	//enable the buttons
	if (_.isString(opt.where)) opt.where = opt.where.split(',');
	enableShareSystems(opt.where);

	// preset to animate on open
	$.cfnSharerView.bottom = -300;
	$.cfnSharerWin.opacity = 0;
	$.cfnSharerWin.open();
}
exports.show = show;

function hide() {
	$.cfnSharerView.animate({ bottom: -300, duration: 200 }, function() {
		$.cfnSharerWin.animate({ opacity: 0 }, function(){
			$.cfnSharerWin.close();
		});
	});
}
exports.hide = hide;


/*
Listeners
*/

$.cfnSharerWin.addEventListener('open', function(e){
	$.cfnSharerWin.animate({ opacity: 1 });
	$.cfnSharerView.animate({ bottom: 0, duration: 200 });
});

$.cfnSharerWin.addEventListener('touchstart', function(e){
	if (!e.source.icon) return;
	e.source.children[0].image = e.source.children[0].baseImage.replace(/(\.\w+)$/,"_1$1");
	e.source.backgroundColor = e.source.onBackground;
});

$.cfnSharerWin.addEventListener('touchend', function(e){
	if (!e.source.icon) return;
	e.source.children[0].image = e.source.children[0].baseImage.replace(/(\.\w+)$/,"_0$1");
	e.source.backgroundColor = "#fff";
});

$.cfnSharerWin.addEventListener('click', function(e){
	if (undefined===e.source.callback) {
		hide();
	} else {
		e.source.callback(shareObj);
	}
});