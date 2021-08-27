import React from 'react';
import { Form, Input, Select, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { InboxOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Dragger } = Upload;

export const guestFormItems = {
    username: {
        validation_rules: [ 
            { required: true, message: "Username Required" }, 
            { unique: true, message: "Username already exists"}, 
            { type: "username", message: "Username can only contain alphanumeric characters, punctuation, and special characters" }, 
            { max: 128, message: "First name must have fewer than 128 characters" }, 
        ], 
    }, 
    first_name: {
        validation_rules: [ 
            { required: true, message: "First Name Required" }, 
            { max: 128, message: "First name must have fewer than 128 characters" }, 
        ], 
    }, 
    middle_name: {
        validation_rules: [ 
            { max: 128, message: "Middle name must have fewer than 128 characters" }, 
        ], 
    }, 
    last_name: {
        validation_rules: [ 
            { required: true, message: "Last Name Required" }, 
            { max: 128, message: "Last name must have fewer than 128 characters" }, 
        ], 
    }, 
}

export const studentFormItems = {
    first_name: {
        validation_rules: [ 
            { required: true, message: "Please input first name" }, 
            { max: 128, message: "First name must have fewer than 128 characters" }, 
        ], 
    }, 
    middle_name: {
        validation_rules: [ 
            { max: 128, message: "Middle name must have fewer than 128 characters" }, 
        ], 
    }, 
    last_name: {
        validation_rules: [ 
            { required: true, message: "Please input last name" }, 
            { max: 128, message: "Last name must have fewer than 128 characters" }, 
        ], 
    }, 
    sex: {
        validation_rules: [ 
            { required: true, message: "Please specify child's sex" }, 
        ], 
    }, 
    date_of_birth: {
        validation_rules: [ 
            { required: true, message: "Please provide a date of birth" }, 
        ], 
    }, 
    image_file: {
        validation_rules: [ 
            // { required: true, message: "Please provide a passport-style photo" }, 
        ], 
    }, 
    nationality: {
        validation_rules: [ 
            { required: true, message: "Please specify child's nationality" }, 
            { max: 128, message: "Nationality must be less than 128 characters" }, 
        ], 
    }, 
    religion: {
        validation_rules: [ 
            { max: 128, message: "Religion must have fewer than 128 characters" }, 
        ], 
    }, 
    has_ailments: { validation_rules: [ ], }, 
    former_school: { validation_rules: [ ], }, 
    former_school_address: { validation_rules: [ ], }, 
    class_reached: { validation_rules: [ ], }, 
    reason_for_leaving: { validation_rules: [ ], }, 
}

export const studentFormValidInitialState = {
    first_name: { validateStatus: "error", help: "First Name required" }, 
    middle_name: null, 
    last_name: { validateStatus: "error", help: "Last Name required" }, 
    sex: { validateStatus: "error", help: "Please specify child's sex" }, 
    date_of_birth: { validateStatus: "error", help: "Please provide a date of birth" }, 
    nationality: { validateStatus: "error", help: "Please specify child's nationality" }, 
    religion: null, 
    has_ailments: null, 
    former_school: null, 
    former_school_address: null, 
    class_reached: null, 
    reason_for_leaving: null, 
}

const countryCodeSelector = (
    <Form.Item name="country_code" noStyle>
        <Select style={{width: 80}}>
            <Option value="Ghana">+233</Option>
        </Select>
    </Form.Item>
);

export const guardianFormItems = {
    first_name: {
        label: "First Name:",
        validation_rules: [ 
            { required: true, message: "Please enter first name" }, 
            { max: 128, message: "First name must have fewer than 128 characters" }, 
        ],
        componentType: "input",
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="First name"
                onChange={(e) => kwargs.onChangeFunction(e)}
            />;
        },
    }, 
    middle_name: {
        label: "Middle Name:",
        validation_rules: [ 
            { max: 128, message: "Middle name must have fewer than 128 characters" }, 
        ],
        componentType: "input",
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="Middle name"
                onChange={(e) => kwargs.onChangeFunction(e)}
            />;
        },
    }, 
    last_name: {
        label: "Last Name:",
        validation_rules: [ 
            { required: true, message: "Please enter last name" }, 
            { max: 128, message: "Last name must have fewer than 128 characters" }, 
        ],
        componentType: "input",
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="Last name"
                onChange={(e) => kwargs.onChangeFunction(e)}
            />;
        },
    }, 
    phone_number: {
        label: "Telephone Number:",
        validation_rules: [
            { required: true, message: "Please enter a phone number" },
            { max: 10, message: "Please enter phone number as 10 characters (e.g., 0241234567)" }
        ],
        componentType: "input",
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="0241234567"
                type="tel"
                addonBefore={countryCodeSelector}
                onChange={(e) => kwargs.onChangeFunction(e)}
            />;
        },
    }, 
    email_address: {
        label: "Email Address:",
        validation_rules: [
            { type: "email", message: "Please enter a valid a E-mail address" },
            { max: 128, message: "E-mail must have fewer than 128 characters" },
        ],
        componentType: "input",
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="Enter your email"
                type="email"
                onChange={(e) => kwargs.onChangeFunction(e)}
            />;
        },
    },
    image_file: {
        label: "Passport-Style Picture:",
        validation_rules: [],
        componentType: "image_upload",
        getComponentJSX: (kwargs) => {
            console.log("File Selected: ", kwargs.fileSelected);
            return (kwargs.fileSelected)
                ?
                <Upload {...kwargs.uploadProps} />
                :
                <ImgCrop>
                    <Dragger {...kwargs.uploadProps} disabled={kwargs.fileSelected} >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Please provide a photo
                            suitable for official identification</p>
                        <p className="ant-upload-hint">
                            Click or drag image to this area to upload
                        </p>
                    </Dragger>
                </ImgCrop>;
        },
    },
    nationality: {
        label: "Nationality:",
        validation_rules: [
            { required: true, message: "Please specify a nationality" },
            { max: 128, message: "Nationality must be less than 128 characters" },
        ],
        componentType: "input",
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="Enter your nationality"
                onChange={(e) => kwargs.onChangeFunction(e)}
            />;
        },
    }, 
    religion: {
        label: "Religion:",
        validation_rules: [
            { max: 128, message: "Religion must have fewer than 128 characters" },
        ],
        componentType: "input",
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="Enter your religion"
                onChange={(e) => kwargs.onChangeFunction(e)} />;
        },
    }, 
    guardian_type: {
        label: "Guardian Type:",
        validation_rules: [ 
            { required: true, message: "Please indicate the type of guardian" }, 
        ],
        componentType: "select",
        getComponentJSX: (kwargs) => {
            return <Select
                showSearch
                notFoundContent={<p>Not Found</p>}
                style={{ width: 200 }}
                placeholder="Relationship to students"
                optionFilterProp="children"
                onChange={(value) => kwargs.onChangeFunction("guardian_type", value)}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                <Option value="father">Father</Option>
                <Option value="mother">Mother</Option>
                <Option value="legal_guardian">Legal Guardian</Option>
            </Select>;
        },
    }, 
    lives_with_guardian: {
        label: 'Students that live with this parent:',
        validation_rules: [
            { required: true, message: "Please indicate which students live with this guardian" },
        ],
        componentType: "input",
        getComponentJSX: (kwargs) => {
            return <Input.TextArea
                placeholder="Modupe Poku, Abena Poku"
                onChange={(e) => kwargs.onChangeFunction(e)} />;
        },
    },
    occupation: {
        label: "Occupation:",
        validation_rules: [
            { required: true, message: "Please enter an occupation" },
            { max: 256, message: "Occupation must have fewer than 256 characters" },
        ],
        componentType: "input",
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="Enter occupation"
                onChange={(e) => kwargs.onChangeFunction(e)} />;
        },
    },
    place_of_work: {
        label: "Place of Work:",
        validation_rules: [ 
            { required: true, message: "Please enter a place of work" }, 
            { max: 256, message: "Place of work must have fewer than 256 characters" }, 
        ],
        componentType: "input",
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="Enter place of work"
                onChange={(e) => kwargs.onChangeFunction(e)} />;
        },
    },
    home_address: {
        label: "Home Address:",
        validation_rules: [],
        componentType: "input",
        getComponentJSX: (kwargs) => {
            return <Input.TextArea
                style={{ height: 80 }}
                placeholder={`45 Pawpaw Street\nCommunity 1995\nTema, Ghana`}
                onChange={(e) => kwargs.onChangeFunction(e)} />;
        },
    },
    postal_address: {
        label: "Postal Address:",
        validation_rules: [],
        componentType: "input",
        getComponentJSX: (kwargs) => {
            return <Input.TextArea
                placeholder={`P.O. Box NT 28\nAccra New Town, Ghana`}
                onChange={(e) => kwargs.onChangeFunction(e)} />;
        },
    }, 
}

