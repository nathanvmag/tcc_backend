import { errors } from '@strapi/utils';

const { ApplicationError } = errors;

export default {
  async beforeCreate(event) {
    // extract required proerties
    const { data, where, select, populate } = event.params;

    // **Perform your necessary validation, customization, or actions here:**

    // **1. Validation:**
    // - Ensure all required fields are present and have valid values.
    // - Apply any custom validation rules, as needed.

    if (!data?.project) {
      throw new ApplicationError('Project field cannot be empty');
    } else if (data.project.disconnect && data.project.connect) {
      if (data.project.disconnect.length >= data.project.connect.length) {
        throw new ApplicationError('Project field cannot be empty');
      }
    }

    // **2. Data Customization:**
    // - Pre-populate default values for certain fields.
    // - Perform any data transformations required by your application.

    // **3. Actions:**
    // - Send welcome emails or notifications to the new user.
    // - Trigger other system events or integrations, as necessary.

    // console.log(JSON.stringify({
    //   data, where, select, populate
    // }));
  },

  async beforeUpdate(event) {
    // extract required proerties
    const { data, where, select, populate } = event.params;

    // **Perform your necessary validation, customization, or actions here:**

    // **1. Validation:**
    // - Ensure all required fields are present and have valid values.
    // - Apply any custom validation rules, as needed.

    if (!data?.project) {
      throw new ApplicationError('Project field cannot be empty');
    } else if (data.project.disconnect && data.project.connect) {
      if (data.project.disconnect.length > data.project.connect.length) {
        throw new ApplicationError('Project field cannot be empty');
      }
    }

    // **2. Data Customization:**
    // - Pre-populate default values for certain fields.
    // - Perform any data transformations required by your application.

    // **3. Actions:**
    // - Send welcome emails or notifications to the new user.
    // - Trigger other system events or integrations, as necessary.

    // console.log(JSON.stringify({
    //   data, where, select, populate
    // }));
  },
};