/* Renoverse — Product feature: stack-and-collapse animation
   Mounts into the first element with [data-stack-animation].
   Requires GSAP + ScrollTrigger to be loaded before this script. */
(function () {
  const FLOORPLAN_URL = new URL('floorplan.png', document.currentScript.src).href;
  const MARKUP = `
  <section class="stack-section" id="stackSection">
    <div class="stack-stage">
      <div class="stack-scene" id="stackScene">

        <!-- Order matters: deepest (back) first, frontmost last. -->

        <!-- EXCEL ─────────────────────────────────────── -->
        <div class="panel panel--excel" data-layer="0">
          <div class="xl-app">
            <div class="xl-titlebar">
              <span class="xl-logo">X</span>
              <span>BROOKLINE_RFI_LOG.xlsx</span>
              <span class="xl-spacer"></span>
              <span class="xl-user">jvalentine@</span>
            </div>
            <div class="xl-ribbon">
              <span class="xl-tab">File</span>
              <span class="xl-tab active">Home</span>
              <span class="xl-tab">Insert</span>
              <span class="xl-tab">Page Layout</span>
              <span class="xl-tab">Formulas</span>
              <span class="xl-tab">Data</span>
              <span class="xl-tab">Review</span>
              <span class="xl-tools">
                <span class="tool"></span>
                <span class="tool"></span>
                <span class="tool"></span>
                <span class="tool"></span>
              </span>
            </div>
            <div class="xl-formula-bar">
              <span class="cell-name">B5</span>
              <span class="fx">ƒx</span>
              <span class="formula">Construction RFI Tracking Log</span>
            </div>

            <div class="xl-doc">
              <div class="xl-doc-title">Construction RFI Tracking Log</div>

              <div class="xl-doc-meta">
                <div class="xl-doc-info">
                  <div class="row"><span class="k">Project Name</span><span class="v">Brookline Residence</span></div>
                  <div class="row"><span class="k">Project Description</span><span class="v">Full gut renovation, addition</span></div>
                  <div class="row"><span class="k">Owner</span><span class="v">Marcus Allen</span></div>
                  <div class="row"><span class="k">Project Manager / Contracting Officer</span><span class="v">Daniel Chen</span></div>
                </div>
                <div class="xl-doc-stats">
                  <div class="xl-doc-stat open"><span class="label">Open</span><span class="count">3</span></div>
                  <div class="xl-doc-stat send"><span class="label">To send</span><span class="count">2</span></div>
                  <div class="xl-doc-stat delayed"><span class="label">Delayed</span><span class="count">1</span></div>
                  <div class="xl-doc-stat closed"><span class="label">Closed</span><span class="count">4</span></div>
                </div>
              </div>

              <div class="xl-doc-table">
                <div class="th">RFI #</div>
                <div class="th">Status</div>
                <div class="th">Priority</div>
                <div class="th">Request Description</div>
                <div class="th">Cost</div>
                <div class="th">Requested By</div>
                <div class="th">Sent To</div>
                <div class="th">Date Req'd</div>

                <div class="td">001</div>
                <div class="td"><span class="status-pill closed">Closed</span></div>
                <div class="td"><span class="priority exp">Expedited</span></div>
                <div class="td">Status of plans and specifications</div>
                <div class="td">YES</div>
                <div class="td">Prime Contractor</div>
                <div class="td">Project Manager</div>
                <div class="td">04/28</div>

                <div class="td">002</div>
                <div class="td"><span class="status-pill open">Open</span></div>
                <div class="td"><span class="priority crit">Critical</span></div>
                <div class="td">Clarification on intended door height</div>
                <div class="td">NO</div>
                <div class="td">Prime Contractor</div>
                <div class="td">Architect</div>
                <div class="td">05/02</div>

                <div class="td">003</div>
                <div class="td"><span class="status-pill send">To send</span></div>
                <div class="td"><span class="priority std">Standard</span></div>
                <div class="td">Proposal formatting for design narrative</div>
                <div class="td">—</div>
                <div class="td">Designer of Record</div>
                <div class="td">Contracting Officer</div>
                <div class="td">05/06</div>

                <div class="td">004</div>
                <div class="td"><span class="status-pill delayed">Delayed</span></div>
                <div class="td"><span class="priority crit">Critical</span></div>
                <div class="td">Stair tread material confirmation</div>
                <div class="td">YES</div>
                <div class="td">Architect</div>
                <div class="td">Owner</div>
                <div class="td">05/10</div>

                <div class="td">005</div>
                <div class="td"><span class="status-pill closed">Closed</span></div>
                <div class="td"><span class="priority std">Standard</span></div>
                <div class="td">Window head detail Type A</div>
                <div class="td">NO</div>
                <div class="td">Prime Contractor</div>
                <div class="td">Architect</div>
                <div class="td">04/22</div>

                <div class="td">006</div>
                <div class="td"><span class="status-pill open">Open</span></div>
                <div class="td"><span class="priority exp">Expedited</span></div>
                <div class="td">Pendant rough-in locations — kitchen island</div>
                <div class="td">NO</div>
                <div class="td">Electrician</div>
                <div class="td">Designer</div>
                <div class="td">05/12</div>

                <div class="td">007</div>
                <div class="td"><span class="status-pill send">To send</span></div>
                <div class="td"><span class="priority std">Standard</span></div>
                <div class="td">Tile thickness for shower curb</div>
                <div class="td">—</div>
                <div class="td">Tile Sub</div>
                <div class="td">Architect</div>
                <div class="td">05/15</div>

                <div class="td">008</div>
                <div class="td"><span class="status-pill closed">Closed</span></div>
                <div class="td"><span class="priority std">Standard</span></div>
                <div class="td">Cabinet hardware spec — Master closet</div>
                <div class="td">YES</div>
                <div class="td">Cabinet Sub</div>
                <div class="td">Designer</div>
                <div class="td">04/29</div>

                <div class="td">009</div>
                <div class="td"><span class="status-pill open">Open</span></div>
                <div class="td"><span class="priority std">Standard</span></div>
                <div class="td">HVAC return location — bedroom 2</div>
                <div class="td">NO</div>
                <div class="td">Mechanical Sub</div>
                <div class="td">Architect</div>
                <div class="td">05/18</div>

                <div class="td">010</div>
                <div class="td"><span class="status-pill closed">Closed</span></div>
                <div class="td"><span class="priority exp">Expedited</span></div>
                <div class="td">Foundation rebar spacing — addition</div>
                <div class="td">NO</div>
                <div class="td">Structural Eng.</div>
                <div class="td">Architect</div>
                <div class="td">04/15</div>
              </div>
            </div>

            <div class="xl-statusbar">
              <span class="sheet-tab">RFIs</span>
              <span class="sheet-tab inactive">Schedule</span>
              <span class="sheet-tab inactive">Timesheet</span>
              <span class="sheet-tab inactive">Punch List</span>
              <span class="xl-spacer"></span>
              <span class="zoom">10 of 47 RFIs</span>
              <span class="zoom">·</span>
              <span class="zoom">100%</span>
            </div>
          </div>
        </div>

        <!-- AUTOCAD ───────────────────────────────────── -->
        <div class="panel panel--autocad" data-layer="1">
          <div class="ac-app">
            <div class="ac-titlebar">
              <span class="ac-logo">A</span>
              <span>BROOKLINE_RESIDENCE.dwg</span>
              <span class="ac-spacer"></span>
              <span>nishant.naik</span>
            </div>
            <div class="ac-ribbon">
              <span class="ac-tab">Home</span>
              <span class="ac-tab">Solid</span>
              <span class="ac-tab active">Surface</span>
              <span class="ac-tab">Mesh</span>
              <span class="ac-tab">Visualize</span>
              <span class="ac-tab">Annotate</span>
              <span class="ac-tab">View</span>
              <span class="ac-spacer" style="flex:1"></span>
              <span class="ac-tool"></span><span class="ac-tool"></span><span class="ac-tool"></span><span class="ac-tool"></span>
            </div>
            <div class="ac-canvas">
              <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid meet">
                <!-- Grid bubbles -->
                <g font-size="5" fill="#fed94a">
                  <circle cx="60"  cy="10" r="5" fill="none" stroke="#fed94a" stroke-width="0.4"/><text x="60"  y="12" text-anchor="middle">A</text>
                  <circle cx="120" cy="10" r="5" fill="none" stroke="#fed94a" stroke-width="0.4"/><text x="120" y="12" text-anchor="middle">B</text>
                  <circle cx="190" cy="10" r="5" fill="none" stroke="#fed94a" stroke-width="0.4"/><text x="190" y="12" text-anchor="middle">C</text>
                  <circle cx="260" cy="10" r="5" fill="none" stroke="#fed94a" stroke-width="0.4"/><text x="260" y="12" text-anchor="middle">D</text>
                  <circle cx="330" cy="10" r="5" fill="none" stroke="#fed94a" stroke-width="0.4"/><text x="330" y="12" text-anchor="middle">E</text>
                </g>
                <!-- Outer wall — red -->
                <rect x="20" y="30" width="360" height="160" fill="none" stroke="#e2554a" stroke-width="1.4"/>
                <!-- Inner walls — orange -->
                <line x1="120" y1="30" x2="120" y2="120" stroke="#f5a623" stroke-width="0.6"/>
                <line x1="190" y1="120" x2="190" y2="190" stroke="#f5a623" stroke-width="0.6"/>
                <line x1="260" y1="30" x2="260" y2="120" stroke="#f5a623" stroke-width="0.6"/>
                <line x1="330" y1="120" x2="330" y2="190" stroke="#f5a623" stroke-width="0.6"/>
                <line x1="20"  y1="120" x2="380" y2="120" stroke="#f5a623" stroke-width="0.6"/>
                <!-- Door arcs -->
                <path d="M 120 90 A 18 18 0 0 1 138 108" fill="none" stroke="#fed94a" stroke-width="0.5"/>
                <path d="M 260 90 A 18 18 0 0 0 242 108" fill="none" stroke="#fed94a" stroke-width="0.5"/>
                <path d="M 190 150 A 16 16 0 0 1 206 166" fill="none" stroke="#fed94a" stroke-width="0.5"/>
                <!-- Furniture / fixtures -->
                <rect x="35"  y="45"  width="60" height="35" fill="none" stroke="#7ed321" stroke-width="0.5"/>
                <rect x="135" y="45"  width="50" height="40" fill="none" stroke="#7ed321" stroke-width="0.5"/>
                <rect x="205" y="45"  width="40" height="40" fill="none" stroke="#e2554a" stroke-width="0.5"/>
                <rect x="275" y="45"  width="40" height="40" fill="none" stroke="#e2554a" stroke-width="0.5"/>
                <rect x="335" y="45"  width="35" height="40" fill="none" stroke="#7ed321" stroke-width="0.5"/>
                <rect x="35"  y="135" width="65" height="40" fill="none" stroke="#7ed321" stroke-width="0.5"/>
                <rect x="120" y="135" width="55" height="40" fill="none" stroke="#7ed321" stroke-width="0.5"/>
                <!-- staircase -->
                <g stroke="#fed94a" stroke-width="0.4" fill="none">
                  <rect x="200" y="135" width="22" height="40"/>
                  <line x1="200" y1="143" x2="222" y2="143"/>
                  <line x1="200" y1="151" x2="222" y2="151"/>
                  <line x1="200" y1="159" x2="222" y2="159"/>
                  <line x1="200" y1="167" x2="222" y2="167"/>
                </g>
                <!-- bathroom fixtures -->
                <g stroke="#7ed321" stroke-width="0.4" fill="none">
                  <!-- tub -->
                  <rect x="245" y="135" width="30" height="14" rx="3"/>
                  <!-- toilet -->
                  <ellipse cx="290" cy="142" rx="5" ry="6"/>
                  <rect x="284" y="148" width="12" height="4"/>
                  <!-- sink/vanity -->
                  <rect x="245" y="155" width="50" height="10"/>
                  <circle cx="270" cy="160" r="2"/>
                </g>
                <!-- kitchen island -->
                <g stroke="#e2554a" stroke-width="0.4" fill="none">
                  <rect x="305" y="138" width="55" height="20"/>
                </g>
                <!-- Residential room labels -->
                <g font-size="4" fill="#a0a0a4" text-anchor="middle">
                  <text x="65"  y="65">LIVING</text>
                  <text x="160" y="68">DINING</text>
                  <text x="290" y="68">MASTER BED</text>
                  <text x="67"  y="158">BED 2</text>
                  <text x="148" y="158">BED 3</text>
                  <text x="262" y="178">BATH</text>
                  <text x="332" y="172">KITCHEN</text>
                </g>
                <!-- Dimension callouts -->
                <g font-size="3.5" fill="#fed94a">
                  <text x="60"  y="26">14'-0"</text>
                  <text x="155" y="26">15'-4"</text>
                  <text x="225" y="26">15'-3"</text>
                  <text x="295" y="26">17'-4"</text>
                  <text x="355" y="26">13'-3"</text>
                </g>
              </svg>
              <div class="ac-viewcube">TOP</div>
            </div>
            <div class="ac-cmdline">▸ Type a command</div>
          </div>
        </div>

        <!-- BLUEBEAM ──────────────────────────────────── -->
        <div class="panel panel--bluebeam" data-layer="2">
          <div class="bb-app">
            <div class="bb-menubar">
              <span style="color:#888">▾</span>
              <span>File</span><span>Edit</span><span>View</span><span>Document</span>
              <span>Batch</span><span>Tools</span><span>Window</span><span>Help</span>
            </div>
            <div class="bb-body">
              <div class="bb-sidebar">
                <div class="bb-section-title">File Properties</div>
                <div class="bb-prop-row"><span class="k">Title</span><span class="v">Residence_L02</span></div>
                <div class="bb-prop-row"><span class="k">Author</span><span class="v">jpopiel</span></div>
                <div class="bb-prop-row"><span class="k">Project</span><span class="v">Brookline</span></div>
                <div class="bb-prop-row"><span class="k">Client</span><span class="v">Owner</span></div>

                <div class="bb-section-title" style="margin-top:4px">Tool Chest</div>
                <div class="bb-toolchest">
                  <div class="t blue">A</div>
                  <div class="t yellow"></div>
                  <div class="t blue">/</div>
                  <div class="t blue">→</div>
                  <div class="t blue">A</div>
                  <div class="t orange"></div>
                  <div class="t blue">○</div>
                  <div class="t blue">□</div>
                  <div class="t red"></div>
                  <div class="t blue">○</div>
                  <div class="t blue">A</div>
                  <div class="t yellow"></div>
                </div>

                <div class="bb-section-title" style="margin-top:4px">Tags</div>
                <div class="bb-prop-row"><span class="k">Date</span><span class="v">07/30/26</span></div>
                <div class="bb-prop-row"><span class="k">Sheet</span><span class="v">L02 PLAN</span></div>
                <div class="bb-prop-row"><span class="k">Status</span><span class="v">Review</span></div>
              </div>
              <div class="bb-canvas">
                <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet">
                  <!-- Plan outline -->
                  <rect x="20" y="40" width="280" height="120" fill="#fff" stroke="#222" stroke-width="0.5"/>
                  <!-- Inner walls -->
                  <line x1="80"  y1="40" x2="80"  y2="160" stroke="#222" stroke-width="0.4"/>
                  <line x1="140" y1="40" x2="140" y2="100" stroke="#222" stroke-width="0.4"/>
                  <line x1="180" y1="40" x2="180" y2="100" stroke="#222" stroke-width="0.4"/>
                  <line x1="240" y1="40" x2="240" y2="160" stroke="#222" stroke-width="0.4"/>
                  <line x1="20"  y1="100" x2="300" y2="100" stroke="#222" stroke-width="0.4"/>
                  <line x1="20"  y1="130" x2="80"  y2="130" stroke="#222" stroke-width="0.4"/>
                  <line x1="240" y1="130" x2="300" y2="130" stroke="#222" stroke-width="0.4"/>
                  <!-- Residential labels -->
                  <g font-size="3" fill="#444" text-anchor="middle">
                    <text x="50" y="70">BED 1</text>
                    <text x="50" y="115">BED 2</text>
                    <text x="50" y="145">BATH</text>
                    <text x="110" y="70">BED 3</text>
                    <text x="160" y="70">CLOSET</text>
                    <text x="210" y="70">MASTER</text>
                    <text x="270" y="115">KITCHEN</text>
                    <text x="160" y="125">LIVING / DINING</text>
                    <text x="160" y="155">FOYER</text>
                  </g>
                  <!-- Annotations: yellow highlights -->
                  <rect x="150" y="48" width="22" height="14" fill="#fff59d" opacity="0.7"/>
                  <rect x="186" y="118" width="48" height="12" fill="#fff59d" opacity="0.7"/>
                  <!-- Red callout cloud (squiggly) -->
                  <path d="M 95 105 q 3 -8 10 -4 q 3 -7 10 -2 q 3 -8 10 -3 q 4 -7 10 -2 l 0 18 q -8 3 -12 -2 q -7 5 -10 -1 q -7 4 -10 -2 q -7 4 -8 -4 z"
                    fill="none" stroke="#e84545" stroke-width="0.6"/>
                  <!-- Red pins -->
                  <g fill="#e84545" font-size="3.5" text-anchor="middle">
                    <circle cx="105" cy="115" r="3"/><text x="105" y="116.5" fill="#fff">1</text>
                    <circle cx="200" cy="50"  r="3"/><text x="200" y="51.5"  fill="#fff">2</text>
                    <circle cx="270" cy="80"  r="3"/><text x="270" y="81.5"  fill="#fff">3</text>
                  </g>
                  <!-- Orange flags -->
                  <g fill="#f5a623">
                    <rect x="55"  y="95" width="6" height="8"/>
                    <rect x="135" y="95" width="6" height="8"/>
                    <rect x="225" y="95" width="6" height="8"/>
                  </g>
                  <!-- Annotation labels -->
                  <g font-size="3" fill="#e84545">
                    <text x="60"  y="35">Confirm wall type</text>
                    <text x="200" y="35">Window head detail</text>
                    <text x="170" y="178">Trim detail typ.</text>
                  </g>
                  <!-- Gridlines top dimension -->
                  <g stroke="#888" stroke-width="0.2">
                    <line x1="20"  y1="32" x2="80"  y2="32"/>
                    <line x1="80"  y1="32" x2="140" y2="32"/>
                    <line x1="140" y1="32" x2="240" y2="32"/>
                    <line x1="240" y1="32" x2="300" y2="32"/>
                  </g>
                  <!-- Title block bottom-right -->
                  <g>
                    <rect x="208" y="170" width="92" height="22" fill="#fff" stroke="#222" stroke-width="0.3"/>
                    <rect x="214" y="175" width="32" height="4" fill="#888"/>
                    <rect x="214" y="181" width="44" height="2.5" fill="#bbb"/>
                    <rect x="214" y="185" width="40" height="2.5" fill="#bbb"/>
                    <text x="265" y="178" font-size="3" fill="#222" font-weight="600">RESIDENCE</text>
                    <rect x="262" y="183" width="32" height="2.5" fill="#bbb"/>
                    <rect x="262" y="187" width="28" height="2.5" fill="#bbb"/>
                  </g>
                </svg>
              </div>
            </div>
            <div class="bb-statusbar">Floor Plan (1 of 1) · 100%</div>
          </div>
        </div>

        <!-- FINDER ────────────────────────────────────── -->
        <div class="panel panel--finder" data-layer="3">
          <div class="fn-app">
            <div class="fn-titlebar">
              <div class="fn-traffic">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <div class="title">Brookline · Fixtures &amp; Finishes</div>
            </div>
            <div class="fn-toolbar">
              <span class="nav">‹ ›</span>
              <div class="view-toggle">
                <span class="vt">≡</span>
                <span class="vt active">▦</span>
                <span class="vt">⊞</span>
                <span class="vt">▥</span>
              </div>
              <span class="spacer"></span>
              <span class="search-mini">⌕</span>
            </div>
            <div class="fn-body">
              <div class="fn-sidebar">
                <div class="group">Favorites</div>
                <div class="item"><span class="ico"></span>Recents</div>
                <div class="item"><span class="ico"></span>Documents</div>
                <div class="item"><span class="ico"></span>Desktop</div>
                <div class="item"><span class="ico"></span>Downloads</div>
                <div class="group">Brookline</div>
                <div class="item active"><span class="ico"></span>Fixtures</div>
                <div class="item tagged-orange"><span class="ico"></span>Lighting</div>
                <div class="item tagged-green"><span class="ico"></span>Tile</div>
                <div class="item tagged-purple"><span class="ico"></span>Moodboard</div>
                <div class="group">Tags</div>
                <div class="item"><span class="dot" style="background:#ff5f57"></span>Approved</div>
                <div class="item"><span class="dot" style="background:#febc2e"></span>Review</div>
                <div class="item"><span class="dot" style="background:#5dc25d"></span>Ordered</div>
              </div>

              <div class="fn-grid">
                <div class="fn-file selected">
                  <div class="fn-thumb brass"></div>
                  <div class="fn-name">faucet_brass.jpg</div>
                </div>
                <div class="fn-file">
                  <div class="fn-thumb matte-black"></div>
                  <div class="fn-name">pendant_globe.jpg</div>
                </div>
                <div class="fn-file">
                  <div class="fn-thumb marble"></div>
                  <div class="fn-name">marble_calacatta.jpg</div>
                </div>
                <div class="fn-file">
                  <div class="fn-thumb ivory"></div>
                  <div class="fn-name">sconce_cone.jpg</div>
                </div>
                <div class="fn-file">
                  <div class="fn-thumb pdf"></div>
                  <div class="fn-name">KOHLER_spec.pdf</div>
                </div>

                <div class="fn-file">
                  <div class="fn-thumb terracotta"></div>
                  <div class="fn-name">tile_zellige.jpg</div>
                </div>
                <div class="fn-file">
                  <div class="fn-thumb warm-room"></div>
                  <div class="fn-name">moodboard_kitchen.jpg</div>
                </div>
                <div class="fn-file">
                  <div class="fn-thumb cool-room"></div>
                  <div class="fn-name">moodboard_bath.jpg</div>
                </div>
                <div class="fn-file">
                  <div class="fn-thumb oak-wood"></div>
                  <div class="fn-name">vanity_oak.jpg</div>
                </div>
                <div class="fn-file">
                  <div class="fn-thumb pdf"></div>
                  <div class="fn-name">VC_pendants.pdf</div>
                </div>

                <div class="fn-file">
                  <div class="fn-thumb green-tile"></div>
                  <div class="fn-name">tile_zelligework.jpg</div>
                </div>
                <div class="fn-file">
                  <div class="fn-thumb cool-tub"></div>
                  <div class="fn-name">tub_freestand.jpg</div>
                </div>
                <div class="fn-file">
                  <div class="fn-thumb brass"></div>
                  <div class="fn-name">hardware_pull.jpg</div>
                </div>
                <div class="fn-file">
                  <div class="fn-thumb matte-black"></div>
                  <div class="fn-name">faucet_matte.jpg</div>
                </div>
                <div class="fn-file">
                  <div class="fn-thumb pdf"></div>
                  <div class="fn-name">Waterworks_quote.pdf</div>
                </div>
              </div>
            </div>
            <div class="fn-pathbar">
              ▾ Brookline ▸ Fixtures &amp; Finishes · 47 items, 12.3 GB available
            </div>
          </div>
        </div>

        <!-- GMAIL ─────────────────────────────────────── -->
        <div class="panel panel--gmail" data-layer="4">
          <div class="gm-app">
            <div class="gm-topbar">
              <div class="gm-logo"><span class="mark"></span></div>
              <div class="gm-search">⌕</div>
              <div class="gm-avatar"></div>
            </div>
            <div class="gm-body">
              <div class="gm-sidebar">
                <div class="gm-compose">Compose</div>
                <div class="gm-nav">
                  <div class="item active"><span class="dot"></span>Inbox</div>
                  <div class="item"><span class="dot"></span>Starred</div>
                  <div class="item"><span class="dot"></span>Snoozed</div>
                  <div class="item"><span class="dot"></span>Sent</div>
                  <div class="item"><span class="dot"></span>Drafts</div>
                  <div class="item"><span class="dot"></span>All Mail</div>
                  <div class="item"><span class="dot"></span>Spam</div>
                </div>
              </div>
              <div class="gm-list">
                <div class="group-head">Unread · 1–3 of 3</div>
                <div class="gm-row unread">
                  <span class="star">☆</span><span class="label">›</span>
                  <span class="bar sender-bar"></span>
                  <span class="bar subj-bar"></span>
                  <span class="time-bar"></span>
                </div>
                <div class="gm-row unread">
                  <span class="star">☆</span><span class="label">›</span>
                  <span class="bar sender-bar" style="width:55%"></span>
                  <span class="bar subj-bar" style="width:78%"></span>
                  <span class="time-bar"></span>
                </div>
                <div class="gm-row unread">
                  <span class="star">☆</span><span class="label">›</span>
                  <span class="bar sender-bar" style="width:62%"></span>
                  <span class="bar subj-bar" style="width:92%"></span>
                  <span class="time-bar"></span>
                </div>
                <div class="group-head">Everything else · 1–50 of 159</div>
                <div class="gm-row">
                  <span class="star">☆</span><span class="label">›</span>
                  <span class="bar sender-bar" style="width:48%"></span>
                  <span class="bar subj-bar" style="width:80%"></span>
                  <span class="time-bar"></span>
                </div>
                <div class="gm-row">
                  <span class="star">☆</span><span class="label">›</span>
                  <span class="bar sender-bar" style="width:72%"></span>
                  <span class="bar subj-bar" style="width:65%"></span>
                  <span class="time-bar"></span>
                </div>
                <div class="gm-row">
                  <span class="star">☆</span><span class="label" style="color:#fbbc04">›</span>
                  <span class="bar sender-bar" style="width:58%"></span>
                  <span class="bar subj-bar" style="width:88%"></span>
                  <span class="time-bar"></span>
                </div>
                <div class="gm-row">
                  <span class="star">☆</span><span class="label">›</span>
                  <span class="bar sender-bar" style="width:50%"></span>
                  <span class="bar subj-bar" style="width:74%"></span>
                  <span class="time-bar"></span>
                </div>
                <div class="gm-row">
                  <span class="star">☆</span><span class="label">›</span>
                  <span class="bar sender-bar" style="width:65%"></span>
                  <span class="bar subj-bar" style="width:82%"></span>
                  <span class="time-bar"></span>
                </div>
                <div class="gm-row">
                  <span class="star">☆</span><span class="label" style="color:#fbbc04">›</span>
                  <span class="bar sender-bar" style="width:55%"></span>
                  <span class="bar subj-bar" style="width:90%"></span>
                  <span class="time-bar"></span>
                </div>
                <div class="gm-row">
                  <span class="star">☆</span><span class="label" style="color:#fbbc04">›</span>
                  <span class="bar sender-bar" style="width:42%"></span>
                  <span class="bar subj-bar" style="width:70%"></span>
                  <span class="time-bar"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RENOVERSE — final combined app surface -->
        <div class="panel panel--cal" data-layer="6">
          <div class="rv-app">
            <div class="rv-topbar">
              <span class="rv-back">‹</span>
              <span class="rv-version-badge"><span class="dot"></span>Current v1</span>
              <span class="rv-version-meta">Apr 30 · 4:39pm</span>
              <span class="rv-spacer"></span>
              <div class="rv-avatars">
                <span class="av a1"></span>
                <span class="av a2"></span>
                <span class="av a3"></span>
                <span class="av a4"></span>
              </div>
              <span class="rv-ai-pill">✦</span>
            </div>
            <div class="rv-tabs">
              <span class="rv-tab">Overview</span>
              <span class="rv-tab active">Design</span>
              <span class="rv-tab">Tasks</span>
              <span class="rv-tab">Files</span>
              <span class="rv-tab">Schedule</span>
            </div>
            <div class="rv-body">
              <div class="rv-comments">
                <div class="rv-search">⌕  Search comments</div>

                <div class="rv-comment active">
                  <div class="c-av a1"></div>
                  <div class="c-body">
                    <div class="name-bar"></div>
                    <div class="text-bar w90"></div>
                    <div class="text-bar w75"></div>
                    <div class="text-bar w60"></div>
                    <div class="reply-line">↩ 2 replies</div>
                  </div>
                </div>
                <div class="rv-comment">
                  <div class="c-av a2"></div>
                  <div class="c-body">
                    <div class="name-bar"></div>
                    <div class="text-bar w90"></div>
                    <div class="text-bar w75"></div>
                    <div class="reply-line">↩ 1 reply</div>
                  </div>
                </div>
                <div class="rv-comment">
                  <div class="c-av a3"></div>
                  <div class="c-body">
                    <div class="name-bar"></div>
                    <div class="text-bar w90"></div>
                    <div class="text-bar w60"></div>
                    <div class="reply-line">↩ 4 replies</div>
                  </div>
                </div>
                <div class="rv-comment">
                  <div class="c-av a4"></div>
                  <div class="c-body">
                    <div class="name-bar"></div>
                    <div class="text-bar w75"></div>
                    <div class="text-bar w60"></div>
                  </div>
                </div>

                <div class="rv-compose">
                  <span class="compose-at">@</span>
                  <span class="compose-input">Add a comment</span>
                  <span class="compose-send">↑</span>
                </div>
              </div>

              <div class="rv-canvas">
                <img class="rv-floorplan-img" src="${FLOORPLAN_URL}" alt="Brookline Residence — 1st Floor Plan"/>
                <svg viewBox="0 0 320 230" preserveAspectRatio="xMidYMid meet" font-family="-apple-system, BlinkMacSystemFont, system-ui, sans-serif" style="display:none">
                  <!-- Top dimension chain — extension lines, ticks, and feet/inches -->
                  <g stroke="#5a6478" stroke-width="0.25" fill="#5a6478">
                    <line x1="20"  y1="14" x2="20"  y2="22"/>
                    <line x1="80"  y1="14" x2="80"  y2="22"/>
                    <line x1="134" y1="14" x2="134" y2="22"/>
                    <line x1="194" y1="14" x2="194" y2="22"/>
                    <line x1="246" y1="14" x2="246" y2="22"/>
                    <line x1="300" y1="14" x2="300" y2="22"/>
                    <line x1="20"  y1="18" x2="300" y2="18" stroke-width="0.3"/>
                    <g font-size="2.8" text-anchor="middle">
                      <text x="50"  y="13">12'-0"</text>
                      <text x="107" y="13">10'-4"</text>
                      <text x="164" y="13">11'-2"</text>
                      <text x="220" y="13">10'-6"</text>
                      <text x="273" y="13">10'-0"</text>
                    </g>
                    <!-- overall dimension above -->
                    <line x1="20"  y1="6" x2="300" y2="6" stroke-width="0.3"/>
                    <line x1="20"  y1="3" x2="20"  y2="9"/>
                    <line x1="300" y1="3" x2="300" y2="9"/>
                    <text x="160" y="5" font-size="3" font-weight="600" text-anchor="middle">54'-0" OVERALL</text>
                  </g>

                  <!-- Left dimension chain -->
                  <g stroke="#5a6478" stroke-width="0.25" fill="#5a6478">
                    <line x1="14" y1="34" x2="6"  y2="34"/>
                    <line x1="14" y1="96" x2="6"  y2="96"/>
                    <line x1="14" y1="146" x2="6" y2="146"/>
                    <line x1="14" y1="176" x2="6" y2="176"/>
                    <line x1="10" y1="34" x2="10" y2="176" stroke-width="0.3"/>
                    <g font-size="2.8" text-anchor="end">
                      <text x="9" y="68"  transform="rotate(-90 9 68)">14'-0"</text>
                      <text x="9" y="125" transform="rotate(-90 9 125)">11'-6"</text>
                      <text x="9" y="165" transform="rotate(-90 9 165)">6'-0"</text>
                    </g>
                  </g>

                  <!-- Grid guidelines (column lines) — dashed -->
                  <g stroke="#c8d0dc" stroke-width="0.2" stroke-dasharray="1.2 1.2">
                    <line x1="20"  y1="22" x2="20"  y2="180"/>
                    <line x1="80"  y1="22" x2="80"  y2="180"/>
                    <line x1="134" y1="22" x2="134" y2="180"/>
                    <line x1="194" y1="22" x2="194" y2="180"/>
                    <line x1="246" y1="22" x2="246" y2="180"/>
                    <line x1="300" y1="22" x2="300" y2="180"/>
                  </g>

                  <!-- Grid bubbles — top (column letters) -->
                  <g fill="#fff" stroke="#1a4d8f" stroke-width="0.4">
                    <circle cx="20"  cy="28" r="3.4"/>
                    <circle cx="80"  cy="28" r="3.4"/>
                    <circle cx="134" cy="28" r="3.4"/>
                    <circle cx="194" cy="28" r="3.4"/>
                    <circle cx="246" cy="28" r="3.4"/>
                    <circle cx="300" cy="28" r="3.4"/>
                  </g>
                  <g font-size="3" fill="#1a4d8f" font-weight="700" text-anchor="middle">
                    <text x="20"  y="29">A</text>
                    <text x="80"  y="29">B</text>
                    <text x="134" y="29">C</text>
                    <text x="194" y="29">D</text>
                    <text x="246" y="29">E</text>
                    <text x="300" y="29">F</text>
                  </g>

                  <!-- Grid bubbles — left (row numbers) -->
                  <g fill="#fff" stroke="#1a4d8f" stroke-width="0.4">
                    <circle cx="16" cy="34"  r="3.4"/>
                    <circle cx="16" cy="96"  r="3.4"/>
                    <circle cx="16" cy="146" r="3.4"/>
                    <circle cx="16" cy="176" r="3.4"/>
                  </g>
                  <g font-size="3" fill="#1a4d8f" font-weight="700" text-anchor="middle">
                    <text x="16" y="35">1</text>
                    <text x="16" y="97">2</text>
                    <text x="16" y="147">3</text>
                    <text x="16" y="177">4</text>
                  </g>

                  <!-- Light blue room fills -->
                  <g fill="#eef3fa">
                    <rect x="20"  y="34" width="60" height="62"/>
                    <rect x="20"  y="96" width="60" height="50"/>
                    <rect x="20"  y="146" width="60" height="30"/>
                    <rect x="80"  y="34" width="54" height="62"/>
                    <rect x="134" y="34" width="60" height="62"/>
                    <rect x="194" y="34" width="52" height="62"/>
                    <rect x="246" y="34" width="54" height="62"/>
                    <rect x="80"  y="96" width="82" height="80"/>
                    <rect x="162" y="96" width="86" height="80"/>
                    <rect x="248" y="96" width="52" height="80"/>
                  </g>

                  <!-- Plan outline (double line for wall thickness) -->
                  <rect x="20" y="34" width="280" height="142" fill="none" stroke="#1a2a40" stroke-width="0.9"/>
                  <rect x="22" y="36" width="276" height="138" fill="none" stroke="#1a2a40" stroke-width="0.3"/>

                  <!-- Inner walls -->
                  <line x1="80"  y1="34" x2="80"  y2="176" stroke="#1a2a40" stroke-width="0.6"/>
                  <line x1="134" y1="34" x2="134" y2="96"  stroke="#1a2a40" stroke-width="0.6"/>
                  <line x1="194" y1="34" x2="194" y2="96"  stroke="#1a2a40" stroke-width="0.6"/>
                  <line x1="246" y1="34" x2="246" y2="176" stroke="#1a2a40" stroke-width="0.6"/>
                  <line x1="162" y1="96" x2="162" y2="176" stroke="#1a2a40" stroke-width="0.6"/>
                  <line x1="20"  y1="96" x2="300" y2="96"  stroke="#1a2a40" stroke-width="0.6"/>
                  <line x1="20"  y1="146" x2="80" y2="146" stroke="#1a2a40" stroke-width="0.6"/>

                  <!-- Door arcs (with swing leaf) -->
                  <g fill="none" stroke="#1a2a40" stroke-width="0.35">
                    <path d="M 80 84 A 14 14 0 0 1 94 96"/>
                    <line x1="80" y1="84" x2="80" y2="96"/>
                    <path d="M 162 110 A 14 14 0 0 1 176 124"/>
                    <line x1="162" y1="110" x2="162" y2="124"/>
                    <path d="M 246 110 A 14 14 0 0 0 232 124"/>
                    <line x1="246" y1="110" x2="246" y2="124"/>
                    <path d="M 80 158 A 12 12 0 0 1 92 170"/>
                    <line x1="80" y1="158" x2="80" y2="170"/>
                    <path d="M 134 50 A 10 10 0 0 1 144 60"/>
                    <line x1="134" y1="50" x2="134" y2="60"/>
                  </g>

                  <!-- LIVING — sofa, coffee table, side chairs -->
                  <g fill="none" stroke="#1a2a40" stroke-width="0.3">
                    <rect x="26" y="42" width="48" height="13" rx="2"/>
                    <line x1="38" y1="42" x2="38" y2="55"/>
                    <line x1="50" y1="42" x2="50" y2="55"/>
                    <line x1="62" y1="42" x2="62" y2="55"/>
                    <rect x="34" y="60" width="32" height="9" rx="1"/>
                    <circle cx="29" cy="78" r="3"/>
                    <circle cx="71" cy="78" r="3"/>
                  </g>

                  <!-- DINING — table + 6 chairs -->
                  <g fill="none" stroke="#1a2a40" stroke-width="0.3">
                    <rect x="32" y="108" width="36" height="22" rx="1"/>
                    <circle cx="38" cy="105" r="2.4"/>
                    <circle cx="50" cy="105" r="2.4"/>
                    <circle cx="62" cy="105" r="2.4"/>
                    <circle cx="38" cy="133" r="2.4"/>
                    <circle cx="50" cy="133" r="2.4"/>
                    <circle cx="62" cy="133" r="2.4"/>
                  </g>

                  <!-- BATH (north) — toilet + vanity -->
                  <g fill="none" stroke="#1a2a40" stroke-width="0.3">
                    <ellipse cx="148" cy="50" rx="4" ry="5"/>
                    <rect x="142" y="55" width="12" height="3.5"/>
                    <rect x="160" y="44" width="22" height="8"/>
                    <circle cx="171" cy="48" r="1.2"/>
                  </g>

                  <!-- BED 2 — bed + nightstand + dresser -->
                  <g fill="none" stroke="#1a2a40" stroke-width="0.3">
                    <rect x="200" y="55" width="28" height="34" rx="2"/>
                    <rect x="201" y="56" width="26" height="10" rx="1"/>
                    <rect x="230" y="58" width="10" height="10"/>
                    <rect x="200" y="42" width="40" height="6"/>
                  </g>

                  <!-- BED 3 — bed + dresser -->
                  <g fill="none" stroke="#1a2a40" stroke-width="0.3">
                    <rect x="252" y="55" width="28" height="34" rx="2"/>
                    <rect x="253" y="56" width="26" height="10" rx="1"/>
                    <rect x="282" y="58" width="10" height="10"/>
                    <rect x="252" y="42" width="40" height="6"/>
                  </g>

                  <!-- KITCHEN — island + counter run -->
                  <g fill="none" stroke="#1a2a40" stroke-width="0.3">
                    <rect x="92"  y="103" width="62" height="14"/>
                    <line x1="106" y1="103" x2="106" y2="117"/>
                    <line x1="120" y1="103" x2="120" y2="117"/>
                    <line x1="138" y1="103" x2="138" y2="117"/>
                    <rect x="100" y="148" width="48" height="14"/>
                    <circle cx="112" cy="155" r="1.5"/>
                    <circle cx="118" cy="155" r="1.5"/>
                  </g>

                  <!-- MASTER — bed + nightstands + walk-in markers -->
                  <g fill="none" stroke="#1a2a40" stroke-width="0.3">
                    <rect x="180" y="115" width="50" height="36" rx="2"/>
                    <rect x="182" y="116" width="46" height="12" rx="1"/>
                    <rect x="170" y="118" width="8" height="10"/>
                    <rect x="232" y="118" width="8" height="10"/>
                    <rect x="174" y="158" width="60" height="12"/>
                  </g>

                  <!-- MASTER BATH — tub + sink + toilet -->
                  <g fill="none" stroke="#1a2a40" stroke-width="0.3">
                    <rect x="254" y="104" width="40" height="20" rx="3"/>
                    <ellipse cx="263" cy="135" rx="4.5" ry="5.5"/>
                    <rect x="258" y="140" width="11" height="3"/>
                    <rect x="276" y="132" width="20" height="14"/>
                    <circle cx="286" cy="139" r="1.4"/>
                    <rect x="254" y="156" width="40" height="14"/>
                  </g>

                  <!-- Stairs (in foyer) -->
                  <g fill="none" stroke="#1a2a40" stroke-width="0.3">
                    <rect x="100" y="55" width="22" height="36"/>
                    <line x1="100" y1="63" x2="122" y2="63"/>
                    <line x1="100" y1="71" x2="122" y2="71"/>
                    <line x1="100" y1="79" x2="122" y2="79"/>
                    <line x1="100" y1="87" x2="122" y2="87"/>
                    <path d="M 102 65 L 116 88" stroke-width="0.4"/>
                  </g>

                  <!-- Room labels -->
                  <g font-size="3.5" fill="#5a6478" text-anchor="middle" font-weight="600" letter-spacing="0.06em">
                    <text x="50"  y="68">LIVING</text>
                    <text x="50"  y="124">DINING</text>
                    <text x="50"  y="164">PORCH</text>
                    <text x="107" y="68">FOYER</text>
                    <text x="164" y="68">BATH</text>
                    <text x="220" y="68">BED 2</text>
                    <text x="273" y="68">BED 3</text>
                    <text x="120" y="138">KITCHEN</text>
                    <text x="205" y="138">MASTER</text>
                    <text x="275" y="138">BATH</text>
                  </g>
                  <!-- Sub-labels (sizes) -->
                  <g font-size="2.6" fill="#9aa3b1" text-anchor="middle">
                    <text x="50"  y="73">14'×12'</text>
                    <text x="120" y="143">240 SF</text>
                    <text x="205" y="143">320 SF</text>
                    <text x="220" y="73">12'×10'</text>
                    <text x="273" y="73">11'×10'</text>
                  </g>

                  <!-- North arrow (top-right corner of canvas) -->
                  <g transform="translate(286, 200)">
                    <circle r="7" fill="#fff" stroke="#5a6478" stroke-width="0.4"/>
                    <path d="M 0 -5 L 2.4 5 L 0 2.8 L -2.4 5 Z" fill="#1a4d8f"/>
                    <text x="0" y="-9" text-anchor="middle" font-size="3" fill="#1a4d8f" font-weight="700">N</text>
                  </g>

                  <!-- Title block (bottom left) -->
                  <g>
                    <line x1="20" y1="184" x2="120" y2="184" stroke="#5a6478" stroke-width="0.3"/>
                    <text x="20" y="194" font-size="3.5" fill="#1a4d8f" font-weight="700">A2.1 — FLOOR PLAN</text>
                    <text x="20" y="200" font-size="2.6" fill="#7d8898">SCALE 1/8" = 1'-0"</text>
                    <text x="20" y="205" font-size="2.6" fill="#7d8898">BROOKLINE RESIDENCE · LEVEL 02</text>
                    <text x="20" y="210" font-size="2.6" fill="#7d8898">REV 3 · 04/30/26</text>
                  </g>

                  <!-- Section markers (bubbles with letters indicating section cuts) -->
                  <g>
                    <circle cx="160" cy="184" r="3.5" fill="#fff" stroke="#1a2a40" stroke-width="0.4"/>
                    <text x="160" y="185" text-anchor="middle" font-size="3" fill="#1a2a40" font-weight="700">A</text>
                    <line x1="156" y1="184" x2="148" y2="184" stroke="#1a2a40" stroke-width="0.4"/>
                    <circle cx="220" cy="184" r="3.5" fill="#fff" stroke="#1a2a40" stroke-width="0.4"/>
                    <text x="220" y="185" text-anchor="middle" font-size="3" fill="#1a2a40" font-weight="700">B</text>
                    <line x1="216" y1="184" x2="208" y2="184" stroke="#1a2a40" stroke-width="0.4"/>
                  </g>
                </svg>
                <!-- Comment pins — colors map to the 4 collaborators only -->
                <div class="rv-pin a1" style="left: 22%; top: 32%"><span>1</span></div>
                <div class="rv-pin a2" style="left: 52%; top: 30%"><span>2</span></div>
                <div class="rv-pin a3" style="left: 38%; top: 64%"><span>3</span></div>
                <div class="rv-pin a1" style="left: 76%; top: 56%"><span>4</span></div>
                <div class="rv-pin a4" style="left: 90%; top: 70%"><span>5</span></div>
                <div class="rv-pin a2" style="left: 65%; top: 78%"><span>6</span></div>

                <div class="rv-canvas-controls">
                  <span class="ctrl-btn">−</span>
                  <span class="ctrl-btn">+</span>
                  <span class="pageno">1 of 3</span>
                  <span class="ctrl-btn">‹</span>
                  <span class="ctrl-btn">›</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Floating feature callouts — animate in after the main reveal -->
      <div class="callouts" id="callouts">
        <div class="callout callout--files">
          <div class="callout-h">
            <span>📁 Project Files</span>
            <span class="h-spacer"></span>
            <span class="upload-pill">Upload</span>
          </div>
          <div class="callout-files-grid">
            <div class="folder-card"></div>
            <div class="folder-card"></div>
            <div class="folder-card"></div>
            <div class="folder-card"></div>
          </div>
          <div class="dropzone-strip">Drop files here</div>
        </div>

        <div class="callout callout--collab">
          <div class="callout-h">Collaborators</div>
          <div class="collab-row">
            <span class="cav a1">EV</span>
            <div class="collab-info">
              <span class="cname">Eleanor Vance</span>
              <span class="crole">Architect</span>
            </div>
          </div>
          <div class="collab-row">
            <span class="cav a2">JV</span>
            <div class="collab-info">
              <span class="cname">Jill Valentine</span>
              <span class="crole">Interior Designer</span>
            </div>
          </div>
          <div class="collab-row">
            <span class="cav a3">MA</span>
            <div class="collab-info">
              <span class="cname">Marcus Allen</span>
              <span class="crole">Owner</span>
            </div>
          </div>
          <div class="collab-row">
            <span class="cav a4">DC</span>
            <div class="collab-info">
              <span class="cname">Daniel Chen</span>
              <span class="crole">Builder</span>
            </div>
          </div>
          <span class="collab-more">+ 3 more collaborators</span>
        </div>

        <div class="callout callout--ai">
          <div class="callout-h"><span class="ai-spark">✦</span> Renoverse AI</div>
          <div class="callout-ai-row"><span class="ai-arrow">↗</span> Suggest a reply</div>
          <div class="callout-ai-row"><span class="ai-arrow">↗</span> Summarize comments</div>
          <div class="callout-ai-row"><span class="ai-arrow">↗</span> List action items</div>
        </div>

        <div class="callout callout--overview">
          <div class="callout-h"><span class="ai-spark">✦</span> Overview</div>
          <div class="activity-banner">
            <span class="label">Activity Summary</span>
            <span class="bar w95"></span>
            <span class="bar w85"></span>
            <span class="bar w70"></span>
          </div>
          <div class="snapshot-card">
            <div class="h-row">
              <span class="badge-pill">Mention</span>
              <span class="meta">11:30am</span>
            </div>
            <span class="bar w90"></span>
            <span class="bar w75"></span>
            <span class="respond-btn">Respond to Eleanor</span>
          </div>
        </div>

        <div class="callout callout--projects">
          <div class="callout-h">Active Projects</div>
          <div class="callout-proj-row"><span class="pbar" style="width:80%"></span><span class="pbadge teal">Design</span></div>
          <div class="callout-proj-row"><span class="pbar" style="width:65%"></span><span class="pbadge purple">Discovery</span></div>
          <div class="callout-proj-row"><span class="pbar" style="width:75%"></span><span class="pbadge amber">Construction</span></div>
          <div class="callout-proj-row"><span class="pbar" style="width:55%"></span><span class="pbadge green">Complete</span></div>
        </div>
      </div>

      <div class="caption" id="caption">
        <h2>One workspace. Every detail.</h2>
      </div>
    </div>
  </section>
  <div class="stack-section__pin-tail" aria-hidden="true"></div>
`;

  function mount(target) {
    target.innerHTML = MARKUP;
    setupTimeline();
  }

  function setupTimeline() {
    gsap.registerPlugin(ScrollTrigger);

    /* ── Source panels start exploded.
       Five legacy tools (Excel, AutoCAD, Bluebeam, Finder, Gmail) fan out
       around the new combined app (Renoverse) which materializes at the snap. */
    const exploded = [
      { x:    0, y: -180, z: -300, rx:  16, ry:   2, rz:  4,  o: 0.5  }, // excel    (back-top center)
      { x: -290, y:  -90, z: -260, rx:  10, ry:  22, rz: -8,  o: 0.55 }, // autocad  (back-left)
      { x:  280, y:  -80, z: -210, rx:  -8, ry: -22, rz:  6,  o: 0.65 }, // bluebeam (back-right)
      { x:  190, y:  140, z: -100, rx:  -6, ry: -10, rz:  4,  o: 0.78 }, // finder   (front-right)
      { x: -200, y:  130, z:  -50, rx:   8, ry:  10, rz: -3,  o: 0.85 }, // gmail    (front-left)
    ];

    const allPanels = gsap.utils.toArray('#stackScene .panel');
    const sources = allPanels.slice(0, -1);   // the 5 legacy app panels
    const cal = allPanels[allPanels.length - 1]; // the Renoverse panel that materializes at the snap

    /* Initial state — sources exploded, calendar absent */
    sources.forEach((el, i) => {
      const p = exploded[i];
      gsap.set(el, {
        x: p.x, y: p.y, z: p.z,
        rotateX: p.rx, rotateY: p.ry, rotateZ: p.rz,
        opacity: p.o,
        transformPerspective: 1600,
      });
    });
    gsap.set(cal, {
      x: 0, y: 0, z: -20,
      rotateX: 0, rotateY: 0, rotateZ: 0,
      scale: 0.92,
      opacity: 0,
      filter: 'blur(6px)',
      transformPerspective: 1600,
    });

    /* Callouts start hidden, slightly nudged toward the center.
       Order in DOM: files, collab, ai, overview, projects */
    const callouts = gsap.utils.toArray('#callouts .callout');
    callouts.forEach((el, i) => {
      const dirs = [
        { dx:  40, dy:  20 }, // files     (top-left  → from inside-right)
        { dx: -40, dy:  20 }, // collab    (top-right → from inside-left)
        { dx: -40, dy: -20 }, // ai        (bottom-right → from inside-left/up)
        { dx: -40, dy:   0 }, // overview  (mid-right → from inside-left)
        { dx:  40, dy: -20 }, // projects  (bottom-left → from inside-right/up)
      ];
      const d = dirs[i] || { dx: 0, dy: 0 };
      gsap.set(el, {
        opacity: 0,
        scale: 0.85,
        x: d.dx,
        y: d.dy,
      });
    });

    /* Pin + drive with scroll. pinSpacing:false (no extra spacer) +
       end: 'bottom top' means the stage stays fixed for the section's
       full 200vh of scroll and unpins the moment the next section
       reaches the viewport top — no trailing white space. */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#stackSection',
        start: 'top top',
        end: 'bottom top',
        pin: '.stack-stage',
        pinSpacing: false,
        scrub: 0.2,
        anticipatePin: 1,
      }
    });

    /* Single continuous morph — sources converge AND fade to 0 in one
       motion (one tween per source, no separate dissolve), so opacity
       can't rebound. The previous version split this into a converge
       tween (→ 0.4) + a dissolve tween (→ 0) that ended 50ms apart;
       the converge tail pulled opacity back up to 0.4 right as the
       callouts tried to pop in, which read as "screens layering back
       on top." Calendar emerges through them; callouts arrive once
       sources are fully gone. */
    sources.forEach((el, i) => {
      const stagger = (sources.length - 1 - i) * 0.05;
      tl.to(el, {
        x: 0, y: 0, z: 30 + i * 5,
        rotateX: 0, rotateY: 0, rotateZ: 0,
        scale: 1.04,
        opacity: 0,
        duration: 1.0,
        ease: 'power2.inOut',
      }, stagger);
    });

    tl.to(cal, {
      z: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.1,
      ease: 'power2.inOut',
    }, 0.10);

    tl.to('#callouts .callout', {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.55,
      stagger: 0.07,
      ease: 'back.out(1.6)',
    }, 1.25);

    /* Caption is visible throughout the pinned scroll (set in CSS) —
       it grounds the concept while the morph plays underneath. */

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  function init() {
    const target = document.querySelector('[data-stack-animation]');
    if (target) mount(target);
  }
})();
