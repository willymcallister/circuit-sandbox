var i18n = {
error1: 'Sorry, there was a browser error in starting the schematic tool. We recommend using the latest versions of Firefox and Chrome.',
Ground_connection: 'Messa a terra',
Node_label: 'Nodo di riferimento',
Voltage_source: 'Alimentatore di tensione',
Current_source: 'Alimentatore di corrente',
Resistor: 'Resistore',
Capacitor: 'Capacitore',
Inductor: 'Induttore',
Op_Amp: 'Amplificatore operazionale',
Diode: 'Diodo',
NFet: 'NFet',
PFet: 'PFet',
NPN: 'NPN',
PNP: 'PNP',
Voltage_probe: 'Sonda di tensione',
Current_probe: 'Sonda di corrente',
drag_onto_diagram: ': trascina o clicca per inserire',
Help: 'Aiuto: mostra la pagina di aiuto',
Grid: 'Griglia: attiva/disattiva la griglia dello schermo',
Link_tip: 'Collegamento: condividi un collegamento al circuito',
Cut: 'Taglia i component selezionati nella barra degli appunti',
Copy:'Copia i component selezionati nella barra degli appunti',
Paste:'Incolla gli appunti nello schema',
Delete:'Elimina i componenti selezionati',
Rotate:'Ruota il componente selezionato',
Save_netlist: 'Salva netlist',
Open_netlist: 'Apri netlist',
Select_netlist: 'Seleziona netlist',
Perform_DC_Analysis: 'Avvia analisi DC',
DC_Analysis: 'Analisi DC',
Perform_AC_Analysis: 'Avvia analisi di piccoli segnali in AC',
Perform_Transient_Analysis: 'Avvia analisi in regime transitorio',
Transient_Analysis: 'Analisi in regime transitorio',
Edit_Properties: 'Modifica proprietà',
Link: 'Collegamento',
Sharable_Link: 'Collegamento condivisibile',

points_per_decade: 'Numero di punti/decade',
Starting_frequency: 'Frequenza iniziale (Hz)',
Ending_frequency: 'Frequenza finale (Hz)',	
source_for_ac: 'Nome della sorgente di V o I per AC',
AC_Analysis_add_a_voltage_probe: 'Analisi AC: aggiungere una sonda di tensione al diagramma!',
AC_Analysis: 'Analisi AC',
Zero_ac_response: 'Risposta zero in AC, -infinito su scala dB.',
Near_zero_ac_response: 'Risposta prossima a zero in AC, rimuovere ',
probe: ' sonda',

// Alerts and warnings from the circuit simulator
Alert: 'Avviso',
ckt_alert1: 'Attenzione! Il circuito ha un generatore di tensione in loop oppure la sonda di corrente è in cortocircuito con un filo, per favore rimuovere il generatore o il filo che produce il cortociruito.',
ckt_alert2: 'Attenzione! Il simulatore potrebbe produrre risultati insignificanti o non produrre risultati con circuiti illegali.',
ckt_warning1: 'Attenzione! Due elementi del circuito hanno lo stesso nome ',
ckt_alert3: 'Per favore effettuare almeno un collegamento a terra.',
ckt_alert4: 'Il metodo di Newton non è applicabile: le tue sorgenti di corrente hanno un collegamento a terra?',
ckt_alert5: 'Il metodo di Newton non è applicabile: può essere un problema del tuo circuito o del simulatore.',
ckt_alert6: 'DC fallita, prova l’analisi in transitorio da zero.',
ckt_alert7: 'L’analisi AC si riferisce ad un generatore sconosciuto, ',
ckt_alert8: 'Analisi AC fallita, generatore sconosciuto.',	

//ckt_error1: 'Rows of M mismatched to b or cols mismatch to x.',
//ckt_error2: 'Row or columns of A too large for B',
//ckt_error3: 'Row or columns of A too large for C',
//ckt_error4: 'scalea and scaleb must be scalars or Arrays',
//ckt_error5: 'Rows or cols > rows or cols of dest',
//ckt_error6: 'Rows or cols > cols or rows of dest',	    	    

log_Frequency: 'Log (frequenza in Hz)',
degrees: 'gradi',
AC_Phase: 'Fase in AC',
AC_Magnitude: 'Modulo/Ampiezza in AC',

Minimum_number_of_timepoints: 'Numero minimo di punti temporali',
Stop_time_seconds: 'Tempo di arresto (sec)',
tstop_lbl: 'tempo di arresto',
Transient_Analysis_add_a_probe: 'Analisi in transitorio: aggiungere una sonda al diagramma!',

//Use creative phrasing to get this sentence to come out right: 
// alert('The ' + color + ' probe is connected to node ' + '"' + label + '"' + ', which is not an actual circuit node');
The: 'La ',
probe_is_connected_to_node: ' sonda è collegata al nodo ',
which_is_not_an_actual_circuit_node: ', che non è un nodo effettivo del circuito.',

Voltage: 'Tensione',
Current: 'Corrente',
Time: 'Tempo',
Node_has_two_conflicting_labels: 'Il nodo ha due riferimenti diversi: ',

DC_value: 'Valore DC',

impulse: 'impulso',
Height: 'Altezza',
Width: 'Larghezza (sec)',

step: 'gradino',
Initial_value: 'Valore iniziale',
Plateau_value: 'Valore di paragone',
Delay_until_step: 'Ritardo fino al gradino (sec)',
Rise_time: 'Tempo di risalita (sec)',

square: 'radice',
Frequency: 'Frequenza (Hz)',
Duty_cycle: 'Ciclo di lavoro (%)',

triangle: 'triangolo',
ramp: 'rampa',
Slope: 'Pendenza (Volt/sec)',

pwl: 'pwl',
pwl_repeating: 'pwl (ripetuto)',
Comma_separated_list: 'Elenco separato da virgule relativo a tempi e valori',

pulse: 'impulso',
Delay_until_pulse: 'Ritardo fino all’impulso (sec)',
Time_for_first_transition: 'Tempo di prima transizione (sec)',
Time_for_second_transition: 'Tempo di seconda transizione (sec)',
Pulse_width: 'Larghezza di impulse (sec)',
Period: 'Periodo (sec)',

sin: 'sin',
Offset_value: 'Valore di deviazione',
Amplitude: 'Ampiezza/Modulo',
Delay_until_sin_starts: 'Ritardo fino all’inzio della funzione sin (sec)',
Phase_offset_degrees: 'Sfasamento (gradi)',

Circuit_Sandbox_Help: 'CIRCUIT SANDBOX AIUTO',
name: 'Nome',
value: 'Valore',
label: 'Etichetta',
r: 'R',
c: 'C',
l: 'L',
color: 'Colore',
offset: 'Deviazione',
area: 'Area',
type: 'Tipo',
normal: 'normale',
ideal: 'ideale',
is: 'Is',
Vt: 'Vt',
WL: 'W/L',
lambda: 'λ',
A: 'A',
Plot_color: 'Colore trama',
Plot_offset: 'Deviazione trama',
dc: 'dc',

Gain: 'A',
Rin: 'Rin',
Rout: 'Rout',

red: 'rosso',
green: 'verde',
blue: 'blu',
cyan: 'ciano',
magenta: 'magenta',
yellow: 'giallo',
orange: 'arancione',
black: 'nero',
xaxis: 'asse x',

Ics: 'Ics',
Ies: 'Ies',
alphaF: '𝛼F',
alphaR: '𝛼R',
last_line: 'last line, no comma'
};

