var i18n = {
error1: 'Sorry, there a browser error in starting the schematic tool.  We recommend using the latest versions of Firefox and Chrome.',
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
Voltage_probe: 'Voltage probe',
Current_probe: 'Current probe',
drag_onto_diagram: ': drag onto diagram to insert',
Help: 'Help: display help page',
Grid: 'Grid: toggle grid display',
Cut: 'Cut: cut selected components to the clipboard',
Copy:'Copy: copy selected components to the clipboard',
Paste:'Paste: copy clipboard to the schematic',
Delete:'Delete selected components',
Rotate:'Rotate selected component',
Download_netlist: 'Download netlist',
Import_netlist: 'Import netlist',
Select_netlist: 'Select netlist',
DC_Analysis: 'DC Analysis',
AC_Analysis: 'AC Small-Signal Analysis',
Transient_Analysis: 'Transient Analysis',
Edit_Properties: 'Edit Properties',

Number_of_points_per_decade: 'Number of points/decade',
Starting_frequency: 'Starting frequency (Hz)',
Ending_frequency: 'Ending frequency (Hz)',	
Name_of_V_or_I_source_for_ac: 'Name of V or I source for ac',
AC_Analysis_add_a_voltage_probe: 'AC Analysis: add a voltage probe to the diagram!',
AC_Analysis: 'AC Analysis',
Zero_ac_response: 'Zero ac response, -infinity on DB scale.',
Near_zero_ac_response: 'Near zero ac response, remove ',
probe: ' probe',

ckt_alert1: 'Warning!!! Circuit has a voltage source loop or a source or current probe shorted by a wire, please remove the source or the wire causing the short.',
ckt_alert2: 'Warning!!! Simulator might produce meaningless results or no result with illegal circuits.',
ckt_warning1: 'Warning: two circuit elements share the same name ',
ckt_alert3: 'Please make at least one connection to ground (triangle symbol)',
ckt_alert4: 'Newton Method Failed, do your current sources have a conductive path to ground?',
ckt_alert5: 'Newton Method Failed, it may be your circuit or it may be our simulator.',
ckt_alert6: 'DC failed, trying transient analysis from zero.',
ckt_alert7: 'AC analysis refers to unknown source ',
ckt_alert8: 'AC analysis failed, unknown source',	

ckt_error1: 'Rows of M mismatched to b or cols mismatch to x.',
ckt_error2: 'Row or columns of A to large for B',
ckt_error3: 'Row or columns of A to large for C',
ckt_error4: 'scalea and scaleb must be scalars or Arrays',
ckt_error5: 'Rows or cols > rows or cols of dest',
ckt_error6: 'Rows or cols > cols or rows of dest',	    	    

// new since sharing with Jake

log_Frequency: 'log(Frequency in Hz)',
degrees: 'degrees',
AC_Phase: 'AC Phase',
AC_Magnitude: 'AC Magnitude',

Minimum_number_of_timepoints: 'Minimum number of timepoints',
Stop_time_seconds: 'Stop time (seconds)',
Transient_Analysis_add_a_probe: 'Transient Analysis: add a probe to the diagram!',

//Use creating phrasing to get this right: 
// alert('The ' + color + ' probe is connected to node ' + '"' + label + '"' + ' which is not an actual circuit node');
The: 'The ',
probe_is_connected_to_node: ' probe is connected to node ',
which_is_not_an_actual_circuit_node: ' which is not an actual circuit node',

Voltage: 'Voltage',
Current: 'Current',
Time: 'Time',
Node_has_two_conflicting_labels: 'Node has two conflicting labels: ',
//normal: 'normal',
//ideal: 'ideal'
//area: 'area',


last_line: 'last line, no comma'
};

var i18n_probe_cnames = ['red','green','blue','cyan','magenta','yellow','black','x-axis'];



/*
	var probe_colors = ['red','green','blue','cyan','magenta','yellow','black','x-axis'];
// These are names AND keys of a case statement, need to separate function.

'<Probe ('
'Plot color'	//maybe not needed
'Plot offset'	//maybe not needed
'Edit Properties'


'normal'
'ideal'
'area'

'name'

'source '
'name'
'value'

'dc': ['DC value'],

		'impulse': ['Height',
		'Width (secs)'],

		'step': ['Initial value',
		'Plateau value',
		'Delay until step (secs)',
		'Rise time (secs)'],

		'square': ['Initial value',
		'Plateau value',
		'Frequency (Hz)',
		'Duty cycle (%)'],

		'triangle': ['Initial value',
		'Plateau value',
		'Frequency (Hz)'],

		'pwl': ['Comma-separated list of alternating times and values'],

		'pwl_repeating': ['Comma-separated list of alternating times and values'],

		'pulse': ['Initial value',
		'Plateau value',
		'Delay until pulse (secs)',
		'Time for first transition (secs)',
		'Time for second transition (secs)',
		'Pulse width (secs)',
		'Period (secs)'],

		'sin': ['Offset value',
		'Amplitude',
		'Frequency (Hz)',
		'Delay until sin starts (secs)',
		'Phase offset (degrees)']

		'Plot color'
		'Plot offset'
*/
