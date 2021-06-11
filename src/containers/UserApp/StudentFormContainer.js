import React from 'react';
import { connect } from 'react-redux';

import { Button, Collapse, Breadcrumb, Modal } from 'antd';
import {
    InboxOutlined, FileAddOutlined, CloseSquareOutlined, SaveOutlined, UserAddOutlined,
    RightOutlined, CalendarOutlined
} from '@ant-design/icons';

import { getInitialValues, checkValidityForm } from '../../utility/forms';
import * as actions from '../../store/actions/guest';

import StudentFormComponent from '../../components/UserApp/StudentForm';

// Opera 8.0+
// const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
const isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
// const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
const isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
const isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 71
const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Blink engine detection
// const isBlink = (isChrome || isOpera) && !!window.CSS;

/* For the Select component */
function onChange(value) {
    console.log(`selected ${value}`);
}

function onBlur() {
    console.log('blur');
}

function onFocus() {
    console.log('focus');
}

function onSearch(val) {
    console.log('search:', val);
}
/* ****************** */


/* Collapse */
const { Panel } = Collapse;

function callback(key) {
    console.log(key);
}
 
/*******/

function panelHeader(text) {
    return <div style={{ display: 'inline-flex', marginLeft: '1em', height: '100%', width: '70%', }}><h1
        style={{
            fontSize: '1.5em',
            margin: 'auto',
            textAlign: 'right',
            height: '100%',
            width: '60%',
            // backgroundColor: 'red',
        }}
    >
        {text}
    </h1></div>;
}

function setPanelHeader(text, formValid) {
    return (
        <div style={{ display: 'inline-flex', marginLeft: '1em', height: '100%', width: '70%' }}>
            <h1 style={{ fontSize: '1.5em', margin: 'auto', textAlign: 'right',
                height: '100%', width: '60%', // backgroundColor: 'red',
            }} >
                {text}
                { ( formValid === null ) ? " Valid" : "Not Valid" }
            </h1>
        </div>
    );
}

class StudentForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            forms: [],
            fileList: this.props.fileList,
            uploading: false,
            fileSelected: this.props.fileSelected,
            modalVisible: false, 
            modalContent: <></>, 
            // studentForms: this.props.studentForms // We're passing by reference, which actually works for us 
                                                    // but might cause issues later?
        };

        // this.onCollapse = this.onCollapse.bind(this);
    }

    componentDidMount() {
        window.scroll({
            top: 0, 
            left: 0, 
            behavior: 'smooth'
        });
        this.renderForms();

    }

    componentDidUpdate(prevProps){
        /*  Added this to ensure that the forms re-render on add or remove
            Feels mad ghetto but it's working
        */

        if(prevProps.studentForms !== this.props.studentForms || prevProps.images !== this.props.images ){
            this.renderForms();
        }
    }

    /**
     * Called when the user clicks on an uploaded image
     * @param {ReactNode} body - content for the modal (In this case an image)
     */
    showModal = (body) => {
        this.setState({
            modalVisible: true,
            modalContent: body,
        });
    };

    /**
     * Called when the user clicks OK on the modal
     * @param {Event} e - A click event
     */
    handleOk = (e) => {
        // console.log(e);
        this.setState({
            modalVisible: false,
        });
    };

    // Right now, handleOk and handleCancel are doing the same thing (and the buttons are doing the same things)
    // TODO: Remove cancel (think that could be confusing language i.e. cancel the upload)
    handleCancel = (e) => {
        // console.log(e);
        this.setState({
            modalVisible: false,
        });
    };

    /* Currently Unused */ 
    getInitialValues() {
        const studentForms = this.props.studentForms;
        let initialValues = {}; // Each form has its own initial values and we'll map then using the form's id

        for (let formUID in studentForms){
            let formItems = studentForms[formUID];
            let initialForm = {};
            try{
                for (const [name, value] of Object.entries(formItems)) {
                    console.log(`${name}: ${value}`);
                    let key = formUID + "+" + name;
                    // initialForm[name] = value;
                    initialValues[key] = value;
                }
            }
            catch(error) {
                //initialValues[formUID] = initialForm;
            }
        }

        return initialValues;
    }

    renderForms = () => {
    // componentDidMount() {
        // console.log("Render forms");
        // const { fileList, uploading, fileSelected } = this.state;

        var forms = [];
        let i = 0;
        const initialFormValues = getInitialValues(this.props.studentForms);
        for (let formUID in this.props.studentForms){
            // let fileSelected = (this.props.images[formUID]) ? true : false;
            // let fileList = this.props.images[formUID];
            var key = "StudentPanel" + i;
            let closeIcon = <CloseSquareOutlined
                // onMouseEnter={console.log("Square Hover")}
                onClick={event => {
                    event.stopPropagation();
                    this.props.removeForm(this.props.studentForms, this.props.studentFormsValid, formUID, 'StudentForm', this.props.images);
                }}
                style={{
                    // color: 'red',
                    // ":hover": { fontColor: "blue" },
                    fontSize: '2em',
                    margin: 'auto',
                    // backgroundColor: 'black',
                    // display: 'inline',
                }}
            />;

            const studentFormProps = {
                showModal: this.showModal,
                formUID: formUID,
                initialValues: initialFormValues[formUID]
            }

            let n = parseInt(formUID.split('_')[1], 10);
            console.log('FormUID :', formUID);
            forms.push(
            <Panel 
                // style={{":hover": { backgroundColor: "blue"}, zIndex: 1}} 
                header={ setPanelHeader("Student " + (n+1), checkValidityForm(formUID, this.props.studentFormsValid)) } 
                // header={setPanelHeader("Student " + (n+1))} 
                key={key} 
                extra={
                    (Object.keys(this.props.studentForms).length > 1) ? 

                    <Button type="text" icon={closeIcon} style={{padding: 0, }} danger>
                        
                    </Button>
                     : <></>
                }
                
            >
                <StudentFormComponent {...studentFormProps} />
                {/* </Form> */}
            </Panel>
            );
            i++;
        }
        this.setState({forms: forms});

    }


    render() {

        return (
            <div>
                <Breadcrumb style={{ margin: '3.5em 0 2em 0' }}>
                    <Breadcrumb.Item>Portals</Breadcrumb.Item>
                    <Breadcrumb.Item>Registration</Breadcrumb.Item>
                    <Breadcrumb.Item>Student Details</Breadcrumb.Item>
                </Breadcrumb>

                <h1><UserAddOutlined /> Students</h1>
                <br />
                <br />
                <Collapse
                    key='CollapseStudents'
                    defaultActiveKey={['StudentPanel0']}
                    onChange={callback}
                    expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} style={{ fontSize: '2em', }} />}
                    expandIconPosition='left'
                >
                    {/* { console.log("Forms: ", this.state.forms) } */}
                    {this.state.forms}
                </Collapse>

                <Modal
                    title="Your Upload"
                    className="imageModal"
                    visible={this.state.modalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    {this.state.modalContent}
                </Modal>

                <br />
                {/* { console.log("Selected menu item: ", this.state.selectedMenuItem) } */}
                <Button key={this.props.selectedMenuItem} onClick={() => this.props.addForm(this.props.studentForms, this.props.studentFormsValid, this.props.studentUID, 'StudentForm')}>
                    <FileAddOutlined /> Add Student
                </Button>
                <br />
                <br />
            </div>
        );
    }
};

const mapStateToProps = state => {
    // console.log("Forms state-to-props: ", state);
    return {
        studentForms: state.guest.studentForms,
        studentFormsValid: state.guest.studentFormsValid, 
        studentUID: state.guest.studentUID,
        images: state.guest.images
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
        addForm: (forms, studentFormsValid, uid, currentForm) => dispatch(actions.addForm(forms, studentFormsValid, uid, currentForm)),
        removeImage: (images, id, formData) => dispatch(actions.removeImage(images, id, formData)),
        removeForm: (studentForms, studentFormsValid, uid, currentForm, images) => dispatch(actions.removeForm(studentForms, studentFormsValid, uid, currentForm, images)),
    }
  }
  
//   connect(mapStateToProps, mapDispatchToProps)(Dragger);
  export default connect(mapStateToProps, mapDispatchToProps)(StudentForm);