import React from 'react';
import { Form, Input, Button } from 'antd';

import axios from 'axios';

class CustomForm extends React.Component {

  handleFormSubmit = (values, requestType, guestID) => {
    /* Need to understand how onFinish works (how do I override default behaviour then?)*/
    // event.preventDefault();
    // const username = event.target.elements.username.value;
    // const first_name = event.target.elements.first_name.value;
    // const middle_name = event.target.elements.middle_name.value;
    // const last_name = event.target.elements.last_name.value;

    const username = values['username'];
    const first_name = values['first_name'];
    const middle_name = values['middle_name'];
    const last_name = values['last_name'];

    switch(requestType) {
      case 'POST':
        return axios.post('api/guests/', {
          username: username,
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name
        })
        .then(response => console.log(response))
        .catch(error => console.error(error));
      case 'PUT':
        return axios.put(`api/guests/${guestID}/`, {
          username: username,
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name
        })
        .then(response => console.log(response))
        .catch(error => console.error(error));
      case 'PATCH':
        console.log("PATCH request");
        break;
      default:
        console.log("Default case reached with request type: " + requestType);
        break;
    }
    console.log(Object.values(values));
    console.log(`
    Username: ${username}
    First name: ${first_name}
    Last name: ${last_name}`);
  };

  render() {
    return (
      <div>
        <Form onFinish={(values) => this.handleFormSubmit(
            values,
            this.props.requestType,
            this.props.guestID
            )} layout='vertical'>
          <Form.Item name="username" label="Username:">
            <Input placeholder="New username" />
          </Form.Item>
          <Form.Item name="first_name" label="First Name:">
            <Input placeholder="New first name" />
          </Form.Item>
          <Form.Item name="middle_name" label="Middle Name:">
            <Input placeholder="New middle name" />
          </Form.Item>
          <Form.Item name="last_name" label="Last Name:">
            <Input placeholder="New last name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">{this.props.btnText}</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
};

export default CustomForm;