import type { Schema, Attribute } from '@strapi/strapi';

export interface ContentSeason extends Schema.Component {
  collectionName: 'components_content_seasons';
  info: {
    displayName: 'Roteiro';
    icon: 'apps';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    startDate: Attribute.Date & Attribute.Required;
    endDate: Attribute.Date & Attribute.Required;
    collections: Attribute.Component<'content.collection', true>;
  };
}

export interface ContentCollection extends Schema.Component {
  collectionName: 'components_content_collections';
  info: {
    displayName: 'Cole\u00E7\u00E3o';
    icon: 'apps';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    artifacts: Attribute.Relation<
      'content.collection',
      'oneToMany',
      'api::artifact.artifact'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'content.season': ContentSeason;
      'content.collection': ContentCollection;
    }
  }
}
