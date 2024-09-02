import { OnMount, EditorProps } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import MonacoEditor from "../MonacoEditor";

export interface EditorFile {
  name: string;
  value: string;
  language: string;
}

interface CssEditorProps {
  value: string;
  onChange?: EditorProps["onChange"];
  options?: editor.IStandaloneEditorConstructionOptions;
}

const CssEditor = (props: CssEditorProps) => {
  const { value, onChange } = props;

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
  };

  return (
    <MonacoEditor
      height={"100%"}
      path="component.css"
      language="css"
      onMount={handleEditorDidMount}
      onChange={onChange}
      value={value}
    />
  );
};

export default CssEditor;
