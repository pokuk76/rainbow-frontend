import React from 'react';
import { connect } from 'react-redux';

import { Form, Input, Button, Select, Upload, Collapse, Breadcrumb, Modal, BackTop } from 'antd';
import ImgCrop from 'antd-img-crop';
import { InboxOutlined, FileAddOutlined, CloseSquareOutlined, SaveOutlined, 
        TeamOutlined, RightOutlined, ArrowUpOutlined 
    } from '@ant-design/icons';

import * as actions from '../../store/actions/guest-registration';
import { DeleteIcon } from '../../components/Icons';

import GuardianFormComponent from '../../components/guest-users/GuardianForm';

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
    // console.log("Collapse: ", this);
    // console.log("Active key:", this.activeKey);
    // for(let panel of this.children) {
    //     console.log("Panel: ", panel);
    // }
}

/*******/

function setPanelHeader(text) {
    return <div style={{ display: 'inline-flex', marginLeft: '1em', height: '100%', width: '70%' }}><h1 
                style={{ fontSize: '1.5em', 
                    margin: 'auto', 
                    textAlign: 'right', 
                    height: '100%', 
                    width: '60%', 
                    // backgroundColor: 'red',
                }}
            >
                {text}
            </h1></div>;
}


/**
 * Class-based Container for guardian input form(s)
 *
 * @version 
 * @author [Kofi Poku](https://github.com/pokuk76)
 */

class GuardianForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            forms: [],
            filesObject: {},
            initialFormValues: {},
            uploading: false,
            // fileSelected: this.props.fileSelected,
            currentId: -1,
            modalVisible: false,
            modalContent: <></>,
            images: this.props.images,
            guardianForms: this.props.guardianForms // We're passing by reference, which actually works for us 
                                                    // but might cause issues later?
        };

        this.onRemoveImage = this.onRemoveImage.bind(this);
        this.onPreview = this.onPreview.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        // this.onCollapse = this.onCollapse.bind(this);
        this.renderForms = this.renderForms.bind(this);
        this.onContinue = this.onContinue.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }

    onExpand(key) {
        console.log("On expand:", key);
        return 90;
    }

    handleChange(e) {
        /* The id is the name of the Form.Item wrapping the input
        It is also the key needed for the given form object
        */

        let form = e.target.id.split("+")[0];
        let field = e.target.id.split("+")[1];
        this.props.guardianForms[form][field] = e.target.value;
    }

    onContinue() {
        console.log("Guardian Forms", this.props.guardianForms);
    }

    onSave = (values) => {
        console.log("onSave values", values);
        console.log("id", this.props.id);
        console.log("First name: ", values.target['first_name']);
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
    
    onRemoveImage() {
        this.props.removeImage(this.props.images, this.props.id, this.props.guardianForms)
        this.setState(
            {
                // fileList: this.props.images[this.props.id],
                filesObject: {},
                // fileSelectedObject: {},
            }
        );
    }

    beforeUpload(file, fileList) {
        console.log("File: ", file);
        //let file = fileList[0];
        console.log("ID: ", this.state.currentId);
        console.log("Filelist: ", fileList);
        this.props.addImage(this.props.images, this.state.currentId, file, this.props.guardianForms);
        this.setState(
            {
                fileList: this.props.images[this.props.id],
                fileSelected: true,
            }
        );
        // this.props.fileSelected = true;
        console.log("file list: ", this.props.images);
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
        this.getInitialValues();
        this.renderForms();
        window.scroll({
            top: 0, 
            left: 0, 
            behavior: 'smooth'
          });
    }

    componentDidUpdate(prevProps){
        /*  Added this to ensure that the forms re-render on add or remove (Forms i think maybe images too)
            Feels mad ghetto but it's working
            TODO: Try adding a state change on add and remove to re-render
        */
        // console.log("Prev props:", prevProps);
        // console.log("current props:", this.props);
        // console.log("State images:", this.state.images);
        if(prevProps.guardianForms !== this.props.guardianForms || this.state.images !== prevProps.images ){
            // console.log("A disturbance in the force");
            this.setState(
                {
                    images: this.props.images
                }
            );
            this.renderForms();
        }
    }

    
    getInitialValues() {
        const guardianForms = this.props.guardianForms;
        let initialValues = {}; // Each form has its own initial values and we'll map then using the form's id

        for (let formUID in guardianForms){
            let formItems = guardianForms[formUID];
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

        console.log("Initial values: ", initialValues);
        return initialValues;
        // this.setState({initialFormValues: initialValues});
    }

    /**
     * Method to create the forms for the container, which are held in state
     * 
     * Called when the GuardianFormContainer mounts and when it updates
     * 
     * TODO: Make this better?
     */
    renderForms(){
        // console.log("Rendering forms...");
        const { uploading } = this.state;

        var forms = [];
        let i = 0;
        const initialFormValues = this.getInitialValues();
        for (let formUID in this.props.guardianForms){
            // console.log("Form UID:", formUID);
            let fileSelected = (this.props.images[formUID]) ? true : false;
            let fileList = (this.props.images[formUID] === undefined) ? [] : this.props.images[formUID];
            // console.log("File list:", fileList);
            // fileList=[];
            var key = "GuardianPanel" + i;
            this.setState(
            {
                currentId: formUID,
            });

            let removeIcon = <CloseSquareOutlined
                style={{
                    color: 'red',
                    fontSize: '1em',
                    // paddingRight: '1em',
                }}
            />;

            const uploadProps = {
                multiple: false,
          
                onRemove: () => {
                    // console.log("Props images before remove: ", this.props.images);
                    this.props.removeImage(this.props.images, formUID, this.props.guardianForms)
                    let images = {...this.state.images};
                    // delete images[this.state.currentId]; 
                    this.setState(
                        {
                            images: images,
                        }
                    );
                    // fileSelected = (this.props.images[formUID]) ? true : false;
                    // fileList = [this.props.images[formUID]];
                },
          
                beforeUpload: file => {
                    // console.log("Props images before upload: ", this.props.images);
                    this.props.addImage(this.state.images, formUID, file, this.props.guardianForms);
                    // console.log("Props images after upload: ", this.props.images);
                    let images = {...this.props.images};
                    this.setState(state => ({
                        images: images,
                    }));
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
                  let modalContent = <div style={{backgroundColor:'red', height:20, width:20, }} ></div>;
                  modalContent = <img src={src} alt="avatar" style={{ width: '100%' }} />;
                  this.showModal(modalContent);
                },
          
                // fileList: this.props.images[this.state.currentId],
                fileList: fileList,
          
                listType: "picture", 
                // progress: <Progress type="line"/>, 
          
                showUploadList: {
                  showPreviewIcon: true,
                  showDownloadIcon: true,
                  downloadIcon: 'download ',
                  showRemoveIcon: true,
                  removeIcon: removeIcon,
                },
            };

            const guardianFormProps = {
                showModal: this.showModal,
                formUID: formUID,
                initialValues: initialFormValues[formUID]
            }

            let closeIcon = <CloseSquareOutlined
                // onMouseEnter={console.log("Square Hover")}
                onClick={event => {
                    event.stopPropagation();
                    this.props.remove(this.props.guardianForms, formUID, 'GuardianForm', this.props.images);
                }}
                style={{
                    // color: 'red',
                    // ":hover": { fontColor: "blue" },
                    fontSize: '2em',
                    margin: 'auto',
                    // backgroundColor: 'black',
                    // display: 'inline',
                }}
            />;

            let n = parseInt(formUID.split('_')[1], 10);
            forms.push(
            <Panel 
                // style={{":hover": { backgroundColor: "blue"}, zIndex: 1}} 
                header={setPanelHeader("Guardian " + (n+1))} 
                key={key} 
                extra={
                    (Object.keys(this.props.guardianForms).length > 1) ? 

                    <Button type="text" icon={closeIcon} style={{padding: 0}} danger>
                        
                    </Button>
                     : <></>
                }
            >
                <GuardianFormComponent {...guardianFormProps}>

                </GuardianFormComponent>
                {/* </Form> */}
            </Panel>
            );
            i++;
        }
        this.setState({forms: forms});

    }


    render() {

        // const initialValues = this.getInitialValues();
        // console.log("Initial Values: ", initialValues);
        // this.setState({initialFormValues: initialValues});

        const style = {
            height: 40,
            width: 40,
            lineHeight: '40px',
            borderRadius: 4,
            backgroundColor: '#1088e9',
            color: '#fff',
            textAlign: 'center',
            fontSize: 14,
        };

        return (
            <div>
                <Breadcrumb style={{ margin: '3.5em 0 2em 0' }}>
                    <Breadcrumb.Item>Portals</Breadcrumb.Item>
                    <Breadcrumb.Item>Registration</Breadcrumb.Item>
                    <Breadcrumb.Item>Guardian Details</Breadcrumb.Item>
                </Breadcrumb>
                <h1><TeamOutlined /> Guardians</h1>
                <br />
            {/* <Form 
                key={"GuardianForm"} 
                layout='vertical' 
                id={"GuardianForm"} 
                initialValues={initialValues} 

            > */}
            <br />
            <Collapse
                key='CollapseGuardians' 
                defaultActiveKey={['GuardianPanel0']} 
                onChange={callback} 
                expandIcon={
                    ({ isActive }) => <RightOutlined 
                    rotate={isActive ? 90 : 0} 
                    style={{ fontSize: '2em', }} 
                    />
                }
                // expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} style={{ fontSize: '2em', }} />}
                expandIconPosition='left' 
            >
                { this.state.forms }
            </Collapse>

            <BackTop>
                <div style={style}><ArrowUpOutlined /></div>
            </BackTop>

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
            
            <br />
            <Button key={this.props.selectedMenuItem} onClick={() => this.props.addForm(this.props.guardianForms, this.props.guardianUID, 'GuardianForm', this.props.images) }>
                <FileAddOutlined /> Add Parent or Guardian
            </Button>

            <br/>
            <br/>
            {/* <div>
                <Form.Item>
                <Button type='primary' htmlType='submit' onClick={this.onSave}>
                    <SaveOutlined /> Submit
                </Button>
                </Form.Item>
                <Form.Item>
                <Button type='secondary' htmlType='submit' onClick={this.onContinue}>
                    <SaveOutlined /> Save & Continue
                </Button>
                </Form.Item>
            </div> */}

            {/* </Form> */}
            
          </div>
        );
    }
};

const mapStateToProps = state => {
    // console.log("Forms state-to-props: ", state);
    return {
        guardianForms: state.guest.guardianForms,
        guardianUID: state.guest.guardianUID,
        images: state.guest.images
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addForm: (forms, uid, currentForm, images) => dispatch(actions.addForm(forms, uid, currentForm, images)),
        addImage: (images, id, file, formData) => dispatch(actions.addImage(images, id, file, formData)),
        removeImage: (images, id, formData) => dispatch(actions.removeImage(images, id, formData)),
        remove: (guardianForms, uid, currentForm, images) => dispatch(actions.removeForm(guardianForms, uid, currentForm, images)),
    }
}

connect(mapStateToProps, mapDispatchToProps)(Dragger);
export default connect(mapStateToProps, mapDispatchToProps)(GuardianForm);