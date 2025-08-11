# 项目

## 项目目录结构

node-qb/
├── .vscode/
├── background/
│ ├── dist/
│ ├── node_modules/
│ ├── src/
│ ├── .gitignore                       # 后台服务git忽略文件
│ ├── .prettierrc                      # 后台服务代码格式化配置文件
│ ├── eslint.config.mjs                # 后台服务eslint配置文件
│ ├── nest-cli.json                    # 后台服务nest-cli配置文件
│ ├── package.json                     # 后台服务依赖配置文件
│ ├── tsconfig.build.json             # 后台服务tsconfig.build配置文件
│ └── tsconfig.json                   # 后台服务tsconfig配置文件
├── foreground/                        # 前台服务目录
│ ├── node_modules/                    # 前台服务依赖目录
│ ├── public/                          # 前台服务静态资源目录
│ ├── src/                             # 前台服务源代码目录
│ │ ├── apis/                          # 前台服务API目录
│ │ │ ├── modules/                     # 前台服务API模块目录
│ │ │ │ ├── index.ts                   # 前台服务API模块索引文件
│ │ │ │ ├── menu.api.ts                # 菜单API模块
│ │ │ │ ├── user.api.ts                # 用户API模块
│ │ │ │ └── user2menu.api.ts           # 用户2菜单API模块
│ │ │ └── index.ts                     # api主文件, axios的配置文件, 前台路由拦截器, 响应拦截器, 错误处理
│ │ ├── assets/                        # 前台服务静态资源目录
│ │ ├── components/                    # 前台服务组件目录
│ │ │ ├── ButtonGroup/                 # 按钮组组件目录
│ │ │ │ ├── data.ts                    # 按钮组组件数据文件
│ │ │ │ └── index.vue                  # 按钮组组件视图文件
│ │ │ ├── Department/                  # 部门组件目录
│ │ │ │ ├── data.ts                    # 部门组件数据文件
│ │ │ │ └── index.vue                  # 部门组件视图文件
│ │ │ ├── Duty/                        # 职务组件目录
│ │ │ │ ├── data.ts                    # 职务组件数据文件
│ │ │ │ └── index.vue                  # 职务组件视图文件
│ │ │ ├── Gender/                      # 性别组件目录
│ │ │ │ ├── data.ts                    # 性别组件数据文件
│ │ │ │ └── index.vue                  # 性别组件视图文件
│ │ │ ├── Login/                       # 登录组件目录
│ │ │ │ ├── data.ts                    # 登录组件数据文件
│ │ │ │ └── index.vue                  # 登录组件视图文件
│ │ │ ├── Rank/                        # 职级组件目录
│ │ │ │ ├── data.ts                    # 职级组件数据文件
│ │ │ │ └── index.vue                  # 职级组件视图文件
│ │ ├── layouts/                       # 布局目录
│ │ │ ├── components/                  # 布局组件目录
│ │ │ │ ├── aside.vue                  # 布局-侧边栏组件
│ │ │ │ ├── footer.vue                 # 布局-页脚组件
│ │ │ │ ├── header.vue                 # 布局-页头组件
│ │ │ │ ├── logo.vue                   # 布局-logo组件
│ │ │ │ └── main.vue                   # 布局-主内容组件
│ │ │ └── default.vue                  # 布局-默认组件
│ │ ├── pages/                         # 页面目录
│ │ │ ├── management/                  # 管理页面目录
│ │ │ │ ├── menu/                      # 管理-菜单页面目录
│ │ │ │ │ ├── index.json               # 管理-菜单页面配置文件
│ │ │ │ │ └── index.vue                # 管理-菜单页面视图文件
│ │ │ │ ├── user/                      # 管理-用户页面目录
│ │ │ │ │ ├── index.json               # 管理-用户页面配置文件
│ │ │ │ │ └── index.vue                # 管理-用户页面视图文件
│ │ │ │ ├── index.json                 # 管理页面配置文件
│ │ ├── plugins/                       # 插件目录
│ │ │ ├── modules/                     # 插件模块目录
│ │ │ │ ├── dayjs.ts                   # 插件-日期格式化模块
│ │ │ │ ├── element-plus.ts            # 插件-Element Plus模块
│ │ │ │ └── nprogress.ts               # 插件-进度条模块
│ │ │ └── index.ts                     # 插件主文件, 引入所有插件
│ │ ├── routers/                       # 路由目录
│ │ │ ├── guards/                      # 路由守卫目录
│ │ │ │ ├── auth.guard.ts              # 路由守卫-认证守卫
│ │ │ │ ├── index.ts                   # 路由守卫主文件, 引入所有路由守卫
│ │ │ │ └── premission.guard.ts        # 路由守卫-权限守卫
│ │ │ └── index.ts                     # 路由主文件
│ │ ├── stores/                        # 状态管理目录
│ │ │ ├── modules/                     # 状态管理模块目录
│ │ │ │ ├── index.ts                   # 状态管理模块索引文件
│ │ │ │ ├── menu.store.ts              # 状态管理-菜单模块
│ │ │ │ └── premission.store.ts        # 状态管理-权限模块
│ │ │ └── index.ts                     # 状态管理主文件, 引入所有状态管理模块
│ │ ├── types/                         # 类型定义目录
│ │ │ ├── index.ts                     # 类型定义索引文件
│ │ │ ├── menu.d.ts                    # 类型定义-菜单模块
│ │ │ ├── user.d.ts                    # 类型定义-用户模块
│ │ │ └── user2menu.d.ts               # 类型定义-用户2菜单模块
│ │ ├── App.vue                        # 前台服务主组件
│ │ ├── main.ts                        # 前台服务主文件, 引入所有插件, 路由, 状态管理, 应用主组件
│ │ ├── style.css                      # 前台服务全局样式文件
│ │ └── vite-env.d.ts                  # 前台服务类型定义-环境变量模块
│ ├── index.html                       # 前台服务的html入口文件
│ ├── package.json                     # 前台服务依赖配置文件
│ ├── tsconfig.config                  # 前台服务类型定义配置文件
│ └── vite.config.ts                   # 前台服务Vite配置文件
├── node_modules/                      # 项目依赖目录
├── .gitignore                         # 前台服务git忽略文件
├── .prettierrc                        # 前台服务代码格式化配置文件
├── package.json                       # 项目依赖配置文件
├── project.config.ts                  # 项目配置文件
├── README.md                          # 项目说明文档
├── tsconfig.base.json                 # 项目类型定义配置文件-前台和后台共享
└── yarn.lock                          # 项目依赖锁文件

