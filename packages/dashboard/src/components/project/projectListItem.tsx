// import { updateCacheOnDeleteProject } from '@src/lib/run';
import {
  Button,
  Heading,
  HFlow,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  Text,
  useCss,
} from 'bold-ui';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project, useDeleteProjectMutation } from '../../generated/graphql';
import { Paper } from '../common';

type ProjectListItemProps = {
  project: Project;
  reloadProjects: () => void;
};

export function ProjectListItem({
  project,
  reloadProjects,
}: ProjectListItemProps) {
  const { css } = useCss();
  const [startDeleteProjectMutation] = useDeleteProjectMutation({
    variables: {
      projectId: project.projectId,
    },
    // update: updateCacheOnDeleteProject,
  });
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [shouldShowModal, setShowModal] = useState(false);

  function deleteProject() {
    setDeleting(true);
    startDeleteProjectMutation()
      .then((result) => {
        if (result.errors) {
          setDeleteError(result.errors[0].message);
          setDeleting(false);
        } else {
          setDeleting(false);
          setShowModal(false);
        }
        reloadProjects();
      })
      .catch((error) => {
        setDeleting(false);
        setDeleteError(error.toString());
      });
  }

  return (
    <>
      <Modal
        size="small"
        onClose={() => setShowModal(false)}
        open={shouldShowModal}
      >
        <ModalBody>
          <HFlow alignItems="center">
            <Icon
              icon="exclamationTriangleFilled"
              style={{ marginRight: '0.5rem' }}
              size={3}
              fill="danger"
            />
            <div>
              <Heading level={1}>Delete project {project.projectId}?</Heading>
              <Heading level={5}>
                Deleting project will permanently delete the associated data
                (project, run, instances, test results). Running tests
                associated with the project will fail.
              </Heading>
              {deleteError && <p>Delete error: {deleteError}</p>}
            </div>
          </HFlow>
        </ModalBody>
        <ModalFooter>
          <HFlow justifyContent="flex-end">
            <Button
              kind="normal"
              skin="ghost"
              onClick={() => setShowModal(false)}
            >
              <Text color="inherit">Cancel</Text>
            </Button>
            <Button
              kind="danger"
              skin="ghost"
              onClick={deleteProject}
              disabled={deleting}
            >
              <Icon icon="trashOutline" style={{ marginRight: '0.5rem' }} />
              <Text color="inherit">{deleting ? 'Deleting' : 'Delete'}</Text>
            </Button>
          </HFlow>
        </ModalFooter>
      </Modal>
      <Paper>
        <HFlow justifyContent="space-between">
          <Heading level={1}>
            <Link
              className={css`
                vertical-align: middle;
              `}
              to={`/${project.projectId}/runs`}
            >
              {project.projectId}
            </Link>
            <Button
              component="a"
              href={`/${project.projectId}/edit`}
              kind="normal"
              size="small"
              skin="ghost"
              style={{
                verticalAlign: 'middle',
                marginLeft: '10px',
              }}
            >
              <Icon icon="penFilled" />
            </Button>
          </Heading>
          <Button kind="danger" skin="ghost" onClick={() => setShowModal(true)}>
            <Icon icon="trashOutline" style={{ marginRight: '0.5rem' }} />
            <Text color="inherit">Delete</Text>
          </Button>
        </HFlow>
      </Paper>
    </>
  );
}
