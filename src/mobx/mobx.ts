import { makeAutoObservable } from 'mobx';

interface PromptFormValues {
  contentType: string;
  wordCount: number;
  requirements: string;
}

class Store {
  promptValues: PromptFormValues | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPromptValues(values: PromptFormValues) {
    this.promptValues = values;
  }

  clearPromptValues() {
    this.promptValues = null;
  }
}

const store = new Store();
export default store;
