import { useState, useEffect } from "react";
import personServices from "./services/personServices";
import PersonsList from "./components/PersonsList";
import AddPerson from "./components/AddPerson";
import FilterBar from "./components/FilterBar";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [notification, setNotification] = useState({
    message: null,
    color: "green",
  });

  useEffect(() => {
    personServices.getAll().then((response) => {
      const persons = response;
      setPersons(persons);
      setFilteredPersons(persons);
    });
  }, []);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };
  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    if (filter !== "") {
      const filteredItems = persons.filter((person) =>
        person.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredPersons(filteredItems);
    }
  };
  const containsUsedName = (persons) =>
    persons.find((person) => {
      return person.name === newName;
    });
  const containsUsedNumber = (persons) =>
    persons.find((person) => {
      return person.number === newNumber;
    });

  const updateList = (value) => {
    setPersons(value);
    setFilteredPersons(value);
  };

  const clearFields = () => {
    setFilter("");
    setNewName("");
    setNewNumber("");
  };

  const addPerson = () => {
    const personObject = {
      name: newName,
      number: newNumber,
    };
    if (containsUsedName(persons)) {
      const existingPerson = persons.find((person) => person.name === newName);
      if (newNumber !== existingPerson.number) {
        if (
          confirm(
            `${personObject.name} is already added to the phonebook, replace the old number for the new one?`
          )
        ) {
          const changedPerson = {
            ...existingPerson,
            number: personObject.number,
          };
          personServices
            .update(existingPerson.id, changedPerson)
            .then((returnedPerson) => {
              setPersons(
                persons.map((person) =>
                  person.id === existingPerson.id ? returnedPerson : person
                )
              );
              setFilteredPersons(
                persons.map((person) =>
                  person.id === existingPerson.id ? returnedPerson : person
                )
              );
            })
            .catch((error) => {
              setNotification({
                message: `information of ${personObject.name} has already bem removed from the server`,
                color: "red",
              });
              setTimeout(() => {
                setNotification({ ...notification, message: null });
              }, 5000);
            });
        }
      } else {
        alert(`${personObject.name} already in use`);
        setFilteredPersons(persons);
        clearFields();
      }
    } else if (containsUsedNumber(persons)) {
      alert(`${personObject.number} already in use`);
      setFilteredPersons(persons);
      clearFields();
    } else {
      personServices.create(personObject).then((response) => {
        updateList(persons.concat(response));
        setNotification({
          message: `Added ${personObject.name}`,
          color: "green",
        });
        setTimeout(() => {
          setNotification({ ...notification, message: null });
        }, 5000);
      });
      clearFields();
    }
  };

  const handleAddPerson = (e) => {
    e.preventDefault();
    addPerson();
  };
  const deletePerson = (id) => {
    const deletedPerson = persons.find((person) => person.id === id);
    if (deletedPerson) {
      personServices.deletePerson(id).then(() => {
        const newList = persons.filter((person) => person.id !== id);
        setFilteredPersons(newList);
        setPersons(persons.splice(newList));
      });
    }
  };
  const handleDeletePerson = (id) => {
    if (confirm("Do you want to delete it?")) {
      deletePerson(id);
    }
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} color={notification.color} />
      <FilterBar filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new Person</h2>
      <AddPerson
        handleAddPerson={handleAddPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <PersonsList
        filteredPersons={filteredPersons}
        handleDelete={handleDeletePerson}
      />
    </div>
  );
};

export default App;
