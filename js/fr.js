var i18n = {
error1: "Désolé, une erreur de navigateur s'est produite lors du démarrage de l'outil de schéma. Nous vous recommandons d'utiliser les dernières versions de Firefox et Chrome.",
Ground_connection: 'Connexion à la terre',
Node_label: 'Étiquette de nœud',
Voltage_source: 'Source de tension',
Current_source: 'Source de courant',
Resistor: 'Résistance',
Capacitor: 'Capacité',
Inductor: 'Inductance',
Op_Amp: 'Ampli Op',
Diode: 'Diode',
NFet: 'NFet',
PFet: 'PFet',
NPN: 'NPN',
PNP: 'PNP',
Voltage_probe: 'Ampli Op',
Current_probe: 'Sonde de courant',
drag_onto_diagram: ': faites glisser ou appuyez pour insérer',
Help: "Aide: afficher la page d'aide",
Grid: "Grille: basculer l'affichage de la grille",
Link_tip: 'Lien: partager un lien vers le circuit',
Cut: 'Couper les composants sélectionnés dans le presse-papiers',
Copy:'Copier les composants sélectionnés dans le presse-papiers',
Paste:'Coller le presse-papiers dans le schéma',
Delete:'Supprimer les composants sélectionnés',
Rotate:'Faire pivoter le composant sélectionné',
Save_netlist: 'Enregistrer le schéma',
Open_netlist: 'Ouvrir le schéma',
Select_netlist: 'Selectionner le schéma',
Perform_DC_Analysis: 'Effectuer une analyse en DC',
DC_Analysis: 'Analyse en DC',
Perform_AC_Analysis: 'Effectuer une analyse des petits signaux AC',
Perform_Transient_Analysis: 'Effectuer une analyse transitoire',
Transient_Analysis: 'Analyse transitoire',
Edit_Properties: 'Modifier les propriétés',
Link: 'Lien',
Sharable_Link: 'Lien partageable',

points_per_decade: 'Nombre de points / décade',
Starting_frequency: 'Fréquence de démarrage (Hz)',
Ending_frequency: 'Fréquence de fin (Hz)',	
source_for_ac: 'Nom de la source (V) ou (I) pour l’AC',
AC_Analysis_add_a_voltage_probe: 'Analyse AC: ajoutez une sonde de tension au diagramme!',
AC_Analysis: 'Analyse AC',
Zero_ac_response: "Réponse zéro AC, -infini sur l'échelle dB.",
Near_zero_ac_response: 'Réponse quasi nulle en courant alternatif, supprimer ',
probe: ' sonde',

// Alerts and warnings from the circuit simulator
Alert: 'Alerte',
ckt_alert1: 'Avertissement! Le circuit a une boucle de source de tension ou une source ou une sonde de courant court-circuitée par un fil, veuillez retirer la source ou le fil causant le court-circuit.',
ckt_alert2: 'Avertissement! Le simulateur peut produire des résultats dénués de sens ou aucun résultat avec des circuits illégaux.',
ckt_warning1: 'Avertissement! Deux éléments de circuit partagent le même nom ',
ckt_alert3: 'Veuillez effectuer au moins une connexion à la terre.',
ckt_alert4: 'La méthode Newton a échoué; vos sources de courant ont-elles un chemin conducteur vers la terre?',
ckt_alert5: 'La méthode Newton a échoué; ce peut être votre circuit ou notre simulateur.',
ckt_alert6: 'DC a échoué, en essayant une analyse transitoire à partir de zéro.',
ckt_alert7: "L'analyse AC fait référence à une source inconnue, ",
ckt_alert8: "L'analyse AC a échoué, source inconnue.",	

//ckt_error1: 'Rows of M mismatched to b or cols mismatch to x.',
//ckt_error2: 'Row or columns of A too large for B',
//ckt_error3: 'Row or columns of A too large for C',
//ckt_error4: 'scalea and scaleb must be scalars or Arrays',
//ckt_error5: 'Rows or cols > rows or cols of dest',
//ckt_error6: 'Rows or cols > cols or rows of dest',	    	    

log_Frequency: 'log10(fréquence en Hz)',
degrees: 'degrés',
AC_Phase: 'Phase AC',
AC_Magnitude: 'Amplitude AC',

Minimum_number_of_timepoints: 'Nombre minimum de points temporels',
Stop_time_seconds: "Temps d'arrêt (sec)",
tstop_lbl: "temps d'arrêt",
Transient_Analysis_add_a_probe: 'Analyse des transitoires: ajoutez une sonde au diagramme!',

//Use creative phrasing to get this sentence to come out right: 
// alert('The ' + color + ' probe is connected to node ' + '"' + label + '"' + ', which is not an actual circuit node');
The: 'Le ',
probe_is_connected_to_node: ' la sonde est connectée au nœud ',
which_is_not_an_actual_circuit_node: ", qui n'est pas un nœud de circuit réel",

Voltage: 'Tension',
Current: 'Courant',
Time: 'Temps',
Node_has_two_conflicting_labels: 'Le nœud a deux étiquettes en conflit: ',

DC_value: 'Valeur DC',

impulse: 'impulsion',
Height: 'Hauteur',
Width: 'Largeur (sec)',

step: 'étape',
Initial_value: 'Valeur initiale',
Plateau_value: 'Valeur du palier',
Delay_until_step: "Délai jusqu'à l'étape (sec)",
Rise_time: 'Temps de montée (sec)',

square: 'carrée',
Frequency: 'Fréquence (Hz)',
Duty_cycle: 'Cycle de service (%)',

triangle: 'triangle',
ramp: 'rampe',
Slope: 'Pente (volts / sec)',

pwl: 'pwl',
pwl_repeating: 'pwl (répétition)',
Comma_separated_list: "Liste séparée par des virgules d'heures et de valeurs en alternance",

pulse: 'impulsion',
Delay_until_pulse: 'Délai avant impulsion (sec)',
Time_for_first_transition: 'Temps de première transition (sec)',
Time_for_second_transition: 'Temps pour la deuxième transition (sec)',
Pulse_width: "Largeur d'impulsion (sec)",
Period: 'Période (sec)',

sin: 'sin',
Offset_value: 'Valeur de décalage',
Amplitude: 'Amplitude',
Delay_until_sin_starts: "Délai jusqu'à ce que le sin commence (sec)",
Phase_offset_degrees: 'Déphasage (degrés)',

Circuit_Sandbox_Help: 'AIDE DU CIRCUIT SANDBOX',
name: 'Nom',
value: 'Valeur',
label: 'Étiquette',
r: 'R',
c: 'C',
l: 'L',
color: 'Couleur',
offset: 'Décalage',
area: 'Aire',
type: 'Type',
normal: 'normal',
ideal: 'idéal',
is: 'Is',
Vt: 'Vt',
WL: 'W/L',
lambda: 'λ',
A: 'A',
Plot_color: 'Couleur du tracé',
Plot_offset: 'Décalage du tracé',
dc: 'dc',

Gain: 'A',
Rin: 'Rentrée',
Rout: 'Rsortie',

red: 'rouge',
green: 'vert',
blue: 'bleu',
cyan: 'cyan',
magenta: 'magenta',
yellow: 'jaune',
orange: 'orange',
black: 'noir',
xaxis: 'axe x',

Ics: 'Ics',
Ies: 'Ies',
alphaF: '𝛼F',
alphaR: '𝛼R',

scroll_ctl: "Scroll arrows. Also try Alt-drag or ⌥ Option-drag.",
//zoom_ctl: "Zoom: in/out/fit. Also try mouse or trackpad scroll.",
//rotate_ctl: "Rotate/Reflect",
//delete_ctl: "Delete",

last_line: 'dernière ligne, pas de virgule'
};

