var i18n = {
error1: 'Lo sentimos, hay un error del navegador en empezando la herramienta esquemática. Recomendamos el uso de las versiones más nuevas de Firefox y Chrome.',
Ground_connection: 'Conexión a tierra',
Node_label: 'Etiqueta de un nodo',
Voltage_source: 'Fuente de voltaje',
Current_source: 'Fuente de corriente',
Resistor: 'Resistor',
Capacitor: 'Condensador',
Inductor: 'Inductor',
Op_Amp: 'Op Amp',
Diode: 'Diodo',
NFet: 'NFet',
PFet: 'PFet',
Voltage_probe: 'sonda de voltaje',
Current_probe: 'sonda de corriente',
drag_onto_diagram: ': arrastrar en el diagrama para insertar',
Help: 'Ayuda: página de ayuda',
Grid: 'Grid: toggle grid display',
Cut: 'Cortar: cortar componentes seleccionados al portapapeles',
Copy:'Copiar: copiar componentes seleccionados al portapapeles',
Paste:'Pegar: copiar portapapeles al esquema',
Delete:'Borrar componentes seleccionados',
Rotate:'Rotar componente seleccionado',
Download_netlist: 'Descargar netlist',
Import_netlist: 'Importar netlist',
Select_netlist: 'Seleccionar netlist',
DC_Analysis: 'Análisis DC',
AC_Small_Signal_Analysis: 'Análisis de AC Pequeño-Señal',
Transient_Analysis: 'Análisis de Transitorios',
Edit_Properties: 'Editar Propiedades',

Number_of_points_per_decade: 'Número de puntos/década',
Starting_frequency: 'Frecuencia de arranque (Hz)',
Ending_frequency: 'Frecuencia de fin (Hz)',	
Name_of_V_or_I_source_for_ac: 'Nombre de fuente V o I  para ac',
AC_Analysis_add_a_voltage_probe: "Análisis de AC: añadir una sonda de voltaje al diagrama!",
AC_Analysis: 'Análisis de AC',
Zero_ac_response: 'Cero respuesta de ac, -infinity en la escala de Db.',
Near_zero_ac_response: 'Cerca de respuesta de ac a cero, sacar ',
probe: ' sonda',

// Alerts and warnings from the circuit simulator
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

// added since sharing with Jake
Minimum_number_of_timepoints: 'Minimum number of timepoints',
Stop_time_seconds: 'Stop time (seconds)',
Transient_Analysis_add_a_probe: 'Transient Analysis: add a probe to the diagram!',
Voltage: 'Voltaje',
Current: 'Corriente',
Time: 'Tiempo',
Node_has_two_conflicting_labels: 'Node has two conflicting labels: ',

last_line: 'last, no comma'
};

// translateable color names, not to be confused with variables: probe_names or probe_colors or probe_colors_rgb
var i18n_probe_cnames = ["rojo", "verde", "azul", "cian", "magenta", "amarillo", "negro",'x-axis'];


/*


'log(Frequency in Hz)'
'degrees'
'AC Phase'
'log(Frequency in Hz)'
'dB'
'AC Magnitude'

'Minimum number of timepoints'
'Stop time (seconds)'
"Transient Analysis: add a probe to the diagram!"
'Transient Analysis'
' probe is connected to node '
' which is not an actual circuit node')
'Voltage'
'Current'
'Voltage'
'Current'
'Transient Analysis'

"Node has two conflicting labels: "

	var probe_colors = ['red','green','blue','cyan','magenta','yellow','black','x-axis'];
// These are names AND keys of a case statement, need to separate function.

'<Probe ('
'Plot color'	//maybe not needed
'Plot offset'	//maybe not needed
'Edit Properties'

'<Ammeter ('
'<Resistor '
'<Capacitor '
'<Inductor '
'<Diode '
'normal'
'ideal'
'area'

'name'
'W/L'
'<NFet '
'<PFet '
'<OpAmp'

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
*/
