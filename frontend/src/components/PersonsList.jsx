const PersonsList = ({ filteredPersons, handleDelete }) => {
  return (
    <>
      <h2>Numbers</h2>
      {filteredPersons.map((person) => (
        <p className="person-list-item" key={person.name}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </p>
      ))}
    </>
  );
};

export default PersonsList;
