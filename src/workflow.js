import { COMPANIES, FOUNDATIONS, PROJECTS, companyView, projectDetails, isGameOver } from './engine.js';

export function roleName(game, role) {
  return role === 'Docente' ? 'Mesa docente' : game.setup.names[role];
}

export function foundationOrder(game) {
  return game.draft.year % 2 ? [...FOUNDATIONS] : [...FOUNDATIONS].reverse();
}

function marketOwner(game) {
  const order = foundationOrder(game);
  const foundation = order.find(role => !game.draft.marketFinished[role]);
  if (foundation) return { role: foundation, kind: 'quote', title: 'Presentar una cotización', next: order[order.indexOf(foundation) + 1] || 'A' };
  const company = COMPANIES.find(role => !game.draft.companyConfirmed[role]);
  if (company) return { role: company, kind: 'trade', title: 'Negociar y confirmar el año', next: COMPANIES[COMPANIES.indexOf(company) + 1] || 'Docente' };
  return { role: 'Docente', kind: 'close', title: 'Cerrar el año', next: 'Docente' };
}

// This derives the interface sequence; financial rules remain in the engine.
export function currentTurn(game) {
  const d = game.draft;
  if (isGameOver(game)) return { role: 'Docente', kind: 'finished', title: game.emissions > 1400 ? 'Partida terminada por emisiones' : 'Revisar los resultados finales', next: null };
  if (d.phase === 'policy') return { role: 'Estado', kind: 'policy', title: 'Publicar la política', next: 'A' };
  if (d.phase === 'projects') {
    const company = COMPANIES.find(role => !d.productionPlanned[role]);
    if (company) return { role: company, kind: 'production', title: 'Elegir y confirmar la producción', next: COMPANIES[COMPANIES.indexOf(company) + 1] || 'F1' };
    const foundation = FOUNDATIONS.find(role => !d.projectConfirmed[role]);
    if (foundation) return { role: foundation, kind: 'projects', title: 'Elegir y firmar los proyectos', next: foundation === 'F1' ? 'F2' : 'Estado' };
    if (!d.stateConfirmed) return { role: 'Estado', kind: 'grants', title: 'Firmar los convenios públicos', next: 'Docente' };
    return { role: 'Docente', kind: 'execute', title: 'Ejecutar los proyectos firmados', next: 'Docente' };
  }
  if (d.phase === 'verification') return { role: 'Docente', kind: 'verify', title: 'Verificar los lotes y abrir el mercado', next: foundationOrder(game)[0] };
  if (d.phase === 'market') {
    const owner = marketOwner(game);
    const pending = d.contracts.find(contract => contract.status === 'pending');
    if (pending) return { role: pending.proposer === pending.company ? pending.foundation : pending.company, kind: 'reply', title: 'Responder una propuesta', next: owner.role, contract: pending };
    return owner;
  }
  return { role: 'Docente', kind: d.year < 4 ? 'next' : 'finished', title: d.year < 4 ? 'Revisar el año y continuar' : 'Revisar los resultados finales', next: d.year < 4 ? 'Estado' : null };
}

export function projectIssues(game, { signatures = false } = {}) {
  const issues = [];
  const details = projectDetails(game);
  for (const detail of details) {
    const name = roleName(game, detail.foundation);
    if (detail.cashAfter < 0) issues.push({ role: detail.foundation, message: `${name}: faltan USD ${(-detail.cashAfter).toFixed(2)} para ejecutar. Retira un proyecto o revisa la cofinanciación con el Estado.` });
    if (detail.capacity > 100) issues.push({ role: detail.foundation, message: `${name}: la capacidad supera 100 tCO₂e/año.` });
    if (signatures && !game.draft.projectConfirmed[detail.foundation]) issues.push({ role: detail.foundation, message: `${name}: falta confirmar y firmar su plan de proyectos.` });
  }
  const grants = details.reduce((total, detail) => total + detail.grant, 0);
  if (grants > game.treasury.fund) issues.push({ role: 'Estado', message: `Los convenios requieren USD ${grants.toFixed(2)} y el fondo tiene USD ${game.treasury.fund.toFixed(2)}. Reduce el porcentaje de cofinanciación o los proyectos.` });
  if (signatures && !game.draft.stateConfirmed) issues.push({ role: 'Estado', message: 'Estado: falta confirmar y firmar los convenios públicos.' });
  return issues;
}

export function projectOptionIssue(game, foundation, type) {
  const detail = projectDetails(game).find(item => item.foundation === foundation);
  const project = PROJECTS[type];
  const grant = Math.round(project.cost * game.draft.subsidy) / 100;
  if (detail.capacity + project.reduction > 100) return 'Superaría el máximo de 100 tCO₂e/año.';
  if (detail.cashAfter + grant - project.cost < 0) return 'La caja no alcanza para pagar la parte de la fundación.';
  const grants = projectDetails(game).reduce((total, item) => total + item.grant, 0);
  if (grants + grant > game.treasury.fund) return 'El fondo público no alcanza para el aporte. El Estado puede revisar la cofinanciación antes de ejecutar.';
  return '';
}

export function closingIssues(game) {
  const issues = [];
  for (const contract of game.draft.contracts.filter(item => item.status === 'pending')) {
    const counterpart = contract.proposer === contract.company ? contract.foundation : contract.company;
    issues.push({ role: counterpart, message: `${roleName(game, counterpart)} debe aceptar o rechazar ${contract.id} (${contract.quantity} créditos).` });
  }
  for (const role of COMPANIES) {
    if (!game.draft.companyConfirmed[role]) issues.push({ role, message: `${roleName(game, role)}: falta confirmar sus decisiones del año.` });
    if (companyView(game, role).closingCash < 0) issues.push({ role, message: `${roleName(game, role)}: la caja prevista es negativa. Renegocia o anula contratos; la producción confirmada no se puede cambiar.` });
  }
  return issues;
}
