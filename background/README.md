<!--
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:00:05
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 12:04:16
 * @FilePath: /nodejs-qb/background/README.md
 * @Description: markdown
-->
# 项目后台白皮书
## 一、项目概述
本项目后台是一个基于 NestJS 框架构建的服务端应用, 使用 TypeScript 语言编写, 采用 TypeORM 进行数据库操作, 集成了 JWT 进行身份验证, 同时使用 Swagger 生成接口文档。
项目主要包含用户管理模块和菜单管理模块, 支持用户的创建、查询、更新和删除操作, 以及用户与菜单之间的关联管理。
## 二、模块功能说明
### 2.1 用户模块（UserModule）
- 2.1.1 功能概述
用户模块主要负责用户的增删改查操作。
- 2.1.2 实体（User）
id：菜单的唯一标识, 使用 UUID 生成。
username：登陆名称。
password：登录密码。
user2menus：和菜单的关联关系。
- 2.1.3 数据传输对象（DTO）
UserCreateDto：用于新增用户信息, 包含 username 和 password 两个必选字段。
UserQueryDto：用于查询用户信息, 包含 where, order, page, size 四个可选字段，其中 where 包含 equals 完全匹配, like 部分匹配, relations 关联关系。
UserUpdateDto：用于更新用户信息, 包含 username 和 password 两个可选字段。
- 2.1.4 控制器（UserController）
创建用户：接收用户信息, 调用服务层的 create 方法创建新用户。
查询用户：支持自定义查询条件, 调用服务层的 find 方法查询用户列表。
更新用户信息：接收用户 ID 和要更新的信息, 调用服务层的 update 方法更新用户信息。
软删除用户：接收用户 ID, 调用服务层的 remove 方法软删除用户。
- 2.1.5 服务层（UserService）
create(user: User): Promise<User | null>：创建新用户, 若创建成功返回用户信息, 否则返回 null。
find(options: FindManyOptions<User>): Promise<User[]>：根据自定义查询条件查询用户列表。
update(id: string, user: Partial<User>): Promise<User | null>：更新用户信息, 若更新成功返回更新后的用户信息, 否则返回 null。
remove(id: string): Promise<void>：软删除用户。
- 2.1.6 请求参数和返回结果
| 接口名称     | 请求方法 | 请求路径  | 请求参数                                                                     | 返回结果                                                                                                                                                       |
| ------------ | -------- | --------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 批量创建用户 | POST     | /user     | { "username": "string", "password": "string" }                               | { "data": { "id": "string", "username": "string", "password": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }     |
| 条件查询用户 | GET      | /user     | { "where": "number", "order": "number", "page": "number", "size": "number" } | { "data": [ { "id": "string", "username": "string", "password": "string" } ], "message": "string", "statusCode": 200, "success": true, "timestamp": "string" } |
| 更新用户信息 | PUT      | /user/:id | { "username": "string", "password": "string" }                               | { "data": { "id": "string", "username": "string", "password": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }     |
| 软删除用户   | DELETE   | /user/:id | 无                                                                           | { "data": null, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }                                                               |
### 2.2 菜单模块（MenuModule）
- 2.2.1 功能概述
菜单模块主要负责菜单的增删改查操作。
- 2.2.2 实体（Menu）
id：菜单的唯一标识, 使用 UUID 生成。
icon：菜单图标。
name：菜单名称。
parentId：父菜单 ID。
path：菜单路径。
title：菜单标题。
user2menus：和用户的关联关系。
- 2.2.3 请求参数和返回结果
| 接口名称     | 请求方法 | 请求路径  | 请求参数                                                                      | 返回结果                                                                                                                                                                        |
| ------------ | -------- | --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 批量创建菜单 | POST     | /menu     | { "icon": "string", "name": "string", "parentId": "path", "title": "string" } | { "data": { "id": "icon": "string", "name": "string", "parentId": "path", "title": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" } |
| 条件查询菜单 | GET      | /menu     | { "where": "number", "order": "number", "page": "number", "size": "number" }  | { "data": [ { "id": "string", "username": "string", "password": "string" } ], "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }                  |
| 更新菜单信息 | PUT      | /menu/:id | { "username": "string", "password": "string" }                                | { "data": { "id": "string", "username": "string", "password": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }                      |
| 软删除菜单   | DELETE   | /menu/:id | 无                                                                            | { "data": null, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }                                                                                |
2.3 用户与菜单关联模块（User2MenuModule）
2.3.1 功能概述
用户与菜单关联模块主要负责管理用户与菜单之间的关联关系, 包括创建关联、查询关联、更新关联和删除关联。
2.3.2 控制器（User2MenuController）
创建关联：接收用户 ID 和菜单 ID, 调用服务层的 create 方法创建关联。
查询所有关联：调用服务层的 findAll 方法查询所有用户与菜单的关联信息。
查询单个关联：接收用户 ID 和菜单 ID, 调用服务层的 findOne 方法查询单个关联信息。
更新关联：接收用户 ID、菜单 ID 和要更新的信息, 调用服务层的 update 方法更新关联信息。
删除关联：接收用户 ID 和菜单 ID, 调用服务层的 remove 方法删除关联。
2.3.3 服务层（User2MenuService）
create(createUser2MenuDto: CreateUser2MenuDto)：创建用户与菜单的关联。
findAll()：查询所有用户与菜单的关联信息。
findOne(userId: string, menuId: string)：查询单个用户与菜单的关联信息。
update(userId: string, menuId: string, updateUser2MenuDto: UpdateUser2MenuDto)：更新用户与菜单的关联信息。
remove(userId: string, menuId: string)：删除用户与菜单的关联信息。
2.3.4 数据传输对象（DTO）
CreateUser2MenuDto：用于创建用户与菜单的关联, 包含 userId 和 menuId 两个字段。
UpdateUser2MenuDto：用于更新用户与菜单的关联信息, 包含 userId 和 menuId 两个可选字段。
2.3.5 请求参数和返回结果
接口名称	请求方法	请求路径	请求参数	返回结果
创建关联	POST	/user2menu	{ "userId": "string", "menuId": "string" }	{ "data": { "userId": "string", "menuId": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }
查询所有关联	GET	/user2menu	无	{ "data": [ { "userId": "string", "menuId": "string" } ], "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }
查询单个关联	GET	/user2menu/:userId/:menuId	无	{ "data": { "userId": "string", "menuId": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }
更新关联	PUT	/user2menu/:userId/:menuId	{ "userId": "string", "menuId": "string" }	{ "data": { "userId": "string", "menuId": "string" }, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }
删除关联	DELETE	/user2menu/:userId/:menuId	无	{ "data": null, "message": "string", "statusCode": 200, "success": true, "timestamp": "string" }
三、拦截器（TransformInterceptor）
拦截器主要用于处理请求的查询参数和响应结果的格式化, 具体功能如下：
处理查询参数中的 page 和 size, 确保其为有效的数值。
记录请求的开始时间和结束时间, 计算请求耗时。
格式化响应结果中的 createdAt 和 updatedAt 字段为 YYYY-MM-DD HH:mm:ss 格式。
统一响应结果的格式, 包含 data、message、statusCode、success 和 timestamp 字段。
四、配置文件（config/index.ts）
配置文件主要包含数据库配置、JWT 配置、项目配置和会话配置, 具体如下：
数据库配置：使用 MariaDB 数据库, 配置了数据库的连接信息, 包括主机、端口、用户名、密码、数据库名等。
JWT 配置：配置了 JWT 的密钥和令牌有效期。
项目配置：配置了项目的主机、端口、名称和版本。
会话配置：配置了会话的 cookie 信息和会话有效期。
五、插件（plugins）
插件主要包含 Day.js 日期处理插件和自定义日志插件, 具体如下：
Day.js 插件：提供了日期处理的功能。
自定义日志插件：提供了日志记录的功能, 支持记录普通日志、错误日志、警告日志、调试日志和详细日志。
六、总结
本项目后台通过模块化设计, 实现了用户管理、菜单管理和用户与菜单关联管理的功能。使用 NestJS 框架和 TypeORM 进行开发, 提高了开发效率和代码的可维护性。同时, 集成了 JWT 进行身份验证, 保障了系统的安全性。通过 Swagger 生成接口文档, 方便了接口的调试和使用。