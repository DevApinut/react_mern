import { Navigate}  from "react-router-dom";
import { getpermission } from "../../service/service";

const Loginredirect = ({Component,...prop})=>{
    if(!getpermission()){
        return <Component {...prop} />
    }else{
        return <Navigate to="/" {...prop} replace />
    }
}

export default Loginredirect ;

