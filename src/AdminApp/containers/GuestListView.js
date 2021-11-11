import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Spin, Breadcrumb } from 'antd';
import { Link, withRouter } from'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

import Guest from '../components/Guest';

const LoadingIcon = <LoadingOutlined style={{ fontSize: '6em' }} spin />;

class GuestList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            guests: [],
        };
    }

    componentDidMount() {
        // let config = {
        //     method: 'get',
        //     // url: `api/guests/`,
        //     url: `api/formsets/`,
        //     headers: {
        //         'Authorization': `Token ${localStorage.getItem('token')}`
        //     },
        // };

        // axios(config)
        // .then(res => {
        //     // console.log(this.props);
        //     console.log("Guests from API: ", res.data);
        //     this.setState({loading: false, guests: res.data['formsets']});
        // })
        // .catch(error => {
        //     console.log("Error", error);
        // })

        // this.setState({loading: false});
    }

    render() {
        return (
            <div style={{ boxSizing: 'border-box', }}>
                <Guest data={this.props.guests} />
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        // loading: state.auth.loading,
        // guests: state.auth.guests
    }
}

export default withRouter(connect(mapStateToProps, null)(GuestList));