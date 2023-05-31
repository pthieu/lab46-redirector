import config from './config';
import ApiRouter from '~/api';
import app from '~/app';
import { migrateLatest } from '~/db';

const PORT = config.PORT;

await migrateLatest();
export const server = app(ApiRouter);

const _server = server.listen(PORT, () => {
  console.log(`Server listening port ${PORT}`);
});

// XXX(Phong): below is to make Vite vite-note HMR work
if (import.meta.hot) {
  function killServer() {
    _server.close((err) => {
      if (err) {
        console.error('Error closing server: ', err);
      }
    });
  }

  import.meta.hot.on('vite:beforeFullReload', () => {
    console.log('HMR: full reload');
    killServer();
  });

  import.meta.hot.dispose(() => {
    console.log('HMR: dispose');
    killServer();
  });
}

export default _server;
