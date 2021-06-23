import React from 'react';
import { connect } from 'react-redux';
import debounce from "lodash/debounce";

import { Form, Input, Button, Select, Upload, DatePicker } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined, InboxOutlined, StopOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { DeleteIcon } from '../Icons';

import { formsCopy } from '../../utility/deepCopy';
import { studentFormItems, checkValidityItem } from '../../utility/forms';

import * as actions from '../../store/actions/guest';
import * as actionTypes from '../../store/actions/actionTypes';

const { Option } = Select;
const { Dragger } = Upload;

/* For the Select component */
function onChange(value) {
    console.log(`selected ${value}`);
}

const removeIcon = <CloseSquareOutlined
                style={{
                    color: 'red',
                    fontSize: '1em',
                    // paddingRight: '1em',
                }}
            />;

/**
 * Class-based Component for an individual student form 
 *
 * @version 
 * @author [Kofi Poku](https://github.com/pokuk76)
 */
class StudentFormComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            studentForms: this.props.studentForms // We're passing by reference, which actually works for us 
                                                    // but might cause issues later?
        };

        this.debounceHandleChange = debounce(this.debounceHandleChange.bind(this), 500);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
    }

    debounceHandleChange(form, field, value) {

        let studentForms = formsCopy(this.props.studentForms);
        let studentFormsValid = formsCopy(this.props.studentFormsValid);

        studentForms[form][field] = value;
        var rules = studentFormItems[field]['validation_rules'];
        studentFormsValid[form][field] = checkValidityItem(value, rules);

        this.props.updateStudents(studentForms, studentFormsValid);
    }

    handleChange(e) {
        /* The id is the name of the Form.Item wrapping the input
        It is also the key needed for the given form object
        */
       let form = e.target.id.split("+")[0];
       let field = e.target.id.split("+")[1];
       let value = e.target.value; 
       this.debounceHandleChange(form, field, value);
    }

    handleChangeSelect(value, option, form, field) {
        console.log("Handle Select component change [value, field, option]: ", value, field, option);
        // let [form, field] = itemUID.split("+");
        // console.log("form, field: ", form, field);
        this.debounceHandleChange(form, field, value);
    }

    handleChangeDate(dateMoment, dateString, itemUID) {
        // Should probably just send a dateString and convert that on the backend to DateField (that's actually the only choice we have Kof)
        // console.log("Handle DatePicker change (date string): ", dateString);
        let [form, field] = itemUID.split("+");
        this.debounceHandleChange(form, field, dateMoment);
    }

    getValidationProps = (form, key) => {
        // let s = (this.props.submitStatus === actionTypes.SUBMIT_INVALID_FAIL);
        return ( this.props.submitStatus===actionTypes.SUBMIT_INVALID_FAIL ) ? this.props.studentFormsValid[form][key] : null;
    }
    
    render() {

        // let fileSelected = (this.props.images[this.props.formUID]) ? true : false;
        // let fileList = (this.props.images[this.props.formUID] === undefined) ? [] : this.props.images[this.props.formUID];

        let fileSelected = false;
        let fileList = [];
        try {
            fileSelected = (this.props.images[this.props.formUID]) ? true : false;
            fileList = this.props.images[this.props.formUID];
        }
        catch(error) {
        }

        const uploadProps = {
            multiple: false,
      
            onRemove: () => {
                // console.log("Props images before remove: ", this.props.images);
                this.props.removeImage(this.props.images, this.props.formUID)
            },
      
            beforeUpload: file => {
                this.props.addImage(this.props.images, this.props.formUID, file);
                return false;
            },

            onPreview: async file => {
              let src = file.url;
              if (!src) {
                src = await new Promise(resolve => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => resolve(reader.result);
                });
              }
              // console.log("Img src: ", src);
              let modalContent = <div style={{backgroundColor:'red', height:20, width:20, }} ></div>;
              modalContent = <img src={src} alt="avatar" style={{ width: '100%' }} />;
              this.props.showModal(modalContent);
            },
      
            fileList: fileList,
            
            listType: "picture",

            showUploadList: {
              showPreviewIcon: true,
              showDownloadIcon: true,
              downloadIcon: 'download ',
              showRemoveIcon: true,
              removeIcon: removeIcon,
            },
        };

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

        const imageUpload = (
            fileSelected
                ?
                <Upload {...uploadProps} >

                </Upload>
                :
                <ImgCrop>
                    <Dragger {...uploadProps} disabled={fileSelected} >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Please provide a photo suitable for official identification</p>
                        <p className="ant-upload-hint">
                            Click or drag image to this area to upload
                                </p>
                    </Dragger>
                </ImgCrop>
        );

        const removeFormButton = (
            (Object.keys(this.props.studentForms).length > 1)
                ?
                <Form.Item style={{ marginTop: '1em' }}>
                    <Button
                        type='danger'
                        onClick={() => this.props.removeForm(this.props.studentForms, this.props.studentFormsValid, this.props.formUID, 'StudentForm')}
                    >
                        Remove
                        </Button>
                </Form.Item>
                :
                <></>
        );

        return (
            <Form 
                key={this.props.formUID} 
                layout='vertical' 
                id={this.props.formUID} 
                initialValues={this.props.initialValues} 
            >
                <Form.Item name={this.props.formUID + "+first_name"} label="First Name:"
                    rules={[
                        {
                            required: true,
                            message: 'First name required',
                        },
                    ]} 
                    { ...this.getValidationProps(this.props.formUID, 'first_name') }
                >
                    <Input
                        placeholder="Enter first name"
                        onChange={(e) => this.handleChange(e)}
                        onBlur={(e) => {console.log("First name blur event: ", e)}}
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+middle_name"} label="Middle Name:"
                    { ...this.getValidationProps(this.props.formUID, 'middle_name') }
                >
                    <Input
                        placeholder="Enter middle name"
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+last_name"} label="Last Name:"
                    rules={[
                        {
                            required: true,
                            message: 'Last name required',
                        },
                    ]} 
                    { ...this.getValidationProps(this.props.formUID, 'last_name') }
                >
                    <Input
                        placeholder="Enter last name"
                        onChange={(e) => this.handleChange(e)} 
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+sex"} label="Gender: "
                    rules={[
                        {
                            required: true,
                            message: "Student's gender is required",
                        },
                    ]} 
                    { ...this.getValidationProps(this.props.formUID, 'sex') }
                >
                    <Select
                        style={{ width: 200 }}
                        placeholder="Student's Gender"
                        optionFilterProp="sex"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(value, option) => this.handleChangeSelect(value, option, this.props.formUID, "sex")}
                    >
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                    </Select>
                </Form.Item>

                <Form.Item name={this.props.formUID + "+date_of_birth"} label="Date of Birth"
                    rules={[
                        {
                            required: true,
                            message: 'Date of birth is required',
                        },
                    ]} 
                    { ...this.getValidationProps(this.props.formUID, 'date_of_birth') }
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
                    <DatePicker 
                        onChange={(dateMoment, dateString, itemUID) => this.handleChangeDate(dateMoment, dateString, this.props.formUID + "+date_of_birth")} 
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+image_file"} label="Passport Photo: "
                    rules={[
                        {
                            required: true,
                            message: 'A passport-style photo is required', 
                        },
                    ]} 
                    { ...this.getValidationProps(this.props.formUID, 'image_file') }
                >
                    { imageUpload }
                </Form.Item>

                <Form.Item name={this.props.formUID + "+nationality"} label="Nationality:" 
                    { ...this.getValidationProps(this.props.formUID, 'nationality') }
                >
                    <Input
                        placeholder="Enter nationality"
                        onChange={(e) => this.handleChange(e)} 
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+religion"} label="Religion:"
                    { ...this.getValidationProps(this.props.formUID, 'religion') }
                >
                    <Input
                        placeholder="Enter religion" 
                        onChange={(e) => this.handleChange(e)} 
                    />
                </Form.Item>


                <Form.Item name={this.props.formUID + "+has_ailments"} label="Please list any allergies or ailments"
                    { ...this.getValidationProps(this.props.formUID, 'has_ailments') }
                >
                    <Input.TextArea onChange={(e) => this.handleChange(e)} />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+former_school"} label="Former School"
                    { ...this.getValidationProps(this.props.formUID, 'former_school') }
                >
                    <Input
                        placeholder="Enter most recently attended school " 
                        onChange={(e) => this.handleChange(e)}
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+former_school_address"} label="School Address:"
                    { ...this.getValidationProps(this.props.formUID, 'former_school_address') }
                >
                    <Input.TextArea onChange={(e) => this.handleChange(e)} />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+class_reached"} label="Select Class reached:"
                    { ...this.getValidationProps(this.props.formUID, 'class_reached') }
                >
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select the most applicable"
                        optionFilterProp="label"
                        // onChange={onChange}
                        // onFocus={onFocus}
                        // onBlur={onBlur}
                        // onSearch={onSearch}
                        filterOption={(input, option) =>
                            // option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            // console.log(option)
                            option['value'].indexOf(input.toLowerCase()) >= 0
                        } 
                        onChange={(value, option) => this.handleChangeSelect(value, option, this.props.formUID, "class_reached")} 
                        options={[
                            { label: "Test", value: "test"}, 
                            { label: "Class 1", value: "class 1"}, 
                            { label: "Class 2", value: "class 2"}, 
                            { label: "Class 3", value: "class 3"}, 
                            { label: "Class 4", value: "class 4"}, 
                            { label: "Class 5", value: "class 5"}, 
                            { label: "Class 6", value: "class 6"}, 
                            { label: "Form 1", value: "form 1"}, 
                        ]}
                    >
                    </Select>
                </Form.Item>

                <Form.Item name={this.props.formUID + "+reason_for_leaving"} label="Reason For Leaving:"
                    { ...this.getValidationProps(this.props.formUID, 'reason_for_leaving') }
                >
                    <Input 
                        placeholder="Enter reason for leaving" 
                        onChange={(e) => this.handleChange(e)}
                    />
                </Form.Item>

                { removeFormButton }
            </Form>
        );
    }
}


const mapStateToProps = state => {
    return {
        studentForms: state.guest.studentForms,
        studentFormsValid: state.guest.studentFormsValid, 
        studentUID: state.guest.studentUID,
        images: state.guest.images, 
        
        submitStatus: state.form.submitStatus, 
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateStudents: (studentForms, studentFormsValid) => dispatch(actions.updateStudents(studentForms, studentFormsValid)),
        addImage: (images, id, file) => dispatch(actions.addImage(images, id, file)),
        removeImage: (images, id) => dispatch(actions.removeImage(images, id)),
        removeForm: (studentForms, studentFormsValid, uid, currentForm, images) => dispatch(actions.removeForm(studentForms, studentFormsValid, uid, currentForm, images)),
    }
}

connect(mapStateToProps, mapDispatchToProps)(Dragger);
export { StudentFormComponent as UnconnectedStudentForm};
export default connect(mapStateToProps, mapDispatchToProps)(StudentFormComponent);


