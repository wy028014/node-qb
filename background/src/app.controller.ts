import { Controller, Get, Redirect, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
@ApiTags(`入口`)
@Controller()
export class AppController {
  @Get()
  @Redirect(`http://127.0.0.1:3000/api/`, 302)
  index(@Res() res: any): void {
    // res.sendFile("index.html", { root: "./public/dist" });
  }
}
