import {BrowserRouter,Routes,Route} from "react-router-dom";
import App from "./App";
import Login      from "./component/Loing_register/Login";
import Register   from "./component/Loing_register/Register";
import Usermanage from "./component/Loing_register/Usermanage";
import About     from "./component/structure/About";
import Changepassword     from "./component/Loing_register/Changepassword";
import Adminrouter from "./component/Loing_register/Adminrouter"
import Loginredirect from "./component/Loing_register/Loginredirect"
// import Test from "./component/stock/StockE"
import Test from "./component/Test/Test"



const Myrouter=()=>{  
    return(        
    <BrowserRouter> 
        <Routes>
            <Route exact path="/" Component={App} />
            <Route exact path="/login" element={<Loginredirect Component={Login} />}/>
            <Route exact path="/register" element={<Loginredirect Component={Register}/>}/>
            <Route exact path="/usermanage" element={<Adminrouter Component={Usermanage}/>}/>
            <Route exact path="/changepassword" Component={Changepassword}/>
            <Route exact path="/about" Component={About}/>

            {/* For stock page  */}
            {/* <Route exact path="/Stock" Component={Test}/> */}

            {/* For switchgear test */}
            <Route exact path="/Test" Component={Test}/>
            <Route exact path="/Test/:substation" Component={Test}/>
            <Route exact path="/Test/:substation/:locationtest" Component={Test}/>
            <Route exact path="/Test/:substation/:locationtest/:listtest" Component={Test}/>
            <Route exact path="/Test/:substation/:locationtest/:listtest/:sublisttest" Component={Test}/>
            <Route exact path="/Test/:substation/:locationtest/:listtest/:sublisttest/:nameTest" Component={Test}/>            

        </Routes>       
    </BrowserRouter>
            
    )
}



export default Myrouter;