import { useState } from 'react';
import Navigation from '../structure/Navigation';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert2';
import { authenticate,getpermission } from '../../service/service'
import cryspto from "crypto-js";
import '../../css/Login.css'
const Login = () => {

    const history = useNavigate(); 

    const [state, setstate] = useState({
        username: "",
        password: ""
    })
    const { username, password } = state
    const setstatevalue = name => event => {
        setstate({ ...state, [name]: event.target.value });
    }
    const Tologin = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API}/login`, { username, password })
            .then((res) => {
                if (res.data.res === "เข้าสู่ระบบสำเร็จ") {
                    // const decrypt = cryspto.AES.decrypt(res.data.auth, `${res.data.username}trakanta`).toString(cryspto.enc.Utf8);
                    swal.fire(
                        'แจ้งเตือน',
                        res.data.res,
                        'success'
                    ).then(()=>{
                    authenticate(res, () => {
                        history("/")
                    })})
                    

                } else {
                    swal.fire(
                        'แจ้งเตือน',
                        res.data.res,
                        'error'
                    )
                }
            })
            .catch(err => {
                swal.fire(
                    "เเจ้งเตือน",
                    err.data.error,
                    'error'
                )

            })

    }

    return (
        <div className="login">
            <Navigation />
            <div className="box my-4 d-flex justify-content-center align-items-center">
                <form className="form" onSubmit={Tologin}>
                    {/* {JSON.stringify(state)} */}
                    <h5 className="text-center">Login</h5>
                    <label>Username</label>
                    <input type="input" className="form-control" value={username} onChange={setstatevalue("username")} placeholder="Username" />
                    <label>Password</label>
                    <input type="password" className="form-control" value={password} onChange={setstatevalue("password")} placeholder='Password' />
                    <button className="btn btn-success my-3">Login</button>
                    <Link to="/register" className="register mx-4">Register</Link>
                </form>
            </div>
        </div>
    )
}

export default Login;