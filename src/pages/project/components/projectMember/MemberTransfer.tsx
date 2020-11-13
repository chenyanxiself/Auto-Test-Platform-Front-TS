import React, { useEffect, useState, useImperativeHandle } from 'react';
import { message, Transfer } from 'antd';
import { getAllUser } from '@/pages/project/service';

interface Users {
  id: number
  cname: string
  disabled: boolean
  briefName?: string
}

interface MemberTransferProps {
  selectedMember: Users[]

  [props: string]: any

}

const MemberTransfer: React.FC<MemberTransferProps> = (props) => {
  const { selectedMember, cref } = props;
  const [userData, setUserData] = useState<Users[]>([]);
  const [targetKeys, setTargetKeys] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let res = await getAllUser();
    if (res.status === 1) {
      let ownerId;
      const selectedKeys = selectedMember.map(item => {
        if (item.disabled) {
          ownerId = item.id;
        }
        return item.id;
      });
      let userList = res.data.userList.map(item => {
        item.disabled = item.id === ownerId;
        return item;
      });
      setUserData(userList);
      setTargetKeys(selectedKeys);
    } else {
      message.warning(res.error);
    }
  };
  const filterOption = (inputValue, option) => option.cname.indexOf(inputValue) > -1;

  const handleChange = (targetKeys) => {
    setTargetKeys(targetKeys);
  };
  useImperativeHandle(cref, ()=>({
    getValue:() => {
      return userData.filter(item => targetKeys.includes(item.id)).map(item => {
        item.briefName = item.cname.substring(item.cname.length - 2, item.cname.length);
        return item;})
    }
  }));


  return (
    <Transfer
      // @ts-ignore
      dataSource={userData}
      showSearch
      filterOption={filterOption}
      targetKeys={targetKeys}
      onChange={handleChange}
      render={item => item.cname}
      titles={['用户列表', '已选用户']}
      operations={['添加', '删除']}
      rowKey={item => item.id}
    />
  );
};

export default MemberTransfer;
