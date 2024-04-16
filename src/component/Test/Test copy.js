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


    const selectmenutest = (menu) => {
        if (sublisttest !== undefined) {
            history(`/Test/${substation}/${locationtest}/${menu}/${sublisttest}`)
        } else {
            history(`/Test/${substation}/${locationtest}/${menu}`)
        }
    }

    useEffect(() => {
        dispatch({ type: "reset_index", payload: 0 })
    }, [listtest])



    /************ EXCEL *************** */
    const apiData = [0, 1, 2, 3]
    const fileName = "Donut"
    // const tableRef = useRef(null);
    // const { onDownload } = useDownloadExcel({
    //     currentTableRef: tableRef.current,
    //     filename: 'Users table',
    //     sheet: 'Users'
    // },{
    //     currentTableRef: tableRef.current,
    //     filename: 'Users table',
    //     sheet: 'User7'
    // })
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    const fileExtension = ".xlsx"

    const exportToCSV = () => {
        axios.post(`${process.env.REACT_APP_API}/fetchdatatest`, { nameThai: state.nameThai }, {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                // const data = [1, 2, 3] 
                const Column_excel = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK"]
                const Row_excel = ["5", "6", "7", "8"]
                const Gap = (number = 1) => {
                    const text = []
                    for (let i = 1; i <= number; i++) {
                        text.push("")
                    }
                    return text
                }

                var ws_data = [
                    [`กฟภ.ต1`, ...Gap(3), `CIRCUIT BREAKER TEST REPORT ${state.nameThai}`],
                    [""],
                    [""],
                    [""],
                    ["Substation", ...Gap(3), `${state.nameThai} (${state.initialsEng})`, ...Gap(4), "กฟฟ.ในสังกัด", ...Gap(10), "กฟอ.", ...Gap(6), "Date", "1-2 สิงหาคม", ...Gap(8)],
                    ["Code", ...Gap(1), "MFR", ...Gap(1), "Type", ...Gap(1), "Serial Number", ...Gap(1), "kV", "kA", "A", "Contact resistance", ...Gap(2), "Insulation", ...Gap(5), "Vacuum", ...Gap(2), "CB timing", ...Gap(3), "Coil current", ...Gap(3), "Motor charge spring", ...Gap(3), "Counter number", "Remark"],
                    [...Gap(11), "(< 200 µΩ)", ...Gap(2), "( > 1 GΩ)", ...Gap(5), "(< 100 µA)", ...Gap(2), "Open", ...Gap(1), "Close", ...Gap(1), "Trip  coil", ...Gap(1), "Close coil", ...Gap(1), "Current", ...Gap(1), "Timing", ...Gap(3)],
                    [...Gap(11), "A", "B", "C", "A-G", "B-G", "C-G", "A-B", "B-C", "C-A", "A", "B", "C", "t (ms)", ...Gap(1), "t (ms)", ...Gap(1), "I(A)", ...Gap(1), "I(A)", ...Gap(1), "I(A)", ...Gap(1), "t (ms)", ...Gap(3)]
                ]

                // console.log(ws_data)
                const AAA = res.data.result.switchgear_CB.map((data, index) => {
                    return ws_data.concat(data.map((data, index1) => {
                        let code = (res.data.result.switchgear_CB[index][index1].code != "" && res.data.result.switchgear_CB[index][index1].code != "ไม่มีข้อมูล") ? res.data.result.switchgear_CB[index][index1].code : "-"
                        let MFR = (res.data.result.switchgear_CB[index][index1].MFR != "" && res.data.result.switchgear_CB[index][index1].MFR != "ไม่มีข้อมูล") ? res.data.result.switchgear_CB[index][index1].MFR : "-"
                        let Type = (res.data.result.switchgear_CB[index][index1].Type != "" && res.data.result.switchgear_CB[index][index1].Type != "ไม่มีข้อมูล") ? res.data.result.switchgear_CB[index][index1].Type : "-"
                        let SN = (res.data.result.switchgear_CB[index][index1].SN != "" && res.data.result.switchgear_CB[index][index1].SN != "ไม่มีข้อมูล") ? res.data.result.switchgear_CB[index][index1].SN : "-"
                        let kV = (res.data.result.switchgear_CB[index][index1].kV != "" && res.data.result.switchgear_CB[index][index1].kV != "ไม่มีข้อมูล") ? res.data.result.switchgear_CB[index][index1].kV : "-"
                        let kA = (res.data.result.switchgear_CB[index][index1].kA != "" && res.data.result.switchgear_CB[index][index1].kA != "ไม่มีข้อมูล") ? res.data.result.switchgear_CB[index][index1].kA : "-"
                        let A = (res.data.result.switchgear_CB[index][index1].A != "" && res.data.result.switchgear_CB[index][index1].A != "ไม่มีข้อมูล") ? res.data.result.switchgear_CB[index][index1].A : "-"
                        let InsulationPhaseAG = (data.Insulation.PhaseAG[0] != "" && data.Insulation.PhaseAG[0] != undefined) ? data.Insulation.PhaseAG[0] : "-"
                        let InsulationPhaseBG = (data.Insulation.PhaseBG[0] != "" && data.Insulation.PhaseBG[0] != undefined) ? data.Insulation.PhaseBG[0] : "-"
                        let InsulationPhaseCG = (data.Insulation.PhaseCG[0] != "" && data.Insulation.PhaseCG[0] != undefined) ? data.Insulation.PhaseCG[0] : "-"
                        let InsulationPhaseAB = (data.Insulation.PhaseAB[0] != "" && data.Insulation.PhaseAB[0] != undefined) ? data.Insulation.PhaseAB[0] : "-"
                        let InsulationPhaseBC = (data.Insulation.PhaseBC[0] != "" && data.Insulation.PhaseBC[0] != undefined) ? data.Insulation.PhaseBC[0] : "-"
                        let InsulationPhaseCA = (data.Insulation.PhaseCA[0] != "" && data.Insulation.PhaseCA[0] != undefined) ? data.Insulation.PhaseCA[0] : "-"
                        let VaccuumPhaseA = (data.Vaccuum.PhaseA[0] != "" && data.Vaccuum.PhaseA[0] != undefined) ? data.Vaccuum.PhaseA[0] : "-"
                        let VaccuumPhaseB = (data.Vaccuum.PhaseB[0] != "" && data.Vaccuum.PhaseB[0] != undefined) ? data.Vaccuum.PhaseB[0] : "-"
                        let VaccuumPhaseC = (data.Vaccuum.PhaseC[0] != "" && data.Vaccuum.PhaseC[0] != undefined) ? data.Vaccuum.PhaseC[0] : "-"
                        let TimmingTime_open = (data.Timming.Time_open[0] != "" && data.Timming.Time_open[0] != undefined) ? data.Timming.Time_open[0] : "-"
                        let TimmingTime_close = (data.Timming.Time_close[0] != "" && data.Timming.Time_close[0] != undefined) ? data.Timming.Time_close[0] : "-"
                        let TimmingCurrent_open = (data.Timming.Current_open[0] != "" && data.Timming.Current_open[0] != undefined) ? data.Timming.Current_open[0] : "-"
                        let TimmingCurrent_close = (data.Timming.Current_close[0]!= "" && data.Timming.Current_close[0]!= undefined) ? data.Timming.Current_close[0]: "-"
                        let TimmingCurrent_motor = (data.Timming.Current_motor[0]!= "" && data.Timming.Current_motor[0]!= undefined) ? data.Timming.Current_motor[0]: "-"
                        let TimmingTime_motor = (data.Timming.Time_motor[0]!= "" && data.Timming.Time_motor[0]!= undefined) ? data.Timming.Time_motor[0]: "-"
                        let dataCounter = (data.Counter[0]!= "" && data.Counter[0]!= undefined) ? data.Counter[0]: "-"
                        return [code,
                            "",
                            MFR,
                            "",
                            Type,
                            "",
                            SN,
                            "",
                            kV,
                            kA,
                            A,
                            "-",
                            "-",
                            "-",
                            InsulationPhaseAG,
                            InsulationPhaseBG,
                            InsulationPhaseCG,
                            InsulationPhaseAB,
                            InsulationPhaseBC,
                            InsulationPhaseCA,
                            VaccuumPhaseA,
                            VaccuumPhaseB,
                            VaccuumPhaseC,
                            TimmingTime_open,
                            "",
                            TimmingTime_close,
                            "",
                            TimmingCurrent_open,
                            "",
                            TimmingCurrent_close,
                            "",
                            TimmingCurrent_motor,
                            "",
                            TimmingTime_motor,
                            "",
                            dataCounter,
                            "-"
                        ]
                    }))

                })


                for (let i = 0; i < AAA.length; i++) {
                    window['ws' + i] = XLSX.utils.aoa_to_sheet(AAA[i]);
                }
                console.log(eval(`ws0`))
                // const ws0 = XLSX.utils.aoa_to_sheet(AAA[0]);
                // const ws1 = XLSX.utils.aoa_to_sheet(AAA[1]);

                const merge = [
                    { s: { r: 0, c: 0 }, e: { r: 3, c: 3 } }, { s: { r: 0, c: 4 }, e: { r: 3, c: 36 } },
                    { s: { r: 4, c: 0 }, e: { r: 4, c: 3 } }, { s: { r: 4, c: 4 }, e: { r: 4, c: 8 } }, { s: { r: 4, c: 9 }, e: { r: 4, c: 19 } }, { s: { r: 4, c: 20 }, e: { r: 4, c: 26 } }, { s: { r: 4, c: 28 }, e: { r: 4, c: 36 } },
                    { s: { r: 5, c: 0 }, e: { r: 7, c: 1 } }, { s: { r: 5, c: 2 }, e: { r: 7, c: 3 } }, { s: { r: 5, c: 8 }, e: { r: 7, c: 8 } }, { s: { r: 5, c: 9 }, e: { r: 7, c: 9 } }, { s: { r: 5, c: 10 }, e: { r: 7, c: 10 } }, { s: { r: 5, c: 4 }, e: { r: 7, c: 5 } }, { s: { r: 5, c: 6 }, e: { r: 7, c: 7 } }, { s: { r: 5, c: 11 }, e: { r: 5, c: 13 } }, { s: { r: 5, c: 14 }, e: { r: 5, c: 19 } }, { s: { r: 5, c: 20 }, e: { r: 5, c: 22 } }, { s: { r: 5, c: 23 }, e: { r: 5, c: 26 } }, { s: { r: 5, c: 27 }, e: { r: 5, c: 30 } }, { s: { r: 5, c: 31 }, e: { r: 5, c: 34 } }, { s: { r: 5, c: 35 }, e: { r: 7, c: 35 } }, { s: { r: 5, c: 36 }, e: { r: 7, c: 36 } },
                    { s: { r: 6, c: 11 }, e: { r: 6, c: 13 } }, { s: { r: 6, c: 14 }, e: { r: 6, c: 19 } }, { s: { r: 6, c: 20 }, e: { r: 6, c: 22 } }, { s: { r: 6, c: 23 }, e: { r: 6, c: 24 } }, { s: { r: 6, c: 25 }, e: { r: 6, c: 26 } }, { s: { r: 6, c: 27 }, e: { r: 6, c: 28 } }, { s: { r: 6, c: 29 }, e: { r: 6, c: 30 } }, { s: { r: 6, c: 31 }, e: { r: 6, c: 32 } }, { s: { r: 6, c: 33 }, e: { r: 6, c: 34 } },
                    { s: { r: 7, c: 23 }, e: { r: 7, c: 24 } }, { s: { r: 7, c: 25 }, e: { r: 7, c: 26 } }, { s: { r: 7, c: 27 }, e: { r: 7, c: 28 } }, { s: { r: 7, c: 29 }, e: { r: 7, c: 30 } }, { s: { r: 7, c: 31 }, e: { r: 7, c: 32 } }, { s: { r: 7, c: 33 }, e: { r: 7, c: 34 } }
                ];


                AAA.map((data, index) => {
                    let newArray = [];
                    for (var i = 0; i < data.length - 8; i++) {
                        newArray.push({ s: { r: i + 8, c: 0 }, e: { r: i + 8, c: 1 } }, { s: { r: i + 8, c: 2 }, e: { r: i + 8, c: 3 } }, { s: { r: i + 8, c: 4 }, e: { r: i + 8, c: 5 } }, { s: { r: i + 8, c: 6 }, e: { r: i + 8, c: 7 } }, { s: { r: i + 8, c: 23 }, e: { r: i + 8, c: 24 } }, { s: { r: i + 8, c: 25 }, e: { r: i + 8, c: 26 } }, { s: { r: i + 8, c: 27 }, e: { r: i + 8, c: 28 } }, { s: { r: i + 8, c: 29 }, e: { r: i + 8, c: 30 } }, { s: { r: i + 8, c: 31 }, e: { r: i + 8, c: 32 } }, { s: { r: i + 8, c: 33 }, e: { r: i + 8, c: 34 } });
                    };

                    console.log(data)
                    eval(`ws${index}`)["!merges"] = [...merge, ...newArray]
                    // return newArray;
                    // window['BB' + index] = data.map((data, i) => {
                    //     return [{ s: { r: i + 9, c: 23 }, e: { r: i + 9, c: 24 } }, { s: { r: i + 9, c: 25 }, e: { r: i + 9, c: 26 } }, { s: { r: i + 9, c: 27 }, e: { r: i + 9, c: 28 } }, { s: { r: i + 9, c: 29 }, e: { r: i + 9, c: 30 } }, { s: { r: i + 9, c: 31 }, e: { r: i + 9, c: 32 } }, { s: { r: i + 9, c: 33 }, e: { r: i + 9, c: 34 } }]                       
                    // })                    

                    // console.log(...eval(`RR${index}`))
                    // // console.log([...merge,...eval(`BB${index}`)])
                    // eval(`ws${index}`)["!merges"] = [...merge,...eval(`BB${index}`)]
                })

                AAA.map((data, index) => {

                    eval(`ws${index}`)[`A1`].s = {
                        font: {
                            name: 'arial',
                            sz: 14,
                            bold: true,
                            color: "#F2F2F2",
                        },
                        alignment: {
                            vertical: "center",
                            horizontal: "center",
                            wrapText: '1', // any truthy value here
                        },
                    }
                    eval(`ws${index}`)[`E1`].s = {
                        font: {
                            name: 'arial',
                            sz: 14,
                            bold: true,
                            color: "#F2F2F2",
                        },
                        alignment: {
                            vertical: "center",
                            horizontal: "center",
                            wrapText: '1', // any truthy value here
                        },
                    }

                    for (var i = 0; i < data.length - 8; i++) {
                        Column_excel.map((data1) => {
                            console.log(`${data1}${i + 9}`)
                            eval(`ws${index}`)[`${data1}${i + 9}`].s = {
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center",
                                    wrapText: '1', // any truthy value here
                                },
                            }
                        })

                    }

                    console.log(data)

                })


                // ws['E1'].s = {
                //     font: {
                //         name: 'arial',
                //         sz: 14,
                //         bold: true,
                //         color: "#F2F2F2",
                //     },
                //     alignment: {
                //         vertical: "center",
                //         horizontal: "center",
                //         wrapText: '1', // any truthy value here
                //     },
                //     // border: {
                //     //     right: {
                //     //         style: "thin",
                //     //         color: "#000000"
                //     //     },
                //     //     left: {
                //     //         style: "thin",
                //     //         color: "#000000"
                //     //     },
                //     // },
                //     // fill: {
                //     //     type: 'pattern',
                //     //     patternType: 'solid',
                //     //     fgColor: { rgb: "c7c9c8" }
                //     // },
                // }
                AAA.map((data, index) => {
                    Column_excel.map((data) => {
                        Row_excel.map((data1) => {
                            eval(`ws${index}`)[`${data}${data1}`].s = {
                                font: {
                                    name: 'arial',
                                    bold: true,
                                    color: "#F2F2F2",
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center",
                                    wrapText: '1', // any truthy value here
                                },
                            }
                        })
                    })
                })

                const width = 6
                var wscols = [
                    { wch: width }, { wch: width }, { wch: width }, { wch: width },
                    { wch: width }, { wch: width }, { wch: width }, { wch: width },
                    { wch: width }, { wch: width }, { wch: width }, { wch: width },
                    { wch: width }, { wch: width }, { wch: width }, { wch: width },
                    { wch: width }, { wch: width }, { wch: width }, { wch: width },
                    { wch: width }, { wch: width }, { wch: width }, { wch: width },
                    { wch: width }, { wch: width }, { wch: width }
                ];
                AAA.map((data, index) => {
                    eval(`ws${index}`)['!cols'] = wscols
                })

                // const ws2 = XLSX.utils.aoa_to_sheet(ws_data2)

                const wb = XLSX.utils.book_new()
                res.data.result.switchgear_CB.map((data, index) => {
                    XLSX.utils.book_append_sheet(wb, eval(`ws${index}`), `${data[0].nameTest}_${index}`);
                })

                XLSX.writeFile(wb, "sheetjs.xlsx");

                // console.log(res.data.result.switchgear_CB)
            })
            .catch(err => {
                console.log(err)
            })



    };
    /************ EXCEL *************** */


    const handleFile = async (e) => {

        const file = e.target.files[0]
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);

        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        console.log(jsonData)


        const dataSheet = XLSX.utils.json_to_sheet(jsonData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, dataSheet, "SheetJS1");
        XLSX.writeFile(wb, "sheetjs.xlsx");
    }


    return (
        <div>
            <Navigation />
            <Navsubstation setstate={dispatch} />
            {(locationtest === "Switchgear" && state.nameThai !== "") &&
                <div>
                    <div className="container d-flex justify-content-center">
                        <div className="d-flex justify-content-center align-items-center row width_max">
                            <div className="mx-3 col-lg-4 col-md-12 col-sm-12">
                                <div className="mainmenu">
                                    <button className="submenuselect insulation" onClick={() => selectmenutest("Contact")}>Contact</button>
                                    <button className="submenuselect insulation" onClick={() => selectmenutest("Insulation")}>Insulation</button>
                                    <button className="submenuselect vaccuum" onClick={() => selectmenutest("Vaccuum")}>Vaccuum</button>
                                    <button className="submenuselect timing" onClick={() => selectmenutest("Timing")}>Timming</button>
                                    <button className="submenuselect counter" onClick={() => selectmenutest("Counter")}>Counter</button>
                                    <button onClick={(e) => exportToCSV(apiData, fileName)} className="submenuselect">Export</button>
                                </div>
                                <div className="mediamainmenu">
                                    <button className="submenuselect insulation" onClick={() => selectmenutest("Contact")}>Cont.</button>
                                    <button className="submenuselect insulation" onClick={() => selectmenutest("Insulation")}>Ins.</button>
                                    <button className="submenuselect vaccuum" onClick={() => selectmenutest("Vaccuum")}>Vac.</button>
                                    <button className="submenuselect timing" onClick={() => selectmenutest("Timing")}>Tim.</button>
                                    <button className="submenuselect counter" onClick={() => selectmenutest("Counter")}>Count.</button>
                                    <button onClick={(e) => exportToCSV(apiData, fileName)} className="submenuselect">Export</button>
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
            }
            {(locationtest == "Switchyard" && state.nameThai !== "") &&
                <div>
                    
                    Main BUS
                    <button>DS-01</button>
                    <button>CB-01</button>
                    <button>DS-02</button>
                    <button>DS-03</button>
                    Transfer BUS
                    
                    {/* <FontAwesomeIcon icon={faSquare} />
                    <FontAwesomeIcon icon={faWindowMinimize} /> */}
                </div>       
            
            }

        </div>
    )
}

export default Test;