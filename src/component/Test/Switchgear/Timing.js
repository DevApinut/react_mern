import { useParams } from "react-router-dom";
import axios from "axios";
import { useReducer, useEffect } from "react";
import { getToken } from "../../../service/service";
import { v4 as uuidv4 } from 'uuid'

const Timing = (prop) => {

    const { substation, sublisttest ,listtest } = useParams()

    const initials = {
        Time_open: "",
        Time_close: "",
        Time_motor: "",
        Current_open: "",
        Current_close: "",
        Current_motor: "",
        Time_open_log: "",
        Time_close_log: "",
        Time_motor_log: "",
        Current_open_log: "",
        Current_close_log: "",
        Current_motor_log: "",
        nameTest: [],
        index_old_data: 0,
        index_new_data: 0,
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case 'change_state':
                return { ...state, [action.payload.name]: action.payload.value }
            case 'Updatetiming':
                return {
                    ...state,
                    Time_open_log: action.payload.Time_open,
                    Time_close_log: action.payload.Time_close,
                    Time_motor_log: action.payload.Time_motor,
                    Current_open_log: action.payload.Current_open,
                    Current_close_log: action.payload.Current_close,
                    Current_motor_log: action.payload.Current_motor
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
                dispatch({ type: 'Updatetiming', payload: { ...res.data.result.switchgear_CB[index][prop.index_feeder].Timming } })
                dispatch({ type: 'fetchnametest', payload: { nameTest: res.data.result.switchgear_CB } })
            }).catch(err => {
                // alert(err)
            })
        // }
    }
    useEffect(() => {
        fetch(substation, state.index_old_data ,prop.index_feeder )
        // dispatch({ type: 'reset', payload: initials })        
    }, [prop.index_feeder])

    const Updatetiming = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API}/Updatetiming`, { nameThai: substation, Feeder: sublisttest, ...state, index_array: state.index_new_data }, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
            .then(res => {
                alert(res.data.res)
                fetch(substation, state.index_old_data)
            }).catch(err => {
                // alert(err)
            })
    }

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

    return (
        <div>
            <form onSubmit={Updatetiming}>
                <div className="d-flex justify-content-center">
                    <div className="text-center"><h4>Timing test</h4></div>
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
                        {/* <div className="d-flex justify-content-center">
                            <div className="text-center my-3 mx-1">ข้อมูล</div>
                            <div className="text-center my-3" style={{ width: '100px' }}>
                                <select className="form-select" value={state.index_new_data} onChange={select_new_data}>
                                    {state.nameTest.map((data, index) => (
                                        <option value={index}>{data[0].nameTest}</option>
                                    ))}
                                </select>
                            </div>
                        </div> */}
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" style={{ width: "80px" }}>Open (T)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.Time_open} onChange={(e) => dispatch({ type: 'change_state', payload: { name: 'Time_open', value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" style={{ width: "80px" }}>Open (I)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.Time_close} onChange={(e) => dispatch({ type: 'change_state', payload: { name: 'Time_close', value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" style={{ width: "80px" }}>Close (T)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.Time_motor} onChange={(e) => dispatch({ type: 'change_state', payload: { name: 'Time_motor', value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" style={{ width: "80px" }}>Close (T)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.Current_open} onChange={(e) => dispatch({ type: 'change_state', payload: { name: 'Current_open', value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" style={{ width: "80px" }}>motor (T)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.Current_close} onChange={(e) => dispatch({ type: 'change_state', payload: { name: 'Current_close', value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" style={{ width: "80px" }}>motor (I)</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.Current_motor} onChange={(e) => dispatch({ type: 'change_state', payload: { name: 'Current_motor', value: e.target.value } })} />
                        </div>
                    </div>
                    <div className="mx-1">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.Time_open_log} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.Time_close_log} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.Time_motor_log} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.Current_open_log} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.Current_close_log} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.Current_motor_log} />
                        </div>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default Timing;