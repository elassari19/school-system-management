import { redis } from './configs';

export const redisCacheHandler = async <T>(
  key: string,
  cb: () => Promise<T>
) => {
  return new Promise((resolve, reject) => {
    redis.get(key, async (err, data) => {
      if (err) {
        return reject(err);
      }
      if (data !== null) {
        return resolve(JSON.parse(data!));
      } else {
        const result = await cb();
        redis.setex(key, 3600, JSON.stringify(result));
        resolve(result);
      }
    });
  });
};

export const redisCacheClear = (key: string) => {
  redis.del(key);
};
