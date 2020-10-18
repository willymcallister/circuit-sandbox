//////////////////////////////////////////////////////////////////////////////
//
//  Circuit simulator fet_vs parameters and parameter initialization
//
//////////////////////////////////////////////////////////////////////////////

// Copyright (C) 2012 Massachusetts Institute of Technology

function Fet_vs_parms() {
   // this.finalize(undefined);
    this.finalize(undefined);
}

Fet_vs_parms.prototype.vs_display_default = " { \
\"nT\": 22,           	\"pT\": 22, \
\"nLg\": 38e-7,       	\"pLg\": 38e-7, \
\"ndLg\": 8e-7,       	\"pdLg\": 8e-7, \
\"netov\": 1.38e-7,    	\"petov\": 1.34e-7, \
\"nCg\": 2.50e-6,     	\"pCg\": 2.57e-6, \
\"nS0\": 0.095,       	\"pS0\": 0.089, \
\"ndelta\": 0.122,    	\"pdelta\": 0.145, \
\"nVt0\": 0.470,     	\"pVt0\": 0.554, \
 \
\"nvxo\": 0.985e7,     	\"pvxo\": 0.754e7, \
\"nmu\": 195,         	\"pmu\": 166, \
\"nRx\":71,           	\"pRx\": 73, \
\"nRy\":71,	  	\"pRy\": 73, \
 \
\"nCif\": 1.5e-12,     	\"pCif\": 1.38e-12, \
\"nCof\": 1.84e-12,    	\"pCof\": 1.47e-12 }"; 

Fet_vs_parms.prototype.vs_parm_default = " { \
\"nT\": 22,           	\"pT\": 22, \
\"nWscale\": 1.0,   	\"pWscale\": 1.0, \
\"nLg\": 38e-7,       	\"pLg\": 38e-7, \
\"ndLg\": 8e-7,       	\"pdLg\": 8e-7, \
\"nCg\": 2.50e-6,     	\"pCg\": 2.57e-6, \
\"netov\": 1.38e-7,     \"petov\": 1.34e-7, \
\"ndelta\": 0.122,    	\"pdelta\": 0.145, \
\"nS0\": 0.095,       	\"pS0\": 0.089, \
\"nnd\": 0.0,         	\"pnd\": 0.0, \
\"nRx\":71,           	\"pRx\": 73, \
\"nRy\":71,	  	\"pRy\": 73, \
\"nCif\": 1.5e-12,      \"pCif\": 1.38e-12, \
\"nCof\": 1.84e-12,     \"pCof\": 1.47e-12, \
\"nvxo\": 0.985e7,     	\"pvxo\": 0.754e7, \
\"nrv\": 1,		\"prv\": 1, \
\"nzeta\": 1,		\"pzeta\": 1.0, \
\"nmu\": 195,         	\"pmu\": 166, \
\"nbeta\": 1.8,       	\"pbeta\": 1.8, \
\"nbetaq\":  1.8,    	\"pbetaq\":  1.8, \
\"nalpha\": 3.5,      	\"palpha\": 3.5, \
\"nphib\": 0.9,       	\"pphib\": 0.9, \
\"ngamma\": 0.24,     	\"pgamma\": 0.16, \
\"nVt0\": 0.470,     	\"pVt0\": 0.554, \
\"nVdA\": 1.0,        	\"pVdA\": 1.0 }";

// VS Model adapted from Matlab (Lan Wei and Dimitri Antoniadis).

