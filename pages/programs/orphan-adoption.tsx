import type { GetServerSideProps, NextPage } from 'next';

/**
 * Preserve the former public URL while directing visitors to the verified
 * Orphan Support information on the main programmes page.
 */
const LegacyOrphanAdoptionRoute: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/programs#orphanage-support',
    permanent: true,
  },
});

export default LegacyOrphanAdoptionRoute;
