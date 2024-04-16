import { useState, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"
import Swal from "sweetalert2"
import "../../css/Sweetalert.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../../css/switchgear.css"
import { getToken } from "../../service/service";
import { v4 as uuidv4 } from 'uuid';
import { getpermission } from "../../service/service";
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);

const Navsubstation = (prop) => {

    const initial_substationinfo = {
        id: "ไม่มีid",
        nameThai: "กรุณาเลือกสถานี",
        initialsThai: "กรุณาเลือกสถานี",
        nameEng: "กรุณาเลือกสถานี",
        initialsEng: "กรุณาเลือกสถานี",
        affiliation: "กรุณาเลือกสถานี"
    }

    const { substation, locationtest, listtest, sublisttest } = useParams()
    const history = useNavigate();
    const locationtests = ["Switchgear", "Switchyard", "Transformer", "Capacitor.Bank", "Battery"]
    const [find, setfind] = useState("")
    const [fetchdata, setfetch] = useState([])
    const [substationinfo, setsubstationinfo] = useState(initial_substationinfo)

    // const [list_test_state, setlisttest] = useState("")



    const Swl_function = (header, data, icon) => {
        return Swal.fire(
            header,
            data,
            icon
        )
    }
    const selectlist = async (event) => {
        // await setlisttest(event.target.value)
        if (sublisttest !== undefined) {
            history(`/Test/${substation}/${event.target.value}/${listtest}/${sublisttest}`)
        } else if (listtest !== undefined) {
            history(`/Test/${substation}/${event.target.value}/${listtest}`)
        } else {
            history(`/Test/${substation}/${event.target.value}`)
        }
    }

    const selectsubstation = (event) => {
        if (sublisttest !== undefined) {
            history(`/Test/${event.target.value}/${locationtest}/${listtest}/${sublisttest}`)
        } else if (listtest !== undefined) {
            history(`/Test/${event.target.value}/${locationtest}/${listtest}`)
        } else if (locationtest !== undefined) {
            history(`/Test/${event.target.value}/${locationtest}`)
        } else {
            history(`/Test/${event.target.value}`)
        }
    }

    const fetch = async (data = "") => {
        await axios.post(`${process.env.REACT_APP_API}/fetchsubstation`, { find: data })
            .then((res) => {
                if (res.data[0].nameThai !== undefined && data !== "") {
                    Swl_function("แจ้งเตือน", `เลือกสถานี ${res.data[0].nameThai} สำเร็จ`, 'success')
                    setsubstationinfo({
                        id: res.data[0]._id,
                        nameThai: res.data[0].nameThai,
                        initialsThai: res.data[0].initialsThai,
                        nameEng: res.data[0].nameEng,
                        initialsEng: res.data[0].initialsEng,
                        affiliation: res.data[0].affiliation,
                    })
                    prop.setstate({
                        type: 'substationinfo', payload: {
                            id: res.data[0]._id,
                            nameThai: res.data[0].nameThai,
                            initialsThai: res.data[0].initialsThai,
                            nameEng: res.data[0].nameEng,
                            initialsEng: res.data[0].initialsEng,
                            affiliation: res.data[0].affiliation,
                        }
                    })
                    
                } else {
                    setfetch(res.data) // for loop list of substation

                }
            }).catch((err) => {
                history('/Test')
            })
    }

    useEffect(() => {
        axios.post(`${process.env.REACT_APP_API}/fetchsubstation`, { find })
            .then((res) => {
                setfetch(res.data)
            }).catch((err) => {
                alert(err)
            })
    }, [find])



    useEffect(() => {
        if (substation !== undefined) {
            axios.post(`${process.env.REACT_APP_API}/fetchinfosubstation`, { nameThai: substation })
                .then((res) => {
                    fetch(substation)
                    if (res.data === null) {
                        setsubstationinfo({ nameThai: "กรุณาเลือกสถานี" })
                    }
                    else {
                        setsubstationinfo(res.data)
                    }
                }).catch((err) => {
                    history(`/Test`)
                    setsubstationinfo(initial_substationinfo)
                })
        } else {
            setsubstationinfo(initial_substationinfo)
            history(`/Test`)
        }
    }, [substation])



    const addsubstation = (data) => {
        Swal.fire({
            // icon: 'info',
            title: "เพิ่มข้อมูลสถานี",
            html: `<div class="containers">
                <div class="subcontainer">
                    <div class="name">
                        <div class="head1  ">ชื่อภาษาไทย</div>
                        <input type="text" id="nameThai" class="form-control" />
                    </div>
                    <div class="name">
                        <div class="head1" >ชื่อย่อภาษาไทย</div>
                        <input type="text" id="initialsThai" class="form-control" />
                    </div>
                    <div class="name">
                        <div class="head1">ชื่อภาษาอังกฤษ</div>
                        <input type="text" id="nameEng" class="form-control" />
                    </div>
                    <div class="name">
                        <div class="head1">ชื่อย่ออังกฤษ</div>
                        <input type="text" id="initialsEng" class="form-control" />
                    </div>
                    <div class="name">
                        <div class="head1">สังกัด</div>
                        <input type="text" id="affiliation" class="form-control"/>
                    </div> 
                </div> 
            </div>`,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#1fbf31',
            focusConfirm: false,
            confirmButtonText: 'เพิ่มข้อมูล',
            preConfirm: () => {
                const nameThai = Swal.getPopup().querySelector('#nameThai').value
                const initialsThai = Swal.getPopup().querySelector('#initialsThai').value
                const nameEng = Swal.getPopup().querySelector('#nameEng').value
                const initialsEng = Swal.getPopup().querySelector('#initialsEng').value
                const affiliation = Swal.getPopup().querySelector('#affiliation').value
                if (!nameThai || !initialsThai || !nameEng || !initialsEng) {
                    Swal.showValidationMessage(`กรอกข้อมูลไม่ครบ`)
                }
                return { nameThai, initialsThai, nameEng, initialsEng, affiliation }
            }
        })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(`${process.env.REACT_APP_API}/addsubstation`, result.value, {
                        headers: {
                            authorization: `Bearer ${getToken()}`
                        }
                    })
                        .then((res) => {
                            if (res.data.res === "เพิ่มข้อมูลสำเร็จ") {
                                Swl_function('เเจ้งเตือน', res.data.res, 'success')
                                    .then(() => fetch())
                            } else { Swl_function('เเจ้งเตือน', "เกิดข้อผิดพลาด", 'error') }
                        })
                        .catch((err) => { Swl_function('เเจ้งเตือน', "เกิดข้อผิดพลาด", 'error') })
                }
            })
    }

    const showsubstation = (data) => {
        Swal.fire({
            // icon: 'info',
            title: "ข้อมูลสถานี",
            html: `<div class="containers">
                <div class="subcontainer">
                    <div class="name">
                        <div class="head1">ชื่อภาษาไทย</div>
                        <div class="data"> : ${data.nameThai}</div>
                    </div>
                    <div class="name">
                        <div class="head1" >ชื่อย่อภาษาไทย</div>
                        <div class="data" > : ${data.initialsThai}</div>
                    </div>
                    <div class="name">
                        <div class="head1">ชื่อภาษาอังกฤษ</div>
                        <div class="data"> : ${data.nameEng}</div>
                    </div>
                    <div class="name">
                        <div class="head1">ชื่อย่ออังกฤษ</div>
                        <div class="data"> : ${data.initialsEng}</div>
                    </div>
                    <div class="name">
                        <div class="head1">สังกัด</div>
                        <div class="data"> : ${data.affiliation}</div>
                    </div> 
                </div> 
            </div>`,
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: '#1fbf31',
            cancelButtonColor: '#d33',
            denyButtonColor: '#f0df13',
            confirmButtonText: 'แก้ไขข้อมูล',
            denyButtonText: `ลบข้อมูล`,
        })
            .then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        // icon: 'info',
                        title: "แก้ไขข้อมูลสถานี",
                        html: `<div class="containers">
                            <div class="subcontainer">
                                <input type="hidden" id="id_sub" value="${data.id}"/>
                                <div class="name">
                                    <div class="header">ชื่อภาษาไทย</div>
                                    <input type="text" id="nameThai_edit" class="form-control" value="${data.nameThai}"/>
                                </div>
                                <div class="name">
                                    <div class="header" >ชื่อย่อภาษาไทย</div>
                                    <input type="text" id="initialsThai_edit" class="form-control" value="${data.initialsThai}"/>
                                </div>
                                <div class="name">
                                    <div class="header">ชื่อภาษาอังกฤษ</div>
                                    <input type="text" id="nameEng_edit" class="form-control" value="${data.nameEng}"/>
                                </div>
                                <div class="name">
                                    <div class="header">ชื่อย่ออังกฤษ</div>
                                    <input type="text" id="initialsEng_edit" class="form-control" value="${data.initialsEng}"/>
                                </div>
                                <div class="name">
                                    <div class="header">สังกัด</div>
                                    <input type="text" id="affiliation_edit" class="form-control" value="${data.affiliation}"/>
                                </div> 
                            </div> 
                        </div>`,
                        showCancelButton: true,
                        cancelButtonColor: '#d33',
                        confirmButtonColor: '#1fbf31',
                        focusConfirm: false,
                        confirmButtonText: 'แก้ไขข้อมูล',
                        preConfirm: () => {
                            const nameThai = Swal.getPopup().querySelector('#nameThai_edit').value
                            const initialsThai = Swal.getPopup().querySelector('#initialsThai_edit').value
                            const nameEng = Swal.getPopup().querySelector('#nameEng_edit').value
                            const initialsEng = Swal.getPopup().querySelector('#initialsEng_edit').value
                            const affiliation = Swal.getPopup().querySelector('#affiliation_edit').value
                            const id = Swal.getPopup().querySelector('#id_sub').value
                            if (!nameThai || !initialsThai || !nameEng || !initialsEng) {
                                Swal.showValidationMessage(`กรอกข้อมูลไม่ครบ`)
                            }
                            return { nameThai, initialsThai, nameEng, initialsEng, affiliation, id }
                        }
                    })
                        .then((result) => {
                            if (result.isConfirmed) {
                                axios.post(`${process.env.REACT_APP_API}/updatesubstation`, result.value, {
                                    headers: {
                                        authorization: `Bearer ${getToken()}`
                                    }
                                })
                                    .then((res) => {
                                        if (res.data.res === "แก้ไขข้อมูลสำเร็จ") {
                                            Swl_function('เเจ้งเตือน', res.data.res, 'success')
                                                .then(() => {
                                                    fetch()
                                                    history(`/Test/${result.value.nameThai}`)
                                                })
                                        } else {
                                            Swl_function('เเจ้งเตือน', "เกิดข้อผิดพลาด", 'error')
                                        }
                                    })
                                    .catch((err) => {
                                        Swl_function('เเจ้งเตือน', "เกิดข้อผิดพลาด", 'error')
                                    })
                            }
                        })
                } else if (result.isDenied) {
                    Swal.fire({
                        title: 'เเจ้งเตือน',
                        text: `คุณกำลังลบ ${data.nameThai}`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'ใช่ต้องการลบ',
                        cancelButtonText: 'ปิด'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            axios.post(`${process.env.REACT_APP_API}/deletesubstation`, { id: data.id }, {
                                headers: {
                                    authorization: `Bearer ${getToken()}`
                                }
                            })
                                .then((res) => {
                                    if (res.data.res === "ลบข้อมูลสำเร็จ") {
                                        Swl_function('เเจ้งเตือน', res.data.res, 'success')
                                            .then(() => {
                                                fetch()
                                                setsubstationinfo(initial_substationinfo)
                                                history('/Test')
                                            })

                                    } else {
                                        Swl_function('เเจ้งเตือน', "เกิดข้อผิดพลาด", 'error')

                                    }
                                })
                                .catch((err) => {
                                    Swl_function('เเจ้งเตือน', "เกิดข้อผิดพลาด", 'error')

                                })
                        }
                    })
                }
            })
    }

    return (
        <div>
            <div className="container d-flex justify-content-center my-4">
                <div className="d-flex justify-content-center align-items-center selectswitchgear row">
                    <div className="select my-2 col-lg-3 col-md-3">
                        <select className="form-select" value={substationinfo.nameThai} onChange={selectsubstation}>
                            <option value="กรุณาเลือกสถานี" key={uuidv4()}>เลือกสถานี...</option>
                            {fetchdata.map((data, index) => (
                                <option value={data.nameThai} key={index}>{data.nameThai}</option>
                            ))}
                        </select>
                    </div>
                    {(substationinfo.nameThai !== "กรุณาเลือกสถานี" && substation !== undefined) && <div className="select my-2 col-lg-3 col-md-3">
                        <select className="form-select" onChange={selectlist} value={locationtest}>
                            <option value="รายการทดสอบ" key={uuidv4()}>รายการทดสอบ</option>
                            {locationtests.map((data, index) => (
                                <option value={data} key={uuidv4()}>{data}</option>
                            ))}
                        </select>
                    </div>}
                    {(substationinfo.nameThai !== "กรุณาเลือกสถานี") &&
                        <button type="button" className="btn btn-outline-success mx-2 my-2 col-lg-2 col-md-4" onClick={() => showsubstation(substationinfo)}>ข้อมูลสถานี</button>}
                    {(getpermission()==="personel" || getpermission()==="Admin" ) && <button type="button" className="btn btn-outline-success mx-1 my-2 col-lg-2 col-md-4" onClick={addsubstation}>เพิ่มสถานี</button>}
                </div>
            </div>

        </div>

    )


}

export default Navsubstation;