function Fet_vs_parms_type(type_sign) {
    //alert('in device with type ' + type_sign);
    this.T=27;           // Temperature in degrees C
    this.Wscale=1.0;     // Scales all the devices
    this.Lg = 30e-7;     // Gate length [cm]
    this.dLg= 9e-7;      // dLg=L_g-L_c (default 0.3xLg_nom)
    this.Cg=2.65e-6;     // Gate cap [F/cm^2]
    this.etov = 1.2e-7;  // Eqv. dielec. thick at S/D-G overlap [cm]
    this.delta=0.125;    // DIBL [V/V] 
    this.S0=0.098;       // Subthresh swing at T=27C & Vd=VdA [V/decade]
    this.nd=0;           // Punchthrough Factor typically none (nd=0) or 0-> 4.

                          // Series R for "x" terminal [ohm-micron] (Rs) 
    if (this.type_sign > 0) this.Rx=55; // [ohm-microns], n < p?
    else this.Rx = 75; 

    this.Ry=this.Rx;     // Series R for "y" (Typically assume Rs=Rd)
    this.Cif = 1e-12;    // Inner fringing S or D capacitance [F/cm] 
    this.Cof = 2e-13;    // Outer fringing S or D capacitance [F/cm]

    // Virtual src velocity [cm/s]
    if (this.type_sign > 0) this.vxo=1.45*1e7; 
    else this.vxo=1.07*1e7;
    
    this.rv=1.0;         // Ratio vxo(strong inv)/vxo(weak inv)
    this.zeta=1;         // Sets transition Vg for vxo, do not set=0!
    // If rv=1, vxo=constant, zeta irrelevant
    this.mu=230;         // Mobility [cm^2/V.s]
    this.beta=1.8;       // Saturation factor. Typ. nFET=1.8, pFET=1.6
    this.betaq = 1.8;    // Beta in the charge model
    this.alpha=3.5;     
    
    this.phib=0.9;       // ~abs(2*phif)>0 [V]
    this.gamma=0.3;      // Body factor  [sqrt(V)]

    if (this.type_sign > 0) this.Vt0=0.5286;
    else this.Vt0=0.5323;  // Nominal threshold voltage
    
    this.VdA=1.0;        // Vd [V] corresponding to IdA if given.


    this.perturbv = 1.0e-6; //dV for f-D deriv, not too small, not too large.
}

Fet_vs_parms_type.prototype.postproc = function() {
    // Derived physical parameters
    this.phit = 8.617e-5*(273+this.T);    // kT/q
    this.St=this.S0*(this.T+273.0)/300.0;
    this.nint = this.St/(Math.log(10.0)*this.phit);
    this.n0=this.nint - this.nd*this.VdA; 
    // Intrinsic swing n-factor at T
    
    // Derived non-physical parameters.
    this.LgmdLg = this.Lg-this.dLg;    
    this.vel2v = this.LgmdLg/this.mu;
    this.aphit = this.alpha*this.phit;
    this.sqrtphib = Math.sqrt(this.phib);
    this.vxofrac = this.vxo * (this.rv-1.0)/this.rv;
    this.dvgstdvds = this.delta;
    this.Rx *= 1.0e-4;   // Rx, Ry ohm-u -> ohm-cm
    this.Ry *= 1.0e-4;   
    this.Cov=(0.345e-12/this.etov)*this.dLg/2 + this.Cof;
    this.Cgso = this.Cov;  // Gate to source overlap cap [f/cm]
    this.Cgdo = this.Cov;  // Gate to drain overlap cap  [f/cm]
}

function niceDisp(obj) {
    var strObj = JSON.stringify(obj);
    strObj = strObj.replace(/,/g,",\n");
    strObj = strObj.slice(1,-1);
    return(strObj);
}

function niceDispCourse(n,p) {
    var parmsList =
	["T","Lg","etov","Cg","S0","delta", 
	 "Vt0","vxo","mu","Rx","Ry","Cif","Cof"];
    var retStr = "";
    for (var i = 0; i < parmsList.length; i++) {
	retStr += "\"" + "n" + parmsList[i] + "\"" + ":" 
	    + n[parmsList[i]].toExponential(2)
	    + "," + "    \t" 
	    + "\"" + "p" + parmsList[i] + "\"" + ":" 
	    + p[parmsList[i]].toExponential(2);
	if (i < (parmsList.length - 1)) retStr += "," + "\n";
	else  retStr += "\n";
    }
    return(retStr);
}

// Get standard parameters for the n and p-type devices.
Fet_vs_parms.prototype.p = new Fet_vs_parms_type(-1);
Fet_vs_parms.prototype.n = new Fet_vs_parms_type(1);


