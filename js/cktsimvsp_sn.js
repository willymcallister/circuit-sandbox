//////////////////////////////////////////////////////////////////////////////
//
//  Circuit simulator
//
//////////////////////////////////////////////////////////////////////////////

// Copyright (C) 2011 Massachusetts Institute of Technology
// Copyright (C) 2020 William McAllister, spinningsumbers.org, cktsimvsp_sn has internationalization

// create a circuit for simulation using "new cktsim.Circuit()"

// for modified nodal analysis (MNA) stamps see
// http://www.analog-electronics.eu/analog-electronics/modified-nodal-analysis/modified-nodal-analysis.xhtml
// for a tutorial on MNA see 
//https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNA2.html

/*jshint esversion: 6 */

var i18n;	//internationalization translated strings

cktsim = (function() {
    
	///////////////////////////////////////////////////////////////////////////////
	//
	//  Circuit
	//
	//////////////////////////////////////////////////////////////////////////////

	// types of "nodes" in the linear system
	T_VOLTAGE = 0;
	T_CURRENT = 1;
    max_order = 2;      // Maximum order for integration method.
    v_newt_lim = 0.3;   // Voltage limited Newton great for Mos/diodes
	v_abstol = 1e-6;	// Absolute voltage error tolerance
	i_abstol = 1e-12;	// Absolute current error tolerance
    eps = 1.0e-12;           // A very small number compared to one.
	dc_max_iters = 1000;	// max iterations before giving pu
	max_tran_iters = 20;	// max iterations before giving up
	time_step_increase_factor = 2.0;  // How much can lte let timestep grow.
	lte_step_decrease_factor = 8;    // Limit lte one-iter timestep shrink.
	nr_step_decrease_factor = 4;     // Newton failure timestep shink.
    reltol = 1e-6; 		// Relative tol to max observed value
    lterel = 50;             // LTE/Newton tolerance ratio (> 10!)
    res_check_abs = Math.sqrt(i_abstol); // Loose Newton residue check
    res_check_rel = Math.sqrt(reltol); // Loose Newton residue check

	function Circuit() {
	    this.node_map = new Array();
	    this.ntypes = [];
	    this.initial_conditions = [];  // ic's for each element

	    this.devices = [];  // list of devices
	    this.device_map = new Array();  // map name -> device
	    this.voltage_sources = [];  // list of voltage sources
	    this.current_sources = [];  // list of current sources

	    this.finalized = false;
	    this.diddc = false;
	    this.node_index = -1;
	    this.max_order = max_order;

	    this.periods = 1
	}

	// index of ground node
	Circuit.prototype.gnd_node = function() {
	    return -1;
	}

	// allocate a new node index
	Circuit.prototype.node = function(name,ntype,ic) {
	    this.node_index += 1;
	    if (name) this.node_map[name] = this.node_index;
	    this.ntypes.push(ntype);
	    this.initial_conditions.push(ic);
	    return this.node_index;
	}

	// call to finalize the circuit in preparation for simulation
	Circuit.prototype.finalize = function() {
	    if (!this.finalized) {
		this.finalized = true;
		this.N = this.node_index + 1;  // number of nodes

		// give each device a chance to finalize itself
		for (var i = this.devices.length - 1; i >= 0; --i)
		    this.devices[i].finalize(this);

		// Solves dq(x)/dt = f(v,t), need 2+max_order old x's, f's, q's
		// The extra 2 is for interpolation and lte.
		this.xs = mat_make(this.max_order+2, this.N); // usually v's.
		this.fs = mat_make(this.max_order+2, this.N); // crnts.
		this.qs = mat_make(this.max_order+2, this.N); // chgs or fluxes.

		
		this.times = new Array(this.max_order+2); // Need back times.
		this.timestats = new Array(this.max_order+2); // Need stats.
		for (var i = this.timestats.length - 1; i >= 0; --i)
		    this.timestats[i] = new Timepoint();

		this.x_max = new Array(this.N); // Max_t x(t) used with reltol
		this.abstol = new Array(this.N); // x_i specific abs tol 

		this.Gl = mat_make(this.N, this.N);  // Matrix for x-indep df/dx
		this.Cl = mat_make(this.N, this.N);  // Matrix for x-indep dq/dx
		this.G = mat_make(this.N, this.N);  // Complete df/dx.
		this.C = mat_make(this.N, this.N);  // Complete dq/dx.

		this.matrix = mat_make(this.N, this.N+1); // Aug'd solve mat.
		this.rhs = new Array(this.N); // Temp for linear solve rhs's.

		// Note, betas are equation-specific
		this.betas = mat_make(this.max_order, this.N); // f Int Coefs
		this.alphas = new Array(this.max_order); // Int coeffs for q

		// Initialize vecs, mat_make returns zeroed matrices.
		for (var i = this.N - 1; i >= 0; --i) {	  
		    this.x_max[i] = 0.0;
		    this.abstol[i] = 
			(this.ntypes[i] == T_VOLTAGE) ? v_abstol : i_abstol;
		}
		for (var i = this.max_order - 1; i >= 0; --i) {	  
		    this.times[i] = 0;
		    this.alphas[i] = 0;
		}

		// Load up the linear elements in to Gl
		for (var i = this.devices.length - 1; i >= 0; --i) {
		    this.devices[i].load_linear(this)
		}

		// Check for loops of voltage sources and mark nodes
		// whose voltage is controlled by a path of vsrcs to gnd.
		n_vsrc = this.voltage_sources.length;
		if (n_vsrc == 0) {
		    this.vsrc2g = new Array(this.N);
		    for (var i = this.N - 1; i >= 0; --i) this.vsrc2g[i] = 0;
		}
		else { // At least one voltage source
		    var GV = mat_make(n_vsrc, this.N);  // Loop check
		    for (var i = n_vsrc - 1; i >= 0; --i) {
			var branch = this.voltage_sources[i].branch;
			for (var j = this.N - 1; j >= 0; j--)
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

		    // Mark nodes with v-src path to ground
		    this.vsrc2g = mat_path_g(GV);
		}
	    }
	    return true;		
	}

	// load circuit from JSON netlist (see schematic.js)
	Circuit.prototype.load_netlist = function(netlist) {
	    // set up mapping for all ground connections
	    for (var i = netlist.length - 1; i >= 0; --i) {
		var component = netlist[i];
		var type = component[0];
		if (type == 'g') {
		    var connections = component[3];
		    this.node_map[connections[0]] = this.gnd_node();
		}
	    }

	    // process each component in the JSON netlist (see schematic.js for format)
	    var found_ground = false;
	    for (var i = netlist.length - 1; i >= 0; --i) {
		var component = netlist[i];
		var type = component[0];

		// ignore wires, ground connections, scope probes and view info
		if (type == 'view' || type == 'w' || type == 'g' || type == 's' || type == 'L') {
		    continue;
		}

		var properties = component[2];
		var name = properties['name'];
		if (name==undefined || name=='')
		    name = '_' + properties['_json_'].toString();

		// convert node names to circuit indicies
		var connections = component[3];
		for (var j = connections.length - 1; j >= 0; --j) {
		    var node = connections[j];
		    var index = this.node_map[node];
		    if (index == undefined) index = this.node(node,T_VOLTAGE);
		    else if (index == this.gnd_node()) found_ground = true;
		    connections[j] = index;
		}

		// process the component
		if (type == 'r')	// resistor
		    this.r(connections[0],connections[1],properties['r'],name);
		else if (type == 'd')	// diode
		    this.d(connections[0],connections[1],properties['area'],properties['is'],properties['Vt'],properties['type'],name);
		else if (type == 'c')   // capacitor
		    this.c(connections[0],connections[1],properties['c'],name);
		else if (type == 'l')	// inductor
		    this.l(connections[0],connections[1],properties['l'],name);
		else if (type == 'v') 	// voltage source
		    this.v(connections[0],connections[1],properties['value'],name);
		else if (type == 'i') 	// current source
		    this.i(connections[0],connections[1],properties['value'],name);
		else if (type == 'o') 	// op amp - ideal
			this.opamp(connections[0],connections[1],connections[2],connections[3],properties.A,name);
		else if (type == 'o2') 	// op amp - realistic
		    this.opamp2(connections[0],connections[1],connections[2],connections[3],connections[4],properties['Gain'],properties['Rout'],properties['Rin'],name);
		else if (type == 'tl') 	// transmission line
		    this.tline(connections[0],connections[1],connections[2],connections[3],properties['Z0'],properties['Delay'],properties['Rwire'],name);
		else if (type == 'twoport')  // Two port A*I = B*V
		    this.twoport(connections[0],connections[1],connections[2],connections[3],properties['A11'],properties['A12'],properties['A21'],properties['A22'],properties['B11'],properties['B12'],properties['B21'],properties['B22'],name);
		else if (type == 'npn')	// npn bipolar transistor
		    this.nBJT(connections[0],connections[1],connections[2],properties['area'],properties['Ics'],properties['Ies'],properties['alphaF'],properties['alphaR'],name);
		else if (type == 'pnp')	// pnp bipolar transistor
		    this.pBJT(connections[0],connections[1],connections[2],properties['area'],properties['Ics'],properties['Ies'],properties['alphaF'],properties['alphaR'],name);
		else if (type == 'n') 	// n fet
		    this.n(connections[0],connections[1],connections[2],properties.WL,properties.Vt,properties.lambda,name);
		else if (type == 'p') 	// p fet
		    this.p(connections[0],connections[1],connections[2],properties.WL,properties.Vt,properties.lambda,name);
		else if (type == 'n_vs') // n vs fet
		    this.fet_vs(connections[0],connections[1],connections[2],connections[3],properties['W'],properties['deltaVt'],name,type);
		else if (type == 'p_vs') // p fet
		    this.fet_vs(connections[0],connections[1],connections[2],connections[3],properties['W'],properties['deltaVt'],name,type);
		else if (type == 'a') 	// current probe == 0-volt voltage source
		    this.v(connections[0],connections[1],'0',name);
	    }

	    if (!found_ground) { // No ground on schematic
		//alert('Please make at least one connection to ground  (inverted T symbol)');
		alert(i18n.ckt_alert3);
		return false;
	    }
	    return true;
	    
	}

	// If converges: updates this.xs[0], this.x_max, returns iter count
	// otherwise: return undefined and set this.problem_node
	// Load should compute -F and dF/dx (note the sign pattern!)
    Circuit.prototype.find_solution = function(load,maxiters) {
	    var soln = this.xs[0];
	    var rhs = this.rhs;
	    var matrix = this.matrix;
	    var soln_max = this.x_max;
	    var d_sol = new Array();
	    var abssum_compare;
	    var converged,abssum_old=0, abssum_rhs;
	    var use_limiting = false;
	    var down_count = 0;

	    // iterate until until soln converges or iter limit exceeded
	    for (var iter = 0; iter < maxiters; iter++) {
		load(this,soln,rhs); // set up equations

		// Norm(rhs)^2 on type i eqns, assume i-eqns go with v-variables
		abssum_rhs = 0;
		for (var i = this.N - 1; i >= 0; --i)
		    if (this.ntypes[i] == T_VOLTAGE)
			abssum_rhs += Math.abs(rhs[i]);

		if ((iter>0)&&(use_limiting==false)&&(abssum_old<abssum_rhs)) {
		    // old norm(rhs)<norm(rhs), undo last iter + start limiting
		    for (var i = this.N - 1; i >= 0; --i)
			soln[i] -= d_sol[i];
		    iter -= 1;
		    use_limiting = true;
		}
		else {  // Compute the Newton delta
		    d_sol = mat_solve(matrix,rhs);
		    //d_sol = mat_solve_rq(matrix,rhs);

		    // If norm decreasing for ten iters, stop limiting
		    if (abssum_rhs < abssum_old) down_count += 1;
		    else down_count = 0;
		    if (down_count > 10) {
			use_limiting = false;
			down_count = 0;
		    }

		    // Update norm of rhs
		    abssum_old = abssum_rhs;		    
		}

		// alert('abssum='+abssum_rhs);

		// Update the worst case abssum for comparison.
		if ((iter == 0) || (abssum_rhs > abssum_compare))
		    abssum_compare = abssum_rhs;

		// Don't converge on first iter, and don't converge on
		// failed residual check unless this is the last iteration
		// Note, residual check is loose, need better comparison.
		var res_chk = res_check_abs+res_check_rel*abssum_compare
		if ( (iter < 1) || ((iter < (maxiters - 1))
				    && (abssum_rhs > res_chk)) )
		    converged = false;
		else converged = true;

		// Update solution and check delta convergence
		for (var i = this.N - 1; i >= 0; --i) {
		    // Simple voltage step limiting to encourage Newton convergence
		    if (use_limiting) {
			if (this.ntypes[i] == T_VOLTAGE) {
			    d_sol[i] = (d_sol[i] > v_newt_lim) ? v_newt_lim : d_sol[i];
			    d_sol[i] = (d_sol[i] < -v_newt_lim) ? -v_newt_lim : d_sol[i];
			}
		    }
		    soln[i] += d_sol[i];
		    thresh = this.abstol[i] + reltol*soln_max[i];
		    if (Math.abs(d_sol[i]) > thresh) {
			converged = false;
			this.problem_node = i;
		    }
		}

		//alert(numeric.prettyPrint(this.solution));
                if (converged) {
		    for (var i = this.N - 1; i >= 0; --i) 
			if (Math.abs(soln[i]) > soln_max[i])
			    soln_max[i] = Math.abs(soln[i]);
		    
		    break;
		}
	    }
	    if (converged) return iter+1;
	    else return undefined;
	}

        // Loads crnt (and chg) and G and C
        Circuit.prototype.loader = function(sol, doq, time) {
	    var crnt = this.fs[0];
	    // Crnt is initialized to -Gl * sol
	    mat_v_mult(this.Gl, sol, crnt, -1.0);
	    // G matrix is initialized with linear Gl
	    mat_copy(this.Gl,this.G);
	    if (doq == false) { // Just do dc.
		// Now load up the nonlinear parts of rhs and G
		for (var i = this.devices.length - 1; i >= 0; --i)
			this.devices[i].load_dc(this,sol,crnt);
	    } else {
		var q = this.qs[0];
		// Charge is initialized to Cl * sol
		mat_v_mult(this.Cl, sol, q, 1.0);
		// C matrix is initialized with linear Cl
		mat_copy(this.Cl,this.C);
		// Now load up the nonlinear parts of crnt,G, chg,C
		for (var i = this.devices.length - 1; i >= 0; --i)
		    this.devices[i].load_tran(this, sol, crnt, q, time);
	    }
	}

	// DC analysis
	Circuit.prototype.dc = function() {

	    // Allocation matrices for linear part, etc.
	    if (this.finalize() == false)
		return undefined;

	    // Define -f and df/dx for Newton solver
	    function load_dc(ckt,soln,rhs) {
		var crnt = ckt.fs[0];
		ckt.loader(soln,false);  // Load up crnts but not charges

		// For Dc solve, rhs = crnt, Matrix = G.
		for (var i = rhs.length - 1; i >= 0; --i)
		    rhs[i] = crnt[i]     
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

		return undefined
	    } else {
		// Note that a dc solution was computed
		this.diddc = true;
		// create solution dictionary
		var result = new Array();
		// capture node voltages
		var soln = this.xs[0];
		for (var name in this.node_map) {
		    var index = this.node_map[name];
		    result[name] = (index == -1) ? 0 : soln[index];
		}
		// capture branch currents from voltage sources
		for (var i = this.voltage_sources.length - 1; i >= 0; --i) {
		    var v = this.voltage_sources[i];
		    result['I('+v.name+')'] = soln[v.branch];
		}
		return result;
	    }
	}

	// Transient analysis (needs work!)
        Circuit.prototype.tran = function(ntpts,tstart,tstop,probenames,no_dc) {
	    //ntpts = 10 * ntpts;

	    // ************************ Internal Functions.
	    // Define -f and df/dx for Newton solver
	    function load_tran(ckt,soln,rhs) {
		var time = ckt.times[0];
		ckt.loader(soln,true,time);
		// -rhs = f - dqdt
		for (var i = ckt.N-1; i >= 0; --i) {
		    rhs[i] = 0;
		    for (var j = ckt.max_order - 1; j >= 0; --j) {
		    //alert(numeric.prettyPrint(dqdt));
			rhs[i] += ckt.betas[j][i]*ckt.fs[j][i] 
			          - ckt.alphas[j]*ckt.qs[j][i];
		    }
		}
		// matrix = beta0*G + alpha0*C.
		var beta0 = ckt.betas[0], alpha0 = ckt.alphas[0];
		mat_scale_add(ckt.G, ckt.C, beta0, alpha0, ckt.matrix);
	    }

	    // This is just a second order predictor, really should use
	    // the general formula.
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

	    // Set the timestep coefficients (sum alphas x's = sum betas f's).
	    // Note, alpha2 is for bdf2.
	    function set_int_coeffs(ckt, order) {
		var beta0,beta1;
		ckt.alphas[0] = 1.0/(ckt.times[0] - ckt.times[1]);
		ckt.alphas[1] = -ckt.alphas[0];
		ckt.alphas[2] = 0;
		if (order == 1) {
		    beta0 = 1.0;
		    beta1 = 0.0;
		} else { // Use trap (average old and new crnts.
		    beta0 = 0.5;
		    beta1 = 0.5;
		}
		// For trap rule, turn off current avging for algebraic eqns
		for (var i = ckt.N - 1; i >= 0; --i) {
		    ckt.betas[0][i] = beta0 + ckt.ar[i]*beta1;
		    ckt.betas[1][i] = (1.0 - ckt.ar[i])*beta1;
		}
	    }


	    function lte_step(ckt, step_index, order) {
		// NEED TO FIX!!! Predictor ignores order.
		var min_shrink_factor = 1.0/lte_step_decrease_factor;
	        var max_growth_factor = time_step_increase_factor;
		var N = ckt.N;
		var sols = ckt.xs;
		var soln_max = ckt.x_max;
		var times = ckt.times;
		var p = interp_coeffs(times[0],times[1],times[2],times[3]);
		var trapcoeff = 0.5*(times[0]-times[1])/(times[0]-times[3]);
		var maxlteratio = 0.0;
		for (var i = N-1; i >= 0; --i) {
		    if (ckt.ltecheck[i]) { // Check lte on variable
			var pred = 0;
			for (var j = p.length-1; j >= 0; --j)
			    pred += p[j]*sols[j+1][i];
			var lte = Math.abs((sols[0][i] - pred))*trapcoeff;
			var err = ckt.abstol[i]+reltol*soln_max[i];
			var lteratio = lte/(lterel*err); // > 1 is bad.
			maxlteratio = Math.max(maxlteratio, lteratio);
		    }
		}
		var new_step = times[0] - times[1]; // default: same stepsize
		// Note cube root for second-order methods.
		var lte_step_ratio = 1.0/Math.pow(maxlteratio,1/3); 
		if (lte_step_ratio < 0.99) { // Shrink step if > 1% too large.
		    lte_step_ratio =Math.max(lte_step_ratio,min_shrink_factor);
		    new_step *= 0.75*lte_step_ratio;
		    new_step = Math.max(new_step, ckt.min_step);
		} 
		else {  // Grow timestep if 20% too small, otherwise keep equal
		    lte_step_ratio =Math.min(lte_step_ratio,max_growth_factor);
		    if (lte_step_ratio > 1.2) { /* Inc timestep due to lte. */
			new_step *= lte_step_ratio/1.2;
			new_step = Math.min(new_step, ckt.max_step);
		    }
		}
		return new_step;
	    }

	    // Update time checks step index and breakpoints, tries to
	    // step on breakpoints and use firt order afterwards.
	    function update_time(ckt, step, step_index) {
		var times = ckt.times;
		var timestats = ckt.timestats;
		timestats[0].breakpoint = false;
		timestats[0].order = Math.max(2,ckt.max_order);  // Defaul
		//timestats[0].order = 1; // Force first order

		// If a t<=0 step, ensure stepsize non-inc and times[0]=tstart
		if (step_index <= 1) {  
		    step = Math.min(step,times[1] - times[2]); 
		    times[0] = times[1] + step;
		    if (step_index < 1)   // Then times[0] must be tstart
			for (var i = ckt.times.length - 1; i >= 0; i--) 
			    times[i] -= times[0] - ckt.tstart;
		    timestats[0].order = 1; // Use first order before tstart.
		}
		else {  // Breakpt check
		    // Get the soonest breakpoint a minstep past current time
		    var t_now = times[1];
		    var t_time = t_now + ckt.min_step; // Test time.
		    var min_bt = tstop;
		    for (var i = ckt.voltage_sources.length-1; i >= 0; --i) {
			var b_t = ckt.voltage_sources[i].breakpoint(t_time);
			if (b_t != undefined) min_bt = Math.min(min_bt,b_t);
		    }
		    for (var i = ckt.current_sources.length-1; i >= 0; --i) {
			var b_t = ckt.current_sources[i].breakpoint(t_time);
			if (b_t != undefined) min_bt = Math.min(min_bt,b_t);
		    }
		    // Better not be less than current time
		    if (min_bt < t_now) {
			alert('badbp ='+min_bt+' t='+times[1]);
		    }

		    // New step is more than half way to be bp, make
		    // it nearly half way (step up to a bp reasonably).
		    if (min_bt < (t_now + step)) {
			times[0] = t_now + (min_bt - t_now);
			timestats[0].breakpoint = true;
		    }
		    else if (min_bt < (t_now + 2*step))
			times[0] = times[1] + (min_bt - t_now)/2;
		    else 
			times[0] = times[1] + step;
		}

		// Use 1st order step AFTER break or if timestep really small
		if (timestats[1].breakpoint  || (step < 100*ckt.min_step))
		    timestats[0].order = 1;  

		return timestats[0].order;

	    }
	    
	    // ************************* Start of Transient Analysis
	    
	    // Standard to do a dc analysis before transient
	    // Otherwise, do the setup also done in dc.
	    no_dc = false;
	    this.tstart = tstart;
	    this.tstop = tstop;
	    if ((this.diddc == false) && (no_dc == false)) {
		if (this.dc() == undefined) { // DC fail, realloc mats, vects.
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

	    // build array to hold list of results for each variable
	    // last entry is for timepoints.
	    var response = new Array(this.N + 1);
	    for (var i = this.N; i >= 0; --i) response[i] = new Array();

	    // Put it in the ckt.
	    this.responses = response;

	    // Mark a set of algebraic variables (don't miss hidden ones!).
	    // Use capacitance matrix linearized about DC and OR with list
	    // of nodes controlled by paths of vsources to ground.
	    this.times[0] = tstart;
	    this.loader(this.xs[0],true,this.times[0]);
	    this.ar = this.algebraic(this.Cl);
	    for (var i = this.N; i >= 0; --i) 
		if (this.vsrc2g[i] == 1) this.ar[i] = 1;


	    // Non-algebraic and probe variables get lte check.
	    this.ltecheck = new Array(this.N);
	    for (var i = this.N - 1; i >= 0; --i) 
		this.ltecheck[i] = (this.ar[i] == 0);
	    for (var name in this.node_map) {
		var index = this.node_map[name];
		for (var i = probenames.length; i >= 0; --i) {
		    if (name == probenames[i]) {
			this.ltecheck[index] = true;
			break;
		    }
		}
	    }

	    // Check for periodic sources
	    var period = tstop - tstart;
	    for (var i = this.voltage_sources.length - 1; i >= 0; --i) {
		var per = this.voltage_sources[i].src.period;
		if (per > 0) period = Math.min(period, per);
	    }
	    for (var i = this.current_sources.length - 1; i >= 0; --i) {
		var per = this.current_sources[i].src.period;
		if (per > 0) period = Math.min(period, per);
	    }
	    this.periods = Math.ceil((tstop - tstart)/period);
	    //alert('number of periods ' + this.periods);
	    this.periods = Math.min(20,this.periods);
	    this.periods = Math.max(1,this.periods);

	
	    // ntpts adjusted by numbers of periods in input
	    this.max_step = (tstop - tstart)/(this.periods*ntpts);
	    this.min_step = this.max_step/1e8;

	    // Initialize prior values for time, sol, q's, x's, and f's.
	    for (var i = 1; i < this.times.length; ++i) {
		this.times[i] = this.times[i-1] - new_step;
		for (var j = this.N-1; j >= 0; --j) {
		    this.xs[i][j] = this.xs[0][j];
		    this.qs[i][j] = this.qs[0][j];
		    this.fs[i][j] = this.fs[0][j];
		}
	    }

	    // Don't let it use more than 50000 timesteps/period.
	    var max_nsteps = this.periods*50000;

	    //  Initialize stepsize (100x minstep to start).
	    var new_step = this.min_step*100;
	    for (var i = this.times.length - 1; i >= 0; i--) 
		this.times[i] = tstart - (i+1)*new_step; 

	    // Variables for collecting statistics.
	    var lte_fails=0, newt_fails=0, newt_iters=0, breakpts=0;
	    var order_steps = new Array(this.max_order+1);
	    for (var i = order_steps.length - 1; i >= 0; --i)
		order_steps[i] = 0;

	    // *********************************The time-stepping loop.
	    for(var step_index = -3; step_index < max_nsteps; step_index++) {
		// Rotate x's, q's and f's, and copies [1] -> [0] if true
		// No poly predictor, can be unsafe.
		mat_rrotate(this.xs, true); 
		mat_rrotate(this.qs, true);
		mat_rrotate(this.fs, true);

		// update past times and the stats.
		this.times.unshift(this.times.pop());
		this.timestats.unshift(this.timestats.pop());
		this.timestats[0].clr();

		// Save solution if step index is past pretime steps.
		if (step_index > 0) { 
		    for (var i = this.N - 1; i >= 0; --i)
			response[i].push(this.xs[1][i]);
		    response[this.N].push(this.times[1]);
		    var ts = this.timestats[1];
		    lte_fails += ts.lte_fails;
		    newt_fails += ts.newt_fails;
		    newt_iters += ts.newt_iters;
		    order_steps[ts.order] += 1;
		    if (ts.breakpoint) breakpts += 1;
		}

		// If the last time is >= stoptime, sim is done.

		if ((this.times[1] >= (1-eps)*tstop) 
		    || (step_index == max_nsteps-1)) {
		    /*
		    alert('Integration Method Steps'
			  + '\n# 1st Order = '
			  + order_steps[1]
			  + '  # 2nd Order = '
			  + order_steps[2]
			  + '\n # of Newton Iterations: ' 
			  + newt_iters 
			  + '\n # of Newton Nonconvergence failures: '
			  + newt_fails 
			  + '\n # of Local Truncation Error failures: '
			  + lte_fails 
			  + '\n # of breakpoints matched: ' 
			  + breakpts);
		    */
		    break;
		}

		// Loop to find NR converging timestep with okay LTE
		for(var step_okay = false; step_okay == false;) {
		    // Update time (checks for breakpoints, other issues).
		    order = update_time(this, new_step, step_index);
		    //order = 1;
		    old_step = this.times[0] - this.times[1];

		    // Set the integration method alphas and betas.
		    set_int_coeffs(this, order);

		    // Use Newton to compute the solution.
		    // If Newton Fails, shrink step and try again.
		    // Else if Newton converges check the lte
		    //   If Lte is okay, set a new step and leave.
		    //   Else if stepsize == minstep, set new step and leave.
		    //   Else reduce the step size and try again.
		    var iters = this.find_solution(load_tran,max_tran_iters);

		    if (iters == undefined) { // NR fail, shrink step
			//alert('step noncon ' + this.time + ' ' + step_index);
			this.timestats[0].newt_iters += max_tran_iters;
			new_step = old_step/nr_step_decrease_factor;
			this.timestats[0].newt_fails += 1;
		    }
		    else {
			this.timestats[0].newt_iters += iters;
			if (old_step < 2*this.min_step) { // Accept small step
			    new_step = old_step * time_step_increase_factor;
			    step_okay = true;
			} 
			else {
			    var new_step = lte_step(this, step_index,order);
			    if (new_step > (1 - eps)*old_step) 
				step_okay = true;
			    else 
				this.timestats[0].lte_fails += 1;
			}
		    }
		}
	    }

	    // create solution dictionary
	    var result = new Array();
	    for (var name in this.node_map) {
		var index = this.node_map[name];
		result[name] = (index == -1) ? 0 : response[index];
	    }
	    // capture branch currents from voltage sources
	    for (var i = this.voltage_sources.length - 1; i >= 0; --i) {
		var v = this.voltage_sources[i];
		result['I('+v.name+')'] = response[v.branch];
	    }

	    result['_time_'] = response[this.N];
	    return result;
	}

	// AC analysis: npts/decade for freqs in range [fstart,fstop]
	// result['_frequencies_'] = vector of log10(sample freqs)
	// result['xxx'] = vector of dB(response for node xxx)
    // NOTE: Normalization removed in schematic.js, jkw.
    Circuit.prototype.ac = function(npts,fstart,fstop,source_name) {
	    if (this.dc() == undefined) { // DC failed, realloc mats and vects.
		return undefined;
	    }

	    if (this.times[0] === undefined) this.times[0] = 0.0; 
	    
	    this.loader(this.xs[0], true, this.times[0]);

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
	    for (var i = 2*N; i >= 0; --i) response[i] = new Array();

	    // multiplicative frequency increase between freq points
	    var delta_f = Math.exp(Math.LN10/npts);

	    var phase_offset = new Array(N);
	    for (var i = N-1; i >= 0; --i) phase_offset[i] = 0;

	    var f = fstart;
	    fstop *= 1.0001;  // capture that last freq point!
	    while (f <= fstop) {
		var omega = 2 * Math.PI * f;
		response[2*N].push(f);   // 2*N for magnitude and phase

		// Find complex x+jy that sats Gx-omega*Cy=rhs; omega*Cx+Gy=0
		// Note: solac[0:N-1]=x, solac[N:2N-1]=y
		for (var i = N-1; i >= 0; --i) {
		    // First the rhs, replicated for real and imaginary
		    matrixac[i][2*N] = this.rhs[i];
		    matrixac[i+N][2*N] = 0;

		    for (var j = N-1; j >= 0; --j) {
			matrixac[i][j] = G[i][j];
			matrixac[i+N][j+N] = G[i][j];
			matrixac[i][j+N] = -omega*C[i][j];
			matrixac[i+N][j] = omega*C[i][j];
		    }
		}

		// Compute the small signal response
		var solac = mat_solve(matrixac);

		// Save magnitude and phase
		for (var i = N - 1; i >= 0; --i) {
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
	    var result = new Array();
	    for (var name in this.node_map) {
		var index = this.node_map[name];
		result[name] = (index == -1) ? 0 : response[index];
		result[name+'_phase'] = (index == -1) ? 0 : response[index+N];
	    }
	    result['_frequencies_'] = response[2*N];
	    return result;
	}


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
	}

	Circuit.prototype.r = function(n1,n2,v,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof v) == 'string') {
		v = parse_number_alert(v);
		if (v === undefined) return undefined;
	    }

	    if (v != 0) {
		var d = new Resistor(n1,n2,v);
		return this.add_device(d, name);
	    } else return this.v(n1,n2,'0',name);   // zero resistance == 0V voltage source
	}

	Circuit.prototype.d = function(n1,n2,area,is,vt,type,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof area) == 'string') {
		area = parse_number_alert(area);
		if (area === undefined) return undefined;
	    }
	    if ((typeof is) == 'string') {
		is = parse_number_alert(is);
		if (is === undefined) return undefined;
	    }
	    if ((typeof vt) == 'string') {
		vt = parse_number_alert(vt);
		if (vt === undefined) return undefined;
	    }
	    if (area != 0) {
		var d = new Diode(n1,n2,area,is,vt,type);
		return this.add_device(d, name);
	    } // zero area diodes discarded.
	}


	Circuit.prototype.c = function(n1,n2,v,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof v) == 'string') {
		v = parse_number_alert(v);
		if (v === undefined) return undefined;
	    }
	    var d = new Capacitor(n1,n2,v);
	    return this.add_device(d, name);
	}

	Circuit.prototype.l = function(n1,n2,v,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof v) == 'string') {
		v = parse_number_alert(v);
		if (v === undefined) return undefined;
	    }
	    var branch = this.node(undefined,T_CURRENT);
	    var d = new Inductor(n1,n2,branch,v);
	    return this.add_device(d, name);
	}

        Circuit.prototype.v = function(n1,n2,v,name) {
	    var branch = this.node(undefined,T_CURRENT);
	    var d = new VSource(n1,n2,branch,v);
	    this.voltage_sources.push(d);
	    return this.add_device(d, name);
	}

	Circuit.prototype.i = function(n1,n2,v,name) {
	    var d = new ISource(n1,n2,v);
	    this.current_sources.push(d);
	    return this.add_device(d, name);
	}

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
	}

        Circuit.prototype.twoport = function(n1p,n1m,n2p,n2m,A11,A12,A21,A22,B11,B12,B21,B22,name) {

	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof A11) == 'string') {
		A11 = parse_number_alert(A11);
		if (A11 === undefined) return undefined;
	    }
	    if ((typeof A12) == 'string') {
		A12 = parse_number_alert(A12);
		if (A12 === undefined) return undefined;
	    }
	    if ((typeof A21) == 'string') {
		A21 = parse_number_alert(A21);
		if (A21 === undefined) return undefined;
	    }
	    if ((typeof A22) == 'string') {
		A22 = parse_number_alert(A22);
		if (A22 === undefined) return undefined;
	    }

	    if ((typeof B11) == 'string') {
		B11 = parse_number_alert(B11);
		if (B11 === undefined) return undefined;
	    }
	    if ((typeof B12) == 'string') {
		B12 = parse_number_alert(B12);
		if (B12 === undefined) return undefined;
	    }
	    if ((typeof B21) == 'string') {
		B21 = parse_number_alert(B21);
		if (B21 === undefined) return undefined;
	    }
	    if ((typeof B22) == 'string') {
		B22 = parse_number_alert(B22);
		if (B22 === undefined) return undefined;
	    }

	    var ni1 = this.node(undefined,T_CURRENT);
	    var ni2 = this.node(undefined,T_CURRENT);
	    var d = new Twoport(n1p,n1m,n2p,n2m,ni1,ni2,A11,A12,A21,A22,B11,B12,B21,B22,name);
	    return this.add_device(d, name);
	}


        Circuit.prototype.tline = function(n1p,n1m,n2p,n2m,Z0,Delay,Rw,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof Z0) == 'string') {
		z0 = parse_number_alert(Z0);
		if (z0 === undefined) return undefined;
	    }
	    if ((typeof Delay) == 'string') {
		tD = parse_number_alert(Delay);
		if (tD === undefined) return undefined;
	    }
	    if ((typeof Delay) == 'string') {
		Rw = parse_number_alert(Rw);
		if (Rw === undefined) return undefined;
	    }
	    var ni1to2 = this.node(undefined,T_CURRENT);
	    var ni2to1 = this.node(undefined,T_CURRENT);
	    var d = new Tline(n1p,n1m,n2p,n2m,ni1to2,ni2to1,z0,tD,Rw,name);
	    return this.add_device(d, name);
	}

        Circuit.prototype.nBJT = function(c,b,e,area,Ics,Ies,alphaF,alphaR,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof area) == 'string') {
		area = parse_number_alert(area);
		if (area === undefined) return undefined;
	    }
	    if ((typeof Ics) == 'string') {
		Ics = parse_number_alert(Ics);
		if (Ics === undefined) return undefined;
	    }
	    if ((typeof Ies) == 'string') {
		Ies = parse_number_alert(Ies);
		if (Ies === undefined) return undefined;
	    }
	    if ((typeof alphaF) == 'string') {
		alphaF = parse_number_alert(alphaF);
		if (alphaF === undefined) return undefined;
	    }
	    if ((typeof alphaR) == 'string') {
		alphaR = parse_number_alert(alphaR);
		if (alphaR === undefined) return undefined;
	    }
	    var d = new bjt(c,b,e,area,Ics,Ies,alphaF,alphaR,name,'n');
	    return this.add_device(d, name);
	}

        Circuit.prototype.pBJT = function(c,b,e,area,Ics,Ies,alphaF,alphaR,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof area) == 'string') {
		area = parse_number_alert(area);
		if (area === undefined) return undefined;
	    }
	    if ((typeof Ics) == 'string') {
		Ics = parse_number_alert(Ics);
		if (Ics === undefined) return undefined;
	    }
	    if ((typeof Ies) == 'string') {
		Ies = parse_number_alert(Ies);
		if (Ies === undefined) return undefined;
	    }
	    if ((typeof alphaF) == 'string') {
		alphaF = parse_number_alert(alphaF);
		if (alphaF === undefined) return undefined;
	    }
	    if ((typeof alphaR) == 'string') {
		alphaR = parse_number_alert(alphaR);
		if (alphaR === undefined) return undefined;
	    }
	    var d = new bjt(c,b,e,area,Ics,Ies,alphaF,alphaR,name,'p');
	    return this.add_device(d, name);
	}

        Circuit.prototype.n = function(d,g,s,ratio,vt,lambda,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof ratio) == 'string') {
		ratio = parse_number_alert(ratio);
		if (ratio === undefined) return undefined;
	    }
	    if ((typeof vt) == 'string') {
		vt = parse_number_alert(vt);
		if (vt === undefined) return undefined;
	    }
	    if ((typeof lambda) == 'string') {
		lambda = parse_number_alert(lambda);
		if (lambda === undefined) return undefined;
	    }
	    var d = new Fet(d,g,s,ratio,vt,lambda,name,'n');
	    return this.add_device(d, name);
	}

        Circuit.prototype.p = function(d,g,s,ratio,vt,lambda,name) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof ratio) == 'string') {
		ratio = parse_number_alert(ratio);
		if (ratio === undefined) return undefined;
	    }
	    if ((typeof vt) == 'string') {
		vt = parse_number_alert(vt);
		if (vt === undefined) return undefined;
	    }
	    if ((typeof lambda) == 'string') {
		lambda = parse_number_alert(lambda);
		if (lambda === undefined) return undefined;
	    }
	    var d = new Fet(d,g,s,ratio,vt,lambda,name,'p');
	    return this.add_device(d, name);
	}

        Circuit.prototype.fet_vs = function(d,g,s,b, W, dVt, name, type) {
	    // try to convert string value into numeric value, barf if we can't
	    if ((typeof W) == 'string') {
		W = parse_number_alert(W);
		if (W === undefined) return undefined;
	    }
	    if ((typeof dVt) == 'string') {
		dVt = parse_number_alert(dVt);
		if (dVt === undefined) return undefined;
	    }
	    var dv = new Fet_vs(d,g,s,b,W,dVt,name,type,this);
	    return this.add_device(dv, name);
	}

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
	}

	// add val component between two nodes to matrix M
	// Index of -1 refers to ground node
        Circuit.prototype.get_one_terminal = function(i,x) {
	    var xi = 0;
	    if (i >= 0) xi = x[i];
	    return xi
	}

	// add val component between two nodes to matrix M
	// Index of -1 refers to ground node
        Circuit.prototype.get_two_terminal = function(i,j,x) {
	    var xi_minus_xj = 0;
	    if (i >= 0) xi_minus_xj = x[i];
	    if (j >= 0) xi_minus_xj -= x[j];
	    return xi_minus_xj
	}

        Circuit.prototype.add_conductance_l = function(i,j,g) {
            this.add_two_terminal(i,j,g, this.Gl)
	}

        Circuit.prototype.add_conductance = function(i,j,g) {
            this.add_two_terminal(i,j,g, this.G)
	}

        Circuit.prototype.add_capacitance = function(i,j,c) {
            this.add_two_terminal(i,j,c,this.C)
	}

        Circuit.prototype.add_capacitance_l = function(i,j,c) {
            this.add_two_terminal(i,j,c,this.Cl)
	}

	// add individual conductance to Gl matrix
	Circuit.prototype.add_to_Gl = function(i,j,g) {
	    if (i >=0 && j >= 0)
		this.Gl[i][j] += g;
	}

	// add individual conductance to G matrix
	Circuit.prototype.add_to_G = function(i,j,g) {
	    if (i >=0 && j >= 0)
		this.G[i][j] += g;
	}

	// add individual capacitance to C matrix
	Circuit.prototype.add_to_C = function(i,j,c) {
	    if (i >=0 && j >= 0)
		this.C[i][j] += c;
	}

	// add individual capacitance to Cl matrix
	Circuit.prototype.add_to_Cl = function(i,j,c) {
	    if (i >=0 && j >= 0)
		this.Cl[i][j] += c;
	}

	// add source info to rhs
        Circuit.prototype.add_to_rhs = function(i,v,rhs) {
	    if (i >= 0)	rhs[i] += v;
	}


	///////////////////////////////////////////////////////////////////////////////
	//
	//  Generic matrix support - making, copying, factoring, rank, etc
	//  Note, Matrices are stored using nested javascript arrays.
	//
	///////////////////////////////////////////////////////////////////////////////

        // Allocate an NxM matrix, array of arrays, each row is an array.
        function mat_make(N,M) {
	    var mat = new Array(N);	
	    for (var i = N - 1; i >= 0; --i) {	    
			mat[i] = new Array(M);
			for (var j = M - 1; j >= 0; --j) {	    
			    mat[i][j] = 0.0;
			}
	    }
	    return mat;
	}
        
        // Rotates rows of mat.  If copy_first == true, row 0 kept in 
        // place and row 1 to N rotate down, with row 0 copied in to new row 1.
        function mat_rrotate(M,copy_first) {
	    M.unshift(M.pop());
	    if (copy_first) 
		for(var i = M[0].length - 1; i >= 0; --i)
		    M[0][i] = M[1][i];
	}

        // Form b = scale*Mx
        function mat_v_mult(M,x,b,scale) {
	    var n = M.length;
	    var m = M[0].length;
	    
	    if (n != b.length || m != x.length)
			throw 'Rows of M mismatched to b or cols mismatch to x.';

	    for (var i = 0; i < n; i++) {
		var temp = 0;
		for (var j = 0; j < m; j++) temp += M[i][j]*x[j];
		b[i] = scale*temp;  // Recall the neg in the name
	    }
	}

        // C = scalea*A + scaleb*B, scalea, scaleb nums or arrays (row scaling)
        function mat_scale_add(A, B, scalea, scaleb, C) {
	    var n = A.length;
	    var m = A[0].length;
	    
	    if (n > B.length || m > B[0].length)
			throw 'Row or columns of A to large for B';
	    if (n > C.length || m > C[0].length)
			throw 'Row or columns of A to large for C';
	    if ((typeof scalea == 'number') && (typeof scaleb == 'number'))
		for (var i = 0; i < n; i++)
		    for (var j = 0; j < m; j++)
			C[i][j] = scalea*A[i][j] + scaleb*B[i][j];
	    else if ((typeof scaleb == 'number') && (scalea instanceof Array))
		for (var i = 0; i < n; i++)
		    for (var j = 0; j < m; j++)
			C[i][j] = scalea[i]*A[i][j] + scaleb*B[i][j];
	    else if ((typeof scalea == 'number') && (scaleb instanceof Array))
		for (var i = 0; i < n; i++)
		    for (var j = 0; j < m; j++)
			C[i][j] = scalea[i]*A[i][j] + scaleb*B[i][j];
	    else if ((typeof scaleb instanceof Array) && (scalea instanceof Array))
		for (var i = 0; i < n; i++)
		    for (var j = 0; j < m; j++)
			C[i][j] = scalea[i]*A[i][j] + scaleb[i]*B[i][j];
	    else
			throw 'scalea and scaleb must be scalars or Arrays';
	}

        // Returns a vector of ones and zeros, ones denote algebraic
        // variables, ie rows that can be removed without changing rank(M).
        Circuit.prototype.algebraic = function(M) {
	    var Nr = M.length
	    Mc = mat_make(Nr, Nr);
	    mat_copy(M,Mc);
	    var R = mat_rank(Mc);

	    var one_if_alg = new Array(Nr);
	    //for (var row = Nr - 1; row >= 0; row--) { // psuedo gnd row small
	    for (var row = 0; row  < Nr; row++) {  // psuedo gnd row small
		for (var col = Nr - 1; col >= 0; --col)
		    Mc[row][col] = 0;
		if (mat_rank(Mc) == R)  // Zeroing row left rank unchanged
		    one_if_alg[row] = 1;
		else { // Zeroing row changed rank, put back
		    for (var col = Nr - 1; col >= 0; --col)
			Mc[row][col] = M[row][col];
		    one_if_alg[row] = 0;
		}
	    }
	    return one_if_alg;
	}

        // Copy A -> using the bounds of A
	function mat_copy(src,dest) {
	    var n = src.length;
	    var m = src[0].length;
	    if (n > dest.length || m >  dest[0].length)
			throw 'Rows or cols > rows or cols of dest';
	    for (var i = 0; i < n; i++)
		for (var j = 0; j < m; j++)
		    dest[i][j] = src[i][j];
	}
	    
        // Copy and transpose A -> using the bounds of A
	function mat_copy_transposed(src,dest) {
	    var n = src.length;
	    var m = src[0].length;
	    if (n > dest[0].length || m >  dest.length)
			throw 'Rows or cols > cols or rows of dest';
	    for (var i = 0; i < n; i++)
		for (var j = 0; j < m; j++)
		    dest[j][i] = src[i][j];
	}

	// Creates Nc-length vector with 1's for every g column,
	// where a column is g if it is a singleton in a row, or
	// if it is path connected to a singleton row.
        function mat_path_g(Mo) {
	    var Nr = Mo.length;  // Number of rows
	    var Nc = Mo[0].length;  // Number of columns
	    var temp,i,j;
	    
	    // Make an array to return and intialize with singletons
	    var g = new Array(Nc);
	    for (var col = Nc - 1; col >=0; --col) g[col] = 0;

	    // Iterative sweep through the rows, marking g columns.
	    // Breaks when no change in sweep, but Nr*Nc in worst case.
	    for (var iters = 0; iters < Nc; iters++) {
		var noChange = true;
		for (var row = Nr-1; row >= 0; --row) {
		    var rownz = 0, gcol = -1;
		    for (var col = Nc - 1; col >= 0; --col) {
			if (g[col] == 0 && Mo[row][col] != 0) {
			    rownz++;
			    gcol = col;
			}
		    }
		    if (rownz == 1) {
			g[gcol] = 1;
			noChange = false;
		    }
		}
		if (noChange) {
		    break;
		}
	    }
	    return(g);
	}



	// Uses GE to determine rank.
        function mat_rank(Mo) {
	    var Nr = Mo.length;  // Number of rows
	    var Nc = Mo[0].length;  // Number of columns
	    var temp,i,j;
	    // Make a copy to avoid overwriting
	    M = mat_make(Nr, Nc);
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
	    for (var row = 0; row < Nr; row++) {
		// Search for first nonzero column in the remaining rows.
		for (var col = start_col; col < Nc; col++) {
		    var max_v = Math.abs(M[row][col]);
		    var max_row = row;
		    for (var i = row + 1; i < Nr; i++) {
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
			for (var i = row + 1; i < Nr; i++) {
			    temp = M[i][col]/M[row][col];   // multiplier for current row
			    if (temp != 0)  // subtract 
			    for (var j = col; j < Nc; j++) M[i][j] -= M[row][j]*temp;
			}
			// Now move on to the next row
			break;
		    }
		}
	    }

	    // return the rank
	    return the_rank;
	}

	// Solve Mx=b and return vector x using R^TQ^T factorization. 
        // Multiplication by R^T implicit, should be null-space free soln.
        // M should have the extra column!
        // Almost everything is in-lined for speed, sigh.
        function mat_solve_rq(M, rhs) {

	    var Nr = M.length;  // Number of rows
	    var Nc = M[0].length;  // Number of columns
	    var max_nonzero_row = Nr - 1;  // Assume matrix is rank Nr.

	    // Copy the rhs in to the last column of M if one is given.
	    // And determine the max and min nonzero row 2-norm for comparisons.
	    var mat_maxsq = 0, mat_minsq = 0; 
	    for (var row = Nr - 1; row >= 0; --row) {
		var Mr = M[row];
		if (rhs != null) Mr[Nc-1] = rhs[row];   // Note: last col=rhs.
		var sumsq = 0;
		for (col = Nc-2; col >= 0; --col)
		    sumsq += Mr[col]*Mr[col];
		mat_maxsq = Math.max(mat_maxsq, sumsq);
		if (mat_minsq == 0) mat_minsq = sumsq;
		else mat_minsq = Math.min(mat_minsq, sumsq);
	    }
	    if (isNaN(mat_maxsq)) {
		alert(mat_maxsq);
	    }
	    var mat_scale = Math.sqrt(mat_maxsq), mat_scale_min = Math.sqrt(mat_minsq);

	    for (var row = 0; row < Nr; row++) {  
		// Order by lowest # of nnzs, as constraints have low nnz's, 
		// are ordered first, removing unscaled 1's. Or order by
		// highest row 2-norm
		var best_row = row, best_row_norm = 0, best_row_nnz = Nc;
		for (var rowp = row; rowp < Nr; rowp++) {
		    var Mr = M[rowp], sumsq = 0, nnz = 0;
		    for (var col = Nc-2; col >= 0; --col) {
			var sqval = Mr[col]*Mr[col];
			sumsq += sqval;
			nnz += (sqval > 0.0) ? 1 : 0;
		    }
		    var row_norm = Math.sqrt(sumsq);
		    if ((row == rowp)
			|| ((nnz <= best_row_nnz) 
			    && (row_norm > mat_scale_min*eps))) {
			/*
			|| (row_norm > best_row_norm)) {
			*/
			best_row = rowp;
			best_row_norm = row_norm;
			best_row_nnz = nnz;
		    }

		}

		// Swap rows if not best row
		if (best_row > row) {
		    var temp = M[row];
		    M[row] = M[best_row];
		    M[best_row] = temp;
		}

		// Check for all zero rows
		if (best_row_norm > mat_scale_min*eps) scale = 1.0/best_row_norm;
	        else {
		    max_nonzero_row = row - 1;  // Rest will be nullspace of M
		    //alert('found zero row');
		    break;
		}

		// Nonzero row, eliminate from rows below
		var Mr = M[row];
		for (var col =  Nc-1; col >= 0; --col) // Scale rhs also
		    Mr[col] *= scale;
		for (var rowp = row + 1; rowp < Nr; rowp++) { // Update.
		    var Mrp = M[rowp];
		    var inner = 0;
		    for (var col =  Nc-2; col >= 0; --col)  // Project 
			inner += Mr[col]*Mrp[col];
		    for (var col =  Nc-1; col >= 0; --col) // Ortho (rhs also)
			Mrp[col] -= inner *Mr[col];
		}
	    }

	    // Last Column of M has inv(R^T)*rhs.  Scale rows of Q to get x.
	    var x = new Array(Nc-1);
	    for (var col = Nc-2; col >= 0; --col)
		x[col] = 0;
	    for (var row = max_nonzero_row; row >= 0; --row) {
		Mr = M[row];
		for (var col = Nc-2; col >= 0; --col) {
		    x[col] += Mr[col]*Mr[Nc-1];
		}
	    }

	    // Return solution.
	    return x;
        }

	// solve Mx=b and return vector x given augmented matrix M = [A | b]
	// Uses Gaussian elimination with partial pivoting
        function mat_solve(M,rhs) {
	    var N = M.length;      // augmented matrix M has N rows, N+1 columns
	    var temp,i,j;

	    // Copy the rhs in to the last column of M if one is given.
	    if (rhs != null) {
		for (var row = 0; row < N ; row++)
		    M[row][N] = rhs[row];
	    }

	    // gaussian elimination
	    for (var col = 0; col < N ; col++) {
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

	    // return solution
	    return x;
	}

	// test solution code, expect x = [2,3,-1]
	//M = [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]];
	//x = mat_solve(M);
	//y = 1;  // so we have place to set a breakpoint :)


        //////////////////////////////////////////////////////////////////////
        //  Assistant Objects
        //////////////////////////////////////////////////////////////////////

	function Timepoint() {
	    this.clr();
	}

        Timepoint.prototype.clr = function() {
	    this.order = 1;
	    this.breakpoint = false;  // Note if this timepoint is a breakpt
	    this.lte_fails = 0;
	    this.newt_fails = 0;
	    this.newt_iters = 0;
	}

	///////////////////////////////////////////////////////////////////////////////
	//
	//  Device base class
	//
	////////////////////////////////////////////////////////////////////////////////

	function Device() {
	}

	// complete initial set up of device
	Device.prototype.finalize = function() {
	}

    // Load the linear elements in to Gl and Cl
    Device.prototype.load_linear = function(ckt) {
	}

	// load nonlinear currents for dc analysis
	// (inductors shorted and capacitors opened)
        Device.prototype.load_dc = function(ckt,soln,rhs) {
	}

	// load linear system equations for tran analysis
        Device.prototype.load_tran = function(ckt,soln,crnt,chg,time) {
	}

	// load linear system equations for ac analysis:
	// current sources open, voltage sources shorted
	// linear models at operating point for everyone else
	Device.prototype.load_ac = function(ckt,rhs) {
	}

	// return time of next breakpoint for the device
	Device.prototype.breakpoint = function(time) {
	    return undefined;
	}

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

	    // Some times a units letter is typed right after engineering
	    // notation.  For example, pa or pA, ps or pS, mv or mV for 
	    // picoamps, picoseconds, or millivolts respectively.  
	    // Farads and Henries are also common.
	    // Remove the typical ones.
	    if (index < slen) {
		var charu = s.charAt(index);
		// Just dispose of character if a likely units char
		if ((charu == 'a') || (charu == 'A')
		    || (charu == 'v') || (charu == 'V')
		    || (charu == 's') || (charu == 'S'))
		    index += 1;
	    }

	    // skip trailing whitespace, return default value if there
	    // non-whitespace trailing characters.
	    while (index < slen && s.charAt(index) <= ' ') index += 1;
	    if (index == slen) return result;
	    else return default_v;
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
	// source types: dc,step,square,triangle,sin,pulse,ramp,pwl,pwl_repeating

	// returns an object with the following attributes:
	//   fun -- name of source function
	//   args -- list of argument values
	//   value(t) -- compute source value at time t
	//   inflection_point(t) -- compute time after t when a time point is needed
	//   dc -- value at time 0
	//   period -- repeat period for periodic sources (0 if not periodic)
	
	function parse_source(v) {
	    // generic parser: parse v as either <value> or <fun>(<value>,...)
	    var src = new Object();
	    src.period = 0; // Default not periodic
	    src.value = function(t) { return 0; }  // overridden below
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
		    src.args.push(parse_number_alert(v.slice(index,arg_end)));
		    index = arg_end + 1;
		}
	    } else {
		src.fun = 'dc';
		src.args = [parse_number_alert(v)];
	    }

	    // post-processing for constant sources
	    // dc(v)
	    if (src.fun == 'dc') {
		var v = arg_value(src.args,0,0);
		src.args = [v];
		src.value = function(t) { return v; }  // closure
	    }

	    // post-processing for impulse sources
	    // impulse(height,width)
	    else if (src.fun == 'impulse') {
		var h = arg_value(src.args,0,1);  // default height: 1
		var w = Math.abs(arg_value(src.args,2,1e-9));  // default width: 1ns
		src.args = [h,w];  // remember any defaulted values
		pwl_source(src,[0,0,w/2,h,w,0],false);
	    }

	    // post-processing for step sources
	    // step(v_init,v_plateau,t_delay,t_rise)
	    else if (src.fun == 'step') {
		var v1 = arg_value(src.args,0,0);  // default init value: 0V
		var v2 = arg_value(src.args,1,1);  // default plateau value: 1V
		var td = Math.max(0,arg_value(src.args,2,0));  // time step starts
		var tr = Math.abs(arg_value(src.args,3,1e-9));  // default rise time: 1ns
		src.args = [v1,v2,td,tr];  // remember any defaulted values
		pwl_source(src,[td,v1,td+tr,v2],false);
	    }

	    // post-processing for square wave
	    // square(v_init,v_plateau,freq,duty_cycle)
	    else if (src.fun == 'square') {
		var v1 = arg_value(src.args,0,0);  // default init value: 0V
		var v2 = arg_value(src.args,1,1);  // default plateau value: 1V
		var freq = Math.abs(arg_value(src.args,2,1));  // default frequency: 1Hz
		var duty_cycle  = Math.min(100,Math.abs(arg_value(src.args,3,50)));  // default duty cycle: 0.5
		src.args = [v1,v2,freq,duty_cycle];  // remember any defaulted values

		var per = freq == 0 ? Infinity : 1/freq;
		var t_change = 0.01 * per;   // rise and fall time
		var t_pw = .01 * duty_cycle * 0.98 * per;  // fraction of cycle minus rise and fall time
		pwl_source(src,[0,v1,t_change,v2,t_change+t_pw,
				v2,t_change+t_pw+t_change,v1,per,v1],true);
	    }

	    // post-processing for triangle
	    // triangle(v_init,v_plateua,t_period)
	    else if (src.fun == 'triangle') {
		var v1 = arg_value(src.args,0,0);  // default init value: 0V
		var v2 = arg_value(src.args,1,1);  // default plateau value: 1V
		var freq = Math.abs(arg_value(src.args,2,1));  // default frequency: 1s
		src.args = [v1,v2,freq];  // remember any defaulted values

		var per = freq == 0 ? Infinity : 1/freq;
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
		var v1 = arg_value(src.args,0,0);  // default init value: 0V
		var v2 = arg_value(src.args,1,1);  // default plateau value: 1V
		var td = Math.max(0,arg_value(src.args,2,0));  // time pulse starts
		var tr = Math.abs(arg_value(src.args,3,1e-9));  // default rise time: 1ns
		var tf = Math.abs(arg_value(src.args,4,1e-9));  // default rise time: 1ns
		var pw = Math.abs(arg_value(src.args,5,1e9));  // default pulse width: "infinite"
		var per = Math.abs(arg_value(src.args,6,1e9));  // default period: "infinite"
		src.args = [v1,v2,td,tr,tf,pw,per];

		var t1 = td;       // time when v1 -> v2 transition starts
		var t2 = t1 + tr;  // time when v1 -> v2 transition ends
		var t3 = t2 + pw;  // time when v2 -> v1 transition starts
		var t4 = t3 + tf;  // time when v2 -> v1 transition ends

		pwl_source(src,[t1,v1, t2,v2, t3,v2, t4,v1, per,v1],true);
	    }

	    // post-processing for sinusoidal sources
	    // sin(v_offset,v_amplitude,freq_hz,t_delay,phase_offset_degrees)
	    else if (src.fun == 'sin') {
		var voffset = arg_value(src.args,0,0);  // default offset voltage: 0V
		var va = arg_value(src.args,1,1);  // default amplitude: -1V to 1V
		var freq = Math.abs(arg_value(src.args,2,1));  // default frequency: 1Hz
		src.period = 1.0/freq;

		var td = Math.max(0,arg_value(src.args,3,0));  // default time delay: 0sec
		var phase = arg_value(src.args,4,0);  // default phase offset: 0 degrees
		src.args = [voffset,va,freq,td,phase];

		phase /= 360.0;

		// return value of source at time t
		src.value = function(t) {  // closure
		    if (t < td) return voffset + va*Math.sin(2*Math.PI*phase);
		    else return voffset + va*Math.sin(2*Math.PI*(freq*(t - td) + phase));
		}

		// return time of next inflection point after time t
		src.inflection_point = function(t) {	// closure
		    if (t < td) return td;
		    else return undefined;
		}
	    }

	    // post-processing for ramp
	    // ramp(v_init,slope)
	    else if (src.fun == 'ramp') {
		var voffset = arg_value(src.args,0,0);  // default init val: 0V
		var slope = arg_value(src.args,1,1);  // default slope: 1v/sec.
		src.args = [voffset,slope];  // remember any defaulted values

		// return value of ramp at time t
		src.value = function(t) {  // closure
		    return voffset + slope*t;
		}

		// return time of next inflection point after time t
		src.inflection_point = function(t) {	// closure
		    return undefined;
		}
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
		src.value = function(t) { return nvals == 2 ? tv_pairs[1] : 0; }
		src.inflection_point = function(t) { return undefined; }
	    } else {
		src.value = function(t) { // closure
		    if (repeat)
			// make time periodic if values are to be repeated
			t = Math.fmod(t,tv_pairs[nvals-2]);
		    var last_t = tv_pairs[0];
		    var last_v = tv_pairs[1];
		    if (t > last_t) {
			var next_t,next_v;
			for (var i = 2; i < nvals; i += 2) {
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
		}
		src.inflection_point = function(t) {  // closure
		    var t_off = 0.0;
		    if (repeat) {
			// make time periodic if values are to be repeated
			rq = Math.fmod2(t,tv_pairs[nvals-2]);
			t = rq[0];  // First arg is remainder (mod)
			t_off = rq[1]  // Original t = rq[0] + rq[1].
		    } 

		    for (var i = 0; i < nvals; i += 2) {
			var next_t = tv_pairs[i];
			if (t < next_t) return (t_off + next_t);
		    }
		    return undefined;
		}
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
	}

	Math.fmod2 = function(numerator,denominator) {
	    var quotient = Math.floor(numerator/denominator);
	    return [numerator - quotient*denominator, quotient*denominator];
	}

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
	}

	// Source voltage added to b.
        VSource.prototype.load_dc = function(ckt,soln,rhs) {
	    ckt.add_to_rhs(this.branch,this.src.dc,rhs);  
	}

	// Load time-dependent value for voltage source for tran
        VSource.prototype.load_tran = function(ckt,soln,crnt,chg,time) {
	    ckt.add_to_rhs(this.branch,this.src.value(time),crnt);  
	}

	// return time of next breakpoint for the device
	VSource.prototype.breakpoint = function(time) {
	    return this.src.inflection_point(time);
	}

	// small signal model ac value
        VSource.prototype.load_ac = function(ckt,rhs) {
	    ckt.add_to_rhs(this.branch,1.0,rhs);
	}

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
	}

	// load linear system equations for dc analysis
	ISource.prototype.load_dc = function(ckt,soln,rhs) {
	    var is = this.src.dc;

	    // MNA stamp for independent current source
	    ckt.add_to_rhs(this.npos,-is,rhs);  // current flow into npos
	    ckt.add_to_rhs(this.nneg,is,rhs);   // and out of nneg
	}

	// load linear system equations for tran analysis (just like DC)
        ISource.prototype.load_tran = function(ckt,soln,crnt,chg,time) {
	    var is = this.src.value(time);

	    // MNA stamp for independent current source
	    ckt.add_to_rhs(this.npos,-is,crnt);  // current flow into npos
	    ckt.add_to_rhs(this.nneg,is,crnt);   // and out of nneg
	}

	// return time of next breakpoint for the device
	ISource.prototype.breakpoint = function(time) {
	    return this.src.inflection_point(time);
	}

	// small signal model: open circuit
        ISource.prototype.load_ac = function(ckt,rhs) {
	    // MNA stamp for independent current source
	    ckt.add_to_rhs(this.npos,-1.0,rhs);  // current flow into npos
	    ckt.add_to_rhs(this.nneg,1.0,rhs);   // and out of nneg
	}

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
	}

	Resistor.prototype.load_dc = function(ckt) {
	    // Nothing to see here, move along.
	}

	Resistor.prototype.load_tran = function(ckt,soln,crnt) {
	}

	Resistor.prototype.load_ac = function(ckt) {
	}

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
     

	function Diode(n1,n2,area,is,vt,type) {
	    Device.call(this);
	    this.anode = n1;
	    this.cathode = n2;
	    this.area = area;
	    this.type = type;  // 'normal' or 'ideal'
	    this.is = is;
	    this.ais = this.area * this.is;
	    this.vt = (type == 'normal') ? vt : 0.1e-3;  // 26mv or .1mv
	}
	Diode.prototype = new Device();
        Diode.prototype.constructor = Diode;

        Diode.prototype.load_linear = function(ckt) {
	    // Diode is not linear, has no linear piece.
	}

        Diode.prototype.load_dc = function(ckt,soln,rhs) {
	    var vd = ckt.get_two_terminal(this.anode, this.cathode, soln);
            var IdGd = diodeEval(vd, this.vt, this.ais)
 	    // MNA stamp for independent current source
	    ckt.add_to_rhs(this.anode,-IdGd[0],rhs);  // current flows into anode
	    ckt.add_to_rhs(this.cathode,IdGd[0],rhs);   // and out of cathode
	    ckt.add_conductance(this.anode,this.cathode,IdGd[1]);
	}

        Diode.prototype.load_tran = function(ckt,soln,crnt,chg,time) {
	    this.load_dc(ckt,soln,crnt);
	}

	Diode.prototype.load_ac = function(ckt) {
	}


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
	    ckt.add_capacitance_l(this.n1,this.n2,this.value);
	}

	Capacitor.prototype.load_dc = function(ckt,soln,rhs) {
	}

	Capacitor.prototype.load_ac = function(ckt) {
	}

	Capacitor.prototype.load_tran = function(ckt) {
	}

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
	    ckt.add_to_Cl(this.branch,this.branch,this.value)
	}

	Inductor.prototype.load_dc = function(ckt,soln,rhs) {
	    // Inductor is a short at dc, so is linear.
	}

	Inductor.prototype.load_ac = function(ckt) {
	}

	Inductor.prototype.load_tran = function(ckt) {
	}

	///////////////////////////////////////////////////////////////////////////////
	//
	//  Simple Voltage-Controlled Voltage Source Op Amp model - ideal
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
	//  Simple Voltage-Controlled Voltage Source Op Amp model - realistic
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
        Opamp2.prototype.constructor = Opamp2;
        
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
	}

	Opamp2.prototype.load_dc = function(ckt,soln,rhs) {
	    var nP = this.nP;
	    var nN = this.nN;
	    var nInt = this.nInt
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
			//var nS = (iInt>0) ? nP : nN;	//out->nN or nP->out
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
			var iOut = gO*vInPiNo
			var nS = (iOut<0) ? this.nN : this.nP;//out->nN or nP->out
			ckt.add_to_rhs(nO,iOut,rhs); 
			ckt.add_to_rhs(nS,-iOut,rhs); 
			ckt.add_to_G(nO,nO,gO);
			ckt.add_to_G(nS,nO,-gO);
			ckt.add_to_G(nO,this.nInt,-gO);
			ckt.add_to_G(nS,this.nInt,gO);
	    }
	}

	Opamp2.prototype.load_ac = function(ckt) {
	}

	Opamp2.prototype.load_tran = function(ckt,soln,crnt,chg,time) {
	    this.load_dc(ckt,soln,crnt);
	}

	///////////////////////////////////////////////////////////////////////////////
	//
	//  Two Port: A * I = B * V
	//
	///////////////////////////////////////////////////////////////////////////////


        function Twoport(n1p,n1m,n2p,n2m,ni1,ni2,A11,A12,A21,A22,B11,B12,B21,B22,name) {

	    Device.call(this);
	    this.n1p = n1p;
	    this.n1m = n1m;
	    this.n2p = n2p;
	    this.n2m = n2m;
	    this.ni1 = ni1;
	    this.ni2 = ni2;

	    this.A11 = A11;
	    this.A12 = A12;
	    this.A21 = A21;
	    this.A22 = A22;

	    this.B11 = B11;
	    this.B12 = B12;
	    this.B21 = B21;
	    this.B22 = B22;

	    this.name = name;
	}

	Twoport.prototype = new Device();
        Twoport.prototype.constructor = Twoport;
        
        Twoport.prototype.load_linear = function(ckt) {
            // MNA stamp Port1: A11*i1 + A12*i2 = B11*v1 + B12*v2
            // MNA stamp Port2: A21*i1 + A22*i2 = B21*v1 + B22*v2

	    //Port 1
	    ckt.add_to_Gl(this.n1p,this.ni1,-1.0);
	    ckt.add_to_Gl(this.n1m,this.ni1,1.0);
	    ckt.add_to_Gl(this.ni1,this.ni1,this.A11);
	    ckt.add_to_Gl(this.ni1,this.ni2,this.A12);
	    ckt.add_to_Gl(this.ni1,this.n1p,this.B11);
	    ckt.add_to_Gl(this.ni1,this.n1m,-this.B11);
	    ckt.add_to_Gl(this.ni1,this.n2p,this.B12);
	    ckt.add_to_Gl(this.ni1,this.n2m,-this.B12);

	    //Port 2
	    ckt.add_to_Gl(this.n2p,this.ni2,-1.0);
	    ckt.add_to_Gl(this.n2m,this.ni2,1.0);
	    ckt.add_to_Gl(this.ni2,this.ni2,this.A22);
	    ckt.add_to_Gl(this.ni2,this.ni1,this.A21);
	    ckt.add_to_Gl(this.ni2,this.n1p,this.B21);
	    ckt.add_to_Gl(this.ni2,this.n1m,-this.B21);
	    ckt.add_to_Gl(this.ni2,this.n2p,this.B22);
	    ckt.add_to_Gl(this.ni2,this.n2m,-this.B22);
	}

	Twoport.prototype.load_dc = function(ckt,soln,rhs) {
	}

	Twoport.prototype.load_ac = function(ckt) {
	}

	Twoport.prototype.load_tran = function(ckt,soln,crnt,q,tNow) {
	}


	///////////////////////////////////////////////////////////////////////////////
	//
	//  Transmission Line
	//
	///////////////////////////////////////////////////////////////////////////////

        function Tline(n1p,n1m,n2p,n2m,ni1to2,ni2to1,z0,tD,Rwire,name) {
	    Device.call(this);
	    this.n1p = n1p;
	    this.n1m = n1m;
	    this.n2p = n2p;
	    this.n2m = n2m;
	    this.ni1to2 = ni1to2;
	    this.ni2to1 = ni2to1;
	    this.indTback = 0;
	    this.z0 = z0;
	    this.tD = tD;
	    this.Rwire = Rwire;
	    this.name = name;
	}


	Tline.prototype = new Device();
        Tline.prototype.constructor = Tline;
        
        Tline.prototype.load_linear = function(ckt) {
            // MNA stamp Port1: i1 = Y0*(v(n1p) - v(n1m)) - i2to1(t-tD)
            // MNA stamp Port2: i2 = Y0*(v(n2p) - v(n2m)) - i1to2(t-tD)
            // MNA stamp branch1: i1to2 = 2*Y0*(v(n1p) - v(n1m)) - i2to1(t-tD)
            // MNA stamp branch2: i2to1 = 2*Y0*(v(n2p) - v(n2m)) - i1to2(t-tD)
	    var Y0 = 1.0/this.z0;

	    //Port 1
	    ckt.add_conductance_l(this.n1p,this.n1m,Y0);
	    ckt.add_to_Gl(this.ni1to2,this.ni1to2,1.0);
	    ckt.add_to_Gl(this.ni1to2,this.n1p,2*Y0);
	    ckt.add_to_Gl(this.ni1to2,this.n1m,-2*Y0);

	    //Port 2
	    ckt.add_conductance_l(this.n2p,this.n2m,Y0);
	    ckt.add_to_Gl(this.ni2to1,this.ni2to1,1.0);
	    ckt.add_to_Gl(this.ni2to1,this.n2p,2*Y0);
	    ckt.add_to_Gl(this.ni2to1,this.n2m,-2*Y0);

	    //Conductance of tline wire.
	    ckt.add_conductance_l(this.n1m,this.n2m,1.0/this.Rwire);
	}

        Tline.prototype.load_gen = function(ckt,rhs,D,i2to1,i1to2) {
	    // Load transfer for line.
	    ckt.add_to_rhs(this.n1p,-i2to1,rhs);  // no delay
	    ckt.add_to_rhs(this.n1m,i2to1,rhs);  // no delay
	    ckt.add_to_rhs(this.ni1to2,-i2to1,rhs);
	    ckt.add_to_G(this.n1p,this.ni2to1,D);
	    ckt.add_to_G(this.n1m,this.ni2to1,-D);
	    ckt.add_to_G(this.ni1to2,this.ni2to1,D);
	    
	    ckt.add_to_rhs(this.n2p,-i1to2,rhs);  // no delay
	    ckt.add_to_rhs(this.n2m,i1to2,rhs);  // no delay
	    ckt.add_to_rhs(this.ni2to1,-i1to2,rhs);
	    ckt.add_to_G(this.n2p,this.ni1to2,D);
	    ckt.add_to_G(this.n2m,this.ni1to2,-D);
	    ckt.add_to_G(this.ni2to1,this.ni1to2,D);
	}

	Tline.prototype.load_dc = function(ckt,soln,rhs) {
	    // Transmission line dc, no delay.
	    var D = 1.0;
	    var i2to1 = D*soln[this.ni2to1]; 
	    var i1to2 = D*soln[this.ni1to2]; 
            this.load_gen(ckt,rhs,D,i2to1,i1to2);
	}

	Tline.prototype.load_ac = function(ckt) {
	}

	Tline.prototype.load_tran = function(ckt,soln,crnt,q,tNow) {

	    var times = ckt.responses[ckt.N];
	    var i2to1t = ckt.responses[this.ni2to1];
	    var i1to2t = ckt.responses[this.ni1to2];
	    var tBack = tNow - this.tD;

	    var i2to1 = soln[this.ni2to1]; 
	    var i1to2 = soln[this.ni1to2]; 
	    var D = 0.0;  // Derivative with respect to solution
	    
	    if (times.length > 0) {
		if (tBack < times[0]) {  // tBack before start.
		    i2to1 = i2to1t[0]; 
		    i1to2 = i1to2t[0]; 
		} else {  // Interpolate at tBack.
		    var tPrev = times[times.length-1];
		    if (tBack > tPrev) {  // back time after last step
			var ca = (tBack - tPrev)/(tNow - tPrev);
			i2to1 = ca*i2to1 + (1-ca)*i2to1t[i2to1t.length-1];
			i1to2 = ca*i1to2 + (1-ca)*i1to2t[i1to2t.length-1];
			D = ca;
		    } else { // back time before last step, deriv = 0;
			var ind = this.indTback;  // Cached index
			if (times[ind] > tBack) {
			    for (ind--; times[ind] > tBack; ind--);
			} else {
			    for (; times[ind+1] < tBack; ind++);
			}
			this.indTback = ind;
			tPrev = times[ind];
			var ca = (tBack-tPrev)/(times[ind+1] -  tPrev);
			i2to1 = ca*i2to1t[ind+1] + (1-ca)*i2to1t[ind];
			i1to2 = ca*i1to2t[ind+1] + (1-ca)*i1to2t[ind];
		    } 
		}
	    }
            this.load_gen(ckt,crnt,D,i2to1,i1to2);
	}

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
	    if (type != 'n' && type != 'p')
	    { throw 'BJT type is not npn or pnp';
	    }
	    this.type_sign = (type == 'n') ? 1 : -1;
	    this.vt = 0.026
	    this.leakCond = 1.0e-12;
	}
	bjt.prototype = new Device();
        bjt.prototype.constructor = bjt;

        bjt.prototype.load_linear = function(ckt) {
	    // bjt's are nonlinear, just like javascript progammers
	}


        bjt.prototype.load_dc = function(ckt,soln,rhs) {
	    e = this.e; b = this.b; c = this.c;
	    var vbc = this.type_sign * ckt.get_two_terminal(b, c, soln);
	    var vbe = this.type_sign * ckt.get_two_terminal(b, e, soln);
            var IrGr = diodeEval(vbc, this.vt, this.aIcs);
            var IfGf = diodeEval(vbe, this.vt, this.aIes);
            // Sign convention is emitter and collector currents are leaving.
            ie = this.type_sign * (IfGf[0] - this.ar*IrGr[0]);
            ic = this.type_sign * (IrGr[0] - this.af*IfGf[0]);
            ib = -(ie+ic);  // Current flowing out of base
	    ckt.add_to_rhs(b,ib,rhs);  //current flowing out of base
	    ckt.add_to_rhs(c,ic,rhs);  //current flows out of the collector
	    ckt.add_to_rhs(e,ie,rhs);   // and out the emitter
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
	}

        bjt.prototype.load_tran = function(ckt,soln,crnt,chg,time) {
	    this.load_dc(ckt,soln,crnt,crnt);
	}

	bjt.prototype.load_ac = function(ckt) {
	}


	///////////////////////////////////////////////////////////////////////////////
	//
	//  Simplified MOS FET with no bulk connection and no body effect.
	//
	///////////////////////////////////////////////////////////////////////////////

    function Fet(d,g,s,ratio,Vt,lambda,name,type) {
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
	    this.vt = Vt;
	    if (Vt == null) {this.vt = 0.5;}			//default
	    if (Vt < 0) {this.vt = 0;}
	    this.lambda = lambda;
	    if (lambda == null) {this.lambda = 0.05;}	//default
	    if (lambda < 0) {this.lambda = 0;}
	    this.kp = 20e-6;
        this.beta = this.kp * this.ratio;
	}
	Fet.prototype = new Device();
        Fet.prototype.constructor = Fet;

        Fet.prototype.load_linear = function(ckt) {
	    // FET's are nonlinear, just like javascript progammers
	}

        Fet.prototype.load_dc = function(ckt,soln,rhs) {
	    var vds = this.type_sign * ckt.get_two_terminal(this.d, this.s, soln);
	    if (vds < 0) { // Drain and source have swapped roles
		var temp = this.d;
		this.d = this.s;
		this.s = temp;
		vds = this.type_sign * ckt.get_two_terminal(this.d, this.s, soln);
	    }
	    var vgs = this.type_sign * ckt.get_two_terminal(this.g, this.s, soln);
	    var vgst = vgs - this.vt;
	    with (this) {
		var gmgs,ids,gds;
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
		    ckt.add_to_rhs(d,-ids,rhs);  // current flows into the drain
		    ckt.add_to_rhs(s, ids,rhs);   // and out the source		    
		    ckt.add_conductance(d,s,gds);
		    ckt.add_to_G(s,s, gmgs);
		    ckt.add_to_G(d,s,-gmgs);
		    ckt.add_to_G(d,g, gmgs);
		    ckt.add_to_G(s,g,-gmgs);
		}
	    }
	}

        Fet.prototype.load_tran = function(ckt,soln,crnt,chg,time) {
	    this.load_dc(ckt,soln,crnt,crnt);
	}

	Fet.prototype.load_ac = function(ckt) {
	}

