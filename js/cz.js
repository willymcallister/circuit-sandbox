var i18n = {
error1: 'Došlo k chybě v browseru při startu. Doporučujeme použít poslední verzi Firefox nebo Chrome.',
Ground_connection: 'Zem',
Node_label: 'Označení uzlu',
Voltage_source: 'Napěťový zdroj',
Current_source: 'Proudový zdroj',
Resistor: 'Rezistor',
Capacitor: 'Kondenzátor',
Inductor: 'Cívka',
Op_Amp: 'Operační zesilovač',
Diode: 'Dioda',
NFet: 'NFet',
PFet: 'PFet',
NPN: 'NPN',
PNP: 'PNP',
Voltage_probe: 'Napěťová sonda',
Current_probe: 'Proudová sonda',
drag_onto_diagram: ': přetáhněte nebo klepněte pro vložení',
Help: 'Nápověda: zobrazit stránku nápovědy',
Grid: 'Mřížka: přepnout zobrazení mřížky',
Link_tip: 'Odkaz: sdílet odkaz na obvod',
Cut: 'Vyjmout vybrané komponenty do schránky',
Copy:'Kopírovat vybrané komponenty do schránky',
Paste:'Vložit schránku do schématu',
Delete:'Smazat vybrané komponenty',
Rotate:'Otočit vybranou komponentu',
Save_netlist: 'Uložit netlist',
Open_netlist: 'Otevřít netlist',
Select_netlist: 'Vybrat netlist',
Perform_DC_Analysis: 'Provést DC analýzu',
DC_Analysis: 'DC analýza',
Perform_AC_Analysis: 'Provést AC analýzu malých signálů',
Perform_Transient_Analysis: 'Provést přechodovou analýzu',
Transient_Analysis: 'Přechodová analýza',
Edit_Properties: 'Upravit vlastnosti',
Link: 'Link',
Sharable_Link: 'Link ke sdílení',

points_per_decade: 'Počet bodů na dekádu',
Starting_frequency: 'Počáteční frekvence (Hz)',
Ending_frequency: 'Koncová frekvence (Hz)',	
source_for_ac: 'Jméno napěťového nebo proudového zdroje pro AC',
AC_Analysis_add_a_voltage_probe: 'AC analýza: přidat napěťovou sondu do schématu!',
AC_Analysis: 'AC analýza',
Zero_ac_response: 'Nulová AC odezva, -nekonečno na dB stupnici.',
Near_zero_ac_response: 'Téměř nulová AC odezva, odstraňte ',
probe: ' sonda',

// Alerts and warnings from the circuit simulator
Alert: 'Upozornění',
ckt_alert1: 'Varování! Obvod má zkrat v napěťové smyčce nebo na zdroji nebo je proudová sonda zkratována vodičem, odstraňte prosím zdroj nebo vodič způsobující zkrat',
ckt_alert2: 'Varování! Simulátor může generovat nesmyslné nebo žádné výsledky s neplatnými obvody.',
ckt_warning1: 'Varování! Dva prvky obvodu mají stejné jméno ',
ckt_alert3: 'Prosím, připojte alespoň jeden uzel na zem.',
ckt_alert4: 'Newtonova metoda selhala; mají vaše proudové zdroje vodivou cestu k zemi?',
ckt_alert5: 'Newtonova metoda selhala; může to být váš obvod nebo náš simulátor.',
ckt_alert6: 'DC selhalo, zkoušíme přechodovou analýzu od nuly.',
ckt_alert7: 'AC analýza odkazuje na neznámý zdroj, ',
ckt_alert8: 'AC analýza selhala, neznámý zdroj ',	

//ckt_error1: 'Rows of M mismatched to b or cols mismatch to x.',
//ckt_error2: 'Row or columns of A too large for B',
//ckt_error3: 'Row or columns of A too large for C',
//ckt_error4: 'scalea and scaleb must be scalars or Arrays',
//ckt_error5: 'Rows or cols > rows or cols of dest',
//ckt_error6: 'Rows or cols > cols or rows of dest',	    	    

log_Frequency: 'log(Frekvence v Hz)',
degrees: 'stupně',
AC_Phase: 'AC Fáze',
AC_Magnitude: 'AC Amplituda',

Minimum_number_of_timepoints: 'Minimální počet časových bodů',
Stop_time_seconds: 'Čas zastavení (s)',
tstop_lbl: 'čas zastavení',
Transient_Analysis_add_a_probe: 'Přechodová analýza: přidejte sondu do schématu!',

//Use creative phrasing to get this sentence to come out right: 
// alert('The ' + color + ' probe is connected to node ' + '"' + label + '"' + ', which is not an actual circuit node');
The: '',
probe_is_connected_to_node: 'Sonda je připojená k uzlu ',
which_is_not_an_actual_circuit_node: ', který není uzlem obvodu.',

Voltage: 'Napětí',
Current: 'Proud',
Time: 'Čas',
Node_has_two_conflicting_labels: 'Uzel má dvě konfliktní označení: ',

DC_value: 'Stejnosměrná hodnota',

impulse: 'Impuls',
Height: 'Výška',
Width: 'Šířka (s)',

step: 'skok',
Initial_value: 'Počáteční hodnota',
Plateau_value: 'Hodnota plató',
Delay_until_step: 'Zpoždění do kroku (s)',
Rise_time: 'Doba náběhu (s)',

square: 'obdélník',
Frequency: 'Frekvence (Hz)',
Duty_cycle: 'Střída (%)',

triangle: 'trojúhelník',
ramp: 'rampa',
Slope: 'Sklon (V/s)',

pwl: 'po částech lineární',
pwl_repeating: 'po částech lineární (opakující se)',
Comma_separated_list: 'Seznam časů a hodnot oddělený čárkami',

pulse: 'puls',
Delay_until_pulse: 'Zpoždění do pulsu (s)',
Time_for_first_transition: 'Čas pro první přechod (s)',
Time_for_second_transition: 'Čas pro druhý přechod (s)',
Pulse_width: 'Šířka pulsu (s)',
Period: 'Perioda (s)',

sin: 'sin',
Offset_value: 'Hodnota offsetu',
Amplitude: 'Amplituda',
Delay_until_sin_starts: 'Zpoždění do začátku sinu (s)',
Phase_offset_degrees: 'Fázový posun (stupně)',

Circuit_Sandbox_Help: 'NÁPOVĚDA CIRCUIT SANDBOX',
name: 'Název',
value: 'Hodnota',
label: 'Označení',
r: 'R',
c: 'C',
l: 'L',
color: 'Barva',
offset: 'Offset',
area: 'Plocha',
type: 'Typ',
normal: 'Normální',
ideal: 'Ideální',
is: 'Is',
Vt: 'Vt',
WL: 'W/L',
lambda: 'λ',
A: 'A',
Plot_color: 'Barva grafu',
Plot_offset: 'Offset grafu',
dc: 'dc',

Gain: 'A',
Rin: 'Rin',
Rout: 'Rout',

red: 'červená',
green: 'zelená',
blue: 'modrá',
cyan: 'azurová',
magenta: 'purpurová',
yellow: 'žlutá',
orange: 'oranžová',
black: 'černá',
xaxis: 'osa x',

Ics: 'Ics',
Ies: 'Ies',
alphaF: '𝛼F',
alphaR: '𝛼R',
last_line: 'poslední řádka, bez čárky'
};

