var i18n = {
error1: 'क्षमा करें, योजनाबद्ध टूल को शुरू करने में एक ब्राउज़र त्रुटि थी। हम फ़ायरफ़ॉक्स और क्रोम के नवीनतम संस्करणों का उपयोग करने की सलाह देते हैं',
Ground_connection: 'जमीनी कनेक्शन',
Node_label: 'नोड लेबल',
Voltage_source: 'वोल्टेज स्रोत',
Current_source: 'विद्युत धारा स्रोत',
Resistor: 'प्रतिरोधक',
Capacitor: 'संधारित्र',
Inductor: 'प्रेरक',
Op_Amp: 'आपरेशनल एम्पलीफायर',
Diode: 'डायोड',
NFet: 'ऐनफेट',
PFet: 'पीफेट',
NPN: 'ऐनपीऐन',
PNP: 'पीऐनपी',
Voltage_probe: 'वोल्टेज की जांच',
Current_probe: 'विद्युत धारा जांच',
drag_onto_diagram: ': डालने के लिए खींचें या टैप करें',
Help: 'सहायता: सहायता पृष्ठ प्रदर्शित करें',
Grid: 'ग्रिड: ग्रिड प्रदर्शन टॉगल करें',
Link_tip: 'लिंक: सर्किट का लिंक साझा करें',
Cut: 'चयनित घटकों को क्लिपबोर्ड पर काटें',
Copy:'चयनित घटकों को क्लिपबोर्ड पर कॉपी करें',
Paste:'योजनाबद्ध के लिए क्लिपबोर्ड पेस्ट करें',
Delete:'चयनित घटकों को हटाएं',
Rotate:'चयनित घटक को घुमाएं',
Save_netlist: 'नेटलिस्ट बचाओ',
Open_netlist: 'नेटलिस्ट खोलें',
Select_netlist: 'नेटलिस्ट का चयन करें',
Perform_DC_Analysis: 'एक डीसी विश्लेषण करें',
DC_Analysis: 'डीसी विश्लेषण',
Perform_AC_Analysis: 'एक एसी लघु-संकेत विश्लेषण करें',
Perform_Transient_Analysis: 'एक क्षणिक विश्लेषण करें',
Transient_Analysis: 'क्षणिक विश्लेषण',
Edit_Properties: 'गुण संपादित करें',
Link: 'संपर्क',
Sharable_Link: 'साझा करने योग्य लिंक',

points_per_decade: 'अंकों की संख्या / दशक',
Starting_frequency: 'प्रारंभ आवृत्ति (हर्ट्ज)',
Ending_frequency: 'समाप्ति की आवृत्ति (हर्ट्ज)',	
source_for_ac: 'एसी के लिए वी या वी स्रोत का नाम',
AC_Analysis_add_a_voltage_probe: 'एसी विश्लेषण: आरेख में एक वोल्टेज जांच जोड़ें!',
AC_Analysis: 'एसी विश्लेषण',
Zero_ac_response: 'शून्य एसी प्रतिक्रिया, -Bf पैमाने पर dB पैमाने पर।',
Near_zero_ac_response: 'शून्य एसी प्रतिक्रिया के पास, निकालें ',
probe: ' जांच',

// Alerts and warnings from the circuit simulator
Alert: 'चेतावनी',
ckt_alert1: 'चेतावनी! सर्किट में एक वोल्टेज स्रोत लूप या एक तार से छोटा एक स्रोत या विद्युत धारा जांच है, कृपया स्रोत या तार को हटा दें जिससे शॉर्ट हो।',
ckt_alert2: 'चेतावनी! सिम्युलेटर अर्थहीन परिणाम या अवैध सर्किट के साथ कोई परिणाम नहीं दे सकता है',
ckt_warning1: 'चेतावनी! दो सर्किट तत्व एक ही नाम साझा करते हैं। ',
ckt_alert3: 'कृपया जमीन (त्रिभुज प्रतीक) से कम से कम एक संबंध बनाएं।',
ckt_alert4: 'न्यूटन विधि विफल; क्या आपके विद्युत धारा स्रोतों में जमीन तक प्रवाहकीय पथ है?',
ckt_alert5: 'न्यूटन विधि विफल; यह आपका सर्किट हो सकता है या यह हमारा सिम्युलेटर हो सकता है।',
ckt_alert6: 'डीसी विफल रहा, शून्य से क्षणिक विश्लेषण की कोशिश कर रहा है।',
ckt_alert7: 'एसी विश्लेषण अज्ञात स्रोत को संदर्भित करता है ',
ckt_alert8: 'एसी विश्लेषण विफल, अज्ञात स्रोत',	

ckt_error1: 'Rows of M mismatched to b or cols mismatch to x.',
ckt_error2: 'Row or columns of A too large for B',
ckt_error3: 'Row or columns of A too large for C',
ckt_error4: 'scalea and scaleb must be scalars or Arrays',
ckt_error5: 'Rows or cols > rows or cols of dest',
ckt_error6: 'Rows or cols > cols or rows of dest',	    	    

log_Frequency: 'लॉग (Hz में फ़्रिक्वेंसी)',
degrees: 'डिग्री',
AC_Phase: 'एसी चरण',
AC_Magnitude: 'एसी परिमाण',

Minimum_number_of_timepoints: 'न्यूनतम समय बिंदु',
Stop_time_seconds: 'बंद करो समय (सेकंड)',
tstop_lbl: 'रुकने का समय',
Transient_Analysis_add_a_probe: 'क्षणिक विश्लेषण: आरेख में एक जांच जोड़ें!',

//Use creative phrasing to get this sentence to come out right: 
// alert('The ' + color + ' probe is connected to node ' + '"' + label + '"' + ', which is not an actual circuit node');
The: '',
probe_is_connected_to_node: ' जांच नोड से जुड़ी है ',
which_is_not_an_actual_circuit_node: ', जो एक वास्तविक सर्किट नोड नहीं है',

Voltage: 'वोल्टेज',
Current: 'विद्युत धारा',
Time: 'समय',
Node_has_two_conflicting_labels: 'नोड के दो परस्पर विरोधी लेबल हैं: ',

DC_value: 'डीसी मूल्य',

impulse: 'आवेग',
Height: 'ऊंचाई',
Width: 'चौड़ाई (सेकंड)',

step: 'कदम',
Initial_value: 'प्रारंभिक मूल्य',
Plateau_value: 'पठार का मूल्य',
Delay_until_step: 'कदम तक देरी (सेकंड)',
Rise_time: 'उदय समय (सेकंड)',

square: 'वर्ग',
Frequency: 'फ्रीक्वेंसी (हर्ट्ज)',
Duty_cycle: 'साइकिल शुल्क (%)',

triangle: 'त्रिकोण',

pwl: 'पीडब्लूऐल',
pwl_repeating: 'पीडब्लूऐल(दोहरा)',
Comma_separated_list: 'वैकल्पिक समय और मूल्यों की कोमा-अलग सूची',

pulse: 'पल्स',
Delay_until_pulse: 'पल्स तक देरी (सेकंड)',
Time_for_first_transition: 'पहले संक्रमण के लिए समय (सेकंड)',
Time_for_second_transition: 'दूसरे संक्रमण के लिए समय (सेकंड)',
Pulse_width: 'पल्स चौड़ाई (सेकंड)',
Period: 'अवधि (सेकंड)',

sin: 'साइन',
Offset_value: 'ऑफसेट मान',
Amplitude: 'आयाम',
Delay_until_sin_starts: 'विलंब जब तक साइन शुरू होता है (सेकंड)',
Phase_offset_degrees: 'चरण ऑफसेट (डिग्री)',

Circuit_Sandbox_Help: 'सर्किट सैंडबॉक्स की मदद',
name: 'नाम',
value: 'मूल्य',
label: 'लेबल',
r: 'आर',
c: 'सी',
l: 'एल',
color: 'रंग',
offset: 'ओफ़्सेट',
area: 'क्षेत्र',
type: 'प्रकार',
normal: 'साधारण',
ideal: 'आदर्श',
WL: 'डब्ल्यू / एल',
A: 'ए',
Plot_color: 'प्लॉट का रंग',
Plot_offset: 'प्लॉट ऑफसेट',
dc: 'डीसी',

Gain: 'A',
Rin: 'Rin',
Rout: 'Rout',

red: 'लाल',
green: 'हरा',
blue: 'नीला',
cyan: 'हरिनील',
magenta: 'मैजेंटा',
yellow: 'पीला',
orange: 'नारंगी',
black: 'काला',
xaxis: 'एक्स अक्ष',

Ics: 'Ics',
Ies: 'Ies',
alphaF: '\u03B1एफ',
alphaR: '\u03B1आर',
last_line: 'last line, no comma'
};

