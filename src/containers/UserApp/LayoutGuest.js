import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from'react-router-dom';

import { RainbowIcon } from '../../components/Icons';

// import { Flex } from 'antd-mobile';
// import { Drawer } from 'antd-mobile';
import { Layout, Menu, Breadcrumb, Form, Button, Drawer, Badge, Spin, notification } from 'antd';
import { ProfileOutlined, UserAddOutlined, TeamOutlined, WalletOutlined,
  CloseOutlined, CloseSquareOutlined, MenuOutlined, ExclamationCircleOutlined, 
  LoadingOutlined, 
} from '@ant-design/icons';

import './layout.css';  

import * as guestActions from '../../store/actions/guest';
import * as formActions from '../../store/actions/form';
import * as actionTypes from '../../store/actions/actionTypes';

import GuestInfo from './GuestForm';
import GuardianFormContainer from './GuardianFormContainer';
import StudentFormContainer from './StudentFormContainer';
import Declaration from './Declaration';

import { checkValiditySection, checkValidityForm } from '../../utility/forms';

const { Header, Content, Footer, Sider } = Layout;

const LoadingIcon = <LoadingOutlined style={{ fontSize: '5em' }} spin />;

const menuItemStyle = { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, height: "10%", fontSize:"1.2em", display: "flex", alignItems:"center", paddingLeft:"3em" }

function callback(key) {
  console.log(key);
}

const openInvalidErrorNotification = type => {
  notification[type]({
    message: 'Invalid Form(s)',
    description:
      'One or more of your forms were submitted with errors. Please fix these errors before attempting to re-submit.', 
    placement: 'bottomRight', 
    duration: 10,
  });
};

