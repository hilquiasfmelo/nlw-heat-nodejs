import { serverHttp } from './app';

serverHttp.listen(process.env.SERVER_PORT, () => {
  console.log(`🚀 Server is running on PORT ${process.env.SERVER_PORT}`);
});
