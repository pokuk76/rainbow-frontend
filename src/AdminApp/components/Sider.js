import React from 'react';

import { Layout, Avatar, Menu } from 'antd';
import { LoadingOutlined, UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { Link, withRouter } from'react-router-dom';

import classes from './styles/Sider.module.scss';

const { Sider } = Layout;

let titleHeight = '64px';
let siderWidth = '80px';

class AdminSider extends React.Component {

    render() {
        return (
            <Sider 
                    width={this.props.width}
                    theme="dark"
                    className={`${classes.AdminSider} ${this.props.classNames}`}
                    style={{...this.props.style}}
                >
                    <div 
                        className={classes.titleContainer}
                        style={{ 
                            backgroundColor: 'transparent', height: this.props.titleHeight || titleHeight, width: this.props.width || siderWidth,
                        }}
                    >
                        <Avatar 
                            size="medium" 
                            icon={<UserOutlined />} 
                            style={{background: 'none', border: '1px solid grey', }} 
                        />
                        {/* <p style={{overflowX: 'ellipsis', backgroundColor: 'pink', marginBottom: 0, }}>
                        { localStorage.getItem('username') }
                        </p> */}
                    </div>
                    {this.props.children}
                </Sider>
        );
    }

};

export default AdminSider;