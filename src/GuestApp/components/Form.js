import React from 'react';
import debounce from "lodash/debounce";
// import throttle from "lodash/throttle";

import { Form, Button } from 'antd';
import { CloseSquareOutlined } from '@ant-design/icons';

import { formsCopy } from '../../utility/deepCopy';
import { fieldComponentTypes, checkValidityItem } from '../../utility/forms';

import * as actionTypes from '../../store/actions/actionTypes';

const removeIcon = <CloseSquareOutlined
                style={{
                    color: 'red',
                    fontSize: '1em',
                    // paddingRight: '1em',
                }}
            />;

/**
 * Class-based Component for an individual form 
 *
 * @version 0.1
 * @author [Kofi Poku](https://github.com/pokuk76)
 */
class FormComponent extends React.Component {

    constructor(props) {
        super(props);

        this.debounceHandleChange = debounce(this.debounceHandleChange.bind(this), 500);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
    }

    debounceHandleChange(form, field, value) {

        let forms = formsCopy(this.props.forms);
        let formsValid = formsCopy(this.props.formsValid);
        forms[form][field] = value;
        var rules = this.props.formFields[field]['validation_rules'];
        formsValid[form][field] = checkValidityItem(value, rules);
        this.props.update(forms, formsValid);
    }

    handleChange(e) {
        let form = this.props.formUID;
        let field = e.target.id.split("+")[1];
        let value = e.target.value;
        this.debounceHandleChange(form, field, value);
    }

    handleChangeSelect(field, value) {
        let form = this.props.formUID;
        this.debounceHandleChange(form, field, value);
    }

    getValidationProps = (form, key) => {
        return (this.props.submitStatus === actionTypes.SUBMIT_INVALID_FAIL)
            ? this.props.formsValid[form][key]
            : null;
    }

    getFieldComponent = (field, fileSelected, uploadProps) => {
        let kwargs;
        switch (this.props.formFields[field].componentType) {
            case fieldComponentTypes['input']:
                kwargs = {onChangeFunction: this.handleChange};
                break;
            case fieldComponentTypes['select']:
                kwargs = {onChangeFunction: this.handleChangeSelect};
                break;
            case fieldComponentTypes['date']:
                kwargs = {onChangeFunction: this.handleChangeSelect};
                break;
            case fieldComponentTypes['image_upload']:
                kwargs = {fileSelected: fileSelected, uploadProps: uploadProps};
                break;
            default:
                kwargs = {onChangeFunction: this.handleChange, fileSelected: fileSelected, uploadProps: uploadProps}
                break;
        }
        return this.props.formFields[field].getComponentJSX(kwargs);
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


        const removeFormButton = (
            (Object.keys(this.props.forms).length > 1)
                ? 
                <Form.Item style={{ marginTop: '1em' }}>
                    <Button
                        type='danger'
                        onClick={() => this.props.removeForm(
                            this.props.forms,
                            this.props.formsValid,
                            this.props.formUID,
                            this.props.formType,
                            this.props.images
                        )}
                    >
                        Remove
                    </Button>
                </Form.Item>
                :
                <></>
        );

        let fields = Object.keys(this.props.formFields);
        return (
            <Form
                key={this.props.formUID}
                layout='vertical'
                id={this.props.formUID}
                initialValues={this.props.initialValues}
            >
                {fields.map(field => {
                    return <Form.Item
                        key={`${this.props.formUID}+${field}`}
                        name={`${this.props.formUID}+${field}`}
                        label={this.props.formFields[field].label}
                        rules={this.props.formFields[field].validation_rules}
                        {...this.getValidationProps(this.props.formUID, field)}
                    >
                        {this.getFieldComponent(field, fileSelected, uploadProps)}
                    </Form.Item>;
                })}
                {removeFormButton}
            </Form>
        );
    }
};

export default FormComponent;
