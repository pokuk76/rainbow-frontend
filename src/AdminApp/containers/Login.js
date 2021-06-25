import React from 'react';

import { Form, Input, Button, Checkbox, Spin } from 'antd';
import { LoadingOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'

import * as actions from '../../store/actions/auth';


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


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class LoginForm extends React.Component {

    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        console.log("Location: ", this.props.location.state)
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
            this.props.history.push('/portal/admin');
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
            <div>
                { this.handleRedirected() }
                { errorMessage }
                {
                    this.props.loading
                    ? 
                    <Spin indicator={antIcon} />
                    :
                    <Form
                        {...layout}
                        name="normal_login" 
                        className="login-form" 
                        initialValues={{ remember: true }}
                        ref={this.formRef} 
                        onFinishFailed={(errorInfo) => this.onFinishFailed(errorInfo)}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
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
                            <Button type="primary" htmlType="submit" className="login-form-button" onClick={ (e) => this.handleSubmit(e) }>
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                }
            </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
