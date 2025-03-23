var i18n = { 
error1: '抱歉，启动原理图工具时出现浏览器错误。我们建议使用最新版本的Firefox和Chrome。',
Ground_connection: '接地连接',
Node_label: '节点标签',
Voltage_source: '电压源',
Current_source: '电流源',
Resistor: '电阻',
Capacitor: '电容',
Inductor: '电感',
Op_Amp: '运算放大器',
Diode: '二极管',
NFet: 'N沟道MOS管',
PFet: 'P沟道MOS管',
NPN: 'NPN',
PNP: 'PNP',
Voltage_probe: '电压探头',
Current_probe: '电流探头',
drag_onto_diagram: ': 拖动或点击插入',
Help: '帮助：显示帮助页面',
Grid: '网格：切换网格显示',
Link_tip: '链接：分享电路的链接',
Cut: '剪切选定的组件到剪贴板',
Copy:'将选定的组件复制到剪贴板',
Paste:'将剪贴板粘贴到原理图上',
Delete:'删除选定的组件',
Rotate:'旋转选定的组件',
Save_netlist: '保存网表',
Open_netlist: '打开网表',
Select_netlist: '选择网表',
Perform_DC_Analysis: '执行直流分析',
DC_Analysis: '直流分析',
Perform_AC_Analysis: '执行交流小信号分析',
Perform_Transient_Analysis: '执行瞬态分析',
Transient_Analysis: '瞬态分析',
Edit_Properties: '编辑属性',
Link: '链接',
Sharable_Link: '分享链接',

points_per_decade: 'Number of points/decade',
Starting_frequency: '开始频率 (Hz)',
Ending_frequency: '结束频率 (Hz)',
source_for_ac: '需要交流分析的电压或电流源的名字',
AC_Analysis_add_a_voltage_probe: '交流分析：在电路图中添加一个电压探头！',
AC_Analysis: '交流分析',
Zero_ac_response: '交流响应为0，DB尺度上为负无穷',
Near_zero_ac_response: '接近零交流响应, 删除 ',
probe: ' 探针',

// Alerts and warnings from the circuit simulator
Alert: '警告',
ckt_alert1: '警告！电路有电压源回路或电源短路或电流探头短路，请移除导致短路的电源或导线。',
ckt_alert2: '警告！模拟器可能会产生无意义的结果，或者由于非法电路没有结果。',
ckt_warning1: '警告！两个电路元件共享相同的名称',
ckt_alert3: '请至少连接一个接地线。',
ckt_alert4: '牛顿法失败了，你电流源是否有接地？',
ckt_alert5: '牛顿法失败了，它可能是你的电路，也可能是我们的模拟器出错了。',
ckt_alert6: 'DC分析失败，尝试从零开始进行瞬态分析。',
ckt_alert7: 'AC 指向未知的源 ',
ckt_alert8: 'AC 分析失败, 未知源',

//ckt_error1: 'M行不匹配b或列与x不匹配。',
//ckt_error2: 'A的行或列对B太大',
//ckt_error3: 'A的行或列对于C来说太大',
//ckt_error4: '标量a和标量b必须是标量或数组',
//ckt_error5: '行或列 > dest的行或列',
//ckt_error6: '行或列 > dest的列或行',

log_Frequency: 'log10(频率单位 Hz)',
degrees: 'degrees',
AC_Phase: 'AC 相位',
AC_Magnitude: 'AC 幅度',

Minimum_number_of_timepoints: '最少数量的时间点',
Stop_time_seconds: '停止时间 (seconds)',
tstop_lbl: '停止时间',
Transient_Analysis_add_a_probe: '瞬态分析：为图表添加一个探针！',

//Use creating phrasing to get this right:
// alert('The ' + color + ' probe is connected to node ' + '"' + label + '"' + ' which is not an actual circuit node');
The: '这个 ',
probe_is_connected_to_node: ' 探针被链接到节点 ',
which_is_not_an_actual_circuit_node: ' 不是一个真实的电路节点',

Voltage: '电压',
Current: '电流',
Time: '时间',
Node_has_two_conflicting_labels: '节点有两个相互冲突的标签： ',

DC_value: '直流值',

impulse: '冲激信号',
Height: '高度',
Width: '宽度 (secs)',

step: '阶跃信号',
Initial_value: '初始值',
Plateau_value: '稳态值',
Delay_until_step: '延迟到阶跃发生 (secs)',
Rise_time: '上升时间 (secs)',

square: '方波信号',
Frequency: '频率 (Hz)',
Duty_cycle: '占空比 (%)',

triangle: '三角波',
ramp: '坡道',
Slope: '坡 (伏/秒)',

pwl: '分段线性',
pwl_repeating: '分段线性 (重复)',
Comma_separated_list: '逗号分隔的交替时间和值的列表',

pulse: '脉冲信号',
Delay_until_pulse: '延迟到脉冲发生 (secs)',
Time_for_first_transition: '第一次跳变时间 (secs)',
Time_for_second_transition: '第二次跳变时间 (secs)',
Pulse_width: '脉冲宽度 (secs)',
Period: '间隔 (secs)',

sin: '正弦信号',
Offset_value: '偏移值',
Amplitude: '振幅',
Delay_until_sin_starts: '延迟到正弦开始 (secs)',
Phase_offset_degrees: '相位偏移 (degrees)',

Circuit_Sandbox_Help: 'CIRCUIT SANDBOX 帮助',
name: '名字',
value: '值',
label: '标签',
r: 'R',
c: 'C',
l: 'L',
color: '颜色',
offset: '偏移',
area: 'Area',
type: '类型',
normal: 'normal',
ideal: 'ideal',
is: 'Is',
Vt: 'Vt',
WL: 'W/L',
lambda: 'λ',
A: 'A',
Plot_color: '绘制颜色',
Plot_offset: '绘图偏移',
dc: 'dc',

Gain: 'A',
Rin: 'Rin',
Rout: 'Rout',

red: '红色',
green: '绿色',
blue: '蓝色',
cyan: '青色',
magenta: '品红色',
yellow: '黄色',
orange: '橙色',
black: '黑色',
xaxis: 'x 轴',

Ics: 'Ics',
Ies: 'Ies',
alphaF: '𝛼F',
alphaR: '𝛼R',

scroll_ctl: "Scroll arrows. Also try Alt-drag or ⌥ Option-drag.",
zoom_ctl: "Zoom: in/out/fit. Also try mouse or trackpad scroll.",
rotate_ctl: "Rotate/Reflect component. Also try 'R'.",
delete_ctl: "Delete component. Also try 'Del'.",

last_line: '最后一行，没有逗号'
};

var strSHelp = "CIRCUIT SANDBOX 帮助\n\n";		//embedded Help
var strAddC = "添加元件：点击零件箱中的零件，然后放置到原理图来添加零件。\n\n";
var strAddW = "添加导线：导线从连接点开始（空心圆圈）。触摸连接以开始连线，拖动和释放。\n\n";
var strSel  = "选择：使用按住鼠标按键拖动产生的矩形选择组件。 \n（桌面:）按住Shift键单击以包含其他组件。\n\n";
var strMove = "移动：触摸并拖动到新的位置。\n\n";
var strDel  = "删除：点击选择，然后点击X图标或点击退格。\n\n";
var strRot  = "旋转/镜像：单击以选择，然后单击旋转图标或键入字母 \"r\" 来旋转90度. 重复更多的旋转和镜像（共8个）。\n\n";
var strView = "";
var strProp = "属性：双击组件可以改变属性，如电阻或电压。\n\n";
var strNum  = "可以使用工程符号输入数字：\n\
T = 10^12, G = 10^9, M = 10^6, k = 10^3\n\
m = 10^-3, u = 10^-6, n = 10^-9, p = 10^-12, f = 10^-15";
