var i18n = {
error1: 'Sajnáljuk, de hiba történt a böngészőben az eszköz indításakor. Javasoljuk a Firefox és a Chrome legújabb verzióinak használatát.',
Ground_connection: 'Földelés',
Node_label: 'Csomópont felirat',
Voltage_source: 'Feszültségforrás',
Current_source: 'Áramforrás',
Resistor: 'Ellenállás',
Capacitor: 'Kondenzátor',
Inductor: 'Tekercs',
Op_Amp: 'Műveleti erősítő',
Diode: 'Dióda',
NFet: 'NFet',
PFet: 'PFet',
NPN: 'NPN',
PNP: 'PNP',
Voltage_probe: 'Feszültség szonda',
Current_probe: 'Ampermérő',
drag_onto_diagram: ': húzza vagy koppintson a beillesztéshez',
Help: 'Súgó: súgó oldal megjelenítése',
Grid: 'Rács: rács megjelenítésének váltása',
Link_tip: 'Link: megosztja az áramkörre mutató linket',
Cut: 'Kiválasztott elemek kivágása vágólapra',
Copy:'Kiválasztott elemek vágólapra másolása',
Paste:'Vágólap beillesztése',
Delete:'Kiválasztott elemek törlése',
Rotate:'Kiválasztott elem forgatása',
Save_netlist: 'Csomóponti lista mentése',
Open_netlist: 'Csomóponti lista megnyitása',
Select_netlist: 'Csomóponti lista kiválasztása',
Perform_DC_Analysis: 'Egyenáram elemzés végrehajtása',
DC_Analysis: 'Egyenáram elemzés',
Perform_AC_Analysis: 'Kis jelű váltóáram elemzés végrehajtása',
Perform_Transient_Analysis: 'Tranziens elemzés végrehajtása',
Transient_Analysis: 'Tranziens elemzés',
Edit_Properties: 'Tulajdonságok szerkesztése',
Link: 'Hivatkozás',
Sharable_Link: 'Megosztható hivatkozás',

points_per_decade: 'Tizedesek száma',
Starting_frequency: 'Kezdő frekvencia (Hz)',
Ending_frequency: 'Utolsó frekvencia (Hz)',	
source_for_ac: 'Feszültség vagy áramforrás neve',
AC_Analysis_add_a_voltage_probe: 'Váltóáram elemzés: adjon egy feszültség szondát az ábrára!',
AC_Analysis: 'Váltóáram elemzés',
Zero_ac_response: 'Nincs váltoáram válasz, -végtelen a dB skálán.',
Near_zero_ac_response: 'Közel nulla váltóáram válasz, eltávolítani ',
probe: ' szonda',

// Alerts and warnings from the circuit simulator
Alert: 'Figyelmeztetés',
ckt_alert1: 'Figyelem! Az áramkör rövidre van zárva. Kérjük távolítsa el a forrást vagy a vezetéket ami okozza.',
ckt_alert2: 'Figyelem! A szimulátor értelmetlen vagy semmilyen eredményt nem fog létrehozni érvénytelen áramkör esetében.',
ckt_warning1: 'Figyelem! Két áramköri elemnek ugyan az a neve ',
ckt_alert3: 'Kérjük csatlakoztasson legalább egy földelést.',
ckt_alert4: 'Newton módszer sikertelen; az áramforrások földeléshez vannak kötve?',
ckt_alert5: 'Newton módszer sikertelen; lehet hogy az áramkör, lehet hogy a szimulátorunk az oka.',
ckt_alert6: 'DC sikertelen, próbálkozás tranziens elemzéssel nulláról.',
ckt_alert7: 'AC elemzés egy ismeretlen forrásra utal, ',
ckt_alert8: 'AC elemzés sikertelen, ismeretlen forrás.',	

//ckt_error1: 'Rows of M mismatched to b or cols mismatch to x.',
//ckt_error2: 'Row or columns of A too large for B',
//ckt_error3: 'Row or columns of A too large for C',
//ckt_error4: 'scalea and scaleb must be scalars or Arrays',
//ckt_error5: 'Rows or cols > rows or cols of dest',
//ckt_error6: 'Rows or cols > cols or rows of dest',	    	    

log_Frequency: 'log(Frekvencia Hz-ben)',
degrees: 'szög',
AC_Phase: 'Váltóáram fázis',
AC_Magnitude: 'Váltóáram nagyság',

Minimum_number_of_timepoints: 'Az időpontok minimális száma',
Stop_time_seconds: 'Befejező idő (mp)',
tstop_lbl: 'Befejező idő',
Transient_Analysis_add_a_probe: 'Tranziens elemzés: adjon az ábrához egy szondát!',

//Use creative phrasing to get this sentence to come out right: 
// alert('The ' + color + ' probe is connected to node ' + '"' + label + '"' + ', which is not an actual circuit node');
The: 'A ',
probe_is_connected_to_node: ' szonda a csomóponthoz van csatlakoztatva ',
which_is_not_an_actual_circuit_node: ', ami nem igazi áramköri csomópont.',

Voltage: 'Feszültség',
Current: 'Áramerősség',
Time: 'Idő',
Node_has_two_conflicting_labels: 'A csomópontnak két ellentétes címkéje van: ',

DC_value: 'Egyenáram érték',

impulse: 'impulzus',
Height: 'Magasság',
Width: 'Szélesség (mp)',

step: 'lépcső',
Initial_value: 'Kezdő érték',
Plateau_value: 'Tetőző érték',
Delay_until_step: 'Késleltetés (mp)',
Rise_time: 'Növekedési idő (mp)',

square: 'négyszög',
Frequency: 'Frekvencia (Hz)',
Duty_cycle: 'Munka ciklus (%)',

triangle: 'háromszög',

pwl: 'szakaszosan lineáris',
pwl_repeating: 'szak-lin (ismétlődő)',
Comma_separated_list: 'Vesszővel elválasztott váltakozó idők és értékek listája',

pulse: 'lüktetés',
Delay_until_pulse: 'Késleltetés lüktetésig (mp)',
Time_for_first_transition: 'Első átmenet ideje (mp)',
Time_for_second_transition: 'Második átmenet ideje (mp)',
Pulse_width: 'Lüktetés szélesség (mp)',
Period: 'Periódus (mp)',

sin: 'szinusz',
Offset_value: 'Eltolás mértéke',
Amplitude: 'Amplitúdó',
Delay_until_sin_starts: 'Késleltetés ideje (mp)',
Phase_offset_degrees: 'Fázistolás (szög)',

Circuit_Sandbox_Help: 'Áramköri homokozó súgó',
name: 'Név',
value: 'Érték',
label: 'Címke',
r: 'E',
c: 'K',
l: 'T',
color: 'Szín',
offset: 'Eltolás',
area: 'Terület',
type: 'Típus',
normal: 'normál',
ideal: 'ideális',
is: 'Is',
Vt: 'Vt',
WL: 'SZ/H',
A: 'A',
Plot_color: 'Grafikon színe',
Plot_offset: 'Grafikon kitérése',
dc: 'dc',

Gain: 'A',
Rin: 'Rin',
Rout: 'Rout',

red: 'piros',
green: 'zöld',
blue: 'kék',
cyan: 'cián',
magenta: 'magenta',
yellow: 'sárga',
orange: 'narancssárga',
black: 'fekete',
xaxis: 'x tengely',

Ics: 'Ics',
Ies: 'Ies',
alphaF: '\u03B1F',
alphaR: '\u03B1R',
last_line: 'Utolsó sor, nincs vessző'
};

