import{a as _,e as m,j as e,k as o,m as s,E as u,b5 as p,aL as r,p as x,be as f,o as g,z as b}from"./index-efaOxweq.js";const k={class:"fixed inset-0 flex items-center justify-center bg-black/50 z-50"},y={class:"bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center"},h={class:"mb-6"},v={class:"flex justify-center"},w=_({__name:"UnauthorizedDialog",setup(z){const n=f(),c=()=>{n.push({name:"login",query:{redirect:n.currentRoute.value.fullPath}})};return(U,t)=>{const l=r("Lock"),a=u,i=r("User"),d=p;return g(),m("div",k,[e("div",y,[e("div",h,[o(a,{class:"text-8xl text-primary-500"},{default:s(()=>[o(l)]),_:1})]),t[1]||(t[1]=e("h2",{class:"text-2xl font-bold text-gray-900 dark:text-white mb-4"},"未登录",-1)),t[2]||(t[2]=e("p",{class:"text-gray-600 dark:text-gray-400 mb-8"}," 您当前未登录或登录已过期，请先登录后再访问该页面 ",-1)),e("div",v,[o(d,{type:"primary",size:"large",onClick:c},{icon:s(()=>[o(a,{class:"mr-1"},{default:s(()=>[o(i)]),_:1})]),default:s(()=>[t[0]||(t[0]=x(" 去登录 "))]),_:1})])])])}}}),C=b(w,[["__scopeId","data-v-03f4d8fd"]]);export{C as U};
