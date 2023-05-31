import 'dotenv/config';

export interface Config {
  readonly PORT: number;
  readonly DATABASE_URL: string;
}

const config: Config = Object.freeze({
  PORT: parseInt(getEnvVariable('PORT', '9000'), 10),
  DATABASE_URL: getEnvVariable('DATABASE_URL'),
});

function getEnvVariable(name: string, defaultVal?: string): string {
  const val = process.env[name];

  if (!val) {
    if (defaultVal) {
      return defaultVal;
    }
    throw new Error(`environment variable ${name} not found`);
  }

  return val;
}

export default config;
