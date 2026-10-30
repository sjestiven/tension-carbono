import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, applyAction, exportGame, importGame, scores, available, remaining } from '../src/engine.js';
import { DEMO, playTemplate } from '../src/demo.js';
import { currentTurn, foundationOrder, projectIssues, projectOptionIssue, closingIssues } from '../src/workflow.js';

const act = (game, type, actor, data = {}) => applyAction(game, { type, actor, ...data });

test('An early climate defeat has no next-year handoff', () => {
  const rounds=structuredClone(DEMO);
  for (const round of rounds) round.produccion={A:300,B:300,C:300};
  const turn=currentTurn(playTemplate(rounds));
  assert.equal(turn.kind,'finished');
  assert.equal(turn.next,null);
  assert.match(turn.title,/emisiones/);
});

function plannedGame() {
  let game = act(createGame(), 'publish', 'Estado');
  for (const role of ['A', 'B', 'C']) game = act(game, 'confirmProduction', role);
  return game;
}

function marketGame() {
  let game = plannedGame();
  for (const role of ['F1', 'F2']) {
    game = act(game, 'addProject', role, { project: 'P1' });
    game = act(game, 'confirmProjects', role);
  }
  game = act(game, 'confirmGrants', 'Estado');
  game = act(game, 'execute', 'Docente');
  for (const foundation of ['F1', 'F2']) game = act(game, 'verify', 'Docente', { foundation, verified: true });
  return act(game, 'openMarket', 'Docente');
}

test('The guided year has a fixed planning, signature, and teacher sequence', () => {
  let game = createGame();
  assert.equal(currentTurn(game).role, 'Estado');
  game = act(game, 'publish', 'Estado');
  for (const role of ['A', 'B', 'C']) {
    assert.deepEqual([currentTurn(game).role, currentTurn(game).kind], [role, 'production']);
    game = act(game, 'confirmProduction', role);
  }
  for (const role of ['F1', 'F2']) {
    assert.equal(currentTurn(game).role, role);
    game = act(game, 'confirmProjects', role);
  }
  assert.equal(currentTurn(game).kind, 'grants');
  game = act(game, 'confirmGrants', 'Estado');
  assert.deepEqual([currentTurn(game).role, currentTurn(game).kind], ['Docente', 'execute']);
  game = act(game, 'execute', 'Docente');
  assert.equal(currentTurn(game).kind, 'verify');
});

test('Explicit production confirmations survive export and reload, and edits invalidate them', () => {
  let game = act(createGame(), 'publish', 'Estado');
  game = act(game, 'confirmProduction', 'A');
  assert.equal(currentTurn(importGame(exportGame(game))).role, 'B');
  game = act(game, 'production', 'A', { quantity: 250 });
  assert.equal(currentTurn(game).role, 'A');
  assert.throws(() => act(createGame(), 'confirmProduction', 'A'), /etapa/);
});

test('A policy revision requests both foundation signatures again without repeating company planning', () => {
  let game = plannedGame();
  for (const role of ['F1', 'F2']) game = act(game, 'confirmProjects', role);
  game = act(game, 'subsidy', 'Estado', { subsidy: 0 });
  assert.equal(currentTurn(game).role, 'F1');
  assert.ok(Object.values(game.draft.productionPlanned).every(Boolean));
  assert.equal(projectIssues(game, { signatures: true }).length, 3);
});

test('Execution and verification errors identify exactly which participant has not finished', () => {
  let game = plannedGame();
  game = act(game, 'confirmProjects', 'F1');
  game = act(game, 'confirmGrants', 'Estado');
  assert.throws(() => act(game, 'execute', 'Docente'), error => error.message.includes('Fundación Horizonte') && !error.message.includes('Fundación Bosque'));
  game = act(game, 'confirmProjects', 'F2');
  game = act(game, 'execute', 'Docente');
  game = act(game, 'verify', 'Docente', { foundation: 'F1', verified: true });
  assert.throws(() => act(game, 'openMarket', 'Docente'), /Fundación Horizonte/);
});

test('Unaffordable or over-capacity project options are explained before confirmation', () => {
  let game = plannedGame();
  game = act(game, 'addProject', 'F1', { project: 'P1' });
  assert.match(projectOptionIssue(game, 'F1', 'P1'), /caja/);
  assert.equal(projectOptionIssue(game, 'F2', 'P2'), '');
  game = act(game, 'addProject', 'F1', { project: 'P1' });
  assert.ok(projectIssues(game).some(issue => issue.role === 'F1' && issue.message.includes('200.00')));
});

