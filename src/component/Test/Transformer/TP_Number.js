import { v4 as uuidv4 } from 'uuid'
import "../../../css/transformer.css"
import "../../../css/Sweetalert.css"
import Swal from 'sweetalert2'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useReducer, useState } from 'react'
import axios from 'axios'
import { getToken } from '../../../service/service'


const TP_Number = (prop) => {

    // console.log(prop)
    const Number_TP_Test = ["TP1", "TP2"]
    const { substation, locationtest, listtest, sublisttest } = useParams()
    const [TP_select, Set_TP_select] = useState(0)
    const history = useNavigate()

    const TP1 = ["TP1"]
    const TP2 = ["TP1", "TP2"]
    const TP3 = ["TP1", "TP2", "TP3"]


    // Concept คือเมื่อเลือกข้อมูลข้อมูลจะส่งไปยังลิ้ง usenavigate จากนั้นนำข้อมูลใน usenave มาหา Array เเล้วเอา เลข Array มาใช้เลือกเมนูในที่เลือก
    //ข้อดีของการทำแบบนี้คือ สามารถใช้งานได้ทั้งการ พิม URL TP1/TP2 เองหรือการเลือกที่หน้าเมนู
    useEffect(()=>{        
        if((prop.transformer[prop.nameTest_select].findIndex(x => x.TP === sublisttest)) == -1){
            Set_TP_select(0)
            history(`/Test/${substation}/${locationtest}/Testform/`)
        } else{
            Set_TP_select(prop.transformer[prop.nameTest_select].findIndex(x => x.TP === sublisttest)) 
            prop.setstate({ type: "setstate", payload: { name: "TP_select", value: prop.transformer[prop.nameTest_select].findIndex(x => x.TP === sublisttest) } })      
        }    
        
    },[sublisttest])

    useEffect(()=>{ 
        console.log(99999)  
        history(`/Test/${substation}/${locationtest}/Testform/`)     
        Set_TP_select(0)        
        prop.setstate({ type: "setstate", payload: { name: "TP_select", value: 0 } })
    },[prop.nameTest_select])
    
    
    const initials = {
        data_from_test_transformer: [[]]
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case "setstate":
                return {
                    ...state,
                    [action.payload.name]: action.payload.value
                }
        }
    }
    const [state, dispatch] = useReducer(reducer, initials)

    const Swl_function = (header, data, icon) => {
        return Swal.fire(
            header,
            data,
            icon
        )
    }

    // const fetch = () => {
    //     axios.post(`${process.env.REACT_APP_API}/findTP`, { nameThai: substation })
    //         .then((res) => {
    //             dispatch({ type: "setstate", payload: { name: "data_from_test_transformer", value: res.data.Transformer} })
    //             console.log(res.data.Transformer[prop.nameTest_select])
    //             console.log(prop.nameTest_select)
    //         })
    // }

    // useEffect(() => {
    //     fetch();
    // }, [prop.nameTest_select])

    // สำหรับการดึงชื่อ TP ออกมาเมื่อมีการเปลี่ยนแปลง nameTest

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

                let TP_No = arr.map(data => {
                    const container = {};
                    container.TP = `${data}`
                    return container
                })
                await axios.post(`${process.env.REACT_APP_API}/addTP`, {
                    nameThai: substation,
                    initialsThai: prop.Mainsubstationinfo.initialsThai,
                    nameEng: prop.Mainsubstationinfo.nameEng,
                    initialsEng: prop.Mainsubstationinfo.initialsEng,
                    affiliation: prop.Mainsubstationinfo.affiliation,
                    locationtest,
                    Transformer: [TP_No] // ข้อม้อสำคัญสำหรับการใช้งาน
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
                axios.post(`${process.env.REACT_APP_API}/deletenametest_Transformer`, { nameThai: substation, nameTest: feederinfo[result.value][0].nameTest, index_array: result.value })
                    .then((res) => {
                        Swal.fire(
                            'Warning',
                            res.data.res,
                            'success'
                        ).then(() => {
                            history(`/Test/${substation}/${locationtest}`)
                            prop.fetch()
                        })
                    })

            }
        })
    }

    const Createnewtest = (pre_TP) => {
        const getyear = new Date().getFullYear()
        const previousTP = pre_TP.map((data, index) => {
            return data.TP
        })

        // const previousFeeder = ""
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
                    <textarea class="form-control" id="TP">${previousTP}</textarea>
                </div> 
             
            </div>`
            ,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#1fbf31',
            confirmButtonText: 'ยืนยัน',
            preConfirm: () => {
                const NameTest = Swal.getPopup().querySelector('#NameTest').value
                const TP = Swal.getPopup().querySelector('#TP').value
                if (!NameTest || !TP) {
                    Swal.showValidationMessage(`กรอกข้อมูลไม่ครบ`)
                }
                return { NameTest, TP }
            }
        })
            .then((result) => {
                if (result.isConfirmed) {
                    const arr = result.value.TP.split(",");
                    let newtest = arr.map((data, index) => {
                        /*For find data from array */
                        const index_code = pre_TP.findIndex(x => x.TP === data)
                        const container = {};
                        if (index_code < 0) {
                            container.nameTest = result.value.NameTest
                            container.TP = data
                            container.MFR = "ไม่มีข้อมูล"
                            container.PEA_No = "ไม่มีข้อมูล"
                            container.SN = "ไม่มีข้อมูล"
                            container.Years = "ไม่มีข้อมูล"
                            container.MVA = "ไม่มีข้อมูล"
                            container.Percent_Impedance = "ไม่มีข้อมูล"
                            container.Type_OLTC = "ไม่มีข้อมูล"
                            container.Type_Motor_Drive = "ไม่มีข้อมูล"
                            container.Type_Oil_Filter = "ไม่มีข้อมูล"
                            container.Type_AVR = "ไม่มีข้อมูล"
                            container.Type_VT = "ไม่มีข้อมูล"
                            container.HV_Bushing = "ไม่มีข้อมูล"
                            container.LV_Bushing = "ไม่มีข้อมูล"
                            container.Buczhol_Relay = "ไม่มีข้อมูล"
                            container.Protective_Relay = "ไม่มีข้อมูล"
                            container.PRD_Maintank = "ไม่มีข้อมูล"
                            container.PRD_OLTC = "ไม่มีข้อมูล"
                            container.Winding_Temp = "ไม่มีข้อมูล"
                            container.Oil_Temp = "ไม่มีข้อมูล"
                            container.Fan = "ไม่มีข้อมูล"
                            container.Trafoguard = "ไม่มีข้อมูล"
                            return container
                        } else {
                            container.nameTest = result.value.NameTest
                            container.TP = data
                            container.MFR = pre_TP[index_code].MFR
                            container.PEA_No = pre_TP[index_code].PEA_No
                            container.SN = pre_TP[index_code].SN
                            container.Years = pre_TP[index_code].Years
                            container.MVA = pre_TP[index_code].MVA
                            container.Percent_Impedance = pre_TP[index_code].Percent_Impedance
                            container.Type_OLTC = pre_TP[index_code].Type_OLTC
                            container.Type_Motor_Drive = pre_TP[index_code].Type_Motor_Drive
                            container.Type_Oil_Filter = pre_TP[index_code].Type_Oil_Filter
                            container.Type_AVR = pre_TP[index_code].Type_AVR
                            container.Type_VT = pre_TP[index_code].Type_VT
                            container.HV_Bushing = pre_TP[index_code].HV_Bushing
                            container.LV_Bushing = pre_TP[index_code].LV_Bushing
                            container.Buczhol_Relay = pre_TP[index_code].Buczhol_Relay
                            container.Protective_Relay = pre_TP[index_code].Protective_Relay
                            container.PRD_Maintank = pre_TP[index_code].PRD_Maintank
                            container.PRD_OLTC = pre_TP[index_code].PRD_OLTC
                            container.Winding_Temp = pre_TP[index_code].Winding_Temp
                            container.Oil_Temp = pre_TP[index_code].Oil_Temp
                            container.Fan = pre_TP[index_code].Fan
                            container.Trafoguard = pre_TP[index_code].Trafoguard
                            return container
                        }
                    })
                    axios.post(`${process.env.REACT_APP_API}/updatenametest_Transformer`, { nameThai: substation, nameTest: newtest })
                        .then((res) => {
                            Swal.fire(
                                "เเจ้งเตือน",
                                res.data.res
                            )
                                .then(() => {
                                    history(`/Test/${substation}/${locationtest}`)
                                    prop.fetch()
                                })
                        })
                }
            })
    }

    const ADDTP = () => {

        Swal.fire({
            title: "เลือกจำนวน Feeder",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: '#1fbf31',
            cancelButtonColor: '#d33',
            denyButtonColor: '#f0df13',
            cancelButtonText: '3TP',
            denyButtonText: `2TP`,
            confirmButtonText: '1TP',
        }).then(async (result) => {
            if (result.isConfirmed) {
                ADDBUS(TP1)
            } else if (result.isDenied) {
                ADDBUS(TP2)
            }
            else if (result.dismiss === Swal.DismissReason.cancel) {
                ADDBUS(TP3)
            }

        }
        )
    }
    const EditFeeder = (data) => {
        Swal.fire({
            title: "ข้อมูล Feeder",
            html: `<div class="containers">
            <div class="subcontainer"> 
                <div class="name">
                    <div class="head1" >TP</div>
                    <input type="text" id="TP_edit" class="form-control" value="${data.TP}"/>
                </div>
                <div class="name">
                    <div class="head1" >MFR</div>
                    <input type="text" id="MFR_edit" class="form-control" value="${data.MFR}"/>
                </div>
                <div class="name">
                    <div class="head1">PEA_No</div>
                    <input type="text" id="PEA_No_edit" class="form-control" value="${data.PEA_No}"/>
                </div>
                <div class="name">
                    <div class="head1">Serial number</div>
                    <input type="text" id="SN_edit" class="form-control" value="${data.SN}"/>
                </div>
                <div class="name">
                    <div class="head1">Years</div>
                    <input type="text" id="Years_edit" class="form-control" value="${data.Years}"/>
                </div> 
                <div class="name">
                    <div class="head1">MVA</div>
                    <input type="text" id="MVA_edit" class="form-control" value="${data.MVA}"/>
                </div> 
                <div class="name">
                    <div class="head1">Percent Impedance</div>
                    <input type="text" id="Percent_Impedance_edit" class="form-control" value="${data.Percent_Impedance}"/>
                </div>
                <div class="name">
                    <div class="head1">Type OLTC</div>
                    <input type="text" id="Type_OLTC_edit" class="form-control" value="${data.Type_OLTC}"/>
                </div>  
                <div class="name">
                    <div class="head1">Type Motor Drive</div>
                    <input type="text" id="Type_Motor_Drive_edit" class="form-control" value="${data.Type_Motor_Drive}"/>
                </div>  
                <div class="name">
                    <div class="head1">Type Oil Filter</div>
                    <input type="text" id="Type_Oil_Filter_edit" class="form-control" value="${data.Type_Oil_Filter}"/>
                </div>  
                <div class="name">
                    <div class="head1">Type AVR</div>
                    <input type="text" id="Type_AVR_edit" class="form-control" value="${data.Type_AVR}"/>
                </div>  
                <div class="name">
                    <div class="head1">Type VT</div>
                    <input type="text" id="Type_VT_edit" class="form-control" value="${data.Type_VT}"/>
                </div>  
                <div class="name">
                    <div class="head1">HV Bushing</div>
                    <input type="text" id="HV_Bushing_edit" class="form-control" value="${data.HV_Bushing}"/>
                </div>  
                <div class="name">
                    <div class="head1">LV Bushing</div>
                    <input type="text" id="LV_Bushing_edit" class="form-control" value="${data.LV_Bushing}"/>
                </div>  
                <div class="name">
                    <div class="head1">Buczhol Relay</div>
                    <input type="text" id="Buczhol_Relay_edit" class="form-control" value="${data.Buczhol_Relay}"/>
                </div>  
                <div class="name">
                    <div class="head1">Protective Relay</div>
                    <input type="text" id="Protective_Relay_edit" class="form-control" value="${data.Protective_Relay}"/>
                </div>  
                <div class="name">
                    <div class="head1">PRD Maintank</div>
                    <input type="text" id="PRD_Maintank_edit" class="form-control" value="${data.PRD_Maintank}"/>
                </div>  
                <div class="name">
                    <div class="head1">PRD OLTC</div>
                    <input type="text" id="PRD_OLTC_edit" class="form-control" value="${data.PRD_OLTC}"/>
                </div>  
                <div class="name">
                    <div class="head1">Winding Temp</div>
                    <input type="text" id="Winding_Temp_edit" class="form-control" value="${data.Winding_Temp}"/>
                </div>  
                <div class="name">
                    <div class="head1">Oil Temp</div>
                    <input type="text" id="Oil_Temp_edit" class="form-control" value="${data.Oil_Temp}"/>
                </div>  
                <div class="name">
                    <div class="head1">Fan</div>
                    <input type="text" id="Fan_edit" class="form-control" value="${data.Fan}"/>
                </div>  
                <div class="name">
                    <div class="head1">Trafoguard</div>
                    <input type="text" id="Trafoguard_edit" class="form-control" value="${data.Trafoguard}"/>
                </div>  
            </div> 
        </div>`,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#1fbf31',
            focusConfirm: false,
            confirmButtonText: 'เพิ่ม Feeder',
            preConfirm: () => {                
                const TP = Swal.getPopup().querySelector('#TP_edit').value
                const MFR = Swal.getPopup().querySelector('#MFR_edit').value
                const PEA_No = Swal.getPopup().querySelector('#PEA_No_edit').value
                const SN = Swal.getPopup().querySelector('#SN_edit').value
                const Years = Swal.getPopup().querySelector('#Years_edit').value
                const MVA = Swal.getPopup().querySelector('#MVA_edit').value
                const Percent_Impedance = Swal.getPopup().querySelector('#Percent_Impedance_edit').value
                const Type_OLTC = Swal.getPopup().querySelector('#Type_OLTC_edit').value
                const Type_Motor_Drive = Swal.getPopup().querySelector('#Type_Motor_Drive_edit').value
                const Type_Oil_Filter = Swal.getPopup().querySelector('#Type_Oil_Filter_edit').value
                const Type_AVR = Swal.getPopup().querySelector('#Type_AVR_edit').value
                const Type_VT = Swal.getPopup().querySelector('#Type_VT_edit').value
                const HV_Bushing = Swal.getPopup().querySelector('#HV_Bushing_edit').value
                const LV_Bushing = Swal.getPopup().querySelector('#LV_Bushing_edit').value
                const Buczhol_Relay = Swal.getPopup().querySelector('#Buczhol_Relay_edit').value
                const Protective_Relay = Swal.getPopup().querySelector('#Protective_Relay_edit').value
                const PRD_Maintank = Swal.getPopup().querySelector('#PRD_Maintank_edit').value
                const PRD_OLTC = Swal.getPopup().querySelector('#PRD_OLTC_edit').value
                const Winding_Temp = Swal.getPopup().querySelector('#Winding_Temp_edit').value
                const Oil_Temp = Swal.getPopup().querySelector('#Oil_Temp_edit').value
                const Fan = Swal.getPopup().querySelector('#Fan_edit').value
                const Trafoguard = Swal.getPopup().querySelector('#Trafoguard_edit').value
                
                if (!TP || !MFR || !PEA_No || !SN || !Years || !MVA || !Percent_Impedance || !Type_OLTC || !Type_Motor_Drive || !Type_Oil_Filter || !Type_AVR || !Type_VT || !HV_Bushing || !LV_Bushing || !Buczhol_Relay || !Protective_Relay || !PRD_Maintank || !PRD_OLTC || !Winding_Temp || !Oil_Temp || !Fan || !Trafoguard) {
                    Swal.showValidationMessage(`กรอกข้อมูลไม่ครบ`)
                }
                return { TP,MFR,PEA_No,SN,Years,MVA,Percent_Impedance,Type_OLTC,Type_Motor_Drive,Type_Oil_Filter,Type_AVR,Type_VT,HV_Bushing,LV_Bushing,Buczhol_Relay,Protective_Relay,PRD_Maintank,PRD_OLTC,Winding_Temp,Oil_Temp,Fan,Trafoguard }
            }
        })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(`${process.env.REACT_APP_API}/Edit_update_Transformer`, { ...result.value, Feeder: sublisttest, nameThai: substation, nameTest_select: prop.nameTest_select, TP_select }, {
                        headers: {
                            authorization: `Bearer ${getToken()}`
                        }
                    })
                        .then(async (res) => {
                            if (res.data.res === "แก้ไขข้อมูลสำเร็จ") {                                
                                await prop.fetch()
                                await history(`/Test/${substation}/${locationtest}/${listtest}/${sublisttest}`)
                                await Swl_function('เเจ้งเตือน', "เเก้ไขสำเร็จ", 'success')
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
    // console.log(prop.transformer[0][0].nameTest)
    const Select_TP = (e) =>{
        
        history(`/Test/${substation}/${locationtest}/Testform/${prop.transformer[prop.nameTest_select][e.target.value].TP}`)
    }

    
    return (
        <div>
            <div className="d-flex justify-content-center row my-3">
                <div className="subcontainer d-flex justify-content-center col-lg-5 col-md-7 col-sm-12 border align-items-center">
                    <div className="input-group">
                        <span className="input-group-text" id="inputGroup-sizing-default">Number No.</span>
                        <select className="form-select" onChange={Select_TP} value={TP_select}>
                            {/* <option class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value="รายการทดสอบ" >รายการทดสอบ</option> */}
                            {prop.transformer[prop.nameTest_select].map((data, index) => (
                                <option className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" key={uuidv4()} value={index}>{data.TP}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="col-lg-2 col-md-4 col-sm-12 d-flex justify-content-center border">
                    {((prop.transformer.length < 1) || prop.transformer[0][0].nameTest === "ไม่มีข้อมูล") && <button className="btn btn-success ms-3" onClick={() => ADDTP()}>ADD</button>}
                    <button className="btn btn-warning ms-3" onClick={() => EditFeeder(prop.transformer[prop.nameTest_select][TP_select])}>Edit</button>
                    <button className="btn btn-warning ms-3" onClick={() => Createnewtest(prop.transformer[prop.nameTest_select])}>New</button>
                    <button className="btn btn-danger ms-3" onClick={() => delnametest(prop.transformer)}>Del</button>
                </div>

            </div>

        </div>
    )
}

export default TP_Number;