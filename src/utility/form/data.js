import React from 'react';
import { Form, Input, Select, Upload, DatePicker } from 'antd';
import ImgCrop from 'antd-img-crop';
import { InboxOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Dragger } = Upload;

export const fieldComponentTypes = {
    input: Input,
    select: Select,
    date: DatePicker,
    image_upload: Upload
}

const sharedFields = {
    first_name: {
        label: "First Name:",
        validation_rules: [ 
            { required: true, message: "Please enter first name" }, 
            { max: 128, message: "First name must have fewer than 128 characters" }, 
        ],
        componentType: fieldComponentTypes['input'],
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
        componentType: fieldComponentTypes['input'],
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
        componentType: fieldComponentTypes['input'],
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="Last name"
                onChange={(e) => kwargs.onChangeFunction(e)}
            />;
        },
    },
}

export const guestFormItems = {
    username: {
        validation_rules: [ 
            { required: true, message: "Username Required" }, 
            // Don't think "unique" is a rule, hence why we need the custom validator
            // { unique: true, message: "Username already exists"}, 

            // Also do not think there is a "username" type -> switch to pattern <https://github.com/yiminghe/async-validator#pattern>
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

const classReachedOptions = [
    { label: "Test", value: "test" },
    { label: "Class 1", value: "class 1" },
    { label: "Class 2", value: "class 2" },
    { label: "Class 3", value: "class 3" },
    { label: "Class 4", value: "class 4" },
    { label: "Class 5", value: "class 5" },
    { label: "Class 6", value: "class 6" },
    { label: "Form 1", value: "form 1" },
];

export const studentFormItems = {
    first_name: {
        label: "First Name:",
        validation_rules: [ 
            { required: true, message: "Please enter first name" }, 
            { max: 128, message: "First name must have fewer than 128 characters" }, 
        ],
        componentType: fieldComponentTypes['input'],
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
        componentType: fieldComponentTypes['input'],
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
        componentType: fieldComponentTypes['input'],
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="Last name"
                onChange={(e) => kwargs.onChangeFunction(e)}
            />;
        },
    }, 
    sex: {
        label: "Sex:",
        validation_rules: [
            { required: true, message: "Please specify child's sex" },
        ],
        componentType: fieldComponentTypes['select'],
        getComponentJSX: (kwargs) => {
            return <Select
                style={{ width: 200 }}
                placeholder="Student's Gender"
                optionFilterProp="sex"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value) => kwargs.onChangeFunction("sex", value)}
            >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
            </Select>;
        },
    }, 
    date_of_birth: {
        label: "Date of Birth:",
        validation_rules: [
            { required: true, message: "Please provide a date of birth" },
        ],
        componentType: fieldComponentTypes['date'],
        getComponentJSX: (kwargs) => {
            return <DatePicker
                onChange={(dateMoment, dateString) =>
                    kwargs.onChangeFunction(dateMoment, dateString, "date_of_birth")
                }
            />;
        }
    }, 
    image_file: {
        label: "Passport-Style Photo:",
        validation_rules: [ 
            // { required: true, message: "Please provide a passport-style photo" }, 
        ],
        componentType: fieldComponentTypes['image_upload'],
        getComponentJSX: (kwargs) => {
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
        componentType: fieldComponentTypes['input'],
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="E.g., Ghanaian"
                onChange={(e) => kwargs.onChangeFunction(e)}
            />;
        },
    }, 
    religion: {
        label: "Religion:",
        validation_rules: [
            { max: 128, message: "Religion must have fewer than 128 characters" },
        ],
        componentType: fieldComponentTypes['input'],
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="Enter your religion"
                onChange={(e) => kwargs.onChangeFunction(e)} />;
        },
    }, 
    has_ailments: {
        label: "Please detail any allergies or ailments:",
        validation_rules: [],
        componentType: fieldComponentTypes['input'],
        getComponentJSX: (kwargs) => {
            return <Input.TextArea
                placeholder={"Peanuts: severe allergy; pollen: mild allergies"}
                onChange={(e) => kwargs.onChangeFunction(e)} />;
        },
    }, 
    former_school: {
        label: "Former School:",
        validation_rules: [],
        componentType: fieldComponentTypes['input'],
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="Previous school attended, if applicable"
                onChange={(e) => kwargs.onChangeFunction(e)} />;
        },
    }, 
    former_school_address: {
        label: "Former School Address:",
        validation_rules: [],
        componentType: fieldComponentTypes['input'],
        getComponentJSX: (kwargs) => {
            return <Input.TextArea
                placeholder="Address of previous school attended"
                onChange={(e) => kwargs.onChangeFunction(e)} />;
        },
    }, 
    class_reached: {
        label: "Former School:",
        validation_rules: [],
        componentType: fieldComponentTypes['select'],
        getComponentJSX: (kwargs) => {
            return <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select the most applicable"
                optionFilterProp="label"
                // onSearch={onSearch}
                filterOption={(input, option) =>
                    // option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    // console.log(option)
                    option['value'].indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value) => this.handleChangeSelect( "class_reached", value)}
                options={classReachedOptions}
            >
            </Select>;
        },
    }, 
    reason_for_leaving: {
        label: "Reason for Leaving:",
        validation_rules: [],
        componentType: fieldComponentTypes['input'],
        getComponentJSX: (kwargs) => {
            return <Input
                onChange={(e) => kwargs.onChangeFunction(e)} />;
        },
    }, 
}

