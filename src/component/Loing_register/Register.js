import { useEffect, useState } from 'react';
import Navigation from '../structure/Navigation';
import { Link } from 'react-router-dom';
import '../../css/Login.css'
import axios from 'axios';
import swal from "sweetalert2";
const Login = () => {
    const [state, setstate] = useState({
        username: "",
        password: "",
        confirmpswd: "",
        firstname: "",
        surname: "",
        email: ""
    })
    // state check for client
    const [validate, setvalidate] = useState({
        deplicateusernames: "",
        deplicateemail: "",
        deplicatename: "",
        deplicatesurname: "",
        matchpassword: "",
        colorname: "red",
        colorsurname: "red",
        colorusername: "red",
        coloremail: "red",
        colorpassword: "red",
        colormatchpassword: "red"
    });


    const [verify, setverify] = useState({
        usernameverify: false,
        firstnameverify: false,
        surnameverify: false,
        emailverify: false,
        passwordverify: false,
        buttonregister: false

    })



    const { usernameverify, firstnameverify, emailverify, surnameverify, passwordverify, buttonregister } = verify
    const { username, password, confirmpswd, firstname, surname, email } = state
    const { deplicatename, deplicateusernames, deplicatesurname, deplicateemail, matchpassword, colorname, colorsurname, colorusername, coloremail, colormatchpassword } = validate
    const setstatevalue = name => event => {
        setstate({ ...state, [name]: event.target.value });
    }


    //for username check valid
    useEffect(() => {
        const username_pattern = /[a-zA-Z0-9]{6,15}/;
        if (!username_pattern.test(username) && username !== "") {
            setvalidate({ ...validate, deplicateusernames: "โปรดใช้ชื่อภาษาอังกฤษ หรือตัวเลข ที่มีมากกว่า 6 ตัวอักษร เท่านั้น" })
            setverify({ ...verify, usernameverify: false })
        }
        else if (username_pattern.test(username)) {
            axios.get(`${process.env.REACT_APP_API}/checkusername/${username}`)
                .then((res) => {
                    setvalidate({ ...validate, deplicateusernames: res.data.res, colorusername: res.data.color })
                    setverify({ ...verify, usernameverify: res.data.verify })
                })
                .catch((err) => alert(err))
            // setvalidate({...validate, lenghtuser:`สามารถใช้ชื่อ ${username} ได้`})
            // setformvalid(true)
        } else {
            setvalidate({ ...validate, deplicateusernames: "", colorusername: "red" })
            setverify({ ...verify, usernameverify: false })

        }
    }, [username])


    // forcheck email
    useEffect(() => {
        const emailpattern = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/
        if (emailpattern.test(email) && email !== "") {
            axios.get(`${process.env.REACT_APP_API}/checkemail/${email}`)
                .then((res) => {
                    setvalidate({ ...validate, deplicateemail: res.data.res, coloremail: res.data.color })
                    setverify({ ...verify, emailverify: res.data.verify })
                })
                .catch((err) => alert(err))
        }
        else if(!emailpattern.test(email) && email !== ""){
            setvalidate({ ...validate, deplicateemail: "รูปแบบอีเมลล์ไม่ถูกต้อง", coloremail: "red" })
            setverify({ ...verify, emailverify: false })
        }else{
            setvalidate({ ...validate, deplicateemail: "", coloremail: "red" })
            setverify({ ...verify, emailverify: false })
        }

    }, [email])

    //for confirm password check valid
    useEffect(() => {
        if (password !== confirmpswd) {
            setvalidate({ ...validate, matchpassword: "รหัสผ่านไม่ตรงกันโปรดตรวจสอบอีกคร้้ง", colormatchpassword: "red" })
            setverify({ ...verify, passwordverify: false })
        }
        else if (password === confirmpswd && (password !== "" && confirmpswd !== "")) {
            setvalidate({ ...validate, matchpassword: "รหัสผ่านตรงกัน", colormatchpassword: "green" })
            setverify({ ...verify, passwordverify: true })
        } else if (password === "" || confirmpswd === "") {
            setvalidate({ ...validate, matchpassword: "", colormatchpassword: "red" })
            setverify({ ...verify, passwordverify: false })
        }
    }, [password, confirmpswd])

    // use effect for firstname
    useEffect(() => {
        const firstname_pattern = /[a-zA-Z]{4,15}/;

        if (!firstname_pattern.test(firstname) && firstname !== "") {
            setvalidate({ ...validate, deplicatename: "โปรดป้อนชื่อภาษาอังกฤษ 4-15 ตัวอักษรเท่านั้น", colorname: "red" })
            setverify({ ...verify, firstnameverify: false })
        } else if (firstname === "") {
            setvalidate({ ...validate, deplicatename: "", colorname: "red" })
            setverify({ ...verify, firstnameverify: false })
        } else {
            setvalidate({ ...validate, deplicatename: "รูปแบบถูกต้อง", colorname: "green" })
            setverify({ ...verify, firstnameverify: true })
        }
    }, [firstname])

    // use effect for surname
    useEffect(() => {
        const firstname_pattern = /[a-zA-Z]{4,15}/;

        if (!firstname_pattern.test(surname) && surname !== "") {
            setvalidate({ ...validate, deplicatesurname: "โปรดป้อนนามสกุลภาษาอังกฤษ 4-15 ตัวอักษรเท่านั้น", colorsurname: "red" })
            setverify({ ...verify, surnameverify: false })
        } else if (surname === "") {
            setvalidate({ ...validate, deplicatesurname: "", colorsurname: "red" })
            setverify({ ...verify, surnameverify: false })
        } else {
            setvalidate({ ...validate, deplicatesurname: "รูปแบบถูกต้อง", colorsurname: "green" })
            setverify({ ...verify, surnameverify: true })
        }
    }, [surname])


    /* use effect for active button switch register */
    useEffect(() => {
        if (usernameverify && firstnameverify && surnameverify && passwordverify && emailverify) {
            setverify({ ...verify, buttonregister: true })
        } else {
            setverify({ ...verify, buttonregister: false })
        }
    }, [usernameverify, firstnameverify, surnameverify, passwordverify, emailverify])


    const register = (e) => {
        e.preventDefault();
        if (usernameverify && firstnameverify && surnameverify && passwordverify && emailverify) {
            axios.post(`${process.env.REACT_APP_API}/register`, { ...state })
                .then((res) => {
                    if (res.data.res !== "สมัครสมาชิกเรียบร้อย") {
                        swal.fire(
                            'เเจ้งเตือน',
                            res.data.res,
                            'error'
                        )
                    } else {
                        swal.fire(
                            'เเจ้งเตือน',
                            res.data.res,
                            'success'
                        )
                    }
                })
                .catch((err) => alert(err.data.error))
        } else {
            swal.fire(
                'เเจ้งเตือน',
                "ข้อมูลไม่ถูกต้อง",
                'error'
            )
        }
    }
    return (
        <div className="login">
            <Navigation />
            <div className="box my-4 d-flex justify-content-center align-items-center">
                <form className="form" onSubmit={register}>
                    {/* {JSON.stringify(state)} */}
                    <h5 className="text-center">Register</h5>
                    <div>
                        <label>name</label>
                        <input type="text" className="form-control" value={firstname} onChange={setstatevalue("firstname")} placeholder='name...' required />
                        <div className="validate" style={{ color: colorname }}>{deplicatename}</div>
                    </div>
                    <div>
                        <label>surname</label>
                        <input type="text" className="form-control" value={surname} onChange={setstatevalue("surname")} placeholder='surname...' required />
                        <div className="validate" style={{ color: colorsurname }}>{deplicatesurname}</div>

                    </div>
                    <div>
                        <label>username</label>
                        <input type="text" className="form-control" value={username} onChange={setstatevalue("username")} placeholder='username...' required />
                        <div className="validate" style={{ color: colorusername }}>{deplicateusernames}</div>
                    </div>
                    <div>
                        <label>email</label>
                        <input type="email" className="form-control" value={email} onChange={setstatevalue("email")} placeholder='email...' required />
                        <div className="validate" style={{ color: coloremail }} >{deplicateemail}</div>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" className="form-control" value={password} onChange={setstatevalue("password")} placeholder='password...' required />
                    </div>
                    <div>
                        <label>Confirm Password</label>
                        <input type="password" className="form-control" value={confirmpswd} onChange={setstatevalue("confirmpswd")} placeholder='confirm password...' required />
                        <div className="validate" style={{ color: colormatchpassword }} >{matchpassword}</div>
                    </div>
                    <button className="btn btn-success my-3" disabled={!buttonregister}>Register</button>
                    <Link to="/login" className="register mx-4">Login</Link>
                </form>
            </div>
        </div>
    )
}

export default Login;