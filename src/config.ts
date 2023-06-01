import 'dotenv/config';
import {
  GetParametersByPathCommand,
  GetParametersByPathCommandInput,
  SSMClient,
} from '@aws-sdk/client-ssm';

export interface Config {
  readonly PORT: number;
  readonly DATABASE_URL: string;
}

const PROJECT_NAME = 'lab46-redirector';
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';
const AWS_REGION = process.env.AWS_REGION || 'us-west-2';

// XXX(Phong): Write this to whatever provider you want to use
async function getCloudSecrets() {
  const client = new SSMClient({ region: AWS_REGION });
  const input: GetParametersByPathCommandInput = {
    // XXX(Phong): this name needs to be created
    Path: `/${PROJECT_NAME}/env/${ENVIRONMENT}`,
    Recursive: true,
    WithDecryption: true,
  };
  const command = new GetParametersByPathCommand(input);
  const response = await client.send(command);

  const secrets = Object.fromEntries(
    response.Parameters?.map((p) => [p.Name?.split('/').pop(), p?.Value]) || [],
  );

  return secrets satisfies Partial<Config> as Config;
}

let cloudSecrets: Partial<Config> = {};
if (process.env.ENVIRONMENT === 'production') {
  cloudSecrets = await getCloudSecrets();
}

const config: Config = Object.freeze({
  ENVIRONMENT,
  PROJECT_NAME,
  PORT: parseInt(getEnvVariable('PORT', '9000'), 10),
  DATABASE_URL: getEnvVariable('DATABASE_URL'),
  ...cloudSecrets,
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
