import React from 'react';
import { connect } from 'react-redux';

import { Button, Collapse, Breadcrumb, Modal } from 'antd';
import { FileAddOutlined, CloseSquareOutlined, UserAddOutlined, RightOutlined } from '@ant-design/icons';

// import StudentFormComponent from '../components/StudentForm';
import StudentFormComponent from '../components/Form';

import * as actions from '../../store/actions/guest';
import { studentFormItems, getInitialValues, checkValidityForm } from '../../utility/forms';

/* For the Select component */
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
function setPanelHeader(text, formValid) {
    return (
        <div style={{ display: 'inline-flex', marginLeft: '1em', height: '100%', width: '70%' }}>
            <h1 style={{ fontSize: '1.5em', margin: 'auto', textAlign: 'right',
                height: '100%', width: '60%', // backgroundColor: 'red',
            }} >
                { text }
                {/* { ( formValid === null ) ? " Valid" : "Not Valid" } */}
            </h1>
        </div>
    );
}

class StudentForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            forms: [],
            uploading: false,
            modalVisible: false, 
            modalContent: <></>, 
            // studentForms: this.props.studentForms // We're passing by reference, which actually works well in this case 
                                                    // but might cause issues later?
        };

    }

    componentDidMount() {
        window.scroll({
            top: 0, 
            left: 0, 
            behavior: 'smooth'
        });
    }

    /**
     * Called when the user clicks on an uploaded image
     * @function
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
     * @function
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

        var forms = [];
        let i = 0;
        const initialFormValues = getInitialValues(this.props.studentForms);
        for (let formUID in this.props.studentForms){
            var key = "StudentPanel" + i;

            const studentFormProps = {
                showModal: this.showModal,
                update: this.props.updateStudents,
                addImage: this.props.addImage,
                addForm: this.props.addForm,
                removeForm: this.props.removeForm,

                formUID: formUID,
                forms: this.props.studentForms,
                formsValid: this.props.studentFormsValid,
                images: this.props.images,
                submitStatus: this.props.submitStatus,

                initialValues: initialFormValues[formUID],
                formFields: studentFormItems,
                formType: 'StudentForm'
            }

            let closeIcon = <CloseSquareOutlined
                // onMouseEnter={console.log("Square Hover")}
                onClick={event => {
                    event.stopPropagation();
                    this.props.removeForm(
                        this.props.studentForms, 
                        this.props.studentFormsValid, 
                        formUID, 'StudentForm', this.props.images
                    );
                }}
                style={{
                    // color: 'red',
                    // ":hover": { fontColor: "blue" },
                    fontSize: '2em',
                    margin: 'auto',
                }}
            />;

            let n = parseInt(formUID.split('_')[1], 10);

            forms.push(
                <Panel
                    // style={{":hover": { backgroundColor: "blue"}, zIndex: 1}} 
                    header={setPanelHeader("Student " + (n + 1), checkValidityForm(formUID, this.props.studentFormsValid))}
                    key={key}
                    extra={
                        (Object.keys(this.props.studentForms).length > 1) ?

                            <Button type="text" icon={closeIcon} style={{ padding: 0, }} danger>

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
        // this.setState({forms: forms});
        return forms;

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
                    style={{width: '80%', margin: 'auto'}}
                >
                    {this.renderForms()}
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
                <Button
                    key={this.props.selectedMenuItem}
                    onClick={
                        () => this.props.addForm(
                            this.props.studentForms,
                            this.props.studentFormsValid,
                            this.props.studentUID,
                            'StudentForm')
                    }
                    style={{ marginLeft: '10%' }}
                >
                    <FileAddOutlined /> Add Student
                </Button>
                <br />
                <br />
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        studentForms: state.guest.studentForms,
        studentFormsValid: state.guest.studentFormsValid,
        studentUID: state.guest.studentUID,
        images: state.guest.images,

        submitStatus: state.form.submitStatus,
    }
};
  
const mapDispatchToProps = dispatch => {
    return {
        updateStudents: (studentForms, studentFormsValid) =>
            dispatch(actions.updateStudents(studentForms, studentFormsValid)),
        addForm: (forms, studentFormsValid, uid, currentForm) =>
            dispatch(actions.addForm(forms, studentFormsValid, uid, currentForm)),
        removeForm: (studentForms, studentFormsValid, uid, currentForm, images) =>
            dispatch(actions.removeForm(studentForms, studentFormsValid, uid, currentForm, images)),
        addImage: (images, id, file) =>
            dispatch(actions.addImage(images, id, file)),
        removeImage: (images, id, formData) =>
            dispatch(actions.removeImage(images, id, formData)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentForm);