import { useState, useEffect } from 'react';
import Navigation from '../structure/Navigation';
import { Link } from 'react-router-dom';
import '../../css/changepassword.css'
import axios from 'axios';
import { getusername, getToken } from '../../service/service';
import Swal from 'sweetalert2';
const Changepassword = () => {

    const [password, setpassword] = useState({
        oldpassword: "",
        newpassword: "",
        confirmnewpswd: "",
    })

    const [match, setmatchpswd] = useState({
        oldpasswordstatus: false,
        matchpassword: "",
        statusmatchpassword: false,
        colormatch: "red",
        buttonstatus: false
    })

    const { oldpassword, newpassword, confirmnewpswd } = password;
    const { buttonstatus, oldpasswordstatus, matchpassword, statusmatchpassword, colormatch } = match;
    const setstatevalue = (name) => (event) => {
        setpassword({ ...password, [name]: event.target.value })
    }

    const updatepassword = (e) => {
        e.preventDefault();
        if (buttonstatus) {
            axios.put(`${process.env.REACT_APP_API}/updatepassword/${getusername()}/${newpassword}`, { oldpassword }, {
                headers: {
                    authorization: `Bearer ${getToken()}`
                }
            }).then((res) => {
                if (res.data.res === "อัพเดทรหัสผ่านสำเร็จ") {
                    Swal.fire(
                        "เเจ้งเตือน",
                        res.data.res,
                        'success'
                    )
                } else {
                    Swal.fire(
                        "เเจ้งเตือน",
                        res.data.res,
                        'error'
                    )
                }
            })
                .catch((err) => {
                    Swal.fire(
                        "เเจ้งเตือน",
                        err,
                        'error'
                    )
                })
        }else{
            Swal.fire(
                "เเจ้งเตือน",
                "กรุณากรอกให้ถูกด้วยครับ",
                'error'
            )
        }
    }

    useEffect(() => {
        if (oldpassword !== "") {
            setmatchpswd({ ...match, oldpasswordstatus: true })
        } else {
            setmatchpswd({ ...match, oldpasswordstatus: false })
        }
    }, [oldpassword])

    useEffect(() => {

        if (newpassword === confirmnewpswd && newpassword !== "" && confirmnewpswd !== "") {
            setmatchpswd({ ...match, matchpassword: "รหัสผ่านตรงกัน", statusmatchpassword: true, colormatch: "green" })
        } else if (newpassword !== confirmnewpswd && newpassword !== "" && confirmnewpswd !== "") {
            setmatchpswd({ ...match, matchpassword: "รหัสผ่านไม่ตรงกัน", statusmatchpassword: false, colormatch: "red" })
        } else {
            setmatchpswd({ ...match, matchpassword: "", statusmatchpassword: false, colormatch: "red" })
        }
    }, [newpassword, confirmnewpswd])

    useEffect(() => {
        if (oldpasswordstatus && statusmatchpassword) {
            setmatchpswd({ ...match, buttonstatus: true })
        } else {
            setmatchpswd({ ...match, buttonstatus: false })
        }
    }, [oldpasswordstatus, statusmatchpassword])

    return (
        <div className='changepassword'>
            <Navigation />
            <div className="box mt-4">
                <form className='form' onSubmit={updatepassword}>
                    <h5 className="text-center">Change password</h5>
                    <div>
                        <label>old password</label>
                        <input type="password" className='form-control' placeholder='old password' value={oldpassword} onChange={setstatevalue("oldpassword")} />
                    </div>
                    <div>
                        <label>new password</label>
                        <input type="password" className='form-control' placeholder='new password' value={newpassword} onChange={setstatevalue("newpassword")} />
                    </div>
                    <div>
                        <label>confirm password</label>
                        <input type="password" className='form-control' placeholder='confirm password' value={confirmnewpswd} onChange={setstatevalue("confirmnewpswd")} />
                        <div style={{ color: colormatch }}>{matchpassword}</div>
                    </div>
                    <button className='btn btn-outline-success my-3' disabled={!buttonstatus}>confirm</button>
                    <Link to="/" className="link mx-4">Home page</Link>
                </form>
            </div>
        </div>
    )
}
export default Changepassword;