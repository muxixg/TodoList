import List from "./components/List.tsx";
import Header from "./components/Header.tsx";
import type {DataType} from "./global/todolistDatatype.ts";
import axios from 'axios';
import {useState, useEffect} from "react";
import {BaseApi} from "./global/todolistDatatype.ts";

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

export default function App() {
    //数据定义与初始化
    const [data, setData] = useState<DataType[]>([]);
    const fetchData = async () => {
        const result = await GetTodolist();
        setData(result);
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>

            <div className="mx-auto w-3/4 bg-amber-200">
                <div className="px-4">
                    <Header reload={fetchData}/>
                    <List data={data} reload={fetchData}/>
                </div>

            </div>
        </>
    );
}
