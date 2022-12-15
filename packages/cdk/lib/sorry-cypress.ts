import { EndpointType } from '@aws-cdk/aws-apigateway';
import { Runtime } from '@aws-cdk/aws-lambda';
import type { App } from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import { GuApiLambda } from '@guardian/cdk';
import { Stage } from '@guardian/cdk/lib/constants';
import { GuCertificate } from '@guardian/cdk/lib/constructs/acm';
import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack } from '@guardian/cdk/lib/constructs/core';
import { GuCname } from '@guardian/cdk/lib/constructs/dns';

const app = 'sorry-cypress';

export class SorryCypress extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    // Domain name for the selected deployment stage
    const domainName = this.withStageDependentValue({
      app,
      variableName: 'domainName',
      stageValues: {
        [Stage.CODE]: 'sorry-cypress.code.dev-gutools.co.uk',
        [Stage.PROD]: 'sorry-cypress.gutools.co.uk',
      },
    });

    const certificate = new GuCertificate(this, {
      app,
      domainName,
    });

    const apiLambda = new GuApiLambda(this, 'lambda', {
      app,
      runtime: Runtime.NODEJS_14_X,
      apis: [
        {
          id: 'api',
          proxy: true,
          restApiName: `${app}-${this.stage}`,
          description: 'sorry-cypress server',
          endpointTypes: [EndpointType.REGIONAL],
          domainName: {
            certificate,
            domainName,
            endpointType: EndpointType.REGIONAL,
          },
        },
      ],
      fileName: 'sorry-cypress.zip',
      functionName: `${app}-lambda-api-${this.stage}`,
      handler: 'index.handler',
      monitoringConfiguration: { noMonitoring: true },
      memorySize: 256,
      timeout: Duration.seconds(15),
    });

    const maybeApi = apiLambda.apis.get('api');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we expect api to be available beyond this line
    const api = maybeApi!;

    // The custom domain name mapped to this API
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we expect the domainName to be available here
    const apiDomain = api.domainName!;

    // CNAME mapping between API Gateway and the custom domain
    new GuCname(this, 'DNS entry', {
      app,
      domainName,
      ttl: Duration.hours(1),
      resourceRecord: apiDomain.domainNameAliasDomainName,
    });
  }
}