export const guardianFormValidInitialState = {
    first_name: { validateStatus: "error", help: "First Name required" },
    middle_name: null, 
    last_name: { validateStatus: "error", help: "Last Name required" }, 
    phone_number: { validateStatus: "error", help: "Please input a phone number" },
    email_address: null,
    nationality: { validateStatus: "error", help: "Please specify a nationality" }, 
    religion: null, 
    guardian_type: { validateStatus: "error", help: "Please specify this guardian's relationship with the students" },
    lives_with_guardian: { validateStatus: "error", help: "Please indicate which children live with this parent" },
    occupation: null, 
    place_of_work: null, 
    home_address: null, 
    postal_address: null, 
}

export const declarationFormItems = {
    declaration_read: {
        validation_rules: [ 
            { required: true, message: "Please indicate that you have read & understood this declaration" }, 
        ], 
    }, 
    signature: {
        validation_rules: [ 
            { required: true, message: "Electronic signature required" }, 
            { max: 256, message: "Signature must have fewer than 256 characters" }, 
        ], 
    }, 
    date: {
        validation_rules: [ 
            { required: true, message: "Please enter today's date" },  
        ], 
    }, 
}

export const getInitialValues = (formsObj) => {
    // const guardianForms = this.props.guardianForms;
    let initialValues = {}; // Each form has its own initial values and we'll map then using the form's id

    for (let formUID in formsObj){
        let formItems = formsObj[formUID];
        let initialForm = {};
        try{
            for (const [name, value] of Object.entries(formItems)) {
                let key = formUID + "+" + name;
                // initialForm[name] = value;
                initialForm[key] = value;
            }
            initialValues[formUID] = initialForm;
        }
        catch(error) {
            //initialValues[formUID] = initialForm;
            console.log("Error getting initial values: ", error);
        }
    }

    // console.log("Initial values: ", initialValues);
    return initialValues;
    // this.setState({initialFormValues: initialValues});
}

