import axios from "axios"
import { useReducer, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getToken } from "../../../service/service"
import { v4 as uuidv4 } from 'uuid'

const Contact = (prop) => {

    const initials = {
        PhaseA: "",
        PhaseB: "",
        PhaseC: "",
        PhaseA_log: "",
        PhaseB_log: "",
        PhaseC_log: "",
        nameTest: [],
        index_old_data: 0,
        index_new_data: 0,
    }

    const { substation, sublisttest } = useParams();
    const reducer = (state, action) => {
        switch (action.type) {
            case 'change_state':
                return { ...state, [action.payload.name]: action.payload.value }
            case 'Update_contact':
                return {
                    ...state,
                    PhaseA_log: action.payload.PhaseA,
                    PhaseB_log: action.payload.PhaseB,
                    PhaseC_log: action.payload.PhaseC
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
    const Updatecontact = (e) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_API}/Updatecontact_Switchyard`, { nameThai: substation, Feeder: sublisttest, ...state, index_array: state.index_new_data }, {
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
        axios.post(`${process.env.REACT_APP_API}/fetchdatatest_Switchtyard`, { nameThai }, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
            .then(res => {
                // console.log(prop.index_feeder)       
                dispatch({ type: 'Update_contact', payload: { ...res.data.result.Switch_yard[index][prop.index_feeder].Contact } })
                dispatch({ type: 'fetchnametest', payload: { nameTest: res.data.result.Switch_yard } })
            }).catch(err => {
                // alert(err)
            })
        // }
    }
    useEffect(() => {
        fetch(substation, state.index_old_data)         
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
    
    return (
        <div>
            <form onSubmit={Updatecontact}>
                <div className="d-flex justify-content-center">
                    <div className="text-center"><h4>Contact test</h4></div>
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
                            <span className="input-group-text" id="inputGroup-sizing-default" >PhaseA</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.PhaseA} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseA", value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" >PhaseB</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.PhaseB} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseB", value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" >PhaseC</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.PhaseC} onChange={(e) => dispatch({ type: "change_state", payload: { name: "PhaseC", value: e.target.value } })} />
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.PhaseA_log} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.PhaseB_log} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.PhaseC_log} />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Contact;