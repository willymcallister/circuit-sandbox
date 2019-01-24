var i18n = {
error1: 'Sorry, there a browser error in starting the schematic tool.  We recommend using the latest versions of Firefox and Chrome.',
Ground_connection: 'जमीनी कनेक्शन',
Node_label: 'नोड लेबल',
Voltage_source: 'वोल्टेज स्रोत',
Current_source: 'वर्तमान स्रोत',
Resistor: 'रोकनेवाला',
Capacitor: 'संधारित्र',
Inductor: 'प्रारंभ करनेवाला',
Op_Amp: 'ऑपरेशनल एंप्लीफायर',
Diode: 'डायोड',
NFet: 'NFet',
PFet: 'PFet',
Voltage_probe: 'वोल्टेज जांच',
Current_probe: 'वर्तमान जांच',
drag_onto_diagram: ': डालें या डालने के लिए टैप करें',
Help: 'सहायता: सहायता पृष्ठ प्रदर्शित करें',
Grid: 'ग्रिड: टॉगल ग्रिड प्रदर्शन',
Link_tip: 'लिंक: सर्किट के लिए एक लिंक साझा करें',
Cut: 'चयनित घटकों को क्लिपबोर्ड पर काटें',
Copy:'चयनित घटकों को क्लिपबोर्ड पर कॉपी करें',
Paste:'योजनाबद्ध करने के लिए क्लिपबोर्ड पेस्ट करें',
Delete:'चयनित घटक हटाएं',
Rotate:'चयनित घटक घुमाएं',
Save_netlist: 'नेटलिस्ट सहेजें',
Open_netlist: 'ओपन नेटलिस्ट',
Select_netlist: 'नेटलिस्ट चुनें',
Perform_DC_Analysis: 'एक डीसी विश्लेषण प्रदर्शन',
DC_Analysis: 'डीसी विश्लेषण',
Perform_AC_Analysis: 'एसी लघु-सिग्नल विश्लेषण करें',
Perform_Transient_Analysis: 'एक क्षणिक विश्लेषण करें',
Transient_Analysis: 'क्षणिक विश्लेषण',
Edit_Properties: 'गुण संपादित करें',
Link: 'संपर्क',
Sharable_Link: 'शेयर करने योग्य लिंक',

points_per_decade: 'अंकों की संख्या / दशक',
Starting_frequency: 'प्रारंभिक आवृत्ति (हेटर्स)',
Ending_frequency: 'आवृत्ति समाप्त (हेटर्स)',	
source_for_ac: 'ए के लिए वी या आई स्रोत का नाम',
AC_Analysis_add_a_voltage_probe: 'एसी विश्लेषण: आरेख में एक वोल्टेज जांच जोड़ें!',
AC_Analysis: 'एसी विश्लेषण',
Zero_ac_response: 'शून्य एसी प्रतिक्रिया, - डीबी स्केल पर मौजूदता।',
Near_zero_ac_response: 'शून्य एसी प्रतिक्रिया के पास, निकालें ',
probe: ' जांच',

// Alerts and warnings from the circuit simulator
Alert: 'चेतावनी',
ckt_alert1: 'चेतावनी !!! सर्किट में एक वोल्टेज स्रोत लूप या एक स्रोत या वर्तमान जांच तार द्वारा छंटित की गई है, कृपया स्रोत या तार को छोटा करें, जिससे छोटा हो।',
ckt_alert2: 'चेतावनी !!! सिम्युलेटर अवैध सर्किट के साथ अर्थपूर्ण नतीजे या न ही परिणाम पेश कर सकता है।',
ckt_warning1: 'चेतावनी: दो सर्किट तत्व एक ही नाम साझा करते हैं ',
ckt_alert3: 'कृपया भूमि पर कम से कम एक कनेक्शन बनाएं (त्रिकोण प्रतीक)',
ckt_alert4: 'न्यूटन पद्धति विफल हुई, क्या आपके वर्तमान स्रोतों के आधार पर एक प्रवाहकीय पथ है?',
ckt_alert5: 'न्यूटन विधि विफल, यह आपका सर्किट हो सकता है या यह हमारा सिम्युलेटर हो सकता है',
ckt_alert6: 'डीसी शून्य से क्षणिक विश्लेषण की कोशिश में विफल रहा।',
ckt_alert7: 'एसी विश्लेषण अज्ञात स्रोत को संदर्भित करता है ',
ckt_alert8: 'एसी विश्लेषण विफल, अज्ञात स्रोत',	

ckt_error1: 'एम की पंक्तियों को बेमेल या कॉलम बेमेल को x में',
ckt_error2: 'बी के लिए पंक्ति या बहुत बड़ी कॉलम',
ckt_error3: 'सी के लिए पंक्ति या बहुत बड़ी कॉलम',
ckt_error4: 'स्केलर और स्केलब को स्केलर या एरेज़ होना चाहिए',
ckt_error5: 'पंक्तियों या स्तंभों > पंक्तियों या डेल्टा के कोल्स',
ckt_error6: 'पंक्तियों या स्तंभों> स्तंभों या गंतव्य की पंक्तियाँ',	    	    

log_Frequency: 'लॉग करें (हर्ट्ज़ में फ़्रीक्वेंसी)',
degrees: 'डिग्री',
AC_Phase: 'एसी चरण',
AC_Magnitude: 'एसी परिमाण',

Minimum_number_of_timepoints: 'टाइमर के न्यूनतम संख्या',
Stop_time_seconds: 'समय बंद करो (सेकंड)',
tstop_lbl: 'रुकने का समय',
Transient_Analysis_add_a_probe: 'क्षणिक विश्लेषण: आरेख में एक जांच जोड़ें!',

//Use creative phrasing to get this right: 
// alert('The ' + color + ' probe is connected to node ' + '"' + label + '"' + ' which is not an actual circuit node');
The: 'The ',
probe_is_connected_to_node: ' जांच नोड से जुड़ी है ',
which_is_not_an_actual_circuit_node: ' जो एक वास्तविक सर्किट नोड नहीं है',

Voltage: 'वोल्टेज',
Current: 'विद्युत धारा',
Time: 'पहर',
Node_has_two_conflicting_labels: 'नोड के दो विरोधी लेबल हैं: ',

DC_value: 'डीसी मूल्य',

impulse: 'प्रेरणा',
Height: 'ऊंचाई',
Width: 'चौड़ाई (सेकंड)',

step: 'कदम',
Initial_value: 'प्रारंभिक मूल्य',
Plateau_value: 'पठार मूल्य',
Delay_until_step: 'चरण तक विलंब (सेकंड)',
Rise_time: 'उठो समय (सेकंड)',

square: 'वर्ग',
Frequency: 'फ़्रिक्वेंसी (हर्ट्ज)',
Duty_cycle: 'साइकिल शुल्क (%)',

triangle: 'त्रिकोण',

pwl: 'pwl',
pwl_repeating: 'पीडब्लूएल (दोहराव)',
Comma_separated_list: 'वैकल्पिक समय और मूल्यों के अल्पविराम द्वारा पृथक की गई सूची',

pulse: 'नाड़ी',
Delay_until_pulse: 'पल्स तक विलंब (सेकंड)',
Time_for_first_transition: 'पहला संक्रमण का समय (सेकंड)',
Time_for_second_transition: 'दूसरे संक्रमण का समय (सेकंड)',
Pulse_width: 'पल्स चौड़ाई (सेकंड)',
Period: 'अवधि (सेकंड)',

sin: 'ज्या',
Offset_value: 'ऑफसेट मान',
Amplitude: 'आयाम',
Delay_until_sin_starts: 'पाप शुरू होने तक विलंब (सेकंड्स)',
Phase_offset_degrees: 'चरण ऑफसेट (डिग्री)',

Circuit_Sandbox_Help: 'सर्किट सैंडबॉक्स मदद',
name: 'नाम',
value: 'मूल्य',
label: 'लेबल',
r: 'R',
c: 'C',
l: 'L',
color: 'रंग',
offset: 'ओफ़्सेट',
area: 'क्षेत्र',
type: 'प्रकार',
normal: 'साधारण',
ideal: 'आदर्श',
WL: 'W/L',
A: 'A',
Plot_color: 'प्लॉट रंग',
Plot_offset: 'प्लॉट ऑफ़सेट',
dc: 'dc',

red: 'लाल',
green: 'हरा',
blue: 'नीला',
cyan: 'सियान',
magenta: 'मैजेंटा',
yellow: 'पीला',
orange: 'नारंगी',
black: 'काली',
xaxis: 'एक्स अक्ष',

Ics: 'Ics',
Ies: 'Ies',
alphaF: '\u03B1F',
alphaR: '\u03B1R',
last_line: 'अंतिम पंक्ति, कोई अल्पविराम नहीं'
};

