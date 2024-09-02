import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Header from "./components/Header";
import EditArea from "./components/EditArea";
import Setting from "./components/Setting";
import { LeftWrapper } from "./components/LeftWrapper";
import { useComponentsStore } from "./stores/components";
import Preview from "./components/Preview";
import LeftMenu from "./components/LeftMenu";
import { useState } from "react";

export default function Editor() {
  const { mode } = useComponentsStore();
  const [showArea, setShowArea] = useState(["1", "2", "3"]);
  const menuClick = (key: string) => {
    if (key === "2") return;
    if (showArea.includes(key)) {
      setShowArea(showArea.filter((i) => i !== key));
    } else {
      setShowArea(showArea.concat(key));
    }
  };
  return (
    <div className="h-[100vh] flex flex-col">
      <Header />
      {mode === "edit" ? (
        <Allotment>
          <Allotment.Pane preferredSize={50} maxSize={50} minSize={50}>
            <LeftMenu showKeys={showArea} menuClick={menuClick} />
          </Allotment.Pane>
          <Allotment.Pane
            preferredSize={250}
            maxSize={500}
            minSize={200}
            visible={showArea.includes("1")}
          >
            <LeftWrapper />
          </Allotment.Pane>
          <Allotment.Pane>
            <EditArea />
          </Allotment.Pane>
          <Allotment.Pane
            preferredSize={300}
            maxSize={500}
            minSize={200}
            visible={showArea.includes("3")}
          >
            <Setting />
          </Allotment.Pane>
        </Allotment>
      ) : (
        <Preview />
      )}
    </div>
  );
}