var strSHelp = "AIDE DU CIRCUIT SANDBOX\n";		//embedded Help 
var strAddC = "Ajouter un composant: appuyez sur une pièce dans le bac de pièces, puis appuyez sur le schéma.\n\n";
var strAddW = "Ajouter un fil: appuyez sur un point de connexion (cercle ouvert) pour commencer. Glisser. Libérer.\n\n";
var strSel  = "Sélectionner: faites glisser un rectangle pour sélectionner des composants. (bureau :) Cliquez en maintenant la touche Maj enfoncée pour inclure un autre composant.\n\n";
var strMove = "Déplacer: touchez et faites glisser vers un nouvel emplacement.\n\n";
var strDel  = "Supprimer: appuyez pour sélectionner, puis appuyez sur l'icône X ou appuyez sur RETOUR ARRIÈRE.\n\n";
var strRot  = "Rotation / Réflexion: Cliquez pour sélectionner, puis cliquez sur l'icône de rotation ou tapez la lettre «r» pour faire pivoter 90. Répétez pour plus de rotations et de réflexions (8 au total).\n\n";
var strView = "";
var strProp = "Propriétés: appuyez deux fois pour modifier ses propriétés.\n\n";
var strNum  = "Les nombres peuvent être saisis en notation technique,\n\
T 10^12, G 10^9, M 10^6, k 10^3, m 10^-3, u 10^-6, n 10^-9, p 10^-12, f 10^-15";
