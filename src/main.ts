import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from "@nestjs/common"
import * as config from 'config';

declare const module: any;
async function bootstrap() {
  const serverConfig = config.get('server')

  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule); 
  
  if (process.env.NODE_ENV === "development") { app.enableCors() } 
  else {
    app.enableCors({ origin: serverConfig.origin });
    Logger.log(`Accepting request from origin ${serverConfig.origin}`)
  }
  

  const port = serverConfig.port
  await app.listen(port);
  logger.log(`Application starts on port ${port}`)
  

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();//create a new app
