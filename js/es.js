var i18n = {
error1: 'Lo sentimos, hay un error del navegador al iniciar la herramienta esquemática. Recomendamos el uso de las versiones más nuevas de Firefox y Chrome.',
Ground_connection: 'Conexión a tierra',
Node_label: 'Etiqueta para nodo',
Voltage_source: 'Fuente de voltaje',
Current_source: 'Fuente de corriente',
Resistor: 'Resistor',
Capacitor: 'Condensador',
Inductor: 'Inductor',
Op_Amp: 'Amp Op',
Diode: 'Diodo',
NFet: 'NFet',
PFet: 'PFet',
NPN: 'NPN',
PNP: 'PNP',
Voltage_probe: 'Sensor de voltaje',
Current_probe: 'Sensor de corriente',
drag_onto_diagram: ': arrastre o pulse para insertar',
Help: 'Ayuda: página de ayuda',
Grid: 'Rejilla: Mostrar/ocultar rejilla',
Link_tip: 'Link: Compartir un enlace al circuito',
Cut: 'Cortar componentes seleccionados al portapapeles',
Copy:'Copiar componentes seleccionados al portapapeles',
Paste:'Pegar portapapeles al esquema',
Delete:'Borrar componentes seleccionados',
Rotate:'Rotar componente seleccionado',
Save_netlist: 'Guardar la lista de conexiones',
Open_netlist: 'Abrir la lista de conexiones',
Select_netlist: 'Seleccionar netlist',
Perform_DC_Analysis: 'Realizar análisis DC',
DC_Analysis: 'Análisis DC',
Perform_AC_Analysis: 'Realizar análisis AC de pequeña-señal',
Perform_Transient_Analysis: 'Realizar Análisis transitorio',
Transient_Analysis: 'Análisis transitorio',
Edit_Properties: 'Editar Propiedades',
Link: 'Enlace',
Sharable_Link: 'Compartir enlace',

points_per_decade: 'Número de puntos/década',
Starting_frequency: 'Frecuencia inicial (Hz)',
Ending_frequency: 'Frecuencia final (Hz)',	
source_for_ac: 'Nombre de fuente V o I  para ac',
AC_Analysis_add_a_voltage_probe: "Análisis AC: ¡añadir un sensor de voltaje al diagrama!",
AC_Analysis: 'Análisis AC',
Zero_ac_response: 'Respuesta cero de ac, -infinito en la escala dB.',
Near_zero_ac_response: 'Cerca de respuesta cero de ac, expulsar ',
probe: ' sensor',

// Alerts and warnings from the circuit simulator
Alert: '¡Alerta!',
ckt_alert1: '¡Advertencia! El circuito tiene bucle en la fuente de voltaje o o una fuente o sensor de corriente haciendo cortocircuito en un cable, favor de quitar la fuente o el cable que causa el corto.',
ckt_alert2: '¡Advertencia! El simulador podría producir resultados sin sentido o sin resultados con circuitos ilegales.',
ckt_warning1: '¡Advertencia! Dos elementos del circuito comparten el mismo nombre ',
ckt_alert3: 'Por favor, haga al menos una conexión a tierra.',
ckt_alert4: 'El método de Newton falló. ¿Sus fuentes de corriente tienen una conexión a tierra?',
ckt_alert5: 'El método de Newton falló, puede ser su circuito o puede ser nuestro simulador.',
ckt_alert6: 'DC falló, tratando análisis transitorio de cero.',
ckt_alert7: 'Análisis AC refiere a una fuente desconocida, ',
ckt_alert8: 'Análisis AC falló, fuente desconocida.',

//ckt_error1: 'Los renglones M no coinciden con b o hay un desajuste con las columnas x.',
//ckt_error2: 'Renglones o columnas de A demasiado grandes para B',
//ckt_error3: 'Renglones o columnas de A demasiado grande para C',
//ckt_error4: 'scalea y scaleb deben ser escalares o Arreglos',
//ckt_error5: 'Renglones o columnas > renglones o columnas de destino',
//ckt_error6: 'Renglones o columnas > columnas o renglones de destino',	 

log_Frequency: 'log10(Frecuencia en Hz)',
degrees: 'grados',
AC_Phase: 'Fase AC',
AC_Magnitude: 'Magnitud de AC',

Minimum_number_of_timepoints: 'Número mínimo de puntos de tiempo',
Stop_time_seconds: 'Detener en el tiempo (segundos)',
tstop_lbl: 'tiempo final',
Transient_Analysis_add_a_probe: 'Análisis transitorio: ¡añadir un sensor al diagrama!',

//Use creating phrasing to get this right: 
// alert('El sensor ' + color + ' está conectado al nodo ' + '"' + label + '"' + ' que no es un nodo del circuito en este momento');
The: 'El sensor ',
probe_is_connected_to_node: ' está conectado al nodo ',
which_is_not_an_actual_circuit_node: ' que no es un nodo del circuito en este momento',

Voltage: 'Voltaje',
Current: 'Corriente',
Time: 'Tiempo',
Node_has_two_conflicting_labels: 'Nodo tiene dos etiquetas en conflicto: ',

DC_value: 'Valor DC',

impulse: 'impulso',
Height: 'Altura',
Width: 'Ancho (segundos)',

step: 'paso',
Initial_value: 'Valor inicial',
Plateau_value: 'Valor meseta',
Delay_until_step: 'Retardo hasta el paso (seg)',
Rise_time: 'Tiempo de subida (seg)',

square: 'cuadrado',
Frequency: 'Frecuencia (Hz)',
Duty_cycle: 'Ciclo de trabajo (%)',

triangle: 'triángulo',
ramp: 'rampa',
Slope: 'Pendiente (voltios/seg)',

pwl: 'pwl',
pwl_repeating: 'pwl (repitiendo)',
Comma_separated_list: 'Lista separada por comas de los tiempos y valores alternos',

pulse: 'pulso',
Delay_until_pulse: 'Retardo hasta el pulso (seg)',
Time_for_first_transition: 'Tiempo para la primera transición (seg)',
Time_for_second_transition: 'Tiempo para la segunda transición (seg)',
Pulse_width: 'Ancho de pulso (segundos)',
Period: 'Período (seg)',

sin: 'seno',
Offset_value: 'Valor de desplazamiento',
Amplitude: 'Amplitud',
Delay_until_sin_starts: 'Retardo hasta el inicio del seno (seg)',
Phase_offset_degrees: 'Desplazamiento de fase (grados)',

Circuit_Sandbox_Help: 'AYUDA PARA PRUEBAS',
name: 'Nombre',
value: 'Valor',
label: 'Etiqueta',
r: 'R',
c: 'C',
l: 'L',
color: 'Color',
offset: 'Compensar',
area: 'Área',
type: 'Tipo',
normal: 'normal',
ideal: 'ideal',
is: 'Is',
Vt: 'Vt',
WL: 'W/L',
lambda: 'λ',
A: 'A',
Plot_color: 'Color del gráfico',
Plot_offset: 'Compensar gráfica',
dc: 'dc',

Gain: 'A',
Rin: 'Rin',
Rout: 'Rout',

red: 'rojo',
green: 'verde',
blue: 'azul',
cyan: 'cian',
magenta: 'magenta',
yellow: 'amarillo',
orange: 'naranja',
black: 'negro',
xaxis: 'eje x',

Ics: 'Ics',
Ies: 'Ies',
alphaF: '𝛼F',
alphaR: '𝛼R',

scroll_ctl: "Desplazarse. También, con el ratón o el trackpad: mantenga pulsada la tecla Alt u  ⌥Opción y arrastre.",
//scroll_ctl: "Zoom: in/out/fit. Also mouse or trackpad.",
zoom_ctl: "Acercar/alejar/ajustar. También usar el ratón o el trackpad.",
//zoom_ctl: "Zoom: in/out/fit. Also mouse or trackpad scroll.",
rotate_ctl: "Rotar/Reflejar. También tecla 'r'.",
//rotate_ctl: "Rotate/Reflect. Also 'r' key.",
delete_ctl: "Borrar. También tecla de retroceso o suprimir.",
//delete_ctl: "Delete. Also backspace or delete key.",
last_line: 'última líena, sin coma'
};

