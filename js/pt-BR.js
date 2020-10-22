var i18n = {
error1: 'Desculpe-nos, houve um erro na inicialização da ferramenta de esquemático. Nós recomendamos utilizar as últimas versões de Firefox e Chrome.',
Ground_connection: 'Conexão Terra',
Node_label: 'Rótulo do nó',
Voltage_source: 'Fonte de tensão',
Current_source: 'Fonte de corrente',
Resistor: 'Resistor',
Capacitor: 'Capacitor',
Inductor: 'Indutor',
Op_Amp: 'Amp Op',
Diode: 'Diodo',
NFet: 'NFet',
PFet: 'PFet',
NPN: 'NPN',
PNP: 'PNP',
Voltage_probe: 'Ponta de prova de tensão',
Current_probe: 'Ponta de prova de corrente',
drag_onto_diagram: ': arraste ou clique para inserir',
Help: 'Ajuda: Mostrar página de ajuda',
Grid: 'Grade: Alternar visualização',
Link_tip: 'Link: Compartilhe um link para o circuito',
Cut: 'Cortar os componentes selecionados para a área de transferência',
Copy: 'Copiar os componentes selecionados para a área de transferência',
Paste: 'Colar no esquemático',
Delete: 'Deletar componentes selecionados',
Rotate: 'Girar componente selecionado',
Save_netlist: 'Salvar netlist',
Open_netlist: 'Abrir netlist',
Select_netlist: 'Selecionar netlist',
Perform_DC_Analysis: 'Realizar análise DC',
DC_Analysis: 'Análise DC',
Perform_AC_Analysis: 'Realizar análise AC para pequenos sinais',
Perform_Transient_Analysis: 'Realizar Análise Transitória',
Transient_Analysis: 'Análise Transitória',
Edit_Properties: 'Editar propriedades',
Link: 'Link',
Sharable_Link: 'Link compartilhável',

points_per_decade: 'Número de pontos/década',
Starting_frequency: 'Frequência inicial',
Ending_frequency: 'Frequência final',
source_for_ac: 'Nome de fonte V ou I para AC',
AC_Analysis_add_a_voltage_probe: 'Análise AC: adicionar ponta de prova de tensão ao diagrama!',
AC_Analysis: 'Análise AC',
Zero_ac_response: 'Resposta AC zero, -infinito em escala dB.',
Near_zero_ac_response: 'Resposta AC próxima de zero, remover ',
probe: ' ponta de prova',

// Alerts and warnings from the circuit simulator
Alert: 'Alerta',
ckt_alert1: 'Aviso! O circuito tem uma malha de tensão, fonte ou ponta de prova de corrente curto-circuitada por um fio, favor remover a fonte ou fio causando o curto.',
ckt_alert2: 'Aviso! O simulador pode obter resultados sem sentido ou resultado nenhum com circuitos inválidos.',
ckt_warning1: 'Aviso! Dois elementos de circuito possuem o mesmo nome ',
ckt_alert3: 'Por favor, faça pelo menos uma conexão ao Terra.',
ckt_alert4: 'O Método de Newton falhou; suas fontes de corrente estão conectadas ao terra?',
ckt_alert5: 'O Método de Newton falhou; pode ser seu circuito ou o nosso simulador.',
ckt_alert6: 'A DC falhou, tentando Análise Transitória do zero.',
ckt_alert7: 'A Análise AC aponta para uma fonte desconhecida, ',
ckt_alert8: 'A análise AC falhou, fonte desconhecida.',

//ckt_error1: 'Linhas de M incompatíveis com b ou colunas incompatíveis com x.',
//ckt_error2: 'Linhas ou colunas de A muito grandes para B',
//ckt_error3: 'Linhas ou colunas de A muito grandes para C',
//ckt_error4: 'scalea e scaleb devem ser escalares ou vetores',
//ckt_error5: 'Linhas ou colunas > linhas ou colunas do dest',
//ckt_error6: 'Linhas ou colunas > colunas ou linhas de dest',

log_Frequency: 'log(Frequência em Hz)',
degrees: 'graus',
AC_Phase: 'Ângulo de fase AC',
AC_Magnitude: 'Magnitude AC',

Minimum_number_of_timepoints: 'Número mínimo de pontos no tempo',
Stop_time_seconds: 'Tempo de parada (segundos)',
tstop_lbl: 'tempo de parada',
Transient_Analysis_add_a_probe: 'Análise Transitória: adicione uma ponta de prova ao diagrama!',

//Use creative phrasing to get this sentence to come out right: 
// alert('The ' + color + ' probe is connected to node ' + '"' + label + '"' + ', which is not an actual circuit node');
The: 'A ',
probe_is_connected_to_node: ' ponta de prova está conectada ao nó ',
which_is_not_an_actual_circuit_node: ', que não é um nó válido no circuito.',

Voltage: 'Tensão',
Current: 'Corrente',
Time: 'Tempo',
Node_has_two_conflicting_labels: 'O nó tem dois rótulos em conflito: ',

DC_value: 'Valor DC',

impulse: 'impulso',
Height: 'Altura',
Width: 'Largura (s)',

step: 'passo',
Initial_value: 'Valor inicial',
Plateau_value: 'Valor de Plateau',
Delay_until_step: 'Atraso até o passo (s)',
Rise_time: 'Tempo de subida (s)',

square: 'quadrada',
Frequency: 'Frequência (Hz)',
Duty_cycle: 'Ciclo de trabalho (%)',

triangle: 'triangular',

pwl: 'Piecewise Linear (PWL)',
pwl_repeating: 'PWL (repetir)',
Comma_separated_list: 'Lista, separada por vírgulas, de tempos e valores alternados',

pulse: 'pulso',
Delay_until_pulse: 'Atraso até o pulso (s)',
Time_for_first_transition: 'Tempo para a primeira transição (s)',
Time_for_second_transition: 'Tempo para a segunda transição (s)',
Pulse_width: 'Lagura de pulso (s)',
Period: 'Período (s)',

sin: 'sen',
Offset_value: 'Valor de deslocamento',
Amplitude: 'Amplitude',
Delay_until_sin_starts: 'Atraso até o sen começar (s)',
Phase_offset_degrees: 'Deslocamento de fase (graus)',

Circuit_Sandbox_Help: 'AJUDA DO CIRCUIT SANDBOX',
name: 'Nome',
value: 'Valor',
label: 'Rótulo',
r: 'R',
c: 'C',
l: 'L',
color: 'Cor',
offset: 'Deslocamento',
area: 'Área',
type: 'Tipo',
normal: 'normal',
ideal: 'ideal',
is: 'Is',
Vt: 'Vt',
WL: 'Largura / Comprimento',
A: 'A',
Plot_color: 'Cor do gráfico',
Plot_offset: 'Deslocamento do gráfico',
dc: 'dc',

Gain: 'A',
Rin: 'Rin',
Rout: 'Rout',

red: 'vermelho',
green: 'verde',
blue: 'azul',
cyan: 'ciano',
magenta: 'magenta',
yellow: 'amarelo',
orange: 'laranja',
black: 'preto',
xaxis: 'eixo x',

Ics: 'Ics',
Ies: 'Ies',
alphaF: 'αF',
alphaR: 'αR',
last_line: 'última linha, sem vírgula'
};

var strSHelp = "AJUDA DO CIRCUIT SANDBOX\n\n";		//embedded Help 
var strAddC = "Adicionar componente: clique em uma parte no caixote de peças, em seguida, clique no esquema.\n\n";
var strAddW = "Adicionar fio: Clique num ponto de conexão (círculo aberto) Arrastar. Soltar.\n\n";
var strSel = "Selecionar: Arraste um retângulo para selecionar componentes. \n(desktop:) Shift-click para incluir outro componente.\n\n";
var strMove = "Mover: Toque e arraste para outro local.\n\n";
var strDel = "Deletar: Clique para selecionar, depois clique no X ou pressione BACKSPACE.\n\n";
var strRot = "Rodar/Refletir: Clique para selecionar, e depois clique no ícone de rotação ou aperte \"r\" para rodar 90. Repetir para mais rotações e reflexões (8 total).\n\n";
var strProp = "Propriedades: Clique duas vezes num componente para alterar suas propriedades.\n\n";
var strNum = "Números podem ser inseridos utilizando a notação de engenharia,\n\
T = 10^12, G = 10^9, M = 10^6, k = 10^3\n\
m = 10^-3, u = 10^-6, n = 10^-9, p = 10^-12, f = 10^-15";
