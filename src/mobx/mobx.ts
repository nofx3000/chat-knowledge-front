import { makeAutoObservable } from "mobx";

interface PromptFormValues {
  contentType: string;
  wordCount: number;
  requirements: string;
}

interface OutlineValues {
  title: string;
  content: string;
}

const defaultRequirements = `1. 提纲应包含5个一级标题,每个一级标题下设2-3个二级标题, 每个二级标题下设2-3个三级标题
2. 一级标题使用数字编号（1、2、3...），二级标题使用小数点编号（1.1、1.2、1.3...），三级标题用(一）、（二）、（三）...表示
3. 不设立结论或展望相关的章节
4. 提纲结构要清晰，逻辑性强，涵盖主题的各个重要方面
5. 提纲内容要专业、严谨，符合学术研究报告的标准
6. 每个标题都应简洁明了，不超过20个字
7. 输出结果不使用markdown格式
8. 不展现思考过程`;

class Store {
  promptValues: PromptFormValues = {
    contentType: "军事地理研究",
    wordCount: 3000,
    requirements: defaultRequirements,
  };

  outlineValues: OutlineValues = {
    title: "",
    content: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setPromptValues(values: PromptFormValues) {
    this.promptValues = values;
  }

  clearPromptValues() {
    this.promptValues = {
      contentType: "",
      wordCount: 0,
      requirements: defaultRequirements,
    };
  }

  setOutlineValues(values: OutlineValues) {
    this.outlineValues = values;
  }

  setOutlineTitle(title: string) {
    this.outlineValues.title = title;
  }

  setOutlineContent(content: string) {
    this.outlineValues.content = content;
  }

  clearOutlineValues() {
    this.outlineValues = {
      title: "",
      content: "",
    };
  }
}

const store = new Store();
export default store;
