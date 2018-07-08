var i18n = {
error1: '回路図ツールの開始にあたってブラウザのエラーがありました。最新バージョンの Firefox および Chrome の使用をお勧めします。',
Ground_connection: 'アース接続',
Node_label: 'ノードラベル',
Voltage_source: '電圧源',
Current_source: '電流源',
Resistor: '抵抗器',
Capacitor: 'コンデンサ',
Inductor: 'インダクタ',
Op_Amp: 'オペアンプ',
Diode: 'ダイオード',
NFet: 'NFet',
PFet: 'PFet',
Voltage_probe: '電圧プローブ',
Current_probe: '電流プローブ',
drag_onto_diagram: ': ドラッグまたはタップして挿入する',
Help: 'ヘルプ: ヘルプページを表示する',
Grid: 'グリッド: グリッド表示を切り替える',
Link_tip: 'リンク: 回路へのリンクを共有する',
Cut: '選択したコンポーネントをクリップボードにカットする',
Copy:'選択したコンポーネントをクリップボードにコピーする',
Paste:'クリップボードを回路図に貼り付ける',
Delete:'選択したコンポーネントを削除する',
Rotate:'選択したコンポーネントを回転させる',
Save_netlist: 'ネットリストを保存する',
Open_netlist: 'ネットリストを開く',
Select_netlist: 'ネットリストを選択する',
Perform_DC_Analysis: 'DC 解析を実行する',
DC_Analysis: 'DC 解析',
Perform_AC_Analysis: 'AC 小信号解析を実行する',
Perform_Transient_Analysis: '過渡解析を実行する',
Transient_Analysis: '過渡解析',
Edit_Properties: 'プロパティを編集する',
Link: 'リンク',
Sharable_Link: '共有可能なリンク',

points_per_decade: 'ポイント数/ディケード',
Starting_frequency: '開始周波数 (Hz) ',
Ending_frequency: '終了周波数 (Hz)',	
source_for_ac: 'AC の V または I ソース名',
AC_Analysis_add_a_voltage_probe: 'AC 解析: 電圧プローブを図に追加してください!',
AC_Analysis: 'AC 解析',
Zero_ac_response: 'AC 応答ゼロ、dB スケールで無限大',
Near_zero_ac_response: 'AC 応答がゼロに近い、取り除く',
probe: ' プローブ',

// Alerts and warnings from the circuit simulator
Alert: '警報',
ckt_alert1: '警告!!! 回路に電圧源ループがある、あるいは電源または電流プローブがワイヤで短絡しています。短絡の原因となっている電源またはワイヤを取り除いてください。',
ckt_alert2: '警告!!! シミュレータが無意味な結果をもたらす、または不正回路が原因で結果が得られないことがあります。',
ckt_warning1: '警告:  2つの回路要素が同じ名前を共有しています。',
ckt_alert3: '少なくとも1つはアース接続してください (三角記号)。',
ckt_alert4: 'ニュートン法に失敗しました。電流源には接地への導電性パスがありますか？',
ckt_alert5: 'ニュートン法に失敗しました。あなたの回路またはこちらのシミュレータに問題があるかもしれません。',
ckt_alert6: 'DC に失敗しました。過渡解析をゼロから始めてください。',
ckt_alert7: 'AC 解析が未知のソースに言及しています ',
ckt_alert8: 'AC 解析に失敗しました。未知のソース',	

ckt_error1: 'Rows of M mismatched to b or cols mismatch to x.',
ckt_error2: 'Row or columns of A too large for B',
ckt_error3: 'Row or columns of A too large for C',
ckt_error4: 'scalea and scaleb must be scalars or Arrays',
ckt_error5: 'Rows or cols > rows or cols of dest',
ckt_error6: 'Rows or cols > cols or rows of dest',	    	    

log_Frequency: 'ログ (周波数 Hz)',
degrees: '度',
AC_Phase: '交流位相',
AC_Magnitude: 'AC の大きさ',

Minimum_number_of_timepoints: '時点の最小数',
Stop_time_seconds: '停止時間 (秒)',
tstop_lbl: '停止時間',
Transient_Analysis_add_a_probe: '過渡解析: プローブを図に追加してください!',

//Use creating phrasing to get this right: 
// alert('The ' + color + ' probe is connected to node ' + '"' + label + '"' + ' which is not an actual circuit node');
The: ' ',
probe_is_connected_to_node: ' プローブは、実際の回路ノードでない  ',
which_is_not_an_actual_circuit_node: ' ノードに接続されている',

Voltage: '電圧',
Current: '電流',
Time: '時間',
Node_has_two_conflicting_labels: 'ノードには2つの相反するラベルがついている: ',

DC_value: 'DC 値',

impulse: 'インパルス',
Height: '高さ',
Width: '幅 (秒)',

step: 'ステップ',
Initial_value: '初期値',
Plateau_value: 'プラトー値',
Delay_until_step: 'ステップまで遅らせる (秒)',
Rise_time: '立ち上がり時間 (秒)',

square: '四角',
Frequency: '周波数 (Hz)',
Duty_cycle: 'デューティサイクル (%)',

triangle: '三角',

pwl: 'pwl',
pwl_repeating: 'pwl (反復)',
Comma_separated_list: '時間と値が交互になったコンマ分離リスト',

pulse: 'パルス',
Delay_until_pulse: 'パルスまで遅らせる (秒)',
Time_for_first_transition: '最初の移行までの時間 (秒)',
Time_for_second_transition: '2番目の移行までの時間 (秒)',
Pulse_width: 'パルス幅 (秒)',
Period: '期間 (秒)',

sin: 'サイン',
Offset_value: 'オフセット値',
Amplitude: '振幅',
Delay_until_sin_starts: 'サイン開始まで遅らせる (秒)',
Phase_offset_degrees: 'フェーズオフセット (度)',

Circuit_Sandbox_Help: 'サーキットサンドボックスのヘルプ',
name: '名称',
value: '値',	
label: 'ラベル',
r: 'R',
c: 'C',
l: 'L',
color: 'カラー',
offset: 'オフセット',
area: 'エリア',
type: 'Type',
normal: '標準',
ideal: '理想的',
WL: '幅/長さ',
A: 'A',
Plot_color: 'プロットカラー',
Plot_offset: 'プロットオフセット',
dc: 'dc',

red: 'レッド',
green: 'グリーン',
blue: 'ブルー',
cyan: 'シアン',
magenta: 'マゼンタ',
yellow: 'イエロー',
orange: 'オレンジ',
black: 'ブラック',
xaxis: 'x 軸',

last_line: '最後の行、コンマ無し'
};