test('A foundation can sign its own valid plan while the next foundation repairs an imported draft', () => {
  let game = plannedGame();
  game = act(game, 'addProject', 'F2', { project: 'P1' });
  game = act(game, 'addProject', 'F2', { project: 'P1' });
  game = act(game, 'confirmProjects', 'F1');
  assert.equal(currentTurn(game).role, 'F2');
  assert.throws(() => act(game, 'confirmProjects', 'F2'), /antes de vender/);
  assert.throws(() => act(game, 'confirmGrants', 'Estado'), /antes de vender/);
});

test('An offer hands off to its counterpart and returns to the original foundation turn', () => {
  let game = marketGame();
  assert.equal(currentTurn(game).role, 'F1');
  game = act(game, 'propose', 'F1', { company: 'A', foundation: 'F1', quantity: 10, price: 15 });
  assert.deepEqual([currentTurn(game).role, currentTurn(game).kind, currentTurn(game).next], ['A', 'reply', 'F1']);
  assert.throws(() => act(game, 'finishFoundationTurn', 'F1'), /contraparte/);
  game = act(game, 'accept', 'A', { id: currentTurn(game).contract.id });
  assert.equal(currentTurn(game).role, 'F1');
  game = act(game, 'finishFoundationTurn', 'F1');
  assert.equal(currentTurn(game).role, 'F2');
});

test('A company can request credits from a foundation whose main turn already ended', () => {
  let game = marketGame();
  for (const role of ['F1', 'F2']) game = act(game, 'finishFoundationTurn', role);
  game = act(game, 'propose', 'A', { company: 'A', foundation: 'F1', quantity: 5, price: 15 });
  assert.deepEqual([currentTurn(game).role, currentTurn(game).next], ['F1', 'A']);
  game = act(game, 'cancel', 'F1', { id: currentTurn(game).contract.id });
  assert.equal(currentTurn(game).role, 'A');
  for (const role of ['A', 'B', 'C']) game = act(game, 'confirmCompany', role);
  assert.equal(currentTurn(game).kind, 'close');
  assert.deepEqual(closingIssues(game), []);
  game = act(game, 'reopenNegotiation', 'Docente');
  assert.equal(currentTurn(game).role, 'F1');
  assert.equal(closingIssues(game).length, 3);
});

for (const quoteMode of [false, true]) test(`Four guided rounds preserve reference accounts and scores (${quoteMode ? 'quotes and locked production' : 'legacy offers'})`, () => {
  let game = createGame();
  for (const [index, template] of DEMO.entries()) {
    if (index) game = act(game, 'next', 'Docente');
    const subsidy = Object.values(template.proyectos).flat().some(project => project.aporte) ? 50 : 0;
    game = act(game, 'policy', 'Estado', { tax: template.tarifa, subsidy });
    game = act(game, 'publish', 'Estado');
    for (const role of ['A', 'B', 'C']) {
      assert.equal(currentTurn(game).role, role);
      game = act(game, 'production', role, { quantity: template.produccion[role] });
      game = act(game, 'confirmProduction', role, { lock: quoteMode });
    }
    for (const role of ['F1', 'F2']) {
      for (const project of template.proyectos[role]) game = act(game, 'addProject', role, { project: project.tipo });
      game = act(game, 'confirmProjects', role);
    }
    game = act(game, 'confirmGrants', 'Estado');
    game = act(game, 'execute', 'Docente');
    for (const foundation of ['F1', 'F2']) game = act(game, 'verify', 'Docente', { foundation, verified: template.verificado[foundation] });
    game = act(game, 'openMarket', 'Docente');
    if (quoteMode) {
      for (const foundation of foundationOrder(game)) {
        assert.equal(currentTurn(game).role, foundation);
        game = act(game, 'publishQuote', foundation, { price: 18.5 });
        game = act(game, 'finishFoundationTurn', foundation);
      }
      for (const company of ['A', 'B', 'C']) {
        assert.equal(currentTurn(game).role, company);
        for (const contract of template.contratos.filter(item => item.empresa === company)) {
          game = act(game, 'propose', company, { company, foundation: contract.fundacion, quantity: contract.cantidad, price: contract.precio });
          assert.equal(currentTurn(game).role, contract.fundacion);
          game = act(game, 'accept', contract.fundacion, { id: currentTurn(game).contract.id });
        }
        game = act(game, 'confirmCompany', company);
      }
    } else {
      for (const foundation of ['F1', 'F2']) {
        for (const contract of template.contratos.filter(item => item.fundacion === foundation)) {
          game = act(game, 'propose', foundation, { company: contract.empresa, foundation, quantity: contract.cantidad, price: contract.precio });
          assert.equal(currentTurn(game).role, contract.empresa);
          game = act(game, 'accept', contract.empresa, { id: currentTurn(game).contract.id });
        }
        game = act(game, 'finishFoundationTurn', foundation);
      }
      for (const role of ['A', 'B', 'C']) game = act(game, 'confirmCompany', role);
    }
    assert.equal(currentTurn(game).kind, 'close');
    game = act(game, 'close', 'Docente');
  }
  assert.equal(currentTurn(game).kind, 'finished');
  const economicHistory = history => history.map(round => ({
    ...round,
    contracts: round.contracts.map(({ id, proposer, ...contract }) => contract)
      .sort((a, b) => `${a.company}-${a.foundation}`.localeCompare(`${b.company}-${b.foundation}`)),
  }));
  if (quoteMode) assert.deepEqual(economicHistory(game.history), economicHistory(playTemplate().history));
  else assert.deepEqual(game.history, playTemplate().history);
  assert.deepEqual(scores(game), scores(playTemplate()));
  assert.deepEqual(importGame(exportGame(game)), game);
});

