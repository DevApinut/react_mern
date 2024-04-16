import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navigation from '../structure/Navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getToken, logout } from '../../service/service';


const Usermanage = () => {
    const history = useNavigate();
    /*For Fetch all member list from register*/
    const [find, setfind] = useState("")
    const [users, Setuser] = useState([])

    const finddata = (event) => {
        setfind(event.target.value)
    }

    useEffect(() => {

        axios.post(`${process.env.REACT_APP_API}/fetchandfind`, { find }, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
            .then(async (res) => {
                if (res.data.err === "เกิด error") {
                    Swal.fire(
                        "เเจ้งเตือน",
                        "Token ผิดพลาด โปรดเข้าสู่ระบบใหม่",
                        'error'
                    ).then(() => {
                        logout(() => history('/login'))
                        Setuser([])
                    })
                } else {
                    Setuser(res.data)
                }
                // Setuser(res.data)
            })
            .catch(err => {
                Swal.fire(
                    "แจ้งเตือน",
                    err,
                    'error'
                )
            })

    }, [find])

    const fetchuser = () => {
        axios.post(`${process.env.REACT_APP_API}/alluser`, { find }, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
            .then(async (res) => {
                if (res.data.err === "เกิด error") {
                    Swal.fire(
                        "เเจ้งเตือน",
                        "Token ผิดพลาด โปรดเข้าสู่ระบบใหม่",
                        'error'
                    ).then(() => {
                        logout(() => history('/login'))
                        Setuser([])
                    })
                } else {
                    Setuser(res.data)
                }
                // Setuser(res.data)
            })
            .catch(err => {
                Swal.fire(
                    "แจ้งเตือน",
                    err,
                    'error'
                )
            })
    }

    useEffect(() => {
        fetchuser();
    }, [])

    /*For setting auth member*/
    const selectauth = (username) => (event) => {
        axios.put(`${process.env.REACT_APP_API}/updateauth/${username}/${event.target.value}`, {}, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                Swal.fire(
                    "เเจ้งเตือน",
                    res.data.res,
                    'success'
                )
                fetchuser();
            })
            .catch((err) => alert(err))
    }

    useEffect(() => {
        selectauth();
    }, [])


    const deleteuser = (username) => {
        Swal.fire({
            title: 'ยืนยันการลบ',
            text: `ต้องการลบ ${username} หรือไม่`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยันการลบ',
            cancelButtonText: 'ยกเลิกการลบ',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`${process.env.REACT_APP_API}/deleteuser/${username}`, {
                    headers: {
                        authorization: `Bearer ${getToken()}`
                    }
                })
                    .then((res) => {
                        Swal.fire(
                            'เเจ้งเตือน',
                            res.data.res,
                            'success'
                        )
                        fetchuser();
                    })
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire(
                    'ยกเลิกการลบ',
                    `คุณได้ยกเลิกการลบ username : ${username} แล้ว`,
                    'error'
                )
            }
        })
    }


    return (
        <div>
            <Navigation />

            <div className="container">
                <div className="d-flex justify-content-between my-4">
                    <h4 className='text-center'>ระบบจัดการสมาชิก</h4>
                    <div>
                        <input className="form-control me-2" type="search" placeholder="ค้นหาสมาชิก" onChange={finddata} aria-label="Search" value={find} />
                    </div>
                </div>
                <div className='table-responsive'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>username</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>email</th>
                                <th>สิทธิ์เข้าถึง</th>
                                <th>ลบสมาชิก</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.username}</td>
                                    <td>{user.firstname} {user.surname}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <select className="form-select" value={user.auth} onChange={selectauth(user.username)}>
                                            <option value="Admin">Admin</option>
                                            <option value="personel">personel</option>
                                            <option value="member">member</option>
                                        </select>
                                    </td>
                                    <td><button className='btn btn-outline-danger' onClick={() => { deleteuser(user.username) }}>ลบ</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default Usermanage;