import {Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {Button} from 'antd';
import {useState} from 'react';

interface DataType {
    num: string;
    name: string;
    description: string;
    completed: boolean;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Id',
        dataIndex: 'num',
        key: 'num',
        render: (text) => (
            <a>{text}</a>
        ),
    },
    {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'description',
        dataIndex: 'description',
        key: 'description',
    }, {
        title: 'completed',
        dataIndex: 'completed',
        key: 'completed',
        render: (completed) => (
            <Space size="large">
                {completed ? "✅" : "❌"}
            </Space>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: () => (
            <Space size="middle">
                <Button type="primary" shape="circle" onClick={() => {
                }}>
                    X
                </Button>
                <Button type="primary" shape="circle" onClick={() => {

                }}>
                    ✓
                </Button>
                <Button type="primary" shape="round" onClick={() => {
                    // setData(prevData => {
                    //         return prevData.Map(
                    //             if(item.num===num){
                    //                 return {...item,completed:true};
                    //             }
                    //             return item;
                    //         )
                    //     }
                    // )
                }}>
                    Change
                </Button>
            </Space>
        ),
    },
];

const [data, setData] = useState<DataType[]>([
    {
        "num": "1",
        "name": "完成作业",
        "description": "完成数学和英语作业",
        "completed": false
    },
    {
        "num": "2",
        "name": "去超市购物",
        "description": "购买牛奶、面包和水果",
        "completed": true
    },
    {
        "num": "3",
        "name": "锻炼身体",
        "description": "跑步30分钟，做仰卧起坐20个",
        "completed": false
    },
]);

const List = () => (
    <>
        <Table<DataType> columns={columns} dataSource={data}/>
    </>
);

export default List;