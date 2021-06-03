import React from 'react';
import { connect } from 'react-redux';
import debounce from "lodash/debounce";
// import throttle from "lodash/throttle";

import { Form, Input, Button, Select, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined, InboxOutlined, StopOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { formsCopy } from '../../utility/deepCopy';
import { checkValidityElement } from '../../utility/forms';

import * as actions from '../../store/actions/guest';

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
 * @version 0.1
 * @author [Kofi Poku](https://github.com/pokuk76)
 */
class GuardianFormComponent extends React.Component {

    constructor(props) {
        super(props);

        // this.state = {
        // };

        this.debounceHandleChange = debounce(this.debounceHandleChange.bind(this), 500);
        this.handleChange = this.handleChange.bind(this);
    }

    debounceHandleChange(form, field, value) {

        let guardianForms = formsCopy(this.props.guardianForms);
        let guardianFormsValid = formsCopy(this.props.guardianFormsValid);
        let guardianFormsTouched = formsCopy(this.props.guardianFormsTouched);

        guardianForms[form][field] = value;
        guardianFormsValid[form][field] = checkValidityElement(value, ["required"]);

        this.props.updateForms(guardianForms, guardianFormsValid);
        // this.props.updateForms(guardianForms, guardianFormsValid);
    }

    handleChange(e) {
        /* The id is the name of the Form.Item wrapping the input
        It is also the key needed for the given form object
        */
       
       let form = e.target.id.split("+")[0];
       let field = e.target.id.split("+")[1];
       let value = e.target.value; 
       this.debounceHandleChange(form, field, value);
        // let form = e.target.id.split("+")[0];
        // let field = e.target.id.split("+")[1];
        // this.props.guardianForms[form][field] = e.target.value;
    }

    render() {

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
                // console.log("Props images before upload: ", this.props.images);
                this.props.addImage(this.props.images, this.props.formUID, file);
                // console.log("Props images after upload: ", this.props.images);
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
              modalContent = <img src={src} alt="your upload" style={{ width: '100%' }} />;
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
            (Object.keys(this.props.guardianForms).length > 1)
                ?
                <Form.Item style={{ marginTop: '1em' }}>
                    <Button
                        type='danger'
                        onClick={() => this.props.removeForm(this.props.guardianForms, this.props.guardianFormsValid, this.props.formUID, 'GuardianForm', this.props.images)}
                    >
                        Remove
                            </Button>
                </Form.Item>
                :
                <></>
        );

        return (
            <Form
                key={"GuardianForm"}
                layout='vertical'
                id={"GuardianForm"}
                initialValues={this.props.initialValues}

            >
                {/* <h1>ID: {formUID}</h1> */}
                <Form.Item name={this.props.formUID + "+first_name"} label={ this.props.guardianFormsValid[this.props.formUID]['first_name'] ? "First Name: " : "Invalid First Name"}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your first name',
                        },
                        {
                            max: 128, 
                            message: 'First name must have fewer than 128 characters'
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
                            max: 128,
                            message: 'Middle name must have fewer than 64 characters'
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
                            max: 128,
                            message: 'Last name must have fewer than 128 characters'
                        }
                    ]}
                >
                    <Input
                        placeholder="Last name"
                        onChange={e => this.handleChange(e)}
                    />
                </Form.Item>

                {/* TODO: Add some RegEx check for phone number inputs  */}
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
                            message: 'Phone number must have fewer than 13 characters'
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
                            message: 'The input is not valid a E-mail address',
                        }, 
                        {
                            max: 128,
                            message: 'E-mail must have fewer than 128 characters'
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
                            message: 'Religion must have fewer than 128 characters'
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
                            message: 'Please indicate the type of guardian',
                        },
                    ]}
                >
                    <Select
                        showSearch 
                        notFoundContent={<p>Not Found</p>}
                        style={{ width: 200 }}
                        placeholder="Relationship to students"
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

                {/* TODO: Maybe change this so that they just indicate/list which students live with the guardian */}
                <Form.Item name={this.props.formUID + "+lives_with_guardian"}
                    label="Students that live with this parent/guardian"
                    rules={[
                        {
                            required: true,
                            message: 'Please indicate which students live with this guardian',
                        },
                    ]}
                >
                    <Input.TextArea />

                </Form.Item>

                <Form.Item name={this.props.formUID + "+occupation"} label="Occupation:"
                    rules={[
                        {
                            required: true,
                            message: 'Please input an occupation',
                        },
                        {
                            max: 256,
                            message: 'Occupation must have fewer than 256 characters'
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
                            message: 'Place of work must have fewer than 256 characters'
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
                { imageUpload }

                { removeFormButton }
            </Form>
        );
    }
};

const mapStateToProps = state => {
    return {
        guardianForms: state.guest.guardianForms,
        guardianFormsValid: state.guest.guardianFormsValid, 
        guardianFormsTouched: state.guest.guardianFormsTouched, 
        guardianUID: state.guest.guardianUID,
        images: state.guest.images
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateForms: (guardianForms, guardianFormsValid) => dispatch(actions.updateGuardians(guardianForms, guardianFormsValid)),
        addImage: (images, id, file) => dispatch(actions.addImage(images, id, file)),
        removeImage: (images, id) => dispatch(actions.removeImage(images, id)),
        removeForm: (guardianForms, guardianFormsValid, uid, currentForm, images) => dispatch(actions.removeForm(guardianForms, guardianFormsValid, uid, currentForm, images)),
    }
}

connect(mapStateToProps, mapDispatchToProps)(Dragger);
export default connect(mapStateToProps, mapDispatchToProps)(GuardianFormComponent);
