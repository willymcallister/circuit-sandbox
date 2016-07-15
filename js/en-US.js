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

// Alerts and warnings from the circuit simulator
ckt_alert1: 'Warning!!! Circuit has a voltage source loop or a source or current probe shorted by a wire, please remove the source or the wire causing the short.',
ckt_alert2: 'Warning!!! Simulator might produce meaningless results or no result with illegal circuits.',
ckt_warning1: 'Warning: two circuit elements share the same name ',
ckt_alert3: 'Please make at least one connection to ground (triangle symbol)',
ckt_alert4: 'Newton Method failed, do your current sources have a conductive path to ground?',
ckt_alert5: 'Newton Method failed, it may be your circuit or it may be our simulator.',
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

DC_value: 'DC value',

impulse: 'impulse',
Height: 'Height',
Width: 'Width (secs)',

step: 'step',
Initial_value: 'Initial value',
Plateau_value: 'Plateau value',
Delay_until_step: 'Delay until step (secs)',
Rise_time: 'Rise time (secs)',

square: 'square',
Frequency: 'Frequency (Hz)',
Duty_cycle: 'Duty cycle (%)',

triangle: 'triangle',

pwl: 'pwl',
Comma_separated_list: 'Comma-separated list of alternating times and values',

pwl_repeating: 'pwl_repeating',

pulse: 'pulse',
Delay_until_pulse: 'Delay until pulse (secs)',
Time_for_first_transition: 'Time for first transition (secs)',
Time_for_second_transition: 'Time for second transition (secs)',
Pulse_width: 'Pulse width (secs)',
Period: 'Period (secs)',

sin: 'sin',
Offset_value: 'Offset value',
Amplitude: 'Amplitude',
Delay_until_sin_starts: 'Delay until sin starts (secs)',
Phase_offset_degrees: 'Phase offset (degrees)',

last_line: 'last line, no comma'
};

// translated color names, not to be confused with variables: probe_names or probe_colors or probe_colors_rgb
var i18n_probe_cnames = ['red','green','blue','cyan','magenta','yellow','black','x-axis'];
