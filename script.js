// ============================================================
// NODE DATA – rich detail for side panel
// ============================================================
const NODE_DATA = {
  start: {
    title: '🚀 Start: User Brief',
    type: 'Trigger',
    color: '#10b981',
    description: 'The pipeline begins when a user submits a content brief. This is the entry point that captures all requirements before any agent is activated.',
    inputs: ['Content topic or goal', 'Target audience profile', 'Target keywords (optional)', 'Content type & channel', 'Tone & brand guidelines'],
    stats: [
      { label: 'Trigger Type', value: 'Manual / API' },
      { label: 'Avg. Time', value: '< 1 min' },
      { label: 'Output', value: 'Raw Brief' },
    ],
    notes: 'Briefs can be submitted via UI form, Slack command, or REST API webhook.',
  },
  brief: {
    title: '📋 Agent 1 — Brief Parser',
    type: 'Agent',
    color: '#7c3aed',
    description: 'The Brief Parser agent reads the raw user input and converts it into a structured JSON object. It validates completeness and flags missing fields before passing to downstream agents.',
    inputs: ['Raw user brief text', 'Template requirements', 'Historical brief patterns'],
    outputs: ['Structured Brief JSON', 'Validation report', 'Missing field flags'],
    stats: [
      { label: 'Model', value: 'GPT-4o / Claude 3.5' },
      { label: 'Avg. Time', value: '5–15 sec' },
      { label: 'Tool Use', value: 'Schema Validator' },
      { label: 'Memory', value: 'Short-term only' },
    ],
    tags: ['NLP', 'JSON Schema', 'Validation', 'Parsing'],
    notes: 'Uses a structured output mode to guarantee JSON conformance. Falls back to clarification request if confidence < 80%.',
  },
  d1: {
    title: '⟡ Decision — Brief Complete?',
    type: 'Decision Gate',
    color: '#f59e0b',
    description: 'Evaluates whether the parsed brief meets the minimum completeness threshold. All required fields must be present and coherent before proceeding.',
    conditions: [
      'Required fields present (topic, audience, type)',
      'Tone & format clearly specified',
      'At least 1 target keyword provided',
      'Goal / success metric defined',
    ],
    branches: [
      { label: 'YES → Research Agent', color: '#10b981', condition: 'All fields valid, confidence ≥ 80%' },
      { label: 'NO → Clarification Loop', color: '#ef4444', condition: 'Missing fields or ambiguous intent → ask user' },
    ],
    stats: [
      { label: 'Gate Type', value: 'Conditional' },
      { label: 'Max Retries', value: '3' },
      { label: 'Fallback', value: 'Human Escalation' },
    ],
  },
  research: {
    title: '🔍 Agent 2 — Research Agent',
    type: 'Agent',
    color: '#2563eb',
    description: 'The Research Agent performs autonomous web browsing, keyword analysis, and competitor research to gather the factual and strategic foundation for the content.',
    inputs: ['Structured Brief JSON', 'Target keywords', 'Competitor URLs (optional)'],
    outputs: ['Research report (MD)', 'Top 10 keywords + volumes', 'Competitor gap analysis', 'Supporting stats & quotes'],
    stats: [
      { label: 'Model', value: 'GPT-4o + Browsing' },
      { label: 'Avg. Time', value: '1–3 min' },
      { label: 'Tool Use', value: 'Serper, SEMrush, Firecrawl' },
      { label: 'Memory', value: 'RAG-backed' },
    ],
    tags: ['Web Search', 'SEO', 'RAG', 'Competitor Analysis', 'Trend Detection'],
    notes: 'Results are cached for 24h to avoid redundant API calls on similar briefs.',
  },
  strategy: {
    title: '🗂️ Agent 3 — Content Strategist',
    type: 'Agent',
    color: '#0891b2',
    description: 'Translates the research findings into a structured content blueprint. Creates the narrative architecture, section hierarchy, keyword mapping, and format specifications.',
    inputs: ['Research report', 'Structured Brief JSON', 'Channel specs'],
    outputs: ['Content outline (H1–H4)', 'Keyword placement map', 'Word count targets per section', 'Narrative arc & CTA plan'],
    stats: [
      { label: 'Model', value: 'Claude 3.5 Sonnet' },
      { label: 'Avg. Time', value: '20–45 sec' },
      { label: 'Tool Use', value: 'None (reasoning only)' },
      { label: 'Memory', value: 'Brief + Research' },
    ],
    tags: ['Strategy', 'Outline', 'SEO Architecture', 'Narrative Design'],
    notes: 'Applies content scoring rubric to self-evaluate outline quality before passing it on.',
  },
  d2: {
    title: '⟡ Decision — Strategy Approved?',
    type: 'Decision Gate',
    color: '#f59e0b',
    description: 'The strategist self-evaluates its own outline against the brief criteria. If confidence is low, the outline is revised before being passed to the writer.',
    conditions: [
      'All brief sections mapped to outline',
      'Primary keyword in H1 + first paragraph',
      'CTA placement defined',
      'Outline completeness score ≥ 80%',
    ],
    branches: [
      { label: 'YES → Writer Agent', color: '#10b981', condition: 'Self-score ≥ 80 and all sections mapped' },
      { label: 'NO → Revise Strategy', color: '#ef4444', condition: 'Score < 80 or missing sections → self-revise (max 2x)' },
    ],
    stats: [
      { label: 'Gate Type', value: 'Self-Evaluation' },
      { label: 'Max Retries', value: '2' },
      { label: 'Fallback', value: 'Human Review Flag' },
    ],
  },
  writer: {
    title: '✍️ Agent 4 — Writer Agent',
    type: 'Agent',
    color: '#059669',
    description: 'The core creative agent. Generates the full content draft following the approved outline, maintaining brand voice, embedding keywords naturally, and crafting compelling calls to action.',
    inputs: ['Approved outline', 'Research report', 'Brief JSON', 'Brand voice guide'],
    outputs: ['Full draft content (MD)', 'Internal links list', 'CTA variants (A/B)', 'Word count report'],
    stats: [
      { label: 'Model', value: 'GPT-4o / Claude 3.5' },
      { label: 'Avg. Time', value: '1–4 min' },
      { label: 'Tool Use', value: 'Grammarly API, brand DB' },
      { label: 'Memory', value: 'Full pipeline context' },
    ],
    tags: ['Creative Writing', 'SEO Copywriting', 'Brand Voice', 'Long-form', 'CTA'],
    notes: 'Uses chain-of-thought prompting section by section. Temperature set to 0.7 for creativity with control.',
  },
  editor: {
    title: '🔬 Agent 5 — Editor / QA Agent',
    type: 'Agent',
    color: '#d97706',
    description: 'Acts as a rigorous quality gate. Evaluates the draft across grammar, factual accuracy, SEO compliance, brand voice, and AI-detection metrics before scoring it.',
    inputs: ['Full draft', 'Research report (for fact-check)', 'Brief JSON (for compliance)', 'Brand guidelines'],
    outputs: ['Quality score (0–100)', 'Revision notes by section', 'SEO audit report', 'Plagiarism/AI-detection result'],
    stats: [
      { label: 'Model', value: 'GPT-4o + specialized tools' },
      { label: 'Avg. Time', value: '30–90 sec' },
      { label: 'Tool Use', value: 'Originality.ai, Clearscope' },
      { label: 'Scoring Rubric', value: '5 dimensions' },
    ],
    tags: ['QA', 'Fact-Check', 'SEO Audit', 'Grammar', 'AI Detection', 'Brand Compliance'],
    notes: 'Scoring dimensions: Clarity (20), SEO (20), Accuracy (20), Brand Voice (20), Engagement (20).',
  },
  d3: {
    title: '⟡ Decision — Quality Score ≥ 85?',
    type: 'Decision Gate',
    color: '#f59e0b',
    description: 'The quality gate. Only content scoring 85 or above moves to the publisher. Failing content is returned to the Writer with specific revision notes.',
    conditions: [
      'Total quality score ≥ 85 / 100',
      'No factual inaccuracies flagged',
      'AI-detection score < 30%',
      'SEO score ≥ 75',
    ],
    branches: [
      { label: 'YES → Publisher Agent', color: '#10b981', condition: 'Quality score ≥ 85 and all checks pass' },
      { label: 'NO → Return to Writer', color: '#ef4444', condition: 'Score < 85 → send revision notes to Writer (max 3 cycles)' },
    ],
    stats: [
      { label: 'Gate Type', value: 'Threshold' },
      { label: 'Min Score', value: '85 / 100' },
      { label: 'Max Cycles', value: '3' },
      { label: 'Hard Stop', value: 'Human review if 3 fails' },
    ],
  },
  publisher: {
    title: '📡 Agent 6 — Publisher Agent',
    type: 'Agent',
    color: '#dc2626',
    description: 'The final deployment agent. Transforms the approved content into platform-ready format, generates metadata, schedules or publishes, and sets up performance tracking.',
    inputs: ['Approved final draft', 'Brief JSON (channel specs)', 'Publishing schedule', 'Analytics config'],
    outputs: ['Published post / page URL', 'Social media snippets', 'Email newsletter version', 'UTM-tagged analytics links'],
    stats: [
      { label: 'Model', value: 'GPT-4o (light)' },
      { label: 'Avg. Time', value: '15–45 sec' },
      { label: 'Tool Use', value: 'CMS API, Buffer, Mailchimp' },
      { label: 'Channels', value: 'Blog, Social, Email' },
    ],
    tags: ['Publishing', 'CMS Integration', 'Social Media', 'Email', 'Analytics', 'Scheduling'],
    notes: 'Supports WordPress, Webflow, Ghost, LinkedIn, Twitter/X, and Mailchimp out of the box.',
  },
  d4: {
    title: '⟡ Decision — Performance Target Met?',
    type: 'Decision Gate',
    color: '#f59e0b',
    description: 'Monitors live performance metrics after publishing. If content underperforms, it triggers a re-optimization and republish cycle.',
    conditions: [
      'Page views ≥ target within 7 days',
      'Avg. time on page ≥ 2 min',
      'Bounce rate ≤ 60%',
      'Conversion / CTA click rate ≥ target',
    ],
    branches: [
      { label: 'YES → Archive & End', color: '#10b981', condition: 'All KPIs met within review window' },
      { label: 'NO → Re-optimize', color: '#ef4444', condition: 'KPIs missed → trigger SEO update + social reshare cycle' },
    ],
    stats: [
      { label: 'Review Window', value: '7 days post-publish' },
      { label: 'Monitoring', value: 'GA4 + Search Console' },
      { label: 'Re-optimize', value: 'Auto-trigger Writer + Publisher' },
    ],
  },
  end: {
    title: '🏁 Done — Content Live & Tracked',
    type: 'Terminal State',
    color: '#10b981',
    description: 'The pipeline completes. The content is live, performance is being tracked, and the brief is archived in the knowledge base for future reference and learning.',
    outputs: ['Published content URL', 'Performance dashboard link', 'Archived brief + learnings', 'Knowledge base update'],
    stats: [
      { label: 'State', value: 'Terminal' },
      { label: 'Next Step', value: 'Monitor & Iterate' },
      { label: 'Archive', value: 'Auto (knowledge base)' },
    ],
    notes: 'Completed briefs feed back into the Research Agent\'s RAG knowledge base to improve future runs.',
  },
};