const openNetworkErrorNotification = type => {
  notification[type]({
    message: 'Network Error',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
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
      showBadge: true, 
      invalidNotificationShown: false, 
      networkNotificationShown: false, 
    };

    this.componentSwitch = this.componentSwitch.bind(this);
  }

  componentDidUpdate(prevProps) {
    // TODO: Maybe provide the notification functions as callbacks to the submitForms action creator/handler thingy
    // If the user submits an invalid formset more than once, notification won't fire more than once
    if ( this.props.submitStatus === actionTypes.SUBMIT_INVALID_FAIL && !this.state.invalidNotificationShown ) {
      openInvalidErrorNotification('warning');
      this.setState({
        invalidNotificationShown: true,
      });
    } else if ( this.props.submitStatus === actionTypes.SUBMIT_NETWORK_FAIL ) {
      openNetworkErrorNotification('error');
    }

  }

  checkValiditySection = (formObj) => {
    let valid = true;
    for (let formUID in formObj){
      for (let element in formObj[formUID]) {
        try {
          valid = valid && formObj[formUID][element];
        }
        catch (error) {
          valid = valid && true;
        }
      }
    }
    return valid;
  }

  componentSwitch = (key) => {
    let forms = [];
    var i=0;

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
              fileSelected={
                (this.props.images[id]) ? true : false
              } 
              />
          </div>
        );
      case 'students':
        return(<StudentFormContainer 
          key={"StudentFormContainer"} 
          selectedMenuItem = { this.state.selectedMenuItem } 
          
          {...this.props} />);
      case 'guardians':
        return (<GuardianFormContainer
          key={"GuardianFormContainer"}
          selectedMenuItem={this.state.selectedMenuItem}
          // componentSwitch={this.componentSwitch}

          {...this.props} />);
      case 'declaration':
        const declaration_id = "DeclarationForm_0";
        return (
          <div>
            <Declaration 
              id={declaration_id} 
            />
          </div>
        );
      default:
        break;
    }
  };

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
    // let viewportmeta = document.querySelector('meta[name="viewport"]');
    // if (viewportmeta) {
    //   viewportmeta.setAttribute('content', 'width=device-width, maximum-scale=1.0, initial-scale=1.0');
    // }
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
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

    for (var form of formArray){
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

  handleFormSubmit = () => {
    console.log("Form Submit to be handled...");
    this.props.handleSubmit(this.props.guestForm, 
                            this.props.studentForms, 
                            this.props.guardianForms, 
                            this.props.declarationForm, this.props.images);
    
  }

  showBadge = () => {
    let guestValid = checkValidityForm(this.props.guestFormValid);
    let studentsValid = checkValiditySection(this.props.studentFormsValid);
    let guardiansValid = checkValiditySection(this.props.guardianFormsValid);
    let declarationValid = checkValidityForm(this.props.declarationFormValid);

    return ( this.props.submitStatus===actionTypes.SUBMIT_INVALID_FAIL ) && ( !guestValid || !studentsValid || !guardiansValid || !declarationValid );
  }

  render() {
    const drawerContents = (
      <Menu
        theme="dark"
        // style={{ height: '100vh', marginTop: 0 }}
        style={{ height: '100%', marginTop: 0 }}
        defaultSelectedKeys={["guest-details"]}
        selectedKeys={this.state.selectedMenuItem}
        onClick={(e) => this.setState({ prevMenuItem: this.state.selectedMenuItem, selectedMenuItem: e.key, visible: false })}
      >
        {/* <Menu.Item key="home" icon={<RainbowIcon />}>
      <a href="http://127.0.0.1:8000/home/"> Rainbow</a>
    </Menu.Item> */}

        {/* <Menu.Divider /> */}

        <Menu.Item
          key="guest-details"
          icon={<ProfileOutlined />}
          style={menuItemStyle}
        >
          <span>Guest Account  </span>
          { ( this.props.submitStatus===actionTypes.SUBMIT_INVALID_FAIL && !checkValidityForm(this.props.guestFormValid) ) ?
          <ExclamationCircleOutlined style={{ color: '#f5222d', fontSize: '1em' }} /> : null }
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          key="students"
          icon={<UserAddOutlined />}
          style={menuItemStyle} 
        >
          <span>Students  </span> 
          { ( this.props.submitStatus===actionTypes.SUBMIT_INVALID_FAIL && !checkValiditySection(this.props.studentFormsValid) ) ?
          <ExclamationCircleOutlined style={{ color: '#f5222d', fontSize: '1em' }} /> : null }
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          key="guardians"
          icon={<TeamOutlined />}
          style={menuItemStyle}
        >
          <span>Guardians  </span>
          { ( this.props.submitStatus===actionTypes.SUBMIT_INVALID_FAIL && !checkValiditySection(this.props.guardianFormsValid) ) ?
          <ExclamationCircleOutlined style={{ color: '#f5222d', fontSize: '1em' }} /> : null }
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          key="declaration"
          icon={<WalletOutlined />}
          style={menuItemStyle}
        >
          <span>Declaration  </span>
          { ( this.props.submitStatus===actionTypes.SUBMIT_INVALID_FAIL && !checkValidityForm(this.props.declarationFormValid) ) ?
          <ExclamationCircleOutlined style={{ color: '#f5222d', fontSize: '1em' }} /> : null }
        </Menu.Item>

        <Menu.Divider />

      </Menu>)
    
    return (
      <Layout 
        style={{ minHeight: '100vh', maxWidth: '100vw', boxSizing:'border-box' }}
      >
        <Spin spinning={this.props.loading} indicator={LoadingIcon} style={{position: "fixed"}}>
        <Drawer
          title={
            <a href="http://127.0.0.1:8000/home/" 
              style={{ display: "flex", flexFlow: "column", justifyContent:"center", alignItems: "center", }}
            ><RainbowIcon style={{ backgroundColor:"inherit", fontSize:"inherit"}} /> Rainbow School</a>
          }
          placement="left" 
          closable={true} 
          closeIcon={<CloseOutlined style={{fontSize: '1.2em', color: 'white'}} />} 
          destroyOnClose={true} 
          onClose={this.onClose} 
          visible={this.state.visible} 
          getContainer={false} 
          // drawerStyle={{ height:'100%', }}
          headerStyle={{backgroundColor: '#111d2c', }} 
          bodyStyle={{padding: '0'}}
          drawerStyle={{border: '2px solid white', backgroundColor: '#001529'}}  // Have to specify the dark-mode bg color b/c it's white on mobile
        >
          { drawerContents }
        </Drawer>

        <Layout key={"Layout" + this.state.selectedMenuItem}>
          <Header style={{ position: 'fixed', zIndex: 1, width: '100vw', paddingLeft: "3em", boxSizing:'border-box' }}>
            <Badge dot={ this.showBadge() }> 
              <Button type="primary" onClick={this.showDrawer} icon={<MenuOutlined style={{fontSize: "1.5em"}} />} style={{backgroundColor: 'inherit', borderColor: "white"}}>
              </Button>
            </Badge>
            {/* <MenuOutlined onClick={this.showDrawer} /> */}
          </Header>
          
          <Content key={"Content" + this.state.selectedMenuItem} style={{ margin: '0 0', maxWidth: '100vw', }}>
            <div style={{ padding: '1.8em', minHeight: '100vh' }}>

              <Form.Provider>
                {this.componentSwitch(this.state.selectedMenuItem)}
              </Form.Provider>

              { this.controlSwitch(this.state.selectedMenuItem) }

            </div>

          </Content>

          <Footer style={{ textAlign: 'center' }}>Rainbow Edu ©2020 | By kbd</Footer>
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
    handleSubmit: (guestForm, studentForms, guardianForms, declarationForm, images) => dispatch(formActions.handleSubmit(guestForm, studentForms, guardianForms, declarationForm, images)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GuestLayout));
