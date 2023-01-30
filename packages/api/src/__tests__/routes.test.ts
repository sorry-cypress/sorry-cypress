jest.mock('../../../mongo')
import supertest from 'supertest';
import {start} from '../app';
import { HOST, APOLLO_PLAYGROUND, BASE_PATH } from '../config';


describe('BASE_PATH', () => {
  it('default should serve on /graphql', async () => {
    const {httpServer, apolloServer} = await start(HOST, 0, BASE_PATH, APOLLO_PLAYGROUND);
    const request = supertest(httpServer);
    try {
      const response = await request.get('/graphql?query={__schema {queryType {name}}}');
      expect(response.status).toBe(200);
    }
    finally {
      await apolloServer.stop();
      await httpServer.stop();
    }
  });

  it('override should serve on /foo/graphql', async () => {
    const {httpServer, apolloServer} = await start(HOST, 0, '/foo', APOLLO_PLAYGROUND);
    const request = supertest(httpServer);
    try { 
      const response = await request.get('/foo/graphql?query={__schema {queryType {name}}}');
      expect(response.status).toBe(200);
    }
    finally {
      await apolloServer.stop();
      await httpServer.stop();
    }
  });

  it('override should not serve on /graphql', async () => {
    const {httpServer, apolloServer} = await start(HOST, 0, '/foo', APOLLO_PLAYGROUND);
    const request = supertest(httpServer);
    try {
      const response = await request.get('/graphql?query={__schema {queryType {name}}}');
      expect(response.status).toBe(404);
    }
    finally {
      await apolloServer.stop();
      await httpServer.stop();
    }
  });
});