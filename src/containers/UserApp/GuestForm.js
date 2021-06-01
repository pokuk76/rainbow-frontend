import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { Form, Input, Button, Upload, Modal, Progress } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined, InboxOutlined, StopOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { guestFormCopy } from '../../utility/deepCopy';
import * as actions from '../../store/actions/guest';
import { DeleteIcon } from '../../components/Icons';

const { Dragger } = Upload;

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

  }
  componentDidMount() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    // console.log("Guest form copy: ", guestFormCopy(this.props.guestForm));

    /* I don't really like doing this in componentDidMount 
    https://www.google.com/search?q=react+call+setstate+in+componentdidmount&oq=react+calling+setstate+in+com&aqs=edge.2.0j69i64j0i22i30l3j69i57.11612j0j4&sourceid=chrome&ie=UTF-8
    */
    axios.get('http://127.0.0.1:8000/api/usernames/')
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

  handleOk = (e) => {
    // console.log(e);
    this.setState({
      modalVisible: false,
    });
  };

  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      modalVisible: false,
    });
  };

  /**
   * Called when an input field changes
   * 
   * @param {Event} e - A change event?
   * 
   */
  handleChange = (e) => {
    /* The id is the name of the Form.Item wrapping the input
    It is also the key needed for the given form object
    */
    // this.state.guestForm[e.target.id] = e.target.value;
    let guestForm = guestFormCopy(this.props.guestForm);
    guestForm[e.target.id] = e.target.value;
    this.props.updateForm(guestForm);
  }

  /**
   * TODO: finish this?
   * Gets called when the user clicks on the (Next || Save & Continue) button
   * 
   * @param {Object} values -  An object holding the form values
   * 
   */
  handleFormSubmit = (values) => {
    /* Need to understand how onFinish works (how do I override default behaviour then?)*/
    // event.preventDefault();

    const username = values['username'];
    const first_name = values['first_name'];
    const middle_name = values['middle_name'];
    const last_name = values['last_name'];

    console.log(values);
    console.log(`
    Username: ${username}
    First name: ${first_name}
    Last name: ${last_name}`);
  };

  /**
   * Gets called every render. Populates the form with values from the guest store
   * TODO: Move the call into componentDidMount?
   * 
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
        this.props.removeImage(this.props.images, this.props.id, this.props.guestForm)
        this.setState(state => {
          return {
            fileList: [],
            fileSelected: false,
          };
        });
      },

      beforeUpload: file => {
        // console.log(this.props);
        this.props.persistImage(this.props.images, this.props.id, file, this.props.guestForm);
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
          requiredMark="*"
          initialValues={initialValues}
          style={{ padding: '0.5em', }}
        >
          <Form.Item name="username" label="Username:"
            rules={[
              // Add an object with pattern (holding a regex for acceptable username input) 
              // to rules 
              {
                required: true,
                message: 'Username is required',
              }, 
              { validator: this.checkUsernameUnique }
              
            ]} 
            // rules={[{ validator: this.validateUsername}]}
          >
            <Input
              placeholder="Enter username"
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Item>

          <Form.Item name="first_name" label="First Name:"
            rules={[
              {
                required: true,
                message: 'Please input your first name',
              },
              {
                max: 64,
                message: 'First name must be less than 64 characters'
              }
            ]}
          >
            <Input
              placeholder="Enter first name"
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Item>

          <Form.Item name="middle_name" label="Middle Name:"
            rules={[
              {
                maxLength: 64,
                message: 'Middle name must be less than 64 characters'
              }
            ]}
          >
            <Input
              placeholder="Enter middle name"
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Item>

          <Form.Item name="last_name" label="Last Name:"
            rules={[
              {
                required: true,
                message: 'Please input your last name',
              },
              {
                maxLength: 64,
                message: 'Last name must be less than 64 characters'
              }
            ]}
          >
            <Input
              placeholder="Enter last name"
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Item>

          { imageUpload }

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
  // console.log("Forms state-to-props: ", state);
  return {
    selectedMenuItem: state.guest.selectedMenuItem,
    guestForm: state.guest.guestForm,
    images: state.guest.images
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateForm: (guestForm) => dispatch(actions.updateGuestInfo(guestForm)),
    persistImage: (images, id, file, formData) => dispatch(actions.addImage(images, id, file, formData)),
    removeImage: (images, id, formData) => dispatch(actions.removeImage(images, id, formData)),
  }
}

connect(mapStateToProps, mapDispatchToProps)(Dragger);
export default connect(mapStateToProps, mapDispatchToProps)(GuestInfo);
