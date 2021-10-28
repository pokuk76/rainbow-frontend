import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Spin, Breadcrumb } from 'antd';
import { Link, withRouter } from'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

import Guest from '../components/Guest';

const LoadingIcon = <LoadingOutlined style={{ fontSize: '6em' }} spin />;

class GuestList extends React.Component {

    componentDidMount() {
        axios.get('api/formsets/')
        .then(res => {
            //console.log(this.props);
            console.log("Formsets from API: ", res.data);
        })
        .catch(error => {
            console.log("Error getting formsets: ", error);
        })
    }

    render() {
        return (
            <div>
                {/* <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to='/portal'>Portal</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>Admin</Breadcrumb.Item>
                            <Breadcrumb.Item>Login</Breadcrumb.Item>
                </Breadcrumb> */}
                {console.log(this.props.isAuthenticated)}
                {
                        this.props.loading
                            ?
                            <Spin indicator={LoadingIcon} />
                            :
                            <div style={{boxSizing: 'border-box', }}>
                        <Guest data={this.props.guests} isAuthenticated={this.props.isAuthenticated} />
                        {/* <br />
                        <h2>Create new guest</h2>
                        <CustomForm
                            requestType='POST'
                            guestID={null}
                            btnText="Create" /> */}
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        loading: state.auth.loading,
        guests: state.auth.guests
    }
}

export default withRouter(connect(mapStateToProps, null)(GuestList));