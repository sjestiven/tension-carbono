import { ROLES, isGameOver } from '../engine.js';

export const CONSENT_VERSION = '2026-11-01';
export const ACTION_FIELDS = {
  policy:['tax','subsidy'],publish:[],subsidy:['subsidy'],addProject:['project'],removeProject:['id'],
  confirmProjects:[],confirmGrants:[],execute:[],verify:['foundation','verified'],openMarket:[],
  production:['quantity'],confirmProduction:['lock'],publishQuote:['price'],finishFoundationTurn:[],
  reopenNegotiation:[],propose:['company','foundation','quantity','price'],accept:['id'],cancel:['id'],
  confirmCompany:[],close:[],next:[],
};
export function hasStudentCodes(setup) {
  return ROLES.every(role => typeof setup?.studentCodes?.[role] === 'string' && setup.studentCodes[role].trim().length > 0);
}
export function actionData(action) {
  if (!Object.hasOwn(ACTION_FIELDS, action.type)) throw Error('Unsupported research action');
  return Object.fromEntries(ACTION_FIELDS[action.type].filter(key => Object.hasOwn(action,key)).map(key => [key,action[key]]));
}
export function roundData(game) {
  return game.history.map(round => ({year:round.year,emissions:round.emissions,cumulative_emissions:round.cumulative,
    production:round.production,tax:round.tax,fund:round.fund,credits:round.credits,reduction:round.reduction,
    tax_rate:round.taxRate,subsidy:round.subsidy}));
}
export function outcome(game) {
  return !isGameOver(game) ? 'in_progress' : game.emissions > 1400 ? 'climate_defeat' : 'completed';
}