//////////////////////////////////////////////////////////////////////////////
//
//  Circuit simulator fet_vs model
//
//////////////////////////////////////////////////////////////////////////////

// Copyright (C) 2011 Massachusetts Institute of Technology


// create a circuit for simulation using "new cktsim.Circuit()"

// VS Model adapted from Matlab (Lan Wei and Dimitri Antoniadis).

	///////////////////////////////////////////////////////////////////////////////
	//
	//  VS MOS FET with no bulk connection and no body effect.
	//
	///////////////////////////////////////////////////////////////////////////////

        // Every instance of an FET holds its entire model, was in a hurry.
        function Fet_vs(d,g,s,b,W,dVt,name,type,ckt) {
	    Device.call(this);
	    // Drain, Gate, Source, Bulk indices 
	    this.D=0;
	    this.G=1;
	    this.B=2;
	    this.S=3; 

	    // External Charge indices
	    this.DQ=4;
	    this.SQ=5;

	    // External Node indices
	    this.DE=6;
	    this.SE=7;

	    this.name = name;
	    if (type != 'n_vs' && type != 'p_vs') {
		throw 'fet type is not n_vs or p_vs';
	    }
	    this.type_sign = (type == 'n_vs') ? 1 : -1; // 1 for n, -1 for p
	    this.parms = (type == 'n_vs') ? this.parmsBoth.n : this.parmsBoth.p;
	    this.W = (W * this.parms.Wscale)*1.0e-4; // Width scaled um -> cm
	    var absVt0 = Math.abs(this.parms.Vt0);
	    if (Math.abs(dVt) > 0.5*absVt0) {
		alert("(Fet Vt0 Delta="+dVt+") > 1/2 (|Vt0|=" + absVt0 + ")");
	    }

	    // Internal nodes for source and drain resistors.
	    var d_int = d, s_int = s;
	    if (this.parms.Ry != 0.0) d_int = ckt.node(name+'d_int',T_VOLTAGE);
	    if (this.parms.Rx != 0.0) s_int = ckt.node(name+'s_int',T_VOLTAGE);

	    // Fill in device node array
	    this.nodes = [];
	    this.nodes[this.D] = d_int;
	    this.nodes[this.G] = g;
	    this.nodes[this.B] = b;
	    this.nodes[this.S] = s_int;
	    this.nodes[this.SQ] = s_int;  // set to 's' for chg on external.
	    this.nodes[this.DQ] = d_int;  // set to 'd' for chg on external.
	    this.nodes[this.DE] = d;
	    this.nodes[this.SE] = s;

	    // Finally, store the delta_v
	    this.dVt = dVt;
	}

	Fet_vs.prototype = new Device();
        Fet_vs.prototype.constructor = Fet_vs;
        Fet_vs.prototype.parmsBoth = new Fet_vs_parms();

        Fet_vs.prototype.load_linear = function(ckt) {
	    var Dn = this.nodes[this.D], DEn = this.nodes[this.DE];
	    var Sn = this.nodes[this.S], SEn = this.nodes[this.SE];

	    // MNA stamp for admittance for linear source and drain resistors
	    if (Sn != SEn) {
		ckt.add_conductance_l(SEn,Sn, (this.W/this.parms.Rx));
	    }
	    if (Dn != DEn) {
		ckt.add_conductance_l(DEn,Dn, (this.W/this.parms.Ry));
	    }
	    // MNA stamp for linear caps, attached to External nodes
	    var Gn = this.nodes[this.G]; // Gate node

	    var SQn = this.nodes[this.SQ];
	    var cgso = this.W * this.parms.Cgso;
	    ckt.add_capacitance_l(Gn, SEn, cgso);

	    var DQn = this.nodes[this.DQ];
	    var cgdo = this.W * this.parms.Cgdo;
	    ckt.add_capacitance_l(Gn, DEn, cgdo);
	}

        // Function is sqrt(x) for x>1e-6, and goes smoothly to 0 as x -> -inf
        // Needed for functions like sqrt(phi-vbs) when vbs > phi-1.0e-6.
        // Not C-infinity, uses an if.
        Fet_vs.prototype.smoothsqrt = function(x, doderiv) {
	    // If x == 1e-6, sqrt(x) = 1.0e-3, dsqrtxdx = 500
	    var f, df;
	    if (x > 1.0e-6) {
		f = Math.sqrt(x);
		df = 0.5/f;
	    } else {
		f = 1.0e-3*Math.exp(5e5*(x - 1.0e-6));
		df = 5e5*f;
	    }
	    if (!doderiv)
		var val = f;
	    else 
		var val = [f,df];
	    return val;
	}
	
        // Loads up the rhs and Jacobian for fet model.  Makes very 
        // few assumptions abot the model equations, even used F-D if
        // Model does not return derives (detected by returned vector 
        // instead of matrix.
        Fet_vs.prototype.fet_loader = function(ckt,soln,crnt,do_chg,chg) {
	    var D=this.D,G=this.G,B=this.B,S=this.S,DQ=this.DQ,SQ=this.SQ;
	    var nds = this.nodes.slice(); // Force copy of nodes for swapping
	    var Vds = this.type_sign*ckt.get_two_terminal(nds[D],nds[S],soln);
	    if (Vds < 0) { // Drain and source have swapped roles
		nds[S] = this.nodes[D];
		nds[D] = this.nodes[S];
		nds[SQ] = this.nodes[DQ]; // Swap nodes used for charge
		nds[DQ] = this.nodes[SQ];
		Vds =  this.type_sign*ckt.get_two_terminal(nds[D],nds[S],soln);
	    } 
	    var Vgs = this.type_sign*ckt.get_two_terminal(nds[G],nds[S],soln);
	    var Vbs = this.type_sign*ckt.get_two_terminal(nds[B],nds[S],soln);
	    var V = [];

	    V[D] = Vds;
	    V[G] = Vgs;
	    V[B] = Vbs;
	    V[S] = 0;

	    // Instrinsic model equation routine, assume vds > 0, nfet model.
	    // Type and direction issues handled here, NOT in FET_VS_IDSQ!
	    var R = Fet_vs_idsq(this, V, do_chg);
	    var Nom = [];
	    if (typeof(R[0]) == "object") { // We have derivatives
		// Copy values of first column (crnts &chgs) in to Nom
		have_derivs = true;
		for (var i = R.length-1; i >= 0; i--)
		Nom[i] = R[i][0];  // First row is crnt, then four chgs.
	    } else {
		have_derivs = false;
		Nom = R;
	    }

        ckt.add_to_rhs(nds[D],-this.type_sign*Nom[0],crnt);//-i out of drn
	    ckt.add_to_rhs(nds[S], this.type_sign*Nom[0],crnt);//+i in to src
   
	    // Deal with charges if flag says to.
	    if (do_chg == true)  {
		var Q = Nom.slice(1);
		var ndsq = nds.slice(); ndsq[D]=nds[DQ]; ndsq[S]=nds[SQ];
		for (var i = Q.length-1; i >= 0; i--)
		    ckt.add_to_rhs(ndsq[i],this.type_sign*Q[i],chg);
	    }

	    // Enter Jacobian in to system on column at a time. Use derivatives
	    // if given, or compute them using centered finite diff derivs 
	    // (but don't let Vds go neg, so use a one-side 2nd order formula).
	    for (i=2; i>=0; i--) {
		var Deriv = [];
		if (have_derivs == true) {
		    for (var j = R.length-1; j >= 0; j--)
			Deriv[j] = R[j][i+1];  // dfdx, row is f, col+1 is x.
		} else { //   // Perturb by Vbs,Vgs,or Vds depending on i.
		    var hdv = this.parms.perturbv;
		    var vnom = V[i];
		    V[i] = vnom + 0.5*hdv;
		    var Rp = Fet_vs_idsq(this, V, do_chg);
		    V[i] = vnom - 0.5*hdv;
		    if (V[D] >= 0) { // dy(v)/dx ~ (y(v+hdv/2)-y(v-hdv/2))/hdv
			var Rm = Fet_vs_idsq(this, V, do_chg);
			for (j=Rm.length-1; j >= 0; j--)
			    Deriv[j] = (Rp[j] - Rm[j])/hdv;
		    } else { //dy(v)/dv~(y(v+dv/4)-(3y(v)+y(v+dv/2))/4)/(dv/8)
			V[i] = vnom + 0.25*hdv;
			var Rm = Fet_vs_idsq(this, V, do_chg); 
			for (j=Rp.length-1; j >= 0; j--)
			    Deriv[j] = (8.0*Rm[j]-(6.0*Nom[j]+2.0*Rp[j]))/hdv;
		    }
		    V[i] = vnom;  // Restore V to nominal for next pass.
		}
		var dIds = Deriv[0];
		ckt.add_to_G(nds[D],nds[i],dIds);
		ckt.add_to_G(nds[S],nds[i],-dIds);
		ckt.add_to_G(nds[D],nds[S],-dIds);
		ckt.add_to_G(nds[S],nds[S],dIds);
		if (do_chg == true) {
		    var QDeriv = Deriv.slice(1);
		    for (j=QDeriv.length-1; j >= 0; j--) { //d/dv Qs,Qb,Qg,Qd
			var dq = QDeriv[j];
			ckt.add_to_C(ndsq[j],nds[i],dq);
			ckt.add_to_C(ndsq[j],nds[S],-dq);
		    }
		}
	    }
	}

        Fet_vs.prototype.load_dc = function(ckt,soln,rhs) {
            this.fet_loader(ckt,soln,rhs,false) 
	}

        Fet_vs.prototype.load_tran = function(ckt,soln,crnt,chg) {
	    this.fet_loader(ckt,soln,crnt,true,chg);
	}

	Fet_vs.prototype.load_ac = function(ckt) {
	}




	///////////////////////////////////////////////////////////////////////////////
	//
	//  Module definition
	//
	///////////////////////////////////////////////////////////////////////////////
	var module = {
	    'Circuit': Circuit,
	    'parse_number': parse_number,
	    'parse_number_alert': parse_number_alert,
	    'parse_source': parse_source,
	}
	return module;
    }());
