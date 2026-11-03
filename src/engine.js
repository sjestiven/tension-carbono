import { AVATAR_GENDERS, currentScenarioName } from './table_setup.js';

// Motor puro y determinista. Todas las decisiones pasan por applyAction.
export const VERSION = '3.2.0';
const GAME_VERSIONS = [VERSION, '3.1.0', '3.0.0', '2.2.0'];
const CURRENT_RULES = { rounds: 3, emissionsLimit: 1050, productionTarget: 1350, reductionHigh: 150, reductionMedium: 75, automaticVerification: true };
const LEGACY_RULES = { rounds: 4, emissionsLimit: 1400, productionTarget: 1800, reductionHigh: 200, reductionMedium: 100, automaticVerification: false };
export const gameRules = game => !game || game.version === VERSION ? CURRENT_RULES : LEGACY_RULES;
const FOUNDATION_BASELINE = 100;
export const COMPANIES = ['A', 'B', 'C'];
export const FOUNDATIONS = ['F1', 'F2'];
export const ROLES = ['Estado', ...COMPANIES, ...FOUNDATIONS];
export const INTENSITY = { A: .4, B: .5, C: .6 };
export const PRODUCTION = {
  100: { label: 'Bajo', income: 5000, cost: 3400 },
  150: { label: 'Medio', income: 7500, cost: 5000 },
  200: { label: 'Medio alto', income: 10000, cost: 6600 },
  250: { label: 'Alto', income: 12500, cost: 8400 },
  300: { label: 'Muy alto', income: 15000, cost: 10400 },
};
export const PROJECTS = {
  P1: { name: 'Eficiencia comunitaria', cost: 600, reduction: 20 },
  P2: { name: 'Captura de metano', cost: 1000, reduction: 40 },
};
export const DEFAULT_NAMES = { team: 'Valle Esmeralda', Estado: 'Estado', A: 'Empresa A', B: 'Empresa B', C: 'Empresa C', F1: 'Fundación Bosque', F2: 'Fundación Horizonte' };
export class RuleError extends Error { constructor(message) { super(message); this.name = 'RuleError'; } }
const fail = message => { throw new RuleError(message); };
const check = (condition, message) => { if (!condition) fail(message); };
const sum = (xs, f = x => x) => xs.reduce((s, x) => s + f(x), 0);
const round = n => Math.round((n + Number.EPSILON) * 100) / 100;
const clone = x => structuredClone(x);
function number(n, label, min = 0, max = 1e7, integer = false) {
  check(typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max && (!integer || Number.isInteger(n)), `${label}: valor no permitido.`);
  check(Math.abs(n * 100 - Math.round(n * 100)) < 1e-6, `${label}: admite como máximo dos decimales.`);
  return n;
}
function text(s, label, max = 80) { check(typeof s === 'string' && s.trim().length > 0 && s.length <= max, `${label}: texto requerido, máximo ${max} caracteres.`); return s.trim(); }
function draft(year) {
  return { year, phase: 'policy', tax: 25, subsidy: 0, published: false,
    projects: [], projectConfirmed: { F1: false, F2: false }, stateConfirmed: false,
    verified: { F1: null, F2: null }, production: { A: 200, B: 150, C: 150 },
    productionPlanned: { A: false, B: false, C: false }, marketFinished: { F1: false, F2: false },
    productionLocked: { A: false, B: false, C: false }, quotes: { F1: null, F2: null }, quoteMode: false,
    companyConfirmed: { A: false, B: false, C: false }, contracts: [],
    bidsSubmitted: { A: false, B: false, C: false }, salesFinished: { F1: false, F2: false }, quoteDeclared: { F1: false, F2: false },
    fundStart: 0, executed: [], };
}
export function createGame(setup = {}, version = VERSION) {
  check(GAME_VERSIONS.includes(version), 'Versión de reglas no compatible.');
  check(setup && typeof setup === 'object' && !Array.isArray(setup), 'Configuración inválida.');
  const names = {}, players = {}, studentCodes = {};
  for (const key of ['team', ...ROLES]) {
    const name = text(setup.names?.[key] ?? DEFAULT_NAMES[key], 'Nombre', 60);
    names[key] = currentScenarioName(key, name);
  }
  for (const key of ROLES) {
    const name = setup.players?.[key] ?? '';
    check(typeof name === 'string' && name.length <= 60, 'Nombre de participante inválido.');
    players[key] = name.trim();
    const code = setup.studentCodes?.[key] ?? '';
    check(typeof code === 'string' && code.trim().length <= 40, 'Código de estudiante inválido: máximo 40 caracteres.');
    studentCodes[key] = code.trim();
  }
  const avatarGenders = Object.fromEntries(ROLES.flatMap(role => {
    const choice = setup.avatarGenders?.[role];
    return typeof choice === 'string' && Object.hasOwn(AVATAR_GENDERS, choice) ? [[role, choice]] : [];
  }));
  const profile = {};
  if (Object.keys(avatarGenders).length) profile.avatarGenders = avatarGenders;
  if (setup.tableConfigured === true) profile.tableConfigured = true;
  return { version, setup: { names, players, studentCodes, ...profile }, history: [], actions: [], seq: 0,
    companies: Object.fromEntries(COMPANIES.map(e => [e, { cash: 5000, income: 0, profit: 0, emissions: 0, credits: 0, solvent: true }])),
    foundations: Object.fromEntries(FOUNDATIONS.map(f => [f, { cash: 1000, capacity: 0, reductions: 0, issued: 0, sold: 0, projects: [] }])),
    treasury: { fund: 0, general: 0, tax: 0, grants: 0, votes: 0, published: true },
    emissions: 0, production: 0, draft: draft(1), };
}
function phase(g, ...allowed) { check(allowed.includes(g.draft.phase), 'Esta decisión no corresponde a la etapa actual.'); }
function actor(a, ...roles) { check(roles.includes(a.actor), 'Este rol no puede realizar esa acción.'); }
function nextId(g, prefix) { return `${prefix}-${g.draft.year}-${++g.seq}`; }
export function projectDetails(g) {
  const d = g.draft;
  return FOUNDATIONS.map(f => {
    const projects = d.projects.filter(p => p.foundation === f).map(p => ({ ...p, ...PROJECTS[p.type], grant: round(PROJECTS[p.type].cost * d.subsidy / 100) }));
    const cost = sum(projects, p => p.cost), grant = sum(projects, p => p.grant);
    return { foundation: f, projects, cost, grant, capacity: g.foundations[f].capacity + sum(projects, p => p.reduction), cashAfter: round(g.foundations[f].cash + grant - cost) };
  });
}
function validateProjects(g, foundation) {
  const details = projectDetails(g);
  for (const x of details.filter(item => !foundation || item.foundation === foundation)) {
    check(x.capacity <= 100, `${x.foundation}: el máximo es 100 tCO₂e al año.`);
    check(x.cashAfter >= 0, `${x.foundation}: faltan USD ${(-x.cashAfter).toFixed(2)} para ejecutar antes de vender créditos.`);
  }
  if (!foundation) check(sum(details, x => x.grant) <= g.treasury.fund + 1e-6, 'Los convenios superan el fondo disponible. Ajusten proyectos o el porcentaje común de apoyo.');
  return details;
}
const live = c => c.status === 'pending' || c.status === 'accepted';
const accepted = c => c.status === 'accepted';
export const isBatchMarket = g => g.version !== '2.2.0';
export const isStreamlined = g => [VERSION, '3.1.0'].includes(g.version);
const committed = c => ['draft','pending','accepted'].includes(c.status);
export function batchMarketTurn(g) {
  const d = g.draft, order = d.year % 2 ? FOUNDATIONS : [...FOUNDATIONS].reverse();
  const seller = order.find(f => !d.marketFinished[f]);
  if (seller) return {role:seller,kind:'quote',next:(isStreamlined(g)?order.slice(order.indexOf(seller)+1).find(role=>lot(g,role)>0):order[order.indexOf(seller)+1]) || 'A'};
  const buyer = COMPANIES.find(e => !d.bidsSubmitted[e]);
  if (buyer) return {role:buyer,kind:'bids',next:COMPANIES[COMPANIES.indexOf(buyer)+1] || order.find(f=>d.contracts.some(c=>c.foundation===f&&['draft','pending'].includes(c.status))) || 'Docente'};
  const sales = order.find(f => !d.salesFinished[f]);
  if (sales) return {role:sales,kind:'sales',next:order.slice(order.indexOf(sales)+1).find(f=>!d.salesFinished[f]) || 'Docente'};
  return {role:'Docente',kind:'close',next:'Docente'};
}
function batchActor(g, role, kind) {
  const turn = batchMarketTurn(g);
  check(turn.role === role && turn.kind === kind, `Ahora corresponde ${turn.role}: ${turn.kind === 'bids' ? 'confirmar ofertas' : turn.kind === 'sales' ? 'decidir las ventas' : 'presentar cotización'}.`);
}
export function lot(g, f) { return g.draft.verified[f] ? g.foundations[f].capacity : 0; }
export function available(g, f) {
  if (g.draft.phase === 'results' && gameRules(g).automaticVerification) return 0;
  return lot(g, f) - sum(g.draft.contracts.filter(c => c.foundation === f && (isBatchMarket(g) ? accepted(c) : live(c))), c => c.quantity);
}
export function remaining(g, e) { return Math.floor(g.draft.production[e] * INTENSITY[e] * .5) - sum(g.draft.contracts.filter(c => c.company === e && (isBatchMarket(g) ? committed(c) : live(c))), c => c.quantity); }
export function companyView(g, e) {
  const d = g.draft, q = d.production[e], production = PRODUCTION[q];
  const cs = d.contracts.filter(c => c.company === e && accepted(c));
  const credits = sum(cs, c => c.quantity), spend = sum(cs, c => c.quantity * c.price);
  const emissions = q * INTENSITY[e], tax = round(d.tax * (emissions - credits));
  const profit = round(production.income - production.cost - spend - tax);
  // Los créditos ya se pagaron al aceptar el contrato; aquí no se descuentan otra vez.
  const closingCash = round(g.companies[e].cash + production.income - production.cost - tax);
  return { production: q, income: production.income, cost: production.cost, emissions, credits, spend: round(spend), tax, profit, closingCash };
}
function projectedPurchases(g,company,offers,excluded=offers) {
  const payment=round(sum(offers,offer=>offer.quantity*offer.price));
  const cashAfterPayment=round(g.companies[company].cash-payment);
  const projected=companyView({...g,
    companies:{...g.companies,[company]:{...g.companies[company],cash:cashAfterPayment}},
    draft:{...g.draft,contracts:[...g.draft.contracts.filter(contract=>!excluded.includes(contract)),...offers.map(offer=>({...offer,company,status:'accepted'}))]},
  },company);
  return {payment,cashAfterPayment,projected};
}
export function companyCommitment(g, company, additional = []) {
  const offers = [...g.draft.contracts.filter(c => c.company === company && ['draft','pending'].includes(c.status)), ...additional];
  const result=projectedPurchases(g,company,offers);
  // Benefits from unaccepted low-price offers cannot guarantee closing solvency.
  const adverse=offers.filter(offer=>offer.price>g.draft.tax);
  const worst=projectedPurchases(g,company,adverse,offers);
  return {...result,worstClosingCash:worst.projected.closingCash};
}
export function productionView(g, company, quantity, tax=g.draft.tax) {
  check(Object.hasOwn(PRODUCTION,quantity),'Producción no permitida.');
  return companyView({...g,draft:{...g.draft,tax,production:{...g.draft.production,[company]:+quantity}}},company);
}
export function policyIssues(g,tax=g.draft.tax) {
  if (!isBatchMarket(g)) return [];
  return COMPANIES.filter(company=>!Object.keys(PRODUCTION).some(quantity=>productionView(g,company,quantity,tax).closingCash>=0)).map(company=>`${g.setup.names[company]} no tiene ningún nivel de producción viable con esta tarifa y su caja actual. Reduce el impuesto antes de publicar.`);
}
export function purchasePreview(g, company, {foundation,quantity,price,contractId=null}) {
  const baseline = companyView(g,company), pending = g.draft.contracts.find(c => c.id === contractId && c.company === company && c.foundation === foundation && c.status === 'pending');
  const source = pending ? {...g,draft:{...g.draft,contracts:g.draft.contracts.filter(c => c !== pending)}} : g;
  const validPrice = typeof price === 'number' && Number.isFinite(price) && price >= 0 && price <= 10000 && Math.abs(price*100-Math.round(price*100)) < 1e-6;
  const maximum = FOUNDATIONS.includes(foundation) ? Math.max(0,Math.min(100,available(source,foundation),remaining(source,company))) : 0;
  const projection = count => {
    const offer = {company,foundation,quantity:count,price};
    if (isBatchMarket(g)) return companyCommitment(source,company,[offer]);
    return projectedPurchases(source,company,[offer]);
  };
  const affordable = value => value.cashAfterPayment >= 0 && (value.worstClosingCash ?? value.projected.closingCash) >= 0;
  let maxQuantity = 0;
  if (validPrice) for (let count=1;count<=maximum;count++) if (affordable(projection(count))) maxQuantity=count;
  const issues = [];
  if (!FOUNDATIONS.includes(foundation)) issues.push('Selecciona una fundación.');
  if (!validPrice) issues.push('Introduce un precio válido entre USD 0 y 10.000.');
  const validQuantity = Number.isInteger(quantity) && quantity >= 1 && quantity <= 100;
  if (!validQuantity) issues.push('Introduce una cantidad entera de 1 a 100 créditos.');
  if (validQuantity && quantity > maximum) issues.push(`El máximo por inventario y compensación es ${maximum} créditos.`);
  const result = validPrice && validQuantity ? projection(quantity) : null;
  if (result?.cashAfterPayment < 0) issues.push('La caja disponible no alcanza para pagar las ofertas al contado.');
  if (result && (result.worstClosingCash ?? result.projected.closingCash) < 0) issues.push('La caja al cierre sería negativa en alguna combinación de aceptaciones. Reduce cantidad o precio.');
  const before = isBatchMarket(g) ? companyCommitment(source,company).projected : baseline;
  return {valid:!issues.length,issues,baseline,...result,maxQuantity,maximum,payment:validPrice&&validQuantity?round(quantity*price):null,taxSavings:result?round(before.tax-result.projected.tax):null,profitChange:result?round(result.projected.profit-before.profit):null};
}
export function climateStatus(g) {
  const { emissionsLimit, rounds } = gameRules(g);
  const ratio = g.emissions / emissionsLimit;
  return {ratio:Math.max(0,Math.min(1,ratio)),remaining:round(Math.max(0,emissionsLimit-g.emissions)),band:ratio>1?'defeat':ratio>=.9?'red':ratio>=.75?'terracotta':ratio>=.5?'ochre':'green',reference:emissionsLimit/rounds*g.draft.year,projected:previewRound(g).cumulative};
}