/** 
 * TODO: add description
 * @constant
 **/
export const studentFormValidInitialState = {
    first_name: { validateStatus: "error", help: "First Name required" },
    middle_name: {},
    last_name: { validateStatus: "error", help: "Last Name required" },
    sex: { validateStatus: "error", help: "Please specify child's sex" },
    date_of_birth: { validateStatus: "error", help: "Please provide a date of birth" },
    nationality: { validateStatus: "error", help: "Please specify child's nationality" },
    religion: {},
    has_ailments: {},
    former_school: {},
    former_school_address: {},
    class_reached: {},
    reason_for_leaving: {},
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
        componentType: fieldComponentTypes['input'],
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
        componentType: fieldComponentTypes['input'],
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
        componentType: fieldComponentTypes['input'],
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
        componentType: fieldComponentTypes['input'],
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="0241234567"
                type="tel"
                addonBefore={countryCodeSelector}
                onChange={(e) => kwargs.onChangeFunction(e)}
                className={kwargs['className']}
            />;
        },
    }, 
    email_address: {
        label: "Email Address:",
        validation_rules: [
            { type: "email", message: "Please enter a valid a E-mail address" },
            { max: 128, message: "E-mail must have fewer than 128 characters" },
        ],
        componentType: fieldComponentTypes['input'],
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="Enter your email"
                type="email"
                onChange={(e) => kwargs.onChangeFunction(e)}
            />;
        },
    },
    image_file: {
        label: "Passport-Style Photo:",
        validation_rules: [],
        componentType: fieldComponentTypes['image_upload'],
        getComponentJSX: (kwargs) => {
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
        componentType: fieldComponentTypes['input'],
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
        componentType: fieldComponentTypes['input'],
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
        componentType: fieldComponentTypes['select'],
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
        componentType: fieldComponentTypes['input'],
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
        componentType: fieldComponentTypes['input'],
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
        componentType: fieldComponentTypes['input'],
        getComponentJSX: (kwargs) => {
            return <Input
                placeholder="Enter place of work"
                onChange={(e) => kwargs.onChangeFunction(e)} />;
        },
    },
    home_address: {
        label: "Home Address:",
        validation_rules: [],
        componentType: fieldComponentTypes['input'],
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
        componentType: fieldComponentTypes['input'],
        getComponentJSX: (kwargs) => {
            return <Input.TextArea
                placeholder={`P.O. Box NT 28\nAccra New Town, Ghana`}
                onChange={(e) => kwargs.onChangeFunction(e)} />;
        },
    }, 
}

// Things that are required are initially invalid
// TODO: Stop hard-coding this logic
export const guardianFormValidInitialState = {
    first_name: { validateStatus: "error", help: "First name required" },
    middle_name: {}, 
    last_name: { validateStatus: "error", help: "Last name required" }, 
    phone_number: { validateStatus: "error", help: "Phone number required" },
    email_address: {},
    nationality: { validateStatus: "error", help: "Nationality required" }, 
    religion: {}, 
    guardian_type: { validateStatus: "error", help: "Specify this guardian's relationship with the students" },
    lives_with_guardian: { validateStatus: "error", help: "Indicate which children live with this parent" },
    occupation: {}, 
    place_of_work: {}, 
    home_address: {}, 
    postal_address: {}, 
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