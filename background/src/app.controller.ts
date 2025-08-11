import fs from 'fs'
import path from 'path'
import { Controller, Get, Redirect } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

const projectConfig: ProjectConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, `../../config.json`), `utf-8`),
) as ProjectConfig

@ApiTags(`项目`)
@Controller()
export class AppController {
  @Get()
  @Redirect(`http://127.0.0.1:${projectConfig.port.background}/api/`, 302)
  index(): void {}
}
