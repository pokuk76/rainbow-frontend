import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Select, Upload, Collapse, Breadcrumb, Modal, DatePicker } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined, InboxOutlined, StopOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { DeleteIcon } from '../Icons';

import { formsCopy } from '../../utilities/deepCopy';

import * as actions from '../../store/actions/guest-registration';

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
        this.onContinue = this.onContinue.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    handleChange(e) {

        /* The id is the name of the Form.Item wrapping the input
        It is also the key needed for the given form object
        */
        
        let studentForms = formsCopy(this.props.studentForms);
        let form = e.target.id.split("+")[0];
        let field = e.target.id.split("+")[1];
        studentForms[form][field] = e.target.value;
        this.props.updateForms(studentForms);

        // let form = e.target.id.split("+")[0];
        // let field = e.target.id.split("+")[1];
        // this.props.studentForms[form][field] = e.target.value;
    }

    onContinue() {
        console.log("Student Forms", this.props.studentForms);
    }

    onSave = (values) => {
        console.log("onSave values", values);
        console.log("id", this.props.id);
        console.log("First name: ", values.target['first_name']);
    }
    
    render() {

        let fileSelected = (this.props.images[this.props.formUID]) ? true : false;
        let fileList = (this.props.images[this.props.formUID] === undefined) ? [] : this.props.images[this.props.formUID];

        const uploadProps = {
            multiple: false,
      
            onRemove: () => {
                // console.log("Props images before remove: ", this.props.images);
                this.props.removeImage(this.props.images, this.props.formUID, this.props.studentForms)
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
                this.props.addImage(this.state.images, this.props.formUID, file, this.props.studentForms);
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
                    >
                        <Option value="male">M</Option>
                        <Option value="female">F</Option>
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
                    <DatePicker />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+has_ailments"} label="Does this student have allergies or ailments?">
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
                                        currentId: this.props.formUID,
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
                                            currentId: this.props.formUID,
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
                            onClick={() => this.props.remove(this.props.studentForms, this.props.formUID, 'StudentForm')}
                        >
                            Remove
                        </Button>
                    </Form.Item>
                    :
                    <></>
                }
            </Form>
        );
    }

}


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
        updateForms: (studentForms) => dispatch(actions.updateStudents(studentForms)),
        addImage: (images, id, file, formData) => dispatch(actions.addImage(images, id, file, formData)),
        removeImage: (images, id, formData) => dispatch(actions.removeImage(images, id, formData)),
        remove: (studentForms, uid, currentForm, images) => dispatch(actions.removeForm(studentForms, uid, currentForm, images)),
    }
}

connect(mapStateToProps, mapDispatchToProps)(Dragger);
export default connect(mapStateToProps, mapDispatchToProps)(StudentFormComponent);


