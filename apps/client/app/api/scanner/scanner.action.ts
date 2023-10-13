'use server';

export const ScanProject = async () => {
  await fetch('http://localhost:4001/api/main', {
    method: 'GET',
  });
};