// ============================================================
// SIMULATION SEQUENCE
// ============================================================
const SIM_STEPS = [
  { nodeId: 'n-brief',     statusId: 'status-brief',     progress: 1/6, label: '1 / 6 agents' },
  { nodeId: 'n-research',  statusId: 'status-research',   progress: 2/6, label: '2 / 6 agents' },
  { nodeId: 'n-strategy',  statusId: 'status-strategy',   progress: 3/6, label: '3 / 6 agents' },
  { nodeId: 'n-writer',    statusId: 'status-writer',     progress: 4/6, label: '4 / 6 agents' },
  { nodeId: 'n-editor',    statusId: 'status-editor',     progress: 5/6, label: '5 / 6 agents' },
  { nodeId: 'n-publisher', statusId: 'status-publisher',  progress: 6/6, label: '6 / 6 agents' },
];

// ============================================================
// DOM REFERENCES
// ============================================================
const canvasWrap   = document.getElementById('canvas-wrap');
const sidePanel    = document.getElementById('side-panel');
const panelTitle   = document.getElementById('panel-title');
const panelBody    = document.getElementById('panel-body');
const panelClose   = document.getElementById('panel-close');
const btnRun       = document.getElementById('btn-run');
const btnReset     = document.getElementById('btn-reset');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

