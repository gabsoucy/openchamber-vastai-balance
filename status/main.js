"use strict";(()=>{var E="openchamber.sdk";var me="data-oc-scrolling",Ke=`
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
:hover, [${me}] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [${me}] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [${me}]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [${me}] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;function je(e){let r=e.documentElement;if(r.hasAttribute("data-oc-scrollbar-activity"))return;r.setAttribute("data-oc-scrollbar-activity","");let n=new WeakMap;e.addEventListener("scroll",d=>{let l=d.target===e?r:d.target;if(!(l instanceof Element))return;l.hasAttribute("data-oc-scrolling")||l.setAttribute("data-oc-scrolling","");let S=n.get(l);S!==void 0&&clearTimeout(S),n.set(l,setTimeout(()=>{n.delete(l),l.removeAttribute("data-oc-scrolling")},1e3))},{capture:!0,passive:!0})}var Xo=`(${je.toString()})(document);`;var Wt=/^[a-z][a-z0-9-]{0,39}$/;var Kt=e=>Object(e)===e&&!Array.isArray(e),ze=(e,r)=>Object.keys(e).every(n=>r.includes(n)),jt=e=>String(e)===e&&e.length>=1&&e.length<=60,zt=e=>String(e)===e&&e.length>=1&&e.length<=80,Jt=e=>{if(!Array.isArray(e)||e.length>4)return!1;let r=new Set;for(let n of e){if(!Kt(n)||!Wt.test(n.id)||!jt(n.label)||n.disabled!==void 0&&n.disabled!==!0&&n.disabled!==!1||r.has(n.id))return!1;if(r.add(n.id),n.kind==="button"){if(!ze(n,["kind","id","label","disabled"]))return!1;continue}if(n.kind!=="select"||!ze(n,["kind","id","label","value","options","disabled"])||!zt(n.value)||!Array.isArray(n.options)||n.options.length<1||n.options.length>16)return!1;let d=new Set;for(let l of n.options){if(!Kt(l)||!ze(l,["value","label"])||!zt(l.value)||!jt(l.label)||d.has(l.value))return!1;d.add(l.value)}if(!d.has(n.value))return!1}return!0};var qt=["{id}","{segment}","{segments+}"];var kr=new Set(qt);var Yt=["turn-finished","turn-failed","permission-asked","question-asked"];var yr=new Set(Yt);var We=e=>"bytes"in e?e.bytes.byteLength:e.content.length,Qt=(e,r)=>{if(e.path!==r.path||e.readOnly!==r.readOnly)return!1;if(e.encoding==="text"||r.encoding==="text")return e.encoding==="text"&&r.encoding==="text"&&e.content===r.content;if(e.bytes.byteLength!==r.bytes.byteLength)return!1;for(let n=0;n<e.bytes.byteLength;n+=1)if(e.bytes[n]!==r.bytes[n])return!1;return!0};var Zt=/^[A-Za-z0-9_-]{1,80}$/;var eo=["left","right","top","bottom"];var to=(e,r=0,n={remaining:16e3})=>{if(--n.remaining<0||r>=32)return!1;if(e===null)return!0;let d=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let l of d)if(!to(l,r+1,n))return!1;return!0},Je=e=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every(r=>/^(0|[1-9]\d*)$/.test(r)&&Number(r)<e.length)&&e.every(Je);if(Object(e)===e){let r=Object.getPrototypeOf(e);return(r===null||r===Object.prototype)&&Object.values(e).every(Je)}return String(e)===e||Number.isFinite(e)},qe=e=>{try{return String(e.id)!==e.id||!Zt.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!eo.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!to(e.data)||!Je(e.data)?!1:JSON.stringify(e.data).length<=16e3}catch{return!1}};var ro=["file","directory","other","missing"],Qe=e=>!!(e&&"sessionId"in e),Ze=e=>!!(e&&"sent"in e&&!("sessionId"in e));var no=/^[0-9a-f]{7,64}$/i,et=e=>no.test(e),Oe=500,Ae=32e3,so=16e3,io=128,ao=200,co=2e3,lo=16e3,po=80,uo=200,Eo=16e3;var _o=2e3;var tt=2e4,Re=1024,xe=2e6;var be=64e3,ge=8e3,ot=4e3;var rt=96e4,$o=60*6e4;var So=999,To=1e4,ce=500,fo=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],ho=["stopped","starting","ready","failed"],Vo=new Set(fo),mo=e=>Vo.has(e),Oo=e=>e&&mo(e)?e:"HOST_REJECTED",q=e=>e===void 0?!1:e===null||e===!0||e===!1||String(e)===e?!0:Number(e)===e?Number.isFinite(e):Array.isArray(e)?e.every(q):Object(e)===e?Object.values(e).every(q):!1,Ao=e=>q(e)&&JSON.stringify(e).length<=Eo,oo=e=>e?.trim().slice(0,uo)??"",Y=e=>{let r=e.id.trim().slice(0,io),n=e.title.trim().slice(0,ao),d=e.url.trim().slice(0,co),l=e.text?.trim().slice(0,lo),S=e.author?.trim().slice(0,po),x=e.kind==="pull"?"pull":"issue",f={providerId:e.providerId.trim(),id:r,title:n||r,url:d,kind:x};if(l&&(f.text=l),S&&(f.author=S),x==="pull"){let C=oo(e.branches?.head),L=oo(e.branches?.base);C&&L&&(f.branches={head:C,base:L})}return Ao(e.data)&&(f.data=e.data),f},nt=e=>{let r=Y(e);return e.projectId&&(r.projectId=e.projectId),e.navigation&&(r.navigation=e.navigation),e.worktree&&(r.worktree=e.worktree),r},st=e=>{let r={text:e.text.trim().slice(0,so)};return e.send&&(r.send=!0),r},it=e=>e===null||!Number.isFinite(e)?null:Math.min(So,Math.max(0,Math.round(e))),at=e=>Number.isFinite(e)?Math.min(To,Math.max(0,Math.ceil(e))):0;var Q=e=>e.length>0&&e.length<=Re&&!e.includes("\0")&&!e.includes("\\");var ke=e=>!e.startsWith("/")||e.includes("\0")||e.includes("\\")||e.includes("://")||e.length>_o?!1:!e.split("/").some(n=>n==="."||n===".."),Bo=new Set(ho),ct=e=>!!(e&&"status"in e&&Bo.has(String(e.status))&&!("body"in e)),Ie=e=>!!(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),dt=e=>!!(e&&"content"in e&&String(e.content)===e.content),lt=e=>!!(e&&"written"in e&&e.written===!0),pt=e=>!!(e&&"entries"in e&&Array.isArray(e.entries)),Ko=new Set(ro),ut=e=>!!(e&&"kind"in e&&"size"in e&&Ko.has(String(e.kind))&&Number.isFinite(e.size)),Et=e=>!!(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),jo=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late"]),zo=e=>Object(e)===e?e:null,Ye=e=>String(e)===e&&e.length>0,Wo=e=>{if(!Ye(e.id))return null;if(e.ok===!0){let r={channel:E,v:1,type:"result",id:e.id,ok:!0};return Object(e.payload)===e.payload&&(r.payload=e.payload),r}return e.ok===!1&&Ye(e.error)?{channel:E,v:1,type:"result",id:e.id,ok:!1,error:e.error,code:Oo(Ye(e.code)?e.code:void 0)}:null},_t=e=>{let r=zo(e);return!r||r.channel!==E||r.v!==1?null:r.type==="result"?Wo(r):!jo.has(String(r.type))||Object(r.payload)!==r.payload?null:r};var Ro=e=>"key"in e&&"metaKey"in e&&"ctrlKey"in e,Jo=e=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s",a=class extends Error{code;constructor(r,n){super(n),this.name="HostRequestError",this.code=r}},xo=()=>Promise.reject(new a("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),ye=()=>Promise.reject(new a("BAD_PATH",`File path must be 1 to ${Re} characters without NUL or backslash.`)),ve=e=>{if(e!==void 0){if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new a("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0}},u=e=>(e.value+=1,`oc-${e.value}`),mt=(e={})=>{let r=e.target??("window"in globalThis?window:null);if(!r)throw new a("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let n=e.acceptSource??(t=>t===r.parent),d=e.requestTimeoutMs??tt,l=new Set,S=new Set,x=new Set,f=new Set,C=new Set,L=new Set,D=new Set,ue=new Set,Ee=new Set,j=new Set,Xe=[],oe=null,re=null,_e=new Set,Se=new Set,ne=null,se=null,Fe=!1,z=new Map,W=new Map,J=new Map,H=!1,p={value:0},c=null,X=null,ie=!1,ae=!1,Mt=null,wt=t=>t?{sessionId:t.id,phase:t.busy?"started":"completed"}:null,M=t=>{r.parent.postMessage(t,"*")},Lt=()=>{H||r.parent===r||j.size===0||c?.features?.lateGenerateResults!==!0||M({channel:E,v:1,type:"generate-late-listen"})},R=(t,o)=>{for(let s of t)try{s(o)}catch(i){console.error(i)}},Pt=t=>{if(!(t instanceof MessageEvent)||!n(t.source))return;let o=_t(t.data);if(!o)return;if(o.type==="workspace"){let i=W.get(o.payload.subscriptionId);i&&R([i],o.payload.snapshot);return}if(o.type==="shells"){let i=J.get(o.payload.subscriptionId);i&&R([i],o.payload.snapshot);return}if(o.type==="ready"){c=o.payload,X=wt(o.payload.session),R(l,o.payload),R(S,o.payload.directory),R(x,o.payload.session),X&&R(f,X),R(C,o.payload.connection),R(L,o.payload.settings),R(D,o.payload.item),Lt();return}if(o.type==="generate-late"){j.size===0?Xe.push(o.payload):R(j,o.payload);return}if(o.type==="directory"){c&&(c={...c,directory:o.payload.directory}),R(S,o.payload.directory);return}if(o.type==="session"){c&&(c={...c,session:o.payload.session}),o.payload.session?X?.sessionId!==o.payload.session.id&&(X=wt(o.payload.session)):X=null,R(x,o.payload.session);return}if(o.type==="session-lifecycle"){X=o.payload,R(f,o.payload);return}if(o.type==="connection"){c&&(c={...c,connection:o.payload.connection}),R(C,o.payload.connection);return}if(o.type==="settings"){c&&(c={...c,settings:o.payload.settings}),R(L,o.payload.settings);return}if(o.type==="item"){c&&(c={...c,item:o.payload.item}),R(D,o.payload.item);return}if(o.type==="status-control-event"){R(ue,o.payload);return}if(o.type==="popover-closed"){R(Ee,o.payload);return}if(o.type==="action"){let i=T=>{H||M({channel:E,v:1,type:"action-result",id:o.id,payload:T})},h=re;if(!h){i({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>h(o.payload)).then(()=>i({ok:!0}),T=>{let k=(T instanceof Error?T.message:String(T)).trim();i({ok:!1,error:(k||"Action failed.").slice(0,ce)})});return}if(o.type==="file-open"){let i=o.payload;if(se&&Qt(se,i))return;se=i,R(_e,o.payload);return}if(o.type==="file-saved"){R(Se,o.payload.version);return}if(o.type==="file-snapshot"){let i=k=>{H||M({channel:E,v:1,type:"file-snapshot-result",id:o.id,payload:k})},h=k=>i({error:(k.trim()||"Could not read the edited file.").slice(0,ce)}),T=ne;if(!T){h("This extension does not edit files.");return}Promise.resolve().then(()=>T(o.payload.purpose)).then(k=>{if(We(k)>2e7){h(`The file is over ${2e7} ${"bytes"in k?"bytes":"characters"}.`);return}if(k.version.length>256){h(`The snapshot version is over ${256} characters.`);return}i({snapshot:"bytes"in k?{bytes:k.bytes,version:k.version}:{content:k.content,version:k.version}})},k=>h(k instanceof Error?k.message:String(k)));return}if(o.type==="resolve"){let i=T=>{M({channel:E,v:1,type:"resolve-result",id:o.id,payload:T})},h=oe;if(!h){i({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>h(o.payload)).then(T=>i({item:T?Y(T):null}),T=>{let k=(T instanceof Error?T.message:String(T)).trim();i({error:(k||"Command failed.").slice(0,ce)})});return}let s=z.get(o.id);if(s){if(clearTimeout(s.timer),z.delete(o.id),o.ok){s.resolve(o.payload);return}s.reject(new a(o.code,o.error))}};r.addEventListener("message",Pt),M({channel:E,v:1,type:"hello"});let U=(t,o=d)=>H||r.parent===r?Promise.reject(new a("HOST_UNAVAILABLE","No host frame. This page is not in an iframe.")):new Promise((s,i)=>{let h=setTimeout(()=>{z.delete(t.id),i(new a("HOST_TIMEOUT","Host did not answer in time."))},o);z.set(t.id,{resolve:s,reject:i,timer:h}),M(t)}),b=t=>U(t).then(()=>{}),g={channel:E,v:1},$e=t=>{!H&&r.parent!==r&&M(t)},Gt=()=>$e({...g,type:"file-save"}),Dt=t=>{!Ro(t)||!Jo(t)||(t.preventDefault(),Gt())},Ht=t=>{!Ro(t)||t.key!=="Escape"||c?.surface!=="popover"||!c.popover||(t.preventDefault(),Vt(c.popover.id,"escape").catch(()=>{}))},Te=()=>{let t=c?.surface==="popover"?c.popover:void 0;if(!t)return;let o=ie||ae;Mt!==o&&(Mt=o,Bt(t.id,o).catch(()=>{}))},fe=()=>{c?.surface!=="popover"||ie||(ie=!0,Te())},Xt=t=>{c?.surface!=="popover"||t.relatedTarget!==null||!ie||(ie=!1,Te())},Ft=()=>{c?.surface!=="popover"||ae||(ae=!0,Te())},$t=()=>{c?.surface!=="popover"||!ae||(ae=!1,Te())},P=(t,o=1024)=>{if(!t.trim()||t.length>o)throw new a("HOST_REJECTED",`Identity must contain 1 to ${o} characters.`)},Ve=async t=>{t.kind!=="projects"&&P(t.projectId);let o=await U({...g,type:"workspace-read",id:u(p),payload:t});if(!o||!("kind"in o)||!("state"in o)||o.kind!==t.kind)throw new a("HOST_REJECTED","Host did not return workspace data.");return o},Be=async(t,o)=>{t.kind!=="projects"&&P(t.projectId);let s=u(p);W.set(s,o);try{await b({...g,type:"workspace-subscribe",id:u(p),payload:{subscriptionId:s,query:t}})}catch(i){throw W.delete(s),H||M({...g,type:"workspace-unsubscribe",id:u(p),payload:{subscriptionId:s}}),i}return()=>{!W.delete(s)||H||M({...g,type:"workspace-unsubscribe",id:u(p),payload:{subscriptionId:s}})}},Ho=async(t,o)=>{t.kind==="session"&&P(t.sessionId),t.kind==="project"&&P(t.projectId);let s=u(p);J.set(s,o);try{await b({...g,type:"shells-subscribe",id:u(p),payload:{subscriptionId:s,scope:t}})}catch(i){throw J.delete(s),H||M({...g,type:"shells-unsubscribe",id:u(p),payload:{subscriptionId:s}}),i}return()=>{!J.delete(s)||H||M({...g,type:"shells-unsubscribe",id:u(p),payload:{subscriptionId:s}})}},he=async t=>{if("key"in t&&(t.key.length===0||t.key.length>128))throw new a("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(t.op==="set"&&!q(t.value))throw new a("HOST_REJECTED","Storage values must be JSON.");if(t.op==="set"&&new TextEncoder().encode(JSON.stringify(t.value)).length>65536)throw new a("HOST_REJECTED","Storage value exceeds 64 KiB.");if(t.scope==="device"&&c?.features?.deviceStorage!==!0)throw new a("UNSUPPORTED","This host does not support device storage.");let o=await U({...g,type:"storage",id:u(p),payload:t});if(!o||!("storage"in o)||o.op!==t.op)throw new a("HOST_REJECTED","Host did not return storage data.");return o},Vt=(t,o)=>c?.features?.popovers!==!0&&!(c?.surface==="popover"&&c.popover?.id===t)?Promise.reject(new a("UNSUPPORTED","This host does not support popovers.")):b({...g,type:"popover-close",id:u(p),payload:o?{id:t,reason:o}:{id:t}}),Bt=(t,o)=>c?.features?.popovers!==!0&&!(c?.surface==="popover"&&c.popover?.id===t)?Promise.reject(new a("UNSUPPORTED","This host does not support popovers.")):b({...g,type:"popover-anchor",id:u(p),payload:{id:t,active:o}});return r.addEventListener("keydown",Ht,!0),r.addEventListener("pointerover",fe),r.addEventListener("pointermove",fe),r.addEventListener("pointerout",Xt),r.addEventListener("focus",Ft),r.addEventListener("blur",$t),{onAction:t=>(re=t,()=>{re===t&&(re=null)}),listProjects:async()=>{let t=await Ve({kind:"projects"});if(t.kind!=="projects")throw new a("HOST_REJECTED","Expected projects.");return t},listWorktrees:async t=>{let o=await Ve({kind:"worktrees",projectId:t});if(o.kind!=="worktrees")throw new a("HOST_REJECTED","Expected worktrees.");return o},listSessions:async t=>{let o=await Ve({kind:"sessions",projectId:t});if(o.kind!=="sessions")throw new a("HOST_REJECTED","Expected sessions.");return o},onProjects:t=>Be({kind:"projects"},o=>{o.kind==="projects"&&t(o)}),onWorktrees:(t,o)=>Be({kind:"worktrees",projectId:t},s=>{s.kind==="worktrees"&&o(s)}),onSessions:(t,o)=>Be({kind:"sessions",projectId:t},s=>{s.kind==="sessions"&&o(s)}),onRunningShells:(t,o)=>Ho(t,o),readShellOutput:async(t,o)=>{P(t,128);let s=o?.cursor;if(s!==void 0&&(!Number.isInteger(s)||s<0))throw new a("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let i=o?.tailBytes;if(i!==void 0&&(!Number.isInteger(i)||i<1||i>65536))throw new a("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${65536}.`);let T=await U({...g,type:"shell-output",id:u(p),payload:{shellId:t,cursor:s,tailBytes:i}});if(!T||typeof T.output!="string"||!Number.isFinite(T.cursor))throw new a("HOST_REJECTED","Host did not return shell output.");return T},stopShell:async t=>{if(P(t,128),(await U({...g,type:"shell-stop",id:u(p),payload:{shellId:t}}))?.stopped!==!0)throw new a("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async t=>{P(t),await b({...g,type:"open-session",id:u(p),payload:{sessionId:t}})},storage:{get:async(t,o)=>{let s=ve(o),i={op:"get",key:t};s&&(i.scope=s);let h=await he(i);return h.op==="get"&&h.found?h.value:void 0},set:async(t,o,s)=>{let i=ve(s),h={op:"set",key:t,value:o};i&&(h.scope=i),await he(h)},delete:async(t,o)=>{let s=ve(o),i={op:"delete",key:t};s&&(i.scope=s),await he(i)},keys:async t=>{let o=ve(t),s={op:"keys"};o&&(s.scope=o);let i=await he(s);if(i.op!=="keys")throw new a("HOST_REJECTED","Expected storage keys.");return i.keys}},onReady:t=>(l.add(t),c&&t(c),()=>{l.delete(t)}),onDirectory:t=>(S.add(t),c&&t(c.directory),()=>{S.delete(t)}),onSession:t=>(x.add(t),c&&t(c.session),()=>{x.delete(t)}),onSessionLifecycle:t=>(f.add(t),X&&t(X),()=>{f.delete(t)}),onConnection:t=>(C.add(t),c&&t(c.connection),()=>{C.delete(t)}),onSettings:t=>(L.add(t),c&&t(c.settings),()=>{L.delete(t)}),onItem:t=>(D.add(t),c&&t(c.item),()=>{D.delete(t)}),onStatusControl:t=>(ue.add(t),()=>{ue.delete(t)}),onPopoverClosed:t=>(Ee.add(t),()=>{Ee.delete(t)}),setStatusControls:t=>c?.features?.statusControls!==!0?Promise.reject(new a("UNSUPPORTED","This host does not support status controls.")):Jt(t)?b({...g,type:"status-controls",id:u(p),payload:{controls:t}}):Promise.reject(new a("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options.")),openPopover:t=>c?.features?.popovers!==!0?Promise.reject(new a("UNSUPPORTED","This host does not support popovers.")):qe(t)?b({...g,type:"popover-open",id:u(p),payload:t}):Promise.reject(new a("HOST_REJECTED","Popover requests need bounded geometry and JSON data.")),closePopover:Vt,setPopoverAnchorActive:Bt,onResolve:t=>(oe=t,()=>{oe===t&&(oe=null)}),toast:t=>{let o=t.message.trim();return!o||o.length>Oe?Promise.reject(new a("HOST_REJECTED",`Toast message must contain 1 to ${Oe} characters.`)):t.copy&&t.copy!==!0&&(!t.copy.text.length||t.copy.text.length>Ae)?Promise.reject(new a("HOST_REJECTED",`Toast copy text must contain 1 to ${Ae} characters.`)):b({channel:E,v:1,type:"toast",id:u(p),payload:{...t,message:o}})},openUrl:t=>b({channel:E,v:1,type:"open-url",id:u(p),payload:{url:t}}),openCommit:t=>et(t)?b({channel:E,v:1,type:"open-commit",id:u(p),payload:{sha:t}}):Promise.reject(new a("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),openSurface:t=>b({channel:E,v:1,type:"open-surface",id:u(p),payload:{surfaceId:t}}),writeClipboard:t=>b({channel:E,v:1,type:"clipboard-write",id:u(p),payload:{text:t}}),compose:t=>b({channel:E,v:1,type:"compose",id:u(p),payload:t}),attach:t=>b({channel:E,v:1,type:"attach",id:u(p),payload:Y(t)}),startSession:async t=>{t.projectId!==void 0&&P(t.projectId);let o=t.worktree;o&&o!==!0&&(o.kind==="existing"?P(o.directory):(o.name!==void 0&&P(o.name,200),o.baseBranch!==void 0&&P(o.baseBranch,200)));let s=await U({channel:E,v:1,type:"start-session",id:u(p),payload:nt(t)},e.requestTimeoutMs??18e4);if(!Qe(s))throw new a("HOST_REJECTED","Host did not return a session.");return s},prompt:t=>U({channel:E,v:1,type:"prompt",id:u(p),payload:st(t)}).then(o=>{if(!Ze(o))throw new a("HOST_REJECTED","Host did not return a prompt result.");return o}),sessionLink:t=>b({channel:E,v:1,type:"session-link",id:u(p),payload:Y(t)}),close:()=>b({channel:E,v:1,type:"close",id:u(p)}),oauthStart:()=>b({channel:E,v:1,type:"oauth-start",id:u(p)}),oauthDisconnect:()=>b({channel:E,v:1,type:"oauth-disconnect",id:u(p)}),request:t=>(ke(t.path)?U({channel:E,v:1,type:"request",id:u(p),payload:t}):xo()).then(o=>{if(!Ie(o))throw new a("HOST_REJECTED","Host request result was empty.");return o}),serviceRequest:t=>(ke(t.path)?U({channel:E,v:1,type:"service-request",id:u(p),payload:t}):xo()).then(o=>{if(!Ie(o))throw new a("HOST_REJECTED","Host service request result was empty.");return o}),serviceStatus:()=>U({channel:E,v:1,type:"service-status",id:u(p)}).then(t=>{if(!ct(t))throw new a("HOST_REJECTED","Host did not return service status.");return t}),readFile:t=>(Q(t)?U({channel:E,v:1,type:"file-read",id:u(p),payload:{path:t}}):ye()).then(o=>{if(!dt(o))throw new a("HOST_REJECTED","Host did not return file content.");return o}),writeFile:(t,o)=>Q(t)?o.length>xe?Promise.reject(new a("FILE_TOO_LARGE",`Content is over ${xe} characters.`)):U({channel:E,v:1,type:"file-write",id:u(p),payload:{path:t,content:o}}).then(s=>{if(!lt(s))throw new a("HOST_REJECTED","Host did not confirm the write.");return s}):ye(),listDir:t=>(Q(t)?U({channel:E,v:1,type:"file-list",id:u(p),payload:{path:t}}):ye()).then(o=>{if(!pt(o))throw new a("HOST_REJECTED","Host did not return directory entries.");return o}),stat:t=>(Q(t)?U({channel:E,v:1,type:"file-stat",id:u(p),payload:{path:t}}):ye()).then(o=>{if(!ut(o))throw new a("HOST_REJECTED","Host did not return file status.");return o}),generate:t=>{let o=t.prompt.trim(),s=t.system?.trim();if(o.length===0||o.length>be)return Promise.reject(new a("HOST_REJECTED",`Prompt must be 1 to ${be} characters.`));if(s!==void 0&&(s.length===0||s.length>ge))return Promise.reject(new a("HOST_REJECTED",`System prompt must be 1 to ${ge} characters.`));let i=t.maxOutputTokens===void 0?void 0:Math.min(ot,Math.max(1,Math.floor(t.maxOutputTokens)));if(i!==void 0&&!Number.isFinite(i))return Promise.reject(new a("HOST_REJECTED","maxOutputTokens must be a number."));let h={prompt:o};return s!==void 0&&(h.system=s),i!==void 0&&(h.maxOutputTokens=i),U({channel:E,v:1,type:"generate",id:u(p),payload:h},e.requestTimeoutMs??rt).then(T=>{if(!Et(T))throw new a("HOST_REJECTED","Host did not return generated text.");return T})},onLateGenerateResult:t=>{j.add(t);for(let o of Xe.splice(0))R([t],o);return Lt(),()=>{j.delete(t)}},setBadge:t=>b({channel:E,v:1,type:"badge",id:u(p),payload:{count:it(t)}}),setHeight:t=>b({channel:E,v:1,type:"resize",id:u(p),payload:{height:at(t)}}),onFileOpen:t=>(_e.add(t),Fe||(Fe=!0,r.addEventListener("keydown",Dt,!0)),se&&t(se),()=>{_e.delete(t)}),onFileSnapshot:t=>(ne=t,()=>{ne===t&&(ne=null)}),onFileSaved:t=>(Se.add(t),()=>{Se.delete(t)}),reportFileChange:t=>$e({...g,type:"file-change",payload:{dirty:t.dirty,edited:t.edited}}),requestFileSave:Gt,reportFileUnsupported:()=>$e({...g,type:"file-unsupported"}),dispose:()=>{for(let t of W.keys())M({...g,type:"workspace-unsubscribe",id:u(p),payload:{subscriptionId:t}});W.clear();for(let t of J.keys())M({...g,type:"shells-unsubscribe",id:u(p),payload:{subscriptionId:t}});J.clear(),H=!0,oe=null,re=null,ne=null,_e.clear(),Se.clear(),Fe&&r.removeEventListener("keydown",Dt,!0),r.removeEventListener("message",Pt),r.removeEventListener("keydown",Ht,!0),r.removeEventListener("pointerover",fe),r.removeEventListener("pointermove",fe),r.removeEventListener("pointerout",Xt),r.removeEventListener("focus",Ft),r.removeEventListener("blur",$t);for(let t of z.values())clearTimeout(t.timer),t.reject(new a("HOST_UNAVAILABLE","Host client was disposed."));z.clear(),l.clear(),S.clear(),x.clear(),f.clear(),C.clear(),L.clear(),D.clear(),ue.clear(),Ee.clear(),j.clear(),Xe.length=0}}};var ko=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var $r=new Set(ko);var qo=10*6e4;var Yo=10*6e4;var Qo=10*6e4;var Io=["none","agent","user"];var Br=new Set(Io);var Zo=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],er=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],yo=(e,r)=>{r.style.colorScheme=e.mode;for(let[n,d]of Zo)r.style.setProperty(n,e.tokens[d]);for(let[n,d,l]of er){let S=e.tokens[l]??"";r.style.setProperty(n,S),r.style.setProperty(d,S)}r.style.setProperty("font-family",e.tokens.font),r.style.setProperty("font-size","0.875rem"),r.style.setProperty("line-height","1.45"),r.style.setProperty("color",e.tokens.foreground)},Ot=(e,r)=>{yo(e.theme,r),r.dataset&&(r.dataset.ocSurface=e.surface,r.dataset.ocTheme=e.theme.mode)};var tr={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},m=(e,r)=>`var(--${e}, var(--oc-${tr[e]}, ${r}))`,$=m("surface-background","transparent"),Ce=m("surface-elevated","transparent"),Z=m("surface-elevated-foreground","inherit"),w=m("surface-foreground","inherit"),O=m("surface-muted-foreground","gray"),or=m("surface-muted","transparent"),B=m("interactive-border","currentColor"),N=m("interactive-hover","transparent"),K=m("interactive-active","transparent"),At=m("interactive-selection","transparent"),Rt=m("interactive-selection-foreground","inherit"),F=m("primary","currentColor"),xt=m("primary-text","inherit"),bt=m("error-text","inherit"),rr=m("font-sans","inherit"),gt=m("font-mono","monospace"),No=m("radius","9px"),kt=`calc(${No} - 2px)`,vo=`calc(${No} - 4px)`,A=(e,r,n="transparent")=>`color-mix(in srgb, ${e} ${r}%, ${n})`,Uo=`background-image: linear-gradient(${N}, ${N});`,It=(e,r="0.5px")=>`box-shadow: inset 0 0 0 ${r} ${e}, var(--oc-sdk-field-lift);`,yt="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",Co="box-shadow: var(--oc-sdk-lit);",vt=`inset 0 0.5px 0 0 ${A(w,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,nr=`
:root {
  --oc-sdk-edge: ${A(w,16)};
  --oc-sdk-field-bg: ${Ce};
  --oc-sdk-raised-bg: ${$};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${A(w,14)};
  --oc-sdk-field-bg: ${A($,50,Ce)};
  --oc-sdk-raised-bg: ${Ce};
  --oc-sdk-field-lift: ${vt};
  --oc-sdk-raised-lift: ${vt};
  --oc-sdk-lit: ${vt};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,Ue=e=>{let r=m(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${r}; --oc-sdk-tone-text: ${m(`${e}-text`,"inherit")}; }`},sr=`
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
`,Mo=`${nr}
.oc-sdk { color: ${w}; font-family: ${rr}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${Uo} }
.oc-sdk-mono { font-family: ${gt}; }
.oc-sdk-muted { color: ${O}; }
${Ue("success")}${Ue("warning")}${Ue("error")}${Ue("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${F}; --oc-sdk-tone-text: ${xt}; }

.oc-sdk-btn { border-radius: ${kt}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${vo}; }
.oc-sdk-btn[data-variant="default"] { color: ${xt}; background: ${A(F,10,$)}; border-color: ${A(F,12)}; ${Co} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${A(F,16,$)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${A(F,22,$)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${or}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${N}, ${N}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${K}, ${K}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${Z}; ${yt} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${N}, ${N}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${K}, ${K}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${N}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${K}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${m("status-error","red")}; color: ${bt}; background: ${A("var(--oc-sdk-tone)",7,$)}; border-color: ${A("var(--oc-sdk-tone)",12)}; ${Co} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${A("var(--oc-sdk-tone)",9,$)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${A("var(--oc-sdk-tone)",11,$)}; box-shadow: none; }

.oc-sdk-field-note { color: ${O}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${bt}; }
.oc-sdk-input { border-radius: ${kt}; background: var(--oc-sdk-field-bg); color: ${Z}; ${It("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${O}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${N}, ${N}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${It(A(w,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${It(m("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${gt}; }

.oc-sdk-search-icon { color: ${O}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${F}; }
.oc-sdk-search-clear { border-radius: ${vo}; color: ${O}; }
.oc-sdk-search-clear:hover { background: ${N}; color: ${w}; }

.oc-sdk-trigger { border-radius: ${kt}; background: var(--oc-sdk-raised-bg); color: ${Z}; ${yt} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${N}, ${N}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${K}, ${K}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${O}; }
.oc-sdk-trigger-chevron { color: ${O}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${Z}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${Ce}; background-clip: padding-box; color: ${Z}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${N}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${At}; color: ${Rt}; }
.oc-sdk-option-check { color: ${w}; }
.oc-sdk-option[data-destructive="true"] { color: ${bt}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${A(m("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${O}; }
.oc-sdk-popup-empty { color: ${O}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${B}; border-radius: 4px; color: ${w}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${A(w,60,B)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${B}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${$}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${F}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(16px); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${Uo} }
.oc-sdk-check-desc { color: ${O}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${A(w,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${O}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${w}; }
.oc-sdk-tab[aria-selected="true"] { color: ${Rt}; background: ${At}; border-color: ${B}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${Z}; background: var(--oc-sdk-raised-bg); ${yt} }
.oc-sdk-tab-count { color: ${O}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${A(w,6)}; color: ${O}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${A("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${N}; }
.oc-sdk-row[aria-selected="true"] { background: ${At}; color: ${Rt}; }
.oc-sdk-row-lead { font-family: ${gt}; color: ${O}; }
.oc-sdk-row-sub { color: ${O}; }
.oc-sdk-row-meta { color: ${O}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${O}; }

.oc-sdk-empty-body { color: ${O}; }

.oc-sdk-spinner { color: ${O}; }
.oc-sdk-spinner-ring { border-color: ${B}; border-top-color: ${F}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${A("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${O}; }

.oc-sdk-separator { color: ${O}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${A(B,40)}; }

.oc-sdk-progress-label { color: ${O}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${A(w,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${F}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${m("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${m("success-text","inherit")}; }

.oc-sdk-text a { color: ${xt}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${A(B,60)}; }
`,I=`
${Ke}
${sr}
${Mo}`;var wo="oc-sdk-ui-style";var y=e=>{let r=document.getElementById(wo);if(r instanceof HTMLStyleElement){r.textContent!==e&&(r.textContent=e);return}je(document);let n=document.createElement("style");n.id=wo,n.textContent=e,document.head.appendChild(n)},v=(e,r)=>{let n=document.createElement(e);return r&&(n.className=r),n},V=e=>{let r=v("button",e);return r.type="button",r},G=(e,r)=>{let n=r??"";e.textContent!==n&&(e.textContent=n)};var ir=()=>{let e=document.createElement("span");return e.className="oc-sdk-spinner-ring",e.setAttribute("aria-hidden","true"),e},ee=(e,r)=>{y(I);let n=r,d=V("oc-sdk oc-sdk-btn"),l=ir(),S=document.createElement("span");d.append(S),e.append(d);let x=()=>{d.dataset.variant=n.variant??"default",d.dataset.size=n.size??"default",d.disabled=!!n.disabled||!!n.loading,d.dataset.loading=n.loading?"true":"false",d.setAttribute("aria-busy",n.loading?"true":"false"),n.loading&&l.parentNode!==d?d.prepend(l):!n.loading&&l.parentNode===d&&l.remove(),G(S,n.label)},f=()=>{n.disabled||n.loading||n.onClick()};return d.addEventListener("click",f),x(),{update:C=>{n={...n,...C},x()},dispose:()=>{d.removeEventListener("click",f),d.remove()}}};var le=class extends Error{constructor(r){super(r),this.name="AccountResponseError"}};function Lo(e){let r;try{r=JSON.parse(e)}catch{throw new le("Vast.ai returned an unreadable account response.")}if(!r||typeof r!="object"||Array.isArray(r))throw new le("Vast.ai returned an invalid account response.");let n=r.credit;if(typeof n!="number"||!Number.isFinite(n))throw new le("Vast.ai did not return a valid credit amount.");return{credit:n,autoTopUp:"Unknown"}}var pr={visible:()=>document.visibilityState==="visible",every:(e,r)=>setInterval(e,r),cancel:e=>clearInterval(e)},Pe=class{host;changed;clock;env;connected=!1;account="";timer;inFlight=!1;generation=0;lastSuccess;credit;nativeCredentialRejected=!1;constructor(r,n,d=Date.now,l=pr){this.host=r,this.changed=n,this.clock=d,this.env=l,this.changed({kind:"disconnected"})}connection(r,n){if(!r&&this.nativeCredentialRejected){this.nativeCredentialRejected=!1,this.generation++,this.stopTimer(),this.connected=!1,this.account=n,this.credit=void 0,this.lastSuccess=void 0,this.setState({kind:"invalid"});return}if(r||(this.nativeCredentialRejected=!1),this.connected===r&&this.account===n)return;r&&(this.nativeCredentialRejected=!1),this.generation++,this.stopTimer();let l=this.account!==n;if(this.connected=r,this.account=n,(!r||l)&&(this.credit=void 0,this.lastSuccess=void 0),!r){this.setState({kind:"disconnected"});return}this.setState({kind:"loading"}),this.refresh(),this.syncTimer()}visibilityChanged(){if(!this.env.visible()){this.stopTimer(),this.generation++;return}this.connected&&(this.refresh(),this.syncTimer())}refresh(){if(!this.connected||!this.env.visible()||this.inFlight)return;let r=this.generation;this.inFlight=!0,this.setState({kind:"loading",previous:this.credit,lastSuccess:this.lastSuccess}),this.host.request({method:"GET",path:"/api/v0/users/current/"}).then(n=>{if(r===this.generation)if(n.status===401||n.status===403)this.setState({kind:"invalid",previous:this.credit,lastSuccess:this.lastSuccess});else if(n.status<200||n.status>=300)this.setState({kind:"unavailable",previous:this.credit,lastSuccess:this.lastSuccess});else{let d=Lo(n.body);this.credit=d.credit,this.lastSuccess=this.clock(),this.setState({kind:"success",credit:d.credit,lastSuccess:this.lastSuccess})}}).catch(n=>{r===this.generation&&(n instanceof a&&n.code==="DISCONNECTED"?(this.nativeCredentialRejected=!0,this.generation++,this.connected=!1,this.stopTimer(),this.credit=void 0,this.lastSuccess=void 0,this.setState({kind:"invalid"})):this.setState({kind:"unavailable",previous:this.credit,lastSuccess:this.lastSuccess}))}).finally(()=>{this.inFlight=!1,r!==this.generation&&this.connected&&this.env.visible()&&this.refresh()})}dispose(){this.generation++,this.connected=!1,this.stopTimer()}syncTimer(){this.timer||!this.connected||!this.env.visible()||(this.timer=this.env.every(()=>this.refresh(),6e4))}stopTimer(){this.timer&&this.env.cancel(this.timer),this.timer=void 0}setState(r){this.changed(r)}};function Po(e,r,n=ResizeObserver){let d,l,S=!1,x=!1,f=()=>{if(x||S||d===void 0||d===l)return;let D=d;l=D,S=!0,r(D).catch(()=>{l===D&&(l=void 0)}).finally(()=>{S=!1,!x&&d!==D&&f()})},C=()=>{x||(d=Math.ceil(e.getBoundingClientRect().height+8),f())},L=new n(C);return L.observe(e),C(),{measure:C,dispose(){x=!0,L.disconnect()}}}var ur="vastai-credit-amount",Er=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2});function Ut(e,r){let n=Er.format(r);return n.length>48&&(n=r.toExponential(2)),`${e}: ${n}`}function _r(e){let r;return e.kind==="success"?r=Ut("Cached",e.credit):e.kind==="loading"&&e.previous!==void 0?r=Ut("Cached",e.previous):(e.kind==="unavailable"||e.kind==="invalid")&&e.previous!==void 0&&(r=Ut("Stale",e.previous)),r?[{kind:"button",id:ur,label:r,disabled:!0}]:[]}function Go(e){let r=[],n=!1,d=!1,l=!1,S,x=()=>{let f=JSON.stringify(r);!n||d||l||f===S||(S=f,l=!0,e(r).catch(()=>{}).finally(()=>{l=!1,!d&&JSON.stringify(r)!==S&&x()}))};return{update(f){r=_r(f),x()},enable(f){n=f,x()},dispose(){d=!0}}}var te=mt(),Ge=document.querySelector("#credit"),De=document.querySelector("#detail"),Sr=document.querySelector("#refresh"),Do=ee(Sr,{label:"Refresh",variant:"outline",size:"xs",onClick:()=>He.refresh()}),Ct=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD"}),Nt=Go(e=>te.setStatusControls(e)),pe=Po(document.querySelector("main"),e=>te.setHeight(e));function Tr(e){e.kind==="disconnected"?(Ge.textContent="Not connected",De.textContent="Auto-top-up: Unknown \xB7 Connect Vast.ai in Settings \u2192 Integrations."):e.kind==="loading"?(Ge.textContent=e.previous===void 0?"Loading\u2026":`${Ct.format(e.previous)} \xB7 refreshing`,De.textContent=`Auto-top-up: Unknown \xB7 ${e.lastSuccess?`Last successful refresh ${new Date(e.lastSuccess).toLocaleTimeString()}`:"Available credit"}`):e.kind==="success"?(Ge.textContent=Ct.format(e.credit),De.textContent=`Auto-top-up: Unknown \xB7 Available credit \xB7 Updated ${new Date(e.lastSuccess).toLocaleTimeString()}`):(Ge.textContent=e.previous===void 0?e.kind==="invalid"?"Invalid credentials":"Unavailable":`${Ct.format(e.previous)} \xB7 Stale`,De.textContent=`Auto-top-up: Unknown \xB7 ${e.kind==="invalid"?"Vast.ai rejected the key. Reconnect in Settings \u2192 Integrations.":"Could not refresh Vast.ai credit."}${e.lastSuccess?` Last successful refresh ${new Date(e.lastSuccess).toLocaleTimeString()}.`:""}`),Do.update({disabled:e.kind==="disconnected"||e.kind==="loading"||e.kind==="invalid"}),Nt.update(e),pe.measure()}var He=new Pe(te,Tr);te.onReady(e=>{Ot(e,document.documentElement),pe.measure(),Nt.enable(e.features?.statusControls===!0)});te.onConnection(({connected:e,account:r})=>He.connection(e,r));document.addEventListener("visibilitychange",()=>He.visibilityChanged());window.addEventListener("resize",pe.measure);window.addEventListener("pagehide",()=>{He.dispose(),pe.dispose(),window.removeEventListener("resize",pe.measure),Nt.dispose(),Do.dispose(),te.dispose()},{once:!0});})();
