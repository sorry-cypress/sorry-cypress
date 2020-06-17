import React, { useState } from 'react';
import { Select } from 'bold-ui';
import { useGetBranchesQuery } from '../../generated/graphql';

interface BranchesFielProps {
  label: string;
  value: string;
  onChange: any;
}

export const BranchesField = ({
  label,
  value,
  onChange,
}: BranchesFielProps) => {
  const {
    loading,
    data: { branches = [] } = { branches: [] },
  } = useGetBranchesQuery();

  if (loading) return <p>Loading...</p>;

  return (
    <Select
      width="500px"
      error=""
      items={branches}
      label={label}
      value={value}
      name="branches"
      openOnFocus={true}
      onChange={onChange}
      placeholder="Select a value..."
    />
  );
};
