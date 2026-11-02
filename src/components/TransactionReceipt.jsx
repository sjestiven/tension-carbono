import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export default function TransactionReceipt({receipt,motionEnabled}) {
  const [open,setOpen]=useState(false);
  if(!receipt)return null;
  return <aside className={`transaction-receipt ${motionEnabled?'motion-enabled':''}`} aria-label="Última operación registrada" key={receipt.id}><div className="receipt-heading"><Check size={17}/><strong>Última operación registrada</strong><button type="button" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?'Ocultar detalle':'Ver detalle'}<ChevronDown size={15}/></button></div><p role="status">{receipt.text}</p>{open&&<ul>{receipt.entries.map((entry,index)=><li key={index}>{entry.text}</li>)}</ul>}</aside>;
}