var strSHelp = "सर्किट सैंडबॉक्स की मदद\n\n";		//embedded Help 
var strAddC = "घटक जोड़ें: भागों बिन में एक भाग पर टैप करें, फिर योजनाबद्ध पर टैप करें।\n\n";
var strAddW = "तार जोड़ें: शुरू करने के लिए एक कनेक्शन बिंदु (खुले सर्कल) पर स्पर्श करें। खींचना। छोड़ें।\n\n";
var strSel  = "चयन करें: घटकों का चयन करने के लिए एक आयत खींचें। \n(डेस्कटॉप :) किसी अन्य घटक को शामिल करने के लिए Shift-क्लिक करें।\n\n";
var strMove = "चाल: स्पर्श करें और एक नए स्थान पर खींचें\n\n";
var strDel  = "हटाएं: चयन करने के लिए टैप करें, फिर एक्स आइकन टैप करें या बैकस्पेस को हिट करें।\n\n";
var strRot  = "घुमाएँ / प्रतिबिंबित करें: चयन करने के लिए क्लिक करें, फिर रोटेशन आइकन पर क्लिक करें या पत्र \"r\" को 90 को घुमाएं। अधिक घुमाव और प्रतिबिंब (8 कुल) के लिए दोहराएं।\n\n";
var strProp = "गुण: इसके गुणों को बदलने के लिए एक घटक पर डबल टैप करें।\n\n";
var strNum  = "इंजीनियरिंग नोटेशन का उपयोग करके नंबर दर्ज किए जा सकते हैं,\n\
T = 10^12, G = 10^9, M = 10^6, k = 10^3\n\
m = 10^-3, u = 10^-6, n = 10^-9, p = 10^-12, f = 10^-15";