test('A confirmed annual production remains locked through contracts and reopened negotiations', () => {
  let game = act(createGame(), 'publish', 'Estado');
  game = act(game, 'production', 'A', { quantity: 200 });
  game = act(game, 'confirmProduction', 'A', { lock: true });
  assert.throws(() => act(game, 'production', 'A', { quantity: 250 }), /ya está confirmada/);
  game = act(game, 'confirmProjects', 'F1');
  game = act(game, 'confirmProjects', 'F2');
  game = act(game, 'confirmGrants', 'Estado');
  game = act(game, 'execute', 'Docente');
  for (const foundation of ['F1', 'F2']) game = act(game, 'verify', 'Docente', { foundation, verified: true });
  game = act(game, 'openMarket', 'Docente');
  game = act(game, 'reopenNegotiation', 'Docente');
  assert.throws(() => act(game, 'production', 'A', { quantity: 100 }), /ya está confirmada/);
  assert.ok(importGame(exportGame(game)).draft.productionLocked.A);
  for (const role of ['A', 'B', 'C']) game = act(game, 'confirmCompany', role);
  game = act(game, 'close', 'Docente');
  game = act(game, 'next', 'Docente');
  game = act(game, 'publish', 'Estado');
  assert.equal(act(game, 'production', 'A', { quantity: 100 }).draft.production.A, 100);
});

test('Both quotations precede purchases and leave both inventories and buyer capacity unreserved', () => {
  let game = marketGame();
  game = act(game, 'publishQuote', 'F1', { price: 18.5 });
  game = act(game, 'finishFoundationTurn', 'F1');
  assert.equal(currentTurn(game).role, 'F2');
  assert.throws(() => act(game, 'propose', 'A', { company: 'A', foundation: 'F1', quantity: 20, price: 18.5 }), /Ambas fundaciones/);
  assert.equal(game.companies.A.cash, 5000);
  game = act(game, 'publishQuote', 'F2', { price: 17.5 });
  game = act(game, 'finishFoundationTurn', 'F2');
  assert.deepEqual([currentTurn(game).role, currentTurn(game).kind], ['A', 'trade']);
  assert.equal(game.draft.contracts.length, 0);
  assert.equal(available(game, 'F1'), 20);
  assert.equal(available(game, 'F2'), 20);
  const initialCapacity = remaining(game, 'A');
  game = act(game, 'propose', 'A', { company: 'A', foundation: 'F2', quantity: 20, price: 17.5 });
  assert.equal(available(game, 'F1'), 20);
  assert.equal(available(game, 'F2'), 0);
  assert.equal(remaining(game, 'A'), initialCapacity - 20);
  game = act(game, 'accept', 'F2', { id: currentTurn(game).contract.id });
  assert.equal(game.foundations.F1.cash, 400);
  assert.equal(game.foundations.F2.cash, 750);
  game = act(game, 'cancel', 'A', { id: game.draft.contracts[0].id });
  assert.equal(available(game, 'F2'), 20);
  assert.equal(remaining(game, 'A'), initialCapacity);
  assert.equal(game.foundations.F2.cash, 400);
  assert.equal(game.companies.A.cash, 5000);
  assert.deepEqual(importGame(exportGame(game)), game);
});

test('Quotation order alternates across years and allows either foundation to decline', () => {
  let game = marketGame();
  assert.deepEqual(foundationOrder(game), ['F1', 'F2']);
  for (const role of ['F1', 'F2']) {
    game = act(game, 'publishQuote', role, { price: null });
    game = act(game, 'finishFoundationTurn', role);
  }
  for (const role of ['A', 'B', 'C']) game = act(game, 'confirmCompany', role);
  game = act(game, 'close', 'Docente');
  game = act(game, 'next', 'Docente');
  assert.deepEqual(foundationOrder(game), ['F2', 'F1']);
});
