const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  if(request.body.likes) {
    delete request.body.likes;
  }

  const updatedRepository = request.body;

  const repository = repositories.find(repository => repository.id.toString() === id.toString());

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const newRepository = { ...repository, ...updatedRepository };

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id.toString() === id.toString());

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id.toString() === id.toString());

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repository.likes;

  return response.json(repository);
});

module.exports = app;