let selectedNode   = null;
let simRunning     = false;
let simTimeouts    = [];

// ============================================================
// PANEL RENDER
// ============================================================
function renderPanel(dataId) {
  const data = NODE_DATA[dataId];
  if (!data) return;

  panelTitle.textContent = data.title;
  panelTitle.style.color = data.color;

  let html = '';

  html += `<div class="panel-section">
    <div class="panel-section-title">Description</div>
    <p class="panel-hint" style="color: var(--text-dim)">${data.description}</p>
  </div>`;

  if (data.type) {
    html += `<div class="panel-section">
      <div class="panel-stat" style="border-bottom: none; padding: 0">
        <span class="panel-stat-label">Node Type</span>
        <span class="panel-stat-value" style="color:${data.color}">${data.type}</span>
      </div>
    </div>`;
  }

  if (data.stats && data.stats.length) {
    html += `<div class="panel-section">
      <div class="panel-section-title">Statistics</div>`;
    data.stats.forEach(s => {
      html += `<div class="panel-stat">
        <span class="panel-stat-label">${s.label}</span>
        <span class="panel-stat-value">${s.value}</span>
      </div>`;
    });
    html += `</div>`;
  }

  if (data.inputs && data.inputs.length) {
    html += `<div class="panel-section">
      <div class="panel-section-title">Inputs</div>
      <div class="panel-list">`;
    data.inputs.forEach(i => { html += `<div class="panel-list-item">↳ ${i}</div>`; });
    html += `</div></div>`;
  }

  if (data.outputs && data.outputs.length) {
    html += `<div class="panel-section">
      <div class="panel-section-title">Outputs</div>
      <div class="panel-list">`;
    data.outputs.forEach(o => { html += `<div class="panel-list-item" style="border-color:rgba(56,189,248,0.2);background:rgba(56,189,248,0.05)">⇒ ${o}</div>`; });
    html += `</div></div>`;
  }

  if (data.conditions && data.conditions.length) {
    html += `<div class="panel-section">
      <div class="panel-section-title">Pass Conditions</div>
      <div class="panel-list">`;
    data.conditions.forEach(c => { html += `<div class="panel-list-item" style="border-color:rgba(245,158,11,0.25);background:rgba(245,158,11,0.06)">✓ ${c}</div>`; });
    html += `</div></div>`;
  }

  if (data.branches && data.branches.length) {
    html += `<div class="panel-section">
      <div class="panel-section-title">Branches</div>
      <div class="panel-list">`;
    data.branches.forEach(b => {
      html += `<div class="panel-list-item" style="border-color:${b.color}40;background:${b.color}10">
        <span style="color:${b.color};font-weight:700">${b.label}</span><br>
        <span style="font-size:12px;color:var(--text-muted);margin-top:4px;display:block">${b.condition}</span>
      </div>`;
    });
    html += `</div></div>`;
  }

  if (data.tags && data.tags.length) {
    html += `<div class="panel-section">
      <div class="panel-section-title">Tags</div>
      <div class="panel-tag-row">`;
    data.tags.forEach(t => { html += `<span class="panel-tag">${t}</span>`; });
    html += `</div></div>`;
  }

  if (data.notes) {
    html += `<div class="panel-section">
      <div class="panel-section-title">Implementation Notes</div>
      <p class="panel-hint" style="color:var(--text-dim);font-size:13px;background:rgba(255,255,255,0.03);padding:12px;border-radius:8px;border:1px solid var(--border)">${data.notes}</p>
    </div>`;
  }

  panelBody.innerHTML = html;
}

