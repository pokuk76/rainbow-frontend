import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { withRouter } from'react-router-dom';
import debounce from "lodash/debounce";

import { Form, Input, Button, Checkbox, Breadcrumb} from 'antd';
import { WalletOutlined, } from '@ant-design/icons';

import * as actions from '../../store/actions/guest';
import * as actionTypes from '../../store/actions/actionTypes';
import { guestFormCopy } from '../../utility/deepCopy';
import { declarationFormItems, checkValidityItem } from '../../utility/forms';

import DeleteIcon from '../../components/Icons';

class Declaration extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      checked: this.props.declaration['declaration_read'], 
      declaration: this.props.declaration // We're passing by reference, which actually works for us 
                                      // but might cause issues later?
    };

    this.debounceHandleChange = debounce(this.debounceHandleChange.bind(this), 1000);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  debounceHandleChange(field, value) {

    let declaration = guestFormCopy(this.props.declaration);
    let declarationValid = guestFormCopy(this.props.declarationValid);

    declaration[field] = value;
    var rules = declarationFormItems[field]['validation_rules'];
    declarationValid[field] = checkValidityItem(value, rules);
    // let testRequired = [{ required: true, message: "Username Required" }, { unique: true, message: "Must be unique" } ];
    // if(testInvalidSubmitState) {
    //   this.props.guestFormValid[field] = checkValidityItem(value, guestFormItems[field]['validation_rules']);
    // }
    this.props.updateDeclaration(declaration, declarationValid);
  }

  /**
   * Called when an input field changes
   * 
   * @param {Event} e - A change event
   */
  handleCheckboxChange = (e) => {
    /* The id is the name of the Form.Item wrapping the input
    It is also the key needed for the given form object
    */
    // console.log("Checkbox Event: ", e.target);
    this.setState({checked: e.target.checked});
    let field = e.target.id;
    let value = e.target.checked;
    this.debounceHandleChange(field, value);
  }

  /**
   * Called when an input field changes
   * 
   * @param {Event} e - A change event
   */
  handleChangeDate = (e) => {
    /* The id is the name of the Form.Item wrapping the input
    It is also the key needed for the given form object
    */
    console.log("Date Change Event: ", e.target);
  }

  /**
   * Called when an input field changes
   * @param {Event} e - A change event
   */
  handleChange = (e) => {
    /* The id is the name of the Form.Item wrapping the input
    It is also the key needed for the given form object
    */

    let field = e.target.id;
    let value = e.target.value; 
    this.debounceHandleChange(field, value);
    // console.log("Event: ", e.target.id);
    // // this.setState({
    // //   visible: true,
    // // });
    // // this.state.declaration[e.target.id] = e.target.value;
    // let newDeclaration = this.state.declaration;
    // newDeclaration[e.target.id] = e.target.value
    // this.setState({
    //   declaration: newDeclaration,
    // });
    // console.log("Declaration: ", this.state.declaration);
  }

  handleImages = (form) => {
    let formType; // GuestForm, StudentForm, GuardianForm
    for (let imageKey in this.props.images){
      formType = imageKey.split('_')[0];
      switch(formType) {
        case "GuestForm":
          console.log("Image: ", this.props.images[imageKey][0]);
          let image_blob = this.props.images[imageKey][0];
          form.append('image_file', image_blob, image_blob['name']);
          return form;
        case "StudentForm":
          break;
        case "GuardianForm":
          break;
      }
    }
    return form;
  }

  handleImage = (fType) => {
    let formType; // GuestForm, StudentForm, GuardianForm
    for (let imageKey in this.props.images){
      formType = imageKey.split('_')[0];
      // console.log("Form type: ", formType);
      switch(formType) {
        case "GuestForm":
          console.log("Image: ", this.props.images[imageKey][0]);
          return this.props.images[imageKey][0];
        case "StudentForm":
          break;
      }
    }
    return null;
  }

  /**
   * TODO: Determine if the store should just have the guest form stored  
   *       as FormData object instead of JSON (This would really optimize things)
   * Create the FormData object from the JSON containing the guest info form.
   * Called when the user submits form.
   * 
   * @return {Object} form_data - A FormData object
   */
  createGuestForm = () => {
    let form_data = new FormData();
    const keys = ['username', 'first_name', 'middle_name', 'last_name']
    for (let key of keys) {
      console.log("key: ", key);
      form_data.append(key, this.props.guestForm[key]);
    }
    // let form_data = new FormData(this.props.guestForm);
    form_data = this.handleImages(form_data);
    for (let entry of form_data.entries()) {
      console.log("form data entry: ", entry);
    }
    return form_data;
  }

  getInitialValues = () => {
    console.log("Getting initial values...");
    // let initialValues = {}; // Each form has its own initial values and we'll map then using the form's id
    const declaration = this.props.declaration;
    console.log("Initial Values declaration form:", declaration);

    let initialForm = {};

    try {
      for (const [name, value] of Object.entries(declaration)) {
        initialForm[name] = value;
      }
    }
    finally {
      return initialForm;
    }
  }

  getValidationProps = (key) => {
    return ( this.props.submitStatus === actionTypes.SUBMIT_INVALID_FAIL ) ? this.props.declarationValid[key] : null;
  }

  render() {

    // const initialValues = this.getInitialValues();

    const myStyle = {width: "50%", marginLeft:"auto", marginRight: "auto"};

    return (
      <div >
        <Breadcrumb style={{ margin: '3.5em 0 2em 0' }}>
          <Breadcrumb.Item>Portals</Breadcrumb.Item>
          <Breadcrumb.Item>Registration</Breadcrumb.Item>
          <Breadcrumb.Item>Declaration & Signature</Breadcrumb.Item>
        </Breadcrumb>
        <h1><WalletOutlined /> Declaration</h1>
        
        <div style={{backgroundColor: "white", color:"#111d2c", width:"80%", margin:"auto", padding:"1em", border:"2px solid #111d2c"}}>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque 
          ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia 
          voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi 
          tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem 
          ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea 
          voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
        </div>

        <Form 
          key={"DeclarationForm"} 
          layout='vertical'
          initialValues={{...this.props.declaration}} 
        >
            <Form.Item name="declaration_read"
                style={myStyle} 
                {  ...this.getValidationProps('declaration_read')  }
            >
              <Checkbox 
                // checked={this.props.declaration['declaration_read']} 
                checked={ this.state.checked } 
                onChange={(e) => this.handleCheckboxChange(e)}>
                  <b>I have read and understood to this declaration.</b>
              </Checkbox>
              {/* <input type="checkbox" /> */}
            </Form.Item>

            <Form.Item name="signature" label="Electronic Signature:"
                style={myStyle} 
                rules={[
                  {
                      required: true,
                      message: 'Signature required',
                  },
                  {
                      max: 256,
                      message: 'Signature must be less than 256 characters'
                  }
                ]} 
                {  ...this.getValidationProps('signature')  }
            >
                <Input 
                    placeholder="Enter your full name as an electronic signature" 
                    onChange={(e) => this.handleChange(e)} 
                />
            </Form.Item>

            <Form.Item name="date" label="Today's Date:"
                style={myStyle} 
                rules={[
                  {
                      required: true,
                      message: "Please enter today's date", 
                  }
                ]} 
                {  ...this.getValidationProps('date')  }
            >
                <Input  
                    type='date' 
                    onChange={(e) => this.handleChange(e)} 
                />
            </Form.Item>
        </Form>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    declaration: state.guest.declarationForm,
    declarationValid: state.guest.declarationFormValid, 

    submitStatus: state.form.submitStatus, 
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateDeclaration: (declaration, declarationValid) => dispatch(actions.updateDeclaration(declaration, declarationValid)),
  }
}

export { Declaration as UnconnectedDeclaration};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Declaration));
