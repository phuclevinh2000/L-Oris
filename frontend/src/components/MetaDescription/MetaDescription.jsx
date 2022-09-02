import React from 'react';
import { Helmet } from 'react-helmet';

const MetaDescription = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  );
};

MetaDescription.defaultProps = {
  title: 'L Oris',
  keywords: 'L Oris',
  description: 'L Oris',
};

export default MetaDescription;
