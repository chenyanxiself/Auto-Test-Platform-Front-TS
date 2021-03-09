interface RoleInfo {
  id: number;
  name: string;
  menuList: number[];
}

interface MenuInfo {
  id: number;
  name: string;
  menuPath: string;
  menuReg: string;
  parentId: number;
  icon: string;
}

interface UserInfo {
  id: number;
  name: string;
  cname: string;
  password: string;
  email: string;
  phone: string;
  roleList: number[];
}
