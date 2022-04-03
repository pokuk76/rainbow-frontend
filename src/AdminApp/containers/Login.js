import React from 'react';
import { connect } from 'react-redux'
import { Link, withRouter } from'react-router-dom';

import { Layout, Form, Input, Button, Checkbox, Spin, Breadcrumb, Menu } from 'antd';
import { LoginOutlined, LoadingOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

import Sider from '../components/Sider';
import * as actions from '../../store/actions/auth';

import classes from './styles/Login.module.scss';

const { Header, Content, Footer } = Layout;

let headerHeight = '64px';
let siderWidth = '80px';

let styles = {
    MenuItem: {
        display: "flex", flexFlow: "column", alignItems: 'center', 
        justifyContent: 'flex-start', height: 'auto', 
        padding: '0.5em', boxSizing: 'border-box',
        margin: 0,
    },
    icon: {
        margin: '0',
        fontSize: '1.5em',
        position: 'relative',
    },
    anchor: { fontSize: 12, margin: 0, }
};

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};


const LoadingIcon = <LoadingOutlined style={{ fontSize: '6em' }} spin />;

class LoginForm extends React.Component {

    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // console.log("Location: ", this.props.location.state)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        // this.props.onAuth(fields.username, fields.password);
        // console.log(this.props);
        let credentials = this.formRef.current.getFieldsValue(['username', 'password']);
        this.props.onAuth(credentials.username, credentials.password, () => {
            console.log("Callback");
            if (this.props.error) {
                this.onFinishFailed(this.props.error.message);
            } else {
                this.onFinish(credentials);
            }
        });
    }

    onFinish = (values) => {
        // console.log('Success:', values);
        if (this.props.location.state) {
            this.props.history.push(this.props.location.state.referrer);
        } else {
            this.props.history.push('/admin');
        }
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    handleRedirected = () => {
        try {
            if (this.props.location.state.referrer) {
                return <h1 style={{marginBottom:"1em"}}>Please sign in to access this page</h1>
            }
        } catch { }
        return <h1 style={{marginBottom:"1em"}}>Please sign in to continue</h1>;
    }
    
    render() {

        let errorMessage = null;
        if (this.props.error) {
            try {
                if(this.props.error.response.request.status === 400){
                    errorMessage = (
                        <p className="error-message" style={{ fontSize: 16, color: 'red' }} >Invalid username or password</p>
                    );
                } else {
                    errorMessage = (
                        <p className="error-message">{this.props.error.message}</p>
                    );
                }
            } catch (error) {
                errorMessage = (
                    <p className="error-message">{this.props.error.message}</p>
                );
            }
        }
    
        return (
            <Layout style={{minHeight:"100vh", maxWidth: '100vw', boxSizing: 'border-box'}}>

                <Sider
                    width={siderWidth}
                    // className={classes.Sider}
                    // theme="dark"
                >
                    <Menu theme="dark" mode="vertical" defaultSelectedKeys={[2]}>

                        <Menu.Item
                            key="2"
                            icon={<LoginOutlined style={styles.icon} />}
                            style={styles.MenuItem}
                        >
                            <Link to="/login" style={styles.anchor}>Login</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Layout style={{marginLeft: siderWidth}}>

                    <Content style={{ padding: '0 50px', marginTop: headerHeight }}>

                        <Breadcrumb style={{ margin: '0 0 16px 0' }}>
                            <Breadcrumb.Item><Link to='/portal'>Portal</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>Admin</Breadcrumb.Item>
                            <Breadcrumb.Item>Login</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-content">
                            {errorMessage}
                            {
                                this.props.loading
                                    ?
                                    <Spin indicator={LoadingIcon} />
                                    :
                                    <>
                                        {this.handleRedirected()}
                                        <Form
                                            {...layout}
                                            name="normal_login"
                                            // className="login-form" 
                                            initialValues={{ remember: false }}
                                            ref={this.formRef}
                                            onFinishFailed={(errorInfo) => this.onFinishFailed(errorInfo)}
                                            style={{
                                                // boxSizing: 'border-box', paddingLeft: '4em',
                                                width: '80%'
                                            }}
                                        // className={classes['ant-form-item']}
                                        >
                                            <Form.Item
                                                name="username"
                                                rules={[{ required: true, message: 'Please input your Username!' }]}
                                            >
                                                <Input
                                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                                    placeholder="Username"
                                                    className={classes.LoginInput} />
                                            </Form.Item>
                                            <Form.Item
                                                name="password"
                                                rules={[{ required: true, message: 'Please input your Password!' }]}
                                            >
                                                <Input.Password
                                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                                    type="password"
                                                    placeholder="Password"
                                                />
                                            </Form.Item>
                                            <Form.Item>
                                                <Form.Item {...tailLayout} name="remember" valuePropName="checked" noStyle>
                                                    <Checkbox>Remember me</Checkbox>
                                                </Form.Item>

                                                <a className="login-form-forgot" href="#">
                                                    <br />Forgot password
                                                </a>
                                            </Form.Item>

                                            <Form.Item>
                                                <Button type="primary" htmlType="submit" className="login-form-button" onClick={(e) => this.handleSubmit(e)}>
                                                    Log in
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </>

                            }
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Rainbow Edu ©2021 | By kbd</Footer>
                </Layout>

                {/* <Breadcrumb style={{ margin: '0 0 16px 0' }}>
                    <Breadcrumb.Item><Link to='/portal'>Portal</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>Admin</Breadcrumb.Item>
                            <Breadcrumb.Item>Login</Breadcrumb.Item>
                </Breadcrumb> */}
                {/* { this.handleRedirected() } */}
            </Layout>
        );
    }
  
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password, callback) => dispatch(actions.authLogin(username, password, callback))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm));