var strSHelp = "サーキットサンドボックスのヘルプ \n\n";		//embedded Help 
var strAddC = "コンポーネントを追加する: パーツビンのパーツをタップし、次に回路図をタップする。\n\n";
var strAddW = "ワイヤを追加する: 接続ポイント (白丸) にタッチして始める。ドラッグする。リリースする。\n\n";
var strSel  = "選択する: 長方形をドラッグしてコンポーネントを選ぶ。 \n(デスクトップ:) 別のコンポーネントも含めるには、シフトクリックする。\n\n";
var strMove = "動かす: タッチして新しい場所にドラッグする。\n\n";
var strDel  = "削除する: タップして選び、次に X アイコンをタップするまたはバックスペースキーを押す。\n\n";
var strRot  = "回転/反転させる: クリックして選び、次に回転アイコンをクリックするか、90度回転の場合は r のキーをタイプする。さらに回転/反転させたい場合は繰り返す (最高8回まで)。\n\n";
var strProp = "プロパティープロパティーを変えるにはコンポーネントをダブルタップする。\n\n";
var strNum  = "エンジニアリング表記法を使って数字を入れることもできる。\n\
T\t10^12     m\t10^-3    \n\
G\t10^9       u\t10^-6   \n\
M\t10^6       n\t10^-9   \n\
k \t10^3       p\t10^-12 \n\
                       f\t10^-15";
