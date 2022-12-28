import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { EditorProps } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// react-draft-wysiwyg only supported on the client, hence we use dynamic to ensure its only rendered client side
const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false },
);

const WYSIWYGEditor = (props: any) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState: any) => {
    setEditorState(editorState);
    return props.onChange(
      draftToHtml(convertToRaw(editorState.getCurrentContent())),
    );
  };

  return (
    <>
      <Editor
        editorStyle={{
          height: 100,
          borderWidth: '1px',
          padding: 5,
          borderRadius: '0.5rem',
        }}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: ['inline'],
          inline: {
            options: ['bold', 'italic', 'underline'],
          },
        }}
      />
    </>
  );
};

export default WYSIWYGEditor;
