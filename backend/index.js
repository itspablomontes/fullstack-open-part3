const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(`:method :url - :response-time ms :body`));
app.use(express.static("dist"));
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const isNameExistant = (name) => {
  const answer = persons.find((person) => person.name === name);
  if (answer === undefined) {
    return false;
  }
  return true;
};

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>The phonebook has info for ${
      persons.length
    } people</p> <p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const returnedPerson = persons.find((person) => person.id === id);
  if (!returnedPerson) {
    return response.status(404).end();
  }
  response.json(returnedPerson);
});

app.post("/api/persons", (request, response) => {
  if (!request.body.name || !request.body.number) {
    response.status(400).json({ error: "missing one or more fields" });
  }
  const newPerson = request.body;
  if (isNameExistant(newPerson.name)) {
    response.status(400).json({ error: "name must be unique" });
  } else {
    newPerson.id = Math.floor(Math.random() * 1000);
    persons = persons.concat(newPerson);
    response.json(newPerson);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const deletedPerson = persons.find((person) => person.id === id);
  if (!deletedPerson) {
    return response.status(404).end();
  }
  persons = persons.filter((person) => person !== deletedPerson);
  response.json(deletedPerson);
});