var strSHelp = "🇮🇹 CIRCUIT SANDBOX AIUTO\n";		//embedded Help 
var strAddC = "Aggiungere componente: clicca un elemento sulla sezione dei componenti, quindi clicca sullo schema.\n\n";
var strAddW = "Aggiungere filo: seleziona su un punto di contatto (cerchio aperto) per iniziare. Rilascia.\n\n";
var strSel  = "Seleziona: trascina un rettangolo per selezionare i componenti. \n(desktop: ) premi Shift-click per inserire un altro componente.\n\n";
var strMove = "Muovi: tocca e trascina in una nuova posizione.\n\n";
var strDel  = "Cancella: clicca per selezionare, dopo clicca sull’icona X o premi il tasto BACKSPACE.\n\n";
var strRot  = "Ruota/Ribalta: clicca per selezionare, dopo clicca sull’icona di rotazione o premi il tasto \"r\" per ruotare di 90°. Ripetere per ulteriori rotazioni e ribaltamenti (8 totali).\n\n";
var strProp = "Proprietà: doppio click su un componente per cambiare le sue proprietà.\n\n";
var strNum  = "I numeri si possono inserire con la notazione ingegneristica,\n\
T = 10^12, G = 10^9, M = 10^6, k = 10^3\n\
m = 10^-3, u = 10^-6, n = 10^-9, p = 10^-12, f = 10^-15";
