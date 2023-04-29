const express = require('express');

const app = express();
app.use(express.json());
const teams = [
    {
      id: 1,
      name: 'São Paulo Futebol Clube',
      initials: 'SPF',
    },
    {
      id: 2,
      name: 'Clube Atlético Mineiro',
      initials: 'CAM',
    },
  ];

const validateID = (req, res, next) => {
  const { id } = req.params;
  const idAsNumber = Number(id);

  if (Number.isNaN(idAsNumber)) {
    res.status(400).send({ message: 'Formato de ID inválido! Precisa ser um número' });
  } else {
    next();
  }
};

const validateTeamsData = (req, res, next) => {
  const requiredProperties = ['name', 'initials'];

  if (requiredProperties.every((property) => property in req.body)) {
    next();
  } else {
    res.status(400).send({ message: 'O time precisa receber os atributos name e initials' });
  }
};

app.get('/teams', (_req, res) => res.status(200).json({ teams }));

app.post('/teams', (req, res) => {
    const newTeam = { ...req.body };
    teams.push(newTeam);
  
    res.status(201).json({ team: newTeam });
  });

app.put('/teams/:id', validateID, validateTeamsData, (req, res) => {
  const { id } = req.params;
  const { name, initials } = req.body;

  const updateTeam = teams.find((team) => team.id === Number(id));
  if (!updateTeam) {
    res.status(400).json({ message: 'Team not found' });
  }

  updateTeam.name = name;
  updateTeam.initials = initials;
  res.status(200).json({ updateTeam });
});

app.delete('/teams/:id', validateID, (req, res) => {
  const { id } = req.params;
  const arrayPosition = teams.findIndex((team) => team.id === Number(id));
  teams.splice(arrayPosition, 1);

  res.status(200).end();
});

module.exports = app;