var strSHelp = "NÁPOVĚDA CIRCUIT SANDBOX\n\n";		//embedded Help 
var strAddC = "Přidat součást: Klepněte na součást v přihrádce součástí a poté klepněte na schéma.\n\n";
var strAddW = "Přidat vodič: Začněte dotykem na bod připojení (otevřená kružnice). Táhněte a uvolněte.\n\n";
var strSel  = "Vybrat: Přetažením obdélníku vyberte součásti. \n(plocha:) Klepnutím se stisknutou klávesou Shift zahrnete další komponentu.\n\n";
var strMove = "Přesunout: Dotkněte se a přetáhněte na nové místo.\n\n";
var strDel  = "Smazat: Klepnutím vyberte a poté klepněte na ikonu X nebo stiskněte BACKSPACE.\n\n";
var strRot  = "Rotace/Zrcadlení: Klepnutím vyberte a poté klikněte na ikonu rotace nebo stiskněte písmeno \„r\“ pro otočení o 90. Opakujte pro další rotace a zrcadlení (celkem 8).\n\n";
var strProp = "Vlastnosti: Dvojitým klepnutím na součást změníte její vlastnosti.\n\n";
var strNum  = "Čísla lze zadávat pomocí inženýrského zápisu, T = 10^12, G = 10^9, M = 10^6, k = 10^3, m = 10^-3, u = 10^-6, n = 10^-9, p = 10^-12, f = 10^-15";
