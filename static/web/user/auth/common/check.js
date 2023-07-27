
/**
 * Check类
 */
export default class Check  {
    constructor(){
    }
    checkUsername(username){
        let bool = true
        let msg = '账号格式正确'
        if(!username) {
            bool = false
            msg = "账号不能为空"
        }
        return {
            bool,
            msg
        }
    } 

    checkPwd(password){
        let bool = true
        let msg = '账号格式正确'
        if(password.length < 6) {
            bool = false
            msg = "密码长度不能小于6位"
        }
        return {
            bool,
            msg
        }
    }
    checkRegisterPwd(password,confirmPassword){
        let bool = true
        let msg = '账号格式正确'
        if(password.length < 6) {
            bool = false
            msg = "密码长度不能小于6位"
        } else if(password !== confirmPassword){
            bool = false
            msg = "输入的两次密码不一致"

        }
        return {
            bool,
            msg
        }
        
    }

    checkResetPwd(password,newPassword){
        let bool = true
        let msg = '账号格式正确'
        if(password.length < 6 || newPassword.length<6) {
            bool = false
            msg = "密码长度不能小于6位"
        } 
        return {
            bool,
            msg
        }
        
    }

    
    checkRegister(username,password,confirmPassword){
        let {bool,msg} = this.checkUsername(username)
        // 如果账户名正常，则检查密码
        if(bool) {
           let result = this.checkRegisterPwd(password,confirmPassword)
           bool =result.bool
           msg = result.msg
           if(bool) {
            // 如果密码正常，修改返回值
            msg = "账号密码正常"
           }
        } 

        return {
            bool,
            msg
        }
    }



    // 检查登录
    checkLogin(username,password){
        let {bool,msg} = this.checkUsername(username)
         // 如果账户名正常，则检查密码
         if(bool) {
            let result = this.checkPwd(password)
            bool =result.bool
            msg = result.msg
            if(bool) {
             // 如果密码正常，修改返回值
             msg = "账号密码正常"
            }
         } 

         return {
            bool,
            msg
        }
    }


        // 检查重置
        checkReset(username,password,newPassword){
            let {bool,msg} = this.checkUsername(username)
             // 如果账户名正常，则检查密码
             if(bool) {
                let result = this.checkResetPwd(password,newPassword)
                bool =result.bool
                msg = result.msg
                if(bool) {
                 // 如果密码正常，修改返回值
                 msg = "账号密码检测正常"
                }
             } 
    
             return {
                bool,
                msg
            }
        }

        hintAnimate(e_hint,msg){
        e_hint.style.opacity = 1
        e_hint.style.top = 50 + 'px'
        e_hint.innerHTML = msg
        setTimeout(() => {
            e_hint.style.top = 0 + 'px'
            e_hint.style.opacity = 0
        }, 2000)
        }


        


}


