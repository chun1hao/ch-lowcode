import { Button, Space } from "antd";
import { useComponentsStore } from "../../stores/components";

export default function Header() {
  const { mode, setMode, setCurComponentId } = useComponentsStore();

  const handlePreview = () => {
    setMode("preview");
    setCurComponentId(null);
  };

  const handelExit = () => {
    setMode("edit");
  };
  return (
    <div className="h-[60px] flex-shrink-0 border-b-[1.5px] border-[#e5e7eb]">
      <div className="h-[100%] flex justify-between items-center px-[20px]">
        <div>低代码</div>
        <Space>
          {mode === "edit" && (
            <Button onClick={handlePreview} type="primary">
              预览
            </Button>
          )}
          {mode === "preview" && (
            <Button onClick={handelExit} type="primary">
              退出预览
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
}
