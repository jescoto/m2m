package br.com.m2msolutions.meuonibus;

import android.os.Bundle;
import android.os.Vibrator;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.util.Log;
import android.view.View;
import android.view.View.OnLongClickListener;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebStorage;
import android.webkit.WebView;

public class MainActivity extends Activity {

	public static final String DNS = "www.frota.info";
	public static final String IP = "173.224.121.254";
	public static final String APP_URL = "http://"+IP+":9090/Testes/meuonibus/";


	private WebView webView;
	private AlertDialog alerta;
	

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		//this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

		setUpWebView();
		
	}
	

	@Override
	public void onBackPressed() {
		AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);

		builder.setTitle("Fechar aplicação");
		builder.setMessage("Deseja fechar a aplicação?");
		builder.setIcon(R.drawable.ic_launcher);

		builder.setPositiveButton("Sim", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface arg0, int arg1) {
				MainActivity.super.onBackPressed();
			}
		});

		builder.setNegativeButton("Não", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface arg0, int arg1) {
				//
			}
		});

		alerta = builder.create();
		alerta.show();

		Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
		v.vibrate(100);
	}

	@Override
	protected void onDestroy() {
		webView.destroy();
		super.onDestroy();
	}

	@SuppressWarnings("deprecation")
	@SuppressLint("SetJavaScriptEnabled")
	private void setUpWebView() {
		// TODO Auto-generated method stub
		webView = (WebView) findViewById(R.id.webView1);
		try {
			webView.getSettings().setJavaScriptEnabled(true);
			
			webView.setWebChromeClient(new WebChromeClient() {
				  public void onConsoleMessage(String message, int lineNumber, String sourceID) {
				    Log.d("WebConsole", message + " -- From line "
				                         + lineNumber + " of "
				                         + sourceID);
				  }
				  
				  public void onExceededDatabaseQuota(String url, String databaseIdentifier, long currentQuota, long estimatedSize, long totalUsedQuota, WebStorage.QuotaUpdater quotaUpdater) { 
					  quotaUpdater.updateQuota(5 * 1024 * 1024); 
				  } 
				  
			});
			
			// webView.setId(WEB_ID);
			// Wait for the page to load then send the location information
			// webView.setWebViewClient(new WebViewClient());
			// webView.addJavascriptInterface(new InterfaceJS(webView, this), "Device");
			WebSettings settings = webView.getSettings(); 
			settings.setDatabaseEnabled(true); 
			String databasePath = this.getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath(); 
			settings.setDatabasePath(databasePath);
			settings.setDomStorageEnabled(true);
			
			webView.setOnLongClickListener(new OnLongClickListener() {
				public boolean onLongClick(View v) {
					return true;
				}
			});

			// webView.setLongClickable(false);
			webView.setVerticalScrollBarEnabled(false);

			webView.loadUrl(APP_URL);

		} catch (Exception e) {

			Log.e("webView", e.getMessage());

		}
	}


}
