import CryptoJS from "crypto-js"
import Swal from "sweetalert2"
// import { useNavigate } from "react-router-dom"







export const authenticate = (res, next) => {
    if (window !== "undefined") {
        //เก็บข้อมูลลง session storage
        sessionStorage.setItem("token", JSON.stringify(res.data.token))
        sessionStorage.setItem("permission", JSON.stringify(res.data.auth))
        sessionStorage.setItem("username", JSON.stringify(res.data.username))
    }
    next();
}

export const getToken = () => {
    if (window !== "undefined") {
        if (sessionStorage.getItem("token")) {
            return JSON.parse(sessionStorage.getItem("token"))
        } else {
            return false
        }
    }
}


export const getusername = () => {
    if (window !== "undefined") {
        if (sessionStorage.getItem("username")) {
            return JSON.parse(sessionStorage.getItem("username"))
        } else {
            return false
        }
    }
}


export const getpermission = () => {
   
    if (window !== "undefined") {
        try {
            if (sessionStorage.getItem("permission")) {
                const decrypt = CryptoJS.AES.decrypt(JSON.parse(sessionStorage.getItem("permission")), `${JSON.parse(sessionStorage.getItem("username"))}trakanta`).toString(CryptoJS.enc.Utf8);
                return decrypt;
            } else {
                return false
            }
        }
        catch(err){
            Swal.fire(
                "เชื่อมต่อไม่สำเร็จ",
                "เกิดข้อผิดพลาดในการทำงาน โปรด login ใหม่",
                "error"
            )
            .then(()=>{
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("username");
                sessionStorage.removeItem("permission");                
            })
           
        }
        
    }
}

export const logout = (next) => {
    if (window !== "undefined") {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("permission");
    }
    next()
}