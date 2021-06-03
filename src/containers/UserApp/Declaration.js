import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Upload, Checkbox, Breadcrumb} from 'antd';
import {
  WalletOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { withRouter } from'react-router-dom';

import * as actions from '../../store/actions/guest';
import DeleteIcon from '../../components/Icons';

const { Dragger } = Upload;

class Declaration extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fileList: [],
      uploading: false,
      fileSelected: this.props.fileSelected, 
      declaration: this.props.declaration // We're passing by reference, which actually works for us 
                                      // but might cause issues later?
    };

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);

  }

  /**
   * Called when an input field changes
   * 
   * @param {Event} e - A change event?
   */
  handleCheckboxChange = (e) => {
    /* The id is the name of the Form.Item wrapping the input
    It is also the key needed for the given form object
    */
    console.log("Checkbox Event: ", e);
  }

  /**
   * Called when an input field changes
   * @param {Event} e - A change event
   */
  handleChange = (e) => {
    /* The id is the name of the Form.Item wrapping the input
    It is also the key needed for the given form object
    */
    console.log("Event: ", e.target.id);
    // this.setState({
    //   visible: true,
    // });
    // this.state.declaration[e.target.id] = e.target.value;
    let newDeclaration = this.state.declaration;
    newDeclaration[e.target.id] = e.target.value
    this.setState({
      declaration: newDeclaration,
    });
    console.log("Declaration: ", this.state.declaration);
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

  handleFormSubmit = () => {
    // event.preventDefault();

    // let guestForm = this.props.guestForm;
    const guestForm = this.createGuestForm();
    // console.log("Guest form as form data: ", guestForm.entries());
    // this.handleImages(guestForm);
    console.log("Guest form: ", guestForm)
    const studentForms = this.props.studentForms;
    const guardianForms = this.props.guardianForms;
    const declaration = this.props.declaration;
    const guest_user = 'guest_user';

    /* POST Guest Form */
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/guests/',
      data: guestForm,
      headers: {'Accept': 'application/json', 'Content-Type': 'multipart/form-data' }
      })
    .then(response => {
      console.log("POST response:", response);
      const guest_id = response.data['id'];

      /* POST Image */ 
      // let imageForm = {};
      // // imageForm['guest'] = guest_id;
      // imageForm['image_file'] = this.handleImage('Guest');
      // console.log('Image form: ', imageForm);

      // axios({
      //   method: 'put',
      //   url: 'http://127.0.0.1:8000/api/guests/',
      //   data: imageForm,
      //   headers: {'Accept': 'application/json', 'Content-Type': 'application/json' }
      //   })
      // .then(response => {
      //   console.log("Guest image POST response:", response);
      // })
      // .catch(error => {
      //   console.log("Guest image POST error:", error);
      // });

      // /* POST Students Forms */ 
      // for (let formUID in studentForms){
      //   let studentForm = studentForms[formUID];

      //   studentForm[guest_user] = guest_id;
      //   axios({
      //     method: 'post',
      //     url: 'http://127.0.0.1:8000/api/students/',
      //     data: studentForm,
      //     headers: {'Accept': 'application/json', 'Content-Type': 'application/json' }
      //     })
      //   .then(response => {
      //     console.log("POST response:", response);
      //   })
      //   .catch(error => {
      //     console.log("Student POST error:", error);
      //   });
      // }
      // /* POST Guardians Forms */
      // for (let formUID in guardianForms){
      //   let guardianForm = guardianForms[formUID]

      //   guardianForm[guest_user] = guest_id;
      //   axios({
      //     method: 'post',
      //     url: 'http://127.0.0.1:8000/api/guardians/',
      //     data: guardianForm,
      //     headers: {'Accept': 'application/json', 'Content-Type': 'application/json' }
      //     })
      //   .then(response => {
      //     console.log("POST response:", response);
      //   })
      //   .catch(error => {
      //     console.log("Guardian POST error:", error);
      //   });
      // }
      // /* POST Declaration Form */
      // declaration[guest_user] = guest_id;
      // axios({
      //   method: 'post',
      //   url: 'http://127.0.0.1:8000/api/declarations/',
      //   data: declaration,
      //   headers: {'Accept': 'application/json', 'Content-Type': 'application/json' }
      //   })
      // .then(response => {
      //   console.log("POST response:", response);
      //   this.props.history.push('/test/success');
      // })
      // .catch(error => {
      //   console.log("Declaration POST error:", error);
      // });
    })
    .catch(error => {
      console.log("Guest POST error:", error);
    });
  }

  getInitialValues = () => {
    console.log("Getting initial values...");
    // let initialValues = {}; // Each form has its own initial values and we'll map then using the form's id
    const declaration = this.props.declaration;
    console.log("Initial Values declaration form:", declaration);

    let initialForm = {};

    try {
      for (const [name, value] of Object.entries(declaration)) {
        console.log(`${name}: ${value}`);
        initialForm[name] = value;
      }
    }
    finally {
      return initialForm;
    }
  }

  render() {

    const initialValues = this.getInitialValues();


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
          initialValues={initialValues} 
        >
            <Form.Item name="agreed"
                style={myStyle} 
            >
              <Checkbox onChange={(e) => this.handleCheckboxChange(e)}><b>I have read and agreed to this declaration.</b></Checkbox>
            </Form.Item>

            <Form.Item name="signature" label="Signature:"
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
            >
                <Input 
                    placeholder="Enter your full legal name" 
                    onChange={(e) => this.handleChange(e)} 
                />
            </Form.Item>

            <Form.Item name="date" label="Today's Date:"
                style={myStyle} 
                rules={[
                  {
                      required: true,
                      message: 'Signature required',
                  }
                ]} 
            >
                <Input  
                    type='date' 
                    onChange={(e) => this.handleChange(e)} 
                />
            </Form.Item>

            {/* <Form.Item>
                <Button type="primary" htmlType="submit" onClick={this.handleFormSubmit}>Finish</Button>
            </Form.Item> */}
        </Form>
      </div>
    );
  }
};

const mapStateToProps = state => {
  console.log("Forms state-to-props: ", state);
  return {
    selectedMenuItem: state.guest.selectedMenuItem,
    guestForm: state.guest.guestForm,
    studentForms: state.guest.studentForms,
    guardianForms: state.guest.guardianForms,
    declaration: state.guest.declarationForm,
    images: state.guest.images
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateForm: (declaration) => dispatch(actions.updateDeclaration(declaration)),
  }
}

connect(mapStateToProps, mapDispatchToProps)(Dragger);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Declaration));
