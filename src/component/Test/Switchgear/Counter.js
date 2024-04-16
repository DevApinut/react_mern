import { useState, useReducer, useEffect } from "react";
import '../../../css/Insulation.css'
import { useParams } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../../service/service";
import { v4 as uuidv4 } from 'uuid'

const Counter = (prop) => {

    const { substation, sublisttest } = useParams();

    const [fetchdata, setfetchdata] = useState([])
    const [index_array, setindex_array] = useState({
        index_old_data: 0,
        index_new_data: 0,
        permission: false
    })

    const { index_old_data, index_new_data } = index_array

    const fetch = (nameThai, index = 0) => {
        // if (sublisttest !== undefined) {
        axios.post(`${process.env.REACT_APP_API}/fetchdatatest`, { nameThai }, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
            .then(res => {
                setfetchdata(res.data.result.switchgear_CB[index])
                dispatch({ type: 'fetchnametest', payload: { nameTest: res.data.result.switchgear_CB } })
                dispatch({ type: 'permission', payload: { permission: res.data.result.permission } })
            }).catch(err => {
                alert(err)
            })
        // }
    }

    useEffect(() => {
        fetch(substation)
    }, [])




    const setnewdata = fetchdata.reduce((obj, current) => Object.assign(obj, { [current.code]: "" }), {})
    const initials = {
        ...setnewdata,
        nameTest: [],
    }


    const reducer = (state, action) => {
        switch (action.type) {
            case 'setstate':
                return {
                    ...state,
                    [action.payload.name]: action.payload.value
                }
            case 'fetchnametest':
                return {
                    ...state,
                    nameTest: action.payload.nameTest
                }
            case 'permission':
                return {
                    ...state,
                    permission: action.payload.permission
                }
            case 'reset':
                return { ...action.payload }
        }
    }

    const [state, dispatch] = useReducer(reducer, initials)

    const xxx = []
    const xx = [1]
    const Add_counter = async (e) => {
        e.preventDefault();
        const Counter = await fetchdata.map((data, index) => {
            const newdata = (state[data.code]) ? data.Counter.unshift(state[data.code]) : data.Counter
            return data.Counter
        })
        // xxx.unshift(...xx)         
        // console.log(xxx)
        // console.log(Counter)
        // console.log(fetchdata)

        axios.post(`${process.env.REACT_APP_API}/Updatecounter`, { nameThai: substation, data: Counter, index_array: Number(index_new_data) }, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
            .then(res => {
                alert(res.data.res)
                fetch(substation, index_new_data)
            }).catch(err => {
                alert(err)
            })
    }

    const select_old_data = (e) => {
        setindex_array({ ...index_array, index_old_data: e.target.value, index_new_data: e.target.value })
        dispatch({ type: 'reset', payload: initials })
        prop.setstate({ type: "nameTest", payload: e.target.value })
        fetch(substation, e.target.value)
    }


    return (
        <div>
            <form onSubmit={Add_counter}>
                <div className="d-flex justify-content-center">
                    <div className="text-center"><h4>Counter test</h4></div>
                    <button className="btn btn-success mx-3" disabled={!prop.checked}>ส่งข้อมูล</button>
                </div>
                <div className="d-flex justify-content-center">
                    <div className="text-center my-3 mx-1">ข้อมูล</div>
                    <div className="text-center my-3" style={{ width: '100px' }}>
                        <select className="form-select" value={index_old_data} onChange={select_old_data}>
                            {state.nameTest.map((data, index) => (
                                <option value={index} key={uuidv4()}>{data[0].nameTest}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <div>
                        {fetchdata.map(data => (
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="inputGroup-sizing-default" style={{ width: "100px" }} key={uuidv4()}>{data.code}</span>
                                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state[data.code]} key={uuidv4()} onChange={(e) => { dispatch({ type: 'setstate', payload: { name: data.code, value: e.target.value } }) }} />
                            </div>
                        ))}
                    </div>
                    <div className="mx-2">
                        {fetchdata.map(data => {
                            return (data.Counter !== undefined) ?
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={data.Counter} />
                                </div>
                                :
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue="" />
                                </div>
                        })}
                    </div>
                </div>

            </form>
        </div>
    )
}

export default Counter;