// ============================================================
// NODE CLICK HANDLER
// ============================================================
function openPanel(node) {
  const dataId = node.getAttribute('data-id');
  if (!dataId) return;

  // Deselect previous
  if (selectedNode && selectedNode !== node) {
    selectedNode.classList.remove('node-selected');
  }

  selectedNode = node;
  node.classList.add('node-selected');
  renderPanel(dataId);
  sidePanel.classList.add('open');
  canvasWrap.classList.add('panel-open');
}

function closePanel() {
  if (selectedNode) {
    selectedNode.classList.remove('node-selected');
    selectedNode = null;
  }
  sidePanel.classList.remove('open');
  canvasWrap.classList.remove('panel-open');
}

// Attach click listeners to all nodes
document.querySelectorAll('.node').forEach(node => {
  node.addEventListener('click', (e) => {
    e.stopPropagation();
    openPanel(node);
  });
});

panelClose.addEventListener('click', closePanel);
document.addEventListener('click', (e) => {
  if (!sidePanel.contains(e.target) && !e.target.closest('.node')) {
    closePanel();
  }
});

// ============================================================
// SIMULATION
// ============================================================
function clearSimulation() {
  simTimeouts.forEach(t => clearTimeout(t));
  simTimeouts = [];
  SIM_STEPS.forEach(step => {
    const node = document.getElementById(step.nodeId);
    const status = document.getElementById(step.statusId);
    if (node) node.classList.remove('node-active');
    if (status) { status.classList.remove('active', 'done'); }
  });
  progressFill.style.width = '0%';
  progressText.textContent = '0 / 6 agents';
  simRunning = false;
  btnRun.disabled = false;
  btnRun.textContent = '▶ Run Simulation';
}

