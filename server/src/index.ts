import { creatApp } from './app';
import swaggerDocs from './utils/swagger';

const app = creatApp();

/* SERVER */
const port = Number(process.env.PORT) || 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  swaggerDocs(app, port);
});