export function emissionsByRole(game, result) {
  const years = result ? 1 : game.history.length;
  const companies = result?.companies ?? game.companies;
  const foundations = result?.foundations ?? game.foundations;
  return Object.fromEntries(ROLES.map(role => {
    if (role === 'Estado') return [role, { emissions: 0, baseline: 0, reductions: 0 }];
    if (COMPANIES.includes(role)) return [role, { emissions: round(companies[role].emissions), baseline: 0, reductions: 0 }];
    const baseline = FOUNDATION_BASELINE * years;
    const reductions = result ? foundations[role].reduction : foundations[role].reductions;
    return [role, { emissions: baseline - reductions, baseline, reductions }];
  }));
}
export function previewRound(g) {
  const companies = Object.fromEntries(COMPANIES.map(e => [e, companyView(g, e)]));
  const foundations = Object.fromEntries(FOUNDATIONS.map(f => [f, { reduction: lot(g, f), sold: sum(g.draft.contracts.filter(c => c.foundation === f && accepted(c)), c => c.quantity), cash: g.foundations[f].cash }]));
  const gross = sum(Object.values(companies), x => x.emissions), reduction = sum(Object.values(foundations), x => x.reduction);
  const tax = sum(Object.values(companies), x => x.tax), emissions = gross + FOUNDATIONS.length * FOUNDATION_BASELINE - reduction;
  return { companies, foundations, gross, reduction, emissions, cumulative: g.emissions + emissions, tax: round(tax), production: sum(Object.values(companies), x => x.production), credits: sum(Object.values(companies), x => x.credits), reserve: round(tax * .3) };
}
export function automaticRatings(g, result = previewRound(g)) {
  const transparent = g.draft.published;
  const fair = g.draft.executed.every(p => p.grant === round(PROJECTS[p.type].cost * g.draft.subsidy / 100));
  const goal = 350 * g.draft.year;
  return Object.fromEntries([...COMPANIES, ...FOUNDATIONS].map(r => {
    const criteria = COMPANIES.includes(r) ? [
      { name: 'Transparencia', passed: transparent, evidence: 'Tarifa y criterio publicados antes de ejecutar.' },
      { name: 'Trayectoria ambiental', passed: result.cumulative <= goal, evidence: `${result.cumulative} de ${goal} tCO₂e acumuladas en el año ${g.draft.year}.` },
      { name: 'Viabilidad empresarial', passed: result.companies[r].profit >= 0 && result.companies[r].closingCash >= 0, evidence: `Utilidad anual USD ${result.companies[r].profit}; caja USD ${result.companies[r].closingCash}.` },
    ] : [
      { name: 'Transparencia', passed: transparent, evidence: 'Tarifa y criterio publicados antes de ejecutar.' },
      { name: 'Trato común', passed: fair, evidence: `Todos los convenios aplican el ${g.draft.subsidy}% común publicado.` },
      { name: 'Impulso a proyectos', passed: result.foundations[r].reduction >= 20 * g.draft.year, evidence: `${result.foundations[r].reduction} de ${20 * g.draft.year} tCO₂e verificadas como meta anual de esta fundación.` },
    ];
    const count = criteria.filter(c => c.passed).length;
    return [r, { value: count === 3 ? 1 : count === 2 ? 0 : -1, criteria }];
  }));
}
export function policyReview(g,result=g.history.at(-1)) {
  if (!result) return null;
  const { rounds } = gameRules(g);
  const ratingTotal=sum(Object.values(result.ratings),item=>item.value);
  return {onPath:result.cumulative<=350*result.year,reference:350*result.year,
    losing:COMPANIES.filter(role=>result.companies[role].profit<0),
    lagging:FOUNDATIONS.filter(role=>result.foundations[role].reduction<20*result.year),
    ratingTotal,scoreDelta:ratingTotal*2/rounds};
}
function assertMarket(g) {
  check(!g.draft.contracts.some(c => ['draft','pending'].includes(c.status)), 'Hay ofertas pendientes. Acéptenlas o rechácenlas antes de cerrar.');
  for (const e of COMPANIES) {
    const v = companyView(g, e);
    check(v.credits <= .5 * v.emissions, `${e}: créditos superiores al 50% de sus emisiones.`);
    check(v.closingCash >= 0, `${e}: caja final negativa. Revisen producción o contratos.`);
  }
  for (const f of FOUNDATIONS) check(sum(g.draft.contracts.filter(c => c.foundation === f && accepted(c)), c => c.quantity) <= lot(g, f), 'No se pueden vender créditos sin verificar.');
}
export function isGameOver(game) {
  const { emissionsLimit, rounds } = gameRules(game);
  return game.emissions > emissionsLimit || (game.history.length >= rounds && game.draft.phase === 'results');
}
export function applyAction(original, action) {
  check(action?.origin!=='system','Los avances automáticos se generan dentro del motor.');
  let game=transition(original,action);
  if (!isStreamlined(game)) return game;
  for(let step=0;step<24;step++) {
    const automatic=automaticAction(game);
    if(!automatic)return game;
    game=transition(game,{...automatic,origin:'system'});
  }
  fail('No se pudo completar el avance automático.');
}
function automaticAction(g) {
  if(isGameOver(g))return null;
  const d=g.draft;
  if(d.phase==='projects'&&!d.stateConfirmed&&COMPANIES.every(role=>d.productionPlanned[role])&&FOUNDATIONS.every(role=>d.projectConfirmed[role])) {
    try { if(validateProjects(g).every(item=>item.grant===0))return {type:'confirmGrants',actor:'Estado'}; } catch { return null; }
  }
  if (gameRules(g).automaticVerification) {
    if (d.phase === 'projects' && d.stateConfirmed && COMPANIES.every(role => d.productionLocked[role]) && FOUNDATIONS.every(role => d.projectConfirmed[role])) {
      return { type:'execute', actor:'Docente' };
    }
    if (d.phase === 'verification') {
      const foundation = FOUNDATIONS.find(role => d.verified[role] === null);
      return foundation ? { type:'verify', actor:'Docente', foundation, verified:g.foundations[foundation].capacity > 0 }
        : { type:'openMarket', actor:'Docente' };
    }
  }
  if(d.phase!=='market')return null;
  const turn=batchMarketTurn(g);
  if(turn.kind==='quote'&&lot(g,turn.role)===0)return {type:d.quoteDeclared[turn.role]?'finishFoundationTurn':'publishQuote',actor:turn.role,...(!d.quoteDeclared[turn.role]?{price:null}:{})};
  if(turn.kind==='bids'&&FOUNDATIONS.every(role=>lot(g,role)===0))return {type:'submitBids',actor:turn.role};
  if(turn.kind==='sales'&&(!d.contracts.some(contract=>contract.foundation===turn.role&&contract.status==='pending')||available(g,turn.role)===0))return {type:'finishSales',actor:turn.role};
  if(turn.kind==='close')return {type:'close',actor:'Docente'};
  return null;
}
export function committedFrames(before,after) {
  let state=before;
  return after.actions.slice(before.actions.length).map(action=>{
    const frame={action,year:state.draft.year,phase:state.draft.phase,before:state};
    state=transition(state,action);
    frame.after=state;
    return frame;
  });
}
export function transactionEffects(before,after) {
  const effects=[];
  for(const frame of committedFrames(before,after)) {
    const action=frame.action;
    if(action.type==='accept'||action.type==='cancel') {
      const contract=(action.type==='accept'?frame.after:frame.before).draft.contracts.find(item=>item.id===action.id&&item.status==='accepted');
      if(contract)effects.push({kind:action.type==='accept'?'purchase':'refund',from:action.type==='accept'?contract.company:contract.foundation,to:action.type==='accept'?contract.foundation:contract.company,quantity:contract.quantity,amount:round(Math.abs(frame.before.companies[contract.company].cash-frame.after.companies[contract.company].cash))});
    }
    if(action.type==='execute')for(const foundation of FOUNDATIONS) {
      const projects=frame.after.draft.executed.filter(project=>project.foundation===foundation);
      const grant=sum(projects,project=>project.grant);
      if(grant>0)effects.push({kind:'grant',from:'Estado',to:foundation,amount:grant});
      if(projects.length)effects.push({kind:'project',from:foundation,to:foundation,count:projects.length,amount:sum(projects,project=>PROJECTS[project.type].cost)});
    }
    if(action.type==='close') {
      const result=frame.after.history.at(-1);
      for(const company of COMPANIES)if(result.companies[company].tax>0)effects.push({kind:'tax',from:company,to:'Estado',amount:result.companies[company].tax});
      effects.push({kind:'climate',from:'Estado',to:'Estado',year:result.year,tax:result.tax,reserve:result.reserve,cumulative:result.cumulative});
    }
  }
  return effects;
}
function transition(original, action, legacyReplay = false) {
  check(action && typeof action === 'object' && !Array.isArray(action), 'Acción inválida.');
  check(typeof action.type === 'string', 'Acción sin tipo.');
  check(ROLES.includes(action.actor) || action.actor === 'Docente', 'Rol desconocido.');
  check(legacyReplay || !isGameOver(original), 'La partida ya terminó. Revisa los resultados o reinicia desde el inicio.');
  const g = clone(original), a = clone(action), d = g.draft;
  switch (a.type) {
    case 'policy':
      phase(g, 'policy'); actor(a, 'Estado');
      d.tax = number(a.tax, 'Tarifa', 20, 40, true);
      d.subsidy = number(a.subsidy, 'Apoyo público', 0, 50, true);
      break;
    case 'publish':
      phase(g, 'policy'); actor(a, 'Estado');
      check(!policyIssues(g).length,policyIssues(g).join(' '));
      d.published = true; d.phase = 'projects'; d.fundStart = g.treasury.fund;
      break;
    case 'subsidy':
      phase(g, 'projects'); actor(a, 'Estado');
      d.subsidy = number(a.subsidy, 'Apoyo público', 0, 50, true);
      d.projectConfirmed = { F1: false, F2: false }; d.stateConfirmed = false;
      break;
    case 'addProject': {
      phase(g, 'projects'); actor(a, ...FOUNDATIONS);
      check(Object.hasOwn(PROJECTS, a.project), 'Proyecto desconocido.');
      const capacity = g.foundations[a.actor].capacity + sum(d.projects.filter(p => p.foundation === a.actor), p => PROJECTS[p.type].reduction) + PROJECTS[a.project].reduction;
      check(capacity <= 100, 'La capacidad máxima es 100 tCO₂e por fundación y año.');
      d.projects.push({ id: nextId(g, 'P'), foundation: a.actor, type: a.project });
      d.projectConfirmed[a.actor] = false; d.stateConfirmed = false;
      break;
    }
    case 'removeProject': {
      phase(g, 'projects'); actor(a, ...FOUNDATIONS);
      const p = d.projects.find(p => p.id === a.id);
      check(p && p.foundation === a.actor, 'Solo la fundación puede retirar su proyecto.');
      d.projects = d.projects.filter(p => p.id !== a.id);
      d.projectConfirmed[a.actor] = false; d.stateConfirmed = false;
      break;
    }
    case 'confirmProjects':
      phase(g, 'projects'); actor(a, ...FOUNDATIONS); validateProjects(g, a.actor);
      d.projectConfirmed[a.actor] = true;
      break;
    case 'confirmGrants':
      phase(g, 'projects'); actor(a, 'Estado'); validateProjects(g); d.stateConfirmed = true;
      break;
    case 'execute': {
      phase(g, 'projects'); actor(a, 'Docente');
      if (isBatchMarket(g)) check(COMPANIES.every(company=>d.productionLocked[company]),'Las tres empresas deben confirmar su producción antes de ejecutar.');
      const missing = [...FOUNDATIONS.filter(f => !d.projectConfirmed[f]), ...(!d.stateConfirmed ? ['Estado'] : [])];
      check(!missing.length, `Faltan firmas: ${missing.map(r => g.setup.names[r]).join(', ')}. Cada participante debe confirmar su plan o los convenios.`);
      const details = validateProjects(g);
      for (const x of details) {
        const f = g.foundations[x.foundation];
        f.cash = x.cashAfter; f.capacity = x.capacity;
        const projects = x.projects.map(p => ({ id: p.id, foundation: x.foundation, type: p.type, grant: p.grant, year: d.year }));
        f.projects.push(...projects); d.executed.push(...projects);
      }
      const total = round(sum(details, x => x.grant));
      g.treasury.fund = round(g.treasury.fund - total); g.treasury.grants = round(g.treasury.grants + total);
      d.phase = 'verification';
      break;
    }
    case 'verify':
      phase(g, 'verification'); actor(a, 'Docente');
      check(FOUNDATIONS.includes(a.foundation) && typeof a.verified === 'boolean', 'Verificación inválida.');
      d.verified[a.foundation] = a.verified;
      break;
    case 'openMarket':
      phase(g, 'verification'); actor(a, 'Docente');
      check(FOUNDATIONS.every(f => typeof d.verified[f] === 'boolean'), `Verifique o rechace el lote de: ${FOUNDATIONS.filter(f => typeof d.verified[f] !== 'boolean').map(f => g.setup.names[f]).join(', ')}.`);
      d.phase = 'market';
      break;
    case 'production': {
      phase(g, 'projects', 'market'); actor(a, ...COMPANIES);
      check(!isBatchMarket(g) || d.phase === 'projects', 'La producción solo se elige antes de abrir el mercado.');
      check(!d.productionLocked[a.actor], 'La producción ya está confirmada y no puede cambiar durante este año. Puedes revisar contratos, cantidades y precios antes del cierre.');
      check(typeof a.quantity === 'number' && Object.hasOwn(PRODUCTION, a.quantity), 'Producción no permitida.');
      const used = sum(d.contracts.filter(c => c.company === a.actor && live(c)), c => c.quantity);
      check(used <= a.quantity * INTENSITY[a.actor] * .5, 'La nueva producción deja contratos por encima del 50%. Cancélelos primero.');
      d.production[a.actor] = a.quantity; d.companyConfirmed[a.actor] = false;
      if (d.phase === 'projects') d.productionPlanned[a.actor] = false;
      break;
    }
    case 'confirmProduction':
      phase(g, 'projects'); actor(a, ...COMPANIES);
      if (isBatchMarket(g)) check(companyView(g,a.actor).closingCash>=0,'Elige una producción con caja al cierre no negativa sin depender de compras de créditos todavía no garantizadas.');
      check(!Object.hasOwn(a, 'lock') || typeof a.lock === 'boolean', 'Confirmación de producción inválida.');
      d.productionPlanned[a.actor] = true;
      // Older action logs omit lock and retain their original replay behavior.
      d.productionLocked[a.actor] ||= isBatchMarket(g) || a.lock === true;
      break;
    case 'publishQuote':
      phase(g, 'market'); actor(a, ...FOUNDATIONS);
      if (isBatchMarket(g)) batchActor(g,a.actor,'quote');
      check(a.price === null || lot(g, a.actor) > 0, 'No hay un lote verificado para cotizar.');
      d.quotes[a.actor] = a.price === null ? null : { price: number(a.price, 'Precio de cotización', 0, 10000) };
      d.quoteDeclared[a.actor]=true;
      d.quoteMode = true;
      break;
    case 'finishFoundationTurn':
      phase(g, 'market'); actor(a, ...FOUNDATIONS);
      if (isBatchMarket(g)) { batchActor(g,a.actor,'quote'); check(d.quoteDeclared[a.actor],'Publica o declina tu cotización antes de continuar.'); }
      check(!d.contracts.some(c => c.foundation === a.actor && c.status === 'pending'), 'Primero debe responder la contraparte de la oferta pendiente.');
      d.marketFinished[a.actor] = true;
      break;
    case 'reopenNegotiation':
      phase(g, 'market'); actor(a, 'Docente');
      check(!isBatchMarket(g), 'Las ofertas confirmadas y los contratos son vinculantes. No se reabre este mercado.');
      d.marketFinished = { F1: false, F2: false };
      d.companyConfirmed = { A: false, B: false, C: false };
      break;
    case 'propose': {
      phase(g, 'market');
      if (isBatchMarket(g)) { batchActor(g,a.actor,'bids'); check(a.actor===a.company,'Solo la empresa presenta su oferta de compra.'); }
      check(!d.quoteMode || FOUNDATIONS.every(f => d.marketFinished[f]), 'Ambas fundaciones deben presentar o declinar su cotización antes de comenzar las compras.');
      check(COMPANIES.includes(a.company) && FOUNDATIONS.includes(a.foundation), 'Contrapartes desconocidas.');
      actor(a, a.company, a.foundation);
      number(a.quantity, 'Créditos', 1, 100, true); number(a.price, 'Precio', 0, 10000);
      check(!Object.hasOwn(a, 'advance') && (!Object.hasOwn(a, 'anticipo') || a.anticipo === 0), 'Los anticipos están deshabilitados.');
      check(a.quantity <= available(g, a.foundation), 'La cantidad supera el lote verificado disponible.');
      check(a.quantity <= remaining(g, a.company), 'La cantidad supera el 50% disponible de la empresa.');
      if (isBatchMarket(g)) {
        const commitment=companyCommitment(g,a.company,[a]);
        check(commitment.cashAfterPayment>=0,'La caja no alcanza para pagar todas las ofertas al contado.');
        check(commitment.worstClosingCash>=0,'Las ofertas dejarían la caja al cierre negativa en alguna combinación de aceptaciones.');
      }
      d.contracts.push({ id: nextId(g, 'C'), lot: `L-${d.year}-${a.foundation}`, company: a.company, foundation: a.foundation, quantity: a.quantity, price: a.price, proposer: a.actor, status: isBatchMarket(g)?'draft':'pending' });
      d.companyConfirmed[a.company] = false;
      break;
    }
    case 'accept': {
      phase(g, 'market');
      if (isBatchMarket(g)) batchActor(g,a.actor,'sales');
      const c = d.contracts.find(c => c.id === a.id);
      check(c?.status === 'pending', 'La oferta ya no está pendiente.');
      actor(a, c.proposer === c.company ? c.foundation : c.company);
      check(c.quantity<=available(g,c.foundation)+(isBatchMarket(g)?0:c.quantity),'No queda inventario suficiente para aceptar esta oferta completa.');
      const total = round(c.quantity * c.price);
      check(g.companies[c.company].cash >= total, 'La empresa no tiene caja para pagar al contado. Negocien cantidad o precio.');
      c.status = 'accepted';
      g.companies[c.company].cash = round(g.companies[c.company].cash - total);
      g.foundations[c.foundation].cash = round(g.foundations[c.foundation].cash + total);
      check(companyView(g, c.company).closingCash >= 0, 'La compra deja caja final negativa. Revise el acuerdo.');
      d.companyConfirmed[c.company] = false;
      break;
    }
    case 'cancel': {
      phase(g, 'market');
      const c = d.contracts.find(c => c.id === a.id);
      if (isBatchMarket(g)) {
        check(c && ['draft','pending'].includes(c.status),'El contrato aceptado es definitivo y no se puede anular.');
        if (c.status==='draft') {actor(a,c.company);batchActor(g,a.actor,'bids');c.status='cancelled';}
        else {actor(a,c.foundation);batchActor(g,a.actor,'sales');c.status='rejected';}
        break;
      }
      check(c && live(c), 'Contrato no disponible.'); actor(a, c.company, c.foundation);
      if (accepted(c)) {
        const total = round(c.quantity * c.price);
        check(g.foundations[c.foundation].cash >= total, 'La fundación no tiene caja para devolver el contrato.');
        g.foundations[c.foundation].cash = round(g.foundations[c.foundation].cash - total);
        g.companies[c.company].cash = round(g.companies[c.company].cash + total);
      }
      c.status = 'cancelled'; d.companyConfirmed[c.company] = false;
      break;
    }
    case 'submitBids': {
      phase(g,'market');actor(a,...COMPANIES);check(isBatchMarket(g),'Acción exclusiva del mercado por etapas.');batchActor(g,a.actor,'bids');
      const commitment=companyCommitment(g,a.actor);
      check(commitment.cashAfterPayment>=0 && commitment.worstClosingCash>=0,'Revisa las ofertas: no pueden dejar caja negativa en ninguna combinación de aceptaciones.');
      check(remaining(g,a.actor)>=0,'Las ofertas superan el límite de compensación.');
      for (const c of d.contracts.filter(c=>c.company===a.actor && c.status==='draft')) c.status='pending';
      d.bidsSubmitted[a.actor]=true;
      if (COMPANIES.every(company=>d.bidsSubmitted[company])) {
        for (const foundation of FOUNDATIONS) if (!d.contracts.some(c=>c.foundation===foundation&&c.status==='pending')) d.salesFinished[foundation]=true;
        if (FOUNDATIONS.every(foundation=>d.salesFinished[foundation])) d.companyConfirmed={A:true,B:true,C:true};
      }
      break;
    }
    case 'finishSales':
      phase(g,'market');actor(a,...FOUNDATIONS);check(isBatchMarket(g),'Acción exclusiva del mercado por etapas.');batchActor(g,a.actor,'sales');
      for (const c of d.contracts.filter(c=>c.foundation===a.actor && c.status==='pending')) c.status='rejected';
      d.salesFinished[a.actor]=true;
      if (FOUNDATIONS.every(f=>d.salesFinished[f])) d.companyConfirmed={A:true,B:true,C:true};
      break;
    case 'confirmCompany':
      phase(g, 'market'); actor(a, ...COMPANIES);
      check(!isBatchMarket(g),'En este mercado confirma tus ofertas antes de las ventas.');
      check(!d.contracts.some(c => c.company === a.actor && c.status === 'pending'), 'Resuelva sus ofertas pendientes.');
      check(companyView(g, a.actor).closingCash >= 0, 'La empresa quedaría con caja negativa.');
      d.companyConfirmed[a.actor] = true;
      break;
    case 'close': {
      phase(g, 'market'); actor(a, 'Docente');
      if (isBatchMarket(g)) check(FOUNDATIONS.every(f=>d.salesFinished[f]),'Ambas fundaciones deben finalizar las ventas.');
      check(COMPANIES.every(e => d.companyConfirmed[e]), `Falta confirmar las decisiones de: ${COMPANIES.filter(e => !d.companyConfirmed[e]).map(e => g.setup.names[e]).join(', ')}.`);
      assertMarket(g);
      const result = previewRound(g), ratings = automaticRatings(g, result);
      for (const e of COMPANIES) {
        const x = result.companies[e], s = g.companies[e];
        s.cash = x.closingCash; s.income += x.income; s.profit = round(s.profit + x.profit);
        s.emissions += x.emissions; s.credits += x.credits; s.solvent &&= s.cash >= 0;
      }
      for (const f of FOUNDATIONS) {
        const s = g.foundations[f], x = result.foundations[f];
        s.reductions += x.reduction; s.issued += x.reduction; s.sold += x.sold;
      }
      g.treasury.fund = round(g.treasury.fund + result.reserve);
      g.treasury.general = round(g.treasury.general + result.tax - result.reserve);
      g.treasury.tax = round(g.treasury.tax + result.tax);
      g.treasury.votes += sum(Object.values(ratings), r => r.value);
      g.treasury.published &&= d.published;
      g.emissions = result.cumulative; g.production += result.production;
      g.history.push({ year: d.year, ...result, taxRate: d.tax, subsidy: d.subsidy, projects: clone(d.executed), contracts: clone(d.contracts.filter(accepted)), verified: clone(d.verified), ratings, fund: g.treasury.fund });
      d.phase = 'results';
      break;
    }
    case 'next':
      phase(g, 'results'); actor(a, 'Docente'); check(d.year < gameRules(g).rounds, 'La partida ya terminó.');
      g.draft = draft(d.year + 1); g.draft.tax = d.tax; g.draft.subsidy = d.subsidy;
      break;
    default: fail('Acción desconocida.');
  }
  g.actions.push(a);
  return g;
}
export function scores(g) {
  const { rounds, emissionsLimit, productionTarget, reductionHigh, reductionMedium } = gameRules(g);
  check(isGameOver(g), 'Los puntos finales se calculan al terminar las rondas o tras una derrota ambiental.');
  const climate = g.emissions <= emissionsLimit, out = {};
  for (const e of COMPANIES) {
    const s = g.companies[e], margin = s.income ? s.profit / s.income : 0, coverage = s.emissions ? s.credits / s.emissions : 0;
    const components = [margin >= .1 - 1e-9 ? 40 : margin >= .05 - 1e-9 ? 25 : margin > 0 ? 10 : 0,
      coverage >= .4 - 1e-9 ? 40 : coverage >= .25 - 1e-9 ? 30 : coverage > 0 ? 5 : 0, s.solvent ? 20 : 0];
    out[e] = { points: sum(components), components, margin, coverage, victory: climate && sum(components) >= 70 };
  }
  for (const f of FOUNDATIONS) {
    const s = g.foundations[f], fraction = s.issued ? s.sold / s.issued : 0;
    const components = [s.reductions >= reductionHigh ? 40 : s.reductions >= reductionMedium ? 25 : s.reductions > 0 ? 10 : 0,
      fraction >= .7 - 1e-9 ? 30 : fraction >= .4 - 1e-9 ? 20 : fraction > 0 ? 10 : 0, s.cash >= 1000 ? 30 : s.cash >= 0 ? 15 : 0];
    out[f] = { points: sum(components), components, fraction, victory: climate && sum(components) >= 70 };
  }
  const productionMet = g.production >= productionTarget;
  const components = [climate ? 30 : 0, productionMet ? 20 : 0, 20, g.treasury.published ? 10 : 0, 10 + g.treasury.votes * 2 / rounds];
  out.Estado = { points: sum(components), components, victory: climate && productionMet && sum(components) >= 70, productionMet };
  return out;
}
export function exportGame(g) {
  return { schema: 'tension-carbono', version: g.version, setup: clone(g.setup), actions: clone(g.actions) };
}
export function importGame(data) {
  check(data && data.schema === 'tension-carbono' && [...GAME_VERSIONS, '2.1.0', '2.0.0'].includes(data.version), 'Formato incompatible. Use una partida JSON de Tensión de Carbono 2.x o 3.x.');
  check(Array.isArray(data.actions) && data.actions.length <= 2000, 'Bitácora inválida o demasiado extensa.');
  let game = createGame(data.setup,GAME_VERSIONS.includes(data.version)?data.version:'2.2.0');
  if(isStreamlined(game)) {
    const canonical=actions=>JSON.stringify(actions.map(action=>Object.entries(action).sort(([left],[right])=>left.localeCompare(right))));
    for(let index=0;index<data.actions.length;) {
      const next=applyAction(game,data.actions[index]);
      const generated=next.actions.slice(game.actions.length);
      check(canonical(generated)===canonical(data.actions.slice(index,index+generated.length)),'La bitácora no coincide con el avance automático de esta versión.');
      game=next;index+=generated.length;
    }
    return game;
  }
  let terminalState = null;
  const legacyReplay = data.version === '2.0.0';
  for (const action of data.actions) {
    game = transition(game, action, legacyReplay);
    if (!terminalState && isGameOver(game)) terminalState = game;
  }
  // Validate the complete legacy log, then migrate to its first terminal round.
  return terminalState || game;
}
