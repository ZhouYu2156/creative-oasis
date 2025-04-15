import{aH as me,b as ge,bx as I,bH as H,bI as Q,_ as ye,a as j,c as z,u as be,i as d,g as L,bJ as we,A as K,o as V,m as i,r as G,f as q,e as R,n as xe,t as D,p as P,at as he,aC as te,w as _e,bK as ke,z as Z,j as e,bb as Ce,H as Ve,b1 as se,bL as $e,b7 as C,k as o,L as Ue,M as Ee,J as Le,ba as Re,E as ae,aL as X,b5 as oe,am as le,bM as re,be as ne,I as Be,bN as Y,bO as Fe,bP as Ie}from"./index-efaOxweq.js";import{E as ie}from"./checkbox-BcjAqEoa.js";/* empty css                */import{E as pe}from"./index-BA4IKA9J.js";import"./event-BB_Ol6Sd.js";import"./isEqual-8qcgBqaK.js";const Pe=ge({trigger:Q.trigger,placement:H.placement,disabled:Q.disabled,visible:I.visible,transition:I.transition,popperOptions:H.popperOptions,tabindex:H.tabindex,content:I.content,popperStyle:I.popperStyle,popperClass:I.popperClass,enterable:{...I.enterable,default:!0},effect:{...I.effect,default:"light"},teleported:I.teleported,title:String,width:{type:[String,Number],default:150},offset:{type:Number,default:void 0},showAfter:{type:Number,default:0},hideAfter:{type:Number,default:200},autoClose:{type:Number,default:0},showArrow:{type:Boolean,default:!0},persistent:{type:Boolean,default:!0},"onUpdate:visible":{type:Function}}),Te={"update:visible":g=>me(g),"before-enter":()=>!0,"before-leave":()=>!0,"after-enter":()=>!0,"after-leave":()=>!0},Me="onUpdate:visible",Se=j({name:"ElPopover"}),Ae=j({...Se,props:Pe,emits:Te,setup(g,{expose:n,emit:c}){const v=g,x=z(()=>v[Me]),h=be("popover"),f=d(),p=z(()=>{var a;return(a=L(f))==null?void 0:a.popperRef}),m=z(()=>[{width:we(v.width)},v.popperStyle]),r=z(()=>[h.b(),v.popperClass,{[h.m("plain")]:!!v.content}]),b=z(()=>v.transition===`${h.namespace.value}-fade-in-linear`),$=()=>{var a;(a=f.value)==null||a.hide()},_=()=>{c("before-enter")},E=()=>{c("before-leave")},S=()=>{c("after-enter")},T=()=>{c("update:visible",!1),c("after-leave")};return n({popperRef:p,hide:$}),(a,M)=>(V(),K(L(te),he({ref_key:"tooltipRef",ref:f},a.$attrs,{trigger:a.trigger,placement:a.placement,disabled:a.disabled,visible:a.visible,transition:a.transition,"popper-options":a.popperOptions,tabindex:a.tabindex,content:a.content,offset:a.offset,"show-after":a.showAfter,"hide-after":a.hideAfter,"auto-close":a.autoClose,"show-arrow":a.showArrow,"aria-label":a.title,effect:a.effect,enterable:a.enterable,"popper-class":L(r),"popper-style":L(m),teleported:a.teleported,persistent:a.persistent,"gpu-acceleration":L(b),"onUpdate:visible":L(x),onBeforeShow:_,onBeforeHide:E,onShow:S,onHide:T}),{content:i(()=>[a.title?(V(),R("div",{key:0,class:xe(L(h).e("title")),role:"title"},D(a.title),3)):q("v-if",!0),G(a.$slots,"default",{},()=>[P(D(a.content),1)])]),default:i(()=>[a.$slots.reference?G(a.$slots,"reference",{key:0}):q("v-if",!0)]),_:3},16,["trigger","placement","disabled","visible","transition","popper-options","tabindex","content","offset","show-after","hide-after","auto-close","show-arrow","aria-label","effect","enterable","popper-class","popper-style","teleported","persistent","gpu-acceleration","onUpdate:visible"]))}});var Ne=ye(Ae,[["__file","popover.vue"]]);const ee=(g,n)=>{const c=n.arg||n.value,v=c==null?void 0:c.popperRef;v&&(v.triggerRef=g)};var ze={mounted(g,n){ee(g,n)},updated(g,n){ee(g,n)}};const De="popover",je=ke(ze,De),ue=_e(Ne,{directive:je}),Ze={},qe={t:"1738917241167",class:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"4311",width:"28",height:"28"};function Oe(g,n){return V(),R("svg",qe,n[0]||(n[0]=[e("path",{d:"M512 12.63616c-282.74688 0-512 229.21216-512 512 0 226.22208 146.69824 418.14016 350.12608 485.82656 25.57952 4.73088 35.00032-11.10016 35.00032-24.63744 0-12.20608-0.47104-52.55168-0.69632-95.31392-142.4384 30.96576-172.50304-60.416-172.50304-60.416-23.28576-59.16672-56.85248-74.91584-56.85248-74.91584-46.44864-31.78496 3.50208-31.1296 3.50208-31.1296 51.4048 3.60448 78.47936 52.75648 78.47936 52.75648 45.6704 78.27456 119.76704 55.64416 149.01248 42.55744 4.58752-33.09568 17.85856-55.68512 32.50176-68.46464-113.72544-12.94336-233.2672-56.85248-233.2672-253.0304 0-55.88992 20.00896-101.5808 52.75648-137.4208-5.3248-12.9024-22.85568-64.96256 4.95616-135.49568 0 0 43.008-13.74208 140.84096 52.49024 40.83712-11.34592 84.64384-17.03936 128.16384-17.24416 43.49952 0.2048 87.32672 5.87776 128.24576 17.24416 97.73056-66.2528 140.65664-52.49024 140.65664-52.49024 27.87328 70.53312 10.3424 122.59328 5.03808 135.49568 32.82944 35.86048 52.69504 81.53088 52.69504 137.4208 0 196.64896-119.78752 239.94368-233.79968 252.6208 18.37056 15.89248 34.73408 47.04256 34.73408 94.80192 0 68.5056-0.59392 123.63776-0.59392 140.51328 0 13.6192 9.216 29.5936 35.16416 24.576 203.32544-67.76832 349.83936-259.62496 349.83936-485.76512 0-282.78784-229.23264-512-512-512z",fill:"#444444","p-id":"4312"},null,-1)]))}const He=Z(Ze,[["render",Oe]]),Ke={},We={t:"1738931374696",class:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"3909",width:"28",height:"28"};function Je(g,n){return V(),R("svg",We,n[0]||(n[0]=[e("path",{d:"M169.072 653.088C85.712 599.248 32 514.944 32 420.608 32 259.008 189.6 128 384 128s352 131.008 352 292.608-157.6 293.776-352 293.776c-43.936 0-85.984-6.752-124.768-19.056-8.928 2.848-17.712 7.68-22.336 9.92-5.744 2.72-61.632 32.576-80.608 43.056-18.96 10.496-13.536-4.4-12.272-7.216 1.28-2.832 21.168-64.384 23.024-70.16 1.392-4.352 2.192-10.944 2.032-17.84z",fill:"#82DB46","p-id":"3910"},null,-1),e("path",{d:"M832.272 860.768a353.552 353.552 0 0 1-120.896 20.96C548.24 881.728 416 773.888 416 640.864S548.24 400 711.36 400C874.528 400 1008 507.84 1008 640.864c0 72.544-39.696 137.6-102.256 181.76 8.32 21.92 26.576 70.16 29.76 80.256 4.16 13.168-4.88 8.736-7.968 6.928-2.8-1.632-80.384-41.408-95.264-49.04z",fill:"#F5F5F5","p-id":"3911"},null,-1),e("path",{d:"M256 320m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z",fill:"#106F1F","p-id":"3912"},null,-1),e("path",{d:"M512 320m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z",fill:"#106F1F","p-id":"3913"},null,-1),e("path",{d:"M600 568m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z",fill:"#7B7F7F","p-id":"3914"},null,-1),e("path",{d:"M808 568m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z",fill:"#7B7F7F","p-id":"3915"},null,-1)]))}const Qe=Z(Ke,[["render",Je]]),Ge={key:0,class:"login-wrapper fixed inset-0 bg-black/5 dark:bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center"},Xe={class:"p-8 flex flex-col space-y-6"},Ye={class:"space-y-2"},et={class:"space-y-2"},tt={class:"space-y-2"},st={class:"flex space-x-4"},at={class:"flex-1 flex gap-2"},ot=["onUpdate:modelValue","onInput","onKeydown"],lt=["src"],rt={key:1,class:"w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"},nt={class:"flex items-center justify-between"},it={class:"flex items-center space-x-2"},pt={class:"text-sm text-gray-500"},ut={class:"flex items-center space-x-2"},dt={class:"flex items-center space-x-2"},ct={class:"flex justify-center space-x-6"},vt={class:"p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-100 dark:opacity-80 cursor-not-allowed",disabled:""},ft={class:"p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-60 dark:opacity-90 cursor-not-allowed",disabled:""},mt=j({__name:"Login",props:{visible:{type:Boolean}},emits:["update:visible","switch-to-register"],setup(g,{emit:n}){const c=g,v=n,x=ne(),h=re(),f=Ce(),p=d(""),m=d(""),r=d(["","","",""]),b=d([]),$=d(""),_=d(!1),E=d(!1),S=()=>{p.value="",m.value="",r.value=["","","",""],_.value=!1,E.value=!1,M()},T=async()=>{if(!p.value){C.warning("请输入账号");return}if(!m.value){C.warning("请输入密码");return}if(!r.value.every(l=>l)){C.warning("请输入验证码");return}if(!_.value){C.warning("请同意服务条款和隐私政策");return}E.value=!0;try{if((await f.login({email:p.value,password:m.value,captcha:r.value.join("")})).code===200){v("update:visible",!1);const t=h.query.redirect||"/dashboard";x.push(t)}}catch{B(),M()}finally{E.value=!1}},a=()=>{v("switch-to-register"),S()},M=async()=>{try{const l=await $e();l.code===200&&($.value=l.data.captcha_image)}catch{C.error("获取验证码失败")}},O=(l,t)=>{var u;const w=t.target,y=w.value;if(!/^[a-zA-Z0-9]*$/.test(y)){r.value[l]="";return}y.length>1?(r.value[l]=y[0].toUpperCase(),w.value=y[0].toUpperCase()):y.length===1&&(r.value[l]=y.toUpperCase(),w.value=y.toUpperCase()),y&&l<3&&((u=b.value[l+1])==null||u.focus()),r.value.every(N=>N)&&p.value&&m.value&&T()},k=(l,t)=>{var w;t.key==="Backspace"&&(r.value[l]?r.value[l]="":l>0&&(r.value[l-1]="",(w=b.value[l-1])==null||w.focus()))},s=l=>{var y;l.preventDefault();const t=(y=l.clipboardData)==null?void 0:y.getData("text");if(!t)return;const w=t.match(/[a-zA-Z0-9]/g);w&&(w.slice(0,4).forEach((u,N)=>{r.value[N]=u.toUpperCase()}),r.value.every(u=>u)&&p.value&&m.value&&T())},B=()=>{var l;r.value=["","","",""],(l=b.value[0])==null||l.focus()};return Ve(()=>{M()}),(l,t)=>{const w=pe,y=X("Loading"),u=ae,N=te,de=ie,W=X("WarningFilled"),J=ue,ce=oe,ve=Qe,fe=He;return V(),K(se,{"enter-active-class":"transition ease-out duration-200","enter-from-class":"opacity-0","enter-to-class":"opacity-100","leave-active-class":"transition ease-in duration-150","leave-from-class":"opacity-100","leave-to-class":"opacity-0"},{default:i(()=>[c.visible?(V(),R("div",Ge,[e("div",{class:"w-[450px] bg-white dark:bg-gray-900 rounded-2xl shadow-xl",onClick:t[4]||(t[4]=le(()=>{},["stop"]))},[t[17]||(t[17]=e("div",{class:"px-8 text-center pt-8"},[e("h2",{class:"text-2xl font-bold text-gray-900 dark:text-gray-100"},"欢迎回来"),e("p",{class:"mt-2 text-sm text-gray-500"},"登录以继续访问")],-1)),e("div",Xe,[e("div",Ye,[t[5]||(t[5]=e("label",{class:"text-sm font-medium text-gray-700 dark:text-gray-300"},"邮箱地址",-1)),o(w,{modelValue:p.value,"onUpdate:modelValue":t[0]||(t[0]=F=>p.value=F),placeholder:"请输入邮箱","prefix-icon":"Message",class:"login-input"},null,8,["modelValue"])]),e("div",et,[t[6]||(t[6]=e("label",{class:"text-sm font-medium text-gray-700 dark:text-gray-300"},"密码",-1)),o(w,{modelValue:m.value,"onUpdate:modelValue":t[1]||(t[1]=F=>m.value=F),type:"password",placeholder:"请输入密码","prefix-icon":"Lock","show-password":"",class:"login-input"},null,8,["modelValue"])]),e("div",tt,[t[7]||(t[7]=e("label",{class:"text-sm font-medium text-gray-700 dark:text-gray-300"},"验证码",-1)),e("div",st,[e("div",at,[(V(),R(Ue,null,Ee(4,(F,A)=>Le(e("input",{key:A,"onUpdate:modelValue":U=>r.value[A]=U,type:"text",maxlength:"1",class:"w-12 h-12 text-center text-xl font-bold bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-all duration-200",ref_for:!0,ref:U=>{U&&(b.value[A]=U)},onInput:U=>O(A,U),onKeydown:U=>k(A,U),onPaste:s,onFocus:t[2]||(t[2]=U=>U.target.select())},null,40,ot),[[Re,r.value[A]]])),64))]),o(N,{content:"点击刷新验证码，可忽略大小写",placement:"top","show-after":500},{default:i(()=>[e("div",{class:"w-[120px] h-[48px] rounded overflow-hidden cursor-pointer",onClick:M},[$.value?(V(),R("img",{key:0,src:$.value,alt:"验证码",class:"w-full h-full object-cover hover:opacity-80 transition-opacity"},null,8,lt)):(V(),R("div",rt,[o(u,{class:"text-gray-400 animate-spin"},{default:i(()=>[o(y)]),_:1})]))])]),_:1})])]),e("div",nt,[e("div",it,[o(de,{modelValue:_.value,"onUpdate:modelValue":t[3]||(t[3]=F=>_.value=F)},null,8,["modelValue"]),e("span",pt,[t[12]||(t[12]=P(" 同意 ")),o(J,{placement:"top-start",width:"auto",trigger:"hover",content:"服务条款文件未上传！"},{reference:i(()=>t[8]||(t[8]=[e("a",{href:"#",class:"text-primary-500 hover:text-primary-600"},"服务条款",-1)])),default:i(()=>[e("div",ut,[o(u,{class:"text-warning-500"},{default:i(()=>[o(W)]),_:1}),t[9]||(t[9]=e("span",null,"服务条款文件未上传！",-1))])]),_:1}),t[13]||(t[13]=P(" 和 ")),o(J,{placement:"top-start",width:"auto",trigger:"hover",content:"隐私政策文件未上传！"},{reference:i(()=>t[10]||(t[10]=[e("a",{href:"#",class:"text-primary-500 hover:text-primary-600"},"隐私政策",-1)])),default:i(()=>[e("div",dt,[o(u,{class:"text-warning-500"},{default:i(()=>[o(W)]),_:1}),t[11]||(t[11]=e("span",null,"隐私政策文件未上传！",-1))])]),_:1})])]),t[14]||(t[14]=e("a",{href:"#",class:"text-sm text-primary-500 hover:text-primary-600"},"忘记密码？",-1))]),o(ce,{type:"primary",loading:E.value,disabled:!p.value||!m.value||!r.value.every(F=>F)||!_.value,class:"w-full !h-11 !text-base",onClick:T},{default:i(()=>[P(D(E.value?"登录中...":"登录"),1)]),_:1},8,["loading","disabled"]),e("div",{class:"text-center"},[t[15]||(t[15]=e("span",{class:"text-sm text-gray-500"},"还没有账号？",-1)),e("button",{class:"text-sm text-primary-500 hover:text-primary-600 ml-1",onClick:a}," 立即注册 ")]),t[16]||(t[16]=e("div",{class:"relative"},[e("div",{class:"absolute inset-0 flex items-center"},[e("div",{class:"w-full border-t border-gray-200 dark:border-gray-700"})]),e("div",{class:"relative flex justify-center text-sm"},[e("span",{class:"px-2 text-gray-400 bg-white dark:bg-gray-900"},"其他登录方式")])],-1)),e("div",ct,[e("button",vt,[o(ve)]),e("button",ft,[o(fe)])])])])])):q("",!0)]),_:1})}}}),gt=Z(mt,[["__scopeId","data-v-72ae755d"]]),yt={key:0,class:"register-wrapper fixed inset-0 bg-black/5 dark:bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center"},bt={class:"p-8 flex flex-col space-y-6"},wt={class:"space-y-2"},xt={class:"space-y-2"},ht={class:"space-y-2"},_t={class:"space-y-2"},kt={class:"flex space-x-4"},Ct={class:"flex items-center space-x-2"},Vt={class:"text-sm text-gray-500"},$t={class:"flex items-center space-x-2"},Ut={class:"flex items-center space-x-2"},Et=30,Lt=j({__name:"Register",props:{visible:{type:Boolean}},emits:["update:visible","switch-to-login"],setup(g,{emit:n}){const c=g,v=n;ne(),re();const x=d(""),h=d(""),f=d(""),p=d(""),m=d(!1),r=d(!1),b=d(0),$=d(),_=d(!1),E=()=>{x.value="",h.value="",f.value="",p.value="",m.value=!1,r.value=!1,b.value=0,clearInterval($.value)},S=k=>{const s=/^[1-9][0-9]{4,}@qq\.com$/;return k.trim()?s.test(k.trim())?{valid:!0,message:""}:{valid:!1,message:"请输入正确的QQ邮箱地址（示例：12345@qq.com）"}:{valid:!1,message:"请输入邮箱地址"}},T=k=>k.trim()?/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/.test(k)?{valid:!0,message:""}:{valid:!1,message:"密码必须包含大小写字母和数字，长度8-20位"}:{valid:!1,message:"请输入密码"},a=async()=>{if(b.value>0||_.value)return;const k=S(x.value);if(!k.valid){C.warning(k.message);return}if(!m.value){C.warning("请先阅读并同意服务条款和隐私政策");return}_.value=!0;try{await Fe(x.value),b.value=Et,$.value=window.setInterval(()=>{b.value--,b.value<=0&&clearInterval($.value)},1e3)}catch{C.error("验证码发送失败，请稍后重试")}finally{_.value=!1}};Be(()=>{$.value&&clearInterval($.value)});const M=async()=>{const k=S(x.value);if(!k.valid){C.warning(k.message);return}const s=T(f.value);if(!s.valid){C.warning(s.message);return}if(f.value!==p.value){C.warning("两次输入的密码不一致");return}if(!h.value){C.warning("请输入验证码");return}if(!m.value){C.warning("请同意服务条款和隐私政策");return}r.value=!0;try{(await Ie({email:x.value,password:f.value,confirm_password:p.value,email_code:h.value})).code===200&&v("switch-to-login")}catch{C.error("注册失败")}finally{r.value=!1}},O=()=>{v("switch-to-login"),E()};return(k,s)=>{const B=pe,l=oe,t=ie,w=ae,y=ue;return V(),K(se,{"enter-active-class":"transition ease-out duration-200","enter-from-class":"opacity-0","enter-to-class":"opacity-100","leave-active-class":"transition ease-in duration-150","leave-from-class":"opacity-100","leave-to-class":"opacity-0"},{default:i(()=>[c.visible?(V(),R("div",yt,[e("div",{class:"w-[450px] bg-white dark:bg-gray-900 rounded-2xl shadow-xl",onClick:s[5]||(s[5]=le(()=>{},["stop"]))},[s[17]||(s[17]=e("div",{class:"pt-8 px-8 text-center"},[e("h2",{class:"text-2xl font-bold text-gray-900 dark:text-gray-100"},"创建账号"),e("p",{class:"mt-2 text-sm text-gray-500"},"注册以获得完整访问权限")],-1)),e("div",bt,[e("div",wt,[s[6]||(s[6]=e("label",{class:"text-sm font-medium text-gray-700 dark:text-gray-300"},"邮箱地址",-1)),o(B,{modelValue:x.value,"onUpdate:modelValue":s[0]||(s[0]=u=>x.value=u),placeholder:"请输入邮箱","prefix-icon":"Message",class:"register-input"},null,8,["modelValue"])]),e("div",xt,[s[7]||(s[7]=e("label",{class:"text-sm font-medium text-gray-700 dark:text-gray-300"},"密码",-1)),o(B,{modelValue:f.value,"onUpdate:modelValue":s[1]||(s[1]=u=>f.value=u),type:"password",placeholder:"请输入密码","prefix-icon":"Lock","show-password":"",class:"register-input"},null,8,["modelValue"])]),e("div",ht,[s[8]||(s[8]=e("label",{class:"text-sm font-medium text-gray-700 dark:text-gray-300"},"确认密码",-1)),o(B,{modelValue:p.value,"onUpdate:modelValue":s[2]||(s[2]=u=>p.value=u),type:"password",placeholder:"请再次输入密码","prefix-icon":"Lock","show-password":"",class:"register-input"},null,8,["modelValue"])]),e("div",_t,[s[9]||(s[9]=e("label",{class:"text-sm font-medium text-gray-700 dark:text-gray-300"},"验证码",-1)),e("div",kt,[o(B,{modelValue:h.value,"onUpdate:modelValue":s[3]||(s[3]=u=>h.value=u),placeholder:"请输入验证码","prefix-icon":"Key",class:"register-input"},null,8,["modelValue"]),o(l,{loading:_.value,disabled:b.value>0||_.value,class:"!w-32 !h-11",onClick:a},{default:i(()=>[P(D(_.value?"发送中...":b.value>0?`${b.value}s后重试`:"获取验证码"),1)]),_:1},8,["loading","disabled"])])]),e("div",Ct,[o(t,{modelValue:m.value,"onUpdate:modelValue":s[4]||(s[4]=u=>m.value=u)},null,8,["modelValue"]),e("span",Vt,[s[14]||(s[14]=P(" 同意 ")),o(y,{placement:"top-start",width:"auto",trigger:"hover",content:"服务条款文件未上传！"},{reference:i(()=>s[10]||(s[10]=[e("a",{href:"#",class:"text-primary-500 hover:text-primary-600"},"服务条款",-1)])),default:i(()=>[e("div",$t,[o(w,{class:"text-warning-500"},{default:i(()=>[o(L(Y))]),_:1}),s[11]||(s[11]=e("span",null,"服务条款文件未上传！",-1))])]),_:1}),s[15]||(s[15]=P(" 和 ")),o(y,{placement:"top-start",width:"auto",trigger:"hover",content:"隐私政策文件未上传！"},{reference:i(()=>s[12]||(s[12]=[e("a",{href:"#",class:"text-primary-500 hover:text-primary-600"},"隐私政策",-1)])),default:i(()=>[e("div",Ut,[o(w,{class:"text-warning-500"},{default:i(()=>[o(L(Y))]),_:1}),s[13]||(s[13]=e("span",null,"隐私政策文件未上传！",-1))])]),_:1})])]),o(l,{type:"primary",loading:r.value,disabled:!x.value||!h.value||!m.value,class:"w-full !h-11 !text-base",onClick:M},{default:i(()=>[P(D(r.value?"注册中...":"注册"),1)]),_:1},8,["loading","disabled"]),e("div",{class:"text-center"},[s[16]||(s[16]=e("span",{class:"text-sm text-gray-500"},"已有账号？",-1)),e("button",{class:"text-sm text-primary-500 hover:text-primary-600 ml-1",onClick:O}," 立即登录 ")])])])])):q("",!0)]),_:1})}}}),Rt=Z(Lt,[["__scopeId","data-v-70e930ff"]]),Bt={class:"relative login-container"},Ft=j({__name:"LoginView",setup(g){const n=d(!0),c=d(!1),v=()=>{c.value=!1,setTimeout(()=>{n.value=!0},150)},x=()=>{n.value=!1,setTimeout(()=>{c.value=!0},150)};return(h,f)=>(V(),R("div",Bt,[o(gt,{visible:n.value,"onUpdate:visible":f[0]||(f[0]=p=>n.value=p),onSwitchToRegister:x},null,8,["visible"]),o(Rt,{visible:c.value,"onUpdate:visible":f[1]||(f[1]=p=>c.value=p),onSwitchToLogin:v},null,8,["visible"])]))}}),Nt=Z(Ft,[["__scopeId","data-v-9d27c314"]]);export{Nt as default};
