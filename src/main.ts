import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger} from "@nestjs/common"

declare const module: any;
async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule); 
  const port = 5000
  await app.listen(port);
  logger.log(`Application starts on port ${port}`)
  

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();//create a new app
