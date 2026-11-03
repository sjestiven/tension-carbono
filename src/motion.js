import { COMPANIES, transactionEffects, gameRules } from './engine.js';

const money=value=>`USD ${new Intl.NumberFormat('es-CO',{maximumFractionDigits:2}).format(value)}`;
export function transactionReceipt(before,after,id,now=Date.now()) {
  const entries=transactionEffects(before,after).map(effect=>{
    const from=before.setup.names[effect.from],to=before.setup.names[effect.to];
    const text=effect.kind==='purchase'?`${from} pagó ${money(effect.amount)} a ${to} y aplicó ${effect.quantity} créditos.`
      :effect.kind==='refund'?`${from} devolvió ${money(effect.amount)} a ${to}; se liberaron ${effect.quantity} créditos.`
      :effect.kind==='grant'?`Aporte público ejecutado a ${to}: ${money(effect.amount)}.`
      :effect.kind==='project'?`${from} ejecutó ${effect.count} ${effect.count===1?'proyecto':'proyectos'} por ${money(effect.amount)}. ${gameRules(after).automaticVerification ? 'El juego valida los lotes del año.' : 'La verificación ambiental es una decisión separada.'}`
      :effect.kind==='tax'?`${from}: impuesto ${money(effect.amount)}.`
      :`Año ${effect.year} cerrado: impuesto ${money(effect.tax)}; reserva para el fondo ${money(effect.reserve)} (30%) y 70% al presupuesto general. Emisiones confirmadas ${effect.cumulative} / ${new Intl.NumberFormat('es-CO').format(gameRules(after).emissionsLimit)} tCO₂e.`;
    return {...effect,text};
  });
  return entries.length?{id,createdAt:now,entries,text:entries.filter(entry=>entry.kind!=='tax').map(entry=>entry.text).join(' ')}:null;
}

export function roleLabel(role) {
  return role==='Estado'?'Estado':COMPANIES.includes(role)?`Empresa ${role}`:role==='Docente'?'Mesa docente':`Fundación ${role.slice(1)}`;
}