var strSHelp = "Áramköri Homokozó Súgó\n\n";		//embedded Help 
var strAddC = "Alkotóelem hozzáadása: Érintse meg az elemet, majd érintse meg a vázlatot.\n\n";
var strAddW = "Vezeték hozzáadása: A kezdéshez érintse meg a csatlakozási pontot (üres kör). Húzza. Elengedés.\n\n";
var strSel  = "Kiválasztás: Húzzon egy téglalapot az elemek kiválasztásához. \n(Asztal :) Shift-kattintás egy másik elem hozzáadásához.\n\n";
var strMove = "Áthelyezés: érintse meg és húzza egy új helyre.\n\n";
var strDel  = "Törlés: Koppintson a kiválasztásra, majd koppintson az X ikonra, vagy nyomja meg a BACKSPACE billentyűt.\n\n";
var strRot  = "Forgatás/Invertálás: Válassza ki, majd kattintson a forgatás ikonra, vagy nyomja meg az \„r\" gombot a 90-es elforgatáshoz. Ismételje meg a további forgatásokat (összesen 8-at).\n\n";
var strProp = "Tulajdonságok: Koppintson duplán egy elemre annak tulajdonságainak megváltoztatásához.\n\n";
var strNum  = "A számokat műszaki jelöléssel is be lehet írni, T = 10^12, G = 10^9, M = 10^6, k = 10^3, m = 10^-3, u = 10^-6, n = 10^-9, p = 10^-12, f = 10^-15";
