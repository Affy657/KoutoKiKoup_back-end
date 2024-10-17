import 'dotenv/config';
import { env } from 'node:process';

env.MONGO_URI ??= 'mongodb://localhost:27017/koutokikoup';
env.PORT ??= '3000';
env.TOKEN_SECRET ??= 'MySuperMegaUltraHyperTurboSecret';

if (!env.GCLOUD_STORAGE_BUCKET) {
  throw new Error('GCLOUD_STORAGE_BUCKET must be provided');
}