import { useState, useReducer, useEffect } from "react";
import '../../../css/Insulation.css'
import { useParams } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../../service/service";

const Counter = (prop) => {

    const { substation, sublisttest } = useParams();

    const [fetchdata, setfetchdata] = useState([])



    // // const data_fetch = [{ name: "11" }, { name: "22" }, { name: "33" }, { name: "44" }, { name: "55" }, { name: "66" }]

    // const setnewdata = data_fetch.reduce(
    //     (obj, current) => Object.assign(obj, { [current.name]: "" }), {})
    // console.log(setnewdata)
    const fetch = (nameThai) => {
        if (sublisttest !== undefined) {
            axios.post(`${process.env.REACT_APP_API}/fetchdatatest`, { nameThai }, {
                headers: {
                    authorization: `Bearer ${getToken()}`
                }
            })
                .then(res => {
                    setfetchdata(res.data.result.Counter)
                    // dispatch({ type: 'fetchdata', payload: { data: res.data.result.switchgear_CB[prop.index_feeder].Counter } })
                }).catch(err => {
                    alert(err)
                })
        }
    }

    useEffect(() => {
        fetch(substation)
        // console.log(prop.index_feeder)
        // dispatch({ type: 'reset', payload: initials })
    }, [prop.index_feeder])


    const setnewdata = fetchdata.reduce((obj, current) => Object.assign(obj, { [current.nameFeeder]: "" }), {})

    const initials = {
        ...setnewdata
    }



    const reducer = (state, action) => {
        switch (action.type) {
            case 'setstate':
                return {
                    ...state,
                    [action.payload.name]: action.payload.value
                }
        }
    }

    const [state, dispatch] = useReducer(reducer, initials)

    const Add_counter = async(e) => {
        e.preventDefault();
         const Counter = await fetchdata.map((data,index)=>{
            const newdata = {}
            newdata.nameFeeder = data.nameFeeder
            newdata.Feeder_Counter = (state[data.nameFeeder]) ? state[data.nameFeeder] : data.Feeder_Counter
            return newdata
        })  
        console.log(Counter)      
        axios.post(`${process.env.REACT_APP_API}/Updatecounter`, { nameThai:substation , Counter }, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
        .then(res=>{
            alert(res.data.res)
            fetch(substation)            
        }).catch(err=>{
            alert(err)
        })
    }

    console.log(fetchdata)
    return (
        <div>
            <form onSubmit={Add_counter}>
                <div className="d-flex justify-content-center">
                    <div className="text-center"><h4>Counter test</h4></div>
                    <button className="btn btn-success mx-3">ส่งข้อมูล</button>
                </div>
                <div className="d-flex justify-content-center">
                    <div>
                        <div className="d-flex justify-content-center">
                            <div className="text-center my-3 mx-1">ข้อมูล</div>
                            <div className="text-center my-3" style={{ width: '100px' }}>
                                <select className="form-select">
                                    <option>ผลที่1</option>
                                </select>
                            </div>
                        </div>
                        {fetchdata.map(data => (
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="inputGroup-sizing-default" style={{ width: "100px" }}>{data.nameFeeder}</span>
                                <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={state[data.nameFeeder]} onChange={(e) => { dispatch({ type: 'setstate', payload: { name: data.nameFeeder, value: e.target.value } }) }} />
                            </div>
                        ))}
                    </div>
                    <div className="mx-2">
                        <div className="d-flex justify-content-center">
                            <div className="text-center my-3 mx-1">ข้อมูล</div>
                            <div className="text-center my-3" style={{ width: '100px' }}>
                                <select className="form-select">
                                    <option>ผลที่1</option>
                                </select>
                            </div>
                        </div>
                        {fetchdata.map(data => (
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={data.Feeder_Counter}/>
                            </div>
                        ))}
                    </div>
                </div>

            </form>
        </div>
    )
}

export default Counter;