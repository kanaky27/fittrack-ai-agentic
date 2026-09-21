import { parse } from 'pg-connection-string';

export default ({ env }) => {
  const databaseUrl = env('DATABASE_URL');
  
  if (databaseUrl) {
    const config = parse(databaseUrl);
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          ssl: {
            rejectUnauthorized: env.bool('DATABASE_SSL_SELF_SIGNED', false),
          },
        },
        pool: { min: 2, max: 10 },
      },
    };
  }

  // Fallback to SQLite if no DATABASE_URL is provided
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
      },
      useNullAsDefault: true,
    },
  };
};
