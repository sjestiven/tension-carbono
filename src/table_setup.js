export const TEAM_ALIASES = {
  argentina: 'Argentina',
  brazil: 'Brasil',
  colombia: 'Colombia',
  mexico: 'México',
  peru: 'Perú',
};

const legacyTeamAliases = {
  pallet_town: 'Pueblo Paleta',
  hyrule: 'Hyrule',
  wakanda: 'Wakanda',
  springfield: 'Springfield',
  gravity_falls: 'Gravity Falls',
};

export const SCENARIO_NAMES = {
  Estado: 'Estado',
  A: 'Empresa A · Bebidas azucaradas',
  B: 'Empresa B · Tecnología',
  C: 'Empresa C · Cemento',
  F1: 'Fundación 1 · Conservación terrestre',
  F2: 'Fundación 2 · Conservación acuática',
};

const previousScenarioNames = {
  A: ['Empresa A · Bebidas Aurora', 'Empresa A · Postobón'],
  B: ['Empresa B · Vidrios Prisma', 'Empresa B · Cristalería Peldar'],
  C: ['Empresa C · Cementos Horizonte', 'Empresa C · Cementos Argos'],
  F1: ['Fundación 1 · Fundación Natura'],
  F2: ['Fundación 2 · Fundación Omacha'],
};

export function currentScenarioName(role, name) {
  return previousScenarioNames[role]?.includes(name) ? SCENARIO_NAMES[role] : name;
}

export const AVATAR_GENDERS = { woman: 'Mujer', man: 'Hombre', other: 'Otro' };

export const DEFAULT_AVATAR_GENDERS = {
  Estado: 'woman', A: 'man', B: 'woman', C: 'man', F1: 'woman', F2: 'man',
};

export function teamAliasForName(name) {
  const aliases = { ...TEAM_ALIASES, ...legacyTeamAliases };
  return Object.keys(aliases).find(alias => aliases[alias] === name);
}
