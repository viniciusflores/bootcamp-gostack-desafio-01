const express = require("express");

const server = express();

server.use(express.json());

let projectList = [];
let reqNumbers = 0;

server.use((req, res, next) => {
  console.log(`A requisição foi chamada ${reqNumbers} vez(es)`);
  reqNumbers++;
  return next();
});

function projectExists(req, res, next) {
  projectList.map(pj => {
    if (pj.id == req.params.id) {
      return next();
    }
  });

  return res.status(400).json({ error: "Project not found" });
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projectList.push({ id: id, title: title });
  return res.json({
    message: `foi adicionado ao array pj ${id} nome ${title}`
  });
});

server.get("/projects", (req, res) => {
  return res.json(projectList);
});

server.put("/projects/:id", projectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projectList.map(pj => {
    if (pj.id == id) {
      pj.title = title;
      return res.json({
        message: `Projeto ${id} teve o titulo atualizado para ${title}`
      });
    }
  });
  return res.status(404).send("not found");
});

server.delete("/projects/:id", projectExists, (req, res) => {
  const { id } = req.params;
  console.log(id);
  projectList.map(pj => {
    if (pj.id == id) {
      console.log("entrou");
      projectList = projectList.filter(pj => !(pj.id == id));
      console.log(projectList);
      return res.json({ message: `Foi excluido o projeto id ${id}` });
    }
  });
  return res.status(404).send("not found");
});

server.post("/projects/:id/tasks", projectExists, (req, res) => {
  const { id } = req.params;
  const tasks = req.body.tasks;

  projectList.map(pj => {
    if (pj.id == id) {
      if (!pj.tasks) {
        pj.tasks = tasks;
      } else {
        pj.tasks = pj.tasks.concat(tasks);
      }
      return res.json({
        message: `Foram adicionadas as tarefas ${tasks} ao projeto ${pj.title}`
      });
    }
  });

  return res.status(404).send("not found");
});

server.listen(3333);
