import { ROLES, isGameOver, gameRules } from '../engine.js';
import { AVATAR_GENDERS, isStudentCode, teamAliasForName } from '../table_setup.js';

export const CONSENT_VERSION = '2026-11-03';
export const ACTION_FIELDS = {
  policy:['tax','subsidy'],publish:[],subsidy:['subsidy'],addProject:['project'],removeProject:['id'],
  confirmProjects:[],confirmGrants:[],execute:[],verify:['foundation','verified'],openMarket:[],
  production:['quantity'],confirmProduction:['lock'],publishQuote:['price'],finishFoundationTurn:[],
  reopenNegotiation:[],propose:['company','foundation','quantity','price'],accept:['id'],cancel:['id'],
  confirmCompany:[],submitBids:[],finishSales:[],close:[],next:[],
};
export function hasStudentCodes(setup) {
  return ROLES.every(role => isStudentCode(setup?.studentCodes?.[role]));
}
export function sessionProfile(setup) {
  const teamAlias = teamAliasForName(setup.names.team);
  const avatarGenders = Object.fromEntries(ROLES.flatMap(role => {
    const choice = setup.avatarGenders?.[role];
    return typeof choice === 'string' && Object.hasOwn(AVATAR_GENDERS, choice) ? [[role, choice]] : [];
  }));
  return {
    ...(teamAlias && { team_alias: teamAlias }),
    ...(Object.keys(avatarGenders).length && { avatar_genders: avatarGenders }),
  };
}
export function actionData(action) {
  if (!Object.hasOwn(ACTION_FIELDS, action.type)) throw Error('Unsupported research action');
  return Object.fromEntries([...ACTION_FIELDS[action.type],...(action.origin==='system'?['origin']:[])].filter(key => Object.hasOwn(action,key)).map(key => [key,action[key]]));
}
export function roundData(game) {
  return game.history.map(round => ({year:round.year,emissions:round.emissions,cumulative_emissions:round.cumulative,
    production:round.production,tax:round.tax,fund:round.fund,credits:round.credits,reduction:round.reduction,
    tax_rate:round.taxRate,subsidy:round.subsidy}));
}
export function outcome(game) {
  return !isGameOver(game) ? 'in_progress' : game.emissions > gameRules(game).emissionsLimit ? 'climate_defeat' : 'completed';
}
