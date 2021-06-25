import React from 'react';
import { List, Avatar, Space } from 'antd';

import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const School = (props) => {
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
            dataSource={props.data}
            renderItem={item => (
                <List.Item
                    key={item.official_name}
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
                        avatar={<Avatar src={item.logo} />}
                        title={<a href={`/${item.id}`}>{item.official_name}</a>}
                        description={item.location}
                    />
                    Official Name: {item.official_name}
                    <br/>
                    Succint Name: {item.succint_name}
                    <br/>
                    Telephone: {item.phone_number}
                    <br/>
                    Logo: {item.logo}
                    <br/>
                    Location: {item.location}
                    <br/>
                    Motto: {item.motto}
                    
                </List.Item>
            )}
        />
    );
}

export default School;