## 安装包的命令

- 安装项目依赖

```bash
yarn add <package-name> -W

```

- 安装仅前端项目依赖

```bash
yarn workspace foreground add (-D) <package-name>

```

- 安装仅后端项目依赖

```bash
yarn workspace background add (-D) <package-name>
```

## 项目后台白皮书

### 一、项目概述

本项目后台是一个基于 NestJS 框架构建的服务端应用, 使用 TypeScript 语言编写, 采用 TypeORM 进行数据库操作, 集成了 JWT 进行身份验证, 同时使用 Swagger 生成接口文档。
项目主要包含用户管理模块和菜单管理模块, 支持用户的创建、查询、更新和删除操作, 以及用户与菜单之间的关联管理。

### 二、模块功能说明

#### 2.1 用户模块(UserModule)

- 2.1.1 功能概述
  用户模块主要负责用户的增删改查操作。
- 2.1.2 实体(User)
  id: 菜单的唯一标识, 使用 UUID 生成。
  username: 登陆名称。
  password: 登录密码。
  user2menus: 和菜单的关联关系。
- 2.1.3 数据传输对象(DTO)
  UserCreateDto: 用于新增用户信息, 包含 username 和 password 两个必选字段。
  UserQueryDto: 用于查询用户信息, 包含 where, order, page, size 四个可选字段，其中 where 包含 equals 完全匹配, like 部分匹配, relations 关联关系。
  UserUpdateDto: 用于更新用户信息, 包含 username 和 password 两个可选字段。
- 2.1.4 控制器(UserController)
  创建用户: 接收用户信息, 调用服务层的 create 方法创建新用户。
  查询用户: 支持自定义查询条件, 调用服务层的 find 方法查询用户列表。
  更新用户信息: 接收用户 ID 和要更新的信息, 调用服务层的 update 方法更新用户信息。
  软删除用户: 接收用户 ID, 调用服务层的 remove 方法软删除用户。
- 2.1.5 服务层(UserService)
  create(user: User): Promise<User | null>: 创建新用户, 若创建成功返回用户信息, 否则返回 null。
  find(options: FindManyOptions<User>): Promise<User[]>: 根据自定义查询条件查询用户列表。
  update(id: string, user: Partial<User>): Promise<User | null>: 更新用户信息, 若更新成功返回更新后的用户信息, 否则返回 null。
  remove(id: string): Promise<void>: 软删除用户。
