export interface LoginFormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}
export interface SignupFormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
  confirmPassword: HTMLInputElement;
}

export interface LoginForm extends HTMLFormElement {
  readonly elements: LoginFormElements;
}
export interface SignupForm extends HTMLFormElement {
  readonly elements: SignupFormElements;
}