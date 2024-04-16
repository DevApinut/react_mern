import Navigation from "./Navigation";
import About_pic from '../../img/about.png';
import '../../css/About.css'
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useEffect, useReducer } from "react";
import axios from "axios"
// import  renderHTML from  "react-render-html"

const About = () => {
    const initials = {
        content_jobdescription: "",
        id: "",
        button_active: false,
        button_edit: false
    }
    const reducer = (state, action) => {
        switch (action.type) {
            case 'change_state':
                return { ...state, [action.payload.name]: action.payload.value }
            case 'change_id':
                return { ...state, id: action.payload.id }
            case 'change_switch':
                return { ...state, button_edit: !action.payload.edit }
            case 'change_active':
                return { ...state, button_active: action.payload.active }
        }
    }
    const [state, dispatch] = useReducer(reducer, initials)


    //// config quill
    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']
    ];
    const module = {
        toolbar: toolbarOptions
    }

    const fetch = () => {
        axios.post(`${process.env.REACT_APP_API}/Jobdescription_find`, {})
            .then((res) => {
                if (!res.data.res || res.data.res == "เกิด Error1") {
                    dispatch({ type: 'change_state', payload: { name: 'content_jobdescription', value: ""} })
                    dispatch({ type: 'change_id', payload: { id: res.data.id } })
                    dispatch({ type: 'change_active', payload: { active: false } })
                } else {
                    dispatch({ type: 'change_state', payload: { name: 'content_jobdescription', value: res.data.res, id: res.data.id, button_active: true } })
                    dispatch({ type: 'change_id', payload: { id: res.data.id } })
                    dispatch({ type: 'change_active', payload: { active: true } })
                }

            }).catch(err => {

            })
    }

    useEffect(() => {
        fetch();
    }, [])

    const button_submit = {
        button: 1
    };

    const onSubmitt = (e) => {
        e.preventDefault();
        console.log(e)
        if (button_submit.button == 1) {
            // ADD data for job description
            axios.post(`${process.env.REACT_APP_API}/Jobdescription`, { data: state.content_jobdescription })
                .then((res) => {
                    // dispatch({ type: 'change_state', payload: { name: 'content_jobdescription', value: res.data.res } })
                    // fetch();
                }).catch(err => {

                })
        }
        if (button_submit.button == 2) {
            // Update data for job description     
            console.log(state.id)
            axios.post(`${process.env.REACT_APP_API}/Jobdescription_update`, { data: state.content_jobdescription, id: state.id })
                .then((res) => {
                    // dispatch({ type: 'change_state', payload: { name: 'content_jobdescription', value: res.data.res } })                    
                    fetch();
                }).catch(err => {

                })
        }
    }



    console.log(state.button_edit)
    return (
        <div className="About" >
            <Navigation />
            <div className="d-flex align-items-center justify-content-center image">
                {/* <img src={About_pic} /> */}
                {(!state.button_edit) && <div className="jobdescription" >
                    <ReactQuill
                        value={state.content_jobdescription}
                        readOnly={true}
                        theme={"bubble"}
                    />
                    <button className="btn btn-warning btn_edit" onClick={() => dispatch({ type: 'change_switch', payload: { edit: state.button_edit } })}>แก้ไข</button>
                </div>}
                {(state.button_edit) && <div className="jobdescription">
                    <form onSubmit={onSubmitt} className="d-flex flex-column justify-content-center">
                        <div className="headjob">
                            <div>แก้ไข Job Description</div>
                        </div>
                        <ReactQuill
                            modules={module}
                            value={state.content_jobdescription}
                            onChange={(e) => { dispatch({ type: 'change_state', payload: { name: 'content_jobdescription', value: e } }) }}
                            theme="snow"
                            style={{ background: 'white' }}
                        />
                        <input name="id_test" type="hidden" value={state.id} />
                        {(!state.button_active) && <button
                            className="btn btn-success mt-2"
                            onClick={() => (button_submit.button = 1)}
                            type="submit"
                            name="btn1"
                            value="1"
                            disabled={state.button_active}
                        >
                            Add
                        </button>}
                        {(state.button_active) && <button
                            className="btn btn-warning mt-2"
                            onClick={() => (button_submit.button = 2)}
                            type="submit"
                            name="btn2"
                            value="2"
                            disabled={!state.button_active}
                        >
                            Update
                        </button>}
                    </form>
                    <button className="btn btn-danger btn_edit" onClick={() => dispatch({ type: 'change_switch', payload: { edit: state.button_edit } })}>ยกเลิก</button>
                </div>}

            </div>

        </div>

    )
}

export default About;