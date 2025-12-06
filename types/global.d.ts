declare namespace NodeJS {
  interface Global {
    mongoose: any;
  }
}

declare module '@/models/User' {
  const User: any;
  export default User;
}

export {};
