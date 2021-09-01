import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Layout, Breadcrumb, Form, Button, Drawer, Badge, Spin, notification } from 'antd';
import { 
    ProfileOutlined, CloseOutlined, MenuOutlined, LoadingOutlined,
} from '@ant-design/icons';

import GuestInfo from './GuestForm';
import GuardianFormContainer from './GuardianFormContainer';
import StudentFormContainer from './StudentFormContainer';
import Declaration from './Declaration';
import { DrawerContents, DrawerTitle } from '../components/Drawer';

import * as formActions from '../../store/actions/form';
import * as actionTypes from '../../store/actions/actionTypes';

import { checkValiditySection, checkValidityForm } from '../../utility/forms';

import './layout.css';

const { Header, Content, Footer } = Layout;

const LoadingIcon = <LoadingOutlined style={{ fontSize: '5em' }} spin />;

const openInvalidErrorNotification = () => {
    notification['warning']({
        message: 'Invalid Form(s)',
        description: 'One or more of your forms were submitted with errors. Please fix these errors before attempting to re-submit.',
        placement: 'bottomRight',
        duration: 20,
    });
};

const openNetworkErrorNotification = () => {
    notification['error']({
        message: 'Network Error',
        description: 'A network error occurred. Please ensure that you are connected to the internet before attempting to re-submit.',
        placement: 'bottomRight',
        duration: 20,
    });
};

const openSuccessNotification = () => {
    notification['success']({
        message: 'Hurray!',
        description: 'Registration forms submitted successfully. Feel free to navigate away from this page.',
        placement: 'bottomRight',
        duration: 20,
    });
};

/*******/


class GuestLayout extends React.Component {
    constructor(props) {
        super(props);
        // this.myRef = React.createRef();

        this.state = {
            collapsed: false,
            prevMenuItem: '',
            selectedMenuItem: 'guest-details',
            visible: false,
            invalidNotificationShown: false,
        };

        this.componentSwitch = this.componentSwitch.bind(this);
        this.controlSwitch = this.controlSwitch.bind(this);
    }

    componentDidMount() {
        console.log("Node env:", process.env.NODE_ENV);
        console.log("Homepage url env:", process.env.REACT_APP_HOMEPAGE_URL);

    }

    componentSwitch = (key) => {
        switch (key) {
            case 'guest-details':
                const id = "GuestForm_0";
                return (
                    <div>
                        <Breadcrumb style={{ margin: '3.5em 0 2em 0' }}>
                            <Breadcrumb.Item>Portals</Breadcrumb.Item>
                            <Breadcrumb.Item>Registration</Breadcrumb.Item>
                            <Breadcrumb.Item>Guest Details</Breadcrumb.Item>
                        </Breadcrumb>
                        <h1><ProfileOutlined /> Guest Account</h1>
                        <GuestInfo
                            id={id}
                            fileSelected={(this.props.images[id]) ? true : false}
                        />
                    </div>
                );
            case 'students':
                return (<StudentFormContainer
                    id="StudentFormContainer"
                    selectedMenuItem={this.state.selectedMenuItem}
                // {...this.props} 
                />);
            case 'guardians':
                return (<GuardianFormContainer
                    id="GuardianFormContainer"
                    selectedMenuItem={this.state.selectedMenuItem}
                // componentSwitch={this.componentSwitch}
                // {...this.props} 
                />);
            case 'declaration':
                const declaration_id = "DeclarationForm_0";
                return (
                    <div>
                        <Declaration id={declaration_id} />
                    </div>
                );
            default:
                break;
        }
    }