- 2.1.6 请求参数和返回结果
  | 接口名称 | 请求方法 | 请求路径 | 请求参数 | 返回结果 |
  | ------------ | -------- | --------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | 批量创建用户 | POST | /user | { "username": "string", "password": "string" } | { "data": { "id": "string", "username": "string", "password": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" } |
  | 条件查询用户 | GET | /user | { "where": "number", "order": "number", "page": "number", "size": "number" } | { "data": [ { "id": "string", "username": "string", "password": "string" } ], "message": "string", "statusCode": 200, "success": true, "timestamp": "string" } |
  | 更新用户信息 | PUT | /user/:id | { "username": "string", "password": "string" } | { "data": { "id": "string", "username": "string", "password": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" } |
  | 软删除用户 | DELETE | /user/:id | 无 | { "data": null, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" } |

#### 2.2 菜单模块(MenuModule)

- 2.2.1 功能概述
  菜单模块主要负责菜单的增删改查操作。
- 2.2.2 实体(Menu)
  id: 菜单的唯一标识, 使用 UUID 生成。
  icon: 菜单图标。
  name: 菜单名称。
  parentId: 父菜单 ID。
  path: 菜单路径。
  title: 菜单标题。
  user2menus: 和用户的关联关系。
- 2.2.3 请求参数和返回结果
  | 接口名称 | 请求方法 | 请求路径 | 请求参数 | 返回结果 |
  | ------------ | -------- | --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | 批量创建菜单 | POST | /menu | { "icon": "string", "name": "string", "parentId": "path", "title": "string" } | { "data": { "id": "icon": "string", "name": "string", "parentId": "path", "title": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" } |
  | 条件查询菜单 | GET | /menu | { "where": "number", "order": "number", "page": "number", "size": "number" } | { "data": [ { "id": "string", "username": "string", "password": "string" } ], "message": "string", "statusCode": 200, "success": true, "timestamp": "string" } |
  | 更新菜单信息 | PUT | /menu/:id | { "username": "string", "password": "string" } | { "data": { "id": "string", "username": "string", "password": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" } |
  | 软删除菜单 | DELETE | /menu/:id | 无 | { "data": null, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" } |
  2.3 用户与菜单关联模块(User2menuModule)
  2.3.1 功能概述
  用户与菜单关联模块主要负责管理用户与菜单之间的关联关系, 包括创建关联、查询关联、更新关联和删除关联。
  2.3.2 控制器(User2menuController)
  创建关联: 接收用户 ID 和菜单 ID, 调用服务层的 create 方法创建关联。
  查询所有关联: 调用服务层的 findAll 方法查询所有用户与菜单的关联信息。
  查询单个关联: 接收用户 ID 和菜单 ID, 调用服务层的 findOne 方法查询单个关联信息。
  更新关联: 接收用户 ID、菜单 ID 和要更新的信息, 调用服务层的 update 方法更新关联信息。
  删除关联: 接收用户 ID 和菜单 ID, 调用服务层的 remove 方法删除关联。
  2.3.3 服务层(User2menuService)
  create(createUser2menuDto: CreateUser2menuDto): 创建用户与菜单的关联。
  findAll(): 查询所有用户与菜单的关联信息。
  findOne(userId: string, menuId: string): 查询单个用户与菜单的关联信息。
  update(userId: string, menuId: string, updateUser2menuDto: UpdateUser2menuDto): 更新用户与菜单的关联信息。
  remove(userId: string, menuId: string): 删除用户与菜单的关联信息。
  2.3.4 数据传输对象(DTO)
  CreateUser2menuDto: 用于创建用户与菜单的关联, 包含 userId 和 menuId 两个字段。
  UpdateUser2menuDto: 用于更新用户与菜单的关联信息, 包含 userId 和 menuId 两个可选字段。
  2.3.5 请求参数和返回结果
  接口名称 请求方法 请求路径 请求参数 返回结果
  创建关联 POST /user2menu { "userId": "string", "menuId": "string" } { "data": { "userId": "string", "menuId": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }
  查询所有关联 GET /user2menu 无 { "data": [ { "userId": "string", "menuId": "string" } ], "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }
  查询单个关联 GET /user2menu/:userId/:menuId 无 { "data": { "userId": "string", "menuId": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }
  更新关联 PUT /user2menu/:userId/:menuId { "userId": "string", "menuId": "string" } { "data": { "userId": "string", "menuId": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }
  删除关联 DELETE /user2menu/:userId/:menuId 无 { "data": null, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }
  三、拦截器(TransformInterceptor)
  拦截器主要用于处理请求的查询参数和响应结果的格式化, 具体功能如下:
  处理查询参数中的 page 和 size, 确保其为有效的数值。
  记录请求的开始时间和结束时间, 计算请求耗时。
  格式化响应结果中的 createdAt 和 updatedAt 字段为 YYYY-MM-DD HH:mm:ss 格式。
  统一响应结果的格式, 包含 data、message、statusCode、success 和 timestamp 字段。
  四、配置文件(config/index.ts)
  配置文件主要包含数据库配置、JWT 配置、项目配置和会话配置, 具体如下:
  数据库配置: 使用 MariaDB 数据库, 配置了数据库的连接信息, 包括主机、端口、用户名、密码、数据库名等。
  JWT 配置: 配置了 JWT 的密钥和令牌有效期。
  项目配置: 配置了项目的主机、端口、名称和版本。
  会话配置: 配置了会话的 cookie 信息和会话有效期。
  五、插件(plugins)
  插件主要包含 Day.js 日期处理插件和自定义日志插件, 具体如下:
  Day.js 插件: 提供了日期处理的功能。
  自定义日志插件: 提供了日志记录的功能, 支持记录普通日志、错误日志、警告日志、调试日志和详细日志。
  六、总结
  本项目后台通过模块化设计, 实现了用户管理、菜单管理和用户与菜单关联管理的功能。使用 NestJS 框架和 TypeORM 进行开发, 提高了开发效率和代码的可维护性。同时, 集成了 JWT 进行身份验证, 保障了系统的安全性。通过 Swagger 生成接口文档, 方便了接口的调试和使用。
