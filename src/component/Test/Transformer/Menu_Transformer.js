import Transformertest from "./Transformertest"
import TP_Number from "./TP_Number"
import { useEffect, useReducer } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { ExportTransformer } from "./ExportTransformer";

const Menu_Transformer = (props) => {

    const { substation, locationtest, listtest, sublisttest } = useParams()
    const initials = {
        nameTest_select: 0,
        data_from_test_transformer:[[{nameTest:"ไม่มีข้อมูล"}]],
        TP_select:0,
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

    const fetch = () => {        
        axios.post(`${process.env.REACT_APP_API}/findTP`, { nameThai: substation })
            .then((res) => {
                if(res.data.Transformer.length < 1){dispatch({ type: "setstate", payload: { name: "data_from_test_transformer", value: initials.data_from_test_transformer } })}
                else {dispatch({ type: "setstate", payload: { name: "data_from_test_transformer", value: res.data.Transformer } })}                
            })
    }

    useEffect(() => {
        fetch();
        dispatch({ type: "setstate", payload: { name: "TP_select", value: 0 } })
    }, [state.nameTest_select]) 
    
    
    return (
        <div>
            <button onClick={(e) => ExportTransformer({...state},state.nameTest_select,state.TP_select)} className="submenuselect">Export</button>
            {(state.data_from_test_transformer[0][0].nameTest != "ไม่มีข้อมูล" ) ?<TP_Number  setstate={dispatch} Mainsubstationinfo={{ ...props.state }} nameTest_select={state.nameTest_select} transformer={state.data_from_test_transformer} fetch={fetch}/>: null }
            {(state.data_from_test_transformer[0][0].nameTest != "ไม่มีข้อมูล" && state.data_from_test_transformer[state.nameTest_select][state.TP_select] !== undefined) ? <Transformertest setstate={dispatch} nameTest_select={state.nameTest_select} transformer={state.data_from_test_transformer} fetch={fetch} TP_select={state.TP_select}/> : null}
        </div>
    )
}
export default Menu_Transformer;