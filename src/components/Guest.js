import React from 'react';
import { List, Avatar, Space, Modal, Button } from 'antd';

import { CheckCircleTwoTone, ExclamationCircleTwoTone } from '@ant-design/icons';

const IconText = ({ icon, text }) => (
    <Space>
        {icon}
        {text}
    </Space>
);

class Guest extends React.Component {

    state = {
        loading: false,
        visible: false, 
        image: null, 
    };

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

        return (
            <>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 10,
                    }}
                    dataSource={this.props.data}
                    renderItem={item => (
                        <List.Item
                            key={item.guest.username}
                            // onClick={() => this.showModal}
                            onClick={() => console.log("List Item Clicked")}
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
                                title={<a href={`/portal/admin/${item.guest.id}`}>{`${item.guest.first_name} ${item.guest.last_name}`}</a>}
                                description={`Username: ${item.guest.username}`}
                            />
                            {/* {console.log("Image file: ", item.image_file)} */}

                        </List.Item>
                    )}
                />
                <Modal
                    visible={this.visible}
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
            </>
        );
    }
}

export default Guest;