var strSHelp = "AYUDA DEL CIRCUITO DE PRUEBAS \n\n"; // Ayuda incrustado
var strAddC = "Añadir componente: Haga clic en una parte en la papelera y a continuación haga clic en el esquema para añadir. \n\n";
var strAddW = "Añadir cable: los cables comienzan a partir de los puntos de conexión (círculos abiertos). Haga clic en una conexión para iniciar un cable, arrastre y suelte. \n\n";
var strSel = "Seleccionar: Arrastre en rectángulo para seleccionar los componentes. Shift clic para incluir otro componente. \n\n";
var strMove = "Mover: Haga clic para seleccionar y a continuación arrastre a una nueva ubicación. \n\n";
var strDel = "Borrar: Seleccionar y a continuación haga clic en el icono X o presione RETROCESO. \n\n";
var strRot = "Rotar/Reflejar: Haga clic para seleccionar, a continuación, haga clic en el icono de rotación o presione la letra \"r\" para girar 90. Repetir para más rotaciones y reflexiones. \n\n";
var strView = "";
var strProp = "Propiedades: Haga doble clic en un componente para cambiar los valores. \n\n";
var strNum = "Sufijos numéricos se pueden introducir con notación de ingeniería: \n\
T = 10^12, G = 10^9, M = 10^6, k = 10^3\n\
m = 10^-3, u = 10^-6, n = 10^-9, p = 10^-12, f = 10^-15";
