//////////////////////////////////////////////////////////////////////////////
//
//  Circuit simulator
//
//////////////////////////////////////////////////////////////////////////////

// Copyright (C) 2011 Massachusetts Institute of Technology
// Copyright (C) 2015-2020 Modifications by Khan Academy and Willy McAllister, Spinning Numbers.

// create a circuit for simulation using "new cktsim.Circuit()"

// for modified nodal analysis (MNA) stamps see
// http://www.analog-electronics.eu/analog-electronics/modified-nodal-analysis/modified-nodal-analysis.xhtml

/*jshint esversion: 6 */

var i18n;	//internationalization translated strings

var cktsim = (function() {
	
	///////////////////////////////////////////////////////////////////////////////
	//
	//  Circuit
	//
	//////////////////////////////////////////////////////////////////////////////

    // types of "nodes" in the linear system
    const T_VOLTAGE = 0;
    const T_CURRENT = 1;

    const v_newt_lim = 0.3; // Voltage limited Newton great for Mos/diodes
    const v_abstol = 1e-6; // Absolute voltage error tolerance
    const i_abstol = 1e-12; // Absolute current error tolerance
    const eps = 1.0e-12; // A very small number compared to one.
    const dc_max_iters = 1000; // max iterations before giving up
    const max_tran_iters = 20; // max iterations before giving up
    const time_step_increase_factor = 2.0; // How much can lte let timestep grow.
    const lte_step_decrease_factor = 8; // Limit lte one-iter timestep shrink.
    const nr_step_decrease_factor = 4; // Newton failure timestep shrink.
    const reltol = 0.0001; // Relative tol to max observed value
    const lterel = 10; // LTE/Newton tolerance ratio (> 10!)
    const res_check_abs = Math.sqrt(i_abstol); // Loose Newton residue check
    const res_check_rel = Math.sqrt(reltol); // Loose Newton residue check

    function Circuit() {
    	this.node_map = [];
    	this.ntypes = [];
    	this.initial_conditions = [];
    	this.devices = [];
    	this.device_map = [];
    	this.voltage_sources = [];
    	this.current_sources = [];
    	this.finalized = false;
    	this.diddc = false;
    	this.node_index = -1;
    	this.periods = 1;
    }

	// index of ground node
	Circuit.prototype.gnd_node = function() {
		return -1;
	};

	// allocate a new node index
	Circuit.prototype.node = function(name,ntype,ic) {
		this.node_index += 1;
		if (name) this.node_map[name] = this.node_index;
		this.ntypes.push(ntype);
		this.initial_conditions.push(ic);
		return this.node_index;
	};

	// call to finalize the circuit in preparation for simulation
	Circuit.prototype.finalize = function() {
		if (!this.finalized) {
			this.finalized = true;
			this.N = this.node_index + 1;  // number of nodes

			// give each device a chance to finalize itself
			for (let i = this.devices.length - 1; i >= 0; --i)
				this.devices[i].finalize(this);

			// set up augmented matrix and various temp vectors
			this.matrix = mat_make(this.N, this.N+1);
			this.Gl = mat_make(this.N, this.N);  // Matrix for linear conductances
			this.Cl = mat_make(this.N, this.N);  // Matrix for x-indep dq/dx  WMc
			this.G = mat_make(this.N, this.N);  // Complete conductance matrix
			this.C = mat_make(this.N, this.N);  // Matrix for linear L's and C's

			this.soln_max = new Array(this.N);   // max abs value seen for each unknown
			this.abstol = new Array(this.N);
			this.solution = new Array(this.N);
			this.rhs = new Array(this.N);
			for (let i = this.N - 1; i >= 0; --i) {	    
				this.soln_max[i] = 0.0;
				this.abstol[i] = this.ntypes[i] == T_VOLTAGE ? v_abstol : i_abstol;
				this.solution[i] = 0.0;
				this.rhs[i] = 0.0;
			}

			// Load up the linear elements once and for all
			for (let i = this.devices.length - 1; i >= 0; --i) {
				this.devices[i].load_linear(this);
			}

			// Check for voltage source loops. 
			var n_vsrc = this.voltage_sources.length;
			if (n_vsrc > 0) { // At least one voltage source
			    var GV = mat_make(n_vsrc, this.N);  // Loop check
			    for (let i = n_vsrc - 1; i >= 0; --i) {
			    	var branch = this.voltage_sources[i].branch;
			    	for (let j = this.N - 1; j >= 0; j--)
			    		GV[i][j] = this.Gl[branch][j];
			    }
			    var rGV = mat_rank(GV);
			    if (rGV < n_vsrc) {
			    	//alert('Warning!!! Circuit has a voltage source loop or a source or current probe shorted by a wire, please remove the source or the wire causing the short.');
			    	//alert('Warning!!! Simulator might produce meaningless results or no result with illegal circuits.');
			    	alert(i18n.ckt_alert1);
			    	alert(i18n.ckt_alert2);
			    	return false;		
			    }
			}
		}
		return true;		
	};

	// load circuit from JSON netlist (see schematic.js)
	Circuit.prototype.load_netlist = function(netlist) {
	    // set up mapping for all ground connections
	    for (let i = netlist.length - 1; i >= 0; --i) {
	    	let component = netlist[i];
	    	let type = component[0];
	    	if (type == 'g') {
	    		let connections = component[3];
	    		this.node_map[connections[0]] = this.gnd_node();
	    	}
	    }

	    // process each component in the JSON netlist (see schematic.js for format)
	    var found_ground = false;
	    for (let i = netlist.length - 1; i >= 0; --i) {
	    	let component = netlist[i];
	    	let type = component[0];

		// ignore wires, ground connections, scope probes and view info
		if (type == 'view' || type == 'w' || type == 'g' || type == 's' || type == 'L') {
			continue;
		}

		var properties = component[2];
		var name = properties.name;
		if (name==undefined || name=='')
			name = '_' + properties._json_.toString();

		// convert node names to circuit indicies
		let connections = component[3];
		for (let j = connections.length - 1; j >= 0; --j) {
			var node = connections[j];
			var index = this.node_map[node];
			if (index == undefined) index = this.node(node,T_VOLTAGE);
			else if (index == this.gnd_node()) found_ground = true;
			connections[j] = index;
		}

		// process the component
		if (type == 'r')	// resistor
			this.r(connections[0],connections[1],properties.r,name);
		else if (type == 'd')	// diode
			this.d(connections[0],connections[1],properties.area,properties.type,name);
		else if (type == 'c')   // capacitor
			this.c(connections[0],connections[1],properties.c,name);
		else if (type == 'l')	// inductor
			this.l(connections[0],connections[1],properties.l,name);
		else if (type == 'v') 	// voltage source
			this.v(connections[0],connections[1],properties.value,name);
		else if (type == 'i') 	// current source
			this.i(connections[0],connections[1],properties.value,name);
		else if (type == 'o') 	// op amp
			this.opamp(connections[0],connections[1],connections[2],connections[3],properties.A,name);
		else if (type == 'o2') 	// op amp realistic
		    this.opamp2(connections[0],connections[1],connections[2],connections[3],connections[4],properties.Gain,properties.Rout,properties.Rin,name);
		else if (type == 'npn')	// npn bipolar transistor
		    this.nBJT(connections[0],connections[1],connections[2],properties.area,properties.Ics,properties.Ies,properties.alphaF,properties.alphaR,name);
		else if (type == 'pnp')	// pnp bipolar transistor
		    this.pBJT(connections[0],connections[1],connections[2],properties.area,properties.Ics,properties.Ies,properties.alphaF,properties.alphaR,name);
		else if (type == 'n') 	// n fet
			this.n(connections[0],connections[1],connections[2],properties.WL,name);
		else if (type == 'p') 	// p fet
			this.p(connections[0],connections[1],connections[2],properties.WL,name);
		else if (type == 'a') 	// current probe == 0-volt voltage source
			this.v(connections[0],connections[1],'0',name);
	}

	    if (!found_ground) { // No ground on schematic
	    	//alert('Please make at least one connection to ground (triangle symbol)');
	    	alert(i18n.ckt_alert3);

		/*	var content = document.createElement('div');
			var strAlert = document.createTextNode(i18n.ckt_alert3);
			content.appendChild(strAlert);
		    this.dialog(i18n.Alert,content);

	    	return false;	*/
	    }
	    return true;
	};

	// if converges: updates this.solution, this.soln_max, returns iter count
	// otherwise: return undefined and set this.problem_node
	// Load should compute -f and df/dx (note the sign pattern!)
	Circuit.prototype.find_solution = function(load,maxiters) {
		var soln = this.solution;
		var rhs = this.rhs;
		var d_sol = [];
		var abssum_compare;
		var converged,abssum_old=0, abssum_rhs;
		var use_limiting = false;
		var down_count = 0;
		var thresh;

	    // iteratively solve until values convere or iteration limit exceeded
	    for (let iter = 0; iter < maxiters; iter++) {
		// set up equations
		load(this,soln,rhs);

		// Compute norm of rhs, assume variables of v type go with eqns of i type
		abssum_rhs = 0;
		for (let i = this.N - 1; i >= 0; --i)
			if (this.ntypes[i] == T_VOLTAGE)
				abssum_rhs += Math.abs(rhs[i]);

			if ((iter > 0) && (use_limiting == false) && (abssum_old < abssum_rhs)) {  
		    // Old rhsnorm was better, undo last iter and turn on limiting
		    for (let i = this.N - 1; i >= 0; --i)
		    	soln[i] -= d_sol[i];
		    iter -= 1;
		    use_limiting = true;
		}
	        else {  // Compute the Newton delta
	        	d_sol = mat_solve_rq(this.matrix,rhs);

		    // If norm going down for ten iters, stop limiting
		    if (abssum_rhs < abssum_old)
		    	down_count += 1;
		    else 
		    	down_count = 0;
		    if (down_count > 10) {
		    	use_limiting = false;
		    	down_count = 0;
		    }

		    // Update norm of rhs
		    abssum_old = abssum_rhs;		    
		}

		// Update the worst case abssum for comparison.
		if ((iter == 0) || (abssum_rhs > abssum_compare))
			abssum_compare = abssum_rhs;

		// Check residue convergence, but loosely, and give up 
		// on last iteration
		if ( (iter < (maxiters - 1)) &&
			(abssum_rhs > (res_check_abs+res_check_rel*abssum_compare)))
			converged = false;
		else converged = true;


		// Update solution and check delta convergence
		for (let i = this.N - 1; i >= 0; --i) {
		    // Simple voltage step limiting to encourage Newton convergence
		    if (use_limiting) {
		    	if (this.ntypes[i] == T_VOLTAGE) {
		    		d_sol[i] = (d_sol[i] > v_newt_lim) ? v_newt_lim : d_sol[i];
		    		d_sol[i] = (d_sol[i] < -v_newt_lim) ? -v_newt_lim : d_sol[i];
		    	}
		    }
		    soln[i] += d_sol[i];
		    thresh = this.abstol[i] + reltol*this.soln_max[i];
		    if (Math.abs(d_sol[i]) > thresh) {
		    	converged = false;
		    	this.problem_node = i;
		    }
		}

		if (converged == true) {
			for (let i = this.N - 1; i >= 0; --i) 
				if (Math.abs(soln[i]) > this.soln_max[i])
					this.soln_max[i] = Math.abs(soln[i]);
				return iter+1;
			}
		}
		return undefined;
	};

	// DC analysis
	Circuit.prototype.dc = function() {
	    // Allocation matrices for linear part, etc.
	    if (this.finalize() == false)
	    	return undefined;

	    // Define -f and df/dx for Newton solver
	    function load_dc(ckt,soln,rhs) {
			// rhs is initialized to -Gl * soln
			mat_v_mult(ckt.Gl, soln, rhs, -1.0);
			// G matrix is initialized with linear Gl
			mat_copy(ckt.Gl,ckt.G);
			// Now load up the nonlinear parts of rhs and G
			for (let i = ckt.devices.length - 1; i >= 0; --i)
				ckt.devices[i].load_dc(ckt,soln,rhs);
			// G matrix is copied in to the system matrix
			mat_copy(ckt.G,ckt.matrix);
		}

	    // find the operating point
	    var iterations = this.find_solution(load_dc,dc_max_iters);

	    if (typeof iterations == 'undefined') {
	    // too many iterations
	    if (this.current_sources.length > 0) {
	    	//alert('Newton Method Failed, do your current sources have a conductive path to ground?');
	    	alert(i18n.ckt_alert4);
	    } else {
	    	//alert('Newton Method Failed, it may be your circuit or it may be our simulator.');
	    	alert(i18n.ckt_alert5);
	    }

	    return undefined;
		} else {
			// Note that a dc solution was computed
			this.diddc = true;
			// create solution dictionary
			var result = [];
			// capture node voltages
			for (let name in this.node_map) {
				var index = this.node_map[name];
				result[name] = (index == -1) ? 0 : this.solution[index];
			}
			// capture branch currents from voltage sources
			for (let i = this.voltage_sources.length - 1; i >= 0; --i) {
				var v = this.voltage_sources[i];
				result['I('+v.name+')'] = this.solution[v.branch];
			}
			return result;
		}
	};

	// Transient analysis (needs work!)
	Circuit.prototype.tran = function(ntpts, tstart, tstop, probenames, no_dc) {

	    // Define -f and df/dx for Newton solver
	    function load_tran(ckt,soln,rhs) {
		// Crnt is initialized to -Gl * soln
		mat_v_mult(ckt.Gl, soln, ckt.c,-1.0);
		// G matrix is initialized with linear Gl
		mat_copy(ckt.Gl,ckt.G);
		// Now load up the nonlinear parts of crnt and G
		for (let i = ckt.devices.length - 1; i >= 0; --i)
			ckt.devices[i].load_tran(ckt,soln,ckt.c,ckt.time);
		// Exploit the fact that storage elements are linear
		mat_v_mult(ckt.C, soln, ckt.q, 1.0);
		// -rhs = c - dqdt
		for (let i = ckt.N-1; i >= 0; --i) {
			var dqdt = ckt.alpha0*ckt.q[i] + ckt.alpha1*ckt.oldq[i] + 
			ckt.alpha2*ckt.old2q[i];
			rhs[i] = ckt.beta0[i]*ckt.c[i] + ckt.beta1[i]*ckt.oldc[i] - dqdt;
		}
		// matrix = beta0*G + alpha0*C.
		mat_scale_add(ckt.G,ckt.C,ckt.beta0,ckt.alpha0,ckt.matrix);
	}

	var p = new Array(3);
	function interp_coeffs(t, t0, t1, t2) {
		// Poly coefficients
		var dtt0 = (t - t0);
		var dtt1 = (t - t1);
		var dtt2 = (t - t2);
		var dt0dt1 = (t0 - t1);
		var dt0dt2 = (t0 - t2);
		var dt1dt2 = (t1 - t2);
		p[0] = (dtt1*dtt2)/(dt0dt1 * dt0dt2);
		p[1] = (dtt0*dtt2)/(-dt0dt1 * dt1dt2);
		p[2] = (dtt0*dtt1)/(dt0dt2 * dt1dt2);
		return p;
	}

	function pick_step(ckt, step_index) {
		var min_shrink_factor = 1.0/lte_step_decrease_factor;
		var max_growth_factor = time_step_increase_factor;
		//var N = ckt.N;		//WMc not used
		var p = interp_coeffs(ckt.time, ckt.oldt, ckt.old2t, ckt.old3t);
		var trapcoeff = 0.5*(ckt.time - ckt.oldt)/(ckt.time - ckt.old3t);
		var maxlteratio = 0.0;
		for (let i = ckt.N-1; i >= 0; --i) {
		    if (ckt.ltecheck[i]) { // Check lte on variable
		    	var pred = p[0]*ckt.oldsol[i] + p[1]*ckt.old2sol[i] + p[2]*ckt.old3sol[i];
		    	var lte = Math.abs((ckt.solution[i] - pred))*trapcoeff;
		    	var lteratio = lte/(lterel*(ckt.abstol[i] + reltol*ckt.soln_max[i]));
		    	maxlteratio = Math.max(maxlteratio, lteratio);
		    }
		}
		var new_step;
		var lte_step_ratio = 1.0/Math.pow(maxlteratio,1/3); // Cube root because trap
		if (lte_step_ratio < 1.0) { // Shrink the timestep to make lte
			lte_step_ratio = Math.max(lte_step_ratio,min_shrink_factor);
			new_step = (ckt.time - ckt.oldt)*0.75*lte_step_ratio;
			new_step = Math.max(new_step, ckt.min_step);
		} else {
			lte_step_ratio = Math.min(lte_step_ratio, max_growth_factor);
			if (lte_step_ratio > 1.2)  /* Increase timestep due to lte. */
				new_step = (ckt.time - ckt.oldt) * lte_step_ratio / 1.2;
			else 
				new_step = (ckt.time - ckt.oldt);
			new_step = Math.min(new_step, ckt.max_step);
		}
		return new_step;
	}

	    // Standard to do a dc analysis before transient
	    // Otherwise, do the setup also done in dc.
	    no_dc = false;
	    if ((this.diddc == false) && (no_dc == false)) {
			if (this.dc() == undefined) { // DC failed, realloc mats and vects.
				//alert('DC failed, trying transient analysis from zero.');		    
				alert(i18n.ckt_alert6);		    
			    this.finalized = false;  // Reset the finalization.
			    if (this.finalize() == false) 
			    	return undefined;
			}
		}
		else {
			if (this.finalize() == false) // Allocate matrices and vectors.
				return undefined;
		}

	    // Tired of typing this, and using "with" generates hate mail.
	    var N = this.N;

	    // build array to hold list of results for each variable
	    // last entry is for timepoints.
	    var response = new Array(N + 1);
	    for (let i = N; i >= 0; --i) response[i] = [];

	    // Allocate back vectors for up to a second order method
		this.old3sol = new Array(this.N);
		this.old3q = new Array(this.N);
		this.old2sol = new Array(this.N);
		this.old2q = new Array(this.N);
		this.oldsol = new Array(this.N);
		this.oldq = new Array(this.N);
		this.q = new Array(this.N);
		this.oldc = new Array(this.N);
		this.c = new Array(this.N);
		this.alpha0 = 1.0;
		this.alpha1 = 0.0;
		this.alpha2 = 0.0;
		this.beta0 = new Array(this.N);
		this.beta1 = new Array(this.N);

	    // Mark a set of algebraic variable (don't miss hidden ones!).
	    this.ar = this.algebraic(this.C);

	    // Non-algebraic variables and probe variables get lte
	    this.ltecheck = new Array(this.N);
	    for (let i = N; i >= 0; --i) 
	    	this.ltecheck[i] = (this.ar[i] == 0);

	    for (let name in this.node_map) {
	    	let index = this.node_map[name];
	    	for (let i = probenames.length; i >= 0; --i) {
	    		if (name == probenames[i]) {
	    			this.ltecheck[index] = true;
	    			break;
	    		}
	    	}
	    }

	    // Check for periodic sources
	    var period = tstop - tstart;
	    for (let i = this.voltage_sources.length - 1; i >= 0; --i) {
	    	let per = this.voltage_sources[i].src.period;
	    	if (per > 0)
	    		period = Math.min(period, per);
	    }
	    for (let i = this.current_sources.length - 1; i >= 0; --i) {
	    	let per = this.current_sources[i].src.period;
	    	if (per > 0)
	    		period = Math.min(period, per);
	    }
	    this.periods = Math.ceil((tstop - tstart)/period);

	    this.time = tstart;
	    // ntpts adjusted by numbers of periods in input
	    this.max_step = (tstop - tstart)/(this.periods*ntpts);
	    this.min_step = this.max_step/1e8;
	    var new_step = this.max_step/1e6;
	    this.oldt = this.time - new_step;

	    // Initialize old crnts, charges, and solutions.
	    load_tran(this,this.solution,this.rhs);
	    for (let i = N-1; i >= 0; --i) {
	    	this.old3sol[i] = this.solution[i];
	    	this.old2sol[i] = this.solution[i];
	    	this.oldsol[i] = this.solution[i];
	    	this.old3q[i] = this.q[i]; 
	    	this.old2q[i] = this.q[i]; 
	    	this.oldq[i] = this.q[i]; 
	    	this.oldc[i] = this.c[i]; 
	    }

	    var beta0,beta1;
	    // Start with two pseudo-Euler steps, maximum 50000 steps/period
	    var max_nsteps = this.periods*50000;
	    for(var step_index = -3; step_index < max_nsteps; step_index++) {
			// Save the just computed solution, and move back q and c.
			for (let i = this.N - 1; i >= 0; --i) {
				if (step_index >= 0)
					response[i].push(this.solution[i]);
				this.oldc[i] = this.c[i];
				this.old3sol[i] = this.old2sol[i];
				this.old2sol[i] = this.oldsol[i];
				this.oldsol[i] = this.solution[i];
				this.old3q[i] = this.oldq[i];
				this.old2q[i] = this.oldq[i];
				this.oldq[i] = this.q[i];
			}

			if (step_index < 0) {  // Take a prestep using BE
				this.old3t = this.old2t - (this.oldt-this.old2t);
				this.old2t = this.oldt - (tstart-this.oldt);
				this.oldt = tstart - (this.time - this.oldt);
				this.time = tstart;
				beta0 = 1.0;  
				beta1 = 0.0;		
			} else {  // Take a regular step
			    // Save the time, and rotate time wheel
			    response[this.N].push(this.time);
			    this.old3t = this.old2t;
			    this.old2t = this.oldt;
			    this.oldt = this.time;
			    // Make sure we come smoothly in to the interval end.
			    if (this.time >= tstop) break;  // We're done.
			    else if(this.time + new_step > tstop)
			    	this.time = tstop;
			    else if(this.time + 1.5*new_step > tstop)
			    	this.time += (2/3)*(tstop - this.time);
			    else
			    	this.time += new_step;

			    // Use trap (average old and new crnts.
			    	beta0 = 0.5;
			    	beta1 = 0.5;	
			    }

			// For trap rule, turn off current avging for algebraic eqns
			for (let i = this.N - 1; i >= 0; --i) {
				this.beta0[i] = beta0 + this.ar[i]*beta1;
				this.beta1[i] = (1.0 - this.ar[i])*beta1;
			}

			// Loop to find NR converging timestep with okay LTE
			while (true) {
			    // Set the timestep coefficients (alpha2 is for bdf2).
			    this.alpha0 = 1.0/(this.time - this.oldt);
			    this.alpha1 = -this.alpha0;
			    this.alpha2 = 0;

			    // If timestep is 1/10,000th of tstop, just use BE.
			    if ((this.time-this.oldt) < 1.0e-4*tstop) {
			    	for (let i = this.N - 1; i >= 0; --i) {
			    		this.beta0[i] = 1.0;
			    		this.beta1[i] = 0.0;
			    	}
			    }  
			    // Use Newton to compute the solution.
			    var iterations = this.find_solution(load_tran,max_tran_iters);

			    // If NR succeeds and stepsize is at min, accept and newstep=maxgrowth*minstep.
			    // Else if Newton Fails, shrink step by a factor and try again
			    // Else LTE picks new step, if bigger accept current step and go on.
			    if ((iterations != undefined) && 
			    	(step_index <= 0 || (this.time-this.oldt) < (1+reltol)*this.min_step)) {
			    	if (step_index > 0) new_step = time_step_increase_factor*this.min_step;
			    break;
			    } else if (iterations == undefined) {  // NR nonconvergence, shrink by factor
			    	this.time = this.oldt + 
			    	(this.time - this.oldt)/nr_step_decrease_factor;
			    } else {  // Check the LTE and shrink step if needed.
			    	new_step = pick_step(this, step_index);
			    	if (new_step < (1.0 - reltol)*(this.time - this.oldt)) {
				    this.time = this.oldt + new_step;  // Try again   
				}
				else
				    break;  // LTE okay, new_step for next step
				}
			}
		}

	    // create solution dictionary
	    var result = [];
	    for (let name in this.node_map) {
	    	let index = this.node_map[name];
	    	result[name] = (index == -1) ? 0 : response[index];
	    }
	    // capture branch currents from voltage sources
	    for (let i = this.voltage_sources.length - 1; i >= 0; --i) {
	    	let v = this.voltage_sources[i];
	    	result['I('+v.name+')'] = response[v.branch];
	    }

	    result._time_ = response[this.N];
	    return result;
	};

	// AC analysis: npts/decade for freqs in range [fstart,fstop]
	// result['_frequencies_'] = vector of log10(sample freqs)
	// result['xxx'] = vector of dB(response for node xxx)
        // NOTE: Normalization removed in schematic.js, jkw.
        Circuit.prototype.ac = function(npts,fstart,fstop,source_name) {

	    if (this.dc() == undefined) { // DC failed, realloc mats and vects.
	    	return undefined;
	    }

	    var N = this.N;
	    var G = this.G;
	    var C = this.C;

	    // Complex numbers, we're going to need a bigger boat
	    var matrixac = mat_make(2*N, (2*N)+1);

            // Get the source used for ac
            if (this.device_map[source_name] === undefined) {
            	//alert('AC analysis refers to unknown source ' + source_name);
            	//return 'AC analysis failed, unknown source';            	
            	alert(i18n.ckt_alert7 + source_name);
            	return i18n.ckt_alert8;
            }
            this.device_map[source_name].load_ac(this,this.rhs);

	    // build array to hold list of magnitude and phases for each node
	    // last entry is for frequency values
	    var response = new Array(2*N + 1);
	    for (let i = 2*N; i >= 0; --i) response[i] = [];

	    // multiplicative frequency increase between freq points
	var delta_f = Math.exp(Math.LN10/npts);

	var phase_offset = new Array(N);
	for (let i = N-1; i >= 0; --i) phase_offset[i] = 0;

		var f = fstart;
	    fstop *= 1.0001;  // capture that last freq point!
	    while (f <= fstop) {
	    	var omega = 2 * Math.PI * f;
		response[2*N].push(f);   // 2*N for magnitude and phase

		// Find complex x+jy that sats Gx-omega*Cy=rhs; omega*Cx+Gy=0
		// Note: solac[0:N-1]=x, solac[N:2N-1]=y
		for (let i = N-1; i >= 0; --i) {
		    // First the rhs, replicated for real and imaginary
		    matrixac[i][2*N] = this.rhs[i];
		    matrixac[i+N][2*N] = 0;

		    for (let j = N-1; j >= 0; --j) {
		    	matrixac[i][j] = G[i][j];
		    	matrixac[i+N][j+N] = G[i][j];
		    	matrixac[i][j+N] = -omega*C[i][j];
		    	matrixac[i+N][j] = omega*C[i][j];
		    }
		}

		// Compute the small signal response
		var solac = mat_solve(matrixac);

		// Save magnitude and phase
		for (let i = N - 1; i >= 0; --i) {
			var mag = Math.sqrt(solac[i]*solac[i] + solac[i+N]*solac[i+N]);
			response[i].push(mag);

		    // Avoid wrapping phase, add or sub 180 for each jump
		    var phase = 180*(Math.atan2(solac[i+N],solac[i])/Math.PI);
		    var phasei = response[i+N];
		    var L = phasei.length;
		    // Look for a one-step jump greater than 90 degrees
		    if (L > 1) {
		    	var phase_jump = phase + phase_offset[i] - phasei[L-1];
		    	if (phase_jump > 90) {
		    		phase_offset[i] -= 360;
		    	} else if (phase_jump < -90) {
		    		phase_offset[i] += 360;
		    	}
		    }
		    response[i+N].push(phase + phase_offset[i]);
		}
		f *= delta_f;    // increment frequency
	}

	    // create solution dictionary
	    var result = [];
	    for (let name in this.node_map) {
	    	let index = this.node_map[name];
	    	result[name] = (index == -1) ? 0 : response[index];
	    	result[name+'_phase'] = (index == -1) ? 0 : response[index+N];
	    }
	    result._frequencies_ = response[2*N];
	    return result;
	};

        // Helper for adding devices to a circuit, warns on duplicate device names.
        Circuit.prototype.add_device = function(d,name) {
	    // Add device to list of devices and to device map
	    this.devices.push(d);
	    d.name = name;
	    if (name) {
	    	if (this.device_map[name] === undefined) 
	    		this.device_map[name] = d;
	    	else {
	    		//alert('Warning: two circuit elements share the same name ' + name);
	    		alert(i18n.ckt_warning1 + name);
	    		this.device_map[name] = d;
	    	}
	    }
	    return d;
	};

	Circuit.prototype.r = function(n1,n2,v,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof v) == 'string') {
	    	v = parse_number(v,undefined);
	    	if (v === undefined) return undefined;
	    }

	    if (v != 0) {
	    	let d = new Resistor(n1,n2,v);
	    	return this.add_device(d, name);
	    } else return this.v(n1,n2,'0',name);   // zero resistance == 0V voltage source
	};

	Circuit.prototype.d = function(n1,n2,area,type,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof area) == 'string') {
	    	area = parse_number(area,undefined);
	    	if (area === undefined) return undefined;
	    }

	    if (area != 0) {
	    	let d = new Diode(n1,n2,area,type);
	    	return this.add_device(d, name);
	    } // zero area diodes discarded.
	};

	Circuit.prototype.c = function(n1,n2,v,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof v) == 'string') {
	    	v = parse_number(v,undefined);
	    	if (v === undefined) return undefined;
	    }
	    let d = new Capacitor(n1,n2,v);
	    return this.add_device(d, name);
	};

	Circuit.prototype.l = function(n1,n2,v,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof v) == 'string') {
	    	v = parse_number(v,undefined);
	    	if (v === undefined) return undefined;
	    }
	    var branch = this.node(undefined,T_CURRENT);
	    let d = new Inductor(n1,n2,branch,v);
	    return this.add_device(d, name);
	};

	Circuit.prototype.v = function(n1,n2,v,name) {
		var branch = this.node(undefined,T_CURRENT);
		let d = new VSource(n1,n2,branch,v);
		this.voltage_sources.push(d);
		return this.add_device(d, name);
	};

	Circuit.prototype.i = function(n1,n2,v,name) {
		let d = new ISource(n1,n2,v);
		this.current_sources.push(d);
		return this.add_device(d, name);
	};

	Circuit.prototype.opamp = function(np,nn,no,ng,A,name) {
		var ratio;
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof A) == 'string') {
	    	ratio = parse_number(A,undefined);
	    	if (A === undefined) return undefined;
	    }
	    var branch = this.node(undefined,T_CURRENT);
	    let d = new Opamp(np,nn,no,ng,branch,A,name);
	    return this.add_device(d, name);
	};

	Circuit.prototype.opamp2 = function(nInP,nInN,nO,nP,nN,Gain,Ro,Rin,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof Gain) == 'string') {
			Gain = parse_number_alert(Gain);
			if (Gain === undefined) return undefined;
	    }
	    if ((typeof Ro) == 'string') {
			Ro = parse_number_alert(Ro);
			if (Ro === undefined) return undefined;
	    }
	    if ((typeof Rin) == 'string') {
			Rin = parse_number_alert(Rin);
			if (Rin === undefined) return undefined;
	    }
	    var nInt = this.node(name+'nInt',T_VOLTAGE);
	    var d = new Opamp2(nInP,nInN,nO,nP,nN,nInt,Gain,Ro,Rin,name);
	    return this.add_device(d, name);
	};

    Circuit.prototype.nBJT = function(c,b,e,area,Ics,Ies,alphaF,alphaR,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof area) == 'string') {
			area = parse_number(area,undefined);
		if (area === undefined) return undefined;
	    }
	    if ((typeof Ics) == 'string') {
		Ics = parse_number(Ics,undefined);
		if (Ics === undefined) return undefined;
	    }
	    if ((typeof Ies) == 'string') {
		Ies = parse_number(Ies,undefined);
		if (Ies === undefined) return undefined;
	    }
	    if ((typeof alphaF) == 'string') {
		alphaF = parse_number(alphaF,undefined);
		if (alphaF === undefined) return undefined;
	    }
	    if ((typeof alphaR) == 'string') {
		alphaR = parse_number(alphaR,undefined);
		if (alphaR === undefined) return undefined;
	    }
	    let d = new bjt(c,b,e,area,Ics,Ies,alphaF,alphaR,name,'n');
	    return this.add_device(d, name);
	};

    Circuit.prototype.pBJT = function(c,b,e,area,Ics,Ies,alphaF,alphaR,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof area) == 'string') {
		area = parse_number(area,undefined);
		if (area === undefined) return undefined;
	    }
	    if ((typeof Ics) == 'string') {
		Ics = parse_number(Ics,undefined);
		if (Ics === undefined) return undefined;
	    }
	    if ((typeof Ies) == 'string') {
		Ies = parse_number(Ies,undefined);
		if (Ies === undefined) return undefined;
	    }
	    if ((typeof alphaF) == 'string') {
		alphaF = parse_number(alphaF,undefined);
		if (alphaF === undefined) return undefined;
	    }
	    if ((typeof alphaR) == 'string') {
		alphaR = parse_number(alphaR,undefined);
		if (alphaR === undefined) return undefined;
	    }
	    let d = new bjt(c,b,e,area,Ics,Ies,alphaF,alphaR,name,'p');
	    return this.add_device(d, name);
	};

	Circuit.prototype.n = function(d,g,s, ratio, name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof ratio) == 'string') {
	    	ratio = parse_number(ratio,undefined);
	    	if (ratio === undefined) return undefined;
	    }
	    let dd = new Fet(d,g,s,ratio,name,'n');
	    return this.add_device(dd, name);
	};

	Circuit.prototype.p = function(d,g,s, ratio, name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof ratio) == 'string') {
	    	ratio = parse_number(ratio,undefined);
	    	if (ratio === undefined) return undefined;
	    }
	    let dd = new Fet(d,g,s,ratio,name,'p');
	    return this.add_device(dd, name);
	};

	///////////////////////////////////////////////////////////////////////////////
	//
	//  Support for creating conductance and capacitance matrices associated with
    //  modified nodal analysis (unknowns are node voltages and inductor and voltage
    //  source currents). 
    //  The linearized circuit is written as 
    //          C d/dt x = G x + rhs
    //  x - vector of node voltages and element currents
    //  rhs - vector of source values
    //  C - Matrix whose values are capacitances and inductances, has many zero rows.
    //  G - Matrix whose values are conductances and +-1's.
	//
	////////////////////////////////////////////////////////////////////////////////

	// add val component between two nodes to matrix M
	// Index of -1 refers to ground node
	Circuit.prototype.add_two_terminal = function(i,j,g,M) {
		if (i >= 0) {
			M[i][i] += g;
			if (j >= 0) {
				M[i][j] -= g;
				M[j][i] -= g;
				M[j][j] += g;
			}
		} else if (j >= 0)
		M[j][j] += g;
	};

	// add val component between two nodes to matrix M
	// Index of -1 refers to ground node
	Circuit.prototype.get_two_terminal = function(i,j,x) {
		var xi_minus_xj = 0;
		if (i >= 0) xi_minus_xj = x[i];
		if (j >= 0) xi_minus_xj -= x[j];
		return xi_minus_xj;
	};

	Circuit.prototype.add_conductance_l = function(i,j,g) {
		this.add_two_terminal(i,j,g, this.Gl);
	};

	Circuit.prototype.add_conductance = function(i,j,g) {
		this.add_two_terminal(i,j,g, this.G);
	};

	Circuit.prototype.add_capacitance = function(i,j,c) {
		this.add_two_terminal(i,j,c,this.C);
	};

	Circuit.prototype.add_capacitance_l = function(i,j,c) {
        this.add_two_terminal(i,j,c,this.Cl);
	};

	// add individual conductance to Gl matrix
	Circuit.prototype.add_to_Gl = function(i,j,g) {
		if (i >=0 && j >= 0)
			this.Gl[i][j] += g;
	};

	// add individual conductance to G matrix
	Circuit.prototype.add_to_G = function(i,j,g) {
		if (i >=0 && j >= 0)
			this.G[i][j] += g;
	};

	// add individual capacitance to C matrix
	Circuit.prototype.add_to_C = function(i,j,c) {
		if (i >=0 && j >= 0)
			this.C[i][j] += c;
	};

	// add source info to rhs
	Circuit.prototype.add_to_rhs = function(i,v,rhs) {
		if (i >= 0)	rhs[i] += v;
	};


	///////////////////////////////////////////////////////////////////////////////
	//
	//  Generic matrix support - making, copying, factoring, rank, etc
	//  Note, Matrices are stored using nested javascript arrays.
	////////////////////////////////////////////////////////////////////////////////

    // Allocate an NxM matrix
    function mat_make(N,M) {
    	var mat = new Array(N);	
    	for (let i = N - 1; i >= 0; --i) {	    
    		mat[i] = new Array(M);
    		for (let j = M - 1; j >= 0; --j) {	    
    			mat[i][j] = 0.0;
    		}
    	}
    	return mat;
    }

    // Form b = scale*Mx
    function mat_v_mult(M,x,b,scale) {
    	var n = M.length;
    	var m = M[0].length;

    	if (n != b.length || m != x.length)
    		//throw 'Rows of M mismatched to b or cols mismatch to x.';
    		throw i18n.ckt_error1;

    	for (let i = 0; i < n; i++) {
    		let temp = 0;
    		for (let j = 0; j < m; j++) temp += M[i][j]*x[j];
			b[i] = scale*temp;  // Recall the neg in the name
		}
	}

    // C = scalea*A + scaleb*B, scalea, scaleb eithers numbers or arrays (row scaling)
    function mat_scale_add(A, B, scalea, scaleb, C) {
    	var n = A.length;
    	var m = A[0].length;

    	if (n > B.length || m > B[0].length)
    		//throw 'Row or columns of A to large for B';
    		throw i18n.ckt_error2;
    	if (n > C.length || m > C[0].length)
    		//throw 'Row or columns of A to large for C';
    		throw i18n.ckt_error3;
    	if ((typeof scalea == 'number') && (typeof scaleb == 'number'))
    		for (let i = 0; i < n; i++)
    			for (let j = 0; j < m; j++)
    				C[i][j] = scalea*A[i][j] + scaleb*B[i][j];
    			else if ((typeof scaleb == 'number') && (scalea instanceof Array))
    				for (let i = 0; i < n; i++)
    					for (let j = 0; j < m; j++)
    						C[i][j] = scalea[i]*A[i][j] + scaleb*B[i][j];
    					else if ((typeof scaleb instanceof Array) && (scalea instanceof Array))
    						for (let i = 0; i < n; i++)
    							for (let j = 0; j < m; j++)
    								C[i][j] = scalea[i]*A[i][j] + scaleb[i]*B[i][j];
    							else
    								//throw 'scalea and scaleb must be scalars or Arrays';
    								throw i18n.ckt_error4;
    }

    // Returns a vector of ones and zeros, ones denote algebraic
    // variables (rows that can be removed without changing rank(M).
	Circuit.prototype.algebraic = function(M) {
		var Nr = M.length;
		var Mc = mat_make(Nr, Nr);
		mat_copy(M,Mc);
		var R = mat_rank(Mc);

		var one_if_alg = new Array(Nr);
	    for (let row = 0; row < Nr; row++) {  // psuedo gnd row small
	    	for (let col = Nr - 1; col >= 0; --col)
	    		Mc[row][col] = 0;
			if (mat_rank(Mc) == R)  // Zeroing row left rank unchanged
				one_if_alg[row] = 1;
			else { // Zeroing row changed rank, put back
				for (let col = Nr - 1; col >= 0; --col)
					Mc[row][col] = M[row][col];
				one_if_alg[row] = 0;
			}
		}
		return one_if_alg;
	};

    // Copy A -> using the bounds of A
    function mat_copy(src,dest) {
    	var n = src.length;
    	var m = src[0].length;
    	if (n > dest.length || m >  dest[0].length)
    		//throw 'Rows or cols > rows or cols of dest';
    		throw i18n.ckt_error5;

    	for (let i = 0; i < n; i++)
    		for (let j = 0; j < m; j++)
    			dest[i][j] = src[i][j];
    }
    // Copy and transpose A -> using the bounds of A
    function mat_copy_transposed(src,dest) {
    	var n = src.length;
    	var m = src[0].length;
    	if (n > dest[0].length || m >  dest.length)
    		//throw 'Rows or cols > cols or rows of dest';
    		throw i18n.ckt_error6;

    	for (let i = 0; i < n; i++)
    		for (let j = 0; j < m; j++)
    			dest[j][i] = src[i][j];
    }

	// Uses GE to determine rank.
	function mat_rank(Mo) {
	    var Nr = Mo.length;  // Number of rows
	    var Nc = Mo[0].length;  // Number of columns
	    //var temp,i,j;
	    var temp;		//WMc i,j not used
	    // Make a copy to avoid overwriting
	    var M = mat_make(Nr, Nc);
	    mat_copy(Mo,M);

	    // Find matrix maximum entry
	    var max_abs_entry = 0;
	    for(var row = Nr-1; row >= 0; --row) {
	    	for(var col = Nr-1; col >= 0; --col) {
	    		if (Math.abs(M[row][col]) > max_abs_entry)
	    			max_abs_entry = Math.abs(M[row][col]);
	    	}
	    }

	    // Gaussian elimination to find rank
	    var the_rank = 0;
	    var start_col = 0;
	    for (let row = 0; row < Nr; row++) {
			// Search for first nonzero column in the remaining rows.
			for (let col = start_col; col < Nc; col++) {
				var max_v = Math.abs(M[row][col]);
				var max_row = row;
				for (let i = row + 1; i < Nr; i++) {
					temp = Math.abs(M[i][col]);
					if (temp > max_v) { max_v = temp; max_row = i; }
				}
			    // if max_v non_zero, column is nonzero, eliminate in subsequent rows
			    if (Math.abs(max_v) > eps*max_abs_entry) {
			    	start_col = col+1;
			    	the_rank += 1;
			        // Swap rows to get max in M[row][col]
			        temp = M[row];
			        M[row] = M[max_row];
			        M[max_row] = temp;

				// now eliminate this column for all subsequent rows
				for (let i = row + 1; i < Nr; i++) {
				    temp = M[i][col]/M[row][col];   // multiplier for current row
				    if (temp != 0)  // subtract 
				    	for (let j = col; j < Nc; j++) M[i][j] -= M[row][j]*temp;
				    }
				// Now move on to the next row
				break;
				}
			}
		}

		return the_rank;
	}

	// Solve Mx=b and return vector x using R^TQ^T factorization. 
    // Multiplication by R^T implicit, should be null-space free soln.
    // M should have the extra column!
    // Almost everything is in-lined for speed, sigh.
    function mat_solve_rq(M, rhs) {
    	var scale;
	    var Nr = M.length;  // Number of rows
	    var Nc = M[0].length;  // Number of columns

	    // Copy the rhs in to the last column of M if one is given.
	    if (rhs != null) {
	    	for (let row = Nr - 1; row >= 0; --row)
	    		M[row][Nc-1] = rhs[row];
	    }

	    var mat_scale = 0; // Sets the scale for comparison to zero.
	    var max_nonzero_row = Nr-1;  // Assumes M nonsingular.
	    for (let row = 0; row < Nr; row++) {  
			// Find largest row with largest 2-norm
			var max_row = row;
			var maxsumsq = 0;
			for (let rowp = row; rowp < Nr; rowp++) {
				let Mr = M[rowp];
				let sumsq = 0;
			    for (let col = Nc-2; col >= 0; --col)  // Last col=rhs
			    	sumsq += Mr[col]*Mr[col];
			    if ((row == rowp) || (sumsq > maxsumsq)) {
			    	max_row = rowp;
			    	maxsumsq = sumsq;
			    }
			}
			if (max_row > row) { // Swap rows if not max row
				let temp = M[row];
				M[row] = M[max_row];
				M[max_row] = temp;
			}

			// Calculate row norm, save if this is first (largest)
			var row_norm = Math.sqrt(maxsumsq);
			if (row == 0) mat_scale = row_norm;

			// Check for all zero rows
			if (row_norm > mat_scale*eps)
				scale = 1.0/row_norm;
			else {
			    max_nonzero_row = row - 1;  // Rest will be nullspace of M
			    break;
			}

			// Nonzero row, eliminate from rows below
			let Mr = M[row];
			for (let col =  Nc-1; col >= 0; --col) // Scale rhs also
				Mr[col] *= scale;
			for (let rowp = row + 1; rowp < Nr; rowp++) { // Update.
				let Mrp = M[rowp];
				let inner = 0;
			    for (let col =  Nc-2; col >= 0; --col)  // Project 
			    	inner += Mr[col]*Mrp[col];
			    for (let col =  Nc-1; col >= 0; --col) // Ortho (rhs also)
			    	Mrp[col] -= inner *Mr[col];
			}
		}

	    // Last Column of M has inv(R^T)*rhs.  Scale rows of Q to get x.
	    var x = new Array(Nc-1);
	    for (let col = Nc-2; col >= 0; --col)
	    	x[col] = 0;
	    for (let row = max_nonzero_row; row >= 0; --row) {
	    	let Mr = M[row];
	    	for (let col = Nc-2; col >= 0; --col) {
	    		x[col] += Mr[col]*Mr[Nc-1];
	    	}
	    }

	    return x;
	}

	// solve Mx=b and return vector x given augmented matrix M = [A | b]
	// Uses Gaussian elimination with partial pivoting
	function mat_solve(M,rhs) {
	    var N = M.length;      // augmented matrix M has N rows, N+1 columns
	    var temp,i,j;

	    // Copy the rhs in to the last column of M if one is given.
	    if (rhs != null) {
	    	for (let row = 0; row < N ; row++)
	    		M[row][N] = rhs[row];
	    }

	    // gaussian elimination
	    for (let col = 0; col < N ; col++) {
			// find pivot: largest abs(v) in this column of remaining rows
			var max_v = Math.abs(M[col][col]);
			var max_col = col;
			for (i = col + 1; i < N; i++) {
				temp = Math.abs(M[i][col]);
				if (temp > max_v) { max_v = temp; max_col = i; }
			}

			// if no value found, generate a small conductance to gnd
			// otherwise swap current row with pivot row
			if (max_v == 0) M[col][col] = eps; 
			else {
				temp = M[col];
				M[col] = M[max_col];
				M[max_col] = temp;
			}

			// now eliminate this column for all subsequent rows
			for (i = col + 1; i < N; i++) {
			    temp = M[i][col]/M[col][col];   // multiplier we'll use for current row
			    if (temp != 0)
				// subtract current row from row we're working on
				// remember to process b too!
				for (j = col; j <= N; j++) M[i][j] -= M[col][j]*temp;
			}
		}

	    // matrix is now upper triangular, so solve for elements of x starting
	    // with the last row
	    var x = new Array(N);
	    for (i = N-1; i >= 0; --i) {
			temp = M[i][N];   // grab b[i] from augmented matrix as RHS
			// subtract LHS term from RHS using known x values
			for (j = N-1; j > i; --j) temp -= M[i][j]*x[j];
			// now compute new x value
			x[i] = temp/M[i][i];
		}

		return x;
	}

	// test solution code, expect x = [2,3,-1]
	//M = [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]];
	//x = mat_solve(M);
	//y = 1;  // so we have place to set a breakpoint :)

	///////////////////////////////////////////////////////////////////////////////
	//
	//  Device base class
	//
	////////////////////////////////////////////////////////////////////////////////

	function Device() {
	}

	// complete initial set up of device
	Device.prototype.finalize = function() {
	};

    // Load the linear elements in to Gl and C
    Device.prototype.load_linear = function(ckt) {
    };

	// load linear system equations for dc analysis
	// (inductors shorted and capacitors opened)
	Device.prototype.load_dc = function(ckt,soln,rhs) {
	};

	// load linear system equations for tran analysis
	Device.prototype.load_tran = function(ckt,soln) {
	};

	// load linear system equations for ac analysis:
	// current sources open, voltage sources shorted
	// linear models at operating point for everyone else
	Device.prototype.load_ac = function(ckt,rhs) {
	};

	// return time of next breakpoint for the device
	Device.prototype.breakpoint = function(time) {
		return undefined;
	};

	///////////////////////////////////////////////////////////////////////////////
	//
	//  Parse numbers in engineering notation
	//
	///////////////////////////////////////////////////////////////////////////////

	// convert first character of argument into an integer
	function ord(ch) {
		return ch.charCodeAt(0);
	}

	// convert string argument to a number, accepting usual notations
	// (hex, octal, binary, decimal, floating point) plus engineering
	// scale factors (eg, 1k = 1000.0 = 1e3).
	// return default if argument couldn't be interpreted as a number
	function parse_number(s,default_v) {
		var slen = s.length;
		var multiplier = 1;
		var result = 0;
		var index = 0;

	    // skip leading whitespace
	    while (index < slen && s.charAt(index) <= ' ') index += 1;
	    if (index == slen) return default_v;

	    // check for leading sign
	    if (s.charAt(index) == '-') {
	    	multiplier = -1;
	    	index += 1;
	    } else if (s.charAt(index) == '+')
	    index += 1;
	    var start = index;   // remember where digits start

	    // if leading digit is 0, check for hex, octal or binary notation
	    if (index >= slen) return default_v;
	    else if (s.charAt(index) == '0') {
	    	index += 1;
	    	if (index >= slen) return 0;
		if (s.charAt(index) == 'x' || s.charAt(index) == 'X') { // hex
			while (true) {
				index += 1;
				if (index >= slen) break;
				if (s.charAt(index) >= '0' && s.charAt(index) <= '9')
					result = result*16 + ord(s.charAt(index)) - ord('0');
				else if (s.charAt(index) >= 'A' && s.charAt(index) <= 'F')
					result = result*16 + ord(s.charAt(index)) - ord('A') + 10;
				else if (s.charAt(index) >= 'a' && s.charAt(index) <= 'f')
					result = result*16 + ord(s.charAt(index)) - ord('a') + 10;
				else break;
			}
			return result*multiplier;
		} else if (s.charAt(index) == 'b' || s.charAt(index) == 'B') {  // binary
			while (true) {
				index += 1;
				if (index >= slen) break;
				if (s.charAt(index) >= '0' && s.charAt(index) <= '1')
					result = result*2 + ord(s.charAt(index)) - ord('0');
				else break;
			}
			return result*multiplier;
		} else if (s.charAt(index) != '.') { // octal
			while (true) {
				if (s.charAt(index) >= '0' && s.charAt(index) <= '7')
					result = result*8 + ord(s.charAt(index)) - ord('0');
				else break;
				index += 1;
				if (index >= slen) break;
			}
			return result*multiplier;
		}
		}
	    // read decimal integer or floating-point number
	    while (true) {
	    	if (s.charAt(index) >= '0' && s.charAt(index) <= '9')
	    		result = result*10 + ord(s.charAt(index)) - ord('0');
	    	else break;
	    	index += 1;
	    	if (index >= slen) break;
	    }

	    // fractional part?
	    if (index < slen && s.charAt(index) == '.') {
	    	while (true) {
	    		index += 1;
	    		if (index >= slen) break;
	    		if (s.charAt(index) >= '0' && s.charAt(index) <= '9') {
	    			result = result*10 + ord(s.charAt(index)) - ord('0');
	    			multiplier *= 0.1;
	    		} else break;
	    	}
	    }

	    // if we haven't seen any digits yet, don't check
	    // for exponents or scale factors
	    if (index == start) return default_v;

	    // type of multiplier determines type of result:
	    // multiplier is a float if we've seen digits past
	    // a decimal point, otherwise it's an int or long.
	    // Up to this point result is an int or long.
	    result *= multiplier;

	    // now check for exponent or engineering scale factor.  If there
	    // is one, result will be a float.
	    if (index < slen) {
	    	var scale = s.charAt(index);
	    	index += 1;
	    	if (scale == 'e' || scale == 'E') {
	    		var exponent = 0;
	    		multiplier = 10.0;
	    		if (index < slen) {
	    			if (s.charAt(index) == '+') index += 1;
	    			else if (s.charAt(index) == '-') {
	    				index += 1;
	    				multiplier = 0.1;
	    			}
	    		}
	    		while (index < slen) {
	    			if (s.charAt(index) >= '0' && s.charAt(index) <= '9') {
	    				exponent = exponent*10 + ord(s.charAt(index)) - ord('0');
	    				index += 1;
	    			} else break;
	    		}
	    		while (exponent > 0) {
	    			exponent -= 1;
	    			result *= multiplier;
	    		}
	    	} else if (scale == 't' || scale == 'T') result *= 1e12;
	    	else if (scale == 'g' || scale == 'G') result *= 1e9;
	    	else if (scale == 'M') result *= 1e6;
	    	else if (scale == 'k' || scale == 'K') result *= 1e3;
	    	else if (scale == 'm') result *= 1e-3;
	    	else if (scale == 'u' || scale == 'U') result *= 1e-6;
	    	else if (scale == 'n' || scale == 'N') result *= 1e-9;
	    	else if (scale == 'p' || scale == 'P') result *= 1e-12;
	    	else if (scale == 'f' || scale == 'F') result *= 1e-15;
	    }
	    // ignore any remaining chars, eg, 1kohms returns 1000
	    return result;
	}

	Circuit.prototype.parse_number = parse_number;  // make it easy to call from outside

	// try to parse a number and generate an alert if there was a syntax error
	function parse_number_alert(s) {
	    var v = parse_number(s,undefined);

	    if (v == undefined)
		alert('The string \"'+s+'\" could not be interpreted as an integer, a floating-point number or a number using engineering notation. Sorry, expressions are not allowed in this context.');

	    return v;
	}

	Circuit.prototype.parse_number_alert = parse_number_alert;  // make it easy to call from outside


	///////////////////////////////////////////////////////////////////////////////
	//
	//  Sources
	//
	///////////////////////////////////////////////////////////////////////////////

	// argument is a string describing the source's value (see comments for details)
	// source types: dc,step,square,triangle,sin,pulse,pwl,pwl_repeating

	// returns an object with the following attributes:
	//   fun -- name of source function
	//   args -- list of argument values
	//   value(t) -- compute source value at time t
	//   inflection_point(t) -- compute time after t when a time point is needed
	//   dc -- value at time 0
	//   period -- repeat period for periodic sources (0 if not periodic)

	function parse_source(v) {
	    // generic parser: parse v as either <value> or <fun>(<value>,...)
	    var src = {};
	    src.period = 0; // Default not periodic
	    src.value = function(t) { return 0; };  // overridden below
	    src.inflection_point = function(t) { return undefined; };  // may be overridden below

	    // see if there's a "(" in the description
    	var index = v.indexOf('(');
    		var ch;
    		if (index >= 0) {
		src.fun = v.slice(0,index);   // function name is before the "("
		src.args = [];	// we'll push argument values onto this list
		var end = v.indexOf(')',index);
		if (end == -1) end = v.length;

		index += 1;     // start parsing right after "("
			while (index < end) {
		    // figure out where next argument value starts
		    ch = v.charAt(index);
		    if (ch <= ' ') { index++; continue; }
		    // and where it ends
		    var arg_end = v.indexOf(',',index);
		    if (arg_end == -1) arg_end = end;
		    // parse and save result in our list of arg values
		    src.args.push(parse_number(v.slice(index,arg_end),undefined));
		    index = arg_end + 1;
		}
	} else {
		src.fun = 'dc';
		src.args = [parse_number(v,0)];
	}

	    // post-processing for constant sources
	    // dc(v)
	    if (src.fun == 'dc') {
	    	let v = arg_value(src.args,0,0);
	    	src.args = [v];
		src.value = function(t) { return v; };  // closure
	}

	    // post-processing for impulse sources
	    // impulse(height,width)
	    else if (src.fun == 'impulse') {
		let h = arg_value(src.args,0,1);  // default height: 1
		let w = Math.abs(arg_value(src.args,2,1e-9));  // default width: 1ns
		src.args = [h,w];  // remember any defaulted values
		pwl_source(src,[0,0,w/2,h,w,0],false);
	}

	    // post-processing for step sources
	    // step(v_init,v_plateau,t_delay,t_rise)
	    else if (src.fun == 'step') {
		let v1 = arg_value(src.args,0,0);  // default init value: 0V
		let v2 = arg_value(src.args,1,1);  // default plateau value: 1V
		let td = Math.max(0,arg_value(src.args,2,0));  // time step starts
		let tr = Math.abs(arg_value(src.args,3,1e-9));  // default rise time: 1ns
		src.args = [v1,v2,td,tr];  // remember any defaulted values
		pwl_source(src,[td,v1,td+tr,v2],false);
	}

	    // post-processing for square wave
	    // square(v_init,v_plateau,freq,duty_cycle)
	    else if (src.fun == 'square') {
		let v1 = arg_value(src.args,0,0);  // default init value: 0V
		let v2 = arg_value(src.args,1,1);  // default plateau value: 1V
		let freq = Math.abs(arg_value(src.args,2,1));  // default frequency: 1Hz
		let duty_cycle  = Math.min(100,Math.abs(arg_value(src.args,3,50)));  // default duty cycle: 0.5
		src.args = [v1,v2,freq,duty_cycle];  // remember any defaulted values

		let per = freq == 0 ? Infinity : 1/freq;
		let t_change = 0.01 * per;   // rise and fall time
		let t_pw = 0.01 * duty_cycle * 0.98 * per;  // fraction of cycle minus rise and fall time
		pwl_source(src,[0,v1,t_change,v2,t_change+t_pw,
			v2,t_change+t_pw+t_change,v1,per,v1],true);
	}

	    // post-processing for triangle
	    // triangle(v_init,v_plateua,t_period)
	    else if (src.fun == 'triangle') {
		let v1 = arg_value(src.args,0,0);  // default init value: 0V
		let v2 = arg_value(src.args,1,1);  // default plateau value: 1V
		let freq = Math.abs(arg_value(src.args,2,1));  // default frequency: 1s
		src.args = [v1,v2,freq];  // remember any defaulted values

		let per = freq == 0 ? Infinity : 1/freq;
		pwl_source(src,[0,v1,per/2,v2,per,v1],true);
	}

	    // post-processing for pwl and pwlr sources
	    // pwl[r](t1,v1,t2,v2,...)
	    else if (src.fun == 'pwl' || src.fun == 'pwl_repeating') {
	    	pwl_source(src,src.args,src.fun == 'pwl_repeating');
	    }

	    // post-processing for pulsed sources
	    // pulse(v_init,v_plateau,t_delay,t_rise,t_fall,t_width,t_period)
	    else if (src.fun == 'pulse') {
		let v1 = arg_value(src.args,0,0);  // default init value: 0V
		let v2 = arg_value(src.args,1,1);  // default plateau value: 1V
		let td = Math.max(0,arg_value(src.args,2,0));  // time pulse starts
		let tr = Math.abs(arg_value(src.args,3,1e-9));  // default rise time: 1ns
		let tf = Math.abs(arg_value(src.args,4,1e-9));  // default rise time: 1ns
		let pw = Math.abs(arg_value(src.args,5,1e9));  // default pulse width: "infinite"
		let per = Math.abs(arg_value(src.args,6,1e9));  // default period: "infinite"
		src.args = [v1,v2,td,tr,tf,pw,per];

		let t1 = td;       // time when v1 -> v2 transition starts
		let t2 = t1 + tr;  // time when v1 -> v2 transition ends
		let t3 = t2 + pw;  // time when v2 -> v1 transition starts
		let t4 = t3 + tf;  // time when v2 -> v1 transition ends

		pwl_source(src,[t1,v1, t2,v2, t3,v2, t4,v1, per,v1],true);
	}

	    // post-processing for sinusoidal sources
	    // sin(v_offset,v_amplitude,freq_hz,t_delay,phase_offset_degrees)
	    else if (src.fun == 'sin') {
		let voffset = arg_value(src.args,0,0);  // default offset voltage: 0V
		let va = arg_value(src.args,1,1);  // default amplitude: -1V to 1V
		let freq = Math.abs(arg_value(src.args,2,1));  // default frequency: 1Hz
		src.period = 1.0/freq;

		let td = Math.max(0,arg_value(src.args,3,0));  // default time delay: 0sec
		let phase = arg_value(src.args,4,0);  // default phase offset: 0 degrees
		src.args = [voffset,va,freq,td,phase];

		phase /= 360.0;

		// return value of source at time t
		src.value = function(t) {  // closure
			if (t < td) return voffset + va*Math.sin(2*Math.PI*phase);
			else return voffset + va*Math.sin(2*Math.PI*(freq*(t - td) + phase));
		};

		// return time of next inflection point after time t
		src.inflection_point = function(t) {	// closure
			if (t < td) return td;
			else return undefined;
		};
	}

	    // object has all the necessary info to compute the source value and inflection points
	    src.dc = src.value(0);   // DC value is value at time 0
	    return src;
	}

	function pwl_source(src,tv_pairs,repeat) {
		var nvals = tv_pairs.length;
		if (repeat)
		src.period = tv_pairs[nvals-2];  // Repeat period of source
	    //if (nvals % 2 == 1) npts -= 1;   // make sure it's even!  WMc bug, npts should be nvals
	    if (nvals % 2 == 1) nvals -= 1;    // make sure nvals is even! (equal number of v and t values)

	    if (nvals <= 2) {
			// handle degenerate case
			src.value = function(t) { return nvals == 2 ? tv_pairs[1] : 0; };
			src.inflection_point = function(t) { return undefined; };
		} else {
			src.value = function(t) { // closure
				if (repeat)
				// make time periodic if values are to be repeated
				t = Math.fmod(t,tv_pairs[nvals-2]);
				var last_t = tv_pairs[0];
				var last_v = tv_pairs[1];
				if (t > last_t) {
					var next_t,next_v;
					for (let i = 2; i < nvals; i += 2) {
						next_t = tv_pairs[i];
						next_v = tv_pairs[i+1];
					    if (next_t > last_t)  // defend against bogus tv pairs
					    	if (t < next_t)
					    		return last_v + (next_v - last_v)*(t - last_t)/(next_t - last_t);
					    	last_t = next_t;
					    	last_v = next_v;
					}
				}
				return last_v;
			};
			src.inflection_point = function(t) {  // closure
				if (repeat)
				// make time periodic if values are to be repeated
				t = Math.fmod(t,tv_pairs[nvals-2]);
				for (let i = 0; i < nvals; i += 2) {
					var next_t = tv_pairs[i];
					if (t < next_t) return next_t;
				}
				return undefined;
			};
		}
	}

	// helper function: return args[index] if present, else default_v
	function arg_value(args,index,default_v) {
		if (index < args.length) {
			var result = args[index];
			if (result === undefined) result = default_v;
			return result;
		} else return default_v;
	}

	// we need fmod in the Math library!
	Math.fmod = function(numerator,denominator) {
		var quotient = Math.floor(numerator/denominator);
		return numerator - quotient*denominator;
	};

	///////////////////////////////////////////////////////////////////////////////
	//
	//  Sources
	//
	///////////////////////////////////////////////////////////////////////////////

	function VSource(npos,nneg,branch,v) {
		Device.call(this);
		this.src = parse_source(v);
		this.npos = npos;
		this.nneg = nneg;
		this.branch = branch;
	}
	VSource.prototype = new Device();
	VSource.prototype.constructor = VSource;

	// load linear part for source evaluation
	VSource.prototype.load_linear = function(ckt) {
	    // MNA stamp for independent voltage source
	    ckt.add_to_Gl(this.branch,this.npos,1.0);
	    ckt.add_to_Gl(this.branch,this.nneg,-1.0);
	    ckt.add_to_Gl(this.npos,this.branch,1.0);
	    ckt.add_to_Gl(this.nneg,this.branch,-1.0);
	};

	// Source voltage added to b.
	VSource.prototype.load_dc = function(ckt,soln,rhs) {
		ckt.add_to_rhs(this.branch,this.src.dc,rhs);  
	};

	// Load time-dependent value for voltage source for tran
	VSource.prototype.load_tran = function(ckt,soln,rhs,time) {
		ckt.add_to_rhs(this.branch,this.src.value(time),rhs);  
	};

	// return time of next breakpoint for the device
	VSource.prototype.breakpoint = function(time) {
		return this.src.inflection_point(time);
	};

	// small signal model ac value
	VSource.prototype.load_ac = function(ckt,rhs) {
		ckt.add_to_rhs(this.branch,1.0,rhs);
	};

	function ISource(npos,nneg,v) {
		Device.call(this);
		this.src = parse_source(v);
		this.npos = npos;
		this.nneg = nneg;
	}
	ISource.prototype = new Device();
	ISource.prototype.constructor = ISource;

	ISource.prototype.load_linear = function(ckt) {
	    // Current source is open when off, no linear contribution
	};

	// load linear system equations for dc analysis
	ISource.prototype.load_dc = function(ckt,soln,rhs) {
		var is = this.src.dc;

	    // MNA stamp for independent current source
	    ckt.add_to_rhs(this.npos,-is,rhs);  // current flow into npos
	    ckt.add_to_rhs(this.nneg,is,rhs);   // and out of nneg
	};

	// load linear system equations for tran analysis (just like DC)
	ISource.prototype.load_tran = function(ckt,soln,rhs,time) {
		var is = this.src.value(time);

	    // MNA stamp for independent current source
	    ckt.add_to_rhs(this.npos,-is,rhs);  // current flow into npos
	    ckt.add_to_rhs(this.nneg,is,rhs);   // and out of nneg
	};

	// return time of next breakpoint for the device
	ISource.prototype.breakpoint = function(time) {
		return this.src.inflection_point(time);
	};

	// small signal model: open circuit
	ISource.prototype.load_ac = function(ckt,rhs) {
	    // MNA stamp for independent current source
	    ckt.add_to_rhs(this.npos,-1.0,rhs);  // current flow into npos
	    ckt.add_to_rhs(this.nneg,1.0,rhs);   // and out of nneg
	};

	///////////////////////////////////////////////////////////////////////////////
	//
	//  Resistor
	//
	///////////////////////////////////////////////////////////////////////////////

	function Resistor(n1,n2,v) {
		Device.call(this);
		this.n1 = n1;
		this.n2 = n2;
		this.g = 1.0/v;
	}
	Resistor.prototype = new Device();
	Resistor.prototype.constructor = Resistor;

	Resistor.prototype.load_linear = function(ckt) {
	    // MNA stamp for admittance g
	    ckt.add_conductance_l(this.n1,this.n2,this.g);
	};

	Resistor.prototype.load_dc = function(ckt) {
	    // Nothing to see here, move along.
	};

	Resistor.prototype.load_tran = function(ckt,soln) {
	};

	Resistor.prototype.load_ac = function(ckt) {
	};

	///////////////////////////////////////////////////////////////////////////////
	//
	//  Diode
	//
	///////////////////////////////////////////////////////////////////////////////

    function diodeEval(vd, vt, Is) {
	    var exp_arg = vd / vt;
	    var temp1, temp2;
	    var exp_arg_max = 50;
	    var exp_max = 5.184705528587072e21;
	    //var exp_arg_max = 100;  // less than single precision max.
	    //var exp_max = 2.688117141816136e43;

	    // Estimate exponential with a quadratic if arg too big.
	    var abs_exp_arg = Math.abs(exp_arg);
	    var d_arg = abs_exp_arg - exp_arg_max;
	    if (d_arg > 0) {
			var quad = 1 + d_arg + 0.5*d_arg*d_arg;
			temp1 = exp_max * quad;
			temp2 = exp_max * (1 + d_arg);
	    } else {
			temp1 = Math.exp(abs_exp_arg);
			temp2 = temp1;
	    }
	    if (exp_arg < 0) {  // Use exp(-x) = 1.0/exp(x)
			temp1 = 1.0/temp1;
			temp2 = (temp1*temp2)*temp1;
	    }
	    var id = Is * (temp1 - 1.0);
	    var gd = Is * (temp2 / vt);
	    return [id,gd];
	}
    
    function Diode(n1,n2,v,type) {
		Device.call(this);
		this.anode = n1;
		this.cathode = n2;
		this.area = v;
	    this.type = type;  // 'normal' or 'ideal'
	    this.is = 1.0e-14;
	    this.ais = this.area * this.is;
	    this.vt = (type == 'normal') ? 25.8e-3 : 0.1e-3;  // 26mv or .1mv
	    this.exp_arg_max = 50;  // less than single precision max.
	    this.exp_max = Math.exp(this.exp_arg_max);
	}
	Diode.prototype = new Device();
	Diode.prototype.constructor = Diode;

	Diode.prototype.load_linear = function(ckt) {
	    // Diode is not linear, has no linear piece.
	};

	Diode.prototype.load_dc = function(ckt,soln,rhs) {
		var vd = ckt.get_two_terminal(this.anode, this.cathode, soln);
		var exp_arg = vd / this.vt;
		var temp1, temp2;
	    // Estimate exponential with a quadratic if arg too big.
	    var abs_exp_arg = Math.abs(exp_arg);
	    var d_arg = abs_exp_arg - this.exp_arg_max;
	    if (d_arg > 0) {
	    	var quad = 1 + d_arg + 0.5*d_arg*d_arg;
	    	temp1 = this.exp_max * quad;
	    	temp2 = this.exp_max * (1 + d_arg);
	    } else {
	    	temp1 = Math.exp(abs_exp_arg);
	    	temp2 = temp1;
	    }
	    if (exp_arg < 0) {  // Use exp(-x) = 1.0/exp(x)
	    	temp1 = 1.0/temp1;
	    	temp2 = (temp1*temp2)*temp1;
	    }
	    var id = this.ais * (temp1 - 1);
	    var gd = this.ais * (temp2 / this.vt);

	    // MNA stamp for independent current source
	    ckt.add_to_rhs(this.anode,-id,rhs);  // current flows into anode
	    ckt.add_to_rhs(this.cathode,id,rhs);   // and out of cathode
	    ckt.add_conductance(this.anode,this.cathode,gd);
	};

	Diode.prototype.load_tran = function(ckt,soln,rhs,time) {
		this.load_dc(ckt,soln,rhs);
	};

	Diode.prototype.load_ac = function(ckt) {
	};


	///////////////////////////////////////////////////////////////////////////////
	//
	//  Capacitor
	//
	///////////////////////////////////////////////////////////////////////////////

	function Capacitor(n1,n2,v) {
		Device.call(this);
		this.n1 = n1;
		this.n2 = n2;
		this.value = v;
	}
	Capacitor.prototype = new Device();
	Capacitor.prototype.constructor = Capacitor;

	Capacitor.prototype.load_linear = function(ckt) {
	    // MNA stamp for capacitance matrix 
	    ckt.add_capacitance(this.n1,this.n2,this.value);
	};

	Capacitor.prototype.load_dc = function(ckt,soln,rhs) {
	};

	Capacitor.prototype.load_ac = function(ckt) {
	};

	Capacitor.prototype.load_tran = function(ckt) {
	};

	///////////////////////////////////////////////////////////////////////////////
	//
	//  Inductor
	//
	///////////////////////////////////////////////////////////////////////////////

	function Inductor(n1,n2,branch,v) {
		Device.call(this);
		this.n1 = n1;
		this.n2 = n2;
		this.branch = branch;
		this.value = v;
	}
	Inductor.prototype = new Device();
	Inductor.prototype.constructor = Inductor;

	Inductor.prototype.load_linear = function(ckt) {
	    // MNA stamp for inductor linear part
	    // L on diag of C because L di/dt = v(n1) - v(n2)
	    ckt.add_to_Gl(this.n1,this.branch,1);
	    ckt.add_to_Gl(this.n2,this.branch,-1);
	    ckt.add_to_Gl(this.branch,this.n1,-1);
	    ckt.add_to_Gl(this.branch,this.n2,1);
	    ckt.add_to_C(this.branch,this.branch,this.value);
	};

	Inductor.prototype.load_dc = function(ckt,soln,rhs) {
	    // Inductor is a short at dc, so is linear.
	};

	Inductor.prototype.load_ac = function(ckt) {
	};

	Inductor.prototype.load_tran = function(ckt) {
	};


	///////////////////////////////////////////////////////////////////////////////
	//
	//  Simple Voltage-Controlled Voltage Source Op Amp model 
	//
	///////////////////////////////////////////////////////////////////////////////

	function Opamp(np,nn,no,ng,branch,A,name) {
		Device.call(this);
		this.np = np;
		this.nn = nn;
		this.no = no;
		this.ng = ng;
		this.branch = branch;
		this.gain = A;
		this.name = name;
	}

	Opamp.prototype = new Device();
	Opamp.prototype.constructor = Opamp;
	Opamp.prototype.load_linear = function(ckt) {
        // MNA stamp for VCVS: 1/A(v(no) - v(ng)) - (v(np)-v(nn))) = 0.
		var invA = 1.0/this.gain;
		ckt.add_to_Gl(this.no,this.branch,1);
		ckt.add_to_Gl(this.ng,this.branch,-1);
		ckt.add_to_Gl(this.branch,this.no,invA);
		ckt.add_to_Gl(this.branch,this.ng,-invA);
		ckt.add_to_Gl(this.branch,this.np,-1);
		ckt.add_to_Gl(this.branch,this.nn,1);
		};

	Opamp.prototype.load_dc = function(ckt,soln,rhs) {
		    // Op-amp is linear.
		};

	Opamp.prototype.load_ac = function(ckt) {
	};

	Opamp.prototype.load_tran = function(ckt) {
	};

	///////////////////////////////////////////////////////////////////////////////
	//
	//  Simple Voltage-Controlled Voltage Source Op Amp model - realistic, with power pins
	//
	///////////////////////////////////////////////////////////////////////////////

    function Opamp2(nInP,nInN,nO,nP,nN,nInt,Gain,Ro,Rin,name) {
	    Device.call(this);
	    this.nO = nO;
	    this.nInP = nInP;
	    this.nInN = nInN;
	    this.nP = nP;
	    this.nN = nN;
	    this.nInt = nInt;
	    this.gain = Gain;
	    this.Go = 1.0/Ro;
	    this.Gin = 1.0/Rin;
	    this.Gint = this.Go/(1.0 + this.gain);
	    this.Gthru = this.Go/100.0;
	    this.Gleak = this.Gin/(1.0+this.gain);
	    this.iMax = this.Gint*10.0e6;  // Sets max 10v/us slew rate.
	    this.vt = 0.001;       // Fictitious diode vTherm for limiting.
	    this.areaIs = 1.0e-14;  // Area*Isat for limiting diodes.
	    this.vdOff = 0.03;  // Pre-biases the limiting diodes.
	    this.name = name;
	}

	Opamp2.prototype = new Device();
        Opamp2.prototype.constructor = Opamp;
        
        Opamp2.prototype.load_linear = function(ckt) {
	    Gthru = this.Gthru;
	    Gin = this.Gin;
	    Gint = this.Gint;
	    Gleak = this.Gleak;
	    ckt.add_conductance_l(this.nP,this.nO,Gthru);  
	    ckt.add_conductance_l(this.nN,this.nO,Gthru);

	    ckt.add_conductance_l(this.nInP,this.nInN,Gin);
	    ckt.add_conductance_l(this.nInN,this.nN,Gleak);
	    ckt.add_conductance_l(this.nInP,this.nP,Gleak);

	    ckt.add_conductance_l(this.nInt,this.nP,Gint/2.0);
	    ckt.add_conductance_l(this.nInt,this.nN,Gint/2.0);
	    ckt.add_capacitance_l(this.nInt,this.gnd_node,Gint);
	};

	Opamp2.prototype.load_dc = function(ckt,soln,rhs) {
	    var nP = this.nP;
	    var nN = this.nN;
	    var nInt = this.nInt;
	    var vPN = ckt.get_two_terminal(nP, nN, soln);
	    if (vPN > 0) {
		// First compute internal node updates
		var vIn = ckt.get_two_terminal(this.nInP, this.nInN, soln);
		var G = this.gain*this.Gint;
		var iInt = G*vIn;
		var nSi = nP; //out->nN or nP->out
		// Adjust current draw node and slew rate.
		if (iInt < 0) {
		    nSi = nN;
		    if (iInt < -this.iMax) {
			iInt = -this.iMax;
			G = iInt/vIn;
		    }
		} else if (iInt > this.iMax) {
			iInt = this.iMax;
			G = iInt/vIn;
		}
		//var nS = (iInt>0) ? nP : nN;//out->nN or nP->out
		ckt.add_to_rhs(nInt,iInt,rhs); 
		ckt.add_to_G(nInt,this.nInP,-G);
		ckt.add_to_G(nInt,this.nInN,G);
		ckt.add_to_rhs(nSi,-iInt,rhs); 
		ckt.add_to_G(nSi,this.nInP,G);
		ckt.add_to_G(nSi,this.nInN,-G);

		// Diodes to limit internal voltage to between vN and vP.
		var vd = this.vdOff + ckt.get_two_terminal(nInt, nP, soln);
		var IdGd = diodeEval(vd, this.vt, this.areaIs);
		ckt.add_to_rhs(nInt,-IdGd[0],rhs); 
		ckt.add_to_rhs(nP,IdGd[0],rhs); 
		ckt.add_conductance(nInt,nP,IdGd[1]);

		var vdN = this.vdOff + ckt.get_two_terminal(nN, nInt, soln);
		var IdGdN = diodeEval(vdN, this.vt, this.areaIs);
		ckt.add_to_rhs(nN,-IdGdN[0],rhs); 
		ckt.add_to_rhs(nInt,IdGdN[0],rhs); 
		ckt.add_conductance(nN,nInt,IdGdN[1]);

		// Now compute the output, switching current draw from
		// Plus supply or minus supply depending on sign.
		var nO = this.nO;
		var vInPiNo = ckt.get_two_terminal(this.nInt, nO, soln);
		var gO = this.Go;
		var iOut = gO*vInPiNo;
		var nS = (iOut<0) ? this.nN : this.nP;//out->nN or nP->out
		ckt.add_to_rhs(nO,iOut,rhs); 
		ckt.add_to_rhs(nS,-iOut,rhs); 
		ckt.add_to_G(nO,nO,gO);
		ckt.add_to_G(nS,nO,-gO);
		ckt.add_to_G(nO,this.nInt,-gO);
		ckt.add_to_G(nS,this.nInt,gO);
	    }
	};

	Opamp2.prototype.load_ac = function(ckt) {
	};

	Opamp2.prototype.load_tran = function(ckt,soln,crnt,chg,time) {
	    this.load_dc(ckt,soln,crnt);
	};


	///////////////////////////////////////////////////////////////////////////////
	//
	//  Very basic Ebers-Moll BJT model
	//
	///////////////////////////////////////////////////////////////////////////////

    function bjt(c,b,e,area,Ics,Ies,af,ar,name,type) {
	    Device.call(this);
	    this.e = e;
	    this.b = b;
	    this.c = c;
	    this.name = name;
	    this.af = af;
	    this.ar = ar;
	    this.area = area;
	    this.aIcs = this.area*Ics;
        this.aIes = this.area*Ies;
	    if (type != 'n' && type != 'p') { 
	    	throw 'BJT type is not npn or pnp';
	    }
	    this.type_sign = (type == 'n') ? 1 : -1;
	    this.vt = 0.026;
	    this.leakCond = 1.0e-12;
	}
	bjt.prototype = new Device();
        bjt.prototype.constructor = bjt;

        bjt.prototype.load_linear = function(ckt) {
	    // bjt's are nonlinear, just like javascript progammers
	};

        bjt.prototype.load_dc = function(ckt,soln,rhs) {
	    let e = this.e; let b = this.b; let c = this.c;
	    let vbc = this.type_sign * ckt.get_two_terminal(b, c, soln);
	    let vbe = this.type_sign * ckt.get_two_terminal(b, e, soln);
        let IrGr = diodeEval(vbc, this.vt, this.aIcs);
        let IfGf = diodeEval(vbe, this.vt, this.aIes);

        // Sign convention is emitter and collector currents are leaving.
        let ie = this.type_sign * (IfGf[0] - this.ar*IrGr[0]);
        let ic = this.type_sign * (IrGr[0] - this.af*IfGf[0]);
        let ib = -(ie+ic);  		//current flowing out of base

	    ckt.add_to_rhs(b,ib,rhs);  	//current flowing out of base
	    ckt.add_to_rhs(c,ic,rhs);  	//current flowing out of collector
	    ckt.add_to_rhs(e,ie,rhs);   //and out emitter
	    ckt.add_conductance(b,e,IfGf[1]);
	    ckt.add_conductance(b,c,IrGr[1]);
	    ckt.add_conductance(c,e,this.leakCond);

	    ckt.add_to_G(b, c, this.ar*IrGr[1]);
	    ckt.add_to_G(b, e, this.af*IfGf[1]);	    
	    ckt.add_to_G(b, b, -(this.af*IfGf[1] + this.ar*IrGr[1]));
	    
	    ckt.add_to_G(e, b, this.ar*IrGr[1]);
	    ckt.add_to_G(e, c, -this.ar*IrGr[1]);
	    
	    ckt.add_to_G(c, b, this.af*IfGf[1]);
	    ckt.add_to_G(c, e, -this.af*IfGf[1]);
	};

        bjt.prototype.load_tran = function(ckt,soln,crnt,chg,time) {
	    this.load_dc(ckt,soln,crnt,crnt);
	};

	bjt.prototype.load_ac = function(ckt) {
	};

	///////////////////////////////////////////////////////////////////////////////
	//
	//  Simplified MOS FET with no bulk connection and no body effect.
	//
	///////////////////////////////////////////////////////////////////////////////

	function Fet(d,g,s,ratio,name,type) {
		Device.call(this);
		this.d = d;
		this.g = g;
		this.s = s;
		this.name = name;
		this.ratio = ratio;
		if (type != 'n' && type != 'p')
			{ throw 'fet type is not n or p';
		}
		this.type_sign = (type == 'n') ? 1 : -1;
		this.vt = 0.5;
		this.kp = 20e-6;
		this.beta = this.kp * this.ratio;
		this.lambda = 0.05;
	}
	Fet.prototype = new Device();
	Fet.prototype.constructor = Fet;

	Fet.prototype.load_linear = function(ckt) {
		// FET's are nonlinear, just like javascript progammers
	};

	Fet.prototype.load_dc = function(ckt,soln,rhs) {
		var vds = this.type_sign * ckt.get_two_terminal(this.d, this.s, soln);
	    if (vds < 0) { // Drain and source have swapped roles
	    	let temp = this.d;
	    	this.d = this.s;
	    	this.s = temp;
	    	vds = this.type_sign * ckt.get_two_terminal(this.d, this.s, soln);
	    }
	    var vgs = this.type_sign * ckt.get_two_terminal(this.g, this.s, soln);
	    var vgst = vgs - this.vt;
    	var gmgs,ids,gds;
    	let beta = this.beta,
    		g = this.g,
    		d = this.d,
    		s = this.s,
    		lambda = this.lambda,
    		type_sign = this.type_sign;
		if (vgst > 0.0 ) { // vgst < 0, transistor off, no subthreshold here.
			if (vgst < vds) { /* Saturation. */
				gmgs =  beta * (1 + (lambda * vds)) * vgst;
				ids = type_sign * 0.5 * gmgs * vgst;
				gds = 0.5 * beta * vgst * vgst * lambda;
			} else {  /* Linear region */
				gmgs =  beta * (1 + lambda * vds);
				ids = type_sign * gmgs * vds * (vgst - 0.50 * vds);
				gds = gmgs * (vgst - vds) + beta * lambda * vds * (vgst - 0.5 * vds);
				gmgs *= vds;
			}
		    ckt.add_to_rhs(d,-ids,rhs);		// current flows into the drain
		    ckt.add_to_rhs(s, ids,rhs);		// and out the source		    
		    ckt.add_conductance(d,s,gds);
		    ckt.add_to_G(s,s, gmgs);
		    ckt.add_to_G(d,s,-gmgs);
		    ckt.add_to_G(d,g, gmgs);
		    ckt.add_to_G(s,g,-gmgs);
		}
	};

	Fet.prototype.load_tran = function(ckt,soln,rhs) {
		this.load_dc(ckt,soln,rhs);
	};

	Fet.prototype.load_ac = function(ckt) {
	};


	///////////////////////////////////////////////////////////////////////////////
	//
	//  Module definition
	//
	///////////////////////////////////////////////////////////////////////////////
	var module = {
		'Circuit': Circuit,
		'parse_number': parse_number,
		'parse_source': parse_source
	};
	return module;
}());

