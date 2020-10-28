//////////////////////////////////////////////////////////////////////////////
//
//  Circuit simulator fet_vs equations with analytic derivatives
//
//////////////////////////////////////////////////////////////////////////////

// Copyright (C) 2012 Massachusetts Institute of Technology


// VS Model adapted from Matlab (Lan Wei and Dimitri Antoniadis).

// Note, evaluate as if an N-type intrinsic device with Vds > 0, type and
// Ids direction correction handled in calling routine.
// Smoothsqrt is used to avoid arg near zero (infinite slope) or neg (complex).
function Fet_vs_idsq(device, V, doq) {

    // Vgs-vt, vt increased by body effect, decreased by dibl.
    // Body effect (e.g. SH. Shichman, D. A. Hodges, Modeling and
    // Simulation of Insulated-Gate Field-Effect Transistor Circuits,
    // IEEE J. of Solid-State Circuits, vol. SC-3, no. 3, Sept. 1968.
    // Dibl effect, Khakifirooz (3).
    var D=device.D, G=device.G, B=device.B, S=device.S;
    var Vt0p = device.parms.Vt0 + device.dVt;

    with(device.parms) {
	var Vds = V[D];
	var Vgs = V[G];
	var Vbs = V[B];	
	var fdf = device.smoothsqrt(phib-Vbs,true); // Ask for deriv
	var sqrtpmv = fdf[0];
	var dsqrtpmvdarg = fdf[1];
	var Vt0bs = Vt0p + gamma*(sqrtpmv-sqrtphib)
	var vgst = Vgs - (Vt0bs - dvgstdvds*Vds);
	var dsqrtpmvdvbs = -dsqrtpmvdarg;
	var dvgstdvbs = -gamma * dsqrtpmvdvbs;
	// dvgstdvgs = 1

	// Carrier vel with transition from weak inversion (vxo/rv) 
	// to strong (vxo) (reference needed). If rv=1, vx0/rv = vxo, no
	// velocity adjustment 
	var expetafv = Math.exp((vgst - 0.5*zeta*zeta*phit)/(zeta*phit));
	var FFv=1 / (1+expetafv);
	var vx0 = vxo - vxofrac * FFv;  

	var dvx0dvgs = (vxofrac/(zeta*phit))*expetafv*(FFv*FFv); 	
	// dvx0dvgs = dvx0vgst
	var dvx0dvds = dvx0dvgs * dvgstdvds;
	var dvx0dvbs = dvx0dvgs * dvgstdvbs;

	// Fsub drops from 1->0 as vgst rises from below zero to just
	// above (subthresh) Fsub is ~1 vgs-vt << -aphit/2 and 
	// is ~0 vgs-vt >> aphit/2, Khakifirooz, (4)
	var expetafs = Math.exp((vgst + 0.5*aphit)/aphit);
	var Fsub = 1/(1+expetafs);
	
	var dFsubdvgst = -expetafs*(Fsub*Fsub)/aphit;
	
	// Source chg/unit w, eta and Qinv from Khakifirooz (2), 
	// Vds variation of n needs ref. Note if nd=0, nphit = n0*phit.
	var n = (n0 + nd*Vds);
	var nphit = n*phit;  // Reference needed
	var eta = (vgst + Fsub*aphit)/nphit;
	var expeta = Math.exp(eta);
	var logexpeta = Math.log(1+expeta);
	var Qinv = Cg*nphit*logexpeta;

	var dnphitdvds = nd*phit;
	var dlogexpetadeta = expeta / (1 + expeta);	
	var dQinvdeta = Cg * nphit * dlogexpetadeta;
	var detadvgst = (1+aphit*dFsubdvgst)/nphit;
	var detadvds = detadvgst*dvgstdvds - dnphitdvds * eta / nphit;
	var dQinvdvgs = dQinvdeta*detadvgst;
	var dQinvdvbs = dQinvdvgs*dvgstdvbs;
	var dQinvdvds = dQinvdeta* detadvds + Cg * logexpeta * dnphitdvds;
	
	// Fsat models saturation effects, ~1 when 
	// vds >> vdsat, ->0 as vds -> 0.
	// Khakifirooz, (8), (9), (10) (and post eqn text), then (6).
	var vdsat = vel2v * vx0 * (1-Fsub) + phit*Fsub;
	var vsratio = Vds/vdsat;
	var vsbeta = 1+Math.pow(vsratio,beta);
	var vsbetabeta = Math.pow(vsbeta,(1/beta));
	var Fsat = vsratio/vsbetabeta;

	var dFsatdv_r = 1/(vsbetabeta*vsbeta);
	var dv_rdvgst = (vel2v*vx0-phit)*(vsratio/vdsat)*dFsubdvgst;
	var dFsatdvgs = dFsatdv_r * dv_rdvgst;
	var dFsatdvbs = dFsatdv_r * dv_rdvgst * dvgstdvbs;
	var dFsatdvds = dFsatdv_r*(Vds*dv_rdvgst*dvgstdvds + 1.0/vdsat);

	// Ids is width * (src chg/unit width) * vel * Fsat, where
	// velocity (vx0) and q/width (Qinv) are complicated functions
	// of terminal v's. Khakifirooz, (5)
	var Ids = device.W*Qinv*vx0*Fsat;
	var dIdsdvds = device.W
	    * (Qinv*vx0*dFsatdvds + Qinv*dvx0dvds*Fsat +dQinvdvds*vx0*Fsat);
	var dIdsdvgs = device.W
	    * (Qinv*vx0*dFsatdvgs + Qinv*dvx0dvgs*Fsat + dQinvdvgs*vx0*Fsat);
	var dIdsdvbs = device.W
	    * (Qinv*vx0*dFsatdvbs + Qinv*dvx0dvbs*Fsat + dQinvdvbs*vx0*Fsat);

	if (doq == true) {
	// Pass back Qd, Qg, and Qb with sensitivities to vds,vgs and vbs.
	    // Nonlinear Charge calculation.  Intrinsic charges adapted from 
	    // classical expressions for Qs and Qd [E.g. Tsividis Book]
	    var sag = sqrtpmv + 0.5*gamma;
	    var scale = sqrtpmv / sag;
	    var Va = nphit * logexpeta * scale;
	    var Vsatq = Math.sqrt(9*phit*phit + Va * Va); // arg > 0 always
	    var Vdr = Vds / Vsatq;
	    var vdrbq = (1+ Math.pow(Vdr,betaq));
	    var vdrbqbq = Math.pow(vdrbq,(1/betaq));
	    var x = 1 - Vdr /vdrbqbq;

	    var dvadvds = scale
		* (dnphitdvds*logexpeta + nphit*dlogexpetadeta*detadvds);
	    var dvadvgst = nphit*scale*dlogexpetadeta*detadvgst;
	    var dvadsqrtpmv = 0.5*gamma*(nphit*logexpeta)/(sag*sag);
	    var dvadvbs = dvadvgst*dvgstdvbs + dvadsqrtpmv*dsqrtpmvdvbs;

	    var dvdrdva = -(Vdr/Vsatq)*(Va/Vsatq);
	    var dvdrdvds = 1/Vsatq + dvdrdva*dvadvds;
	    var dxdvdr = -1/(vdrbqbq*vdrbq);
	    var dxdvds = dxdvdr*dvdrdvds;
	    var dxdvgs = dxdvdr*dvdrdva*dvadvgst;
	    var dxdvbs = dxdvdr*dvdrdva*dvadvbs;

	    //////   original qs, qd model, from Tsividis
	    //     qi=2/3*(1+x+x.^2)./(1+x);
	    var den=15*((1+x)*(1+x));
	    var qs = (((4*x+8)*x+12)*x+6)/den;
	    var qdp = (((6*x+12)*x+8)*x+4)/den;
	    var ddz = den * (x+1);
	    var dqsdx = 4.0/15.0-(8*x+4)/ddz;
	    var dqdpdx = 0.4-(2*x+6)/ddz;


	    // DIBL effect on drain charge. Calculate dQinv at virtual source 
	    // due to DIBL only.  Then correct the qd factor to reflect this 
	    // change in channel charge change due to Vd
	    //logexpetai = log(1+exp((Vgs - Vt0bs + Fsub*aphit)./nphit));
	    var deta = -(dvgstdvds*Vds)/nphit;
	    var expdeta = Math.exp(deta);
	    var logexpetai = Math.log(1+expeta*expdeta);
	    var etaetair = 1 - logexpetai / logexpeta;
	    var qd = qdp + x * (qs+qdp) * (Fsub-1) * etaetair;

	    var ddetadvds = (-deta*dnphitdvds - dvgstdvds)/nphit;
	    var dlogexpetaiddeta = (expeta*expdeta)/(1+expeta*expdeta);
	    var dlogexpetaideta = dlogexpetaiddeta;
	    var detaetairdeta = ((logexpetai/logexpeta)*dlogexpetadeta
				 - dlogexpetaideta)/logexpeta;
	    var detaetairddeta = -dlogexpetaiddeta/logexpeta;

	    var dqddx = dqdpdx + (x*(dqsdx+dqdpdx)+(qs+qdp))*(Fsub-1)*etaetair;
	    var dqddFsub = x * (qs+qdp) * etaetair;
	    var dqddetaetair = x * (qs+qdp) * (Fsub-1);

	    var dqddvds = dqddx*dxdvds + dqddFsub*dFsubdvgst*dvgstdvds 
		+ dqddetaetair*(detaetairddeta*ddetadvds+detaetairdeta*detadvds);
	    var dqddvgs = dqddx*dxdvgs + dqddFsub*dFsubdvgst 
		+ dqddetaetair*detaetairdeta*detadvgst;
	    var dqddvbs = dqddx*dxdvbs + dqddFsub*dFsubdvgst*dvgstdvbs 
		+ dqddetaetair*detaetairdeta*detadvgst*dvgstdvbs;

	    // Inversion charge partitioning to internal terminals s and d
	    var Qinvs = LgmdLg * Qinv * qs;
	    var Qinvd = LgmdLg * Qinv * qd;

	    var dQinvsdvds = LgmdLg*(dQinvdvds * qs + Qinv * dqsdx * dxdvds);
	    var dQinvsdvgs = LgmdLg*(dQinvdvgs * qs + Qinv * dqsdx * dxdvgs);
	    var dQinvsdvbs = LgmdLg*(dQinvdvbs * qs + Qinv * dqsdx * dxdvbs);

	    var dQinvddvds = LgmdLg * (dQinvdvds * qd + Qinv * dqddvds);
	    var dQinvddvgs = LgmdLg * (dQinvdvgs * qd + Qinv * dqddvgs);
	    var dQinvddvbs = LgmdLg * (dQinvdvbs * qd + Qinv * dqddvbs);

	    // Yet another nonlinear charge
	    var fdf = device.smoothsqrt(phib-(Vbs-Vds),true);
	    var sqrtpmvbd = fdf[0];
	    var dsqrtpmvbddvbs = -fdf[1];
	    var dsqrtpmvbddvds = fdf[1];

	    var Vt0bd = Vt0p + gamma*(sqrtpmvbd-sqrtphib);
	    var Voff = Vds * dvgstdvds * (1-x) + 0.5*aphit;
	    var nphits = 1.1 * nphit;
	    var dnphitsdvds = 1.1*dnphitdvds;
	    var Vgd = Vgs - Vds; // Voltages referred to the drain
	    var etas = (Vgs+Voff-Vt0bs)/nphits;
	    var etad = (Vgd+Voff-Vt0bd)/nphits;
	    var expetas = Math.exp(etas);
	    var expetad = Math.exp(etad);
	    var logexpetas = Math.log(1+expetas);
	    var logexpetad = Math.log(1+expetad);
	    var vgsmFF = nphit*logexpetas;
	    var vgdmFF = nphit*logexpetad;
	    var CC=3e-13; // Temporary - allows Vg dep of Cif before screening

	    var Qsif = CC * Vgs * Vgs - (Cif + CC*Vgs) * vgsmFF;
	    var Qdif = CC * Vgd * Vgd - (Cif + CC*Vgd) * vgdmFF;

	    var dvoffdvbs = -Vds*dvgstdvds*dxdvbs;
	    var dvoffdvgs = -Vds*dvgstdvds*dxdvgs;
	    var dvoffdvds = dvgstdvds*(1-x) - Vds*dvgstdvds*dxdvds;

	    var detasdvds = (dvoffdvds - dnphitsdvds*etas)/nphits;
	    var detasdvgs = (1 + dvoffdvgs)/nphits;
	    var detasdvbs = (dvgstdvbs + dvoffdvbs)/nphits;

	    var dvgsmFFdetas = nphit * (expetas/(expetas + 1));
	    var dvgsmFFdvds = dvgsmFFdetas*detasdvds + dnphitdvds*logexpetas;

	    var dvgsmFFdvgs = dvgsmFFdetas * detasdvgs;
	    var dvgsmFFdvbs = dvgsmFFdetas * detasdvbs;

	    var dQsifdvds = -(Cif + CC*Vgs) * dvgsmFFdvds;
	    var dQsifdvgs = 2.0*CC*Vgs - CC*vgsmFF - (Cif+CC*Vgs)*dvgsmFFdvgs;
	    var dQsifdvbs = -(Cif + CC*Vgs) * dvgsmFFdvbs;

	    //etad = (Vgd + Voff - Vt0bd)/nphits;
	    var detaddvds =(dvoffdvds-1.0-gamma*dsqrtpmvbddvds
			    -dnphitsdvds*etad) / nphits;
	    var detaddvgs = (1.0+dvoffdvgs)/nphits;
	    var detaddvbs = (dvoffdvbs-gamma*dsqrtpmvbddvbs)/nphits;

	    var dvgdmFFdetad = nphit*(expetad/(expetad+1));
	    var dvgdmFFdvds = dvgdmFFdetad*detaddvds + dnphitdvds*logexpetad;
	    var dvgdmFFdvgs = dvgdmFFdetad*detaddvgs;
	    var dvgdmFFdvbs = dvgdmFFdetad*detaddvbs;

	    var dQdifdvds = -2.0*CC*Vgd + CC*vgdmFF -(Cif + CC*Vgd)*dvgdmFFdvds;
	    var dQdifdvgs = 2.0*CC*Vgd - CC*vgdmFF - (Cif + CC*Vgd)*dvgdmFFdvgs;
	    var dQdifdvbs = -(Cif + CC*Vgd)*dvgdmFFdvbs;

	    // Body charge based on approximate surface potential (psis).
	    var fdf = device.smoothsqrt(phib+aphit+phit*Math.log(logexpeta) - Vbs,true);
	    var spsis = fdf[0];
	    var dspsisdarg = fdf[1]; 
	    var Qbqi = (1-(qs+qd))/(2*sqrtpmv+gamma);
	    var qbf = device.W*LgmdLg*gamma;
	    var Qb = -qbf*(Cg * spsis + Qinv*Qbqi);

	    var dspsisdlogexpeta = dspsisdarg*phit/logexpeta;
	    var dspsisdeta = dspsisdlogexpeta*dlogexpetadeta;
	    var dspsisdvds = dspsisdeta*detadvds;
	    var dspsisdvgs = dspsisdeta*detadvgst;
	    var dspsisdvbs = dspsisdvgs*dvgstdvbs - dspsisdarg;

	    var spg = (2*sqrtpmv+gamma);
	    var dQbqidvds =  -(dqsdx*dxdvds + dqddvds)/spg;
	    var dQbqidvgs =  -(dqsdx*dxdvgs + dqddvgs)/spg;
	    var dQbqidvbs = (-(dqsdx*dxdvbs+dqddvbs)+2*Qbqi*dsqrtpmvdvbs)/spg;

	    var dQbdvds = -qbf*(Cg*dspsisdvds+Qinv*dQbqidvds+dQinvdvds*Qbqi);
	    var dQbdvgs = -qbf*(Cg*dspsisdvgs+Qinv*dQbqidvgs+dQinvdvgs*Qbqi);
	    var dQbdvbs = -qbf*(Cg*dspsisdvbs+Qinv*dQbqidvbs+dQinvdvbs*Qbqi);

	    // Linear caps treated externally with Cgdo and Cgso
	    // Linear q from G-S and G-D overlap & outer fringe (linear part)
	    // var Qsov = (Cov + Cif) * Vgs;
	    // var Qdov = (Cov + Cif) * Vgd;  // Vgd = Vgs - Vds
	    // Put Cif linear part back in to instrinsic model
	    var Qsov = Cif * Vgs;
	    var Qdov = Cif * Vgd;  // Vgd = Vgs - Vds

	    // Total charge at internal terminals x and y. 
	    // var Qs = -W*(Qinvs+Qsov+Qsif);  Qsov handled by Cgso
	    //device.Qd = -W*(Qinvd+Qdov+Qdif); Qdov handled by Cgdo
	    var Qs = -device.W*(Qinvs + Qsov + Qsif);
	    var Qd = -device.W*(Qinvd + Qdov + Qdif);   

	    //var dQddvds = -W*(dQinvddvds - (Cov+Cif) + dQdifdvds);
	    //var dQddvgs = -W*(dQinvddvgs + (Cov+Cif) + dQdifdvgs);
	    //var.dQsdvgs = -device.W*(dQinvsdvgs + (Cov+Cif) + dQsifdvgs);
	    var dQddvds = -device.W*(dQinvddvds - Cif + dQdifdvds);
	    var dQddvgs = -device.W*(dQinvddvgs + Cif + dQdifdvgs);
	    var dQddvbs = -device.W*(dQinvddvbs + dQdifdvbs);

	    var dQsdvds = -device.W*(dQinvsdvds + dQsifdvds);
	    var dQsdvgs = -device.W*(dQinvsdvgs + Cif + dQsifdvgs);
	    var dQsdvbs = -device.W*(dQinvsdvbs + dQsifdvbs);

	    // Final charge balance 
	    var Qg = -(Qs+Qd+Qb);
	    var dQgdvds = -(dQsdvds + dQddvds + dQbdvds);
	    var dQgdvgs = -(dQsdvgs + dQddvgs + dQbdvgs);
	    var dQgdvbs = -(dQsdvbs + dQddvbs + dQbdvbs);
	}

	if (doq == false) { // Pass back matrix of Ids and derivs.
	    var R = new Array(1);
	    R[0] = new Array(4);
	    R[0][0] = Ids;
	    R[0][D+1] = dIdsdvds;
	    R[0][G+1] = dIdsdvgs;
	    R[0][B+1] = dIdsdvbs;
	} else { // Pass back Ids, Qd, Qg, Qb, Qs and derivatives.
	    var R = new Array(5);
	    for (var i = R.length-1; i >= 0; i--) 
		R[i] = new Array(4);
	    var Rr = R[0]; // first row used for crnt.
	    Rr[0] = Ids; Rr[D+1]=dIdsdvds; Rr[G+1]=dIdsdvgs; Rr[B+1]=dIdsdvbs;
	    Rr = R[D+1];  // Drain chg.
	    Rr[0] = Qd; Rr[D+1]=dQddvds; Rr[G+1]=dQddvgs; Rr[B+1]=dQddvbs;
	    Rr = R[G+1]  // Gate chg.
	    Rr[0] = Qg; Rr[D+1]=dQgdvds; Rr[G+1]=dQgdvgs; Rr[B+1]=dQgdvbs;
	    Rr = R[B+1]  // Bulk chg.
	    Rr[0] = Qb; Rr[D+1]=dQbdvds; Rr[G+1]=dQbdvgs; Rr[B+1]=dQbdvbs;
	    Rr = R[S+1]  // Source chg.
	    Rr[0] = Qs; Rr[D+1]=dQsdvds; Rr[G+1]=dQsdvgs; Rr[B+1]=dQsdvbs;
	}
	return R;
    }
}
