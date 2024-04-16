import axios from "axios";
import cryspto from "crypto-js";


const Fortest=()=>{
    axios.get(
        `${process.env.REACT_APP_API}/test`
    ).then((res)=>{
        const decrypt = cryspto.AES.decrypt(res.data.res,"test").toString(cryspto.enc.Utf8);
        alert(`${decrypt} ${JSON.stringify(res.data.res)}`)
    }
    )
}
export default Fortest;