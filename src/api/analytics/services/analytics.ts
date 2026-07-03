/**
 * analytics service
 */

export default {
  getArtifacts: async () => {
    try {
      // Fetching data
      const entries: {
        id? : Number;
        name? : String;
        description? : String;
        // latitude? : Number;
        // longitude? : Number;
        location?: String;
      }[] = await strapi.entityService.findMany(
          "api::artifact.artifact",
          {
              fields: ["id", "name", "description", "location", /*"latitude", "longitude" , "createdAt" */],
              // populate: {
              //     Author: {
              //         fields: ["username", "email"],
              //     },
              //     Category: {
              //         fields: ["name"],
              //     },
              // },
          }
      );

      // Reduce the data to the format we want to return
      let entriesReduced;

      if (entries && Array.isArray(entries)) {
          entriesReduced = entries.reduce((acc, item) => {
              acc = acc || [];
              acc.push({
                  id: item?.id,
                  name: item.name || "",
                  // description: item.description || "",
                  // latitude: item.latitude || "",
                  // longitude: item.longitude || "",
                  location: item.location || "",
                  // publishedDate: new Date(item.createdAt).toDateString() || "",
                  // authorName: item.Author?.username || "",
                  // authorEmail: item.Author?.email || "",
                  // content: item.Content || ""
              });
              return acc;
          }, []);
      }

      // Return the reduced data
      return entriesReduced;
    } catch (err) {
        return err;
    }
  }
}

// export default () => ({});
