import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Select, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { InboxOutlined } from '@ant-design/icons';

import * as actions from '../store/actions/guest-registration';
import DeleteIcon from '../components/Icons';

const { Option } = Select;
const { Dragger } = Upload;

/* For the Select component */
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
/* ****************** */

class GuardianForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fileList: this.props.fileList,
      uploading: false,
      fileSelected: this.props.fileSelected,
    };

    this.onRemove = this.onRemove.bind(this);
    this.onPreview = this.onPreview.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
    // this.onCollapse = this.onCollapse.bind(this);
    
  }

  onRemove = () => {
    this.props.removeImage(this.props.images, this.props.id, this.props.guardianForms)
    this.setState(
      {
        // fileList: this.props.images[this.props.id],
        fileList: [],
        fileSelected: false,
      }
    );
  }

  beforeUpload = file => {
    console.log(this.props);
    // Need to pass the id somewhere else? Oou have it as an added parameter for beforeUpload
    this.props.persistImage(this.props.images, this.props.id, file, this.props.guardianForms);
    this.setState(
      {
        fileList: this.props.images[this.props.id],
        fileSelected: true,
      }
    );
    // this.props.fileSelected = true;
    console.log("file list: ", this.state.fileList);
    return false;
  }

  onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  }


  render() {

    const {  fileList, uploading, fileSelected } = this.state;
    const props = {
      multiple: false,

      // fileList: this.props.images[this.props.id],

      showUploadList: {
        showDownloadIcon: true,
        downloadIcon: 'download ',
        showRemoveIcon: true,
        removeIcon: <DeleteIcon />,
      },
    
    };

    return (
      <div>
        <h1>{this.props.id}</h1> 
        <Form.Item name={"first_name" + this.props.id} label="First Name:">
          <Input 
            placeholder="Enter first name" 
          />
        </Form.Item>
        <Form.Item name={"middle_name" + this.props.id} label="Middle Name:">
          <Input 
            placeholder="Enter middle name" 
          />
        </Form.Item>
        <Form.Item name={"last_name" + this.props.id} label="Last Name:">
          <Input 
            placeholder="Enter last name" 
          />
        </Form.Item>
        <Form.Item name={"phone_number" + this.props.id}label="Telephone Number:">
          <Input 
            placeholder="Enter number" 
          />
        </Form.Item>
        <Form.Item name={"email_address" + this.props.id} label="Email:">
          <Input 
            placeholder="Enter email" 
          />
        </Form.Item>
        <Form.Item name={"nationality" + this.props.id} label="Nationality:">
          <Input 
            placeholder="Enter nationality" 
          />
        </Form.Item>
        <Form.Item name={"religion" + this.props.id} label="Religion:">
          <Input 
            placeholder="Enter religion" 
          />
        </Form.Item>
        <Form.Item name={"guardian_type" + this.props.id} label="Guardian Type:">
            {/* This is going to be a selection */}
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
        <Form.Item name={"lives_with_guardian" + this.props.id} label="Lives with guardian?">
            {/* This is going to be a checkbox */}
          <Input 
            placeholder="" 
          />
        </Form.Item>
        <Form.Item name={"occupation" + this.props.id} label="Occupation:">
          <Input 
            placeholder="Enter occupation" 
          />
        </Form.Item>
        <Form.Item name={"place_of_work" + this.props.id} label="Place of Work:">
          <Input 
            placeholder="Enter place of work" 
          />
        </Form.Item>
        <Form.Item name={"home_address" + this.props.id} label="Home Address:">
          <Input 
            placeholder="Enter address" 
          />
        </Form.Item>
        <Form.Item name={"postal_address" + this.props.id} label="Postal Address:">
          <Input 
            placeholder="Enter postal address" 
          />
        </Form.Item>

        { console.log('Form ID: ', this.props.id) } 
        { console.log('Image file: ', this.state.fileList) }
        {
          this.state.fileSelected
          ?
          <Upload 
            onRemove={this.onRemove} 
            onPreview={this.onPreview} 
            beforeUpload={this.beforeUpload} 
            {...props} 
            fileList = {this.state.fileList} 
          >
            {/* TODO: Pass an initial value for the image to the Upload component so it shows up 
                on re-render e.g. when we add a new form
            */}
          </Upload>
          :
          <ImgCrop>
          <Dragger 
            onRemove={this.onRemove} 
            onPreview={this.onPreview} 
            beforeUpload={this.beforeUpload}  
            {...props} 
            disabled={this.state.fileSelected} 
          >
            {/* <Button icon={<UploadOutlined />} disabled={this.state.fileSelected} >Select File</Button> */}

            
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag image to this area to upload</p>
            <p className="ant-upload-hint">
              One upload per form
            </p>

            
          </Dragger>
          </ImgCrop>

        }

        {
          (this.props.guardianForms.length > 1)
          ?
          <Form.Item>
            <Button 
              type='danger' 
              onClick={() => this.props.remove(this.props.guardianForms, this.props.listIndex, 'GuardianForm')} 
            >
              Remove
            </Button>
          </Form.Item>
          :
          <></>
        }
      </div>
    );
  }
};

const mapStateToProps = state => {
  console.log("Forms state-to-props: ", state);
  return {
    selectedMenuItem: state.guest.selectedMenuItem,
    guardianForms: state.guest.guardianForms,
    images: state.guest.images,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    persistImage: (images, id, file, formData) => dispatch(actions.addImage(images, id, file, formData)),
    removeImage: (images, id, formData) => dispatch(actions.removeImage(images, id, formData)),
    remove: (guardianForms, index, currentForm) => dispatch(actions.removeForm(guardianForms, index, currentForm)),
  }
}

connect(mapStateToProps, mapDispatchToProps)(Dragger);
export default connect(mapStateToProps, mapDispatchToProps)(GuardianForm);
