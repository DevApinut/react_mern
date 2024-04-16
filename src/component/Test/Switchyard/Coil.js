import axios from "axios"
import { useReducer, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getToken } from "../../../service/service"
import Swal from "sweetalert2"
import { v4 as uuidv4 } from 'uuid'

const Coil = (prop) => {

    const initials = {
        PhaseA_Time_close: "",
        PhaseA_Time_open1: "",
        PhaseA_Time_open2: "",
        PhaseA_Res_close: "",
        PhaseA_Res_open1: "",
        PhaseA_Res_open2: "",
        PhaseA_Current_close:"",
        PhaseA_Current_open1:"",
        PhaseA_Current_open2:"",

        PhaseB_Time_close: "",
        PhaseB_Time_open1: "",
        PhaseB_Time_open2: "",
        PhaseB_Res_close: "",
        PhaseB_Res_open1: "",
        PhaseB_Res_open2: "",
        PhaseB_Current_close:"",
        PhaseB_Current_open1:"",
        PhaseB_Current_open2:"",

        PhaseC_Time_close: "",
        PhaseC_Time_open1: "",
        PhaseC_Time_open2: "",
        PhaseC_Res_close: "",
        PhaseC_Res_open1: "",
        PhaseC_Res_open2: "",
        PhaseC_Current_close:"",
        PhaseC_Current_open1:"",
        PhaseC_Current_open2:"",
             
        PhaseA_Time_close_log: "",
        PhaseA_Time_open1_log: "",
        PhaseA_Time_open2_log: "",
        PhaseA_Res_close_log: "",
        PhaseA_Res_open1_log: "",
        PhaseA_Res_open2_log: "",
        PhaseA_Current_close_log:"",
        PhaseA_Current_open1_log:"",
        PhaseA_Current_open2_log:"",

        PhaseB_Time_close_log: "",
        PhaseB_Time_open1_log: "",
        PhaseB_Time_open2_log: "",
        PhaseB_Res_close_log: "",
        PhaseB_Res_open1_log: "",
        PhaseB_Res_open2_log: "",
        PhaseB_Current_close_log:"",
        PhaseB_Current_open1_log:"",
        PhaseB_Current_open2_log:"",

        PhaseC_Time_close_log: "",
        PhaseC_Time_open1_log: "",
        PhaseC_Time_open2_log: "",
        PhaseC_Res_close_log: "",
        PhaseC_Res_open1_log: "",
        PhaseC_Res_open2_log: "",
        PhaseC_Current_close_log:"",
        PhaseC_Current_open1_log:"",
        PhaseC_Current_open2_log:"",

        nameTest: [],
        index_old_data: 0,
        index_new_data: 0,
    }

    const { substation, sublisttest } = useParams();
    const reducer = (state, action) => {
        switch (action.type) {
            case 'change_state':
                return { ...state, [action.payload.name]: action.payload.value }
            case 'Update_coil':
                return {
                    ...state,
                    PhaseA_Time_close_log: action.payload.PhaseA_Time_close,
                    PhaseA_Time_open1_log: action.payload.PhaseA_Time_open1,
                    PhaseA_Time_open2_log: action.payload.PhaseA_Time_open2,
                    PhaseA_Res_close_log: action.payload.PhaseA_Res_close,
                    PhaseA_Res_open1_log: action.payload.PhaseA_Res_open1,
                    PhaseA_Res_open2_log: action.payload.PhaseA_Res_open2,
                    PhaseA_Current_close_log: action.payload.PhaseA_Current_close,
                    PhaseA_Current_open1_log: action.payload.PhaseA_Current_open1,
                    PhaseA_Current_open2_log: action.payload.PhaseA_Current_open2,

                    PhaseB_Time_close_log: action.payload.PhaseB_Time_close,
                    PhaseB_Time_open1_log: action.payload.PhaseB_Time_open1,
                    PhaseB_Time_open2_log: action.payload.PhaseB_Time_open2,
                    PhaseB_Res_close_log: action.payload.PhaseB_Res_close,
                    PhaseB_Res_open1_log: action.payload.PhaseB_Res_open1,
                    PhaseB_Res_open2_log: action.payload.PhaseB_Res_open2,
                    PhaseB_Current_close_log: action.payload.PhaseB_Current_close,
                    PhaseB_Current_open1_log: action.payload.PhaseB_Current_open1,
                    PhaseB_Current_open2_log: action.payload.PhaseB_Current_open2,
                    
                    PhaseC_Time_close_log: action.payload.PhaseC_Time_close,
                    PhaseC_Time_open1_log: action.payload.PhaseC_Time_open1,
                    PhaseC_Time_open2_log: action.payload.PhaseC_Time_open2,
                    PhaseC_Res_close_log: action.payload.PhaseC_Res_close,
                    PhaseC_Res_open1_log: action.payload.PhaseC_Res_open1,
                    PhaseC_Res_open2_log: action.payload.PhaseC_Res_open2,
                    PhaseC_Current_close_log: action.payload.PhaseC_Current_close,
                    PhaseC_Current_open1_log: action.payload.PhaseC_Current_open1,
                    PhaseC_Current_open2_log: action.payload.PhaseC_Current_open2,

                }
            case 'fetchnametest':
                return {
                    ...state,
                    nameTest: action.payload.nameTest
                }
            case 'select_old_data':
                return {
                    ...state,
                    index_old_data: action.payload.index
                }
            case 'select_new_data':
                return {
                    ...state,
                    index_new_data: action.payload.index
                }
            case 'reset':
                return { ...action.payload }
        }
    }

    const [state, dispatch] = useReducer(reducer, initials)
    const UpdateCoil = (e) => {
        console.log(substation)
        console.log(sublisttest)
        console.log(state)
        console.log(state.index_new_data)
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_API}/UpdateCoil_Switchyard`, { nameThai: substation, Feeder: sublisttest, ...state, index_array: state.index_new_data }, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                alert(res.data.res)
                fetch(substation, state.index_old_data)
            })
            .catch(err => {
                alert(err)
            })
    }

    const fetch = (nameThai, index = 0) => {
        // if (sublisttest !== undefined) {
        // console.log(prop.index_feeder)
        axios.post(`${process.env.REACT_APP_API}/fetchdatatest`, { nameThai }, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
            .then(res => {
                // console.log(prop.index_feeder)
                dispatch({ type: 'Update_coil', payload: { ...res.data.result.Switch_yard[index][prop.index_feeder].Coil } })
                dispatch({ type: 'fetchnametest', payload: { nameTest: res.data.result.Switch_yard } })
            }).catch(err => {
                // alert(err)
            })
        // }
    }
    useEffect(() => {
        fetch(substation, state.index_old_data)
        // dispatch({ type: 'reset', payload: initials })
    }, [prop.index_feeder])
    const select_old_data = (e) => {
        dispatch({ type: "select_old_data", payload: { index: e.target.value } })
        dispatch({ type: "select_new_data", payload: { index: e.target.value } })
        prop.setstate({ type: "nameTest", payload: e.target.value })
        fetch(substation, e.target.value)
    }
    const select_new_data = (e) => {
        dispatch({ type: "select_new_data", payload: { index: e.target.value } })
        prop.setstate({ type: "nameTest", payload: e.target.value })
    }
    const show_data=(data,type_test1,type_test2)=>{
        
        const fetch_A = eval(`state.PhaseA_${type_test1}_${type_test2}_log`)        
        const fetch_B = eval(`state.PhaseB_${type_test1}_${type_test2}_log`)        
        const fetch_C = eval(`state.PhaseC_${type_test1}_${type_test2}_log`)        
        
        Swal.fire({
            title: `${type_test1}  ${type_test2}`,
            html: `<div class="containers">
                            <div class="subcontainer">                                
                                <div class="name">
                                    <div class="head1">PhaseA</div>
                                    <div class="form-control" id="BUSs">${fetch_A}</div> 
                                </div>                                
                                <div class="name">
                                    <div class="head1">PhaseB</div>
                                    <div class="form-control" id="BUSs">${fetch_B}</div> 
                                </div>                                
                                <div class="name">
                                    <div class="head1">PhaseC</div>
                                    <div class="form-control" id="BUSs">${fetch_C}</div> 
                                </div>                                
                        </div>`,
            // showCancelButton: true,
            // cancelButtonColor: '#d33',                     
        })
    }
    return (
        <div>
            <form onSubmit={UpdateCoil}>
                <div className="d-flex justify-content-center">
                    <div className="text-center"><h4>Coil test</h4></div>
                    <button className="btn btn-success mx-3" disabled={!prop.checked}>ส่งข้อมูล</button>
                </div>
                <div className="d-flex justify-content-center">
                    <div className="text-center my-3 mx-1">ข้อมูล</div>
                    <div className="text-center my-3" style={{ width: '100px' }}>
                        <select className="form-select" value={state.index_old_data} onChange={select_old_data}>
                            {state.nameTest.map((data, index) => (
                                <option value={index} key={uuidv4()}>{data[0].nameTest}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="d-flex justify-content-center">                    
                    <div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" >Close &nbsp; (T)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-A"aria-describedby="inputGroup-sizing-default" value={state.PhaseA_Time_close} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseA_Time_close", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-B"aria-describedby="inputGroup-sizing-default" value={state.PhaseB_Time_close} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseB_Time_close", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-C"aria-describedby="inputGroup-sizing-default" value={state.PhaseC_Time_close} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseC_Time_close", value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" >Open1 (T)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-A"aria-describedby="inputGroup-sizing-default" value={state.PhaseA_Time_open1} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseA_Time_open1", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-B"aria-describedby="inputGroup-sizing-default" value={state.PhaseB_Time_open1} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseB_Time_open1", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-C"aria-describedby="inputGroup-sizing-default" value={state.PhaseC_Time_open1} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseC_Time_open1", value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" >Open2 (T)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-A"aria-describedby="inputGroup-sizing-default" value={state.PhaseA_Time_open2} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseA_Time_open2", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-B"aria-describedby="inputGroup-sizing-default" value={state.PhaseB_Time_open2} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseB_Time_open2", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-C"aria-describedby="inputGroup-sizing-default" value={state.PhaseC_Time_open2} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseC_Time_open2", value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" >Close &nbsp; (R)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-A"aria-describedby="inputGroup-sizing-default" value={state.PhaseA_Res_close} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseA_Res_close", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-B"aria-describedby="inputGroup-sizing-default" value={state.PhaseB_Res_close} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseB_Res_close", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-C"aria-describedby="inputGroup-sizing-default" value={state.PhaseC_Res_close} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseC_Res_close", value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" >Open1 (R)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-A"aria-describedby="inputGroup-sizing-default" value={state.PhaseA_Res_open1} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseA_Res_open1", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-B"aria-describedby="inputGroup-sizing-default" value={state.PhaseB_Res_open1} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseB_Res_open1", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-C"aria-describedby="inputGroup-sizing-default" value={state.PhaseC_Res_open1} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseC_Res_open1", value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" >Open2 (R)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-A"aria-describedby="inputGroup-sizing-default" value={state.PhaseA_Res_open2} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseA_Res_open2", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-B"aria-describedby="inputGroup-sizing-default" value={state.PhaseB_Res_open2} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseB_Res_open2", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-C"aria-describedby="inputGroup-sizing-default" value={state.PhaseC_Res_open2} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseC_Res_open2", value: e.target.value } })} />
                        </div>
                        
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" >Close &nbsp; (C)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-A"aria-describedby="inputGroup-sizing-default" value={state.PhaseA_Current_close} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseA_Current_close", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-B"aria-describedby="inputGroup-sizing-default" value={state.PhaseB_Current_close} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseB_Current_close", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-C"aria-describedby="inputGroup-sizing-default" value={state.PhaseC_Current_close} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseC_Current_close", value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" >Open1 (C)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-A"aria-describedby="inputGroup-sizing-default" value={state.PhaseA_Current_open1} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseA_Current_open1", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-B"aria-describedby="inputGroup-sizing-default" value={state.PhaseB_Current_open1} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseB_Current_open1", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-C"aria-describedby="inputGroup-sizing-default" value={state.PhaseC_Current_open1} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseC_Current_open1", value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" >Open2 (C)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-A"aria-describedby="inputGroup-sizing-default" value={state.PhaseA_Current_open2} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseA_Current_open2", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-B"aria-describedby="inputGroup-sizing-default" value={state.PhaseB_Current_open2} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseB_Current_open2", value: e.target.value } })} />
                            <input type="text" className="form-control" aria-label="Sizing example input" placeholder="P-C"aria-describedby="inputGroup-sizing-default" value={state.PhaseC_Current_open2} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseC_Current_open2", value: e.target.value } })} />
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={`${state.PhaseA_Time_close_log[0]}/${state.PhaseB_Time_close_log[0]}/${state.PhaseC_Time_close_log[0]}`} onClick={(e)=>{show_data(state,"Time","close")}} onChange={(e)=>{}}/>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={`${state.PhaseA_Time_open1_log[0]}/${state.PhaseB_Time_open1_log[0]}/${state.PhaseC_Time_open1_log[0]}`} onClick={(e)=>{show_data(state,"Time","open1")}} onChange={(e)=>{}}/>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={`${state.PhaseA_Time_open2_log[0]}/${state.PhaseB_Time_open2_log[0]}/${state.PhaseC_Time_open2_log[0]}`} onClick={(e)=>{show_data(state,"Time","open2")}} onChange={(e)=>{}}/>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={`${state.PhaseA_Res_close_log[0]}/${state.PhaseB_Res_close_log[0]}/${state.PhaseC_Res_close_log[0]}`} onClick={(e)=>{show_data(state,"Res","close")}} onChange={(e)=>{}}/>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={`${state.PhaseA_Res_open1_log[0]}/${state.PhaseB_Res_open1_log[0]}/${state.PhaseC_Res_open1_log[0]}`} onClick={(e)=>{show_data(state,"Res","open1")}} onChange={(e)=>{}}/>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={`${state.PhaseA_Res_open2_log[0]}/${state.PhaseB_Res_open2_log[0]}/${state.PhaseC_Res_open2_log[0]}`} onClick={(e)=>{show_data(state,"Res","open2")}} onChange={(e)=>{}}/>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={`${state.PhaseA_Current_close_log[0]}/${state.PhaseB_Current_close_log[0]}/${state.PhaseC_Current_close_log[0]}`} onClick={(e)=>{show_data(state,"Current","close")}} onChange={(e)=>{}}/>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={`${state.PhaseA_Current_open1_log[0]}/${state.PhaseB_Current_open1_log[0]}/${state.PhaseC_Current_open1_log[0]}`} onClick={(e)=>{show_data(state,"Current","open1")}} onChange={(e)=>{}}/>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={`${state.PhaseA_Current_open2_log[0]}/${state.PhaseB_Current_open2_log[0]}/${state.PhaseC_Current_open2_log[0]}`} onClick={(e)=>{show_data(state,"Current","open2")}} onChange={(e)=>{}}/>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Coil;