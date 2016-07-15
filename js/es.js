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
ckt_alert1: '¡¡¡Advertencia!!! Circuito tiene un circuito de fuente de tensión o una fuente o sonda de corriente en cortocircuito por un cable, por favor, elimine la fuente o el cable que causa el corto.',
ckt_alert2: '¡¡¡Advertencia!!! Simulador podría producir resultados sin sentido o sin resultado con circuitos ilegales.',
ckt_warning1: 'Advertencia: dos elementos de circuito comparten el mismo nombre ',
ckt_alert3: 'Por favor, haga al menos una conexión a tierra (símbolo del triángulo)',
ckt_alert4: 'Método de Newton falló. ¿Sus fuentes de corriente tienen un camino conductor a tierra?',
ckt_alert5: 'Método de Newton no, puede ser su circuito o puede ser nuestro simulador.',
ckt_alert6: 'DC falló, tratando análisis transitorio de cero.',
ckt_alert7: 'Análisis AC se refiere a fuente desconocida ',
ckt_alert8: 'Análisis AC falló, fuente desconocida',

ckt_error1: 'Las filas de M cargado no coincide con b cols desajuste a x.',
ckt_error2: 'Fila o columnas de A es demasiado grande para B',
ckt_error3: 'Fila o columnas de A es demasiado grande para C',
ckt_error4: 'scalea y scaleb deben ser escalares o Matrices',
ckt_error5: 'Las filas ni columnas > filas ni columnas de destino',
ckt_error6: 'Las filas ni columnas > columnas ni filas de destino',	 

// added since sharing with Jake
log_Frequency: 'log (Frecuencia en Hz)',
degrees: 'grados',
AC_Phase: 'Fase de CA',
AC_Magnitude: 'Magnitud de AC',

Minimum_number_of_timepoints: 'Número mínimo de puntos de tiempo',
Stop_time_seconds: 'Detener el tiempo (segundos)',
Transient_Analysis_add_a_probe: 'Análisis de transitorios: añadir un sondeo al diagrama!',

//Use creating phrasing to get this right: 
// alert('The ' + color + ' probe is connected to node ' + '"' + label + '"' + ' which is not an actual circuit node');
The: 'El sonda ',
probe_is_connected_to_node: ' está conectado al nodo ',
which_is_not_an_actual_circuit_node: ' que no es un nodo de circuito real',

Voltage: 'Voltaje',
Current: 'Corriente',
Time: 'Tiempo',
Node_has_two_conflicting_labels: 'Nodo tiene dos etiquetas en conflicto: ',

DC_value: 'Valor de DC',

impulse: 'impulso',
Height: 'Altura',
Width: 'Ancho (segundos)',

step: 'paso',
Initial_value: 'Valor inicial',
Plateau_value: 'Valor meseta',					//??
Delay_until_step: 'Retardo hasta que el paso (seg)',
Rise_time: 'Tiempo de subida (seg)',

square: 'cuadrado',
Frequency: 'Frecuencia (Hz)',
Duty_cycle: 'Ciclo de trabajo (%)',

triangle: 'triángulo',

pwl: 'pwl',
Comma_separated_list: 'Lista separada por comas de los tiempos y valores alternos',

pwl_repeating: 'pwl_repeating',

pulse: 'pulso',
Delay_until_pulse: 'Retardo hasta que el pulso (seg)',
Time_for_first_transition: 'Tiempo para la primera transición (seg)',
Time_for_second_transition: 'Tiempo para la segunda transición (seg)',
Pulse_width: 'Ancho de pulso (segundos)',
Period: 'Período (seg)',

sin: 'sin',
Offset_value: 'Valor de desplazamiento',
Amplitude: 'Amplitud',
Delay_until_sin_starts: 'Retardo hasta que se inicia el sino (seg)',	//??
Phase_offset_degrees: 'Desplazamiento de fase (grados)',

last_line: 'last, no comma'
};

// translated color names, not to be confused with variables: probe_names or probe_colors or probe_colors_rgb
var i18n_probe_cnames = ["rojo", "verde", "azul", "cian", "magenta", "amarillo", "negro",'x-axis'];
