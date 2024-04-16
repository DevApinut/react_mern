import Swal from "sweetalert2"
import 'bootstrap/dist/css/bootstrap.min.css'
import { useEffect, useReducer, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { v4 as uuidv4 } from 'uuid';
import '../../../css/feeder.css'
import { getpermission, getToken } from "../../../service/service"
import Switch from "react-switch";


const Feeder = (prop) => {
    const history = useNavigate()

    const BUS1 = ["1CVB-01", "1BVB-01", "1VB-01", "2VB-01", "3VB-01", "4VB-01", "5VB-01", "T1Vs-01", "BVB-01"]
    const BUS2 = ["1CVB-01", "1BVB-01", "1VB-01", "2VB-01", "3VB-01", "4VB-01", "5VB-01", "T1Vs-01", "BVB-01", "T2Vs-01", "2BVB", "6VB-01", "7VB-01", "8VB-01", "9VB-01", "10VB-01", "2CVB-01"]
    const BUS3 = ["1CVB-01", "1BVB-01", "1VB-01", "2VB-01", "3VB-01", "4VB-01", "5VB-01", "T1Vs-01", "BVB-01", "T2Vs-01", "2BVB", "6VB-01", "7VB-01", "8VB-01", "9VB-01", "10VB-01", "2CVB-01", "BVB-02", "T3Vs-01", "3BVB-01", "11VB-01", "12VB-01", "13VB-01", "14VB-01", "15VB-01", "3CVB-01"]

    const [Feeders, setFeeder] = useState([])
    const [index_array, setindex] = useState(0)
    const [fetchfeederinfo, setfetchfeederinfo] = useState({
        nameThai: "",
        Feederinfo: ["ไม่มีข้อมูล"],
        result: [],
        feeder_data: []
    })
    const [breakerinfo, setbreakerinfo] = useState({
        code: "",
        MFR: "",
        Type: "",
        SN: "",
        kV: "",
        kA: "",
        A: "",
        type_of_arc: ""
    })

    const initials = {
        checked: false,
    }
    const reducer = (state, action) => {
        switch (action.type) {
            case 'checked':
                return {
                    ...state,
                    checked: action.payload
                }
        }
    }

    const [state, dispatch] = useReducer(reducer, initials)


    const { nameThai, Feederinfo, result, feeder_data } = fetchfeederinfo
    const { substation, locationtest, listtest, sublisttest } = useParams()

    const handleChange = (checked) => {

        axios.post(`${process.env.REACT_APP_API}/updatepermissiontest`, { nameThai: substation, checked })
            .then((res) => {
                dispatch({ type: "checked", payload: res.data.checked })
            })
    }


    const Swl_function = (header, data, icon) => {
        return Swal.fire(
            header,
            data,
            icon
        )
    }

    const fetch = (data = "", index = 0, enable_change = false , reset_index = true ) => {

        if (data) {
            axios.post(`${process.env.REACT_APP_API}/findfeeder`, { nameThai: substation, locationtest })
                .then((res) => {
                    if (res.data.Feeder[index]) {
                        setfetchfeederinfo({ nameThai: res.data.nameThai, Feederinfo: res.data.Feeder[index], feeder_data: res.data.Feeder })
                        prop.setstate({ type: 'fetchnamesub', payload: res.data.Feeder })
                        // setindex(res.data.Feeder[index].findIndex(x => x.code === data))
                        // prop.setstate({ type: 'indexfeeder', payload: res.data.Feeder[index].findIndex(x => x.code === sublisttest) })
                        let indexoffeeder = res.data.Feeder[index].findIndex(x => x.code === sublisttest)
                        indexoffeeder = (indexoffeeder === -1 || reset_index) ? 0 : indexoffeeder
                        setindex(indexoffeeder)
                        prop.setstate({ type: 'indexfeeder', payload: indexoffeeder })
                        dispatch({ type: "checked", payload: res.data.result.permission })
                        prop.setstate({ type: "switch_checked", payload: res.data.result.permission })                        
                        // if (sublisttest !== res.data.Feeder[index][0].code && sublisttest !== undefined && !enable_change) {
                        //     history(`/Test/${substation}/${locationtest}/${listtest}/${res.data.Feeder[index][0].code}`)
                        // }
                        // else if (sublisttest === undefined && !enable_change) {
                        //     history(`/Test/${substation}/${locationtest}/${listtest}/${res.data.Feeder[index][0].code}`)
                        // } else if (enable_change) {
                        //     history(`/Test/${substation}/${locationtest}/${listtest}/${sublisttest}`)
                        // }
                    }
                }).catch(err => {
                    setfetchfeederinfo({ nameThai: "กรุณาเลือกสถานี", Feederinfo: "กรุณาเลือกสถานี" })
                    alert(err)
                })
        } else {
            axios.post(`${process.env.REACT_APP_API}/findfeeder`, { nameThai: substation, locationtest })
                .then((res) => {
                    if (res.data.Feeder[index]) {
                        setfetchfeederinfo({ nameThai: res.data.nameThai, Feederinfo: res.data.Feeder[index], feeder_data: res.data.Feeder })
                        prop.setstate({ type: 'fetchnamesub', payload: res.data.Feeder })
                        // setindex(res.data.Feeder[index].findIndex(x => x.code === sublisttest))
                        // prop.setstate({ type: 'indexfeeder', payload: res.data.Feeder[index].findIndex(x => x.code === sublisttest) })
                        let indexoffeeder = res.data.Feeder[index].findIndex(x => x.code === sublisttest)
                        indexoffeeder = (indexoffeeder === -1 || reset_index) ? 0 : indexoffeeder
                        prop.setstate({ type: 'indexfeeder', payload: indexoffeeder })
                        setindex(indexoffeeder)
                        dispatch({ type: "checked", payload: res.data.result.permission })
                        prop.setstate({ type: "switch_checked", payload: res.data.result.permission })
                        // if (sublisttest !== res.data.Feeder[index][0].code && sublisttest !== undefined && !enable_change) {
                        //     history(`/Test/${substation}/${locationtest}/${listtest}/${res.data.Feeder[index][0].code}`)
                        // }
                        // else if (sublisttest === undefined && !enable_change) {
                        //     history(`/Test/${substation}/${locationtest}/${listtest}/${res.data.Feeder[index][0].code}`)
                        // } else if (enable_change) {
                        //     history(`/Test/${substation}/${locationtest}/${listtest}/${sublisttest}`)
                        // }
                    }
                }).catch(err => {
                    setfetchfeederinfo({ nameThai: "กรุณาเลือกสถานี", Feederinfo: "กรุณาเลือกสถานี" })
                    alert(err)
                })
        }

    }

    useEffect(() => {        
        if(prop.Mainsubstationinfo.nameTest_select === 0){
            fetch("", prop.Mainsubstationinfo.nameTest_select,true,false)
        }else{
             fetch("", 0 ,false,true)
             prop.setstate({ type: 'nameTest', payload: 0 })             
             prop.setstate({ type: 'indexfeeder', payload: 0 })             
        }        
    }, [listtest])

    useEffect(() => {
        fetch("", prop.Mainsubstationinfo.nameTest_select)        
    }, [substation, locationtest, state.checked, prop.Mainsubstationinfo.nameTest_select])

    

    const selectfeeder = (event) => {
        if (listtest !== undefined) {
            const index = event.target.value
            prop.setstate({ type: 'indexfeeder', payload: index })
            setindex(event.target.value)
            history(`/Test/${substation}/${locationtest}/${listtest}/${Feederinfo[index].code}`)
        }
        else if (listtest === undefined) {
            Swl_function("เเจ้งเตือน", "กรุณาเลือกรายการทดสอบก่อน", "warning")
        }
    }

    

    const ADDBUS = (BUS) => {
        Swal.fire({
            title: "เพิ่มข้อมูล Feeder",
            html: `<div class="containers">
                            <div class="subcontainer">                                
                                <div class="name">
                                    <textarea class="form-control" id="BUSs">${BUS}</textarea> 
                                </div>                                
                        </div>`,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#1fbf31',
            focusConfirm: false,
            confirmButtonText: 'เพิ่ม Feeder',
            preConfirm: () => {
                const BUS = Swal.getPopup().querySelector('#BUSs').value
                return { BUS }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const data = result.value.BUS
                const arr = data.split(",");

                let namesub_feeder = arr.map(data => {
                    /* สร้าง container เพื่อทำการแปลงข้อมูลเเล้วทำการส่งออกไปเป็น object */
                    /* สำหรับ รีเทิร์นชื่อ counter */
                    // const nameFeeder = arr.map(data2 =>{
                    //     const Counter = {};
                    //     Counter.nameFeeder = `${prop.Mainsubstationinfo.initialsEng}${data2}`
                    //     return Counter;
                    // })
                    // const container = {Counter:nameFeeder};                    
                    const container = {};
                    container.code = `${prop.Mainsubstationinfo.initialsEng}${data}`
                    return container
                })

                const Counter = arr.map(data => {
                    const container = {};
                    container.nameFeeder = `${prop.Mainsubstationinfo.initialsEng}${data}`
                    container.Feeder_Counter = ""
                    return container
                })

                await setFeeder(namesub_feeder)
                await axios.post(`${process.env.REACT_APP_API}/addfeeder`, {
                    nameThai: substation, initialsThai: prop.Mainsubstationinfo.initialsThai,
                    nameEng: prop.Mainsubstationinfo.nameEng, initialsEng: prop.Mainsubstationinfo.initialsEng,
                    affiliation: prop.Mainsubstationinfo.affiliation, locationtest, Feeder: [namesub_feeder], Counter
                })
                    .then((res) => {
                        alert(res.data.res)
                        // history(`/Test/${substation}/${locationtest}/${listtest}/${sublisttest}`)
                    })
                    .catch((err) => alert(err))
            }
        })
    }

    const delnametest = (feederinfo) => {
        const option_select = feederinfo.map((data, index) => {
            return data[0].nameTest
        })
        Swal.fire({
            title: "Are you sure?",
            input: "select",
            text: "Please Select Feeder",
            type: "warning",
            inputOptions: {
                ...option_select
            },

            inputPlaceholder: "Select",
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value) {
                        resolve()
                    } else {
                        resolve('You need to select')
                    }
                })
            },
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`${process.env.REACT_APP_API}/deletenametest`, { nameThai: substation, nameTest: feederinfo[result.value][0].nameTest, index_array: result.value })
                    .then((res) => {
                        Swal.fire(
                            'Warning',
                            res.data.res,
                            'success'
                        ).then(() => {
                            history(`/Test/${substation}/${locationtest}`)
                        })
                    })

            }
        })
    }

    const Createnewtest = (Feederinfo) => {
        const getyear = new Date().getFullYear()
        const previousFeeder = Feederinfo.map((data, index) => {
            return data.code
        })
        Swal.fire({
            title: "New Test",
            html:
                `<div class="containers">                        
                <div class="name">
                    <div class="head1">Name Test</div>
                    <input type="text" id="NameTest" class="form-control" value="${getyear}"/>
                </div> 
                <div class="name">
                    <div class="head1">Feeder</div>
                    <textarea class="form-control" id="Feeder">${previousFeeder}</textarea>
                </div> 
             
            </div>`
            ,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#1fbf31',
            confirmButtonText: 'ยืนยัน',
            preConfirm: () => {
                const NameTest = Swal.getPopup().querySelector('#NameTest').value
                const Feeder = Swal.getPopup().querySelector('#Feeder').value
                if (!NameTest || !Feeder) {
                    Swal.showValidationMessage(`กรอกข้อมูลไม่ครบ`)
                }
                return { NameTest, Feeder }
            }
        })
            .then((result) => {
                if (result.isConfirmed) {
                    const arr = result.value.Feeder.split(",");
                    let newtest = arr.map((data, index) => {
                        /*For find data from array */
                        const index_code = Feederinfo.findIndex(x => x.code === data)
                        const container = {};
                        if (index_code < 0) {
                            container.nameTest = result.value.NameTest
                            container.code = data
                            container.MFR = "ไม่มีข้อมูล"
                            container.Type = "ไม่มีข้อมูล"
                            container.SN = "ไม่มีข้อมูล"
                            container.kV = "ไม่มีข้อมูล"
                            container.kA = "ไม่มีข้อมูล"
                            container.A = "ไม่มีข้อมูล"
                            return container
                        } else {
                            container.nameTest = result.value.NameTest
                            container.code = data
                            container.MFR = Feederinfo[index_code].MFR
                            container.Type = Feederinfo[index_code].Type
                            container.SN = Feederinfo[index_code].SN
                            container.kV = Feederinfo[index_code].kV
                            container.kA = Feederinfo[index_code].kA
                            container.A = Feederinfo[index_code].A
                            return container
                        }
                    })
                    axios.post(`${process.env.REACT_APP_API}/updatenametest`, { nameThai: substation, nameTest: newtest })
                        .then((res) => {
                            Swal.fire(
                                "เเจ้งเตือน",
                                res.data.res
                            )
                                .then(() => {
                                    history(`/Test/${substation}/${locationtest}`)
                                })
                        })
                }
            })
    }

    const ADDFeeder = () => {

        Swal.fire({
            title: "เลือกจำนวน Feeder",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: '#1fbf31',
            cancelButtonColor: '#d33',
            denyButtonColor: '#f0df13',
            cancelButtonText: '3BUS',
            denyButtonText: `2BUS`,
            confirmButtonText: '1BUS',
        }).then(async (result) => {
            if (result.isConfirmed) {
                ADDBUS(BUS1)
            } else if (result.isDenied) {
                ADDBUS(BUS2)
            }
            else if (result.dismiss === Swal.DismissReason.cancel) {
                ADDBUS(BUS3)
            }

        }
        )
    }
    const EditFeeder = (data) => {
        console.log(data)
        Swal.fire({
            title: "ข้อมูล Feeder",
            html: `<div class="containers">
            <div class="subcontainer">               
                <div class="name">
                    <div class="head1">Code</div>
                    <input type="text" id="code_edit" class="form-control" value="${data.code}"/>
                </div>
                <div class="name">
                    <div class="head1" >MFR</div>
                    <input type="text" id="MFR_edit" class="form-control" value="${data.MFR}"/>
                </div>
                <div class="name">
                    <div class="head1">Type</div>
                    <input type="text" id="Type_edit" class="form-control" value="${data.Type}"/>
                </div>
                <div class="name">
                    <div class="head1">Serial number</div>
                    <input type="text" id="SN_edit" class="form-control" value="${data.SN}"/>
                </div>
                <div class="name">
                    <div class="head1">kV</div>
                    <input type="text" id="kV_edit" class="form-control" value="${data.kV}"/>
                </div> 
                <div class="name">
                    <div class="head1">kA</div>
                    <input type="text" id="kA_edit" class="form-control" value="${data.kA}"/>
                </div> 
                <div class="name">
                    <div class="head1">A</div>
                    <input type="text" id="A_edit" class="form-control" value="${data.A}"/>
                </div> 
            </div> 
        </div>`,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#1fbf31',
            focusConfirm: false,
            confirmButtonText: 'เพิ่ม Feeder',
            preConfirm: () => {
                const code = Swal.getPopup().querySelector('#code_edit').value
                const MFR = Swal.getPopup().querySelector('#MFR_edit').value
                const Type = Swal.getPopup().querySelector('#Type_edit').value
                const SN = Swal.getPopup().querySelector('#SN_edit').value
                const kV = Swal.getPopup().querySelector('#kV_edit').value
                const kA = Swal.getPopup().querySelector('#kA_edit').value
                const A = Swal.getPopup().querySelector('#A_edit').value
                if (!code || !MFR || !Type || !SN || !kV || !kA || !A) {
                    Swal.showValidationMessage(`กรอกข้อมูลไม่ครบ`)
                }
                return { code, MFR, Type, SN, kV, kA, A }
            }
        })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(`${process.env.REACT_APP_API}/Edit_update_feeder`, { ...result.value, Feeder: sublisttest, nameThai: substation, index_array: prop.Mainsubstationinfo.nameTest_select, index_feeder: index_array }, {
                        headers: {
                            authorization: `Bearer ${getToken()}`
                        }
                    })
                        .then(async (res) => {
                            if (res.data.res === "แก้ไขข้อมูลสำเร็จ") {
                                await history(`/Test/${substation}/${locationtest}/${listtest}/${sublisttest}`)
                                await Swl_function('เเจ้งเตือน', res.data.res, 'success')
                                // .then(async () => {
                                await fetch(result.value.code, prop.Mainsubstationinfo.nameTest_select, true)
                                // })
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
    
    return (
        <div style={{ width: "auto" }}>
            <div className="my-3 row  d-flex justify-content-center align-items-center">
                <div className="col-lg-5 col-md-6 col-sm-12">
                    <div className="input-group d-flex justify-content-center">
                        <span className="input-group-text" id="inputGroup-sizing-default">Feeder</span>
                        <select className="form-select" value={index_array} onChange={selectfeeder}>
                            {/* <option className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value="รายการทดสอบ" >รายการทดสอบ</option> */}
                            {Feederinfo.map((data, index) => (
                                <option className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={index} key={uuidv4()}>{data.code}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 d-flex justify-content-center button-menu align-items-center">
                    {((Feederinfo.length < 2) && Feederinfo !== "") && <button className="btn btn-success ms-3" onClick={ADDFeeder}>ADD</button>}
                    <button className="btn btn-warning ms-3" onClick={() => EditFeeder(Feederinfo[index_array])}>Edit</button>
                    <button className="btn btn-warning ms-3" onClick={() => Createnewtest(Feederinfo)}>New</button>
                    <button className="btn btn-danger ms-3" onClick={() => delnametest(feeder_data)}>Del</button>
                    <Switch className="mx-3" onChange={handleChange} checked={state.checked} />
                </div>
            </div>

        </div>
    )
}

export default Feeder;