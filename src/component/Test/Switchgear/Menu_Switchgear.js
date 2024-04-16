import { useEffect, useReducer, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Insulation from "./Insulation";
import Feeder from "./Feeder";
import Vaccuum from "./Vaccuum"
import Timing from "./Timing"
import Counter from "./Counter"
import Contact from "./Contact"
import Gas from "./Gas"
import Export_Switchgear from "./ExportSwitchgear";
import axios from "axios";
import XLSX from 'sheetjs-style'
import { getToken } from "../../../service/service";
import { ExportSwitchgear } from "./ExportSwitchgear";
import { faChessBishop } from "@fortawesome/free-regular-svg-icons";
const Menu_Switchgear = (prop) => {
    
    const history = useNavigate();
    const { substation, locationtest, listtest, sublisttest } = useParams();
    const initials = {
        nameAllsub: [],
        indexfeeder: 0,
        id: "",
        nameThai: "",
        initialsThai: "",
        nameEng: "",
        initialsEng: "",
        switch_checked: false,
        nameTest_select: 0

    }
    

    const reducer = (state, action) => {
        switch (action.type) {
            case 'fetchnamesub':
                return { ...state, nameAllsub: action.payload }
            case 'indexfeeder':
                return { ...state, indexfeeder: action.payload }
            case 'substationinfo':
                return {
                    ...state,
                    id: action.payload.id,
                    nameThai: action.payload.nameThai,
                    initialsThai: action.payload.initialsThai,
                    nameEng: action.payload.nameEng,
                    initialsEng: action.payload.initialsEng,
                }
            case 'switch_checked':
                return {
                    ...state,
                    switch_checked: action.payload
                }
            case 'nameTest':
                return {
                    ...state,
                    nameTest_select: action.payload
                }
            case 'reset_index':
                return {
                    ...state,
                    nameTest_select: action.payload,
                    indexfeeder: action.payload
                }
        }
    }

    const [state, dispatch] = useReducer(reducer, initials)


    const selectmenutest = (menu) => {
        if (sublisttest !== undefined ) {            
            if(state.nameTest_select === 0){
                history(`/Test/${substation}/${locationtest}/${menu}/${sublisttest}`)
            }else{
                axios.post(`${process.env.REACT_APP_API}/fetchdatatest`, { nameThai:substation }, {
                    headers: {
                        authorization: `Bearer ${getToken()}`
                    }
                })
                    .then((res) => {
                        history(`/Test/${substation}/${locationtest}/${menu}/${res.data.result.switchgear_CB[0][0].code}`)
                        // dispatch({ type: 'Update_insulation', payload: { ...res.data.result.switchgear_CB[index][prop.index_feeder].Insulation } })                        
                    })
                    .catch(err => {
        
                    })
                // }
            }            
        } else {
            // console.log("test")
            history(`/Test/${substation}/${locationtest}/${menu}`)
        }
    }

    // useEffect(() => {
    //     // dispatch({ type: "reset_index", payload: 0 })
    // }, [listtest]) 
    
    useEffect(()=>{
        
        axios.post(`${process.env.REACT_APP_API}/fetchdatatest`, { nameThai:substation }, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                // console.log("state.nameTest_select")
                history(`/Test/${substation}/${locationtest}/${listtest}/${res.data.result.switchgear_CB[state.nameTest_select][0].code}`)
                // dispatch({ type: 'Update_insulation', payload: { ...res.data.result.switchgear_CB[index][prop.index_feeder].Insulation } })                        
            })
            .catch(err => {

            })
    },[state.nameTest_select])

    useEffect(()=>{
        dispatch({type:"substationinfo",payload:{
            nameThai:prop.state.nameThai,
            nameEng:prop.state.nameEng,
            initialsEng:prop.state.initialsEng,
            initialsThai:prop.state.initialsThai,            
        }})
    },[prop.state.initialsEng,prop.state.nameThai])
    // console.log(state.initialsEng)
    return (
        <div>
            <div>
                <div className="container d-flex justify-content-center">
                    <div className="d-flex justify-content-center align-items-center row width_max">
                        <div className="mx-3 col-lg-4 col-md-12 col-sm-12">
                            <div className="mainmenu">
                                <button className="submenuselect Contact" onClick={() => selectmenutest("Contact")}>Contact</button>
                                <button className="submenuselect insulation" onClick={() => selectmenutest("Insulation")}>Insulation</button>
                                <button className="submenuselect vaccuum" onClick={() => selectmenutest("Vaccuum")}>Vaccuum</button>
                                <button className="submenuselect timing" onClick={() => selectmenutest("Timing")}>Timming</button>
                                <button className="submenuselect counter" onClick={() => selectmenutest("Counter")}>Counter</button>
                                <button onClick={(e) => ExportSwitchgear(prop)} className="submenuselect">Export</button>
                            </div>
                            <div className="mediamainmenu">
                                <button className="submenuselect insulation" onClick={() => selectmenutest("Contact")}>Cont.</button>
                                <button className="submenuselect insulation" onClick={() => selectmenutest("Insulation")}>Ins.</button>
                                <button className="submenuselect vaccuum" onClick={() => selectmenutest("Vaccuum")}>Vac.</button>
                                <button className="submenuselect timing" onClick={() => selectmenutest("Timing")}>Tim.</button>
                                <button className="submenuselect counter" onClick={() => selectmenutest("Counter")}>Count.</button>
                                <button onClick={(e) => ExportSwitchgear(prop)} className="submenuselect">Export</button>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-12 col-sm-12">
                            <Feeder substation={substation} Mainsubstationinfo={{ ...state }} setstate={dispatch} />
                        </div>
                    </div>
                </div>
                {(listtest === "Insulation" && state.indexfeeder !== "") && <Insulation index_feeder={state.indexfeeder} checked={state.switch_checked} setstate={dispatch} />}
                {(listtest === "Vaccuum" && state.indexfeeder !== "") && <Vaccuum index_feeder={state.indexfeeder} checked={state.switch_checked} setstate={dispatch} />}
                {(listtest === "Timing" && state.indexfeeder !== "") && <Timing index_feeder={state.indexfeeder} checked={state.switch_checked} setstate={dispatch} />}
                {(listtest === "Counter" && state.indexfeeder !== "" && state.nameAllsub !== "") && <Counter nameThai={state.nameAllsub} index_feeder={state.indexfeeder} checked={state.switch_checked} setstate={dispatch} />}
                {(listtest === "Contact" && state.indexfeeder !== "" && state.nameAllsub !== "") && <Contact nameThai={state.nameAllsub} index_feeder={state.indexfeeder} checked={state.switch_checked} setstate={dispatch} />}
                {(listtest === "Gas" && state.indexfeeder !== "" && state.nameAllsub !== "") && <Gas nameThai={state.nameAllsub} index_feeder={state.indexfeeder} checked={state.switch_checked} />}
                {/* <div>
                        <button onClick={(e) => exportToCSV(apiData, fileName)}>Export</button>
                        <input type="file" onChange={(e) => handleFile(e)} />
                    </div> */}
            </div>

        </div>
    )
}
export default Menu_Switchgear