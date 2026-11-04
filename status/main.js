"use strict";(()=>{var E="openchamber.sdk";var fe="data-oc-scrolling",Be=`
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [${fe}] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [${fe}] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [${fe}]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [${fe}] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;function Ke(e){let r=e.documentElement;if(r.hasAttribute("data-oc-scrollbar-activity"))return;r.setAttribute("data-oc-scrollbar-activity","");let n=new WeakMap;e.addEventListener("scroll",p=>{let u=p.target===e?r:p.target;if(!(u instanceof Element))return;u.hasAttribute("data-oc-scrolling")||u.setAttribute("data-oc-scrolling","");let b=n.get(u);b!==void 0&&clearTimeout(b),n.set(u,setTimeout(()=>{n.delete(u),u.removeAttribute("data-oc-scrolling")},1e3))},{capture:!0,passive:!0})}var Lo=`(${Ke.toString()})(document);`;var Kt=/^[a-z][a-z0-9-]{0,39}$/;var $t=e=>Object(e)===e&&!Array.isArray(e),je=(e,r)=>Object.keys(e).every(n=>r.includes(n)),Vt=e=>String(e)===e&&e.length>=1&&e.length<=60,Bt=e=>String(e)===e&&e.length>=1&&e.length<=80,jt=e=>{if(!Array.isArray(e)||e.length>4)return!1;let r=new Set;for(let n of e){if(!$t(n)||!Kt.test(n.id)||!Vt(n.label)||n.disabled!==void 0&&n.disabled!==!0&&n.disabled!==!1||r.has(n.id))return!1;if(r.add(n.id),n.kind==="button"){if(!je(n,["kind","id","label","disabled"]))return!1;continue}if(n.kind!=="select"||!je(n,["kind","id","label","value","options","disabled"])||!Bt(n.value)||!Array.isArray(n.options)||n.options.length<1||n.options.length>16)return!1;let p=new Set;for(let u of n.options){if(!$t(u)||!je(u,["value","label"])||!Bt(u.value)||!Vt(u.label)||p.has(u.value))return!1;p.add(u.value)}if(!p.has(n.value))return!1}return!0};var zt=["{id}","{segment}","{segments+}"];var hr=new Set(zt);var Wt=["turn-finished","turn-failed","permission-asked","question-asked"];var Or=new Set(Wt);var ze=e=>"bytes"in e?e.bytes.byteLength:e.content.length,Jt=(e,r)=>{if(e.path!==r.path||e.readOnly!==r.readOnly)return!1;if(e.encoding==="text"||r.encoding==="text")return e.encoding==="text"&&r.encoding==="text"&&e.content===r.content;if(e.bytes.byteLength!==r.bytes.byteLength)return!1;for(let n=0;n<e.bytes.byteLength;n+=1)if(e.bytes[n]!==r.bytes[n])return!1;return!0};var Yt=/^[A-Za-z0-9_-]{1,80}$/;var qt=["left","right","top","bottom"];var Qt=(e,r=0,n={remaining:16e3})=>{if(--n.remaining<0||r>=32)return!1;if(e===null)return!0;let p=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let u of p)if(!Qt(u,r+1,n))return!1;return!0},We=e=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every(r=>/^(0|[1-9]\d*)$/.test(r)&&Number(r)<e.length)&&e.every(We);if(Object(e)===e){let r=Object.getPrototypeOf(e);return(r===null||r===Object.prototype)&&Object.values(e).every(We)}return String(e)===e||Number.isFinite(e)},Je=e=>{try{return String(e.id)!==e.id||!Yt.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!qt.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!Qt(e.data)||!We(e.data)?!1:JSON.stringify(e.data).length<=16e3}catch{return!1}};var eo=["file","directory","other","missing"],qe=e=>!!(e&&"sessionId"in e),Qe=e=>!!(e&&"sent"in e&&!("sessionId"in e));var to=/^[0-9a-f]{7,64}$/i,Ze=e=>to.test(e),he=500,me=32e3,oo=16e3,ro=128,no=200,so=2e3,io=16e3,ao=80,co=200,lo=16e3;var po=2e3;var et=2e4,Oe=1024,Ae=2e6;var Re=64e3,xe=8e3,tt=4e3;var ot=96e4,Go=60*6e4;var uo=999,Eo=1e4,ae=500,_o=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],So=["stopped","starting","ready","failed"],Do=new Set(_o),To=e=>Do.has(e),fo=e=>e&&To(e)?e:"HOST_REJECTED",J=e=>e===void 0?!1:e===null||e===!0||e===!1||String(e)===e?!0:Number(e)===e?Number.isFinite(e):Array.isArray(e)?e.every(J):Object(e)===e?Object.values(e).every(J):!1,ho=e=>J(e)&&JSON.stringify(e).length<=lo,Zt=e=>e?.trim().slice(0,co)??"",Y=e=>{let r=e.id.trim().slice(0,ro),n=e.title.trim().slice(0,no),p=e.url.trim().slice(0,so),u=e.text?.trim().slice(0,io),b=e.author?.trim().slice(0,ao),M=e.kind==="pull"?"pull":"issue",U={providerId:e.providerId.trim(),id:r,title:n||r,url:p,kind:M};if(u&&(U.text=u),b&&(U.author=b),M==="pull"){let P=Zt(e.branches?.head),F=Zt(e.branches?.base);P&&F&&(U.branches={head:P,base:F})}return ho(e.data)&&(U.data=e.data),U},rt=e=>{let r=Y(e);return e.projectId&&(r.projectId=e.projectId),e.navigation&&(r.navigation=e.navigation),e.worktree&&(r.worktree=e.worktree),r},nt=e=>{let r={text:e.text.trim().slice(0,oo)};return e.send&&(r.send=!0),r},st=e=>e===null||!Number.isFinite(e)?null:Math.min(uo,Math.max(0,Math.round(e))),it=e=>Number.isFinite(e)?Math.min(Eo,Math.max(0,Math.ceil(e))):0;var q=e=>e.length>0&&e.length<=Oe&&!e.includes("\0")&&!e.includes("\\");var be=e=>!e.startsWith("/")||e.includes("\0")||e.includes("\\")||e.includes("://")||e.length>po?!1:!e.split("/").some(n=>n==="."||n===".."),Ho=new Set(So),at=e=>!!(e&&"status"in e&&Ho.has(String(e.status))&&!("body"in e)),ge=e=>!!(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),ct=e=>!!(e&&"content"in e&&String(e.content)===e.content),dt=e=>!!(e&&"written"in e&&e.written===!0),lt=e=>!!(e&&"entries"in e&&Array.isArray(e.entries)),Xo=new Set(eo),pt=e=>!!(e&&"kind"in e&&"size"in e&&Xo.has(String(e.kind))&&Number.isFinite(e.size)),ut=e=>!!(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),Fo=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late"]),$o=e=>Object(e)===e?e:null,Ye=e=>String(e)===e&&e.length>0,Vo=e=>{if(!Ye(e.id))return null;if(e.ok===!0){let r={channel:E,v:1,type:"result",id:e.id,ok:!0};return Object(e.payload)===e.payload&&(r.payload=e.payload),r}return e.ok===!1&&Ye(e.error)?{channel:E,v:1,type:"result",id:e.id,ok:!1,error:e.error,code:fo(Ye(e.code)?e.code:void 0)}:null},Et=e=>{let r=$o(e);return!r||r.channel!==E||r.v!==1?null:r.type==="result"?Vo(r):!Fo.has(String(r.type))||Object(r.payload)!==r.payload?null:r};var mo=e=>"key"in e&&"metaKey"in e&&"ctrlKey"in e,Bo=e=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s",a=class extends Error{code;constructor(r,n){super(n),this.name="HostRequestError",this.code=r}},Oo=()=>Promise.reject(new a("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),ke=()=>Promise.reject(new a("BAD_PATH",`File path must be 1 to ${Oe} characters without NUL or backslash.`)),Ie=e=>{if(e!==void 0){if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new a("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0}},l=e=>(e.value+=1,`oc-${e.value}`),ht=(e={})=>{let r=e.target??("window"in globalThis?window:null);if(!r)throw new a("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let n=e.acceptSource??(t=>t===r.parent),p=e.requestTimeoutMs??et,u=new Set,b=new Set,M=new Set,U=new Set,P=new Set,F=new Set,ee=new Set,le=new Set,pe=new Set,K=new Set,He=[],te=null,oe=null,ue=new Set,Ee=new Set,re=null,ne=null,Xe=!1,j=new Map,z=new Map,W=new Map,G=!1,d={value:0},c=null,D=null,se=!1,ie=!1,vt=null,Ct=t=>t?{sessionId:t.id,phase:t.busy?"started":"completed"}:null,C=t=>{r.parent.postMessage(t,"*")},Nt=()=>{G||r.parent===r||K.size===0||c?.features?.lateGenerateResults!==!0||C({channel:E,v:1,type:"generate-late-listen"})},O=(t,o)=>{for(let s of t)try{s(o)}catch(i){console.error(i)}},Mt=t=>{if(!(t instanceof MessageEvent)||!n(t.source))return;let o=Et(t.data);if(!o)return;if(o.type==="workspace"){let i=z.get(o.payload.subscriptionId);i&&O([i],o.payload.snapshot);return}if(o.type==="shells"){let i=W.get(o.payload.subscriptionId);i&&O([i],o.payload.snapshot);return}if(o.type==="ready"){c=o.payload,D=Ct(o.payload.session),O(u,o.payload),O(b,o.payload.directory),O(M,o.payload.session),D&&O(U,D),O(P,o.payload.connection),O(F,o.payload.settings),O(ee,o.payload.item),Nt();return}if(o.type==="generate-late"){K.size===0?He.push(o.payload):O(K,o.payload);return}if(o.type==="directory"){c&&(c={...c,directory:o.payload.directory}),O(b,o.payload.directory);return}if(o.type==="session"){c&&(c={...c,session:o.payload.session}),o.payload.session?D?.sessionId!==o.payload.session.id&&(D=Ct(o.payload.session)):D=null,O(M,o.payload.session);return}if(o.type==="session-lifecycle"){D=o.payload,O(U,o.payload);return}if(o.type==="connection"){c&&(c={...c,connection:o.payload.connection}),O(P,o.payload.connection);return}if(o.type==="settings"){c&&(c={...c,settings:o.payload.settings}),O(F,o.payload.settings);return}if(o.type==="item"){c&&(c={...c,item:o.payload.item}),O(ee,o.payload.item);return}if(o.type==="status-control-event"){O(le,o.payload);return}if(o.type==="popover-closed"){O(pe,o.payload);return}if(o.type==="action"){let i=S=>{G||C({channel:E,v:1,type:"action-result",id:o.id,payload:S})},T=oe;if(!T){i({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>T(o.payload)).then(()=>i({ok:!0}),S=>{let x=(S instanceof Error?S.message:String(S)).trim();i({ok:!1,error:(x||"Action failed.").slice(0,ae)})});return}if(o.type==="file-open"){let i=o.payload;if(ne&&Jt(ne,i))return;ne=i,O(ue,o.payload);return}if(o.type==="file-saved"){O(Ee,o.payload.version);return}if(o.type==="file-snapshot"){let i=x=>{G||C({channel:E,v:1,type:"file-snapshot-result",id:o.id,payload:x})},T=x=>i({error:(x.trim()||"Could not read the edited file.").slice(0,ae)}),S=re;if(!S){T("This extension does not edit files.");return}Promise.resolve().then(()=>S(o.payload.purpose)).then(x=>{if(ze(x)>2e7){T(`The file is over ${2e7} ${"bytes"in x?"bytes":"characters"}.`);return}if(x.version.length>256){T(`The snapshot version is over ${256} characters.`);return}i({snapshot:"bytes"in x?{bytes:x.bytes,version:x.version}:{content:x.content,version:x.version}})},x=>T(x instanceof Error?x.message:String(x)));return}if(o.type==="resolve"){let i=S=>{C({channel:E,v:1,type:"resolve-result",id:o.id,payload:S})},T=te;if(!T){i({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>T(o.payload)).then(S=>i({item:S?Y(S):null}),S=>{let x=(S instanceof Error?S.message:String(S)).trim();i({error:(x||"Command failed.").slice(0,ae)})});return}let s=j.get(o.id);if(s){if(clearTimeout(s.timer),j.delete(o.id),o.ok){s.resolve(o.payload);return}s.reject(new a(o.code,o.error))}};r.addEventListener("message",Mt),C({channel:E,v:1,type:"hello"});let y=(t,o=p)=>G||r.parent===r?Promise.reject(new a("HOST_UNAVAILABLE","No host frame. This page is not in an iframe.")):new Promise((s,i)=>{let T=setTimeout(()=>{j.delete(t.id),i(new a("HOST_TIMEOUT","Host did not answer in time."))},o);j.set(t.id,{resolve:s,reject:i,timer:T}),C(t)}),A=t=>y(t).then(()=>{}),R={channel:E,v:1},Fe=t=>{!G&&r.parent!==r&&C(t)},wt=()=>Fe({...R,type:"file-save"}),Lt=t=>{!mo(t)||!Bo(t)||(t.preventDefault(),wt())},Pt=t=>{!mo(t)||t.key!=="Escape"||c?.surface!=="popover"||!c.popover||(t.preventDefault(),Xt(c.popover.id,"escape").catch(()=>{}))},_e=()=>{let t=c?.surface==="popover"?c.popover:void 0;if(!t)return;let o=se||ie;vt!==o&&(vt=o,Ft(t.id,o).catch(()=>{}))},Se=()=>{c?.surface!=="popover"||se||(se=!0,_e())},Gt=t=>{c?.surface!=="popover"||t.relatedTarget!==null||!se||(se=!1,_e())},Dt=()=>{c?.surface!=="popover"||ie||(ie=!0,_e())},Ht=()=>{c?.surface!=="popover"||!ie||(ie=!1,_e())},w=(t,o=1024)=>{if(!t.trim()||t.length>o)throw new a("HOST_REJECTED",`Identity must contain 1 to ${o} characters.`)},$e=async t=>{t.kind!=="projects"&&w(t.projectId);let o=await y({...R,type:"workspace-read",id:l(d),payload:t});if(!o||!("kind"in o)||!("state"in o)||o.kind!==t.kind)throw new a("HOST_REJECTED","Host did not return workspace data.");return o},Ve=async(t,o)=>{t.kind!=="projects"&&w(t.projectId);let s=l(d);z.set(s,o);try{await A({...R,type:"workspace-subscribe",id:l(d),payload:{subscriptionId:s,query:t}})}catch(i){throw z.delete(s),G||C({...R,type:"workspace-unsubscribe",id:l(d),payload:{subscriptionId:s}}),i}return()=>{!z.delete(s)||G||C({...R,type:"workspace-unsubscribe",id:l(d),payload:{subscriptionId:s}})}},wo=async(t,o)=>{t.kind==="session"&&w(t.sessionId),t.kind==="project"&&w(t.projectId);let s=l(d);W.set(s,o);try{await A({...R,type:"shells-subscribe",id:l(d),payload:{subscriptionId:s,scope:t}})}catch(i){throw W.delete(s),G||C({...R,type:"shells-unsubscribe",id:l(d),payload:{subscriptionId:s}}),i}return()=>{!W.delete(s)||G||C({...R,type:"shells-unsubscribe",id:l(d),payload:{subscriptionId:s}})}},Te=async t=>{if("key"in t&&(t.key.length===0||t.key.length>128))throw new a("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(t.op==="set"&&!J(t.value))throw new a("HOST_REJECTED","Storage values must be JSON.");if(t.op==="set"&&new TextEncoder().encode(JSON.stringify(t.value)).length>65536)throw new a("HOST_REJECTED","Storage value exceeds 64 KiB.");if(t.scope==="device"&&c?.features?.deviceStorage!==!0)throw new a("UNSUPPORTED","This host does not support device storage.");let o=await y({...R,type:"storage",id:l(d),payload:t});if(!o||!("storage"in o)||o.op!==t.op)throw new a("HOST_REJECTED","Host did not return storage data.");return o},Xt=(t,o)=>c?.features?.popovers!==!0&&!(c?.surface==="popover"&&c.popover?.id===t)?Promise.reject(new a("UNSUPPORTED","This host does not support popovers.")):A({...R,type:"popover-close",id:l(d),payload:o?{id:t,reason:o}:{id:t}}),Ft=(t,o)=>c?.features?.popovers!==!0&&!(c?.surface==="popover"&&c.popover?.id===t)?Promise.reject(new a("UNSUPPORTED","This host does not support popovers.")):A({...R,type:"popover-anchor",id:l(d),payload:{id:t,active:o}});return r.addEventListener("keydown",Pt,!0),r.addEventListener("pointerover",Se),r.addEventListener("pointermove",Se),r.addEventListener("pointerout",Gt),r.addEventListener("focus",Dt),r.addEventListener("blur",Ht),{onAction:t=>(oe=t,()=>{oe===t&&(oe=null)}),listProjects:async()=>{let t=await $e({kind:"projects"});if(t.kind!=="projects")throw new a("HOST_REJECTED","Expected projects.");return t},listWorktrees:async t=>{let o=await $e({kind:"worktrees",projectId:t});if(o.kind!=="worktrees")throw new a("HOST_REJECTED","Expected worktrees.");return o},listSessions:async t=>{let o=await $e({kind:"sessions",projectId:t});if(o.kind!=="sessions")throw new a("HOST_REJECTED","Expected sessions.");return o},onProjects:t=>Ve({kind:"projects"},o=>{o.kind==="projects"&&t(o)}),onWorktrees:(t,o)=>Ve({kind:"worktrees",projectId:t},s=>{s.kind==="worktrees"&&o(s)}),onSessions:(t,o)=>Ve({kind:"sessions",projectId:t},s=>{s.kind==="sessions"&&o(s)}),onRunningShells:(t,o)=>wo(t,o),readShellOutput:async(t,o)=>{w(t,128);let s=o?.cursor;if(s!==void 0&&(!Number.isInteger(s)||s<0))throw new a("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let i=o?.tailBytes;if(i!==void 0&&(!Number.isInteger(i)||i<1||i>65536))throw new a("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${65536}.`);let S=await y({...R,type:"shell-output",id:l(d),payload:{shellId:t,cursor:s,tailBytes:i}});if(!S||typeof S.output!="string"||!Number.isFinite(S.cursor))throw new a("HOST_REJECTED","Host did not return shell output.");return S},stopShell:async t=>{if(w(t,128),(await y({...R,type:"shell-stop",id:l(d),payload:{shellId:t}}))?.stopped!==!0)throw new a("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async t=>{w(t),await A({...R,type:"open-session",id:l(d),payload:{sessionId:t}})},storage:{get:async(t,o)=>{let s=Ie(o),i={op:"get",key:t};s&&(i.scope=s);let T=await Te(i);return T.op==="get"&&T.found?T.value:void 0},set:async(t,o,s)=>{let i=Ie(s),T={op:"set",key:t,value:o};i&&(T.scope=i),await Te(T)},delete:async(t,o)=>{let s=Ie(o),i={op:"delete",key:t};s&&(i.scope=s),await Te(i)},keys:async t=>{let o=Ie(t),s={op:"keys"};o&&(s.scope=o);let i=await Te(s);if(i.op!=="keys")throw new a("HOST_REJECTED","Expected storage keys.");return i.keys}},onReady:t=>(u.add(t),c&&t(c),()=>{u.delete(t)}),onDirectory:t=>(b.add(t),c&&t(c.directory),()=>{b.delete(t)}),onSession:t=>(M.add(t),c&&t(c.session),()=>{M.delete(t)}),onSessionLifecycle:t=>(U.add(t),D&&t(D),()=>{U.delete(t)}),onConnection:t=>(P.add(t),c&&t(c.connection),()=>{P.delete(t)}),onSettings:t=>(F.add(t),c&&t(c.settings),()=>{F.delete(t)}),onItem:t=>(ee.add(t),c&&t(c.item),()=>{ee.delete(t)}),onStatusControl:t=>(le.add(t),()=>{le.delete(t)}),onPopoverClosed:t=>(pe.add(t),()=>{pe.delete(t)}),setStatusControls:t=>c?.features?.statusControls!==!0?Promise.reject(new a("UNSUPPORTED","This host does not support status controls.")):jt(t)?A({...R,type:"status-controls",id:l(d),payload:{controls:t}}):Promise.reject(new a("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options.")),openPopover:t=>c?.features?.popovers!==!0?Promise.reject(new a("UNSUPPORTED","This host does not support popovers.")):Je(t)?A({...R,type:"popover-open",id:l(d),payload:t}):Promise.reject(new a("HOST_REJECTED","Popover requests need bounded geometry and JSON data.")),closePopover:Xt,setPopoverAnchorActive:Ft,onResolve:t=>(te=t,()=>{te===t&&(te=null)}),toast:t=>{let o=t.message.trim();return!o||o.length>he?Promise.reject(new a("HOST_REJECTED",`Toast message must contain 1 to ${he} characters.`)):t.copy&&t.copy!==!0&&(!t.copy.text.length||t.copy.text.length>me)?Promise.reject(new a("HOST_REJECTED",`Toast copy text must contain 1 to ${me} characters.`)):A({channel:E,v:1,type:"toast",id:l(d),payload:{...t,message:o}})},openUrl:t=>A({channel:E,v:1,type:"open-url",id:l(d),payload:{url:t}}),openCommit:t=>Ze(t)?A({channel:E,v:1,type:"open-commit",id:l(d),payload:{sha:t}}):Promise.reject(new a("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),openSurface:t=>A({channel:E,v:1,type:"open-surface",id:l(d),payload:{surfaceId:t}}),writeClipboard:t=>A({channel:E,v:1,type:"clipboard-write",id:l(d),payload:{text:t}}),compose:t=>A({channel:E,v:1,type:"compose",id:l(d),payload:t}),attach:t=>A({channel:E,v:1,type:"attach",id:l(d),payload:Y(t)}),startSession:async t=>{t.projectId!==void 0&&w(t.projectId);let o=t.worktree;o&&o!==!0&&(o.kind==="existing"?w(o.directory):(o.name!==void 0&&w(o.name,200),o.baseBranch!==void 0&&w(o.baseBranch,200)));let s=await y({channel:E,v:1,type:"start-session",id:l(d),payload:rt(t)},e.requestTimeoutMs??18e4);if(!qe(s))throw new a("HOST_REJECTED","Host did not return a session.");return s},prompt:t=>y({channel:E,v:1,type:"prompt",id:l(d),payload:nt(t)}).then(o=>{if(!Qe(o))throw new a("HOST_REJECTED","Host did not return a prompt result.");return o}),sessionLink:t=>A({channel:E,v:1,type:"session-link",id:l(d),payload:Y(t)}),close:()=>A({channel:E,v:1,type:"close",id:l(d)}),oauthStart:()=>A({channel:E,v:1,type:"oauth-start",id:l(d)}),oauthDisconnect:()=>A({channel:E,v:1,type:"oauth-disconnect",id:l(d)}),request:t=>(be(t.path)?y({channel:E,v:1,type:"request",id:l(d),payload:t}):Oo()).then(o=>{if(!ge(o))throw new a("HOST_REJECTED","Host request result was empty.");return o}),serviceRequest:t=>(be(t.path)?y({channel:E,v:1,type:"service-request",id:l(d),payload:t}):Oo()).then(o=>{if(!ge(o))throw new a("HOST_REJECTED","Host service request result was empty.");return o}),serviceStatus:()=>y({channel:E,v:1,type:"service-status",id:l(d)}).then(t=>{if(!at(t))throw new a("HOST_REJECTED","Host did not return service status.");return t}),readFile:t=>(q(t)?y({channel:E,v:1,type:"file-read",id:l(d),payload:{path:t}}):ke()).then(o=>{if(!ct(o))throw new a("HOST_REJECTED","Host did not return file content.");return o}),writeFile:(t,o)=>q(t)?o.length>Ae?Promise.reject(new a("FILE_TOO_LARGE",`Content is over ${Ae} characters.`)):y({channel:E,v:1,type:"file-write",id:l(d),payload:{path:t,content:o}}).then(s=>{if(!dt(s))throw new a("HOST_REJECTED","Host did not confirm the write.");return s}):ke(),listDir:t=>(q(t)?y({channel:E,v:1,type:"file-list",id:l(d),payload:{path:t}}):ke()).then(o=>{if(!lt(o))throw new a("HOST_REJECTED","Host did not return directory entries.");return o}),stat:t=>(q(t)?y({channel:E,v:1,type:"file-stat",id:l(d),payload:{path:t}}):ke()).then(o=>{if(!pt(o))throw new a("HOST_REJECTED","Host did not return file status.");return o}),generate:t=>{let o=t.prompt.trim(),s=t.system?.trim();if(o.length===0||o.length>Re)return Promise.reject(new a("HOST_REJECTED",`Prompt must be 1 to ${Re} characters.`));if(s!==void 0&&(s.length===0||s.length>xe))return Promise.reject(new a("HOST_REJECTED",`System prompt must be 1 to ${xe} characters.`));let i=t.maxOutputTokens===void 0?void 0:Math.min(tt,Math.max(1,Math.floor(t.maxOutputTokens)));if(i!==void 0&&!Number.isFinite(i))return Promise.reject(new a("HOST_REJECTED","maxOutputTokens must be a number."));let T={prompt:o};return s!==void 0&&(T.system=s),i!==void 0&&(T.maxOutputTokens=i),y({channel:E,v:1,type:"generate",id:l(d),payload:T},e.requestTimeoutMs??ot).then(S=>{if(!ut(S))throw new a("HOST_REJECTED","Host did not return generated text.");return S})},onLateGenerateResult:t=>{K.add(t);for(let o of He.splice(0))O([t],o);return Nt(),()=>{K.delete(t)}},setBadge:t=>A({channel:E,v:1,type:"badge",id:l(d),payload:{count:st(t)}}),setHeight:t=>A({channel:E,v:1,type:"resize",id:l(d),payload:{height:it(t)}}),onFileOpen:t=>(ue.add(t),Xe||(Xe=!0,r.addEventListener("keydown",Lt,!0)),ne&&t(ne),()=>{ue.delete(t)}),onFileSnapshot:t=>(re=t,()=>{re===t&&(re=null)}),onFileSaved:t=>(Ee.add(t),()=>{Ee.delete(t)}),reportFileChange:t=>Fe({...R,type:"file-change",payload:{dirty:t.dirty,edited:t.edited}}),requestFileSave:wt,reportFileUnsupported:()=>Fe({...R,type:"file-unsupported"}),dispose:()=>{for(let t of z.keys())C({...R,type:"workspace-unsubscribe",id:l(d),payload:{subscriptionId:t}});z.clear();for(let t of W.keys())C({...R,type:"shells-unsubscribe",id:l(d),payload:{subscriptionId:t}});W.clear(),G=!0,te=null,oe=null,re=null,ue.clear(),Ee.clear(),Xe&&r.removeEventListener("keydown",Lt,!0),r.removeEventListener("message",Mt),r.removeEventListener("keydown",Pt,!0),r.removeEventListener("pointerover",Se),r.removeEventListener("pointermove",Se),r.removeEventListener("pointerout",Gt),r.removeEventListener("focus",Dt),r.removeEventListener("blur",Ht);for(let t of j.values())clearTimeout(t.timer),t.reject(new a("HOST_UNAVAILABLE","Host client was disposed."));j.clear(),u.clear(),b.clear(),M.clear(),U.clear(),P.clear(),F.clear(),ee.clear(),le.clear(),pe.clear(),K.clear(),He.length=0}}};var xo=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var wr=new Set(xo);var Ko=10*6e4;var jo=10*6e4;var zo=10*6e4;var bo=["none","agent","user"];var Pr=new Set(bo);var Wo=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],Jo=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],go=(e,r)=>{r.style.colorScheme=e.mode;for(let[n,p]of Wo)r.style.setProperty(n,e.tokens[p]);for(let[n,p,u]of Jo){let b=e.tokens[u]??"";r.style.setProperty(n,b),r.style.setProperty(p,b)}r.style.setProperty("font-family",e.tokens.font),r.style.setProperty("font-size","0.875rem"),r.style.setProperty("line-height","1.45"),r.style.setProperty("color",e.tokens.foreground)},mt=(e,r)=>{go(e.theme,r),r.dataset&&(r.dataset.ocSurface=e.surface,r.dataset.ocTheme=e.theme.mode)};var Yo={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},f=(e,r)=>`var(--${e}, var(--oc-${Yo[e]}, ${r}))`,X=f("surface-background","transparent"),Ue=f("surface-elevated","transparent"),Q=f("surface-elevated-foreground","inherit"),N=f("surface-foreground","inherit"),h=f("surface-muted-foreground","gray"),qo=f("surface-muted","transparent"),V=f("interactive-border","currentColor"),v=f("interactive-hover","transparent"),B=f("interactive-active","transparent"),Ot=f("interactive-selection","transparent"),At=f("interactive-selection-foreground","inherit"),H=f("primary","currentColor"),Rt=f("primary-text","inherit"),xt=f("error-text","inherit"),Qo=f("font-sans","inherit"),bt=f("font-mono","monospace"),Uo=f("radius","9px"),gt=`calc(${Uo} - 2px)`,ko=`calc(${Uo} - 4px)`,m=(e,r,n="transparent")=>`color-mix(in srgb, ${e} ${r}%, ${n})`,Io=`background-image: linear-gradient(${v}, ${v});`,kt=(e,r="0.5px")=>`box-shadow: inset 0 0 0 ${r} ${e}, var(--oc-sdk-field-lift);`,It="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",yo="box-shadow: var(--oc-sdk-lit);",yt=`inset 0 0.5px 0 0 ${m(N,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,Zo=`
:root {
  --oc-sdk-edge: ${m(N,16)};
  --oc-sdk-field-bg: ${Ue};
  --oc-sdk-raised-bg: ${X};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${m(N,14)};
  --oc-sdk-field-bg: ${m(X,50,Ue)};
  --oc-sdk-raised-bg: ${Ue};
  --oc-sdk-field-lift: ${yt};
  --oc-sdk-raised-lift: ${yt};
  --oc-sdk-lit: ${yt};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,ye=e=>{let r=f(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${r}; --oc-sdk-tone-text: ${f(`${e}-text`,"inherit")}; }`},er=`
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 32px; padding: 0 12px; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: 6px; height: 28px; padding: 0 10px; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: 4px; height: 24px; padding: 0 8px; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: 14px; height: 14px; }

.oc-sdk-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: 32px; padding: 0 10px; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: 8px 10px; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: 34px; padding-right: 34px; }
.oc-sdk-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: 24px; height: 24px; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: 28px; padding: 0 10px; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: 2px; min-width: 160px; max-width: calc(100vw - 16px); max-height: min(320px, calc(100vh - 16px)); overflow: auto; padding: 4px; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: 2px 2px 4px; }
.oc-sdk-popup-search .oc-sdk-input { height: 28px; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: 14px; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: 8px; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: 8px; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; margin-top: 3px; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: 36px; height: 20px; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: 2px; padding: 2px; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: 1px 6px; font-size: 11px; font-weight: 500; line-height: 16px; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: 64px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: 16px 8px; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 40px 16px; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: 12px; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: 8px; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: 16px; height: 16px; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: 12px; height: 12px; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: 12px; padding: 8px 12px; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: 8px; width: 100%; margin: 8px 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: 4px 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: 6px; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }
.oc-sdk-progress-value { display: inline-flex; align-items: center; gap: 2px; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { font-weight: 600; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: 8px 0; }
`,vo=`${Zo}
.oc-sdk { color: ${N}; font-family: ${Qo}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${Io} }
.oc-sdk-mono { font-family: ${bt}; }
.oc-sdk-muted { color: ${h}; }
${ye("success")}${ye("warning")}${ye("error")}${ye("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${H}; --oc-sdk-tone-text: ${Rt}; }

.oc-sdk-btn { border-radius: ${gt}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${ko}; }
.oc-sdk-btn[data-variant="default"] { color: ${Rt}; background: ${m(H,10,X)}; border-color: ${m(H,12)}; ${yo} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${m(H,16,X)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${m(H,22,X)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${qo}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${v}, ${v}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${B}, ${B}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${Q}; ${It} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${v}, ${v}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${B}, ${B}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${v}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${B}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${f("status-error","red")}; color: ${xt}; background: ${m("var(--oc-sdk-tone)",7,X)}; border-color: ${m("var(--oc-sdk-tone)",12)}; ${yo} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${m("var(--oc-sdk-tone)",9,X)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${m("var(--oc-sdk-tone)",11,X)}; box-shadow: none; }

.oc-sdk-field-note { color: ${h}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${xt}; }
.oc-sdk-input { border-radius: ${gt}; background: var(--oc-sdk-field-bg); color: ${Q}; ${kt("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${h}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${v}, ${v}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${kt(m(N,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${kt(f("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${bt}; }

.oc-sdk-search-icon { color: ${h}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${H}; }
.oc-sdk-search-clear { border-radius: ${ko}; color: ${h}; }
.oc-sdk-search-clear:hover { background: ${v}; color: ${N}; }

.oc-sdk-trigger { border-radius: ${gt}; background: var(--oc-sdk-raised-bg); color: ${Q}; ${It} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${v}, ${v}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${B}, ${B}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${h}; }
.oc-sdk-trigger-chevron { color: ${h}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${Q}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${Ue}; background-clip: padding-box; color: ${Q}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${v}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${Ot}; color: ${At}; }
.oc-sdk-option-check { color: ${N}; }
.oc-sdk-option[data-destructive="true"] { color: ${xt}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${m(f("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${h}; }
.oc-sdk-popup-empty { color: ${h}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${V}; border-radius: 4px; color: ${N}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${m(N,60,V)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${V}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${X}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${H}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(16px); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${Io} }
.oc-sdk-check-desc { color: ${h}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${m(N,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${h}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${N}; }
.oc-sdk-tab[aria-selected="true"] { color: ${At}; background: ${Ot}; border-color: ${V}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${Q}; background: var(--oc-sdk-raised-bg); ${It} }
.oc-sdk-tab-count { color: ${h}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${m(N,6)}; color: ${h}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${m("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${v}; }
.oc-sdk-row[aria-selected="true"] { background: ${Ot}; color: ${At}; }
.oc-sdk-row-lead { font-family: ${bt}; color: ${h}; }
.oc-sdk-row-sub { color: ${h}; }
.oc-sdk-row-meta { color: ${h}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${h}; }

.oc-sdk-empty-body { color: ${h}; }

.oc-sdk-spinner { color: ${h}; }
.oc-sdk-spinner-ring { border-color: ${V}; border-top-color: ${H}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${m("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${h}; }

.oc-sdk-separator { color: ${h}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${m(V,40)}; }

.oc-sdk-progress-label { color: ${h}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${m(N,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${H}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${f("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${f("success-text","inherit")}; }

.oc-sdk-text a { color: ${Rt}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${m(V,60)}; }
`,g=`
${Be}
${er}
${vo}`;var Co="oc-sdk-ui-style";var k=e=>{let r=document.getElementById(Co);if(r instanceof HTMLStyleElement){r.textContent!==e&&(r.textContent=e);return}Ke(document);let n=document.createElement("style");n.id=Co,n.textContent=e,document.head.appendChild(n)},I=(e,r)=>{let n=document.createElement(e);return r&&(n.className=r),n},$=e=>{let r=I("button",e);return r.type="button",r},L=(e,r)=>{let n=r??"";e.textContent!==n&&(e.textContent=n)};var tr=()=>{let e=document.createElement("span");return e.className="oc-sdk-spinner-ring",e.setAttribute("aria-hidden","true"),e},Z=(e,r)=>{k(g);let n=r,p=$("oc-sdk oc-sdk-btn"),u=tr(),b=document.createElement("span");p.append(b),e.append(p);let M=()=>{p.dataset.variant=n.variant??"default",p.dataset.size=n.size??"default",p.disabled=!!n.disabled||!!n.loading,p.dataset.loading=n.loading?"true":"false",p.setAttribute("aria-busy",n.loading?"true":"false"),n.loading&&u.parentNode!==p?p.prepend(u):!n.loading&&u.parentNode===p&&u.remove(),L(b,n.label)},U=()=>{n.disabled||n.loading||n.onClick()};return p.addEventListener("click",U),M(),{update:P=>{n={...n,...P},M()},dispose:()=>{p.removeEventListener("click",U),p.remove()}}};var de=class extends Error{constructor(r){super(r),this.name="AccountResponseError"}};function No(e){let r;try{r=JSON.parse(e)}catch{throw new de("Vast.ai returned an unreadable account response.")}if(!r||typeof r!="object"||Array.isArray(r))throw new de("Vast.ai returned an invalid account response.");let n=r.credit;if(typeof n!="number"||!Number.isFinite(n))throw new de("Vast.ai did not return a valid credit amount.");return{credit:n,autoTopUp:"Unknown"}}var ir={visible:()=>document.visibilityState==="visible",every:(e,r)=>setInterval(e,r),cancel:e=>clearInterval(e)},we=class{host;changed;clock;env;connected=!1;account="";timer;inFlight=!1;generation=0;lastSuccess;credit;constructor(r,n,p=Date.now,u=ir){this.host=r,this.changed=n,this.clock=p,this.env=u,this.changed({kind:"disconnected"})}connection(r,n){if(this.connected===r&&this.account===n)return;this.generation++,this.stopTimer();let u=this.account!==n;if(this.connected=r,this.account=n,(!r||u)&&(this.credit=void 0,this.lastSuccess=void 0),!r){this.setState({kind:"disconnected"});return}this.setState({kind:"loading"}),this.refresh(),this.syncTimer()}visibilityChanged(){if(!this.env.visible()){this.stopTimer(),this.generation++;return}this.connected&&(this.refresh(),this.syncTimer())}refresh(){if(!this.connected||!this.env.visible()||this.inFlight)return;let r=this.generation;this.inFlight=!0,this.setState({kind:"loading",previous:this.credit,lastSuccess:this.lastSuccess}),this.host.request({method:"GET",path:"/api/v0/users/current/"}).then(n=>{if(r===this.generation)if(n.status===401||n.status===403)this.setState({kind:"invalid",previous:this.credit,lastSuccess:this.lastSuccess});else if(n.status<200||n.status>=300)this.setState({kind:"unavailable",previous:this.credit,lastSuccess:this.lastSuccess});else{let p=No(n.body);this.credit=p.credit,this.lastSuccess=this.clock(),this.setState({kind:"success",credit:p.credit,lastSuccess:this.lastSuccess})}}).catch(()=>{r===this.generation&&this.setState({kind:"unavailable",previous:this.credit,lastSuccess:this.lastSuccess})}).finally(()=>{this.inFlight=!1,r!==this.generation&&this.connected&&this.env.visible()&&this.refresh()})}dispose(){this.generation++,this.connected=!1,this.stopTimer()}syncTimer(){this.timer||!this.connected||!this.env.visible()||(this.timer=this.env.every(()=>this.refresh(),6e4))}stopTimer(){this.timer&&this.env.cancel(this.timer),this.timer=void 0}setState(r){this.changed(r)}};var Ge=ht(),Le=document.querySelector("#credit"),Pe=document.querySelector("#detail"),ar=document.querySelector("#refresh"),Mo=Z(ar,{label:"Refresh",variant:"outline",size:"xs",onClick:()=>De.refresh()}),Ut=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD"});function cr(e){e.kind==="disconnected"?(Le.textContent="Not connected",Pe.textContent="Auto-top-up: Unknown \xB7 Connect Vast.ai in Settings \u2192 Integrations."):e.kind==="loading"?(Le.textContent=e.previous===void 0?"Loading\u2026":`${Ut.format(e.previous)} \xB7 refreshing`,Pe.textContent=`Auto-top-up: Unknown \xB7 ${e.lastSuccess?`Last successful refresh ${new Date(e.lastSuccess).toLocaleTimeString()}`:"Available credit"}`):e.kind==="success"?(Le.textContent=Ut.format(e.credit),Pe.textContent=`Auto-top-up: Unknown \xB7 Available credit \xB7 Updated ${new Date(e.lastSuccess).toLocaleTimeString()}`):(Le.textContent=e.previous===void 0?e.kind==="invalid"?"Invalid credentials":"Unavailable":`${Ut.format(e.previous)} \xB7 Stale`,Pe.textContent=`Auto-top-up: Unknown \xB7 ${e.kind==="invalid"?"Vast.ai rejected the connected key.":"Could not refresh Vast.ai credit."}${e.lastSuccess?` Last successful refresh ${new Date(e.lastSuccess).toLocaleTimeString()}.`:""}`),Mo.update({disabled:e.kind==="disconnected"||e.kind==="loading"})}var De=new we(Ge,cr);Ge.onReady(e=>mt(e,document.documentElement));Ge.onConnection(({connected:e,account:r})=>De.connection(e,r));document.addEventListener("visibilitychange",()=>De.visibilityChanged());window.addEventListener("pagehide",()=>{De.dispose(),Mo.dispose(),Ge.dispose()},{once:!0});})();
