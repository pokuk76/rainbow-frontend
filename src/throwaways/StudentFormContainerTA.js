import React from 'react';
import { connect } from 'react-redux';

import { Form, Input, Button, Select, Upload, Collapse } from 'antd';
import ImgCrop from 'antd-img-crop';
import { InboxOutlined, FileAddOutlined, CloseSquareOutlined } from '@ant-design/icons';

import * as actions from '../../store/actions/guest';
import DeleteIcon from '../../components/Icons';

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


 /* Collapse */
 const { Panel } = Collapse;

 function callback(key) {
   console.log(key);
 }
 
 /*******/

const genExtra = () => (
    <CloseSquareOutlined
        onClick={event => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation();
        }}
        style={{ color: 'red', }}
    />
);


class StudentForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            forms: [],
            fileList: this.props.fileList,
            uploading: false,
            fileSelected: this.props.fileSelected,
        };

        this.onRemove = this.onRemove.bind(this);
        this.onPreview = this.onPreview.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        // this.onCollapse = this.onCollapse.bind(this);
        this.renderForms = this.renderForms.bind(this);

    }

    onRemove = () => {
        this.props.removeImage(this.props.images, this.props.id, this.props.studentForms)
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
        this.props.persistImage(this.props.images, this.props.id, file, this.props.studentForms);
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

    componentDidMount() {
        this.renderForms();
    }

    componentDidUpdate(prevProps){
        /*  Added this to ensure that the forms re-render on add or remove
            Feels mad ghetto but it's working
        */
        if(prevProps.studentForms !== this.props.studentForms){
            this.renderForms();
        }
    }
    
    renderForms() {
    // componentDidMount() {
        console.log("Render forms");
        const { fileList, uploading, fileSelected } = this.state;
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

        var forms = [];
        let i = 0;
        console.log("Student form: ", this.props.studentForms);
        for (var form of this.props.studentForms){
          let formUID = Object.keys(form)[0];
          console.log("formUID: ", formUID);
          let fileSelected= (this.props.images[formUID]) ? true : false;
          let fileList = this.props.images[formUID];
          var key = "StudentPanel" + i;
          forms.push(
            <Panel header={"Student " + (i+1)} key={key} extra={genExtra()}>
              <Form key={"StudentForm" + i} layout='vertical' 
                id={formUID} 
                listindex={i}
                >
                <div>
                    <h1>{this.props.id}</h1>
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
                </Form>
            </Panel>
          );
          i++;
        }
        console.log("Forms in cDM: ", forms);

        this.setState({forms: forms});

    }


    render() {

        return (
            <div onLoad={this.renderForms}>
            <h1>Students</h1>
            <br />
            <Collapse
              key='CollapseStudents'
              defaultActiveKey={['StudentPanel0']} 
              onChange={callback} 
              expandIconPosition='left' 
            >
                { console.log("Forms: ", this.state.forms) }
                { this.state.forms }
            </Collapse>
            <br />
            { console.log("Selected menu item: ", this.state.selectedMenuItem) }
            <Button key={this.props.selectedMenuItem} onClick={() => this.props.addForm(this.props.studentForms, this.props.studentUID, 'StudentForm') }>
                <FileAddOutlined /> Add Student
            </Button>
          </div>
        );
    }
};

const mapStateToProps = state => {
    console.log("Forms state-to-props: ", state);
    return {
        guestForm: state.guest.guestForm,
        studentForms: state.guest.studentForms,
        studentUID: state.guest.studentUID,
        guardianForms: state.guest.guardianForms,
        guardianUID: state.guest.guardianUID,
        declaration: state.guest.declarationForm,
        images: state.guest.images
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
        addForm: (forms, uid, currentForm) => dispatch(actions.addForm(forms, uid, currentForm)),
        persistImage: (images, id, file, formData) => dispatch(actions.addImage(images, id, file, formData)),
        removeImage: (images, id, formData) => dispatch(actions.removeImage(images, id, formData)),
        remove: (studentForms, index, currentForm) => dispatch(actions.removeForm(studentForms, index, currentForm)),
    }
  }
  
  connect(mapStateToProps, mapDispatchToProps)(Dragger);
  export default connect(mapStateToProps, mapDispatchToProps)(StudentForm);