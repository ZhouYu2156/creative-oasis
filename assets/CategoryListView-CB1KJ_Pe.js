import{a as N,i as x,bb as S,H as U,e as n,j as t,k as a,L as p,M as g,J as f,K as h,t as o,f as $,m as r,g as w,bc as z,E as D,n as k,bd as A,A as T,p as v,aL as C,be as F,o as l,z as H}from"./index-efaOxweq.js";/* empty css            */import{g as J,_ as K}from"./MembershipDialog-DqAIk0Cb.js";import{E as R}from"./index-Dli4OaBh.js";import"./order-XcvcrzSN.js";import"./index-ClkCYxdB.js";import"./index-nryOYyGd.js";import"./event-BB_Ol6Sd.js";const q={class:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"},G={class:"mb-6 text-center"},O={class:"text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"},P={class:"mt-2 text-lg text-gray-600 dark:text-gray-400"},Q={class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"},W=["onClick"],X={class:"absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"},Y={class:"h-full w-full flex items-center justify-center"},Z=["src","alt","onLoad"],tt={class:"absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:backdrop-blur-sm"},et={key:0,class:"absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded"},st={class:"p-4"},at={class:"flex justify-between items-start mb-2"},ot={class:"text-lg font-semibold text-gray-900 dark:text-white"},it={class:"text-gray-600 dark:text-gray-400 text-sm mb-4"},lt={class:"flex flex-wrap gap-2 mb-4"},nt={class:"flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"},rt=N({__name:"CategoryListView",setup(dt){const y=x([]),b=S(),d=x(!1),L=()=>{var s;(!b.isLoggedIn||!((s=b.userInfo)!=null&&s.is_member))&&(d.value=!0)};U(async()=>{const s=await J();y.value=s.data,L()});const c=x({}),V=s=>{c.value[s]=!0},j=F(),B=s=>{j.push(`/course/${s.id}`)};return(s,m)=>{const _=D,E=R,I=C("VideoCamera"),M=C("User");return l(),n(p,null,[t("div",q,[(l(!0),n(p,null,g(y.value,i=>f((l(),n("section",{class:"mb-12",key:i.id},[t("div",G,[t("h2",O,o(i.name),1),t("p",P,o(i.description),1)]),t("div",Q,[(l(!0),n(p,null,g(i.categories,e=>(l(),n("div",{key:e.id,class:"bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow"},[t("div",{class:"relative cursor-pointer",onClick:u=>B(e)},[f(t("div",X,[t("div",Y,[a(_,{class:"text-6xl sm:text-7xl text-gray-400 dark:text-gray-500"},{default:r(()=>[a(w(z))]),_:1})])],512),[[h,!c.value[e.id]]]),t("img",{src:e.cover,alt:e.title,class:k(["w-full h-48 object-cover",{"opacity-0":!c.value[e.id]}]),onLoad:u=>V(e.id)},null,42,Z),f(t("div",tt,[a(_,{class:"text-6xl sm:text-7xl text-white transform scale-90 group-hover:scale-100 transition-transform"},{default:r(()=>[a(w(A))]),_:1})],512),[[h,c.value[e.id]]]),e.difficulty?(l(),n("div",et,o(e.difficulty_text),1)):$("",!0)],8,W),t("div",st,[t("div",at,[t("h3",ot,o(e.title),1),t("span",{class:k(["text-sm font-medium",[e.is_member_only?"text-yellow-500":"text-green-500"]])},o(e.is_member_only?"会员":"免费"),3)]),t("p",it,o(e.description),1),t("div",lt,[(l(!0),n(p,null,g(e.tech_stack,u=>(l(),T(E,{key:u.id,size:"small",class:"bg-primary-50 text-primary-600 border-primary-200"},{default:r(()=>[v(o(u.name),1)]),_:2},1024))),128))]),t("div",nt,[t("span",null,[a(_,null,{default:r(()=>[a(I)]),_:1}),v(" "+o(e.lesson_count)+" 节课 ",1)]),t("span",null,[a(_,null,{default:r(()=>[a(M)]),_:1}),v(" "+o(e.student_count)+" 人学过 ",1)])])])]))),128))])])),[[h,i.categories.length>0]])),128))]),a(K,{visible:d.value,"onUpdate:visible":m[0]||(m[0]=i=>d.value=i),onClose:m[1]||(m[1]=i=>d.value=!1)},null,8,["visible"])],64)}}}),ht=H(rt,[["__scopeId","data-v-2c6052da"]]);export{ht as default};
