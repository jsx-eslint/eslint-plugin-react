declare module 'string.prototype.repeat' {
  export = typeof Function.call.bind(String.prototype.repeat);
}
