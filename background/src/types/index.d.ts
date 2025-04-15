export interface Project {
    host: string;
    name: string;
    port: number;
    version: string;
  }
  export interface MyRes {
    data?: any;
    message: string;
    statusCode?: number;
    success: boolean;
  }
  export interface Session {
    secret: string;
    name?: string;
    rolling?: boolean;
    cookie: {
      httpOnly?: boolean | undefined;
      maxAge?: number | undefined;
      path?: string | undefined;
      sameSite?: boolean | "lax" | "strict" | "none" | undefined;
      secure?: boolean | "auto" | undefined;
    };
  }
  