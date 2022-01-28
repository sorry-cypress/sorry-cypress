import { Flaky, NavigateBefore, Topic, Videocam } from '@mui/icons-material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import {
  Alert,
  AlertTitle,
  Box,
  Collapse,
  colors,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { blueGrey, pink } from '@mui/material/colors';
import { getTestRetries } from '@sorry-cypress/common';
import {
  GetInstanceQuery,
  GetInstanceTestFragment,
} from '@sorry-cypress/dashboard/generated/graphql';
import { getDurationMs } from '@sorry-cypress/dashboard/lib/time';
import { TestError } from '@sorry-cypress/dashboard/testItem/details/common';
import { get } from 'lodash';
import React, {
  FunctionComponent,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { INSTANCE_STATE_COLORS, Paper, TEST_STATE_ICONS } from '../components';
import { Player } from '../components/ui/player';
import { TestDetailsView } from '../testItem/testDetailsView';
import { getTestDuration, getTestStartedAt } from './util';

export const InstanceDetails: InstanceDetailsComponent = (props) => {
  const { instance, selectedItem } = props;

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmScreenOrSmaller = useMediaQuery(theme.breakpoints.down('md'));
  const [showNavigationPanel, setShowNavigationPanel] = useState(true);
  const [
    collapseEnterAnimationFinished,
    setCollapseEnterAnimationFinished,
  ] = useState(true);
  const [
    collapseExitAnimationFinished,
    setCollapseExitAnimationFinished,
  ] = useState(true);

  if (!instance?.results) {
    return <p>No results yet for the spec</p>;
  }

  const tests = instance.results.tests;

  if (instance.results.error) {
    return <TestError error={instance.results.error} />;
  }

  if (!tests?.length) {
    return (
      <Paper>
        <Alert severity="info">
          <AlertTitle>Empty spec</AlertTitle>
          <div>No tests reported for this spec.</div>
        </Alert>
      </Paper>
    );
  }

  const {
    navigationTree,
    nodeIds,
    testsMap,
    firstItem,
  } = getTreeOfNavigationItems(instance);
  const [expanded, setExpanded] = useState<string[]>(nodeIds);
  const [selected, setSelected] = useState<any>(firstItem);

  const handleToggle = (e: SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (e: SyntheticEvent, nodeId: string[] | string) => {
    if (nodeId === 'RECORDED_VIDEO') {
      navigate(`/instance/${instance.instanceId}/others/${nodeId}`, {
        replace: true,
      });
    } else if (typeof nodeId === 'string' && testsMap[nodeId]) {
      navigate(`/instance/${instance.instanceId}/test/${nodeId}`, {
        replace: true,
      });
    }
  };

  useEffect(() => {
    if (selectedItem === 'RECORDED_VIDEO') {
      setSelected({
        nodeId: selectedItem,
        data: navigationTree.get(selectedItem),
      });
    } else if (selectedItem && testsMap[selectedItem]) {
      setSelected({ nodeId: selectedItem, data: testsMap[selectedItem] });
    }
  }, [selectedItem]);

  const handleToggleNavigationPanel = () => {
    if (showNavigationPanel) {
      setCollapseExitAnimationFinished(false);
    } else {
      setCollapseEnterAnimationFinished(false);
    }
    setShowNavigationPanel(!showNavigationPanel);
  };

  const renderTree = (nodes: Map<string, NavigationItem>) => {
    const render = [];
    for (const node of nodes.entries()) {
      render.push(
        <TreeItem
          key={node[1].id}
          nodeId={node[1].id}
          label={
            <Grid container alignItems="center" py={0.75}>
              <Grid
                item
                component={
                  node[1].isFolder
                    ? Topic
                    : node[1].isVideo
                    ? Videocam
                    : TEST_STATE_ICONS[node[1].test?.state || 'unknown']
                }
                color="inherit"
                sx={{
                  mr: 0.5,

                  fontSize:
                    node[1].isFolder || node[1].isVideo ? undefined : '1.2rem',
                  color:
                    node[1].isFolder || node[1].isVideo
                      ? blueGrey[400]
                      : get(colors, [
                          INSTANCE_STATE_COLORS[
                            node[1].test?.state || 'unknown'
                          ],
                          400,
                        ]),
                }}
              ></Grid>
              <Grid item flex={1}>
                <Typography
                  variant={
                    node[1].isFolder || node[1].isVideo ? 'body2' : 'caption'
                  }
                  sx={{ fontWeight: 'inherit', flexGrow: 1 }}
                >
                  {node[1].isVideo ? 'Recorded video' : node[0]}
                </Typography>
              </Grid>
              {node[1].test &&
                getTestRetries(
                  node[1].test.state,
                  node[1].test.attempts.length
                ) > 0 && (
                  <Tooltip title="Flaky test">
                    <Flaky
                      fontSize="inherit"
                      sx={{
                        fontSize: 'inherit',
                        color: pink[400],
                        mr: 0.5,
                      }}
                    />
                  </Tooltip>
                )}
              <Grid item pr={2}>
                <Typography variant="caption" color="inherit">
                  {node[1].test && (
                    <Tooltip
                      title={`Started at ${getTestStartedAt(node[1].test)}`}
                    >
                      <span>
                        {getDurationMs(getTestDuration(node[1].test))}
                      </span>
                    </Tooltip>
                  )}
                </Typography>
              </Grid>
            </Grid>
          }
        >
          {node[1].children ? renderTree(node[1].children) : null}
        </TreeItem>
      );
    }
    return <>{render}</>;
  };

  return (
    <>
      <Typography
        component="h1"
        variant="h6"
        color="text.primary"
        sx={{ mt: 5, mb: 2 }}
      >
        Tests
      </Typography>
      <Grid container minHeight={400} columnSpacing={2}>
        <Grid
          item
          {...(showNavigationPanel && collapseEnterAnimationFinished
            ? {
                xs: 12,
                md: 5,
                lg: 5,
                xl: 4,
              }
            : {})}
          sx={{ position: 'relative', mb: isSmScreenOrSmaller ? 2 : undefined }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: '80px',
            }}
          >
            {!isSmScreenOrSmaller && (
              <IconButton
                onClick={handleToggleNavigationPanel}
                sx={{
                  zIndex: 1,
                  position: 'absolute',
                  backgroundColor: '#fff',
                  borderRadius: '20px',
                  transform: showNavigationPanel
                    ? 'rotate(0deg)'
                    : 'rotate(180deg)',
                  height: 38,
                  width: 20,
                  top: 20,
                  right: '-9px',
                  '&:hover': {
                    backgroundColor: '#f7f7f7',
                  },
                }}
              >
                <NavigateBefore />
              </IconButton>
            )}
            <Paper
              sx={{
                my: 0,
                ...(!showNavigationPanel && collapseExitAnimationFinished
                  ? {
                      p: 0,
                      width: 3,
                    }
                  : {}),
                overflow: 'auto',
                minHeight: isSmScreenOrSmaller ? 200 : 'calc(100vh - 110px)',
                maxHeight: 'calc(100vh - 110px)',
              }}
            >
              <Collapse
                in={showNavigationPanel}
                orientation="horizontal"
                onEntered={() => setCollapseEnterAnimationFinished(true)}
                onExited={() => setCollapseExitAnimationFinished(true)}
                sx={{ '& .MuiCollapse-wrapperInner': { width: '100%' } }}
              >
                <TreeView
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  sx={{
                    '& .MuiTreeItem-content': { borderRadius: 5 },
                  }}
                  expanded={expanded}
                  selected={[selected.nodeId]}
                  onNodeToggle={handleToggle}
                  onNodeSelect={handleSelect}
                >
                  {renderTree(navigationTree)}
                </TreeView>
              </Collapse>
            </Paper>
          </Box>
        </Grid>
        <Grid
          item
          {...(showNavigationPanel
            ? {
                xs: 12,
                sm: 12,
                md: true,
              }
            : {})}
          zeroMinWidth
          flex={1}
        >
          <Paper
            sx={{
              minHeight: isSmScreenOrSmaller ? 200 : 'calc(100vh - 110px)',
              my: 0,
            }}
          >
            {selected?.data?.testId && (
              <TestDetailsView
                instanceId={instance.instanceId}
                testId={selected.data.testId}
              />
            )}
            {selected?.data.videoUrl && <Player src={selected.data.videoUrl} />}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

function getTreeOfNavigationItems(instance: GetInstanceQuery['instance']) {
  const nodeIds: string[] = [];
  const tests = instance?.results?.tests;
  const navigationTree = new Map<string, NavigationItem>();
  let firstItem: any = null;

  // if instance has video add it as the first item of the navigation tree
  if (instance?.results?.videoUrl) {
    navigationTree.set('RECORDED_VIDEO', {
      id: 'RECORDED_VIDEO',
      isVideo: true,
      videoUrl: instance.results.videoUrl,
    });
    nodeIds.push('RECORDED_VIDEO');
    firstItem = navigationTree.has('RECORDED_VIDEO')
      ? { nodeId: 'RECORDED_VIDEO', data: navigationTree.get('RECORDED_VIDEO') }
      : null;
  }

  // if instance has no tests return the navigation tree
  if (!tests?.length) {
    return {
      navigationTree,
      nodeIds: nodeIds,
      testsMap: {},
      firstItem,
    };
  }

  // Add tests as navigation items to the navigation tree
  const testsMap: { [key: string]: any } = {};
  tests.forEach((test, testIndex) => {
    let currentMap = navigationTree;
    test.title.forEach((title, titleIndex) => {
      const isFolder = titleIndex < test.title.length - 1;
      const children = currentMap.get(title)?.children;
      if (children) {
        currentMap = children;
      } else {
        if (isFolder) {
          const nodeId = `FOLDER${testIndex}${titleIndex}`;
          nodeIds.push(nodeId);
          const children = new Map<string, NavigationItem>();
          currentMap.set(title, {
            id: nodeId,
            isFolder,
            children,
          });
          currentMap = children;
        } /* if is test: */ else {
          const nodeId = test.testId || `TEST${testIndex}${titleIndex}`;
          nodeIds.push(nodeId);
          currentMap.set(title, {
            id: nodeId,
            isFolder,
            test,
          });
          testsMap[nodeId] = test;
          firstItem = firstItem ?? { nodeId, data: test };
        }
      }
    });
  });

  return { navigationTree, nodeIds, testsMap, firstItem };
}

type NavigationItem = {
  id: string;
  isFolder?: boolean;
  isVideo?: boolean;
  videoUrl?: string;
  test?: GetInstanceTestFragment;
  children?: Map<string, NavigationItem>;
};

type InstanceDetailsProps = {
  instance: GetInstanceQuery['instance'];
  selectedItem?: string;
};
type InstanceDetailsComponent = FunctionComponent<InstanceDetailsProps>;
