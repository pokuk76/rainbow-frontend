import React from 'react';
import { List, Avatar, Space, Modal, Button } from 'antd';

import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

class Guest extends React.Component {

    state = {
        loading: false,
        visible: false,
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

            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: 3,
                }}
                dataSource={this.props.data}
                renderItem={item => (
                    <div onClick={() => this.showModal}>
                        <List.Item
                            key={item.username}
                            actions={[
                                <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                            ]}
                            extra={
                                <img
                                    width={272}
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                />
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.image_file} />}
                                title={<a href={`${item.id}`}>{item.username}</a>}
                                description={"Submitted: " + item.created}
                            />
                            {/* {console.log("Image file: ", item.image_file)} */}

                        </List.Item>
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
                            <p>{item.image_file}</p>
                        </Modal>
                    </div>
                )}

            />
        );
    }
}

export default Guest;