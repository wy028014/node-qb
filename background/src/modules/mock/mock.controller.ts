/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:31:08
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 15:51:19
 * @FilePath: /nodejs-qb/background/src/modules/menu/menu.controller.ts
 * @Description: 模拟数据 控制层
 */
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common'
import { CustomLogger } from '@/plugins'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { Menu } from '@/modules/menu/entities/menu.entity'
import { MenuService } from '@/modules/menu/menu.service'
import { MenuCreateDto } from '@/modules/menu/dto/create.dto'
import { MenuUpdateDto } from '@/modules/menu/dto/update.dto'
import { MyResDto } from '@/common/dto/response.dto'
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor'
import { User } from '@/modules/user/entities/user.entity'
import { UserService } from '@/modules/user/user.service'
import { UserCreateDto } from '@/modules/user/dto/create.dto'
import { User2menu } from '@/modules/user2menu/entities/user2menu.entity'
import { User2menuService } from '@/modules/user2menu/user2menu.service'
import { User2menuCreateDto } from '@/modules/user2menu/dto/create.dto'

@ApiTags(`模拟数据`)
@Controller(`mock`)
@UseInterceptors(HttpExceptionFilter, ResponseInterceptor)
export class MockController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly userService: UserService,
    private readonly menuService: MenuService,
    private readonly user2menuService: User2menuService,
  ) {}

  @Post(`user`)
  @ApiBody({ description: `用户列表`, type: [UserCreateDto] })
  @ApiOperation({ summary: `模拟创建用户` })
  @ApiResponse({
    description: `批量创建成功`,
    status: HttpStatus.CREATED,
    type: MyResDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async createUser(): Promise<MyResDto> {
    const mockUsers: UserCreateDto[] = [
      { username: `user01`, password: `Pass123!` },
      { username: `user02`, password: `Pass456!` },
    ]
    const { success, fail }: { success: User[]; fail: UserCreateDto[] } =
      await this.userService.create(mockUsers)
    this.logger.log(`111创建用户: 成功 ${success.length}, 失败 ${fail.length}`)
    return {
      data: { success, fail },
      message: `创建用户成功`,
      statusCode: HttpStatus.CREATED,
      success: true,
    }
  }

  @Post(`menu`)
  @ApiBody({ description: `菜单列表`, type: [MenuCreateDto] })
  @ApiOperation({ summary: `模拟创建菜单` })
  @ApiResponse({
    description: `批量创建成功`,
    status: HttpStatus.CREATED,
    type: MyResDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async createMenu(): Promise<MyResDto> {
    const mockMenus: MenuCreateDto[] = [
      {
        icon: `setting`,
        name: `menu01`,
        order: 10,
        path: `/menu01`,
        title: `菜单01`,
      },
      {
        icon: `setting`,
        name: `menu02`,
        order: 20,
        path: `/menu02`,
        title: `菜单02`,
      },
    ]
    const { success, fail }: { success: Menu[]; fail: MenuCreateDto[] } =
      await this.menuService.create(mockMenus)
    this.logger.log(`创建菜单: 成功 ${success.length}, 失败 ${fail.length}`)
    return {
      data: { success, fail },
      message: `创建菜单成功`,
      statusCode: HttpStatus.CREATED,
      success: true,
    }
  }

  @Post(`menuChildren`)
  @ApiBody({ description: `菜单列表`, type: [MenuCreateDto] })
  @ApiOperation({ summary: `模拟创建子菜单` })
  @ApiResponse({
    description: `批量创建成功`,
    status: HttpStatus.CREATED,
    type: MyResDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async createMenuChildren(): Promise<MyResDto> {
    const menuResult: {
      list: Menu[]
      total: number
    } = await this.menuService.find({
      like: { name: `menu` },
      order: { order: `ASC` },
    })
    if (menuResult.total === 0) {
      return {
        data: {},
        message: `菜单数据不存在`,
        statusCode: HttpStatus.OK,
        success: true,
      }
    }
    const updateDto: MenuUpdateDto = {
      icon: menuResult.list[1].icon ?? undefined,
      name: menuResult.list[1].name,
      order: menuResult.list[1].order,
      path: menuResult.list[1].path,
      title: menuResult.list[1].title,
      parentId: menuResult.list[0].id,
    }
    const updated: Menu = await this.menuService.update(menuResult.list[1].id, updateDto)
    this.logger.log(`更新菜单成功, ID: ${menuResult.list[1].id}`)
    return {
      data: [updated],
      message: `菜单更新成功`,
      statusCode: HttpStatus.OK,
      success: true,
    }
  }

  @Post(`user2menu`)
  @ApiBody({ description: `用户2菜单列表`, type: [User2menuCreateDto] })
  @ApiOperation({ summary: `模拟创建用户2菜单` })
  @ApiResponse({
    description: `批量创建成功`,
    status: HttpStatus.CREATED,
    type: MyResDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async createUser2Menu(): Promise<MyResDto> {
    const [userResult, menuResult] = await Promise.all([
      this.userService.find({ equals: { username: `user01` } }),
      this.menuService.find({ like: { name: `menu` } }),
    ])
    if (userResult.total === 0 || menuResult.total === 0) {
      return {
        data: { userResult, menuResult },
        message: `用户或菜单数据不存在`,
        statusCode: HttpStatus.OK,
        success: true,
      }
    }
    const mockUser2Menus = menuResult.list.map((menu, index) => ({
      userId: userResult.list[0].id,
      menuId: menu.id,
      permission: `0000000${index}`,
    }))
    const { success, fail }: { success: User2menu[]; fail: User2menuCreateDto[] } =
      await this.user2menuService.create(mockUser2Menus)
    this.logger.log(`创建用户2菜单: 成功 ${success.length}, 失败 ${fail.length}`)
    return {
      data: { success, fail },
      message: `创建用户2菜单成功`,
      statusCode: HttpStatus.CREATED,
      success: true,
    }
  }
}
