(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function s(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(i){if(i.ep)return;i.ep=!0;const n=s(i);fetch(i.href,n)}})();var Ve,E,Ms,V,Wt,Ts,Ds,it,Ie,we,Ns,vt,ut,pt,Fe={},ze=[],kr=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,Je=Array.isArray;function Q(t,e){for(var s in e)t[s]=e[s];return t}function $t(t){t&&t.parentNode&&t.parentNode.removeChild(t)}function Pr(t,e,s){var r,i,n,a={};for(n in e)n=="key"?r=e[n]:n=="ref"?i=e[n]:a[n]=e[n];if(arguments.length>2&&(a.children=arguments.length>3?Ve.call(arguments,2):s),typeof t=="function"&&t.defaultProps!=null)for(n in t.defaultProps)a[n]===void 0&&(a[n]=t.defaultProps[n]);return He(t,a,r,i,null)}function He(t,e,s,r,i){var n={type:t,props:e,key:s,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:i??++Ms,__i:-1,__u:0};return i==null&&E.vnode!=null&&E.vnode(n),n}function F(t){return t.children}function Oe(t,e){this.props=t,this.context=e}function ae(t,e){if(e==null)return t.__?ae(t.__,t.__i+1):null;for(var s;e<t.__k.length;e++)if((s=t.__k[e])!=null&&s.__e!=null)return s.__e;return typeof t.type=="function"?ae(t):null}function xr(t){if(t.__P&&t.__d){var e=t.__v,s=e.__e,r=[],i=[],n=Q({},e);n.__v=e.__v+1,E.vnode&&E.vnode(n),yt(t.__P,n,e,t.__n,t.__P.namespaceURI,32&e.__u?[s]:null,r,s??ae(e),!!(32&e.__u),i),n.__v=e.__v,n.__.__k[n.__i]=n,Os(r,n,i),e.__e=e.__=null,n.__e!=s&&Us(n)}}function Us(t){if((t=t.__)!=null&&t.__c!=null)return t.__e=t.__c.base=null,t.__k.some(function(e){if(e!=null&&e.__e!=null)return t.__e=t.__c.base=e.__e}),Us(t)}function Ft(t){(!t.__d&&(t.__d=!0)&&V.push(t)&&!Be.__r++||Wt!=E.debounceRendering)&&((Wt=E.debounceRendering)||Ts)(Be)}function Be(){try{for(var t,e=1;V.length;)V.length>e&&V.sort(Ds),t=V.shift(),e=V.length,xr(t)}finally{V.length=Be.__r=0}}function Rs(t,e,s,r,i,n,a,l,d,h,u){var p,c,f,b,y,A,m=r&&r.__k||ze,v=e.length;for(d=Er(s,e,m,d,v),p=0;p<v;p++)(f=s.__k[p])!=null&&(c=f.__i!=-1&&m[f.__i]||Fe,f.__i=p,A=yt(t,f,c,i,n,a,l,d,h,u),b=f.__e,f.ref&&c.ref!=f.ref&&(c.ref&&wt(c.ref,null,f),u.push(f.ref,f.__c||b,f)),y==null&&b!=null&&(y=b),4&f.__u?(d=Is(f,d,t),c.__e&&(c.__e=null)):typeof f.type=="function"&&A!==void 0?d=A:b&&(d=b.nextSibling),f.__u&=-7);return s.__e=y,d}function Er(t,e,s,r,i){var n,a,l,d,h,u=s.length,p=u,c=0;for(t.__k=new Array(i),n=0;n<i;n++)(a=e[n])!=null&&typeof a!="boolean"&&typeof a!="function"?(typeof a=="string"||typeof a=="number"||typeof a=="bigint"||a.constructor==String?a=t.__k[n]=He(null,a,null,null,null):Je(a)?a=t.__k[n]=He(F,{children:a},null,null,null):a.constructor===void 0&&a.__b>0?a=t.__k[n]=He(a.type,a.props,a.key,a.ref?a.ref:null,a.__v):t.__k[n]=a,d=n+c,a.__=t,a.__b=t.__b+1,l=null,(h=a.__i=Cr(a,s,d,p))!=-1&&(p--,(l=s[h])&&(l.__u|=2)),l==null||l.__v==null?(h==-1&&(i>u?c--:i<u&&c++),typeof a.type!="function"&&(a.__u|=4)):h!=d&&(h==d-1?c--:h==d+1?c++:(h>d?c--:c++,a.__u|=4))):t.__k[n]=null;if(p)for(n=0;n<u;n++)(l=s[n])!=null&&(2&l.__u)==0&&(l.__e==r&&(r=ae(l)),Ls(l,l));return r}function Is(t,e,s){var r,i;if(typeof t.type=="function"){for(r=t.__k,i=0;r&&i<r.length;i++)r[i]&&(r[i].__=t,e=Is(r[i],e,s));return e}t.__e!=e&&(e&&t.type&&!e.parentNode&&(e=ae(t)),e=s.insertBefore(t.__e,e||null));do e=e&&e.nextSibling;while(e!=null&&e.nodeType==8);return e}function Cr(t,e,s,r){var i,n,a,l=t.key,d=t.type,h=e[s],u=h!=null&&(2&h.__u)==0;if(h===null&&l==null||u&&l==h.key&&d==h.type)return s;if(r>(u?1:0)){for(i=s-1,n=s+1;i>=0||n<e.length;)if((h=e[a=i>=0?i--:n++])!=null&&(2&h.__u)==0&&l==h.key&&d==h.type)return a}return-1}function zt(t,e,s){e[0]=="-"?t.setProperty(e,s??""):t[e]=s==null?"":typeof s!="number"||kr.test(e)?s:s+"px"}function De(t,e,s,r,i){var n,a;e:if(e=="style")if(typeof s=="string")t.style.cssText=s;else{if(typeof r=="string"&&(t.style.cssText=r=""),r)for(e in r)s&&e in s||zt(t.style,e,"");if(s)for(e in s)r&&s[e]==r[e]||zt(t.style,e,s[e])}else if(e[0]=="o"&&e[1]=="n")n=e!=(e=e.replace(Ns,"$1")),a=e.toLowerCase(),e=a in t||e=="onFocusOut"||e=="onFocusIn"?a.slice(2):e.slice(2),t.l||(t.l={}),t.l[e+n]=s,s?r?s[we]=r[we]:(s[we]=vt,t.addEventListener(e,n?pt:ut,n)):t.removeEventListener(e,n?pt:ut,n);else{if(i=="http://www.w3.org/2000/svg")e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!="width"&&e!="height"&&e!="href"&&e!="list"&&e!="form"&&e!="tabIndex"&&e!="download"&&e!="rowSpan"&&e!="colSpan"&&e!="role"&&e!="popover"&&e in t)try{t[e]=s??"";break e}catch{}typeof s=="function"||(s==null||s===!1&&e[4]!="-"?t.removeAttribute(e):t.setAttribute(e,e=="popover"&&s==1?"":s))}}function Bt(t){return function(e){if(this.l){var s=this.l[e.type+t];if(e[Ie]==null)e[Ie]=vt++;else if(e[Ie]<s[we])return;return s(E.event?E.event(e):e)}}}function yt(t,e,s,r,i,n,a,l,d,h){var u,p,c,f,b,y,A,m,v,P,q,U,_,x,k,be,L=e.type;if(e.constructor!==void 0)return null;128&s.__u&&(d=!!(32&s.__u),n=[l=e.__e=s.__e]),(u=E.__b)&&u(e);e:if(typeof L=="function"){p=a.length;try{if(v=e.props,P=L.prototype&&L.prototype.render,q=(u=L.contextType)&&r[u.__c],U=u?q?q.props.value:u.__:r,s.__c?m=(c=e.__c=s.__c).__=c.__E:(P?e.__c=c=new L(v,U):(e.__c=c=new Oe(v,U),c.constructor=L,c.render=Tr),q&&q.sub(c),c.state||(c.state={}),c.__n=r,f=c.__d=!0,c.__h=[],c._sb=[]),P&&c.__s==null&&(c.__s=c.state),P&&L.getDerivedStateFromProps!=null&&(c.__s==c.state&&(c.__s=Q({},c.__s)),Q(c.__s,L.getDerivedStateFromProps(v,c.__s))),b=c.props,y=c.state,c.__v=e,f)P&&L.getDerivedStateFromProps==null&&c.componentWillMount!=null&&c.componentWillMount(),P&&c.componentDidMount!=null&&c.__h.push(c.componentDidMount);else{if(P&&L.getDerivedStateFromProps==null&&v!==b&&c.componentWillReceiveProps!=null&&c.componentWillReceiveProps(v,U),e.__v==s.__v||!c.__e&&c.shouldComponentUpdate!=null&&c.shouldComponentUpdate(v,c.__s,U)===!1){e.__v!=s.__v&&(c.props=v,c.state=c.__s,c.__d=!1),e.__e=s.__e,e.__k=s.__k,e.__k.some(function(z){z&&(z.__=e)}),ze.push.apply(c.__h,c._sb),c._sb=[],c.__h.length&&a.push(c),l=ae(s);break e}c.componentWillUpdate!=null&&c.componentWillUpdate(v,c.__s,U),P&&c.componentDidUpdate!=null&&c.__h.push(function(){c.componentDidUpdate(b,y,A)})}if(c.context=U,c.props=v,c.__P=t,c.__e=!1,_=E.__r,x=0,P)c.state=c.__s,c.__d=!1,_&&_(e),u=c.render(c.props,c.state,c.context),ze.push.apply(c.__h,c._sb),c._sb=[];else do c.__d=!1,_&&_(e),u=c.render(c.props,c.state,c.context),c.state=c.__s;while(c.__d&&++x<25);c.state=c.__s,c.getChildContext!=null&&(r=Q(Q({},r),c.getChildContext())),P&&!f&&c.getSnapshotBeforeUpdate!=null&&(A=c.getSnapshotBeforeUpdate(b,y)),k=u!=null&&u.type===F&&u.key==null?qs(u.props.children):u,l=Rs(t,Je(k)?k:[k],e,s,r,i,n,a,l,d,h),c.base=e.__e,e.__u&=-161,c.__h.length&&a.push(c),m&&(c.__E=c.__=null)}catch(z){if(a.length=p,e.__v=null,d||n!=null){if(z.then){for(e.__u|=d?160:128;l&&l.nodeType==8&&l.nextSibling;)l=l.nextSibling;n!=null&&(n[n.indexOf(l)]=null),e.__e=l}else if(n!=null)for(be=n.length;be--;)$t(n[be])}else e.__e=s.__e;e.__k==null&&(e.__k=s.__k||[]),z.then||Hs(e),E.__e(z,e,s)}}else n==null&&e.__v==s.__v?(e.__k=s.__k,e.__e=s.__e):l=e.__e=Mr(s.__e,e,s,r,i,n,a,d,h);return(u=E.diffed)&&u(e),128&e.__u?void 0:l}function Hs(t){t&&(t.__c&&(t.__c.__e=!0),t.__k&&t.__k.some(Hs))}function Os(t,e,s){for(var r=0;r<s.length;r++)wt(s[r],s[++r],s[++r]);E.__c&&E.__c(e,t),t.some(function(i){try{t=i.__h,i.__h=[],t.some(function(n){n.call(i)})}catch(n){E.__e(n,i.__v)}})}function qs(t){return typeof t!="object"||t==null||t.__b>0?t:Je(t)?t.map(qs):t.constructor!==void 0?null:Q({},t)}function Mr(t,e,s,r,i,n,a,l,d){var h,u,p,c,f,b,y,A=s.props||Fe,m=e.props,v=e.type;if(v=="svg"?i="http://www.w3.org/2000/svg":v=="math"?i="http://www.w3.org/1998/Math/MathML":i||(i="http://www.w3.org/1999/xhtml"),n!=null){for(h=0;h<n.length;h++)if((f=n[h])&&"setAttribute"in f==!!v&&(v?f.localName==v:f.nodeType==3)){t=f,n[h]=null;break}}if(t==null){if(v==null)return document.createTextNode(m);t=document.createElementNS(i,v,m.is&&m),l&&(E.__m&&E.__m(e,n),l=!1),n=null}if(v==null)A===m||l&&t.data==m||(t.data=m);else{if(n=v=="textarea"&&m.defaultValue!=null?null:n&&Ve.call(t.childNodes),!l&&n!=null)for(A={},h=0;h<t.attributes.length;h++)A[(f=t.attributes[h]).name]=f.value;for(h in A)f=A[h],h=="dangerouslySetInnerHTML"?p=f:h=="children"||h in m||h=="value"&&"defaultValue"in m||h=="checked"&&"defaultChecked"in m||De(t,h,null,f,i);for(h in m)f=m[h],h=="children"?c=f:h=="dangerouslySetInnerHTML"?u=f:h=="value"?b=f:h=="checked"?y=f:l&&typeof f!="function"||A[h]===f||De(t,h,f,A[h],i);if(u)l||p&&(u.__html==p.__html||u.__html==t.innerHTML)||(t.innerHTML=u.__html),e.__k=[];else if(p&&(t.innerHTML=""),Rs(e.type=="template"?t.content:t,Je(c)?c:[c],e,s,r,v=="foreignObject"?"http://www.w3.org/1999/xhtml":i,n,a,n?n[0]:s.__k&&ae(s,0),l,d),n!=null)for(h=n.length;h--;)$t(n[h]);l&&v!="textarea"||(h="value",v=="progress"&&b==null?t.removeAttribute("value"):b!=null&&(b!==t[h]||v=="progress"&&!b||v=="option"&&b!=A[h])&&De(t,h,b,A[h],i),h="checked",y!=null&&y!=t[h]&&De(t,h,y,A[h],i))}return t}function wt(t,e,s){try{if(typeof t=="function"){var r=typeof t.__u=="function";r&&t.__u(),r&&e==null||(t.__u=t(e))}else t.current=e}catch(i){E.__e(i,s)}}function Ls(t,e,s){var r,i;if(E.unmount&&E.unmount(t),(r=t.ref)&&(r.current&&r.current!=t.__e||wt(r,null,e)),(r=t.__c)!=null){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(n){E.__e(n,e)}r.base=r.__P=r.__n=null}if(r=t.__k)for(i=0;i<r.length;i++)r[i]&&Ls(r[i],e,s||typeof t.type!="function");s||$t(t.__e),t.__c=t.__=t.__e=void 0}function Tr(t,e,s){return this.constructor(t,s)}function Dr(t,e,s){var r,i,n,a;e==document&&(e=document.documentElement),E.__&&E.__(t,e),i=(r=!1)?null:e.__k,n=[],a=[],yt(e,t=e.__k=Pr(F,null,[t]),i||Fe,Fe,e.namespaceURI,i?null:e.firstChild?Ve.call(e.childNodes):null,n,i?i.__e:e.firstChild,r,a),Os(n,t,a),t.props.children=null}Ve=ze.slice,E={__e:function(t,e,s,r){for(var i,n,a;e=e.__;)if((i=e.__c)&&!i.__)try{if((n=i.constructor)&&n.getDerivedStateFromError!=null&&(i.setState(n.getDerivedStateFromError(t)),a=i.__d),i.componentDidCatch!=null&&(i.componentDidCatch(t,r||{}),a=i.__d),a)return i.__E=i}catch(l){t=l}throw t}},Ms=0,Oe.prototype.setState=function(t,e){var s;s=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=Q({},this.state),typeof t=="function"&&(t=t(Q({},s),this.props)),t&&Q(s,t),t!=null&&this.__v&&(e&&this._sb.push(e),Ft(this))},Oe.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),Ft(this))},Oe.prototype.render=F,V=[],Ts=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Ds=function(t,e){return t.__v.__b-e.__v.__b},Be.__r=0,it=Math.random().toString(8),Ie="__d"+it,we="__a"+it,Ns=/(PointerCapture)$|Capture$/i,vt=0,ut=Bt(!1),pt=Bt(!0);var Nr=0;function o(t,e,s,r,i,n){e||(e={});var a,l,d=e;if("ref"in d)for(l in d={},e)l=="ref"?a=e[l]:d[l]=e[l];var h={type:t,props:d,key:s,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--Nr,__i:-1,__u:0,__source:i,__self:n};if(typeof t=="function"&&(a=t.defaultProps))for(l in a)d[l]===void 0&&(d[l]=a[l]);return E.vnode&&E.vnode(h),h}var pe,T,nt,jt,Pe=0,Ws=[],D=E,Qt=D.__b,Yt=D.__r,Vt=D.diffed,Jt=D.__c,Kt=D.unmount,Gt=D.__;function Ke(t,e){D.__h&&D.__h(T,t,Pe||e),Pe=0;var s=T.__H||(T.__H={__:[],__h:[]});return t>=s.__.length&&s.__.push({}),s.__[t]}function w(t){return Pe=1,Ur(zs,t)}function Ur(t,e,s){var r=Ke(pe++,2);if(r.t=t,!r.__c&&(r.__=[zs(void 0,e),function(l){var d=r.__N?r.__N[0]:r.__[0],h=r.t(d,l);d!==h&&(r.__N=[h,r.__[1]],r.__c.setState({}))}],r.__c=T,!T.__f)){var i=function(l,d,h){if(!r.__c.__H)return!0;var u=!1,p=r.__c.props!==l;if(r.__c.__H.__.some(function(f){if(f.__N){u=!0;var b=f.__[0];f.__=f.__N,f.__N=void 0,b!==f.__[0]&&(p=!0)}}),n){var c=n.call(this,l,d,h);return u?c||p:c}return!u||p};T.__f=!0;var n=T.shouldComponentUpdate,a=T.componentWillUpdate;T.componentWillUpdate=function(l,d,h){if(this.__e){var u=n;n=void 0,i(l,d,h),n=u}a&&a.call(this,l,d,h)},T.shouldComponentUpdate=i}return r.__N||r.__}function Y(t,e){var s=Ke(pe++,3);!D.__s&&Fs(s.__H,e)&&(s.__=t,s.u=e,T.__H.__h.push(s))}function xe(t){return Pe=5,Ge(function(){return{current:t}},[])}function Ge(t,e){var s=Ke(pe++,7);return Fs(s.__H,e)&&(s.__=t(),s.__H=e,s.__h=t),s.__}function R(t,e){return Pe=8,Ge(function(){return t},e)}function St(){var t=Ke(pe++,11);if(!t.__){for(var e=T.__v;e!==null&&!e.__m&&e.__!==null;)e=e.__;var s=e.__m||(e.__m=[0,0]);t.__="P"+s[0]+"-"+s[1]++}return t.__}function Rr(){for(var t;t=Ws.shift();){var e=t.__H;if(t.__P&&e)try{e.__h.some(qe),e.__h.some(ft),e.__h=[]}catch(s){e.__h=[],D.__e(s,t.__v)}}}D.__b=function(t){T=null,Qt&&Qt(t)},D.__=function(t,e){t&&e.__k&&e.__k.__m&&(t.__m=e.__k.__m),Gt&&Gt(t,e)},D.__r=function(t){Yt&&Yt(t),pe=0;var e=(T=t.__c).__H;e&&(nt===T?(e.__h=[],T.__h=[],e.__.some(function(s){s.__N&&(s.__=s.__N),s.u=s.__N=void 0})):(e.__h.some(qe),e.__h.some(ft),e.__h=[],pe=0)),nt=T},D.diffed=function(t){Vt&&Vt(t);var e=t.__c;e&&e.__H&&(e.__H.__h.length&&(Ws.push(e)!==1&&jt===D.requestAnimationFrame||((jt=D.requestAnimationFrame)||Ir)(Rr)),e.__H.__.some(function(s){s.u&&(s.__H=s.u,s.u=void 0)})),nt=T=null},D.__c=function(t,e){e.some(function(s){try{s.__h.some(qe),s.__h=s.__h.filter(function(r){return!r.__||ft(r)})}catch(r){e.some(function(i){i.__h&&(i.__h=[])}),e=[],D.__e(r,s.__v)}}),Jt&&Jt(t,e)},D.unmount=function(t){Kt&&Kt(t);var e,s=t.__c;s&&s.__H&&(s.__H.__.some(function(r){try{qe(r)}catch(i){e=i}}),s.__H=void 0,e&&D.__e(e,s.__v))};var Zt=typeof requestAnimationFrame=="function";function Ir(t){var e,s=function(){clearTimeout(r),Zt&&cancelAnimationFrame(e),setTimeout(t)},r=setTimeout(s,35);Zt&&(e=requestAnimationFrame(s))}function qe(t){var e=T,s=t.__c;typeof s=="function"&&(t.__c=void 0,s()),T=e}function ft(t){var e=T;t.__c=t.__(),T=e}function Fs(t,e){return!t||t.length!==e.length||e.some(function(s,r){return s!==t[r]})}function zs(t,e){return typeof e=="function"?e(t):e}function Hr({tabs:t,active:e,onSelect:s,label:r="Sections",class:i}){return o("nav",{class:i?`tab-bar ${i}`:"tab-bar",role:"tablist","aria-label":r,children:t.map(n=>o("button",{type:"button",role:"tab",id:`tab-${n.id}`,"aria-selected":n.id===e,"aria-controls":`panel-${n.id}`,class:n.id===e?"active":void 0,onClick:()=>s(n.id),children:n.label},n.id))})}function Or(){const t=xe(null);return Y(()=>{const e=document.createElement("edc-config-backup-page");return e.setAttribute("device-name","Shelby"),e.setAttribute("archive-file-name","shelby-config.zip"),e.setAttribute("bin-file-name","config.bin"),t.current?.append(e),()=>e.remove()},[]),o("div",{ref:t})}const g={mqtt:{hostMax:63,portMin:1,portMax:65535,loginMax:31,passwordMax:31,haDiscoveryPrefixMax:63,topicPrefixMax:63},modbus:{speeds:[1200,2400,4800,9600,19200,38400,57600,115200],addressMin:1,addressMax:254},septic:{diameterMin:0,diameterMax:5,diameterStep:.1}},qr=["gates","door"],Lr=["watering_the_lawn","decorative_light","parking_space_light","street_light"],Wr=["open","close","stop"],At="Device returned an empty response. Check the device logs and try again.",Ze="Device returned an empty response.",Bs="Could not reach the device. Check that you are connected to its network and try again.",Ne={};function js(){return{ok:!1,message:Bs}}function Fr(t){try{const e=JSON.parse(t);if(e&&typeof e=="object"&&"message"in e){const s=e.message;if(typeof s=="string"&&s)return s}}catch{}}async function Qs(t){let e=`Request failed (HTTP ${t.status}).`;try{const s=await t.text();s&&(e=Fr(s)??e)}catch{}return{ok:!1,status:t.status,message:e}}async function de(t,e){let s;try{s=await fetch(t,{headers:{Accept:"application/json"}})}catch{return js()}if(!s.ok)return Qs(s);let r;try{r=await s.text()}catch{return{ok:!1,status:s.status,message:Bs}}if(!r.trim())return{ok:!1,status:s.status,message:e};try{return{ok:!0,data:JSON.parse(r)}}catch{return{ok:!1,status:s.status,message:e}}}async function Ys(t,e){let s;try{s=await fetch(t,e)}catch{return js()}if(!s.ok)return Qs(s);let r="";try{r=await s.text()}catch{return{ok:!0,data:Ne}}if(!r.trim())return{ok:!0,data:Ne};try{const i=JSON.parse(r);return{ok:!0,data:i&&typeof i=="object"?i:Ne}}catch{return{ok:!0,data:Ne}}}function Xe(t,e){return Ys(t,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:e.toString()})}function ce(t,e,s,r=!1){if(typeof t!="string")throw new Error(`${e} is required.`);if(!r&&t.length===0)throw new Error(`${e} must not be empty.`);if(t.length>s)throw new Error(`${e} must be at most ${s} characters.`);return t}function je(t,e,s,r){if(typeof t!="number"||!Number.isFinite(t))throw new Error(`${e} must be a number.`);if(t<s||t>r)throw new Error(`${e} must be between ${s} and ${r}.`);return t}function Vs(t,e,s){if(!s.includes(t))throw new Error(`${e} must be one of: ${s.join(", ")}.`);return t}function zr(){return de("/api/status",Ze)}function Js(){return de("/healthcheck/healty",Ze)}function Br(){return de("/healthcheck/ready",Ze)}function jr(){return de("/api/devices",Ze)}function Qr(){return de("/api/settings/modbus",At)}function Yr(){return de("/api/settings",At)}function Vr(){return de("/api/settings/mqtt",At)}function Jr(t){const e=Vs(t.modbusSpeed,"Modbus speed",g.modbus.speeds),s=je(t.addressMR6C,"WB-MR6C address",g.modbus.addressMin,g.modbus.addressMax),r=je(t.addressQDY30A,"QDY-30A address",g.modbus.addressMin,g.modbus.addressMax),i=new URLSearchParams;return i.set("modbusSpeed",String(e)),i.set("addressMR6C",String(s)),i.set("addressQDY30A",String(r)),Xe("/api/settings/modbus",i)}function Kr(t){const e=je(t.septicDiameter,"Septic tank diameter",g.septic.diameterMin,g.septic.diameterMax),s=new URLSearchParams;return s.set("septicDiameter",String(e)),Xe("/api/settings",s)}function Gr(t){const e=ce(t.host,"MQTT host",g.mqtt.hostMax),s=je(t.port,"MQTT port",g.mqtt.portMin,g.mqtt.portMax),r=ce(t.login,"MQTT login",g.mqtt.loginMax,!0),i=ce(t.password,"MQTT password",g.mqtt.passwordMax,!0),n=ce(t.haDiscoveryPrefix,"HA discovery prefix",g.mqtt.haDiscoveryPrefixMax),a=ce(t.mqttTopicPrefix,"MQTT topic prefix",g.mqtt.topicPrefixMax);if(a.startsWith("/")||a.endsWith("/")||a.includes(" "))throw new Error('MQTT topic prefix must not start or end with "/" or contain spaces.');const l=new URLSearchParams;return l.set("host",e),l.set("port",String(s)),l.set("login",r),l.set("password",i),l.set("haDiscoveryPrefix",n),l.set("mqttIsHADiscovery",t.mqttIsHADiscovery?"true":"false"),l.set("mqttTopicPrefix",a),Xe("/api/settings/mqtt",l)}function Xt(t){const e=ce(t.id,"Device",63),s=new URLSearchParams;if(s.set("id",e),qr.includes(e)){if(t.enabled!==void 0)throw new Error("Covers accept a command, not enabled.");if(t.command===void 0)throw new Error("Choose open, close or stop.");const r=Vs(t.command,"Command",Wr);s.set("command",r)}else if(Lr.includes(e)){if(t.command!==void 0)throw new Error("Switches accept enabled, not a command.");if(typeof t.enabled!="boolean")throw new Error("Enabled must be true or false.");s.set("enabled",t.enabled?"on":"off")}else throw new Error("Unknown device id.");return Xe("/api/devices/set",s)}function Ks(){return Ys("/api/reboot",{method:"POST"})}function N({kind:t="info",message:e,onClose:s}){return o("div",{class:`banner banner-${t}`,role:"status",children:[o("span",{children:e}),s?o("button",{type:"button",class:"banner-close","aria-label":"Dismiss",onClick:s,children:"×"}):null]})}function Zr(t){switch(t){case"primary":return"btn btn-primary";case"danger":return"btn btn-danger";default:return"btn"}}function H({children:t,variant:e="default",type:s="button",disabled:r,title:i,onClick:n}){return o("button",{type:s,class:Zr(e),disabled:r,title:i,onClick:n,children:t})}function Gs(t){return o(H,{...t,variant:"danger"})}function W({title:t,children:e,class:s}){return o("section",{class:s?`card ${s}`:"card",children:[t?o("h2",{children:t}):null,e]})}const Xr=5e3,ei=[300,700,1500];function ti(t){if(!t.available)return{className:"badge badge-danger",label:"Unavailable"};switch(t.state){case"open":return{className:"badge badge-on",label:"Open"};case"opening":return{className:"badge badge-warning",label:"Opening"};case"closing":return{className:"badge badge-warning",label:"Closing"};case"closed":return{className:"badge badge-off",label:"Closed"}}}function si(t){return t.available?t.enabled?{className:"badge badge-on",label:"On"}:{className:"badge badge-off",label:"Off"}:{className:"badge badge-danger",label:"Unavailable"}}function ri(t){if(typeof t.value=="boolean")return t.value?"Open":"Closed";switch(t.id){case"septic_tank_filling_level":case"septic_tank_filling_volume":return t.value.toFixed(2);case"septic_tank_average_absorption_speed":case"septic_tank_average_incoming_speed":return t.value.toFixed(1);default:return String(t.value)}}function at(t,e){return t.find(s=>s.id===e)}function ii({cover:t,busy:e,onCommand:s}){const r=ti(t),i=e||!t.available;return o("div",{class:`device-card${t.available?"":" is-unavailable"}`,children:[o("div",{class:"device-card-head",children:[o("span",{class:"device-name",children:t.name}),o("span",{class:r.className,children:r.label})]}),o("div",{class:"device-actions",children:[o(H,{variant:"primary",disabled:i,onClick:()=>s(t.id,"open"),children:"Open"}),o(H,{disabled:i,onClick:()=>s(t.id,"close"),children:"Close"}),o(H,{disabled:i,onClick:()=>s(t.id,"stop"),children:"Stop"})]})]})}function ni({sensor:t}){const e=t.available&&t.value===!0,s=t.available?e?{className:"badge badge-on",label:"Open"}:{className:"badge badge-off",label:"Closed"}:{className:"badge badge-danger",label:"Unavailable"};return o("div",{class:`device-card${t.available?"":" is-unavailable"}`,children:[o("div",{class:"device-card-head",children:[o("span",{class:"device-name",children:t.name}),o("span",{class:s.className,children:s.label})]}),o("p",{class:"device-help",children:"Magnetic end-position sensor on the gate."})]})}function ai({sw:t,busy:e,onToggle:s}){const r=si(t),i=e||!t.available;return o("div",{class:`device-card${t.available?"":" is-unavailable"}`,children:[o("div",{class:"device-card-head",children:[o("span",{class:"device-name",children:t.name}),o("span",{class:r.className,children:r.label})]}),o("div",{class:"device-actions",children:o(H,{variant:t.available&&!t.enabled?"primary":"default",disabled:i,onClick:()=>s(t.id,!t.enabled),children:t.available?t.enabled?"Turn off":"Turn on":"Unavailable"})}),t.id==="watering_the_lawn"?o("p",{class:"device-help",children:"Turns off automatically after 20 minutes."}):null]})}function oi({sensor:t}){return o("div",{class:`sensor-card${t.available?"":" is-unavailable"}`,children:[o("span",{class:"sensor-name",children:t.name}),t.available?o("span",{class:"sensor-value",children:[ri(t),t.unit?o("span",{class:"sensor-unit",children:t.unit}):null]}):o("span",{class:"sensor-value sensor-unavailable",children:"—"})]})}function li(){const[t,e]=w(null),[s,r]=w(null),[i,n]=w(null),[a,l]=w(!1),[d,h]=w([]),u=xe(0),p=xe([]),c=R(async()=>{const _=await jr();_.ok?(e(_.data),r(null)):r(_.message),l(!0)},[]);Y(()=>{c();const _=window.setInterval(()=>{u.current===0&&c()},Xr);return()=>window.clearInterval(_)},[c]),Y(()=>()=>{for(const _ of p.current)window.clearTimeout(_)},[]);const f=R(()=>{for(const _ of ei){const x=window.setTimeout(()=>{p.current=p.current.filter(k=>k!==x),c()},_);p.current.push(x)}},[c]),b=R(_=>{u.current+=1,h(x=>x.includes(_)?x:[...x,_])},[]),y=R(_=>{u.current=Math.max(0,u.current-1),h(x=>x.filter(k=>k!==_))},[]),A=R(async(_,x)=>{n(null),b(_);try{const k=await Xt({id:_,command:x});k.ok?f():n(k.message)}catch(k){n(k instanceof Error?k.message:String(k))}finally{y(_)}},[b,y,f]),m=R(async(_,x)=>{n(null),b(_);try{const k=await Xt({id:_,enabled:x});k.ok?f():n(k.message)}catch(k){n(k instanceof Error?k.message:String(k))}finally{y(_)}},[b,y,f]);if(!a)return o(W,{title:"Devices",children:o("p",{class:"muted",children:"Loading devices…"})});const v=t?.sections??[],P=at(v,"access"),q=at(v,"lighting"),U=at(v,"septic");return o("div",{class:"stack",children:[s?o(F,{children:[o(N,{kind:"error",message:s}),o("div",{class:"form-actions",children:o(H,{onClick:()=>{c()},children:"Retry"})})]}):null,i?o(N,{kind:"error",message:i,onClose:()=>n(null)}):null,P?o(W,{title:P.name,children:[o("p",{class:"muted",children:"Gate commands are ignored unless the door mode is closed; door commands are ignored unless the gates are closed."}),o("div",{class:"device-grid",children:[(P.covers??[]).map(_=>o(ii,{cover:_,busy:d.includes(_.id),onCommand:(x,k)=>{A(x,k)}},_.id)),(P.sensors??[]).map(_=>o(ni,{sensor:_},_.id))]})]}):null,q?o(W,{title:q.name,children:o("div",{class:"device-grid",children:(q.switches??[]).map(_=>o(ai,{sw:_,busy:d.includes(_.id),onToggle:(x,k)=>{m(x,k)}},_.id))})}):null,U?o(W,{title:U.name,children:o("div",{class:"sensor-grid",children:(U.sensors??[]).map(_=>o(oi,{sensor:_},_.id))})}):null,o("p",{class:"muted",children:"Device values refresh automatically every 5 seconds; after a change the device settles within about a second."})]})}function j({label:t,value:e,onInput:s,type:r="text",name:i,placeholder:n,maxLength:a,min:l,max:d,step:h,error:u,help:p,disabled:c,required:f,autoComplete:b,inputMode:y}){const A=St();return o("label",{class:"field",for:A,children:[o("span",{class:"field-label",children:t}),o("input",{id:A,name:i,type:r,value:e,placeholder:n,maxLength:a,min:l,max:d,step:h,disabled:c,required:f,autoComplete:b,inputMode:y,onInput:v=>{s?.(v.currentTarget.value)},"aria-invalid":u?!0:void 0}),p&&!u?o("span",{class:"field-help",children:p}):null,u?o("span",{class:"field-error",children:u}):null]})}function Zs(){return o(N,{kind:"info",message:"Changes are saved to flash and take effect only after a reboot."})}const ot=2e3,di=12e4;function Xs(){const[t,e]=w("idle"),s=xe(0);Y(()=>{if(t!=="rebooting")return;let a=!1,l;const d=()=>{Js().then(h=>{if(!a){if(h.ok){e("ready");return}if(s.current+=1,s.current*ot>=di){e("timeout");return}l=window.setTimeout(d,ot)}})};return l=window.setTimeout(d,ot),()=>{a=!0,l!==void 0&&window.clearTimeout(l)}},[t]);const r=R(()=>{s.current=0,e("rebooting")},[]),i=R(()=>e("idle"),[]),n=R(()=>{s.current=0,e("rebooting")},[]);return Ge(()=>({phase:t,start:r,dismiss:i,retry:n}),[t,r,i,n])}function er({flow:t}){return t.phase==="idle"?null:o("div",{class:"reboot-overlay",role:"alertdialog","aria-modal":"true","aria-label":"Device rebooting",children:o("div",{class:"reboot-dialog card",children:[o("h2",{children:"Device is rebooting"}),t.phase==="rebooting"?o(F,{children:[o("p",{children:"Waiting for the device to come back online. This usually takes 20–60 seconds."}),o("p",{class:"muted","aria-live":"polite",children:"Polling device health…"})]}):null,t.phase==="ready"?o(F,{children:[o(N,{kind:"success",message:"The device is back online."}),o("div",{class:"form-actions",children:o(H,{variant:"primary",onClick:()=>window.location.reload(),children:"Reload panel"})})]}):null,t.phase==="timeout"?o(F,{children:[o(N,{kind:"error",message:"No response after about two minutes. Check the power and network, then reload or keep waiting."}),o("div",{class:"form-actions",children:[o(H,{onClick:t.retry,children:"Keep waiting"}),o(H,{onClick:t.dismiss,children:"Dismiss"})]})]}):null]})})}function ci({label:t,value:e,options:s,onChange:r,error:i,help:n,disabled:a,required:l,name:d}){const h=St(),u=p=>{r?.(p.currentTarget.value)};return o("label",{class:"field",for:h,children:[o("span",{class:"field-label",children:t}),o("select",{id:h,name:d,value:String(e),disabled:a,required:l,onChange:u,"aria-invalid":i?!0:void 0,children:s.map(p=>o("option",{value:p.value,disabled:p.disabled,children:p.label},p.value))}),n&&!i?o("span",{class:"field-help",children:n}):null,i?o("span",{class:"field-error",children:i}):null]})}const hi={modbusSpeed:"9600",addressMR6C:"",addressQDY30A:""},ui={septicDiameter:"0"};function kt(t){if(t.trim()==="")return null;const e=Number(t);return Number.isFinite(e)?e:null}function es(t){return Object.values(t).some(e=>!!e)}function pi(t){const e=g.modbus.speeds.map(r=>({value:String(r),label:`${r} baud`})),s=kt(t);return s!==null&&!g.modbus.speeds.includes(s)&&e.unshift({value:t,label:`${t} (current)`}),e}function ts(t,e){const s=kt(t);if(s===null||!Number.isInteger(s)||s<g.modbus.addressMin||s>g.modbus.addressMax)return`${e} must be an integer between ${g.modbus.addressMin} and ${g.modbus.addressMax}.`}function fi(t){const e=kt(t);if(e===null||e<g.septic.diameterMin||e>g.septic.diameterMax)return`Diameter must be between ${g.septic.diameterMin} and ${g.septic.diameterMax} m.`}function mi(){const[t,e]=w(!1),[s,r]=w(null),[i,n]=w(hi),[a,l]=w({}),[d,h]=w(ui),[u,p]=w({}),[c,f]=w(!1),[b,y]=w(null),[A,m]=w(null),[v,P]=w(!1),[q,U]=w(null),[_,x]=w(!1),k=Xs(),be=Ge(()=>pi(i.modbusSpeed),[i.modbusSpeed]),L=R(async()=>{r(null);const[M,I]=await Promise.all([Qr(),Yr()]);M.ok?n({modbusSpeed:String(M.data.modbusSpeed),addressMR6C:String(M.data.addressMR6C),addressQDY30A:String(M.data.addressQDY30A)}):r(M.message),I.ok?h({septicDiameter:String(I.data.septicDiameter)}):r(O=>O??I.message),e(!0)},[]);Y(()=>{L()},[L]);const z=M=>n(I=>({...I,...M})),yr=M=>h(I=>({...I,...M})),qt=()=>{f(!0),y(null),m(null),U(null)},Lt=()=>f(!1),wr=R(async M=>{M.preventDefault();const I={addressMR6C:ts(i.addressMR6C,"WB-MR6C address"),addressQDY30A:ts(i.addressQDY30A,"QDY-30A address")};if(l(I),!es(I)){qt();try{const O=await Jr({modbusSpeed:Number(i.modbusSpeed),addressMR6C:Number(i.addressMR6C),addressQDY30A:Number(i.addressQDY30A)});O.ok?(y("Modbus settings saved to flash."),P(!0)):m(O.message)}catch(O){m(O instanceof Error?O.message:String(O))}finally{Lt()}}},[i]),Sr=R(async M=>{M.preventDefault();const I={septicDiameter:fi(d.septicDiameter)};if(p(I),!es(I)){qt();try{const O=await Kr({septicDiameter:Number(d.septicDiameter)});O.ok?(y("Septic tank settings saved to flash."),P(!0)):m(O.message)}catch(O){m(O instanceof Error?O.message:String(O))}finally{Lt()}}},[d]),Ar=R(async()=>{if(!window.confirm("Reboot the device now? Automation and MQTT reporting will be offline for about 20-60 seconds."))return;U(null),x(!0);const I=await Ks();x(!1),I.ok?k.start():U(I.message)},[k.start]);return t?o("div",{class:"stack",children:[o(Zs,{}),s?o(F,{children:[o(N,{kind:"error",message:s}),o("div",{class:"form-actions",children:o(H,{onClick:()=>{L()},children:"Retry"})})]}):null,o(W,{title:"Modbus",children:o("form",{onSubmit:wr,novalidate:!0,children:[o(ci,{label:"Bus speed",value:i.modbusSpeed,options:be,onChange:M=>z({modbusSpeed:M}),help:"Applies immediately after save. Only the speeds supported by the firmware are listed.",disabled:c}),o(j,{label:"WB-MR6C address",value:i.addressMR6C,onInput:M=>z({addressMR6C:M}),type:"number",min:g.modbus.addressMin,max:g.modbus.addressMax,inputMode:"numeric",error:a.addressMR6C,help:"Relay module on the shared bus. Requires a reboot to take effect.",disabled:c}),o(j,{label:"QDY-30A address",value:i.addressQDY30A,onInput:M=>z({addressQDY30A:M}),type:"number",min:g.modbus.addressMin,max:g.modbus.addressMax,inputMode:"numeric",error:a.addressQDY30A,help:"Septic tank level sensor. Requires a reboot to take effect.",disabled:c}),o("div",{class:"form-actions",children:o(H,{type:"submit",variant:"primary",disabled:c,children:c?"Saving…":"Save Modbus"})})]})}),o(W,{title:"Septic tank",children:o("form",{onSubmit:Sr,novalidate:!0,children:[o(j,{label:"Tank diameter",value:d.septicDiameter,onInput:M=>yr({septicDiameter:M}),type:"number",min:g.septic.diameterMin,max:g.septic.diameterMax,step:g.septic.diameterStep,inputMode:"decimal",error:u.septicDiameter,help:"Metres. 0 disables the volume and speed sensors. Requires a reboot to take effect.",disabled:c}),o("div",{class:"form-actions",children:o(H,{type:"submit",variant:"primary",disabled:c,children:c?"Saving…":"Save septic tank"})})]})}),b?o(N,{kind:"success",message:b,onClose:()=>y(null)}):null,A?o(N,{kind:"error",message:A,onClose:()=>m(null)}):null,o(W,{title:"Reboot",children:[o("p",{class:"muted",children:["Modbus addresses and the septic tank diameter are read during startup, so they apply only after a reboot.",v?" Settings saved — reboot to apply them.":""]}),q?o(N,{kind:"error",message:q,onClose:()=>U(null)}):null,o("div",{class:"form-actions",children:o(Gs,{onClick:()=>{Ar()},disabled:_||k.phase!=="idle",children:"Reboot device"})})]}),o(er,{flow:k})]}):o(W,{title:"Modbus",children:o("p",{class:"muted",children:"Loading Modbus settings…"})})}function _i({label:t,checked:e,onChange:s,disabled:r,help:i,name:n}){const a=St();return o("div",{class:"checkbox-field",children:[o("label",{class:"checkbox-label",for:a,children:[o("input",{id:a,name:n,type:"checkbox",checked:e,disabled:r,onChange:d=>{s?.(d.currentTarget.checked)}}),o("span",{children:t})]}),i?o("span",{class:"field-help",children:i}):null]})}function gi({label:t,value:e,onInput:s,maxLength:r,error:i,help:n,disabled:a,autoComplete:l}){const[d,h]=w(!1);return o("div",{class:"password-field",children:[o(j,{label:t,value:e,onInput:s,type:d?"text":"password",maxLength:r,error:i,help:n,disabled:a,autoComplete:l}),o("button",{type:"button",class:"btn reveal-toggle","aria-pressed":d,disabled:a,onClick:()=>h(u=>!u),children:d?"Hide":"Show"})]})}const bi={host:"",port:"",login:"",password:"",haDiscoveryPrefix:"",mqttIsHADiscovery:!1,mqttTopicPrefix:""};function vi(t){const e={};t.host.trim().length===0?e.host="Host is required.":t.host.length>g.mqtt.hostMax&&(e.host=`At most ${g.mqtt.hostMax} characters.`);const s=Number(t.port);return t.port.trim()===""?e.port="Port is required.":(!Number.isInteger(s)||s<g.mqtt.portMin||s>g.mqtt.portMax)&&(e.port=`Port must be an integer between ${g.mqtt.portMin} and ${g.mqtt.portMax}.`),t.login.length>g.mqtt.loginMax&&(e.login=`At most ${g.mqtt.loginMax} characters.`),t.password.length>g.mqtt.passwordMax&&(e.password=`At most ${g.mqtt.passwordMax} characters.`),t.haDiscoveryPrefix.trim().length===0?e.haDiscoveryPrefix="Discovery prefix is required.":t.haDiscoveryPrefix.length>g.mqtt.haDiscoveryPrefixMax&&(e.haDiscoveryPrefix=`At most ${g.mqtt.haDiscoveryPrefixMax} characters.`),t.mqttTopicPrefix.trim().length===0?e.mqttTopicPrefix="Topic prefix is required.":t.mqttTopicPrefix.length>g.mqtt.topicPrefixMax?e.mqttTopicPrefix=`At most ${g.mqtt.topicPrefixMax} characters.`:t.mqttTopicPrefix.startsWith("/")||t.mqttTopicPrefix.endsWith("/")?e.mqttTopicPrefix='Must not start or end with "/".':t.mqttTopicPrefix.includes(" ")&&(e.mqttTopicPrefix="Must not contain spaces."),e}function $i(t){return Object.values(t).some(e=>!!e)}function yi(){const[t,e]=w(!1),[s,r]=w(null),[i,n]=w(bi),[a,l]=w({}),[d,h]=w(!1),[u,p]=w(null),[c,f]=w(null),b=R(async()=>{r(null);const m=await Vr();m.ok?n({host:m.data.host,port:String(m.data.port),login:m.data.login,password:m.data.password,haDiscoveryPrefix:m.data.haDiscoveryPrefix,mqttIsHADiscovery:m.data.mqttIsHADiscovery,mqttTopicPrefix:m.data.mqttTopicPrefix}):r(m.message),e(!0)},[]);Y(()=>{b()},[b]);const y=m=>n(v=>({...v,...m})),A=R(async m=>{m.preventDefault();const v=vi(i);if(l(v),p(null),f(null),!$i(v)){h(!0);try{const P=await Gr({host:i.host,port:Number(i.port),login:i.login,password:i.password,haDiscoveryPrefix:i.haDiscoveryPrefix,mqttIsHADiscovery:i.mqttIsHADiscovery,mqttTopicPrefix:i.mqttTopicPrefix});P.ok?p("MQTT settings saved to flash."):f(P.message)}catch(P){f(P instanceof Error?P.message:String(P))}finally{h(!1)}}},[i]);return t?o("div",{class:"stack",children:[o(Zs,{}),s?o(F,{children:[o(N,{kind:"error",message:s}),o("div",{class:"form-actions",children:o(H,{onClick:()=>{b()},children:"Retry"})})]}):null,o(W,{title:"MQTT",children:o("form",{onSubmit:A,novalidate:!0,children:[o(j,{label:"Host",value:i.host,onInput:m=>y({host:m}),maxLength:g.mqtt.hostMax,error:a.host,autoComplete:"off",disabled:d}),o(j,{label:"Port",value:i.port,onInput:m=>y({port:m}),type:"number",min:g.mqtt.portMin,max:g.mqtt.portMax,inputMode:"numeric",error:a.port,disabled:d}),o(j,{label:"Login",value:i.login,onInput:m=>y({login:m}),maxLength:g.mqtt.loginMax,error:a.login,autoComplete:"off",disabled:d}),o(gi,{label:"Password",value:i.password,onInput:m=>y({password:m}),maxLength:g.mqtt.passwordMax,error:a.password,autoComplete:"new-password",disabled:d}),o(j,{label:"HA discovery prefix",value:i.haDiscoveryPrefix,onInput:m=>y({haDiscoveryPrefix:m}),maxLength:g.mqtt.haDiscoveryPrefixMax,error:a.haDiscoveryPrefix,autoComplete:"off",disabled:d}),o(j,{label:"MQTT topic prefix",value:i.mqttTopicPrefix,onInput:m=>y({mqttTopicPrefix:m}),maxLength:g.mqtt.topicPrefixMax,error:a.mqttTopicPrefix,help:"Prefix for every Shelby entity topic, e.g. shelby/<chipID>.",autoComplete:"off",disabled:d}),o(_i,{label:"Enable Home Assistant discovery",checked:i.mqttIsHADiscovery,onChange:m=>y({mqttIsHADiscovery:m}),disabled:d}),u?o(N,{kind:"success",message:u,onClose:()=>p(null)}):null,c?o(N,{kind:"error",message:c,onClose:()=>f(null)}):null,o("div",{class:"form-actions",children:o(H,{type:"submit",variant:"primary",disabled:d,children:d?"Saving…":"Save MQTT"})})]})})]}):o(W,{title:"MQTT",children:o("p",{class:"muted",children:"Loading MQTT settings…"})})}function wi(){const t=xe(null);return Y(()=>{const e=document.createElement("edn-network-page");return e.setAttribute("poll-interval-ms","5000"),t.current?.append(e),()=>e.remove()},[]),o("div",{ref:t})}const Si=1e4;function Ai(t){const e=Math.max(0,Math.floor(t)),s=Math.floor(e/86400),r=Math.floor(e%86400/3600),i=Math.floor(e%3600/60),n=e%60,a=[];return s&&a.push(`${s}d`),(s||r)&&a.push(`${r}h`),(s||r||i)&&a.push(`${i}m`),a.push(`${n}s`),a.join(" ")}function ki(t){return Number.isFinite(t)?`${Math.round(t/1024)} KB (${Math.round(t)} bytes)`:String(t)}function Pi(){const[t,e]=w(null),[s,r]=w(null),[i,n]=w(!1),[a,l]=w(null),[d,h]=w(null),[u,p]=w(!0),[c,f]=w(null),[b,y]=w(!1),A=Xs(),m=R(async()=>{const _=await zr();_.ok?(e(_.data),r(null)):r(_.message),n(!0)},[]),v=R(async()=>{p(!0);const[_,x]=await Promise.all([Js(),Br()]);l(_),h(x),p(!1)},[]);Y(()=>{m();const _=window.setInterval(()=>{m()},Si);return()=>window.clearInterval(_)},[m]),Y(()=>{v()},[v]);const P=R(async()=>{if(!window.confirm("Reboot the device now? Automation and MQTT reporting will be offline for about 20-60 seconds."))return;f(null),y(!0);const x=await Ks();y(!1),x.ok?A.start():f(x.message)},[A.start]),q=u&&!a?o("p",{class:"muted",children:"Checking device health…"}):a?a.ok?o(N,{kind:a.data.healty?"success":"error",message:a.data.healty?"Healthcheck is OK.":"Healthcheck reports failure."}):o(N,{kind:"error",message:a.message}):null,U=d?d.ok?o(N,{kind:d.data.ready?"success":"info",message:d.data.ready?"All registered services (MQTT, devices) are ready.":`Not ready: ${d.data.message}`}):d.status===500?o(N,{kind:"info",message:`Not ready: ${d.message}`}):o(N,{kind:"error",message:d.message}):null;return o("div",{class:"stack",children:[o(W,{title:"Device",children:[i?s?o(F,{children:[o(N,{kind:"error",message:s}),o("div",{class:"form-actions",children:o(H,{onClick:()=>{m()},children:"Retry"})})]}):t?o("dl",{class:"kv",children:[o("dt",{children:"Wi-Fi"}),o("dd",{children:o("span",{class:t.wifiStatus==="connected"?"badge badge-on":"badge badge-off",children:t.wifiStatus})}),o("dt",{children:"Free heap"}),o("dd",{children:ki(t.freeHeap)}),o("dt",{children:"Uptime"}),o("dd",{children:Ai(t.uptime)}),o("dt",{children:"Last reset reason"}),o("dd",{children:t.lastResetReason})]}):null:o("p",{class:"muted",children:"Loading status…"}),o("p",{class:"muted mt",children:"Status refreshes automatically every 10 seconds."})]}),o(W,{title:"Services",children:[q,U,o("div",{class:"form-actions",children:o(H,{onClick:()=>{v()},disabled:u,children:u?"Checking…":"Refresh health"})})]}),o(W,{title:"Maintenance",children:[o("p",{class:"muted",children:"A reboot briefly interrupts automation and MQTT reporting. Configuration changes saved on the other tabs only take effect after a reboot."}),c?o(N,{kind:"error",message:c,onClose:()=>f(null)}):null,o("div",{class:"form-actions",children:o(Gs,{onClick:()=>{P()},disabled:b||A.phase!=="idle",children:"Reboot device"})})]}),o(er,{flow:A})]})}const xi=[{id:"status",label:"Status"},{id:"devices",label:"Devices"},{id:"modbus",label:"Modbus"},{id:"mqtt",label:"MQTT"},{id:"network",label:"Network"},{id:"backup",label:"Backup"}];function Ei(t){switch(t){case"status":return o(Pi,{});case"devices":return o(li,{});case"modbus":return o(mi,{});case"mqtt":return o(yi,{});case"network":return o(wi,{});case"backup":return o(Or,{})}}function Ci(){const[t,e]=w("status");return o(F,{children:[o("header",{class:"app-header",children:[o("div",{class:"brand",children:o("h1",{children:"Shelby"})}),o("span",{class:"hint",children:"KC868-A2 controller"})]}),o(Hr,{tabs:xi,active:t,onSelect:e}),o("main",{class:"tab-content",id:`panel-${t}`,role:"tabpanel","aria-labelledby":`tab-${t}`,children:Ei(t)})]})}function Mi(t){if(t&&typeof t=="object"&&"error"in t){let e=t.error;if(typeof e=="string"&&e.length>0)return e}}function tr(t={}){let e=t.baseUrl??"",s=t.headers??{};async function r(i,n){let a;try{a=await fetch(`${e}${i}`,{...n,headers:{Accept:"application/json",...n?.body===void 0?{}:{"Content-Type":"application/json"},...s}})}catch(u){return n?.signal?.aborted===!0||typeof u=="object"&&u&&u.name==="AbortError"?{ok:!1,message:"Request aborted."}:{ok:!1,message:"Network request failed. Check the device connection and try again."}}let l=await a.text().catch(()=>""),d,h=!1;if(l.length>0)try{d=JSON.parse(l),h=!0}catch{h=!1}if(!a.ok){let u=Mi(d);return{ok:!1,status:a.status,message:u??`Request failed with HTTP ${a.status}.`}}return h?{ok:!0,data:d}:{ok:!1,status:a.status,message:`Unexpected response from server (HTTP ${a.status}).`}}return{getSettings(i){return r("/api/network/settings",{signal:i})},saveSettings(i,n){return r("/api/network/settings",{method:"POST",body:JSON.stringify(i),signal:n})},getStatus(i){return r("/api/network/status",{signal:i})},wifiList(i){return r("/api/wifi/list",{signal:i})}}}var Le=globalThis,Pt=Le.ShadowRoot&&(Le.ShadyCSS===void 0||Le.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,xt=Symbol(),ss=new WeakMap,sr=class{constructor(e,s,r){if(this._$cssResult$=!0,r!==xt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=s}get styleSheet(){let e=this.o,s=this.t;if(Pt&&e===void 0){let r=s!==void 0&&s.length===1;r&&(e=ss.get(s)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&ss.set(s,e))}return e}toString(){return this.cssText}},Ti=t=>new sr(typeof t=="string"?t:t+"",void 0,xt),Et=(t,...e)=>new sr(t.length===1?t[0]:e.reduce((s,r,i)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[i+1],t[0]),t,xt),Di=(t,e)=>{if(Pt)t.adoptedStyleSheets=e.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(let s of e){let r=document.createElement("style"),i=Le.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=s.cssText,t.appendChild(r)}},rs=Pt?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let s="";for(let r of e.cssRules)s+=r.cssText;return Ti(s)})(t):t,{is:Ni,defineProperty:Ui,getOwnPropertyDescriptor:Ri,getOwnPropertyNames:Ii,getOwnPropertySymbols:Hi,getPrototypeOf:Oi}=Object,et=globalThis,is=et.trustedTypes,qi=is?is.emptyScript:"",Li=et.reactiveElementPolyfillSupport,Se=(t,e)=>t,mt={toAttribute(t,e){switch(e){case Boolean:t=t?qi:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=t!==null;break;case Number:s=t===null?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch{s=null}}return s}},rr=(t,e)=>!Ni(t,e),ns={attribute:!0,type:String,converter:mt,reflect:!1,useDefault:!1,hasChanged:rr};Symbol.metadata??=Symbol("metadata"),et.litPropertyMetadata??=new WeakMap;var he=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,s=ns){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(e,s),!s.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(e,r,s);i!==void 0&&Ui(this.prototype,e,i)}}static getPropertyDescriptor(e,s,r){let{get:i,set:n}=Ri(this.prototype,e)??{get(){return this[s]},set(a){this[s]=a}};return{get:i,set(a){let l=i?.call(this);n?.call(this,a),this.requestUpdate(e,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ns}static _$Ei(){if(this.hasOwnProperty(Se("elementProperties")))return;let e=Oi(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Se("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Se("properties"))){let s=this.properties,r=[...Ii(s),...Hi(s)];for(let i of r)this.createProperty(i,s[i])}let e=this[Symbol.metadata];if(e!==null){let s=litPropertyMetadata.get(e);if(s!==void 0)for(let[r,i]of s)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[s,r]of this.elementProperties){let i=this._$Eu(s,r);i!==void 0&&this._$Eh.set(i,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let s=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let i of r)s.unshift(rs(i))}else e!==void 0&&s.push(rs(e));return s}static _$Eu(e,s){let r=s.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,s=this.constructor.elementProperties;for(let r of s.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Di(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,s,r){this._$AK(e,r)}_$ET(e,s){let r=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,r);if(i!==void 0&&r.reflect===!0){let n=(r.converter?.toAttribute===void 0?mt:r.converter).toAttribute(s,r.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,s){let r=this.constructor,i=r._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=r.getPropertyOptions(i),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute===void 0?mt:n.converter;this._$Em=i;let l=a.fromAttribute(s,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(e,s,r,i=!1,n){if(e!==void 0){let a=this.constructor;if(i===!1&&(n=this[e]),r??=a.getPropertyOptions(e),!((r.hasChanged??rr)(n,s)||r.useDefault&&r.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,r))))return;this.C(e,s,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,s,{useDefault:r,reflect:i,wrapped:n},a){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??s??this[e]),n!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(s=void 0),this._$AL.set(e,s)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,n]of r){let{wrapped:a}=n,l=this[i];a!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let e=!1,s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(s)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(s)}willUpdate(e){}_$AE(e){this._$EO?.forEach(s=>s.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(s=>this._$ET(s,this[s])),this._$EM()}updated(e){}firstUpdated(e){}};he.elementStyles=[],he.shadowRootOptions={mode:"open"},he[Se("elementProperties")]=new Map,he[Se("finalized")]=new Map,Li?.({ReactiveElement:he}),(et.reactiveElementVersions??=[]).push("2.1.2");var Ct=globalThis,as=t=>t,Qe=Ct.trustedTypes,os=Qe?Qe.createPolicy("lit-html",{createHTML:t=>t}):void 0,ir="$lit$",J=`lit$${Math.random().toFixed(9).slice(2)}$`,nr="?"+J,Wi=`<${nr}>`,oe=document,Ee=()=>oe.createComment(""),Ce=t=>t===null||typeof t!="object"&&typeof t!="function",Mt=Array.isArray,Fi=t=>Mt(t)||typeof t?.[Symbol.iterator]=="function",lt=`[ 	
\f\r]`,ve=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ls=/-->/g,ds=/>/g,G=RegExp(`>|${lt}(?:([^\\s"'>=/]+)(${lt}*=${lt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),cs=/'/g,hs=/"/g,ar=/^(?:script|style|textarea|title)$/i,$=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),fe=Symbol.for("lit-noChange"),S=Symbol.for("lit-nothing"),us=new WeakMap,X=oe.createTreeWalker(oe,129);function or(t,e){if(!Mt(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return os===void 0?e:os.createHTML(e)}var zi=(t,e)=>{let s=t.length-1,r=[],i,n=e===2?"<svg>":e===3?"<math>":"",a=ve;for(let l=0;l<s;l++){let d=t[l],h,u,p=-1,c=0;for(;c<d.length&&(a.lastIndex=c,u=a.exec(d),u!==null);)c=a.lastIndex,a===ve?u[1]==="!--"?a=ls:u[1]===void 0?u[2]===void 0?u[3]!==void 0&&(a=G):(ar.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=G):a=ds:a===G?u[0]===">"?(a=i??ve,p=-1):u[1]===void 0?p=-2:(p=a.lastIndex-u[2].length,h=u[1],a=u[3]===void 0?G:u[3]==='"'?hs:cs):a===hs||a===cs?a=G:a===ls||a===ds?a=ve:(a=G,i=void 0);let f=a===G&&t[l+1].startsWith("/>")?" ":"";n+=a===ve?d+Wi:p>=0?(r.push(h),d.slice(0,p)+ir+d.slice(p)+J+f):d+J+(p===-2?l:f)}return[or(t,n+(t[s]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},_t=class lr{constructor({strings:e,_$litType$:s},r){let i;this.parts=[];let n=0,a=0,l=e.length-1,d=this.parts,[h,u]=zi(e,s);if(this.el=lr.createElement(h,r),X.currentNode=this.el.content,s===2||s===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=X.nextNode())!==null&&d.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(ir)){let c=u[a++],f=i.getAttribute(p).split(J),b=/([.?@])?(.*)/.exec(c);d.push({type:1,index:n,name:b[2],strings:f,ctor:b[1]==="."?ji:b[1]==="?"?Qi:b[1]==="@"?Yi:tt}),i.removeAttribute(p)}else p.startsWith(J)&&(d.push({type:6,index:n}),i.removeAttribute(p));if(ar.test(i.tagName)){let p=i.textContent.split(J),c=p.length-1;if(c>0){i.textContent=Qe?Qe.emptyScript:"";for(let f=0;f<c;f++)i.append(p[f],Ee()),X.nextNode(),d.push({type:2,index:++n});i.append(p[c],Ee())}}}else if(i.nodeType===8)if(i.data===nr)d.push({type:2,index:n});else{let p=-1;for(;(p=i.data.indexOf(J,p+1))!==-1;)d.push({type:7,index:n}),p+=J.length-1}n++}}static createElement(e,s){let r=oe.createElement("template");return r.innerHTML=e,r}};function me(t,e,s=t,r){if(e===fe)return e;let i=r===void 0?s._$Cl:s._$Co?.[r],n=Ce(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(t),i._$AT(t,s,r)),r===void 0?s._$Cl=i:(s._$Co??=[])[r]=i),i!==void 0&&(e=me(t,i._$AS(t,e.values),i,r)),e}var Bi=class{constructor(e,s){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:s},parts:r}=this._$AD,i=(e?.creationScope??oe).importNode(s,!0);X.currentNode=i;let n=X.nextNode(),a=0,l=0,d=r[0];for(;d!==void 0;){if(a===d.index){let h;d.type===2?h=new Tt(n,n.nextSibling,this,e):d.type===1?h=new d.ctor(n,d.name,d.strings,this,e):d.type===6&&(h=new Vi(n,this,e)),this._$AV.push(h),d=r[++l]}a!==d?.index&&(n=X.nextNode(),a++)}return X.currentNode=oe,i}p(e){let s=0;for(let r of this._$AV)r!==void 0&&(r.strings===void 0?r._$AI(e[s]):(r._$AI(e,r,s),s+=r.strings.length-2)),s++}},Tt=class dr{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,s,r,i){this.type=2,this._$AH=S,this._$AN=void 0,this._$AA=e,this._$AB=s,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,s=this._$AM;return s!==void 0&&e?.nodeType===11&&(e=s.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,s=this){e=me(this,e,s),Ce(e)?e===S||e==null||e===""?(this._$AH!==S&&this._$AR(),this._$AH=S):e!==this._$AH&&e!==fe&&this._(e):e._$litType$===void 0?e.nodeType===void 0?Fi(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==S&&Ce(this._$AH)?this._$AA.nextSibling.data=e:this.T(oe.createTextNode(e)),this._$AH=e}$(e){let{values:s,_$litType$:r}=e,i=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=_t.createElement(or(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(s);else{let n=new Bi(i,this),a=n.u(this.options);n.p(s),this.T(a),this._$AH=n}}_$AC(e){let s=us.get(e.strings);return s===void 0&&us.set(e.strings,s=new _t(e)),s}k(e){Mt(this._$AH)||(this._$AH=[],this._$AR());let s=this._$AH,r,i=0;for(let n of e)i===s.length?s.push(r=new dr(this.O(Ee()),this.O(Ee()),this,this.options)):r=s[i],r._$AI(n),i++;i<s.length&&(this._$AR(r&&r._$AB.nextSibling,i),s.length=i)}_$AR(e=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);e!==this._$AB;){let r=as(e).nextSibling;as(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},tt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,s,r,i,n){this.type=1,this._$AH=S,this._$AN=void 0,this.element=e,this.name=s,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=S}_$AI(e,s=this,r,i){let n=this.strings,a=!1;if(n===void 0)e=me(this,e,s,0),a=!Ce(e)||e!==this._$AH&&e!==fe,a&&(this._$AH=e);else{let l=e,d,h;for(e=n[0],d=0;d<n.length-1;d++)h=me(this,l[r+d],s,d),h===fe&&(h=this._$AH[d]),a||=!Ce(h)||h!==this._$AH[d],h===S?e=S:e!==S&&(e+=(h??"")+n[d+1]),this._$AH[d]=h}a&&!i&&this.j(e)}j(e){e===S?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ji=class extends tt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===S?void 0:e}},Qi=class extends tt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==S)}},Yi=class extends tt{constructor(e,s,r,i,n){super(e,s,r,i,n),this.type=5}_$AI(e,s=this){if((e=me(this,e,s,0)??S)===fe)return;let r=this._$AH,i=e===S&&r!==S||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,n=e!==S&&(r===S||i);i&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Vi=class{constructor(e,s,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=s,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){me(this,e)}},Ji=Ct.litHtmlPolyfillSupport;Ji?.(_t,Tt),(Ct.litHtmlVersions??=[]).push("3.3.3");var Ki=(t,e,s)=>{let r=s?.renderBefore??e,i=r._$litPart$;if(i===void 0){let n=s?.renderBefore??null;r._$litPart$=i=new Tt(e.insertBefore(Ee(),n),n,void 0,s??{})}return i._$AI(t),i},Dt=globalThis,te=class extends he{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ki(s,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return fe}};te._$litElement$=!0,te.finalized=!0,Dt.litElementHydrateSupport?.({LitElement:te});var Gi=Dt.litElementPolyfillSupport;Gi?.({LitElement:te}),(Dt.litElementVersions??=[]).push("4.2.2");var Zi={ethernet:"Ethernet",wifi:"Wi-Fi",wifi_ap:"Wi-Fi AP"};function Xi(t){return t===void 0||Number.isNaN(t)?"Unknown":t>=-55?"Excellent":t>=-67?"Good":t>=-75?"Fair":"Weak"}function en(t){return t===1?"Full":t===0?"Half":`Unknown (${t})`}function tn(t){let e=s=>String(s).padStart(2,"0");return`${e(t.getHours())}:${e(t.getMinutes())}:${e(t.getSeconds())}`}var se,sn=(se=class extends te{constructor(...e){super(...e),this.baseUrl="",this.pollIntervalMs=1e4,this.errorMessage="",this.loading=!1,this.refreshSeq=0,this.handleRetry=()=>{this.refresh()}}connectedCallback(){super.connectedCallback(),this.refresh(),this.startPolling()}disconnectedCallback(){super.disconnectedCallback(),this.stopPolling()}updated(e){e.has("pollIntervalMs")&&this.startPolling();let s=e.get("baseUrl");e.has("baseUrl")&&s!==void 0&&s!==this.baseUrl&&(this.client=void 0,this.refresh())}render(){let e=this.status;return $`
      <div class="card">
        <header class="head">
          ${e?$`<span class="badge badge-${e.mode}">${Zi[e.mode]}</span>`:$`<span class="badge badge-unknown">Unknown</span>`}
          ${e?$`<span class="state ${e.connected?"state-up":"state-down"}">
                ${e.connected?"Connected":"Disconnected"}
              </span>`:S}
          ${this.loading?$`<span class="muted loading">Refreshing…</span>`:S}
        </header>

        ${e?.fallbackAP?$`<div class="banner banner-warn" role="alert">
              Fallback AP active — the device could not reach the configured network.
            </div>`:S}
        ${this.errorMessage?$`<div class="banner banner-error" role="alert">
              <span>${this.errorMessage}</span>
              <button type="button" @click=${this.handleRetry}>Retry</button>
            </div>`:S}
        ${e?this.renderSections(e):$`<p class="muted">Loading network status…</p>`}

        <footer class="muted foot">
          ${this.lastUpdated?$`Updated ${tn(this.lastUpdated)}`:$`Waiting for data…`}
        </footer>
      </div>
    `}renderSections(e){switch(e.mode){case"wifi":return this.renderWifi(e);case"wifi_ap":return this.renderAp(e);case"ethernet":return this.renderEthernet(e)}}renderWifi(e){return $`
      <section>
        <h2>Wi-Fi</h2>
        <dl class="rows">
          ${this.row("SSID",e.ssid)}
          ${this.row("Signal",e.rssi===void 0?void 0:`${e.rssi} dBm (${Xi(e.rssi)})`)}
          ${this.row("IP address",e.ip)} ${this.row("MAC address",e.mac)}
        </dl>
      </section>
    `}renderAp(e){let s=e.ap;return $`
      <section>
        <h2>Access point</h2>
        <dl class="rows">
          ${this.row("SSID",s?.ssid)} ${this.row("IP address",s?.ip)}
          ${this.row("Stations",s?.stations)}
        </dl>
      </section>
    `}renderEthernet(e){let s=e.eth;return $`
      <section>
        <h2>Ethernet</h2>
        <dl class="rows">
          ${this.row("IP address",s?.ip)} ${this.row("MAC address",s?.mac)}
          ${this.row("Link",s===void 0?void 0:s.linkUp?"Up":"Down")}
          ${this.row("Speed",s===void 0?void 0:`${s.speed} Mbps`)}
          ${this.row("Duplex",s===void 0?void 0:en(s.duplex))}
        </dl>
      </section>
    `}row(e,s){return s===void 0||s===""?S:$`<dt>${e}</dt>
          <dd>${s}</dd>`}ensureClient(){return(!this.client||this.clientBaseUrl!==this.baseUrl)&&(this.client=tr({baseUrl:this.baseUrl}),this.clientBaseUrl=this.baseUrl),this.client}async refresh(){let e=++this.refreshSeq;this.loading=!0;let s=await this.ensureClient().getStatus();if(e===this.refreshSeq){if(this.loading=!1,s.ok){this.status=s.data,this.errorMessage="",this.lastUpdated=new Date;return}this.errorMessage=s.message,this.dispatchEvent(new CustomEvent("edn-error",{detail:{message:s.message},bubbles:!0,composed:!0}))}}startPolling(){this.stopPolling();let e=Number(this.pollIntervalMs);!Number.isFinite(e)||e<=0||(this.timerId=setInterval(()=>{typeof document<"u"&&document.hidden||this.refresh()},e))}stopPolling(){this.timerId!==void 0&&(clearInterval(this.timerId),this.timerId=void 0)}},se.properties={baseUrl:{type:String,attribute:"base-url"},pollIntervalMs:{type:Number,attribute:"poll-interval-ms"},status:{state:!0},errorMessage:{state:!0},lastUpdated:{state:!0},loading:{state:!0}},se.styles=Et`
    :host {
      display: block;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      color: #1f2430;
      --_accent: var(--edn-accent, #2563eb);
      --_danger: var(--edn-danger, #dc2626);
      --_muted: var(--edn-muted, #6b7280);
      --_border: #e2e5ea;
      --_surface: #ffffff;
    }

    .card {
      background: var(--_surface);
      border: 1px solid var(--_border);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      max-width: 28rem;
      box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    }

    .head {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .badge {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      background: #eef2ff;
      color: var(--_accent);
    }

    .badge-ethernet {
      background: #e0f2fe;
      color: #0369a1;
    }

    .badge-wifi_ap {
      background: #fef3c7;
      color: #b45309;
    }

    .badge-unknown {
      background: #f3f4f6;
      color: var(--_muted);
    }

    .state {
      font-size: 0.85rem;
      font-weight: 600;
    }

    .state-up {
      color: #15803d;
    }

    .state-down {
      color: var(--_muted);
    }

    .loading {
      font-size: 0.8rem;
      margin-left: auto;
    }

    .banner {
      margin-top: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: space-between;
    }

    .banner-warn {
      background: #fffbeb;
      border: 1px solid #fde68a;
      color: #92400e;
    }

    .banner-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: var(--_danger);
    }

    section {
      margin-top: 1rem;
    }

    h2 {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--_muted);
      margin: 0 0 0.5rem;
    }

    .rows {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.35rem 0.75rem;
      margin: 0;
    }

    dt {
      color: var(--_muted);
      font-size: 0.85rem;
    }

    dd {
      margin: 0;
      font-size: 0.9rem;
      word-break: break-word;
    }

    .muted {
      color: var(--_muted);
    }

    .foot {
      margin-top: 1rem;
      font-size: 0.75rem;
    }

    button {
      font: inherit;
      font-size: 0.8rem;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      border: 1px solid currentColor;
      background: transparent;
      color: var(--_accent);
      cursor: pointer;
    }

    button:hover {
      background: rgba(37, 99, 235, 0.08);
    }
  `,se);typeof customElements<"u"&&!customElements.get("edn-network-status")&&customElements.define("edn-network-status",sn);var Ue=32,$e=64,dt=8,rn=5e3,nn=new TextEncoder;function Re(t){return nn.encode(t).length}function ps(t){return t.isAPMode?"ap":"station"}var re,an=(re=class extends te{constructor(...e){super(...e),this.baseUrl="",this.settings=null,this.loading=!1,this.submitting=!1,this.errorMessage="",this.successMessage="",this.draftMode="station",this.draftWifiSSID="",this.draftWifiPassword="",this.draftWifiPasswordDirty=!1,this.draftApSSID="",this.draftApHasPassword=!1,this.draftApPassword="",this.draftApPasswordDirty=!1,this.fieldErrors={},this.scanning=!1,this.scanResults=[],this.scanError="",this.loadToken=0,this.settingsBaseUrl=null,this.handleWifiSSIDInput=s=>{this.draftWifiSSID=s.target.value},this.handleWifiPasswordInput=s=>{this.draftWifiPassword=s.target.value,this.draftWifiPasswordDirty=!0},this.handleApSSIDInput=s=>{this.draftApSSID=s.target.value},this.handleApPasswordInput=s=>{this.draftApPassword=s.target.value,this.draftApPasswordDirty=!0},this.handleApHasPasswordChange=s=>{this.draftApHasPassword=s.target.checked,this.draftApHasPassword||(this.draftApPassword="",this.draftApPasswordDirty=!1,this.fieldErrors={...this.fieldErrors,wifiAPPassword:void 0})},this.handlePickSsid=s=>{this.draftMode!=="station"&&(this.draftMode="station"),this.draftWifiSSID=s,this.fieldErrors={...this.fieldErrors,wifiSSID:void 0}},this.handleSubmit=s=>{s.preventDefault(),this.handleSave()},this.handleRetry=()=>{this.load()}}connectedCallback(){super.connectedCallback(),this.load()}disconnectedCallback(){super.disconnectedCallback(),this.scanController?.abort(),this.scanController=void 0}updated(e){let s=e.get("baseUrl");e.has("baseUrl")&&s!==void 0&&s!==this.baseUrl&&(this.client=void 0,this.scanResults=[],this.scanError="",this.load())}render(){let e=this.settings;return $`
      <div class="card">
        <h1>Network settings</h1>
        ${this.errorMessage?$`<div class="banner banner-error" role="alert">
              <span>${this.errorMessage}</span>
              <button type="button" @click=${this.handleRetry}>Retry</button>
            </div>`:S}
        ${this.successMessage?$`<div class="banner banner-success" role="status">${this.successMessage}</div>`:S}
        ${e?$`${this.renderForm(e)} ${this.renderScan()}`:this.loading?$`<p class="status">Loading settings…</p>`:$`<p class="status">Settings unavailable.</p>`}
      </div>
    `}renderForm(e){return $`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>Mode</legend>
          <div class="segmented" role="group" aria-label="Network mode">
            <button
              type="button"
              class="seg ${this.draftMode==="station"?"active":""}"
              aria-pressed=${this.draftMode==="station"}
              @click=${()=>this.setMode("station")}
            >
              Station
            </button>
            <button
              type="button"
              class="seg ${this.draftMode==="ap"?"active":""}"
              aria-pressed=${this.draftMode==="ap"}
              @click=${()=>this.setMode("ap")}
            >
              Access Point
            </button>
          </div>
        </fieldset>

        ${this.draftMode==="station"?this.renderStation(e):this.renderAccessPoint(e)}

        <div class="actions">
          <button class="primary" type="submit" ?disabled=${this.submitting||!this.dirty}>
            ${this.submitting?"Saving…":"Save"}
          </button>
          ${this.dirty?$`<span class="muted">Unsaved changes</span>`:S}
        </div>
      </form>
    `}renderStation(e){return $`
      <section class="group">
        <h2>Station</h2>
        <label>
          Wi-Fi name
          <input
            name="wifiSSID"
            type="text"
            autocomplete="off"
            .value=${this.draftWifiSSID}
            @input=${this.handleWifiSSIDInput}
          />
        </label>
        ${this.renderFieldError("wifiSSID")}
        <label>
          Wi-Fi password
          <input
            name="wifiPassword"
            type="password"
            autocomplete="new-password"
            placeholder=${e.hasWifiPassword?"Leave blank to keep saved password":"No password set"}
            .value=${this.draftWifiPassword}
            @input=${this.handleWifiPasswordInput}
          />
        </label>
        ${e.hasWifiPassword?$`<p class="hint">Password saved •••• (leave blank to keep)</p>`:S}
        ${this.renderPasswordClearWarning("wifiPassword")}
        ${this.renderFieldError("wifiPassword")}
      </section>
    `}renderAccessPoint(e){return $`
      <section class="group">
        <h2>Access point</h2>
        <label>
          Access point name
          <input
            name="wifiAPSSID"
            type="text"
            autocomplete="off"
            .value=${this.draftApSSID}
            @input=${this.handleApSSIDInput}
          />
        </label>
        ${this.renderFieldError("wifiAPSSID")}
        <label class="check">
          <input
            type="checkbox"
            .checked=${this.draftApHasPassword}
            @change=${this.handleApHasPasswordChange}
          />
          Require password
        </label>
        ${this.draftApHasPassword?$`
              <label>
                Access point password
                <input
                  name="wifiAPPassword"
                  type="password"
                  autocomplete="new-password"
                  placeholder=${e.hasWifiAPPassword?"Leave blank to keep saved password":"At least 8 characters"}
                  .value=${this.draftApPassword}
                  @input=${this.handleApPasswordInput}
                />
              </label>
              ${e.hasWifiAPPassword?$`<p class="hint">Password saved •••• (leave blank to keep)</p>`:S}
              ${this.renderPasswordClearWarning("wifiAPPassword")}
              ${this.renderFieldError("wifiAPPassword")}
            `:S}
      </section>
    `}renderScan(){return $`
      <section class="group">
        <div class="scan-head">
          <h2>Wi-Fi scan</h2>
          <button type="button" @click=${this.handleScan} ?disabled=${this.scanning}>
            ${this.scanning?"Scanning…":"Scan"}
          </button>
        </div>
        ${this.scanError?$`<div class="banner banner-error" role="alert">${this.scanError}</div>`:S}
        ${this.scanResults.length>0?$`<ul class="networks">
              ${this.scanResults.map(e=>this.renderNetwork(e))}
            </ul>`:S}
      </section>
    `}renderNetwork(e){return $`
      <li>
        <button type="button" class="network" @click=${()=>this.handlePickSsid(e.ssid)}>
          <span class="ssid">${e.ssid}</span>
          <span class="meta">
            ${e.encrypted?$`<span class="lock" title="Encrypted" aria-label="Encrypted">🔒</span>`:S}
            ${e.rssi} dBm · Ch ${e.channel}
          </span>
        </button>
      </li>
    `}renderFieldError(e){let s=this.fieldErrors[e];return s?$`<p class="field-error" role="alert">${s}</p>`:S}renderPasswordClearWarning(e){return(e==="wifiPassword"?this.draftWifiPasswordDirty&&this.draftWifiPassword===""&&this.settings?.hasWifiPassword===!0:this.draftApPasswordDirty&&this.draftApPassword===""&&this.draftApHasPassword&&this.settings?.hasWifiAPPassword===!0)?$`<p class="clear-warning" role="alert">
          Warning: saving now will remove the stored password.
        </p>`:S}get dirty(){let e=this.settings;return e?this.draftMode!==ps(e)||this.draftWifiSSID!==e.wifiSSID||this.draftApSSID!==e.wifiAPSSID||this.draftApHasPassword!==e.wifiAPHasPassword||this.draftWifiPasswordDirty||this.draftApPasswordDirty:!1}ensureClient(){return(!this.client||this.clientBaseUrl!==this.baseUrl)&&(this.client=tr({baseUrl:this.baseUrl}),this.clientBaseUrl=this.baseUrl),this.client}async load(){let e=++this.loadToken;this.loading=!0;let s=await this.ensureClient().getSettings();if(e!==this.loadToken){this.settingsBaseUrl!==this.baseUrl&&(this.settings=null);return}if(this.loading=!1,s.ok){this.applyServerSettings(s.data),this.errorMessage="";return}this.settingsBaseUrl!==this.baseUrl&&(this.settings=null),this.errorMessage=s.message,this.emitError(s.message)}applyServerSettings(e){this.settings=e,this.settingsBaseUrl=this.baseUrl,this.draftMode=ps(e),this.draftWifiSSID=e.wifiSSID,this.draftApSSID=e.wifiAPSSID,this.draftApHasPassword=e.wifiAPHasPassword,this.draftWifiPassword="",this.draftWifiPasswordDirty=!1,this.draftApPassword="",this.draftApPasswordDirty=!1,this.fieldErrors={}}validate(){let e=this.settings,s={};if(!e)return s;let r=this.draftMode==="ap";if(Re(this.draftWifiSSID)>Ue&&(s.wifiSSID=`Wi-Fi name must be ${Ue} characters or fewer.`),Re(this.draftApSSID)>Ue&&(s.wifiAPSSID=`Access point name must be ${Ue} characters or fewer.`),r?this.draftApSSID.length===0&&(s.wifiAPSSID="Access point name is required in AP mode."):this.draftWifiSSID.length===0&&(s.wifiSSID="Wi-Fi name is required in station mode."),this.draftWifiPasswordDirty&&Re(this.draftWifiPassword)>$e&&(s.wifiPassword=`Wi-Fi password must be ${$e} characters or fewer.`),this.draftApHasPassword)if(this.draftApPasswordDirty){let i=Re(this.draftApPassword);(i<dt||i>$e)&&(s.wifiAPPassword=`Access point password must be ${dt}–${$e} characters.`)}else e.hasWifiAPPassword||(s.wifiAPPassword=`Enter an access point password (${dt}–${$e} characters).`);return s}buildPatch(){let e=this.settings,s={};if(!e)return s;let r=this.draftMode==="ap";return r!==e.isAPMode&&(s.isAPMode=r),this.draftWifiSSID!==e.wifiSSID&&(s.wifiSSID=this.draftWifiSSID),this.draftWifiPasswordDirty&&(s.wifiPassword=this.draftWifiPassword),this.draftApSSID!==e.wifiAPSSID&&(s.wifiAPSSID=this.draftApSSID),this.draftApHasPassword!==e.wifiAPHasPassword&&(s.wifiAPHasPassword=this.draftApHasPassword),this.draftApHasPassword&&this.draftApPasswordDirty&&(s.wifiAPPassword=this.draftApPassword),s}async handleSave(){if(this.submitting||!this.settings)return;let e=this.validate();if(this.fieldErrors=e,Object.keys(e).length>0)return;let s=this.buildPatch();if(Object.keys(s).length===0)return;this.submitting=!0,this.errorMessage="",this.successMessage="";let r=await this.ensureClient().saveSettings(s);if(this.submitting=!1,r.ok){this.applyServerSettings(r.data),this.successMessage="Settings saved.",this.dispatchEvent(new CustomEvent("edn-saved",{detail:r.data,bubbles:!0,composed:!0}));return}let i=r.status===void 0?"Could not confirm the save — the device may have applied the changes and reconnected. Check the status widget or retry.":r.message;this.errorMessage=i,this.emitError(i)}async handleScan(){if(this.scanning)return;this.scanning=!0,this.scanError="";let e=new AbortController;this.scanController=e;let s,r=new Promise(n=>{s=setTimeout(()=>{e.abort(),n({ok:!1,message:"Wi-Fi scan timed out after 5 seconds."})},rn)}),i=await Promise.race([this.ensureClient().wifiList(e.signal),r]);if(s!==void 0&&clearTimeout(s),this.scanController===e&&(this.scanController=void 0),this.scanning=!1,i.ok){this.scanResults=[...i.data.networks].sort((n,a)=>a.rssi-n.rssi);return}i.message!=="Request aborted."&&(this.scanError=i.message,this.emitError(i.message))}emitError(e){this.dispatchEvent(new CustomEvent("edn-error",{detail:{message:e},bubbles:!0,composed:!0}))}setMode(e){this.draftMode!==e&&(this.draftMode=e,this.fieldErrors={})}},re.properties={baseUrl:{type:String,attribute:"base-url"},settings:{state:!0},loading:{state:!0},submitting:{state:!0},errorMessage:{state:!0},successMessage:{state:!0},draftMode:{state:!0},draftWifiSSID:{state:!0},draftWifiPassword:{state:!0},draftWifiPasswordDirty:{state:!0},draftApSSID:{state:!0},draftApHasPassword:{state:!0},draftApPassword:{state:!0},draftApPasswordDirty:{state:!0},fieldErrors:{state:!0},scanning:{state:!0},scanResults:{state:!0},scanError:{state:!0}},re.styles=Et`
    :host {
      display: block;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      color: #1f2430;
      --_accent: var(--edn-accent, #2563eb);
      --_danger: var(--edn-danger, #dc2626);
      --_muted: var(--edn-muted, #6b7280);
      --_border: #e2e5ea;
      --_surface: #ffffff;
    }

    .card {
      background: var(--_surface);
      border: 1px solid var(--_border);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      max-width: 30rem;
      box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    }

    h1 {
      font-size: 1rem;
      margin: 0 0 0.75rem;
    }

    h2 {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--_muted);
      margin: 0 0 0.5rem;
    }

    .banner {
      margin: 0 0 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: space-between;
    }

    .banner-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: var(--_danger);
    }

    .banner-success {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #15803d;
    }

    fieldset {
      border: 0;
      padding: 0;
      margin: 0 0 0.75rem;
    }

    legend {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--_muted);
      margin-bottom: 0.35rem;
    }

    .segmented {
      display: inline-flex;
      border: 1px solid var(--_border);
      border-radius: 8px;
      overflow: hidden;
    }

    .seg {
      font: inherit;
      font-size: 0.85rem;
      padding: 0.35rem 0.85rem;
      border: 0;
      background: transparent;
      color: var(--_muted);
      cursor: pointer;
    }

    .seg.active {
      background: var(--_accent);
      color: #ffffff;
    }

    .group {
      border-top: 1px solid var(--_border);
      padding-top: 0.75rem;
      margin-bottom: 0.75rem;
    }

    label {
      display: block;
      font-size: 0.85rem;
      margin-bottom: 0.6rem;
    }

    input[type='text'],
    input[type='password'] {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin-top: 0.25rem;
      font: inherit;
      font-size: 0.9rem;
      padding: 0.4rem 0.55rem;
      border: 1px solid var(--_border);
      border-radius: 6px;
      background: #fff;
      color: inherit;
    }

    input[type='text']:focus,
    input[type='password']:focus {
      outline: 2px solid color-mix(in srgb, var(--_accent) 45%, transparent);
      outline-offset: 1px;
      border-color: var(--_accent);
    }

    .check {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.85rem;
    }

    .hint {
      font-size: 0.78rem;
      color: var(--_muted);
      margin: -0.3rem 0 0.5rem;
    }

    .field-error {
      font-size: 0.78rem;
      color: var(--_danger);
      margin: -0.3rem 0 0.6rem;
    }

    .clear-warning {
      font-size: 0.78rem;
      color: var(--_danger);
      margin: -0.3rem 0 0.6rem;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      border-top: 1px solid var(--_border);
      padding-top: 0.75rem;
    }

    button {
      font: inherit;
      font-size: 0.8rem;
      padding: 0.3rem 0.7rem;
      border-radius: 6px;
      border: 1px solid currentColor;
      background: transparent;
      color: var(--_accent);
      cursor: pointer;
    }

    button:hover:not(:disabled) {
      background: rgba(37, 99, 235, 0.08);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .primary {
      background: var(--_accent);
      border-color: var(--_accent);
      color: #ffffff;
    }

    .primary:hover:not(:disabled) {
      background: color-mix(in srgb, var(--_accent) 88%, #000);
    }

    .scan-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .scan-head h2 {
      margin: 0;
    }

    ul.networks {
      list-style: none;
      margin: 0.5rem 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .network {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      width: 100%;
      text-align: left;
      border: 1px solid var(--_border);
      border-radius: 6px;
      padding: 0.35rem 0.55rem;
      color: inherit;
    }

    .network .ssid {
      font-size: 0.85rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .network .meta {
      font-size: 0.75rem;
      color: var(--_muted);
      white-space: nowrap;
    }

    .lock {
      color: var(--_muted);
    }

    .muted {
      color: var(--_muted);
    }

    .status {
      font-size: 0.85rem;
      color: var(--_muted);
    }
  `,re);typeof customElements<"u"&&!customElements.get("edn-network-settings")&&customElements.define("edn-network-settings",an);var on=[{id:"status",label:"Status"},{id:"settings",label:"Network settings"}],ie,ln=(ie=class extends te{constructor(...e){super(...e),this.baseUrl="",this.pollIntervalMs=1e4,this.activeTab="status"}render(){return $`
      <div class="tabs" role="tablist" aria-label="Network">
        ${on.map(e=>$`
            <button
              type="button"
              role="tab"
              id="tab-${e.id}"
              aria-controls="panel-${e.id}"
              aria-selected=${this.activeTab===e.id}
              @click=${()=>this.selectTab(e.id)}
            >
              ${e.label}
            </button>
          `)}
      </div>
      <div class="panel" id="panel-${this.activeTab}" role="tabpanel">
        ${this.renderActive()}
      </div>
    `}renderActive(){return this.activeTab==="settings"?$`<edn-network-settings base-url=${this.baseUrl}></edn-network-settings>`:$`
      <edn-network-status
        base-url=${this.baseUrl}
        poll-interval-ms=${this.pollIntervalMs}
      ></edn-network-status>
    `}selectTab(e){this.activeTab!==e&&(this.activeTab=e,this.dispatchEvent(new CustomEvent("edn-tab-change",{detail:{tab:e},bubbles:!0,composed:!0})))}},ie.properties={baseUrl:{type:String,attribute:"base-url"},pollIntervalMs:{type:Number,attribute:"poll-interval-ms"},activeTab:{state:!0}},ie.styles=Et`
    :host {
      display: block;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      color: #1f2430;
      --_accent: var(--edn-accent, #2563eb);
      --_border: #e2e5ea;
    }

    .tabs {
      display: flex;
      gap: 0.25rem;
      border-bottom: 1px solid var(--_border);
      max-width: 30rem;
    }

    [role='tab'] {
      font: inherit;
      font-size: 0.85rem;
      padding: 0.45rem 0.8rem;
      border: 0;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: var(--edn-muted, #6b7280);
      cursor: pointer;
      margin-bottom: -1px;
    }

    [role='tab'][aria-selected='true'] {
      color: var(--_accent);
      border-bottom-color: var(--_accent);
      font-weight: 600;
    }

    .panel {
      margin-top: 1rem;
    }
  `,ie);typeof customElements<"u"&&!customElements.get("edn-network-page")&&customElements.define("edn-network-page",ln);var cr="Network request failed. Check the device connection and try again.",dn={};function cn(t){if(t&&typeof t=="object"&&"message"in t){let e=t.message;if(typeof e=="string"&&e.length>0)return e}}function hn(t,e){return e?.aborted===!0||typeof t=="object"&&!!t&&t.name==="AbortError"}function hr(t,e){return hn(t,e)?{ok:!1,message:"Request aborted."}:{ok:!1,message:cr}}async function ur(t,e){let s=e;try{let r=await t.text();if(r.length>0)try{s=cn(JSON.parse(r))??s}catch{}}catch{}return{ok:!1,status:t.status,message:s}}async function fs(t,e,s,r,i,n){let a;try{a=await fetch(t,{headers:{Accept:e,...i},signal:n})}catch(d){return hr(d,n)}if(!a.ok)return ur(a,a.status===404?r:`Request failed with HTTP ${a.status}.`);let l;try{l=new Uint8Array(await a.arrayBuffer())}catch{return{ok:!1,status:a.status,message:cr}}return l.byteLength===0?{ok:!1,status:a.status,message:s}:{ok:!0,data:l}}async function ms(t,e,s,r,i){if(e.byteLength===0)return{ok:!1,message:s};let n=new ArrayBuffer(e.byteLength);new Uint8Array(n).set(e);let a;try{a=await fetch(t,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/octet-stream",...r},body:n,signal:i})}catch(l){return hr(l,i)}return a.ok?(await a.text().catch(()=>""),{ok:!0,data:dn}):ur(a,`Upload failed with HTTP ${a.status}.`)}function un(t={}){let e=t.baseUrl??"",s=t.backupPath??"/api/config/backup",r=t.configPath??"/api/config",i=t.headers??{},n=`${e}${s}`,a=`${e}${r}`;return{downloadBackup(l){return fs(n,"application/zip","Device returned an empty archive.","The device has no config files yet.",i,l)},downloadConfig(l){return fs(a,"application/octet-stream","Device returned an empty config file.","The device has no saved config yet (no config file on flash).",i,l)},uploadBackup(l,d){return ms(n,l,"Cannot upload an empty archive.",i,d)},uploadConfig(l,d){return ms(a,l,"Cannot upload an empty config file.",i,d)}}}var We=globalThis,Nt=We.ShadowRoot&&(We.ShadyCSS===void 0||We.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ut=Symbol(),_s=new WeakMap,pr=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Ut)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Nt&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=_s.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&_s.set(e,t))}return t}toString(){return this.cssText}},pn=t=>new pr(typeof t=="string"?t:t+"",void 0,Ut),fn=(t,...e)=>new pr(t.length===1?t[0]:e.reduce((s,r,i)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[i+1],t[0]),t,Ut),mn=(t,e)=>{if(Nt)t.adoptedStyleSheets=e.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(let s of e){let r=document.createElement("style"),i=We.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=s.cssText,t.appendChild(r)}},gs=Nt?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let s="";for(let r of e.cssRules)s+=r.cssText;return pn(s)})(t):t,{is:_n,defineProperty:gn,getOwnPropertyDescriptor:bn,getOwnPropertyNames:vn,getOwnPropertySymbols:$n,getPrototypeOf:yn}=Object,st=globalThis,bs=st.trustedTypes,wn=bs?bs.emptyScript:"",Sn=st.reactiveElementPolyfillSupport,Ae=(t,e)=>t,gt={toAttribute(t,e){switch(e){case Boolean:t=t?wn:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=t!==null;break;case Number:s=t===null?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch{s=null}}return s}},fr=(t,e)=>!_n(t,e),vs={attribute:!0,type:String,converter:gt,reflect:!1,useDefault:!1,hasChanged:fr};Symbol.metadata??=Symbol("metadata"),st.litPropertyMetadata??=new WeakMap;var ue=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=vs){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&gn(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:i}=bn(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let a=r?.call(this);i?.call(this,n),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??vs}static _$Ei(){if(this.hasOwnProperty(Ae("elementProperties")))return;let t=yn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ae("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ae("properties"))){let e=this.properties,s=[...vn(e),...$n(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(gs(r))}else t!==void 0&&e.push(gs(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return mn(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let i=(s.converter?.toAttribute===void 0?gt:s.converter).toAttribute(e,s.type);this._$Em=t,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let i=s.getPropertyOptions(r),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute===void 0?gt:i.converter;this._$Em=r;let a=n.fromAttribute(e,i.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(t,e,s,r=!1,i){if(t!==void 0){let n=this.constructor;if(r===!1&&(i=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??fr)(i,e)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:i},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),i!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,i]of s){let{wrapped:n}=i,a=this[r];n!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};ue.elementStyles=[],ue.shadowRootOptions={mode:"open"},ue[Ae("elementProperties")]=new Map,ue[Ae("finalized")]=new Map,Sn?.({ReactiveElement:ue}),(st.reactiveElementVersions??=[]).push("2.1.2");var Rt=globalThis,$s=t=>t,Ye=Rt.trustedTypes,ys=Ye?Ye.createPolicy("lit-html",{createHTML:t=>t}):void 0,mr="$lit$",K=`lit$${Math.random().toFixed(9).slice(2)}$`,_r="?"+K,An=`<${_r}>`,le=document,Me=()=>le.createComment(""),Te=t=>t===null||typeof t!="object"&&typeof t!="function",It=Array.isArray,kn=t=>It(t)||typeof t?.[Symbol.iterator]=="function",ct=`[ 	
\f\r]`,ye=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ws=/-->/g,Ss=/>/g,Z=RegExp(`>|${ct}(?:([^\\s"'>=/]+)(${ct}*=${ct}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),As=/'/g,ks=/"/g,gr=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),_e=Symbol.for("lit-noChange"),C=Symbol.for("lit-nothing"),Ps=new WeakMap,ee=le.createTreeWalker(le,129);function br(t,e){if(!It(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return ys===void 0?e:ys.createHTML(e)}var Pn=(t,e)=>{let s=t.length-1,r=[],i,n=e===2?"<svg>":e===3?"<math>":"",a=ye;for(let l=0;l<s;l++){let d=t[l],h,u,p=-1,c=0;for(;c<d.length&&(a.lastIndex=c,u=a.exec(d),u!==null);)c=a.lastIndex,a===ye?u[1]==="!--"?a=ws:u[1]===void 0?u[2]===void 0?u[3]!==void 0&&(a=Z):(gr.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=Z):a=Ss:a===Z?u[0]===">"?(a=i??ye,p=-1):u[1]===void 0?p=-2:(p=a.lastIndex-u[2].length,h=u[1],a=u[3]===void 0?Z:u[3]==='"'?ks:As):a===ks||a===As?a=Z:a===ws||a===Ss?a=ye:(a=Z,i=void 0);let f=a===Z&&t[l+1].startsWith("/>")?" ":"";n+=a===ye?d+An:p>=0?(r.push(h),d.slice(0,p)+mr+d.slice(p)+K+f):d+K+(p===-2?l:f)}return[br(t,n+(t[s]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},bt=class vr{constructor({strings:e,_$litType$:s},r){let i;this.parts=[];let n=0,a=0,l=e.length-1,d=this.parts,[h,u]=Pn(e,s);if(this.el=vr.createElement(h,r),ee.currentNode=this.el.content,s===2||s===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=ee.nextNode())!==null&&d.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(mr)){let c=u[a++],f=i.getAttribute(p).split(K),b=/([.?@])?(.*)/.exec(c);d.push({type:1,index:n,name:b[2],strings:f,ctor:b[1]==="."?En:b[1]==="?"?Cn:b[1]==="@"?Mn:rt}),i.removeAttribute(p)}else p.startsWith(K)&&(d.push({type:6,index:n}),i.removeAttribute(p));if(gr.test(i.tagName)){let p=i.textContent.split(K),c=p.length-1;if(c>0){i.textContent=Ye?Ye.emptyScript:"";for(let f=0;f<c;f++)i.append(p[f],Me()),ee.nextNode(),d.push({type:2,index:++n});i.append(p[c],Me())}}}else if(i.nodeType===8)if(i.data===_r)d.push({type:2,index:n});else{let p=-1;for(;(p=i.data.indexOf(K,p+1))!==-1;)d.push({type:7,index:n}),p+=K.length-1}n++}}static createElement(e,s){let r=le.createElement("template");return r.innerHTML=e,r}};function ge(t,e,s=t,r){if(e===_e)return e;let i=r===void 0?s._$Cl:s._$Co?.[r],n=Te(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(t),i._$AT(t,s,r)),r===void 0?s._$Cl=i:(s._$Co??=[])[r]=i),i!==void 0&&(e=ge(t,i._$AS(t,e.values),i,r)),e}var xn=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??le).importNode(e,!0);ee.currentNode=r;let i=ee.nextNode(),n=0,a=0,l=s[0];for(;l!==void 0;){if(n===l.index){let d;l.type===2?d=new Ht(i,i.nextSibling,this,t):l.type===1?d=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(d=new Tn(i,this,t)),this._$AV.push(d),l=s[++a]}n!==l?.index&&(i=ee.nextNode(),n++)}return ee.currentNode=le,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings===void 0?s._$AI(t[e]):(s._$AI(t,s,e),e+=s.strings.length-2)),e++}},Ht=class $r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,s,r,i){this.type=2,this._$AH=C,this._$AN=void 0,this._$AA=e,this._$AB=s,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,s=this._$AM;return s!==void 0&&e?.nodeType===11&&(e=s.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,s=this){e=ge(this,e,s),Te(e)?e===C||e==null||e===""?(this._$AH!==C&&this._$AR(),this._$AH=C):e!==this._$AH&&e!==_e&&this._(e):e._$litType$===void 0?e.nodeType===void 0?kn(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==C&&Te(this._$AH)?this._$AA.nextSibling.data=e:this.T(le.createTextNode(e)),this._$AH=e}$(e){let{values:s,_$litType$:r}=e,i=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=bt.createElement(br(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(s);else{let n=new xn(i,this),a=n.u(this.options);n.p(s),this.T(a),this._$AH=n}}_$AC(e){let s=Ps.get(e.strings);return s===void 0&&Ps.set(e.strings,s=new bt(e)),s}k(e){It(this._$AH)||(this._$AH=[],this._$AR());let s=this._$AH,r,i=0;for(let n of e)i===s.length?s.push(r=new $r(this.O(Me()),this.O(Me()),this,this.options)):r=s[i],r._$AI(n),i++;i<s.length&&(this._$AR(r&&r._$AB.nextSibling,i),s.length=i)}_$AR(e=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);e!==this._$AB;){let r=$s(e).nextSibling;$s(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},rt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,i){this.type=1,this._$AH=C,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=C}_$AI(t,e=this,s,r){let i=this.strings,n=!1;if(i===void 0)t=ge(this,t,e,0),n=!Te(t)||t!==this._$AH&&t!==_e,n&&(this._$AH=t);else{let a=t,l,d;for(t=i[0],l=0;l<i.length-1;l++)d=ge(this,a[s+l],e,l),d===_e&&(d=this._$AH[l]),n||=!Te(d)||d!==this._$AH[l],d===C?t=C:t!==C&&(t+=(d??"")+i[l+1]),this._$AH[l]=d}n&&!r&&this.j(t)}j(t){t===C?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},En=class extends rt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===C?void 0:t}},Cn=class extends rt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==C)}},Mn=class extends rt{constructor(t,e,s,r,i){super(t,e,s,r,i),this.type=5}_$AI(t,e=this){if((t=ge(this,t,e,0)??C)===_e)return;let s=this._$AH,r=t===C&&s!==C||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==C&&(s===C||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Tn=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ge(this,t)}},Dn=Rt.litHtmlPolyfillSupport;Dn?.(bt,Ht),(Rt.litHtmlVersions??=[]).push("3.3.3");var Nn=(t,e,s)=>{let r=s?.renderBefore??e,i=r._$litPart$;if(i===void 0){let n=s?.renderBefore??null;r._$litPart$=i=new Ht(e.insertBefore(Me(),n),n,void 0,s??{})}return i._$AI(t),i},Ot=globalThis,ke=class extends ue{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Nn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return _e}};ke._$litElement$=!0,ke.finalized=!0,Ot.litElementHydrateSupport?.({LitElement:ke});var Un=Ot.litElementPolyfillSupport;Un?.({LitElement:ke}),(Ot.litElementVersions??=[]).push("4.2.2");var xs=2e3,Rn=12e4,Es="Unsupported file type. Choose a .zip full backup or a .bin config file.";function ht(t){let e=t.toLowerCase();return e.endsWith(".zip")?"archive":e.endsWith(".bin")?"config":null}function In(t,e){if(typeof URL.createObjectURL!="function")return;let s=new ArrayBuffer(t.byteLength);new Uint8Array(s).set(t);let r=new Blob([s],{type:"application/octet-stream"}),i=URL.createObjectURL(r),n=document.createElement("a");n.href=i,n.download=e,document.body.appendChild(n),n.click(),n.remove(),window.setTimeout(()=>URL.revokeObjectURL(i),0)}var ne,Hn=(ne=class extends ke{constructor(...e){super(...e),this.baseUrl="",this.backupPath="/api/config/backup",this.configPath="/api/config",this.healthPath="/healthcheck/healty",this.deviceName="device",this.archiveFileName="config-backup.zip",this.binFileName="config.bin",this.maxUploadBytes=16384,this.zipNotes="",this.binNotes="",this.zipConfirmText="",this.binConfirmText="",this.downloading=!1,this.downloadNotice=null,this.selectedFile=null,this.fileError=null,this.uploading=!1,this.uploadError=null,this.phase="idle",this._attempts=0}disconnectedCallback(){this.clearPollTimer(),super.disconnectedCallback()}get busy(){return this.uploading||this.phase!=="idle"}get effectiveZipNotes(){return this.zipNotes||`Download a zip of everything stored on the ${this.deviceName}: ${this.binFileName} plus the device's persisted state files. Restoring this archive overwrites the stored config and state files. It contains Wi-Fi and MQTT credentials in plaintext, so keep it somewhere safe.`}get effectiveBinNotes(){return this.binNotes||`Download only ${this.binFileName}, the raw stored config. Restoring it replaces just that file. It contains Wi-Fi and MQTT credentials in plaintext, so keep it somewhere safe.`}get effectiveZipConfirmText(){return this.zipConfirmText||`Uploading this archive REPLACES ${this.binFileName} and the device's stored state files on the ${this.deviceName} AND REBOOTS IT. Validation is all-or-nothing: a rejected archive changes nothing. Continue?`}get effectiveBinConfirmText(){return this.binConfirmText||`Uploading REPLACES ${this.binFileName} on the ${this.deviceName} AND REBOOTS IT IMMEDIATELY. The device will be offline 20-60 seconds. Continue?`}render(){return B`
      <div class="stack">
        <section class="card" aria-labelledby="edc-download-heading">
          <h2 id="edc-download-heading">Download backup</h2>
          ${this.renderNotice(this.downloadNotice)}
          <div class="download-row">
            <div class="download-copy">
              <strong>Full backup (.zip)</strong>
              <p class="muted">${this.effectiveZipNotes}</p>
            </div>
            <button
              type="button"
              class="primary"
              data-action="download-backup"
              ?disabled=${this.downloading||this.phase!=="idle"}
              @click=${()=>{this.handleDownload("archive")}}
            >
              ${this.downloading?"Downloading…":"Download full backup (.zip)"}
            </button>
          </div>
          <div class="download-row">
            <div class="download-copy">
              <strong>${this.binFileName} only</strong>
              <p class="muted">${this.effectiveBinNotes}</p>
            </div>
            <button
              type="button"
              data-action="download-config"
              ?disabled=${this.downloading||this.phase!=="idle"}
              @click=${()=>{this.handleDownload("config")}}
            >
              Download ${this.binFileName} only
            </button>
          </div>
        </section>

        <section class="card" aria-labelledby="edc-restore-heading">
          <h2 id="edc-restore-heading">Restore from file</h2>
          <p class="muted">
            Restore a previously downloaded .zip full backup, or a single .bin
            config file. The device validates size, version and CRC and, for a
            full archive, commits all members atomically before rebooting. A
            rejected file changes nothing.
          </p>
          <label class="field" for="edc-restore-file">
            <span class="field-label">Backup file</span>
            <input
              id="edc-restore-file"
              type="file"
              accept=".zip,.bin,application/octet-stream"
              ?disabled=${this.busy}
              @change=${e=>this.handleFileChange(e)}
            />
            ${this.fileError?B`<span class="field-error" role="alert">${this.fileError}</span>`:C}
          </label>
          ${this.selectedFile&&!this.fileError?B`<p class="muted">
                Selected: ${this.selectedFile.name} (${this.selectedFile.size}
                bytes)${ht(this.selectedFile.name)==="archive"?" — full backup (all files)":` — ${this.binFileName} only`}
              </p>`:C}
          ${this.uploadError?B`<div class="banner banner-error" role="alert">
                ${this.uploadError}
              </div>`:C}
          <div class="form-actions">
            <button
              type="button"
              class="danger"
              data-action="upload"
              ?disabled=${!this.selectedFile||!!this.fileError||this.busy}
              @click=${()=>{this.handleUpload()}}
            >
              ${this.uploading?"Uploading…":"Upload & reboot device"}
            </button>
          </div>
        </section>
      </div>
      ${this.renderRebootOverlay()}
    `}renderNotice(e){return e?B`<div
      class="banner banner-${e.kind}"
      role=${e.kind==="error"?"alert":"status"}
    >
      ${e.message}
    </div>`:C}renderRebootOverlay(){return this.phase==="idle"?C:B`
      <div
        class="reboot-overlay"
        role="alertdialog"
        aria-modal="true"
        aria-label="Device rebooting"
      >
        <div class="reboot-dialog">
          <h2>Device is rebooting</h2>
          ${this.phase==="rebooting"?B`
                <p>
                  Waiting for the ${this.deviceName} to come back online. This
                  usually takes 20–60 seconds.
                </p>
                <p class="muted" aria-live="polite">
                  Polling device health…
                </p>
                <div class="spinner" aria-hidden="true"></div>
              `:C}
          ${this.phase==="ready"?B`
                <div class="banner banner-success" role="status">
                  The ${this.deviceName} is back online.
                </div>
                <div class="form-actions">
                  <button type="button" @click=${()=>this.dismissReboot()}>
                    Dismiss
                  </button>
                </div>
              `:C}
          ${this.phase==="timeout"?B`
                <div class="banner banner-error" role="alert">
                  No response after about two minutes. Check the power and
                  network, then keep waiting or dismiss.
                </div>
                <div class="form-actions">
                  <button type="button" @click=${()=>this.retryReboot()}>
                    Keep waiting
                  </button>
                  <button type="button" @click=${()=>this.dismissReboot()}>
                    Dismiss
                  </button>
                </div>
              `:C}
        </div>
      </div>
    `}createClient(){return un({baseUrl:this.baseUrl,backupPath:this.backupPath,configPath:this.configPath})}async handleDownload(e){if(!(this.downloading||this.phase!=="idle")){this.downloading=!0,this.downloadNotice=null;try{let s=this.createClient(),r=e==="archive"?await s.downloadBackup():await s.downloadConfig();if(!r.ok){this.downloadNotice={kind:"error",message:r.message};return}let i=e==="archive"?this.archiveFileName:this.binFileName;In(r.data,i),this.downloadNotice={kind:"info",message:e==="archive"?`Full backup downloaded as ${i}.`:`Config downloaded as ${i}.`}}finally{this.downloading=!1}}}handleFileChange(e){let s=e.currentTarget,r=s.files&&s.files[0]?s.files[0]:null;this.selectedFile=r,this.uploadError=null,this.fileError=r?r.size===0?"The selected file is empty.":r.size>this.maxUploadBytes?`This does not look like a ${this.deviceName} backup file (max ${this.maxUploadBytes} bytes).`:ht(r.name)?null:Es:null}async handleUpload(){if(!this.selectedFile||this.fileError||this.busy)return;let e=ht(this.selectedFile.name);if(!e)this.uploadError=Es;else if(window.confirm(e==="archive"?this.effectiveZipConfirmText:this.effectiveBinConfirmText)){this.uploading=!0,this.uploadError=null;try{let s;try{s=new Uint8Array(await this.selectedFile.arrayBuffer())}catch{this.uploadError="Could not read the selected backup file.";return}let r=this.createClient(),i=e==="archive"?await r.uploadBackup(s):await r.uploadConfig(s);if(!i.ok){this.uploadError=i.message;return}if(this.clearSelection(),!this.isConnected)return;this.dispatchEvent(new CustomEvent("edc-restore-committed",{detail:{kind:e},bubbles:!0,composed:!0})),this.startReboot()}finally{this.uploading=!1}}}clearSelection(){this.selectedFile=null,this.fileError=null;let e=this.renderRoot.querySelector("#edc-restore-file");e&&(e.value="")}startReboot(){this._attempts=0,this.phase="rebooting",this.schedulePoll()}retryReboot(){this._attempts=0,this.phase="rebooting",this.schedulePoll()}dismissReboot(){this.clearPollTimer(),this.phase="idle"}schedulePoll(){this.clearPollTimer(),this._pollTimer=window.setTimeout(()=>{this._pollTimer=void 0,this.pollHealth()},xs)}clearPollTimer(){this._pollTimer!==void 0&&(window.clearTimeout(this._pollTimer),this._pollTimer=void 0)}async pollHealth(){if(this.phase!=="rebooting")return;let e=!1;try{let s=await fetch(`${this.baseUrl}${this.healthPath}`,{headers:{Accept:"application/json"}});if(s.ok){let r=await s.json();e=!!r&&typeof r=="object"&&r.healty===!0}}catch{e=!1}this.isConnected&&this.phase==="rebooting"&&(e?this.phase="ready":(this._attempts+=1,this._attempts*xs>=Rn?this.phase="timeout":this.schedulePoll()))}},ne.properties={baseUrl:{type:String,attribute:"base-url"},backupPath:{type:String,attribute:"backup-path"},configPath:{type:String,attribute:"config-path"},healthPath:{type:String,attribute:"health-path"},deviceName:{type:String,attribute:"device-name"},archiveFileName:{type:String,attribute:"archive-file-name"},binFileName:{type:String,attribute:"bin-file-name"},maxUploadBytes:{type:Number,attribute:"max-upload-bytes"},zipNotes:{type:String,attribute:"zip-notes"},binNotes:{type:String,attribute:"bin-notes"},zipConfirmText:{type:String,attribute:"zip-confirm-text"},binConfirmText:{type:String,attribute:"bin-confirm-text"},downloading:{state:!0},downloadNotice:{state:!0},selectedFile:{state:!0},fileError:{state:!0},uploading:{state:!0},uploadError:{state:!0},phase:{state:!0}},ne.styles=fn`
    :host {
      display: block;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      color: #1f2430;
      --_accent: var(--edc-accent, #2563eb);
      --_danger: var(--edc-danger, #dc2626);
      --_muted: var(--edc-muted, #6b7280);
      --_border: #e2e5ea;
      --_surface: #ffffff;
    }

    .stack {
      display: grid;
      gap: 1rem;
      max-width: 34rem;
    }

    .card {
      background: var(--_surface);
      border: 1px solid var(--_border);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    }

    h2 {
      font-size: 1rem;
      margin: 0 0 0.5rem;
    }

    p {
      margin: 0 0 0.75rem;
      font-size: 0.875rem;
      line-height: 1.45;
    }

    .muted {
      color: var(--_muted);
    }

    .form-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .download-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 0;
      border-top: 1px solid var(--_border);
    }

    .download-row:first-of-type {
      border-top: 0;
      padding-top: 0;
    }

    .download-row:last-of-type {
      padding-bottom: 0;
    }

    .download-copy {
      min-width: 0;
    }

    .download-copy p {
      margin-bottom: 0;
    }

    .download-copy strong {
      display: block;
      font-size: 0.85rem;
      margin-bottom: 0.2rem;
    }

    button {
      font: inherit;
      font-size: 0.85rem;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      border: 1px solid var(--_border);
      background: var(--_surface);
      color: inherit;
      cursor: pointer;
    }

    button:hover:not(:disabled) {
      border-color: var(--_accent);
    }

    button.primary {
      background: var(--_accent);
      border-color: var(--_accent);
      color: #ffffff;
    }

    button.danger {
      background: var(--_danger);
      border-color: var(--_danger);
      color: #ffffff;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    .field {
      display: grid;
      gap: 0.35rem;
      margin-bottom: 0.75rem;
    }

    .field-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--_muted);
    }

    input[type='file'] {
      font: inherit;
      font-size: 0.85rem;
      max-width: 100%;
    }

    .field-error {
      color: var(--_danger);
      font-size: 0.8rem;
    }

    .banner {
      margin: 0 0 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
    }

    .banner-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: var(--_danger);
    }

    .banner-info {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
    }

    .banner-success {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #15803d;
    }

    .reboot-overlay {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: rgba(15, 23, 42, 0.55);
    }

    .reboot-dialog {
      width: min(26rem, 100%);
      background: var(--_surface);
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.35);
    }

    .spinner {
      width: 1.5rem;
      height: 1.5rem;
      border: 3px solid var(--_border);
      border-top-color: var(--_accent);
      border-radius: 50%;
      animation: edc-spin 0.9s linear infinite;
    }

    @keyframes edc-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation: none;
      }
    }
  `,ne);typeof customElements<"u"&&!customElements.get("edc-config-backup-page")&&customElements.define("edc-config-backup-page",Hn);const Cs=document.getElementById("app");Cs&&Dr(o(Ci,{}),Cs);
