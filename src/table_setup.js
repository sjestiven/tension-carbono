export const TEAM_ALIASES = {
  pallet_town: 'Pueblo Paleta',
  hyrule: 'Hyrule',
  wakanda: 'Wakanda',
  springfield: 'Springfield',
  gravity_falls: 'Gravity Falls',
};

export const SCENARIO_NAMES = {
  Estado: 'Estado',
  A: 'Empresa A · Postobón',
  B: 'Empresa B · Cristalería Peldar',
  C: 'Empresa C · Cementos Argos',
  F1: 'Fundación 1 · Fundación Natura',
  F2: 'Fundación 2 · Fundación Omacha',
};

const previousScenarioNames = {
  A: 'Empresa A · Bebidas Aurora',
  B: 'Empresa B · Vidrios Prisma',
  C: 'Empresa C · Cementos Horizonte',
};

export function currentScenarioName(role, name) {
  return name === previousScenarioNames[role] ? SCENARIO_NAMES[role] : name;
}

export const AVATAR_GENDERS = { woman: 'Mujer', man: 'Hombre', other: 'Otro' };

export const DEFAULT_AVATAR_GENDERS = {
  Estado: 'woman', A: 'man', B: 'woman', C: 'man', F1: 'woman', F2: 'man',
};

export function teamAliasForName(name) {
  return Object.keys(TEAM_ALIASES).find(alias => TEAM_ALIASES[alias] === name);
}
