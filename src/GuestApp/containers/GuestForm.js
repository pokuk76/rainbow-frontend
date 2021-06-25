import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import debounce from "lodash/debounce";

import { Form, Input, Upload, Modal, Progress } from 'antd';
import ImgCrop from 'antd-img-crop';
import { InboxOutlined, CloseSquareOutlined } from '@ant-design/icons';

import * as actions from '../../store/actions/guest';
import * as actionTypes from '../../store/actions/actionTypes';
import { guestFormCopy } from '../../utility/deepCopy';
import { guestFormItems, checkValidityItem } from '../../utility/forms';

const { Dragger } = Upload;

const testInvalidSubmitState = true;


/**
 * Class-based Component for guest user's to input information/details
 *
 * @version 
 * @author [Kofi Poku](https://github.com/pokuk76)
 */
class GuestInfo extends React.Component {

  constructor(props) {
    super(props);
    // this.myRef = React.createRef();

    this.state = {
      modalVisible: false,
      modalContent: <></>,
      fileList: [],
      uploading: false,
      fileSelected: this.props.fileSelected, 
      // guestForm: this.props.guestForm 
      // We're passing by reference, which actually works for us but might cause issues later?
      usernames: ["username1", "username2", "poku.flacko"], //Just some dummy date for if I'm not running the backend locally TODO: Remove this for production
    };

    this.debounceHandleChange = debounce(this.debounceHandleChange.bind(this), 1000);
    this.handleChange = this.handleChange.bind(this);

  }

