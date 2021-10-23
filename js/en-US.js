var i18n = {
error1: 'Sorry, there was a browser error in starting the schematic tool. We recommend using the latest versions of Firefox and Chrome.',
Ground_connection: 'Ground connection',
Node_label: 'Node label',
Voltage_source: 'Voltage source',
Current_source: 'Current source',
Resistor: 'Resistor',
Capacitor: 'Capacitor',
Inductor: 'Inductor',
Op_Amp: 'Op Amp',
Diode: 'Diode',
NFet: 'NFet',
PFet: 'PFet',
NPN: 'NPN',
PNP: 'PNP',
Voltage_probe: 'Voltage probe',
Current_probe: 'Current probe',
drag_onto_diagram: ': drag or tap to insert',
Help: 'Help: display the help page',
Grid: 'Grid: toggle grid display',
Link_tip: 'Link: share a link to the circuit',
Cut: 'Cut selected components to the clipboard',
Copy:'Copy selected components to the clipboard',
Paste:'Paste clipboard to the schematic',
Delete:'Delete selected components',
Rotate:'Rotate selected component',
Save_netlist: 'Save netlist',
Open_netlist: 'Open netlist',
Select_netlist: 'Select netlist',
Perform_DC_Analysis: 'Perform DC Analysis',
DC_Analysis: 'DC Analysis',
Perform_AC_Analysis: 'Perform AC Small-Signal Analysis',
Perform_Transient_Analysis: 'Perform Transient Analysis',
Transient_Analysis: 'Transient Analysis',
Edit_Properties: 'Edit Properties',
Link: 'Link',
Sharable_Link: 'Sharable link',

points_per_decade: 'Number of points/decade',
Starting_frequency: 'Starting frequency (Hz)',
Ending_frequency: 'Ending frequency (Hz)',	
source_for_ac: 'Name of V or I source for ac',
AC_Analysis_add_a_voltage_probe: 'AC Analysis: add a voltage probe to the diagram!',
AC_Analysis: 'AC Analysis',
Zero_ac_response: 'Zero ac response, -infinity on dB scale.',
Near_zero_ac_response: 'Near zero ac response, remove ',
probe: ' probe',

// Alerts and warnings from the circuit simulator
Alert: 'Alert',
ckt_alert1: 'Warning! Circuit has a voltage source loop or a source or current probe shorted by a wire, please remove the source or the wire causing the short.',
ckt_alert2: 'Warning! Simulator might produce meaningless results or no result with illegal circuits.',
ckt_warning1: 'Warning! Two circuit elements share the same name ',
ckt_alert3: 'Please make at least one connection to ground.',
ckt_alert4: 'Newton Method failed, do your current sources have a conductive path to ground?',
ckt_alert5: 'Newton Method failed, it may be your circuit or it may be our simulator.',
ckt_alert6: 'DC failed, trying transient analysis from zero.',
ckt_alert7: 'AC analysis refers to an unknown source, ',
ckt_alert8: 'AC analysis failed, unknown source.',	

//ckt_error1: 'Rows of M mismatched to b or cols mismatch to x.',
//ckt_error2: 'Row or columns of A too large for B',
//ckt_error3: 'Row or columns of A too large for C',
//ckt_error4: 'scalea and scaleb must be scalars or Arrays',
//ckt_error5: 'Rows or cols > rows or cols of dest',
//ckt_error6: 'Rows or cols > cols or rows of dest',	    	    

log_Frequency: 'log10(Frequency in Hz)',
degrees: 'degrees',
AC_Phase: 'AC Phase',
AC_Magnitude: 'AC Magnitude',

Minimum_number_of_timepoints: 'Minimum number of time points',
Stop_time_seconds: 'Stop time (seconds)',
tstop_lbl: 'stop time',
Transient_Analysis_add_a_probe: 'Transient Analysis: add a probe to the diagram!',

//Use creative phrasing to get this sentence to come out right: 
// alert('The ' + color + ' probe is connected to node ' + '"' + label + '"' + ', which is not an actual circuit node');
The: 'The ',
probe_is_connected_to_node: ' probe is connected to node ',
which_is_not_an_actual_circuit_node: ', which is not an actual circuit node.',

Voltage: 'Voltage',
Current: 'Current',
Time: 'Time',
Node_has_two_conflicting_labels: 'Node has two conflicting labels: ',

DC_value: 'DC value',

impulse: 'impulse',
Height: 'Height',
Width: 'Width (sec)',

step: 'step',
Initial_value: 'Initial value',
Plateau_value: 'Plateau value',
Delay_until_step: 'Delay until step (sec)',
Rise_time: 'Rise time (sec)',

square: 'square',
Frequency: 'Frequency (Hz)',
Duty_cycle: 'Duty cycle (%)',

triangle: 'triangle',
ramp: 'ramp',
Slope: 'Slope (volts/sec)',

pwl: 'pwl',
pwl_repeating: 'pwl (repeating)',
Comma_separated_list: 'Comma-separated list of alternating times and values',

pulse: 'pulse',
Delay_until_pulse: 'Delay until pulse (sec)',
Time_for_first_transition: 'Time for first transition (sec)',
Time_for_second_transition: 'Time for second transition (sec)',
Pulse_width: 'Pulse width (sec)',
Period: 'Period (sec)',

sin: 'sin',
Offset_value: 'Offset value',
Amplitude: 'Amplitude',
Delay_until_sin_starts: 'Delay until sin starts (sec)',
Phase_offset_degrees: 'Phase offset (degrees)',

Circuit_Sandbox_Help: 'CIRCUIT SANDBOX HELP',
name: 'Name',
value: 'Value',
label: 'Label',
r: 'R',
c: 'C',
l: 'L',
color: 'Color',
offset: 'Offset',
area: 'Area',
type: 'Type',
normal: 'normal',
ideal: 'ideal',
is: 'Is',
Vt: 'Vt',
WL: 'W/L',
lambda: 'λ',
A: 'A',
Plot_color: 'Plot color',
Plot_offset: 'Plot offset',
dc: 'dc',

Gain: 'A',
Rin: 'Rin',
Rout: 'Rout',

red: 'red',
green: 'green',
blue: 'blue',
cyan: 'cyan',
magenta: 'magenta',
yellow: 'yellow',
orange: 'orange',
black: 'black',
xaxis: 'x axis',

Ics: 'Ics',
Ies: 'Ies',
alphaF: '𝛼F',
alphaR: '𝛼R',
last_line: 'last line, no comma'
};

var strSHelp = "CIRCUIT SANDBOX HELP\n\n";		//embedded Help 
var strAddC = "Add component: Tap on a part in the parts bin, then tap on the schematic.\n\n";
var strAddW = "Add wire: Touch on a connection point (open circle). Drag. Release.\n\n";
var strSel  = "Select: Drag a rectangle to select components. \n(desktop:) Shift-click to include another component.\n\n";
var strMove = "Move: Touch and drag to a new location.\n\n";
var strDel  = "Delete: Tap to select, then tap the X icon or hit BACKSPACE.\n\n";
var strRot  = "Rotate/Reflect: Click to select, then click on the rotation icon or type the letter \"r\" to rotate 90. Repeat for more rotations and reflections (8 total).\n\n";
var strProp = "Properties: Double tap on a component to change its properties.\n\n";
var strNum  = "Numbers may be entered using engineering notation,\n\
T = 10^12, G = 10^9, M = 10^6, k = 10^3\n\
m = 10^-3, u = 10^-6, n = 10^-9, p = 10^-12, f = 10^-15";
