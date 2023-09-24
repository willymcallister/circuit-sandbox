function switchLanguage(_lang) {
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
		default:
			script.src = 'js/en-US.js';
	}
	document.head.appendChild(script);
}

var browserLang = navigator.language; 						// detect browser language
var userLang = window.localStorage.getItem('language');		// detect saved language preference
var lang = userLang ? userLang : browserLang;
switchLanguage(lang);
