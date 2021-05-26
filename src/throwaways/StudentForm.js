import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Select } from 'antd';

import * as actions from '../store/actions/guest-registration';

const { Option } = Select;

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

class StudentForm extends React.Component {

  render() {
    // const index = this.props.listIndex;
    console.log("Form " + this.props.listIndex);
    return (
      <div>
        <Form.Item name="first_name" label="First Name:">
          <Input 
            placeholder="Enter first name" 
          />
        </Form.Item>
        <Form.Item name="middle_name" label="Middle Name:">
          <Input 
            placeholder="Enter middle name" 
          />
        </Form.Item>
        <Form.Item name="last_name" label="Last Name:">
          <Input 
            placeholder="Enter last name" 
          />
        </Form.Item>
        <Form.Item name="nationality" label="Nationality:">
          <Input 
            placeholder="Enter nationality" 
          />
        </Form.Item>
        <Form.Item name="religion" label="Religion:">
          <Input 
            placeholder="Enter religion" 
          />
        </Form.Item>
        <Form.Item name="sex" label="Sex: ">
            {/* This is going to be a selection */}
          <Input 
            placeholder="Enter ..." 
          />
        </Form.Item>
        <Form.Item name="date_of_birth" label="Date of Birth">
            {/* This is going to be a checkbox */}
          <Input 
            placeholder="Date Field" 
          />
        </Form.Item>
        <Form.Item name="has_ailments" label="Does your child have ailments">
          <Input 
            placeholder="" 
          />
        </Form.Item>
        <Form.Item name="former_school" label="Former School">
          <Input 
            placeholder="Enter most recently attended school " 
          />
        </Form.Item>
        <Form.Item name="former_school_address" label="School Address:">
          <Input 
            placeholder="Enter address" 
          />
        </Form.Item>
        <Form.Item name="class_reached" label="Select Class reached:">
          <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select the most applicable"
              optionFilterProp="children"
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="father">Father</Option>
              <Option value="mother">Mother</Option>
              <Option value="legal_guardian">Legal Guardian</Option>
            </Select>
        </Form.Item>
        <Form.Item name="reason_for_leaving" label="Reason For Leaving:">
          <Input 
            placeholder="Enter reason for leaving" 
          />
        </Form.Item>
        {
          (this.props.listIndex !== 0)
          ?
          <Form.Item>
            <Button 
              type='danger' 
              onClick={() => this.props.remove(this.props.studentForms, this.props.listIndex, 'StudentForm')} 
            >
              Remove
            </Button>
          </Form.Item>
          :
          <>
          </>
        }
      </div>
    );
  }
};

const mapStateToProps = state => {
  console.log("Forms state-to-props: ", state);
  return {
    selectedMenuItem: state.guest.selectedMenuItem,
    studentForms: state.guest.studentForms,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    remove: (studentForms, index, currentForm) => dispatch(actions.removeForm(studentForms, index, currentForm)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentForm);
