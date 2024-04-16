import React, { useState } from 'react';
import '../../css/qrcode.css';
import HowToUse from './HowToUse.js';
import Html5QrcodePlugin from './Html5QrcodePlugin.js';
import ResultContainerPlugin from './ResultContainerPlugin.js';
import Navigation from '../structure/Navigation';

const Test = (props) => {
    
    
    const [decodedResults, setDecodedResults] = useState([{decodedText:"ไม่มีข้อมูล"}]);
    
    const setstate=(event)=>{
        setDecodedResults([...decodedResults,{decodedText:event.taget.value}])
    }
    const onNewScanResult = (decodedText, decodedResult) => {
        console.log("App [result]", decodedResult);
        setDecodedResults(prev => [...prev, decodedResult]);
    };
    // if(decodedResults === "") setDecodedResults([{decodedText:"ไม่มีข้อมูล"}])
    
    const lastElement = decodedResults.length - 1

    console.log(decodedResults)
    return (
        <div>
            <Navigation/>
            <section className="App-section">
                <Html5QrcodePlugin
                    fps={10}
                    qrbox={250}
                    disableFlip={false}
                    qrCodeSuccessCallback={onNewScanResult}
                />
                <div>
                    <h3 className='text-center'>ค้นหา</h3>
                    <input type='input' className='form-control' onChange={setstate} value={decodedResults[lastElement].decodedText}></input>                    
                </div>
                {/* <ResultContainerPlugin results={decodedResults} /> */}
                
            </section>
        </div>
    );
};

export default Test;
