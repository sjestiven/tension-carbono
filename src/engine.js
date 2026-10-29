// Motor puro y determinista. Todas las decisiones pasan por applyAction.
export const VERSION = '2.0.0';
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
    companyConfirmed: { A: false, B: false, C: false }, contracts: [],
    fundStart: 0, executed: [], };
}
export function createGame(setup = {}) {
  check(setup && typeof setup === 'object' && !Array.isArray(setup), 'Configuración inválida.');
  const names = {}, players = {};
  for (const key of ['team', ...ROLES]) names[key] = text(setup.names?.[key] ?? DEFAULT_NAMES[key], 'Nombre', 60);
  for (const key of ROLES) {
    const name = setup.players?.[key] ?? '';
    check(typeof name === 'string' && name.length <= 60, 'Nombre de participante inválido.');
    players[key] = name.trim();
  }
  return { version: VERSION, setup: { names, players }, history: [], actions: [], seq: 0,
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
function validateProjects(g) {
  const details = projectDetails(g);
  for (const x of details) {
    check(x.capacity <= 100, `${x.foundation}: el máximo es 100 tCO₂e al año.`);
    check(x.cashAfter >= 0, `${x.foundation}: faltan USD ${(-x.cashAfter).toFixed(2)} para ejecutar antes de vender créditos.`);
  }
  check(sum(details, x => x.grant) <= g.treasury.fund + 1e-6, 'Los convenios superan el fondo disponible. Ajusten proyectos o el porcentaje común de apoyo.');
  return details;
}
const live = c => c.status === 'pending' || c.status === 'accepted';
const accepted = c => c.status === 'accepted';
export function lot(g, f) { return g.draft.verified[f] ? g.foundations[f].capacity : 0; }
export function available(g, f) { return lot(g, f) - sum(g.draft.contracts.filter(c => c.foundation === f && live(c)), c => c.quantity); }
export function remaining(g, e) { return Math.floor(g.draft.production[e] * INTENSITY[e] * .5) - sum(g.draft.contracts.filter(c => c.company === e && live(c)), c => c.quantity); }
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
export function previewRound(g) {
  const companies = Object.fromEntries(COMPANIES.map(e => [e, companyView(g, e)]));
  const foundations = Object.fromEntries(FOUNDATIONS.map(f => [f, { reduction: lot(g, f), sold: sum(g.draft.contracts.filter(c => c.foundation === f && accepted(c)), c => c.quantity), cash: g.foundations[f].cash }]));
  const gross = sum(Object.values(companies), x => x.emissions), reduction = sum(Object.values(foundations), x => x.reduction);
  const tax = sum(Object.values(companies), x => x.tax), emissions = gross + 200 - reduction;
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
      { name: 'Trato común', passed: fair, evidence: `Todos los convenios aplican el ${g.draft.subsidy} % común publicado.` },
      { name: 'Impulso a proyectos', passed: result.foundations[r].reduction >= 20 * g.draft.year, evidence: `${result.foundations[r].reduction} de ${20 * g.draft.year} tCO₂e verificadas como meta anual de esta fundación.` },
    ];
    const count = criteria.filter(c => c.passed).length;
    return [r, { value: count === 3 ? 1 : count === 2 ? 0 : -1, criteria }];
  }));
}
function assertMarket(g) {
  check(!g.draft.contracts.some(c => c.status === 'pending'), 'Hay ofertas pendientes. Acéptenlas o rechácenlas antes de cerrar.');
  for (const e of COMPANIES) {
    const v = companyView(g, e);
    check(v.credits <= .5 * v.emissions, `${e}: créditos superiores al 50 % de sus emisiones.`);
    check(v.closingCash >= 0, `${e}: caja final negativa. Revisen producción o contratos.`);
  }
  for (const f of FOUNDATIONS) check(sum(g.draft.contracts.filter(c => c.foundation === f && accepted(c)), c => c.quantity) <= lot(g, f), 'No se pueden vender créditos sin verificar.');
}
export function applyAction(original, action) {
  check(action && typeof action === 'object' && !Array.isArray(action), 'Acción inválida.');
  check(typeof action.type === 'string', 'Acción sin tipo.');
  check(ROLES.includes(action.actor) || action.actor === 'Docente', 'Rol desconocido.');
  const g = clone(original), a = clone(action), d = g.draft;
  switch (a.type) {
    case 'policy':
      phase(g, 'policy'); actor(a, 'Estado');
      d.tax = number(a.tax, 'Tarifa', 20, 40, true);
      d.subsidy = number(a.subsidy, 'Apoyo público', 0, 50, true);
      break;
    case 'publish':
      phase(g, 'policy'); actor(a, 'Estado');
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
      phase(g, 'projects'); actor(a, ...FOUNDATIONS); validateProjects(g);
      d.projectConfirmed[a.actor] = true;
      break;
    case 'confirmGrants':
      phase(g, 'projects'); actor(a, 'Estado'); validateProjects(g); d.stateConfirmed = true;
      break;
    case 'execute': {
      phase(g, 'projects'); actor(a, 'Docente');
      check(FOUNDATIONS.every(f => d.projectConfirmed[f]) && d.stateConfirmed, 'Faltan firmas de las fundaciones o del Estado.');
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
      check(FOUNDATIONS.every(f => typeof d.verified[f] === 'boolean'), 'Verifique o rechace expresamente los dos lotes.');
      d.phase = 'market';
      break;
    case 'production': {
      phase(g, 'projects', 'market'); actor(a, ...COMPANIES);
      check(typeof a.quantity === 'number' && Object.hasOwn(PRODUCTION, a.quantity), 'Producción no permitida.');
      const used = sum(d.contracts.filter(c => c.company === a.actor && live(c)), c => c.quantity);
      check(used <= a.quantity * INTENSITY[a.actor] * .5, 'La nueva producción deja contratos por encima del 50 %. Cancélelos primero.');
      d.production[a.actor] = a.quantity; d.companyConfirmed[a.actor] = false;
      break;
    }
    case 'propose': {
      phase(g, 'market');
      check(COMPANIES.includes(a.company) && FOUNDATIONS.includes(a.foundation), 'Contrapartes desconocidas.');
      actor(a, a.company, a.foundation);
      number(a.quantity, 'Créditos', 1, 100, true); number(a.price, 'Precio', 0, 10000);
      check(!Object.hasOwn(a, 'advance') && (!Object.hasOwn(a, 'anticipo') || a.anticipo === 0), 'Los anticipos están deshabilitados.');
      check(a.quantity <= available(g, a.foundation), 'La cantidad supera el lote verificado disponible.');
      check(a.quantity <= remaining(g, a.company), 'La cantidad supera el 50 % disponible de la empresa.');
      d.contracts.push({ id: nextId(g, 'C'), lot: `L-${d.year}-${a.foundation}`, company: a.company, foundation: a.foundation, quantity: a.quantity, price: a.price, proposer: a.actor, status: 'pending' });
      d.companyConfirmed[a.company] = false;
      break;
    }
    case 'accept': {
      phase(g, 'market');
      const c = d.contracts.find(c => c.id === a.id);
      check(c?.status === 'pending', 'La oferta ya no está pendiente.');
      actor(a, c.proposer === c.company ? c.foundation : c.company);
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
    case 'confirmCompany':
      phase(g, 'market'); actor(a, ...COMPANIES);
      check(!d.contracts.some(c => c.company === a.actor && c.status === 'pending'), 'Resuelva sus ofertas pendientes.');
      check(companyView(g, a.actor).closingCash >= 0, 'La empresa quedaría con caja negativa.');
      d.companyConfirmed[a.actor] = true;
      break;
    case 'close': {
      phase(g, 'market'); actor(a, 'Docente');
      check(COMPANIES.every(e => d.companyConfirmed[e]), 'Las tres empresas deben confirmar sus decisiones.');
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
      phase(g, 'results'); actor(a, 'Docente'); check(d.year < 4, 'La partida ya terminó.');
      g.draft = draft(d.year + 1); g.draft.tax = d.tax; g.draft.subsidy = d.subsidy;
      break;
    default: fail('Acción desconocida.');
  }
  g.actions.push(a);
  return g;
}
export function scores(g) {
  check(g.history.length === 4 && g.draft.phase === 'results', 'Los puntos finales se calculan después de cuatro rondas.');
  const climate = g.emissions <= 1400, out = {};
  for (const e of COMPANIES) {
    const s = g.companies[e], margin = s.income ? s.profit / s.income : 0, coverage = s.emissions ? s.credits / s.emissions : 0;
    const components = [margin >= .1 - 1e-9 ? 40 : margin >= .05 - 1e-9 ? 25 : margin > 0 ? 10 : 0,
      coverage >= .4 - 1e-9 ? 40 : coverage >= .25 - 1e-9 ? 30 : coverage > 0 ? 5 : 0, s.solvent ? 20 : 0];
    out[e] = { points: sum(components), components, margin, coverage, victory: climate && sum(components) >= 70 };
  }
  for (const f of FOUNDATIONS) {
    const s = g.foundations[f], fraction = s.issued ? s.sold / s.issued : 0;
    const components = [s.reductions >= 200 ? 40 : s.reductions >= 100 ? 25 : s.reductions > 0 ? 10 : 0,
      fraction >= .7 - 1e-9 ? 30 : fraction >= .4 - 1e-9 ? 20 : fraction > 0 ? 10 : 0, s.cash >= 1000 ? 30 : s.cash >= 0 ? 15 : 0];
    out[f] = { points: sum(components), components, fraction, victory: climate && sum(components) >= 70 };
  }
  const components = [climate ? 30 : 0, g.production >= 1800 ? 20 : 0, 20, g.treasury.published ? 10 : 0, 10 + g.treasury.votes / 2];
  out.Estado = { points: sum(components), components, victory: climate && g.production >= 1800 && sum(components) >= 70, productionMet: g.production >= 1800 };
  return out;
}
export function exportGame(g) {
  return { schema: 'tension-carbono', version: VERSION, setup: clone(g.setup), actions: clone(g.actions) };
}
export function importGame(data) {
  check(data && data.schema === 'tension-carbono' && data.version === VERSION, 'Formato incompatible. Use una partida JSON de Tensión de Carbono 2.0.0.');
  check(Array.isArray(data.actions) && data.actions.length <= 2000, 'Bitácora inválida o demasiado extensa.');
  let game = createGame(data.setup);
  for (const action of data.actions) game = applyAction(game, action);
  return game;
}
