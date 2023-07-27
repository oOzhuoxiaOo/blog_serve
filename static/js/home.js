class Theme {
    backupThemes = {
        "selected":"dark-mode",
        "data":{
            "light-mode":{
                id: 0,
                text:'☀',
                img:''
            },
            "dark-mode":{
                id: 1,
                text:'🌙',
                img:''
            }
        }
    }
    constructor(slipClassName){
        this.e_slip = document.querySelector(`.${slipClassName}`)
        this.e_slipFather = this.e_slip.parentElement
        this.e_html = document.documentElement
        this.init();
    }
    init(){
        this.onloadThemes()
        this.addClickEvent();
    }
    // 检测本地皮肤数据是否存在
    hasThemesByStorage(){
        return this.getThemesByStorage() !== null
    }
    // 获取本地皮肤数据
    getThemesByStorage(){
        return JSON.parse(localStorage.getItem('themes')) 
    }
    // 设置本地皮肤数据
    setThemesByStorage(data){
        localStorage.setItem('themes',JSON.stringify(data))
    }
    // 初始化皮肤
    onloadThemes(){
        if(this.hasThemesByStorage()){
            this.themesObj = this.getThemesByStorage()
        } else {
            this.setThemesByStorage(this.backupThemes)
            this.themesObj = this.backupThemes
        }
        let  id =  this.themesObj.data[this.themesObj.selected].id
        console.log('id',id)
        let resultStr = id == 0 ? 0 : `${id}00%`
        this.e_slip.style.transform = `translateX(${resultStr})`
        this.e_slip.innerHTML =  this.themesObj.data[this.themesObj.selected].text
        this.e_html.classList.add(this.themesObj.selected)
    }
    // 给滑片父添加一个点击事件
    addClickEvent(){
        this.e_slipFather.addEventListener('click',()=>{
            this.e_html.classList.remove(this.themesObj.selected)
            let themesDataKeys = Object.keys(this.themesObj.data)
            // 查找另一个类名
            this.themesObj.selected = themesDataKeys.find((item)=>{
               return this.themesObj.selected !== item
            })
            this.e_html.classList.add(this.themesObj.selected)
            
            let  id =  this.themesObj.data[this.themesObj.selected].id
            console.log('id',id)
            let resultStr = id == 0 ? 0 : `${id}00%`
            this.e_slip.style.transform = `translateX(${resultStr})`
            this.e_slip.innerHTML =  this.themesObj.data[this.themesObj.selected].text
            this.setThemesByStorage(this.themesObj)
        })
    }
}

new Theme('appearance-slip')

// //  获取滑片按钮
// let e_slip = document.querySelector('.appearance-slip')
// // 获取滑片父
// let e_appearance = document.querySelector('.appearance')

// let e_html = document.querySelector('html')


// // localStorage存储的为字符串数据 如果传入对象就会显示为[object] [object]
// let themesData = JSON.parse(localStorage.getItem('themes')) 
// if(themesData === null) {
//     let initThemes = {
//         "selected":"dark-mode",
//         "data":{
//             "light-mode":{
//                 id: 0,
//                 text:'☀',
//                 img:''
//             },
//             "dark-mode":{
//                 id: 1,
//                 text:'🌙',
//                 img:''
//             }
//         }
//     }
//     themesData = initThemes
//     localStorage.setItem("themes",JSON.stringify(themesData))
    
    
// } 



// console.log('@',themesData)

// function slipOnload(){
//     let  id =  themesData.data[themesData.selected].id
//     console.log('id',id)
//     let result = id == 0 ? 0 : `${id}00%`
//     e_slip.style.transform = `translateX(${result})`
//     e_slip.innerHTML =  themesData.data[themesData.selected].text
//     e_html.classList.add(themesData.selected)
    
// }

// function slipHandle(){
//     e_html.classList.remove(themesData.selected)
//     if(themesData.selected == "dark-mode") {
//         themesData.selected = "light-mode"
//     } else {
//         themesData.selected = "dark-mode"
//     }
//     e_html.classList.add(themesData.selected)
    
//     let  id =  themesData.data[themesData.selected].id
//     console.log('id',id)
//     let result = id == 0 ? 0 : `${id}00%`
//     e_slip.style.transform = `translateX(${result})`
//     e_slip.innerHTML =  themesData.data[themesData.selected].text
//     localStorage.setItem("themes",JSON.stringify(themesData))
// }

// // 添加滑片事件
// e_appearance.addEventListener('click',slipHandle)
// slipOnload();

