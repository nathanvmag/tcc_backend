export function checkField(data, fieldName) {
  const field = data[fieldName]

  return { [fieldName]: field.connect.length > 0 && { id: field.connect[0].id}  }
}

export function checkContentData(data, fieldsArray) {
  const checkedData = fieldsArray.reduce((result, field) => {
    result[field] = checkField(data, field)[field];
    return result;
  }, {});

  return {
    ...data,
    ...checkedData
  }
}
