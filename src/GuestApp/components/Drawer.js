import React from 'react';
import { Menu } from 'antd';
import {
    ProfileOutlined, UserAddOutlined, TeamOutlined, 
    WalletOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';

import { RainbowLogoIcon } from '../../shared_components/Icons';

import * as actionTypes from '../../store/actions/actionTypes';

import { checkValiditySection, checkValidityForm } from '../../utility/form/methods';

export const DrawerTitle = (props) => {
    return (
        <a
            href={process.env.REACT_APP_HOMEPAGE_URL}
            style={{ display: "flex", flexFlow: "column", justifyContent: "center", alignItems: "center", }}
        >
            <RainbowLogoIcon style={{ backgroundColor: "inherit", fontSize: "inherit" }} />
        </a>
    );
};

const menuItemStyle = { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, height: "10%", fontSize: "1.2em", display: "flex", alignItems: "center", paddingLeft: "3em" }

export const DrawerContents = (props) => {
    return (
        <Menu
                theme="dark"
                style={{ height: '100%', marginTop: 0 }}
                defaultSelectedKeys={["guest-info"]}
                selectedKeys={props.selectedMenuItem}
                onClick={(e) => props.setCurrentView(e)}
            >
                <Menu.Item
                    key="guest-info"
                    icon={<ProfileOutlined />}
                    style={menuItemStyle}
                >
                    {(props.submitStatus === actionTypes.SUBMIT_INVALID_FAIL && !checkValidityForm(props.guestFormValid)) ?
                        <ExclamationCircleOutlined style={{ color: '#f5222d', fontSize: '1em' }} /> : null}

                    <span>Guest Account  </span>
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                    key="students"
                    icon={<UserAddOutlined />}
                    style={menuItemStyle}
                >
                    {(props.submitStatus === actionTypes.SUBMIT_INVALID_FAIL && !checkValiditySection(props.studentFormsValid)) ?
                        <ExclamationCircleOutlined style={{ color: '#f5222d', fontSize: '1em' }} /> : null}

                    <span>Students  </span>
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                    key="guardians"
                    icon={<TeamOutlined />}
                    style={menuItemStyle}
                >
                    {(props.submitStatus === actionTypes.SUBMIT_INVALID_FAIL && !checkValiditySection(props.guardianFormsValid)) ?
                        <ExclamationCircleOutlined style={{ color: '#f5222d', fontSize: '1em' }} /> : null}

                    <span>Guardians  </span>
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                    key="declaration"
                    icon={<WalletOutlined />}
                    style={menuItemStyle}
                >
                    {(props.submitStatus === actionTypes.SUBMIT_INVALID_FAIL && !checkValidityForm(props.declarationFormValid)) ?
                        <ExclamationCircleOutlined style={{ color: '#f5222d', fontSize: '1em' }} /> : null}

                    <span>Declaration  </span>
                </Menu.Item>

                <Menu.Divider />

            </Menu>
    );
};