function runSimulation() {
  if (simRunning) return;
  simRunning = true;
  btnRun.disabled = true;
  btnRun.textContent = '⟳ Running…';

  SIM_STEPS.forEach((step, idx) => {
    const delay = idx * 1600;

    // Activate
    const tActivate = setTimeout(() => {
      // Deactivate previous
      if (idx > 0) {
        const prev = SIM_STEPS[idx - 1];
        const prevNode = document.getElementById(prev.nodeId);
        const prevStatus = document.getElementById(prev.statusId);
        if (prevNode) prevNode.classList.remove('node-active');
        if (prevStatus) { prevStatus.classList.remove('active'); prevStatus.classList.add('done'); }
      }

      const node = document.getElementById(step.nodeId);
      const status = document.getElementById(step.statusId);
      if (node) { node.classList.add('node-active'); node.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      if (status) status.classList.add('active');

      // Update progress
      progressFill.style.width = `${step.progress * 100}%`;
      progressText.textContent = step.label;
    }, delay);

    simTimeouts.push(tActivate);

    // Final step: finish up
    if (idx === SIM_STEPS.length - 1) {
      const tDone = setTimeout(() => {
        const lastNode = document.getElementById(step.nodeId);
        const lastStatus = document.getElementById(step.statusId);
        if (lastNode) lastNode.classList.remove('node-active');
        if (lastStatus) { lastStatus.classList.remove('active'); lastStatus.classList.add('done'); }

        simRunning = false;
        btnRun.disabled = false;
        btnRun.textContent = '✓ Complete — Run Again';
      }, delay + 1400);
      simTimeouts.push(tDone);
    }
  });
}

btnRun.addEventListener('click', () => {
  clearSimulation();
  setTimeout(runSimulation, 50);
});
btnReset.addEventListener('click', clearSimulation);
