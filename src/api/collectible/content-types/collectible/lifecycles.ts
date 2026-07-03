module.exports = {
  async afterCreate(event) {
    console.log("Lifecycle disparado: afterCreate de collectible");

    const { result } = event;

    if (!result?.id) {
      console.log("Nenhum result.id retornado no event.");
      return;
    }

    // Buscar o collectible completo, populando artifact e user
    const collectible = await strapi.entityService.findOne(
      'api::collectible.collectible',
      result.id,
      {
        populate: ['artifact', 'user'],
      }
    );

    if (!collectible) {
      console.log("Collectible não encontrado após criação.");
      return;
    }

    console.log("Collectible encontrado e populado:", collectible);

    if (!collectible.artifact) {
      console.log("Nenhum artifact vinculado ao collectible.");
      return;
    }

    if (!collectible.user) {
      console.log("Nenhum user vinculado ao collectible.");
      return;
    }

    console.log(`Buscando artifact id=${collectible.artifact.id}`);
    const artifact = await strapi.db.query('api::artifact.artifact').findOne({
      where: { id: collectible.artifact.id },
      select: ['points', 'name'],
    });

    if (!artifact) {
      console.log("Artifact não encontrado no banco.");
      return;
    }

    console.log(`Artifact encontrado: ${artifact.name || 'sem nome'}, pontos: ${artifact.points}`);

    if (!artifact.points) {
      console.log("Artifact não tem pontos definidos.");
      return;
    }

    console.log(`Buscando usuário id=${collectible.user.id}`);
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: collectible.user.id },
      populate:{project:true},
      
    });
    console.log(user);

    if (!user) {
      console.log("Usuário não encontrado no banco.");
      return;
    }

    console.log(`Usuário encontrado: ${user.username || user.email}, pontos atuais: ${user.points}`);

    const newPoints = (user.points || 0) + artifact.points;
    console.log(`Novo total de pontos: ${user.points || 0} + ${artifact.points} = ${newPoints}`);

    console.log("Atualizando pontos do usuário...");
    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: collectible.user.id },
      data: { points: newPoints,project:user.project.id },
    });

    console.log("Pontos atualizados com sucesso!");
  },
};
