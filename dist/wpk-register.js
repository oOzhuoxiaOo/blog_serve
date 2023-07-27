(()=>{"use strict";class e{constructor(){}checkUsername(e){let t=!0,o="账号格式正确";return e||(t=!1,o="账号不能为空"),{bool:t,msg:o}}checkPwd(e){let t=!0,o="账号格式正确";return e.length<6&&(t=!1,o="密码长度不能小于6位"),{bool:t,msg:o}}checkRegisterPwd(e,t){let o=!0,s="账号格式正确";return e.length<6?(o=!1,s="密码长度不能小于6位"):e!==t&&(o=!1,s="输入的两次密码不一致"),{bool:o,msg:s}}checkResetPwd(e,t){let o=!0,s="账号格式正确";return(e.length<6||t.length<6)&&(o=!1,s="密码长度不能小于6位"),{bool:o,msg:s}}checkRegister(e,t,o){let{bool:s,msg:l}=this.checkUsername(e);if(s){let e=this.checkRegisterPwd(t,o);s=e.bool,l=e.msg,s&&(l="账号密码正常")}return{bool:s,msg:l}}checkLogin(e,t){let{bool:o,msg:s}=this.checkUsername(e);if(o){let e=this.checkPwd(t);o=e.bool,s=e.msg,o&&(s="账号密码正常")}return{bool:o,msg:s}}checkReset(e,t,o){let{bool:s,msg:l}=this.checkUsername(e);if(s){let e=this.checkResetPwd(t,o);s=e.bool,l=e.msg,s&&(l="账号密码检测正常")}return{bool:s,msg:l}}hintAnimate(e,t){e.style.opacity=1,e.style.top="50px",e.innerHTML=t,setTimeout((()=>{e.style.top="0px",e.style.opacity=0}),2e3)}}console.log(e);let t=document.querySelector("form"),o=document.querySelector("#username"),s=document.querySelector("#password"),l=document.querySelector("#confirm-password"),c=document.querySelector(".submit"),n=document.querySelector(".hint");console.log(t),console.log(o),console.log(s),console.log(l),console.log(c),c.addEventListener("click",(function(){let t=new e;console.log(t);let c=o.value,r=s.value,i=l.value,m=t.checkRegister(c,r,i);if(console.log(m),m.bool){let e="http://127.0.0.1:9000";axios.post(e+"/user/register",{username:c,password:r,confirmPassword:i},{headers:{"content-type":"application/x-www-form-urlencoded"}}).then((e=>{t.hintAnimate(n,e.data.msg)})).catch((()=>{t.hintAnimate(n,"服务器异常")}))}else t.hintAnimate(n,m.msg)}))})();