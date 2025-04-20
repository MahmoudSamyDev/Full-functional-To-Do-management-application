export interface LoginFormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}

export interface LoginForm extends HTMLFormElement {
  readonly elements: LoginFormElements;
}