import { useEffect, useReducer, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../structure/Navigation";
import "../../css/Sweetalert.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../../css/switchgear.css"
import Navsubstation from "./Navsubstation";
import Insulation from "./Switchgear/Insulation";
import Feeder from "./Switchgear/Feeder";
import Vaccuum from "./Switchgear/Vaccuum"
import Timing from "./Switchgear/Timing"
import Counter from "./Switchgear/Counter"
import Contact from "./Switchgear/Contact"
import Gas from "./Switchgear/Gas"
import * as FileSaver from "file-saver";
// import * as XLSX from "xlsx";
import XLSX from 'sheetjs-style'
import { DownloadTableExcel, useDownloadExcel } from 'react-export-table-to-excel';
import axios from "axios";
import { getToken } from "../../service/service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSquare} from '@fortawesome/free-regular-svg-icons'
import {faWindowMinimize} from '@fortawesome/free-solid-svg-icons'
import Menu_Switchgear from "./Switchgear/Menu_Switchgear";
import Menu_Switchyard from "./Switchyard/Menu_Switchyard";
import Menu_Transformer from "./Transformer/Menu_Transformer";



const Test = () => {




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


    // const selectmenutest = (menu) => {
    //     if (sublisttest !== undefined) {
    //         history(`/Test/${substation}/${locationtest}/${menu}/${sublisttest}`)
    //     } else {
    //         history(`/Test/${substation}/${locationtest}/${menu}`)
    //     }
    // }

    // useEffect(() => {
    //     dispatch({ type: "reset_index", payload: 0 })
    // }, [listtest])   
   


    return (
        <div>
            <Navigation />
            <Navsubstation setstate={dispatch} />
            {(locationtest == "Switchgear" && state.nameThai !== "") && <Menu_Switchgear state={state}/>}
            {(locationtest == "Switchyard" && state.nameThai !== "") && <Menu_Switchyard state={state}/>}
            {(locationtest == "Transformer" && state.nameThai !== "") && <Menu_Transformer state={state}/>}
               

        </div>
    )
}

export default Test;