// { validateStatus: "error", 
// help: <div>Should be combination of numbers & alphabets<br/> Some other nonsense<br/></div>}
export const checkValidityItem = (value, rules, touched=false, kwargs={'usernames': ["username"]}) => {
    let valid = true;
    let help_messages = [];
    for(let rule of rules) {
        // Each rule is an object of the form { rule_name:[Boolean | data], message: String  }
        let [rule_name_key, message_key] = Object.keys(rule).slice(0, 2);  // Slice up to index 2 (3rd element) non-inclusive
        // console.log("Message key: ", message_key);
        switch (rule_name_key) {
            case "required":
                // Added null check for images (don't think it's even used rn) and false check for checkbox
                if (value === "" || value ===  null || value === false) {
                    valid = false;
                    help_messages.push(<div>{rule[message_key]}</div>);
                }
                break;
            case "unique":
                if (kwargs['usernames'].includes(value)) {
                    valid = false;
                    help_messages.push(<div>Some other nonsense</div>)
                }
                break;
            default:
                /*  If we somehow encounter a rule that we're not checking, we 
                    should just set valid to true right?
                    Ok decided that seemed like a bad idea so lets leave it unchanged?
                */
                valid = valid && true;
        }
    }
    let response = !valid ? { validateStatus: "error", help: help_messages } : null;
    return response;
}

export const checkValidityForm = (formValidObj) => {
    let valid = true;
    for (let element in formValidObj) {
        valid = valid && ( formValidObj[element] === null );
    }
    return valid;
}

export const checkValiditySection = (formValidObj) => {
    let valid = true;
    for (let formUID in formValidObj) {
        valid = valid && checkValidityForm(formValidObj[formUID]);
    }
    return valid;
}