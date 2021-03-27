import React from 'react';
import { connect } from 'react-redux';

import { Form, Input, Button, Select, Upload, Collapse, Breadcrumb, DatePicker } from 'antd';
import ImgCrop from 'antd-img-crop';
import { InboxOutlined, FileAddOutlined, CloseSquareOutlined, SaveOutlined, UserAddOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';


import * as actions from '../../store/actions/guest-registration';
import { DeleteIcon } from '../../components/Icons';

const { Option } = Select;
const { Dragger } = Upload;

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

class StudentForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            forms: [],
            fileList: this.props.fileList,
            uploading: false,
            fileSelected: this.props.fileSelected,
            currentId: -1,
            images: this.props.images,
            studentForms: this.props.studentForms // We're passing by reference, which actually works for us 
                                                    // but might cause issues later?
        };

        this.onRemoveImage = this.onRemoveImage.bind(this);
        this.onPreview = this.onPreview.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        // this.onCollapse = this.onCollapse.bind(this);
        this.renderForms = this.renderForms.bind(this);
        this.onContinue = this.onContinue.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    handleChange = (e) => {
        /* The id is the name of the Form.Item wrapping the input
        It is also the key needed for the given form object
        */

        let form = e.target.id.split("+")[0];
        let field = e.target.id.split("+")[1];

        this.props.studentForms[form][field] = e.target.value;
    }

    onContinue = () => {
        console.log("Student Forms", this.props.studentForms);
    }

    onSave = (values) => {
        console.log("onSave values", values);
        console.log("id", this.props.id);
        console.log("First name: ", values.target['first_name']);
    }

    onRemoveImage = () => {
        this.props.removeImage(this.props.images, this.props.id, this.props.studentForms)
        this.setState(
            {
                // fileList: this.props.images[this.props.id],
                fileList: [],
                fileSelected: false,
            }
        );
    }

    beforeUpload(file, fileList) {
        // console.log("File: ", file);
        // console.log("ID: ", this.state.currentId);
        // console.log("Filelist: ", fileList);
        this.props.persistImage(this.props.images, this.state.currentId, file, this.props.studentForms);
        this.setState(
            {
                fileList: this.props.images[this.props.id],
                fileSelected: true,
            }
        );
        // this.props.fileSelected = true;
        // console.log("file list: ", this.props.images);
        return false;
    }

    onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    }

    componentDidMount() {
        this.renderForms();
        window.scroll({
            top: 0, 
            left: 0, 
            behavior: 'smooth'
          });
    }

    componentDidUpdate(prevProps){
        /*  Added this to ensure that the forms re-render on add or remove
            Feels mad ghetto but it's working
        */
       console.log("Prev props:", prevProps);
       console.log("State images:", this.state.images);
        if(prevProps.studentForms !== this.props.studentForms || this.state.images !== prevProps.images ){
            // console.log("A disturbance in the force");
            this.setState(
                {
                    images: this.props.images
                }
            );
            this.renderForms();
        }
    }

    
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
        const { fileList, uploading, fileSelected } = this.state;
        const props = {
            multiple: false,

            // fileList: this.props.images[this.props.id],

            showUploadList: {
                showDownloadIcon: true,
                downloadIcon: 'download ',
                showRemoveIcon: true,
                removeIcon: <DeleteIcon />,
            },

        };

        var forms = [];
        let i = 0;
        for (let formUID in this.props.studentForms){
            let fileSelected = (this.props.images[formUID]) ? true : false;
            let fileList = this.props.images[formUID];
            var key = "StudentPanel" + i;
            this.setState(
            {
                currentId: formUID,
            });
            let closeIcon = <CloseSquareOutlined
                // onMouseEnter={console.log("Square Hover")}

                onClick={event => {
                    event.stopPropagation();
                    this.props.remove(this.props.studentForms, formUID, 'StudentForm');
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
            let n = parseInt(formUID.split('_')[1], 10);
            console.log('FormUID :', formUID);
            forms.push(
            <Panel 
                // style={{":hover": { backgroundColor: "blue"}, zIndex: 1}} 
                header={panelHeader("Student " + (n+1))} 
                key={key} 
                extra={
                    (Object.keys(this.props.studentForms).length > 1) ? 

                    <Button type="text" icon={closeIcon} style={{padding: 0, }} danger>
                        
                    </Button>
                     : <></>
                }
                
            >
                <div>
                    {/* <h1>ID: {formUID}</h1> */}
                    <Form.Item name={formUID + "+first_name"} label="First Name:"
                        rules={[
                            {
                                required: true,
                                message: 'First name required',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Enter first name" 
                            onChange={(e) => this.handleChange(e)} 
                        />
                    </Form.Item>

                    <Form.Item name={formUID + "+middle_name"} label="Middle Name:">
                        <Input
                            placeholder="Enter middle name"
                        />
                    </Form.Item>

                    <Form.Item name={formUID + "+last_name"} label="Last Name:"
                        rules={[
                            {
                                required: true,
                                message: 'Last name required',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Enter last name"
                            onChange={(e) => this.handleChange(e)} 

                        />
                    </Form.Item>

                    <Form.Item name={formUID + "+nationality"} label="Nationality:">
                        <Input
                            placeholder="Enter nationality"
                            onChange={(e) => this.handleChange(e)} 

                        />
                    </Form.Item>

                    <Form.Item name={formUID + "+religion"} label="Religion:">
                        <Input
                            placeholder="Enter religion"
                        />
                    </Form.Item>

                    <Form.Item name={formUID + "+sex"} label="Gender: "
                        rules={[
                            {
                                required: true,
                                message: "Student's gender is required",
                            },
                        ]}
                    >
                        {/* This is going to be a selection */}
                        <Select
                            style={{ width: 200 }}
                            placeholder="Student's Gender"
                            optionFilterProp="sex"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="male">M</Option>
                            <Option value="female">F</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name={formUID + "+date_of_birth"} label="Date of Birth"
                        rules={[
                            {
                                required: true,
                                message: 'Date of birth is required',
                            },
                        ]}
                    >
                        {/* {(isChrome) ? 
                            <Input
                                type='date'
                                placeholder="Date Field"
                                onChange={(e) => this.handleChange(e)}
                                style={{ height: '100%' }}
                            // iconRender={<CalendarOutlined />} 
                            /> : <DatePicker />
                        } */}
                        <DatePicker />
                    </Form.Item>

                    <Form.Item name={formUID + "+has_ailments"} label="Does this student have allergies or ailments?">
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item name={formUID + "+former_school"} label="Former School">
                        <Input
                            placeholder="Enter most recently attended school "
                        />
                    </Form.Item>

                    <Form.Item name={formUID + "+former_school_address"} label="School Address:">
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item name={formUID + "+class_reached"} label="Select Class reached:">
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select the most applicable"
                            optionFilterProp="children"
                            onChange={onChange}
                            // onFocus={onFocus}
                            // onBlur={onBlur}
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="father">Father</Option>
                            <Option value="mother">Mother</Option>
                            <Option value="legal_guardian">Legal Guardian</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name={formUID + "+reason_for_leaving"} label="Reason For Leaving:">
                        <Input
                            placeholder="Enter reason for leaving"
                        />
                    </Form.Item>

                    {/* {console.log('Form ID: ', formUID)} */}
                    {/* {fileList.append(formUID)} */}
                    {
                        fileSelected
                        ?
                        <Upload
                            onRemove={this.onRemoveImage}
                            onPreview={this.onPreview}
                            beforeUpload={
                                (file, fileList) => {
                                    this.setState(
                                        {
                                            currentId: formUID,
                                        }
                                    ); 
                                    return this.beforeUpload(file, fileList); 
                                }
                            }  
                            {...props}
                            fileList={fileList}
                        >
                        {/* TODO: Pass an initial value for the image to the Upload component so it shows up 
                        on re-render e.g. when we add a new form*/}
                        </Upload>
                        :
                        <ImgCrop>
                            <Dragger
                                onRemove={this.onRemoveImage} 
                                onPreview={this.onPreview} 
                                beforeUpload={
                                    (file, fileList) => {
                                        this.setState(
                                            {
                                                currentId: formUID,
                                            }
                                        ); 
                                        return this.beforeUpload(file, fileList); 
                                    } 
                                } 
                                {...props} 
                                disabled={fileSelected} 
                            >
                                {/* <Button icon={<UploadOutlined />} disabled={this.state.fileSelected} >Select File</Button> */}


                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag image to this area to upload</p>
                                <p className="ant-upload-hint">
                                    One upload per student
                                </p>


                            </Dragger>
                        </ImgCrop>

                    }

                    {
                        (Object.keys(this.props.studentForms).length > 1)
                        ?
                        <Form.Item style={{marginTop: '1em'}}>
                            <Button
                                type='danger'
                                onClick={() => this.props.remove(this.props.studentForms, formUID, 'StudentForm')}
                            >
                                Remove
                            </Button>
                        </Form.Item>
                        :
                        <></>
                    }
                </div>
                {/* </Form> */}
            </Panel>
            );
            i++;
        }
        // console.log("Forms in cDM: ", forms);

        this.setState({forms: forms});

    }


    render() {

        const initialValues = this.getInitialValues();
        // console.log("Initial Values: ", initialValues);

        return (
            <div>
                <Breadcrumb style={{ margin: '3.5em 0 2em 0' }}>
                    <Breadcrumb.Item>Portals</Breadcrumb.Item>
                    <Breadcrumb.Item>Registration</Breadcrumb.Item>
                    <Breadcrumb.Item>Student Details</Breadcrumb.Item>
                </Breadcrumb>
            <h1><UserAddOutlined /> Students</h1>
            <br />
            <Form 
                key={"StudentForm"} 
                layout='vertical' 
                id={"StudentForm"} 
                initialValues={initialValues} 

            >
            <br />
            <Collapse
                key='CollapseStudents'
                defaultActiveKey={['StudentPanel0']}
                onChange={callback}
                expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} style={{ fontSize: '2em', }} />}
                expandIconPosition='left' 
            >
                {/* { console.log("Forms: ", this.state.forms) } */}
                { this.state.forms }
            </Collapse>
            
            <br />
            {/* { console.log("Selected menu item: ", this.state.selectedMenuItem) } */}
            <Button key={this.props.selectedMenuItem} onClick={() => this.props.addForm(this.props.studentForms, this.props.studentUID, 'StudentForm') }>
                <FileAddOutlined /> Add Student
            </Button>

            <br/>
            <br/>

            </Form>
            
          </div>
        );
    }
};

const mapStateToProps = state => {
    // console.log("Forms state-to-props: ", state);
    return {
        studentForms: state.guest.studentForms,
        studentUID: state.guest.studentUID,
        images: state.guest.images
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
        addForm: (forms, uid, currentForm, images) => dispatch(actions.addForm(forms, uid, currentForm, images)),
        persistImage: (images, id, file, formData) => dispatch(actions.addImage(images, id, file, formData)),
        removeImage: (images, id, formData) => dispatch(actions.removeImage(images, id, formData)),
        remove: (studentForms, uid, currentForm) => dispatch(actions.removeForm(studentForms, uid, currentForm)),
    }
  }
  
  connect(mapStateToProps, mapDispatchToProps)(Dragger);
  export default connect(mapStateToProps, mapDispatchToProps)(StudentForm);