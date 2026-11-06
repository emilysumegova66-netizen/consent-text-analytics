/* Consent-based interaction metrics only. Never reads or sends field values. */
(() => {
  const script = document.currentScript;
  const projectToken = script?.dataset.project;
  const endpoint = script?.dataset.endpoint;
  const anonKey = script?.dataset.key;
  if (!projectToken || !endpoint || !anonKey) { console.warn('Text analytics: missing data-project, data-endpoint or data-key.'); return; }
  const consentKey = `text-analytics-consent:${projectToken}`;
  const consent = () => localStorage.getItem(consentKey);
  const labelFor = el => String(el.getAttribute('aria-label') || el.labels?.[0]?.textContent || el.getAttribute('placeholder') || el.getAttribute('name') || el.id || el.tagName.toLowerCase()).trim().slice(0,120);
  const showConsent = () => {
    if (consent() === 'yes' || consent() === 'no') return;
    const box = document.createElement('aside'); box.setAttribute('role','dialog'); box.setAttribute('aria-label','Analytics consent');
    box.style.cssText='position:fixed;z-index:2147483647;bottom:16px;left:16px;max-width:390px;padding:16px;background:#111827;color:white;border:1px solid #4b5563;border-radius:12px;font:14px/1.45 system-ui;box-shadow:0 8px 30px #0005';
    const msg=document.createElement('p'); msg.textContent='This site would like to collect anonymous typing activity (field labels and character counts only). It will not collect the text you type.'; msg.style.margin='0 0 12px';
    const actions=document.createElement('div'); actions.style.cssText='display:flex;gap:8px';
    for (const [label,value] of [['Allow','yes'],['Decline','no']]) { const b=document.createElement('button'); b.type='button'; b.textContent=label; b.style.cssText='padding:8px 12px;border:0;border-radius:7px;cursor:pointer;font-weight:600'; b.addEventListener('click',()=>{localStorage.setItem(consentKey,value);box.remove();}); actions.append(b); }
    box.append(msg,actions); document.body.append(box);
  };
  const send = async el => {
    if (consent() !== 'yes') return;
    if (el.type === 'password' || el.type === 'hidden' || (el.autocomplete || '').startsWith('cc-')) return;
    const editable=el.isContentEditable, type=editable?'contenteditable':(el.type||el.tagName.toLowerCase());
    const count=editable?(el.textContent||'').length:(el.value||'').length;
    const payload={project_token:projectToken,event_type:'text_field_input',field_label:labelFor(el),field_type:String(type).slice(0,40),character_count:Math.min(count,100000),page_path:location.pathname.slice(0,2048)};
    try { await fetch(`${endpoint}/rest/v1/text_events`,{method:'POST',headers:{'Content-Type':'application/json','apikey':anonKey,'Prefer':'return=minimal'},body:JSON.stringify(payload),keepalive:true}); } catch (error) { console.error('Text analytics event failed:', error); }
  };
  const attach=()=>{showConsent();document.addEventListener('input',e=>{const el=e.target;if(!(el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement||el?.isContentEditable))return;if(el instanceof HTMLInputElement&&['password','hidden','submit','button','checkbox','radio','file'].includes(el.type))return;send(el);},true);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});else attach();
})();