import React from 'react';
import Guest from '../components/Guest';
import CustomForm from '../components/Form';

import { connect } from 'react-redux';
import { Button, Spin } from 'antd';
import { Link } from'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class GuestList extends React.Component {

    // state = {
    //     guests: []
    // }

    // componentDidMount() {
    //     axios.get('http://127.0.0.1:8000/api/guests/')
    //     .then(res => {
    //         console.log(this.props);
    //         if (this.props.isAuthencticated){
    //             this.setState({
    //                 guests: res.data['results']
    //             });
    //         }
    //         //console.log(res.data['results']);
    //     });
    // }

    // output;

    // componentDidUpdate() {
    //     this.output = this.props.isAuthenticated ?
    //     <div>
    //         <Guest data={this.props.guests} />
    //         <br />
    //         <h2>Create new guest</h2>
    //         <CustomForm
    //             requestType='POST'
    //             guestID={null}
    //             btnText="Create" />
    //     </div>
    //     :
    //     (
    //         this.props.loading
    //             ?
    //             <Spin indicator={antIcon} />
    //             :
    //             <div>
    //                 <Button type="primary" style={{ margin: 'auto' }}>
    //                     <Link to="/login">Login to view this page</Link>
    //                 </Button>
    //             </div>
    //     );
    // }

    render() {
        return (
            <div>
                {console.log(this.props.isAuthenticated)}
                {
                    localStorage.getItem('isAuthenticated') ?
                    <div>
                        <Guest data={this.props.guests} />
                        <br />
                        <h2>Create new guest</h2>
                        <CustomForm
                            requestType='POST'
                            guestID={null}
                            btnText="Create" />
                    </div>
                    :
                    (
                        this.props.loading
                            ?
                            <Spin indicator={antIcon} />
                            :
                            <div>
                                <Button type="primary" style={{ margin: 'auto' }}>
                                    <Link to="/login">Login to view this page</Link>
                                </Button>
                            </div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log("Guest list state: ");
    console.log(state);
    return {
      isAuthenticated: state.auth.token !== null,
      loading: state.auth.loading,
      guests: state.auth.guests
    }
}

export default connect(mapStateToProps, null)(GuestList);