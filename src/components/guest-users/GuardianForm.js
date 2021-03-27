import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Select, Upload, Collapse, Breadcrumb, Modal } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined, InboxOutlined, StopOutlined, CloseSquareOutlined } from '@ant-design/icons';

import * as actions from '../../store/actions/guest-registration';

const { Option } = Select;
const { Dragger } = Upload;

const removeIcon = <CloseSquareOutlined
                style={{
                    color: 'red',
                    fontSize: '1em',
                    // paddingRight: '1em',
                }}
            />;

/**
 * Class-based Component for an individual guardian form 
 *
 * @version 
 * @author [Kofi Poku](https://github.com/pokuk76)
 */
class GuardianFormComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // forms: [],
            // filesObject: {},
            uploading: false,
            // fileSelected: this.props.fileSelected,
            currentId: -1,
            // modalVisible: false,
            // modalContent: <></>,
            images: this.props.images,
            guardianForms: this.props.guardianForms // We're passing by reference, which actually works for us 
                                                    // but might cause issues later?
        };
        this.onContinue = this.onContinue.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    handleChange(e) {
        /* The id is the name of the Form.Item wrapping the input
        It is also the key needed for the given form object
        */
        let form = e.target.id.split("+")[0];
        let field = e.target.id.split("+")[1];
        this.props.guardianForms[form][field] = e.target.value;
    }

    onContinue() {
        console.log("Guardian Forms", this.props.guardianForms);
    }

    onSave = (values) => {
        console.log("onSave values", values);
        console.log("id", this.props.id);
        console.log("First name: ", values.target['first_name']);
    }

    render() {

        // const initialValues = this.getInitialValues();
        // console.log("Initial Values: ", initialValues);
        let fileSelected = (this.props.images[this.props.formUID]) ? true : false;
        let fileList = (this.props.images[this.props.formUID] === undefined) ? [] : this.props.images[this.props.formUID];

        const uploadProps = {
            multiple: false,
      
            onRemove: () => {
                // console.log("Props images before remove: ", this.props.images);
                this.props.removeImage(this.props.images, this.props.formUID, this.props.guardianForms)
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
                this.props.addImage(this.state.images, this.props.formUID, file, this.props.guardianForms);
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

        return (
            <Form
                key={"GuardianForm"}
                layout='vertical'
                id={"GuardianForm"}
                initialValues={this.props.initialValues}

            >
                {/* <h1>ID: {formUID}</h1> */}
                <Form.Item name={this.props.formUID + "+first_name"} label="First Name:"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your first name',
                        },
                        {
                            max: 64,
                        }
                    ]}
                >
                    <Input
                        placeholder="First name"
                        onChange={e => this.handleChange(e)}
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+middle_name"} label="Middle Name:"
                    rules={[
                        {
                            max: 64,
                            message: 'Middle name must be less than 64 characters'
                        }
                    ]}
                >
                    <Input
                        placeholder="Middle name"
                        onChange={e => this.handleChange(e)}
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+last_name"} label="Last Name:"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your last name',
                        },
                        {
                            max: 64,
                            message: 'Last name must be less than 64 characters'
                        }
                    ]}
                >
                    <Input
                        placeholder="Last name"
                        onChange={e => this.handleChange(e)}
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+phone_number"} label="Telephone Number:"
                    // Add an object with pattern (holding a regex for acceptable phone number input) 
                    // to rules 
                    rules={[
                        {
                            required: true,
                            message: 'Please input a phone number',
                        },
                        {
                            max: 13,
                            message: 'Phone number must be less than 13 characters'
                        }
                    ]}
                >
                    <Input
                        placeholder="Enter your phone number"
                        type="tel"
                        maxLength={13}

                        onChange={e => this.handleChange(e)}
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+email_address"} label="Email:"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail',
                        },
                        {
                            max: 64,
                            message: 'E-mail must be less than 32 characters'
                        }
                    ]}
                >
                    <Input
                        placeholder="Enter your email"
                        type="email"
                        onChange={e => this.handleChange(e)}
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+nationality"} label="Nationality:"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your nationality',
                        },
                        {
                            max: 128,
                            message: 'Nationality must be less than 128 characters'
                        }
                    ]}
                >
                    <Input
                        placeholder="Enter your nationality"
                        onChange={e => this.handleChange(e)}
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+religion"} label="Religion:"
                    rules={[
                        {
                            max: 128,
                            message: 'Religion must be less than 128 characters'
                        }
                    ]}
                >
                    <Input
                        placeholder="Enter your religion"
                        onChange={e => this.handleChange(e)}
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+guardian_type"} label="Guardian Type:"
                    rules={[
                        {
                            required: true,
                            message: 'Field is required',
                        },
                    ]}
                >
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Relationship with students"
                        optionFilterProp="children"
                        // onChange={onChange}
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

                <Form.Item name={this.props.formUID + "+lives_with_guardian"}
                    label="Do the students live with guardian?"
                    rules={[
                        {
                            required: true,
                            message: 'Field is required',
                        },
                    ]}
                >
                    {/* This is going to be a checkbox */}
                    <Select
                        style={{ width: 200 }}
                        placeholder="Select yes or no"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                    </Select>
                </Form.Item>

                <Form.Item name={this.props.formUID + "+occupation"} label="Occupation:"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your occupation',
                        },
                        {
                            max: 256,
                            message: 'Occupation must be less than 128 characters'
                        }
                    ]}
                >
                    <Input
                        placeholder="Enter occupation"
                        onChange={e => this.handleChange(e)}
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+place_of_work"} label="Place of Work:"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your place of work',
                        },
                        {
                            max: 256,
                            message: 'Place of work must be less than 128 characters'
                        }
                    ]}
                >
                    <Input
                        placeholder="Enter place of work"
                        onChange={e => this.handleChange(e)}
                    />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+home_address"} label="Home Address:">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item name={this.props.formUID + "+postal_address"} label="Postal Address:">
                    <Input.TextArea />
                </Form.Item>

                {/* {fileList.append(formUID)} */}
                {
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
                                <p className="ant-upload-text">Click or drag image to this area to upload</p>
                                <p className="ant-upload-hint">
                                    One upload per guardian
                                </p>
                            </Dragger>
                        </ImgCrop>

                }

                {
                    (Object.keys(this.props.guardianForms).length > 1)
                        ?
                        <Form.Item style={{ marginTop: '1em' }}>
                            <Button
                                type='danger'
                                onClick={() => this.props.remove(this.props.guardianForms, this.props.formUID, 'GuardianForm')}
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
};

const mapStateToProps = state => {
    // console.log("Forms state-to-props: ", state);
    return {
        guardianForms: state.guest.guardianForms,
        guardianUID: state.guest.guardianUID,
        images: state.guest.images
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addForm: (forms, uid, currentForm, images) => dispatch(actions.addForm(forms, uid, currentForm, images)),
        addImage: (images, id, file, formData) => dispatch(actions.addImage(images, id, file, formData)),
        removeImage: (images, id, formData) => dispatch(actions.removeImage(images, id, formData)),
        remove: (guardianForms, uid, currentForm, images) => dispatch(actions.removeForm(guardianForms, uid, currentForm, images)),
    }
}

connect(mapStateToProps, mapDispatchToProps)(Dragger);
export default connect(mapStateToProps, mapDispatchToProps)(GuardianFormComponent);
