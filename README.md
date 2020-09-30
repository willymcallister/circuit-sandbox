# Circuit Sandbox

A simulator for experimenting with circuits. Click and draw. There's no installation.

* [Run in English](https://spinningnumbers.org/circuit-sandbox/index.html)  
* [Ejecutar en español](https://spinningnumbers.org/circuit-sandbox/index-es.html)  
* [运行简体中文版](https://spinningnumbers.org/circuit-sandbox/index-zh.html) (simplified Chinese)
* [を日本語で実行する](https://spinningnumbers.org/circuit-sandbox/index-ja.html) (Japanese)

Can you help translate Circuit Sandbox into other languages? It's easy. Contact me at willy@spinningnumbers.org.

## Playing in the circuit sandbox

To create a circuit, drag components onto the schematic diagram from the parts bin on the right.

<img src="images/42image_1.png">

The result of a *transient* analysis is a plot of voltage vs. time.

<img src="images/42image_2.png">

## Getting started

Drag components from the parts bin onto the main screen.

Add wires by dragging between components connection points (small circles).

Tap on the Rotate R&#x2935;  icon or type  **"r"** on the keyboard to rotate a component.

Tap on X or type BACKSPACE to delete a component.

Double-tap on a component to change its properties, like resistance value.

Add a ground symbol (triangle shape at the top of the parts bin).

Add voltage or current probes to the nodes you want to plot.

Select DC, AC, or TRAN from the menu to simulate the circuit.

If you have a touch device (tablet or smartphone):

* One finger selects components or drags a selection rectangle
* Two fingers pan the schematic window

<details>
<summary>How to build the circuit shown above</summary>

To create the RC circuit shown above, follow these steps starting from a blank schematic.

* Add components (a voltage source, resistor, and capacitor). Click on a component in the parts bin on the right, then click on the schematic. Or, you can mouse down on a component in the bin and drag it to the schematic.
* Select the resistor by clicking on it. It will turn green. While it is selected, hit the **"r"** key on the keyboard to make it rotate to horizontal. You can also click on the R&#x2935;  icon. Rotate several times to see what happens.
* Position components on the page by dragging them around.
* Add wires by dragging between the connection points on the components. If you make a mistake, hit the backspace/delete key on your keyboard to delete whatever is selected, or click on the X icon.
* Specify a ground node by dragging the ground symbol from the parts bin (the triangle with a stick) and connect it to the bottom of the voltage source.
* Adjust the component properties. Double-click on the voltage source and change its type to "step". Give it a name if you want. In the same way, change the resistor value to 1k, and the capacitor value to 1u. The k and u suffixes are short for 10^3 and 10^-6.
* Add a voltage probe to the top node of the capacitor. (The thing in the parts bin that looks like a voltmeter probe.) This is the voltage we will plot.
* Select an analysis to perform. For this example, let's do a transient analysis. Click TRAN in the menu. Set the stop time to 10m. The m stands for 10^-3 so we will simulate for 10 milliseconds.
* Click OK. The simulation is performed and a plot should appear.

Here is a complete RC circuit schematic. Copy and paste this entire URL into a browswer.

    https://spinningnumbers.org/circuit-sandbox/index.html?value=[["s",[264,64,0],{"color":"cyan","offset":"0","_json_":0},["2"]],["w",[264,128,208,128]],["w",[152,128,208,128]],["g",[208,128,0],{"_json_":3},["0"]],["w",[264,64,264,80]],["w",[232,64,264,64]],["w",[152,64,184,64]],["w",[152,80,152,64]],["c",[264,80,0],{"name":"C1","c":"1u","_json_":8},["2","0"]],["r",[232,64,1],{"name":"R1","r":"1k","_json_":9},["2","1"]],["v",[152,80,0],{"name":"vin","value":"step(0,1,0,1n)","_json_":10},["1","0"]],["view",110.6424,32.20688,3.814697265625,"50","10","1G",null,"100","10m","1000"]]

</details>

## Actions

**Add a component**: Tap on a part in the parts bin, then tap on the schematic to add.

**Add a wire**: Wires start at connection points (open circles). Touch on a connection to start a wire, drag, and release.

**Select**: Drag a rectangle to select components.
Shift-click to include another component (desktop only).

**Move**: Touch and drag to a new location.

**Delete**: Tap to select, then tap the X icon or hit BACKSPACE on the keyboard.

**Rotate/Reflect**: Tap to select, then tap on the Rotate icon or type the letter "**r**" to rotate 90. Repeat for more rotations and reflections (8 total).

**Properties**: Double-tap on a component to change its properties, like resistance or voltage.

**Numeric suffixes**: Numbers can be entered using engineering notation:

    T    10^12          m   10^-3
    G    10^9           u   10^-6  
    M    10^6           n   10^-9  
    k    10^3           p   10^-12
                        f   10^-15

example: 1000 can be entered as 1k

## On-screen controls
Scroll/Pan:  <img height="40" src="https://ka-perseus-images.s3.amazonaws.com/2446260ae44e7a7d850d815fedeb12506058d322.png">

Zoom in/out/all: <img height="60" src="https://ka-perseus-images.s3.amazonaws.com/78979c8aedb8cec1614cb50ecbbf9e6ebbac6645.png">

Rotate: <img height="40" src="https://ka-perseus-images.s3.amazonaws.com/deae5d6d1fb3a041dcb848fea746abd1915d1a97.png">

Delete: <img height="40" src="https://ka-perseus-images.s3.amazonaws.com/1392955f4594094500a3c3a2b09dcd52a0e31727.png">

## Menu

**Help**: Display the Actions information shown above.

**Grid**: Toggle the background grid on and off.

**Open netlist**: Open a saved netlist.

**Shared link**: Displays a link you can copy for sharing your circuit with others.

**Save netlist**: Save the current netlist. See System information below for how this works on different platforms.

**Cut/Copy/Paste** The usual edit functions.  

> Mac shortcuts: &#8984;-X, &#8984;-C, &#8984;-V  
> PC shortcuts: ctl-X, ctl-C, ctl-V

**Delete**: Delete the selected components.

**DC**:  Find the DC voltages and currents, also called the *operating point*.

**AC**: Sweep the AC frequency, plots voltage or current vs. frequency.

**TRAN**: Transient response. Find the time response, plot voltage or current vs. time.

## Device models

The simulator has simple models for semiconductor devices and an operational amplifier, with just a few adjustable parameters. For more sophisticated simulations, check out the other circuit simulator resources mentioned below.

The default diode saturation current is 1.0 * 10^-14 A. The *area* parameter scales saturation current: is = a * is.

## System information

The circuit sandbox works best in a desktop or laptop computer environment where you have plenty of viewing area. You can also use it on a tablet. (It works on smartphone, too, but the experience is a bit awkward because the screen is so small.)

### Desktop/laptop

The `SAVE` function saves a circuit text file (JSON format) to the Download folder on your computer.  The `OPEN` function retrieves a circuit text file from anywhere you choose in your computer's file system. If you want to keep your work, be sure to `SAVE` your circuit before leaving the web page. Your circuit is never transferred from your computer to a web server.

The downloaded netlist file is named *ckt.txt*. (text file, JSON, JavaScript Object Notation).

### Tablet

The simulator has a touch interface. On a tablet you can save *one* circuit file. When you `SAVE` a circuit, it is tucked into a memory area inside your browser. When you `OPEN` the saved circuit, the circuit file is retrieved from browser memory. If you want to keep your work, be sure to `SAVE` before leaving the web page.

### Other mobile devices

The simulator works on a smartphone, but the display is a bit small for drawing schematics. You can pan the screen by touching down two fingers at once and dragging the window. You can save and load a single circuit file, the same as for a tablet.

## Languages and translation

If you would like to translate the Circuit Sandbox into other languages, it's fairly simple. As a model, look at the Spanish strings file named es.js compared to the original English strings, en-US.js. If you prepare a translation file in your favorite language, mail it to me and I will include it. The Circuit Sandbox has been translated into:

* English, en-US.js
* Spanish, es.js
* Simplified Chinese, zh-cn.js

## The circuit sandbox was created at MIT

The Circuit Sandbox simulator was created at MIT by Professor Chris Terman in 2011, and was used by the very first massively-open-online class (MOOC), MIT 6.002x. It was transferred to EdX in 2012. The bjt model was written by Professor Jacob White. I made further improvements to the simulator interface while I was at Khan Academy in 2016, and since then.

The Circuit Sandbox is *not* SPICE. It is its own version of a circuit simulator. It includes schematic capture and a circuit simulation engine. The simulator is 100% Javascript and does not require installation. All you have to do is click on the link to the simulator.

The Circuit Sandbox is licensed under the MIT License and is also part of the EdX-platform. The simulator works in most modern browsers on Windows, Mac, and Linux machines.

## Other circuit simulators

The granddaddy of all circuit simulation programs is SPICE (Simulation Program with Integrated Circuit Emphasis). This program was created at the University of California, Berkeley in the 1970's. It was originally written in FORTRAN and has always been in the public domain.

The input to SPICE is a plain-text circuit description (the SPICE netlist). SPICE is the workhorse of the electronics industry because it supports sophisticated models for semiconductor devices (diodes and many types of transistors).

Many people have written front-end interfaces to SPICE that allow designers to create SPICE netlists by drawing schematics. The SPICE netlist is submitted to SPICE for simulation. The results are retrieved from SPICE and plotted.  Many of these packages can be found by searching the web for "circuit simulator."

An excellent version of SPICE is available from [Linear Technology](https://www.linear.com/), a semiconductor manufacturing company in Milpitas, California. The program is called [LTspice](https://www.linear.com/designtools/software/#LTspice). LTspice runs on Windows, Macintosh, and Linux machines with Windows emulation. It is free to download and use."

## Acknowledgments

schematic.js &copy; 2017-18 Willy McAllister, &copy; 2016 Khan Academy, Inc., &copy; 2012 EdX, &copy; 2011 MIT EECS

Khan Academy software is made available under the [MIT License](https://opensource.org/licenses/MIT).  

This circuit simulator is part of the EdX Platform, licensed under the
[GNU AFFERO GENERAL PUBLIC LICENSE](https://github.com/edx/edx-platform/blob/master/LICENSE)
Version 3, 19 November 2007. More information at [EdX licensing](https://open.edx.org/open-edx-licensing).

#### Libraries

The simulator uses two open-source libraries:  

[Download.js](https://danml.com/download.html) is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/), attributed to "dandavis". No changes were made. Download.js allows to circuit files to be downloaded to the client computer.

[Hammer.js](https://hammerjs.github.io/) is available under the [MIT License](https://github.com/hammerjs/hammer.js/blob/master/LICENSE.md). No changes were made. Hammer.js provides touch functionality, in particular, the double-tap function for touch interfaces.

This version of the circuit sandbox simulator includes additions by Willy McAllister, EE Content Fellow at Khan Academy during 2016:

* Save/Load netlist, sharable link
* Touch sensitivity for tablets and smartphone
* Language extensions

---

## Circuit Sandbox - README

[![Run circuit sandbox]({% link i/circuit_sandbox2.jpg %}){: height="180px" :}{: .centered :}](https://spinningnumbers.org/circuit-sandbox/index.html?value=[["s",[264,64,0],{"color":"cyan","offset":"0","_json_":0},["Vout"]],["w",[152,64,184,64]],["w",[152,80,152,64]],["c",[264,80,0],{"name":"C1","c":"1u","_json_":3},["Vout","0"]],["r",[232,64,1],{"name":"R1","r":"1k","_json_":4},["1","2"]],["v",[152,80,0],{"name":"Vin","value":"step(0,1,0,1n)","_json_":5},["2","0"]],["L",[272,72,0],{"label":"Vout","_json_":6},["Vout"]],["a",[240,64,0],{"color":"magenta","offset":"0","_json_":7},["1","Vout"]],["w",[232,64,240,64]],["w",[264,64,256,64]],["w",[264,128,264,136]],["w",[152,128,152,136]],["g",[208,136,0],{"_json_":12},["0"]],["w",[264,136,208,136]],["w",[152,136,208,136]],["w",[272,72,264,72]],["w",[264,64,264,72]],["w",[264,80,264,72]],["view",84.428,21.1336,3.0517578125,"50","10","1G",null,"100","6m","1000"]])  

A simulator for learning about circuits. Circuit Sandbox includes schematic capture and a circuit simulation engine. The circuit simulator is written entirely in JavaScript---it is not a version of SPICE. 

|[![circuit sandbox]({% link i/circuit_sandbox1.png %}){: height="70px" :} English](https://spinningnumbers.org/circuit-sandbox/index.html)|[![circuit sandbox]({% link i/circuit_sandbox1.png %}){: height="70px" :} español](https://spinningnumbers.org/circuit-sandbox/index-es.html)|[![circuit sandbox]({% link i/circuit_sandbox1.png %}){: height="70px" :} português](https://spinningnumbers.org/circuit-sandbox/index-pt.html)|[![circuit sandbox]({% link i/circuit_sandbox1.png %}){: height="70px" :} magyarul](https://spinningnumbers.org/circuit-sandbox/index-hu.html)|
|[![circuit sandbox]({% link i/circuit_sandbox1.png %}){: height="70px" :} 简体中文](https://spinningnumbers.org/circuit-sandbox/index-zh.html)|[![circuit sandbox]({% link i/circuit_sandbox1.png %}){: height="70px" :} 日本語](https://spinningnumbers.org/circuit-sandbox/index-ja.html)|[![circuit sandbox]({% link i/circuit_sandbox1.png %}){: height="70px" :} हिन्दी](https://spinningnumbers.org/circuit-sandbox/index-hi.html)|
{:.noborder}

Can you help translate Circuit Sandbox into other languages? [It’s easy!](#translation)

----

YOU DON'T NEED TO READ THE REST OF THIS UNLESS YOU GET STUCK.

----

#### Contents
{:.no_toc}

* Will be replaced with the ToC
{:toc}

---- 

## Playing in the sandbox

To create a circuit, drag components from the part bin on the right onto the schematic.

[![Run circuit sandbox]({% link i/circuit_sandbox_schematic.png %}){: height="340px" :}{: .centered :}](https://spinningnumbers.org/circuit-sandbox/index.html?value=[["s",[264,64,0],{"color":"cyan","offset":"0","_json_":0},["Vout"]],["w",[152,64,184,64]],["w",[152,80,152,64]],["c",[264,80,0],{"name":"C1","c":"1u","_json_":3},["Vout","0"]],["r",[232,64,1],{"name":"R1","r":"1k","_json_":4},["1","2"]],["v",[152,80,0],{"name":"Vin","value":"step(0,1,0,1n)","_json_":5},["2","0"]],["L",[272,72,0],{"label":"Vout","_json_":6},["Vout"]],["a",[240,64,0],{"color":"magenta","offset":"0","_json_":7},["1","Vout"]],["w",[232,64,240,64]],["w",[264,64,256,64]],["w",[264,128,264,136]],["w",[152,128,152,136]],["g",[208,136,0],{"_json_":12},["0"]],["w",[264,136,208,136]],["w",[152,136,208,136]],["w",[272,72,264,72]],["w",[264,64,264,72]],["w",[264,80,264,72]],["view",84.428,21.1336,3.0517578125,"50","10","1G",null,"100","6m","1000"]])

Sample output: Click on **TRAN** to perform a *transient* analysis, a plot of voltage vs. time.

![Transient analysis screenshot]({% link i/circuit_sandbox_transient_analysis.png %}){: height="340px" :}{: .centered :}

## Getting started

Drag components from the parts bin onto the main screen.

Add wires by dragging between components connection points (small circles).

Tap on the <i class="fas fa-redo"></i> Rotate icon or type  **"r"** on the keyboard to rotate a component.

Tap on the <i class="fas fa-times fa-lg"></i> Delete icon or type BACKSPACE to delete a component.

Double-tap on a component to change its properties, like resistance value.

Add a ground symbol (triangle shape at the top of the part bin).

Add node labels (the short straight line underneath the ground symbol).

Add voltage or current probes to the nodes you want to plot.

Select **DC**, **AC**, or **TRAN** from the menu to simulate the circuit.

{% capture summary %}How to build the circuit shown above{% endcapture %}  
{% capture details %}  
To create the $\text{RC}$ circuit shown above, follow these steps starting from a [blank schematic](https://spinningnumbers.org/circuit-sandbox/index.html) (open this link in a new tab).

* Add components (a voltage source, resistor, and capacitor). Click on a component in the parts bin on the right, then click on the schematic. Or, you can mouse down on a component in the bin and drag it to the schematic.
* Select the resistor by clicking on it. It will turn green. While it is selected, hit the **"r"** key on the keyboard to make it rotate to horizontal. You can also click on the R&#x2935;  icon. Rotate several times to see what happens.
* Position components on the page by dragging them around.
* Add wires by dragging between the connection points on the components. If you make a mistake, hit the backspace/delete key on your keyboard to delete whatever is selected, or click on the $\large \times$ icon.
* Specify a ground node by dragging the ground symbol from the parts bin (the triangle with a stick) and connect it to the bottom of the voltage source.
* Adjust the component properties. Double-click on the voltage source and change its type to "step". Give it a name if you want. In the same way, change the resistor value to $1$k, and the capacitor value to $1$u. The k and u suffixes are short for $10^{+3}$ and $10^{-6}$.
* Add a voltage probe to the top node of the capacitor. (The thing in the parts bin that looks like a voltmeter probe.) This is the voltage we will plot.
* Select an analysis to perform. For this example, let's do a transient analysis. Click TRAN in the menu. Set the stop time to $10$m. The m stands for $10^{-3}$ so we will simulate for $10$ milliseconds.
* Click OK. The simulation is performed and a plot should appear.
{% endcapture %}{% include details.html %} 

Here is the completed [$\underline{\text{RC}}$ circuit](https://spinningnumbers.org/circuit-sandbox/index.html?value=[["s",[264,64,0],{"color":"cyan","offset":"0","_json_":0},["Vout"]],["w",[152,64,184,64]],["w",[152,80,152,64]],["c",[264,80,0],{"name":"C1","c":"1u","_json_":3},["Vout","0"]],["r",[232,64,1],{"name":"R1","r":"1k","_json_":4},["1","2"]],["v",[152,80,0],{"name":"Vin","value":"step(0,1,0,1n)","_json_":5},["2","0"]],["L",[272,72,0],{"label":"Vout","_json_":6},["Vout"]],["a",[240,64,0],{"color":"magenta","offset":"0","_json_":7},["1","Vout"]],["w",[232,64,240,64]],["w",[264,64,256,64]],["w",[264,128,264,136]],["w",[152,128,152,136]],["g",[208,136,0],{"_json_":12},["0"]],["w",[264,136,208,136]],["w",[152,136,208,136]],["w",[272,72,264,72]],["w",[264,64,264,72]],["w",[264,80,264,72]],["view",84.428,21.1336,3.0517578125,"50","10","1G",null,"100","6m","1000"]]).

## Help 

Add a component: Tap on a part in the parts bin, then tap on the schematic.

Add a wire: Touch on a connection (open circle) to start a wire. Drag. Release.

Select: Drag a rectangle to select components. Shift-click to include another component (desktop only).

Move: Touch and drag to a new location.

Delete: Tap to select, then tap the <i class="fas fa-times fa-lg"></i> icon or hit BACKSPACE on the keyboard.

Rotate/Reflect: Tap to select, then tap on the 
<i class="fas fa-redo"></i> 
Rotate icon or type the letter "**r**" to rotate 90. Repeat for more rotations and reflections (8 total).

Properties: Double-tap on a component to change its properties like resistance or voltage.

Numbers may be entered using engineering notation,

    T    10^12          m   10^-3 
    G    10^9           u   10^-6 
    M    10^6           n   10^-9 
    k    10^3           p   10^-12
                        f   10^-15 

example: $1000$ can be entered as $1\text k$

## Labeling and annotation

You can give a node a name by attaching the label part---the short straight line under the ground symbol. Double-click on the label and enter a node name.

You can add unattached text annotation to the circuit with the same label part. Place a node label anywhere on the schematic. It does not have to be connected to anything.

## On-screen controls 

![Scroll/pan]({% link i/circuit_sandbox_scroll_controls.png %}){:height="40px"}  Scroll/Pan     
![Zoom]({% link i/circuit_sandbox_zoom_controls.png %}){:height="80px"}  Zoom in, out, fit          
![Rotate]({% link i/circuit_sandbox_rotate_control.png %}){:height="40px"}  Rotate          
![Delete]({% link i/circuit_sandbox_delete_control.png %}){:height="40px"} Delete        

## Menu bar

<i class="fas fa-question fa-lg"></i> Help: List the Help information shown above. 

<i class="fas fa-border-all fa-lg"></i> Grid: Toggle the background grid on and off.

<i class="fas fa-folder-open fa-lg"></i> Open netlist: Open a saved netlist.

<i class="fas fa-link fa-lg"></i> Shared link: Displays a link you can copy for sharing your circuit. The link is [*uriencoded*](https://en.wikipedia.org/wiki/Percent-encoding), also known as *percent encoded*. This lets you use these text characters , / ? : @ & = + $ # in signal and component names. The decoded link is echoed to your browser's javascript console.

<i class="fas fa-save fa-lg"></i> Save netlist: Save the current netlist. See System information below for where the circuit gets saved on different platforms.

<i class="fas fa-cut fa-lg"></i> Cut, <i class="fas fa-copy fa-lg"></i> Copy, <i class="fas fa-paste fa-lg"></i> Paste: The usual edit functions.  

> Mac shortcuts: &#8984;-X, &#8984;-C, &#8984;-V  
> PC shortcuts: ctl-X, ctl-C, ctl-V

<i class="fas fa-times fa-lg"></i> Delete: Delete the selected components.

### Simulations

**DC**:  Find the DC voltages and currents, also called the *operating point*.

**AC**: Sweep the AC frequency, plot voltage or current vs. frequency.

**TRAN**: Transient response. Find the time response, plot voltage or current vs. time.

<i class="fas fa-download fa-lg"></i> Download: Saves the TRAN or AC data as a .csv file (comma-separated variables) called data.csv in your Downloads folder. This type of file can be opened in Excel or MatLab.

## Device models

The simulator has simple models for semiconductor devices and an ideal operational amplifier. Each model has just a few adjustable parameters. For more sophisticated simulations, check out the other circuit simulator resources mentioned below. 

### Diode model

The default diode saturation current is $\text I_\text s = 1.0\times 10^{-14}$ ampere. The diode's Area parameter scales the saturation current to Area $\times \,\text I_\text s$. 

![Circuit Sandbox diode symbol]({% link i/circuit_sandbox_diode_symbol.png %}){: height="180px" :}{: .centered :}

Setting the area is equivalent to placing that many diodes in parallel.

### Opamp model

The ideal opamp symbol has two inputs (v+ and v-) and an output (vo). There are no positive and negative power supply inputs. The extra input, vg, is the reference for the output voltage. 

![Circuit Sandbox opamp symbol]({% link i/circuit_sandbox_opamp_symbol.png %}){: height="140px" :}{: .centered :}

The defining equation for the opamp is: A(vp - vn) = vo - vg

The default gain is A $= 30{,}000$. If the input voltages are identical then the output voltage will be vg. If you plan on symmetric power supply voltages, connect vg to ground. If they are not symmetric set vg half way between whatever power inputs you intend for your opamp. 

## System information

The circuit sandbox works best on a desktop or laptop computer where you have plenty of viewing area. You can also use it on a tablet. (It works on smart phone, too, but the experience is a bit awkward because the screen is so small.) It should work seamlessly in most modern browsers under Windows, Mac, and Linux. If you experience problems, please let me know. 

Your circuit is never transferred to the Spinning Numbers web server.

### Desktop/laptop

A quick way to save your circuit is to click on the <i class="fas fa-link"></i> link icon. It displays a big URL you can copy and paste wherever you want. Paste it into a browser to recreate the circuit.

The <i class="fas fa-save"></i> save icon saves the circuit to the Download folder on your computer in JSON format (JavaScript Object Notation). The file is named *ckt.txt*. 

The <i class="fas fa-folder-open"></i> open icon loads a circuit from your computer's file system. 

If you want to keep your work be sure to save your circuit before leaving the web page. 

### Touch devices

If you have a touch device (tablet or smart phone),

* One finger selects a component or drags a selection rectangle 
* Two fingers pan the schematic window

#### Tablet 
{:.no_toc}

On a tablet you can save *one* circuit file. When you save a circuit, it is tucked into a memory area inside your browser. When you open the saved circuit, the circuit file is retrieved from browser memory. If you want to keep your work, be sure to save before leaving the web page.

#### Mobile devices
{:.no_toc}

The simulator works on a smart phone, but the display is a bit small for drawing schematics. You can save and load one circuit file, the same as for a tablet.

## Configure

Circuit Sandbox accepts a few extra parameters to customize the parts bin and analysis choices. You can do this with either the URL or the html \<input\> statement. Here is an example of a URL with a limited parts bin and analysis choices,

```
https://spinningnumbers.org/circuit-sandbox/index.html?parts=g,v,r,s&analyses=dc,tran
```

A URL parameter list starts with a ? question mark. Each parameter is separated by an & ampersand character. Notice there are no quote marks.

You can also provide an initial schematic. Draw up a circuit and grab the URL with the <i class="fas fa-link"></i> link. The circuit JSON is captured in the value parameter. Append the part and analysis options like this with ampersands,

```
https://spinningnumbers.org/circuit-sandbox/index.html?value=[["g",[104,112,0],{"_json_":0},["0"]],["r",[128,64,0],{"r":"1","_json_":1},["1","0"]],["v",[80,64,0],{"value":"dc(1)","_json_":2},["1","0"]],["w",[80,64,128,64]],["w",[80,112,104,112]],["w",[128,112,104,112]],["view",0.5,36.5,4,"50",null,null,null,"100","0.01","1000"]]&parts=g,v,r,s&analyses=dc,tran
```

You can do the same thing if you call Circuit Sandbox from an html \<input\> statement---this time with quotes,

```
<input type="hidden" class="schematic" height="400" width="600" parts="g,v,r,s" analyses="dc,tran" value=[["g",[104,112,0],{"_json_":0},["0"]],["r",[128,64,0],{"r":"1","_json_":1},["1","0"]],["v",[80,64,0],{"value":"dc(1)","_json_":2},["1","0"]],["w",[80,64,128,64]],["w",[80,112,104,112]],["w",[128,112,104,112]],["view",25.5,44,4,null,null,null,null,"100","0.01","1000"]]>
```

Your choices for analyses are dc, ac, and tran.

Here are your part choices,
```'''```
   var parts_map = {
    'g': [Ground],
    'L': [Label],
    'v': [VSource],
    'i': [ISource],
    'r': [Resistor],
    'c': [Capacitor],
    'l': [Inductor],
    'o': [OpAmp],
    'd': [Diode],
    'n': [NFet],
    'p': [PFet],
    's': [Probe],
    'a': [Ammeter]
   };
```

## Translation

If you can help translate the Circuit Sandbox into other languages, that would be great! If you are fluent in English and another language, especially the technical terms used in the simulator, I could really use your help. Contact me by email and I will provide a [table of 170 terms and phrases](https://github.com/willymcallister/circuit-sandbox/blob/gh-pages/Translation-table.docx) for you to translate.

So far, Circuit Sandbox is available in,

* English, en-US.js
* Spanish, es.js (courtesy of Khan Academy volunteer translators)
* Simplified Chinese, zh-cn.js (courtesy of GitHub user [Zhu Hao](https://github.com/greedyhao))
* Japanese, ja.js (courtesy of my friend Leslie Shiozaki, a professional translator)
* Hindi, hi.js (courtesy of Aniruddh Pratap Singh, a 12th grade student who wants to become an engineer.)
* Portuguese, pt-BR.js (courtesy of Luís F. V. Peres, graduando em engenharia elétrica de Universidade de São Paulo)
* Hungarian, hu.js (courtesy of Török Attila)

## The Circuit Sandbox was created at MIT

The Circuit Sandbox was written by MIT Professor Chris Terman in 2011 for  MIT 6.002x, the very first massively-open-online class (MOOC). MIT transferred Circuit Sandbox to [EdX](https://www.edx.org/) in 2012. I made further improvements to the simulator while at Khan Academy in 2016 and since then.

Circuit Sandbox includes schematic capture and a circuit simulation engine. It is *not* a version of SPICE. It is its own interpretation of a circuit simulator written in 100% Javascript. It does not require installation---just click on the link and the simulator opens, ready to run.

## Other circuit simulators

The granddaddy of all circuit simulation programs is SPICE (Simulation Program with Integrated Circuit Emphasis). This program was created at the University of California, Berkeley in the 1970's. It was originally written in FORTRAN. SPICE has always been in the public domain. It is one of the jewels of human creativity.

The input to SPICE is a plain-text circuit description (a SPICE netlist). SPICE is the workhorse of the electronics industry because it supports sophisticated models for semiconductor devices (diodes and many types of transistors). 

Many people have wrapped front-end interfaces around SPICE to allow designers to draw a schematic and automatically create SPICE netlists. The text netlist is submitted to SPICE for simulation. The results come back and you can plot them.  Many of these packages can be found by searching the web for "circuit simulator." 

An excellent version of SPICE is available from [Linear Technology](https://www.linear.com/), a semiconductor manufacturing company in Milpitas, California. The program is [LTSpice (from linear.com)](https://www.linear.com/designtools/software/#LTspice) or [LTSpice (from analog.com)](https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html). LTSpice runs on Windows, Macintosh, and Linux machines with Windows emulation. It is free to download and use. 

Note: Linear Technologies was purchased by [Analog Devices](www.analog.com) in 2017. The web sites have been merged together.

Another simulator is [JADE](http://computationstructures.org/exercises/sandboxes/jade.html). This is also a creation of Chris Terman at MIT. It's a follow-on to Circuit Sandbox with improved features for digital design and logic simulation. Here's an [intro video](http://computationstructures.org/exercises/tool_docs/jade.html).

## Licensing

© 2017-18 Willy McAllister, © 2016 Khan Academy, Inc., © 2012 EdX, © 2011 MIT EECS

This work is licensed under the Creative Commons ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)) Attribution-NonCommercial-ShareAlike 4.0 International. 

Khan Academy makes its software available under the [MIT License](https://opensource.org/licenses/MIT).  

The MIT circuit simulator is part of the EdX Platform, licensed under the 
[GNU AFFERO GENERAL PUBLIC LICENSE](https://github.com/edx/edx-platform/blob/master/LICENSE)
Version 3, 19 November 2007. More information at [EdX licensing](https://open.edx.org/open-edx-licensing).

## Libraries

The Circuit Sandbox simulator uses two open-source libraries,  

[Download.js](https://danml.com/download.html) is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/), attributed to "dandavis". No changes were made. Download.js allows to circuit files to be downloaded to the client computer.

[Hammer.js](https://hammerjs.github.io/) is available under the [MIT License](https://github.com/hammerjs/hammer.js/blob/master/LICENSE.md). No changes were made. Hammer.js provides touch functionality, in particular, the double-tap function.

This version of the simulator includes additions by Willy McAllister, including,

* Save/Load netlist
* Sharable link
* Touch sensitivity
* Internationalization

