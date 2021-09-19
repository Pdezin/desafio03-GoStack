import React, { useEffect, useState } from "react";
import api from "./services/api";
import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [techs, setTechs] = useState("");

  useEffect(() => {
    api.get("repositories").then((response) => setRepositories(response.data));
  }, []);

  async function handleAddRepository(event) {
    event.preventDefault();
    let listTechs = techs.split(" ");
    let data = {
      title,
      url,
      techs: listTechs,
    };
    await api
      .post("repositories", data)
      .then((response) => setRepositories((prev) => [...prev, response.data]));
    setTechs("");
    setTitle("");
    setUrl("");
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);
    const updatedRepositories = repositories.filter(
      (repository) => repository.id !== id
    );
    setRepositories(updatedRepositories);
  }

  async function handleAddLike(id) {
    const response = await api.post(`repositories/${id}/like`);
    const likeRepository = response.data;
    setRepositories(
      repositories.map((repository) => {
        return repository.id === id ? likeRepository : repository;
      })
    );
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map((repository) => (
          <li
            style={{ background: "#7159C1", color: "#fff", padding: 20 }}
            key={repository.id}
          >
            <p>{repository.title}</p>
            <ul className="repository-techs">
              {repository.techs.map((tech) => (
                <li className="tech" key={tech}>
                  {tech}
                </li>
              ))}
            </ul>
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
            <button
              style={{ background: "#58A6FF" }}
              title="Likes"
              onClick={() => handleAddLike(repository.id)}
            >
              <span role="img" aria-label="like">
                👍
              </span>{" "}
              {repository.likes}
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddRepository}>
        <label>
          Título
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            required
          />
        </label>
        <label>
          Url
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            required
          />
        </label>
        <label>
          Techs
          <textarea
            placeholder="Separe as techs por espaços"
            value={techs}
            onChange={({ target }) => setTechs(target.value)}
            required
          />
        </label>
        <button>Adicionar</button>
      </form>
    </div>
  );
}

export default App;
