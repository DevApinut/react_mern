import { useReducer, useEffect} from "react";
import '../../../css/Insulation.css'
import { useParams } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../../service/service";
import { v4 as uuidv4 } from 'uuid'
const Insulation = (prop) => {
    const initials = {
        PhaseAG: "",
        PhaseBG: "",
        PhaseCG: "",
        PhaseAB: "",
        PhaseBC: "",
        PhaseCA: "",
        PhaseAG_log: "",
        PhaseBG_log: "",
        PhaseCG_log: "",
        PhaseAB_log: "",
        PhaseBC_log: "",
        PhaseCA_log: "",
        nameTest: [],
        index_old_data: 0,
        index_new_data: 0,
    }

    /************for reducer*********/
    const reducer = (state, action) => {
        switch (action.type) {
            case 'change_state':
                return { ...state, [action.payload.phase]: action.payload.value }
            case 'autofill10T':
                return { ...state, [action.payload.phase]: '>10T' }
            case 'Update_insulation':
                return {
                    ...state,
                    PhaseAG_log: action.payload.PhaseAG,
                    PhaseBG_log: action.payload.PhaseBG,
                    PhaseCG_log: action.payload.PhaseCG,
                    PhaseAB_log: action.payload.PhaseAB,
                    PhaseBC_log: action.payload.PhaseBC,
                    PhaseCA_log: action.payload.PhaseCA
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
    const { substation, sublisttest, listtest } = useParams();
    // console.log(state.index_old_data)
    const fetch = (nameThai, index = 0) => {
        // if (sublisttest !== undefined) {
        // console.log(prop.index_feeder)
        axios.post(`${process.env.REACT_APP_API}/fetchdatatest`, { nameThai }, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                dispatch({ type: 'Update_insulation', payload: { ...res.data.result.switchgear_CB[index][prop.index_feeder].Insulation } })
                dispatch({ type: 'fetchnametest', payload: { nameTest: res.data.result.switchgear_CB } })
            })
            .catch(err => {

            })
        // }
    }


    useEffect(() => {        
        fetch(substation, state.index_old_data)        
        // dispatch({ type: 'reset', payload: initials })        
    }, [prop.index_feeder])
    
    
    const Add_insulation = (e) => {
        e.preventDefault();        
        axios.post(`${process.env.REACT_APP_API}/Updateinsulation`, { nameThai: substation, Feeder: sublisttest, ...state, index_array: state.index_new_data }, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
            .then(res => {
                alert(res.data.res)
                fetch(substation, state.index_old_data)                
            }).catch(err => {
                alert(err)
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
        <div className="container">
            <form onSubmit={Add_insulation}>
                <div className="d-flex justify-content-center">
                    <div className="text-center"><h4>Insulation test</h4></div>
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
                            <span className="input-group-text" id="inputGroup-sizing-default" onClick={() => dispatch({ type: 'autofill10T', payload: { phase: 'PhaseAG' } })}>PhaseAG</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.PhaseAG} onChange={(e) => dispatch({ type: 'change_state', payload: { phase: 'PhaseAG', value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" onClick={() => dispatch({ type: 'autofill10T', payload: { phase: 'PhaseBG' } })}>PhaseBG</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.PhaseBG} onChange={(e) => dispatch({ type: 'change_state', payload: { phase: 'PhaseBG', value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" onClick={() => dispatch({ type: 'autofill10T', payload: { phase: 'PhaseCG' } })}>PhaseCG</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.PhaseCG} onChange={(e) => dispatch({ type: 'change_state', payload: { phase: 'PhaseCG', value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" onClick={() => dispatch({ type: 'autofill10T', payload: { phase: 'PhaseAB' } })}>PhaseAB</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.PhaseAB} onChange={(e) => dispatch({ type: 'change_state', payload: { phase: 'PhaseAB', value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" onClick={() => dispatch({ type: 'autofill10T', payload: { phase: 'PhaseBC' } })}>PhaseBC</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.PhaseBC} onChange={(e) => dispatch({ type: 'change_state', payload: { phase: 'PhaseBC', value: e.target.value } })} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default" onClick={() => dispatch({ type: 'autofill10T', payload: { phase: 'PhaseCA' } })}>PhaseCA</span>
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state.PhaseCA} onChange={(e) => dispatch({ type: 'change_state', payload: { phase: 'PhaseCA', value: e.target.value } })} />
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.PhaseAG_log} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.PhaseBG_log} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.PhaseCG_log} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.PhaseAB_log} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.PhaseBC_log} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={state.PhaseCA_log} />
                        </div>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default Insulation;