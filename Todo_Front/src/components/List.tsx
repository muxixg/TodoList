import {Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {Button} from 'antd';
import {useState, useEffect} from 'react';
import axios from 'axios';

interface DataType {
    id: string;
    user: string
    name: string;
    description: string;
    completed: boolean;
}

const BaseApi = 'http://localhost:8000'

function GetTodolist(): Promise<DataType[]> {
    return axios
        .get(BaseApi + '/get-all')
        .then(res => {
            console.log('成功获取list数据')
            // return res.data
            return res.data;
        })
        .catch(err => {
            console.log('请求失败：', err)
        })
}

function DeleteTodolist(id: string) {
    return axios
        .post(BaseApi + '/move', {id})
        .then(() => GetTodolist())
        .catch(err => {
            console.log(err)
        })
}

function UpdateTodolist(dat: DataType) {
    return axios
        .put(BaseApi + '/update', dat)
        .catch(err => {
            console.log(err)
        })
}

const List = () => {
    //数据定义与初始化
    const [data, setData] = useState<DataType[]>([]);
    const fetchData = async () => {
        const result = await GetTodolist();
        setData(result);
    };
    useEffect(() => {
        fetchData();
    }, []);
    //方法定义
    const handleUpdate = async (x: DataType) => {
        try {
            await UpdateTodolist(x)
            await fetchData();
        } catch (err) {
            console.log('更新失败：', err)
        }
    }
    const handleDelete = async (x: DataType) => {
        try {
            await DeleteTodolist(x.id)
            await fetchData();
        } catch (err) {
            console.log('更新失败：', err)
        }
    }
    //表单
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Index',
            key: 'index',
            render: (record) => {
                return record.index + 1
            }
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
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" shape="circle" onClick={() => {
                        handleDelete(record);
                    }}>
                        X
                    </Button>
                    <Button type="primary" shape="circle" onClick={() => {
                        // console.log(record.id)
                        handleUpdate({...record, completed: true})
                    }}>
                        ✓
                    </Button>
                    <Button type="primary" shape="round" onClick={() => {
                        handleUpdate({...record})
                    }}>
                        Change
                    </Button>
                </Space>
            ),
        },
    ];
    return (
        <>
            <Table<DataType> columns={columns} dataSource={data}/>
        </>
    )
}


export default List;