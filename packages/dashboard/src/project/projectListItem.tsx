import { ArrayItemType } from '@sorry-cypress/common/ts';
import {
  FlexRow,
  HeaderLink,
  Paper,
} from '@sorry-cypress/dashboard/components/';
import {
  GetProjectsQuery,
  useDeleteProjectMutation,
} from '@sorry-cypress/dashboard/generated/graphql';
import {
  Button,
  Heading,
  HFlow,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  Text,
} from 'bold-ui';
import React, { useState } from 'react';

type ProjectListItemProps = {
  project: ArrayItemType<GetProjectsQuery['projects']>;
  reloadProjects: () => void;
};

export function ProjectListItem({
  project,
  reloadProjects,
}: ProjectListItemProps) {
  const [startDeleteProjectMutation] = useDeleteProjectMutation({
    variables: {
      projectId: project.projectId,
    },
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
        <FlexRow>
          <HeaderLink to={`/${project.projectId}/runs`}>
            {decodeURIComponent(project.projectId)}
          </HeaderLink>
          <div>
            <Button
              kind="danger"
              skin="ghost"
              onClick={() => setShowModal(true)}
            >
              <Icon icon="trashOutline" style={{ marginRight: '0.5rem' }} />
              <Text color="inherit">Delete</Text>
            </Button>
            <Button
              component="a"
              // @ts-ignore
              href={`/${project.projectId}/edit`}
              skin="ghost"
            >
              <Icon icon="penFilled" style={{ marginRight: '0.5rem' }} />
              <Text color="inherit">Edit</Text>
            </Button>
          </div>
        </FlexRow>
      </Paper>
    </>
  );
}
