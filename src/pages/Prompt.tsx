import React from 'react';
import { Input, InputNumber } from 'antd';
import { observer } from 'mobx-react';
import store from '../mobx/mobx';

const { TextArea } = Input;

const Prompt: React.FC = observer(() => {
  const handleContentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.setPromptValues({
      ...store.promptValues || { wordCount: 0, requirements: '' },
      contentType: e.target.value
    });
  };

  const handleWordCountChange = (value: number | null) => {
    store.setPromptValues({
      ...store.promptValues || { contentType: '', requirements: '' },
      wordCount: value || 0
    });
  };

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    store.setPromptValues({
      ...store.promptValues || { contentType: '', wordCount: 0 },
      requirements: e.target.value
    });
  };

  return (
    <div style={{ padding: '20px', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '8px' }}>内容类型</div>
        <Input
          placeholder="请输入文章的内容类型，如：新闻稿、报告等"
          value={store.promptValues?.contentType || ''}
          onChange={handleContentTypeChange}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '8px' }}>字数要求</div>
        <InputNumber
          min={1}
          placeholder="请输入字数要求"
          style={{ width: '100%' }}
          value={store.promptValues?.wordCount || null}
          onChange={handleWordCountChange}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '8px' }}>具体要求</div>
        <TextArea
          rows={4}
          placeholder="请输入文章的具体要求，如：文风、结构、重点内容等"
          value={store.promptValues?.requirements || ''}
          onChange={handleRequirementsChange}
        />
      </div>
    </div>
  );
});

export default Prompt; 