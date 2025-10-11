import {Space, Table, Button, Modal, Form, Input, message} from 'antd';
import type {TableProps} from 'antd';
import axios from 'axios';
import {type DataType, BaseApi} from "../global/todolistDatatype"
import {useState} from "react";

//一般方法
function DeleteTodolist(id: string) {
    return axios
        .post(BaseApi + '/move', {id})
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


const List = ({data, reload}: {
                  data: DataType[],
                  reload: () => void
              }
) => {
    //方法定义
    //弹窗的方法：
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [recordnow, setRecordnow] = useState<DataType>({
        id: "",
        user: "TestUser",
        name: "",
        description: "",
        completed: false,
    });


    const showModal = (record: DataType) => {
        setOpen(true);
        setRecordnow( record)
        form.setFieldsValue({
            name: record.name,
            description: record.description,
        });
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleChange = async () => {
        setLoading(true);
        try {
            const values = form.getFieldsValue();
            // console.log(values.name,values.description)
            // console.log(recordnow)
            const x: DataType = {
                id: recordnow.id,
                user: "TestUser",
                name: values.name===undefined?recordnow.name:values.name.toString(),
                description: values.description===undefined?recordnow.name:values.description.toString(),
                completed: recordnow.completed,
            }
            // console.log(x)
            await UpdateTodolist(x)
            await reload();
            setLoading(false);
            setOpen(false);
        } catch (err) {
            setLoading(false);
            setOpen(false);
            message.info('添加失败：' + err);
            console.log('添加失败：', err)
        }
    }
    const handleUpdate = async (x: DataType) => {
        try {
            await UpdateTodolist(x)
            await reload();
        } catch (err) {
            console.log('更新失败：', err)
        }
    }
    const handleDelete = async (x: DataType) => {
        try {
            await DeleteTodolist(x.id)
            await reload();
        } catch (err) {
            console.log('更新失败：', err)
        }
    }

    //表单
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Index',
            key: 'index',
            render: (_, _record, index) => {
                return index + 1;
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
                        showModal(record)
                    }}>
                        Change
                    </Button>
                </Space>
            ),
        },
    ];

//表单方法：

    type FieldType = {
        name?: string;
        description?: string;
    };

    return (
        <>
            <Table<DataType> columns={columns} dataSource={data.map((item, index) => ({...item, key: index}))}
                             className="min-h-2/3 mx-auto "/>
            <div>
                <Modal
                    open={open}
                    title="修改TODO任务"
                    onOk={handleChange}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={handleChange}>
                            修改
                        </Button>,
                    ]}
                >
                    <div>
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 16}}
                            style={{maxWidth: 600}}
                            initialValues={{remember: false}}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                label="Todoname"
                                name="name"
                                rules={[{required: false, message: 'Please input your Todo_name!'}]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="description"
                                name="description"
                                rules={[{required: false, message: 'Please input your description'}]}
                            >
                                <Input/>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            </div>
        </>
    )
}
export default List;