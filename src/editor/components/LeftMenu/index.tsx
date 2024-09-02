import { DesktopOutlined, PieChartOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

interface IMenuProps {
  showKeys: string[];
  menuClick: (key: string) => void;
}

const items: MenuItem[] = [
  { key: "1", icon: <PieChartOutlined />, label: "物料" },
  { key: "2", icon: <DesktopOutlined />, label: "画布" },
  { key: "3", icon: <SettingOutlined />, label: "设置" },
];

const LeftMenu = ({ showKeys, menuClick }: IMenuProps) => {
  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    menuClick(key);
  };
  return (
    <Menu
      className="w-[51px] h-[100%]"
      selectedKeys={showKeys}
      mode="inline"
      inlineCollapsed={true}
      items={items}
      multiple={true}
      onClick={onMenuClick}
    />
  );
};

export default LeftMenu;
