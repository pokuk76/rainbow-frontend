import React from 'react';
import { connect } from 'react-redux';

import { Button, Select, Upload, Collapse, Breadcrumb, Modal, BackTop } from 'antd';
import ImgCrop from 'antd-img-crop';
import { InboxOutlined, FileAddOutlined, CloseSquareOutlined, SaveOutlined, 
        TeamOutlined, RightOutlined, ArrowUpOutlined 
    } from '@ant-design/icons';

import { formsCopy } from '../../utility/deepCopy';
import { getInitialValues } from '../../utility/forms';

import * as actions from '../../store/actions/guest';

import GuardianFormComponent from '../../components/UserApp/GuardianForm';

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

function setPanelHeader(text, formValid) {
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
                {formValid ? " Valid" : "Not Valid"}
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
            currentId: -1, 
            modalVisible: false, 
            modalContent: <></>, 
        };

        this.onRemoveImage = this.onRemoveImage.bind(this);
        this.onPreview = this.onPreview.bind(this);
        // this.onCollapse = this.onCollapse.bind(this);
        this.renderForms = this.renderForms.bind(this);
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
        getInitialValues(this.props.guardianForms);
        this.renderForms();
        window.scroll({
            top: 0, 
            left: 0, 
            behavior: 'smooth'
        });
        console.log("Guardian forms copy: ", formsCopy(this.props.guardianForms));
    }

    componentDidUpdate(prevProps){
        /*  Added this to ensure that the forms re-render on add or remove (Forms i think maybe images too)
            Feels mad ghetto but it's working
            TODO: Try adding a state change on add and remove to re-render
        */
        // console.log("Prev props:", prevProps);
        // console.log("current props:", this.props);
        // console.log("State images:", this.state.images);
        if(prevProps.guardianForms !== this.props.guardianForms || prevProps.images !== this.props.images ){
            // console.log("A disturbance in the force");
            this.setState(
                {
                    images: this.props.images
                }
            );
            this.renderForms();
        }
    }

    checkValidityForm = (formUID) => {
        let valid = true;
        for( let element in this.props.guardianForms[formUID]) {
            try {
                valid = valid && this.props.guardianFormsValid[formUID][element];
            }
            catch(error) {
                valid = valid && true;
            }
        }
        return valid;
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
        const initialFormValues = getInitialValues(this.props.guardianForms);
        for (let formUID in this.props.guardianForms){
            // console.log("Form UID:", formUID);
            // let fileSelected = (this.props.images[formUID]) ? true : false;
            // let fileList = (this.props.images[formUID] === undefined) ? [] : this.props.images[formUID];
            var key = "GuardianPanel" + i;
            this.setState(
            {
                currentId: formUID,
            });

            const guardianFormProps = {
                showModal: this.showModal,
                formUID: formUID,
                initialValues: initialFormValues[formUID]
            }

            let removeIcon = <CloseSquareOutlined
                onClick={event => {
                    event.stopPropagation();
                    this.props.removeForm(this.props.guardianForms, this.props.guardianFormsValid, formUID, 'GuardianForm', this.props.images);
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
                header={setPanelHeader("Guardian " + (n+1), this.checkValidityForm(formUID))} 
                key={key} 
                extra={
                    (Object.keys(this.props.guardianForms).length > 1) ? 

                    <Button type="text" icon={removeIcon} style={{padding: 0}} danger>
                        
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
                    {this.state.forms}
                </Collapse>

                {/* Was getting in the way of the next/prev buttons
                <BackTop>
                    <div style={style}><ArrowUpOutlined /></div>
                </BackTop> */}

                <Modal
                    title="Your Upload"
                    className="imageModal"
                    visible={this.state.modalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    {this.state.modalContent}
                </Modal>

                <br />
                <Button key={this.props.selectedMenuItem} onClick={() => this.props.addForm(this.props.guardianForms, this.props.guardianFormsValid, this.props.guardianUID, 'GuardianForm')}>
                    <FileAddOutlined /> Add Parent/Guardian
                </Button>

                <br />
                <br />

                {/* <div style={{margin: "auto", width: "80%"}}>
                    <br />
                    <Button type="danger" htmlType="button" style={{float: "right"}}>Previous</Button>
                    <Button type="danger" htmlType="button" onClick={ (e) => this.props.componentSwitch('declaration')} style={{float: "left"}}>Next</Button>
                </div> */}
                
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
        guardianFormsValid: state.guest.guardianFormsValid, 
        guardianUID: state.guest.guardianUID,
        images: state.guest.images
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addForm: (forms, guardianFormsValid, uid, currentForm) => dispatch(actions.addForm(forms, guardianFormsValid, uid, currentForm)),
        removeImage: (images, id, formData) => dispatch(actions.removeImage(images, id, formData)),
        removeForm: (guardianForms, guardianFormsValid, uid, currentForm, images) => dispatch(actions.removeForm(guardianForms, guardianFormsValid, uid, currentForm, images)),
    }
}

connect(mapStateToProps, mapDispatchToProps)(Dragger);
export default connect(mapStateToProps, mapDispatchToProps)(GuardianForm);