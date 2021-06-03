import React from 'react';
import { connect } from 'react-redux';
import debounce from "lodash/debounce";

import { Form, Input, Button, Select, Upload, DatePicker } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined, InboxOutlined, StopOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { DeleteIcon } from '../Icons';

import { formsCopy } from '../../utility/deepCopy';
import { checkValidityElement } from '../../utility/forms';


import * as actions from '../../store/actions/guest';

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
            uploading: false,
            currentId: -1,
            images: this.props.images,
            studentForms: this.props.studentForms // We're passing by reference, which actually works for us 
                                                    // but might cause issues later?
        };
        this.debounceHandleChange = debounce(this.debounceHandleChange.bind(this), 500);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);

    }

    debounceHandleChange(form, field, value) {

        let studentForms = formsCopy(this.props.studentForms);
        let studentFormsValid = formsCopy(this.props.studentFormsValid);
        // let guardianFormsTouched = formsCopy(this.props.guardianFormsTouched);

        studentForms[form][field] = value;
        studentFormsValid[form][field] = checkValidityElement(value, ["required"]);

        this.props.updateForms(studentForms, studentFormsValid);
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

    handleChangeSelect(value) {
        console.log("Handle Select component change event: ", value);
    }

    handleChangeDate(dateMoment, dateString) {
        console.log("Handle DatePicker change (date moment obj): ", dateMoment);
        // Should probably just send a dateString and convert that on the backend to DateField
        console.log("Handle DatePicker change (date string): ", dateString);
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
                let images = {...this.state.images};
                // delete images[this.state.currentId];
                this.setState(
                    {
                        images: images,
                    }
                );
            },
      
            beforeUpload: file => {
                // console.log("Props images before upload: ", this.props.images);
                this.props.addImage(this.state.images, this.props.formUID, file);
                // console.log("Props images after upload: ", this.props.images);
                let images = {...this.props.images};
                this.setState(state => ({
                    images: images,
                }));
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
                key={"StudentForm"} 
                layout='vertical' 
                id={"StudentForm"} 
                initialValues={this.props.initialValues} 

            >
                {/* <h1>ID: {formUID}</h1> */}
                <Form.Item name={this.props.formUID + "+first_name"} label="First Name:"
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
                        onBlur={(e) => {console.log("First name blur event: ", e)}}
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+middle_name"} label="Middle Name:">
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
                >
                    <Input
                        placeholder="Enter last name"
                        onChange={(e) => this.handleChange(e)}

                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+nationality"} label="Nationality:">
                    <Input
                        placeholder="Enter nationality"
                        onChange={(e) => this.handleChange(e)}

                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+religion"} label="Religion:">
                    <Input
                        placeholder="Enter religion"
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+sex"} label="Gender: "
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
                        onChange={(value) => this.handleChangeSelect(value)}
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
                    <DatePicker onChange={(dateMoment, dateString) => this.handleChangeDate(dateMoment, dateString)} />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+image_file"} label="Passport Photo: "
                    rules={[
                        {
                            required: true,
                            message: 'A passport-style photo is required', 
                        },
                    ]}
                >
                    { imageUpload }
                </Form.Item>

                <Form.Item name={this.props.formUID + "+has_ailments"} label="Please list any allergies or ailments">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+former_school"} label="Former School">
                    <Input
                        placeholder="Enter most recently attended school "
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+former_school_address"} label="School Address:">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+class_reached"} label="Select Class reached:">
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

                <Form.Item name={this.props.formUID + "+reason_for_leaving"} label="Reason For Leaving:">
                    <Input
                        placeholder="Enter reason for leaving"
                    />
                </Form.Item>

                {/* {console.log('Form ID: ', formUID)} */}
                {/* {fileList.append(formUID)} */}

                { removeFormButton }
            </Form>
        );
    }
}


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
        updateForms: (studentForms, studentFormsValid) => dispatch(actions.updateStudents(studentForms, studentFormsValid)),
        addImage: (images, id, file) => dispatch(actions.addImage(images, id, file)),
        removeImage: (images, id) => dispatch(actions.removeImage(images, id)),
        removeForm: (studentForms, studentFormsValid, uid, currentForm, images) => dispatch(actions.removeForm(studentForms, studentFormsValid, uid, currentForm, images)),
    }
}

connect(mapStateToProps, mapDispatchToProps)(Dragger);
export default connect(mapStateToProps, mapDispatchToProps)(StudentFormComponent);