// 1) Extract Parameters from text in JSON format in to Fet prototypes,
// so that all FET's are affected.
Fet_vs_parms.prototype.parse = function(fileString) {
    if (fileString.length ==  0) {
	var fetObj = null;
    } else {
	try {
	    var fetObj = JSON.parse(fileString);
	}
	catch(e) {
	    // JSON Format error in string, try to find it.
	    fetObj = null;
	    var commaInd = 0, foundit = false;
	    for (var rs = fileString.slice(1,-1); // remove { and }
		 rs.length > 0;
		 rs = rs.slice(commaInd+1,rs.length)) {
		commaInd = rs.indexOf(",");		
		commaInd = (commaInd > 0) ? commaInd : rs.length;
		var rss = "{" + rs.slice(0,commaInd) + "}";
		try {
		    var fetObjt = JSON.parse(rss);
		} 
		catch(e) {
		    alert("Syntax error near " + rss + 
			  "\n Format for parm file: key colon val comma" +
			  "\n Any missing colons or commas?");
		    foundit = true;
		    break;
		} 
	    }
	    if (foundit == false)
		alert("Could not find the syntax error in " + fileString
		      + "\n Format for parameter file: key colon val comma"
		      + "\n Any missing colons or commas?");
	}
    }    
    var updateParm = new Object(); updateParm.n = 0; updateParm.p = 0;
    for (var keystr in fetObj) {
	var k1 = keystr.substring(0,1);
	var krest = keystr.substring(1,keystr.length);
	var val = fetObj[keystr];
	if ((k1 == "n") || (k1 == "p")) {
	    if (Fet_vs_parms.prototype[k1][krest] == undefined) {
		alert("unknown parameter name " + krest);
	    } else {
		updateParm[k1] += 1;
		Fet_vs_parms.prototype[k1][krest] = val;
	    }
	} else {
	    alert("unknown model type " + k1);
	}
    }
    return(updateParm);
}

// 1) Extract Parameters from text in JSON format if it exists.
// 2) Post process the parameters.
Fet_vs_parms.prototype.finalize = function(fileString) {

    // First put in the default parameters.
    var defaultP = Fet_vs_parms.prototype.vs_parm_default;
    var updateParm = Fet_vs_parms.prototype.parse(defaultP);

    // If there is a fileString passed in, process it to update
    // the prototype parameters.
    if (fileString != undefined) {
	updateParm = Fet_vs_parms.prototype.parse(fileString);
	//var dispN = niceDisp(Fet_vs_parms.prototype.n);
	//var dispP = niceDisp(Fet_vs_parms.prototype.p);
	var dispText = niceDispCourse(Fet_vs_parms.prototype.n, 
				      Fet_vs_parms.prototype.p);
	alert( updateParm["n"] + " VS N-Fet" + "          \t"
	       + updateParm["p"] + " VS P-Fet\n"
	       + "Updated   " + "         \t" + "Updated\n"
	       + "Parameters" + "         \t" + "Parameters\n"
	       +  "\n"
	       + dispText);
    }

    Fet_vs_parms.prototype.p.postproc();
    Fet_vs_parms.prototype.n.postproc();
}

// Uses javascript file API in html5 to read local file
function rdFetF(eventt) {

    // Helper function, Process the file data given as a string
    function procFileStr(fileString) {
	if (fileString.length > 0) {
	    // Get rid of end of line characters
	    fileString = fileString.replace(/(\r\n|\n|\r)/gm,"");
	    // Show results
	    //alert( "Fet Parameters Received\n" + fileString);
	}
	// Put in curly braces for JSON.
	fileString = "{" + fileString + "}";
	
	// Modify the prototype so that all fets are affected.
	Fet_vs_parms.prototype.finalize(fileString);
    }

    // Get file from event, event might be new file name or reload
    var fetFile = null;
    if (eventt.target.files != null) {
	fetFile = eventt.target.files[0];
    } else {
	var tempf = document.getElementById('fetParms');
	if (tempf == undefined) fetFile = undefined;
	else fetFile = tempf.files[0];
    }

    // Check for undefined file and process null string.
    if (fetFile == undefined) {
	alert("No Parameter File Name Specified.");
	procFileStr("");
    }    
    // Else read the file and process.
    else {
	var freader = new FileReader();
	freader.onload = function(ff) {
	    var fileString = ff.target.result;
	    procFileStr(fileString);
	}
	freader.readAsText(fetFile);
    }
}

//document.querySelector('.fet_reload').addEventListener('click',rdFetF,false);


