import { BarChart3, BookOpen, GraduationCap, House, LayoutDashboard, Play, Settings2, Upload, X } from 'lucide-react';

export default function GameNavigation({ game, view, onNavigate, onNames, onImport, onDemo, onClose }) {
  return <aside id="game-navigation" className="sidebar" aria-label="Menú del juego">
    <div className="sidebar-heading"><div className="team-name"><span className="eyebrow">Economía de la mesa</span><strong>{game?.setup.names.team ?? 'Tensión de Carbono'}</strong></div><button type="button" className="icon-btn" aria-label="Cerrar menú lateral" onClick={onClose}><X size={18}/></button></div>
    <nav aria-label="Secciones del juego">{[['home', House, 'Inicio'], ['table', LayoutDashboard, game ? 'Mesa de juego' : 'Crear mesa'], ['results', BarChart3, 'Resultados'], ['guide', BookOpen, 'Guía de juego'], ['teacher', GraduationCap, 'Comparar mesas']].filter(([key]) => key !== 'results' || game?.history.length).map(([key, Icon, label]) => <button type="button" key={key} className={view === key ? 'active' : ''} aria-current={view === key ? 'page' : undefined} onClick={() => onNavigate(key)}><Icon size={18}/>{label}</button>)}</nav>
    <div className="sidebar-bottom">{onNames&&<button type="button" onClick={onNames}><Settings2 size={16}/>Participantes</button>}<button type="button" onClick={onImport}><Upload size={16}/>Importar partida</button><button type="button" onClick={onDemo}><Play size={16}/>Partida de ejemplo</button><small>Un dispositivo por mesa<br/>Guardado en este navegador</small></div>
  </aside>;
}
