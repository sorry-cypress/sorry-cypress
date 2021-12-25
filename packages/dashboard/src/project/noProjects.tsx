import {
  Box,
  Container,
  Fade,
  Grid,
  Link,
  styled,
  Typography,
  Zoom,
} from '@mui/material';
import { keyframes } from '@mui/system';
import { Paper } from '@sorry-cypress/dashboard/components';
import circleCypress from '@sorry-cypress/dashboard/resources/circle-cypress.svg';
import logo from '@sorry-cypress/dashboard/resources/logo-dark.svg';
import React, { FunctionComponent } from 'react';
import packageJson from '../../package.json';
import { WithHooksForm } from './hook/hookFormReducer';
import { ProjectEditForm } from './projectEditForm';

const shake = keyframes`
0% { transform: translate(1px, 1px) rotate(0deg); }
10% { transform: translate(-1px, -2px) rotate(-1deg); }
20% { transform: translate(-3px, 0px) rotate(1deg); }
30% { transform: translate(3px, 2px) rotate(0deg); }
40% { transform: translate(1px, -1px) rotate(1deg); }
50% { transform: translate(-1px, 2px) rotate(-1deg); }
60% { transform: translate(-3px, 1px) rotate(0deg); }
70% { transform: translate(3px, 1px) rotate(-1deg); }
80% { transform: translate(-1px, -1px) rotate(1deg); }
90% { transform: translate(1px, 2px) rotate(0deg); }
100% { transform: translate(1px, -2px) rotate(-1deg); }
`;

const Logo = styled('img')({
  position: 'absolute',
  top: 305,
  left: 130,
  animation: `${shake} 0.7s 1 ease`,
  animationDelay: '1s',
});

const NoProjects: NoProjectsComponent = () => {
  function onProjectCreated() {
    location.reload();
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
        my: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#E8E8EC',
      }}
    >
      <Zoom in timeout={300}>
        <Container>
          <Paper
            elevation={2}
            sx={{
              p: 0,
              m: 0,
              height: { xs: 'calc(100vh - 64px)', lg: 'calc(100vh - 96px)' },
              overflow: 'hidden',
            }}
          >
            <Grid
              container
              flexDirection={{ xs: 'column', md: 'row' }}
              height="100%"
            >
              <Grid
                item
                container
                xs={12}
                md={6}
                flex={1}
                alignItems="center"
                justifyContent="center"
                sx={{ overflowY: 'auto' }}
              >
                <Grid item maxWidth={350}>
                  <Typography variant="h5" mb={4} color="text.secondary">
                    Welcome to Sorry Cypress!
                  </Typography>

                  <Typography variant="body2" mb={1}>
                    First things first! Create a new project manually or run
                    your tests to create the project automatically. Then you
                    will see the dashboard.{' '}
                    <Link
                      href="https://docs.sorry-cypress.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Documentation
                    </Link>
                  </Typography>
                  <WithHooksForm>
                    <ProjectEditForm
                      singleRow
                      isNewProject
                      onProjectCreated={onProjectCreated}
                      projectId="--create-new-project--"
                    />
                  </WithHooksForm>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={12}
                md={6}
                flex={1}
                alignItems="center"
                justifyContent="center"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  backgroundColor: '#111928',
                }}
              >
                <Grid item p={2} position="relative" width={400} height={500}>
                  <Fade in timeout={800} style={{ transitionDelay: '3s' }}>
                    <Typography
                      variant="h5"
                      style={{ position: 'absolute', top: 300, left: 10 }}
                      color="#ffffff"
                    >
                      Sorry Cypress
                    </Typography>
                  </Fade>
                  <Fade in timeout={800} style={{ transitionDelay: '3.2s' }}>
                    <Typography
                      variant="body2"
                      align="right"
                      style={{
                        position: 'absolute',
                        top: 330,
                        right: 240,
                      }}
                      color="#eeeeee"
                    >
                      v{packageJson.version}
                    </Typography>
                  </Fade>
                  <Zoom in timeout={500} style={{ transitionDelay: '2.2s' }}>
                    <img
                      src={circleCypress}
                      width="120"
                      style={{
                        position: 'absolute',
                        top: 40,
                        left: 145,
                      }}
                    />
                  </Zoom>
                  <Zoom in timeout={500} style={{ transitionDelay: '1.9s' }}>
                    <img
                      src={circleCypress}
                      width="90"
                      style={{
                        position: 'absolute',
                        top: 155,
                        left: 110,
                        transitionDelay: '1.5s',
                      }}
                    />
                  </Zoom>
                  <Zoom in timeout={500} style={{ transitionDelay: '1.7s' }}>
                    <img
                      src={circleCypress}
                      width="75"
                      style={{
                        position: 'absolute',
                        top: 185,
                        left: 205,
                      }}
                    />
                  </Zoom>
                  <Zoom in timeout={500} style={{ transitionDelay: '1.5s' }}>
                    <img
                      src={circleCypress}
                      width="40"
                      style={{
                        position: 'absolute',
                        top: 260,
                        left: 180,
                      }}
                    />
                  </Zoom>
                  <Logo src={logo} width={140} />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Zoom>
    </Box>
  );
};

export default NoProjects;

type NoProjectsProps = {
  //
};
type NoProjectsComponent = FunctionComponent<NoProjectsProps>;
