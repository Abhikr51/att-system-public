import React from "react"
import axios from 'axios'
export const encryptedLocalStorage = {
    setItem : (key,data)=>{

        localStorage.setItem(key,btoa(data))
    },
    getItem : (key)=>{
        let data = localStorage.getItem(key)
        if(data){
            return atob(data)
        }
        return null
    },
    removeItem : (key)=>{
        localStorage.removeItem(key)
    },
}


export const createRoute = (routes=[],role="",prefix ="") =>{
    let u = {}
    let p ;
    let t = routes.map((item,i)=>{
        p = prefix + item.path
        u = {...u , [item.name.toLowerCase().trim().replaceAll(" " , '_')]:p}
        return {
            ...item,
            path : p,
            element : React.cloneElement(item.element, {role , icon : item.icon ?? null ,name:item.name})
        }
    })

    return {urls :u,routes :t}
}
export const sheetUploader = async(sheet,url)=>{
    try{
        let data = new FormData();
        data.append('sheet', sheet,sheet.name)
        let response = await axios.post(url,data,{
            headers : {
                'Content-Type' :'multipart/formdata'
            }
        })
        return response
    }catch(err){
        console.log("Uploader Err : ",err);
        throw new Error(err.message);

    }
    
}
export const att_percentage_calc = (p,a)=>{
    let t =0;
    if(a+p !== 0 ){
        t =(p / (a + p))*100
        t = Math.round(t * 100) / 100
        return t
      }else{
        return 0
      }
}