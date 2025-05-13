import { get } from '@/services/axios.service';
import { userAtom } from '@/states/user.state';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
    description: string;
  }
  
  const columns: ColumnsType<any> = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Vai trò', dataIndex: 'role', key: 'role' },
  ];
  
  const data: DataType[] = [
    {
      key: 1,
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    },
    {
      key: 2,
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
    },
    {
      key: 3,
      name: 'Not Expandable',
      age: 29,
      address: 'Jiangsu No. 1 Lake Park',
      description: 'This not expandable',
    },
    {
      key: 4,
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
    },
  ];

  const getRole=(role:string)=>{if(role==='MEMBER'){return 'Member'}else{
    console.log(role,'role');
    return 'Admin';
  }}
export const TableLayout = () => {
 const { boardId, workspaceId } = useParams();
 const [data, setData] = useState<any>();

  const DoGetAvatars = async () => {
    const res = await get(`/workspaces/getMembers?workspaceId=${workspaceId}`);
    setData(res);
    return res;
  };
  useEffect(() => {
    DoGetAvatars();
  }, [workspaceId]);
  const datatable=[data?.map((data:any)=>{return{key:data?.user._id,name:data?.user?.name,email:data?.user?.email,role:getRole(data?.roles[0])}})]
  console.log(datatable,'dahdas');
console.log(data,'dasdad');
    return <>
    <div className='py-6 text-3xl font-semibold px-9'>Danh sách nhân sự</div>
  <Table
    columns={columns}
    className="custom-table"
    dataSource={datatable[0]}
  />
    </>
        
}