function switchLanguage(_lang) {
	// Source the proper translation table (i18n) based on lang
	var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
	switch (_lang) {
		case 'es':
			script.src = 'js/es.js';
			break;
		case 'fr':
			script.src = 'js/fr.js';
			break;
		case 'it':
			script.src = 'js/it.js';
			break;
		case 'ja':
			script.src = 'js/ja.js';
			break;
		case 'hu':
			script.src = 'js/hu.js';
			break;
		case 'hi':
			script.src = 'js/hi.js';
			break;
		case 'pt':
		case 'pt-BR':
		case 'pt-PT':
			script.src = 'js/pt.js';
			break;
		case 'zh':
		case 'zh-CN':
			script.src = 'js/zh-CN.js';
			break;
		case 'cz':
			script.src = 'js/cz.js';
			break;
		default:
			script.src = 'js/en-US.js';
	}
	document.head.appendChild(script);
}

var browserLang = navigator.language; 						// detect browser language
var userLang = window.localStorage.getItem('language');		// detect language preference saved in the browser's localStorage
var lang = userLang ? userLang : browserLang;				// lang is also used in index.html to set the dropdown box value.
switchLanguage(lang);										// select the proper translation table i18n variable
															// lang is also used by index.html to set the dropdown box value.
