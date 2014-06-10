package br.com.m2msolutions.meuonibus;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Vibrator;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;


public class InterfaceJS {
	
	private WebView webview;
	public MainActivity activity;
	public AlertDialog alerta;
	

	public InterfaceJS(WebView webview, MainActivity activity){
		this.webview = webview;
		this.activity = activity;
	}
	
	
	@JavascriptInterface
	public void exitAlert(){
		AlertDialog.Builder builder = new AlertDialog.Builder(activity);

		builder.setTitle("Fechar aplicação");
		builder.setMessage("Deseja fechar a aplicação?");
		builder.setIcon(R.drawable.ic_launcher);
		
		
		
		builder.setPositiveButton("Sim", new DialogInterface.OnClickListener() {
			
			public void onClick(DialogInterface arg0, int arg1) {
				activity.finish();
			}
		});

		builder.setNegativeButton("Não", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface arg0, int arg1) {
				//
			}
		});

		alerta = builder.create();
		alerta.show();

		Vibrator v = (Vibrator) activity.getSystemService(Context.VIBRATOR_SERVICE);
		v.vibrate(100);
	}
	
	
	@JavascriptInterface
	public void Log(){
		android.util.Log.v("InterfaceJS", "Teste na Interface");
	}

	
}