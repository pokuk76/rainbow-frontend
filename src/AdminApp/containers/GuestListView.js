import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
// import { Button, Spin, Breadcrumb } from 'antd';
import { Link, withRouter } from'react-router-dom';
// import { LoadingOutlined } from '@ant-design/icons';

import { List, Space, Modal, Button, Spin } from 'antd';

import { CheckCircleTwoTone, ExclamationCircleTwoTone, LoadingOutlined } from '@ant-design/icons';


import Guest from '../components/Guest';

const LoadingIcon = <LoadingOutlined style={{ fontSize: '6em' }} spin />;

const IconText = ({ icon, text }) => (
    <Space>
        {icon}
        {text}
    </Space>
);

const pageSize = 10;

class GuestList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            guests: null,
            visible: false, 
            image: null, 
        };
    }

    componentDidMount() {
        console.log("GuestListView mount");
        // Calling setState here is what is causing double render (I believe)
        if (!this.props.guests) {
            let config = {
                method: 'get',
                url: `api/formsets/`,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
            };
    
            axios(config)
            .then(res => {
                this.setState({loading: false, guests: res.data['formsets']});
            })
            .catch(error => {
                console.log("Error", error);
                this.setState({loading: false});
            })
        } else {
            this.setState({loading: false, guests: this.props.guests});
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {

        // Needed for List renderItem prop
        const finalListItem = this.state.guests ? this.state.guests[this.state.guests.length-1] : 0;

        return (
            this.state.loading || !this.state.guests
            ? <Spin indicator={LoadingIcon} />
            : <div style={{ boxSizing: 'border-box', }}>
                {/* <Guest data={this.state.guests} /> */}

                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                            window.scroll({
                                top: 0,
                                left: 0,
                            });
                        },
                        pageSize: pageSize,
                        position: 'both'
                    }}
                    dataSource={this.state.guests}
                    renderItem={(item, index) => (
                        <List.Item
                            key={item.guest.username}
                            
                            style={
                                // Handle styles for first item (outer ternary) and then last item per page (inner ternary)
                                // TODO: Figure out a better way to do this? Logic's not bad tbh
                                (index === 0) 
                                ? {borderTop: '1px outset #f0f2f5', marginTop: '2em'} 
                                : ( ((index+1)%pageSize === 0 || item.guest.id === finalListItem.guest.id) ? {marginBottom: '2em'} : null )
                            }
                            onClick={() => this.showModal()}
                            // onClick={() => console.log("List Item Clicked")}
                            actions={[
                                <IconText icon={ item.guest.processed ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <ExclamationCircleTwoTone twoToneColor="#ff0000" />} text="Processed" key="list-vertical-star-o" />,
                            ]} 
                            extra={
                                <img
                                    width={256} 
                                    height={200}
                                    alt="logo" 
                                    src={ item.guest.image_file ? item.guest.image_file : "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"} 
                                />
                            }
                        >
                            <List.Item.Meta
                                // avatar={<Avatar src={item.image_file} />}
                                title={<Link to={`/admin/${item.guest.id}`}>{`${item.guest.first_name} ${item.guest.last_name}`}</Link>}
                                description={`Username: ${item.guest.username}`}
                            />
                        </List.Item>
                    )}
                />
                <Modal
                    visible={this.state.visible}
                    title="Title"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Return
                        </Button>,
                        <Button key="submit" type="primary" loading={this.loading} onClick={this.handleOk}>
                            Submit
                        </Button>,
                    ]}
                >
                    <p>{this.state.image}</p>
                </Modal>
                
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