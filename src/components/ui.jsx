import { Children, cloneElement, isValidElement, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CircleHelp } from 'lucide-react';

export function Button({ children, kind = '', className = '', ...props }) {
  return <button className={`btn ${kind} ${className}`} {...props}>{children}</button>;
}

export function Help({ label, children }) {
  const id = useId();
  const button = useRef();
  const timeout = useRef();
  const [position, setPosition] = useState(null);
  useEffect(() => () => clearTimeout(timeout.current), []);
  function show() {
    clearTimeout(timeout.current);
    const rect = button.current.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 32);
    setPosition({ width, left: Math.max(16, Math.min(rect.right - width, window.innerWidth - width - 16)), ...(rect.bottom + 190 < window.innerHeight ? { top: rect.bottom + 8 } : { bottom: window.innerHeight - rect.top + 8 }) });
  }
  function hide() { timeout.current = setTimeout(() => setPosition(null), 120); }
  return <span className="help-control" onMouseEnter={show} onMouseLeave={hide}>
    <button ref={button} type="button" className="help-button" aria-label={`Detalles: ${label}`} aria-expanded={Boolean(position)} aria-describedby={position ? id : undefined} onFocus={show} onBlur={hide} onClick={show} onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setPosition(null); } }}><CircleHelp size={14}/><span>Detalles</span></button>
    {position && createPortal(<span id={id} role="tooltip" className="help-tooltip" style={position} onMouseEnter={() => clearTimeout(timeout.current)} onMouseLeave={hide}><strong>{label}</strong>{children}</span>, document.body)}
  </span>;
}

function identifyControl(children, id) {
  return Children.map(children, child => {
    if (!isValidElement(child)) return child;
    if (['input', 'select', 'textarea'].includes(child.type)) return cloneElement(child, { id });
    if (child.props.children) return cloneElement(child, {}, identifyControl(child.props.children, id));
    return child;
  });
}

export function Field({ label, children, help, details }) {
  const id = useId();
  return <div className="field"><div className="field-heading"><label htmlFor={id}>{label}</label>{(details || help) && <Help label={label}>{details || help}</Help>}</div>{identifyControl(children, id)}{help && <small>{help}</small>}</div>;
}

export function Stat({ label, value, detail }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>;
}
