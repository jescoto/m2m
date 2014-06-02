// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#454545');

function isiOS7Plus()
{
	// iOS-specific test
	if (Titanium.Platform.name == 'iPhone OS')
	{
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0],10);

		// Can only test this support on a 3.2+ device
		if (major >= 7)
		{
			return true;
		}
	}
	return false;
}


var iOS7 = isiOS7Plus();
var theTop = iOS7 ? 20 : 0;


if (Titanium.Platform.name == 'iPhone OS') {
	var webview = Titanium.UI.createWebView({
		url:'http://www.frota.info:9090/Testes/meuonibus/',
		top: theTop,
		fullscreen: true
	});
    var window = Titanium.UI.createWindow({
    	navBarHidden: true, 
    	statusBarStyle: Ti.UI.iPhone.StatusBar.OPAQUE_BLACK
    	});
} else {
	var webview = Titanium.UI.createWebView({
		url:'http://www.frota.info:9090/Testes/meuonibus/',
		top: theTop,
		fullscreen: true
	});
    var window = Titanium.UI.createWindow();
}
   
    window.add(webview);
    window.open({modal:true});
    

