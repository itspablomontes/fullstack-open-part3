const express = require("express");
const app = express();
app.use(express.json());

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

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const deletedPerson = persons.find((person) => person.id === id);
  if (!deletedPerson) {
    return response.status(404).end();
  }
  persons = persons.filter((person) => person !== deletedPerson);
  response.json(deletedPerson);
});
