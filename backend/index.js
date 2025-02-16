require("dotenv").config();
const express = require("express");
const Person = require("./models/Person");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3001;

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(`:method :url - :response-time ms :body`));
app.use(express.static("dist"));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((notes) => {
    response.json(notes);
  });
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
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "missing one or more fields" });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});