  componentDidMount() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    /* I don't really like doing this in componentDidMount 
    https://www.google.com/search?q=react+call+setstate+in+componentdidmount&oq=react+calling+setstate+in+com&aqs=edge.2.0j69i64j0i22i30l3j69i57.11612j0j4&sourceid=chrome&ie=UTF-8
    */
    axios.get('api/usernames/')
      .then(response => {
        console.log(response.data);
        this.setState({usernames: response.data});
      })
      .catch(error => {
        console.log(error);
      });
  }

  showModal = (body) => {
    this.setState({
      modalVisible: true,
      modalContent: body,
    });
  };

  /**
   * Called when the user clicks OK on the modal
   * @param {Event} e - A click event
   */
  handleOk = (e) => {
    this.setState({
      modalVisible: false,
    });
  };

  /**
   * Called when the user clicks OK on the modal
   * @param {Event} e - A change event?
   */
  handleCancel = (e) => {
    this.setState({
      modalVisible: false,
    });
  };

  //TODO: Maybe add a debounceCheckValidity? Or maybe we actually go with web workers?
  debounceHandleChange(field, value) {

    let guestForm = guestFormCopy(this.props.guestForm);
    let guestFormValid = guestFormCopy(this.props.guestFormValid);

    guestForm[field] = value;
    var rules = guestFormItems[field]['validation_rules'];
    guestFormValid[field] = checkValidityItem(value, rules);
    // let testRequired = [{ required: true, message: "Username Required" }, { unique: true, message: "Must be unique" } ];
    // if(testInvalidSubmitState) {
    //   this.props.guestFormValid[field] = checkValidityItem(value, guestFormItems[field]['validation_rules']);
    // }
    this.props.updateGuestInfo(guestForm, guestFormValid);
  }

  /**
   * Called when an input field changes
   * @param {Event} e - A change event?
   */
  handleChange = (e) => {
    /* The id is the name of the Form.Item wrapping the input
    It is also the key needed for the given form object
    */
    // this.state.guestForm[e.target.id] = e.target.value;
    // let guestForm = guestFormCopy(this.props.guestForm);
    // guestForm[e.target.id] = e.target.value;

    let field = e.target.id;
    let value = e.target.value; 
    this.debounceHandleChange(field, value);
  }


  /**
   * Gets called every render. Populates the form with values from the guest store
   * TODO: Move the call into componentDidMount?
   */
  getInitialValues = () => {
    const guestForm = this.props.guestForm;

    let initialForm = {};
    try {
      for (const [name, value] of Object.entries(guestForm)) {
        // console.log(`${name}: ${value}`);
        initialForm[name] = value;
      }
    }
    finally {
      return initialForm;
    }
  }

  checkUsernameUnique = (rule, value /*, callback*/) => {
    /* Apparently callbacks are deprecated */
    // if (this.state.usernames.includes(value)) {
    //   callback("Username already exists");
    // }
    // callback();
    return new Promise(async (resolve, reject) => {
      if (this.state.usernames.includes(value)) {
        await reject("Username already exists");
      } else {
        await resolve();
      }
    });
  }

  getValidationProps = (key) => {
    // console.log(this.props.submitStatus);
    return (this.props.submitStatus === actionTypes.SUBMIT_INVALID_FAIL) ? this.props.guestFormValid[key] : null;
  }

  render() {

    const initialValues = this.getInitialValues();

    let closeIcon = <CloseSquareOutlined
      style={{
        color: 'red', 
        fontSize: '1em', 
        // paddingRight: '1em',
      }}
    />;

    const uploadProps = {
      multiple: false,

      onRemove: () => {
        this.props.removeImage(this.props.images, this.props.id)
        this.setState(state => {
          return {
            fileList: [],
            fileSelected: false,
          };
        });
      },

      beforeUpload: file => {
        // console.log(this.props);
        this.props.addImage(this.props.images, this.props.id, file);
        this.setState(state => ({
          fileList: this.props.images[this.props.id],
          fileSelected: true,
        }));
        console.log("image file", file);
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
        let modalContent = <div style={{ backgroundColor: 'red', height: 20, width: 20, }} ></div>;
        modalContent = <img src={src} alt="avatar" style={{ width: '100%' }} />;
        this.showModal(modalContent);
      },

      fileList: this.props.images[this.props.id],

      listType: "picture",
      // progress: <Progress type="line"/>, 

      showUploadList: {
        showPreviewIcon: true,
        showDownloadIcon: true,
        downloadIcon: 'download ',
        showRemoveIcon: true,
        removeIcon: closeIcon,
      },

    };

    const handleMessage = (value) => {
      console.log("Input value: ", this.props.guestForm[value]);
      // console.log("'${name}' is not a valid...");
      return "my message";
    };

    const imageUpload = (
      this.state.fileSelected
        ?
        <Upload {...uploadProps} >

        </Upload>
        :
        <ImgCrop>
          <Dragger {...uploadProps} disabled={this.state.fileSelected} >
            {/* <Button icon={<UploadOutlined />} disabled={this.state.fileSelected} >Select File</Button> */}


            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Please provide a photo suitable for official identification</p>
            <p className="ant-upload-hint">
              Click or drag image to this area to upload
            </p>


          </Dragger>
        </ImgCrop>

    )

    return (
      <div >
        <Form
          key={"GuestForm"}
          layout='vertical'
          requiredMark={true}
          initialValues={initialValues}
          style={{ padding: '0.5em', }}
        >
          <Form.Item name="username" label="Username:"
            rules={[
              // Add an object with pattern (holding a regex for acceptable username input) 
              // to rules 
              { required: true, message: 'Username is required' }, 
              { max: 128, message: 'username must be less than 128 characters' }, 
              { validator: this.checkUsernameUnique }
            ]} 
            // { ...customValidationProps }
            {  ...this.getValidationProps('username')  }
            // rules={[{ validator: this.validateUsername}]}
          >
            <Input
              placeholder="Enter username"
              onChange={(e) => this.handleChange(e)}
            />
            
            {/* { customValidation } */}

          </Form.Item>

          <Form.Item name="first_name" label="First Name:"
            rules={[
              {
                required: true,
                message: 'Please input your first name',
              },
              {
                max: 128,
                message: 'First name must be less than 128 characters'
              }
            ]} 
            { ...this.getValidationProps('first_name') }
          >
            <Input
              placeholder="Enter first name"
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Item>

          <Form.Item name="middle_name" label="Middle Name:"
            rules={[
              {
                max: 128,
                message: 'Middle name must be less than 128 characters'
              }
            ]} 
            {  ...this.getValidationProps('middle_name')  }
          >
            <Input
              placeholder="Enter middle name"
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Item>

          <Form.Item name="last_name" label="Last Name:"
            rules={[
              { required: true, message: 'Please input your last name' },
              { max: 128, message: 'Last name must be less than 64 characters' }
            ]} 
            {  ...this.getValidationProps('last_name')  }
          >
            <Input
              placeholder="Enter last name"
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Item>

          {/* { imageUpload } */}

          <Modal
            title="Basic Modal"
            className="imageModal"
            visible={this.state.modalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            destroyOnClose={true}
          >
            {this.state.modalContent}
          </Modal>

        </Form>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    guestForm: state.guest.guestForm,
    images: state.guest.images, 
    guestFormValid: state.guest.guestFormValid, 
    
    submitStatus: state.form.submitStatus, 
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateGuestInfo: (guestForm, guestFormValid) => dispatch(actions.updateGuestInfo(guestForm, guestFormValid)),
    addImage: (images, id, file) => dispatch(actions.addImage(images, id, file)),
    removeImage: (images, id) => dispatch(actions.removeImage(images, id)),
  }
}

connect(mapStateToProps, mapDispatchToProps)(Dragger);
export { GuestInfo as GuestForm};
export default connect(mapStateToProps, mapDispatchToProps)(GuestInfo);