var strSHelp = "सर्किट सैंडबॉक्स मदद\n\n";		//embedded Help 
var strAddC = "घटक जोड़ें: भागों बिन में एक भाग पर टैप करें, फिर जोड़ने के लिए योजनाबद्ध पर टैप करें\n\n";
var strAddW = "तार जोड़ें: तार कनेक्शन के बिंदुओं (खुले हलकों) से शुरू होते हैं। तार शुरू करने, खींचें, और रिलीज़ करने के लिए कनेक्शन पर स्पर्श करें\n\n";
var strSel  = "चुनें: घटकों को चुनने के लिए एक आयताकार खींचें। \n(डेस्कटॉप :) दूसरे घटक को शामिल करने के लिए Shift- क्लिक करें\n\n";
var strMove = "स्थानांतरित करें: किसी नए स्थान को स्पर्श करें और खींचें\n\n";
var strDel  = "हटाएं: चुनने के लिए टैप करें, फिर एक्स आइकन टैप करें या बैक स्पेस को दबाएं।\n\n";
var strRot  = "Rotate/Reflect: Click to select, then click on the rotation icon or type the letter \"r\" to rotate 90. Repeat for more rotations and reflections (8 total).\n\n";
var strProp = "गुण: प्रतिरोध या वोल्टेज जैसे गुण बदलने के लिए एक घटक पर डबल टैप करें।\n\n";
var strNum  = "संख्याओं को इंजीनियरिंग संकेतन का उपयोग करके दर्ज किया जा सकता है:\n\
T\t10^12     m\t10^-3    \n\
G\t10^9       u\t10^-6   \n\
M\t10^6       n\t10^-9   \n\
k \t10^3       p\t10^-12 \n\
                    f\t10^-15";
