import{F as p}from"./ForbiddenDialog-CV9uGCVI.js";import{a as i,e as x,j as e,k as a,m as n,E as f,b5 as g,aL as b,p as k,be as y,o as l,z as v,c as F,bM as h,A as w,F as D}from"./index-efaOxweq.js";import{S as B}from"./ServerErrorDialog-BceuNQaV.js";import{U as C}from"./UnauthorizedDialog-BetZPkCJ.js";const E={class:"fixed inset-0 flex items-center justify-center bg-black/50 z-50"},N={class:"bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center"},V={class:"mb-6"},j={class:"flex justify-center space-x-4"},z=i({__name:"NotFoundDialog",setup(d){const s=y(),o=()=>{s.push("/")};return(r,t)=>{const u=b("WarningFilled"),m=f,_=g;return l(),x("div",E,[e("div",N,[e("div",V,[a(m,{class:"text-8xl text-primary-500"},{default:n(()=>[a(u)]),_:1})]),t[1]||(t[1]=e("h2",{class:"text-2xl font-bold text-gray-900 dark:text-white mb-4"},"页面不存在",-1)),t[2]||(t[2]=e("p",{class:"text-gray-600 dark:text-gray-400 mb-8"},"抱歉，您访问的页面不存在或已被删除。",-1)),e("div",j,[a(_,{type:"primary",onClick:o},{default:n(()=>t[0]||(t[0]=[k("返回首页")])),_:1})])])])}}}),c=v(z,[["__scopeId","data-v-a7d9dd93"]]),U=i({__name:"FeedbackView",setup(d){const s=h(),o=F(()=>{switch(s.meta.status){case 401:return C;case 403:return p;case 404:return c;case 500:return B;default:return c}});return(r,t)=>(l(),w(D(o.value)))}});export{U as default};
