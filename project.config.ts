export const ProjectConfig: {
  host: string;
  port: {
    foreground: number;
    background: number;
  };
  name: {
    foreground: string;
    background: string;
  };
  version: {
    foreground: string;
    background: string;
  };
} = {
  host: `0.0.0.0`,
  port: {
    foreground: 23250,
    background: 23251,
  },
  name: {
    foreground: `前台项目`,
    background: `后台项目`,
  },
  version: {
    foreground: `1.0.0`,
    background: `1.0.0`,
  },
};
