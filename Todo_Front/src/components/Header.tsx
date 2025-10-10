import {Button, Modal, Form, Input,message } from 'antd';
import {useState} from "react";
import {BaseApi, type DataType} from "../global/todolistDatatype.ts";
import axios from 'axios'

//Add
function AddTodolist(dat: DataType) {
    return axios
        .post(BaseApi + '/add', dat)
        .catch(err => {
            console.log(err)
        })
}

const Header = ({reload}: { reload: () => void }) => {
    //弹窗的方法：
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();


    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleAdd = async () => {
        setLoading(true);
        try {
            const values = form.getFieldsValue();
            // console.log(values.name,values.description)
            const x: DataType = {
                id: "",
                user: "TestUser",
                name: values.name.toString(),
                description: values.description.toString(),
                completed: false,

            }
            // console.log(x)
            await AddTodolist(x)
            await reload();
            setLoading(false);
            setOpen(false);
        } catch (err) {
            setLoading(false);
            setOpen(false);
            message.info('添加失败：'+err);
            console.log('添加失败：', err)
        }
    }
    //表单方法：

    type FieldType = {
        name?: string;
        description?: string;
    };

    //添加：
    return (
        <>
            <div className="bg-amber-300 h-15 mx-auto translate-y-4 rounded-2xl flex justify-center items-center">
                <span className="text-4xl text-blue-500">TODOLIST</span>
                <Button type="primary" size="large" style={{fontSize: '20px'}} className="ml-[10rem]"
                        onClick={showModal}>
                    +
                </Button>
                <Modal
                    open={open}
                    title="添加TODO任务"
                    onOk={handleAdd}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={handleAdd}>
                            添加
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
                            initialValues={{remember: true}}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                label="Todoname"
                                name="name"
                                rules={[{required: true, message: 'Please input your Todo_name!'}]}
                            >
                                <Input/>
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
            <br/>
        </>
    );
};

export default Header;