import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

export const ROUND_DURATIONS = [12, 8, 4];

export default function RoundTimer({ minutes, onMinutesChange, onRestart, autoStart, finished }) {
  const [seconds, setSeconds] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const started = useRef(false);
  useEffect(() => { setSeconds(minutes * 60); setRunning(false); }, [minutes]);
  useEffect(() => {
    if (autoStart && !finished && !started.current) { started.current = true; setRunning(true); }
  }, [autoStart, finished]);
  useEffect(() => { if (finished) setRunning(false); }, [finished]);
  useEffect(() => {
    if (!running) return;
    const end = Date.now() + seconds * 1000;
    const interval = setInterval(() => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setSeconds(left);
      if (!left) setRunning(false);
    }, 250);
    return () => clearInterval(interval);
  }, [running, minutes]);
  return <div className="timer">
    <select className="timer-duration" aria-label="Duración del cronómetro" title="Cambiar la duración reinicia y pausa el reloj" value={minutes} onChange={event => onMinutesChange(Number(event.target.value))}>{ROUND_DURATIONS.map(value => <option key={value} value={value}>{value} min</option>)}</select>
    <span className="time" aria-label="Tiempo orientativo">{Math.floor(seconds / 60).toString().padStart(2, '0')}:{(seconds % 60).toString().padStart(2, '0')}</span>
    <button type="button" aria-label={running ? 'Pausar reloj' : 'Iniciar reloj'} disabled={finished || seconds === 0} onClick={() => setRunning(!running)}>{running ? <Pause size={15}/> : <Play size={15}/>}</button>
    <details className="reset-menu"><summary aria-label="Opciones de reinicio"><RotateCcw size={15}/><span>Reiniciar</span></summary><div><button type="button" onClick={event => { setRunning(false); setSeconds(minutes * 60); event.currentTarget.closest('details').open = false; }}>Solo el reloj a {minutes} minutos</button><button type="button" onClick={event => { event.currentTarget.closest('details').open = false; onRestart(); }}>Reiniciar la partida…</button></div></details>
  </div>;
}
