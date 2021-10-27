import React from 'react';
import { List, Space, Modal, Button } from 'antd';

import { CheckCircleTwoTone, ExclamationCircleTwoTone } from '@ant-design/icons';

const IconText = ({ icon, text }) => (
    <Space>
        {icon}
        {text}
    </Space>
);

const pageSize = 10;

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

        // Needed for List renderItem prop
        const finalListItem = this.props.data[this.props.data.length-1];
        console.log("item", finalListItem);

        return (
            <>
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
                    dataSource={this.props.data}
                    renderItem={(item, index, array) => (
                        <List.Item
                            key={item.guest.username}
                            style={
                                (index === 0) 
                                ? {borderTop: '1px outset #f0f2f5', marginTop: '2em'} 
                                : ( ((index+1)%pageSize === 0 || item.guest.id==finalListItem.guest.id) ? {marginBottom: '2em'} : null )
                            }
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
                                title={<a href={`/portals/admin/${item.guest.id}`}>{`${item.guest.first_name} ${item.guest.last_name}`}</a>}
                                description={`Username: ${item.guest.username}`}
                            />
                            {console.log(item.guest.username)}

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