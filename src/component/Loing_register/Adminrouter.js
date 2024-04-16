import { Navigate } from "react-router-dom";
import { getpermission } from "../../service/service";

const Adminrouter = ({Component,...prop}) =>{
    if(getpermission() === "Admin"){
        return <Component {...prop} />
    }else{
        return <Navigate to="/" {...prop} replace />
    }    
}

export default Adminrouter;





