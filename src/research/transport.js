import { createClient } from '@supabase/supabase-js';

export function researchConfig(env = import.meta.env || {}) {
  const url = env.VITE_SUPABASE_URL || '';
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
  let valid = false;
  try { valid = new URL(url).protocol === 'https:' && key.startsWith('sb_publishable_'); } catch {}
  return {enabled:valid,url,key,study:env.VITE_RESEARCH_STUDY || 'pilot-2026'};
}
export function createTransport(config) {
  if (!config.enabled) return null;
  let client;
  return async payload => {
    client ||= createClient(config.url,config.key,{
      global:{fetch:boundedFetch},
      auth:{storageKey:`tension-carbono-research-${new URL(config.url).hostname}`,persistSession:true,autoRefreshToken:true,detectSessionInUrl:false},
    });
    const {data:sessionData,error:sessionError} = await client.auth.getSession();
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      const {error} = await client.auth.signInAnonymously();
      if (error) throw error;
    }
    const {data,error} = await client.rpc('record_research_session',payload);
    if (error) throw error;
    return data;
  };
}
async function boundedFetch(input,init={}) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (init.signal?.aborted) abort();
  init.signal?.addEventListener('abort',abort,{once:true});
  const timer = setTimeout(abort,15000);
  try { return await fetch(input,{...init,signal:controller.signal}); }
  finally { clearTimeout(timer); init.signal?.removeEventListener('abort',abort); }
}