    controlSwitch = (key) => {
        switch (key) {
            case 'guest-details':
                return (
                    <div style={{ margin: "auto", width: "80%" }}>
                        <br />
                        <Button type="danger" htmlType="button" onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: 'students', visible: false })} style={{ float: "right" }}>Next</Button>
                    </div>
                );
            case 'students':
                return (
                    <div style={{ margin: "auto", width: "80%" }}>
                        <br />
                        <Button type="danger" htmlType="button" onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: 'guest-details', visible: false })} style={{ float: "left" }}>Previous</Button>
                        <Button type="danger" htmlType="button" onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: 'guardians', visible: false })} style={{ float: "right" }}>Next</Button>
                    </div>
                );
            case 'guardians':
                return (
                    <div style={{ margin: "auto", width: "80%" }}>
                        <br />
                        <Button type="danger" htmlType="button" onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: 'students', visible: false })} style={{ float: "left" }}>Previous</Button>
                        <Button type="danger" htmlType="button" onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: 'declaration', visible: false })} style={{ float: "right" }}>Next </Button>
                    </div>
                );
            case 'declaration':
                return (
                    <div style={{ margin: "auto", width: "80%" }}>
                        <br />
                        <Button type="danger" htmlType="button" onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: 'guardians', visible: false })} style={{ float: "left" }}>Previous</Button>
                        <Form.Item style={{ float: "right" }}>
                            <Button type="primary" htmlType="submit" onClick={this.handleFormSubmit}>Finish</Button>
                        </Form.Item>
                    </div>
                );
        }
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    closeDrawer = () => {
        this.setState({
            visible: false,
        });
    };

    /* Currently Unused */
    onOpenChange = () => {
        this.setState({
            visible: !this.state.visible,
        });
    }


    /* Currently unused */
    getInitialValues = () => {
        const guest = this.props.guestForm;
        const guardians = this.props.guardianForms;
        const students = this.props.studentForms;
        const declaration = this.props.declarationForm;

        return {

            guestValue: this.handleForm(guest),
            studentValues: (students.length > 0) ? this.handleForm(students) : students,
            guardianValues: (guardians.length > 0) ? this.handleForm(guardians) : guardians,
            declarationValue: this.handleForm(declaration),
        }
    }

    /* Currently unused (called in func above) */
    handleForm = (formArray) => {
        let initialValues = {}; // Each form has its own initial values and we'll map then using the form's id

        for (var form of formArray) {
            let id = Object.keys(form)[0];
            let formItems = Object.values(form)[0];
            let initialForm = {};
            for (const [name, value] of Object.entries(formItems)) {
                console.log(`${name}: ${value}`);
                initialForm[name] = value;
            }
            initialValues[id] = initialForm;
        }

        return initialValues;
    }

    /**
     * TODO: finish/improve this? Idk
     * @param 
     */
    handleFormSubmit = () => {
        console.log("Submit being handled...");
        this.props.handleSubmit(this.props.guestForm, this.props.studentForms, this.props.guardianForms,
            this.props.declaration, this.props.images,
            {
                'invalidFormCallback': openInvalidErrorNotification,
                'networkErrorCallback': openNetworkErrorNotification,
                'successCallback': openSuccessNotification
            }
        );
    };

    showBadge = () => {
        let guestValid = checkValidityForm(this.props.guestFormValid);
        let studentsValid = checkValiditySection(this.props.studentFormsValid);
        let guardiansValid = checkValiditySection(this.props.guardianFormsValid);
        let declarationValid = checkValidityForm(this.props.declarationFormValid);

        return (this.props.submitStatus === actionTypes.SUBMIT_INVALID_FAIL) && (!guestValid || !studentsValid || !guardiansValid || !declarationValid);
    }

    render() {
        const drawerContentsProps = {
            selectedMenuItem: this.state.selectedMenuItem,
            setCurrentView: (e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: e.key, visible: false }),
            submitStatus: this.props.submitStatus,
            guestFormValid: this.props.guestFormValid,
            studentFormsValid: this.props.studentFormsValid,
            guardianFormsValid: this.props.guardianFormsValid,
            declarationFormValid: this.props.declarationFormValid,
        };

        return (
            <Layout
                style={{ minHeight: '100vh', maxWidth: '100vw', boxSizing: 'border-box' }}
            >
                <Spin spinning={this.props.loading} indicator={LoadingIcon} style={{ position: "fixed" }}>
                    <Drawer
                        title={<DrawerTitle />}
                        placement="left"
                        closable={true}
                        closeIcon={<CloseOutlined style={{ fontSize: '1.2em', color: 'white' }} />}
                        destroyOnClose={true}
                        onClose={this.closeDrawer}
                        visible={this.state.visible}
                        getContainer={false}
                        headerStyle={{ backgroundColor: '#111d2c', }}
                        bodyStyle={{ padding: '0' }}
                        // Have to specify the dark-mode bg color b/c it's white on mobile for some reason
                        drawerStyle={{ border: '2px solid white', backgroundColor: '#001529' }}
                    >
                        {/* {drawerContents} */}
                        <DrawerContents
                            {...drawerContentsProps}
                        />
                    </Drawer>

                    <Layout key={"Layout" + this.state.selectedMenuItem}>
                        <Header style={{ position: 'fixed', zIndex: 1, width: '100vw', paddingLeft: "3em", boxSizing: 'border-box' }}>
                            <Badge dot={this.showBadge()}>
                                <Button type="primary" onClick={this.showDrawer} icon={<MenuOutlined style={{ fontSize: "1.5em" }} />} style={{ backgroundColor: 'inherit', borderColor: "white" }}>
                                </Button>
                            </Badge>
                            {/* <MenuOutlined onClick={this.showDrawer} /> */}
                        </Header>

                        <Content
                            key={"Content" + this.state.selectedMenuItem}
                            style={{
                                margin: '0 0', padding: '1.8em',
                                maxWidth: '100vw', minHeight: '100vh'
                            }}
                        >
                            <Form.Provider>
                                {this.componentSwitch(this.state.selectedMenuItem)}
                            </Form.Provider>
                            {this.controlSwitch(this.state.selectedMenuItem)}
                        </Content>

                        <Footer style={{ textAlign: 'center' }}>Rainbow Edu ©2021 | By kbd</Footer>
                    </Layout>
                </Spin>

            </Layout>
        );
    }
}


const mapStateToProps = state => {
    return {
        guestForm: state.guest.guestForm,
        guestFormValid: state.guest.guestFormValid,
        studentForms: state.guest.studentForms,
        studentFormsValid: state.guest.studentFormsValid,
        studentUID: state.guest.studentUID,
        guardianForms: state.guest.guardianForms,
        guardianFormsValid: state.guest.guardianFormsValid,
        guardianUID: state.guest.guardianUID,
        declaration: state.guest.declarationForm,
        declarationFormValid: state.guest.declarationFormValid,
        images: state.guest.images,

        /* Form Submission Props */
        submitStatus: state.form.submitStatus,
        loading: state.form.loading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        handleSubmit: (guestForm, studentForms, guardianForms, declarationForm, images, kwargs) => dispatch(formActions.handleSubmit(guestForm, studentForms, guardianForms, declarationForm, images, kwargs)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GuestLayout));
