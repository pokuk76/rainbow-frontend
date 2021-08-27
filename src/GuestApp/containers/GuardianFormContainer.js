import React from 'react';
import { connect } from 'react-redux';

import { Button, Collapse, Breadcrumb, Modal } from 'antd';
import { FileAddOutlined, CloseSquareOutlined, TeamOutlined, RightOutlined } from '@ant-design/icons';

import GuardianFormComponent from '../components/GuardianForm';

import * as actions from '../../store/actions/guest';
import { getInitialValues, guardianFormItems, checkValidityForm } from '../../utility/forms';

/* For the Select component */
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
    return (
        <div style={{ display: 'inline-flex', marginLeft: '1em', height: '100%', width: '70%' }}>
            <h1 style={{ fontSize: '1.5em', margin: 'auto', textAlign: 'right', 
                    height: '100%', width: '60%'
            }}>
                { text } 
                {/* { ( formValid === null ) ? " Valid" : "Not Valid" } */}
            </h1>
        </div>
    );
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
            modalVisible: false, 
            modalContent: <></>, 
        };

        // this.onCollapse = this.onCollapse.bind(this);
        this.renderForms = this.renderForms.bind(this);
    }

    showModal = (body) => {
        this.setState({
            modalVisible: true,
            modalContent: body,
        });
    };

    handleOk = (e) => {
        this.setState({
            modalVisible: false,
        });
    };

    handleCancel = (e) => {
        this.setState({
            modalVisible: false,
        });
    };
    

    componentDidMount() {
        // Not sure why we were calling get initialValues here?
        // getInitialValues(this.props.guardianForms);
        window.scroll({
            top: 0, 
            left: 0, 
            behavior: 'smooth'
        });
        this.renderForms();
    }

    componentDidUpdate(prevProps){
        /*  Added this to ensure that the forms re-render on addition or removal of Form & i think maybe images too 
            (renderForms updates state causing a component re-render)
            Feels mad ghetto but it's working
            TODO: Try adding a state change on add and remove to auto re-render
        */
        if(prevProps.guardianForms !== this.props.guardianForms || prevProps.images !== this.props.images ){
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
                valid = valid && true;  // If the form or element is undefined, we leave valid unchanged TODO: does this make sense?
            }
        }
        return valid;
    }
    
    /**
     * Method to create the forms for the container, which are held in state
     * Called when the GuardianFormContainer mounts and when it updates
     * 
     * TODO: Make this better?
     */
    renderForms(){
        var forms = [];
        let i = 0;
        const initialFormValues = getInitialValues(this.props.guardianForms);
        for (let formUID in this.props.guardianForms){
            var key = "GuardianPanel" + i;

            const guardianFormProps = {
                showModal: this.showModal,
                update: this.props.updateGuardians,
                addImage: this.props.addImage,
                addForm: this.props.addForm,
                removeForm: this.props.removeForm,

                formUID: formUID,
                forms: this.props.guardianForms,
                formsValid: this.props.guardianFormsValid,
                images: this.props.images,
                submitStatus: this.props.submitStatus,

                initialValues: {...initialFormValues[formUID], country_code: 'Ghana'},
                formFields: guardianFormItems,
                formType: 'GuardianForm'
            }

            let removeFormIcon = <CloseSquareOutlined
                onClick={event => {
                    event.stopPropagation();
                    this.props.removeForm(this.props.guardianForms, this.props.guardianFormsValid, formUID, 'GuardianForm', this.props.images);
                }}
                style={{
                    // color: 'red',
                    // ":hover": { fontColor: "blue" },
                    fontSize: '1.5em',
                    margin: 'auto',
                    // backgroundColor: 'black',
                    // display: 'inline',
                }}
            />;

            let n = parseInt(formUID.split('_')[1], 10);
            forms.push(
                <Panel
                    // style={{":hover": { backgroundColor: "blue"}, zIndex: 1}} 
                    header={setPanelHeader("Guardian " + (n + 1), checkValidityForm(this.props.guardianFormsValid[formUID]))}
                    key={key}
                    extra={
                        (Object.keys(this.props.guardianForms).length > 1) ?
                            <Button type="text" icon={removeFormIcon} style={{ padding: 0 }} danger /> : <></>}
                >
                    <GuardianFormComponent {...guardianFormProps} />
                </Panel>
            );
            i++;
        }
        
        this.setState({forms: forms});

    }


    render() {

        // Think this was for the BackToTop component?
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
                <br />
                <Collapse
                    key='CollapseGuardians'
                    defaultActiveKey={['GuardianPanel0']}
                    onChange={callback}
                    expandIcon={
                        ({ isActive }) => <RightOutlined
                            rotate={isActive ? 90 : 0}
                            style={{ fontSize: '1.5em', }}
                        />
                    }
                    expandIconPosition='left'
                    style={{width: '80%', margin: 'auto'}}
                >
                    { this.state.forms }
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
                <Button
                    key={this.props.selectedMenuItem}
                    onClick={
                        () => this.props.addForm(
                            this.props.guardianForms,
                            this.props.guardianFormsValid,
                            this.props.guardianUID,
                            'GuardianForm')
                    }
                    style={{marginLeft: '10%'}}
                >
                    <FileAddOutlined /> Add Parent/Guardian
                </Button>

                <br />
                <br />

            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        guardianForms: state.guest.guardianForms,
        guardianFormsValid: state.guest.guardianFormsValid, 
        guardianUID: state.guest.guardianUID,
        images: state.guest.images,

        submitStatus: state.form.submitStatus,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateGuardians: (guardianForms, guardianFormsValid) =>
            dispatch(actions.updateGuardians(guardianForms, guardianFormsValid)),
        addForm: (forms, guardianFormsValid, uid, currentForm) =>
            dispatch(actions.addForm(forms, guardianFormsValid, uid, currentForm)),
        removeForm: (guardianForms, guardianFormsValid, uid, currentForm, images) =>
            dispatch(actions.removeForm(guardianForms, guardianFormsValid, uid, currentForm, images)),
        addImage: (images, id, file) => dispatch(actions.addImage(images, id, file)),
        removeImage: (images, id) => dispatch(actions.removeImage(images, id)),
    }
}

// connect(mapStateToProps, mapDispatchToProps)(Dragger);
export default connect(mapStateToProps, mapDispatchToProps)(GuardianForm);